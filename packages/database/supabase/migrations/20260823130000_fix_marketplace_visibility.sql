-- docs/migration/plan.md Phase 5. Found while writing the RLS test suite,
-- not by inspection alone — exactly what this phase is for.
--
-- mr_select_involved's "open marketplace" clause was `status = 'open'`
-- with no role check at all, despite its own comment saying "verified
-- technicians browse the open marketplace" — as written, ANY authenticated
-- user (any resident in any unrelated apartment, any landlord, etc.) could
-- read every open maintenance request platform-wide, including unit
-- numbers and issue descriptions that have nothing to do with them. This
-- restricts that clause to verified technicians only, matching what the
-- comment already claimed.
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
    or exists (
      select 1 from public.bookings b join public.technicians t on t.id = b.technician_id
      where b.request_id = maintenance_requests.id and t.user_id = auth.uid()
    )
    or public.is_admin()
  );
