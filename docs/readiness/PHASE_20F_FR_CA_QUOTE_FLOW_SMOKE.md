# Phase 20F fr-CA Quote Flow Smoke

**Project:** BizPilot AI
**Document Type:** fr-CA public quote flow smoke report
**Status:** Blocked - production schema/RPC alignment not complete
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Purpose

Phase 20F is intended to run the previously blocked fr-CA public quote flow smoke after production Supabase schema/RPC alignment.

The smoke was **not run** because the checked production Supabase target is still missing required schema and public quote hardening RPCs. No synthetic production business was created, no production quote was submitted, and no production data was changed.

## 2. Environment

| Item | Result |
| --- | --- |
| Production app URL | `https://bizpilo.com` |
| Configured Supabase project ref checked from local env | `cwiuajpbpyybxxtodpaq` |
| Env source used for safe probe | `.env.local` |
| Production app/browser smoke | Not run |
| Production database write | Not run |
| Data used | None |
| Secrets printed | No |
| Production auto-deploy triggered | No |

## 3. Alignment Gate Check

A fresh safe REST/RPC probe was run before attempting the smoke. The probe used configured public Supabase client values internally but did not print keys, tokens, passwords, or connection strings.

`record_public_submission_attempt` was intentionally not called because it can write.

| Required object | Probe result |
| --- | --- |
| `businesses.status` | Missing: `column businesses.status does not exist` |
| `businesses.internal_note` | Not separately verifiable because the combined `businesses` probe failed on `status` first |
| `businesses.preferred_language` | Not separately verifiable because the combined `businesses` probe failed on `status` first |
| `businesses.plan_slug` | Not separately verifiable because the combined `businesses` probe failed on `status` first |
| `business_members.status` | Missing: `column business_members.status does not exist` |
| `public_link_variants.preferred_language` | Missing: `column public_link_variants.preferred_language does not exist` |
| `public_submission_abuse_log` | Missing from PostgREST schema cache |
| `public_can_insert_submission_value` | Missing from PostgREST schema cache |
| `count_recent_public_submission_attempts` | Missing from PostgREST schema cache |
| `record_public_submission_attempt` | Not called; still considered blocked because `0013` objects are missing from schema cache |

Result: **production schema/RPC alignment gate failed.**

## 4. Business And Link Used

| Item | Result |
| --- | --- |
| Disposable synthetic fr-CA cleaning business | Not created |
| Valid active public quote link | Not created |
| Reason | Production schema/RPC alignment failed before write tests were allowed. |
| Cleanup required | No cleanup from Phase 20F because no test data was created. |

## 5. Viewport And Browser

| Item | Result |
| --- | --- |
| Browser | Not run |
| Viewport | Intended mobile viewport around `390px`; not run |
| Reason | Smoke is blocked before browser testing because production schema/RPC alignment is incomplete. |

## 6. Pass / Fail Table

| Check | Status | Notes |
| --- | --- | --- |
| No horizontal overflow on mobile around `390px` | Not run | Requires a valid aligned production or approved production-equivalent target. |
| French copy is acceptable | Not run | Requires a valid fr-CA public quote page. |
| Quote page loads | Not run | Requires a valid active public quote link. |
| Valid submission works | Not run | Blocked by missing public quote hardening RPCs and schema. |
| Dashboard lead appears | Not run | Would require creating a synthetic lead in production or production-equivalent target. |
| Lead detail opens | Not run | Blocked before data creation. |
| Owner can see organized intake data | Not run | Blocked before data creation. |
| AI/fallback section does not crash | Not run | Blocked before lead/detail smoke. |
| Manual copy/send workflow is clear | Not run | Blocked before lead/detail smoke. |
| Another owner cannot access the lead | Not run | Blocked before lead creation; tenant isolation remains covered by local RLS suite in Phase 20D/20E. |

## 7. Issues

### P0: Production Schema/RPC Alignment Still Missing

The checked Supabase target still lacks required objects from the repo migrations:

```text
0012_intake_submission_values_minimal_rls_hardening.sql
0013_public_submission_abuse_log.sql
0015_business_access_plan_and_admin_log.sql
0016_public_submission_minimum_submit_age_reason.sql
0017_business_preferred_language.sql
```

Do not run the fr-CA production quote smoke until these are applied in order and verified through SQL/RPC checks.

### P0: Backup/PITR/Export Safety Still Not Approved

Phase 20B remains a gate for production SQL and production write testing. If the target may contain real data, do not apply migrations or create smoke-test data without owner-approved backup/PITR/export safety.

## 8. Patches Made

Documentation only:

- created `docs/readiness/PHASE_20F_FR_CA_QUOTE_FLOW_SMOKE.md`.

No app code, UI, migration, RLS policy, production setting, or data row was changed.

## 9. Final Status

| Gate | Status |
| --- | --- |
| Production schema/RPC alignment | Fail |
| fr-CA production quote smoke | Blocked / not run |
| Synthetic production business/link created | No |
| Synthetic quote submitted | No |
| Production data changed | No |
| Cleanup required | No |
| Production public quote collection | Not approved |

Final decision: **Phase 20F remains blocked. Production is not ready for fr-CA public quote smoke or real public quote collection until Phase 20A/20B/20C are closed, the missing migrations/RPCs are verified, and a disposable synthetic smoke can be run safely.**
