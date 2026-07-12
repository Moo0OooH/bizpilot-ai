# Production Owner-Only Supabase Cleanup

Date: 2026-07-12
Project: BizPilot AI
Repository: Moo0OooH/bizpilot-ai
HEAD: aff0cc6a317caf5fd6514d00d0d63818bab40fc0

## Scope And Safety

The managed Supabase target was verified as `qfq...pjao.supabase.co`. The direct `DATABASE_URL` in `.env.local` points to a local database and was not used for this production cleanup.

The confirmed and preserved owner is `m.beagi@gmail.com` with a masked user identifier prefix of `27e07d98`. Before mutation, the owner had one confirmed auth identity, one profile, one owned workspace, and one active `owner` membership.

A private backup was created outside the repository before deletion. It contains the Auth metadata, all public-table rows, and the storage-object inventory required for rollback. The backup is not committed and its contents are intentionally not recorded here.

## Cleanup Result

The following operational or synthetic-data rows were deleted from the managed Supabase project:

| Table | Deleted rows |
| --- | ---: |
| `intake_submission_values` | 45 |
| `ai_outputs` | 1 |
| `lead_action_items` | 3 |
| `lead_quality_scores` | 3 |
| `lead_events` | 10 |
| `lead_source_metadata` | 3 |
| `public_submission_abuse_log` | 3 |
| `usage_events` | 6 |
| `leads` | 3 |
| `intake_submissions` | 3 |
| `public_link_variants` | 1 |
| `intake_form_fields` | 15 |
| `intake_forms` | 1 |
| `consent_versions` | 1 |
| `business_branding` | 1 |
| `business_template_settings` | 1 |
| `business_onboarding_tasks` | 8 |
| `business_privacy_settings` | 1 |
| `business_consent_settings` | 1 |
| `business_deletion_tombstones` | 13 |
| `admin_action_log` | 11 |

No storage buckets or objects existed. `business_services`, `business_faqs`, `business_service_areas`, and `business_deletion_requests` were already empty.

## Preserved Records And Verification

The following minimum access and schema-reference records remain:

| Area | Remaining rows | Reason |
| --- | ---: | --- |
| Auth users | 1 | Confirmed owner login only |
| `profiles` | 1 | Owner identity in the app |
| `businesses` | 1 | Owner workspace access |
| `business_members` | 1 | Active owner authorization |
| `verticals` | 1 | Reference data |
| `industry_templates` | 1 | Reference data |
| `industry_template_fields` | 15 | Reference data |

Post-cleanup checks verified that each cleaned table has zero rows, the owner Auth user remains confirmed, and the owner profile/workspace/membership records remain intact.

## Remaining Risk

The managed project was accessed through the service-role API, which does not expose a single cross-table transaction through the configured environment. The backup completed successfully before sequential deletion, and every target table was verified immediately after deletion.
