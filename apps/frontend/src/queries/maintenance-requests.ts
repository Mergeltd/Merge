import { createClient } from '@/lib/supabase/client';
import type { RequestStatus, RequestUrgency } from '@/components/dashboard/status-badge';

export interface MaintenanceRequestSummary {
  id: string;
  title: string;
  category: string;
  urgency: RequestUrgency;
  status: RequestStatus;
  createdAt: string;
  technician?: { name: string };
  scheduledFor?: string;
}

interface MaintenanceRequestRow {
  id: string;
  title: string;
  urgency: string;
  status: string;
  created_at: string;
  category: { name: string } | null;
  bookings: {
    scheduled_at: string;
    status: string;
    technician: { user: { first_name: string; last_name: string } | null } | null;
  }[];
}

function formatScheduledFor(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return isToday ? `Today, ${time}` : `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${time}`;
}

// DB enums are lowercase (request_status/request_urgency); the existing UI
// components (status-badge.tsx) were built against uppercase literals —
// converting here, at the query boundary, rather than changing the schema
// or the already-working UI components.
function toSummary(row: MaintenanceRequestRow): MaintenanceRequestSummary {
  const activeBooking = row.bookings.find((b) => b.status !== 'cancelled' && b.status !== 'completed') ?? row.bookings[0];
  const technicianProfile = activeBooking?.technician?.user;

  return {
    id: row.id,
    title: row.title,
    category: row.category?.name ?? 'General',
    urgency: row.urgency.toUpperCase() as RequestUrgency,
    status: row.status.toUpperCase() as RequestStatus,
    createdAt: new Date(row.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
    technician: technicianProfile ? { name: `${technicianProfile.first_name} ${technicianProfile.last_name}` } : undefined,
    scheduledFor: activeBooking && activeBooking.status !== 'completed' ? formatScheduledFor(activeBooking.scheduled_at) : undefined,
  };
}

export async function getMyMaintenanceRequests(residentId: string): Promise<MaintenanceRequestSummary[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select(
      `id, title, urgency, status, created_at,
       category:categories(name),
       bookings(scheduled_at, status, technician:technicians(user:profiles(first_name, last_name)))`
    )
    .eq('resident_id', residentId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(0, 99); // docs/migration/plan.md Phase 19 pagination audit — first page; full pager UI is a known gap, not built yet

  if (error) throw error;
  return (data as unknown as MaintenanceRequestRow[]).map(toSummary);
}

export interface AdminMaintenanceRequest {
  id: string;
  title: string;
  category: string;
  urgency: RequestUrgency;
  status: RequestStatus;
  unit: string;
  building: string;
  resident: string;
  createdAt: string;
  technician?: string;
}

interface AdminMaintenanceRequestRow {
  id: string;
  title: string;
  urgency: string;
  status: string;
  created_at: string;
  category: { name: string } | null;
  unit: { number: string; building: { name: string } | null } | null;
  resident: { user: { first_name: string; last_name: string } | null } | null;
  bookings: { status: string; technician: { user: { first_name: string; last_name: string } | null } | null }[];
}

// Admin-wide — every request platform-wide, not just one resident's.
export async function getAllMaintenanceRequests(): Promise<AdminMaintenanceRequest[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select(
      `id, title, urgency, status, created_at,
       category:categories(name),
       unit:units(number, building:buildings(name)),
       resident:residents(user:profiles(first_name, last_name)),
       bookings(status, technician:technicians(user:profiles(first_name, last_name)))`
    )
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(0, 199); // docs/migration/plan.md Phase 19 pagination audit — first page; full pager UI is a known gap, not built yet

  if (error) throw error;

  return (data as unknown as AdminMaintenanceRequestRow[]).map((row) => {
    const activeBooking = row.bookings.find((b) => b.status !== 'cancelled' && b.status !== 'declined');
    return {
      id: row.id,
      title: row.title,
      category: row.category?.name ?? 'General',
      urgency: row.urgency.toUpperCase() as RequestUrgency,
      status: row.status.toUpperCase() as RequestStatus,
      unit: row.unit?.number ?? '—',
      building: row.unit?.building?.name ?? '—',
      resident: row.resident?.user ? `${row.resident.user.first_name} ${row.resident.user.last_name}` : 'Resident',
      createdAt: new Date(row.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
      technician: activeBooking?.technician?.user ? `${activeBooking.technician.user.first_name} ${activeBooking.technician.user.last_name}` : undefined,
    };
  });
}
