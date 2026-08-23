-- docs/migration/plan.md Phase 18 — constraint and RPC-behavior tests
-- that don't fit rls.sql's "who can see/write what" focus. Same approach:
-- everything happens inside one transaction that's always rolled back, so
-- this is safe to run ad hoc against any environment, including hosted.
begin;

create extension if not exists pgtap;

select plan(9);

-- ============================================================
-- Fixtures
-- ============================================================
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, raw_user_meta_data, created_at, updated_at) values
  ('00000000-0000-0000-0000-000000000000', 'e1000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'bl-test-resident@merge-migration-test.dev', crypt('x', gen_salt('bf')), '{"first_name":"Bl","last_name":"Resident","role":"resident"}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'e1000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'bl-test-tech@merge-migration-test.dev', crypt('x', gen_salt('bf')), '{"first_name":"Bl","last_name":"Tech","role":"technician"}'::jsonb, now(), now());

insert into public.apartments (id, name, address, city) values
  ('e2000000-0000-0000-0000-000000000001', 'BL Test Apartments', '1 Test St', 'Nairobi');
insert into public.buildings (id, name, apartment_id) values
  ('e3000000-0000-0000-0000-000000000001', 'Block A', 'e2000000-0000-0000-0000-000000000001');
insert into public.units (id, number, floor, rent_amount, building_id) values
  ('e4000000-0000-0000-0000-000000000001', 'A1', 1, 25000, 'e3000000-0000-0000-0000-000000000001');
insert into public.residents (id, user_id, apartment_id, unit_id) values
  ('e5000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'e2000000-0000-0000-0000-000000000001', 'e4000000-0000-0000-0000-000000000001');
insert into public.technicians (id, user_id, verification_status, experience_years) values
  ('e6000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000002', 'verified', 4);
insert into public.maintenance_requests (id, title, description, resident_id, unit_id, category_id, status) values
  ('e7000000-0000-0000-0000-000000000001', 'BL test request', 'test', 'e5000000-0000-0000-0000-000000000001', 'e4000000-0000-0000-0000-000000000001',
    (select id from public.categories where slug = 'plumbing'), 'open');
insert into public.bookings (id, request_id, technician_id, scheduled_at, status, total_amount) values
  ('e8000000-0000-0000-0000-000000000001', 'e7000000-0000-0000-0000-000000000001', 'e6000000-0000-0000-0000-000000000001', now(), 'accepted', 1000);

-- Not a manual insert: residents_create_wallet/technicians_create_wallet
-- (Phase 7) already auto-created one wallet each the instant the
-- residents/technicians rows above were inserted. A second manual insert
-- here would leave the technician with two wallets and make
-- settle_booking_revenue's `where technician_id = ...` lookup pick a
-- non-deterministic one — caught by this test actually failing with
-- insufficient_funds the first time it was written and run, not by
-- inspection. Look the auto-created ones up instead.
update public.wallets set balance = 1000 where technician_id = 'e6000000-0000-0000-0000-000000000001';

-- ============================================================
-- Constraint: reviews unique (booking_id, author_id)
-- ============================================================
insert into public.reviews (booking_id, author_id, target_technician_id, rating, quality_rating, speed_rating, professionalism_rating)
values ('e8000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'e6000000-0000-0000-0000-000000000001', 5, 5, 5, 5);

select throws_ok(
  $$ insert into public.reviews (booking_id, author_id, target_technician_id, rating, quality_rating, speed_rating, professionalism_rating)
     values ('e8000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'e6000000-0000-0000-0000-000000000001', 3, 3, 3, 3) $$,
  '23505',
  null,
  'reviews: unique (booking_id, author_id) rejects a second review from the same author on the same booking'
);

-- ============================================================
-- Constraint: wallets non-negative balance
-- ============================================================
select throws_ok(
  $$ update public.wallets set balance = -100 where resident_id = 'e5000000-0000-0000-0000-000000000001' $$,
  '23514',
  null,
  'wallets: the non-negative balance check constraint rejects a negative balance even from a privileged role (RLS has no UPDATE policy at all, but the constraint is the real backstop)'
);

-- ============================================================
-- Constraint: transactions unique reference
-- ============================================================
insert into public.transactions (reference, amount, type, status, sender_wallet_id, recipient_wallet_id, gateway)
values (
  'BL-TEST-DUPE-REF', 500, 'rent_payment', 'successful',
  (select id from public.wallets where resident_id = 'e5000000-0000-0000-0000-000000000001'),
  (select id from public.wallets where technician_id = 'e6000000-0000-0000-0000-000000000001'),
  'wallet'
);

select throws_ok(
  $$ insert into public.transactions (reference, amount, type, status, sender_wallet_id, recipient_wallet_id, gateway)
     values (
       'BL-TEST-DUPE-REF', 250, 'rent_payment', 'successful',
       (select id from public.wallets where resident_id = 'e5000000-0000-0000-0000-000000000001'),
       (select id from public.wallets where technician_id = 'e6000000-0000-0000-0000-000000000001'),
       'wallet'
     ) $$,
  '23505',
  null,
  'transactions: reference stays unique — a duplicate reference is rejected'
);

-- ============================================================
-- enforce_booking_status_transition: rejects an invalid jump
-- ============================================================
select throws_ok(
  $$ update public.bookings set status = 'completed' where id = 'e8000000-0000-0000-0000-000000000001' $$,
  'P0001',
  'invalid_status_transition',
  'bookings: enforce_booking_status_transition rejects accepted -> completed (must go through in_route, work_started first)'
);

-- ============================================================
-- transfer_wallet_funds: correct math, not just "doesn't throw"
-- ============================================================
select public.transfer_wallet_funds(
  (select id from public.wallets where technician_id = 'e6000000-0000-0000-0000-000000000001'),
  (select id from public.wallets where resident_id = 'e5000000-0000-0000-0000-000000000001'),
  100, 'commission_fee', 'wallet'
);

select is(
  (select balance from public.wallets where technician_id = 'e6000000-0000-0000-0000-000000000001'),
  900::numeric,
  'transfer_wallet_funds: sender wallet debited by exactly the transferred amount'
);
select is(
  (select balance from public.wallets where resident_id = 'e5000000-0000-0000-0000-000000000001'),
  100::numeric,
  'transfer_wallet_funds: recipient wallet credited by exactly the transferred amount'
);

-- ============================================================
-- settle_booking_revenue: idempotent against the wallet transfer, not
-- just the revenue_shares bookkeeping row (Phase 11/18 — the whole
-- reason for that hardening: a booking settling twice is a real
-- financial bug, not a cosmetic one).
-- ============================================================
update public.bookings set status = 'in_route' where id = 'e8000000-0000-0000-0000-000000000001';
update public.bookings set status = 'work_started' where id = 'e8000000-0000-0000-0000-000000000001';
update public.bookings set status = 'completed' where id = 'e8000000-0000-0000-0000-000000000001';

-- total_amount is 1000, commission 10% (seeded default) = 100. The
-- technician wallet started this block at 900 (after the manual transfer
-- above), so it can afford the settlement.
select public.settle_booking_revenue('e8000000-0000-0000-0000-000000000001');
select public.settle_booking_revenue('e8000000-0000-0000-0000-000000000001');
select public.settle_booking_revenue('e8000000-0000-0000-0000-000000000001');

select is(
  (select count(*)::int from public.transactions where type = 'commission_fee' and booking_id = 'e8000000-0000-0000-0000-000000000001'),
  1,
  'settle_booking_revenue: calling it 3 times produces exactly 1 commission_fee transaction, not 3'
);
select is(
  (select balance from public.wallets where technician_id = 'e6000000-0000-0000-0000-000000000001'),
  800::numeric,
  'settle_booking_revenue: technician wallet debited exactly once (900 - 100 = 800), confirming the idempotency guard, not just the transaction count'
);

-- ============================================================
-- Financial acceptance: "a failed transaction never flips to successful".
-- There's no code path that does this today — transactions has no
-- INSERT or UPDATE policy for any authenticated client at all (only
-- SELECT), and transfer_wallet_funds always inserts status='successful'
-- directly rather than inserting 'pending' and flipping it later. So the
-- honest, correct assertion is the structural one: no authenticated role
-- can change ANY transaction's status, full stop — which makes a
-- failed-to-successful flip impossible as a corollary, not something
-- that happens to not be exercised.
-- ============================================================
insert into public.transactions (reference, amount, type, status, sender_wallet_id, recipient_wallet_id, gateway)
values (
  'BL-TEST-FAILED-TX', 250, 'rent_payment', 'failed',
  (select id from public.wallets where resident_id = 'e5000000-0000-0000-0000-000000000001'),
  (select id from public.wallets where technician_id = 'e6000000-0000-0000-0000-000000000001'),
  'wallet'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'e1000000-0000-0000-0000-000000000001';
set local request.jwt.claim.role = 'authenticated';

update public.transactions set status = 'successful' where reference = 'BL-TEST-FAILED-TX';
reset role;
select is(
  (select status::text from public.transactions where reference = 'BL-TEST-FAILED-TX'),
  'failed',
  'transactions: a failed transaction cannot be flipped to successful by any authenticated client (no UPDATE policy at all — RLS silently filtered the row, status unchanged)'
);

select * from finish();
rollback;
