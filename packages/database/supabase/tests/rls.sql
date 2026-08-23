-- docs/migration/plan.md Phase 5 — RLS test suite.
--
-- Run locally via `supabase test db` once local dev works (see
-- docs/migration/progress.md Phase 2 for why it currently doesn't on this
-- machine). Also safe to run ad hoc against any environment — including
-- the hosted project — because everything happens inside one transaction
-- that's always rolled back at the end; no fixture or test data persists.
--
-- Approach: this is not a literal 6-role x 34-table x 4-operation grid
-- (many of those 816 cells are the vacuous fact "no policy exists for this
-- role/table/op, therefore denied", which RLS guarantees structurally and
-- isn't interesting to assert one cell at a time). Instead, every test
-- here targets the actual boundary a specific policy encodes: does the
-- intended role get access, and is the specific excluded case actually
-- excluded. That's the surface where RLS bugs really hide — see the
-- mr_select_involved fix in 20260823130000_fix_marketplace_visibility.sql,
-- found by writing this file, not by inspection.
begin;

create extension if not exists pgtap;

select plan(66);

-- ============================================================
-- Fixtures — created as the connection's own privileged role, which
-- bypasses RLS (not `authenticated`, so none of these inserts are
-- exercising policy yet).
-- ============================================================

insert into auth.users (instance_id, id, aud, role, email, encrypted_password, raw_user_meta_data, created_at, updated_at) values
  ('00000000-0000-0000-0000-000000000000', 'f1000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'rls-test-super@merge-migration-test.dev', crypt('x', gen_salt('bf')), '{"first_name":"Super","last_name":"Admin","role":"super_admin"}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'f1000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'rls-test-appadmin@merge-migration-test.dev', crypt('x', gen_salt('bf')), '{"first_name":"Apt","last_name":"Admin","role":"apartment_admin"}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'f1000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'rls-test-pm@merge-migration-test.dev', crypt('x', gen_salt('bf')), '{"first_name":"Prop","last_name":"Mgr","role":"property_manager"}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'f1000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'rls-test-landlord@merge-migration-test.dev', crypt('x', gen_salt('bf')), '{"first_name":"Land","last_name":"Lord","role":"landlord"}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'f1000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', 'rls-test-resident1@merge-migration-test.dev', crypt('x', gen_salt('bf')), '{"first_name":"Res","last_name":"OneIn","role":"resident"}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'f1000000-0000-0000-0000-000000000006', 'authenticated', 'authenticated', 'rls-test-resident2@merge-migration-test.dev', crypt('x', gen_salt('bf')), '{"first_name":"Res","last_name":"TwoOut","role":"resident"}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'f1000000-0000-0000-0000-000000000007', 'authenticated', 'authenticated', 'rls-test-tech1@merge-migration-test.dev', crypt('x', gen_salt('bf')), '{"first_name":"Tech","last_name":"OneVerified","role":"technician"}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'f1000000-0000-0000-0000-000000000008', 'authenticated', 'authenticated', 'rls-test-tech2@merge-migration-test.dev', crypt('x', gen_salt('bf')), '{"first_name":"Tech","last_name":"TwoUnrelated","role":"technician"}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'f1000000-0000-0000-0000-000000000009', 'authenticated', 'authenticated', 'rls-test-tech3@merge-migration-test.dev', crypt('x', gen_salt('bf')), '{"first_name":"Tech","last_name":"ThreeUnverified","role":"technician"}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'f1000000-0000-0000-0000-00000000000a', 'authenticated', 'authenticated', 'rls-test-landlord2@merge-migration-test.dev', crypt('x', gen_salt('bf')), '{"first_name":"Land","last_name":"LordTwoUnrelated","role":"landlord"}'::jsonb, now(), now());

insert into public.apartments (id, name, address, city) values
  ('f2000000-0000-0000-0000-000000000001', 'RLS Test Apartments 1', '1 Test St', 'Nairobi'),
  ('f2000000-0000-0000-0000-000000000002', 'RLS Test Apartments 2 (unrelated)', '2 Test St', 'Nairobi');

insert into public.buildings (id, name, apartment_id) values
  ('f3000000-0000-0000-0000-000000000001', 'Block A', 'f2000000-0000-0000-0000-000000000001');

insert into public.units (id, number, floor, rent_amount, building_id) values
  ('f4000000-0000-0000-0000-000000000001', 'A1', 1, 25000, 'f3000000-0000-0000-0000-000000000001');

insert into public.residents (id, user_id, apartment_id, unit_id) values
  ('f5000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000005', 'f2000000-0000-0000-0000-000000000001', 'f4000000-0000-0000-0000-000000000001'),
  ('f5000000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-000000000006', 'f2000000-0000-0000-0000-000000000002', null);

insert into public.property_managers (id, user_id) values
  ('f6000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000003');
insert into public.property_manager_apartments (manager_id, apartment_id) values
  ('f6000000-0000-0000-0000-000000000001', 'f2000000-0000-0000-0000-000000000001');

insert into public.landlords (id, user_id) values
  ('f7000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000004'),
  ('f7000000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-00000000000a');
insert into public.landlord_apartments (landlord_id, apartment_id) values
  ('f7000000-0000-0000-0000-000000000001', 'f2000000-0000-0000-0000-000000000001');

insert into public.technicians (id, user_id, verification_status, experience_years) values
  ('f8000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000007', 'verified', 3),
  ('f8000000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-000000000008', 'verified', 5),
  ('f8000000-0000-0000-0000-000000000003', 'f1000000-0000-0000-0000-000000000009', 'pending_verification', 1);

insert into public.maintenance_requests (id, title, description, resident_id, unit_id, category_id, status) values
  ('f9000000-0000-0000-0000-000000000001', 'Leaky faucet', 'Kitchen faucet leaking', 'f5000000-0000-0000-0000-000000000001', 'f4000000-0000-0000-0000-000000000001',
    (select id from public.categories where slug = 'plumbing'), 'open'),
  -- A second, deliberately un-booked open request. Request 1 above gets a
  -- booking a few lines down, and Phase 8's mark_request_assigned trigger
  -- flips a request to 'assigned' the instant a booking is inserted for
  -- it — even during fixture setup, which bypasses RLS but not triggers.
  -- The open-marketplace visibility test needs a request that's still
  -- genuinely 'open' when it runs, so it gets its own.
  ('f9000000-0000-0000-0000-000000000002', 'Squeaky door', 'Front door hinge squeaking', 'f5000000-0000-0000-0000-000000000001', 'f4000000-0000-0000-0000-000000000001',
    (select id from public.categories where slug = 'general-maintenance'), 'open');

-- total_amount = 0: matches every booking the real app creates today (no
-- invoicing exists yet, Phase 8/11) and keeps this fixture's eventual
-- 'completed' transition (see the reviews section below) from routing
-- through Phase 11's bookings_settle_on_completion trigger with a nonzero
-- fee — the technician fixture wallet below is deliberately unfunded,
-- same as production, so a nonzero amount would raise insufficient_funds.
insert into public.bookings (id, request_id, technician_id, scheduled_at, status, total_amount) values
  ('fa000000-0000-0000-0000-000000000001', 'f9000000-0000-0000-0000-000000000001', 'f8000000-0000-0000-0000-000000000001', now(), 'proposed', 0);

insert into public.wallets (id, wallet_type, resident_id) values
  ('fb000000-0000-0000-0000-000000000001', 'resident', 'f5000000-0000-0000-0000-000000000001');
insert into public.wallets (id, wallet_type, technician_id) values
  ('fb000000-0000-0000-0000-000000000002', 'technician', 'f8000000-0000-0000-0000-000000000001');
insert into public.wallets (id, wallet_type) values
  ('fb000000-0000-0000-0000-000000000003', 'platform_commission');

insert into public.vacancies (id, title, description, rent_amount, deposit_amount, bedrooms, bathrooms, status, landlord_id) values
  ('fc000000-0000-0000-0000-000000000001', 'Published unit', 'A nice place', 20000, 20000, 2, 1, 'published', 'f1000000-0000-0000-0000-000000000004'),
  ('fc000000-0000-0000-0000-000000000002', 'Draft unit', 'Not ready yet', 20000, 20000, 2, 1, 'draft', 'f1000000-0000-0000-0000-000000000004');

insert into public.vacancy_applications (id, vacancy_id, applicant_id, monthly_income) values
  ('fd000000-0000-0000-0000-000000000001', 'fc000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000006', 50000);

insert into public.chats (id, booking_id) values ('fe000000-0000-0000-0000-000000000001', 'fa000000-0000-0000-0000-000000000001');
insert into public.chat_participants (chat_id, user_id) values
  ('fe000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000005'),
  ('fe000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000007');

insert into public.notices (id, apartment_id, author_id, title, content, published_at) values
  ('ff000000-0000-0000-0000-000000000001', 'f2000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000003', 'Water shutoff', 'Water off 10am-2pm Friday', now());

-- ============================================================
-- profiles
-- ============================================================
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000005';
set local request.jwt.claim.role = 'authenticated';

-- profiles_select_authenticated_directory (Phase 8) deliberately made
-- every profile readable to any authenticated user — added after this
-- test was first written, to fix a real bug where RLS silently broke
-- every cross-user name join (a resident viewing their technician's
-- name, a reviewer's name, etc. — see progress.md Phase 8). "Own profile
-- only" is no longer this policy's actual boundary; asserting the full
-- fixture count keeps this test meaningful without re-asserting a
-- narrower guarantee the app doesn't make and would break on a real run.
select is(
  (select count(*)::int from public.profiles),
  10,
  'profiles: the directory-read policy makes every profile visible to any authenticated user (documented Phase 8 broadening, not a bug — see progress.md)'
);

select throws_ok(
  $$ update public.profiles set role = 'super_admin' where id = 'f1000000-0000-0000-0000-000000000005' $$,
  '42501',
  null,
  'profiles: resident cannot self-escalate to super_admin (mandatory regression test)'
);

select ok(
  (select first_name from public.profiles where id = 'f1000000-0000-0000-0000-000000000005') is not null,
  'profiles: resident can still read their own row after the failed escalation attempt'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000001';
set local request.jwt.claim.role = 'authenticated';

select ok(
  (select count(*)::int from public.profiles) >= 9,
  'profiles: super_admin sees all profiles'
);

-- ============================================================
-- apartments / buildings / units
-- ============================================================
reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000005';
set local request.jwt.claim.role = 'authenticated';

select ok(
  (select count(*)::int from public.apartments) = 2,
  'apartments: any authenticated user can read the directory (documented, broad-by-design — see progress.md open finding)'
);

-- USING-clause blocks are silent (0 rows affected), not exceptions — only
-- WITH CHECK failures raise. Postgres also won't allow a data-modifying
-- CTE nested inside an expression (`with x as (update ...) select count(*)
-- from x` as a scalar argument), so verify via attempt-then-read-back
-- instead of trying to capture an affected-row-count inline. Both real
-- methodology bugs this test suite itself had until Phase 5's live run
-- caught them.
update public.apartments set name = 'hacked-by-resident' where id = 'f2000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select name from public.apartments where id = 'f2000000-0000-0000-0000-000000000001'),
  'RLS Test Apartments 1',
  'apartments: resident (non-manager) cannot write an apartment they do not manage (RLS silently filtered the row, no exception, name unchanged)'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000003';
set local request.jwt.claim.role = 'authenticated';

select lives_ok(
  $$ update public.apartments set name = 'RLS Test Apartments 1 (renamed)' where id = 'f2000000-0000-0000-0000-000000000001' $$,
  'apartments: property_manager CAN write the apartment they manage'
);

update public.apartments set name = 'hacked-by-pm' where id = 'f2000000-0000-0000-0000-000000000002';
reset role;
select is(
  (select name from public.apartments where id = 'f2000000-0000-0000-0000-000000000002'),
  'RLS Test Apartments 2 (unrelated)',
  'apartments: property_manager cannot write an apartment they do NOT manage (RLS silently filtered the row, no exception, name unchanged)'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000003';
set local request.jwt.claim.role = 'authenticated';

select throws_ok(
  $$ insert into public.apartments (name, address, city) values ('new', 'x', 'y') $$,
  '42501',
  null,
  'apartments: property_manager cannot create brand-new apartments (super_admin only)'
);

select ok(
  (select count(*)::int from public.units where building_id = 'f3000000-0000-0000-0000-000000000001') = 1,
  'units: property_manager can read units in their managed building'
);

-- ============================================================
-- residents
-- ============================================================
reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000006';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.residents where id = 'f5000000-0000-0000-0000-000000000001'),
  0,
  'residents: an outsider resident cannot see another apartment''s resident row'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000005';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.residents where id = 'f5000000-0000-0000-0000-000000000001'),
  1,
  'residents: a resident can see their own resident row'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000003';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.residents where id = 'f5000000-0000-0000-0000-000000000001'),
  1,
  'residents: the managing property_manager can see the resident row'
);

-- ============================================================
-- landlords / landlord_apartments / property_managers / property_manager_apartments
-- ============================================================
reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000005';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.landlords where id = 'f7000000-0000-0000-0000-000000000001'),
  0,
  'landlords: an unrelated resident cannot read a landlord row'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000004';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.landlords where id = 'f7000000-0000-0000-0000-000000000001'),
  1,
  'landlords: a landlord can read their own landlord row'
);

-- ============================================================
-- categories / technicians / technician_categories
-- ============================================================
reset role;
set local role anon;

select ok(
  (select count(*)::int from public.categories) >= 10,
  'categories: even an unauthenticated (anon) request can read the public catalog'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000005';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.technicians where id = 'f8000000-0000-0000-0000-000000000001'),
  1,
  'technicians: a verified technician is publicly visible to any authenticated user'
);

select is(
  (select count(*)::int from public.technicians where id = 'f8000000-0000-0000-0000-000000000003'),
  0,
  'technicians: an UNverified technician is NOT visible to an unrelated resident'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000009';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.technicians where id = 'f8000000-0000-0000-0000-000000000003'),
  1,
  'technicians: an unverified technician can still see their own row'
);

select throws_ok(
  $$ update public.technicians set verification_status = 'verified' where id = 'f8000000-0000-0000-0000-000000000003' $$,
  '42501',
  null,
  'technicians: a technician cannot self-verify (mandatory regression test)'
);

select lives_ok(
  $$ update public.technicians set bio = 'Updated bio' where id = 'f8000000-0000-0000-0000-000000000003' $$,
  'technicians: a technician CAN update their own bio (non-verification fields)'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000001';
set local request.jwt.claim.role = 'authenticated';

select lives_ok(
  $$ update public.technicians set verification_status = 'verified' where id = 'f8000000-0000-0000-0000-000000000003' $$,
  'technicians: super_admin CAN verify a technician'
);

-- ============================================================
-- maintenance_requests — includes the marketplace-visibility fix
-- ============================================================
reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000006';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.maintenance_requests where id = 'f9000000-0000-0000-0000-000000000001'),
  0,
  'maintenance_requests: an unrelated RESIDENT cannot see another apartment''s open request (regression for the marketplace-visibility bug fixed in this phase)'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000008';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.maintenance_requests where id = 'f9000000-0000-0000-0000-000000000002'),
  1,
  'maintenance_requests: a verified but UNINVOLVED technician CAN see a genuinely open request via the open marketplace (correct behavior, not the bug)'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000005';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.maintenance_requests where id = 'f9000000-0000-0000-0000-000000000001'),
  1,
  'maintenance_requests: the owning resident can see their own request'
);

select throws_ok(
  $$ insert into public.maintenance_requests (title, description, resident_id, unit_id, category_id)
     values ('x', 'y', 'f5000000-0000-0000-0000-000000000002', 'f4000000-0000-0000-0000-000000000001', (select id from public.categories where slug = 'plumbing')) $$,
  '42501',
  null,
  'maintenance_requests: a resident cannot file a request under a DIFFERENT resident''s id'
);

-- ============================================================
-- bookings
-- ============================================================
reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000008';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.bookings where id = 'fa000000-0000-0000-0000-000000000001'),
  0,
  'bookings: an uninvolved technician cannot see a booking that isn''t theirs'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000007';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.bookings where id = 'fa000000-0000-0000-0000-000000000001'),
  1,
  'bookings: the assigned technician can see their own booking'
);

select lives_ok(
  $$ update public.bookings set status = 'accepted' where id = 'fa000000-0000-0000-0000-000000000001' $$,
  'bookings: the assigned technician can update their own booking''s status'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000008';
set local request.jwt.claim.role = 'authenticated';

-- At this point bk1's status is already legitimately 'accepted' (the
-- previous lives_ok test set it), not the fixture's original 'proposed'
-- — verifying it's still 'accepted' confirms nothing changed since then.
update public.bookings set status = 'cancelled' where id = 'fa000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select status::text from public.bookings where id = 'fa000000-0000-0000-0000-000000000001'),
  'accepted',
  'bookings: a different technician cannot update someone else''s booking (RLS silently filtered the row, no exception, status unchanged)'
);

-- ============================================================
-- wallets / transactions — the audit's single most important RLS gap
-- ============================================================
reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000006';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.wallets where id = 'fb000000-0000-0000-0000-000000000001'),
  0,
  'wallets: an unrelated resident cannot read another resident''s wallet (mandatory regression test)'
);

