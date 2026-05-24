# Phase 20E Public Quote Security Verification

**Project:** BizPilot AI
**Document Type:** Public quote security verification report
**Status:** Local production-equivalent pass; production blocked
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Purpose

Phase 20E verifies whether the public quote submission path is safe enough for a founder-controlled pilot after schema/RPC alignment.

No production submission test was run. No production SQL was run. No production schema was changed. No real customer data was accessed, printed, copied, or mutated.

## 2. Environment

| Item | Result |
| --- | --- |
| Production app URL | `https://bizpilo.com` |
| Production app used for this test | No |
| Production database used for this test | No |
| Production status | Blocked by Phase 20A/20B/20C: exact target not fully owner-confirmed, backup/PITR/export safety not approved, and production schema/RPCs are not aligned. |
| Production-equivalent target | Local Docker-backed Supabase/Postgres database for `bizpilot-ai`. |
| Local DB access path | Temporary local Docker TCP proxy on `127.0.0.1:15432`, removed after the test. |
| Test command | `pnpm test:rls` |
| Data used | Synthetic transactional SQL fixtures only. |
| Test cleanup | RLS tests wrap fixtures in transactions and roll back. |

## 3. Test Business And Link

The verification used synthetic RLS fixtures from:

| Fixture source | Synthetic business/link purpose |
| --- | --- |
| `tests/rls/public-intake-and-leads.test.sql` | Active cleaning quote link, public-safe reads, public submission/value/lead inserts, owner readback. |
| `tests/rls/public-intake-submission-values-hardening.test.sql` | Two synthetic cleaning businesses/forms for unknown, hidden, cross-form, and cross-business value insert denial. |
| `tests/rls/inactive-public-link-blocks-anon.test.sql` | Public link toggled active/inactive to verify anon-visible surfaces close. |
| `tests/rls/public-submission-abuse-log.test.sql` | Abuse-log helper coverage for honeypot, submitted-too-fast, counting, and tenant visibility. |
| `tests/rls/lead-conversion-desk.test.sql` | Owner A versus Owner B lead and activity isolation. |
| `tests/rls/business-access-plan-admin-log.test.sql` | Suspended/cancelled/paused account states block active public quote helper behavior. |

No real pilot business, real owner account, real customer lead, or production quote link was used.

## 4. Command Run

The local RLS suite was run against a local-only target:

```powershell
# Local-only database environment variable set to 127.0.0.1:15432 with password masked.
pnpm test:rls
```

Result:

```text
BizPilot RLS test runner - found 12 test files
Target: local Postgres on 127.0.0.1:15432, password masked

ai-output-tenant-isolation.test.sql ... pass
anon-select-policies-d1-d2.test.sql ... pass
auth-tenant-foundation.test.sql ... pass
business-access-plan-admin-log.test.sql ... pass
business-template-configuration.test.sql ... pass
inactive-public-link-blocks-anon.test.sql ... pass
lead-conversion-desk.test.sql ... pass
public-intake-and-leads.test.sql ... pass
public-intake-submission-values-hardening.test.sql ... pass
public-submission-abuse-log.test.sql ... pass
rls-helper-functions.test.sql ... pass
usage-events-tenant-isolation.test.sql ... pass

Results: 12 passed, 0 failed (12 total)
```

## 5. Positive Result

| Positive requirement | Result | Evidence |
| --- | --- | --- |
| Active public quote link | Pass in local RLS | `public-intake-and-leads.test.sql` verifies active public link and public-safe reads. |
| Valid cleaning quote payload accepted | Pass at DB/RLS layer | `public-intake-and-leads.test.sql` inserts a synthetic public submission for the cleaning template path. |
| Lead created | Pass at DB/RLS layer | `public-intake-and-leads.test.sql` inserts the lead through the public-scoped path. |
| Intake values created | Pass at DB/RLS layer | `public-intake-and-leads.test.sql` inserts submission values and verifies owner readback. |
| Owner can see lead | Pass | `public-intake-and-leads.test.sql` verifies owner readback for submission, values, lead, and metadata. |
| Another owner cannot see lead | Pass for tenant RLS | `lead-conversion-desk.test.sql` verifies cross-owner lead, score, action item, and event isolation. |

