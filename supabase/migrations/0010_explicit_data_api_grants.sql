/*
============================================================
File: supabase/migrations/0010_explicit_data_api_grants.sql
Project: BizPilot AI
Description: Phase 10C explicit Data API grants for every public-schema table and helper function.
Role: Replaces implicit Supabase Data API defaults with audited GRANT statements for anon, authenticated, and service_role.
Related:
- docs/security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md
- docs/architecture/BIZPILOT_VENDOR_INDEPENDENCE_AND_PORTABILITY_STANDARD_v1.0.md
- docs/operations/BIZPILOT_PHASE_10A_VENDOR_INDEPENDENCE_GAP_REPORT_v1.0.md
- supabase/migrations/README.md
Author: MoOoH
Created: 2026-05-15
Last Updated: 2026-05-15
Change Log:
- 2026-05-15: Created the Phase 10C grants migration. Grants-only; no RLS policies or schema changes.
  Recorded decisions applied: D1=Yes, D2=Yes, D3=Yes (default), D4=Yes (default), D5=No (default).
  Phase 10E will land the anon SELECT RLS policies that unlock the D1/D2 grants.
============================================================
*/

-- ============================================================
-- Block A — Revoke broad PUBLIC defaults
-- ============================================================
-- Establishes a clean baseline so future Supabase platform default changes
-- cannot silently re-introduce broad access. Each role we care about must
-- be re-granted explicitly below.

revoke all on all tables in schema public from public;
revoke all on all functions in schema public from public;
revoke all on all sequences in schema public from public;

-- ============================================================
-- Block B — Re-grant schema usage
-- ============================================================
-- 0005 already granted schema usage to anon and authenticated.
-- This statement restates it and adds service_role for explicit completeness.

grant usage on schema public to anon, authenticated, service_role;

-- ============================================================
-- Block C — Per-table grants for tables created in 0001 and 0002
-- ============================================================
-- These tables previously relied on implicit defaults.
-- Each row is justified by the audit at docs/security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md.

-- C.1 Identity and tenant (0001) ----------------------------

-- profiles: owner reads and updates own profile only; insert handled by handle_new_auth_user trigger.
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

-- businesses: dashboard reads, founding-business insert, manager update (D4 Yes).
grant select, insert, update on public.businesses to authenticated;
grant select, insert, update, delete on public.businesses to service_role;

-- business_members: founding membership insert and manager updates (D4 Yes).
grant select, insert, update on public.business_members to authenticated;
grant select, insert, update, delete on public.business_members to service_role;

-- C.2 Reference and configuration (0002) --------------------

-- verticals, industry_templates, industry_template_fields:
-- D1=Yes grants anon select; RLS policy that actually permits the read lands in Phase 10E.
grant select on public.verticals to anon, authenticated;
grant select, insert, update, delete on public.verticals to service_role;

grant select on public.industry_templates to anon, authenticated;
grant select, insert, update, delete on public.industry_templates to service_role;

grant select on public.industry_template_fields to anon, authenticated;
grant select, insert, update, delete on public.industry_template_fields to service_role;

-- business_branding: anon select already granted by 0005; restated explicitly.
grant select on public.business_branding to anon;
grant select, insert, update, delete on public.business_branding to authenticated;
grant select, insert, update, delete on public.business_branding to service_role;

-- business_services: tenant only.
grant select, insert, update, delete on public.business_services to authenticated;
grant select, insert, update, delete on public.business_services to service_role;

-- business_faqs: D2=Yes grants anon select; RLS policy lands in Phase 10E.
grant select on public.business_faqs to anon;
grant select, insert, update, delete on public.business_faqs to authenticated;
grant select, insert, update, delete on public.business_faqs to service_role;

-- business_service_areas: D2=Yes grants anon select; RLS policy lands in Phase 10E.
grant select on public.business_service_areas to anon;
grant select, insert, update, delete on public.business_service_areas to authenticated;
grant select, insert, update, delete on public.business_service_areas to service_role;

-- business_privacy_settings: tenant only.
grant select, insert, update, delete on public.business_privacy_settings to authenticated;
grant select, insert, update, delete on public.business_privacy_settings to service_role;

-- business_consent_settings: tenant only.
grant select, insert, update, delete on public.business_consent_settings to authenticated;
grant select, insert, update, delete on public.business_consent_settings to service_role;

-- business_template_settings: tenant only.
grant select, insert, update, delete on public.business_template_settings to authenticated;
grant select, insert, update, delete on public.business_template_settings to service_role;

-- business_onboarding_tasks: tenant only.
grant select, insert, update, delete on public.business_onboarding_tasks to authenticated;
grant select, insert, update, delete on public.business_onboarding_tasks to service_role;

