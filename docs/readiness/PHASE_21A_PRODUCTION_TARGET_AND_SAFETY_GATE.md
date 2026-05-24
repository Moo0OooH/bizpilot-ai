# Phase 21A Production Target And Safety Gate

**Project:** BizPilot AI
**Document Type:** Production target and data-safety gate
**Status:** Blocked - target identified, production SQL not approved
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Purpose

Phase 21A records the corrected production Supabase target evidence before any production migration, SQL, quote smoke, or pilot approval.

No production SQL was applied. No migration was applied. No secret, token, key, full connection string, customer payload, prompt, dump, or env file content was printed or committed.

## 2. Production Target Evidence

| Item | Result |
| --- | --- |
| Production app URL | `https://bizpilo.com` |
| Supabase project URL provided by owner | `https://qfqendrqimqvkoojpjao.supabase.co` |
| Supabase project ref | `qfqendrqimqvkoojpjao` |
| Supabase project name shown in dashboard | `bizpilot-production` |
| Supabase branch shown in dashboard | `main` / `PRODUCTION` |
| Organization shown in dashboard | `MoOoH BizPilot` |
| Plan/compute shown in dashboard | Free project, Nano compute |
| Dashboard status | Healthy |
| Dashboard last migration | No migrations |
| Dashboard last backup | No backups |

Evidence source:

- owner-provided Supabase dashboard URL,
- owner-provided screenshot showing project `bizpilot-production` and ref `qfqendrqimqvkoojpjao`,
- secure local Vercel env template inspection without printing secret values.

## 3. Environment Reconciliation

| Environment / file | Supabase ref observed | Notes |
| --- | --- | --- |
| Secure Vercel env template outside repo | `qfqendrqimqvkoojpjao` | Matches owner-provided Supabase dashboard evidence. |
| Local `.env.local` | `cwiuajpbpyybxxtodpaq` | Does not match the corrected production target. Treat local env as stale or non-production until intentionally updated. |
| Vercel production dashboard | Owner action required | Must confirm the actual deployed `NEXT_PUBLIC_SUPABASE_URL` without exposing keys. |

The corrected target is now believed to be `qfqendrqimqvkoojpjao`, but the production app-to-project link is not fully closed until Vercel production env is checked in the Vercel dashboard.

## 4. Backup / PITR Gate

| Safety item | Status | Notes |
| --- | --- | --- |
| PITR enabled | Not confirmed | Free plan usually requires special care; exact PITR availability must be confirmed in Supabase dashboard. |
| Backup retention | Not confirmed | Dashboard screenshot shows `No backups`. |
| Manual schema export | Not done | No owner-approved production DB connection/export path has been provided. |
| Data export | Not done | Not approved and not needed before schema-only safety is settled. |
| Restore drill | Not done | No dump and no restore target. |
| Production SQL approval | Not approved | Must remain blocked while backups/PITR/export are unresolved. |

## 5. Production Migration Status

The dashboard shows `Last migration: No migrations`.

That strongly suggests the project may not have the repo migration history applied through Supabase migrations. Do not infer that ad-hoc schema patching is safe.

Required approach:

1. Confirm Vercel production uses `qfqendrqimqvkoojpjao`.
2. Confirm PITR/backup/export posture or record explicit owner risk acceptance.
3. Run the actual production migration history query through Supabase SQL editor or an approved direct SQL tool.
4. Apply existing repo migrations in order only after approval.
5. Do not create guessed columns such as `leads.source`; current repo schema uses `leads.source_channel`.
6. Verify columns, functions, RLS, grants, and PostgREST schema cache after migration.

## 6. Current Dirty Working Tree Note

At the start of Phase 21, the repo working tree was not clean. It contains an uncommitted workspace lifecycle/deletion foundation, including migration `0018_business_lifecycle_deletion_foundation.sql`.

That work was not applied to production and is not approved for production SQL. It must be reviewed and validated separately before it becomes part of any ordered production migration plan.

## 7. Phase 21A Decision

Production target evidence is improved, but production migration remains blocked.

BizPilot remains:

```text
Ready only for founder-controlled synthetic demos.
```

It has not yet moved to:

```text
Ready for first real pilot customer.
```

## 8. Owner Actions Required

1. Confirm Vercel production `NEXT_PUBLIC_SUPABASE_URL` points to `qfqendrqimqvkoojpjao`.
2. Confirm whether the project contains any real customer/prospect/owner data.
3. Confirm PITR status and backup retention for `bizpilot-production`.
4. Create a schema-only export or explicitly approve proceeding without one.
5. Provide an approved direct SQL path for read-only migration-history verification.
6. Approve the exact migration list and stop/rollback criteria before any production SQL.
