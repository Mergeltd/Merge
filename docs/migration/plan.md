# MERGE — Supabase Migration & System Integration Plan

**Project:** MERGE Property Management & Maintenance Marketplace
**Target architecture:** Next.js frontend talking directly to Supabase (Postgres + Auth + Storage + Realtime), Postgres RPCs for atomic multi-table writes, a small set of Edge Functions for anything that needs a server-held secret.
**Status:** Approved direction, execution not yet started (Phase 0 is the next action).
**Companion document:** [`progress.md`](./progress.md) — same phase list, as checkboxes. Update it as work lands; this file describes *what* and *why*, `progress.md` tracks *done or not*.
**Full schema / RLS / SQL reference:** the *MERGE Supabase Migration Audit* (published artifact, 2026-08-23) contains the complete, copy-pasteable SQL for every migration, RPC, and RLS policy referenced below by section number (e.g. "audit §14"). This plan does not repeat that SQL — it sequences applying it and wiring the frontend to it. Where this plan adds something the audit didn't fully specify (the `notices` table, a couple of ADRs), the SQL is inline here.

---

## 0. How to read this document

Each phase below has the same shape: **Objective → Tasks → Concrete targets (real paths in this repo) → Exit criteria.** Phases 0–6 are a strict sequence — each depends on the one before it. From Phase 7 onward, the four dashboard phases (7–10) and Phases 11–13 (RPCs, Storage, Edge Functions) can run in parallel once Phase 6 is done; Phase 14 (Realtime) should not start early, on purpose (see Phase 14).

Architecture, in one picture:

```
Next.js Frontend  (Resident / Technician / Landlord / Admin dashboards)
        |
        |  supabase-js: auth, from(), storage, channel()
        v
Supabase  ->  PostgreSQL + Row Level Security   (source of truth, ~90% of traffic)
        |          |
        |          +--> Postgres RPCs (SECURITY DEFINER functions) for atomic writes:
        |                 wallet transfers, revenue settlement, rating recalculation
        |
        +--> Realtime  (notifications, chat, open-booking status only — see Phase 14)
        |
        +--> Edge Functions  (only where a browser can't safely hold a secret)
                  |
                  +--> payments-initiate / payments-webhook  (Stripe, M-Pesa Daraja)
                  +--> ai-diagnose-proxy  ->  apps/ai-service (FastAPI/Gemini)
                  +--> reports-export
                  +--> assign-technician
```

The existing dashboard UI (`apps/frontend/src/app/(dashboard)/{admin,landlord,resident,technician}`) and the existing Prisma schema (`packages/database/schema.prisma`, 36 models) are the two assets this plan keeps. The NestJS CRUD/auth layer (`apps/backend`) is retired, not ported — its useful business rules (ownership checks, the 90/10 revenue split, status-transition rules) get translated into RLS policies and RPCs, not copied as TypeScript.

---

## 1. Ground rules

These apply for the whole migration, not just one phase.

| # | Rule | Why |
|---|---|---|
| 1 | Don't rewrite dashboard UI unless a real integration requirement demands it. | The UI is already good; the gap is wiring, not design. |
| 2 | Don't migrate mock data blindly — verify each field against a real table/column before wiring it. | `lib/mock/*.ts` shapes were invented per-dashboard and don't all match the schema 1:1. |
| 3 | Never expose the Supabase **service-role** key or any gateway secret to frontend code. | Anything with that key bypasses RLS entirely. |
| 4 | Don't flip a table's frontend access on before its RLS policies are written *and* tested against the matrix in Phase 5. | RLS enabled with no policy is safe (default-deny); RLS enabled with an *incomplete* policy is where real bugs hide. |
| 5 | Don't delete a NestJS module until its replacement (RLS policy, RPC, or Edge Function) is live and tested. | Keeps the app demoable throughout instead of broken mid-migration. |
| 6 | Don't add Realtime before the same data works correctly over a plain query. | Debugging a subscription on top of a wrong base query wastes more time than it saves. |
| 7 | Don't wire any payment UI before the wallet/ledger invariants (non-negative balance, one settlement per booking, idempotent webhook) are enforced in the database, not just in application code. | This is the one domain where a bug is a financial loss, not a UI glitch. |
| 8 | Don't keep more than one source of truth for shared types. | `packages/types` and `apps/frontend/src/shared-types` are already duplicated and already drifted (see Phase 1). |
| 9 | Every phase ends with an exit-criteria checklist in `progress.md` before the next phase starts. | Makes "done" a specific, checkable claim instead of a feeling. |

---

## Phase 0 — Repository freeze & baseline

**Objective:** a known-good, recorded starting point before anything architectural changes.

**Tasks**
- Create a migration branch (e.g. `feat/supabase-migration`) off `main`.
- Record the current commit hash and tag it (e.g. `pre-supabase-migration`).
- Run `pnpm build`, `pnpm lint`, `pnpm test` on `main` as it stands today and record the actual output (pass/fail/skip) — don't assume they're green; write down what's real.
- Copy `apps/backend/.env.example` and `apps/frontend/.env.example` into `docs/migration/baseline-env.md` as a record of what env surface existed before Supabase vars are added.
- Do **not** delete `apps/backend`, `lib/mock/*.ts`, or `apps/admin` yet — they're reference material until their replacements are verified (Rule 5, Rule 1).

