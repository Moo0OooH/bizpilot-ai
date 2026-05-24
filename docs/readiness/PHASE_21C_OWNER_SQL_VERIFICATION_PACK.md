# Phase 21C Owner SQL Verification Pack

**Project:** BizPilot AI
**Document Type:** Owner-run production SQL verification pack
**Status:** Production verification complete through `0019` grant hardening
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Purpose

Production DB access is not available from the local Codex environment. This pack gives the owner safe SQL checks to run in the Supabase SQL editor for the production project:

```text
bizpilot-production / qfqendrqimqvkoojpjao
```

These checks are intended to verify migration history, required columns, required RPCs, RLS status, policies, and safe table counts before any migration, migration-history repair, production quote smoke, or real pilot approval.

SQL-only companion file:

```text
docs/readiness/PHASE_21C_OWNER_SQL_VERIFICATION_PACK.sql
```

Use the `.sql` companion when pasting into Supabase SQL Editor. It contains SQL comments only and avoids Markdown headings.

Owner update recorded on 2026-05-24:

```text
Read-only SQL verification is allowed.
Production SQL/migration apply was initially not approved.
Migration 0018 was manually applied by the owner and reported OK.
Do not re-apply 0018 blindly.
Verify 0018 schema/RLS/functions only.
```

Updated owner decision recorded later on 2026-05-24:

```text
There are no serious/real users yet.
The project is at the beginning.
Changes are allowed so database/security phases can be finished quickly and accurately.
Repo-backed database/security SQL is allowed after target verification.
No ad-hoc columns.
Do not add leads.source.
Do not re-apply 0018 blindly.
No real customer pilot yet.
```

Additional owner approval recorded on 2026-05-24:

```text
Codex is approved to edit E:\bizpilot-ai, run local validation commands, create repo-backed fixes/docs/tests, and prepare commits on the current branch.
Production grant-only migration 0019 is approved for Supabase.
Main push/deploy is not approved without separate approval.
```

## 2. Safety Rules

- Do not paste this whole Markdown file into the SQL editor.
- Run only one SQL code block at a time.
- Lines starting with `#` are Markdown headings, not SQL comments, and will fail in Supabase SQL Editor.
- If you need comments inside SQL, use `-- comment text`.
- Do not paste connection strings.
- Do not paste database passwords.
- Do not paste service role keys, anon keys, OpenAI keys, or tokens.
- Do not paste customer names, emails, phone numbers, addresses, quote notes, prompts, provider payloads, or raw customer rows.
- Paste only the result tables from the read-only verification queries below.
- If any result cell contains customer data, redact it before sharing.
- Do not run write SQL unless explicitly approved.
- Do not run the PostgREST schema cache reload until migrations/functions are verified and owner approval is recorded.

## 2A. Owner Attempt Log

2026-05-24 owner attempt:

| Item | Result |
| --- | --- |
| SQL pack run attempt | Failed |
| Error | `syntax error at or near "#"` |
| Cause | The Markdown document heading was pasted into Supabase SQL Editor. |
| Production data touched | No evidence of data changes; the statement failed before running SQL. |
| Next action | Copy and run only the SQL blocks below, one query at a time. |

2026-05-24 owner migration-history query result:

| Item | Result |
| --- | --- |
| Query | `select version, name, executed_at from supabase_migrations.schema_migrations order by version;` |
| Result | Failed |
| Error | `42P01: relation "supabase_migrations.schema_migrations" does not exist` |
| Interpretation | The standard Supabase CLI migration-history table is absent on this production database, or this project was created/changed through manual SQL/dashboard paths that did not create the table. |
| Production data touched | No; this was a read-only query that failed. |
| Next action | Continue with object verification queries for columns, functions, lifecycle tables, RLS, policies, and safe counts. Do not replay migrations blindly. |

2026-05-24 owner required-column verification result:

| Item | Result |
| --- | --- |
| Query | Query 2 - Required Columns |
| Result | Passed |
| Evidence | All 5 expected production columns returned `exists = true`. |
| Verified columns | `business_members.status`, `businesses.internal_note`, `businesses.status`, `leads.source_channel`, `public_link_variants.preferred_language` |
| Important note | `leads.source_channel` is present; `leads.source` was not requested and must not be added. |

2026-05-24 owner `0018` lifecycle/deletion verification result:

