/*
============================================================
File: supabase/migrations/0011_anon_select_policies_for_reference_and_faqs.sql
Project: BizPilot AI
Description: Phase 10E anon SELECT RLS policies for the five tables granted in 0010.
Role: Activates D1 (verticals, industry_templates, industry_template_fields) and D2 (business_faqs, business_service_areas) reads for the public quote page.
Related:
- supabase/migrations/0010_explicit_data_api_grants.sql
- docs/security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md (Sections 9.1, 9.2)
- docs/architecture/BIZPILOT_VENDOR_INDEPENDENCE_AND_PORTABILITY_STANDARD_v1.0.md
- tests/rls/anon-select-policies-d1-d2.test.sql
Author: MoOoH
Created: 2026-05-15
Last Updated: 2026-05-15
Change Log:
- 2026-05-15: Created Phase 10E anon SELECT policies. Policy-only; no GRANT changes (10C already granted anon: select).
============================================================
*/

-- ============================================================
-- D1 — Reference tables: verticals, industry_templates, industry_template_fields
-- ============================================================
-- These are global reference data with no business relationship.
-- The matching authenticated policies already restrict to is_active = true,
-- and the anon policy follows the same shape.

drop policy if exists "verticals_select_public_active" on public.verticals;
create policy "verticals_select_public_active"
on public.verticals
for select
to anon
using (is_active = true);

drop policy if exists "industry_templates_select_public_active" on public.industry_templates;
create policy "industry_templates_select_public_active"
on public.industry_templates
for select
to anon
using (is_active = true);

drop policy if exists "industry_template_fields_select_public_active" on public.industry_template_fields;
create policy "industry_template_fields_select_public_active"
on public.industry_template_fields
for select
to anon
using (is_active = true);

-- ============================================================
-- D2 — Per-business public content: business_faqs, business_service_areas
-- ============================================================
-- These are tenant-owned rows but exposed to anon ONLY when the owning
-- business has an active public quote link. The pattern matches
-- business_branding_select_public_link_active from 0005.
-- Additionally, only is_active rows are visible to anon so owners can
-- deactivate FAQ entries or service areas without removing them.

drop policy if exists "business_faqs_select_public_active" on public.business_faqs;
create policy "business_faqs_select_public_active"
on public.business_faqs
for select
to anon
using (
  is_active = true
  and public.has_active_public_link(business_id)
);

drop policy if exists "business_service_areas_select_public_active" on public.business_service_areas;
create policy "business_service_areas_select_public_active"
on public.business_service_areas
for select
to anon
using (
  is_active = true
  and public.has_active_public_link(business_id)
);
