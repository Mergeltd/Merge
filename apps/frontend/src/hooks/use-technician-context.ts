import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyTechnicianContext, updateAvailability, getAllTechnicians, setTechnicianVerification } from '@/queries/technicians';

export function useTechnicianContext(userId: string | undefined) {
  return useQuery({
    queryKey: ['technician-context', userId],
    queryFn: () => getMyTechnicianContext(userId!),
    enabled: !!userId,
  });
}

export function useUpdateAvailability(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ technicianId, isAvailable }: { technicianId: string; isAvailable: boolean }) =>
      updateAvailability(technicianId, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician-context', userId] });
    },
  });
}

export function useAllTechnicians() {
  return useQuery({ queryKey: ['admin-technicians'], queryFn: getAllTechnicians });
}

export function useSetTechnicianVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ technicianId, status }: { technicianId: string; status: 'verified' | 'suspended' | 'rejected' }) =>
      setTechnicianVerification(technicianId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-technicians'] }),
  });
}
