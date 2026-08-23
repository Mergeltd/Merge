import { createClient } from '@/lib/supabase/client';

export interface ResidentContext {
  id: string;
  apartment_id: string;
  unit_id: string | null;
  apartment_name: string;
  unit_number: string | null;
}

// The join every other resident-dashboard query builds on: residents.id
// (not profiles.id) is the foreign key on maintenance_requests/wallets,
// and apartment/unit names are what the dashboard shell's subtitle needs
// (docs/migration/plan.md Phase 6 left this join for Phase 7).
export async function getMyResidentContext(userId: string): Promise<ResidentContext> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('residents')
    .select('id, apartment_id, unit_id, apartment:apartments(name), unit:units(number)')
    .eq('user_id', userId)
    .single();

  if (error) throw error;

  const apartment = data.apartment as unknown as { name: string } | null;
  const unit = data.unit as unknown as { number: string } | null;

  return {
    id: data.id,
    apartment_id: data.apartment_id,
    unit_id: data.unit_id,
    apartment_name: apartment?.name ?? 'Unknown Apartment',
    unit_number: unit?.number ?? null,
  };
}
