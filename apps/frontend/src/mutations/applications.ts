import { createClient } from '@/lib/supabase/client';

export async function updateApplicationStatus(applicationId: string, status: 'reviewing' | 'approved' | 'declined') {
  const supabase = createClient();
  const { error } = await supabase
    .from('vacancy_applications')
    .update({ status })
    .eq('id', applicationId);

  if (error) throw error;
}
