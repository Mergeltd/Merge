-- docs/migration/plan.md Phase 7. Found while wiring the Community page:
-- the notices table (added in Phase 3 to cover a gap the audit flagged)
-- only modeled `priority`, but the existing, already-built Community UI
-- filters and displays notices by category (Maintenance/Security/
-- Community/Billing) — a real feature the original schema design missed,
-- not something to drop just because the schema didn't have it yet.
create type notice_category as enum ('maintenance', 'security', 'community', 'billing');

alter table public.notices add column category notice_category not null default 'community';
create index notices_category_idx on public.notices(category);
