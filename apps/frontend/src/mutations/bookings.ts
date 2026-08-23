import { createClient } from '@/lib/supabase/client';

export async function acceptJob(requestId: string, technicianId: string, scheduledAt: string) {
  const supabase = createClient();
  const { error } = await supabase.from('bookings').insert({
    request_id: requestId,
    technician_id: technicianId,
    scheduled_at: scheduledAt,
    status: 'accepted',
  });

  if (error) throw error;
}

const DB_STATUS: Record<string, string> = {
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  CANCELLED: 'cancelled',
  IN_ROUTE: 'in_route',
  WORK_STARTED: 'work_started',
  COMPLETED: 'completed',
};

export async function updateBookingStatus(bookingId: string, status: keyof typeof DB_STATUS) {
  const supabase = createClient();
  const { error } = await supabase
    .from('bookings')
    .update({ status: DB_STATUS[status] })
    .eq('id', bookingId);

  if (error) throw error;
}
