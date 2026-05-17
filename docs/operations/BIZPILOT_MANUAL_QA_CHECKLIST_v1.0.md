# BizPilot AI - Manual QA Checklist v1.0

**Project:** BizPilot AI  
**Document Type:** Manual QA Checklist  
**Version:** v1.0  
**Status:** Required Before Phase 18 Pilot  
**Owner:** MoOoH  
**Last Updated:** 2026-05-17  
**Related:**
- `docs/CURRENT_CANONICAL_DOCS_v1.7.md`
- `docs/AI_CODING_AGENT_START_HERE_v1.7.md`
- `docs/BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md`
- `docs/operations/BIZPILOT_MVP_HARDENING_CHECKLIST_v1.0.md`
- `docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v1.0.md`

---

## 1. Purpose

This checklist is the Phase 17 manual verification gate before BizPilot AI is shown to real cleaning-business pilots.

BizPilot is currently a Lead Recovery & Response System for cleaning businesses. QA must prove the active MVP helps an owner capture quote requests, understand lead urgency, prepare a safe owner-reviewed reply, and follow up without expanding into booking, billing, autonomous sending, or a full CRM.

Use this checklist after the local verification gate is green:

```text
pnpm test:rls -> 11/11 pass
pnpm typecheck -> clean
pnpm build -> success
Business configuration save -> green success notice
```

## 2. QA Rules

- Run QA against a local or staging environment, not production customer data.
- Use two separate owner accounts for cross-tenant checks.
- Use cleaning-business examples only.
- Mark every row as PASS, FAIL, BLOCKED, or ACCEPTED RISK.
- Record evidence: browser URL, account used, timestamp, and notes.
- Do not mark pilot-ready while any security, tenant-isolation, public quote, or AI owner-review item is failing.

## 3. Environment Record

| Field | Value |
| --- | --- |
| QA date |  |
| Tester |  |
| App URL |  |
| Supabase project/local DB |  |
| Browser and viewport |  |
| Commit SHA / branch |  |
| `pnpm test:rls` result |  |
| `pnpm typecheck` result |  |
| `pnpm build` result |  |

## 4. Build and Route Health

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| `pnpm install` completes with the pinned package manager. | [ ] | [ ] |  |
| `pnpm test:rls` passes all 11 RLS files. | [ ] | [ ] |  |
| `pnpm typecheck` completes cleanly. | [ ] | [ ] |  |
| `pnpm build` completes successfully. | [ ] | [ ] |  |
| `/` loads without a server error. | [ ] | [ ] |  |
| `/auth/sign-up` loads. | [ ] | [ ] |  |
| `/auth/sign-in` loads. | [ ] | [ ] |  |
| `/dashboard` redirects unauthenticated users to sign-in. | [ ] | [ ] |  |
| Dashboard routes do not expose server stack traces or raw provider errors. | [ ] | [ ] |  |

## 5. Auth and Tenant Foundation

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Sign-up creates a new user. | [ ] | [ ] |  |
| Sign-up creates a business for that user. | [ ] | [ ] |  |
| Sign-up creates the founding business membership. | [ ] | [ ] |  |
| New owner lands in the protected dashboard after sign-up or sign-in. | [ ] | [ ] |  |
| Sign-in works for an existing owner. | [ ] | [ ] |  |
| Sign-out works and clears dashboard access. | [ ] | [ ] |  |
| Owner A cannot see Owner B's businesses, leads, submissions, AI outputs, or usage events. | [ ] | [ ] |  |
| Auth errors are safe and user-facing. | [ ] | [ ] |  |

## 6. Dashboard Overview

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| `/dashboard` loads for an authenticated owner. | [ ] | [ ] |  |
| Dashboard presents quote recovery, not generic CRM/platform language. | [ ] | [ ] |  |
| Needs Attention strip renders without overlap at 1440px / 100% zoom. | [ ] | [ ] |  |
| Public quote link appears and can be copied. | [ ] | [ ] |  |
| Lead Recovery Queue shows recent leads or a useful empty state. | [ ] | [ ] |  |
| Recovery proof metrics use honest product data only. | [ ] | [ ] |  |
| Primary next action is obvious. | [ ] | [ ] |  |

## 7. Business Configuration

For each tab, edit one safe field, save, refresh, and confirm the saved value persists.

| Tab / Flow | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Overview/basic business details save round-trip. | [ ] | [ ] |  |
| Branding values save round-trip. | [ ] | [ ] |  |
| Services save round-trip. | [ ] | [ ] |  |
| Service areas save round-trip. | [ ] | [ ] |  |
| FAQs save round-trip. | [ ] | [ ] |  |
| Privacy settings save round-trip. | [ ] | [ ] |  |
| Consent settings save round-trip. | [ ] | [ ] |  |
| Template settings save round-trip. | [ ] | [ ] |  |
| Onboarding tasks save round-trip. | [ ] | [ ] |  |
| Green notice `Business configuration saved.` appears after Save. | [ ] | [ ] |  |
| No private settings appear on the public quote page. | [ ] | [ ] |  |

