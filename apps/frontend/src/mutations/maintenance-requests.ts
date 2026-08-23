import { createClient } from '@/lib/supabase/client';

export interface CreateMaintenanceRequestInput {
  residentId: string;
  unitId: string;
  categoryId: string;
  title: string;
  description: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export async function createMaintenanceRequest(input: CreateMaintenanceRequestInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('maintenance_requests')
    .insert({
      resident_id: input.residentId,
      unit_id: input.unitId,
      category_id: input.categoryId,
      title: input.title,
      description: input.description,
      urgency: input.urgency.toLowerCase(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
