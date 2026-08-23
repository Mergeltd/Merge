-- docs/migration/plan.md Phase 11. Notifications and audit logging as a
-- structural consequence of state changes (triggers), not something a
-- frontend call site has to remember to also do — same reasoning as
-- Phase 8's bookings_mark_request_assigned. accept_booking/verify_technician
-- from the plan's RPC table are deliberately NOT new RPCs: both are already
-- plain RLS-gated `update`s from Phases 8/10 (updateBookingStatus,
-- setTechnicianVerification) — the plan's own preference or a bespoke RPC
-- is a trigger, so the trigger is attached to the existing write instead.

-- ---------------------------------------------------------------------
-- 1. Real financial gap found before wiring any of this: nothing ever
-- created the 'platform_commission' wallet settle_booking_revenue()
-- (Phase 3) has been looking up since it was written. It's a valid
-- wallet_type enum value with no seed and no trigger anywhere — every
-- call so far (there have been none; nothing invokes this function yet)
-- would have transferred into a null recipient_wallet_id silently.
-- ---------------------------------------------------------------------
insert into public.wallets (wallet_type)
select 'platform_commission'
where not exists (select 1 from public.wallets where wallet_type = 'platform_commission');

-- Hardened: fails loudly instead of transacting into a missing wallet,
-- and is now idempotent against the transfer itself (not just the
-- revenue_shares bookkeeping row) — re-settling an already-settled
-- booking returns the existing share without moving money twice. The
-- plan's "guard the call site" becomes "guard the function", since
-- Phase 11 also switches the only call site to a trigger, not app code.
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

create function public.settle_completed_booking()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.settle_booking_revenue(new.id);
  return new;
end;
$$;

create trigger bookings_settle_on_completion
  after update on public.bookings
  for each row
  when (new.status = 'completed' and old.status is distinct from 'completed')
  execute function public.settle_completed_booking();

-- ---------------------------------------------------------------------
-- 2. Booking notifications — new assignment (technician), every status
-- change (resident). total_amount isn't set at proposal time (defaults
-- to 0, invoiced later — out of this phase's scope), so the technician
-- notification doesn't quote a price.
-- ---------------------------------------------------------------------
create function public.notify_technician_new_booking()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_title text;
  v_tech_user uuid;
begin
  select mr.title into v_title from public.maintenance_requests mr where mr.id = new.request_id;
  select t.user_id into v_tech_user from public.technicians t where t.id = new.technician_id;

  insert into public.notifications (user_id, title, body, type, payload)
  values (v_tech_user, 'New job assigned', coalesce(v_title, 'A maintenance request'), 'booking_proposed',
    jsonb_build_object('booking_id', new.id, 'request_id', new.request_id));
  return new;
end;
$$;

create trigger bookings_notify_technician_new
  after insert on public.bookings
  for each row
  when (new.status = 'proposed')
  execute function public.notify_technician_new_booking();

create function public.notify_resident_booking_status()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_resident_user uuid;
  v_title text;
  v_body text;
begin
  select p.id, mr.title into v_resident_user, v_title
  from public.maintenance_requests mr
  join public.residents r on r.id = mr.resident_id
  join public.profiles p on p.id = r.user_id
  where mr.id = new.request_id;

  v_body := case new.status
    when 'accepted'      then 'A technician has accepted your request'
    when 'declined'      then 'Your technician declined — we will reassign your request'
    when 'in_route'      then 'Your technician is on the way'
    when 'work_started'  then 'Work has started on your request'
    when 'completed'     then 'Your maintenance request has been completed'
    when 'cancelled'     then 'Your booking was cancelled'
    else 'Your booking status changed to ' || new.status
  end;

  insert into public.notifications (user_id, title, body, type, payload)
  values (v_resident_user, coalesce(v_title, 'Maintenance request'), v_body, 'booking_status_changed',
    jsonb_build_object('booking_id', new.id, 'request_id', new.request_id, 'status', new.status));
  return new;
end;
$$;

create trigger bookings_notify_resident_status
  after update on public.bookings
  for each row
  when (new.status is distinct from old.status)
  execute function public.notify_resident_booking_status();

-- ---------------------------------------------------------------------
-- 3. Technician verification notification.
-- ---------------------------------------------------------------------
create function public.notify_technician_verification()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_body text;
begin
  v_body := case new.verification_status
    when 'verified'  then 'Your technician application has been approved — you can now accept jobs'
    when 'rejected'  then 'Your technician application was not approved'
    when 'suspended' then 'Your technician account has been suspended'
    else 'Your verification status changed to ' || new.verification_status
  end;

  insert into public.notifications (user_id, title, body, type, payload)
  values (new.user_id, 'Verification update', v_body, 'technician_verification',
    jsonb_build_object('technician_id', new.id, 'status', new.verification_status));
  return new;
end;
$$;

create trigger technicians_notify_verification
  after update on public.technicians
  for each row
  when (new.verification_status is distinct from old.verification_status)
  execute function public.notify_technician_verification();

-- ---------------------------------------------------------------------
-- 4. Vacancy application notifications — landlord on new application,
-- applicant on status change. vacancies.landlord_id is already a direct
-- profiles.id FK (not landlords.id), so no extra join needed there.
-- ---------------------------------------------------------------------
create function public.notify_landlord_new_application()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_landlord uuid;
  v_title text;