Important scope note: this was not a browser/server-action E2E submission against production. It verifies the database/RLS boundary and inspects the app submission path.

## 6. Negative Test Matrix

| Negative requirement | Result | Evidence / notes |
| --- | --- | --- |
| Inactive/disabled public quote link blocked | Pass in local RLS | `inactive-public-link-blocks-anon.test.sql` verifies inactive link hides public surfaces and blocks anon submission insert. `business-access-plan-admin-log.test.sql` verifies suspended, paused, and cancelled account states block active public quote helper behavior. |
| Wrong business/form mismatch blocked | Pass / partially code-inspected | `public-intake-submission-values-hardening.test.sql` blocks cross-business submission/value mixing. `submitPublicIntake()` also rejects form or consent mismatch with a safe public message before insert. |
| Unknown field key blocked | Pass | `public-intake-submission-values-hardening.test.sql` rejects unknown field keys through the hardened insert policy/helper. |
| Hidden field value insert blocked | Pass | `public-intake-submission-values-hardening.test.sql` rejects hidden-field value insert. |
| Field from another form blocked | Pass | `public-intake-submission-values-hardening.test.sql` rejects field keys that belong to another form. |
| Too-fast submission blocked | Pass by code inspection and helper coverage | `submitPublicIntake()` requires a minimum rendered-age before insert and records `submitted_too_fast`; `public-submission-abuse-log.test.sql` verifies that reason is allowed through the logging helper. No browser/server-action E2E helper exists in the repo for this case. |
| Honeypot submission blocked | Pass by code inspection and helper coverage | `submitPublicIntake()` rejects non-empty honeypot input and records `honeypot_triggered`; `public-submission-abuse-log.test.sql` verifies helper logging for honeypot attempts. |
| Malformed payload rejected safely | Pass by code inspection | `submitPublicIntakeAction()` requires the slug/form/consent fields and maps failures through a safe-message allowlist/fallback. Field parsing rejects invalid number/date/past-date inputs with safe public copy. |
| Raw DB/provider error not exposed to user | Pass by code inspection | `submitPublicIntakeAction()` only allows known safe public intake messages, the too-fast message, and the rate-limit message; all other failures use a generic fallback. |

## 7. Issues Found

### Production Not Verified

Production public quote submission is still **not verified**.

Phase 20C found the checked production Supabase target missing current public quote hardening objects from the PostgREST schema cache, including:

```text
public_can_insert_submission_value
record_public_submission_attempt
count_recent_public_submission_attempts
public_submission_abuse_log
public_link_variants.preferred_language
```

Because Phase 20A/20B/20C remain blocked, production must not be used for real public quote submissions yet.

### Rate Limit Depends On Missing Production RPC

The app rate limiter depends on `count_recent_public_submission_attempts`. In the current service implementation, counting errors fail open so legitimate submissions are not blocked by transient infrastructure problems.

That behavior is acceptable only when production schema/RPC alignment is confirmed. If the function is missing from production, rate limiting is not effective. Treat this as a production schema alignment blocker, not a reason to patch ad-hoc SQL or connect the RLS tests to production.

### No Full Public Quote E2E Helper Found

The repo has `pnpm test:rls` and unit tests, but no dedicated public quote browser/server-action E2E script was found. Phase 20E therefore records:

- DB/RLS public quote boundary: verified locally and passing.
- App submission-path safety: inspected in code.
- Full production public quote smoke: not run and not approved.

## 8. Patches Made

Documentation only:

- created `docs/readiness/PHASE_20E_PUBLIC_QUOTE_SECURITY_VERIFICATION.md`.

No application code, migration, RLS policy, UI, schema, or production setting was changed.

## 9. Final Status

| Gate | Status |
| --- | --- |
| Local production-equivalent RLS public quote safety | Pass |
| Public quote app-path safe error handling | Pass by code inspection |
| Production public quote submission safety | Blocked / not verified |
| Production public quote collection for real customers | Not approved |
| Production schema/RPC alignment required first | Yes |
| Backup/PITR/export safety required first | Yes |

Final decision: **local production-equivalent public quote controls pass, but production is not safe to use for real public quote submissions until Phase 20A/20B/20C blockers are closed and a synthetic production smoke is re-run after approved schema/RPC alignment.**
