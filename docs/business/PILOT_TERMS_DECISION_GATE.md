# BizPilot AI - Pilot Terms Decision Gate

**Project:** BizPilot AI
**Document Type:** Pilot terms decision gate
**Status:** Owner decision required before any real pilot starts
**Owner:** MoOoH
**Last Updated:** 2026-05-24
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

Do not accept payment, onboard a real cleaning business, collect real customer data, or position the offer as final until every business-term row marked **Owner decision required** is resolved by the owner.

This document does not invent final decisions. It records current evidence, recommended defaults, and the owner-approval gap.

## 2. Current Pricing Evidence

Current sources checked:

| Source | Current evidence |
| --- | --- |
| `app/pricing/page.tsx` | Renders public pricing route from `lib/i18n/pricing-copy.ts`. |
| `lib/i18n/pricing-copy.ts` | Founder Pilot shows `14-day pilot` / `manual offer`; Starter shows `$199 setup` / `$49/mo`; Pro shows `$299 setup` / `$79/mo`. |
| `docs/business/PILOT_OFFER_AND_PRICING_DECISIONS.md` | Records the mismatch and recommends the lower-friction `$199 setup + $49/month` as a draft only. |
| `docs/product/BIZPILOT_PLAN_ENTITLEMENTS_AND_MANUAL_BILLING_SPEC_v1.0.md` | Manual billing only; invoice or separate Stripe Payment Link; refund, trial length, and cancellation require owner decision. |
| `docs/product/BIZPILOT_PRICING_PAGE_SPEC_v1.0.md` | Pricing page must avoid billing automation, booking, invoice, CRM, SMS, WhatsApp, and auto-send claims. |

## 3. Recommended Default

Recommendation only. Not final until owner approves it:

```text
$199 setup
$49/month
Cleaning quote page
Lead recovery dashboard
AI summary, reply draft, and follow-up draft
Manual copy/send only
Owner-reviewed AI drafts
Founder support during pilot
No auto-send
No booking
No invoicing
No calendar sync
No SMS/WhatsApp automation
```

## 4. Decision Table

| Decision | Current evidence | Recommended default | Final terms status | Owner approval status |
| --- | --- | --- | --- | --- |
| Setup fee | Starter card and Phase 19F draft show `$199 setup`; Founder Pilot card still says `manual offer`. | `$199 setup` | Not final | Owner decision required |
| Monthly fee | Starter card and Phase 19F draft show `$49/mo`; Founder Pilot card still says `14-day pilot`. | `$49/month` | Not final | Owner decision required |
| Trial | Public Founder Pilot says `14-day pilot`, but free/paid/credited/no-trial meaning is not approved. | No separate free trial unless owner explicitly approves one. | Not final | Owner decision required |
| Refund | Plan/manual billing spec says refund handling requires owner decision. | Define a simple written refund rule before taking payment. | Not final | Owner decision required |
| Cancellation | Phase 19F has draft direction only; exact cutoff and customer wording are not approved. | Allow cancellation before monthly continuation if pilot is not useful, with exact cutoff approved by owner. | Not final | Owner decision required |
| Payment collection | Manual billing documented; actual invoice or Stripe Payment Link asset/process is not verified. | Manual invoice or Stripe Payment Link; no in-app billing automation. | Not final | Owner decision required |
| Billing start | Not locked in current docs. | Start monthly billing after setup is complete and quote page is launched, unless owner chooses another trigger. | Not final | Owner decision required |
| Included | Pricing/docs align around quote page, lead dashboard, AI summary/reply/follow-up drafts, manual copy/send, and founder-led setup/support. | Include focused quote recovery workflow plus founder support during pilot. | Not final commercial packaging | Owner decision required |
| Excluded | Product scope is locked: no auto-send, booking, invoicing, calendar sync, WhatsApp/SMS automation, Instagram API, multi-vertical expansion, or full CRM. | Keep exclusions explicit in sales, onboarding, and any written offer. | Approved product guardrail | Approved |
| Support promise | Current copy says founder-led setup and first-week support, but support channel, response expectation, and end date are not locked. | Founder support during pilot; no 24/7 or SLA promise unless owner approves exact wording. | Not final | Owner decision required |
| Customer stops responding | Not locked in current docs. | Pause onboarding after reasonable follow-ups; do not promise unlimited setup/support without customer response. | Not final | Owner decision required |

## 5. Required Owner Approval Before Real Pilot

Before any real pilot starts, owner must approve:

- [ ] exact setup fee,
- [ ] exact monthly fee,
- [ ] trial yes/no and trial meaning,
- [ ] refund policy,
- [ ] cancellation policy,
- [ ] payment collection method,
- [ ] billing start trigger,
- [ ] included scope wording,
- [ ] support promise and channel,
- [ ] non-responsive customer handling.

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
| Business terms are fully approved | No |
| Payment may be collected | No |
| Recommended default may be used in internal planning | Yes, as recommendation only |
| Recommended default may be presented as final offer | No, not until owner approval |

Final gate: **Owner decision required.**
