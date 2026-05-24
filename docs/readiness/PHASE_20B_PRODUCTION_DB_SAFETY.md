# Phase 20B Production DB Safety

**Project:** BizPilot AI
**Document Type:** Production database safety gate
**Status:** Blocked - no production SQL approved
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Purpose

Phase 20B documents the minimum production database safety posture before any production migration or SQL is applied.

No migrations were applied. No SQL mutation was run. No dump files were created. No customer data, secrets, database passwords, service role keys, anon keys, OpenAI keys, tokens, or full connection strings were printed or recorded.

## 2. Production Target Context

| Item | Status |
| --- | --- |
| Production app URL | `https://bizpilo.com` |
| Checked Supabase host from local env | `cwiuajpbpyybxxtodpaq.supabase.co` |
| Supabase project name | Owner-reported as `bizpilot-production`; not independently confirmed in dashboard during this run |
| Vercel production env target | Unknown from this run |
| Phase 20A target decision | Production target not fully confirmed |
| Checked DB data classification | `unknown_or_possible_real_data_present` |

Because the checked database has possible-real data indicators, it must not be treated as disposable.

## 3. PITR And Backup Retention

| Safety item | Status | Notes |
| --- | --- | --- |
| PITR enabled | Owner action required | PITR cannot be verified from repo files, public app responses, Supabase REST, or the available local CLI state. |
| Backup retention window | Owner action required | Exact retention/PITR window must be read from Supabase dashboard or billing/settings. |
| Supabase plan tier | Owner action required | Plan tier cannot be inferred from code, domain, or public Supabase host. |
| Restore into new project availability | Owner action required | Must be confirmed from Supabase dashboard/docs for the actual plan. |

## 4. Manual Export Status

| Export type | Status | Blocker |
| --- | --- | --- |
| Schema-only dump | Blocked | `pg_dump` not installed, `psql` not installed, Supabase CLI not installed, no production database connection string available, and local DB port `127.0.0.1:54322` refused connection. |
| Public-schema data dump | Blocked | Data export is not owner-approved and export storage/access are not recorded. |
| Auth export | Not in scope | Supabase Auth is provider-managed; do not casually export/import `auth.users` for the MVP safety gate. |

No dump was written inside or outside the repo.

## 5. Restore Drill Status

| Item | Status |
| --- | --- |
| Schema restore drill | Blocked |
| Data restore drill | Blocked |
| Local restore target | Not available; local DB refused connection |
| Staging/disposable restore target | Not provided |
| Restore verification | Not run |

Restore drill cannot proceed until a schema dump exists and a local/staging/disposable restore target is available.

## 6. Export Storage Location

| Item | Status |
| --- | --- |
| Approved export storage location | Open |
| Encryption requirement | Required |
| Access list | Open |
| In-repo storage | Not allowed |
| Ignored temporary paths | `backups/`, `tmp-backups/`, `restore-drills/` |

Recommended storage remains an owner-controlled encrypted location outside the repo, such as:

```text
BizPilot Secure Backups/production/YYYY-MM-DD/
```

This location is a recommendation only. The owner must approve the actual location before data export.

## 7. Git Ignore Verification

`git check-ignore -v` confirmed common dump/export paths are ignored:

- `bizpilot-production-schema-YYYYMMDD.sql`
- `bizpilot-production-public-data-YYYYMMDD.sql`
- `*-export.sql`
- `*-export.csv`
- `*-export.json`
- `*-backup.dump`
- `backups/*`
- `tmp-backups/*`
- `restore-drills/*`

The repo intentionally does not ignore every `*.sql` file because migration files under `supabase/migrations/` must remain trackable.

## 8. Deletion And Export Request Process

Manual pilot processes are documented in `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`:

- customer deletion request process: Section 11,
- customer export request process: Section 12,
- privacy incident handling: Section 13.

Current status:

| Process | Status |
| --- | --- |
| Deletion/minimization process | Documented, manual during pilot |
| Customer export process | Documented, manual during pilot |
| Productized self-serve deletion/export | Deferred |
| Private request log location | Owner action required; must be outside git |
| Privacy incident log location | Owner action required; must be outside git |

## 9. Owner Actions Required

Before any production migration or SQL:

1. Confirm the exact Vercel production `NEXT_PUBLIC_SUPABASE_URL` without exposing keys.
2. Confirm the matching Supabase dashboard project name/ref.
3. Confirm whether the checked database contains any real customer, owner, or prospect data.
4. Record Supabase plan tier.
5. Record PITR enabled/disabled.
6. Record backup/PITR retention window.
7. Choose encrypted export storage outside git.
8. Name the export access list.
9. Install or provide access to `pg_dump`/`psql`, Supabase CLI, or another approved schema export mechanism.
10. Create and verify a schema-only dump without committing it.
11. Provide a local/staging/disposable restore target.
12. Complete or explicitly risk-accept a restore drill.
13. Approve the exact migration list and rollback/stop criteria.

## 10. May Production Migration Proceed?

**No. Production migration is not approved to proceed.**

Reason:

- PITR status is unknown.
- Backup retention is unknown.
- Export storage is not chosen.
- No schema-only dump exists.
- No restore drill exists.
- The checked DB is classified as `unknown_or_possible_real_data_present`.
- The production Supabase target is not fully confirmed from Vercel production env.
- Owner approval for production SQL has not been recorded.

## 11. Phase 20B Decision

BizPilot remains in:

```text
Code stable, production database safety not yet established.
```

It has not yet moved to:

```text
Production verified and safe for first founder-controlled pilot.
```