## 8. Public Quote Flow

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Active `/quote/[slug]` renders with public-safe branding and fields. | [ ] | [ ] |  |
| Hidden intake fields are not rendered. | [ ] | [ ] |  |
| Required fields block empty submission. | [ ] | [ ] |  |
| Number fields reject negative values. | [ ] | [ ] |  |
| Date fields reject past dates. | [ ] | [ ] |  |
| Consent notice is visible and required. | [ ] | [ ] |  |
| Valid quote submission redirects to `/quote/[slug]/success`. | [ ] | [ ] |  |
| Submission creates an intake submission under the correct business. | [ ] | [ ] |  |
| Submission creates a lead under the correct business. | [ ] | [ ] |  |
| Failure state is safe and does not reveal raw DB/provider errors. | [ ] | [ ] |  |
| Inactive public link returns not found / not available. | [ ] | [ ] |  |

## 9. Public Abuse Protection

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Honeypot value rejects the submission. | [ ] | [ ] |  |
| Honeypot rejection is logged in `public_submission_abuse_log`. | [ ] | [ ] |  |
| Missing consent rejects the submission. | [ ] | [ ] |  |
| Invalid form or consent IDs reject the submission. | [ ] | [ ] |  |
| 11th submission from the same `(business_id, ip_hash)` within 60 minutes is blocked. | [ ] | [ ] |  |
| Rate-limit rejection is logged. | [ ] | [ ] |  |
| Anonymous users cannot directly read or write `public_submission_abuse_log`. | [ ] | [ ] | Covered by RLS tests; optionally confirm manually. |

## 10. Lead Workspace

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| `/dashboard/leads` shows the newly submitted lead. | [ ] | [ ] |  |
| Lead list is tenant-scoped. | [ ] | [ ] |  |
| New lead status is clear. | [ ] | [ ] |  |
| Recommended action is operational and concise. | [ ] | [ ] |  |
| Follow-up / overdue state is visible when applicable. | [ ] | [ ] |  |
| Empty state explains how to get quote requests. | [ ] | [ ] |  |
| No fake "sent" or "booked" state appears unless owner marks it. | [ ] | [ ] |  |

## 11. Lead Detail

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| `/dashboard/leads/[leadId]` loads for the owning business. | [ ] | [ ] |  |
| Owner B cannot load Owner A's lead detail. | [ ] | [ ] |  |
| Quote details display submitted values correctly. | [ ] | [ ] |  |
| Status update persists after refresh. | [ ] | [ ] |  |
| Manual outcome update persists after refresh. | [ ] | [ ] |  |
| `Mark reply copied` records owner-controlled response proof. | [ ] | [ ] |  |
| Action item completion persists after refresh. | [ ] | [ ] |  |
| Timeline records key lead events. | [ ] | [ ] |  |

## 12. AI Lead Assistant

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| AI generation button is manual/on-demand only. | [ ] | [ ] |  |
| With `OPENAI_API_KEY` set, AI generation returns a structured bundle. | [ ] | [ ] |  |
| With `OPENAI_API_KEY` unset, rule fallback returns a useful bundle. | [ ] | [ ] |  |
| Reply draft is concise and owner-reviewed. | [ ] | [ ] |  |
| AI does not send messages automatically. | [ ] | [ ] |  |
| AI does not invent prices, availability, or booking confirmation. | [ ] | [ ] |  |
| AI output stores prompt/model/cost metadata. | [ ] | [ ] |  |
| Raw provider errors are not persisted or shown to the owner. | [ ] | [ ] |  |

## 13. UI, Accessibility, and Mobile

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Dashboard is usable at 1440px / 100% zoom. | [ ] | [ ] |  |
| Configuration page is usable at 1440px / 100% zoom. | [ ] | [ ] |  |
| Leads page is usable at 1440px / 100% zoom. | [ ] | [ ] |  |
| Lead detail page is usable at 1440px / 100% zoom. | [ ] | [ ] |  |
| Public quote page is usable on a mobile viewport. | [ ] | [ ] |  |
| Auth forms are usable on a mobile viewport. | [ ] | [ ] |  |
| Buttons do not wrap awkwardly. | [ ] | [ ] |  |
| Inputs have visible labels. | [ ] | [ ] |  |
| Keyboard can reach all controls. | [ ] | [ ] |  |
| Focus states are visible. | [ ] | [ ] |  |
| Color is not the only status signal. | [ ] | [ ] |  |

## 14. Demo Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Demo business exists. | [ ] | [ ] |  |
| Demo public quote link works. | [ ] | [ ] |  |
| Demo lead can be created from the public quote link. | [ ] | [ ] |  |
| Demo lead appears in the dashboard. | [ ] | [ ] |  |
| Owner can review lead context and copy a reply draft. | [ ] | [ ] |  |
| Owner can mark reply copied and outcome. | [ ] | [ ] |  |
| Founder can show value in under 3 minutes. | [ ] | [ ] |  |
| Demo script avoids generic AI platform, CRM, booking, and automation language. | [ ] | [ ] |  |

## 15. Phase 17 Exit Decision

Phase 17 can be marked complete only when:

```text
Build health is green
+ RLS tests are green
+ public quote flow passes
+ tenant isolation passes
+ business configuration save passes
+ AI manual/fallback flows pass
+ dashboard 100% zoom QA passes
+ demo value is visible in under 3 minutes
```

If any item is accepted as risk, record:

| Risk | Reason | Owner | Date | Expiry / follow-up |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

