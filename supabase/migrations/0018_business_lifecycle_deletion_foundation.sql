/*
============================================================
File: supabase/migrations/0018_business_lifecycle_deletion_foundation.sql
Project: BizPilot AI
Description: Adds workspace lifecycle, deletion request, and non-PII tombstone foundations.
Role: Separates business/workspace lifecycle from auth identity and prepares safe deletion flows.
Related:
- supabase/migrations/0001_auth_tenant_foundation.sql
- supabase/migrations/0015_business_access_plan_and_admin_log.sql
- tests/rls/business-lifecycle-deletion-foundation.test.sql
Author: MoOoH
Created: 2026-05-24
Last Updated: 2026-05-24
============================================================
*/

/*
  BizPilot lifecycle model:
  - public.businesses is the customer tenant/workspace container.
  - auth.users is login identity only.
  - Business/workspace deletion is separate from auth account deletion.
  - intake_submissions.delete_request_status is submission-level only and does
    not represent workspace/account deletion.
  - Production deletion must later remove or anonymize personal data through a
    controlled server-side process. This migration does not implement purge.
  - Test/demo/seed cleanup may only target workspaces explicitly classified as
    non-production by workspace_kind.
*/

alter table public.businesses
  add column if not exists workspace_kind text not null default 'production_customer',
  add column if not exists lifecycle_status text not null default 'active',
  add column if not exists lifecycle_updated_at timestamptz not null default now(),
  add column if not exists deletion_requested_at timestamptz,
  add column if not exists deleted_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'businesses_workspace_kind_check'
      and conrelid = 'public.businesses'::regclass
  ) then
    alter table public.businesses
      add constraint businesses_workspace_kind_check
      check (workspace_kind in (
        'production_customer',
        'founder_test',
        'demo',
        'seed'
      ));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'businesses_lifecycle_status_check'
      and conrelid = 'public.businesses'::regclass
  ) then
    alter table public.businesses
      add constraint businesses_lifecycle_status_check
      check (lifecycle_status in (
        'active',
        'archived',
        'deletion_requested',
        'deleting',
        'deleted'
      ));
  end if;
end
$$;

comment on column public.businesses.workspace_kind is
  'Classifies the workspace for cleanup safety. Hard purge tooling must only target founder_test, demo, or seed unless a separate production deletion process is used.';

comment on column public.businesses.lifecycle_status is
  'Workspace lifecycle state, separate from operational access status. deletion_requested, deleting, and deleted must not behave as active.';

comment on column public.businesses.deletion_requested_at is
  'Workspace-level deletion request timestamp. Do not confuse with intake_submissions.delete_request_status, which is submission-level only.';

create index if not exists businesses_workspace_kind_idx
  on public.businesses(workspace_kind);

create index if not exists businesses_lifecycle_status_idx
  on public.businesses(lifecycle_status);

create index if not exists businesses_kind_lifecycle_idx
  on public.businesses(workspace_kind, lifecycle_status);

alter table public.admin_action_log
  drop constraint if exists admin_action_log_action_type_check;

alter table public.admin_action_log
  add constraint admin_action_log_action_type_check
  check (
    action_type in (
      'plan_changed',
      'status_changed',
      'business_suspended',
      'business_reactivated',
      'business_cancelled',
      'business_deletion_requested',
      'test_workspace_cleanup_completed',
      'quote_link_disabled',
      'quote_link_enabled',
      'internal_note_added'
    )
  );

create or replace function public.set_business_lifecycle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.lifecycle_updated_at = now();
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists businesses_set_lifecycle_updated_at on public.businesses;
create trigger businesses_set_lifecycle_updated_at
before update of workspace_kind, lifecycle_status, deletion_requested_at, deleted_at
on public.businesses
for each row
execute function public.set_business_lifecycle_updated_at();

create table if not exists public.business_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  requested_by_user_id uuid not null references auth.users(id) on delete restrict,
  status text not null default 'pending'
    check (status in (
      'pending',
      'cancelled',
      'approved',
      'processing',
      'completed',
      'rejected'
    )),
  request_type text not null default 'production_deletion'
    check (request_type in (
      'production_deletion',
      'test_cleanup'
    )),
  reason_code text
    check (
      reason_code is null
      or reason_code in (
        'no_longer_needed',
        'switching_tools',
        'privacy_request',
        'duplicate_workspace',
        'pilot_ended',
        'fake_test_data',
        'cleanup',
        'other'
      )
    ),
  requested_at timestamptz not null default now(),
  cancelled_at timestamptz,
  cancelled_by_user_id uuid references auth.users(id) on delete restrict,
  approved_at timestamptz,
  approved_by_user_id uuid references auth.users(id) on delete restrict,
  processing_started_at timestamptz,
  completed_at timestamptz,
  rejected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.business_deletion_requests is
  'Workspace-level deletion request queue. Business/workspace deletion is separate from auth user/account deletion.';

