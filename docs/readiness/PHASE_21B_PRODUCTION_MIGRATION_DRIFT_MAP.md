# Phase 21B Production Migration Drift Map

**Project:** BizPilot AI
**Document Type:** Production migration drift map
**Status:** `0019` grant drift closed; migration history still unavailable
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Purpose

This report maps the corrected production Supabase target to the local repo migrations before any production SQL is applied.

Production grant-only migration `0019_lifecycle_helper_execute_grant_hardening.sql` was applied and verified on 2026-05-24 after explicit owner approval. No ad-hoc `ALTER TABLE` patch was created. No dump was created. No customer rows, secrets, database passwords, service role keys, anon keys, OpenAI keys, tokens, or full connection strings were printed or recorded.

## 2. Production Target Used

| Item | Value |
| --- | --- |
| Production app URL | `https://bizpilo.com` |
| Supabase project ref | `qfqendrqimqvkoojpjao` |
| Supabase project URL | `https://qfqendrqimqvkoojpjao.supabase.co` |
| Supabase project name | `bizpilot-production` |
| Supabase dashboard branch/environment | `main` / `PRODUCTION` |
| Dashboard last migration | No migrations shown |
| Dashboard last backup | No backups shown |

The dashboard migration indicator is not enough to safely apply migrations. The corrected production project has schema objects that match later repo migrations, so this is likely a migration-history reconciliation problem, a manually-created-schema problem, or a dashboard/CLI-linkage visibility problem.

Owner update recorded on 2026-05-24:

```text
There are no serious/real users yet.
The project is at the beginning.
Changes are allowed so database/security phases can be finished quickly and accurately.
Owner accepts no real pilot yet.
```

This approval allows repo-backed database/security alignment and verification. It does not allow guessed schema patches, destructive purge, `leads.source`, secrets/dumps in git, or a real customer pilot.

## 3. Local Migration Files In Order

| Order | Local migration file | Committed in Phase 20 baseline? |
| --- | --- | --- |
| 0001 | `0001_auth_tenant_foundation.sql` | Yes |
| 0002 | `0002_business_template_configuration.sql` | Yes |
| 0004 | `0004_remove_noncanonical_template_field_table.sql` | Yes |
| 0005 | `0005_public_intake_and_leads.sql` | Yes |
| 0006 | `0006_fix_intake_form_fields_public_rls.sql` | Yes |
| 0007 | `0007_lead_conversion_desk.sql` | Yes |
| 0008 | `0008_lead_events_actor_and_phase5_event_names.sql` | Yes |
| 0009 | `0009_ai_lead_conversion_assistant.sql` | Yes |
| 0010 | `0010_explicit_data_api_grants.sql` | Yes |
| 0011 | `0011_anon_select_policies_for_reference_and_faqs.sql` | Yes |
| 0012 | `0012_intake_submission_values_minimal_rls_hardening.sql` | Yes |
| 0013 | `0013_public_submission_abuse_log.sql` | Yes |
| 0014 | `0014_cleaning_template_contact_address_fields.sql` | Yes |
| 0015 | `0015_business_access_plan_and_admin_log.sql` | Yes |
| 0016 | `0016_public_submission_minimum_submit_age_reason.sql` | Yes |
| 0017 | `0017_business_preferred_language.sql` | Yes |
| 0018 | `0018_business_lifecycle_deletion_foundation.sql` | No - dirty local worktree migration, not part of Phase 20 production-alignment baseline; owner later reported manual production apply OK |
| 0019 | `0019_lifecycle_helper_execute_grant_hardening.sql` | No - new Phase 21 grant-hardening migration applied/verified in production after owner approval |

Do not re-apply `0018_business_lifecycle_deletion_foundation.sql` blindly. The owner reported it was manually applied and returned OK, and owner-run direct SQL later verified the expected lifecycle columns, deletion tables, and helper functions. Because `supabase_migrations.schema_migrations` does not exist, document this as manual drift/schema-without-standard-migration-history and reconcile intentionally.

## 4. Object To Migration Map