**Deliverables:** `docs/migration/baseline.md` (commit hash, build/lint/test output, package versions), `docs/migration/baseline-env.md`.

**Exit criteria:** branch exists, tag exists, baseline doc committed, repo still builds and runs exactly as before (this phase changes no application code).

---

## Phase 1 — Cleanup & contract stabilization

**Objective:** remove the ambiguities that would otherwise get baked into a live schema.

### 1.1 Canonical roles (ADR-001)

The current codebase defines the role set three different, mutually inconsistent ways:

| Source | Roles listed |
|---|---|
| `packages/types/index.ts` → `UserRole` const | `SUPER_ADMIN`, `APARTMENT_ADMIN`, `RESIDENT`, `TECHNICIAN`, `LANDLORD` (no `PROPERTY_MANAGER`) |
| `packages/types/index.ts` → `RegisterUserSchema` role enum | `RESIDENT`, `TECHNICIAN`, `PROPERTY_MANAGER`, `LANDLORD` (no `SUPER_ADMIN`/`APARTMENT_ADMIN`) |
| `apps/frontend/src/shared-types/index.ts` | byte-identical duplicate of both of the above, same inconsistency |

**Decision:** one canonical 6-value Postgres enum, used everywhere from here on:

```sql
create type user_role as enum (
  'super_admin', 'apartment_admin', 'property_manager',
  'landlord', 'resident', 'technician'
);
```

This also settles who can self-register vs. who must be provisioned — and conveniently, the *existing* `RegisterUserSchema` already only allows `resident`/`technician`/`property_manager`/`landlord`, which is the right policy: **`super_admin` and `apartment_admin` are never selectable on the public register form; they're admin-created only.** No frontend change needed here beyond widening the underlying enum — the form's own allowed-values list stays as-is.

### 1.2 ADR-002 — where `property_manager` lands in the UI

