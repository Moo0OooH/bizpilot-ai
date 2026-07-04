/*
============================================================
File: supabase/migrations/0023_public_submission_abuse_log_retention.sql
Project: BizPilot AI
Description: Adds service-role-only retention cleanup for public submission abuse logs.
Role: Lets operators remove old hashed abuse/rate-limit metadata without exposing
      cleanup execution to anon or authenticated clients.
Related:
- supabase/migrations/0013_public_submission_abuse_log.sql
- server/services/abuse-protection.service.ts
- tests/rls/public-submission-abuse-log.test.sql
Author: MoOoH
Created: 2026-07-04
Last Updated: 2026-07-04
Change Log:
- 2026-07-04: Added service-role-only retention cleanup helper.
- 2026-07-04: Replaced the delete CTE with DELETE plus ROW_COUNT diagnostics for local Supabase stability.
============================================================
*/

create or replace function public.delete_old_public_submission_abuse_logs(
  retention_days integer default 90
)
returns integer
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  deleted_count integer;
begin
  if retention_days is null or retention_days < 7 or retention_days > 365 then
    raise exception 'retention_days must be between 7 and 365.';
  end if;

  delete from public.public_submission_abuse_log
  where created_at < now() - make_interval(days => retention_days);

  get diagnostics deleted_count = row_count;

  return deleted_count;
end;
$$;

revoke all on function public.delete_old_public_submission_abuse_logs(integer) from public;
revoke all on function public.delete_old_public_submission_abuse_logs(integer) from anon;
revoke all on function public.delete_old_public_submission_abuse_logs(integer) from authenticated;

grant execute on function public.delete_old_public_submission_abuse_logs(integer)
  to service_role;
