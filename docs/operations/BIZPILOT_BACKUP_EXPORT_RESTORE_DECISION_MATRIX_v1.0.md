# BizPilot Backup, Export, and Restore Decision Matrix v1.0

**Project:** BizPilot AI
**Document Type:** Production data-safety decision matrix
**Status:** Active real-data gate; synthetic demos allowed, real customer data blocked
**Owner:** MoOoH
**Last Updated:** 2026-07-17
**Related:**

- `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`
- `docs/operations/BIZPILOT_BACKUP_AND_EXPORT_STRATEGY_v1.0.md`
- `docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md`
- `docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md`

---

## 1. Current Decision

BizPilot can continue public read-only Production demonstrations and
write-capable synthetic QA on an explicitly approved disposable target. It
cannot accept real customer data or start a paid pilot until the strict restored
app/dashboard/intake/RLS and tenant-isolation proof, the other real-data gates,
and final owner approval are recorded.

Phase 24C.0 is historical partial evidence: it proved a logical export and a
DB-level disposable restore at that time. The restore procedure now exists, but
Phase 24C.1 did not pass because app/dashboard smoke was not run and the restored
RLS suite failed. DB-level proof alone cannot close the real-customer-data gate.

Current production posture:

| Area | Status |
| --- | --- |
| App URL | `https://bizpilo.com` |
| Supabase project | `bizpilot-production` / `qfqendrqimqvkoojpjao` |
| Data scope allowed now | Read-only Production demos; synthetic writes only on an approved disposable target |
| Scheduled backup/PITR posture | Not enough for real customer data |
| Manual export | Historical Phase 24C.0 proof; current backup freshness not established |
| Restore drill | Historical DB-level restore completed; strict app/dashboard/intake/RLS/isolation exercise not passed |
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
| Public route smoke, homepage demo, trust pages | Yes, GET/read-only in Production | No real data, no secrets, no production SQL or record/configuration mutation |
| Synthetic signup/quote smoke | No in Production; yes on approved disposable target | Proven non-Production target, disposable account, no real customer content, sanitized evidence only |
| Production `0020` for fake/test auth deletion | Not until safety is recorded | Exact migration approval, current protected export, strict restored-target proof, rollback, and target confirmation; no QA-based bypass |
| Real customer quote submissions | No | Current protected export plus strict restored app/dashboard/intake/RLS/isolation proof, Auth/SMTP/OpenAI/privacy gates, read-only Production acceptance, and final owner approval |
| Paid pilot | No | Same as real customer data plus payment, commercial, support, rollback, and offboarding evidence |
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

Historical Phase 24C status (partial evidence only):

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

Real external customer data remains blocked until a current export is restored
and the strict app/dashboard/intake/RLS/isolation exercise passes, in addition
to the remaining Auth, OpenAI, privacy/operations, and owner-approval gates.

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
3. Keep Phase 24C.0 only as historical evidence that the logical procedure was
   exercised at DB level; do not treat its export as a current recovery point.
4. Perform and pass the strict restored app/dashboard/intake/RLS/isolation
   exercise before any real customer data, and repeat it before production
   migrations or destructive/bulk data work when the evidence is no longer current.

The lower-cost path has historical export and DB-level restore evidence, but it
does not claim strict app/dashboard/intake/RLS/isolation proof and therefore
does not permit real customer data.

Hard guardrails while using the lower-cost path:

- no production migrations,
- no destructive cleanup,
- no hard purge,
- no workspace repair,
- no bulk data mutation,
- no automation,
- no AI auto-send,
- no Production QA writes,
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

Phase 24C.0 satisfies only the historical DB-level subset of this definition.
Phase 24C.1 does not satisfy strict restored app/dashboard/intake/RLS/isolation
acceptance yet, so the real-data gate remains closed.

## 7. Phase 21P Decision

```text
Continue no-cost repo-backed hardening and synthetic smokes.
Do not start real customer data or paid pilot.
Do not apply production data-affecting SQL until backup/export/restore posture
is closed or the owner explicitly accepts the exact synthetic-only risk.
```
