# BizPilot AI — Pricing Page Spec v1.0

## Purpose
Define a simple pilot-stage pricing page for cleaning businesses without building full billing automation.

## Route
`/pricing`

## Positioning
Sell quote recovery and faster owner-reviewed responses, not generic AI software.

## Page Goals
- Explain founder pilot offer.
- Reduce fear.
- Clarify that AI does not auto-send.
- Make the next action obvious.

## Recommended Sections
1. Header
2. Pricing hero
3. Founder Pilot card
4. Starter card
5. Pro card
6. What setup includes
7. What AI will and will not do
8. FAQ
9. Final CTA

## Suggested Offers
### Founder Pilot
- first 1-5 pilot customers
- $0 founder-led setup
- 30- and 60-day feedback commitment
- quote page setup
- lead recovery dashboard
- AI summary/reply/follow-up drafts
- owner-reviewed manual sending
- limited pilot seats

### Starter
- customers 6-20
- $149 setup
- $49/month
- public quote page
- lead workspace
- AI reply drafts
- manual copy/send
- basic support

### Pro
- after first 20 customers or after credible proof is collected
- $199 setup
- $79/month
- stronger branded quote page
- follow-up drafts
- more customization
- priority onboarding
- pilot analytics basics

## Strict Rules
- No fake guarantees.
- No inflated revenue claims.
- No autonomous AI claims.
- No booking/invoice/CRM claims.
- No complex annual/monthly toggle yet.
- No Stripe Billing dependency before validation.
- No pricing copy that implies booking, invoicing, SMS, WhatsApp, or auto-send.

## Current Route Evidence

- `app/pricing/page.tsx`
- Public plan names align with manual `/admin` plan values: Founder Pilot, Starter, Pro.
