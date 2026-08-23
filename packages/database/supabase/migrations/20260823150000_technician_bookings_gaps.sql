-- docs/migration/plan.md Phase 8. Three real gaps found while wiring the
-- technician dashboard, fixed before touching the frontend rather than
-- worked around in application code.

-- 1. technicians was missing two fields the already-built profile page
-- displays (hourly_rate, a free-text service area — lat/long exist but
-- there's no human-readable location string).
alter table public.technicians add column hourly_rate numeric(10,2);
alter table public.technicians add column service_area text;

-- 2. No RLS policy anywhere let a technician actually accept an open job —
-- bookings only had an admin "for all" policy and a technician
-- self-update policy for a booking that already exists. The "Accept Job"
-- flow (a technician self-assigning from the open marketplace) had no
-- INSERT path at all.
create policy "bookings_insert_technician_self_accept" on public.bookings for insert
  with check (
    exists (select 1 from public.technicians t where t.id = technician_id and t.user_id = auth.uid())
    and exists (select 1 from public.maintenance_requests mr where mr.id = request_id and mr.status = 'open')
  );

-- Structural consequence of accepting a job: the request moves out of the
-- open marketplace. Was previously nothing's responsibility — a trigger
-- makes it automatic instead of something application code has to
-- remember (the same reasoning as the notification/audit-log triggers).
create function public.mark_request_assigned()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.maintenance_requests set status = 'assigned' where id = new.request_id and status = 'open';
  return new;
end;
$$;

create trigger bookings_mark_request_assigned
  after insert on public.bookings
  for each row execute function public.mark_request_assigned();

-- 3. docs/migration/plan.md Phase 8 explicitly commits to rejecting
-- invalid booking status transitions, not just ownership-checking who can
-- write. RLS proves who; this proves what.
create function public.enforce_booking_status_transition()
returns trigger language plpgsql as $$
begin
  if new.status = old.status then
    return new;
  end if;
  if (old.status, new.status) not in (
    ('proposed', 'accepted'), ('proposed', 'declined'), ('proposed', 'cancelled'),
    ('accepted', 'in_route'), ('accepted', 'cancelled'),
    ('in_route', 'work_started'), ('in_route', 'cancelled'),
    ('work_started', 'completed'), ('work_started', 'cancelled')
  ) then
    raise exception 'invalid_status_transition' using detail = old.status || ' -> ' || new.status;
  end if;
  return new;
end;
$$;

create trigger bookings_enforce_status_transition
  before update on public.bookings
  for each row execute function public.enforce_booking_status_transition();
