# BizPilot AI - Pilot Readiness Checklist v1.0

**Project:** BizPilot AI  
**Document Type:** Pilot Readiness Checklist  
**Version:** v1.0  
**Status:** Required Before Phase 18 Pilot  
**Owner:** MoOoH  
**Last Updated:** 2026-05-22
**Related:**
- `docs/CURRENT_CANONICAL_DOCS_v1.7.md`
- `docs/BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md`
- `docs/operations/BIZPILOT_MANUAL_QA_CHECKLIST_v1.0.md`
- `docs/operations/BIZPILOT_BACKUP_AND_EXPORT_STRATEGY_v1.0.md`
- `docs/gtm/BIZPILOT_GTM_PLAYBOOK_v1.1.md`
- `docs/finance/BIZPILOT_COST_CONTROL_AND_UNIT_ECONOMICS_v1.0.md`

---

## 1. Purpose

This checklist decides whether BizPilot AI is ready to begin Phase 18: founder-led pilots with three cleaning businesses.

Pilot readiness is not feature expansion. It confirms that the current Lead Recovery & Response MVP is safe, focused, demoable, and operationally calm enough to put in front of real cleaning-business owners.

## 2. Entry Criteria

Do not begin Phase 18 until these are true:

| Gate | PASS | FAIL | Evidence |
| --- | --- | --- | --- |
| `pnpm test:rls` passes all 11 files. | [x] | [ ] | 2026-05-22: `pnpm test:rls` passed 11/11 against local `127.0.0.1:54322/postgres`. |
| `pnpm typecheck` is clean. | [x] | [ ] | 2026-05-22: `pnpm typecheck` passed. |
| `pnpm build` succeeds. | [x] | [ ] | 2026-05-22: `pnpm build` passed with Next.js 16.2.4. |
| Manual QA checklist is complete or explicitly risk-accepted. | [ ] | [x] | Phase 18A browser QA passed core routes, but target Supabase migration `0014` remains unresolved and should be risk-accepted or applied before pilot. |
| Business configuration save round-trip works. | [x] | [ ] | 2026-05-22 browser QA: fresh QA workspace saved Quote Setup, then `/quote/spark-shine-phase18a-qa-1779420058961` became active. |
| Public quote submission creates a tenant-scoped lead. | [x] | [ ] | 2026-05-22 browser QA: public quote submission created lead `c20fda35-a508-440d-85f0-186b003c4d74`; lead `business_id` matched the active public link tenant `1b8f3cc6-4967-4ffe-9490-533c1c34c68b`. |
| AI remains manual, owner-reviewed, and non-sending. | [x] | [ ] | 2026-05-22 browser QA: lead detail shows "Manual, on-demand drafts. Nothing is sent automatically", "Owner reviewed", copy/status controls, and no send action. |

## 3. Infrastructure Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Supabase project plan tier is documented. | [ ] | [ ] |  |
| Supabase point-in-time recovery window is documented. | [ ] | [ ] |  |
| Supabase Security Advisor reviewed. | [ ] | [ ] |  |
| Supabase Performance Advisor reviewed. | [ ] | [ ] |  |
| Migrations `0010`, `0011`, `0012`, and `0013` are applied in the target project. | [ ] | [ ] |  |
| Migration `0014_cleaning_template_contact_address_fields.sql` is applied in the target project. | [ ] | [x] | 2026-05-22: current app Supabase project did not contain `customer_phone`, `customer_email`, or `home_address` for `cleaning-smart-quote-v1`; owner must confirm target environment before applying. |
| `public.public_can_insert_submission_value` exists and grants EXECUTE to `anon`, `authenticated`, `service_role`. | [ ] | [ ] |  |
| `public.record_public_submission_attempt` exists and grants EXECUTE to `anon`, `authenticated`, `service_role`. | [ ] | [ ] |  |
| `public.count_recent_public_submission_attempts` exists and grants EXECUTE to `anon`, `authenticated`, `service_role`. | [ ] | [ ] |  |
| RLS test cadence is documented if CI is not wired yet. | [ ] | [ ] |  |
| No service-role key is present in browser/client code. | [ ] | [ ] |  |
| Security headers/CSP baseline is configured or explicitly risk-accepted. | [ ] | [x] | 2026-05-22 standards audit: `next.config.ts` has no security headers/CSP baseline yet. |
| Minimum submit-time heuristic is configured or explicitly risk-accepted. | [ ] | [x] | 2026-05-22 standards audit: honeypot and rate limit exist, but no submit-time heuristic was found. |