The Prisma schema has a full `PropertyManager` model, but none of the 4 built dashboards is a property-manager surface, and the draft plan left this as an open "appropriate management surface" placeholder. Per Rule 1 (don't build new UI without a real requirement), the resolution is:

> `property_manager` routes to `/admin`, the same as `apartment_admin`. It is **not** the same permission level — a property manager's writes are scoped by the `manages_apartment()` RLS helper (audit §14) to only the apartments they're assigned to via `property_manager_apartments`, whereas `apartment_admin`/`super_admin` see everything. The dashboard UI doesn't need to change for this to work correctly; RLS is what makes a property manager's `/admin` view naturally show only their scope. Revisit only if product feedback says property managers need a visibly different UI, not just a scoped one.

### 1.3 Consolidate types (ADR-007)

Delete both hand-written duplicates once Phase 3 exists:

```
packages/types/index.ts              -> superseded
apps/frontend/src/shared-types/      -> superseded
                v
supabase gen types typescript --project-id <ref> > packages/database/supabase-types.ts
                v
Frontend and any remaining server code import from there.
```

Zod validation schemas for *input* (register form, maintenance request form, etc.) still need to be hand-written — generated types cover table shapes, not input validation — but there should be exactly **one** copy of each, living in `packages/types`, imported by the frontend rather than re-declared in `shared-types`.

### 1.4 Orphaned code — mark before touching

Don't delete yet (Rule 1/5) — just tag each item so Phase 16/17 know what's safe to remove and what needs a decision:

| Path | Status | Note |
|---|---|---|
| `apps/frontend/src/app/dashboard/page.tsx` | **DELETE** (Phase 16) | Orphaned prototype outside the real `(dashboard)` route group; not linked from any nav; duplicates what `(dashboard)/admin/properties` already does. |
| `apps/frontend/src/app/(auth)/login/` | **DELETE** (Phase 16) | Empty directory, no files. |
| `apps/frontend/src/components/chat/chat-window.tsx` | **DELETE or REPURPOSE** (Phase 13, when chat is wired) | Never imported anywhere today; decide when building real chat UI whether to reuse or replace. |
| `apps/frontend/src/components/apartment/unit-grid.tsx` | **DELETE** (Phase 16) | Only used by the orphaned `/dashboard` page above. |
| `apps/frontend/src/services/maintenance.service.ts` | **REPLACE** (Phase 7) | Real `fetch` to the old NestJS endpoint, never actually called from any component — becomes the Supabase-backed version in Phase 7. |
| `apps/admin/` | **KEEP, unused, out of scope** | Unrelated `create-next-app` scaffold (Next 16, different version from `apps/frontend`'s Next 14). Not the real admin dashboard — do not confuse the two. Leave alone unless the team decides to repurpose it later. |
| `apps/frontend/src/app/(marketing)/vacancies/vacancies-client.tsx`'s local `mockVacancies` | **DELETE** (Phase 15) | Separate, inconsistent mock data (overlapping ids with `lib/mock/landlord.ts`, unrelated properties) — replaced by a public read against `vacancies`. |

**Exit criteria:** `user_role` enum decision recorded, register-form role list confirmed unchanged, orphan table above committed to `docs/migration/plan.md` (this file), no code deleted yet.

---

## Phase 2 — Supabase project setup

**Objective:** stand up the actual platform.

**Tasks**
1. Create the Supabase project (pick the production region deliberately — likely closest to the primary user base, not the deploy region by default).
2. Install/configure the Supabase CLI locally; `supabase login`, `supabase link --project-ref <ref>`.
3. `supabase init` at the repo root (or under `packages/database/`, matching where the Prisma schema already lives — see decision needed below) to create:
   ```
   supabase/
     config.toml
     migrations/
     functions/
     seed.sql
     tests/
   ```
4. Decide file placement: since `packages/database` is the existing convention for "the database package" in this monorepo, put the `supabase/` directory there (`packages/database/supabase/`) rather than at repo root, so `packages/database` stays the single place a new contributor looks for schema/migrations.
5. Set up local dev (`supabase start`) so migrations can be tested against a local Postgres before touching the hosted project.
6. Add `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `apps/frontend/.env.example` (currently only has `NEXT_PUBLIC_API_URL`/`NEXT_PUBLIC_SITE_URL`).

**Exit criteria:** `supabase status` runs locally, project is linked, CLI can push/pull migrations, env vars documented in `.env.example` (not committed with real values).

---

## Phase 3 — Database schema & migrations

**Objective:** apply the schema the audit already designed (audit §11), plus the one addition the audit flagged as missing.

**Tasks** — apply in this order (matches audit §11/§12/§14 exactly):

```
000_extensions.sql            001_enums.sql              002_profiles.sql
003_property.sql              004_role_extensions.sql    005_maintenance_marketplace.sql
006_ledger.sql                007_vacancy_marketplace.sql 008_messaging.sql
009_reviews_audit.sql         010_ai.sql                 011_system.sql
012_notices.sql               013_updated_at_trigger.sql 014_business_functions.sql
015_rls_helpers.sql           016_rls_policies.sql       017_views.sql
018_seed_reference_data.sql
```

(Renumbered from the draft's 000–017 to insert `012_notices.sql` in dependency order, right after the other domain tables and before the cross-cutting trigger/function/RLS migrations — notices depends on `apartments` and `profiles`, both already created by 004.)

**012_notices.sql** — the one table the audit identified as needed but not yet designed (resident Community page, audit §21):

```sql
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

alter table public.notices enable row level security;
alter table public.notices force row level security;

create policy "notices_read_own_apartment" on public.notices for select
  using (
    published_at is not null and (expires_at is null or expires_at > now())
    and exists (
      select 1 from public.residents r
      where r.apartment_id = notices.apartment_id and r.user_id = auth.uid()
    )
    or public.manages_apartment(apartment_id)
  );
create policy "notices_write_managers" on public.notices for all
  using (public.manages_apartment(apartment_id)) with check (public.manages_apartment(apartment_id));
```

**017_views.sql** — the two views the audit's performance section recommended (audit §20):
- `v_technician_marketplace` — verified technicians joined to profile/categories/rating, feeding both the technician "Jobs" page and the public marketplace.
- `mv_monthly_revenue` — a *real, defined* materialized view (the current backend's `forecasting.service.ts` queries a view by this exact name that doesn't exist anywhere in the repo — this migration is what makes it real), refreshed via `pg_cron` on a daily schedule.

**018_seed_reference_data.sql** — categories (Plumbing, Electrical, HVAC, etc.) and default `settings` rows (`SYSTEM_COMMISSION_PERCENTAGE = 10`, etc.) — reference data every environment needs, not test/fake data (that's Phase 20's `seed.sql`).

**Exit criteria:** all 18 migrations apply cleanly to a fresh local Supabase instance; every FK/index from the audit's schema is present; `supabase db diff` shows no drift between migrations and local DB state.

---

## Phase 4 — Supabase Auth

**Objective:** replace the non-functional custom JWT auth (the current `AuthGuard` never actually verifies a token — see audit §19 finding #1) with Supabase Auth.

**Tasks**
- Wire `supabase.auth.signUp({ email, password, options: { data: { first_name, last_name, role } } })` into `apps/frontend/src/app/register/register-client.tsx`, replacing the current `authService.register()` call to the NestJS endpoint.
- Confirm the `handle_new_user` trigger (audit §11, migration 002) correctly creates a `profiles` row with the role from signup metadata.
- Wire `supabase.auth.signInWithPassword()` into `apps/frontend/src/app/login/login-client.tsx`, replacing `authService.login()`. **This also fixes the existing hardcoded-redirect bug** (`login-client.tsx` currently always sends every account to `/resident` regardless of role) — the post-login redirect should read `profiles.role` and route accordingly (see Phase 6's middleware, which does this correctly).
- Replace `apps/frontend/src/providers/auth-provider.tsx`'s `localStorage` token handling with Supabase's session (cookie-based via `@supabase/ssr`, wired in Phase 6).
- Retire `apps/backend/src/modules/auth` once the above is live and tested (Rule 5) — not before.

**Exit criteria:** register creates a real `auth.users` + `profiles` pair for each of the 4 self-serve roles; login redirects to the correct dashboard per role; `super_admin`/`apartment_admin` accounts exist only via direct admin provisioning (documented in `docs/migration/baseline.md` — e.g. `supabase.auth.admin.createUser()` from a one-off script, not the public form).

---

## Phase 5 — Row Level Security

**Objective:** every table secured before any frontend code is allowed to query it in Phase 6+.

**Tasks**
- Apply audit §14 in full: `current_role()`, `is_admin()`, `is_super_admin()`, `manages_apartment()` helpers, then `enable row level security` + `force row level security` + policies on all 34 tables (33 from the audit + `notices` from Phase 3).
- Build the RLS test matrix — 6 roles × 34 tables × 4 operations (SELECT/INSERT/UPDATE/DELETE) — as an actual automated test suite (`supabase/tests/`, using `pgTAP` or a scripted set of role-switched queries), not a manual one-off check. This is the artifact that catches authorization regressions later; treat it as permanent, not a one-time gate.
- Run the specific security acceptance tests the audit called out as **currently failing** in the NestJS backend, to confirm RLS actually closes them:
  - a resident reading/writing a wallet that isn't theirs → must be rejected
  - a non-participant submitting a review for a booking they weren't part of → must be rejected (`reviews_insert_participant` policy)
  - a resident attempting `update profiles set role = 'super_admin'` → must be rejected (`profiles_update_own`'s pinned-role `WITH CHECK`)
  - a technician attempting to self-verify (`update technicians set verification_status = 'verified'`) → must be rejected

**Exit criteria:** RLS test matrix passes for all 34 tables; the 4 specific regression tests above pass; no table has RLS enabled without at least one policy (an accidental all-deny table is a silent outage, not a security win — check for it explicitly).

---

## Phase 6 — Frontend Supabase plumbing

**Objective:** the shared infrastructure every dashboard phase (7–10) builds on, so it's written once, correctly, instead of copy-pasted per dashboard.

**Tasks — files to create:**

```
apps/frontend/src/
  lib/supabase/
    client.ts        # createBrowserClient — browser-side
    server.ts         # createServerClient — server components / route handlers
  middleware.ts        # NEW FILE — currently doesn't exist at all; today /admin,
                        # /landlord, /resident, /technician are reachable by anyone,
                        # authenticated or not (audit §19 finding #2)
  hooks/
    use-auth.ts
    use-profile.ts
  services/             # one per domain, replacing fetch-to-NestJS calls
  queries/               # TanStack Query query definitions (already installed,
  mutations/              # currently 0 call sites anywhere in the app — audit §3)
```

- `middleware.ts` protects the 4 dashboard route prefixes and redirects by `profiles.role`, per the table in Phase 1.2 (`property_manager` → `/admin`, scoped by RLS not by middleware).
- Establish the query/mutation pattern once: `hooks/use-x.ts` wraps a `queries/x.ts` function in `useQuery`/`useMutation`, page components only ever call the hook. This is what makes Phases 7–10 mechanical instead of ad hoc.
- Every list query gets, from the start (not retrofitted later): `.is('deleted_at', null)` where the table has soft-delete, `.range()` pagination on the high-volume tables (`maintenance_requests`, `transactions`, `messages`, `notifications`, `audit_logs`, `activity_logs` — audit §20), and explicit loading/error/empty states (the dashboards already have empty-state UI built — audit §5 — reuse it, don't rebuild it).
- Error mapping: a small `lib/errors.ts` that maps known Postgres errors (`insufficient_funds` from the wallet RPC, unique-constraint violations on `vacancy_applications`/`reviews`) to user-facing messages, so raw Postgres errors never reach the UI.

**Exit criteria:** an unauthenticated request to any dashboard route redirects to `/login`; an authenticated resident hitting `/admin` redirects away; one real end-to-end query (e.g. `profiles` self-read) works from a page component through the full stack.

---

## Phase 7 — Resident dashboard

Replace `lib/mock/resident.ts` throughout `apps/frontend/src/app/(dashboard)/resident/`.

| Page | Replace | With |
|---|---|---|
| Overview | static stats | aggregate query over own `maintenance_requests`, `wallets`, `notifications` |
| Maintenance | `maintenanceRequests` mock, fake modal submit | `useMyMaintenanceRequests()` read; `NewRequestModal` submit → real `insert` (replaces the orphaned `services/maintenance.service.ts` per Phase 1.4); "Attach Photos" (currently fully inert, no `onChange`) wired to Supabase Storage `maintenance-media` bucket (Phase 12), writing a `file_records` row and appending its key to `maintenance_requests.media_keys` |
| Wallet | static `walletSummary` | real `wallets`/`transactions` read; `TopUpModal` calls `payments-initiate` (Phase 13), not a direct balance edit |
| AI Assistant | client-side keyword-matcher (`getReply()`, no LLM call at all) | real `ai_conversations`/`ai_messages` persistence, calls routed through `ai-diagnose-proxy` (Phase 13) |
| Community | `notices` mock | real `notices` table (Phase 3), scoped to the resident's own apartment |

**Exit criteria:** a resident's real maintenance request, submitted through the actual UI, is a durable database row — confirmed by the Phase 8/10 cross-dashboard test in Phase 15.

---

## Phase 8 — Technician dashboard

Replace `lib/mock/technician.ts` throughout `apps/frontend/src/app/(dashboard)/technician/`.

| Page | Replace | With |
|---|---|---|
| Jobs | `availableJobs` mock, "Accept Job" as local `Set` state | `maintenance_requests where status='open'` filtered by the technician's own categories; accept creates a `bookings` row |
| Bookings | `useState(initialBookings)`, all transitions local-only | real `bookings` read/update, status transitions constrained to the valid sequence (`proposed → accepted → in_route → work_started → completed`; reject invalid jumps at the RPC/RLS level, not just in the UI) |
| Earnings | static summary | real `wallets`/`transactions`/`revenue_shares`; `WithdrawModal` goes through a payout Edge Function/flow, not a direct balance edit |
| Reviews | static array | real `reviews` filtered by `target_technician_id` |
| Profile | local-only availability toggle | real `technicians` update (bio, availability); verification status itself stays admin-only per `technicians_admin_verify` (audit §14) |

**Exit criteria:** a technician accepting a job in Phase 7's request creates a real booking visible to both the resident and the admin dashboard.

---

## Phase 9 — Landlord dashboard

Replace `lib/mock/landlord.ts` throughout `apps/frontend/src/app/(dashboard)/landlord/`.

| Page | Replace | With |
|---|---|---|
| Properties | `ownedProperties` mock | `apartments`/`units` scoped via `landlord_apartments` |
| Vacancies | `CreateListingModal` (currently fakes success **and discards the submitted data** — audit §5), "Publish"/"Archive" as local state | real `vacancies` CRUD; publish flips `draft → published`, immediately visible to the public marketplace (Phase 15) since it's the same row, not a sync step |
| Applications | local-state Approve/Decline | real `vacancy_applications`, scoped to the landlord's own vacancies (`va_update_owner_only`, audit §14 — closes a gap the old backend's `vacancy.service.ts` left as an unimplemented ownership-check comment) |
| Finance | static payout data | real `transactions` scoped to the landlord's wallet |

**Exit criteria:** a published vacancy appears on the public marketplace page without any manual sync step; an application submitted against it is visible only to that vacancy's landlord.

---

## Phase 10 — Admin dashboard

Migrated last, deliberately — it's the one dashboard that reads across every other domain, so it's the natural integration-testing surface once 7–9 are real.

Replace `lib/mock/admin.ts` throughout `apps/frontend/src/app/(dashboard)/admin/`.

| Page | Replace | With |
|---|---|---|
| Overview | computed stats over mock arrays | real aggregate queries / `v_technician_marketplace` view / `mv_monthly_revenue` |
| Properties | static `buildings`/`units` | real, scoped by `manages_apartment()` — this is where the `property_manager` decision from Phase 1.2 actually shows up: a property manager sees the same page, scoped to fewer rows |
| Residents | static array | real `residents` join `profiles` |
| Technicians | "Approve"/"Reject"/"Suspend" as local state (audit §5) | real `technicians.verification_status` update — this is the one action in the whole app the old backend actually gated correctly (`SUPER_ADMIN`-only); keep that constraint in `technicians_admin_verify` |
| Maintenance | fake `setTimeout` assignment modal | real `bookings` insert (technician assignment) |
| Finance | static `revenueByMonth`/`transactions` | real `transactions`/`mv_monthly_revenue` |

**Exit criteria:** all 4 scenarios in the audit's "Dashboard Communication" section (§17) pass for real: resident submits → admin sees it; admin assigns → resident sees the booking; technician progresses status → resident sees it; booking completes → admin's finance page reflects the settlement from Phase 11's RPC.

---

## Phase 11 — Postgres RPCs & business logic

**Objective:** the atomic multi-table operations that must not be split across separate client round-trips (audit §12 has the full SQL for the first three; the rest are new, scoped from the draft plan's suggestions).

| RPC | Purpose | Notes |
|---|---|---|
| `transfer_wallet_funds` | Atomic debit + credit + transaction row | Audit §12. Locks the sender row (`for update`), rejects on insufficient balance. |
| `settle_booking_revenue` | 90/10 platform/technician split on completion | Audit §12. **Must be idempotent** — a booking settling twice is a real financial bug; use `on conflict (booking_id) do update` as already written, and additionally guard the call site so a completed booking can only trigger settlement once (check `revenue_shares.is_settled` before calling). |
| `recalc_technician_rating` | Trigger, fires after review insert | Audit §12, already a trigger not a callable RPC — no client wiring needed. |
| `accept_booking` | Booking status → `accepted` + notification insert | New — evaluate whether this needs to be an RPC or is safe as a plain RLS-gated `update` + a `notifications` insert done by a trigger (`after update on bookings when status changes`) instead of a second client call. Prefer the trigger — fewer round trips, can't be half-done by a dropped connection. |
| `verify_technician` | `technicians.verification_status` → `verified` + notification | Same call: trigger on `technicians` status change, not a bespoke RPC, unless the verification flow needs additional side effects later. |

**Notification creation, generally:** don't scatter `insert into notifications` calls across every mutation call site in the frontend (that's how the old backend ended up with a real audit-log service nobody called — audit §19 finding #6). Prefer database triggers on the relevant tables (`bookings` status change, `vacancy_applications` status change, `technicians` verification change, new `messages` row) so a notification is a structural consequence of the state change, not something a developer has to remember.

**Audit logging, generally:** same fix, same reasoning. No client `INSERT` policy exists on `audit_logs` (audit §14) — every audit row is written by a trigger or an Edge Function using the service-role key, which is what makes audit logging non-optional this time instead of a service nobody calls.

**Exit criteria:** wallet balances never go negative under concurrent transfer attempts (test with concurrent requests, not just sequential); a booking cannot be settled twice; every state-changing action tested in Phase 8–10 produces the correct notification without a matching manual "and also insert a notification" line at each call site.

---

## Phase 12 — Supabase Storage

**Objective:** replace the currently-conceptual-only Supabase Storage references (3 Prisma field comments, no actual client code anywhere — audit §2) with real buckets.

**Buckets:**

```
avatars              — public read, owner write
maintenance-media    — private, resident (own request) + assigned technician + admin
documents            — private, vacancy-application documents (credit report, rent history)
property-media       — apartment/unit photos, admin/landlord write, public read
vacancy-media        — listing photos, landlord (own) write, public read once vacancy is published
chat-media           — private, chat participants only
```

(Dropped the draft's separate `reports` bucket — generated reports are produced on-demand by the `reports-export` Edge Function per Phase 13 and streamed back, not stored; add a bucket for them only if caching exports becomes an actual requirement.)

Every upload creates a `file_records` row (already in the schema, audit §11) — this is what lets `file_records_select_own_or_admin` (audit §14) govern who can even see that a file exists, on top of the bucket-level storage policy governing the object itself.

**Exit criteria:** a resident cannot fetch another resident's `maintenance-media` file by guessing/enumerating its storage path — storage policies must independently enforce this, not rely on the URL being hard to guess.

---

## Phase 13 — Edge Functions

**Objective:** the handful of things that categorically cannot be client-side, because they need a secret a browser must never hold (audit §10, §19 finding #7).

```
supabase/functions/
  payments-initiate/     — validates request, creates a pending transaction, calls Stripe/M-Pesa with the secret key server-side, returns only a safe client response (checkout URL / STK push reference)
  payments-webhook/      — verifies gateway signature, finds the pending transaction by gateway reference, must be idempotent (a webhook fired twice must not credit twice), updates the transaction + calls transfer_wallet_funds()
  ai-diagnose-proxy/     — holds the apps/ai-service internal URL server-side (today it's hardcoded to http://localhost:8000 inside the NestJS ai.service.ts — moving, not rebuilding, the proxy); persists the exchange into ai_messages
  reports-export/        — CSV/PDF generation reading real tables (replaces the current reports.controller.ts, which returns a hardcoded row regardless of the query param — audit §19); must check the caller's role before returning admin-only data
  assign-technician/     — replaces the BullMQ maintenance-jobs queue (which required Redis); see the note below on how to avoid needing Redis at all
```

**Replacing BullMQ without Redis:** the old `maintenance.processor.ts` used a BullMQ queue backed by Redis for the "assign a technician" job. Supabase has no built-in queue, so pick one:
- **Preferred:** a `create trigger ... after insert on maintenance_requests` that calls the `assign-technician` Edge Function directly via Supabase's Database Webhooks (near-instant, no polling, no extra infrastructure).
- **Fallback**, only if the matching algorithm turns out to need to run on a schedule rather than on-insert (e.g., a periodic re-scan for unassigned urgent requests): a small `job_queue` table + `pg_cron` invoking the Edge Function on a schedule.

Start with the trigger approach — it's simpler and matches the actual current trigger ("a request was just filed") better than a polling queue does.

**Exit criteria:** no Stripe/M-Pesa/service-role/ai-service-URL secret exists in any file under `apps/frontend`; a payment webhook fired twice does not double-credit a wallet; a new maintenance request triggers assignment without any frontend code polling for it.

---

## Phase 14 — Realtime

**Objective:** live updates, added last and only where they earn their cost (audit §18).

| Data | Realtime? | Reasoning |
|---|---|---|
| Notifications | **Yes** | Latency is directly user-visible; the alternative is aggressive polling. |
| Chat messages | **Yes** | Not a chat feature without it. |
| A specific open booking's status | **Yes, scoped** | Subscribe only while that booking's detail view is open — not a global subscription. |
| Everything else (jobs marketplace, admin finance, vacancy listings) | **No** | Refetch-on-focus (TanStack Query's default) is enough; a standing channel per idle tab is pure server load for no visible benefit. |

Implementation pattern: `postgres_changes` subscription → `queryClient.invalidateQuery()` → existing TanStack Query cache re-renders. Don't stand up a second, separate realtime store — Realtime is a cache-invalidation signal, not a parallel source of truth.

**Exit criteria:** exactly 3 subscription types exist in the codebase (notifications, chat, per-open-booking); nothing else opens a channel.

---

## Phase 15 — Public marketplace & final cross-dashboard verification

- Replace `(marketing)/vacancies/vacancies-client.tsx`'s local `mockVacancies` with `supabase.from('vacancies').select().eq('status', 'published')` — this works unauthenticated under the `vacancies_public_read_published` policy (audit §14), no special-casing needed for the public site vs. the logged-in dashboards.
- Re-run all 4 scenarios from audit §17 end-to-end, now for real: resident→admin, admin→resident (assignment), technician→resident (status), system→user (notification). These were the audit's concrete evidence that the current app has zero cross-dashboard communication; this phase is where that evidence should flip to "passes."

**Exit criteria:** the public marketplace page and the landlord dashboard's vacancy list are provably reading the same table (edit one, see it in the other, no separate sync).

---

## Phase 16 — Mock data removal

Only after each dashboard's replacement has passed its own exit criteria (Phases 7–10) — don't delete a mock file while any sibling page in that dashboard still imports it (audit §16's sequencing warning: partially-wired dashboards show visibly inconsistent data).

Checklist per mock file (`lib/mock/{admin,landlord,resident,technician}.ts`):
```
[ ] Every importing component identified
[ ] Every field mapped to a real column (Phase 1 Rule 2 — no blind mapping)
[ ] Query + mutation implemented and tested
[ ] Reload persistence verified (today nothing survives a refresh — this is the regression test)
[ ] Cross-dashboard visibility verified where applicable
[ ] Mock import removed
[ ] Mock file deleted
```
Also delete at this point, per Phase 1.4's table: `app/dashboard/page.tsx`, `app/(auth)/login/`, `components/apartment/unit-grid.tsx`, the marketing page's `mockVacancies`.

---

## Phase 17 — NestJS retirement

Retire module by module, only after its replacement is live (Rule 5):

| NestJS module | Replacement | Retire after |
|---|---|---|
| `auth` | Supabase Auth | Phase 4 |
| `apartments`, `residents`, `categories`, `technicians`, `vacancies` (CRUD) | Supabase client + RLS | Phases 7–10 |
| `maintenance`, `reviews` | Supabase client + RLS + `reviews_insert_participant` policy | Phases 7–10 |
| `wallets`, `payments` | RPCs + Edge Functions | Phase 11, 13 |
| `chat`, `notifications` | Supabase client + Realtime + triggers | Phase 11, 14 |
| `reports` | `reports-export` Edge Function | Phase 13 |
| `analytics` | Views (`v_technician_marketplace`, `mv_monthly_revenue`) + admin dashboard queries | Phase 10 |
| `audit` (currently dead — called by nothing) | Triggers/Edge Functions writing `audit_logs` | Phase 11 |
| `ai` | `ai-diagnose-proxy` Edge Function | Phase 13 |
| `apps/backend` itself | — | Once the table above is empty |

`apps/ai-service` (the FastAPI/Gemini microservice) is **not** retired — it's genuinely functional for `/diagnose` and stays; only its caller changes, from the NestJS proxy to the `ai-diagnose-proxy` Edge Function.

---

## Phase 18 — Testing

Four levels, all necessary, none of them optional given what's financial in this app:

1. **Unit** — validation, status-transition rules, the 90/10 split calculation, role helpers.
2. **Database** — the Phase 5 RLS matrix (6 roles × 34 tables × 4 ops), constraint tests (unique `(booking_id, author_id)` on reviews, non-negative wallet balance, unique transaction reference), RPC tests (concurrent wallet transfers, double-settlement attempt, double-webhook attempt).
3. **Integration** — frontend → Supabase → database, one domain at a time, matching Phases 7–13.
4. **End-to-end** — the full lifecycle in audit §24 and this plan's Phase 15: register → maintenance request → admin assignment → technician acceptance → status progression → completion → revenue settlement → notifications → refresh-persistence at every step.

Security acceptance tests to automate, not just eyeball once (audit §19, §24):
```
resident -> another resident's wallet                 must fail
resident -> role self-escalation                       must fail
landlord -> another landlord's vacancy                 must fail
technician -> self-verification                        must fail
technician -> another technician's booking              must fail
non-participant -> booking chat                         must fail
non-participant -> booking review                       must fail
```

Financial acceptance tests: no negative balances under concurrency; duplicate webhook doesn't double-credit; duplicate settlement doesn't double-pay; failed transactions never flip to successful; transaction references stay unique under concurrent generation.

---

## Phase 19 — Observability & performance

- Error tracking: Sentry SDK is already a backend dependency (unused/no DSN wired today) — configure it for the frontend and Edge Functions instead of leaving it dormant.
- Track: frontend errors, Edge Function errors/latency, payment failures, auth failures, RLS denials (Supabase logs these — alert on spikes, they're either an attack or a policy bug), slow queries, realtime connection drops.
- Before production: review query plans on the highest-traffic list views, confirm every audit-flagged missing pagination (audit §20) actually has `.range()` in the shipped code, confirm `mv_monthly_revenue`'s `pg_cron` refresh is actually scheduled and not just defined.

---

## Phase 20 — Staging & seed data

- `supabase/seed.sql`: one account per role, sample apartments/buildings/units, sample maintenance requests across every status value, sample transactions, sample chats/notifications — enough to exercise every dashboard state (including empty states) without touching real payment credentials.
- Staging must never hold real Stripe/M-Pesa credentials — use their sandbox/test modes exclusively.

---

## Phase 21 — Production deployment & readiness gates

Deployment sequence: Supabase project verified → migrations applied → RLS verified (Phase 5's matrix, run again against the production project, not just local) → Auth verified → Storage policies verified → Edge Functions deployed → env vars configured (only `NEXT_PUBLIC_*` reach the frontend build; every secret stays server-side) → frontend deployed → smoke tests → monitoring enabled.

**Final gate — all of these, not any subset:**
```
[ ] Database:        migrations applied, relationships/indexes/constraints verified
[ ] Authentication:  signup, login, logout, session persistence, role routing all work
[ ] Security:        RLS enabled+tested on all 34 tables, escalation/cross-user access blocked, no secret in frontend code
[ ] Dashboards:      all 4 wired, no mock imports remain
[ ] Cross-dashboard:  all 4 audit §17 scenarios pass in production-equivalent staging
[ ] Financial:        wallet/transaction/settlement/webhook tests from Phase 18 pass
[ ] Realtime:         exactly the 3 scoped subscriptions from Phase 14, nothing broader
[ ] Production infra: monitoring, backups, rollback plan, CI/CD all verified
```

---

## Appendix A — Architecture Decision Log

| ADR | Decision |
|---|---|
| 001 | One canonical `user_role` Postgres enum (6 values) replaces 3 inconsistent definitions across `packages/types` and `apps/frontend/src/shared-types`. |
| 002 | `property_manager` routes to `/admin`, scoped by `manages_apartment()` RLS rather than getting a dedicated dashboard — no new UI required. |
| 003 | Supabase (Postgres + RLS) replaces NestJS as the primary CRUD/data-access layer; NestJS is retired module-by-module, not deleted wholesale. |
| 004 | Supabase Auth replaces the current custom JWT implementation, which never actually verified tokens. |
| 005 | Postgres RLS is the enforcement layer; frontend role checks remain for UX only, never for security. |
| 006 | Postgres RPCs (`SECURITY DEFINER` functions) handle atomic multi-table writes — wallet transfers, revenue settlement. |
| 007 | Edge Functions handle exactly 5 concerns that need a server-held secret: payment initiation, payment webhooks, the AI proxy, report export, and technician auto-assignment. |
| 008 | Notification and audit-log rows are written by database triggers/Edge Functions, never by scattered client-side inserts — closes the exact gap where the old `AuditService` existed but was never called. |
| 009 | TanStack Query (already installed, currently unused) is the client-side server-state cache; Realtime feeds it via `invalidateQuery`, not a separate store. |
| 010 | Generated Supabase types (`supabase gen types typescript`) replace both `packages/types` and `apps/frontend/src/shared-types` as the single source of table-shape truth; hand-written Zod schemas remain, but as a single copy, for input validation only. |
| 011 | Realtime is scoped to exactly 3 things: notifications, chat, and an individually-open booking's status — everything else uses refetch-on-focus. |

## Appendix B — Golden questions for every feature

Before marking anything in `progress.md` done, it should have clear answers to:

```
Where does this data live?            Who owns it?                Who can read it?
Who can change it?                    What happens when it changes?  Which other dashboard depends on it?
How is the operation secured?          How does failure surface to the user?   How is it tested?
```

If any of these is unclear, the feature isn't integrated yet — it just looks integrated.

## Appendix C — Success criterion, in one sentence

A resident registers, gets a role-correct dashboard, files a maintenance request, an admin assigns a technician, the technician accepts and completes the job, revenue settles atomically into the right wallets, everyone involved gets a notification, every one of those steps survives a page refresh, and no unauthenticated or wrong-role request can read or change any of it. That, working end to end, is what "done" means for this migration — not "Supabase is connected."
