import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// For Server Components, Route Handlers, and Server Actions. Server
// Components can't write cookies (Next.js restriction) — the try/catch
// below is safe to ignore there because middleware.ts refreshes the
// session on every request anyway, per @supabase/ssr's documented pattern.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — ignore, middleware handles it.
          }
        },
      },
    }
  );
}
