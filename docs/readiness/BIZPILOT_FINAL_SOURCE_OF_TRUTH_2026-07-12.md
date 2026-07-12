<!--
 * ============================================================
 * File: docs/readiness/BIZPILOT_FINAL_SOURCE_OF_TRUTH_2026-07-12.md
 * Project: BizPilot AI
 * Description: Current, evidence-bound product and release posture.
 * Role: Controls current work when historical readiness reports disagree.
 * Related:
 * - docs/readiness/current-status.json
 * - docs/CURRENT_CANONICAL_DOCS_v1.7.md
 * - docs/archive/README.md
 * Author: MoOoH
 * Created: 2026-07-12
 * Last Updated: 2026-07-12
 * Change Log:
 * - 2026-07-12: Established the sole current project truth and historical-evidence boundary.
 * ============================================================
 -->

# BizPilot AI — Final Source of Truth (2026-07-12)

## Authority and evidence rule

This is the controlling status document for current BizPilot work. Read it with
[`current-status.json`](current-status.json) before using any phase report. If
an older document calls a result *final*, *ready*, or *passed* but conflicts
with this file, this file wins. Historical reports preserve what was tested or
decided at that time; they do not authorize a new release, production mutation,
real-customer-data use, or paid pilot.

Current repository baseline when this document was generated:
`main` at `5cebae28423a268c7bf277f78f630ccc15b8438b`.

## Product definition and operating model

BizPilot AI is a **cleaning-first quote recovery and lead conversion desk**.
It helps a small cleaning-business owner collect quote requests, identify
missing details, prioritize the next manual response, prepare an internal AI
draft, and copy/edit/send that response through the owner's existing channel.

- GTM is cleaning-first and founder-led; it is not a general vertical platform.
- Operations are manual-first: the owner reviews, copies, edits, and sends.
- AI is assistive only. It does not auto-send, book, promise availability,
  invent pricing, or act as an autonomous operator.
- BizPilot is not a full CRM, booking engine, invoice system, payment processor,
  SMS/WhatsApp automation product, or self-serve SaaS activation flow.

## Implemented capability and route map

