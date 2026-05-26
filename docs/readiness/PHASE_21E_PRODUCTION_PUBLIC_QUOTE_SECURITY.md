# Phase 21E Production Public Quote Security

**Project:** BizPilot AI
**Document Type:** Production public quote security verification
**Status:** Partial route smoke passed; data-bearing production smoke not run
**Owner:** MoOoH
**Last Updated:** 2026-05-26

---

## 1. Purpose

This document records whether BizPilot's public quote submission flow was safely verified in production with synthetic data after production schema/RPC alignment.

No production quote submission was created. No production lead was created. No production customer data was read. No real customer data was used. No security policy was weakened. No production SQL was run. No secrets, tokens, database passwords, service role keys, anon keys, OpenAI keys, full connection strings, full emails, or customer payloads were printed or recorded.

2026-05-26 continuation note: `pnpm smoke:quote` and direct quote-route checks were run against production. Route-only unavailable checks continue to pass, but active public form smoke could not be completed from an active synthetic link that renders a form.

## 2. Environment

| Item | Status |
| --- | --- |
| Production app URL | `https://bizpilo.com` |
| Supabase project ref | `qfqendrqimqvkoojpjao` |
| Supabase project name | `bizpilot-production` |
| Test environment | Production |
| Test data policy | Synthetic only |
| Production public quote security test run? | Partial route-only check |

## 3. Preconditions

| Required precondition | Status | Evidence / blocker |
| --- | --- | --- |
| Production migrations aligned | Object-verified; history unavailable | Required public quote columns/functions, expected `0018` objects, RLS enablement, policies, function definitions, `0019` grants, and targeted constraints/seeds have been verified. `supabase_migrations.schema_migrations` is missing, so history remains unavailable/manual drift. |
| Required RPCs visible to PostgREST | Yes by safe probe and direct SQL | Phase 21B safe probes showed the three public quote RPCs callable/visible with repo parameter names. Owner-run direct SQL verified required functions and grants. |
| Backup/safety documented | Blocked for real customer data | Supabase Free plan has no scheduled backup/PITR available; no manual export or restore drill has been done. Owner risk-accepted this only for no-real-user database/security alignment. |
| Test business/link available or safely created | No production-ready active link mapping observed | Active public-link rows exist, but current production inspection shows unresolved/missing business/form linkage for tested slugs; form rendering is not occurring from these slugs. |
| Owner approval for production data-bearing smoke | Broad readiness approval granted; execution inputs still required | Owner approved practical non-destructive readiness work. Phase 21N records the exact synthetic smoke plan, but execution still requires synthetic accounts/sessions, active link, payload, and cleanup/retain-evidence decision. |

### Safety addendum (must-not-run in production)

- `dashboard-auth-smoke` is a **mutating** workflow and is limited to local/preview validation only.
- Mutating dashboard-style smoke is not allowed on:
  - Vercel production,
  - `bizpilo.com`,
  - canonical production Supabase `qfqendrqimqvkoojpjao`.
- `codex-dashboard-*` slugs are stale synthetic artifacts from dashboard-only smoke and are trace-only only.
- They are **not canonical Step 8B smoke targets** and are not blockers for Step 8B execution.
- Step 8B public-quote smoke route target is constrained to:
  - `https://bizpilo.com/quote/akora`
- Production synthetic data-bearing smoke must only proceed with explicit owner approval and pre-approved cleanup/retention decision.

## 4. Decision

**Do not run data-bearing production public quote security tests yet.**

Reason:

```text
The database/RLS preconditions are mostly satisfied by object verification, and Phase 21N now records a controlled test business/link/session plan plus cleanup options. The production route-only unavailable-link check passed. The production data-bearing synthetic smoke still needs an active synthetic quote slug, synthetic owner sessions, fake payload, and cleanup/retain-evidence decision.
```

The safe local/RLS production-equivalent public quote verification from Phase 20 remains useful evidence, but it does not replace a production smoke after backup/migration/history gates are closed.

## 5a. 2026-05-26 Production Smoke Attempt

### Smoke target

`https://bizpilo.com`

### Synthetic input IDs used