| Item | Result |
| --- | --- |
| Query | Query 3A - Migration 0018 Lifecycle Columns And Tables |
| Result | Passed |
| Evidence | All 5 expected lifecycle/deletion columns returned `exists = true`; both deletion tables returned `exists = true`, `schema_name = public`, and `rls_enabled = true`. |
| Verified columns | `businesses.workspace_kind`, `businesses.lifecycle_status`, `businesses.lifecycle_updated_at`, `businesses.deletion_requested_at`, `businesses.deleted_at` |
| Verified tables | `business_deletion_requests`, `business_deletion_tombstones` |
| Interpretation | Because `supabase_migrations.schema_migrations` is missing but `0018` objects exist, treat `0018` as owner-applied manual drift / schema-without-standard-migration-history. Do not re-apply `0018` blindly. |

2026-05-24 owner required-function verification result:

| Item | Result |
| --- | --- |
| Query | Query 3 - Required RPC / Functions |
| Result | Passed |
| Evidence | All 5 expected functions returned `exists = true` and `schema_name = public`. |
| Verified functions | `can_request_business_deletion`, `can_view_business_deletion_request`, `count_recent_public_submission_attempts`, `public_can_insert_submission_value`, `record_public_submission_attempt` |
| Interpretation | Public quote hardening RPCs and `0018` lifecycle deletion helpers exist in production. |

2026-05-24 owner RLS enabled verification result:

| Item | Result |
| --- | --- |
| Query | Query 4 - RLS Enabled Status, plus disabled-RLS anti-query |
| Result | Passed |
| Evidence | All 31 public tables returned `rls_enabled = true`; the anti-query for public tables where RLS is not true returned 0 rows. |
| Verified sensitive tables | `businesses`, `business_members`, `leads`, `intake_submissions`, `intake_submission_values`, `public_link_variants`, `business_deletion_requests`, `business_deletion_tombstones`, `public_submission_abuse_log` |
| Interpretation | Production public tables have RLS enabled. Policy definition review is still required before production quote/security smoke. |

2026-05-24 owner policy-list verification result:

| Item | Result |
| --- | --- |
| Query | Query 5 - Policy List |
| Result | Reviewed / no obvious policy blocker found |
| Evidence | Owner pasted 70 public RLS policies. The list contains no secrets or customer row data. Tenant-owned reads/writes use `is_business_member(...)` / `can_manage_business(...)`; public quote inserts use scoped helper checks; public reads are limited to active/reference configuration policies. |
| `0018` evidence | `business_deletion_requests_select_owner` and `business_deletion_requests_insert_owner_pending` are present and match the lifecycle helper pattern. `business_deletion_tombstones` has RLS enabled but no anon/auth policy, matching the repo design for service-role-only tombstones. |
| Service-role-only evidence | `admin_action_log` has RLS enabled and no anon/auth policy in the pasted list, matching the repo design for service-role-only founder/admin audit logs. |
| Interpretation | Policy names and expressions are aligned enough to continue verification. Grants, check constraints, full function definitions, and behavior smoke tests remain separate checks. |

2026-05-24 owner safe-count verification result:

| Item | Result |
| --- | --- |
| Query | Query 6 - Safe Table Counts Only |
| Result | Passed |
| Evidence | Owner pasted aggregate counts only. No customer rows, emails, phones, addresses, quote notes, prompts, or payloads were shared. |
| Counts | `businesses = 9`, `business_members = 9`, `public_link_variants = 2`, `leads = 0`, `business_deletion_requests = 0`, `business_deletion_tombstones = 0` |
| Interpretation | No lead/customer quote rows were present in the checked production tables at the time of verification. The database is not empty because workspace/member/link configuration rows exist. |

2026-05-24 owner function/grant verification result:

| Item | Result |
| --- | --- |
| Query | Targeted function privileges and definitions |
| Result | Pre-`0019`: mostly passed; least-privilege hardening required |
| Public quote functions | `public_can_insert_submission_value`, `record_public_submission_attempt`, and `count_recent_public_submission_attempts` have expected `anon`, `authenticated`, and `service_role` EXECUTE access. |
| Function definitions | Expected helpers are `security_definer = true`; public quote helpers include `search_path=public` and `row_security=off`; deletion helpers include `search_path=public`. `record_public_submission_attempt` is correctly `volatile`; read/check helpers are `stable`. |
| Finding | `can_request_business_deletion` and `can_view_business_deletion_request` also returned `anon_execute = true`. These owner-only helpers are expected to be authenticated/service-role only. The functions still return false for anon because they depend on `auth.uid()` membership checks, but broad anon EXECUTE should be removed for least privilege. |
| Repo-backed fix | Added `supabase/migrations/0019_lifecycle_helper_execute_grant_hardening.sql` to revoke PUBLIC/anon EXECUTE from the lifecycle helpers and restate required grants. Applied and verified in production later on 2026-05-24. |

