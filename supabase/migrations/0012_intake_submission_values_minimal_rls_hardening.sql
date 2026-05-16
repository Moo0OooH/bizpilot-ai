/*
============================================================
File: supabase/migrations/0012_intake_submission_values_minimal_rls_hardening.sql
Project: BizPilot AI
Description: Phase 12 minimal RLS hardening for public inserts into intake_submission_values.
Role: Replaces the broad business-membership check with a per-row check that also verifies
      the field_key corresponds to a visible (is_hidden = false) field on the submission's form.
Related:
- supabase/migrations/0005_public_intake_and_leads.sql
- supabase/migrations/0006_fix_intake_form_fields_public_rls.sql
- docs/security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md (Section 10 R1, Section 12 T6)
- docs/architecture/BIZPILOT_VENDOR_INDEPENDENCE_AND_PORTABILITY_STANDARD_v1.0.md (Section 29)
- tests/rls/public-intake-submission-values-hardening.test.sql
Author: MoOoH
Created: 2026-05-15
Last Updated: 2026-05-15
Change Log:
- 2026-05-15: Created Phase 12 hardening. Adds public_can_insert_submission_value helper and
  replaces the intake_submission_values_insert_public_scoped policy. No GRANT changes on the
  table itself (already granted in 0005/0010); the helper gets explicit EXECUTE grants.
============================================================
*/

-- ============================================================
-- New helper: public_can_insert_submission_value
-- ============================================================
-- A public submission value may only be inserted when:
--   1. The target submission exists and belongs to the target business.
--   2. A row in intake_form_fields matches the submission's form, the
--      target field_key, and the target business.
--   3. That field row is_hidden = false.
--
-- This blocks three classes of attack that the previous policy allowed:
--   - inserting values for unknown field_keys (data pollution);
--   - inserting values for hidden fields (data exfiltration vector);
--   - mixing field_keys across forms or businesses (ID-mixing).
--
-- The function is security definer with row_security = off so it can join
-- across submissions and form fields regardless of the caller's role.

create or replace function public.public_can_insert_submission_value(
  target_business_id uuid,
  target_submission_id uuid,
  target_field_key text
)
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1
    from public.intake_submissions submission
    join public.intake_form_fields field
      on field.intake_form_id = submission.intake_form_id
     and field.business_id = submission.business_id
     and field.field_key = target_field_key
     and field.is_hidden = false
    where submission.id = target_submission_id
      and submission.business_id = target_business_id
  );
$$;

grant execute
  on function public.public_can_insert_submission_value(uuid, uuid, text)
  to anon, authenticated, service_role;

-- ============================================================
-- Replace the insert policy
-- ============================================================
-- The old policy only checked that the submission belonged to the business.
-- The new policy delegates to the helper above so the row, the form, and
-- the field are all verified together.

drop policy if exists "intake_submission_values_insert_public_scoped"
  on public.intake_submission_values;

create policy "intake_submission_values_insert_public_scoped"
on public.intake_submission_values
for insert
to anon, authenticated
with check (
  public.public_can_insert_submission_value(
    business_id,
    submission_id,
    field_key
  )
);
