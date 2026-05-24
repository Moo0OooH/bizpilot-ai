# BizPilot AI - Pilot Offer and Pricing Decisions

**Project:** BizPilot AI  
**Document Type:** Pilot Offer / Pricing Decision Record  
**Status:** Phase 19F draft; owner approval required before paid outreach  
**Owner:** MoOoH  
**Last Updated:** 2026-05-23  
**Related:**
- `docs/gtm/BIZPILOT_GTM_PLAYBOOK_v1.1.md`
- `docs/operations/BIZPILOT_PHASE_18_FOUNDER_LED_PILOT_WORKFLOW_v1.0.md`
- `docs/product/BIZPILOT_PRICING_PAGE_SPEC_v1.0.md`
- `docs/product/BIZPILOT_PLAN_ENTITLEMENTS_AND_MANUAL_BILLING_SPEC_v1.0.md`
- `docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v1.0.md`
- `app/pricing/page.tsx`
- `lib/i18n/pricing-copy.ts`

---

## 1. Purpose

This document makes the pilot offer clear enough for real cleaning-business outreach and demos without pretending that undecided business terms have already been approved.

This is not a new product scope. The offer remains:

```text
Cleaning quote link -> organized lead -> AI summary/reply/follow-up drafts -> owner review -> manual copy/send.
```

## 2. Current Evidence Checked

### Public pricing implementation

- `app/pricing/page.tsx`
- `lib/i18n/pricing-copy.ts`

Current public page offers:

| Public plan | Public price/copy | Notes |
| --- | --- | --- |
| Founder Pilot | `14-day pilot` and `manual offer` | Recommended public card, but no exact dollar price shown. |
| Starter | `$199 setup` and `$49/mo` | Matches the lower-friction Founder Setup amount from GTM docs, but under the Starter label. |
| Pro | `$299 setup` and `$79/mo` | Matches Founder Plus economics from GTM docs, but under the Pro label. |

### Current docs

- `docs/gtm/BIZPILOT_GTM_PLAYBOOK_v1.1.md` lists Founder Setup at `$199 setup + $49/month` and Founder Plus at `$299 setup + $79/month`; it calls Founder Plus the recommended default.
- `docs/operations/BIZPILOT_PHASE_18_FOUNDER_LED_PILOT_WORKFLOW_v1.0.md` repeats both offers and says owner must decide the actual pilot offer before paid outreach.
- `docs/product/BIZPILOT_PLAN_ENTITLEMENTS_AND_MANUAL_BILLING_SPEC_v1.0.md` says billing stays manual and refund handling, trial length, and cancellation policy require owner decision before real paid pilots.
- `docs/product/BIZPILOT_PRICING_PAGE_SPEC_v1.0.md` confirms the pricing page should avoid billing automation, booking, invoices, CRM claims, SMS, WhatsApp, and auto-send.

## 3. Public Pricing Match Check

The current public pricing page partially matches the intended pilot offer.

What matches:

- The page is cleaning quote recovery, not a broad AI platform.
- It includes quote page setup, lead recovery workspace, AI summary/reply/follow-up drafts, founder setup guidance, and manual copy/send only.
- It clearly says no auto-send, no booking/invoice system, no SMS/WhatsApp automation, and no full CRM scope.
- It includes the `$199 setup + $49/mo` economics on the Starter plan.

What does not fully match:

- The requested recommended default names the outreach offer as Founder Pilot with `$199 setup + $49/mo`.
- The public page currently shows Founder Pilot as `manual offer` / `14-day pilot` and puts `$199 setup + $49/mo` under Starter.
- Older GTM/risk docs call Founder Plus at `$299 setup + $79/mo` the recommended default, while Phase 19F recommends the lower-friction `$199 setup + $49/mo` default.
- Trial, refund, cancellation, subscription start, and stopped-responding rules are not locked.

Decision:

Do not silently change the pricing page. For Phase 19 outreach, the recommended default below can be used as a draft only after owner approval. If approved, either update the public Founder Pilot card to show `$199 setup + $49/mo`, or keep the page as a public menu and use a separate founder-led quote during demos.

## 4. Recommended Default Offer

Use this as the recommended owner-approval draft:

```text
Founder Pilot
$199 setup
$49/month
Cleaning quote page
Lead dashboard
AI summary, reply draft, and follow-up draft
Owner-reviewed manual copy/send only
Founder onboarding/support
No auto-send
No booking
No invoicing
No calendar
No WhatsApp/SMS automation
```

This default is intentionally the lower-friction offer. It conflicts with the older Founder Plus default in GTM docs, so owner approval is required before treating it as locked.

## 5. Decision Table

