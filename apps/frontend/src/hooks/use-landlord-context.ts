import { useQuery } from '@tanstack/react-query';
import { getMyLandlordContext, getMyProperties } from '@/queries/landlords';

export function useLandlordContext(userId: string | undefined) {
  return useQuery({
    queryKey: ['landlord-context', userId],
    queryFn: () => getMyLandlordContext(userId!),
    enabled: !!userId,
  });
}

export function useMyProperties(landlordId: string | undefined) {
  return useQuery({
    queryKey: ['properties', landlordId],
    queryFn: () => getMyProperties(landlordId!),
    enabled: !!landlordId,
  });
}
