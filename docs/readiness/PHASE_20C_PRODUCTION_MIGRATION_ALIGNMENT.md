# Phase 20C Production Migration Alignment

**Project:** BizPilot AI
**Document Type:** Production migration alignment report
**Status:** Blocked - production schema not aligned
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Purpose

Phase 20C maps the production schema drift found in Phase 19/20A to the actual repo migrations, verifies what can be verified safely, and blocks production SQL until the Phase 20A/20B safety gates are satisfied.

No production migration was applied. No ad-hoc `ALTER TABLE` patch was created. No customer data, secrets, tokens, keys, database passwords, or full connection strings were printed or recorded.

## 2. Local Migration Files

The local repo contains these migration files in order:

| Migration file | Present locally |
| --- | --- |
| `0001_auth_tenant_foundation.sql` | Yes |
| `0002_business_template_configuration.sql` | Yes |
| `0004_remove_noncanonical_template_field_table.sql` | Yes |
| `0005_public_intake_and_leads.sql` | Yes |
| `0006_fix_intake_form_fields_public_rls.sql` | Yes |
| `0007_lead_conversion_desk.sql` | Yes |
| `0008_lead_events_actor_and_phase5_event_names.sql` | Yes |
| `0009_ai_lead_conversion_assistant.sql` | Yes |
| `0010_explicit_data_api_grants.sql` | Yes |
| `0011_anon_select_policies_for_reference_and_faqs.sql` | Yes |
| `0012_intake_submission_values_minimal_rls_hardening.sql` | Yes |
| `0013_public_submission_abuse_log.sql` | Yes |
| `0014_cleaning_template_contact_address_fields.sql` | Yes |
| `0015_business_access_plan_and_admin_log.sql` | Yes |
| `0016_public_submission_minimum_submit_age_reason.sql` | Yes |
| `0017_business_preferred_language.sql` | Yes |

## 3. Missing Object To Migration Map

| Production object / issue | Responsible local migration | Evidence in migration | Notes |
| --- | --- | --- | --- |
| `businesses.status` | `0015_business_access_plan_and_admin_log.sql` | Adds `businesses.status` with values `onboarding`, `active`, `suspended`, `cancelled`. | Required for founder/admin access controls and active-business RLS helpers. |
| `businesses.internal_note` | `0015_business_access_plan_and_admin_log.sql` | Adds `businesses.internal_note`. | Required by founder admin notes. |
| `businesses.plan_slug` and plan dates | `0015_business_access_plan_and_admin_log.sql` | Adds `plan_slug`, `plan_started_at`, `plan_expires_at`. | Probe also showed `plan_slug` missing on checked host. |
| `business_members.status` | `0015_business_access_plan_and_admin_log.sql` | Adds `business_members.status`. | Required for disabled-member access blocking. |
| `admin_action_log` | `0015_business_access_plan_and_admin_log.sql` | Creates service-role-only `admin_action_log`. | Safe probe found table missing from PostgREST schema cache. |
| `public_link_variants.preferred_language` | `0017_business_preferred_language.sql` | Adds `preferred_language` to public quote links. | Required for fr-CA public quote copy. |
| `businesses.preferred_language` | `0017_business_preferred_language.sql` | Adds `preferred_language` to businesses. | Required for owner-selected language. |
| `public.public_can_insert_submission_value(uuid, uuid, text)` | `0012_intake_submission_values_minimal_rls_hardening.sql` | Creates helper and replaces public submission-value insert policy. | Required for public quote hardening. |
| `public.public_submission_abuse_log` | `0013_public_submission_abuse_log.sql` | Creates abuse log table. | Required for public quote abuse logging and rate limiting. |
| `public.record_public_submission_attempt(uuid, uuid, text, text)` | `0013_public_submission_abuse_log.sql` | Creates helper. | Required for public quote abuse logging. |
| `public.count_recent_public_submission_attempts(uuid, text, integer)` | `0013_public_submission_abuse_log.sql` | Creates helper. | Required for public quote rate limiting. |
| `submitted_too_fast` abuse-log reason | `0016_public_submission_minimum_submit_age_reason.sql` | Extends abuse-log reason check constraint. | Required by minimum submit-age protection once `0013` exists. |
| `leads.source` | No local migration found | Local schema defines `leads.source_channel` in `0005_public_intake_and_leads.sql`. | Do not add an ad-hoc `source` column. Current app and types use `source_channel`. Earlier docs should treat `leads.source` as a wording error unless product/code changes require it. |
| `leads.source_channel` | `0005_public_intake_and_leads.sql` | Creates `leads.source_channel`. | Safe production probe confirmed `source_channel` exists. |
| Lead workflow columns | `0007_lead_conversion_desk.sql` | Adds `response_sla_state`, `response_status`, `manual_outcome`, `first_viewed_at`, `first_reply_copied_at`. | Safe production probe confirmed these exist on checked host. |
| Contact/address template fields | `0014_cleaning_template_contact_address_fields.sql` | Adds `customer_phone`, `customer_email`, `home_address` template fields. | Not directly responsible for listed missing columns/RPCs, but should be verified before full quote smoke. |

