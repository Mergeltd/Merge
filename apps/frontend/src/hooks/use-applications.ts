import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyApplications } from '@/queries/applications';
import { updateApplicationStatus, submitApplication, type SubmitApplicationInput } from '@/mutations/applications';

export function useMyApplications(enabled: boolean) {
  return useQuery({
    queryKey: ['applications'],
    queryFn: getMyApplications,
    enabled,
  });
}

export function useSubmitApplication() {
  return useMutation({
    mutationFn: (input: SubmitApplicationInput) => submitApplication(input),
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: 'reviewing' | 'approved' | 'declined' }) =>
      updateApplicationStatus(applicationId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  });
}
