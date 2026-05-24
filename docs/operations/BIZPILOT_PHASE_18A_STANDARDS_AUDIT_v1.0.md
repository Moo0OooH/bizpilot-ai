# BizPilot AI - Phase 18A Standards Audit v1.0

**Project:** BizPilot AI
**Document Type:** Standards Audit
**Version:** v1.0
**Status:** Historical Phase 18A Pilot Readiness Evidence
**Owner:** MoOoH
**Last Updated:** 2026-05-23
**Related:**
- `docs/CURRENT_CANONICAL_DOCS_v1.7.md`
- `docs/AI_CODING_AGENT_START_HERE_v1.7.md`
- `docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.5.md`
- `docs/security/BIZPILOT_SECURITY_PRIVACY_COMPLIANCE_STANDARD_v1.5.md`
- `docs/engineering/BIZPILOT_BACKEND_DATABASE_RLS_STANDARD_v1.5.md`
- `docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v1.0.md`

## 1. Purpose

This audit cross-checks Phase 18A pilot readiness against the active standards so the project does not confuse "browser QA passed" with "everything needed before pilots is complete."

No product scope was expanded during this audit.

Current note: this is a historical Phase 18A/19H standards snapshot. For the active Phase 21 production-target/schema/RLS truth, use `docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v1.0.md`, `docs/readiness/PHASE_21B_PRODUCTION_MIGRATION_DRIFT_MAP.md`, `docs/readiness/PHASE_21D_PRODUCTION_MIGRATION_APPLY_RESULT.md`, and `docs/readiness/PHASE_21_NEXT_TAB_HANDOFF.md`.

## 2. Standards Read

Read and checked:

- `docs/CURRENT_CANONICAL_DOCS_v1.7.md`
- `docs/AI_CODING_AGENT_START_HERE_v1.7.md`
- `docs/BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md`
- `docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.5.md`
- `docs/security/BIZPILOT_SECURITY_PRIVACY_COMPLIANCE_STANDARD_v1.5.md`
- `docs/engineering/BIZPILOT_BACKEND_DATABASE_RLS_STANDARD_v1.5.md`
- `docs/operations/BIZPILOT_BACKUP_AND_EXPORT_STRATEGY_v1.0.md`
- `docs/operations/BIZPILOT_MANUAL_QA_CHECKLIST_v1.0.md`
- `docs/operations/BIZPILOT_DOMAIN_DEPLOYMENT_RUNBOOK_v1.0.md`
- `docs/operations/BIZPILOT_POST_DOMAIN_EXECUTION_ROADMAP_v1.0.md`
- `docs/operations/BIZPILOT_PRODUCTION_QA_CHECKLIST_v1.0.md`

## 3. Verified Evidence

| Standard Area | Status | Evidence |
| --- | --- | --- |
| MVP scope lock | Pass | Code/docs checked for not-now scope. Existing mentions frame booking, invoices, SMS/WhatsApp, full CRM, and automation as blocked or objection-tracking only. |
| Owner-reviewed AI | Pass | Lead detail QA showed manual on-demand AI draft area, "Nothing is sent automatically", copy/status controls, and no send action. |
| Public quote happy path | Pass | QA submission created lead `fee660c2-c3aa-43d5-a234-1c58502510b0` scoped to business `1b8f3cc6-4967-4ffe-9490-533c1c34c68b`. |
| Public abuse controls | Pass | Honeypot, consent validation, invalid-form handling, abuse logging, per-business/IP rate limit service, and minimum submit-age rejection are implemented. Fast POST `Phase18CFast1779480270544` created no lead. |
| Security headers/CSP | Pass | `next.config.ts` sets CSP, Referrer-Policy, X-Content-Type-Options, X-Frame-Options, and Permissions-Policy; verified on `/pricing` with `Invoke-WebRequest`. |
| RLS tests | Pass | `pnpm test:rls` passed 12/12 on 2026-05-22 against local Supabase through temporary Docker proxy `127.0.0.1:15432/postgres`. |
| App verification | Pass | `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, and `pnpm build` passed on 2026-05-22. |
| Server-only secrets | Pass | `SUPABASE_SERVICE_ROLE_KEY` is read through `lib/env/server-env.ts` with `import "server-only"` and used through `lib/supabase/server.ts`. Source search did not find service-role usage in client components. |
| Repository/service boundary | Pass | Supabase `.from(...)` calls are concentrated in repositories and server services. UI components do not own direct database workflows. |
| Founder-led GTM support | Pass | Phase 19G added the current CSV prospect template and outreach playbook. The older workbook path is documented but the xlsx artifact is not present in this workspace. |
| Backup/export baseline | Open | Backup/export strategy exists and lists critical tables and manual export outline. Open decisions remain for plan tier, PITR window, storage location, and restore drill timing. |

## 4. Gaps Before Real Pilot Traffic

| Gap | Standard Source | Risk | Next Action |
| --- | --- | --- | --- |
| Production migration verification is owner-reported, not independently re-queried by this repo pass. | Engineering Standard SQL-first migrations; Phase 18A handoff. | Owner reported migrations `0001` through `0017` were successfully applied to `bizpilot-production`, but this local pass did not connect to production. | Before outreach, confirm key columns/functions/policies in Supabase SQL editor or provide a safe production-equivalent connection for inspection. |
| `OPENAI_API_KEY` is not set in `.env.local`. | Engineering Standard AI provider; Manual QA Checklist. | Model-backed AI demo cannot be verified in this environment. | Provide key for model-backed demo QA, or keep demo on rule fallback and mark model-backed path unverified. |
| Production auth/email provider reliability needs one final smoke pass. | Production QA Checklist. | Recent fixes separated signup confirmation, recovery, reset session clearing, and auth redirect origin handling; Supabase email rate limits and SMTP defaults can still block owner tests. | Test one fresh signup confirmation and one password reset on `https://bizpilo.com` after rate limits clear. |
| Supabase plan tier and PITR window are not documented. | Backup/export strategy Section 10. | Backup posture is not fully decision-ready for real customer data. | Owner records project plan tier, PITR window, export storage location, and restore drill decision. |
| Real pilot pricing and refund/cancellation wording are undecided. | GTM Playbook and Pilot Readiness Checklist. | Sales conversations can drift or promise inconsistent terms. | Owner approves pilot price, setup fee, trial, cancellation, and refund handling before outreach. |
| 10 real cleaning prospects are not entered yet. | Strategic Alignment Update customer discovery loop. | Validation cannot start without real prospect pipeline. | Owner fills Founder CRM with at least 10 real cleaning businesses. |

