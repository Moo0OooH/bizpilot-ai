<!--
 * ============================================================
 * File: docs/readiness/FINAL_SUPABASE_MIGRATION_RLS_AND_RESTORE_GATE_2026-07-12.md
 * Project: BizPilot AI
 * Description: Final evidence for Supabase target classification, production read-only audit, local RLS validation, backup, and restore confidence.
 * Role: Records the exact database release gate without authorizing production migrations or destructive work.
 * Related:
 * - supabase/migrations/
 * - scripts/supabase-explicit-grant-audit.mts
 * - scripts/check-local-targets.mts
 * - tests/rls/
 * - docs/readiness/BIZPILOT_FINAL_SOURCE_OF_TRUTH_2026-07-12.md
 * Author: MoOoH
 * Created: 2026-07-12
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-12: Recorded the initial local validation and managed-production blockers.
 * - 2026-07-13: Completed linked read-only production audit, private backup, schema drift comparison, live Auth review, and platform-faithful local restore/app/RLS proof.
 * ============================================================
 -->

# Final Supabase Migration, RLS, and Restore Gate - 2026-07-13

## Governing result

The **read-only Supabase audit and platform-faithful restore proof pass**. The
managed project was linked to the intended `bizpilot-production` project,
private production dumps were created outside the repository, the production
`public` schema produced a zero-byte diff against repository migrations, and a
full local Supabase restore passed counts, RLS, grants, dashboard, and quote
smoke.

The **production migration gate remains closed** because the remote migration
history table contains no recorded versions even though its live schema matches
the repository migration result. No migration, seed, synthetic user, synthetic
lead, policy change, access change, or destructive operation was applied to the
managed project. History must be reconciled through a separately reviewed
repair plan; migrations must not be replayed against the matching live schema.

## Target classification and access

| Target | Classification | Result |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Managed production project `qfqendrqimqvkoojpjao` | Confirmed by `pnpm check:targets`, Supabase project list, CLI link, Vercel project audit, and dashboard. |
| `DATABASE_URL` | Local disposable Postgres at `127.0.0.1:54322` | Used for reset, restore, RLS, and synthetic smoke only. |
| Supabase CLI project | Linked to `bizpilot-production` | `supabase link` completed without exposing credentials. |
| Vercel production reference | Same managed Supabase project | Environment names/scopes were audited without printing values. |

## Production backup evidence

A new timestamped private backup was created outside the repository at:

`E:\bizpilot-ai-backups\final-readonly-audit-20260713-205140`

The directory is owner-controlled, is not tracked by Git, and must remain
private. Contents were never printed or committed.

| Artifact | Bytes | Result |
| --- | ---: | --- |
| `roles.sql` | 358 | Non-zero; SHA-256 recorded during the run. |
| `public-schema.sql` | 102,034 | Non-zero; readable production public schema. |
| `public-data.sql` | 9,945 | Non-zero; private production public data. |
| `auth-schema.sql` | 46,739 | Non-zero; Auth schema metadata. |
| `auth-data.sql` | 24,599 | Non-zero; private Auth data. |
| `storage-schema.sql` | 48,237 | Non-zero; Storage schema metadata. |
| `storage-data.sql` | 1,492 | Non-zero; private Storage inventory/data dump. |

The first combined Auth/Storage schema command was parsed incorrectly by
Windows PowerShell and created an empty temporary artifact. That artifact was
verified as zero bytes and deleted. A transient Storage connection refusal was
retried successfully. All retained artifacts above are non-zero.

## Production migration history and schema drift

`supabase migration list --linked` returned every repository version only in
the local column and no versions in the remote column:

- repository: `0001`, `0002`, and `0004` through `0024`;
- remote recorded history: empty;
- `0003` is intentionally absent from the repository sequence.

The authoritative schema comparison was then run from linked production to the
repository migration result:

```text
supabase db diff --from linked --to migrations --schema public
DRIFT_BYTES=0
SHA256=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

Therefore the live `public` schema is structurally aligned, but migration
history is not. Classification:

| Class | Result |
| --- | --- |
| Pending schema changes | None detected by schema diff. |
| Divergent schema objects | None detected by schema diff. |
| Production-only schema objects | None detected in `public`. |
| Repository-only schema objects | None detected in `public`. |
| Unrecorded migration history | All repository versions are unrecorded remotely. |
| Production migrations applied during this audit | None. |

Safe remediation is to review and record migration-history state against the
already-matching live schema using the official Supabase repair workflow. Do
not replay `0001`-`0024`, and do not perform history repair in the release merge
without a separate owner-approved database change review and rollback plan.

## Production schema, RLS, grants, and functions

The production schema dump and zero schema diff establish the following live
shape:

| Check | Result |
| --- | --- |
| Public tables | 31 |
| Tables with RLS enabled | 31/31 |
| RLS policies | 70 |
| Grant statements in schema dump | 146 |
| Public functions | 19 |
| Security-definer functions | 17 |
| Production-to-repository public schema diff | 0 bytes |

The matching repository schema also passed `pnpm audit:supabase`: 0 missing RLS
tables, 0 missing policy-driven grants, 0 missing required grants, and 0
overbroad anonymous grants. Function definitions, RLS policies, and grants are
covered by the zero linked schema diff; no policy or function was changed.

## Managed production owner and operational state

Service-role REST reads selected identifiers only and returned counts without
printing customer or owner identifiers:

| Record / state | Result |
| --- | ---: |
| Confirmed founder Auth users | 1 |
| Owner profiles | 1 |
| Owner businesses/workspaces | 1 |
| Active owner memberships | 1 |
| Reference verticals | 1 |
| Reference industry templates | 1 |
| Leads | 0 |
| Intake submissions | 0 |
| AI outputs | 0 |
| Lead action items/events/scores/source metadata | 0 |
| Abuse-log and usage events | 0 |

The preserved owner path is intact and operational tables remain clean. The
production audit did not create or delete any row.

## Live production Auth configuration

The Supabase dashboard was audited in a read-only Chrome session. No setting was
saved or modified.

| Control | Live result | Classification |
| --- | --- | --- |
| Site URL | `https://bizpilo.com` | Pass. |
| Email provider | Enabled | Pass. |
| Email confirmation | Required | Pass. |
| New-user signup | Enabled | Expected for approved owner onboarding; application guardrails remain required. |
| Anonymous sign-in | Disabled | Pass. |
| Phone provider | Disabled | Pass. |
| Custom SMTP | Enabled, Resend host, sender `no-reply@bizpilo.com` / `BizPilot` | Pass; credential was not revealed. |
| Google provider | Disabled | Release limitation: Google sign-in source exists but must not be claimed operational until configured and smoke-tested. |
| Custom OAuth providers | None | Expected. |
| Redirect allowlist | 11 URLs for production, `www`, and legacy Vercel alias | Functional but requires maintenance. Domain-scoped wildcards exist; no global wildcard was found. |

The allowlist still references `bizpilot-ai-gamma.vercel.app` rather than the
current branch Preview alias. Add only the exact approved Preview callback/reset
URLs if Preview Auth QA is required, and remove legacy entries only through a
separate reviewed Auth configuration change.

## Clean local validation before restore

All destructive/reset and synthetic operations targeted local Supabase only:

| Command / flow | Result |
| --- | --- |
| `pnpm check:targets` | Pass; managed Supabase and local DB correctly classified. |
| `pnpm check:db-local` | Pass. |
| `supabase db reset --local --yes` | Pass; repository migrations through `0024`. |
| `pnpm audit:supabase` | Pass. |
| `pnpm test:rls` | 13/13 pass. |
| `pnpm verify:local-db` | 236 unit tests + 13/13 RLS pass. |
| Dense dashboard smoke | 8/8 routes pass. |
| Public quote route smoke | 1/1 pass. |
| Real local quote submit/read-back | Pass; synthetic form reached success and dashboard count changed from 6 to 7 with the new lead visible. |

Cross-tenant denial, owner access, public intake, grants, lifecycle, abuse
retention, AI output, events, and usage isolation are included in the passing
RLS suite.

## Platform-faithful restore drill

The production Auth, public, and Storage data dumps were restored into the
complete local Supabase stack after a clean local reset. Production was not a
restore target and was not modified.

Repository migrations seed the same reference rows and the Auth user trigger
creates the same profile that exist in the production dump. The first restore
correctly stopped on the duplicate `verticals.cleaning` key. The final drill was
restarted from a clean reset; generated local reference/profile rows were
truncated locally before replaying the authoritative production dump. This is a
documented restore prerequisite, not a production cleanup.

| Restored-target check | Result |
| --- | --- |
| Auth users | 1 |
| Profiles | 1 |
| Businesses | 1 |
| Active membership records | 1 |
| Vertical/template reference rows | 1 / 1 |
| Leads before synthetic smoke | 0 |
| `pnpm audit:supabase` | Pass. |
| `pnpm test:rls` | 13/13 pass on restored target. |
| Dense authenticated dashboard smoke | 8/8 pass. |
| Public quote route smoke | 1/1 pass. |

This closes the prior strict restored app/dashboard/RLS blocker for the current
schema and backup. It does not authorize production writes, paid pilot launch,
or replay of unrecorded migrations.

## Release decision and required follow-up

**Prompt 5 result: PASS for local validation, production read-only audit,
private backup, and restore confidence. Production migration execution was
correctly not performed.**

Remaining controlled follow-ups:

1. Reconcile the empty remote migration history using an owner-approved
   history-repair plan; do not replay matching migrations.
2. Enable and test Google Auth before advertising or relying on Google sign-in.
3. Align exact Supabase Preview redirect URLs if authenticated Preview QA is
   required; review legacy redirect removal separately.
4. Retain the private backup outside Git and keep its access owner-only.
5. Continue to require a fresh backup and explicit approval before any future
   production migration, cleanup, access mutation, or destructive operation.
