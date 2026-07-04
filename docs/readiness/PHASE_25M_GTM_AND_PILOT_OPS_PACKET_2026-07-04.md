# Phase 25M - GTM And Pilot Ops Packet

Date: 2026-07-04
Repo: `E:\bizpilot-ai`
Branch: `main`

## Decision

Package founder-led customer acquisition and pilot operations without approving
real customer data, paid pilot collection, self-serve checkout, automation, or
scope expansion.

This phase turns the existing Founder CRM and outreach notes into a practical
packet for:

- prospect qualification,
- manual outreach,
- demo/video scripting,
- pilot support/payment/refund expectations,
- quote-link placement,
- local review/Google Business Profile guidance.

## Sources Reviewed

Reviewed on 2026-07-04:

- Google Business Profile guidelines:
  `https://support.google.com/business/answer/3038177`
- Google local business links:
  `https://support.google.com/business/answer/6218037`
- Google tips to get more reviews:
  `https://support.google.com/business/answer/3474122`
- Google Maps prohibited and restricted contribution policy:
  `https://support.google.com/contributionpolicy/answer/7400114`
- FTC Consumer Reviews and Testimonials Rule Q&A:
  `https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers`
- FTC endorsements, influencers, and reviews guidance:
  `https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews`

## What Changed

- Updated `docs/sales/FOUNDER_CRM_AND_OUTREACH_PLAYBOOK.md`.
- Expanded `docs/sales/FOUNDER_CRM_PROSPECT_TEMPLATE.csv`.
- Added CRM fields for source permission, quote-link placement candidate,
  outreach date, demo date, objection category, support expectation,
  refund/payment confirmation, and proof metric focus.
- Added channel-specific outreach scripts:
  - cold DM/email,
  - website/contact form,
  - referral ask,
  - demo invitation,
  - post-demo recap,
  - payment-ready check.
- Added a five-minute demo run-of-show and product video plan.
- Added a paid-pilot ops packet covering manual invoice, support expectations,
  refund terms, rollback, proof metrics, and owner approval gates.
- Added local quote-link placement and review guidance aligned to Google/FTC
  policy boundaries.

## Product Boundary

This phase does not approve:

- real customer data,
- paid pilot launch,
- payment automation,
- self-serve checkout,
- automatic renewal,
- stored-card automation,
- booking,
- invoicing,
- SMS/WhatsApp automation,
- full CRM behavior,
- customer email automation,
- fake testimonials,
- incentivized reviews,
- selective positive-review solicitation.

BizPilot remains a cleaning-first quote recovery workflow. AI remains
owner-reviewed and manual-send.

## Pilot Ops Gate

Paid pilot collection remains blocked until all of these are true for the exact
pilot business:

1. Owner approves support terms.
2. Owner approves payment/refund terms.
3. Owner approves rollback expectations.
4. Restored app/dashboard/RLS proof is complete.
5. Real-data approval gate is closed in writing.
6. Manual invoice or payment request is approved.
7. No self-serve checkout or payment automation is added.

## Local Trust Guardrails

The local trust workflow is allowed only as owner-side guidance:

- Ask real customers for honest reviews after completed work.
- Ask consistently, not only when a customer seems happy.
- Do not offer discounts, gifts, free service, payment, or other incentives for
  reviews.
- Do not ask customers to remove/change negative reviews in exchange for
  anything.
- Do not generate fake, AI-written, staff, family, or conflict-of-interest
  reviews.
- Do not use Google Business Profile description text for links when Google
  disallows links there.

## Backlog Items Advanced

```text
80 done
81 done
82 done
83 done as a manual pilot-ops packet; paid pilot remains blocked
84 done
89 preserved as a required paid-pilot blocker
90 preserved
93 preserved
94 preserved
95 preserved
96 preserved
97 preserved
100 preserved
```

## Verification

```text
git diff --check PASS
pnpm test:unit PASS
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
```