| Required object / schema area | Responsible local migration | Evidence in local migration | Correct production PostgREST probe |
| --- | --- | --- | --- |
| `leads.source_channel` | `0005_public_intake_and_leads.sql` | `public.leads` creates `source_channel text`; `lead_source_metadata` also creates `source_channel text`. | Present |
| `leads.source` | None | No repo migration creates this column. | Missing, as expected. Do not add it. |
| `public_can_insert_submission_value` | `0012_intake_submission_values_minimal_rls_hardening.sql` | Creates `public.public_can_insert_submission_value(uuid, uuid, text)` and grants execute. | Present |
| `public_submission_abuse_log` | `0013_public_submission_abuse_log.sql` | Creates the abuse-log table used by public quote throttling. | Present through anon-safe zero-row probe |
| `record_public_submission_attempt` | `0013_public_submission_abuse_log.sql` | Creates `public.record_public_submission_attempt(uuid, uuid, text, text)` and grants execute. | Present; synthetic null-business probe raised before insert |
| `count_recent_public_submission_attempts` | `0013_public_submission_abuse_log.sql` | Creates `public.count_recent_public_submission_attempts(uuid, text, integer)` and grants execute. | Present when called with `target_window_minutes` |
| `submitted_too_fast` abuse reason | `0016_public_submission_minimum_submit_age_reason.sql` | Extends the `public_submission_abuse_log.reason` check constraint. | Verified by direct production SQL: constraint contains `submitted_too_fast` |
| `businesses.status` | `0015_business_access_plan_and_admin_log.sql` | Adds `businesses.status`. | Present |
| `businesses.internal_note` | `0015_business_access_plan_and_admin_log.sql` | Adds `businesses.internal_note`. | Present |
| `businesses.plan_slug` and plan dates | `0015_business_access_plan_and_admin_log.sql` | Adds manual plan/access columns. | `plan_slug` present |
| `business_members.status` | `0015_business_access_plan_and_admin_log.sql` | Adds `business_members.status`. | Present |
| `admin_action_log` | `0015_business_access_plan_and_admin_log.sql` | Creates service-role-only `admin_action_log`. | Endpoint exists but anon access is blocked, which matches service-role-only intent |
| `businesses.preferred_language` | `0017_business_preferred_language.sql` | Adds business language field and `en` / `fr-CA` check. | Present; `fr-CA` constraint and index verified by direct production SQL |
| `public_link_variants.preferred_language` | `0017_business_preferred_language.sql` | Adds public quote-link language field and `en` / `fr-CA` check. | Present; `fr-CA` constraint verified by direct production SQL |
| `businesses.workspace_kind` | `0018_business_lifecycle_deletion_foundation.sql` | Adds workspace classification for production/test lifecycle handling. | Verified by owner-run direct SQL: present |
| `businesses.lifecycle_status` | `0018_business_lifecycle_deletion_foundation.sql` | Adds lifecycle lock/status for active, suspended, archived, deletion-requested, deleted flows. | Verified by owner-run direct SQL: present |
| `business_deletion_requests` | `0018_business_lifecycle_deletion_foundation.sql` | Creates owner request table with RLS. | Verified by owner-run direct SQL: present in `public`, RLS enabled |
| `business_deletion_tombstones` | `0018_business_lifecycle_deletion_foundation.sql` | Creates non-PII tombstone table intended for service-role/founder processing. | Verified by owner-run direct SQL: present in `public`, RLS enabled |
| `can_request_business_deletion` | `0018_business_lifecycle_deletion_foundation.sql` | Creates lifecycle helper for owner deletion request eligibility. | Verified by owner-run direct SQL: present in `public` |

The earlier `leads.source` wording is stale. Current repo schema and code use `leads.source_channel`.

## 5. Production Migration History Check

Requested SQL:

```sql
select version, name, executed_at
from supabase_migrations.schema_migrations
order by version;
```

Result: **not available from this environment**.

Attempts and blockers:

| Check | Result |
| --- | --- |
| `supabase` CLI | Not available on PATH |
| `psql` | Not available on PATH |
| Direct production DB connection | Not provided or approved |
| PostgREST read of `supabase_migrations.schema_migrations` | Blocked; migration schema is not exposed through the public REST API |
| Supabase dashboard evidence | Shows `No migrations`, but production schema objects are present, so the dashboard alone must not be used to re-apply all migrations |
| Owner-run SQL editor query | Failed with `42P01: relation "supabase_migrations.schema_migrations" does not exist` |

Exact migration-history rows are unavailable because the standard `supabase_migrations.schema_migrations` table does not exist on this production database.

Interpretation:

```text
Treat production as schema-without-reliable-migration-history.
Do not replay migrations blindly.
Verify actual objects, constraints, functions, grants, and RLS directly.
If objects exist, document manual drift.
If objects are missing, apply only existing repo-backed migrations or controlled SQL from the repo migration, with owner approval.
```

## 6. Safe Production Object Probe Summary

The following probes used the corrected production project URL and the saved public anon client config. They did not print the anon key. They used `limit=0` where table endpoints were checked and did not fetch customer rows.

