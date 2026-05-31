-- Djera Driver — drivers table (Phase 2, first real schema).
-- Run in the Supabase SQL editor (or via the Supabase CLI). Each driver row is
-- keyed to the authenticated auth.users id and protected by RLS so a driver can
-- only read/write their OWN row. Admin access is via the service_role key
-- (admin dashboard) which bypasses RLS — admin policies come later.

-- Application review status.
do $$ begin
  create type public.driver_status as enum ('pending', 'approved', 'suspended');
exception when duplicate_object then null; end $$;

create table if not exists public.drivers (
  id                      uuid primary key references auth.users (id) on delete cascade,
  email                   text,            -- mirrors auth.users.email (convenience for admin queries)
  full_name               text not null,
  phone                   text not null,
  national_id             text not null,
  license_number          text not null,
  plate                   text not null,
  -- Storage object paths in the private `driver-docs` bucket (null until uploaded).
  id_photo_path           text,
  license_photo_path      text,
  status                  public.driver_status not null default 'pending',
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table public.drivers enable row level security;

-- A signed-in driver can read / create / update only their own row.
drop policy if exists "drivers_select_own" on public.drivers;
create policy "drivers_select_own" on public.drivers
  for select using (auth.uid() = id);

drop policy if exists "drivers_insert_own" on public.drivers;
create policy "drivers_insert_own" on public.drivers
  for insert with check (auth.uid() = id);

drop policy if exists "drivers_update_own" on public.drivers;
create policy "drivers_update_own" on public.drivers
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Keep updated_at fresh on every update.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists drivers_set_updated_at on public.drivers;
create trigger drivers_set_updated_at
  before update on public.drivers
  for each row execute function public.set_updated_at();
