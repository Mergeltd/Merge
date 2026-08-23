-- docs/migration/plan.md Phase 3.
-- Replaces Prisma's User table. Credentials move to auth.users
-- (Supabase-managed); this table holds everything else the app needs
-- about a person.
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         citext not null unique,
  phone_number  text unique,
  first_name    text not null,
  last_name     text not null,
  role          user_role not null,
  status        user_status not null default 'pending',
  is_verified   boolean not null default false,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);
create index profiles_role_idx on public.profiles(role);
create index profiles_status_idx on public.profiles(status);

-- auth.users -> profiles sync: fires on every Supabase Auth signup.
-- Role and name arrive via the `data` object passed to
-- supabase.auth.signUp() (docs/migration/plan.md Phase 4).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'resident')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
