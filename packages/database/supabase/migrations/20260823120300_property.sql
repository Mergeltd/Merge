-- docs/migration/plan.md Phase 3.
create table public.apartments (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  address    text not null,
  city       text not null,
  country    text not null default 'Kenya',
  latitude   double precision,
  longitude  double precision,
  logo_url   text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index apartments_city_idx on public.apartments(city);

create table public.buildings (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  apartment_id uuid not null references public.apartments(id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  deleted_at   timestamptz
);
create index buildings_apartment_idx on public.buildings(apartment_id);

create table public.units (
  id          uuid primary key default gen_random_uuid(),
  number      text not null,
  floor       int not null,
  status      occupancy_status not null default 'vacant',
  rent_amount numeric(12,2) not null,
  building_id uuid not null references public.buildings(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);
create index units_building_idx on public.units(building_id);
create index units_status_idx on public.units(status);
