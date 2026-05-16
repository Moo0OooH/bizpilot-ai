# BizPilot AI Supabase RLS Audit Report v1.0

**Status:** Phase 9 audit-only report
**Created:** 2026-05-13
**Scope:** Supabase migrations, RLS policies, helper functions, public quote flow, owner dashboard flow, and existing RLS tests

---

## Executive Summary

This phase inspected the current Supabase RLS state only. No SQL, migrations, policies, schema, tests, application code, routes, auth behavior, UI, or form behavior were changed.

All current application tables found in migrations have RLS enabled. The project already has SQL RLS tests under `tests/rls`, but there is no configured local RLS test runner in `package.json`, and `supabase` / `psql` were not available in PATH during this audit.

The current RLS model is broadly sound for an MVP:

- Private dashboard data is tenant-scoped through `business_id` and membership helper functions.
- Public quote read access is limited to active public quote records.
- Public quote submissions can insert scoped records but cannot read private leads/submissions.
- Service-role usage is isolated to sign-up tenant bootstrap and is not used by normal dashboard or public quote flows.

Highest-priority risks before hardening:

- Public `intake_submission_values` insert RLS confirms the submission belongs to the business, but does not independently require inserted `field_key` values to match visible active intake fields. App code restricts this, but RLS alone should also enforce it before pilot.
- Active `public_link_variants`, active `intake_forms`, visible `intake_form_fields`, and active `consent_versions` are publicly listable for all active public links, not only for a requested slug. This may be acceptable public metadata, but it is broader than route-level slug access.
- Lead workflow and AI tables allow any authenticated business member to insert/update derived records. The app currently controls owner flows, but RLS role granularity should be reviewed before paid launch.
- Existing RLS SQL tests are not wired into an automated command.

---

## Table-By-Table RLS Map

