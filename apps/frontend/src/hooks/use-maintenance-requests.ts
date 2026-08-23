import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { getMyMaintenanceRequests, getAllMaintenanceRequests } from '@/queries/maintenance-requests';
import { createMaintenanceRequest, type CreateMaintenanceRequestInput } from '@/mutations/maintenance-requests';
import { assignTechnician } from '@/mutations/bookings';

export function useMyMaintenanceRequests(residentId: string | undefined) {
  return useQuery({
    queryKey: ['maintenance-requests', residentId],
    queryFn: () => getMyMaintenanceRequests(residentId!),
    enabled: !!residentId,
  });
}

// docs/migration/plan.md Phase 14 — a resident's own booking progress
// (accepted/in_route/work_started/completed) shows up here too, since the
// resident's maintenance list embeds each request's active booking.
// bookings has no resident_id column to filter by server-side, so that
// half of this listens unfiltered and invalidates on any change; the
// request's own status (open -> assigned) is filtered properly since
// maintenance_requests.resident_id is a direct column.
export function useMyMaintenanceRequestsRealtime(residentId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!residentId) return;
    const supabase = createClient();
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['maintenance-requests', residentId] });

    const channel = supabase
      .channel(`maintenance-requests:resident:${residentId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'maintenance_requests', filter: `resident_id=eq.${residentId}` },
        invalidate
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, invalidate)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [residentId, queryClient]);
}

export function useCreateMaintenanceRequest(residentId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMaintenanceRequestInput) => createMaintenanceRequest(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests', residentId] });
    },
  });
}

export function useAllMaintenanceRequests() {
  return useQuery({ queryKey: ['admin-maintenance-requests'], queryFn: getAllMaintenanceRequests });
}

export function useAssignTechnician() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, technicianId, scheduledAt }: { requestId: string; technicianId: string; scheduledAt: string }) =>
      assignTechnician(requestId, technicianId, scheduledAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-maintenance-requests'] });
    },
  });
}
