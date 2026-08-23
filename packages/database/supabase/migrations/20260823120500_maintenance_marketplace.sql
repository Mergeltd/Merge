-- docs/migration/plan.md Phase 3.
create table public.maintenance_requests (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null,
  urgency     request_urgency not null default 'medium',
  status      request_status not null default 'open',
  resident_id uuid not null references public.residents(id) on delete cascade,
  unit_id     uuid not null references public.units(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  media_keys  text[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);
create index mr_resident_idx on public.maintenance_requests(resident_id);
create index mr_unit_idx on public.maintenance_requests(unit_id);
create index mr_category_idx on public.maintenance_requests(category_id);
create index mr_status_idx on public.maintenance_requests(status);

create table public.bookings (
  id            uuid primary key default gen_random_uuid(),
  request_id    uuid not null references public.maintenance_requests(id) on delete cascade,
  technician_id uuid not null references public.technicians(id) on delete cascade,
  scheduled_at  timestamptz not null,
  status        booking_status not null default 'proposed',
  total_amount  numeric(12,2) not null default 0,
  invoice_url   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);
create index bookings_request_idx on public.bookings(request_id);
create index bookings_technician_idx on public.bookings(technician_id);
create index bookings_status_idx on public.bookings(status);

-- Peer-to-peer technician collaboration system.
create table public.collaborations (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null unique references public.bookings(id) on delete cascade,
  status       collaboration_status not null default 'proposed',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.collaboration_members (
  id               uuid primary key default gen_random_uuid(),
  collaboration_id uuid not null references public.collaborations(id) on delete cascade,
  technician_id    uuid not null references public.technicians(id) on delete cascade,
  role_description text,
  split_percentage numeric(5,2) not null,
  amount_earned    numeric(12,2) not null default 0,
  is_creator       boolean not null default false,
  is_accepted      boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (collaboration_id, technician_id)
);
create index cm_collaboration_idx on public.collaboration_members(collaboration_id);
create index cm_technician_idx on public.collaboration_members(technician_id);