* `phase-21-synthetic-unavailable-check` (inactive-route probe slug)
* `codex-dashboard-1779770778884-94b49585` (synthetic candidate slug created for production smoke prep)
* `___not-a-real-slug___` (malformed slug probe)

### Tests run / result

* `pnpm smoke:quote -- --base-url=https://bizpilo.com --inactive-slug=phase-21-synthetic-unavailable-check` → **PASS**
  * HTTP 200
  * Rendered safe unavailable quote state
  * No raw/internal error marker observed by runner
* `pnpm smoke:quote -- --base-url=https://bizpilo.com --active-slug=codex-dashboard-1779770778884-94b49585` → **FAIL**
  * HTTP 200
  * Rendered `Quote page unavailable` instead of active form state
* Direct malformed route check `/quote/__not-a-real-slug__` → **PASS**
  * HTTP 200
  * Safe unavailable state
  * No raw/internal marker detected

### Passive production link audit

* `public_link_variants` currently includes 13 active rows.
* Active rows tested for render state all returned the unavailable page.
* This prevented safe execution of:
  * required field enforcement,
  * consent persistence verification,
  * source_channel capture verification,
  * too-fast / honeypot / malformed field behavior checks on successful submission,
  * lead visibility and isolation verification.

### Records created

* No production quote submissions or leads created in this run.
* No cleanup/delete action executed.

### Blocker found

Active form rendering is currently blocked by production data-state mismatch (active public links not resolving to valid business/form content), so full data-bearing security smoke is not yet possible until an owner-approved synthetic active production workspace/link setup path is established.

## 5. Positive Test Matrix

| Positive test | Result | Notes |
| --- | --- | --- |
| Active public quote link | Not run | Requires owner-approved synthetic production business/link. |
| Valid cleaning quote payload | Not run | Do not create production submissions until gates pass. |
| Submission accepted | Not run | No production submission attempted. |
| Lead created | Not run | No production lead created. |
| Intake values created | Not run | No production intake values created. |
| Owner can see lead | Not run | Requires production synthetic owner/session and created lead. |
| Another owner cannot see lead | Not run | Requires second synthetic owner and created lead. |

## 6. Negative Test Matrix

| Negative test | Result | Notes |
| --- | --- | --- |
| Inactive/unavailable public quote link blocked | Pass - route-only | `pnpm smoke:quote -- --base-url=https://bizpilo.com --inactive-slug=phase-21-synthetic-unavailable-check` returned HTTP 200, rendered the safe unavailable state, and did not expose raw/internal markers. |
| Wrong business/form mismatch blocked | Not run | Requires controlled synthetic production forms/businesses. |
| Unknown field key blocked | Not run | Supported by `public_can_insert_submission_value` verification and local RLS tests; production browser/API smoke still required. |
| Hidden field value insert blocked | Not run | Supported by public submission-value RLS hardening verification and local RLS tests; production browser/API smoke still required. |
| Field from another form blocked | Not run | Supported by public submission-value RLS hardening verification and local RLS tests; production browser/API smoke still required. |
| Too-fast submission blocked | Not run | Requires rate/min-submit-age test against production; do not spam production. |
| Honeypot submission blocked | Not run | Requires controlled synthetic production submission. |
| Malformed payload rejected safely | Not run | Requires controlled synthetic production request. |
| Raw DB/provider error not exposed to user | Not run | Requires production app request/response smoke without exposing internals. |

## 7. Known Supporting Evidence

Phase 21B safe PostgREST probes found the public quote hardening RPCs visible on the corrected production project:

| RPC/function | Phase 21B safe probe status |
| --- | --- |
| `public_can_insert_submission_value` | Callable |
| `record_public_submission_attempt` | Function exists; synthetic validation error returned before insert |
| `count_recent_public_submission_attempts` | Callable with repo parameter name `target_window_minutes` |

These probes were metadata/RPC visibility checks only. They are not a full production public quote security verification.

## 8. Required Setup Before Retest

Before running the production public quote security smoke:

