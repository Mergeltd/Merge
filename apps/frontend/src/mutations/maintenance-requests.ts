import { createClient } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/storage';

export interface CreateMaintenanceRequestInput {
  residentId: string;
  unitId: string;
  categoryId: string;
  title: string;
  description: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  photos?: File[];
}

// The request has to exist before photos can be attached — the
// maintenance-media bucket's RLS policies (Phase 12) key off
// maintenance_requests.id as the folder segment, so there's no id to
// upload under until the insert returns one. Photo upload failures don't
// roll back the request itself; the request is the thing the resident
// actually needs to exist.
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

  if (input.photos?.length) {
    const uploads = await Promise.all(input.photos.map((file) => uploadFile('maintenance-media', data.id, file)));
    const keys = uploads.map((u) => u.key);
    const { error: updateError } = await supabase
      .from('maintenance_requests')
      .update({ media_keys: keys })
      .eq('id', data.id);
    if (updateError) throw updateError;
  }

  return data;
}