## 5. Not A Gap

These were checked and do not currently require new product scope:

- Founder CRM should remain a workbook, not a product feature.
- SMS and WhatsApp should remain disabled/future-only.
- Booking, invoices, full CRM, marketplace, mobile app, second vertical, and autonomous AI remain blocked.
- Billing can stay manual for pilot; Stripe implementation is not required now.
- AI can remain fallback-capable when `OPENAI_API_KEY` is unset, but model-backed QA remains separate.

## 5A. Phase 19H Standards Sync

This section updates the audit with Phase 19 evidence. It does not change the product scope.

| Standards Area | Status | Current Evidence |
| --- | --- | --- |
| Scope lock | Pass | Phase 19 added readiness/docs/support artifacts only; no booking, invoices, SMS/WhatsApp automation, auto-send, full CRM, mobile app, or new vertical work was added. |
| Auth safety | Pass | Signup/reset architecture remains separated. Commit `7fe0475` made callback copy safer for confirmed signup links whose session exchange fails. |
| Production auth smoke | Open | Supabase throttling prevented final clean signup confirmation/reset-password smoke after latest auth callback messaging fix. |
| Service-role boundary | Pass | Founder admin service uses service role only after `assertFounderUser`; `/admin` is sign-in and founder allowlist gated. |
| Production schema/migrations | Historical blocker, superseded by Phase 21 | At Phase 19H this was blocked by checked-target schema probes. Phase 21 later confirmed the corrected production target and verified the key objects directly; see Section 5B. |
| Public quote fr-CA smoke | Blocked | Could not create a disposable fr-CA business/link/lead because the checked production schema did not match the current multilingual code. |
| AI fallback safety | Pass | Fallback is sanitized and manual-send only. |
| OpenAI real-key output | Blocked | Real OpenAI output was not verified because `OPENAI_API_KEY` is empty. |
| Backup/export/privacy process | Pass | Runbook documents backup/export/restore, deletion/export requests, and privacy incident handling. |
| Backup/export/restore execution | Blocked | No dump or restore drill was performed. |
| Commercial readiness | Owner decision required | Pricing default is drafted, but final price/setup/trial/refund/cancellation/payment collection are not approved. |
| Customer validation | Owner decision required | Templates/playbook exist; real prospects and outreach are not entered/completed. |

## 5B. Phase 21 Superseding Note

Phase 21 supersedes the Phase 19C production schema blocker recorded above:

- corrected production Supabase target is `bizpilot-production` / `qfqendrqimqvkoojpjao`,
- required columns/functions, expected `0018` lifecycle/deletion objects, RLS-enabled status, public policy list, function definitions, `0019` grants, and targeted constraints/seeds are verified,
- `supabase_migrations.schema_migrations` is missing, so production remains schema-without-standard-migration-history/manual drift,
- no real customer pilot is approved yet because backup/PITR/export/restore, production quote/auth smoke, OpenAI 429, commercial terms, and real customer validation remain unresolved.

## 6. Recommended Next Order

1. Re-run the local validation gates after any final code/doc hardening: `pnpm verify`, `pnpm test:rls`, and `git diff --check`.
2. Run Phase 21E production public quote security smoke with synthetic data only after test setup/cleanup is recorded.
3. Run Phase 21F fr-CA production quote smoke after Phase 21E passes.
4. Run one production auth smoke pass on `https://bizpilo.com`: signup confirmation, sign-in, forgot password, reset password, invalid/expired reset link.
5. Record Supabase plan/PITR/export storage decisions.
6. Resolve OpenAI HTTP `429` and review one synthetic model-backed output.
7. Decide pilot offer terms.
8. Add 10 real prospects to Founder CRM.
9. Run one final demo dry run using the real demo business details.
