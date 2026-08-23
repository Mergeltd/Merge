import { createClient } from '@/lib/supabase/client';

// docs/migration/plan.md Phase 12. One helper for the "upload to a bucket
// under {owning-entity-id}/{filename}, then record it in file_records"
// pattern every bucket's RLS policy (20260823190000_storage_buckets.sql)
// assumes — the folder segment is what the policy checks ownership on.
export async function uploadFile(bucket: string, folderId: string, file: File): Promise<{ key: string; fileRecordId: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');

  const ext = file.name.split('.').pop();
  const key = `${folderId}/${crypto.randomUUID()}${ext ? `.${ext}` : ''}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(key, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) throw uploadError;

  const { data: record, error: recordError } = await supabase
    .from('file_records')
    .insert({
      key,
      bucket,
      original_name: file.name,
      mime_type: file.type,
      size: file.size,
      uploaded_by_id: user.id,
    })
    .select('id')
    .single();
  if (recordError) throw recordError;

  return { key, fileRecordId: record.id };
}
