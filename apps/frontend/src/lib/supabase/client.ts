import { createBrowserClient } from '@supabase/ssr';

// Cookie-based session (not localStorage) — this is what lets the
// middleware added in docs/migration/plan.md Phase 6 read the session
// server-side without a separate token-passing scheme.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