| Probe | Result | Interpretation |
| --- | --- | --- |
| `businesses.id,status,internal_note` | OK | `0015` effects are visible for these columns. |
| `businesses.id,preferred_language` | OK | `0017` business language column is visible. |
| `businesses.id,plan_slug` | OK | `0015` plan column is visible. |
| `business_members.id,status` | OK | `0015` member status column is visible. |
| `public_link_variants.id,preferred_language` | OK | `0017` public-link language column is visible. |
| `leads.id,source_channel` | OK | `0005` current source field is visible. |
| `leads.id,source` | Error: column does not exist | Expected. Do not add `leads.source`. |
| `public_submission_abuse_log.id` | OK with zero-row probe | `0013` abuse-log endpoint is visible. |
| `admin_action_log.id` | Access blocked | Expected for service-role-only table; SQL is still needed to verify grants/RLS exactly. |
| `public_can_insert_submission_value` | OK | `0012` RPC is visible. |
| `record_public_submission_attempt` | Function raised expected validation error before insert | RPC exists; no customer data was created. |
| `count_recent_public_submission_attempts` | OK with repo parameter name `target_window_minutes` | RPC exists. Earlier `window_seconds` naming would falsely look missing. |

## 7. Local Vs Production Migration Matrix

`Applied in production` below means `schema_migrations` history status, not just object visibility.

| Local migration file | Applied in production | Objects created / affected | Required for pilot | Additive/backward-compatible | Risk | Apply status |
| --- | --- | --- | --- | --- | --- | --- |
| `0001_auth_tenant_foundation.sql` | Unknown; dashboard says no migration rows | Profiles, businesses, business_members, tenant helpers, base RLS. | Yes | Unknown on already-populated production DB | High if manually-created base schema exists | Do not apply until history/schema reconciliation is complete |
| `0002_business_template_configuration.sql` | Unknown; dashboard says no migration rows | Vertical/template/business configuration tables and RLS. | Yes | Unknown on already-populated production DB | High if objects already exist with drift | Do not apply until history/schema reconciliation is complete |
| `0004_remove_noncanonical_template_field_table.sql` | Unknown; dashboard says no migration rows | Retired template-field override cleanup. | Yes | Unknown | Medium | Do not apply until history/schema reconciliation is complete |
| `0005_public_intake_and_leads.sql` | Unknown; dashboard says no migration rows | Public links, intake forms, submissions, values, leads, `leads.source_channel`, source metadata, public helpers/RLS. | Yes | Unknown on current production schema | High | Do not apply until history/schema reconciliation is complete |
| `0006_fix_intake_form_fields_public_rls.sql` | Unknown; dashboard says no migration rows | Public field visibility helper/policy hardening. | Yes | Mostly policy/function replacement | Medium | Do not apply until history/schema reconciliation is complete |
| `0007_lead_conversion_desk.sql` | Unknown; dashboard says no migration rows | Lead quality scores, action items, events, lead workflow columns/RLS. | Yes | Unknown | Medium | Do not apply until history/schema reconciliation is complete |
| `0008_lead_events_actor_and_phase5_event_names.sql` | Unknown; dashboard says no migration rows | Lead event actor classification and event-name constraints. | Yes | Mostly additive/constraint update | Medium | Do not apply until history/schema reconciliation is complete |
| `0009_ai_lead_conversion_assistant.sql` | Unknown; dashboard says no migration rows | AI outputs, usage events, AI RLS/grants. | Yes for AI dry run | Unknown | Medium | Do not apply until history/schema reconciliation is complete |
| `0010_explicit_data_api_grants.sql` | Unknown; dashboard says no migration rows | Explicit grants for public schema tables/functions. | Yes | Grant-only but security-sensitive | Medium | Do not apply until SQL history/grant diff is reviewed |
| `0011_anon_select_policies_for_reference_and_faqs.sql` | Unknown; dashboard says no migration rows | Anon SELECT policies for reference and public FAQ/service-area data. | Yes | Policy-only but security-sensitive | Medium | Do not apply until SQL policy diff is reviewed |
| `0012_intake_submission_values_minimal_rls_hardening.sql` | Unknown; dashboard says no migration rows | `public_can_insert_submission_value` and public value insert policy hardening. | Yes | Function/policy replacement | Medium | Object visible; do not re-apply until history/schema reconciliation |
| `0013_public_submission_abuse_log.sql` | Unknown; dashboard says no migration rows | `public_submission_abuse_log`, `record_public_submission_attempt`, `count_recent_public_submission_attempts`. | Yes | Additive table/functions/RLS | Medium | Objects/RPCs visible; do not re-apply until history/schema reconciliation |
| `0014_cleaning_template_contact_address_fields.sql` | Unknown; dashboard says no migration rows | Cleaning template contact/address fields. | Yes for full quote smoke | Data-seed/update migration | Medium | Needs template-data verification before quote smoke |
| `0015_business_access_plan_and_admin_log.sql` | Unknown; dashboard says no migration rows | `businesses.status`, `businesses.internal_note`, plan columns, `business_members.status`, `admin_action_log`, access helper updates. | Yes | Additive columns/table plus helper replacement | Medium/high | Objects visible; do not re-apply until history/schema reconciliation |
| `0016_public_submission_minimum_submit_age_reason.sql` | Unknown; dashboard says no migration rows | Adds `submitted_too_fast` abuse reason. | Yes | Constraint replacement | Medium | Requires SQL constraint verification |
| `0017_business_preferred_language.sql` | Unknown; dashboard says no migration rows | `businesses.preferred_language`, `public_link_variants.preferred_language`, language constraints/index. | Yes for fr-CA smoke | Additive columns plus check constraints | Medium | Objects visible; do not re-apply until history/schema reconciliation |
| `0018_business_lifecycle_deletion_foundation.sql` | Not recorded in standard history because `supabase_migrations.schema_migrations` is missing; objects verified present by owner-run SQL | Business lifecycle columns, deletion request/tombstone tables, lifecycle helpers, RLS policies, grants. | Not required for Phase 20 schema/RPC alignment, but now part of production schema and must be preserved | Object/RLS/policy verification passed; grant/function-definition review still pending | High if replayed blindly | Do not re-apply; record as manual drift/schema-without-standard-migration-history unless a later approved repair process creates migration history |
| `0019_lifecycle_helper_execute_grant_hardening.sql` | Applied/verified by direct production SQL, not recorded in standard history because `supabase_migrations.schema_migrations` is missing | Revokes broad PUBLIC/anon EXECUTE from owner-only lifecycle helper functions and restates authenticated/service-role grants. | Yes for least-privilege database/security closure | Grants-only; no data/table/policy change | Low | Closed for grant hardening: `checked_functions = 6`, `all_grant_checks_passed = true` |

