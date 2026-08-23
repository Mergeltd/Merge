-- docs/migration/plan.md Phase 3 / Phase 5. Every table: enable row level
-- security + force it (so even the table owner is bound by policy in
-- normal application code paths — Edge Functions use the service-role key
-- to bypass this deliberately, e.g. payment webhooks). No policy here uses
-- `using (true)` for write access; the only bare `using (true)` reads are
-- categories and reviews, both intentionally public catalog/reputation
-- data.

-- ---------- profiles ----------
alter table public.profiles enable row level security;
alter table public.profiles force row level security;

create policy "profiles_select_own_or_admin" on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own" on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));
  -- role is pinned to its current value in the WITH CHECK, so a user can
  -- edit their own name/avatar/phone but never self-promote.

create policy "profiles_admin_manage" on public.profiles for all
  using (public.is_super_admin()) with check (public.is_super_admin());

-- ---------- apartments / buildings / units ----------
alter table public.apartments enable row level security;
alter table public.apartments force row level security;
create policy "apartments_read_authenticated" on public.apartments for select
  using (auth.role() = 'authenticated');
create policy "apartments_write_managers" on public.apartments for all
  using (public.manages_apartment(id)) with check (public.manages_apartment(id));
create policy "apartments_insert_admin" on public.apartments for insert
  with check (public.is_super_admin());

alter table public.buildings enable row level security;
alter table public.buildings force row level security;
create policy "buildings_read_authenticated" on public.buildings for select
  using (auth.role() = 'authenticated');
create policy "buildings_write_managers" on public.buildings for all
  using (public.manages_apartment(apartment_id)) with check (public.manages_apartment(apartment_id));

alter table public.units enable row level security;
alter table public.units force row level security;
create policy "units_read_authenticated" on public.units for select
  using (auth.role() = 'authenticated');
create policy "units_write_managers" on public.units for all
  using (public.manages_apartment(
    (select apartment_id from public.buildings where id = building_id)
  ));

-- ---------- residents ----------
alter table public.residents enable row level security;
alter table public.residents force row level security;
create policy "residents_select_self_or_manager" on public.residents for select
  using (user_id = auth.uid() or public.manages_apartment(apartment_id));
create policy "residents_write_manager" on public.residents for all
  using (public.manages_apartment(apartment_id)) with check (public.manages_apartment(apartment_id));

-- ---------- landlords / landlord_apartments / property_managers / property_manager_apartments ----------
alter table public.landlords enable row level security;
alter table public.landlords force row level security;
create policy "landlords_select_self_or_admin" on public.landlords for select
  using (user_id = auth.uid() or public.is_admin());
create policy "landlords_admin_manage" on public.landlords for all
  using (public.is_super_admin());

alter table public.landlord_apartments enable row level security;
alter table public.landlord_apartments force row level security;
create policy "la_select_self_or_admin" on public.landlord_apartments for select
  using (
    exists (select 1 from public.landlords l where l.id = landlord_id and l.user_id = auth.uid())
    or public.is_admin()
  );
create policy "la_admin_manage" on public.landlord_apartments for all using (public.is_super_admin());

alter table public.property_managers enable row level security;
alter table public.property_managers force row level security;
create policy "pm_select_self_or_admin" on public.property_managers for select
  using (user_id = auth.uid() or public.is_admin());
create policy "pm_admin_manage" on public.property_managers for all using (public.is_super_admin());

alter table public.property_manager_apartments enable row level security;
alter table public.property_manager_apartments force row level security;
create policy "pma_select_self_or_admin" on public.property_manager_apartments for select
  using (
    exists (select 1 from public.property_managers pm where pm.id = manager_id and pm.user_id = auth.uid())
    or public.is_admin()
  );
create policy "pma_admin_manage" on public.property_manager_apartments for all using (public.is_super_admin());