update public.wallets set balance = 999999 where id = 'fb000000-0000-0000-0000-000000000001';
reset role;
select is(
  (select balance from public.wallets where id = 'fb000000-0000-0000-0000-000000000001'),
  0::numeric,
  'wallets: no one can directly UPDATE a wallet balance — not even the owner (no UPDATE policy at all; RLS silently filtered the row, balance unchanged, must go through transfer_wallet_funds)'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000005';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.wallets where id = 'fb000000-0000-0000-0000-000000000001'),
  1,
  'wallets: a resident CAN read their own wallet'
);

select throws_ok(
  $$ insert into public.wallets (wallet_type, resident_id) values ('resident', 'f5000000-0000-0000-0000-000000000001') $$,
  '42501',
  null,
  'wallets: no one can directly INSERT a wallet either'
);

-- ============================================================
-- vacancies / vacancy_applications
-- ============================================================
reset role;
set local role anon;

select is(
  (select count(*)::int from public.vacancies where status = 'published'),
  1,
  'vacancies: an unauthenticated visitor can browse published vacancies'
);

select is(
  (select count(*)::int from public.vacancies where status = 'draft'),
  0,
  'vacancies: an unauthenticated visitor cannot see draft vacancies'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000006';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.vacancies where id = 'fc000000-0000-0000-0000-000000000002'),
  0,
  'vacancies: an unrelated applicant still cannot see the landlord''s draft listing'
);

