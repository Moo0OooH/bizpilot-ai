<!--
 * ============================================================
 * File: docs/readiness/FINAL_SUPABASE_MIGRATION_RLS_AND_RESTORE_GATE_2026-07-12.md
 * Project: BizPilot AI
 * Description: Evidence record for Supabase target classification, local migration/RLS validation, and restore confidence.
 * Role: States the managed-production alignment gate truthfully and prevents local evidence from authorizing production changes.
 * Related:
 * - supabase/migrations/
 * - scripts/audit-supabase.mts
 * - scripts/check-targets.mts
 * - scripts/verify-local-db.mts
 * - tests/rls/
 * - docs/readiness/BIZPILOT_FINAL_SOURCE_OF_TRUTH_2026-07-12.md
 * Author: MoOoH
 * Created: 2026-07-12
 * Last Updated: 2026-07-12
 * Change Log:
 * - 2026-07-12: Recorded local validation, managed read-only evidence, restore drill limits, and production blockers.
 * ============================================================
 -->

# Final Supabase Migration, RLS, and Restore Gate - 2026-07-12

## Governing result

This gate is **not approved for managed-production migration or restore
operations**. The Supabase CLI is authenticated to the BizPilot production
project, but the repository is not linked to its production database and no
production database password was supplied to the CLI. Therefore a new
production backup, authoritative migration-history comparison, and schema-drift
analysis could not be performed safely. No managed-production mutation,
seed, synthetic user, synthetic lead, or real-customer-data operation occurred.

Local repository migrations, RLS, grants, and expected owner/workspace access
behaviour passed after a clean local reset. Those results are local evidence;
they do not authorize a production migration.

## Target classification and access

| Target | Classification | Evidence | Result |
| --- | --- | --- | --- |
| Application Supabase URL | Managed production | `pnpm check:targets` identified the configured non-local project host; its project ref is `qfqendrqimqvkoojpjao`. | Identified without printing keys. |
| Application database URL | Local disposable Postgres | `pnpm check:targets` identified `127.0.0.1:54322`. | Safe for local reset and RLS tests. |
| Local Supabase stack | Local only | Supabase CLI status and reset completed against the local stack. | Used for all destructive/reset and RLS work. |
| Managed Supabase CLI account | Authenticated | `supabase projects list` returned the BizPilot production project. | Project-list access only. |
| Managed production database | Not linked | `supabase db dump --linked` and `supabase migration list --linked` stopped with "Cannot find project ref." | No database read/write command was run. |

The managed target is masked in normal operational output. The ref above is a
non-secret project identifier retained only so the owner can complete the
explicit linking step below. No database, service-role, anonymous, SMTP, or
provider secret appears in this record.

## Backup evidence

### Managed production

**Blocked before creation.** The required production backup cannot be made by
the authenticated project-list session alone. The CLI requires a linked project
and that link requires the production database password. This is a stop
condition, so no production migration or other mutation was attempted.

### Local restore-test backup

A separate, private **local-only** backup was created outside the repository at
`C:\Users\mbeag\Documents\BizPilot Secure Backups\local-restore-audit-20260712-153006`.
It contains no production data and was not committed.

| File | Bytes | Integrity result |
| --- | ---: | --- |
| `public-schema.sql` | 105,028 | Non-zero, readable SQL dump. |
| `public-data.sql` | 8,729 | Non-zero, readable SQL dump. |
| `auth-metadata.sql` | 3,145 | Non-zero, readable SQL dump. |
| `roles.sql` | 297 | Non-zero, readable SQL dump. |

This local backup proves the repository-local restore procedure only. It is not
a substitute for the required production backup.

## Migration drift result

Repository migration files `0001` through `0024` were reset successfully into
the local stack. `0003` is intentionally absent from the repository sequence;
the reset-applied history otherwise contains every listed repository migration.

| Classification | Result | Evidence / consequence |
| --- | --- | --- |
| Applied in managed production | Unverified | Linked production migration history was unavailable. |
| Pending in managed production | Unverified | Requires linked migration-history comparison. |
| Divergent | Unverified | Requires production schema and migration-history comparison. |
| Production-only migrations | Unverified | Requires production migration history and schema inspection. |
| Repository-only migrations | Repository contains `0001`, `0002`, `0004`-`0024`; managed comparison unverified. | Do not infer pending status from this list. |
| Local reset state | Pass | Clean local reset applied the repository set through `0024`. |

**Migrations applied to managed production: none.** No historic migration was
replayed and no destructive migration was evaluated for execution.

## Local RLS, grants, and access verification

All commands below targeted local Supabase/Postgres only. No dashboard or RLS
test was directed at the managed project.

| Command | Exact result |
| --- | --- |
| `pnpm check:targets` | Pass: managed Supabase endpoint and local database correctly identified; no production Vercel environment indicated. |
| `supabase db reset` | Pass against local stack; repository migrations reset through `0024`. |
| `pnpm check:db-local` | Pass: database target is local. |
| `pnpm audit:supabase` | Pass: 0 tables missing RLS, 0 tables missing policies, 0 policy grants missing, 0 required grants missing, 0 overbroad anonymous grants. |
| `pnpm test:rls` | Pass: 13/13 SQL test files. |
| `pnpm verify:local-db` | Pass: 226 unit tests plus 13/13 RLS SQL files. |