-- ============================================================
-- Block D — Restate grants for tables created in 0005, 0007, 0009
-- ============================================================
-- 0005, 0007, 0009 already grant anon and authenticated correctly.
-- This block restates them after the Block A revoke and adds the
-- service_role grants that were previously implicit.

-- Public intake and leads (0005) ----------------------------

grant select on public.public_link_variants to anon;
grant select, insert, update, delete on public.public_link_variants to authenticated;
grant select, insert, update, delete on public.public_link_variants to service_role;

grant select on public.intake_forms to anon;
grant select, insert, update, delete on public.intake_forms to authenticated;
grant select, insert, update, delete on public.intake_forms to service_role;

grant select on public.intake_form_fields to anon;
grant select, insert, update, delete on public.intake_form_fields to authenticated;
grant select, insert, update, delete on public.intake_form_fields to service_role;

grant select on public.consent_versions to anon;
grant select, insert, update, delete on public.consent_versions to authenticated;
grant select, insert, update, delete on public.consent_versions to service_role;

-- intake_submissions and intake_submission_values:
-- D3=Yes keeps authenticated U/D inert until Phase 14 RLS policies allow privacy-mode deletion.
grant insert on public.intake_submissions to anon;
grant select, insert, update, delete on public.intake_submissions to authenticated;
grant select, insert, update, delete on public.intake_submissions to service_role;

grant insert on public.intake_submission_values to anon;
grant select, insert, update, delete on public.intake_submission_values to authenticated;
grant select, insert, update, delete on public.intake_submission_values to service_role;

grant insert on public.leads to anon;
grant select, insert, update, delete on public.leads to authenticated;
grant select, insert, update, delete on public.leads to service_role;

grant insert on public.lead_source_metadata to anon;
grant select, insert, update, delete on public.lead_source_metadata to authenticated;
grant select, insert, update, delete on public.lead_source_metadata to service_role;

-- Lead Conversion Desk (0007) -------------------------------

grant select, insert, update, delete on public.lead_quality_scores to authenticated;
grant select, insert, update, delete on public.lead_quality_scores to service_role;

grant select, insert, update, delete on public.lead_action_items to authenticated;
grant select, insert, update, delete on public.lead_action_items to service_role;

-- lead_events is append-only for authenticated; service_role retains full grants for export tooling.
grant select, insert on public.lead_events to authenticated;
grant select, insert, update, delete on public.lead_events to service_role;

-- AI assistant (0009) ---------------------------------------

grant select, insert, update, delete on public.ai_outputs to authenticated;
grant select, insert, update, delete on public.ai_outputs to service_role;

-- usage_events is append-only for authenticated; service_role retains full grants for export tooling.
grant select, insert on public.usage_events to authenticated;
grant select, insert, update, delete on public.usage_events to service_role;

-- ============================================================
-- Block E — Function EXECUTE grants
-- ============================================================
-- Internal RLS helpers are referenced by policies. Granting EXECUTE
-- explicitly to authenticated and service_role makes the contract visible.
-- Public-facing helpers retain their existing anon and authenticated grants
-- and now also receive an explicit service_role grant.

grant execute on function public.is_business_member(uuid)
  to authenticated, service_role;

grant execute on function public.can_manage_business(uuid)
  to authenticated, service_role;

grant execute on function public.owns_business(uuid)
  to authenticated, service_role;

grant execute on function public.has_active_public_link(uuid)
  to anon, authenticated, service_role;

grant execute on function public.can_public_read_business_branding(uuid)
  to anon, authenticated, service_role;

grant execute on function public.can_public_read_intake_form(uuid, boolean)
  to anon, authenticated, service_role;

grant execute on function public.can_public_read_intake_field(uuid, uuid, boolean)
  to anon, authenticated, service_role;

grant execute on function public.can_public_read_consent_version(uuid, boolean)
  to anon, authenticated, service_role;

grant execute on function public.can_public_submit_to_form(uuid, uuid, uuid)
  to anon, authenticated, service_role;

grant execute on function public.public_submission_belongs_to_business(uuid, uuid)
  to anon, authenticated, service_role;

grant execute on function public.public_lead_belongs_to_business(uuid, uuid)
  to anon, authenticated, service_role;

-- ============================================================
-- Block F — Notes for the next phases
-- ============================================================
-- Phase 10D will introduce the RLS test runner that verifies these grants
-- in combination with each table's existing RLS policies.
--
-- Phase 10E will add the anon SELECT RLS policies that unlock the
-- D1 (verticals, industry_templates, industry_template_fields) and
-- D2 (business_faqs, business_service_areas) grants made above.
--
-- Until Phase 10E lands, anon SELECT on those five tables returns zero rows
-- because RLS is enabled but no anon policy permits any row through.
-- That is intentional and audited.
