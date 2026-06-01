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
dashboard, and RLS smoke has not passed. OpenAI operating posture and final
owner approval remain open before real customer data.

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

Real external customer data remains blocked until OpenAI operating posture and
final owner real-data approval are recorded.

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

Real-data gate requirement:

- decide whether Phase 23E diagnostics stay enabled, are reduced, or are gated
  behind an env flag,
- monitor OpenAI cost/quota/rate limits,
- preserve fallback behavior and manual-send owner review.

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
4. OpenAI operating posture is accepted.
5. Real customer data intake is approved.

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

## Next Correct Step

Phase 24C.0 DB-level export/restore proof is complete. Phase 24C.1 restored
app/RLS smoke remains not passed: app/dashboard smoke was not run and the
existing RLS suite against the restored database failed.

Next implementation track:

1. Phase 24E - record OpenAI operating posture, or
2. Phase 24F - final real-data approval decision.
