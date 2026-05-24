# Phase 21A Production Target And Backup Gate

**Project:** BizPilot AI
**Document Type:** Production target, backup, and SQL approval gate
**Status:** Owner-approved for database/security alignment with no-real-customer-data risk acceptance
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Purpose

This gate confirms the production Supabase target and minimum backup/data-safety posture before any production migration, SQL, PostgREST cache reload, public quote smoke, or real pilot approval.

No production SQL was run. No migration was applied. No dump was created. No customer rows, secrets, database passwords, service role keys, anon keys, OpenAI keys, tokens, or full connection strings were printed or recorded.

## 2. Production Target

| Item | Current result |
| --- | --- |
| Production app URL | `https://bizpilo.com` |
| Supabase project ref | `qfqendrqimqvkoojpjao` |
| Supabase project URL | `https://qfqendrqimqvkoojpjao.supabase.co` |
| Supabase project name | `bizpilot-production` |
| Supabase branch/environment shown by owner screenshot | `main` / `PRODUCTION` |
| Supabase dashboard status shown by owner screenshot | Healthy |
| Supabase plan/compute shown by owner screenshot | Free project / Nano compute |
| Owner-confirmed Supabase plan | Free |
| Vercel plan | Free / not upgraded |
| Dashboard last migration shown by owner screenshot | No migrations |
| Dashboard last backup shown by owner screenshot | No backups |

Evidence sources:

- owner-provided Supabase project URL,
- owner-provided Supabase dashboard screenshot,
- secure local Vercel env template outside the repo, inspected without printing secret values.

## 3. Environment Reconciliation

| Source | Observed non-secret value | Interpretation |
| --- | --- | --- |
| Secure Vercel env template outside repo | `NEXT_PUBLIC_SUPABASE_URL` host is `qfqendrqimqvkoojpjao.supabase.co` | Matches owner-provided production Supabase dashboard. |
| Secure Vercel env template outside repo | `NEXT_PUBLIC_APP_URL` host is `bizpilo.com` | Matches production app URL. |
| Local `.env.local` | `NEXT_PUBLIC_SUPABASE_URL` host is `cwiuajpbpyybxxtodpaq.supabase.co` | Does not match corrected production target; treat local env as stale or non-production until intentionally updated. |
| Vercel dashboard production env | Not directly inspected in this run | Owner must confirm Vercel production env points to `qfqendrqimqvkoojpjao` before production SQL. |

## 4. Production Data Status

| Question | Status |
| --- | --- |
| Real customer data present? | Owner states there are no serious/real pilot users yet |
| Synthetic/test/development data only? | Owner states the project is still at the beginning and current data can be treated as disposable for security/alignment work |
| Customer rows inspected? | No |
| Data classification for corrected target | Owner-stated no real customer data; not independently row-inspected |
| Owner pilot decision | No real pilot yet; finish database/security phases first |

The corrected target was initially treated as possible production data until owner clarification. Owner now states there are no serious/real pilot users yet and that current project data can be risk-accepted for fast database/security alignment.

Owner note recorded on 2026-05-24: the project is still early and the owner accepts that current non-pilot/synthetic setup data may be disposable. This does **not** approve a real customer pilot and does **not** approve production SQL.

Owner update recorded later on 2026-05-24:

```text
There are no serious/real users yet.
The project is at the beginning.
Changes are allowed so the database/security phases can be finished quickly and accurately.
Owner accepts no real pilot yet.
```

## 5. Production SQL Approval

| Item | Status |
| --- | --- |
| Production SQL approver | Owner: MoOoH |
| SQL operator approval required | Yes, whoever applies SQL/migrations must explicitly approve the exact action and stop criteria. |
| Owner approval recorded for production database/security alignment | Yes, limited to current no-real-customer-data stage |
| Owner approval recorded for read-only SQL verification | Yes |
| Production migration may proceed | Conditionally yes, for repo-backed database/security alignment only; no destructive purge and no guessed/ad-hoc columns |

Approval must explicitly cover:

1. exact production Supabase project ref/name,
2. data classification,
3. backup/PITR/export posture or accepted risk,
4. exact migration list,
5. stop/rollback criteria,
6. post-migration verification queries.

## 6. PITR And Backup Status

| Safety item | Status | Evidence / blocker |
| --- | --- | --- |
| Supabase plan | Free | Owner confirmed current Supabase plan is Free. |
| Scheduled backups | Not available on current plan | Owner confirmed scheduled backups are not available on the current plan. |
| PITR enabled | Not enabled / unavailable | Owner confirmed PITR is not enabled or unavailable on the current plan. |
| Backup retention | None confirmed | Free plan does not provide the needed scheduled backup/PITR posture. |
| Last backup | No backups shown | Owner screenshot evidence. |
| Schema-only export | Not done yet | `pg_dump`, `psql`, and Supabase CLI are not available on PATH; owner has not performed manual export yet. |
| Data export | Not approved | No data export should run until storage/access and data-scope approval are recorded. |
| Restore drill | Not done | No schema dump, no data dump, and no approved local/staging restore target. |
| Export storage location | Not approved | Must be encrypted and outside git. |

## 7. Tooling Check

| Tool | Status |
| --- | --- |
| `supabase` CLI | Not available on PATH |
| `pg_dump` | Not available on PATH |
| `psql` | Not available on PATH |

Because no approved export tool/path is available, this environment cannot create a production schema dump or run a restore drill.

## 8. Migration Gate Decision

**Production database/security alignment may proceed only under the owner risk-accepted early-project condition.**

Allowed now:

- read-only SQL verification,
- drift mapping,
- applying existing repo-backed database/security migrations in order where not already applied,
- verifying columns, functions, grants, constraints, RLS policies, and PostgREST schema cache,
- documenting manual drift where objects exist but migration history is missing.

Still not allowed:

- destructive production purge/anonymization,
- ad-hoc `ALTER TABLE` patches,
- adding `leads.source`,
- committing secrets, env files, dumps, or customer data,
- treating the app as ready for real pilot customer data.

Risk accepted by owner for this early stage:

- Supabase is on the Free plan,
- scheduled backups are unavailable,
- PITR is not enabled/unavailable,
- manual export is not done yet,
- restore drill has not been done,
- current data is not real customer pilot data according to owner.

## 9. Manual Owner Action List

Before any production SQL:

1. Confirm in Vercel dashboard that production `NEXT_PUBLIC_SUPABASE_URL` points to `qfqendrqimqvkoojpjao`.
2. Confirm whether `bizpilot-production` contains real customer, prospect, owner, or only synthetic/test data.
3. Confirm whether the owner wants to stay on Free for synthetic-only demos or upgrade before real pilot data.
4. Decide whether to do a manual schema/data export before any SQL change, even while staying on Free.
5. Provide or approve a schema-only export path outside git.
6. Provide an approved restore target or explicitly risk-accept no restore drill.
7. Approve the exact repo migrations to apply in order. Owner has now approved database/security alignment in principle, but each already-manual migration such as `0018` must be verified before replay.
8. Run production migration-history read-only verification through Supabase SQL editor or approved direct SQL.
9. Apply repo migrations only after the above gates are recorded.
10. Verify columns, functions/RPCs, grants, RLS policies, and PostgREST schema cache after migration.

Current owner decision recorded on 2026-05-24:

```text
I do not approve production SQL yet.
Read-only SQL verification is allowed.
No real customer pilot until backup/export decision is clear.
```

Updated owner decision recorded later on 2026-05-24:

```text
No real users yet.
Changes are allowed to finish database/security phases quickly and accurately.
Production SQL is approved only for repo-backed database/security alignment and verification.
No ad-hoc columns.
Do not add leads.source.
Do not re-apply 0018 blindly; verify it because owner reported manual apply OK.
No real customer pilot until backup/export decision is clear.
```

## 10. Final Status

BizPilot remains:

```text
Ready only for founder-controlled synthetic demos.
```

It is not yet:

```text
Ready for first real pilot customer with real customer data.
```
