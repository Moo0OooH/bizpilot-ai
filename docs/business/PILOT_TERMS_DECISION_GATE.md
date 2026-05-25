# BizPilot AI - Pilot Terms Decision Gate

**Project:** BizPilot AI
**Document Type:** Pilot terms decision gate
**Status:** Staged commercial terms approved; real pilot still blocked by production/data gates
**Owner:** MoOoH
**Last Updated:** 2026-05-25
**Related:**
- `docs/business/PILOT_OFFER_AND_PRICING_DECISIONS.md`
- `docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v1.0.md`
- `docs/product/BIZPILOT_PLAN_ENTITLEMENTS_AND_MANUAL_BILLING_SPEC_v1.0.md`
- `docs/product/BIZPILOT_PRICING_PAGE_SPEC_v1.0.md`
- `app/pricing/page.tsx`
- `lib/i18n/pricing-copy.ts`

---

## 1. Purpose

This gate prevents BizPilot from starting a real pilot without clear commercial terms.

Do not accept payment, onboard a real cleaning business, or collect real customer data until the remaining production, backup/export, OpenAI, SMTP/signup, and smoke-test gates are closed.

This document records the owner-approved staged commercial terms for the first pilot cohorts. The terms approval closes the pricing mismatch, but it does not approve a real customer pilot by itself.

## 2. Current Pricing Evidence

Current sources checked:

| Source | Current evidence |
| --- | --- |
| `app/pricing/page.tsx` | Renders public pricing route from `lib/i18n/pricing-copy.ts`. |
| `lib/i18n/pricing-copy.ts` | Founder Pilot shows free setup for first 1-5 pilot customers with a feedback commitment; Starter shows `$149 setup` / `$49/mo`; Pro shows `$199 setup` / `$79/mo`. |
| `docs/business/PILOT_OFFER_AND_PRICING_DECISIONS.md` | Older recommendation source; superseded by this staged owner-approved gate for pilot execution. |
| `docs/product/BIZPILOT_PLAN_ENTITLEMENTS_AND_MANUAL_BILLING_SPEC_v1.0.md` | Manual billing only; invoice or separate Stripe Payment Link; refund, trial length, and cancellation require owner decision. |
| `docs/product/BIZPILOT_PRICING_PAGE_SPEC_v1.0.md` | Pricing page must avoid billing automation, booking, invoice, CRM, SMS, WhatsApp, and auto-send claims. |

## 3. Approved Staged Terms

Approved owner direction for pilot packaging:

```text
Customers 1-5
$0 setup
Feedback commitment required at 30 and 60 days
Goal: collect honest usage proof, objections, recovered-lead evidence, and testimonials

Customers 6-20
$149 setup
$49/month

After 20 customers / after credible proof
$199 setup
$79/month

Manual invoice or separate Stripe Payment Link only
No in-app billing automation
Monthly billing starts after setup is complete and quote page/workspace is ready
Cleaning quote page
Lead recovery dashboard
AI summary, reply draft, and follow-up draft
Manual copy/send only
Owner-reviewed AI drafts
Founder support during pilot, best-effort 1-2 business days
No auto-send
No booking
No invoicing
No calendar sync
No SMS/WhatsApp automation
```

## 4. Decision Table

| Decision | Current evidence | Recommended default | Final terms status | Owner approval status |
| --- | --- | --- | --- | --- |
| Setup fee | Owner approved staged pricing. | Customers 1-5: `$0`; customers 6-20: `$149`; after 20 customers: `$199`. | Final for pilot cohorts | Approved |
| Monthly fee | Owner approved staged pricing. | Customers 1-5: feedback pilot/no paid monthly offer until converted; customers 6-20: `$49/month`; after 20 customers: `$79/month`. | Final for pilot cohorts | Approved |
| Trial | First 1-5 customers are feedback pilots, not a generic free trial. | Free setup in exchange for 30/60 day feedback. | Final for first cohort | Approved |
| Refund | Paid setup does not start until customer accepts the written offer. | Setup fee refundable before onboarding work starts; no automatic refund after setup work starts. | Final for pilot cohorts | Approved |
| Cancellation | Simple early-stage policy. | Cancel before next monthly cycle; no long-term contract. | Final for pilot cohorts | Approved |
| Payment collection | Manual billing documented; actual invoice or Stripe Payment Link asset/process still must be created before collecting payment. | Manual invoice or Stripe Payment Link; no in-app billing automation. | Process pending, terms approved | Approved terms / process pending |
| Billing start | Owner-approved default. | Monthly billing starts after quote page/workspace is ready. | Final for pilot cohorts | Approved |
| Included | Pricing/docs align around quote page, lead dashboard, AI summary/reply/follow-up drafts, manual copy/send, and founder-led setup/support. | Include focused quote recovery workflow plus founder support during pilot. | Final commercial packaging | Approved |
| Excluded | Product scope is locked: no auto-send, booking, invoicing, calendar sync, WhatsApp/SMS automation, Instagram API, multi-vertical expansion, or full CRM. | Keep exclusions explicit in sales, onboarding, and any written offer. | Approved product guardrail | Approved |
| Support promise | Owner approved founder-led early support without enterprise SLA. | Founder support during pilot; best-effort 1-2 business days; no 24/7 SLA. | Final for pilot cohorts | Approved |
| Customer stops responding | Owner approved practical early-stage handling. | Pause onboarding after reasonable follow-ups; do not promise unlimited setup/support without customer response. | Final for pilot cohorts | Approved |
| Pilot customer limit | Owner approved staged cohorts. | First 1-5 feedback pilots, customers 6-20 paid Starter, then standard paid Pro. | Final for pilot cohorts | Approved |

## 5. Required Owner Approval Before Real Pilot

Before any real pilot starts, the following business terms are now approved:

- [x] exact staged setup fee,
- [x] exact staged monthly fee,
- [x] first-cohort feedback pilot meaning,
- [x] refund policy,
- [x] cancellation policy,
- [x] payment collection method,
- [x] billing start trigger,
- [x] included scope wording,
- [x] support promise and channel,
- [x] non-responsive customer handling,
- [x] pilot customer limit.

Remaining non-business gates still block real customer data and paid pilot execution:

- production quote security smoke,
- fr-CA production quote smoke,
- signup confirmation flow with stable safe inbox/custom SMTP posture,
- OpenAI real-output validation with a non-empty production key,
- production backup/export/restore posture,
- any paid-payment asset/process needed before collecting money.

## 6. Approved Guardrails

The following are already locked product rules and should not be negotiated as pilot terms:

```text
No auto-send
No booking
No invoicing
No calendar sync
No SMS/WhatsApp automation
No Instagram API
No multi-vertical expansion
No full CRM expansion
Manual copy/send only
Owner-reviewed AI drafts only
```

## 7. Real Pilot Start Decision

| Decision | Status |
| --- | --- |
| Real pilot may start with real customer data | No |
| Business terms are fully approved | Yes, for staged pilot cohorts |
| Payment may be collected | No |
| Staged terms may be used in internal planning | Yes |
| Staged terms may be presented as final offer | Yes, only after production/data gates allow real pilot outreach |

Final gate: **Commercial terms approved; technical/data readiness still required.**
