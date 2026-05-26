/*
============================================================
File: supabase/migrations/0021_session_policy_and_owner_audit.sql
Project: BizPilot AI
Description: Adds owner-visible admin history support and per-workspace session policy controls.
Role: Lets founder admin configure forced sign-out timing while keeping customer-facing change history traceable.
Related:
- app/admin/page.tsx
- app/(dashboard)/dashboard/settings/page.tsx
- lib/supabase/middleware.ts
Author: MoOoH
Created: 2026-05-25
============================================================
*/

alter table public.businesses
  add column if not exists session_timeout_mode text not null default 'always_on',
  add column if not exists session_timeout_minutes integer;

alter table public.businesses
  drop constraint if exists businesses_session_timeout_mode_check;

alter table public.businesses
  add constraint businesses_session_timeout_mode_check
  check (session_timeout_mode in ('always_on', 'after_duration'));

alter table public.businesses
  drop constraint if exists businesses_session_timeout_minutes_check;

alter table public.businesses
  add constraint businesses_session_timeout_minutes_check
  check (
    (
      session_timeout_mode = 'always_on'
      and session_timeout_minutes is null
    )
    or (
      session_timeout_mode = 'after_duration'
      and session_timeout_minutes between 15 and 10080
    )
  );

comment on column public.businesses.session_timeout_mode is
  'Founder-controlled workspace session policy. always_on means no forced workspace timeout; after_duration signs users out after session_timeout_minutes from sign-in.';

comment on column public.businesses.session_timeout_minutes is
  'Founder-controlled forced sign-out duration in minutes when session_timeout_mode is after_duration.';

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
      'test_auth_user_deleted',
      'quote_link_disabled',
      'quote_link_enabled',
      'internal_note_added',
      'password_reset_requested',
      'session_policy_changed',
      'temporary_password_set'
    )
  );
