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
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as VacancyRow[]).map(toLandlordVacancy);
}

// Public marketplace read — matches vacancies_public_read_published,
// works unauthenticated. Phase 15 wires this into the marketing site,
// replacing its own separate, inconsistent mockVacancies.
export async function getPublishedVacancies(): Promise<LandlordVacancy[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('vacancies')
    .select(VACANCY_SELECT)
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as VacancyRow[]).map(toLandlordVacancy);
}
