import { createClient } from '@/lib/supabase/client';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export async function getMyNotifications(userId: string): Promise<AppNotification[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, body, type, is_read, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(0, 19);

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    type: row.type,
    isRead: row.is_read,
    createdAt: row.created_at,
  }));
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw error;
  return count ?? 0;
}
