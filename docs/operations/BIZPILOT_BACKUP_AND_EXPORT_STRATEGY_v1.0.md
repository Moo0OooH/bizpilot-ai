# BizPilot AI — Backup and Export Strategy (Pilot Baseline)

**Version:** v1.0
**Status:** Pilot-readiness skeleton
**Owner:** MoOoH
**Scope:** Database backup awareness, manual export procedure, restore placeholder, auth migration risk
**Last Updated:** 2026-05-15
**Source standard:** `docs/architecture/BIZPILOT_VENDOR_INDEPENDENCE_AND_PORTABILITY_STANDARD_v1.0.md`, Sections 14, 15
**Related:**
- `docs/operations/BIZPILOT_PHASE_10A_VENDOR_INDEPENDENCE_GAP_REPORT_v1.0.md`
- `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`
- `supabase/migrations/README.md`

---

## 1. Purpose

This document satisfies the pilot-readiness portion of the Vendor Independence Standard, Section 14.1. It defines what BizPilot AI commits to before onboarding the first three cleaning-business pilots:

- a list of critical tables that must survive any provider migration;
- the current Supabase backup posture and what it does and does not cover;
- a manual `pg_dump` based export procedure that any operator can run from a workstation;
- a restore procedure placeholder so the first time anyone needs it, the steps already exist;
- a documented auth-migration risk so the team knows exactly which dependency is hardest to move.

Operational hardening — automated backups, encrypted off-site storage, regular restore drills — is deferred to the paid-launch phase (Section 14.2). This document is intentionally documentation-only.

---

## 2. Pilot-readiness checklist

The Standard, Section 14.1, requires the following to exist before pilot. Status as of the current audit:

| Requirement | Status | Section |
| --- | --- | --- |
| Document critical tables | Complete | 4 |
| Confirm database backup/export path | Complete | 5 |
| Confirm how to export business data | Outlined | 6 |
| Confirm how to export leads and submissions | Outlined | 6 |
| Confirm how to export consent/privacy settings | Outlined | 6 |
| Confirm whether storage files exist | Not applicable today | 7 |
| Document auth/user migration risk | Complete | 8 |
| Document restore procedure placeholder | Placeholder only | 9 |

When all rows read "Complete" or "Outlined" the document moves from "skeleton" to "active baseline" and the Vendor Independence Standard's pilot gate is closed for this dimension.

---

## 3. Scope and non-goals

In scope today:

- Awareness of which tables matter and which classification they fall under.
- A practical manual command set that produces a one-shot tenant export.
- An honest record of the auth-migration risk that any prospective replacement provider must accept.

Out of scope today:

- Automated nightly backups outside Supabase's managed point-in-time recovery.
- Encrypted off-site backup storage.
- Restore drills against a non-production project.
- Customer-facing data portability self-serve flow.
- Storage exports — `Supabase Storage` is not yet used in the MVP.

These items become required in `docs/operations/BIZPILOT_BACKUP_AND_EXPORT_STRATEGY_v1.0.md` v1.1 or successor, gated by the paid-launch checklist.

---

## 4. Critical data classes

The Standard, Section 14.3, defines the critical data classes. Mapped to the current schema:

| Class | Tables |
| --- | --- |
| Identity | `public.profiles` |
| Tenant | `public.businesses`, `public.business_members` |
| Configuration | `public.business_branding`, `public.business_services`, `public.business_faqs`, `public.business_service_areas`, `public.business_privacy_settings`, `public.business_consent_settings`, `public.business_template_settings`, `public.business_onboarding_tasks` |
| Public intake | `public.public_link_variants`, `public.intake_forms`, `public.intake_form_fields`, `public.consent_versions` |
| Submissions and leads | `public.intake_submissions`, `public.intake_submission_values`, `public.leads`, `public.lead_source_metadata` |
| Lead intelligence | `public.lead_quality_scores`, `public.lead_action_items`, `public.lead_events` |
| AI artifacts | `public.ai_outputs`, `public.usage_events` |
| Reference (rebuildable) | `public.verticals`, `public.industry_templates`, `public.industry_template_fields` |

The reference class is documented for completeness but does not need to ride along with a tenant export — it can be rebuilt from migrations.

---

## 5. Current backup posture (Supabase)

Phase 19B update, 2026-05-23: the exact production Supabase plan tier, PITR support, and PITR retention window could not be verified from the repo or local CLI. Do not treat PITR as confirmed until the owner records the exact dashboard value in `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`.

Managed Supabase projects may provide provider-managed backups and, depending on the exact plan/settings, point-in-time recovery. For BizPilot production, the current verified status is:

| Capability | Verified status |
| --- | --- |
| Production project name | Owner-reported as `bizpilot-production` |
| Production plan tier | Unknown from repo/CLI |
| PITR supported | Unknown from repo/CLI |
| PITR retention window | Unknown from repo/CLI |
| First schema-only export | Not performed |
| First restore drill | Not performed |

Potential provider coverage, after owner verification:

- Daily backups of the underlying PostgreSQL database on the project's plan.
- Point-in-time recovery within the retention window of the project's plan.
- A dashboard-driven `Restore` action that recreates a database snapshot into a new project on request.

What this does cover:

- A catastrophic schema or data loss event inside the active project.
- An operator mistake that drops a table or corrupts rows, within the retention window.

