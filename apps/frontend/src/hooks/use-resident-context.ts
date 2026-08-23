import { useQuery } from '@tanstack/react-query';
import { getMyResidentContext, getAllResidents } from '@/queries/residents';

export function useResidentContext(userId: string | undefined) {
  return useQuery({
    queryKey: ['resident-context', userId],
    queryFn: () => getMyResidentContext(userId!),
    enabled: !!userId,
  });
}

export function useAllResidents() {
  return useQuery({ queryKey: ['admin-residents'], queryFn: getAllResidents });
}
