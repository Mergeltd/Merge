import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/queries/profiles';

// TanStack Query has been installed and provisioned since before this
// migration started, but nothing ever called useQuery/useMutation with it
// (see the Supabase migration audit's frontend findings) — this is the
// first real usage, and the template Phases 7-10 repeat for every other
// domain: page component -> hook -> queries/*.ts -> Supabase.
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
  });
}
