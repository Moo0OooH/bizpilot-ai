/*
============================================================
File: supabase/migrations/0020_founder_test_auth_user_cleanup.sql
Project: BizPilot AI
Description: Extends founder admin audit actions for fake/test auth user cleanup.
Role: Allows service-role founder tooling to audit safe test login deletion.
Related:
- app/admin/page.tsx
- server/services/founder-auth-user-cleanup.service.ts
- docs/operations/BIZPILOT_DELETION_AND_CLEANUP_RUNBOOK_v1.0.md
Author: MoOoH
Created: 2026-05-24
Last Updated: 2026-05-24
============================================================
*/

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
      'internal_note_added'
    )
  );
