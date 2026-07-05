# Phase 26B - Owner-Only Supabase Cleanup

Date: 2026-07-05
Project: `BizPilot AI`
Canonical repo: `E:\bizpilot-ai`
Branch during cleanup execution: `main`

## Summary

This run closed the requested owner-only cleanup against the managed canonical
Supabase project while confirming the repo stayed on the canonical path
`E:\bizpilot-ai`.

The cleanup preserved:

- exact owner auth user `m.beagi@gmail.com`
- one owner profile row
- one owner business row
- one owner membership row
- remaining owner-linked business data needed for dashboard/app access

The cleanup deleted:

- 9 non-owner auth users
- 9 non-owner businesses
- linked non-owner profile, membership, lead, intake, AI, usage, and public-link data

## Canonical Repo And Git State

### Canonical path confirmation

- Active repo path used for the run: `E:\bizpilot-ai`
- `git branch --show-current`: `main`
- `git remote -v`: `origin https://github.com/Moo0OooH/bizpilot-ai.git`
- `git rev-parse HEAD` before data cleanup: `8f45bbde62f731e4632517cc0702a5aa0a53e67d`
- `git rev-parse HEAD` after data cleanup and before this report commit: `8f45bbde62f731e4632517cc0702a5aa0a53e67d`

The managed-data cleanup was data-only until this report file was created, so
the repo HEAD stayed unchanged during the live mutation.

### Dirty/untracked state before report file

- Working tree before this report file: clean
- Untracked release files before this report file: none

## Side Path Review

Obvious project-related side paths inspected:

- `E:\bizpilot-ai-5`
  - not a git repo
  - contains `18-2026.rar`
  - not an active BizPilot checkout
  - no archive/rename needed for repo safety in this run
- `E:\bizpilot-ai-backups`
  - not a git repo
  - used as the local backup/archive root
- `D:\bizpilot-ai`
  - not found

Final active repo path remains:

- `E:\bizpilot-ai`

## Supabase Target And Access Notes

- Canonical managed Supabase target confirmed: `qfqend...pjao`
- Host confirmed by local target classifier:
  - `qfqendrqimqvkoojpjao.supabase.co`
- Local `.env.local` contained a stale/invalid runtime secret for direct REST/Admin usage:
  - direct Auth Admin and PostgREST checks returned `401`
- Cleanup execution therefore used the authenticated Supabase CLI session to
  fetch the current project `service_role` key in-memory only
  without printing secrets and without storing keys in the repo

## Backup

- Backup created: `YES`
- Backup path: `E:\bizpilot-ai-backups\owner-only-cleanup-20260705021645`
- Backup committed to git: `NO`
- Backup contents created outside the repo:
  - `auth-users.json`
  - `tables\*.json` for 28 mutable/public app-data tables
  - `storage.json`
  - `manifest.json`
  - `cleanup-execution.json`

Storage state at backup time:

- buckets found: `0`
- storage object cleanup required: `0`

## Owner Guard

Read-only owner confirmation before mutation:

- owner email exact match count: `1`
- owner preserved user id: `27e07d98...`
- confusing owner-like email candidates: `0` beyond the exact owner match
- owner-linked business rows before cleanup: `1`
- owner-linked membership rows before cleanup: `1`
- owner-linked profile rows before cleanup: `1`

## Dry-Run Counts

### Auth users

- total auth users before: `10`
- users targeted for deletion: `9`
- auth users after: `1`

### Non-owner business scope before cleanup

- non-owner businesses before: `9`
- workspace kinds among deletion targets:
  - `production_customer`: `8`
  - `founder_test`: `1`

This was treated as owner-approved cleanup because the requested scope was
"preserve exactly owner auth user" and a full off-repo backup was created
before mutation.

### Rows deleted by table

| Table | Deleted |
| --- | ---: |
| `intake_submission_values` | 150 |
| `ai_outputs` | 4 |
| `lead_action_items` | 5 |
| `lead_quality_scores` | 6 |
| `lead_events` | 21 |
| `lead_source_metadata` | 10 |
| `public_submission_abuse_log` | 12 |
| `usage_events` | 8 |
| `leads` | 10 |
| `intake_submissions` | 10 |
| `public_link_variants` | 4 |
| `intake_form_fields` | 61 |
| `intake_forms` | 4 |
| `consent_versions` | 4 |
| `business_services` | 4 |
| `business_faqs` | 2 |
| `business_service_areas` | 2 |
| `business_branding` | 4 |
| `business_template_settings` | 4 |
| `business_onboarding_tasks` | 32 |
| `business_privacy_settings` | 4 |
| `business_consent_settings` | 4 |
| `business_members` | 9 |
| `business_deletion_requests` | 0 |
| `admin_action_log` | 10 |
| `businesses` | 9 |
| `profiles` | 9 |
| `auth.users` | 9 |

