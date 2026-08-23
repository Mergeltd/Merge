// Canonical role -> dashboard mapping (docs/migration/plan.md §1.2 / ADR-002).
// property_manager shares /admin with apartment_admin and super_admin —
// RLS's manages_apartment() helper scopes what a property manager actually
// sees there, so no separate dashboard is needed. Used here for the
// post-login redirect, and again by middleware.ts once Phase 6 adds it —
// keep this the single source of truth for the mapping rather than
// duplicating it.
export const DASHBOARD_BY_ROLE: Record<string, string> = {
  super_admin: '/admin',
  apartment_admin: '/admin',
  property_manager: '/admin',
  landlord: '/landlord',
  resident: '/resident',
  technician: '/technician',
};

export function dashboardPathForRole(role: string | null | undefined): string {
  return (role && DASHBOARD_BY_ROLE[role]) || '/login';
}
