import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyBookings } from '@/queries/bookings';
import { updateBookingStatus } from '@/mutations/bookings';

export function useMyBookings(technicianId: string | undefined) {
  return useQuery({
    queryKey: ['bookings', technicianId],
    queryFn: () => getMyBookings(technicianId!),
    enabled: !!technicianId,
  });
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