## 4. Environment and Secrets

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| `.env.local` has valid Supabase URL and anon key. | [x] | [ ] | 2026-05-22: present and used for browser QA against the configured app project. |
| `.env.local` has service-role key only for server-side bootstrap use. | [x] | [ ] | 2026-05-22: service-role key is present; no browser/client service-role exposure was found in source search. |
| `OPENAI_API_KEY` is present for model-backed demo testing. | [ ] | [x] | 2026-05-22: `OPENAI_API_KEY` is not set in `.env.local`; AI demo can still use fallback/manual evidence until key is provided. |
| App still works with `OPENAI_API_KEY` unset through rule fallback. | [x] | [ ] | 2026-05-22: dashboard, quote submission, lead queue, and lead detail loaded with `OPENAI_API_KEY` unset. |
| `.env.example` matches required env variables without real secrets. | [ ] | [ ] |  |
| Secret scan performed before pilot branch/deploy. | [ ] | [ ] |  |
| Supabase and GitHub owner/admin accounts use MFA. | [ ] | [ ] |  |

## 5. Backup and Export Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Backup/export strategy document reviewed. | [x] | [ ] | 2026-05-22 standards audit reviewed `BIZPILOT_BACKUP_AND_EXPORT_STRATEGY_v1.0.md`. |
| Critical data tables are documented. | [x] | [ ] | Backup/export strategy Section 4 maps identity, tenant, configuration, public intake, submissions/leads, lead intelligence, AI artifacts, and reference tables. |
| Manual export path is understood by the operator. | [ ] | [x] | Manual `pg_dump` path is outlined, but operator decision/storage location and first export are still open. |
| Export storage location is decided and encrypted. | [ ] | [ ] |  |
| Auth migration risk is accepted for pilot. | [x] | [ ] | Backup/export strategy Section 8 accepts Supabase Auth migration risk for pilot. |
| Restore drill is scheduled or explicitly deferred with reason. | [ ] | [x] | Backup/export strategy says restore procedure is placeholder only; owner decision still needed. |
| Export is performed before first real pilot data is collected, or accepted as risk. | [ ] | [ ] |  |

## 6. Product and Demo Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Demo business is configured as a cleaning business. | [ ] | [ ] |  |
| Demo public quote link is active. | [x] | [ ] | 2026-05-22: QA quote link `/quote/spark-shine-phase18a-qa-1779420058961` active after Quote Setup save. |
| Demo sample lead exists or can be created live. | [x] | [ ] | 2026-05-22: live QA lead `c20fda35-a508-440d-85f0-186b003c4d74` created from public quote submission. |
| Dashboard shows a clear first-three-minute Magic Moment. | [x] | [ ] | 2026-05-22: `/dashboard` showed urgent lead review CTA, lead queue preview, quote link readiness, and manual owner control language. |
| Lead detail includes summary, missing info, reply draft, and follow-up action. | [x] | [ ] | 2026-05-22: `/dashboard/leads/c20fda35-a508-440d-85f0-186b003c4d74` showed lead details, missing info, recommended action, AI summary panel, and action item. |
| Founder can copy a reply but nothing is sent automatically. | [x] | [ ] | 2026-05-22: lead detail exposes copy/manual controls and states nothing is sent automatically. |
| Demo script leads with quote recovery, not generic AI platform language. | [ ] | [ ] |  |
| Landing page or sales one-pager draft uses cleaning-first positioning. | [ ] | [ ] |  |