-- ---------- categories / technicians / technician_categories ----------
alter table public.categories enable row level security;
alter table public.categories force row level security;
create policy "categories_public_read" on public.categories for select using (true);
create policy "categories_admin_write" on public.categories for insert with check (public.is_super_admin());
create policy "categories_admin_update" on public.categories for update using (public.is_super_admin());
create policy "categories_admin_delete" on public.categories for delete using (public.is_super_admin());

alter table public.technicians enable row level security;
alter table public.technicians force row level security;
create policy "technicians_public_read_verified" on public.technicians for select
  using (verification_status = 'verified' or user_id = auth.uid() or public.is_admin());
create policy "technicians_update_self" on public.technicians for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and verification_status = (select verification_status from public.technicians where id = technicians.id));
  -- a technician can edit bio/availability/categories but not self-verify
create policy "technicians_insert_self" on public.technicians for insert
  with check (user_id = auth.uid() and (select role from public.profiles where id = auth.uid()) = 'technician');
create policy "technicians_admin_verify" on public.technicians for update
  using (public.is_super_admin());

alter table public.technician_categories enable row level security;
alter table public.technician_categories force row level security;
create policy "tc_public_read" on public.technician_categories for select using (true);
create policy "tc_write_self_or_admin" on public.technician_categories for all
  using (
    exists (select 1 from public.technicians t where t.id = technician_id and t.user_id = auth.uid())
    or public.is_admin()
  );

-- ---------- maintenance_requests ----------
alter table public.maintenance_requests enable row level security;
alter table public.maintenance_requests force row level security;
create policy "mr_select_involved" on public.maintenance_requests for select
  using (
    exists (select 1 from public.residents r where r.id = resident_id and r.user_id = auth.uid())
    or status = 'open'  -- verified technicians browse the open marketplace
    or exists (
      select 1 from public.bookings b join public.technicians t on t.id = b.technician_id
      where b.request_id = maintenance_requests.id and t.user_id = auth.uid()
    )
    or public.is_admin()
  );
create policy "mr_insert_own_resident" on public.maintenance_requests for insert
  with check (exists (select 1 from public.residents r where r.id = resident_id and r.user_id = auth.uid()));
create policy "mr_update_owner_or_admin" on public.maintenance_requests for update
  using (
    exists (select 1 from public.residents r where r.id = resident_id and r.user_id = auth.uid())
    or public.is_admin()
  );

-- ---------- bookings ----------
alter table public.bookings enable row level security;
alter table public.bookings force row level security;
create policy "bookings_select_involved" on public.bookings for select
  using (
    exists (select 1 from public.technicians t where t.id = technician_id and t.user_id = auth.uid())
    or exists (
      select 1 from public.maintenance_requests mr join public.residents r on r.id = mr.resident_id
      where mr.id = request_id and r.user_id = auth.uid()
    )
    or public.is_admin()
  );
create policy "bookings_technician_update_own" on public.bookings for update
  using (exists (select 1 from public.technicians t where t.id = technician_id and t.user_id = auth.uid()))
  with check (exists (select 1 from public.technicians t where t.id = technician_id and t.user_id = auth.uid()));
create policy "bookings_admin_manage" on public.bookings for all using (public.is_admin());

-- ---------- collaborations / collaboration_members ----------
alter table public.collaborations enable row level security;
alter table public.collaborations force row level security;
create policy "collab_select_member_or_admin" on public.collaborations for select
  using (
    exists (
      select 1 from public.collaboration_members cm join public.technicians t on t.id = cm.technician_id
      where cm.collaboration_id = collaborations.id and t.user_id = auth.uid()
    ) or public.is_admin()
  );

alter table public.collaboration_members enable row level security;
alter table public.collaboration_members force row level security;
create policy "cm_select_self_or_admin" on public.collaboration_members for select
  using (exists (select 1 from public.technicians t where t.id = technician_id and t.user_id = auth.uid()) or public.is_admin());