2026-05-24 production `0019` apply and verification result:

| Item | Result |
| --- | --- |
| Migration | `0019_lifecycle_helper_execute_grant_hardening.sql` |
| Production apply | Passed |
| Apply evidence | Supabase SQL Editor returned `Success. No rows returned`. |
| Verification query | Targeted function EXECUTE grant matrix plus aggregate check |
| Verification result | Passed |
| Aggregate evidence | `checked_functions = 6`, `all_grant_checks_passed = true` |
| Grant matrix | `can_request_business_deletion`: `anon=false`, `authenticated=true`, `service_role=true`; `can_view_business_deletion_request`: `anon=false`, `authenticated=true`, `service_role=true`; `set_business_lifecycle_updated_at`: `anon=false`, `authenticated=false`, `service_role=true`; public quote helpers retained `anon=true`, `authenticated=true`, `service_role=true`. |
| Production data touched | No table rows were selected or modified by `0019`; this was grants-only SQL. |
| Main push/deploy | Not run; still requires separate owner approval. |

2026-05-24 production constraint/template verification result:

| Item | Result |
| --- | --- |
| Query | Targeted read-only constraint/template check |
| Result | Passed |
| Evidence | 7 checks returned `passed = true`. |
| Verified constraints/index | `public_submission_abuse_log_reason_check` includes `submitted_too_fast`; `businesses_preferred_language_check` includes `fr-CA`; `public_link_variants_preferred_language_check` includes `fr-CA`; `businesses_preferred_language_idx` exists. |
| Verified 0014 template fields | `customer_phone`, `customer_email`, and `home_address` exist on `cleaning-smart-quote-v1`, are active, and match expected type/required/sort-order metadata. |
| Production data touched | No customer rows were returned or modified; this was metadata/seed verification only. |

## 3. Query 1 - Migration History

Read-only. This verifies whether Supabase has recorded repo migrations in its migration history table.

```sql
select version, name, executed_at
from supabase_migrations.schema_migrations
order by version;
```

Expected owner output:

```text
Paste the rows returned, or paste the exact error if the query fails.
Do not include connection details or screenshots that reveal secrets.
```

## 4. Query 2 - Required Columns

Read-only. This verifies the Phase 20/21 pilot-critical columns using the current repo schema naming. `leads.source_channel` is expected. Do not add `leads.source`.

```sql
with expected(table_name, column_name) as (
  values
    ('businesses', 'status'),
    ('businesses', 'internal_note'),
    ('business_members', 'status'),
    ('public_link_variants', 'preferred_language'),
    ('leads', 'source_channel')
)
select
  e.table_name,
  e.column_name,
  case when c.column_name is null then false else true end as exists,
  c.data_type,
  c.is_nullable,
  c.column_default
from expected e
left join information_schema.columns c
  on c.table_schema = 'public'
 and c.table_name = e.table_name
 and c.column_name = e.column_name
order by e.table_name, e.column_name;
```

Expected owner output:

```text
Paste the result table. Every listed column should have exists = true before production quote verification proceeds.
```

## 5. Query 3 - Required RPC / Functions

Read-only. This verifies the three public quote hardening functions and the 0018 lifecycle deletion helpers.

```sql
with expected(function_name) as (
  values
    ('public_can_insert_submission_value'),
    ('record_public_submission_attempt'),
    ('count_recent_public_submission_attempts'),
    ('can_request_business_deletion'),
    ('can_view_business_deletion_request')
)
select
  e.function_name,
  case when p.oid is null then false else true end as exists,
  n.nspname as schema_name,
  pg_get_function_identity_arguments(p.oid) as args
from expected e
left join pg_proc p
  on p.proname = e.function_name
left join pg_namespace n
  on n.oid = p.pronamespace
 and n.nspname = 'public'
order by e.function_name;
```

Expected owner output:

```text
Paste the result table. Every function should have exists = true and schema_name = public.
If exists = true but schema_name is blank/null, treat that as not production-ready until investigated.
```

## 6. Query 3A - Migration 0018 Lifecycle Columns And Tables

Read-only. Run this if migration `0018_business_lifecycle_deletion_foundation.sql` was manually applied or appears in migration history.