## 7. Founder-Led GTM Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| 3+ cleaning businesses identified for outreach. | [ ] | [ ] |  |
| Founder CRM spreadsheet/template exists. | [x] | [ ] | `artifacts/phase18/BizPilot_Phase18_Founder_CRM_Template.xlsx`. |
| Outreach status is tracked. | [x] | [ ] | Founder CRM template includes demo/pilot status and next action fields. |
| Owner objections and exact customer language are tracked. | [x] | [ ] | Founder CRM template includes objection and owner wording tracking; see Phase 18 founder-led workflow doc. |
| Demo dates and follow-up dates are tracked. | [x] | [ ] | Founder CRM template supports contacted/demo/follow-up dates. |
| Willingness-to-pay notes are tracked. | [x] | [ ] | Founder CRM template includes willingness-to-pay tracking. |
| Pilot retention notes are tracked weekly. | [x] | [ ] | Weekly Loop and Pilot Retention sheets exist in Founder CRM template. |
| Concierge onboarding checklist is ready for the first customer. | [x] | [ ] | Concierge Setup sheet exists in Founder CRM template. |

## 8. Pricing and Commercial Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Pilot price is selected, expected range `$29-$49/mo`. | [ ] | [x] | Owner decision still needed. |
| Founder offer price is selected, expected range `$49-$99/mo`. | [ ] | [x] | GTM playbook recommends Founder Plus at `$299 setup + $79/mo`; owner must approve final pilot offer. |
| Setup fee, if any, is decided. | [ ] | [x] | Owner decision still needed. |
| Billing is manual for pilot; no Stripe implementation is required. | [ ] | [ ] |  |
| Refund/cancellation handling is written down. | [ ] | [x] | Owner decision still needed. |
| Owner knows this is a pilot and not a full CRM/booking product. | [ ] | [ ] |  |

## 9. Support and Incident Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Support contact channel is defined. | [ ] | [ ] |  |
| Manual data deletion/minimization request process is documented or accepted as deferred risk. | [ ] | [ ] | Phase 14 remains deferred by owner preference. |
| Privacy incident register process exists or is accepted as deferred risk. | [ ] | [ ] |  |
| Public quote abuse response path is known. | [ ] | [ ] |  |
| Owner-facing fallback plan exists if AI provider is unavailable. | [ ] | [ ] |  |
| Rollback plan for deploy issues is documented. | [ ] | [ ] |  |

## 10. Validation Gate Before Expansion

Do not begin Phase 8 expansion, Phase 9 second vertical, booking, billing, messaging automation, or full CRM work until BizPilot has:

| Validation Signal | PASS | FAIL | Evidence |
| --- | --- | --- | --- |
| At least 3 paying or payment-ready cleaning businesses. | [ ] | [ ] |  |
| Repeated weekly usage. | [ ] | [ ] |  |
| Healthy retention signal. | [ ] | [ ] |  |
| Real quote submissions. | [ ] | [ ] |  |
| Evidence that AI drafts save owner time. | [ ] | [ ] |  |
| At least one testimonial or strong qualitative proof. | [ ] | [ ] |  |
| Founder-led onboarding notes from real customers. | [ ] | [ ] |  |

## 11. Phase 18 Start Decision

Phase 18 may start only when:

```text
Manual QA is complete
+ pilot infrastructure is understood
+ backup/export risk is accepted
+ founder GTM tracking is ready
+ demo flow proves value in under 3 minutes
+ pricing is decided
+ no deferred item weakens RLS, privacy, or customer trust
```

Record the decision:

| Decision | Owner | Date | Notes |
| --- | --- | --- | --- |
| [ ] Start Phase 18 pilot |  |  |  |
| [ ] Do not start; blockers remain |  |  |  |
