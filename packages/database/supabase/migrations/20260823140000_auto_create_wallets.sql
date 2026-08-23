-- docs/migration/plan.md Phase 7. Found while wiring the resident wallet
-- page: nothing ever created a resident's wallets row (no trigger, and
-- wallets deliberately has no client INSERT policy — see the audit's
-- wallets_select_own_or_admin comment in 20260823121600_rls_policies.sql),
-- so a freshly-created resident would hit a hard "no wallet" error the
-- first time they opened the Wallet page. Auto-create one wallet per
-- resident/technician/landlord on creation instead, the same way the old
-- NestJS backend's wallet.service.ts had an ensureWalletExists() escape
-- hatch (but as a trigger, so it can't be forgotten at a call site).
create function public.create_wallet_for_resident()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.wallets (wallet_type, resident_id) values ('resident', new.id);
  return new;
end;
$$;

create trigger residents_create_wallet
  after insert on public.residents
  for each row execute function public.create_wallet_for_resident();

create function public.create_wallet_for_technician()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.wallets (wallet_type, technician_id) values ('technician', new.id);
  return new;
end;
$$;

create trigger technicians_create_wallet
  after insert on public.technicians
  for each row execute function public.create_wallet_for_technician();

create function public.create_wallet_for_landlord()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.wallets (wallet_type, user_id) values ('landlord', new.user_id);
  return new;
end;
$$;

create trigger landlords_create_wallet
  after insert on public.landlords
  for each row execute function public.create_wallet_for_landlord();
