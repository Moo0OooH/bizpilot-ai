# Next Phase Execution Plan

Date: 2026-06-26
Repo: `E:\bizpilot-ai`
Status: post-P8 public homepage and post-D1 dashboard stabilization

## Current Gate Statement

```text
P8 public homepage is on main.
D1 dashboard is code/test/visual ready on local synthetic data.
Real data and paid pilot remain blocked.
```

## P0 - Release Hygiene And Proof

Goal: make the current repo clean, verified, pushed, and easy to review.

Tasks:

- Confirm `main` is synced with `origin/main`.
- Confirm production homepage deploy/cache shows P8 chaos-to-clarity hero.
- Run safe public production GET/DOM checks only.
- Run local build and public/responsive/UI matrix smokes.
- Run inactive quote slug smoke.
- Run local DB/RLS proof only when the DB target is confirmed local.
- Keep dashboard smoke blocked unless Supabase URL is confirmed local/synthetic.
- Keep secrets redacted and rotate any password shared in chat.

Exit criteria:

- `pnpm verify` passes.
- Safe smokes pass or are explicitly blocked with reason.
- `git diff --check` passes.
- Repo has no unrelated tracked changes.

## P1 - Real-Data Gate Prep

Goal: prepare for, but not start, real customer data.

Tasks:

- Re-run local DB/RLS proof.
- Confirm public quote inactive and active synthetic slug behavior.
- Confirm dashboard synthetic tenant access only in local environment.
- Review Phase 24G real-data approval criteria.
- Record explicit owner approval only when the owner intentionally grants it.

Exit criteria:

- Local DB/RLS proof passes.
- No production synthetic write is needed.
- Owner records explicit real-data approval.

## P2 - A1 Admin/Owner User Access

Goal: design owner/team access management safely.

Tasks:

- Finalize A1 owner/team access model.
- Decide whether migrations are required.
- Define route `/dashboard/settings/team`.
- Add unit, RLS, and dashboard smoke coverage.
- Preserve founder admin separation.

Exit criteria:

- Owner approves A1 scope.
- RLS tests prove tenant isolation.
- No hard delete or impersonation without separate gate.

## P3 - Pilot Ops And Payment Gate

Goal: make a limited paid pilot operationally safe.

Tasks:

- Close support process.
- Close refund/payment/manual billing process.
- Confirm backup/export/restore process.
- Confirm owner/customer onboarding runbook.
- Confirm monitoring and rollback plan.

Exit criteria:

- Paid pilot approval is explicit.
- Support/payment/rollback owner is named.
- No billing automation is implied unless implemented and tested.

## P4 - Product Validation And Future Expansion

Goal: expand only after validation evidence.

Allowed after validation:

- Owner notes.
- Source attribution.
- Validation dashboard.
- Manual email templates.
- Demo assets and founder-led outreach.

Still blocked before explicit gates:

- Customer email automation.
- SMS/WhatsApp automation.
- Booking.
- Invoicing.
- Billing automation.
- Calendar sync.
- Multi-vertical expansion.
- Full CRM positioning.
- Autonomous AI or auto-send.

## Recommended Next Prompt

```text
Continue BizPilot AI in E:\bizpilot-ai.

Do not use real customer data.
Do not start paid pilot.
Do not touch database/migrations/RLS/auth/AI provider/billing/payment.

Start P1 real-data gate prep only:
1. Confirm git is clean and main is synced.
2. Confirm local DB target is local.
3. Run pnpm test:rls or pnpm verify:local-db only against local DB.
4. Run local synthetic public and quote smokes.
5. Do not run dashboard smoke unless Supabase URL is local/synthetic.
6. Produce a report stating whether Phase 24G can be considered for owner approval.
```