| Table | Purpose | RLS | Policies | Public read | Public insert | Auth read | Auth write | Scope | Service role | Tests | Risk |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `profiles` | Auth user profile metadata | Enabled | `profiles_select_own`, `profiles_update_own` | No | No | Own profile | Own update | `user_id = auth.uid()` | No | `auth-tenant-foundation` | Low |
| `businesses` | Tenant business record | Enabled | `businesses_select_member`, `businesses_insert_owner`, `businesses_update_manager` | No | No | Members | Owner insert, manager update | `is_business_member`, `can_manage_business`, `owns_business` | Bootstrap only | `auth-tenant-foundation` | Low |
| `business_members` | Tenant membership and roles | Enabled | `business_members_select_member`, `business_members_insert_owner_membership`, `business_members_manage_by_owner_or_admin` | No | No | Members of same business | Owner self membership insert, manager update | `is_business_member`, `can_manage_business`, `owns_business` | Bootstrap only | `auth-tenant-foundation` | Medium |
| `verticals` | Seeded active vertical metadata | Enabled | `verticals_select_authenticated` | No | No | Active records | No app write policy | `is_active = true` | Seed/migration | Indirect in config tests | Low |
| `industry_templates` | Seeded active template metadata | Enabled | `industry_templates_select_authenticated` | No | No | Active records | No app write policy | `is_active = true` | Seed/migration | `business-template-configuration` | Low |
| `industry_template_fields` | Seeded active template field metadata | Enabled | `industry_template_fields_select_authenticated` | No | No | Active records | No app write policy | `is_active = true` | Seed/migration | Indirect | Low |
| `business_branding` | Tenant branding | Enabled | `business_branding_select_member`, `business_branding_manage_manager`, `business_branding_select_public_link_active` | Yes, behind active public link | No | Members | Managers | `business_id`; public helper | No | `business-template-configuration`, `public-intake-and-leads` | Medium |
| `business_services` | Tenant service list | Enabled | `business_services_select_member`, `business_services_manage_manager` | No | No | Members | Managers | `business_id` | No | `business-template-configuration` | Low |
| `business_faqs` | Tenant FAQ list | Enabled | `business_faqs_select_member`, `business_faqs_manage_manager` | No | No | Members | Managers | `business_id` | No | `business-template-configuration` | Low |
| `business_service_areas` | Tenant service area list | Enabled | `business_service_areas_select_member`, `business_service_areas_manage_manager` | No | No | Members | Managers | `business_id` | No | `business-template-configuration`, lead services | Low |
| `business_privacy_settings` | Tenant privacy mode and retention | Enabled | `business_privacy_settings_select_member`, `business_privacy_settings_manage_manager` | No | No | Members | Managers | `business_id` | No | `business-template-configuration`, `public-intake-and-leads` anon denial | Low |
| `business_consent_settings` | Tenant consent settings source | Enabled | `business_consent_settings_select_member`, `business_consent_settings_manage_manager` | No | No | Members | Managers | `business_id` | No | `business-template-configuration` | Low |
| `business_template_settings` | Tenant template overrides | Enabled | `business_template_settings_select_member`, `business_template_settings_manage_manager` | No | No | Members | Managers | `business_id` | No | `business-template-configuration` | Low |
| `business_onboarding_tasks` | Tenant setup checklist | Enabled | `business_onboarding_tasks_select_member`, `business_onboarding_tasks_manage_manager` | No | No | Members | Managers | `business_id` | No | `business-template-configuration` | Low |
| `intake_forms` | Public quote form header | Enabled | `intake_forms_select_public_active`, `intake_forms_select_member`, `intake_forms_manage_manager` | Active forms behind active link | No | Members and public-active records | Managers | Public helper and `business_id` | No | `public-intake-and-leads` | Medium |
| `intake_form_fields` | Public quote form fields | Enabled | `intake_form_fields_select_public_active`, `intake_form_fields_select_member`, `intake_form_fields_manage_manager` | Visible fields for active form/link | No | Members and public-visible records | Managers | Public helper and `business_id` | No | `public-intake-and-leads` | Medium |
| `consent_versions` | Public consent text snapshots | Enabled | `consent_versions_select_public_active`, `consent_versions_select_member`, `consent_versions_manage_manager` | Active consent behind active link | No | Members and public-active records | Managers | Public helper and `business_id` | No | `public-intake-and-leads` | Medium |
| `public_link_variants` | Public quote slug/display name | Enabled | `public_link_variants_select_public_active`, `public_link_variants_select_member`, `public_link_variants_manage_manager` | All active links | No | Members and active public records | Managers | `is_active`; member helper | No | `public-intake-and-leads` | Medium |
| `intake_submissions` | Private public quote submission header | Enabled | `intake_submissions_insert_public_scoped`, `intake_submissions_select_member` | No | Yes, if active form/consent/link | Members | Public insert only; no owner update policy | Public submit helper and `business_id` | No | `public-intake-and-leads` | Medium |
| `intake_submission_values` | Private submitted field values | Enabled | `intake_submission_values_insert_public_scoped`, `intake_submission_values_select_member` | No | Yes, if submission belongs to business | Members | Public insert only | Submission/business helper | No | `public-intake-and-leads` | High |
| `leads` | Private dashboard lead | Enabled | `leads_insert_public_scoped`, `leads_select_member`, `leads_update_member` | No | Yes, if submission belongs to business | Members | Public insert, member update | Submission/business helper and `business_id` | No | `public-intake-and-leads`, `lead-conversion-desk` | Medium |
| `lead_source_metadata` | Private lead source attribution | Enabled | `lead_source_metadata_insert_public_scoped`, `lead_source_metadata_select_member` | No | Yes, if lead belongs to business | Members | Public insert only | Lead/business helper | No | `public-intake-and-leads` | Medium |
| `lead_quality_scores` | Derived lead quality score | Enabled | `lead_quality_scores_select_member`, `lead_quality_scores_insert_member`, `lead_quality_scores_update_member` | No | No | Members | Members | `business_id` | No | `lead-conversion-desk` | Medium |
| `lead_action_items` | Derived owner action queue | Enabled | `lead_action_items_select_member`, `lead_action_items_insert_member`, `lead_action_items_update_member` | No | No | Members | Members | `business_id` | No | `lead-conversion-desk` | Medium |
| `lead_events` | Lead timeline events | Enabled | `lead_events_select_member`, `lead_events_insert_member` | No | No | Members | Members insert | `business_id` | No | `lead-conversion-desk` | Medium |
| `ai_outputs` | Cached AI assistant output | Enabled | `ai_outputs_select_member`, `ai_outputs_insert_member`, `ai_outputs_update_member` | No | No | Members | Members | `business_id` | No | Missing | Medium |
| `usage_events` | AI usage/cost metadata | Enabled | `usage_events_select_member`, `usage_events_insert_member` | No | No | Members | Members insert | `business_id` | No | Missing | Medium |

