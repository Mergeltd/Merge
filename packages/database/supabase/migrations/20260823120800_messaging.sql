-- docs/migration/plan.md Phase 3.
create table public.chats (
  id         uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  type       chat_type not null default 'direct',
  title      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index chats_booking_idx on public.chats(booking_id);

create table public.chat_participants (
  id        uuid primary key default gen_random_uuid(),
  chat_id   uuid not null references public.chats(id) on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (chat_id, user_id)
);
create index cp_chat_idx on public.chat_participants(chat_id);
create index cp_user_idx on public.chat_participants(user_id);

create table public.messages (
  id         uuid primary key default gen_random_uuid(),
  chat_id    uuid not null references public.chats(id) on delete cascade,
  sender_id  uuid not null references public.profiles(id) on delete cascade,
  type       message_type not null default 'text',
  content    text not null,
  media_key  text,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
create index messages_chat_idx on public.messages(chat_id);
create index messages_sender_idx on public.messages(sender_id);
create index messages_created_idx on public.messages(created_at);

create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  title      text not null,
  body       text not null,
  type       text not null,
  is_read    boolean not null default false,
  payload    jsonb,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications(user_id);
create index notifications_unread_idx on public.notifications(is_read);
create index notifications_created_idx on public.notifications(created_at);
