-- docs/migration/plan.md Phase 3.
create table public.residents (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  apartment_id uuid not null references public.apartments(id) on delete cascade,
  unit_id      uuid references public.units(id) on delete set null,
  lease_start  date,
  lease_end    date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  deleted_at   timestamptz,
  unique (user_id, apartment_id)
);
create index residents_user_idx on public.residents(user_id);
create index residents_apartment_idx on public.residents(apartment_id);
create index residents_unit_idx on public.residents(unit_id);

create table public.property_managers (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index property_managers_user_idx on public.property_managers(user_id);

create table public.property_manager_apartments (
  manager_id   uuid not null references public.property_managers(id) on delete cascade,
  apartment_id uuid not null references public.apartments(id) on delete cascade,
  primary key (manager_id, apartment_id)
);
create index pma_apartment_idx on public.property_manager_apartments(apartment_id);

create table public.landlords (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index landlords_user_idx on public.landlords(user_id);

create table public.landlord_apartments (
  landlord_id  uuid not null references public.landlords(id) on delete cascade,
  apartment_id uuid not null references public.apartments(id) on delete cascade,
  primary key (landlord_id, apartment_id)
);
create index la_apartment_idx on public.landlord_apartments(apartment_id);

create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  description text,
  parent_id   uuid references public.categories(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);
create index categories_parent_idx on public.categories(parent_id);

create table public.technicians (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  bio                 text,
  experience_years    int not null default 0,
  verification_status tech_status not null default 'pending_verification',
  id_number           text unique,
  certifications      text[] not null default '{}',
  average_rating      numeric(3,2) not null default 0,
  is_available        boolean not null default true,
  latitude            double precision,
  longitude           double precision,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  deleted_at          timestamptz
);
create index technicians_user_idx on public.technicians(user_id);
create index technicians_verification_idx on public.technicians(verification_status);
create index technicians_available_idx on public.technicians(is_available);

create table public.technician_categories (
  technician_id uuid not null references public.technicians(id) on delete cascade,
  category_id   uuid not null references public.categories(id) on delete cascade,
  primary key (technician_id, category_id)
);
create index tc_category_idx on public.technician_categories(category_id);
