# Phase 24 - Real Data Approval Gate

**Project:** BizPilot AI
**Date:** 2026-05-30
**Status:** Real customer data is not approved yet.
**Scope:** Docs-only decision gate after Phase 23 synthetic production proof.

## Purpose

This document is the active approval gate before any real customer data,
real customer email, paid pilot execution, destructive production operation, or
broader production mutation.

Phase 23 proved the synthetic production flow. The external Auth email/custom
SMTP gate was later completed by owner-side setup and smoke evidence. Owner
notification email is intentionally deferred for the first pilot. Phase 24C
DB-level backup/export/restore proof has passed, but restored-target app,
dashboard, and RLS smoke has not passed. Phase 24E OpenAI operating posture
documentation has passed. Final no-secret production smoke is now FULL PASS
using sanitized synthetic-only evidence. Final owner approval remains open
before real customer data.

## Current Decision

```text
Do not start real customer data intake yet.
Do not start paid pilot with real customer data yet.
Continue synthetic-only production smoke flows until this gate closes.
```

Approved synthetic target remains:

| Field | Value |
| --- | --- |
| Business | `MrTester` |
| Business id | `131561a7-9b5b-4ff9-a7fe-403d5c46462b` |
| Lead | `BizPilot QA Test Lead` |
| Lead id | `3f46045b-47d1-4d92-b99d-0bdfe6eab10e` |

Do not touch `BizPilot Synthetic Cleaning QA MailTM` unless the owner
explicitly approves it.

## Completed Evidence

| Area | Status | Evidence |
| --- | --- | --- |
| Public production smoke | Passed | Phase 23B and later public smokes passed 9/9. |
| Auth redirect behavior | Passed | Phase 23B protected redirect proof passed. |
| Synthetic quote intake | Passed | Phase 23C submitted one fake quote through `/quote/mrtester`. |
| Synthetic owner dashboard | Passed | Phase 23D proved `/dashboard` and `/dashboard/leads` for `MrTester`. |
| OpenAI provider proof | Passed | Phase 23E-5 produced `provider=openai`, `status=generated`, model `gpt-5.1` on the approved synthetic lead. |
| AI safety review | Passed | No invented pricing, availability, booking confirmation, or guarantees observed; manual owner-review orientation preserved. |
| Password reset request handling | Passed | Phase 23F showed safe generic request response and correct reset redirect target; owner later verified email arrival, reset link, completion, and login after reset. |
| Custom SMTP/Auth email | Passed | Owner reported Resend + `no-reply@bizpilo.com`, DNS verified, Supabase SMTP enabled, signup confirmation passed, forgot/reset password passed. |
| Phase 24F final no-secret production smoke | FULL PASS | 2026-06-18 sanitized evidence: production deploy Ready; public routes loaded; `/quote/mrtester` and `/quote/bizpilotowner` synthetic submits reached success; owner visually confirmed synthetic dashboard lead visibility; protected dashboard route redirected logged-out users to sign-in; no real customer data, secrets, tokens, cookies, auth links, private payloads, or destructive production DB actions were used or recorded. |

Primary evidence docs:

- `docs/readiness/PHASE_23_PRODUCTION_FUNCTIONAL_SMOKE_2026-05-29.md`
- `docs/readiness/WHERE_WE_ARE_WITH_NEXT_STEP_2026-05-29.md`

## Open Blockers Before Real Customer Data

### 1. Email And Custom SMTP

Current status:

- Passed for Supabase/Auth transactional email.
- Provider: Resend.
- Sender: `no-reply@bizpilo.com`.
- Resend domain DNS verified.
- Hostinger DNS records added: DKIM, SPF, MX, DMARC.
- Supabase custom SMTP enabled.
- SMTP host/port: `smtp.resend.com` / `587`.
- Resend API key exists with Sending access only; the value is not recorded.
- Signup confirmation email passed.
- Confirm email link passed.
- Forgot-password email passed.
- Reset-password link opened.
- Password reset completion passed.
- Login after reset passed.
- Resend log proof showed `POST /emails` returned `200` via SMTP v1.0.0.

This closes the external Auth email/custom SMTP gate.

Still separate:

- app-level owner notification email sender remains not implemented/proven,
- no customer-facing automated email is approved,
- no SMTP credentials, API keys, private inbox addresses, confirmation links,
  reset links, auth tokens, or passwords are recorded here.

### 2. Backup, Export, And Restore

Current status:

- Backup/export/restore runbooks exist.
- Phase 24C preparation docs are complete.
- Phase 24C.0 DB-level export/restore drill completed on 2026-05-30 using local
  Docker Supabase/Postgres as the disposable restore target.
- Phase 24C.0 DB-level restore proof is PASS.
- Phase 24C.1 restored app/RLS smoke is NOT PASSED.
- App/dashboard restore smoke is NOT RUN.
- Existing RLS test suite against the restored database was RUN and FAILED
  against the restored fixture state: 2 passed, 11 failed. This is not accepted
  as restored-target RLS proof.
