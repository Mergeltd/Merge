# Migration Baseline — Phase 0

Recorded 2026-08-23, before any Supabase-migration code changes. See [`plan.md`](./plan.md) Phase 0.

## Branch & commit

- Baseline tag: `pre-supabase-migration` → commit `59993a994c49078583dde8da896ac9d944d49927` (`feat: build the landlord dashboard`, `main`)
- Migration branch: `feat/supabase-migration`, created from the same commit

## Toolchain

- Node: `v24.15.0` (repo requires `>=22.0.0` — satisfied)
- pnpm: `10.28.0`
- Key versions confirmed directly from `package.json`, not the README: `apps/frontend` → Next.js `14.2.3` (README claims 15); `apps/admin` → Next.js `16.2.11` (separate, unrelated scaffold — see plan.md §1.4); `apps/backend` → `@nestjs/core ^10.0.0`, `prisma`/`@prisma/client ^5.14.0`.

## `pnpm build` — PASS

All 4 buildable workspaces (`admin`, `backend`, `frontend`, plus `@merge/database`'s Prisma-generate step) built successfully. 2m38s. One non-fatal warning: `no output files found for task @merge/database#build — check the outputs key in turbo.json` (the Prisma-generate task isn't declared with an `outputs` glob, so Turbo can't cache it — cosmetic, not a failure).

## `pnpm lint` — FAIL (pre-existing, not introduced by this migration)

Two independent, pre-existing problems, worth fixing early since Phase 6+ touches `apps/frontend` heavily:

1. **`apps/backend`**: `eslint` is not recognized as a command — the `eslint` binary isn't resolving in that workspace despite `eslint "{src,apps,libs,test}/**/*.ts" --fix` being the configured lint script. Points at a missing/broken devDependency install for that workspace specifically (build and test both work fine there, so it's isolated to lint tooling).
2. **`apps/frontend`**: `next lint` drops into its first-run interactive setup prompt ("How would you like to configure ESLint?") instead of running — meaning **no ESLint config file has ever been committed for the frontend app**, and `next lint` has apparently never been run non-interactively (e.g. in CI) before now.

`admin`'s lint task did not report a distinct error but is counted among the 3 failed tasks in the turbo summary (`Tasks: 0 successful, 3 total`) — likely short-circuited by the sibling failures rather than a separate issue; re-check once the two problems above are fixed.

**Not fixed as part of Phase 0** — Phase 0 records the baseline honestly, it doesn't repair pre-existing issues. Recommend fixing both before Phase 6 (frontend plumbing) starts, since broken lint tooling will hide real problems in the new Supabase-integration code. Flagged in `progress.md` as a Phase 1 follow-up.

## `pnpm test` — PASS (trivially — coverage is minimal)

Only one test suite exists in the entire monorepo: `apps/backend/src/modules/apartments/apartment.service.spec.ts` (2 tests, both pass, 30.7s — mostly Jest/ts-jest cold-start overhead for 2 assertions). `apps/frontend` and `apps/admin` have no test scripts/suites at all. This matches the audit finding that `apartments` is "the only module with a unit test" anywhere in the backend. Not a blocker for the migration, but means Phase 18 ("Testing") is building test coverage close to from scratch, not extending an existing suite.

## Known pre-existing oddity (not a blocker, noted for awareness)

`apps/backend/.env.example` is saved as UTF-16 (with a BOM), not UTF-8 — it reads back as space-interleaved garbage through a normal UTF-8 text reader. `apps/frontend/.env.example` is plain UTF-8 and fine. Worth normalizing to UTF-8 whenever that file is next touched (e.g. when Phase 2 adds Supabase env vars to the frontend one — the backend file itself may not survive past Phase 4/17 as `apps/backend` gets retired module-by-module).

## Repo state confirmation

Working tree was clean (only the new `docs/migration/` files untracked) before branching — no in-progress uncommitted work existed to protect.
