# Phase 24 - Real Data Approval Gate

**Project:** BizPilot AI
**Date:** 2026-05-30
**Status:** Real customer data is not approved yet.
**Scope:** Docs-only decision gate after Phase 23 synthetic production proof.

## Purpose

This document is the active approval gate before any real customer data,
real customer email, paid pilot execution, destructive production operation, or
broader production mutation.

Phase 23 proved the synthetic production flow, but it did not close every
operational requirement for real customer data.

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
| Password reset request handling | Partial pass | Phase 23F showed safe generic request response and correct reset redirect target. |

Primary evidence docs:

- `docs/readiness/PHASE_23_PRODUCTION_FUNCTIONAL_SMOKE_2026-05-29.md`
- `docs/readiness/WHERE_WE_ARE_WITH_NEXT_STEP_2026-05-29.md`

## Open Blockers Before Real Customer Data

### 1. Email And Custom SMTP

Current status:

- Password reset request path accepted one synthetic owner request safely.
- Reset redirect target is `https://bizpilo.com/auth/reset-password`.
- Mailbox arrival was not verified.
- Reset link was not opened.
- Password reset completion was not tested.
- Supabase custom SMTP provider/domain verification remains unconfirmed.
- App-level owner notification email sender is not implemented/proven.
- From/Reply-To posture remains unverified.

Real-data gate requirement:

- configure and verify transactional email provider/custom SMTP,
- verify DNS/sending identity,
- run one signup/confirmation smoke with an approved safe inbox,
- run one forgot/reset-password smoke with an approved safe inbox,
- open the reset link without printing it,
- verify no tokens/secrets appear in app output or logs.

### 2. Backup, Export, And Restore

Current status:

- Backup/export/restore runbooks exist.
- Real restore drill has not been completed.
- Real-data backup posture remains unclosed.

Real-data gate requirement:

- choose Supabase backup/PITR upgrade or manual logical export path,
- perform/export evidence without printing customer data,
- restore to a disposable non-production target,
- run RLS/app smoke against the restored target,
- document the result.

### 3. Owner Notification Decision

Current status:

- notification UI exists,
- production owner notification sender was not found,
- no `RESEND_API_KEY` was present in Vercel production env listing,
- no safe resend tool exists.

Decision required:

- either run the first pilot as manual dashboard-check workflow only, or
- implement narrow owner-only notification email and test it with synthetic data.

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

1. Email/custom SMTP proof passed or explicitly risk-accepted for a synthetic-only/manual pilot.
2. Backup/export/restore proof passed or explicitly risk-accepted with exact scope.
3. Owner notification decision is made.
4. OpenAI operating posture is accepted.
5. Real customer data intake is approved.

Until then:

- use `MrTester` only for production smoke,
- do not submit real customer quote requests,
- do not send emails to real customers,
- do not run broad AI tests,
- do not run production SQL, migrations, delete, purge, or workspace repair.

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

Phase 24A is docs-only cleanup and commit:

```text
docs: record phase 23 status and corrected next steps
```

After Phase 24A, choose the next implementation track:

1. Phase 24B - close email/custom SMTP proof, or
2. Phase 24C - close backup/export/restore proof, or
3. Phase 24D - decide/implement owner notification posture.
