# BizPilot Backup, Export, and Restore Decision Matrix v1.0

**Project:** BizPilot AI
**Document Type:** Production data-safety decision matrix
**Status:** Active Phase 21P gate; synthetic demos allowed, real customer data blocked
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
backup/export/restore is upgraded and verified.

Current production posture:

| Area | Status |
| --- | --- |
| App URL | `https://bizpilo.com` |
| Supabase project | `bizpilot-production` / `qfqendrqimqvkoojpjao` |
| Data scope allowed now | Synthetic founder demos only |
| Scheduled backup/PITR posture | Not enough for real customer data |
| Manual export | Not completed |
| Restore drill | Not completed |
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
| Real customer quote submissions | No | Backup/export/restore gate closed, SMTP posture stable, production smokes pass, OpenAI validation complete if AI is shown |
| Paid pilot | No | Same as real customer data plus payment process evidence |
| Destructive cleanup/purge | No | Separate exact owner approval, verified backup/export, and scoped synthetic target |

## 4. Recommended Path Before Real Customer Data

Phase 24C selected path:

```text
Manual Supabase CLI logical export + restore drill to a disposable
non-production Supabase project.
```

This path is selected because it proves BizPilot can create an owner-controlled
logical export and restore it outside production without relying only on
provider-managed backups. It does not require production SQL, migrations,
deletes, purges, or data mutation.

Current Phase 24C checklist:

1. Owner creates or confirms a disposable non-production Supabase restore
   project.
2. Owner provides secrets only through local shell/session variables or an
   approved password manager, never in docs:
   - `[PROD_DB_URL]`
   - `[RESTORE_DB_URL]`
   - `[BACKUP_DIR]`
3. Operator runs Supabase CLI logical dumps to produce:
   - `roles.sql`
   - `schema.sql`
   - `data.sql`
4. Operator verifies files exist and are excluded from git without printing
   contents.
5. Operator restores into the disposable non-production Supabase project.
6. Operator runs app/RLS/dashboard/lead-visibility smoke against the restored
   target only.
7. Operator records sanitized evidence in
   `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`.

Real external customer data remains blocked until the restore drill is
completed and documented.

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
3. Use `supabase db dump` or `pg_dump` to create manual logical exports once
   tooling and safe storage are ready.
4. Perform one restore drill before any real customer enters the system.

The lower-cost path does not close the real-data gate until export and restore
are actually exercised.

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

## 7. Phase 21P Decision

```text
Continue no-cost repo-backed hardening and synthetic smokes.
Do not start real customer data or paid pilot.
Do not apply production data-affecting SQL until backup/export/restore posture
is closed or the owner explicitly accepts the exact synthetic-only risk.
```