| Area | Current implementation status | Canonical routes |
| --- | --- | --- |
| Public marketing | Implemented and bilingual EN/fr-CA. The latest local public QA is Phase 30; it does not prove a live Vercel deployment. | `/`, `/features`, `/comparison`, `/industries/cleaning`, `/demo`, `/pricing`, `/pilot`, `/faq`, `/trust`, `/quote-link-guide`, `/faster-quote-replies`, `/privacy`, `/security`, `/terms`; `/content-studio` is noindex/roadmap-only. |
| Public quote intake | Implemented as a business-specific public quote link with validation, consent/abuse safeguards, inactive-link handling, and success state. | `/quote`, `/quote/[slug]`, `/quote/[slug]/success` |
| Email/password auth | Implemented: sign-in, sign-up, email confirmation holding state, password reset, safe callback handling, protected dashboard access, and guarded workspace bootstrap. | `/auth/sign-in`, `/auth/sign-up`, `/auth/check-email`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/callback` |
| Google auth | **Code implemented, external enablement unverified.** The app starts Google OAuth with login-only `openid email profile` scopes and no workspace bootstrap. Supabase/Google provider configuration and owner QA have not been verified in this consolidation. Do not present Google login as operational until those gates close. | Existing sign-in/sign-up entry points and `/auth/callback` |
| Phone auth | Not implemented and blocked. No OTP/provider/customer-SMS behavior is enabled. | None |
| Owner dashboard | Implemented for manual lead recovery and local/synthetic QA. Owner-provided manual visual review is recorded, but a repeatable production-safe authenticated proof is not established. | `/dashboard`, `/dashboard/leads`, `/dashboard/leads/[leadId]`, `/dashboard/configuration`, `/dashboard/quote-setup`, `/dashboard/business-profile`, `/dashboard/settings`, `/dashboard/guide` |
| Founder/admin | Implemented as gated internal oversight for workspace/user/access/quote-link support operations. It is not a customer CRM and must remain guarded. | `/founder`, `/admin` |

## Status by release-critical area

### Public site

**Code and local QA: PASS. Deployment: NOT VERIFIED.** Phase 30 records a
passing local lint/typecheck/unit/build/public-route/responsive/UI-matrix run
and EN/fr-CA link persistence. This supports the checked-in public experience;
it does not prove the current Vercel deployment, cache, domain, environment, or
live external behavior.

### Dashboard and founder-admin

**Implemented; production-final claim blocked.** Local/synthetic authenticated
dashboard and founder/admin route evidence is green. Phase 26I records
owner-provided manual visual acceptance as `PASS WITH RISKS`. That is useful
evidence, but it is not a repeatable automated production-safe session proof.
Do not describe the dashboard or founder-admin as production-final for real
customer operation.

### Quote intake and AI drafts

**Implemented with safety boundaries.** The public quote flow and structured
lead workspace are present. AI assistance is a draft/summary/follow-up aid;
the owner must review, copy or edit, and send outside BizPilot. Customer-facing
automation, booking confirmation, price/availability promises, and autonomous
actions remain prohibited.

### Auth

**Email/password: implemented. Google: code-only and unverified externally.
Phone: not implemented.** Historical email/password and SMTP evidence exists,
but this consolidation did not perform a production auth transaction. Google
OAuth must not bootstrap a workspace, requests no Gmail API access, and needs
explicit provider configuration plus owner QA before it can be claimed live.

### Supabase, migrations, and RLS

**Repository posture: implemented migrations and local RLS evidence; managed
production posture is not re-certified.** The repository contains migrations
`0001` through `0024` and 13 RLS SQL test files. Phase 25Y records `13/13`
passing against a confirmed local target. This does not substitute for
production-target verification or restored-target application proof. The
2026-07-12 managed Supabase cleanup record is historical evidence of a
backup-first owner-only cleanup; it is not authorization for further managed
data changes.

### Vercel and production deployment

**Not verified in this pass.** No current deployment, domain, Vercel
environment, cache, or production smoke result is claimed here. The deployment
runbook remains a standard/checklist, not proof that its steps are complete.

### Production and real customer data

**Blocked.** The historical managed-project cleanup preserved one owner account
and workspace after backup-first removal of operational/synthetic rows. It does
not approve onboarding, collecting, importing, or mutating real customer data.
The final no-secret production smoke and explicit owner approval remain open.

### Backup and restore

**Partial only.** Phase 24C.0 established a DB-level logical export and
disposable local restore proof. Phase 24C.1 did not pass: restored-target RLS
had 2 passing and 11 failing files, and restored-target application/dashboard
smoke was not run. Therefore strict restore readiness is not complete and is a
blocker before paid pilot, production migrations, or destructive/bulk work.

### Pilot, payments, and commercial posture

**Founder-led validation materials exist; real and paid pilots are blocked.**
Pricing and pilot pages describe manual approval/manual billing only. There is
no self-serve checkout, payment capture, invoice system, or automated
activation. Do not accept payment or onboard a real cleaning business until the
data, restore, support/refund/rollback, and owner-approval gates close.

## Exact release blockers

The following remain open. No historical “final” report closes them.

1. Run and record a no-secret, production-safe smoke appropriate to the managed
   target without creating/mutating real customer data.
2. Obtain explicit owner approval for any real-customer-data gate after that
   smoke; until then, real customer intake/onboarding remains blocked.
3. Complete a restored-target proof: app/dashboard/lead visibility plus the RLS
   suite must pass against a disposable restored target.
4. Verify the intended Vercel deployment, domain/DNS, production environment,
   and Supabase Auth redirect configuration; record non-secret evidence.
5. Before paid pilot: approve and exercise the manual payment collection,
   support/escalation, refund, rollback, and founder operating process.
6. Before claiming Google login is live: configure Google and Supabase OAuth,
   verify exact redirects/consent/identity linking, and perform owner QA proving
   existing-workspace login without duplicate workspace creation.
7. Keep phone auth, customer messaging automation, booking, invoices, payments,
   autonomous AI, and CRM expansion out of scope unless separately approved and
   validated.

## Required owner actions

- Decide whether to keep the visible Google entry disabled/unavailable or
  authorize the provider-configuration and owner-QA gate.
- Approve a safe, no-secret production verification plan and explicitly approve
  the real-data gate only after reviewing its evidence.
- Provide/approve a disposable restored-target test plan for strict restore
  proof.
- Confirm Vercel/domain/Auth redirect settings through a non-secret checklist.
- Approve the paid-pilot operating packet only after the preceding data/restore
  gates and payment/support/refund/rollback rehearsal are complete.

## Evidence classification

| Classification | How to use it |
| --- | --- |
| CURRENT | This document, `current-status.json`, and the current documentation maps control work. |
| STANDARD | Product, engineering, security, accessibility, and operating standards constrain implementation; they do not prove a gate passed. |
| HISTORICAL EVIDENCE | Phase 25–30 reports and prior readiness reports document point-in-time work or tests. Use them as evidence only. |
| ARCHIVED | Archived branch and superseded process records are retained for traceability and must not override current authorization. |

## Source set used for this consolidation

- Phase 25–30 readiness reports, including the Phase 30 public QA and Phase 27
  Google code-only implementation record.
- Phase 26 dashboard/local smoke and owner-access reports.
- Auth code, routes, unit tests, RLS tests, migrations `0001`–`0024`, package
  scripts, and the repository CI workflow inventory.
- `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`,
  `docs/business/PILOT_TERMS_DECISION_GATE.md`, and
  `docs/operations/BIZPILOT_DOMAIN_DEPLOYMENT_RUNBOOK_v1.0.md`.

For the machine-readable equivalent, use
[`current-status.json`](current-status.json). For history handling, use
[`docs/archive/README.md`](../archive/README.md).