1. Keep Phase 21A backup/PITR/export/restore blocked for real customer data, or record a fresh explicit owner risk acceptance for synthetic-only smoke.
2. Use the Phase 21C/21D SQL evidence as the database/RLS preflight; do not re-apply `0018` blindly.
3. Review and approve `docs/readiness/PHASE_21N_SYNTHETIC_PRODUCTION_SMOKE_PLAN.md`.
4. Create or identify a disposable synthetic cleaning business and quote link.
5. Create or identify two synthetic owners for horizontal-access verification.
6. Define cleanup policy for synthetic leads/submissions after the test.
7. Space tests safely to avoid auth or quote rate-limit spam.

## 9. Cleanup Policy

No cleanup was performed because no production test data was created.

When the production smoke is approved, the operator must record:

- synthetic business/link identifiers without customer data,
- synthetic lead/submission identifiers,
- whether data is retained as test evidence or removed through an approved cleanup path,
- who approved cleanup,
- whether cleanup itself touches production data.

## 10. Continuation Evidence

2026-05-25 safe route-only smoke:

```text
pnpm smoke:quote -- --base-url=https://bizpilo.com --inactive-slug=phase-21-synthetic-unavailable-check
Result: pass, 1/1
Production route: /quote/phase-21-synthetic-unavailable-check
Expected state: safe unavailable quote page
Raw/internal marker exposure: none detected by runner
Production SQL: none
Production data creation: none
```

This closes only the inactive/unavailable public quote route check. It does
not verify active submission, lead creation, dashboard visibility,
`source_channel`, consent persistence, abuse controls, or horizontal access.

## 11. Issues Found

No production public quote flow issue was found in the route-only check.

Current blocker is active synthetic test setup/session availability and production tenant/link state mismatch:

- `/quote/[slug]` renders `QuoteUnavailable` when `getPublicIntakePage()` returns `null`.
- `getPublicIntakePage()` calls `getPublicIntakePageBySlug()` which requires:
  - a matching `public_link_variants` row with `is_active = true`,
  - an active `intake_forms` row for that business (`is_active = true`),
  - an active `consent_versions` row for that business (`is_active = true`).
- The `intake_forms` and `consent_versions` reads are constrained by anon public RLS policies that depend on `public.has_active_public_link(business_id)`.
- In current migrations, `public.has_active_public_link` now gates on business lifecycle/state:
  - `public_link_variants.is_active = true`
  - `businesses.status in ('onboarding', 'active')`
  - `businesses.lifecycle_status = 'active'`
  - `businesses.plan_slug <> 'paused'`

So an active slug can still render unavailable when its business is:
- suspended/cancelled,
- not `lifecycle_status = 'active'`,
- or on a paused plan,
even if the slug row itself is `is_active`.

## 12. Patches Made

`pnpm smoke:quote` was added in `f1c5346` for approved synthetic public
quote-link checks.

No RLS changes were made.

No production SQL was run.

## 13. Final Status

Production public quote security verification:

```text
Step 8A: RESOLVED.
canonical active slug validated: https://bizpilo.com/quote/akora renders live quote form.
No production DB mutation was performed during this resolution.
```

Final Phase 21E decision:

```text
Step 8A resolved; continue to Step 8B using only:
https://bizpilo.com/quote/akora
Do not use codex-dashboard-* artifacts for Step 8B.
```

## 14. Step 8A diagnostic addendum (root-cause hypothesis)

- `app/(public)/quote/[slug]/page.tsx` only renders the form when `getPublicIntakePage({ slug })` returns a page record.
- `server/services/public-intake.service.ts` and `server/repositories/public-intake.repository.ts` return `null` if any required joined public data is not visible under anon policy/state.
- In production, the candidate tested slug (`codex-dashboard-1779770778884-94b49585`) most likely meets only the `public_link_variants` row check, but not the additional `intake_forms` and/or `consent_versions` visibility and/or business state checks.
- The observed `inactive/malformed slug` behavior remains correct; the `active` candidate returning unavailable is expected when one of the above conditions is missing.

Safest next action:
1) Identify a synthetic active workspace in production and confirm read-only that:
   - `public_link_variants` row exists and `is_active = true`;
   - its `businesses.status = 'onboarding' | 'active'`;
   - `businesses.lifecycle_status = 'active'`;
   - `businesses.plan_slug <> 'paused'`;
   - one active `intake_forms` row and one active `consent_versions` row exist for that business.
