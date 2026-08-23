import { createClient } from '@/lib/supabase/client';

export type ApplicationStatus = 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'DECLINED';

export interface VacancyApplication {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  applicantName: string;
  monthlyIncome: number;
  employerName: string | null;
  status: ApplicationStatus;
  appliedAt: string;
  notes: string | null;
}

interface ApplicationRow {
  id: string;
  monthly_income: number;
  employer_name: string | null;
  applicant_notes: string | null;
  status: string;
  created_at: string;
  vacancy_id: string;
  vacancy: { title: string } | null;
  applicant: { first_name: string; last_name: string } | null;
}

const APPLICATION_SELECT = `id, monthly_income, employer_name, applicant_notes, status, created_at, vacancy_id,
  vacancy:vacancies(title),
  applicant:profiles(first_name, last_name)`;

function toApplication(row: ApplicationRow): VacancyApplication {
  return {
    id: row.id,
    vacancyId: row.vacancy_id,
    vacancyTitle: row.vacancy?.title ?? 'Listing',
    applicantName: row.applicant ? `${row.applicant.first_name} ${row.applicant.last_name}` : 'Applicant',
    monthlyIncome: Number(row.monthly_income),
    employerName: row.employer_name,
    status: row.status.toUpperCase() as ApplicationStatus,
    appliedAt: new Date(row.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
    notes: row.applicant_notes,
  };
}

// vacancy_applications has no direct landlord_id — RLS already scopes
// this correctly via va_select_applicant_or_owner (join through
// vacancies.landlord_id), so a plain select naturally returns only this
// landlord's applications without needing an explicit filter here.
export async function getMyApplications(): Promise<VacancyApplication[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('vacancy_applications')
    .select(APPLICATION_SELECT)
    .order('created_at', { ascending: false })
    .range(0, 99); // docs/migration/plan.md Phase 19 pagination audit — first page; full pager UI is a known gap, not built yet

  if (error) throw error;
  return (data as unknown as ApplicationRow[]).map(toApplication);
}