`public.business_template_fields` is explicitly dropped by migration `0004_remove_noncanonical_template_field_table.sql` and is not an active application table.

---

## Public Quote RLS Findings

Public read access exists for:

- `public_link_variants`: any active public link row.
- `business_branding`: branding for businesses with an active public link.
- `intake_forms`: active forms for businesses with an active public link.
- `intake_form_fields`: visible fields for active forms behind active public links.
- `consent_versions`: active consent versions for businesses with an active public link.

Public insert access exists for:

- `intake_submissions`: if `business_id`, `intake_form_id`, and `consent_version_id` resolve to active public intake records.
- `intake_submission_values`: if the target submission belongs to the same business.
- `leads`: if the target submission belongs to the same business.
- `lead_source_metadata`: if the target lead belongs to the same business.

Protected from public read:

- `businesses`
- `business_members`
- `business_privacy_settings`
- `intake_submissions`
- `intake_submission_values`
- `leads`
- `lead_source_metadata`
- lead quality/action/event tables
- AI output/usage tables

Important findings:

- Hidden fields are protected for public reads by `can_public_read_intake_field(..., target_field_hidden)` and the `target_field_hidden = false` check.
- Inactive forms are protected for public field reads by the active form helper check.
- Missing or inactive quote links are protected by app `notFound()` behavior and RLS helpers that require active public links.
- The success page loads only public quote page data and does not read lead/submission tables.
- Public quote flow currently relies on both RLS and app code. RLS handles active/public read and scoped insert basics; app code validates field values and only submits rendered field keys.
- Highest RLS-only gap: `intake_submission_values_insert_public_scoped` does not require the inserted `field_key` to match a visible active field for the intake form linked to the submission. This should be hardened with tests before pilot.

---

## Dashboard And Owner RLS Findings

Dashboard reads/writes are scoped by:

- `proxy.ts` and dashboard server checks for authentication.
- Application service calls that pass an active `business.id`.
- RLS policies that use `public.is_business_member(business_id)` or `public.can_manage_business(business_id)`.

Owner/member access:

- Business configuration tables use member read and manager write policies.
- Lead dashboard tables use member read/write policies.
- AI tables use member read/write policies.
- Service role is not used in normal dashboard flows.

Important findings:

- Cross-business access is blocked by membership helper policies in current tests for core tenant, business configuration, public intake private tables, and lead conversion tables.
- Application code also filters by active business for dashboard pages and actions.
- Lead workflow writes are allowed to any business member by RLS, not only owner/admin. That may be acceptable for future operational roles, but should be reviewed before paid launch.
- AI outputs and usage events have no RLS tests yet.

---

## Helper Function Findings

