import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { DASHBOARD_BY_ROLE } from '@/lib/roles';

// Currently the only route protection in this app — before this file
// existed, /admin, /landlord, /resident, /technician were all reachable
// by anyone, authenticated or not (docs/migration/plan.md Phase 6 /
// the Supabase migration audit's security findings).
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Also refreshes the session token if it's expired — required by
  // @supabase/ssr's documented pattern, not just for the role check below.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const segment = request.nextUrl.pathname.split('/')[1];

  // DASHBOARD_BY_ROLE maps role -> path; we need the reverse (path
  // segment -> which roles are allowed there) for the actual check.
  const allowedRoles = Object.entries(DASHBOARD_BY_ROLE)
    .filter(([, path]) => path === `/${segment}`)
    .map(([role]) => role);

  if (allowedRoles.length > 0) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !allowedRoles.includes(profile.role)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/landlord/:path*', '/resident/:path*', '/technician/:path*'],
};