## 4. Production Migration History Check

Requested SQL:

```sql
select version, name, executed_at
from supabase_migrations.schema_migrations
order by version;
```

Result from this environment: **Blocked**.

Safe read-only attempts through the available Supabase Data API returned:

| Attempt | Result |
| --- | --- |
| `Accept-Profile: supabase_migrations` against `schema_migrations` | Blocked: `PGRST106`, schema not exposed |
| `public.schema_migrations` | Blocked: `PGRST205`, table not in public schema cache |
| dotted `supabase_migrations.schema_migrations` path | Blocked: `PGRST205`, table not in public schema cache |

Direct SQL access is required via Supabase SQL editor, `psql`, Supabase CLI, or another owner-approved read-only path.

## 5. Local Vs Production Migration Matrix

Because production migration history is not readable from this environment, `present in production` below means object-level evidence from safe probes, not confirmed migration-history rows.

| Migration file | Present locally | Present in production | Required for pilot | Safe to apply now | Notes |
| --- | --- | --- | --- | --- | --- |
| `0001_auth_tenant_foundation.sql` | Yes | Partially evidenced | Yes | No | Base tables exist, but migration history not verified. |
| `0002_business_template_configuration.sql` | Yes | Partially evidenced | Yes | No | Config/reference tables appear usable from prior app behavior, but direct history not verified. |
| `0004_remove_noncanonical_template_field_table.sql` | Yes | Unknown | Yes | No | Requires migration history or SQL verification. |
| `0005_public_intake_and_leads.sql` | Yes | Partially evidenced | Yes | No | `leads.source_channel` exists. |
| `0006_fix_intake_form_fields_public_rls.sql` | Yes | Unknown | Yes | No | RLS policy verification blocked without SQL access. |
| `0007_lead_conversion_desk.sql` | Yes | Partially evidenced | Yes | No | Lead workflow columns exist. |
| `0008_lead_events_actor_and_phase5_event_names.sql` | Yes | Unknown | Yes | No | Requires SQL verification. |
| `0009_ai_lead_conversion_assistant.sql` | Yes | Partially evidenced | Yes | No | `ai_outputs` and `usage_events` exist by Phase 20A count check. |
| `0010_explicit_data_api_grants.sql` | Yes | Unknown | Yes | No | Grants cannot be verified through available REST probes. |
| `0011_anon_select_policies_for_reference_and_faqs.sql` | Yes | Unknown | Yes | No | Policy verification blocked without SQL access. |
| `0012_intake_submission_values_minimal_rls_hardening.sql` | Yes | No / not effective | Yes | No | RPC `public_can_insert_submission_value` missing from PostgREST schema cache. |
| `0013_public_submission_abuse_log.sql` | Yes | No / not effective | Yes | No | Abuse table and two RPCs missing from PostgREST schema cache. |
| `0014_cleaning_template_contact_address_fields.sql` | Yes | Unknown | Yes for full quote smoke | No | Needs SQL/template verification before fr-CA quote smoke. |
| `0015_business_access_plan_and_admin_log.sql` | Yes | No / not effective | Yes | No | `businesses.status`, `internal_note`, `plan_slug`, `business_members.status`, and `admin_action_log` missing on checked host. |
| `0016_public_submission_minimum_submit_age_reason.sql` | Yes | No / not effective | Yes | No | Depends on `0013`; cannot be effective while abuse log table is missing. |
| `0017_business_preferred_language.sql` | Yes | No / not effective | Yes | No | `businesses.preferred_language` and `public_link_variants.preferred_language` missing on checked host. |

`Safe to apply now` is `No` for all migrations because Phase 20A/20B safety gates are not satisfied.