comment on column public.business_deletion_requests.reason_code is
  'Structured reason only. No free-text reason details in this table to avoid accidental PII.';

create index if not exists business_deletion_requests_business_id_idx
  on public.business_deletion_requests(business_id);

create index if not exists business_deletion_requests_requested_by_user_id_idx
  on public.business_deletion_requests(requested_by_user_id);

create index if not exists business_deletion_requests_status_idx
  on public.business_deletion_requests(status);

create index if not exists business_deletion_requests_request_type_idx
  on public.business_deletion_requests(request_type);

create unique index if not exists business_deletion_requests_one_active_per_business_idx
  on public.business_deletion_requests(business_id)
  where status in ('pending', 'approved', 'processing');

drop trigger if exists business_deletion_requests_set_updated_at
  on public.business_deletion_requests;
create trigger business_deletion_requests_set_updated_at
before update on public.business_deletion_requests
for each row
execute function public.set_updated_at();

create table if not exists public.business_deletion_tombstones (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  deletion_request_id uuid references public.business_deletion_requests(id) on delete set null,
  workspace_kind text not null
    check (workspace_kind in (
      'production_customer',
      'founder_test',
      'demo',
      'seed'
    )),
  deletion_mode text not null
    check (deletion_mode in (
      'test_hard_purge',
      'production_anonymization',
      'production_purge'
    )),
  completed_at timestamptz not null default now(),
  completed_by_actor_type text not null
    check (completed_by_actor_type in (
      'owner',
      'founder',
      'system'
    )),
  reason_code text
    check (
      reason_code is null
      or reason_code in (
        'no_longer_needed',
        'switching_tools',
        'privacy_request',
        'duplicate_workspace',
        'pilot_ended',
        'fake_test_data',
        'cleanup',
        'other'
      )
    ),
  purged_tables text[] not null default '{}'::text[],
  anonymized_tables text[] not null default '{}'::text[],
  retained_reason_code text,
  audit_version text not null default 'v1'
);

comment on table public.business_deletion_tombstones is
  'Minimal non-PII deletion evidence only. Do not store business names, slugs, emails, customer data, quote bodies, AI prompt/output text, or raw admin notes.';

comment on column public.business_deletion_tombstones.business_id is
  'Retains the internal workspace UUID for audit correlation. This can still be linkable inside BizPilot systems, so it must not be exposed publicly or enriched with PII.';

create index if not exists business_deletion_tombstones_business_id_idx
  on public.business_deletion_tombstones(business_id);

create index if not exists business_deletion_tombstones_request_id_idx
  on public.business_deletion_tombstones(deletion_request_id);

create index if not exists business_deletion_tombstones_workspace_kind_idx
  on public.business_deletion_tombstones(workspace_kind);

create index if not exists business_deletion_tombstones_deletion_mode_idx
  on public.business_deletion_tombstones(deletion_mode);

alter table public.business_deletion_requests enable row level security;
alter table public.business_deletion_tombstones enable row level security;

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
      and bm.user_id = auth.uid()
      and bm.status = 'active'
      and bm.role in ('owner', 'admin')
      and b.status in ('onboarding', 'active')
      and b.lifecycle_status in ('active', 'archived')
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
      and b.lifecycle_status = 'active'
      and b.plan_slug <> 'paused'
  );
end;
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
      and bm.user_id = auth.uid()
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
      and bm.user_id = auth.uid()
      and bm.role = 'owner'
      and bm.status = 'active'
      and b.lifecycle_status in ('active', 'deletion_requested', 'deleting')
  );
$$;

comment on function public.can_view_business_deletion_request(uuid) is
  'Owner-only deletion request visibility helper. Separate from insert eligibility so owners can still view pending requests after the workspace is locked.';

drop policy if exists "business_deletion_requests_select_owner"
  on public.business_deletion_requests;
create policy "business_deletion_requests_select_owner"
on public.business_deletion_requests
for select
to authenticated
using (public.can_view_business_deletion_request(business_id));

drop policy if exists "business_deletion_requests_insert_owner_pending"
  on public.business_deletion_requests;
create policy "business_deletion_requests_insert_owner_pending"
on public.business_deletion_requests
for insert
to authenticated
with check (
  requested_by_user_id = auth.uid()
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

/*
  Tombstones stay service-role-only for now. Even non-PII tombstones can become
  sensitive if correlated with business UUIDs, so no authenticated select policy
  is added in this foundation pass.
*/

revoke all on public.business_deletion_requests from anon;
revoke all on public.business_deletion_tombstones from anon;

grant select, insert on public.business_deletion_requests to authenticated;
grant select, insert, update, delete on public.business_deletion_requests to service_role;

grant select, insert, update, delete on public.business_deletion_tombstones to service_role;

grant execute on function public.can_request_business_deletion(uuid)
  to authenticated, service_role;

grant execute on function public.can_view_business_deletion_request(uuid)
  to authenticated, service_role;

grant execute on function public.set_business_lifecycle_updated_at()
  to service_role;
