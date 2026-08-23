import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { getMyBookings } from '@/queries/bookings';
import { updateBookingStatus } from '@/mutations/bookings';

export function useMyBookings(technicianId: string | undefined) {
  return useQuery({
    queryKey: ['bookings', technicianId],
    queryFn: () => getMyBookings(technicianId!),
    enabled: !!technicianId,
  });
}

// docs/migration/plan.md Phase 14 — bookings.technician_id is a direct
// column, so unlike the resident side (see
// hooks/use-maintenance-requests.ts) this can filter server-side.
export function useMyBookingsRealtime(technicianId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!technicianId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`bookings:technician:${technicianId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings', filter: `technician_id=eq.${technicianId}` },
        () => queryClient.invalidateQueries({ queryKey: ['bookings', technicianId] })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [technicianId, queryClient]);
}

export function useUpdateBookingStatus(technicianId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: Parameters<typeof updateBookingStatus>[1] }) =>
      updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', technicianId] });
    },
  });
}
