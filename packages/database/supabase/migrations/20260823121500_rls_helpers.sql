-- docs/migration/plan.md Phase 3 / Phase 5. Four helper functions so the
-- ~90 policies in the next migration don't each repeat the same joins.
create function public.current_role() returns user_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create function public.is_admin() returns boolean
language sql stable as $$
  select public.current_role() in ('super_admin', 'apartment_admin');
$$;

create function public.is_super_admin() returns boolean
language sql stable as $$
  select public.current_role() = 'super_admin';
$$;

-- True if the current user manages/owns the given apartment
-- (property_manager or landlord assignment), or is a super_admin.
-- Also what makes docs/migration/plan.md ADR-002 work without a dedicated
-- property_manager dashboard: a property manager's /admin view is scoped
-- to exactly the apartments this returns true for.
create function public.manages_apartment(p_apartment_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_super_admin()
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
