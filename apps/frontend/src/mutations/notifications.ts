import { createClient } from '@/lib/supabase/client';

export async function markNotificationRead(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  if (error) throw error;
}

export async function markAllNotificationsRead(userId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  if (error) throw error;
}