-- The applicant can read their own application (va_select_applicant_or_owner),
-- so no reset role needed to verify the blocked write here.
update public.vacancy_applications set status = 'approved' where id = 'fd000000-0000-0000-0000-000000000001';
select is(
  (select status::text from public.vacancy_applications where id = 'fd000000-0000-0000-0000-000000000001'),
  'submitted',
  'vacancy_applications: the applicant themselves cannot approve their own application (RLS silently filtered the row, no exception, status unchanged)'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000004';
set local request.jwt.claim.role = 'authenticated';

select lives_ok(
  $$ update public.vacancy_applications set status = 'reviewing' where id = 'fd000000-0000-0000-0000-000000000001' $$,
  'vacancy_applications: the landlord who owns the vacancy CAN update the application status'
);

-- Phase 18 security acceptance scenario: "landlord -> another landlord's
-- vacancy must fail". The visibility-side of this (an unrelated applicant
-- can't see a draft) was already covered above; this is the write-side,
-- landlord-to-landlord, which wasn't.
reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-00000000000a';
set local request.jwt.claim.role = 'authenticated';

update public.vacancies set title = 'Hijacked by another landlord' where id = 'fc000000-0000-0000-0000-000000000001';
select is(
  (select title from public.vacancies where id = 'fc000000-0000-0000-0000-000000000001'),
  'Published unit',
  'vacancies: an unrelated landlord cannot edit another landlord''s vacancy (RLS silently filtered the row, no exception, title unchanged)'
);

-- ============================================================
-- chats / chat_participants / messages
-- ============================================================
reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000008';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.chats where id = 'fe000000-0000-0000-0000-000000000001'),
  0,
  'chats: a non-participant technician cannot see the job chat'
);

