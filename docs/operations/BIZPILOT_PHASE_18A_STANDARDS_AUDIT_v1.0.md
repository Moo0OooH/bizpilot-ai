# BizPilot AI - Phase 18A Standards Audit v1.0

**Project:** BizPilot AI
**Document Type:** Standards Audit
**Version:** v1.0
**Status:** Phase 18A Pilot Readiness Evidence
**Owner:** MoOoH
**Last Updated:** 2026-05-22
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
| Public quote happy path | Pass | QA submission created lead `c20fda35-a508-440d-85f0-186b003c4d74` scoped to business `1b8f3cc6-4967-4ffe-9490-533c1c34c68b`. |
| Public abuse controls | Partial pass | Honeypot, consent validation, invalid-form handling, abuse logging, and per-business/IP rate limit service exist. |
| RLS tests | Pass | `pnpm test:rls` passed 11/11 on 2026-05-22 against local `127.0.0.1:54322/postgres`. |
| App verification | Pass | `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, and `pnpm build` passed on 2026-05-22. |
| Server-only secrets | Pass | `SUPABASE_SERVICE_ROLE_KEY` is read through `lib/env/server-env.ts` with `import "server-only"` and used through `lib/supabase/server.ts`. Source search did not find service-role usage in client components. |
| Repository/service boundary | Pass | Supabase `.from(...)` calls are concentrated in repositories and server services. UI components do not own direct database workflows. |
| Founder-led GTM support | Pass | Founder CRM workbook exists; Phase 18 founder workflow doc now covers outreach, demo, pilot offer decisions, and owner wording tracking. |
| Backup/export baseline | Partial pass | Backup/export strategy exists and lists critical tables and manual export outline. Open decisions remain for plan tier, PITR window, storage location, and restore drill timing. |

## 4. Gaps Before Real Pilot Traffic

| Gap | Standard Source | Risk | Next Action |
| --- | --- | --- | --- |
| Target Supabase project does not show migration `0014` fields. | Engineering Standard SQL-first migrations; Phase 18A handoff. | Public quote forms keep older combined contact field instead of separate phone/email/address fields. | Owner confirms target Supabase environment, then apply or verify `supabase/migrations/0014_cleaning_template_contact_address_fields.sql`. |
| Security headers/CSP are not configured in `next.config.ts`. | Security Standard Sections 7 and 18. | Browser hardening is incomplete before public pilot traffic. | Add a small headers baseline or document an explicit owner-accepted deferral before public pilot. |
| Minimum submit-time heuristic is not implemented. | Security Standard Section 6; Backend/RLS Standard Section 9. | Bot friction relies on honeypot plus rate limit only. | Either implement a small server-validated submit-time check in a future approved security task, or accept risk for founder-led pilot volume. |
| `OPENAI_API_KEY` is not set in `.env.local`. | Engineering Standard AI provider; Manual QA Checklist. | Model-backed AI demo cannot be verified in this environment. | Provide key for model-backed demo QA, or keep demo on rule fallback and mark model-backed path unverified. |
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

## 6. Recommended Next Order

1. Owner confirms target Supabase environment for migration `0014`.
2. Apply/verify `0014` in that environment.
3. Decide whether security headers and minimum submit-time heuristic are required before first public pilot link.
4. Record Supabase plan/PITR/export storage decisions.
5. Decide pilot offer terms.
6. Add 10 real prospects to Founder CRM.
7. Run one final demo dry run using the real demo business details.
8. Use the domain deployment runbook and production QA checklist only after the production environment target is decided.
