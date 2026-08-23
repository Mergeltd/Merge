# MERGE — Supabase Migration Progress

Tracks execution of [`plan.md`](./plan.md). Check items off as they land; leave a one-line note + date next to anything non-obvious. Nothing below is checked yet — Phase 0 is the next action.

## Phase 0 — Repository freeze & baseline
- [x] Migration branch created — `feat/supabase-migration`, off `main` @ `59993a9`
- [x] Baseline commit tagged — `pre-supabase-migration`
- [x] `pnpm build` / `pnpm lint` / `pnpm test` output recorded in `baseline.md` — build ✅, test ✅ (1 suite, minimal coverage), lint ❌ (pre-existing, see below)
- [x] `baseline-env.md` written

## Phase 1 — Cleanup & contract stabilization
- [ ] ADR-001 (canonical `user_role`) confirmed
- [ ] ADR-002 (`property_manager` → `/admin`, RLS-scoped) confirmed
- [ ] Orphaned-code table reviewed, no deletions yet
- [ ] **New, found in Phase 0**: fix `apps/backend` lint (`eslint` binary not resolving) and `apps/frontend` lint (no committed ESLint config — `next lint` hits its interactive first-run prompt) before Phase 6 starts. Pre-existing, not introduced by this migration — see `baseline.md`.

## Phase 2 — Supabase project setup
- [ ] Supabase project created (region chosen deliberately)
- [ ] CLI linked, `supabase start` works locally
- [ ] `supabase/` scaffolded under `packages/database/`
- [ ] `.env.example` updated with Supabase vars

## Phase 3 — Database schema & migrations
- [ ] Migrations 000–018 applied locally
- [ ] `notices` table + RLS added
- [ ] `v_technician_marketplace` view created
- [ ] `mv_monthly_revenue` materialized view created + `pg_cron` refresh scheduled
- [ ] `supabase db diff` shows no drift

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