select throws_ok(
  $$ insert into public.messages (chat_id, sender_id, content) values ('fe000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000008', 'hi') $$,
  '42501',
  null,
  'messages: a non-participant cannot send a message into a chat they are not part of'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000007';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.chats where id = 'fe000000-0000-0000-0000-000000000001'),
  1,
  'chats: the assigned technician (a real participant) can see the job chat'
);

select lives_ok(
  $$ insert into public.messages (chat_id, sender_id, content) values ('fe000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000007', 'On my way') $$,
  'messages: a real participant CAN send a message'
);

-- ============================================================
-- notifications
-- ============================================================
reset role;
insert into public.notifications (id, user_id, title, body, type) values
  ('f0100000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000005', 'Test', 'Body', 'SYSTEM');

set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000006';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.notifications where id = 'f0100000-0000-0000-0000-000000000001'),
  0,
  'notifications: another user cannot read someone else''s notification'
);

select throws_ok(
  $$ insert into public.notifications (user_id, title, body, type) values ('f1000000-0000-0000-0000-000000000006', 'x', 'y', 'SYSTEM') $$,
  '42501',
  null,
  'notifications: no authenticated client can directly insert a notification (trigger/Edge-Function only)'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000005';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.notifications where id = 'f0100000-0000-0000-0000-000000000001'),
  1,
  'notifications: the intended recipient can read their own notification'
);