begin
  select v.landlord_id, v.title into v_landlord, v_title from public.vacancies v where v.id = new.vacancy_id;

  insert into public.notifications (user_id, title, body, type, payload)
  values (v_landlord, 'New application', coalesce(v_title, 'Your listing') || ' has a new applicant', 'application_submitted',
    jsonb_build_object('application_id', new.id, 'vacancy_id', new.vacancy_id));
  return new;
end;
$$;

create trigger vacancy_applications_notify_landlord
  after insert on public.vacancy_applications
  for each row execute function public.notify_landlord_new_application();

create function public.notify_applicant_status()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_title text;
  v_body text;
begin
  select v.title into v_title from public.vacancies v where v.id = new.vacancy_id;

  v_body := case new.status
    when 'reviewing' then 'is now being reviewed'
    when 'approved'  then 'has been approved'
    when 'declined'  then 'was not successful this time'
    else 'status changed to ' || new.status
  end;

  insert into public.notifications (user_id, title, body, type, payload)
  values (new.applicant_id, 'Application update', 'Your application for ' || coalesce(v_title, 'a listing') || ' ' || v_body,
    'application_status_changed', jsonb_build_object('application_id', new.id, 'vacancy_id', new.vacancy_id, 'status', new.status));
  return new;
end;
$$;

create trigger vacancy_applications_notify_applicant
  after update on public.vacancy_applications
  for each row
  when (new.status is distinct from old.status)
  execute function public.notify_applicant_status();

-- ---------------------------------------------------------------------
-- 5. New message notification — every other participant in the chat,
-- not the sender. Chat sizes here are small (direct + small booking/
-- collaboration threads), so a per-participant insert loop is fine; no
-- need for a bulk-insert-from-select given that.
-- ---------------------------------------------------------------------
create function public.notify_chat_participants_new_message()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_sender_name text;
  v_participant record;
begin
  select (p.first_name || ' ' || p.last_name) into v_sender_name from public.profiles p where p.id = new.sender_id;

  for v_participant in
    select cp.user_id from public.chat_participants cp
    where cp.chat_id = new.chat_id and cp.user_id != new.sender_id
  loop
    insert into public.notifications (user_id, title, body, type, payload)
    values (v_participant.user_id, 'New message', coalesce(v_sender_name, 'Someone') || ' sent you a message', 'new_message',
      jsonb_build_object('chat_id', new.chat_id, 'message_id', new.id));
  end loop;
  return new;
end;
$$;

create trigger messages_notify_participants
  after insert on public.messages
  for each row execute function public.notify_chat_participants_new_message();

-- ---------------------------------------------------------------------
-- 6. Audit logging — scoped to the admin-driven state changes the admin
-- dashboard's activity feed actually surfaces (Phase 10), not every
-- routine business event (those already get notifications above).
-- No client INSERT policy exists on audit_logs (Phase 3) — writing it is
-- exclusively a trigger's job, which is what makes this non-optional
-- instead of a service nobody calls (the old backend's failure mode).
-- ---------------------------------------------------------------------
create function public.audit_technician_verification()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_name text;
begin
  select (p.first_name || ' ' || p.last_name) into v_name from public.profiles p where p.id = new.user_id;

  insert into public.audit_logs (user_id, action, entity_name, entity_id, previous_state, new_state)
  values (auth.uid(), new.verification_status::text, coalesce(v_name, 'a technician'), new.id,
    jsonb_build_object('verification_status', old.verification_status), jsonb_build_object('verification_status', new.verification_status));
  return new;
end;
$$;

create trigger technicians_audit_verification
  after update on public.technicians
  for each row
  when (new.verification_status is distinct from old.verification_status)
  execute function public.audit_technician_verification();

create function public.audit_technician_assignment()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_title text;
begin
  select mr.title into v_title from public.maintenance_requests mr where mr.id = new.request_id;

  insert into public.audit_logs (user_id, action, entity_name, entity_id, new_state)
  values (auth.uid(), 'assigned a technician to', coalesce(v_title, 'a maintenance request'), new.request_id,
    jsonb_build_object('booking_id', new.id, 'technician_id', new.technician_id));
  return new;
end;
$$;

create trigger bookings_audit_assignment
  after insert on public.bookings
  for each row
  when (new.status = 'proposed')
  execute function public.audit_technician_assignment();

create function public.audit_application_decision()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_title text;
begin
  if new.status not in ('approved', 'declined') then
    return new;
  end if;

  select v.title into v_title from public.vacancies v where v.id = new.vacancy_id;

  insert into public.audit_logs (user_id, action, entity_name, entity_id, previous_state, new_state)
  values (auth.uid(), new.status::text, coalesce(v_title, 'a listing') || ' application', new.id,
    jsonb_build_object('status', old.status), jsonb_build_object('status', new.status));
  return new;
end;
$$;

create trigger vacancy_applications_audit_decision
  after update on public.vacancy_applications
  for each row
  when (new.status is distinct from old.status)
  execute function public.audit_application_decision();
