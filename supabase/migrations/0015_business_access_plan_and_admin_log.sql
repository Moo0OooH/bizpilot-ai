/*
============================================================
File: supabase/migrations/0015_business_access_plan_and_admin_log.sql
Project: BizPilot AI
Description: Adds manual pilot plan/access controls and founder admin audit log.
Role: Supports the small internal Founder Admin console without adding automated billing.
Related:
- docs/product/BIZPILOT_FOUNDER_ADMIN_MINI_CONSOLE_SPEC_v1.0.md
- docs/product/BIZPILOT_PLAN_ENTITLEMENTS_AND_MANUAL_BILLING_SPEC_v1.0.md
- tests/rls/business-access-plan-admin-log.test.sql
Author: MoOoH
Created: 2026-05-22
Last Updated: 2026-05-22
Change Log:
- 2026-05-22: Added business status, manual plan assignment, member status, founder notes, and service-role admin audit log.
============================================================
*/

alter table public.businesses
  add column if not exists status text not null default 'onboarding'
    check (status in ('onboarding', 'active', 'suspended', 'cancelled')),
  add column if not exists plan_slug text not null default 'founder_pilot'
    check (plan_slug in ('founder_pilot', 'starter', 'pro', 'paused')),
  add column if not exists plan_started_at timestamptz not null default now(),
  add column if not exists plan_expires_at timestamptz,
  add column if not exists internal_note text;

alter table public.business_members
  add column if not exists status text not null default 'active'
    check (status in ('active', 'disabled'));

create index if not exists businesses_status_plan_idx
  on public.businesses(status, plan_slug);

create index if not exists business_members_user_business_status_idx
  on public.business_members(user_id, business_id, status);

create table if not exists public.admin_action_log (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  action_type text not null check (
    action_type in (
      'plan_changed',
      'status_changed',
      'business_suspended',
      'business_reactivated',
      'business_cancelled',
      'quote_link_disabled',
      'quote_link_enabled',
      'internal_note_added'
    )
  ),
  previous_values jsonb not null default '{}'::jsonb,
  new_values jsonb not null default '{}'::jsonb,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists admin_action_log_business_created_at_idx
  on public.admin_action_log(business_id, created_at desc);

create index if not exists admin_action_log_actor_created_at_idx
  on public.admin_action_log(actor_user_id, created_at desc);

alter table public.admin_action_log enable row level security;

/*
  Keep admin_action_log service-role only for Phase 18C. Founder admin reads and
  writes it through server-only service-role code after founder authorization.
*/
revoke all on public.admin_action_log from anon, authenticated;
grant select, insert, update, delete on public.admin_action_log to service_role;

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
      and bm.user_id = auth.uid()
      and bm.status = 'active'
      and b.status in ('onboarding', 'active')
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
      and bm.user_id = auth.uid()
      and bm.status = 'active'
      and bm.role in ('owner', 'admin')
      and b.status in ('onboarding', 'active')
  );
$$;

create or replace function public.has_active_public_link(
  target_business_id uuid
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
set row_security = off
as $$
begin
  return exists (
    select 1
    from public.public_link_variants plv
    join public.businesses b
      on b.id = plv.business_id
    where plv.business_id = target_business_id
      and plv.is_active = true
      and b.status in ('onboarding', 'active')
      and b.plan_slug <> 'paused'
  );
end;
$$;
