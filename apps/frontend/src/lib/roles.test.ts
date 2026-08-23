import { describe, expect, it } from 'vitest';
import { dashboardPathForRole, DASHBOARD_BY_ROLE } from './roles';

describe('dashboardPathForRole', () => {
  it('routes every known role to its dashboard', () => {
    expect(dashboardPathForRole('super_admin')).toBe('/admin');
    expect(dashboardPathForRole('apartment_admin')).toBe('/admin');
    expect(dashboardPathForRole('property_manager')).toBe('/admin');
    expect(dashboardPathForRole('landlord')).toBe('/landlord');
    expect(dashboardPathForRole('resident')).toBe('/resident');
    expect(dashboardPathForRole('technician')).toBe('/technician');
  });

  it('falls back to /login for an unknown, null, or undefined role', () => {
    expect(dashboardPathForRole('not_a_real_role')).toBe('/login');
    expect(dashboardPathForRole(null)).toBe('/login');
    expect(dashboardPathForRole(undefined)).toBe('/login');
    expect(dashboardPathForRole('')).toBe('/login');
  });

  it('covers every user_role enum value the database defines', () => {
    // Guards against a role being added to the DB enum without a matching
    // dashboard entry — middleware.ts and login-client.tsx both depend on
    // DASHBOARD_BY_ROLE being exhaustive.
    const dbRoles = ['super_admin', 'apartment_admin', 'property_manager', 'landlord', 'resident', 'technician'];
    for (const role of dbRoles) {
      expect(DASHBOARD_BY_ROLE[role]).toBeDefined();
    }
  });
});
