-- docs/migration/plan.md Phase 15. v_technician_marketplace (Phase 3) is
-- what the plan's own comment says feeds "the public marketplace" — but it
-- was missing 3 columns that already exist on technicians and are already
-- shown on the technician's own profile page (Phase 8): service_area and
-- hourly_rate (added in 20260823150000_technician_bookings_gaps.sql), and
-- certifications (present since Phase 3). CREATE OR REPLACE VIEW appending
-- columns is safe — nothing currently selects columns by position.
create or replace view public.v_technician_marketplace as
select
  t.id,
  t.user_id,
  p.first_name,
  p.last_name,
  p.avatar_url,
  t.bio,
  t.experience_years,
  t.verification_status,
  t.average_rating,
  t.is_available,
  t.latitude,
  t.longitude,
  coalesce(
    array_agg(c.name) filter (where c.name is not null),
    '{}'
  ) as categories,
  t.service_area,
  t.hourly_rate,
  t.certifications
from public.technicians t
join public.profiles p on p.id = t.user_id
left join public.technician_categories tc on tc.technician_id = t.id
left join public.categories c on c.id = tc.category_id
where t.verification_status = 'verified' and t.deleted_at is null
group by t.id, p.first_name, p.last_name, p.avatar_url;