```sql
with expected(table_name, column_name) as (
  values
    ('businesses', 'workspace_kind'),
    ('businesses', 'lifecycle_status'),
    ('businesses', 'lifecycle_updated_at'),
    ('businesses', 'deletion_requested_at'),
    ('businesses', 'deleted_at')
)
select
  e.table_name,
  e.column_name,
  case when c.column_name is null then false else true end as exists,
  c.data_type,
  c.is_nullable,
  c.column_default
from expected e
left join information_schema.columns c
  on c.table_schema = 'public'
 and c.table_name = e.table_name
 and c.column_name = e.column_name
order by e.table_name, e.column_name;

with expected(table_name) as (
  values
    ('business_deletion_requests'),
    ('business_deletion_tombstones')
)
select
  e.table_name,
  case when c.relname is null then false else true end as exists,
  n.nspname as schema_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as force_rls
from expected e
left join pg_class c
  on c.relname = e.table_name
 and c.relkind = 'r'
left join pg_namespace n
  on n.oid = c.relnamespace
 and n.nspname = 'public'
order by e.table_name;
```

Expected owner output:

```text
Paste the result tables. If 0018 objects exist but migration history does not show 0018, report that as manual drift.
```

## 7. Query 4 - RLS Enabled Status

Read-only. This verifies which public tables have RLS enabled.

```sql
select
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as force_rls
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
order by c.relname;
```

Expected owner output:

```text
Paste the result table. This query should not expose customer rows.
```

## 8. Query 5 - Policy List

Read-only. This verifies the RLS policy names and expressions.

```sql
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

Expected owner output:

```text
Paste the result table. Review the output before sharing; do not include anything if a policy expression somehow contains sensitive values.
```

## 9. Query 6 - Safe Table Counts Only

Read-only. This gives only aggregate counts and does not return customer rows.

```sql
select 'businesses' as table_name, count(*) as row_count from public.businesses
union all
select 'business_members', count(*) from public.business_members
union all
select 'public_link_variants', count(*) from public.public_link_variants
union all
select 'leads', count(*) from public.leads
union all
select 'business_deletion_requests', count(*) from public.business_deletion_requests
union all
select 'business_deletion_tombstones', count(*) from public.business_deletion_tombstones;
```

Expected owner output:

```text
Paste only the table_name and row_count results.
Do not run select * queries.
Do not paste business names, owner emails, lead names, phone numbers, addresses, or quote payloads.
```

## 10. Query 7 - PostgREST Schema Cache Reload

This is not a read-only verification query. Run it only after:

1. the owner approves production SQL,
2. required migrations/functions are applied or verified,
3. direct SQL confirms functions exist,
4. PostgREST still cannot see the functions/RPCs.

```sql
NOTIFY pgrst, 'reload schema';
```

Expected owner output:

```text
Only report that the cache reload was run, plus the timestamp.
Do not run this step during initial read-only verification.
```

## 11. What To Paste Back

Paste back:

- migration history rows or exact error,
- required-column result table,
- required-function result table,
- RLS enabled result table,
- policy list result table after checking it contains no sensitive values,
- safe table-count result table,
- whether 0018 appears in migration history or appears to be manual drift,
- whether Query 7 was not run or was run after approval.

Do not paste:

- connection strings,
- dashboard credentials,
- database passwords,
- API keys,
- tokens,
- customer names,
- customer emails,
- phone numbers,
- addresses,
- quote notes,
- full lead rows,
- OpenAI prompts or provider payloads.

## 12. Gate Decision

Owner-run SQL verification has now confirmed the required production columns, required public quote/lifecycle functions, owner-reported `0018` lifecycle/deletion objects, RLS-enabled status for all 31 public tables, the public RLS policy list, safe aggregate counts, and function definitions. Migration history remains unavailable because `supabase_migrations.schema_migrations` does not exist, so production must still be treated as schema-without-standard-migration-history/manual drift.

Production quote/security verification found one least-privilege grant hardening item: owner-only lifecycle helper functions were executable by `anon` through broad default EXECUTE. Repo-backed migration `0019_lifecycle_helper_execute_grant_hardening.sql` has now been applied and verified in production: `checked_functions = 6`, `all_grant_checks_passed = true`. Targeted constraint/template checks also passed for `submitted_too_fast`, language checks/index, and the 0014 cleaning template contact/address fields. BizPilot remains ready only for founder-controlled synthetic demos and is not ready for the first real pilot customer with real customer data.