create policy "cm_update_self_accept" on public.collaboration_members for update
  using (exists (select 1 from public.technicians t where t.id = technician_id and t.user_id = auth.uid()));

-- ---------- wallets / transactions / revenue_shares ----------
-- The backend audit found the current WalletService has *zero*
-- authorization checks — any authenticated user could deposit/transfer/
-- read any wallet by id. This is the single most important gap RLS closes.
alter table public.wallets enable row level security;
alter table public.wallets force row level security;
create policy "wallets_select_own_or_admin" on public.wallets for select
  using (
    user_id = auth.uid()
    or exists (select 1 from public.residents r where r.id = resident_id and r.user_id = auth.uid())
    or exists (select 1 from public.technicians t where t.id = technician_id and t.user_id = auth.uid())
    or (apartment_id is not null and public.manages_apartment(apartment_id))
    or public.is_admin()
  );
-- Direct INSERT/UPDATE on wallets is intentionally NOT granted to any
-- role — all balance mutation goes through transfer_wallet_funds()
-- (20260823121400_business_functions.sql), a SECURITY DEFINER function,
-- so balances can never be edited except via the audited, atomic path.

alter table public.transactions enable row level security;
alter table public.transactions force row level security;
create policy "tx_select_own_or_admin" on public.transactions for select
  using (
    exists (
      select 1 from public.wallets w
      where w.id in (sender_wallet_id, recipient_wallet_id)
        and (
          w.user_id = auth.uid()
          or exists (select 1 from public.residents r where r.id = w.resident_id and r.user_id = auth.uid())
          or exists (select 1 from public.technicians t where t.id = w.technician_id and t.user_id = auth.uid())
        )
    )
    or public.is_admin()
  );
-- No client-side INSERT policy: transactions are only ever created by
-- transfer_wallet_funds() or the payments-webhook Edge Function (Phase 13).

alter table public.revenue_shares enable row level security;
alter table public.revenue_shares force row level security;
create policy "revenue_shares_admin_only" on public.revenue_shares for select using (public.is_admin());

-- ---------- vacancies / vacancy_applications ----------
alter table public.vacancies enable row level security;
alter table public.vacancies force row level security;
create policy "vacancies_public_read_published" on public.vacancies for select
  using (status = 'published' or landlord_id = auth.uid() or public.is_admin());
create policy "vacancies_owner_write" on public.vacancies for all
  using (landlord_id = auth.uid() or public.is_admin())
  with check (landlord_id = auth.uid() or public.is_admin());

alter table public.vacancy_applications enable row level security;
alter table public.vacancy_applications force row level security;
create policy "va_select_applicant_or_owner" on public.vacancy_applications for select
  using (
    applicant_id = auth.uid()
    or exists (select 1 from public.vacancies v where v.id = vacancy_id and v.landlord_id = auth.uid())
    or public.is_admin()
  );
create policy "va_insert_self" on public.vacancy_applications for insert
  with check (applicant_id = auth.uid());
create policy "va_update_owner_only" on public.vacancy_applications for update
  using (exists (select 1 from public.vacancies v where v.id = vacancy_id and v.landlord_id = auth.uid()) or public.is_admin());

-- ---------- chats / chat_participants / messages ----------
alter table public.chats enable row level security;
alter table public.chats force row level security;
create policy "chats_select_participant" on public.chats for select
  using (exists (select 1 from public.chat_participants cp where cp.chat_id = chats.id and cp.user_id = auth.uid()));

alter table public.chat_participants enable row level security;
alter table public.chat_participants force row level security;
create policy "cp_select_own_chats" on public.chat_participants for select
  using (exists (select 1 from public.chat_participants me where me.chat_id = chat_participants.chat_id and me.user_id = auth.uid()));

alter table public.messages enable row level security;
alter table public.messages force row level security;
create policy "messages_select_participant" on public.messages for select
  using (exists (select 1 from public.chat_participants cp where cp.chat_id = messages.chat_id and cp.user_id = auth.uid()));
