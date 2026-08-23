-- docs/migration/plan.md Phase 5. Found by actually running the RLS test
-- suite, not by inspection: mr_select_involved (maintenance_requests)
-- queries bookings, and bookings_select_involved queries
-- maintenance_requests right back — Postgres detects the cycle and raises
-- "infinite recursion detected in policy for relation maintenance_requests"
-- rather than looping forever.
--
-- Fix: route both cross-table checks through SECURITY DEFINER helper
-- functions, the same pattern current_role()/is_admin()/manages_apartment()
-- already use safely (a security definer function's internal queries run
-- under the function owner's privileges, so they don't re-trigger RLS on
-- the table they're checking — that's what breaks the cycle).
create function public.technician_assigned_to_request(p_request_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.bookings b join public.technicians t on t.id = b.technician_id
    where b.request_id = p_request_id and t.user_id = auth.uid()
  );
$$;

create function public.resident_owns_request(p_request_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.maintenance_requests mr join public.residents r on r.id = mr.resident_id
    where mr.id = p_request_id and r.user_id = auth.uid()
  );
$$;

drop policy "mr_select_involved" on public.maintenance_requests;
create policy "mr_select_involved" on public.maintenance_requests for select
  using (
    exists (select 1 from public.residents r where r.id = resident_id and r.user_id = auth.uid())
    or (
      status = 'open'
      and exists (
        select 1 from public.technicians t
        where t.user_id = auth.uid() and t.verification_status = 'verified'
      )
    )
    or public.technician_assigned_to_request(maintenance_requests.id)
    or public.is_admin()
  );

drop policy "bookings_select_involved" on public.bookings;
create policy "bookings_select_involved" on public.bookings for select
  using (
    exists (select 1 from public.technicians t where t.id = technician_id and t.user_id = auth.uid())
    or public.resident_owns_request(request_id)
    or public.is_admin()
  );
