import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyMaintenanceRequests } from '@/queries/maintenance-requests';
import { createMaintenanceRequest, type CreateMaintenanceRequestInput } from '@/mutations/maintenance-requests';

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
