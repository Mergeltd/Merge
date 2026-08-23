import { useQuery } from '@tanstack/react-query';
import { getApartmentNotices } from '@/queries/notices';

export function useApartmentNotices(apartmentId: string | undefined) {
  return useQuery({
    queryKey: ['notices', apartmentId],
    queryFn: () => getApartmentNotices(apartmentId!),
    enabled: !!apartmentId,
  });
}