- Strict Phase 24C full pass is NOT CLAIMED.
- Phase 24C selected path used manual Supabase CLI logical export plus restore
  drill to a disposable local Docker Postgres database.
- Specific synthetic target checks passed at DB-count level:
  `MrTester` business count = 1 and approved synthetic lead count = 1.
- DB-level RLS metadata check passed for the restored core tables found in the
  current schema: `ai_outputs`, `business_members`, `businesses`,
  `intake_forms`, `intake_submissions`, `lead_events`, and `leads` all had RLS
  enabled.
- Owner decision: strict restored app/dashboard/RLS smoke is not required for
  the first limited pilot. It is deferred to P1 before paid pilot, before
  production migrations, or before destructive/bulk data work.

Real-data gate requirement:

- run manual logical export with placeholder-only commands,
- generate `roles.sql`, `schema.sql`, and `data.sql` outside git,
- restore to a disposable non-production target,
- run RLS/app smoke against the restored target before paid pilot, before
  production migrations, or before destructive/bulk data work,
- document the result.

Real external customer data remains blocked until final owner real-data
approval is explicitly recorded.

### 3. Owner Notification Decision

Current status:

- owner notification email is intentionally deferred for the first pilot,
- first pilot is manual-only,
- owner checks dashboard manually,
- no owner notification email is required for first-pilot readiness,
- no customer-facing email automation, AI auto-send, or autonomous workflow is
  approved.

Revisit trigger:

- successful pilot validation,
- active pilot customers,
- demonstrated operational need.

No customer-facing automated email is approved.

### 4. OpenAI Operating Posture

Current status:

- provider proof passed on one synthetic lead,
- fallback safety passed,
- diagnostics helped resolve parser/token truncation.
- Phase 24E owner decision recorded: OpenAI operating posture documentation is
  accepted for the first limited pilot.
- Phase 24E is not a new runtime AI proof. Phase 23E remains the runtime
  OpenAI provider proof.

Accepted operating posture:

- cost monitoring: daily during the first 14 pilot days, then weekly,
- usage/quota check: before onboarding each real pilot customer, then weekly,
- budget: owner-defined monthly soft budget in OpenAI project settings; no hard
  cap is assumed from OpenAI budget alerts,
- fallback: if OpenAI fails, the app keeps the lead saved and uses the existing
  safe fallback/manual workflow,
- rate-limit behavior: no retry storm, no bulk AI generation, manual
  on-demand only, owner can retry later,
- diagnostics: keep safe non-secret diagnostics temporarily; no raw prompts,
  raw provider output, or customer PII in logs; after pilot starts, reduce or
  gate diagnostics if noisy,
- manual review: AI draft is never automatically sent; owner reviews and
  manually responds.

### 5. Commercial And Support Readiness

Current status:

- core synthetic production proof is strong,
- paid pilot execution remains a separate business/ops decision.

Gate requirement:

- owner-approved pilot pricing/payment process,
- support channel and response promise,
- incident and rollback owner process,
- no overpromise of email notification, booking, auto-send, or CRM automation.

## Required Owner Approval To Close This Gate

This gate can close only when the owner explicitly records:

1. Email/custom SMTP proof passed. Completed by owner-provided external Resend/Supabase proof.
2. Backup/export/restore DB-level proof passed. Completed by Phase 24C
   DB-level export/restore proof on 2026-05-30. Existing RLS suite against the
   restored database failed and app/dashboard restore smoke was not run, so
   strict Phase 24C full pass is not claimed.
3. Owner notification email deferred decision is recorded.
4. OpenAI operating posture documentation is accepted. Completed by Phase 24E
   owner decision; this is not a new runtime AI proof.
5. Final no-secret production smoke passed. Completed by Phase 24F FULL PASS
   on 2026-06-18 with sanitized synthetic-only evidence.
6. Real customer data intake is approved. Not recorded yet.

Until then:

- use `MrTester` only for production smoke,
- do not submit real customer quote requests,
- do not send emails to real customers,
- do not run broad AI tests,
- do not run production SQL, migrations, delete, purge, or workspace repair.
- do not run destructive cleanup, hard purge, bulk data mutation, automation,
  or AI auto-send.

## Safety Rules

- No production SQL without exact owner approval and backup posture.
- No migrations without exact owner approval and rollback plan.
- No real customer data until this gate closes.
- No real customer email tests.
- No API keys, SMTP credentials, reset links, auth tokens, passwords, prompts,
  raw model output, or service-role keys in docs/logs.
- No homepage/design/docs stash work during this gate.
- No broad AI or email tests.

## Phase 24F - Final No-Secret Production Smoke Checklist

Status: FULL PASS on 2026-06-18.

This smoke is required before final real customer data approval. It was run
synthetic-only, non-destructively, and with sanitized no-secret reporting.

Read-only wording note:

The dashboard checks are UI-read-only and must not perform destructive or
operator-initiated mutations. If the current app records expected passive
metadata during owner viewing, such as viewed/reviewed/timeline/SLA state, that
must be recorded as expected passive metadata rather than described as a purely
database-read-only route.

Recommended evidence wording:

