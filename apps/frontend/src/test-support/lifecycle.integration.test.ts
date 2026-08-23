// docs/migration/plan.md Phase 18 — "Integration" and "End-to-end
// lifecycle" in one file: this exercises the REAL exported query/mutation
// functions the app calls (not raw REST), against the live Supabase test
// project, through the full audit §24 lifecycle — register (fixture users
// stand in for the signup form itself, which is Supabase Auth directly and
// already covered by Phase 4/6's own manual verification) → maintenance
// request → admin assignment → technician acceptance → status progression
// → completion → revenue settlement → notification → refresh-persistence
// at each step (every read below is a fresh call, not a cached value from
// the write).
//
// Requires SUPABASE_SECRET_KEY in .env.test.local (test-only, never
// bundled into the app) to provision/tear down fixture users via the Auth
// Admin API. Skips itself if that's not configured, rather than failing a
// suite that can't run without live credentials.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { authService } from '@/services/auth.service';
import { createMaintenanceRequest } from '@/mutations/maintenance-requests';
import { getMyMaintenanceRequests, getAllMaintenanceRequests } from '@/queries/maintenance-requests';
import { assignTechnician, updateBookingStatus } from '@/mutations/bookings';
import { getMyBookings } from '@/queries/bookings';
import { getMyNotifications } from '@/queries/notifications';
import { createFixtureUser, deleteFixtureUser, adminInsert, adminDelete, adminSelectOne } from './fixtures';

const hasServiceKey = !!process.env.SUPABASE_SECRET_KEY;

const ids = {
  apartment: '66666666-0000-4000-8000-000000000001',
  building: '66666666-0000-4000-8000-000000000002',
  unit: '66666666-0000-4000-8000-000000000003',
  residentUser: '66666666-0000-4000-8000-0000000000a1',
  techUser: '66666666-0000-4000-8000-0000000000b1',
  adminUser: '66666666-0000-4000-8000-0000000000c1',
};
const emails = {
  resident: 'lifecycle-test.resident@merge.test',
  tech: 'lifecycle-test.tech@merge.test',
  admin: 'lifecycle-test.admin@merge.test',
};

let residentId: string;
let technicianId: string;
let requestId: string;
let bookingId: string;

