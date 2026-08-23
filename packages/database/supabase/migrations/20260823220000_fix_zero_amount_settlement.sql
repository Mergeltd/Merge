-- docs/migration/plan.md Phase 18. Real production bug found by actually
-- running the pgTAP suite end-to-end (not by inspection): every booking
-- the real app creates today has total_amount = 0 (no invoicing exists
-- yet — flagged back in Phase 8/11). settle_booking_revenue's fee on a
-- $0 booking is $0, and it unconditionally called transfer_wallet_funds
-- even for a $0 transfer — which unconditionally inserts a transactions
-- row, and transactions has `check (amount > 0)`. So the trigger this
-- migration's predecessor (20260823180000) wired onto every booking
-- completion was failing the constraint and rolling back the technician's
-- entire "mark job completed" action, for every booking, right now.
--
-- Fix: skip the transfer (and the transaction record) entirely when
-- there's nothing to actually move — a $0 job has no real commission to
-- collect, so recording that honestly (revenue_shares row with zeros,
-- no phantom transaction) is correct, not a workaround.
create or replace function public.settle_booking_revenue(p_booking_id uuid)
returns public.revenue_shares
language plpgsql security definer set search_path = public as $$
declare
  v_booking public.bookings;
  v_existing public.revenue_shares;
  v_platform_wallet uuid;
  v_tech_wallet uuid;
  v_commission_pct numeric;
  v_platform_fee numeric;
  v_lead_share numeric;
  v_share public.revenue_shares;
begin
  select * into v_existing from public.revenue_shares where booking_id = p_booking_id;
  if v_existing.is_settled then
    return v_existing;
  end if;

  select * into v_booking from public.bookings where id = p_booking_id;
  if v_booking is null then
    raise exception 'booking_not_found';
  end if;

  select id into v_platform_wallet from public.wallets where wallet_type = 'platform_commission' limit 1;
  if v_platform_wallet is null then
    raise exception 'platform_wallet_not_configured';
  end if;

  select w.id into v_tech_wallet from public.wallets w where w.technician_id = v_booking.technician_id;
  if v_tech_wallet is null then
    raise exception 'technician_wallet_not_found';
  end if;

  select coalesce((value::numeric), 10)
    into v_commission_pct
    from public.settings where key = 'SYSTEM_COMMISSION_PERCENTAGE';
  if v_commission_pct is null then
    v_commission_pct := 10;
  end if;

  v_platform_fee := round(v_booking.total_amount * (v_commission_pct / 100), 2);
  v_lead_share   := v_booking.total_amount - v_platform_fee;

  if v_platform_fee > 0 then
    perform public.transfer_wallet_funds(
      v_tech_wallet, v_platform_wallet, v_platform_fee, 'commission_fee', 'wallet', p_booking_id
    );
  end if;

  insert into public.revenue_shares (booking_id, total_amount, platform_fee, lead_tech_share, is_settled)
  values (p_booking_id, v_booking.total_amount, v_platform_fee, v_lead_share, true)
  on conflict (booking_id) do update
    set platform_fee = excluded.platform_fee, lead_tech_share = excluded.lead_tech_share, is_settled = true
  returning * into v_share;

  return v_share;
end;
$$;