| Function | Purpose | Security | Search path | Row security | Depends on | Recursion risk | Risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `set_updated_at()` | Trigger timestamp helper | Invoker | Default | Default | None | None | Low |
| `handle_new_auth_user()` | Auth trigger creates profile | Security definer | `public` | Default | `profiles` | None | Low |
| `is_business_member(uuid)` | Membership predicate | Security definer | `public` | Default | `business_members`, `auth.uid()` | Low; avoids direct policy recursion by definer context | Low |
| `can_manage_business(uuid)` | Owner/admin predicate | Security definer | `public` | Default | `business_members`, `auth.uid()` | Low; avoids direct policy recursion by definer context | Low |
| `owns_business(uuid)` | Owner bootstrap predicate | Security definer | `public` | Default | `businesses`, `auth.uid()` | Low | Low |
| `can_public_submit_to_form(uuid, uuid, uuid)` | Public submission gate | Security definer | `public` | Off | `intake_forms`, `consent_versions`, `public_link_variants` | Low | Medium |
| `public_submission_belongs_to_business(uuid, uuid)` | Public child insert gate | Security definer | `public` | Off | `intake_submissions` | Low | Medium |
| `public_lead_belongs_to_business(uuid, uuid)` | Public metadata insert gate | Security definer | `public` | Off | `leads` | Low | Medium |
| `has_active_public_link(uuid)` | Active public link check | Security definer | `public` | Off | `public_link_variants` | Low | Medium |
| `can_public_read_business_branding(uuid)` | Public branding gate | Security definer | `public` | Off | `has_active_public_link` | Low | Medium |
| `can_public_read_intake_form(uuid, boolean)` | Public form gate | Security definer | `public` | Off | `has_active_public_link` | Low | Medium |
| `can_public_read_intake_field(uuid, uuid, boolean)` | Public field gate | Security definer | `public` | Off | `intake_forms`, `has_active_public_link` | Low | Medium |
| `can_public_read_consent_version(uuid, boolean)` | Public consent gate | Security definer | `public` | Off | `has_active_public_link` | Low | Medium |

All security-definer helpers set `search_path = public`, which is good. Public helpers also set `row_security = off`, which is appropriate for avoiding self-blocking helper checks but increases the need for narrow helper logic and tests.

---

## Recursion And Performance Risks

Recursion:

- Membership policies depend on helper functions that query `business_members` and `businesses`. Because the helpers are security definer functions, they are intended to avoid recursive policy evaluation.
- Public helper functions query public intake tables with `row_security = off`, also avoiding recursive public policy evaluation.
- No obvious direct policy recursion loop was found.

Performance:

- Most membership policies rely on `business_id` lookups. Existing indexes cover `business_members.business_id`, `business_members.user_id`, and many `business_id` columns.
- Public helper `has_active_public_link` filters by `business_id` and `is_active`; only `business_id` is indexed. This is likely fine for MVP but may benefit from a partial or composite index later.
- Public field helper checks `intake_forms.id`, `business_id`, and `is_active`; primary key covers `id`.
- Lead dashboard policies use `business_id` and supporting indexes exist on lead quality/action/event tables.
- No indexes were added in this audit-only phase.

Ambiguous tenant scoping:

- Public active link/form/consent reads are broader than route slug access and are publicly listable across active businesses.
- Public submission values are scoped to a submission/business but not to the exact active visible field set.

---

## Existing RLS Test Coverage

Files found:

- `tests/rls/auth-tenant-foundation.test.sql`
- `tests/rls/business-template-configuration.test.sql`
- `tests/rls/public-intake-and-leads.test.sql`
- `tests/rls/lead-conversion-desk.test.sql`

Covered scenarios:

- Own profile read and anonymous profile denial.
- Member-only business and membership reads.
- Cross-tenant business and membership denial.
- Business configuration member reads and outsider denial.
- Manager-like owner writes for configuration fixture tables.
- Public active quote link/form/field/consent/branding reads.
- Public denial for private business/privacy/submission/lead data.
- Hidden field helper denial.
- No-public-link denial.
- Inactive form field denial.
- Public scoped inserts into submission, values, lead, and metadata.
- Owner private lead/submission reads.
- Lead quality/action/event member reads.
- Lead update denial across businesses.
- Anonymous denial for dashboard lead tables.

Runnable status:

- No `pnpm` script exists for RLS tests.
- `supabase` CLI was not found in PATH during this audit.
- `psql` was not found in PATH during this audit.
- RLS tests appear to be SQL transaction tests, but local runner setup is missing.

