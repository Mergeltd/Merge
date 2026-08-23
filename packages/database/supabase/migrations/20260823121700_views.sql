-- docs/migration/plan.md Phase 3 §9.3/§9.2. Two views, not more — per the
-- audit's performance section, only these two currently earn their keep.

-- Feeds both the technician "Jobs" page and the public marketplace without
-- repeating the same technician+profile+categories+rating join everywhere.
create view public.v_technician_marketplace as
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
  ) as categories
from public.technicians t
join public.profiles p on p.id = t.user_id
left join public.technician_categories tc on tc.technician_id = t.id
left join public.categories c on c.id = tc.category_id
where t.verification_status = 'verified' and t.deleted_at is null
group by t.id, p.first_name, p.last_name, p.avatar_url;

-- The old NestJS backend's forecasting.service.ts queried a materialized
-- view by exactly this name via a raw $queryRaw call — but it was never
-- defined anywhere in that codebase (not in schema.prisma, no migration).
-- This is the first real definition of it.
create materialized view public.mv_monthly_revenue as
select
  date_trunc('month', created_at) as month,
  count(*) as transaction_count,
  sum(amount) as total_revenue
from public.transactions
where type = 'commission_fee' and status = 'successful'
group by date_trunc('month', created_at)
order by month;

create unique index mv_monthly_revenue_month_idx on public.mv_monthly_revenue(month);

-- Refreshed daily. Requires the pg_cron extension (enabled by default on
-- hosted Supabase projects; if the local Docker stack's Postgres image
-- doesn't have it, this statement is the one thing in this migration set
-- to revisit — everything else here doesn't depend on it).
create extension if not exists pg_cron;
select cron.schedule(
  'refresh-mv-monthly-revenue',
  '0 3 * * *',
  $$refresh materialized view concurrently public.mv_monthly_revenue$$
);