What this does **not** cover:

- A provider account being suspended or rate-limited beyond recovery before a drill is performed.
- A regional outage that exceeds the provider's stated recovery SLA.
- Off-site, project-independent copies of customer data.
- Encrypted, customer-portable archives.

Action item: before pilot, confirm in writing which Supabase plan tier the BizPilot project is on, what its point-in-time recovery window is, and where that information is stored. Use `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md` as the operational source of truth.

---

## 6. Manual export procedure (workstation-driven)

Until a CI-driven export job is in place, exports are run manually using `pg_dump` against the connection string exposed by Supabase. The following is a baseline procedure to be refined as it is exercised.

### 6.1 Prerequisites

- `psql` and `pg_dump` matching the Supabase PostgreSQL major version are installed locally.
- A read-only connection string is stored in a password manager. The application's runtime connection string must not be used for ad-hoc exports.
- The export target directory is on encrypted local storage.

### 6.2 Full schema-and-data export

```bash
pg_dump \
  --host="<project>.supabase.co" \
  --port=5432 \
  --username="<readonly_user>" \
  --dbname=postgres \
  --schema=public \
  --no-owner \
  --no-privileges \
  --file="bizpilot-<YYYYMMDD>-full.sql"
```

This produces a single SQL file containing schema and data for the `public` schema only. `auth.users` is intentionally excluded — see Section 8.

### 6.3 Tenant-scoped export

A tenant-scoped export is the same `pg_dump` invocation followed by a manual `psql --command` for each critical table, filtered by `business_id`. This is a draft for the v1.1 revision of this document; until then, full exports are the only supported path.

### 6.4 Storage exports

`Supabase Storage` is not used by the MVP. If a future phase introduces file storage, this section must be replaced with the storage provider's export procedure before the storage feature ships.

### 6.5 Cadence

For pilot, perform a full export before any of the following events:

- a destructive migration lands on production;
- a major Phase milestone is closed (Phase 12, 13, 14, etc.);
- a pilot customer onboarding day.

Cadence becomes scheduled and automated in v1.1.

---

## 7. Storage

No `Supabase Storage` buckets are provisioned for BizPilot today. Branding logos and similar future assets must be evaluated against this document and the Standard, Section 12.4, before they ship. The simplest portable path remains storing image URLs that the customer controls, not uploads into a provider-specific bucket.

---

## 8. Auth migration risk

`auth.users` is owned by Supabase Auth and is not portable through `pg_dump --schema=public`. Migrating BizPilot away from Supabase Auth requires one of:

- a managed identity migration through the destination provider (Clerk, Auth0, WorkOS, NextAuth/Auth.js bridging, custom), with password hashes either re-issued via password reset or imported through a provider-specific compatible hash format;
- a controlled, time-bounded "log in to migrate" window where users re-authenticate against the new provider on first visit;
- a hybrid where existing sessions continue against Supabase Auth and new sessions issue against the destination provider for a deprecation period.

Whichever path is chosen, the cost is human and customer-facing, not purely technical. The tables that reference `auth.users(id)` are:

```text
public.profiles.user_id
public.businesses.owner_user_id
public.business_members.user_id
```

These references must be preserved by the migration. A stable mapping of `auth.users.id` → destination identity provider's stable user ID is the single piece of state that determines whether the migration is reversible.

For the pilot, the accepted risk is: BizPilot will remain on Supabase Auth and will not perform an auth migration before paid launch. Any earlier decision to move providers must update this section before action is taken.

---

## 9. Restore procedure (placeholder)

A real restore procedure does not exist yet. The placeholder steps for the first time it is exercised:

1. Confirm the export file is complete and matches a known good production state.
2. Provision a fresh Supabase project on a non-production plan.
3. Run all SQL migrations from `supabase/migrations/` in order against the empty database.
4. Apply the export file with `psql --file=bizpilot-<YYYYMMDD>-full.sql`.
5. Recreate `auth.users` rows. For a pilot-stage drill, manually create the small number of test accounts; this is acceptable while the user count is in the tens.
6. Verify RLS by running every `tests/rls/*.test.sql` file against the restored database.
7. Verify the application boots end-to-end against the restored database by pointing a local `next dev` instance at the restored project credentials.
8. Record the date, duration, and any anomalies in a `docs/operations/BIZPILOT_RESTORE_DRILL_LOG.md` (to be created on first drill).

This procedure is not validated. It is recorded so the first drill has a starting point.

---

## 10. Open items

- Decide the Supabase plan tier and document its point-in-time recovery window inside Section 5.
- Decide whether the first pilot week should include a backup/restore drill against a disposable project, or whether the drill is deferred to the paid-launch readiness phase.
- Decide whether exported SQL files are stored on a single operator workstation or in a shared encrypted location.
- Decide whether the pilot customer's data export should be made available to the customer on request, and document that decision in the privacy settings.

These should be answered before the first pilot customer is onboarded, and the answers should land directly in this document rather than in a separate followup.

---

## 11. Definition of Done

This document moves from "skeleton" to "active baseline" when every row in Section 2 reads "Complete" or "Outlined", every Open item in Section 10 has a recorded decision, and the document has been referenced from `docs/README.md` and `MANIFEST.json` (already done for the parent Vendor Independence Standard).

It is replaced by `v1.1` when an actual export has been performed and a restore drill has been completed.
