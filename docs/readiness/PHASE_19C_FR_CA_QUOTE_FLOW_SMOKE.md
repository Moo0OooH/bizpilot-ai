# Phase 19C fr-CA Production Quote Flow Smoke

**Project:** BizPilot AI  
**Document Type:** Production pilot readiness smoke report  
**Status:** Blocked before valid fr-CA smoke  
**Owner:** MoOoH  
**Last Updated:** 2026-05-24  
**Environment:** Production app target `https://bizpilo.com`; Supabase host from local production env: `cwiuajpbpyybxxtodpaq.supabase.co`

---

## 1. Goal

Verify that the production app works end-to-end for a French Canadian cleaning business:

- disposable cleaning business,
- `fr-CA` locale,
- active public quote link,
- mobile public quote flow near 390px,
- safe test quote submission,
- owner dashboard lead review,
- manual copy/follow-up workflow,
- tenant isolation check.

## 2. Result

**Phase 19C did not pass and is not pilot-complete.**

The smoke was blocked during safe disposable test-business setup because the production Supabase target available from the repo environment does not have the language columns required by the deployed multilingual flow.

No customer data was printed. The two disposable auth users created during the failed setup attempt were deleted immediately after the blocker was confirmed. No disposable business, quote link, intake submission, or lead was created.

## 3. Environment And Device

| Item | Value |
| --- | --- |
| Date | 2026-05-23 |
| App environment | Production domain, `https://bizpilo.com` |
| Supabase environment checked | `cwiuajpbpyybxxtodpaq.supabase.co` from `.env.local` |
| Browser/device/viewport | Not executed because valid fr-CA test data could not be created. Intended viewport: mobile width 390px. |
| Test data policy | Safe disposable test data only; no real customer personal data. |

## 4. Setup Attempt

Attempted to seed a disposable French Canadian cleaning test workspace using the service-role boundary from local production env:

- disposable owner auth user,
- disposable second owner auth user for tenant isolation,
- cleaning business with active public quote link,
- `fr-CA` language,
- cleaning template form,
- Montreal/Laval/Longueuil service areas.

The setup failed before business creation:

| Check | Result | Evidence |
| --- | --- | --- |
| Auth user creation | Pass, then cleaned up | Two `phase19c.*@example.com` users were created and later deleted. |
| Business insert with current local schema shape | Fail | Production API returned: `Could not find the 'internal_note' column of 'businesses' in the schema cache`. |
| Cleanup | Pass | `deletedPhase19CTestUsers: 2`. |

## 5. Production Schema Drift

Focused column probes against the production Supabase host returned:

| Table | Required columns checked | Result |
| --- | --- | --- |
| `businesses` | `id`, `name`, `status`, `plan_slug`, `internal_note`, `preferred_language` | Fail on 2026-05-24 focused probe: `businesses.status` does not exist. Earlier setup also failed on missing `internal_note` / language schema. |
| `public_link_variants` | `preferred_language` | Fail: `public_link_variants.preferred_language` does not exist. |
| `business_members` | `status` | Fail: `business_members.status` does not exist. |
| `leads` | `source`, `response_sla_state`, `response_status`, `manual_outcome`, `first_viewed_at`, `first_reply_copied_at` | Fail on 2026-05-24 focused probe: `leads.source` does not exist on the checked target. |

Focused RPC probes against the same checked host also returned `PGRST202` for all three public quote hardening helpers:

| Function | Expected purpose | Result |
| --- | --- | --- |
| `public.public_can_insert_submission_value(uuid, uuid, text)` | Blocks hidden, unknown, wrong-form, and cross-business public intake values. | Fail: function not found in PostgREST schema cache. |
| `public.record_public_submission_attempt(uuid, uuid, text, text)` | Records public quote abuse/min-submit-age attempts without direct anon table access. | Fail: function not found in PostgREST schema cache. |
| `public.count_recent_public_submission_attempts(uuid, text, integer)` | Counts recent public quote attempts for rate limiting. | Fail: function not found in PostgREST schema cache. |

