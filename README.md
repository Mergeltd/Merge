# MERGE - Connecting Homes, People & Trusted Services

MERGE is a next-generation, enterprise-grade Property Management & Maintenance Marketplace platform built for modern communities. By digitalizing the post-occupancy phase of residential property lifecycles, MERGE bridges the gap between residents, property managers, landlords, and verified local technicians, introducing an on-demand, secure, and AI-powered service ecosystem.

---

## 🌟 Strategic Pillars

1. **Digital Building Communities:** Every apartment building is modeled as its own private digital environment with its dashboard, localized notices, resident directories, and community boards.
2. **On-Demand Maintenance Marketplace:** A streamlined, geolocated matching system pairing residents needing repairs with nearby certified, background-checked technicians (plumbers, electricians, carpenters, painters, etc.).
3. **Trust & Verification Infrastructure:** Strict role-based verification workflows. Technicians must upload national IDs, business registrations, and certifications for platform admin approval before appearing in search queries.
4. **Technician Collaboration Network:** A first-of-its-kind peer collaboration module. When a job requires multi-disciplinary skills, a technician can invite other specialists directly into the job context with pre-negotiated, contract-enforced, and system-automated revenue splits.
5. **Vacancy & Rental Marketplace:** Landlords can advertise units, and prospective tenants can schedule viewings, submit digital applications, and manage leases.
6. **Unified Payment & Wallet Infrastructure:** Multiple secure wallets (resident, technician, building maintenance fund, and platform commission ledger) integrated with M-Pesa (Daraja API) and Stripe for instant billing, escrow, and splitting.
7. **AI-Driven Operations:** Built-in AI assistants for self-diagnosis of issues, image issue recognition, predictive building maintenance alerts, smart price estimation, and natural language searching.

---

## 🛠️ The Tech Stack

- **Frontend:** Next.js 15 (App Router, Server Components), React 19, TypeScript, Tailwind CSS, ShadCN UI, Framer Motion, TanStack Query, React Hook Form, Zod.
- **Backend:** NestJS, TypeScript, REST API, WebSockets.
- **Database & State:** PostgreSQL (with `pgvector` for AI-RAG embedding storage), Prisma ORM, Redis (caching and pub/sub).
- **Authentication:** Clerk or Better Auth (Secure Session management, multi-tenant RBAC, JWT rotation).
- **Storage:** Supabase Storage (Secure bucket segregation for verification docs, work images, and profile media).
- **Realtime:** Supabase Realtime (WebSockets for chat, job state updates, and tracking).
- **Payments:** M-Pesa Daraja API (STK Push, B2C, C2B), Stripe.
- **Third-Party APIs:** Resend (Transactional emails), Africa's Talking (Transactional SMS), Firebase Cloud Messaging (FCM Push Notifications), Google Maps/Mapbox (Geolocation routing).
- **AI Core:** Gemini 1.5 Pro API & OpenAI GPT-4o, LangChain, vector storage.
- **DevOps & Monitoring:** Docker, Docker Compose, GitHub Actions, Vercel, Railway, Supabase, Sentry, OpenTelemetry.
- **Testing:** Vitest, Playwright, Jest, Supertest.

---

## 🚀 Development Phases

We execute our engineering lifecycle in 11 sequential phases:

*   **Phase 0:** Project Planning & Architecture (Current)
*   **Phase 1:** Authentication, Authorization & RBAC
*   **Phase 2:** Apartment & Community Profile Management
*   **Phase 3:** Technician Onboarding, Verification & Profiles
*   **Phase 4:** Smart Maintenance Requests & Job Lifecycle
*   **Phase 5:** Realtime Messaging, Chat & Global Notifications
*   **Phase 6:** Multi-Wallet Architecture & Multi-Gateway Payments
*   **Phase 7:** Vacancy Marketplace & Rental Application Processing
*   **Phase 8:** Unified Reviews, Ratings, and Platform Analytics
*   **Phase 9:** Intelligent AI Maintenance Assistant & RAG Knowledge Base
*   **Phase 10:** Performance Optimizations, Comprehensive Auditing & CI/CD Deployment

---

## 📂 Repository Structure

