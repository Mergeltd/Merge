import { createClient } from '@/lib/supabase/client';
import type { RequestUrgency } from '@/components/dashboard/status-badge';

export type BookingStatus = 'PROPOSED' | 'ACCEPTED' | 'DECLINED' | 'IN_ROUTE' | 'WORK_STARTED' | 'COMPLETED' | 'CANCELLED';

export interface TechBooking {
  id: string;
  title: string;
  category: string;
  urgency: RequestUrgency;
  status: BookingStatus;
  resident: string;
  unit: string;
  building: string;
  neighborhood: string;
  scheduledFor: string;
  totalAmount: number;
}

interface BookingRow {
  id: string;
  scheduled_at: string;
  status: string;
  total_amount: number;
  request: {
    title: string;
    urgency: string;
    category: { name: string } | null;
    unit: { number: string; building: { name: string; apartment: { name: string; city: string } | null } | null } | null;
    resident: { user: { first_name: string; last_name: string } | null } | null;
  } | null;
}

function toTechBooking(row: BookingRow): TechBooking {
  const request = row.request;
  const building = request?.unit?.building;
  return {
    id: row.id,
    title: request?.title ?? 'Untitled request',
    category: request?.category?.name ?? 'General',
    urgency: (request?.urgency ?? 'medium').toUpperCase() as RequestUrgency,
    status: row.status.toUpperCase() as BookingStatus,
    resident: request?.resident?.user ? `${request.resident.user.first_name} ${request.resident.user.last_name}` : 'Resident',
    unit: request?.unit?.number ?? '—',
    building: building?.name ?? building?.apartment?.name ?? '—',
    neighborhood: building?.apartment?.city ?? '',
    scheduledFor: new Date(row.scheduled_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    totalAmount: Number(row.total_amount),
  };
}

const BOOKING_SELECT = `id, scheduled_at, status, total_amount,
  request:maintenance_requests(
    title, urgency,
    category:categories(name),
    unit:units(number, building:buildings(name, apartment:apartments(name, city))),
    resident:residents(user:profiles(first_name, last_name))
  )`;

export async function getMyBookings(technicianId: string): Promise<TechBooking[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select(BOOKING_SELECT)
    .eq('technician_id', technicianId)
    .is('deleted_at', null)
    .order('scheduled_at', { ascending: true });

  if (error) throw error;
  return (data as unknown as BookingRow[]).map(toTechBooking);
}

export interface AvailableJob {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: RequestUrgency;
  building: string;
  neighborhood: string;
  postedAt: string;
}

export async function getOpenJobs(): Promise<AvailableJob[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select(
      `id, title, description, urgency, created_at,
       category:categories(name),
       unit:units(building:buildings(name, apartment:apartments(name, city)))`
    )
    .eq('status', 'open')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data as unknown as {
    id: string; title: string; description: string; urgency: string; created_at: string;
    category: { name: string } | null;
    unit: { building: { name: string; apartment: { name: string; city: string } | null } | null } | null;
  }[]).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category?.name ?? 'General',
    urgency: row.urgency.toUpperCase() as RequestUrgency,
    building: row.unit?.building?.name ?? row.unit?.building?.apartment?.name ?? '—',
    neighborhood: row.unit?.building?.apartment?.city ?? '',
    postedAt: new Date(row.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }));
}
