-- docs/migration/plan.md Phase 5. Second recursion bug found by running
-- the test suite: cp_select_own_chats queried chat_participants from
-- within chat_participants' own policy (a same-table self-reference,
-- exactly the pattern Supabase's own RLS guidance warns causes this),
-- and chats_select_participant / messages_select_participant /
-- messages_insert_participant all had the same underlying issue one hop
-- removed. One helper function fixes all four.
create function public.is_chat_participant(p_chat_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.chat_participants cp where cp.chat_id = p_chat_id and cp.user_id = auth.uid()
  );
$$;

drop policy "chats_select_participant" on public.chats;
create policy "chats_select_participant" on public.chats for select
  using (public.is_chat_participant(chats.id));

drop policy "cp_select_own_chats" on public.chat_participants;
create policy "cp_select_own_chats" on public.chat_participants for select
  using (public.is_chat_participant(chat_participants.chat_id));

drop policy "messages_select_participant" on public.messages;
create policy "messages_select_participant" on public.messages for select
  using (public.is_chat_participant(messages.chat_id));

drop policy "messages_insert_participant" on public.messages;
create policy "messages_insert_participant" on public.messages for insert
  with check (sender_id = auth.uid() and public.is_chat_participant(messages.chat_id));