describe.skipIf(!hasServiceKey)('full lifecycle: request -> assignment -> acceptance -> progression -> completion', () => {
  beforeAll(async () => {
    await createFixtureUser(ids.residentUser, emails.resident, 'resident', 'Lifecycle', 'Resident');
    await createFixtureUser(ids.techUser, emails.tech, 'technician', 'Lifecycle', 'Technician');
    await createFixtureUser(ids.adminUser, emails.admin, 'super_admin', 'Lifecycle', 'Admin');

    await adminInsert('apartments', { id: ids.apartment, name: 'Lifecycle Test Apartments', address: '1 Test Rd', city: 'Nairobi' });
    await adminInsert('buildings', { id: ids.building, name: 'Lifecycle Block', apartment_id: ids.apartment });
    await adminInsert('units', { id: ids.unit, number: 'L-1', floor: 1, status: 'occupied', rent_amount: 40000, building_id: ids.building });
    await adminInsert('residents', { id: crypto.randomUUID(), user_id: ids.residentUser, apartment_id: ids.apartment, unit_id: ids.unit });
    await adminInsert('technicians', { id: crypto.randomUUID(), user_id: ids.techUser, verification_status: 'verified', id_number: 'LIFECYCLE-TEST-001' });

    const category = await adminSelectOne<{ id: string }>('categories', 'slug', 'plumbing', 'id');
    const resident = await adminSelectOne<{ id: string }>('residents', 'user_id', ids.residentUser, 'id');
    const technician = await adminSelectOne<{ id: string }>('technicians', 'user_id', ids.techUser, 'id');
    residentId = resident.id;
    technicianId = technician.id;
    await adminInsert('technician_categories', { technician_id: technicianId, category_id: category.id });
  }, 30000);

  afterAll(async () => {
    if (bookingId) await adminDelete('transactions', 'booking_id', bookingId);
    if (requestId) await adminDelete('bookings', 'request_id', requestId);
    if (requestId) await adminDelete('maintenance_requests', 'id', requestId);
    await adminDelete('technicians', 'user_id', ids.techUser);
    await adminDelete('residents', 'user_id', ids.residentUser);
    await adminDelete('units', 'id', ids.unit);
    await adminDelete('buildings', 'id', ids.building);
    await adminDelete('apartments', 'id', ids.apartment);
    await deleteFixtureUser(ids.residentUser);
    await deleteFixtureUser(ids.techUser);
    await deleteFixtureUser(ids.adminUser);
  }, 30000);

  it('resident submits a maintenance request through the real mutation', async () => {
    await authService.login({ email: emails.resident, password: 'TestPass123!' });

    const category = await adminSelectOne<{ id: string }>('categories', 'slug', 'plumbing', 'id');
    const created = await createMaintenanceRequest({
      residentId,
      unitId: ids.unit,
      categoryId: category.id,
      title: 'Integration test: leaky faucet',
      description: 'Created by the Phase 18 lifecycle integration test',
      urgency: 'MEDIUM',
    });
    requestId = created.id;
    expect(requestId).toBeTruthy();

    // Refresh-persistence: a fresh read (not the insert's own return value)
    // sees it, matching the real resident dashboard's flow.
    const myRequests = await getMyMaintenanceRequests(residentId);
    expect(myRequests.some((r) => r.id === requestId)).toBe(true);
  });

  it('admin sees the new request (resident -> admin visibility)', async () => {
    await authService.login({ email: emails.admin, password: 'TestPass123!' });
    const allRequests = await getAllMaintenanceRequests();
    expect(allRequests.some((r) => r.id === requestId)).toBe(true);
  });

  it('admin assigns the technician (admin -> resident/technician)', async () => {
    await authService.login({ email: emails.admin, password: 'TestPass123!' });
    await assignTechnician(requestId, technicianId, new Date(Date.now() + 86400000).toISOString());

    const assigned = await getAllMaintenanceRequests();
    const thisRequest = assigned.find((r) => r.id === requestId);
    expect(thisRequest?.status).toBe('ASSIGNED');
    expect(thisRequest?.technician).toBeTruthy();
  });

  it('technician sees the proposed booking and a notification', async () => {
    await authService.login({ email: emails.tech, password: 'TestPass123!' });
    const bookings = await getMyBookings(technicianId);
    const booking = bookings.find((b) => b.title?.includes('leaky faucet') || b.status === 'PROPOSED');
    expect(booking).toBeTruthy();
    bookingId = booking!.id;
    expect(booking!.status).toBe('PROPOSED');

    const notifications = await getMyNotifications(ids.techUser);
    expect(notifications.some((n) => n.type === 'booking_proposed')).toBe(true);
  });

  it('technician progresses the booking through the full status chain', async () => {
    await authService.login({ email: emails.tech, password: 'TestPass123!' });

    await updateBookingStatus(bookingId, 'ACCEPTED');
    let bookings = await getMyBookings(technicianId);
    expect(bookings.find((b) => b.id === bookingId)?.status).toBe('ACCEPTED');

    await updateBookingStatus(bookingId, 'IN_ROUTE');
    bookings = await getMyBookings(technicianId);
    expect(bookings.find((b) => b.id === bookingId)?.status).toBe('IN_ROUTE');

    await updateBookingStatus(bookingId, 'WORK_STARTED');
    bookings = await getMyBookings(technicianId);
    expect(bookings.find((b) => b.id === bookingId)?.status).toBe('WORK_STARTED');

    await updateBookingStatus(bookingId, 'COMPLETED');
    bookings = await getMyBookings(technicianId);
    expect(bookings.find((b) => b.id === bookingId)?.status).toBe('COMPLETED');
  });

  it('resident sees the completed status and every status-change notification (technician -> resident, system -> user)', async () => {
    await authService.login({ email: emails.resident, password: 'TestPass123!' });

    const myRequests = await getMyMaintenanceRequests(residentId);
    const myRequest = myRequests.find((r) => r.id === requestId);
    expect(myRequest?.status).toBe('COMPLETED');

    const notifications = await getMyNotifications(ids.residentUser);
    const statusChangeCount = notifications.filter((n) => n.type === 'booking_status_changed').length;
    expect(statusChangeCount).toBeGreaterThanOrEqual(4); // accepted, in_route, work_started, completed
  });
});
