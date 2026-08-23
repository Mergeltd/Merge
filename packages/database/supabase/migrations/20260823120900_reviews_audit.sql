-- docs/migration/plan.md Phase 3.
create table public.reviews (
  id                     uuid primary key default gen_random_uuid(),
  booking_id             uuid not null references public.bookings(id) on delete cascade,
  author_id              uuid not null references public.profiles(id) on delete cascade,
  target_technician_id   uuid not null references public.technicians(id) on delete cascade,
  rating                 int not null check (rating between 1 and 5),
  quality_rating         int not null check (quality_rating between 1 and 5),
  speed_rating           int not null check (speed_rating between 1 and 5),
  professionalism_rating int not null check (professionalism_rating between 1 and 5),
  comment                text,
  created_at             timestamptz not null default now(),
  unique (booking_id, author_id)
);
create index reviews_booking_idx on public.reviews(booking_id);
create index reviews_technician_idx on public.reviews(target_technician_id);

create table public.audit_logs (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references public.profiles(id) on delete set null,
  action         text not null,
  entity_name    text not null,
  entity_id      uuid,
  previous_state jsonb,
  new_state      jsonb,
  ip_address     text,
  user_agent     text,
  created_at     timestamptz not null default now()
);
create index audit_user_idx on public.audit_logs(user_id);
create index audit_action_idx on public.audit_logs(action);
create index audit_created_idx on public.audit_logs(created_at);

create table public.activity_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  activity_type text not null,
  description   text not null,
  ip_address    text,
  user_agent    text,
  created_at    timestamptz not null default now()
);
create index activity_user_idx on public.activity_logs(user_id);
create index activity_created_idx on public.activity_logs(created_at);
