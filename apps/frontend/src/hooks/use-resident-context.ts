import { useQuery } from '@tanstack/react-query';
import { getMyResidentContext } from '@/queries/residents';

export function useResidentContext(userId: string | undefined) {
  return useQuery({
    queryKey: ['resident-context', userId],
    queryFn: () => getMyResidentContext(userId!),
    enabled: !!userId,
  });
}
