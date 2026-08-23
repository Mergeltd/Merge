import { createClient } from '@/lib/supabase/client';

export interface CreateVacancyInput {
  landlordId: string;
  title: string;
  description: string;
  neighborhood: string;
  rentAmount: number;
  depositAmount: number;
  bedrooms: number;
  bathrooms: number;
}

export async function createVacancy(input: CreateVacancyInput) {
  const supabase = createClient();
  const { error } = await supabase.from('vacancies').insert({
    landlord_id: input.landlordId,
    title: input.title,
    description: input.description,
    neighborhood: input.neighborhood,
    rent_amount: input.rentAmount,
    deposit_amount: input.depositAmount,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    status: 'draft',
  });

  if (error) throw error;
}

export async function setVacancyStatus(vacancyId: string, status: 'published' | 'archived') {
  const supabase = createClient();
  const { error } = await supabase.from('vacancies').update({ status }).eq('id', vacancyId);
  if (error) throw error;
}
