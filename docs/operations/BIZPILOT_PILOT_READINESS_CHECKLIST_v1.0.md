# BizPilot AI - Pilot Readiness Checklist v1.0

**Project:** BizPilot AI  
**Document Type:** Pilot Readiness Checklist  
**Version:** v1.0  
**Status:** Required Before Phase 18 Pilot  
**Owner:** MoOoH  
**Last Updated:** 2026-05-17  
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
| `pnpm test:rls` passes all 11 files. | [ ] | [ ] |  |
| `pnpm typecheck` is clean. | [ ] | [ ] |  |
| `pnpm build` succeeds. | [ ] | [ ] |  |
| Manual QA checklist is complete or explicitly risk-accepted. | [ ] | [ ] |  |
| Business configuration save round-trip works. | [ ] | [ ] |  |
| Public quote submission creates a tenant-scoped lead. | [ ] | [ ] |  |
| AI remains manual, owner-reviewed, and non-sending. | [ ] | [ ] |  |

## 3. Infrastructure Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Supabase project plan tier is documented. | [ ] | [ ] |  |
| Supabase point-in-time recovery window is documented. | [ ] | [ ] |  |
| Supabase Security Advisor reviewed. | [ ] | [ ] |  |
| Supabase Performance Advisor reviewed. | [ ] | [ ] |  |
| Migrations `0010`, `0011`, `0012`, and `0013` are applied in the target project. | [ ] | [ ] |  |
| `public.public_can_insert_submission_value` exists and grants EXECUTE to `anon`, `authenticated`, `service_role`. | [ ] | [ ] |  |
| `public.record_public_submission_attempt` exists and grants EXECUTE to `anon`, `authenticated`, `service_role`. | [ ] | [ ] |  |
| `public.count_recent_public_submission_attempts` exists and grants EXECUTE to `anon`, `authenticated`, `service_role`. | [ ] | [ ] |  |
| RLS test cadence is documented if CI is not wired yet. | [ ] | [ ] |  |
| No service-role key is present in browser/client code. | [ ] | [ ] |  |

## 4. Environment and Secrets

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| `.env.local` has valid Supabase URL and anon key. | [ ] | [ ] |  |
| `.env.local` has service-role key only for server-side bootstrap use. | [ ] | [ ] |  |
| `OPENAI_API_KEY` is present for model-backed demo testing. | [ ] | [ ] |  |
| App still works with `OPENAI_API_KEY` unset through rule fallback. | [ ] | [ ] |  |
| `.env.example` matches required env variables without real secrets. | [ ] | [ ] |  |
| Secret scan performed before pilot branch/deploy. | [ ] | [ ] |  |
| Supabase and GitHub owner/admin accounts use MFA. | [ ] | [ ] |  |

## 5. Backup and Export Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Backup/export strategy document reviewed. | [ ] | [ ] |  |
| Critical data tables are documented. | [ ] | [ ] |  |
| Manual export path is understood by the operator. | [ ] | [ ] |  |
| Export storage location is decided and encrypted. | [ ] | [ ] |  |
| Auth migration risk is accepted for pilot. | [ ] | [ ] |  |
| Restore drill is scheduled or explicitly deferred with reason. | [ ] | [ ] |  |
| Export is performed before first real pilot data is collected, or accepted as risk. | [ ] | [ ] |  |

## 6. Product and Demo Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Demo business is configured as a cleaning business. | [ ] | [ ] |  |
| Demo public quote link is active. | [ ] | [ ] |  |
| Demo sample lead exists or can be created live. | [ ] | [ ] |  |
| Dashboard shows a clear first-three-minute Magic Moment. | [ ] | [ ] |  |
| Lead detail includes summary, missing info, reply draft, and follow-up action. | [ ] | [ ] |  |
| Founder can copy a reply but nothing is sent automatically. | [ ] | [ ] |  |
| Demo script leads with quote recovery, not generic AI platform language. | [ ] | [ ] |  |
| Landing page or sales one-pager draft uses cleaning-first positioning. | [ ] | [ ] |  |

## 7. Founder-Led GTM Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| 3+ cleaning businesses identified for outreach. | [ ] | [ ] |  |
| Founder CRM spreadsheet/template exists. | [ ] | [ ] |  |
| Outreach status is tracked. | [ ] | [ ] |  |
| Owner objections and exact customer language are tracked. | [ ] | [ ] |  |
| Demo dates and follow-up dates are tracked. | [ ] | [ ] |  |
| Willingness-to-pay notes are tracked. | [ ] | [ ] |  |
| Pilot retention notes are tracked weekly. | [ ] | [ ] |  |
| Concierge onboarding checklist is ready for the first customer. | [ ] | [ ] |  |

## 8. Pricing and Commercial Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Pilot price is selected, expected range `$29-$49/mo`. | [ ] | [ ] |  |
| Founder offer price is selected, expected range `$49-$99/mo`. | [ ] | [ ] |  |
| Setup fee, if any, is decided. | [ ] | [ ] |  |
| Billing is manual for pilot; no Stripe implementation is required. | [ ] | [ ] |  |
| Refund/cancellation handling is written down. | [ ] | [ ] |  |
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

