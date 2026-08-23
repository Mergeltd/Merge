-- docs/migration/plan.md Phase 3 §3 — the one table the audit identified as
-- needed (resident Community page) but not present in the original Prisma
-- schema.
--
-- Table only here — RLS is applied in 20260823121600_rls_policies.sql
-- alongside every other table, not inline in this file. An earlier draft of
-- this migration set had the notices RLS policy call
-- public.manages_apartment(), which isn't defined until
-- 20260823121500_rls_helpers.sql — applying migrations in order would have
-- failed with "function does not exist". Keeping RLS centralized in one
-- migration, after the helpers exist, avoids that class of ordering bug for
-- every table, not just this one.
create table public.notices (
  id           uuid primary key default gen_random_uuid(),
  apartment_id uuid not null references public.apartments(id) on delete cascade,
  author_id    uuid not null references public.profiles(id) on delete cascade,
  title        text not null,
  content      text not null,
  priority     text not null default 'normal',  -- normal | urgent
  published_at timestamptz,
  expires_at   timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index notices_apartment_idx on public.notices(apartment_id);
create index notices_published_idx on public.notices(published_at);