## 8. Missing Migrations And Missing Objects

### Migration history

Exactly confirmed missing migration-history rows by direct SQL:

```text
Not confirmed. Direct migration-history SQL is blocked.
```

Operational gate interpretation:

```text
The Supabase dashboard shows "No migrations", so treat migration history as untrusted or empty until the owner runs the SQL history query.
```

Because production objects from `0005`, `0012`, `0013`, `0015`, and `0017` are visible, do not assume all local migrations are absent from the actual schema and do not blindly replay them.

### Schema objects from the requested list

Exactly missing from corrected-production PostgREST probes:

```text
leads.source
```

This is expected and should remain missing. The repo uses:

```text
leads.source_channel
```

Objects from the requested list that are visible through corrected-production PostgREST probes:

```text
businesses.status
businesses.internal_note
business_members.status
public_link_variants.preferred_language
businesses.preferred_language
leads.source_channel
public_can_insert_submission_value
record_public_submission_attempt
count_recent_public_submission_attempts
```

Objects still requiring direct SQL verification:

```text
schema_migrations rows
0018 migration-history status
admin_action_log exact grants/RLS
```

Production `0019` grant verification on 2026-05-24:

| Function | `anon` EXECUTE | `authenticated` EXECUTE | `service_role` EXECUTE |
| --- | --- | --- | --- |
| `can_request_business_deletion` | `false` | `true` | `true` |
| `can_view_business_deletion_request` | `false` | `true` | `true` |
| `count_recent_public_submission_attempts` | `true` | `true` | `true` |
| `public_can_insert_submission_value` | `true` | `true` | `true` |
| `record_public_submission_attempt` | `true` | `true` | `true` |
| `set_business_lifecycle_updated_at` | `false` | `false` | `true` |

Aggregate verification: `checked_functions = 6`, `all_grant_checks_passed = true`.

Production constraint/template verification on 2026-05-24:

| Check | Result |
| --- | --- |
| `public_submission_abuse_log_reason_check` includes `submitted_too_fast` | Pass |
| `businesses_preferred_language_check` includes `fr-CA` | Pass |
| `public_link_variants_preferred_language_check` includes `fr-CA` | Pass |
| `businesses_preferred_language_idx` exists | Pass |
| Cleaning template field `customer_phone` exists/active with expected type/required/sort order | Pass |
| Cleaning template field `customer_email` exists/active with expected type/required/sort order | Pass |
| Cleaning template field `home_address` exists/active with expected type/required/sort order | Pass |