---

## Missing RLS Tests

Required before pilot:

- Public user cannot insert `intake_submission_values` for a hidden field.
- Public user cannot insert `intake_submission_values` for a field key not present on the active form.
- Public user cannot insert submission values for a submission tied to another business.
- Public user cannot create a lead for another business by mixing submission/business IDs.
- Public user cannot read inactive `public_link_variants`.
- Public user cannot read inactive `consent_versions`.
- Public user cannot read hidden fields via table select, not only helper calls.
- Owner A cannot read or write Owner B AI outputs.
- Owner A cannot read Owner B usage events.

Required before paid launch:

- Member role matrix for `owner`, `admin`, `member`, and `concierge_limited`.
- Delete behavior for configuration tables where policies are `for all`.
- Public active record enumeration acceptance tests for public links/forms/consents.
- Lead event metadata privacy tests.
- AI output privacy and metadata sensitivity tests.

Recommended later:

- Performance tests for membership helper policies at higher tenant/table sizes.
- Tests for multiple active public links per business if supported.
- Tests for inactive public link plus active form/consent combinations.

---

## Risk Classification

Required before pilot:

- Harden RLS so public submission values are restricted to intended active visible fields.
- Add and automate RLS tests for public quote hidden/unknown field insert denial.
- Add AI output and usage event tenant isolation tests.
- Confirm RLS runner setup is documented and runnable locally/CI.

Required before paid launch:

- Decide whether public active link/form/consent listing is acceptable or should be slug-scoped by design.
- Decide whether lead workflow and AI write policies should be manager-only or role-specific instead of any member.
- Review `privacy_contact_email` exposure through public consent versions.
- Add role matrix tests for owner/admin/member/concierge-limited.

Recommended later:

- Add partial/composite indexes for frequent public helper checks if query volume grows.
- Add durable audit events only after RLS tests and tenant isolation are automated.
- Consider helper functions for stricter public quote slug-scoped access if multi-link enumeration becomes a concern.

---

## Required Phase 10 Inputs

Phase 10 should add a runnable RLS test command and expand tests before changing policies:

- Add documented local RLS test runner using the project's chosen Supabase local workflow.
- Keep tests transactional and repeatable.
- Add hidden field and unknown field public insert denial tests.
- Add inactive public link and inactive consent direct table select denial tests.
- Add AI table tenant isolation tests.
- Add role matrix fixtures for owner/admin/member/concierge-limited.
- Ensure tests fail against the current `intake_submission_values` RLS gap before Phase 11 hardening.

---

## Required Phase 11 Hardening Inputs

Phase 11 should apply minimal SQL changes only after Phase 10 tests exist:

- Harden `intake_submission_values_insert_public_scoped` with a helper that validates:
  - submission belongs to business,
  - submission's form is active,
  - field key belongs to that form,
  - field is not hidden,
  - active public link exists.
- Consider slug or public link scoping for public read helpers if broad active public listing is not desired.
- Add tests for every policy/helper change.
- Avoid weakening tenant isolation.
- Keep service-role out of public quote and dashboard user flows.

---

## Risks Fixed

None. This phase was audit-only.

---

## Risks Deferred

- SQL policy hardening.
- RLS test runner setup.
- New RLS tests.
- Index changes.
- Role matrix design.
- AI output and usage metadata privacy hardening.
- Public quote abuse/rate-limit controls.

## Audit Addendum — v1.6 Priority Interpretation

The highest-priority RLS issue for MVP readiness is the public quote submission path, especially public insert policies and intake submission value validation.

Before public pilot, verify that submitted field keys/field IDs are valid for the active intake form, visible/writable by the public flow, and scoped to the same business/public link context. The database must reject invalid or hidden fields even if app code fails to filter them.

Add tests for invalid field key insertion, hidden field insertion, inactive link submission, cross-business submission mismatch, and anonymous read denial after insert.
