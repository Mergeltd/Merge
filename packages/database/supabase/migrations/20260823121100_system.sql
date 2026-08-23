-- docs/migration/plan.md Phase 3.
create table public.subscriptions (
  id              uuid primary key default gen_random_uuid(),
  subscriber_type subscriber_type not null,
  subscriber_id   uuid not null,
  plan_name       text not null,
  status          subscription_status not null default 'active',
  price           numeric(12,2) not null,
  currency        text not null default 'KES',
  billing_period  text not null,
  starts_at       timestamptz not null default now(),
  ends_at         timestamptz not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index subscriptions_subscriber_idx on public.subscriptions(subscriber_id);
create index subscriptions_type_idx on public.subscriptions(subscriber_type);
create index subscriptions_status_idx on public.subscriptions(status);

create table public.file_records (
  id             uuid primary key default gen_random_uuid(),
  key            text not null unique,
  bucket         text not null,
  original_name  text not null,
  mime_type      text not null,
  size           int not null,
  uploaded_by_id uuid not null references public.profiles(id) on delete cascade,
  created_at     timestamptz not null default now()
);
create index file_records_uploader_idx on public.file_records(uploaded_by_id);

create table public.settings (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,
  value       text not null,
  "group"     text not null default 'GENERAL',
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
