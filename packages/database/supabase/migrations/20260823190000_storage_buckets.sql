-- docs/migration/plan.md Phase 12. Replaces the currently-conceptual-only
-- Storage references (profiles.avatar_url, maintenance_requests.media_keys,
-- vacancies.media_keys, messages.media_key — none of them backed by an
-- actual bucket) with 6 real buckets and object-level RLS.
--
-- Path convention throughout: `{owning-entity-id}/{filename}`, so
-- `(storage.foldername(name))[1]` is always the id of the row that governs
-- access — the same "folder is the foreign key" pattern, checked against
-- the same domain tables/helpers RLS already uses elsewhere (reusing
-- resident_owns_request/technician_assigned_to_request/is_chat_participant/
-- manages_apartment from Phases 3/5/10 rather than re-deriving the same
-- ownership logic a second time).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('avatars', 'avatars', true, 5242880, array['image/png','image/jpeg','image/webp']),
  ('maintenance-media', 'maintenance-media', false, 20971520, array['image/png','image/jpeg','image/webp','video/mp4']),
  ('documents', 'documents', false, 15728640, array['application/pdf','image/png','image/jpeg']),
  ('property-media', 'property-media', true, 20971520, array['image/png','image/jpeg','image/webp']),
  ('vacancy-media', 'vacancy-media', true, 20971520, array['image/png','image/jpeg','image/webp']),
  ('chat-media', 'chat-media', false, 20971520, array['image/png','image/jpeg','image/webp','application/pdf'])
on conflict (id) do nothing;

-- ---------- avatars: public read, owner write ----------
create policy "avatars_public_read" on storage.objects for select
  using (bucket_id = 'avatars');
create policy "avatars_owner_write" on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_owner_update" on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_owner_delete" on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------- maintenance-media: private, resident (own request) + assigned technician + admin ----------
-- Folder = maintenance_requests.id. Uses the existing Phase 5 recursion-safe
-- helpers instead of re-deriving the same ownership joins.
create policy "maintenance_media_select" on storage.objects for select
  using (
    bucket_id = 'maintenance-media' and (
      public.resident_owns_request(((storage.foldername(name))[1])::uuid)
      or public.technician_assigned_to_request(((storage.foldername(name))[1])::uuid)
      or public.is_admin()
    )
  );
create policy "maintenance_media_insert" on storage.objects for insert
  with check (
    bucket_id = 'maintenance-media' and (
      public.resident_owns_request(((storage.foldername(name))[1])::uuid)
      or public.technician_assigned_to_request(((storage.foldername(name))[1])::uuid)
      or public.is_admin()
    )
  );
create policy "maintenance_media_delete" on storage.objects for delete
  using (
    bucket_id = 'maintenance-media' and (
      public.resident_owns_request(((storage.foldername(name))[1])::uuid)
      or public.is_admin()
    )
  );

-- ---------- documents: private, application's applicant + the vacancy's landlord + admin ----------
-- Folder = vacancy_applications.id.
create function public.owns_or_manages_application(p_application_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.vacancy_applications va
    where va.id = p_application_id and va.applicant_id = auth.uid()
  ) or exists (
    select 1 from public.vacancy_applications va join public.vacancies v on v.id = va.vacancy_id
    where va.id = p_application_id and v.landlord_id = auth.uid()
  );
$$;

create policy "documents_select" on storage.objects for select
  using (
    bucket_id = 'documents' and (
      public.owns_or_manages_application(((storage.foldername(name))[1])::uuid) or public.is_admin()
    )
  );
create policy "documents_insert" on storage.objects for insert
  with check (
    bucket_id = 'documents' and (
      public.owns_or_manages_application(((storage.foldername(name))[1])::uuid) or public.is_admin()
    )
  );
create policy "documents_delete" on storage.objects for delete
  using (
    bucket_id = 'documents' and (
      public.owns_or_manages_application(((storage.foldername(name))[1])::uuid) or public.is_admin()
    )
  );

-- ---------- property-media: apartment/unit photos, admin/landlord write, public read ----------
-- Folder = apartments.id. Reuses manages_apartment() (Phase 10), which
-- already covers super_admin/apartment_admin/property_manager/landlord.
create policy "property_media_public_read" on storage.objects for select
  using (bucket_id = 'property-media');
create policy "property_media_write" on storage.objects for insert
  with check (bucket_id = 'property-media' and public.manages_apartment(((storage.foldername(name))[1])::uuid));
create policy "property_media_update" on storage.objects for update
  using (bucket_id = 'property-media' and public.manages_apartment(((storage.foldername(name))[1])::uuid));
create policy "property_media_delete" on storage.objects for delete
  using (bucket_id = 'property-media' and public.manages_apartment(((storage.foldername(name))[1])::uuid));

-- ---------- vacancy-media: listing photos, landlord (own) write, public read ----------
-- Folder = vacancies.id. Bucket is public (read doesn't need to wait for
-- "published" — an unpublished draft's photos aren't linked from anywhere
-- public yet, so gating read by publish status would add RLS cost for no
-- real exposure difference; the vacancy row itself already gates whether
-- anyone can discover the vacancy_id to build the path from).
create policy "vacancy_media_public_read" on storage.objects for select
  using (bucket_id = 'vacancy-media');
create policy "vacancy_media_write" on storage.objects for insert
  with check (
    bucket_id = 'vacancy-media' and (
      exists (select 1 from public.vacancies v where v.id = ((storage.foldername(name))[1])::uuid and v.landlord_id = auth.uid())
      or public.is_admin()
    )
  );
create policy "vacancy_media_delete" on storage.objects for delete
  using (
    bucket_id = 'vacancy-media' and (
      exists (select 1 from public.vacancies v where v.id = ((storage.foldername(name))[1])::uuid and v.landlord_id = auth.uid())
      or public.is_admin()
    )
  );

-- ---------- chat-media: private, chat participants only ----------
-- Folder = chats.id. Reuses is_chat_participant() (Phase 5).
create policy "chat_media_select" on storage.objects for select
  using (bucket_id = 'chat-media' and public.is_chat_participant(((storage.foldername(name))[1])::uuid));
create policy "chat_media_insert" on storage.objects for insert
  with check (bucket_id = 'chat-media' and public.is_chat_participant(((storage.foldername(name))[1])::uuid));
