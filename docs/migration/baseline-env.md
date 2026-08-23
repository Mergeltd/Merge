# Env Surface Baseline — Phase 0

What existed before any Supabase variables were added. Values are the *keys only* — no real secrets are recorded in this repo.

## `apps/backend/.env.example`

```
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
SENTRY_DSN=
```

(File is UTF-16-encoded on disk — see `baseline.md`'s "Known pre-existing oddity" note. Contents above are the decoded keys.)

## `apps/frontend/.env.example`

```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SITE_URL=
```

## What's notably absent from both

No Supabase variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`), no payment gateway keys (Stripe, M-Pesa Daraja), no AI service URL/key — confirming the audit's finding that this is a from-scratch integration, not a partially-configured one. `apps/backend`'s 4 keys above are the entire current secret surface.

## Additions tracked by phase (fill in as each phase lands — see `progress.md`)

- **Phase 2**: `apps/frontend/.env.example` gains `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Phase 13**: Edge Function secrets (`STRIPE_SECRET_KEY`, M-Pesa Daraja credentials, `AI_SERVICE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) are set via `supabase secrets set`, not committed to any `.env.example` in this repo — they never reach frontend code or a frontend-adjacent env file.
