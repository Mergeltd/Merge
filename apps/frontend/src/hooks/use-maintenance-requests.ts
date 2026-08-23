import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