create policy "messages_insert_participant" on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (select 1 from public.chat_participants cp where cp.chat_id = messages.chat_id and cp.user_id = auth.uid())
  );

-- ---------- notifications ----------
alter table public.notifications enable row level security;
alter table public.notifications force row level security;
create policy "notifications_select_own" on public.notifications for select using (user_id = auth.uid());
create policy "notifications_update_own" on public.notifications for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());
-- INSERT is deliberately not granted to authenticated users; notifications
-- are written by triggers/Edge Functions using the service-role key
-- (Phase 11).

-- ---------- reviews ----------
alter table public.reviews enable row level security;
alter table public.reviews force row level security;
create policy "reviews_public_read" on public.reviews for select using (true);
create policy "reviews_insert_participant" on public.reviews for insert
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.bookings b
      join public.maintenance_requests mr on mr.id = b.request_id
      join public.residents r on r.id = mr.resident_id
      where b.id = reviews.booking_id and r.user_id = auth.uid() and b.status = 'completed'
    )
  );
  -- closes the gap flagged in the backend audit: review.service.ts never
  -- verified the reviewer participated in the booking. This policy makes
  -- that check unbypassable at the database level.

-- ---------- audit_logs / activity_logs ----------
alter table public.audit_logs enable row level security;
alter table public.audit_logs force row level security;
create policy "audit_logs_admin_read" on public.audit_logs for select using (public.is_super_admin());
-- No client INSERT policy — written only by triggers/Edge Functions with
-- the service-role key, which finally makes audit logging non-optional
-- (today's AuditService exists but nothing calls it — see the audit).

alter table public.activity_logs enable row level security;
alter table public.activity_logs force row level security;
create policy "activity_logs_admin_read" on public.activity_logs for select using (public.is_super_admin());

-- ---------- ai_conversations / ai_messages ----------
alter table public.ai_conversations enable row level security;
alter table public.ai_conversations force row level security;
create policy "aic_select_own" on public.ai_conversations for select using (user_id = auth.uid());
create policy "aic_insert_own" on public.ai_conversations for insert with check (user_id = auth.uid());

alter table public.ai_messages enable row level security;
alter table public.ai_messages force row level security;
create policy "aim_select_own" on public.ai_messages for select
  using (exists (select 1 from public.ai_conversations c where c.id = conversation_id and c.user_id = auth.uid()));
create policy "aim_insert_own" on public.ai_messages for insert
  with check (exists (select 1 from public.ai_conversations c where c.id = conversation_id and c.user_id = auth.uid()));

-- ---------- subscriptions / file_records / settings ----------
alter table public.subscriptions enable row level security;
alter table public.subscriptions force row level security;
create policy "subscriptions_admin_only" on public.subscriptions for all using (public.is_admin());

alter table public.file_records enable row level security;
alter table public.file_records force row level security;
create policy "file_records_select_own_or_admin" on public.file_records for select
  using (uploaded_by_id = auth.uid() or public.is_admin());
create policy "file_records_insert_own" on public.file_records for insert
  with check (uploaded_by_id = auth.uid());

alter table public.settings enable row level security;
alter table public.settings force row level security;
create policy "settings_admin_only" on public.settings for all using (public.is_super_admin());

-- ---------- notices ----------
-- Table created in 20260823121200_notices.sql; policies live here (see the
-- note in that file for why).
alter table public.notices enable row level security;
alter table public.notices force row level security;
create policy "notices_read_own_apartment" on public.notices for select
  using (
    (
      published_at is not null and (expires_at is null or expires_at > now())
      and exists (
        select 1 from public.residents r
        where r.apartment_id = notices.apartment_id and r.user_id = auth.uid()
      )
    )
    or public.manages_apartment(apartment_id)
  );
create policy "notices_write_managers" on public.notices for all
  using (public.manages_apartment(apartment_id)) with check (public.manages_apartment(apartment_id));
