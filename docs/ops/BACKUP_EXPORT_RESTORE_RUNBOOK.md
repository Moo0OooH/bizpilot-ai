# BizPilot Backup, Export, and Restore Runbook

**Phase:** 20B - Production DB Safety Gate
**Status:** Not yet pilot-complete  
**Owner:** MoOoH  
**Last updated:** 2026-05-25
**Scope:** Minimum data safety process before real cleaning-business pilot data

## 1. Current Environment

| Item | Current record |
| --- | --- |
| Product scope | Cleaning-first Quote Recovery Command Center |
| Production app domain | `https://bizpilo.com` |
| Production Supabase project | `bizpilot-production` / `qfqendrqimqvkoojpjao` |
| Public Supabase host from local env | Historical local env value was not authoritative for Phase 21 production; use `qfqendrqimqvkoojpjao.supabase.co` as the recorded production target |
| Local database URL from local env | Present, host `127.0.0.1`, database `postgres` |
| Production plan / PITR status | Supabase Free/no PITR posture recorded in Phase 21; not acceptable for real customer data |

Do not infer the production Supabase plan from code, domain, or public URL. The plan tier and PITR retention window must be read from the Supabase dashboard or Supabase organization billing/settings by the owner.

## 1A. Phase 21P No-Real-Data Decision

The current accepted posture is:

```text
Synthetic founder demos are allowed.
Real customer data and paid pilot execution are blocked until backup/export/restore
is upgraded or drilled and recorded.
```

Current official-reference basis:

- Supabase database backups: `https://supabase.com/docs/guides/platform/backups`
- Supabase logical backup download guidance: `https://supabase.com/docs/guides/troubleshooting/download-logical-backups`

The active decision matrix is now:

- `docs/operations/BIZPILOT_BACKUP_EXPORT_RESTORE_DECISION_MATRIX_v1.0.md`

Do not store exports in the repo. Do not print dump contents. Do not run a
production data export until encrypted storage and access are recorded.

## 2. Phase 19B Verification Result

The repo/CLI check on 2026-05-23 found:

- `.env.local` includes `NEXT_PUBLIC_SUPABASE_URL` and `DATABASE_URL` keys.
- `DATABASE_URL` points to local host `127.0.0.1`, not a managed Supabase host.
- Local database connection was blocked with `ECONNREFUSED`.
- `supabase` CLI is not on PATH.
- `pg_dump` is not on PATH.
- `psql` is not on PATH.
- No schema-only dump was created.
- No data dump was created.
- No customer data was printed.
- `.gitignore` now ignores BizPilot backup/export dump patterns and temporary backup/restore folders without ignoring migration SQL files.

Result: restore drill and manual dump are blocked until local Postgres tooling and a safe target database are available.

## 2A. Phase 20B Production DB Safety Update

The Phase 20B safety check on 2026-05-24 did not apply SQL and did not create a dump.

| Safety item | Status | Evidence / blocker |
| --- | --- | --- |
| PITR enabled | Not enabled / not available on current posture | Phase 21 docs record Supabase Free/no PITR as acceptable only for synthetic demos. |
| Backup retention window | Owner action required before real data | Exact dashboard value still must be recorded before pilot data. |
| Production target | Confirmed in Phase 21 | `bizpilot-production` / `qfqendrqimqvkoojpjao`; do not use historical local env host as production truth. |
| Data classification | Unknown / possible real data | Phase 20A count/classification-only check found non-synthetic indicators; the checked DB must not be treated as disposable. |
| Manual schema-only export | Blocked | `pg_dump` not installed, `psql` not installed, Supabase CLI not installed, no production DB connection string available, and local DB port `127.0.0.1:54322` refused connection. |
| Manual data export | Blocked | Not owner-approved and not safe until export storage/access are recorded. |
| Restore drill | Blocked | No schema dump, no data dump, no local/staging restore target, local DB refused connection. |
| Export storage location | Open | No encrypted owner-approved storage location recorded yet. |
| `.gitignore` dump protection | Pass | `git check-ignore -v` confirmed common BizPilot schema/data dump, export, backup, `backups/`, `tmp-backups/`, and `restore-drills/` sample paths are ignored. |
| Production migration safety | Not approved | Do not apply migrations until PITR/backup/export posture and owner approval are recorded. |

Phase 20B rule:

```text
If production contains real or possible-real data and no backup/PITR/export safety exists, do not apply production migrations.
```

## 3. Required Owner Decisions Before Real Pilot Data

| Decision | Required value | Status |
| --- | --- | --- |
| Supabase plan tier | Exact production plan | Open |
| PITR support | Supported or not supported | Open |
| PITR retention window | Exact window if available | Open |
| Export storage location | Encrypted location outside git | Open |
| Export access list | Named people only | Open |
| Restore target | Local, staging, or disposable Supabase project | Open |
| First restore drill date | Calendar date before pilot data or explicit risk acceptance | Open |
| Privacy incident owner | Named owner | Open |

