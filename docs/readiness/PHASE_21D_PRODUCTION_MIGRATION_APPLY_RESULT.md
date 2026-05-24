# Phase 21D Production Migration Apply Result

**Project:** BizPilot AI
**Document Type:** Production migration apply gate/result
**Status:** Grant-only migration `0019` applied and verified in production with owner approval
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Purpose

This document records whether production migrations may be applied for Phase 21 and what happened.

Production grant-only migration `0019_lifecycle_helper_execute_grant_hardening.sql` was applied by Codex through the Supabase SQL Editor on 2026-05-24 after explicit owner approval. The apply returned `Success. No rows returned`, and follow-up verification returned `checked_functions = 6` and `all_grant_checks_passed = true`.

The owner previously reported that `0018_business_lifecycle_deletion_foundation.sql` was manually applied in Supabase and returned OK. Owner-run direct SQL has since verified the required columns, required functions, and expected `0018` lifecycle/deletion objects. Because `supabase_migrations.schema_migrations` does not exist, this report treats production as schema-without-standard-migration-history/manual drift.

No ad-hoc schema changes were created by Codex. No `leads.source` column was added. No dumps, secrets, customer rows, service role keys, anon keys, OpenAI keys, database passwords, tokens, or full connection strings were printed or recorded.

## 2. Production Target

| Item | Status |
| --- | --- |
| Production app URL | `https://bizpilo.com` |
| Supabase project ref | `qfqendrqimqvkoojpjao` |
| Supabase project name | `bizpilot-production` |
| Production target confirmed | Partially yes - owner provided project URL/screenshot and secure env template matches. Vercel production env still requires owner confirmation. |

## 3. Preconditions

| Required precondition | Status | Evidence / blocker |
| --- | --- | --- |
| Production target confirmed | Partial | Target ref/name are documented in Phase 21A. Vercel production env confirmation remains an owner action. |
| DB data status confirmed | Owner-stated no real customer data | Owner states there are no serious/real users yet and current early-project data can be treated as disposable for security/alignment work. Rows were not independently inspected. |
| PITR/backup/export status documented | Yes, and not safe for real customer data | Owner confirmed Supabase Free plan, scheduled backups unavailable, PITR not enabled/unavailable, manual export not done yet, restore drill not done. Owner accepts this risk only for current no-real-customer-data database/security alignment. |
| Migration drift map completed | Yes | Phase 21B maps local migrations to requested objects and records safe PostgREST object probes. |
| Missing migrations identified | No by history; key objects verified present | Owner-run SQL returned `42P01: relation "supabase_migrations.schema_migrations" does not exist`. Dashboard says no migrations, but production objects from later migrations are visible and the owner-run checks now confirm the required columns/functions plus `0018` objects. Treat as schema-without-reliable-migration-history/manual drift. |
| No ad-hoc schema changes planned | Yes | Existing repo migrations remain the source of truth. Do not add `leads.source`. |
| Owner approval recorded | Yes, limited | Owner approves finishing database/security phases quickly and accurately. Approval is limited to repo-backed alignment/verification; no destructive purge, no ad-hoc columns, and no real pilot data. |
| Migration order clear | Partial | Local migration order is clear, but production history/schema reconciliation is not complete. |
| Owner-reported manual `0018` apply | Object verification passed | Owner reported `0018_business_lifecycle_deletion_foundation.sql` returned OK in Supabase. Owner-run SQL verified expected lifecycle columns, deletion tables, and lifecycle helper functions. Do not re-apply blindly. |

## 4. Apply Decision

**Codex applied only production grant-only migration `0019` after explicit owner approval.**

Current operational decision:

```text
Production database/security alignment is owner-approved for repo-backed grant/security work because there are no real customer users yet. Migration 0019 was applied and verified. Destructive SQL, ad-hoc schema changes, main push, deploy, and real customer pilot remain blocked without separate approval.
```

Allowed next steps:

1. run the SQL-only verification pack in Supabase SQL Editor,
2. verify migration history and already-present objects,
3. verify owner-reported `0018` columns/tables/functions/RLS,
4. apply only missing repo-backed security/database migrations in order after explicit approval,
5. document manual drift if objects exist but migration history is missing,
6. reload PostgREST schema cache only if functions exist but API cache is stale.

Still blocked:

1. destructive purge/anonymization,
2. ad-hoc schema changes,
3. adding `leads.source`,
4. real pilot customer data,
5. claiming backup/PITR readiness for real data.

## 5. Migrations Applied

| Migration | Applied in Phase 21D? | Notes |
| --- | --- | --- |
| `0001_auth_tenant_foundation.sql` through `0017_business_preferred_language.sql` | No by Codex | Owner approval now allows repo-backed alignment if verification shows they are missing. Existing object visibility suggests some effects already exist, so do not replay blindly. |
| `0018_business_lifecycle_deletion_foundation.sql` | No by Codex; owner-reported manual apply OK; owner-run object verification passed | Do not re-apply blindly. Lifecycle columns, deletion tables, and helper functions are verified present. Because `schema_migrations` is missing, record manual drift/schema-without-standard-migration-history and continue with policy/grant/function-definition review. |
| `0019_lifecycle_helper_execute_grant_hardening.sql` | Yes by Codex, with owner approval | Applied through Supabase SQL Editor on 2026-05-24. Apply returned `Success. No rows returned`. Production verification returned `checked_functions = 6` and `all_grant_checks_passed = true`. |

No one-off SQL patches were applied.

## 5A. Owner-Reported Manual 0018 Status

Owner update recorded on 2026-05-24:

```text
I manually applied:
0018_business_lifecycle_deletion_foundation.sql

Result:
- OK

Instruction:
- Do not re-apply 0018 blindly.
- Verify schema/RLS/functions only.
- If migration history does not show 0018 but objects exist, document as manual drift.
```

Owner-run direct SQL has verified the expected `0018` lifecycle columns, deletion tables, and lifecycle helper functions. Because migration history is missing, this remains manual drift/schema-without-standard-migration-history rather than a standard Supabase CLI-applied migration.

## 6. Verification Results

Post-apply SQL verification for `0019` was run through the Supabase SQL Editor on 2026-05-24.

Phase 21B did run safe PostgREST visibility probes and found the requested pilot-critical columns/RPCs visible on the corrected production project, except `leads.source`, which is expected to be absent because the repo uses `leads.source_channel`.

Owner-run direct SQL has now verified:

- all 5 required public columns returned `exists = true`,
- all 5 required public quote/lifecycle functions returned `exists = true` and `schema_name = public`,
- all 5 expected `0018` lifecycle/deletion columns returned `exists = true`,
- `business_deletion_requests` and `business_deletion_tombstones` returned `exists = true`, `schema_name = public`, and `rls_enabled = true`,
- all 31 public tables returned `rls_enabled = true`, and the disabled-RLS anti-query returned 0 rows,
- the public RLS policy list was reviewed with no obvious policy blocker found,
- safe aggregate counts returned `businesses = 9`, `business_members = 9`, `public_link_variants = 2`, `leads = 0`, `business_deletion_requests = 0`, and `business_deletion_tombstones = 0`,
- targeted function/grant verification originally found owner-only lifecycle helpers executable by `anon`, likely through broad default EXECUTE; `0019` has now corrected this.
- targeted constraint/template verification passed for `submitted_too_fast`, `businesses.preferred_language` `en`/`fr-CA`, `public_link_variants.preferred_language` `en`/`fr-CA`, `businesses_preferred_language_idx`, and the 0014 cleaning template fields `customer_phone`, `customer_email`, and `home_address`.

Direct SQL verification is still required for:

- migration-history repair need, because `supabase_migrations.schema_migrations` does not exist,
- `0018` migration-history status,
- any additional object-specific checks required by production quote/security smoke.

Production `0019` verification result:

| Function | `anon` EXECUTE | `authenticated` EXECUTE | `service_role` EXECUTE |
| --- | --- | --- | --- |
| `can_request_business_deletion` | `false` | `true` | `true` |
| `can_view_business_deletion_request` | `false` | `true` | `true` |
| `count_recent_public_submission_attempts` | `true` | `true` | `true` |
| `public_can_insert_submission_value` | `true` | `true` | `true` |
| `record_public_submission_attempt` | `true` | `true` | `true` |
| `set_business_lifecycle_updated_at` | `false` | `false` | `true` |

Aggregate verification:

```text
checked_functions = 6
all_grant_checks_passed = true
```

Local validation also applied `0019` to local Supabase only and `pnpm test:rls` passed 13/13 through a temporary local-only Docker proxy on `127.0.0.1:55432`.

## 7. Required Post-Apply Verification SQL

Run these only after owner approval and after any approved migration or migration-history repair.

### Required columns

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

### Required RPC/functions

```sql
with expected(function_name) as (
  values
    ('public_can_insert_submission_value'),
    ('record_public_submission_attempt'),
    ('count_recent_public_submission_attempts')
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

## 8. PostgREST Schema Cache Status

Phase 21B PostgREST probes on the corrected production project showed:

| Object | PostgREST status |
| --- | --- |
| `public_can_insert_submission_value` | Callable |
| `record_public_submission_attempt` | Function exists; synthetic validation error returned before insert |
| `count_recent_public_submission_attempts` | Callable when using repo parameter name `target_window_minutes` |

Do not run a schema-cache reload during the initial blocked state.

If direct SQL later confirms functions exist but PostgREST cannot call them, reload schema cache only after owner approval:

```sql
NOTIFY pgrst, 'reload schema';
```

Then re-test RPC availability.

## 9. Remaining Blockers

| Blocker | Owner/action required | Next step |
| --- | --- | --- |
| DB data classification unknown | Owner must confirm real/synthetic/empty data status. | Record result in Phase 21A. |
| Supabase Free plan has no scheduled backups/PITR | Owner must decide whether to upgrade before real pilot data or stay synthetic-only. | No real pilot until backup/export decision is clear. |
| Manual export not done | Owner/operator must run or approve a manual export path before any write SQL. | Use dashboard export, `pg_dump`, Supabase CLI, or documented alternative outside git. |
| Schema export unavailable locally | Owner/operator must provide approved export path or SQL tool. | Use `pg_dump`, Supabase CLI, dashboard export, or documented alternative outside git. |
| Restore drill not done | Owner/operator must run or explicitly defer with risk acceptance. | Restore schema dump to approved non-production target. |
| Migration history unavailable | `supabase_migrations.schema_migrations` does not exist in production. | Keep production documented as schema-without-standard-migration-history/manual drift; do not replay migrations blindly. |
| Missing migrations not proven | Compare direct schema verification to repo migrations. | Apply only targeted repo-backed migrations if a missing object is proven and approved. |
| Targeted constraint/template checks | Passed for `submitted_too_fast`, language checks, language index, and 0014 cleaning template fields. | Keep evidence recorded; continue to production quote/security smoke using synthetic data only. |
| Production quote/security smoke not run | Operator must use synthetic data only after DB gate closure. | Run Phase 21E positive/negative public quote security smoke. |

## 10. Final Status

Production migration apply result:

```text
0019 grant-only migration applied and verified.
```

Production schema alignment result:

```text
Owner-approved for repo-backed database/security alignment under the current no-real-customer-data condition. Owner-run/Codex-run verification has passed for required columns, required functions, expected 0018 lifecycle/deletion objects, RLS-enabled status across all public tables, public RLS policy-list review, safe aggregate counts, function definitions, 0019 grants, and targeted constraints/template seeds. Migration history remains unavailable/missing, so production is treated as schema-without-standard-migration-history/manual drift. Still pending migration-history reconciliation decision and production quote/security smoke.
```

BizPilot remains:

```text
Ready only for founder-controlled synthetic demos.
```

BizPilot is not yet:

```text
Ready for the first real pilot customer with real customer data.
```