```text
No destructive or user-initiated mutation was performed. Passive owner-view
metadata may update if that is the current app behavior and is recorded as
expected.
```

Approved target:

| Field | Value |
| --- | --- |
| Business | `MrTester` |
| Business id | `131561a7-9b5b-4ff9-a7fe-403d5c46462b` |
| Lead | `BizPilot QA Test Lead` |
| Lead id | `3f46045b-47d1-4d92-b99d-0bdfe6eab10e` |

Smoke scope:

| Check | Expected result | Evidence field |
| --- | --- | --- |
| Public route smoke | Public pages load without raw errors or secret markers | `pass / partial / fail / not run` |
| Logged-out protected route redirect | Protected dashboard route redirects safely to auth | `pass / partial / fail / not run` |
| Synthetic owner login | Approved synthetic owner can sign in through normal auth | `pass / partial / fail / not run` |
| `/dashboard` read-only load | Dashboard loads for `MrTester` and does not show another tenant | `pass / partial / fail / not run` |
| `/dashboard/leads` read-only load | Leads page loads for `MrTester` and shows scoped lead data only | `pass / partial / fail / not run` |
| Approved lead detail read-only load | `/dashboard/leads/3f46045b-47d1-4d92-b99d-0bdfe6eab10e` loads for the approved synthetic lead only | `pass / partial / fail / not run` |
| Cross-tenant visual smoke | No other tenant data is visible in dashboard, leads, or lead detail | `pass / partial / fail / not run` |
| Sensitive output check | No API keys, SMTP credentials, reset links, auth tokens, cookies, provider secrets, raw prompts, raw provider output, stack traces, or service-role markers appear in UI/log evidence | `pass / partial / fail / not run` |
| Sign-out, if tested | Sign-out works without exposing tokens or internal errors | `pass / partial / fail / not run` |

Safe evidence template:

```text
Route:
Actor:
Time:
Expected:
Result: pass / partial / fail / not run
Sensitive data visible: no / yes
Cross-tenant data visible: no / yes
Notes: sanitized, one sentence only
```

Hard exclusions:

- no AI run unless separately approved,
- no production SQL,
- no migrations,
- no delete, purge, workspace repair, or destructive cleanup,
- no broad/batch tests,
- no real customer data,
- no real customer email,
- no secret/token/reset-link logging,
- no homepage/design/dashboard/admin redesign.

Final decision field:

| Field | Value |
| --- | --- |
| Final no-secret production smoke decision | `pass` |
| Production touched beyond normal read-only UI/auth | `yes - synthetic public quote submissions only` |
| Real customer data used | `no` |
| Secrets exposed | `no` |
| Remaining blocker before real-data approval | `Phase 24G explicit owner approval is ready for owner review but not recorded.` |

Sanitized Phase 24F evidence:

| Check | Result | Evidence |
| --- | --- | --- |
| Production deploy | PASS | Production deployment reported Ready. |
| Public route smoke | PASS | Public routes loaded without raw errors or secret markers. |
| `/quote/mrtester` submit | PASS | Synthetic-only submit reached the success page. |
| `/quote/bizpilotowner` submit | PASS | Synthetic-only submit reached the success page. |
| Dashboard lead visibility | PASS | Owner visually confirmed the synthetic lead appears in the authenticated production dashboard. |
| Password reset | PASS | Owner manually verified reset-password email, reset link, completion, and login end-to-end. |
| Logged-out protected route redirect | PASS | Protected dashboard route redirected unauthenticated browser session to sign-in. |
| Sensitive output check | PASS | No secrets, env values, tokens, cookies, auth links, database URLs, private payloads, customer emails, phone numbers, or private field values were printed or recorded. |
| Real customer data | PASS | No real customer data was used. |
| Destructive production DB action | PASS | No destructive production DB action was performed. |

## Phase 24G - Explicit Owner Real-Data Approval Template

Status: ready for owner review; not approved and not recorded.

Do not fill this section until Phase 24F passes and the owner explicitly
approves real customer data.

| Field | Value |
| --- | --- |
| Approval date | `YYYY-MM-DD` |
| Approver | `MoOoH / owner` |
| Scope | `first limited cleaning pilot only` |
| Data allowed | `real cleaning-business owner account and real quote submissions only after setup` |
| Data not allowed | `bulk imports, scraping, automated customer email, AI auto-send` |
| Pilot mode | `manual dashboard check, owner-reviewed AI drafts, manual copy/send` |
| Stop condition | `any P0 security/auth/cross-tenant issue pauses pilot` |
| Final approval decision | `approved / not approved` |

## Next Correct Step

Phase 24C.0 DB-level export/restore proof is complete. Phase 24C.1 restored
app/RLS smoke remains not passed: app/dashboard smoke was not run and the
existing RLS suite against the restored database failed. Phase 24E OpenAI
operating posture documentation is accepted.

Next implementation track:

1. Phase 24G - final real-data approval decision by the owner.
2. Keep real customer data, paid pilot, and feature expansion blocked until the
   owner explicitly records Phase 24G approval.
