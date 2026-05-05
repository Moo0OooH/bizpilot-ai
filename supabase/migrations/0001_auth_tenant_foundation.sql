/*
============================================================
File: supabase/migrations/0001_auth_tenant_foundation.sql
Project: BizPilot AI
Description: Creates the Phase 2 auth and tenant foundation tables.
Role: Defines profiles, businesses, business_members, triggers, and RLS policies.
Related:
- docs/engineering/BIZPILOT_DATABASE_RLS_POLICY_BASELINE_v1.0.md
- tests/rls/auth-tenant-foundation.test.sql
Author: MoOoH
Created: 2026-05-04
Last Updated: 2026-05-04
Change Log:
- 2026-05-04: Created Phase 2 auth tenant foundation migration.
- 2026-05-04: Added owner-business helper for first membership creation.
============================================================
*/

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member', 'concierge_limited')),
  created_at timestamptz not null default now(),
  unique (business_id, user_id)
);

create index if not exists profiles_user_id_idx
  on public.profiles(user_id);

create index if not exists businesses_owner_user_id_idx
  on public.businesses(owner_user_id);

create index if not exists business_members_business_id_idx
  on public.business_members(business_id);

create index if not exists business_members_user_id_idx
  on public.business_members(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists businesses_set_updated_at on public.businesses;
create trigger businesses_set_updated_at
before update on public.businesses
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();

create or replace function public.is_business_member(target_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.business_members bm
    where bm.business_id = target_business_id
      and bm.user_id = auth.uid()
  );
$$;

create or replace function public.can_manage_business(target_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.business_members bm
    where bm.business_id = target_business_id
      and bm.user_id = auth.uid()
      and bm.role in ('owner', 'admin')
  );
$$;

create or replace function public.owns_business(target_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.businesses b
    where b.id = target_business_id
      and b.owner_user_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "businesses_select_member" on public.businesses;
create policy "businesses_select_member"
on public.businesses
for select
to authenticated
using (public.is_business_member(id));

drop policy if exists "businesses_insert_owner" on public.businesses;
create policy "businesses_insert_owner"
on public.businesses
for insert
to authenticated
with check (owner_user_id = auth.uid());

drop policy if exists "businesses_update_manager" on public.businesses;
create policy "businesses_update_manager"
on public.businesses
for update
to authenticated
using (public.can_manage_business(id))
with check (public.can_manage_business(id));

drop policy if exists "business_members_select_member" on public.business_members;
create policy "business_members_select_member"
on public.business_members
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "business_members_insert_owner_membership" on public.business_members;
create policy "business_members_insert_owner_membership"
on public.business_members
for insert
to authenticated
with check (
  user_id = auth.uid()
  and role = 'owner'
  and public.owns_business(business_id)
);

drop policy if exists "business_members_manage_by_owner_or_admin" on public.business_members;
create policy "business_members_manage_by_owner_or_admin"
on public.business_members
for update
to authenticated
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));
