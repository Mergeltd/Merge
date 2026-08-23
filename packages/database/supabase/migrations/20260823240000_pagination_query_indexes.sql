-- docs/migration/plan.md Phase 19 — "review query plans on the
-- highest-traffic list views" before production. The two genuinely public,
-- unauthenticated-reachable list queries (getOpenJobs / the technician
-- marketplace, getPublishedVacancies / the public vacancy marketplace)
-- both filter on status and sort by created_at with a LIMIT (the caps
-- added alongside this migration) — a shape a single-column status index
-- doesn't fully serve, since Postgres still has to sort every matching row
-- before applying the limit. A composite index lets it walk the index in
-- already-sorted order and stop at the limit instead.
--
-- Not applied everywhere pagination was added this phase — only these
-- two, where the combination of "public, unauthenticated" and "filter +
-- sort + limit" actually justifies it before there's real traffic to
-- profile against.
create index mr_status_created_idx on public.maintenance_requests(status, created_at desc);
create index vacancies_status_created_idx on public.vacancies(status, created_at desc);
