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
| `pnpm test:rls` passes all files. | [x] | [ ] | 2026-05-22: `pnpm test:rls` passed 12/12 against local Supabase Postgres through a temporary Docker port proxy at `127.0.0.1:15432/postgres`; direct `54322` host publish was unavailable in Docker Desktop. |
| `pnpm typecheck` is clean. | [x] | [ ] | 2026-05-22: `pnpm typecheck` passed. |
| `pnpm build` succeeds. | [x] | [ ] | 2026-05-22: `pnpm build` passed with Next.js 16.2.4. |
| Manual QA checklist is complete or explicitly risk-accepted. | [x] | [ ] | 2026-05-22 browser QA passed core routes with no application or console errors. Public quote submission was verified through the rendered Next form action after the quote-form and submit-age safety fixes. Target Supabase migrations `0014`, `0015`, and `0016` still need owner-approved target environment application before real pilots. |
| Business configuration save round-trip works. | [x] | [ ] | 2026-05-22 browser QA: fresh QA workspace saved Quote Setup, then `/quote/spark-shine-phase18a-qa-1779420058961` became active. |
| Public quote submission creates a tenant-scoped lead. | [x] | [ ] | 2026-05-22: `/quote/spark-shine-phase18a-qa-1779420058961` created lead `fee660c2-c3aa-43d5-a234-1c58502510b0`; lead `business_id` matched active public link tenant `1b8f3cc6-4967-4ffe-9490-533c1c34c68b`. Earlier browser QA also created lead `f2a2a970-4184-419a-8f85-faa063bf1292`. |
| AI remains manual, owner-reviewed, and non-sending. | [x] | [ ] | 2026-05-22 browser QA: `/dashboard/leads/b98fb510-b9ec-4774-b30f-20cf8d9421e3` showed AI summary, missing info, reply draft, follow-up controls, and manual copy actions only (`Copy reply`, `Copy follow-up`). |

## 3. Infrastructure Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Supabase project plan tier is documented. | [ ] | [ ] |  |
| Supabase point-in-time recovery window is documented. | [ ] | [ ] |  |
| Supabase Security Advisor reviewed. | [ ] | [ ] |  |
| Supabase Performance Advisor reviewed. | [ ] | [ ] |  |
| Migrations `0010`, `0011`, `0012`, and `0013` are applied in the target project. | [ ] | [ ] |  |
| Migration `0014_cleaning_template_contact_address_fields.sql` is applied in the target project. | [ ] | [x] | 2026-05-22: applied and verified locally; `customer_phone`, `customer_email`, and `home_address` exist in local `industry_template_fields`. Owner must still confirm target Supabase environment before production/remote application. |
| Migration `0015_business_access_plan_and_admin_log.sql` is applied in the target project. | [ ] | [x] | 2026-05-22: applied and verified locally; `businesses.plan_slug`, `businesses.status`, and `admin_action_log` exist locally. Owner must confirm target Supabase environment before production/remote application. |
| Migration `0016_public_submission_minimum_submit_age_reason.sql` is applied in the target project. | [ ] | [x] | 2026-05-22: applied and verified locally; `public_submission_abuse_log_reason_check` accepts `submitted_too_fast`. Owner must confirm target Supabase environment before production/remote application. |
| `public.public_can_insert_submission_value` exists and grants EXECUTE to `anon`, `authenticated`, `service_role`. | [ ] | [ ] |  |
| `public.record_public_submission_attempt` exists and grants EXECUTE to `anon`, `authenticated`, `service_role`. | [ ] | [ ] |  |
| `public.count_recent_public_submission_attempts` exists and grants EXECUTE to `anon`, `authenticated`, `service_role`. | [ ] | [ ] |  |
| RLS test cadence is documented if CI is not wired yet. | [ ] | [ ] |  |
| No service-role key is present in browser/client code. | [ ] | [ ] |  |
| Security headers/CSP baseline is configured or explicitly risk-accepted. | [x] | [ ] | 2026-05-22: `next.config.ts` now sets CSP, Referrer-Policy, X-Content-Type-Options, X-Frame-Options, and Permissions-Policy. Verified on `http://127.0.0.1:3000/pricing` with `Invoke-WebRequest`. |
| Minimum submit-time heuristic is configured or explicitly risk-accepted. | [x] | [ ] | 2026-05-22: public quote form now submits a hidden render-time marker; server rejects missing/too-fast submissions with safe copy and logs `submitted_too_fast`. Fast POST returned 303 error and created no lead; delayed POST created lead `fee660c2-c3aa-43d5-a234-1c58502510b0`. |

## 4. Environment and Secrets

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| `.env.local` has valid Supabase URL and anon key. | [x] | [ ] | 2026-05-22: present and used for browser QA against the configured app project. |
| `.env.local` has service-role key only for server-side bootstrap use. | [x] | [ ] | 2026-05-22: service-role key is present; no browser/client service-role exposure was found in source search. |
| `OPENAI_API_KEY` is present for model-backed demo testing. | [ ] | [x] | 2026-05-22: `OPENAI_API_KEY` is not set in `.env.local`; AI demo can still use fallback/manual evidence until key is provided. |
| App still works with `OPENAI_API_KEY` unset through rule fallback. | [x] | [ ] | 2026-05-22: dashboard, quote submission, lead queue, and lead detail loaded with `OPENAI_API_KEY` unset. |
| `.env.example` matches required env variables without real secrets. | [x] | [ ] | 2026-05-22: `.env.example` includes `BIZPILOT_FOUNDER_EMAILS` for founder-only `/admin`; no real secrets added. |
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
| Demo sample lead exists or can be created live. | [x] | [ ] | 2026-05-22: live QA lead `fee660c2-c3aa-43d5-a234-1c58502510b0` created from public quote submission after the form and submit-age safety fixes. |
| Dashboard shows a clear first-three-minute Magic Moment. | [x] | [ ] | 2026-05-22: `/dashboard` showed urgent lead review CTA, lead queue preview, quote link readiness, and manual owner control language. |
| Lead detail includes summary, missing info, reply draft, and follow-up action. | [x] | [ ] | 2026-05-22: `/dashboard/leads/b98fb510-b9ec-4774-b30f-20cf8d9421e3` showed lead details, missing info, recommended action, AI summary panel, and copy-only follow-up controls. |
| Founder can copy a reply but nothing is sent automatically. | [x] | [ ] | 2026-05-22: lead detail exposes `Copy reply` and `Copy follow-up`; no customer send action was present. |
| Mini Founder Admin exists for manual plan/access control. | [x] | [ ] | 2026-05-22: `/admin` added as founder-only internal route with plan/status/quote-link/internal-note controls. Full data view requires `BIZPILOT_FOUNDER_EMAILS` and target migration `0015`. |
| Public quote form can be submitted without client-side step navigation risk. | [x] | [ ] | 2026-05-22: public quote form was changed to visible Service / When & where / Contact sections with direct submit; final route QA confirmed the quote page rendered a submit-age value and the rendered Next form action created tenant-scoped lead `fee660c2-c3aa-43d5-a234-1c58502510b0`. |
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
| Billing is manual for pilot; no Stripe implementation is required. | [x] | [ ] | 2026-05-22: `/admin` manual plan assignment and plan entitlement docs added; no Stripe Billing implementation added. |
| Refund/cancellation handling is written down. | [ ] | [x] | Owner decision still needed. |
| Owner knows this is a pilot and not a full CRM/booking product. | [ ] | [ ] |  |

## 9. Support and Incident Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Support contact channel is defined. | [ ] | [x] | Support/internal notes workflow exists, but the actual support channel owner should use with customers is still an owner decision. |
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