| Decision | Recommended default | Current evidence | Status | Owner action |
| --- | --- | --- | --- | --- |
| Setup fee | `$199 setup` | GTM Founder Setup and public Starter card both show `$199 setup`. | Drafted, not owner-locked | Approve `$199` for Founder Pilot, or choose `$299` Founder Plus. |
| Monthly fee | `$49/month` | GTM Founder Setup and public Starter card both show `$49/mo`. | Drafted, not owner-locked | Approve `$49/mo` for Founder Pilot, or choose `$79/mo` Founder Plus. |
| Trial yes/no | No separate free trial approved. Current Founder Pilot is a `14-day pilot`; whether it is free, paid, or credited is undecided. | Public Founder Pilot card says `14-day pilot`; plan spec says trial length requires owner decision. | Owner decision required | Decide if the 14-day pilot is free, paid, or included after setup payment. |
| Refund policy | No final refund policy approved. | Plan spec says refund handling requires owner decision. | Owner decision required | Approve clear refund wording before taking payment. |
| Cancellation policy | Draft direction: customer can cancel before continuing monthly if the pilot is not helping after setup. | Founder workflow uses non-binding wording: owner can cancel if it is not helping after setup. | Owner decision required | Approve exact cancellation wording and cutoff. |
| Founder pilot limit | Recommended: first 3 cleaning businesses. | Validation gate requires 3 paying or payment-ready cleaning businesses; public page says limited pilot seats but no number. | Drafted, not owner-locked | Confirm first 3, first 5, or another limit. |
| What is included | Cleaning quote page, lead dashboard, AI summary/reply/follow-up drafts, manual copy/send, founder onboarding/support. | Pricing page, pricing spec, plan entitlement spec, and founder workflow are aligned. | Product scope locked | Keep this scope narrow in outreach and demos. |
| What is not included | No auto-send, booking, invoicing, calendar sync, WhatsApp/SMS automation, Instagram API, multi-vertical expansion, or full CRM. | Canonical docs, pricing page, pricing spec, and plan spec are aligned. | Product scope locked | Do not promise excluded scope. |
| Support expectation | Founder-led onboarding plus first-week tuning; no 24/7 support or SLA promised. | Pricing page says founder-led onboarding and first-week support; plan spec says limited support. | Partially locked | Choose support channel and response expectation. |
| Manual billing process | Invoice or separate Stripe Payment Link; founder manually assigns plan/access in `/admin`. | Plan spec documents manual billing; dashboard/settings copy references Stripe Payment Links first. | Documented, payment asset not verified | Create or confirm invoice/payment-link process before collecting payment. |
| When subscription starts | Recommended draft: monthly subscription starts after setup is complete and quote page is launched. | Not explicitly locked in current docs. | Owner decision required | Approve start trigger: payment date, launch date, or end of pilot period. |
| Customer stops responding | Recommended draft: pause onboarding after reasonable follow-ups; do not promise ongoing active support without response. | Not explicitly locked in current docs. | Owner decision required | Approve follow-up cadence and billing/access handling for non-responsive customers. |
| Quote page disabled | Public quote link disabled while account is paused; data retained. | Plan entitlement spec defines Paused as dashboard blocked/limited, public quote link disabled, data retained. | Product behavior locked | Align owner-facing wording with Paused behavior. |

## 6. Owner-Approval Checklist

Before paid outreach, owner must choose:

- [ ] Founder Pilot default price: `$199 setup + $49/month`, or another approved offer.
- [ ] Whether Founder Pilot is a paid 14-day pilot, free trial, paid setup with trial, or no trial.
- [ ] Refund wording.
- [ ] Cancellation wording.
- [ ] Founder pilot limit.
- [ ] Support channel and response expectation.
- [ ] Payment collection method: invoice, Stripe Payment Link, or other manual method.
- [ ] Subscription start trigger.
- [ ] Non-responsive customer handling.

## 7. Approved Outreach Wording Placeholder

Do not use this as final paid terms until owner approves it:

```text
I am offering a founder-led BizPilot pilot for cleaning businesses.

The recommended pilot offer is $199 setup and $49/month for a focused quote recovery workflow: a cleaning quote page, organized lead dashboard, AI summary/reply/follow-up drafts, and manual owner review/copy/send.

It does not send messages automatically, book jobs, create invoices, sync calendars, or automate SMS/WhatsApp. I will confirm the final pilot terms before you decide.
```

## 8. Final Phase 19F Decision

| Decision | Result |
| --- | --- |
| Pricing locked | No. Recommended default is drafted, but owner approval is still required. |
| Refund/cancellation locked | No. Draft direction exists, but exact policy is owner-required. |
| Trial locked | No. Public page says 14-day pilot, but paid/free/subscription timing is not decided. |
| Manual billing ready | No. Manual billing process is documented, but the actual payment collection asset/process is not verified. |

