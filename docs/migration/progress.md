# MERGE — Supabase Migration Progress

Tracks execution of [`plan.md`](./plan.md). Check items off as they land; leave a one-line note + date next to anything non-obvious. Nothing below is checked yet — Phase 0 is the next action.

## Phase 0 — Repository freeze & baseline
- [x] Migration branch created — `feat/supabase-migration`, off `main` @ `59993a9`
- [x] Baseline commit tagged — `pre-supabase-migration`
- [x] `pnpm build` / `pnpm lint` / `pnpm test` output recorded in `baseline.md` — build ✅, test ✅ (1 suite, minimal coverage), lint ❌ (pre-existing, see below)
- [x] `baseline-env.md` written

## Phase 1 — Cleanup & contract stabilization
- [x] ADR-001 (canonical `user_role`) confirmed — `packages/types/index.ts`'s `UserRole` now has all 6 values; `RegisterUserSchema` derives its role enum from a single `SELF_SERVICE_ROLES` list instead of a second hardcoded array. Commit `42f9856`.
- [x] `apps/frontend/src/shared-types/index.ts` de-duplicated — now `export * from '@merge/types'` instead of a byte-identical hand copy. Same commit.
- [x] Fixed `apps/backend`/`apps/frontend` lint tooling — neither had `eslint` installed *at all* (not just missing config; worse than baseline.md first suggested). Added flat config for backend, `next/core-web-vitals` for frontend, plus the real issues that surfaced once lint could actually run: 11 unused imports, 1 unescaped apostrophe (`resident/page.tsx`), and an out-of-tsconfig test glob (`test/security/*.e2e-spec.ts`, fixed via `allowDefaultProject`). `pnpm build`/`lint`/`test` all still green after. Commit `a465f55`.
- [ ] ADR-002 (`property_manager` → `/admin`, RLS-scoped) — decision recorded in plan.md, nothing to implement until Phase 6 (`middleware.ts` doesn't exist yet)
- [x] Orphaned-code table reviewed (plan.md §1.4), no deletions made — correct per Rule 1/5, revisit at Phase 16

**Found while fixing lint, not yet acted on (queued for later phases):**
- `test/security/bola.e2e-spec.ts` and `rbac.e2e-spec.ts` exist but are non-functional placeholder stubs (literal `<ADMIN_A_TOKEN>` bearer strings) and aren't run by `pnpm test` (only `apps/backend/src/modules/apartments/apartment.service.spec.ts` runs today). They're a BOLA/IDOR + RBAC test *intent* worth keeping in mind for Phase 18's RLS test matrix, not code to fix now.
- `apps/backend`'s `test:e2e` script points at `./test/jest-e2e.json`, which doesn't exist — that script has never actually run. Phase 18 scope, not Phase 1.

## Phase 2 — Supabase project setup
- [x] Supabase project created — `Merge`, ref `rohkfyamfwisfuohzkvm`, region `eu-west-1`, `ACTIVE_HEALTHY`. Created by the user directly (CLI login/project creation needs a browser, which this session can't do).
- [x] CLI linked — `supabase link` succeeded using a personal access token scoped to the project's owning account (the machine's default `supabase login` session belongs to a *different* account — TechMart/Thriftshop/UhaiLink/AjiraClub — so linking needed `SUPABASE_ACCESS_TOKEN` rather than the default session). Token stored in gitignored `packages/database/.env`, not the default CLI config, so it doesn't disturb the user's other projects.
- [ ] `supabase start` works locally — still blocked. Image pulls (`edge-runtime` ~236MB, `storage-api`) repeatedly truncate with `unexpected EOF` against public.ecr.aws/ghcr.io — consistent enough across many retries to be a real network/throttling issue on this connection, not bad luck. Not resolved; revisit when convenient (open Docker Desktop, retry `supabase start` in `packages/database`). Not currently blocking anything — Phase 3 proceeded directly against the hosted project instead (see below), by user decision.
- [x] `supabase/` scaffolded under `packages/database/` — `config.toml` (`project_id = "merge"`), `migrations/`, `functions/`, `tests/`, `seed.sql` placeholder. Commit `6ec5620`.
- [x] `.env.example` updated with Supabase vars — `apps/frontend/.env.example` gains `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` (commit `6ec5620`); real values written to gitignored `apps/frontend/.env.local` and `packages/database/.env` (secret key + access token), confirmed untracked via `git status --ignored`.

## Phase 3 — Database schema & migrations
- [x] All 19 migrations (`20260823120000` through `20260823121800`) written to `packages/database/supabase/migrations/` and applied to the **hosted** project (local dev still blocked, see Phase 2 — user decided to proceed directly against the hosted project since it wasn't yet serving any traffic).
- [x] Fixed a real ordering bug found while writing these: the draft plan's `012_notices.sql` had the `notices` table's RLS policy calling `manages_apartment()`, which isn't defined until `015_rls_helpers.sql` — would have failed applying in order. Moved all of notices' RLS into `016_rls_policies.sql` alongside every other table instead of leaving it inline in `012`.
- [x] Improved `settle_booking_revenue()` (business functions migration) to read the commission percentage from `settings.SYSTEM_COMMISSION_PERCENTAGE` instead of a hardcoded `0.10` — that setting exists specifically for this and nothing was reading it before.
- [x] `notices` table + RLS added
- [x] `v_technician_marketplace` view created
- [x] `mv_monthly_revenue` materialized view created + `pg_cron` refresh scheduled (confirmed: `cron.job` has 1 row)
- [x] Verified against the live database via the Supabase Management API (not just "push succeeded"): 34 tables, 67 RLS policies (hand-counted expected from the migration file — exact match), 20 enums, 1 materialized view, 10 seeded categories, 2 seeded settings, 1 cron job, and **every one of the 34 tables has both `relrowsecurity` and `relforcerowsecurity` true** — no table was left accidentally unprotected.

**Incident during this phase, resolved:** the hosted project was not empty when first pushed to — it already had a full, unrelated pre-existing schema (`users`/`roles`/`permissions`/`role_permissions`/`sessions`/`refresh_tokens`/`email_verifications`/`password_reset_tokens`/`resident_documents`/`occupancy_history`/`mv_monthly_occupancy`, a full-text search index, and more — not something this migration created, and not matching either the audited Prisma schema or this plan's design). Investigated via the Management API (`database/query` endpoint — much faster than the local Docker-dependent `db dump`, which was itself stuck on the same network issue) rather than assumed. Confirmed with the user that it was disposable before dropping it: `drop schema public cascade` + recreate with standard Supabase grants + cleared `supabase_migrations.schema_migrations`, then reapplied all 19 migrations cleanly. Worth knowing if `rohkfyamfwisfuohzkvm` turns out to have other unexpected history — this wasn't the first thing ever pushed to it.

## Phase 4 — Supabase Auth
- [ ] `signUp`/`signInWithPassword` wired into register/login pages
- [ ] `handle_new_user` trigger verified
- [ ] Role-based post-login redirect (fixes hardcoded `/resident` redirect bug)
- [ ] `auth-provider.tsx` moved off `localStorage`
- [ ] NestJS `auth` module retired

## Phase 5 — Row Level Security
- [ ] RLS helper functions deployed
- [ ] All 34 tables: RLS enabled + forced + policies applied
- [ ] Automated RLS test matrix (6 roles × 34 tables × 4 ops) passing
- [ ] 4 targeted regression tests passing (wallet cross-access, review non-participant, role self-escalation, technician self-verify)

## Phase 6 — Frontend Supabase plumbing
- [ ] `lib/supabase/client.ts` + `server.ts`
- [ ] `middleware.ts` created and protecting all 4 dashboard prefixes
- [ ] `hooks/`, `queries/`, `mutations/` structure established
- [ ] Error-mapping layer (`lib/errors.ts`)
- [ ] Pagination/soft-delete filters standard in every list query

## Phase 7 — Resident dashboard
- [ ] Overview wired
- [ ] Maintenance (list + create + photo attach) wired
- [ ] Wallet wired (`payments-initiate` for top-up)
- [ ] AI Assistant wired (real persistence + proxy)
- [ ] Community/notices wired

## Phase 8 — Technician dashboard
- [ ] Jobs wired
- [ ] Bookings + status transitions wired
- [ ] Earnings wired
- [ ] Reviews wired
- [ ] Profile wired

## Phase 9 — Landlord dashboard
- [ ] Properties wired
- [ ] Vacancies (create/publish/archive) wired
- [ ] Applications wired
- [ ] Finance wired

## Phase 10 — Admin dashboard
- [ ] Overview wired
- [ ] Properties wired (property_manager scoping verified)
- [ ] Residents wired
- [ ] Technicians (verify/suspend) wired
- [ ] Maintenance (assignment) wired
- [ ] Finance wired
- [ ] All 4 audit §17 cross-dashboard scenarios pass

## Phase 11 — Postgres RPCs & business logic
- [ ] `transfer_wallet_funds` deployed + tested under concurrency
- [ ] `settle_booking_revenue` deployed + idempotency verified
- [ ] `recalc_technician_rating` trigger verified
- [ ] Notification triggers (booking status, application status, verification, new message)
- [ ] Audit-log triggers/Edge Function writes verified

## Phase 12 — Supabase Storage
- [ ] 6 buckets created with correct public/private policies
- [ ] `file_records` row created on every upload
- [ ] Cross-user access negative test passes

## Phase 13 — Edge Functions
- [ ] `payments-initiate`
- [ ] `payments-webhook` (idempotency verified)
- [ ] `ai-diagnose-proxy`
- [ ] `reports-export`
- [ ] `assign-technician` (trigger-based, not polling)

## Phase 14 — Realtime
- [ ] Notifications subscription
- [ ] Chat subscription
- [ ] Per-open-booking status subscription
- [ ] Confirmed no other channels exist

## Phase 15 — Public marketplace & cross-dashboard verification
- [ ] Marketing vacancies page reads real `vacancies` table
- [ ] All 4 audit §17 scenarios re-verified end-to-end

## Phase 16 — Mock data removal
- [ ] `lib/mock/admin.ts` removed
- [ ] `lib/mock/landlord.ts` removed
- [ ] `lib/mock/resident.ts` removed
- [ ] `lib/mock/technician.ts` removed
- [ ] Orphaned files deleted (`app/dashboard/page.tsx`, empty `(auth)/login/`, `unit-grid.tsx`, marketing `mockVacancies`)

## Phase 17 — NestJS retirement
- [ ] Module-by-module retirement table (plan.md Phase 17) fully checked off
- [ ] `apps/backend` removed or archived
- [ ] `apps/ai-service` confirmed kept, caller updated to Edge Function

## Phase 18 — Testing
- [ ] Unit tests
- [ ] Database/RLS/RPC tests
- [ ] Integration tests
- [ ] End-to-end lifecycle test
- [ ] Security acceptance tests (7 scenarios)
- [ ] Financial acceptance tests

## Phase 19 — Observability & performance
- [ ] Sentry wired (frontend + Edge Functions)
- [ ] Query-plan review on high-traffic views
- [ ] Pagination confirmed shipped, not just planned

## Phase 20 — Staging & seed data
- [ ] `seed.sql` covers all roles + all status values
- [ ] Staging confirmed on sandbox-only payment credentials

## Phase 21 — Production deployment
- [ ] Full readiness gate (plan.md Phase 21) checked off
- [ ] Production deploy complete
- [ ] Post-deploy smoke tests pass
