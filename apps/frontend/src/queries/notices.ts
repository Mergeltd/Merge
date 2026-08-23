import { createClient } from '@/lib/supabase/client';

export type NoticeCategory = 'Maintenance' | 'Security' | 'Community' | 'Billing';

export interface NoticeSummary {
  id: string;
  title: string;
  body: string;
  date: string;
  priority: string;
  category: NoticeCategory;
}

function toTitleCaseCategory(category: string): NoticeCategory {
  return (category.charAt(0).toUpperCase() + category.slice(1)) as NoticeCategory;
}

export async function getApartmentNotices(apartmentId: string): Promise<NoticeSummary[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('notices')
    .select('id, title, content, priority, category, published_at')
    .eq('apartment_id', apartmentId)
    .order('published_at', { ascending: false })
    .range(0, 49); // docs/migration/plan.md Phase 19 pagination audit — first page; full pager UI is a known gap, not built yet

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    body: row.content,
    date: row.published_at
      ? new Date(row.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      : '',
    priority: row.priority,
    category: toTitleCaseCategory(row.category),
  }));
}