The MERGE platform is orchestrated as a high-performance pnpm Workspaces Monorepo (with Turborepo build orchestration) to easily share schemas, validation Zod types, and interfaces across the stack:

*   `apps/frontend`: Next.js 15 application (App Router) — talks directly to Supabase (Postgres + Auth + Storage + Realtime) via `@supabase/supabase-js`, no separate API server. The NestJS backend this app started as has been retired; see `docs/migration/plan.md` and `docs/migration/progress.md` for the migration record.
*   `apps/admin`: Admin console (scaffolded)
*   `apps/ai-service`: Python AI microservice (issue diagnosis, RAG) — still a separate service; not yet wired to the frontend (its Edge Function proxy is unbuilt, see `docs/migration/progress.md` Phase 13)
*   `packages/database`: Supabase migrations (`packages/database/supabase/migrations`) — the source of truth for the schema and RLS policies. Also still holds the original `schema.prisma` as historical reference (the app no longer uses Prisma at runtime).
*   `packages/types`: Shared Zod validation schemas, API contract interfaces, and shared types
*   `packages/ui`: Shared, framework-agnostic UI building blocks
*   `packages/utils`: Shared utility functions
*   `packages/config`: Shared configuration (lint/tsconfig, etc.)

---

## 🎨 Frontend Motion & Design System

The marketing site (`apps/frontend/src/app/(marketing)`) and auth pages (`/login`, `/register`) share a reusable, framer-motion-powered visual system so every public page feels animated, cohesive, and premium:

*   `src/components/motion/reveal.tsx` — scroll-triggered fade/slide entrance wrapper
*   `src/components/motion/stagger.tsx` — staggered reveal for card grids and lists
*   `src/components/motion/gradient-blobs.tsx` — pure-CSS morphing blob backgrounds (no JS cost)
*   `src/components/motion/animated-heading.tsx` — word-by-word blur/slide hero headlines with gradient word highlighting
*   `src/components/motion/animated-counter.tsx` — count-up stat tiles triggered on scroll into view
*   `src/components/motion/section-divider.tsx` — SVG wave dividers that morph the seam between stacked sections
*   `src/components/motion/marquee.tsx` — infinite-scrolling feature strip
*   `src/components/motion/parallax-image.tsx` — vertical scroll parallax for section imagery
*   `src/components/motion/scroll-progress.tsx` — top-of-page scroll progress bar

Supporting theme work lives in `apps/frontend/tailwind.config.ts` (custom `blob`/`float`/`gradient-x`/`marquee` keyframes) and `apps/frontend/src/app/globals.css` (grid/noise/glass utilities, gradient text, custom scrollbar). The site header, footer, FAQ accordion, technician/vacancy cards, and marketplace/vacancies filters all use `AnimatePresence`/`layoutId` transitions for smooth state changes.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 20+
*   [pnpm](https://pnpm.io/) 10+ (`corepack enable` will pick up the pinned version automatically)
*   A [Supabase](https://supabase.com/) project (hosted or local via the Supabase CLI) — the app's data layer, not a local Postgres/Docker stack
*   Docker, only if you're also running `apps/ai-service` locally

### Setup

```bash
# 1. Install dependencies for every workspace
pnpm install

# 2. Copy environment files and fill in the required values
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/admin/.env.example apps/admin/.env.local

# 3. Apply the database schema/RLS policies to your Supabase project
#    (see packages/database/supabase/migrations and docs/migration/plan.md
#    Phase 2 for the exact `supabase db push` workflow)

# 4. Set NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY in
#    apps/frontend/.env.local to point at that project

# 5. Run the frontend in dev mode
pnpm dev
```

The frontend runs on [http://localhost:3000](http://localhost:3000) by default (Next.js automatically tries the next free port if 3000 is taken).

### Common scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Run all apps in development mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint all workspaces |
| `pnpm test` | Run all test suites |

Database schema changes go through Supabase migrations, not `db:generate`/`db:migrate` (those still exist as `packages/database` scripts against the historical `schema.prisma`, but don't touch the real database anymore) — see `packages/database/supabase/migrations` and `docs/migration/plan.md`.

---

For architectural details, coding conventions, and developer contribution guidelines, refer to the [GEMINI.md](./GEMINI.md) file.
