/*
============================================================
File: supabase/migrations/0024_supabase_status_and_rls_performance_hardening.sql
Project: BizPilot AI
Description: Supabase 2026 RLS performance and operational-status hardening.
Role: Adds policy-supporting indexes and rewrites fixed auth.uid() checks through initPlan-friendly select wrappers without changing data.
Related:
- supabase/migrations/README.md
- tests/unit/supabase-database-readiness-source.test.mts
- tests/rls/rls-helper-functions.test.sql
Author: MoOoH
Created: 2026-07-04
Last Updated: 2026-07-04
Change Log:
- 2026-07-04: Added non-destructive RLS helper/index hardening aligned with current Supabase RLS performance guidance.
============================================================
*/

/*
  Supabase RLS performance guidance recommends indexing columns used by RLS
  and wrapping fixed auth/JWT calls in SELECT so Postgres can plan them once
  per statement. This migration does not delete, truncate, restart, resize, or
  change customer data. It only tightens helper/policy execution paths.
*/

create index if not exists business_members_business_user_status_role_idx
  on public.business_members(business_id, user_id, status, role);

create index if not exists businesses_id_status_lifecycle_plan_idx
  on public.businesses(id, status, lifecycle_status, plan_slug);

create index if not exists public_link_variants_business_active_idx
  on public.public_link_variants(business_id, is_active);

create index if not exists intake_forms_id_business_active_idx
  on public.intake_forms(id, business_id, is_active);

create index if not exists consent_versions_id_business_active_idx
  on public.consent_versions(id, business_id, is_active);

create index if not exists intake_form_fields_form_business_hidden_idx
  on public.intake_form_fields(intake_form_id, business_id, is_hidden);

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
    join public.businesses b
      on b.id = bm.business_id
    where bm.business_id = target_business_id
      and bm.user_id = (select auth.uid())
      and bm.status = 'active'
      and b.status in ('onboarding', 'active')
      and b.lifecycle_status in ('active', 'archived')
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
    join public.businesses b
      on b.id = bm.business_id
    where bm.business_id = target_business_id
      and bm.user_id = (select auth.uid())
      and bm.status = 'active'
      and bm.role in ('owner', 'admin')
      and b.status in ('onboarding', 'active')
      and b.lifecycle_status in ('active', 'archived')
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
      and b.owner_user_id = (select auth.uid())
  );
$$;

create or replace function public.can_request_business_deletion(
  target_business_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.business_members bm
    join public.businesses b
      on b.id = bm.business_id
    where bm.business_id = target_business_id
      and bm.user_id = (select auth.uid())
      and bm.role = 'owner'
      and bm.status = 'active'
      and b.status = 'active'
      and b.lifecycle_status = 'active'
  );
$$;

comment on function public.can_request_business_deletion(uuid) is
  'Owner-only workspace deletion request helper. Does not grant auth user/account deletion.';

create or replace function public.can_view_business_deletion_request(
  target_business_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.business_members bm
    join public.businesses b
      on b.id = bm.business_id
    where bm.business_id = target_business_id
      and bm.user_id = (select auth.uid())
      and bm.role = 'owner'
      and bm.status = 'active'
      and b.lifecycle_status in ('active', 'deletion_requested', 'deleting')
  );
$$;

comment on function public.can_view_business_deletion_request(uuid) is
  'Owner-only deletion request visibility helper. Separate from insert eligibility so owners can still view pending requests after the workspace is locked.';

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "businesses_insert_owner" on public.businesses;
create policy "businesses_insert_owner"
on public.businesses
for insert
to authenticated
with check (owner_user_id = (select auth.uid()));

drop policy if exists "business_members_insert_owner_membership"
  on public.business_members;
create policy "business_members_insert_owner_membership"
on public.business_members
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and role = 'owner'
  and public.owns_business(business_id)
);

drop policy if exists "business_deletion_requests_insert_owner_pending"
  on public.business_deletion_requests;
create policy "business_deletion_requests_insert_owner_pending"
on public.business_deletion_requests
for insert
to authenticated
with check (
  requested_by_user_id = (select auth.uid())
  and status = 'pending'
  and request_type = 'production_deletion'
  and cancelled_at is null
  and cancelled_by_user_id is null
  and approved_at is null
  and approved_by_user_id is null
  and processing_started_at is null
  and completed_at is null
  and rejected_at is null
  and public.can_request_business_deletion(business_id)
);

grant execute on function public.is_business_member(uuid)
  to anon, authenticated, service_role;

grant execute on function public.can_manage_business(uuid)
  to anon, authenticated, service_role;

grant execute on function public.owns_business(uuid)
  to anon, authenticated, service_role;

grant execute on function public.can_request_business_deletion(uuid)
  to authenticated, service_role;

grant execute on function public.can_view_business_deletion_request(uuid)
  to authenticated, service_role;
