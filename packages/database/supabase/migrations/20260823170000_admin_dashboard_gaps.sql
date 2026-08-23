-- docs/migration/plan.md Phase 10. Two real gaps found before writing a
-- single admin query, not after.

-- 1. manages_apartment() (Phase 5's RLS helpers) checked
-- is_super_admin() OR a property_manager_apartments/landlord_apartments
-- join — it never checked apartment_admin at all. Every apartment-scoped
-- WRITE policy (apartments, buildings, units, notices) and the
-- residents_select_self_or_manager READ policy all depend on this
-- function, so an apartment_admin — the role this entire dashboard is
-- built for — could not write to any of those tables, and could not even
-- read the residents list, full stop. apartment_admin is treated as a
-- platform-wide admin everywhere else in this schema (is_admin() already
-- means super_admin OR apartment_admin); this makes manages_apartment()
-- consistent with that instead of silently excluding it.
create or replace function public.manages_apartment(p_apartment_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_admin()
    or exists (
      select 1 from public.property_manager_apartments pma
      join public.property_managers pm on pm.id = pma.manager_id
      where pma.apartment_id = p_apartment_id and pm.user_id = auth.uid()
    )
    or exists (
      select 1 from public.landlord_apartments la
      join public.landlords l on l.id = la.landlord_id
      where la.apartment_id = p_apartment_id and l.user_id = auth.uid()
    );
$$;

-- 2. Postgres does not support ALTER MATERIALIZED VIEW ... ENABLE ROW
-- LEVEL SECURITY — mv_monthly_revenue (Phase 3) has had no access control
-- at all since it was created, relying only on Supabase's default of not
-- auto-exposing new relations. Making that explicit and admin-gated
-- properly, the standard workaround for "RLS on a materialized view":
-- a SECURITY DEFINER function that checks is_admin() itself and is the
-- only sanctioned way to read it.
revoke all on public.mv_monthly_revenue from anon, authenticated;

create function public.get_monthly_revenue()
returns setof public.mv_monthly_revenue
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'insufficient_privilege' using hint = 'admin only';
  end if;
  return query select * from public.mv_monthly_revenue order by month;
end;
$$;
