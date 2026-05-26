# BizPilot AI — Supabase Migrations Index

**Version:** v1.0
**Status:** Active
**Owner:** MoOoH
**Last Updated:** 2026-05-22
**Related:**
- `docs/architecture/BIZPILOT_VENDOR_INDEPENDENCE_AND_PORTABILITY_STANDARD_v1.0.md`
- `docs/engineering/BIZPILOT_BACKEND_DATABASE_RLS_STANDARD_v1.5.md`

---

## Migration sequence

| File | Purpose |
| --- | --- |
| `0001_auth_tenant_foundation.sql` | Profiles, businesses, business_members, RLS, helper functions for tenant identity. |
| `0002_business_template_configuration.sql` | Verticals, industry templates, business branding, services, FAQs, service areas, privacy/consent/template/onboarding settings, RLS. |
| *0003 — retired* | See "About the 0003 gap" below. |
| `0004_remove_noncanonical_template_field_table.sql` | Migrates any data from the early `business_template_fields` override table into `business_template_settings.field_overrides` and drops the table. |
| `0005_public_intake_and_leads.sql` | Public link variants, intake forms, intake form fields, consent versions, intake submissions, submission values, leads, lead source metadata, RLS helper functions, explicit grants. |
| `0006_fix_intake_form_fields_public_rls.sql` | Tightens the public-facing RLS helper for hidden intake fields. |
| `0007_lead_conversion_desk.sql` | Lead quality scores, lead action items, lead events, RLS, explicit grants. |
| `0008_lead_events_actor_and_phase5_event_names.sql` | Adds actor classification and Phase 5 event names to `lead_events`. |
| `0009_ai_lead_conversion_assistant.sql` | AI outputs, usage events, RLS, explicit grants for the on-demand AI lead assistant. |
| `0010_explicit_data_api_grants.sql` | Phase 10C grants migration. Revokes broad PUBLIC defaults, re-grants schema usage, and applies explicit per-table grants for anon, authenticated, and service_role across all public-schema tables and helper functions. Grants-only, no RLS policy changes. |
| `0011_anon_select_policies_for_reference_and_faqs.sql` | Phase 10E anon SELECT policies. Activates the D1 grants on verticals/industry_templates/industry_template_fields (visible when `is_active = true`) and the D2 grants on business_faqs/business_service_areas (visible when `is_active = true` and the owning business has an active public link). Policy-only; no GRANT changes. |
| `0012_intake_submission_values_minimal_rls_hardening.sql` | Phase 12 minimal RLS hardening. Adds the `public_can_insert_submission_value(uuid, uuid, text)` helper and replaces the `intake_submission_values_insert_public_scoped` policy so anon inserts must match a visible (is_hidden = false) field on the submission's own form and business. Closes the known unknown-key / hidden-field / cross-form risks. |
| `0013_public_submission_abuse_log.sql` | Phase 13 abuse-protection schema. Creates `public.public_submission_abuse_log` plus two security-definer helpers (`record_public_submission_attempt`, `count_recent_public_submission_attempts`) so the service layer can log attempts and enforce a per-(business, ip_hash) rate limit without granting anon any direct read/write access on the log. |
| `0014_cleaning_template_contact_address_fields.sql` | Adds cleaning quote template fields for customer phone, customer email, and home address. Idempotent template-field data migration. |
| `0015_business_access_plan_and_admin_log.sql` | Adds manual plan/access controls (`businesses.status`, `plan_slug`, plan dates, internal notes, `business_members.status`) plus service-role-only `admin_action_log` and active-business helper updates. |
| `0016_public_submission_minimum_submit_age_reason.sql` | Extends `public_submission_abuse_log` reason constraint with `submitted_too_fast` for the minimum submit-age public quote protection. |
| `0017_business_preferred_language.sql` | Adds `preferred_language` to `businesses` and public quote links for MVP-safe English / Canadian French support without changing RLS policies. |
| `0018_business_lifecycle_deletion_foundation.sql` | Adds workspace classification, lifecycle status, owner-only deletion requests, non-PII deletion tombstones, helper functions, RLS policies, and explicit grants. No destructive deletion or purge job. |
| `0019_lifecycle_helper_execute_grant_hardening.sql` | Tightens EXECUTE grants for the 0018 lifecycle/deletion helper functions by removing broad PUBLIC/anon execution and restating authenticated/service-role access. Grants-only; no data or policy changes. |
| `0020_founder_test_auth_user_cleanup.sql` | Extends the service-role-only founder admin audit log action-type constraint to permit safe fake/test auth user cleanup auditing. Constraint-only; no data or policy changes. |
| `0021_session_policy_and_owner_audit.sql` | Adds founder-controlled workspace sign-out policy fields and extends founder admin audit actions for session policy and password-support traceability. |

---

## About the 0003 gap

The number `0003` is intentionally absent.

An early Phase 3 schema change created a separate `business_template_fields` override table. That approach was retired in favour of the `field_overrides` `jsonb` column inside `public.business_template_settings`. The cleanup landed as migration `0004_remove_noncanonical_template_field_table.sql`, which migrates any existing rows and drops the obsolete table.

The original `0003` migration was removed from the repository because keeping it would have created a forward then drop sequence with no remaining value. The number was not reassigned so the migration history aligns with the change log preserved in the `0004` file header.

---

## Rules for new migrations

1. **Preserve numbering.** New files must use the next available integer prefix (currently `0022`). Never rename or re-number an existing migration.
2. **One concern per file.** A migration adds, alters, or removes a focused set of related tables, functions, policies, or grants. Cross-cutting changes go in separate files.
3. **File header is mandatory.** Use the BizPilot SQL header format (path, project, description, role, related, author, created/updated, change log) as shown in the existing files.
4. **Tables created here must include:**
   - explicit constraints, indexes, foreign keys;
   - `enable row level security`;
   - explicit named policies for `select` / `insert` / `update` / `delete` as required;
   - explicit `grant` statements for `anon`, `authenticated`, and `service_role` per the Vendor Independence Standard, Section 9;
   - any helper function used in RLS, with `search_path` and `security definer / invoker` documented in comments.
5. **No dashboard-driven schema changes.** Any production schema change made via the Supabase dashboard must be backfilled into a migration in the same working session.
6. **Tests live separately.** Add an RLS test under `tests/rls/<feature>.test.sql` for every new tenant or public-facing table created by the migration.

---

## Tooling

`pnpm test:rls` runs every `tests/rls/*.test.sql` file against a **local** Postgres or local Supabase instance. The runner refuses any `DATABASE_URL` whose host is not in the local allow-list (`localhost`, `127.0.0.1`, `::1`, `host.docker.internal`) and explicitly rejects managed Supabase URLs. See `tests/rls/README.md` for usage and prerequisites.

Do not run RLS tests against the production project.