2) If any condition fails, create/fix one synthetic production fixture through approved setup flow (owner admin or approved SQL/setup path) and then rerun the synthetic data-bearing production quote smoke.

Recommended approval path for next action:
- This is mostly an owner-approved production setup issue (not a code defect), but if no synthetic workspace/link exists the action will require admin setup and possibly admin/seed-style production SQL under an approved procedure.

BizPilot remains:

```text
Ready only for founder-controlled synthetic demos.
```

BizPilot is not yet:

```text
Ready for the first real pilot customer with real customer data.
```

## 15. Step 8A-2 Read-Only Eligibility Classification (active link inventory)

Scope: read-only query on the configured production-like Supabase target in this workspace, using `public_link_variants` (`is_active = true`) and related policy-gated reads.

Method:
- `public_link_variants` read only (`is_active = true`).
- `businesses` fields read (where available) and form/consent rows counted by business.
- public helper `has_active_public_link` evaluated per business.
- visible non-hidden form field count computed from active forms.
- no writes, no cleanup, no submission tests.

Observed sample summary:
- total active public_link_variants scanned: `13`
- any renderable slug in this scan: **yes**
- exact false conditions for this scan: **none detected**

Observed eligibility table (ids/slugs only):

| slug | business_id | business.status | business.lifecycle_status | business.plan_slug | active_intake_forms_count | active_consent_versions_count | visible_active_form_fields_count | has_active_public_link_condition | final_eligibility | missing_condition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| codex-dashboard-1779758241103 | f64132ee-e640-4625-9a70-ae552c37c461 | unknown | unknown | unknown | 1 | 1 | 0 | true | renderable | none |
| codex-dashboard-1779758287643 | af1e34da-f35b-4664-8ece-fe3cf1f8f032 | unknown | unknown | unknown | 1 | 1 | 12 | true | renderable | none |
| codex-dashboard-1779758833262-ff98967a | 20561c99-de30-4f93-96df-2a73566ec941 | unknown | unknown | unknown | 1 | 1 | 0 | true | renderable | none |
| codex-dashboard-1779758871664-fae57289 | bf9714d6-e3c4-49e9-8b65-8779357f0a8f | unknown | unknown | unknown | 1 | 1 | 0 | true | renderable | none |
| codex-dashboard-1779759161116-3b479078 | 029120e8-b04e-4046-a360-4ce85b7d9b26 | unknown | unknown | unknown | 1 | 1 | 0 | true | renderable | none |
| codex-dashboard-1779759202722-f5c8449d | dbd9a4bd-04f3-49ad-ba2a-4e0e6e8babbf | unknown | unknown | unknown | 1 | 1 | 0 | true | renderable | none |
| codex-dashboard-1779759215654-f0594f3b | 1dd4dd03-7444-4d4f-aba3-60d53f5c8dc9 | unknown | unknown | unknown | 1 | 1 | 0 | true | renderable | none |
| codex-dashboard-1779759273559-d38e378a | ee956dc3-e680-4818-9503-0150b4a9816c | unknown | unknown | unknown | 1 | 1 | 0 | true | renderable | none |
| codex-dashboard-1779770778884-94b49585 | 16c80693-8a42-406f-ad5e-17d28130ec1e | unknown | unknown | unknown | 1 | 1 | 0 | true | renderable | none |
| codex-visual-cleaning | 9e16b97d-3b26-4384-b3ef-6304eddccfe6 | unknown | unknown | unknown | 1 | 1 | 12 | true | renderable | none |
| spark-shine-phase-17-qa | e511b635-461a-47d1-a479-261f13a9e4ef | unknown | unknown | unknown | 1 | 1 | 12 | true | renderable | none |
| spark-shine-phase18a-qa-1779420058961 | 1b8f3cc6-4967-4ffe-9490-533c1c34c68b | unknown | unknown | unknown | 1 | 1 | 12 | true | renderable | none |
| whats | 864dddf1-d12b-414c-bb3c-54dfe4316d63 | unknown | unknown | unknown | 1 | 1 | 12 | true | renderable | none |

