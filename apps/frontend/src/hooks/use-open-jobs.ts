import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOpenJobs } from '@/queries/bookings';
import { acceptJob } from '@/mutations/bookings';

export function useOpenJobs() {
  return useQuery({
    queryKey: ['open-jobs'],
    queryFn: getOpenJobs,
  });
}

export function useAcceptJob(technicianId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, scheduledAt }: { requestId: string; scheduledAt: string }) =>
      acceptJob(requestId, technicianId!, scheduledAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['open-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', technicianId] });
    },
  });
}
