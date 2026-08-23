import { createClient } from '@/lib/supabase/client';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

// Replaces the hardcoded ['Plumbing', 'Electrical', ..., 'Other'] list in
// new-request-modal.tsx, which didn't match the real seeded categories
// (missing Appliance Repair/Pest Control/Cleaning/Locksmith/General
// Maintenance, and 'Other' isn't a real category at all).
export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .is('parent_id', null)
    .order('name');

  if (error) throw error;
  return data;
}