Important interpretation note:
- This output is from the configured Supabase host in `.env.local` (`cwiuajpbpyybxxtodpaq.supabase.co`) which does not expose the expected `businesses.status`, `businesses.lifecycle_status`, or `businesses.plan_slug` fields via current read-path checks.
- Therefore this dataset can confirm `has_active_public_link`/forms/consent readiness for those rows, but cannot conclusively finalize production rendering proof until owner confirms the same query path against the exact confirmed production env target.

## 16. Step 8A-3 canonical target confirmation and read-only classification status

- Production app URL verified: `https://bizpilo.com`
- Canonical Supabase target expected by readiness records: `qfqendrqimqvkoojpjao` (`https://qfqendrqimqvkoojpjao.supabase.co`)
- Local `.env.local` target: `cwiuajpbpyybxxtodpaq.supabase.co` (stale/non-canonical for production)

Local evidence collected:
- `.vercel/repo.json` confirms project `bizpilot-ai` but does not expose env values in-repo.
- `NEXT_PUBLIC_SUPABASE_URL` in `.env.local` points to `cwiuajpbpyybxxtodpaq`.
- Canonical target probe with local anon key to:
  `https://qfqendrqimqvkoojpjao.supabase.co/rest/v1/public_link_variants?select=slug&is_active=eq.true&limit=100`
  returned `401 Unauthorized` (key/project mismatch).

Conclusion:
- **Exact env/config match status:** cannot be confirmed locally for production runtime `bizpilo.com`; local repo configuration is confirmed non-canonical.
- **Exact mismatch evidence:** local env host = `cwiuaj...` vs canonical required `qfqend...`.
- **Impact:** canonical-only read-only reclassification could not be completed from this workspace because canonical key is not available.
- **Canonical read-only classification result:** blocked pending production-target and key confirmation.

Safe synthetic candidate status on canonical: **not run (blocked by unavailable canonical read access)**.

## 17. Step 8A-5 canonical route-parity diagnostic

Goal: confirm whether any canonical active slug is renderable as a real form using only read-only DB checks + live route checks.

### 17.1 Canonical endpoint test

- Canonical DB endpoint tested: `https://qfqendrqimqvkoojpjao.supabase.co/rest/v1/public_link_variants`
- Test status: `401 Unauthorized` when using locally available anon credentials.
- This indicates the local workspace does not hold a usable canonical read credential for this project.
- Live app target check remains `https://bizpilo.com` (confirmed accessible).

### 17.2 Live route parity check (production, no data write)

- Synthetic candidate slug selected for parity check: `codex-dashboard-1779770778884-94b49585` (from synthetic active-link inventory)
- Route:
  - `GET https://bizpilo.com/quote/codex-dashboard-1779770778884-94b49585`
- Result: `200` + unavailable state (route-level smoke treats this as quote-unavailable)
- No live form render detected.

### 17.3 Status against requirement

- `active public_link_variants` count on canonical: **blocked (read not possible without valid canonical anon/service credentials in this workspace)**
- `renderable` count: **blocked**
- `unavailable` count: **blocked (or “unknown by projection” for canonical target)**
- Any known active slug candidate rendered form: **No (on live route probe, all checked synthetic slugs returned unavailable)**
- If DB on canonical later reports `renderable=true` for this slug, but route remains unavailable, the likely mismatch path would be:
  - runtime path or RLS mismatch between `getPublicIntakePageBySlug` expectations and production query path
  - stale/partial publish of new page code vs DB state shape
  - DB route conditions not mirrored by inventory query (e.g., business state/plan/lifecycle filters being enforced in policy/func chain)

### 17.4 Evidence status

- `PHASE_21E` was updated.
- **Exact blocker:** canonical read-only classification blocked by missing canonical read credential in workspace.
- Next required owner action remains: provide or execute a canonical read-only eligibility query against `qfqendrqimqvkoojpjao` (using approved canonical credentials or owner-owned DB-read path), then return a slug that passes DB renderable checks and re-run this route parity check.