## 6. Required Pending Migration Work

Do not create ad-hoc `ALTER TABLE` patches for objects that already exist in repo migrations.

After owner approval, backup/export safety, and exact target confirmation, apply missing migrations in repo order. Based on object-level evidence, at minimum the checked target needs the effects of:

```text
0012_intake_submission_values_minimal_rls_hardening.sql
0013_public_submission_abuse_log.sql
0015_business_access_plan_and_admin_log.sql
0016_public_submission_minimum_submit_age_reason.sql
0017_business_preferred_language.sql
```

Also verify `0014_cleaning_template_contact_address_fields.sql` before a full production quote smoke.

Before applying anything, read the actual production migration history. If an earlier migration is missing, start from the earliest missing migration and apply migrations in order.

## 7. SQL Verification Status

The requested SQL verification queries for `information_schema.columns`, `pg_proc`, `pg_class`, and `pg_policies` were **not run** from this machine.

Blockers:

- no `psql` installed,
- no Supabase CLI installed,
- no owner-approved direct production SQL connection,
- `supabase_migrations` schema is not exposed through PostgREST,
- Phase 20B backup/PITR/export safety is blocked.

Safe PostgREST object probes did run and produced these results:

| Object probe | Result |
| --- | --- |
| `businesses.status` | Missing |
| `businesses.internal_note` | Missing |
| `businesses.preferred_language` | Missing |
| `businesses.plan_slug` | Missing |
| `business_members.status` | Missing |
| `public_link_variants.preferred_language` | Missing |
| `leads.source` | Missing, and no local migration defines it |
| `leads.source_channel` | Present |
| lead workflow columns from `0007` | Present |
| `public_submission_abuse_log` | Missing from PostgREST schema cache |
| `admin_action_log` | Missing from PostgREST schema cache |
| `public_can_insert_submission_value` | Missing from PostgREST schema cache |
| `record_public_submission_attempt` | Missing from PostgREST schema cache |
| `count_recent_public_submission_attempts` | Missing from PostgREST schema cache |

## 8. PostgREST Schema Cache Status

PostgREST currently reports missing RPCs/tables for objects introduced by `0012`, `0013`, and `0015`.

It is not yet possible to distinguish between:

- migration not applied,
- migration applied to a different Supabase project,
- migration applied but PostgREST schema cache not refreshed.

Direct SQL verification via `pg_proc`, `pg_class`, `information_schema.columns`, and `pg_policies` is required.

If direct SQL confirms functions exist but PostgREST still returns `PGRST202`, reload the schema cache using the approved method. If SQL notification is approved, use:

```sql
NOTIFY pgrst, 'reload schema';
```

No schema-cache reload was run during Phase 20C because direct SQL verification and production-change approval are still blocked.

## 9. Backup And Safety Status

Phase 20B status applies:

| Safety item | Status |
| --- | --- |
| PITR | Unknown; owner action required |
| Backup retention | Unknown; owner action required |
| Schema-only dump | Blocked |
| Restore drill | Blocked |
| Export storage | Not chosen |
| Data classification | `unknown_or_possible_real_data_present` |
| Production migration approval | Not approved |

Because the checked database may contain real data and no backup/PITR/export safety exists, production migrations must not be applied.

## 10. Manual Action Required

Owner/operator must complete these steps before migration:

1. Confirm exact Vercel production `NEXT_PUBLIC_SUPABASE_URL`.
2. Confirm matching Supabase dashboard project name/ref.
3. Confirm data classification and whether real data exists.
4. Record PITR status and backup retention.
5. Create and verify schema-only backup, or record explicit owner risk acceptance.
6. Run the migration history query in Supabase SQL editor or an approved direct SQL tool.
7. Identify earliest missing migration.
8. Apply existing repo migrations in order, not ad-hoc schema patches.
9. Run the requested column/function/RLS verification SQL.
10. Reload PostgREST schema cache only if direct SQL confirms functions exist but REST/RPC cache is stale.
11. Re-run REST/RPC probes.
12. Record results in this document.

## 11. Final Decision

**Production schema not aligned.**

BizPilot remains blocked from:

- first real pilot customer data,
- production public quote collection,
- production fr-CA quote smoke,
- production SQL migration.

The project may proceed only after owner-approved target confirmation, backup/PITR/export safety, migration-history verification, ordered migration application, SQL verification, and PostgREST RPC re-test.