Safe aggregate production counts verified by owner-run SQL on 2026-05-24:

| Table | Row count |
| --- | ---: |
| `businesses` | 9 |
| `business_members` | 9 |
| `public_link_variants` | 2 |
| `leads` | 0 |
| `business_deletion_requests` | 0 |
| `business_deletion_tombstones` | 0 |

This confirms no lead/customer quote rows were present in the checked production `leads` table at verification time. It does not mean the database is empty; workspace/member/link configuration rows exist.

## 9. Should Applying Existing Repo Migrations Fix The Drift?

Not safely as a blind action.

Current evidence says:

- applying repo migrations is the correct source of truth for missing schema,
- ad-hoc columns are not appropriate,
- `leads.source` must not be created,
- production already exposes many objects that the dashboard says have no migration history,
- the immediate drift is between migration history and schema visibility, not a proven absence of all schema objects.

If owner-run SQL shows missing `schema_migrations` rows but objects already exist, the next step is a controlled reconciliation plan, not a blind migration replay. The operator must compare the actual schema to each migration and either:

1. apply only truly missing migrations in order, or
2. mark already-applied manual schema changes in migration history using the project-approved Supabase migration repair method, after verifying the schema exactly matches the repo migration effects.

## 10. Owner Approval Required

Owner approval has been recorded in principle for repo-backed database/security alignment at the current no-real-customer-data stage. Direct execution still requires the operator to verify the exact target and stop criteria.

Owner approval is still required before:

- destructive SQL,
- production purge/anonymization,
- any ad-hoc schema patch,
- adding columns not present in repo migrations,
- treating backup/PITR/export as ready for real customer data,
- starting the first real customer pilot.

Production verification/execution still must respect these blockers:

- dashboard shows no backups,
- PITR is unavailable on the current Free plan,
- manual export is not done,
- restore drill is not done,
- direct `schema_migrations` output is not yet available,
- owner-reported `0018` manual apply must be verified before replay or repair.

## 11. Exact Next Step

Run this read-only query in the Supabase SQL editor for `bizpilot-production` after owner approval:

```sql
select version, name, executed_at
from supabase_migrations.schema_migrations
order by version;
```

Then run read-only verification for the requested schema areas:

```sql
select table_name, column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and (
    (table_name = 'businesses' and column_name in ('status', 'internal_note', 'preferred_language', 'plan_slug'))
    or (table_name = 'business_members' and column_name = 'status')
    or (table_name = 'public_link_variants' and column_name = 'preferred_language')
    or (table_name = 'leads' and column_name in ('source_channel', 'source'))
  )
order by table_name, column_name;

select n.nspname as schema_name,
       p.proname as function_name,
       pg_get_function_arguments(p.oid) as args,
       p.prosecdef as security_definer
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    'public_can_insert_submission_value',
    'record_public_submission_attempt',
    'count_recent_public_submission_attempts'
  )
order by p.proname;

select n.nspname as schema_name,
       c.relname as table_name,
       c.relrowsecurity as rls_enabled,
       c.relforcerowsecurity as force_rls
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
order by c.relname;

select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

Do not apply or repair anything until those results, backup status, data classification, and owner approval are recorded.

Owner-run lifecycle/deletion checks have verified the expected `0018` columns, deletion tables, lifecycle helper functions, RLS-enabled status, policy list, and function definitions. Function/grant verification found owner-only lifecycle helper functions still executable by `anon`, likely through broad default EXECUTE. Repo-backed migration `0019_lifecycle_helper_execute_grant_hardening.sql` has now been applied and verified.

Use the `.sql` companion rather than pasting the Markdown document. If Supabase reports a syntax error near `#`, it means Markdown headings were pasted into the SQL editor.

## 12. Final Decision

**Production migration drift is partially closed.**

The corrected target now shows the requested pilot-critical columns and RPCs through PostgREST, and owner-run/Codex-run direct SQL has verified the required columns, required functions, expected `0018` lifecycle/deletion objects, RLS-enabled status for all 31 public tables, public RLS policy list, safe aggregate counts, function definitions, `0019` grants, and targeted constraints/template seeds. Migration history is unavailable because `supabase_migrations.schema_migrations` does not exist, so production is treated as schema-without-standard-migration-history/manual drift. Backup/PITR/export safety remains blocked for real customer data. BizPilot remains ready only for founder-controlled synthetic demos until production quote smoke, fr-CA smoke, OpenAI dry run, signup smoke, commercial terms, and real-data backup/export decisions are complete.
