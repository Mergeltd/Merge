-- docs/migration/plan.md Phase 5. Third bug found by running the test
-- suite: technicians_update_self's WITH CHECK subquery
-- `(select verification_status from public.technicians where id = technicians.id)`
-- self-references technicians without an alias — `technicians.id` inside
-- the subquery is ambiguous with the subquery's own FROM clause, so it
-- matched every row instead of just the one being updated, and Postgres
-- raised "more than one row returned by a subquery used as an expression"
-- for any update at all (not just a verification_status change). Aliasing
-- the inner scan disambiguates it. (Unlike the earlier two bugs, this one
-- doesn't need a SECURITY DEFINER helper — WITH CHECK self-references
-- apparently don't hit the same recursion guard that SELECT-policy
-- self-references do, confirmed by profiles_update_own's equivalent
-- pattern already working correctly.)
drop policy "technicians_update_self" on public.technicians;
create policy "technicians_update_self" on public.technicians for update
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and verification_status = (select t2.verification_status from public.technicians t2 where t2.id = technicians.id)
  );
