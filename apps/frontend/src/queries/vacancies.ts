import { createClient } from '@/lib/supabase/client';

export type VacancyListingStatus = 'DRAFT' | 'PUBLISHED' | 'UNDER_CONTRACT' | 'ARCHIVED';

export interface LandlordVacancy {
  id: string;
  title: string;
  neighborhood: string;
  rentAmount: number;
  depositAmount: number;
  bedrooms: number;
  bathrooms: number;
  status: VacancyListingStatus;
  applicantCount: number;
  publishedAt?: string;
}

interface VacancyRow {
  id: string;
  title: string;
  rent_amount: number;
  deposit_amount: number;
  bedrooms: number;
  bathrooms: number;
  status: string;
  neighborhood: string | null;
  created_at: string;
  vacancy_applications: { id: string }[];
}

const VACANCY_SELECT = `id, title, rent_amount, deposit_amount, bedrooms, bathrooms, status, neighborhood, created_at,
  vacancy_applications(id)`;

function toLandlordVacancy(row: VacancyRow): LandlordVacancy {
  return {
    id: row.id,
    title: row.title,
    neighborhood: row.neighborhood ?? '',
    rentAmount: Number(row.rent_amount),
    depositAmount: Number(row.deposit_amount),
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    status: row.status.toUpperCase() as VacancyListingStatus,
    applicantCount: row.vacancy_applications.length,
    publishedAt: row.status !== 'draft' ? new Date(row.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : undefined,
  };
}

export async function getMyVacancies(landlordId: string): Promise<LandlordVacancy[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('vacancies')
    .select(VACANCY_SELECT)
    .eq('landlord_id', landlordId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(0, 99); // docs/migration/plan.md Phase 19 pagination audit — first page; full pager UI is a known gap, not built yet

  if (error) throw error;
  return (data as unknown as VacancyRow[]).map(toLandlordVacancy);
}

export interface PublicVacancy {
  id: string;
  title: string;
  description: string;
  rentAmount: number;
  depositAmount: number;
  bedrooms: number;
  bathrooms: number;
  neighborhood: string;
  imageUrl: string | null;
}

interface PublicVacancyRow {
  id: string;
  title: string;
  description: string;
  rent_amount: number;
  deposit_amount: number;
  bedrooms: number;
  bathrooms: number;
  neighborhood: string | null;
  media_keys: string[];
}

// Public marketplace read — matches vacancies_public_read_published,
// works unauthenticated. Phase 15 wires this into the marketing site,
// replacing its own separate, inconsistent mockVacancies. A distinct
// shape from LandlordVacancy: the public card needs description/image,
// the landlord's own table view doesn't, and the schema has no
// areaSqft/propertyType/amenities/verifiedLandlord columns the old mock
// invented — those are dropped rather than fabricated.
export async function getPublishedVacancies(): Promise<PublicVacancy[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('vacancies')
    .select('id, title, description, rent_amount, deposit_amount, bedrooms, bathrooms, neighborhood, media_keys')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(0, 49); // docs/migration/plan.md Phase 19 pagination audit — public marketplace, first page; full pager UI is a known gap, not built yet

  if (error) throw error;

  return (data as unknown as PublicVacancyRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    rentAmount: Number(row.rent_amount),
    depositAmount: Number(row.deposit_amount),
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    neighborhood: row.neighborhood ?? '',
    imageUrl: row.media_keys[0] ? supabase.storage.from('vacancy-media').getPublicUrl(row.media_keys[0]).data.publicUrl : null,
  }));
}
