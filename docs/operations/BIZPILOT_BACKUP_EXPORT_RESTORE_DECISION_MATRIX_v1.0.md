# BizPilot Backup, Export, and Restore Decision Matrix v1.0

**Project:** BizPilot AI
**Document Type:** Production data-safety decision matrix
**Status:** Active Phase 24 gate; synthetic demos allowed, real customer data blocked
**Owner:** MoOoH
**Last Updated:** 2026-05-25
**Related:**

- `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`
- `docs/operations/BIZPILOT_BACKUP_AND_EXPORT_STRATEGY_v1.0.md`
- `docs/readiness/PHASE_21A_PRODUCTION_TARGET_AND_BACKUP_GATE.md`
- `docs/readiness/PHASE_21M_CONSOLIDATED_STATUS_AND_SERVICE_CAPABILITIES.md`

---

## 1. Current Decision

BizPilot can continue founder-controlled synthetic demos on the current
production stack, but it cannot accept real customer data or a paid pilot until
OpenAI operating posture and final owner approval are recorded.

Owner decision: strict restored app/dashboard/RLS smoke is not required for the
first limited pilot. DB-level restore proof is sufficient for the current
limited pilot gate, provided the hard safety guardrails below remain in force.
Strict restored app/dashboard/RLS smoke is deferred to P1 before paid pilot,
before production migrations, or before destructive/bulk data work.

Current production posture:

| Area | Status |
| --- | --- |
| App URL | `https://bizpilo.com` |
| Supabase project | `bizpilot-production` / `qfqendrqimqvkoojpjao` |
| Data scope allowed now | Synthetic founder demos only |
| Scheduled backup/PITR posture | Not enough for real customer data |
| Manual export | Completed for Phase 24C.0 DB-level proof |
| Restore drill | DB-level restore completed; strict app/RLS restore smoke not passed |
| Production SQL requiring data safety | Blocked unless separately approved with exact query/migration and backup posture |

## 2. Official Supabase References

Use current Supabase docs as the operational source for provider behavior:

- Database backups: `https://supabase.com/docs/guides/platform/backups`
- Logical backups with physical backups/PITR: `https://supabase.com/docs/guides/troubleshooting/download-logical-backups`

Operational notes from those docs, summarized for BizPilot:

- Supabase projects have managed backups by plan, but Free-tier real-data
  posture still needs regular owner-controlled exports and off-site storage.
- PITR is an add-on for paid plans and requires at least a Small compute add-on.
- PITR gives finer recovery granularity than daily backups, but can create cost.
- Daily/PITR database backups do not restore deleted Storage API objects; future
  storage usage needs a separate storage export plan.
- Logical backups can be created with Supabase CLI `db dump` or `pg_dump`.

## 3. Decision Matrix

| Situation | Allowed now | Required before action |
| --- | --- | --- |
| Public route smoke, homepage demo, trust pages | Yes | No real data, no secrets, no production SQL |
| Synthetic signup/quote smoke | Yes, with safe inbox and fake payload | Disposable account, no real customer content, sanitized evidence only |
| Production `0020` for fake/test auth deletion | Not until safety is recorded | Exact migration approval plus backup/export posture or explicit risk acceptance for synthetic-only cleanup |
| Real customer quote submissions | No | OpenAI operating posture accepted, SMTP posture stable, production smokes pass, and final owner approval recorded |
| Paid pilot | No | Same as real customer data plus payment process evidence |
| Destructive cleanup/purge | No | Separate exact owner approval, verified backup/export, and scoped synthetic target |

## 4. Recommended Path Before Real Customer Data

Phase 24C selected path:

```text
Manual Supabase CLI logical export + restore drill to a disposable local Docker
Postgres database for Phase 24C.0 DB-level proof.
```

This path is selected because it proves BizPilot can create an owner-controlled
logical export and restore it outside production without relying only on
provider-managed backups. It does not require production SQL, migrations,
deletes, purges, or data mutation.

Current Phase 24C status:

1. Owner provided secrets only through local shell/session variables or an
   approved password manager, never in docs:
   - `[PROD_DB_URL]`
   - `[RESTORE_DB_URL]`
   - `[BACKUP_DIR]`
2. Operator ran Supabase CLI logical dumps to produce:
   - `roles.sql`
   - `schema.sql`
   - `data.sql`
3. Operator verified files existed and were excluded from git without printing
   contents.
4. Operator restored into a disposable local Docker Postgres database.
5. Operator verified `MrTester` business and approved synthetic lead by DB
   count.
6. Operator verified DB-level RLS metadata on core restored tables.
7. Existing RLS suite against restored DB failed; app/dashboard restore smoke
   was not run.
8. Operator recorded sanitized evidence in
   `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`.

Real external customer data remains blocked until OpenAI operating posture and
final owner approval are recorded.

Alternative production-ready path:

1. Upgrade Supabase enough to support the chosen backup posture.
2. Enable PITR if owner accepts the recurring cost and operational need.
3. Choose encrypted off-repo export storage and named access list.
4. Run a schema-only export and verify the file exists without printing it.
5. Run a public-schema data export only if owner approves data export storage.
6. Restore into a disposable non-production target.
7. Run `pnpm test:unit`, `pnpm typecheck`, and local RLS tests against the
   restore target when safe.
8. Record the restore drill result in `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`.

Lower-cost pre-pilot alternative:

1. Keep Supabase Free for synthetic demos only.
2. Do not collect real customer data.
3. Use the completed Phase 24C.0 Supabase CLI logical export and local Docker
   DB-level restore proof as the current low-cost evidence.
4. Perform restored app/dashboard/RLS smoke before paid pilot, before
   production migrations, or before destructive/bulk data work.

The lower-cost path has exercised export and DB-level restore, but it does not
claim strict app/RLS restore proof.

Hard guardrails while using the lower-cost path:

- no production migrations,
- no destructive cleanup,
- no hard purge,
- no workspace repair,
- no bulk data mutation,
- no automation,
- no AI auto-send,
- manual owner review only.

## 5. Export Storage Rules

Exports must never be committed to git.

Allowed storage:

- encrypted local drive controlled by the owner,
- encrypted cloud storage controlled by the owner,
- a private password-manager attachment only if file size and access controls are appropriate.

Not allowed:

- repository folders,
- GitHub issues/PRs,
- chat attachments,
- unencrypted shared drives,
- public links,
- screenshots or logs containing customer content.

## 6. Restore Drill Definition Of Done

A restore drill is complete only when all are true:

- source export created outside the repo,
- restore target is disposable and non-production,
- migrations and backup restore steps are documented,
- app can boot against the restored target,
- RLS tests are run against a local/non-production database only,
- no secrets or real customer rows are printed,
- pass/fail result and date are recorded in the runbook.

Phase 24C.0 satisfies the DB-level subset of this definition. Phase 24C.1 does
not satisfy strict restored app/RLS acceptance yet.

## 7. Phase 21P Decision

```text
Continue no-cost repo-backed hardening and synthetic smokes.
Do not start real customer data or paid pilot.
Do not apply production data-affecting SQL until backup/export/restore posture
is closed or the owner explicitly accepts the exact synthetic-only risk.
```
