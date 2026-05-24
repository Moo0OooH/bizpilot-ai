/*
============================================================
File: supabase/migrations/0019_lifecycle_helper_execute_grant_hardening.sql
Project: BizPilot AI
Description: Tightens EXECUTE grants for lifecycle/deletion helper functions created in 0018.
Role: Removes broad PUBLIC/anon execution from owner-only lifecycle helpers while keeping authenticated and service-role paths explicit.
Related:
- supabase/migrations/0018_business_lifecycle_deletion_foundation.sql
- docs/readiness/PHASE_21C_OWNER_SQL_VERIFICATION_PACK.md
- tests/rls/business-lifecycle-deletion-foundation.test.sql
Author: MoOoH
Created: 2026-05-24
Last Updated: 2026-05-24
Change Log:
- 2026-05-24: Revoked PUBLIC/anon execution from lifecycle deletion helpers and kept required role grants explicit.
============================================================
*/

-- These functions are owner/dashboard helpers, not public quote helpers.
-- Postgres grants EXECUTE on new functions to PUBLIC by default, so revoke
-- broad defaults first and then restate the intended roles explicitly.

revoke execute on function public.can_request_business_deletion(uuid)
  from public;
revoke execute on function public.can_request_business_deletion(uuid)
  from anon;
grant execute on function public.can_request_business_deletion(uuid)
  to authenticated, service_role;

revoke execute on function public.can_view_business_deletion_request(uuid)
  from public;
revoke execute on function public.can_view_business_deletion_request(uuid)
  from anon;
grant execute on function public.can_view_business_deletion_request(uuid)
  to authenticated, service_role;

-- Trigger helper is internal/service-role only. Table triggers can still invoke
-- the function; this grant controls direct RPC-style execution.
revoke execute on function public.set_business_lifecycle_updated_at()
  from public;
revoke execute on function public.set_business_lifecycle_updated_at()
  from anon, authenticated;
grant execute on function public.set_business_lifecycle_updated_at()
  to service_role;
