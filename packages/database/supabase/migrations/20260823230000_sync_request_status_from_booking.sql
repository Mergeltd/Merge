-- docs/migration/plan.md Phase 18. Real bug found by an automated
-- end-to-end integration test, not by inspection: maintenance_requests.status
-- only ever moves once, open -> assigned (mark_request_assigned, Phase 8),
-- triggered by the booking being created. Nothing ever moves it again —
-- a booking can walk all the way through accepted -> in_route ->
-- work_started -> completed and the request the resident actually looks
-- at stays stuck on "Assigned" forever. The resident-facing notification
-- trigger (Phase 11) already promises "we will reassign your request" on
-- a decline, but nothing implemented that either.
--
-- Mirrors mark_request_assigned's own pattern (a focused trigger, not a
-- rewrite of that one) rather than folding this into it, since the two
-- fire on different events (INSERT vs UPDATE) for different reasons.
create function public.sync_request_status_from_booking()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status in ('in_route', 'work_started') then
    update public.maintenance_requests set status = 'in_progress' where id = new.request_id and status = 'assigned';
  elsif new.status = 'completed' then
    update public.maintenance_requests set status = 'completed' where id = new.request_id;
  elsif new.status in ('declined', 'cancelled') then
    -- Back to the open marketplace so another technician can pick it up —
    -- exactly what the Phase 11 decline notification already tells the
    -- resident will happen.
    update public.maintenance_requests set status = 'open' where id = new.request_id and status in ('assigned', 'in_progress');
  end if;
  return new;
end;
$$;

create trigger bookings_sync_request_status
  after update on public.bookings
  for each row
  when (new.status is distinct from old.status)
  execute function public.sync_request_status_from_booking();
