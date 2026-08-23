import { createClient } from '@/lib/supabase/client';

export interface SubmitApplicationInput {
  vacancyId: string;
  applicantId: string;
  monthlyIncome: number;
  employerName?: string;
  applicantNotes?: string;
}

// docs/migration/plan.md Phase 15 — the gap flagged (not fixed) in Phase
// 11: nothing submitted a real vacancy_applications row anywhere. RLS
// (va_insert_self) requires applicant_id = auth.uid() explicitly in the
// insert body, not just implied by the session.
export async function submitApplication(input: SubmitApplicationInput) {
  const supabase = createClient();
  const { error } = await supabase.from('vacancy_applications').insert({
    vacancy_id: input.vacancyId,
    applicant_id: input.applicantId,
    monthly_income: input.monthlyIncome,
    employer_name: input.employerName || null,
    applicant_notes: input.applicantNotes || null,
  });

  if (error) throw error;
}

export async function updateApplicationStatus(applicationId: string, status: 'reviewing' | 'approved' | 'declined') {
  const supabase = createClient();
  const { error } = await supabase
    .from('vacancy_applications')
    .update({ status })
    .eq('id', applicationId);

  if (error) throw error;
}
