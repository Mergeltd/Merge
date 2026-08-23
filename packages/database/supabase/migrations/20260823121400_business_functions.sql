-- docs/migration/plan.md Phase 3 / Phase 11. Ports the multi-table writes
-- the old NestJS backend did (inconsistently — see the audit's backend
-- inventory) via Prisma's $transaction, so the frontend calls one RPC
-- instead of racing two separate client calls.

-- Atomic wallet transfer (was wallet.repository.ts's executeTransaction).
create function public.transfer_wallet_funds(
  p_sender_wallet_id uuid,
  p_recipient_wallet_id uuid,
  p_amount numeric,
  p_type transaction_type,
  p_gateway payment_gateway,
  p_booking_id uuid default null,
  p_description text default null
) returns public.transactions
language plpgsql security definer set search_path = public as $$
declare
  v_sender_balance numeric;
  v_tx public.transactions;
begin
  select balance into v_sender_balance from public.wallets
    where id = p_sender_wallet_id for update;
  if v_sender_balance is null or v_sender_balance < p_amount then
    raise exception 'insufficient_funds';
  end if;

  update public.wallets set balance = balance - p_amount where id = p_sender_wallet_id;
  update public.wallets set balance = balance + p_amount where id = p_recipient_wallet_id;

  insert into public.transactions
    (reference, amount, type, status, sender_wallet_id, recipient_wallet_id, booking_id, gateway, description)
  values
    ('TXN-' || encode(gen_random_bytes(8), 'hex'), p_amount, p_type, 'successful',
     p_sender_wallet_id, p_recipient_wallet_id, p_booking_id, p_gateway, p_description)
  returning * into v_tx;

  return v_tx;
end;
$$;

-- Revenue split settlement (was payment.service.ts's processRevenueSplit,
-- which hardcoded a 10% fee and literal placeholder wallet-id strings
-- 'PLATFORM_WALLET_ID'/'TECH_WALLET_ID' — see the audit's backend
-- inventory. This version resolves the real wallets and reads the
-- commission rate from public.settings (SYSTEM_COMMISSION_PERCENTAGE,
-- seeded in 20260823121800_seed_reference_data.sql) instead of hardcoding
-- it — that setting exists specifically for this and nothing was reading
-- it before. Idempotent: re-settling an already-settled booking updates
-- the existing row rather than creating a duplicate, and the call site
-- (Phase 11) additionally checks revenue_shares.is_settled before calling,
-- so a booking is never paid out twice.
create function public.settle_booking_revenue(p_booking_id uuid)
returns public.revenue_shares
language plpgsql security definer set search_path = public as $$
declare
  v_booking public.bookings;
  v_platform_wallet uuid;
  v_tech_wallet uuid;
  v_commission_pct numeric;
  v_platform_fee numeric;
  v_lead_share numeric;
  v_share public.revenue_shares;
begin
  select * into v_booking from public.bookings where id = p_booking_id;
  if v_booking is null then
    raise exception 'booking_not_found';
  end if;

  select id into v_platform_wallet from public.wallets where wallet_type = 'platform_commission' limit 1;
  select w.id into v_tech_wallet from public.wallets w where w.technician_id = v_booking.technician_id;

  select coalesce((value::numeric), 10)
    into v_commission_pct
    from public.settings where key = 'SYSTEM_COMMISSION_PERCENTAGE';
  if v_commission_pct is null then
    v_commission_pct := 10;
  end if;

  v_platform_fee := round(v_booking.total_amount * (v_commission_pct / 100), 2);
  v_lead_share   := v_booking.total_amount - v_platform_fee;

  perform public.transfer_wallet_funds(
    v_tech_wallet, v_platform_wallet, v_platform_fee, 'commission_fee', 'wallet', p_booking_id
  );

  insert into public.revenue_shares (booking_id, total_amount, platform_fee, lead_tech_share, is_settled)
  values (p_booking_id, v_booking.total_amount, v_platform_fee, v_lead_share, true)
  on conflict (booking_id) do update
    set platform_fee = excluded.platform_fee, lead_tech_share = excluded.lead_tech_share, is_settled = true
  returning * into v_share;

  return v_share;
end;
$$;

-- Technician average-rating recalculation (was review.repository.ts, done
-- imperatively in application code after each insert — here it's a
-- trigger so it can't drift out of sync with the reviews table).
create function public.recalc_technician_rating()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.technicians
    set average_rating = (
      select coalesce(avg(rating), 0)::numeric(3,2)
      from public.reviews where target_technician_id = new.target_technician_id
    )
    where id = new.target_technician_id;
  return new;
end;
$$;

create trigger reviews_recalc_rating
  after insert on public.reviews
  for each row execute function public.recalc_technician_rating();