Until these are recorded, backup/export/restore readiness is not complete for real customer data.

## 4. Export Cadence During Pilot

Minimum pilot cadence:

- Run a schema-only backup before every production migration.
- Run a schema-only backup weekly during the first pilot month.
- Run a full public-schema data export before collecting the first real customer/pilot lead if permitted by the owner and applicable privacy obligations.
- Run a data export before destructive database work.
- Run a data export before changing RLS, grants, auth redirect behavior, or public quote submission logic.

If a full data export is not permitted, record the reason in this runbook and keep the pilot blocked or risk-accepted by the owner.

## 5. Export Storage and Access

Exports must be stored outside the repo.

Recommended storage:

- Encrypted local disk or encrypted cloud storage controlled by the owner.
- Folder name example outside repo: `BizPilot Secure Backups/production/YYYY-MM-DD/`.
- File names may use `bizpilot-production-schema-YYYYMMDD.sql` or `bizpilot-production-public-data-YYYYMMDD.sql`.

Access rules:

- Owner access only by default.
- No contractor, AI tool, support helper, or developer gets exports unless the owner explicitly approves.
- Never upload exports to chat, issue trackers, pull requests, logs, or unencrypted shared drives.
- Never commit dumps, exports, incident notes with personal data, `.env` files, connection strings, service-role keys, or screenshots containing customer data.

## 6. Git Safety Rules

The repo must not track backup or export outputs.

Ignored patterns include:

- `bizpilot-*.sql`
- `bizpilot-*.dump`
- `bizpilot-*.backup`
- `bizpilot-*.csv`
- `bizpilot-*.json`
- `*-export.sql`
- `*-export.csv`
- `*-export.json`
- `*-backup.sql`
- `*-backup.dump`
- `*-backup.backup`
- `backups/`
- `tmp-backups/`
- `restore-drills/`
- `artifacts/`

Do not add a broad `*.sql` ignore rule because migration files in `supabase/migrations/` must stay trackable.

Before every commit after an export session, run:

```bash
git status --short
git ls-files --others --exclude-standard
```

The output must not include dumps, customer exports, credentials, or privacy incident files containing personal data.

## 7. Schema-Only Backup Procedure

Prerequisites:

- Install `pg_dump` and `psql` compatible with the Supabase Postgres major version.
- Use a read-only database connection where possible.
- Store the connection string in a password manager or local env only.
- Do not paste the connection string into docs, tickets, chat, or shell history.
- Write the output outside the repo or into an ignored temp folder.

Example:

```bash
mkdir -p ../bizpilot-secure-backups/production/$(date +%Y-%m-%d)

pg_dump "$DATABASE_URL" \
  --schema=public \
  --schema-only \
  --no-owner \
  --no-privileges \
  --file="../bizpilot-secure-backups/production/$(date +%Y-%m-%d)/bizpilot-production-schema-$(date +%Y%m%d).sql"
```

Verification:

```bash
test -s "../bizpilot-secure-backups/production/$(date +%Y-%m-%d)/bizpilot-production-schema-$(date +%Y%m%d).sql"
```

Do not open the file in tooling that might sync it to an unsafe location.

## 8. Data Backup Procedure If Permitted

Only run this if the owner has approved data export storage and access.

Use `public` schema only. Supabase Auth tables are provider-managed and are not included in this public-schema dump.

Example:

```bash
mkdir -p ../bizpilot-secure-backups/production/$(date +%Y-%m-%d)

pg_dump "$DATABASE_URL" \
  --schema=public \
  --data-only \
  --no-owner \
  --no-privileges \
  --file="../bizpilot-secure-backups/production/$(date +%Y-%m-%d)/bizpilot-production-public-data-$(date +%Y%m%d).sql"
```

Minimum verification without printing customer data:

```bash
test -s "../bizpilot-secure-backups/production/$(date +%Y-%m-%d)/bizpilot-production-public-data-$(date +%Y%m%d).sql"
wc -c "../bizpilot-secure-backups/production/$(date +%Y-%m-%d)/bizpilot-production-public-data-$(date +%Y%m%d).sql"
```

Do not run `cat`, `type`, `Select-String`, or ad hoc grep over data dumps in shared logs.

## 9. Restore Drill Procedure

Preferred restore target:

1. Disposable local Postgres or local Supabase instance.
2. Disposable staging Supabase project if local restore is not available.
3. Never restore into production for a drill.

Steps:

1. Create a fresh empty database.
2. Apply migrations from `supabase/migrations/` in order.
3. Apply the schema-only backup if testing backup compatibility.
4. Apply the public-schema data backup only if owner-approved.
5. Create or invite test auth users manually for drill verification. Do not export or import `auth.users` casually.
6. Point local app env to the restored target.
7. Run `pnpm typecheck`.
8. Run `pnpm test:unit`.
9. Run `pnpm test:rls` only if `DATABASE_URL` points to an allowed local host.
10. Start the app locally and verify dashboard/public quote routes can load against the restored target.
11. Verify a test lead can be read from the restored target without printing real customer content in logs.
12. Record the drill result in this document or a future `docs/ops/RESTORE_DRILL_LOG.md`.

Current result:

- Restore drill not performed.
- Blocker: no local database connection, `pg_dump` missing, `psql` missing, and no approved staging restore target.
- Owner action: install tooling or provide a staging/local restore target and approve whether data export is permitted.

## 10. Restored Data Verification

Use counts and IDs only; do not print customer messages, phone numbers, emails, addresses, or AI draft text.

Minimum checks:

```sql
select count(*) from public.businesses;
select count(*) from public.intake_forms;
select count(*) from public.intake_submissions;
select count(*) from public.leads;
select count(*) from public.lead_events;
```

For a test lead read check:

- Prefer a synthetic test business and synthetic test lead.
- Confirm the app can read the lead detail page.
- Confirm RLS does not expose another business's lead.
- Record only synthetic IDs and pass/fail state.

## 11. Customer Deletion Request

Deletion/minimization is manual during pilot.

Procedure:

1. Verify requester identity and authority.
2. Identify the business and customer record scope.
3. Pause before action and create a schema-only backup if needed.
4. Locate affected rows by business and customer contact fields.
5. Minimize or delete customer-submitted values first.
6. Remove or minimize derived lead intelligence and AI artifacts tied to the request.
7. Preserve only operational audit records that are legally or operationally required, with customer content removed where possible.
8. Record date, owner, request scope, action taken, and verification result in a private incident/request log outside git.

Likely affected public tables:

- `public.intake_submission_values`
- `public.intake_submissions`
- `public.leads`
- `public.lead_source_metadata`
- `public.lead_quality_scores`
- `public.lead_action_items`
- `public.lead_events`
- `public.ai_outputs`
- `public.usage_events`

Do not delete a Supabase Auth user for a customer lead. Auth users are owner/admin accounts, not public quote requesters.

## 12. Customer Export Request

Data export is manual during pilot.

Procedure:

1. Verify requester identity and authority.
2. Identify business and customer scope.
3. Export only the requester's data, not full tenant data.
4. Prefer JSON or CSV generated from a read-only SQL query.
5. Review the export before delivery to remove other customers' data.
6. Deliver through an owner-approved secure channel.
7. Record date, owner, requester, scope, and delivery method in a private request log outside git.

Do not store customer export files inside the repo.

## 13. Privacy Incident Handling

Examples:

- Export file placed in the repo or unencrypted shared storage.
- Customer data pasted into chat, support notes, logs, GitHub, or email.
- Wrong tenant/customer data included in an export.
- Production credentials exposed.
- Unauthorized dashboard or Supabase access.

Immediate response:

1. Stop the activity.
2. Preserve minimal facts without copying sensitive content.
3. Remove public exposure if any.
4. Rotate exposed credentials if secrets were involved.
5. Identify affected business/customer scope.
6. Notify the owner immediately.
7. Record incident privately outside git.
8. Decide whether customer notification is required.
9. Record corrective action and prevention step.

Private incident register fields:

- Incident ID
- Date/time discovered
- Reporter
- Owner
- Affected business/customer scope
- Data categories involved
- Exposure location
- Containment action
- Credential rotation required
- Customer notification decision
- Final resolution date

Do not commit the incident register if it contains personal data.

## 14. Production PITR Owner Action

Owner must open Supabase and record:

1. Project name.
2. Project ref.
3. Plan tier.
4. Whether PITR is enabled.
5. PITR retention window.
6. Whether backups can be restored into a new project.
7. Security Advisor status.
8. Performance Advisor status.
9. Date checked.

Until this is recorded, PITR status is `Unknown` and Phase 19B remains not pilot-complete.

## 15. Phase 19B Done Criteria

Phase 19B is complete only when:

- Supabase plan tier is recorded.
- PITR support and retention window are recorded or explicitly unavailable.
- Export storage location is chosen and encrypted.
- Access list is named.
- `pg_dump` and `psql` are installed or an equivalent safe export method is approved.
- A schema-only backup has been created and verified without committing it.
- A restore drill has been performed to local or staging, or owner explicitly accepts the risk before pilot.
- Customer deletion/export request handling is documented.
- Privacy incident process is documented.
- Pilot readiness checklist reflects the current status.