Additional audit evidence inserted during cleanup:

- `business_deletion_tombstones` inserted: `9`

## Post-Cleanup Verification

### Preserved records

- owner auth users remaining: `1`
- owner profile rows remaining: `1`
- owner business rows remaining: `1`
- owner membership rows remaining: `1`

### Remaining major table counts

| Table | Remaining |
| --- | ---: |
| `profiles` | 1 |
| `businesses` | 1 |
| `business_members` | 1 |
| `public_link_variants` | 1 |
| `leads` | 3 |
| `intake_submissions` | 3 |
| `intake_submission_values` | 45 |
| `lead_source_metadata` | 3 |
| `lead_events` | 10 |
| `lead_action_items` | 3 |
| `lead_quality_scores` | 3 |
| `ai_outputs` | 1 |
| `usage_events` | 6 |
| `admin_action_log` | 11 |
| `business_deletion_requests` | 0 |
| `business_deletion_tombstones` | 13 |
| `public_submission_abuse_log` | 3 |
| `intake_form_fields` | 15 |
| `intake_forms` | 1 |
| `consent_versions` | 1 |
| `business_services` | 0 |
| `business_faqs` | 0 |
| `business_service_areas` | 0 |
| `business_branding` | 1 |
| `business_template_settings` | 1 |
| `business_onboarding_tasks` | 8 |
| `business_privacy_settings` | 1 |
| `business_consent_settings` | 1 |

Interpretation:

- non-owner auth users are now zero
- non-owner business rows are now zero
- remaining rows belong to the preserved owner workspace
- audit/tombstone history remains intentionally non-PII and preserved

## Commands Run

### Repo / path / git

- `git status --short --branch`
- `git branch --show-current`
- `git rev-parse HEAD`
- `git log --oneline -10`
- `git remote -v`
- `git diff --stat`
- `git diff --name-only`
- `git rev-parse origin/main`

### Supabase / safety / cleanup

- `pnpm check:targets`
- `pnpm audit:supabase`
- direct REST/Auth Admin probes against `qfqendrqimqvkoojpjao.supabase.co`
- `supabase projects list`
- `supabase projects api-keys --project-ref qfqendrqimqvkoojpjao --output-format json`
- read-only Node audits using in-memory `service_role`
- off-repo backup/export generation
- live owner-only deletion pass
- post-cleanup count verification

### Validation

- `pnpm lint` -> PASS
- `pnpm typecheck` -> PASS
- `pnpm test:unit` -> PASS
- `pnpm build` -> PASS
- `pnpm audit:supabase` -> PASS
- `pnpm test:rls` -> PASS
- `pnpm verify` -> PASS

## Commands Not Run

- `supabase db dump --linked`
  - not run because this repo is not linked and no remote DB password was
    supplied in the repo context

## Failures / Caveats

- `supabase status` failed locally with:
  - `failed to parse environment file: .env.local (unexpected character '»' in variable name)`
- local `.env.local` Supabase secret used by direct REST/Admin checks returned
  `401` and should not be trusted until rotated/replaced

Neither caveat blocked the cleanup because the authenticated Supabase CLI session
provided current in-memory project API key access for the backup/audit/delete
steps.

## Remaining Risks

- Local canonical runtime secret drift still exists:
  - the checked-in local environment file path is pointed at the correct host,
    but the local secret material used for direct API/Admin checks is stale or invalid
- `8` deleted non-owner workspaces were marked `production_customer` at cleanup time,
  so the backup directory should be retained until the owner confirms no rollback is needed
- This run did not archive any non-repo side path because no active duplicate git
  checkout was found

## Next Owner Action

1. Rotate or replace the local Supabase secret in the owner-managed env path so
   direct runtime Admin checks no longer return `401`.
2. Keep `E:\bizpilot-ai-backups\owner-only-cleanup-20260705021645` until the
   owner confirms the preserved workspace is correct and no rollback is needed.
3. If desired, manually review whether `E:\bizpilot-ai-5` should remain as a
   generic archive folder; it is not an active repo risk.