## 18. Step 8A-5.1 Vercel project/env check confirmation

### Production deployment/project linkage verified

- `npx vercel project ls` (authenticated) shows:
  - Project: `bizpilot-ai`
  - Latest production URL: `https://bizpilo.com`
- `npx vercel inspect https://bizpilo.com --json` shows production deployment:
  - Deployment id: `dpl_4GmmDewM2z8NxdHQ2cWp9TK3rhWx`
  - Target: `production`
  - Context/project scope: `moo0ooohs-projects`
- `npx vercel env ls` lists expected env variable names for production/preview:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_APP_URL`
  - `OPENAI_API_KEY`
  - `BIZPILOT_FOUNDER_EMAILS`

### What we still cannot directly prove from CLI output

- Vercel CLI does not expose env values in plaintext in this mode.
- Therefore this confirms that `bizpilo.com` is pointed to the expected Vercel project and deployment pipeline, **not** the exact Supabase host string.

### Required owner confirmation remaining

- In the Vercel dashboard (or approved owner-side inspection), confirm `NEXT_PUBLIC_SUPABASE_URL` for `bizpilot-ai` production currently equals:
  - `https://qfqendrqimqvkoojpjao.supabase.co`
- If it differs, this exactly matches the risk you flagged: app/runtime may be reading a different Supabase project than canonical records.

## 19. Step 8A-6 Source Trace for `codex-dashboard-1779770778884-94b49585`

### Target slug check

- Slug tested: `codex-dashboard-1779770778884-94b49585`
- Route check against production app:
  - `GET /quote/akora` → 200 with rendered quote form inputs (form path present).
  - `GET /quote/codex-dashboard-1779770778884-94b49585` → 200 + `QuoteUnavailable` marker.
- Live route inference: this specific slug is currently not renderable as a public quote form.

### Canonical DB read status

- Exact canonical DB target required: `qfqendrqimqvkoojpjao`.
- Workspace-local REST probes against canonical host with local keys returned `401 Invalid API key` (key/project mismatch).
- Therefore we could **not** complete authoritative canonical DB confirmation from this workspace.

### Read-only probe on local configured host

Probe host used by workspace `.env.local` (non-canonical): `cwiuajpbpyybxxtodpaq.supabase.co`

- `public_link_variants` row:
  - slug: `codex-dashboard-1779770778884-94b49585`
  - business_id: `16c80693-8a42-406f-ad5e-17d28130ec1e`
  - is_active: `true`
- `intake_forms` active count: `1`
- `consent_versions` active count: `1`
- `intake_form_fields` visible active count: `0` (not a blocker for render in current runtime path)
- business state fields on this host: `status`, `lifecycle_status`, `plan_slug` are not readable via REST projection from this host snapshot, so the lifecycle/plan gates could not be fully evaluated locally.

### Likely source classification

This slug matches the synthetic dashboard smoke generation pattern:
- `codex-dashboard-${timestamp}-${uuid}`
- That exact generator exists in `tests/smoke/dashboard-auth-smoke.mts` where synthetic businesses and active links are created for non-production testing flows.

### Why `akora` works but this slug does not

Current evidence points to two likely causes:
1) The tested slug appears to belong to a non-canonical/stale dataset, while production runtime may be reading canonical DB data for quotes.
2) If canonical-side data exists, route-level gating may still reject due additional business lifecycle/plan state checks in `getPublicIntakePageBySlug` and underlying policy chain.

### Recommendation

- Treat `codex-dashboard-1779770778884-94b49585` as a stale/test-artifact candidate.
- It is **trace-only** and may be cleaned up later only if owner approves cleanup.
- Do not use this slug for Step 8B.
- It may be used only for trace/audit reference.
- Treat as **do-not-use** for production readiness decisioning.
- Safe next action: obtain confirmed canonical keys (or owner-run read-only SQL) for `qfqendrqimqvkoojpjao`, then run the exact same slug probe + conditions check against that target.
- After canonical confirmation, either:
  - use a confirmed renderable canonical synthetic slug for production smoke, or
  - create a fresh synthetic production workspace/link via owner-approved owner-admin flow and rerun Step 8A smoke.
