-- docs/migration/plan.md Phase 3.
create table public.vacancies (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  description    text not null,
  rent_amount    numeric(12,2) not null,
  deposit_amount numeric(12,2) not null,
  bedrooms       int not null,
  bathrooms      int not null,
  status         vacancy_status not null default 'draft',
  landlord_id    uuid not null references public.profiles(id) on delete cascade,
  unit_id        uuid references public.units(id) on delete set null,
  media_keys     text[] not null default '{}',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz
);
create index vacancies_landlord_idx on public.vacancies(landlord_id);
create index vacancies_unit_idx on public.vacancies(unit_id);
create index vacancies_status_idx on public.vacancies(status);

create table public.vacancy_applications (
  id                uuid primary key default gen_random_uuid(),
  vacancy_id        uuid not null references public.vacancies(id) on delete cascade,
  applicant_id      uuid not null references public.profiles(id) on delete cascade,
  status            application_status not null default 'submitted',
  credit_report_url text,
  rent_history_url  text,
  monthly_income    numeric(12,2) not null,
  employer_name     text,
  applicant_notes   text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index va_vacancy_idx on public.vacancy_applications(vacancy_id);
create index va_applicant_idx on public.vacancy_applications(applicant_id);
create index va_status_idx on public.vacancy_applications(status);
