-- docs/migration/plan.md Phase 3.
create table public.ai_conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  request_id uuid unique references public.maintenance_requests(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index aic_user_idx on public.ai_conversations(user_id);

create table public.ai_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role            ai_role not null,
  content         text not null,
  metadata        jsonb,
  created_at      timestamptz not null default now()
);
create index aim_conversation_idx on public.ai_messages(conversation_id);
create index aim_created_idx on public.ai_messages(created_at);