select lives_ok(
  $$ update public.notifications set is_read = true where id = 'f0100000-0000-0000-0000-000000000001' $$,
  'notifications: the recipient can mark their own notification read'
);

-- ============================================================
-- reviews — includes the mandatory non-participant regression test
-- ============================================================
reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000008';
set local request.jwt.claim.role = 'authenticated';

select throws_ok(
  $$ insert into public.reviews (booking_id, author_id, target_technician_id, rating, quality_rating, speed_rating, professionalism_rating)
     values ('fa000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000008', 'f8000000-0000-0000-0000-000000000001', 5, 5, 5, 5) $$,
  '42501',
  null,
  'reviews: a non-participant cannot submit a review for a booking they were not part of (mandatory regression test)'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000005';
set local request.jwt.claim.role = 'authenticated';

select throws_ok(
  $$ insert into public.reviews (booking_id, author_id, target_technician_id, rating, quality_rating, speed_rating, professionalism_rating)
     values ('fa000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000005', 'f8000000-0000-0000-0000-000000000001', 5, 5, 5, 5) $$,
  '42501',
  null,
  'reviews: even the real resident cannot review a booking that is not yet completed'
);

-- enforce_booking_status_transition (Phase 8, added after this file was
-- first written) validates the transition pairwise regardless of caller
-- privilege — even this privileged fixture-setup role has to walk the
-- real chain (accepted -> in_route -> work_started -> completed), not
-- jump straight there. Caught by actually running this suite for Phase
-- 18, not by inspection.
reset role;
update public.bookings set status = 'in_route' where id = 'fa000000-0000-0000-0000-000000000001';
update public.bookings set status = 'work_started' where id = 'fa000000-0000-0000-0000-000000000001';
update public.bookings set status = 'completed' where id = 'fa000000-0000-0000-0000-000000000001';
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000005';
set local request.jwt.claim.role = 'authenticated';

select lives_ok(
  $$ insert into public.reviews (booking_id, author_id, target_technician_id, rating, quality_rating, speed_rating, professionalism_rating)
     values ('fa000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000005', 'f8000000-0000-0000-0000-000000000001', 5, 5, 5, 5) $$,
  'reviews: the real resident CAN review their own completed booking'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000006';
set local request.jwt.claim.role = 'authenticated';

select ok(
  (select count(*)::int from public.reviews where booking_id = 'fa000000-0000-0000-0000-000000000001') = 1,
  'reviews: reviews are publicly readable (reputation data)'
);

select is(
  (select round(average_rating, 2)::float from public.technicians where id = 'f8000000-0000-0000-0000-000000000001'),
  5.0::float,
  'technicians: average_rating was recalculated by the review trigger'
);

-- ============================================================
-- audit_logs / activity_logs / subscriptions / settings — admin-only tables
-- ============================================================
reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000005';
set local request.jwt.claim.role = 'authenticated';

select is((select count(*)::int from public.audit_logs), 0, 'audit_logs: not readable by a resident');
select is((select count(*)::int from public.activity_logs), 0, 'activity_logs: not readable by a resident');
select is((select count(*)::int from public.settings), 0, 'settings: not readable by a resident');
select is((select count(*)::int from public.subscriptions), 0, 'subscriptions: not readable by a resident');

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000001';
set local request.jwt.claim.role = 'authenticated';

select ok((select count(*)::int from public.settings) >= 2, 'settings: readable by super_admin');

-- ============================================================
-- ai_conversations / ai_messages / file_records
-- ============================================================
reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000005';
set local request.jwt.claim.role = 'authenticated';

select lives_ok(
  $$ insert into public.ai_conversations (id, user_id) values ('f0200000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000005') $$,
  'ai_conversations: a resident can start their own AI conversation'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000006';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.ai_conversations where id = 'f0200000-0000-0000-0000-000000000001'),
  0,
  'ai_conversations: an unrelated user cannot see someone else''s AI conversation'
);

select throws_ok(
  $$ insert into public.file_records (key, bucket, original_name, mime_type, size, uploaded_by_id)
     values ('test-key', 'avatars', 'x.png', 'image/png', 100, 'f1000000-0000-0000-0000-000000000005') $$,
  '42501',
  null,
  'file_records: cannot insert a file_record claiming a different uploader'
);

-- ============================================================
-- notices — the table added in this migration set, not from the original
-- Prisma schema
-- ============================================================
reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000006';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.notices where id = 'ff000000-0000-0000-0000-000000000001'),
  0,
  'notices: a resident of a DIFFERENT apartment cannot read the notice'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000005';
set local request.jwt.claim.role = 'authenticated';

select is(
  (select count(*)::int from public.notices where id = 'ff000000-0000-0000-0000-000000000001'),
  1,
  'notices: a resident of the SAME apartment can read the published notice'
);

-- The resident can read the notice (notices_read_own_apartment), so no
-- reset role needed to verify the blocked write here.
update public.notices set title = 'hacked' where id = 'ff000000-0000-0000-0000-000000000001';
select is(
  (select title from public.notices where id = 'ff000000-0000-0000-0000-000000000001'),
  'Water shutoff',
  'notices: a resident (non-manager) cannot edit a notice (RLS silently filtered the row, no exception, title unchanged)'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000003';
set local request.jwt.claim.role = 'authenticated';

select lives_ok(
  $$ update public.notices set title = 'Water shutoff (updated)' where id = 'ff000000-0000-0000-0000-000000000001' $$,
  'notices: the managing property_manager CAN edit the notice'
);

-- ============================================================
-- transfer_wallet_funds RPC — sanity check it still enforces its own
-- insufficient-funds guard under RLS (SECURITY DEFINER, so it runs with
-- elevated privileges regardless of caller role, by design)
-- ============================================================
reset role;
set local role authenticated;
set local request.jwt.claim.sub = 'f1000000-0000-0000-0000-000000000005';
set local request.jwt.claim.role = 'authenticated';

select throws_ok(
  $$ select public.transfer_wallet_funds('fb000000-0000-0000-0000-000000000001', 'fb000000-0000-0000-0000-000000000002', 999999, 'rent_payment', 'wallet') $$,
  'P0001',
  'insufficient_funds',
  'transfer_wallet_funds: still enforces insufficient-funds even when called by an authenticated (non-owner-of-both-wallets) role'
);

reset role;
select * from finish();
rollback;
