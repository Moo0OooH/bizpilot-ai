/*
============================================================
File: supabase/migrations/0016_public_submission_minimum_submit_age_reason.sql
Project: BizPilot AI
Description: Adds abuse-log reason for public submissions rejected by minimum submit-age heuristic.
Role: Supports bot-resistant public quote submission logging without exposing direct anon table access.
Related:
- supabase/migrations/0013_public_submission_abuse_log.sql
- server/services/public-intake.service.ts
- server/services/abuse-protection.service.ts
- tests/rls/public-submission-abuse-log.test.sql
Author: MoOoH
Created: 2026-05-22
Last Updated: 2026-05-22
============================================================
*/

alter table public.public_submission_abuse_log
  drop constraint if exists public_submission_abuse_log_reason_check;

alter table public.public_submission_abuse_log
  add constraint public_submission_abuse_log_reason_check
  check (reason in (
    'submission_completed',
    'rate_limit_exceeded',
    'honeypot_triggered',
    'consent_missing',
    'invalid_form',
    'invalid_field',
    'submitted_too_fast'
  ));