The first RLS invocation immediately after reset failed because local Auth was
still initializing and `auth.users.email_confirmed_at` was temporarily absent.
After the local stack was ready, the same untouched test suite passed 13/13.
No test, policy, grant, or application code was weakened.

The passing local suite covers cross-business denial, owner access, tenant
foundation, quote intake, source metadata, activity/events, AI output bounds,
lead scoring, and grants. The audit confirms explicit anonymous,
authenticated, and service-role grant posture rather than relying on a broad
anonymous grant.

## Managed production read-only preservation verification

Using a read-only, service-role REST query that did not print identifiers or
credentials, the preserved founder identity configured by the repository was
checked without changing data.

| Record / state | Result |
| --- | --- |
| Confirmed owner auth user | Exactly 1 found. |
| Owner profile | Exactly 1 found. |
| Owner business/workspace | Exactly 1 found. |
| Active owner membership | Exactly 1 found with owner role. |
| Reference vertical/template data | Present. |
| Expected-clean operational tables | Empty: leads, intake submissions, AI outputs, action items, events, scores, source metadata, abuse log, and usage events. |

This proves that the preserved owner auth user, profile, workspace, and active
owner membership were present at read time. It does not prove production
migration history, schema equivalence, or backup/restore completeness.

## Production security and auth posture

The following production controls require Supabase Management API/dashboard
read access or a linked database. They remain deliberately **unverified**, not
assumed:

| Control | Status |
| --- | --- |
| RLS enabled and forced on each expected production table | Unverified against production; local audit passes. |
| Explicit production grants and policy definitions | Unverified against production; local audit passes. |
| Function `search_path` and security-definer posture | Unverified against production. |
| Abuse-log retention | Unverified against production. |
| Site URL and redirect allowlist | Unverified from production auth settings. |
| Email/password enablement and confirmation behaviour | Unverified from production auth settings. |
| SMTP/Resend configuration | Unverified from production auth settings. |
| Google provider configuration | Unverified from production auth settings. |
| Phone provider disabled | Unverified from production auth settings. |
| Broad wildcard redirects | Unverified from production auth settings. |

Repository source and local tests still enforce the documented product boundary:
email/password flows, Google OAuth source boundaries, no Google workspace
creation callback, and no phone OTP implementation. Source evidence is not a
replacement for live provider configuration evidence.

## Restore drill

The local-only dump was restored into disposable PostgreSQL database
`phasefinal_restore_20260712`; production was not touched.

| Check | Result |
| --- | --- |
| Public schema load | Pass. |
| Public data load | Pass. |
| Restored reference counts | `businesses=0`, `verticals=1`, `templates=1`. |
| Auth metadata / roles restore | Not performed in the disposable database. The platform Auth schema and roles cannot be faithfully recreated by the minimal local compatibility shim. |
| RLS suite on restored disposable target | Partial / fail: 2/13 passed, 11/13 failed after the owner-profile assertion; subsequent checks shared the aborted SQL transaction. |
| Application/API smoke on restored disposable target | Not run. The local PostgREST/Auth services are bound to the normal local database, not this standalone disposable database. |

The strict restore RLS result is intentionally recorded as a failure. It does
not contradict the 13/13 result from the clean local Supabase reset; it shows
that the bare PostgreSQL restore plus minimal Auth shim is insufficient to
prove full Auth/RLS restoration. No test was bypassed to convert it into a
pass.

## Required owner action and safe continuation

On a trusted owner-controlled machine, provide the **production database
password only to the CLI prompt/argument** (never to source control, chat, or
an application environment file), then run:

```powershell
supabase link --project-ref qfqendrqimqvkoojpjao --password "<production database password>"
```

Before any production mutation, the continuation must then:

1. Create a new timestamped private backup outside this repository, including
   schema, public data, permitted Auth metadata, and storage inventory; verify
   every artifact is non-zero and readable.
2. Run linked migration history and a read-only schema comparison against
   repository migrations `0001`-`0024`; explain every pending, divergent,
   production-only, or repository-only entry.
3. Use a Supabase Management API/dashboard session with read-only configuration
   access to capture the auth and redirect evidence listed above without
   exposing secrets.
4. Re-confirm the owner auth user, profile, business, and active owner
   membership immediately before and after any reviewed migration.
5. Apply only reviewed, non-destructive pending migrations; never run seeds
   against production; then repeat migration, RLS, grant, function, retention,
   and owner-preservation checks.
6. Perform a platform-faithful restore drill in a disposable local Supabase
   environment that includes supported Auth restoration, then run schema/count
   checks and the full RLS/app smoke suite.

Until those actions pass, the exact release blocker is: **managed Supabase
backup, migration drift, live security posture, and restore confidence are not
verified.**