The missing language columns block a valid `fr-CA` production smoke because the current code expects:

- `businesses.preferred_language` for dashboard/business language,
- `public_link_variants.preferred_language` for public quote page copy,
- the language value to flow through quote fields, success copy, dashboard labels, and owner-reviewed AI draft language.

## 6. Pass/Fail Table

| Area | Status | Notes |
| --- | --- | --- |
| Create/use disposable `fr-CA` cleaning business | Fail | Blocked by missing production language schema. |
| Active public quote link | Not run | No valid `fr-CA` business/link could be created. |
| Mobile public quote page at 390px | Not run | Blocked before valid quote link existed. |
| No horizontal overflow | Not run | Requires a valid quote page. |
| French language/copy | Fail | Required production columns are missing, so the system cannot persist/read the selected language for this target. |
| Required fields | Not run | Requires valid quote page. |
| Success state | Not run | Requires successful quote submission. |
| Inactive link behavior | Not run | Requires test link setup. |
| Malformed input/no raw error | Not run | Requires valid quote page. |
| Test quote submission | Not run | Requires valid quote page. |
| Lead appears for correct owner | Not run | Requires successful quote submission. |
| Lead detail opens | Not run | Requires successful quote submission. |
| Intake answers visible | Not run | Requires lead. |
| Copy reply/follow-up workflow | Not run | Requires lead detail and/or AI draft generation. |
| Follow-up/status tracking | Not run | Requires lead detail. |
| Another owner cannot access lead | Not run | Requires lead and second owner workspace. |

## 7. Issues Found

### P0 - Production Supabase schema does not match current multilingual code

The production Supabase target available from `.env.local` is behind the current repo migrations. The checked target is missing schema and RPC pieces from multiple migration phases, including public quote hardening and current multilingual/admin/lead fields.

This explains why a production French Canadian quote flow cannot be honestly certified: the app has copy dictionaries and code paths for `fr-CA`, but this Supabase target cannot store the selected language on businesses or quote links.

### P0 - Production schema target still needs owner verification

This also reinforces the Phase 19B finding: the true production Supabase project and applied migration status must be verified before real pilot data.

It is possible that Vercel production points at a different Supabase project than local `.env.local`. If so, the local production env must be corrected before future production smoke tests. If not, the production database needs the missing migrations applied.

## 8. Patches Made

No app code, product UI, RLS policy, or production database patch was made.

Changes made in repo:

- Added this smoke report: `docs/readiness/PHASE_19C_FR_CA_QUOTE_FLOW_SMOKE.md`.

Operational cleanup:

- Deleted the two disposable `phase19c.*@example.com` auth users created during the failed setup attempt.

## 9. Owner Actions Required

Before rerunning Phase 19C:

1. Confirm the exact Supabase project used by Vercel production for `https://bizpilo.com`.
2. Confirm whether local `.env.local` is pointing at that same production/pilot project.
3. Apply or verify migrations through at least:
   - `0015_business_access_plan_and_admin_log.sql`
   - `0017_business_preferred_language.sql`
   - public quote hardening functions from `0012` and `0013`
4. Refresh/confirm Supabase API schema cache after migrations.
5. Re-run focused schema probes:
   - `businesses.preferred_language`
   - `public_link_variants.preferred_language`
   - `business_members.status`
   - `businesses.status`
   - `businesses.plan_slug`
   - `leads.source`
   - `public_can_insert_submission_value`
   - `record_public_submission_attempt`
   - `count_recent_public_submission_attempts`
6. Re-run Phase 19C end-to-end with a disposable fr-CA cleaning workspace.

## 10. Remaining Risks

- The current codebase can pass local validation while production Supabase remains behind current migrations.
- A production smoke against the wrong Supabase target can produce false confidence.
- fr-CA dashboard/quote behavior cannot be certified until language persistence exists in the actual production database.
- Tenant isolation and dashboard lead workflow were not re-tested in this phase because the valid test workspace could not be created.
