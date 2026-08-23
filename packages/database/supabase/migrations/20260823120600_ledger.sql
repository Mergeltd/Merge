-- docs/migration/plan.md Phase 3.
create table public.wallets (
  id            uuid primary key default gen_random_uuid(),
  wallet_type   wallet_type not null,
  status        wallet_status not null default 'active',
  balance       numeric(12,2) not null default 0,
  currency      text not null default 'KES',
  user_id       uuid references public.profiles(id) on delete set null,
  resident_id   uuid references public.residents(id) on delete set null,
  technician_id uuid references public.technicians(id) on delete set null,
  apartment_id  uuid references public.apartments(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz,
  constraint wallets_balance_nonnegative check (balance >= 0)
);
create index wallets_type_idx on public.wallets(wallet_type);
create index wallets_resident_idx on public.wallets(resident_id);
create index wallets_technician_idx on public.wallets(technician_id);
create index wallets_apartment_idx on public.wallets(apartment_id);

create table public.transactions (
  id                  uuid primary key default gen_random_uuid(),
  reference           text not null unique,
  amount              numeric(12,2) not null check (amount > 0),
  type                transaction_type not null,
  status              transaction_status not null default 'pending',
  sender_wallet_id    uuid references public.wallets(id) on delete set null,
  recipient_wallet_id uuid references public.wallets(id) on delete set null,
  booking_id          uuid references public.bookings(id) on delete set null,
  gateway             payment_gateway not null,
  gateway_reference   text,
  description         text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index tx_sender_idx on public.transactions(sender_wallet_id);
create index tx_recipient_idx on public.transactions(recipient_wallet_id);
create index tx_booking_idx on public.transactions(booking_id);
create index tx_type_idx on public.transactions(type);
create index tx_status_idx on public.transactions(status);

create table public.revenue_shares (
  id                 uuid primary key default gen_random_uuid(),
  booking_id         uuid not null unique references public.bookings(id) on delete cascade,
  total_amount       numeric(12,2) not null,
  platform_fee       numeric(12,2) not null,
  lead_tech_share    numeric(12,2) not null,
  collab_techs_share numeric(12,2) not null default 0,
  is_settled         boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
