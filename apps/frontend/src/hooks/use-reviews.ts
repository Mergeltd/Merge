import { useQuery } from '@tanstack/react-query';
import { getTechnicianReviews } from '@/queries/reviews';

export function useTechnicianReviews(technicianId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', technicianId],
    queryFn: () => getTechnicianReviews(technicianId!),
    enabled: !!technicianId,
  });
}
