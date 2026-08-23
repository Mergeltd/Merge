import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { getMyNotifications, getUnreadNotificationCount } from '@/queries/notifications';
import { markNotificationRead, markAllNotificationsRead } from '@/mutations/notifications';

export function useMyNotifications(userId: string | undefined) {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => getMyNotifications(userId!),
    enabled: !!userId,
  });
}

export function useUnreadNotificationCount(userId: string | undefined) {
  return useQuery({
    queryKey: ['notifications-unread-count', userId],
    queryFn: () => getUnreadNotificationCount(userId!),
    enabled: !!userId,
  });
}

export function useMarkNotificationRead(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count', userId] });
    },
  });
}

export function useMarkAllNotificationsRead(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsRead(userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count', userId] });
    },
  });
}

// docs/migration/plan.md Phase 14 — one of exactly 3 sanctioned Realtime
// subscriptions. A cache-invalidation signal only, not a parallel store:
// on any change, refetch through the normal TanStack Query path rather
// than merging the payload in by hand.
export function useNotificationsRealtime(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count', userId] });
    };

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        invalidate
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
}
