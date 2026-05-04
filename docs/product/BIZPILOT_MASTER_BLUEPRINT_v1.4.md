# BizPilot AI — Master Blueprint v1.4

**Project:** BizPilot AI  
**Document Type:** Product Master Blueprint  
**Version:** v1.4  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Phase:** Phase 0 Final Lock  
**Last Updated:** 2026-05-03

---

## 1. Product Identity

BizPilot AI is an **AI Quote Recovery & Lead Conversion Desk** for local service businesses.

It helps small service businesses capture messy quote requests, structure customer information, identify missing details, prioritize urgent leads, prepare AI-assisted reply and follow-up drafts, and show owners what to do today.

BizPilot is intentionally not:

- A simple form builder
- A full CRM
- A booking engine
- A dispatch platform
- An AI chatbot that talks to customers automatically
- A multi-channel automation suite
- A content marketing platform during MVP

The first commercial wedge is **small cleaning businesses**.

The long-term product core is broader: a reusable intake and lead-conversion platform that can later support other local service verticals through editable templates.

---

## 2. Final Strategic Formula

```text
Product Core = Universal Smart Intake Core + AI Lead Conversion Core
Commercial Wedge = Cleaning-first
MVP = Editable Cleaning Smart Quote Template + Lead Conversion Desk + AI Drafts
Positioning = Before CRM. After messy messages.
Execution Mode = Build small. Sell manually. Validate before expansion.
```

The project must be built like a platform, shipped like a focused cleaning quote-recovery product, and sold like a done-for-you revenue recovery service.

---

## 3. Why This Product Should Exist

Small local service businesses lose revenue because their lead workflow is messy:

- Customers ask vague questions like “How much for cleaning?”
- Requests arrive from Instagram, Facebook, Google Business Profile, website forms, SMS, WhatsApp/manual messages, phone calls, and DMs.
- Owners reply manually and often late.
- Customers omit key quote details.
- Follow-ups are forgotten.
- Owners do not know which leads are complete, urgent, or high-value.
- Many small businesses are not ready for a full CRM.

BizPilot does not solve every operations problem. It solves the earlier problem:

```text
Messy interest -> clean lead -> clear next action -> faster human response
```

---

## 4. Customer-Facing Positioning

### Primary Message

```text
Stop losing cleaning quote requests.
Get a branded quote link, cleaner customer details, AI reply drafts, follow-up guidance, and today’s next action — without needing a full CRM.
```

### Short Offer

```text
Get a branded quote page that helps your cleaning business reply faster, follow up better, and book more jobs.
```

### Trust Message

```text
BizPilot does not message your customers automatically.
It prepares drafts. You stay in control.
```

### What Not To Lead With

Do not lead with:

- AI platform
- Form automation
- CRM alternative
- Lead conversion engine
- Workflow automation
- SaaS dashboard

Lead with:

- Fewer missed quote requests
- Faster replies
- More complete customer details
- Easier follow-up
- More booked jobs
- Done-for-you setup

---

## 5. Ideal Customer Profile

The first ideal customer is a small cleaning business that:

- Has 1-10 team members
- Receives quote requests manually
- Uses Instagram, Facebook, Google Business Profile, SMS, WhatsApp/manual messaging, phone, or a basic website
- Has no structured quote workflow
- Has slow or inconsistent follow-up
- Wants more bookings
- Is not ready for complex CRM software
- Is open to a done-for-you setup
- Can place a public quote link in at least two channels

---

## 6. Bad-Fit Customers

Avoid early customers who require:

- Full dispatch or workforce routing
- Complex franchise permissions
- Enterprise procurement
- Native WhatsApp/SMS/Instagram automation on day one
- AI to fully replace staff
- Full calendar, invoice, payment, and job management
- Custom integrations before paying
- Support effort larger than expected revenue
- No inbound lead volume
- Refusal to place the public quote link anywhere

---

## 7. Core Product Promise

BizPilot turns:

```text
Messy request -> Clean lead -> Quality score -> Missing info -> Reply draft -> Follow-up -> Today’s action -> Outcome marked -> Revenue recovery proof
```

The owner should quickly know:

- What the customer wants
- What information is missing
- Whether the lead is strong, good, incomplete, or low fit
- How urgent the response is
- What reply to send
- Whether follow-up is needed
- Which leads matter today
- Whether the lead became booked, lost, no response, not a fit, or asked info

---

## 8. Core Product Modules

### 8.1 Universal Smart Intake Core

Supports:

- Public branded quote links
- Business slug resolution
- Editable templates
- Dynamic fields
- Required/optional rules
- Consent notice
- Success message
- Lead source tracking
- Submission storage
- Privacy-aware behavior

### 8.2 Cleaning Smart Quote Template

Default fields:

- cleaning_type
- property_type
- bedrooms
- bathrooms
- square_footage_optional
- pets
- preferred_date
- preferred_time_window
- city_or_service_area
- customer_name
- customer_contact
- notes

Editable settings:

- Field label
- Required/optional
- Field order
- Help text
- Placeholder text
- Active/inactive state
- Success message
- Consent notice

Not MVP:

- Drag-and-drop builder
- Advanced conditional logic
- Marketplace templates
- Multi-step funnel builder

### 8.3 Lead Conversion Desk

Supports:

- Lead list
- Lead detail
- Lead status
- Lead Quality Score
- Missing Info Detection
- Response SLA State
- Lead Events Timeline
- Today’s Action Panel
- AI draft review and copy actions
- Follow-Up Needed rule
- Manual Outcome Tracking
- Revenue Recovery Proof summary

### 8.4 AI Lead Conversion Core

AI generates:

- Lead summary
- Reply draft
- Follow-up draft
- Missing info reasoning
- Suggested next action
- Lead quality explanation
- Tone variants

AI must not:

- Auto-send
- Confirm bookings
- Invent prices
- Invent availability
- Negotiate
- Directly message customers
- Replace owner judgment

### 8.5 Concierge Setup Workflow

Supports:

- Done-for-you business setup
- Services/FAQ/service area setup
- Cleaning template configuration
- Demo business generation
- Before/After Sales View
- Public Link Placement Guide
- Founding customer onboarding
- 14-day adjustment period

---

## 9. Public Link Distribution

Each customer receives a branded public quote link:

```text
/b/[businessSlug]
```

Recommended placements:

1. Website quote button
2. Instagram bio
3. Facebook page
4. Google Business Profile
5. SMS/DM saved reply
6. Email signature
7. QR code later

Validation requires at least two active public link placements per business.

---

## 10. Public Quote Page Conversion Rules

The public quote page must:

- Be mobile-first
- Load fast
- Show the business name clearly
- Look branded, not generic
- Use one primary CTA
- Include “Takes less than 60 seconds”
- Avoid unnecessary fields
- Show consent near submit
- Show a reassuring success message
- Work without customer login

---

## 11. Lead Quality Score

Canonical levels:

- Strong
- Good
- Needs Info
- Low Fit

MVP starts rule-based. AI may later enhance explanations, but core scoring must remain deterministic and explainable.

---

## 12. Response SLA State

BizPilot productizes speed-to-lead without becoming a CRM.

States:

- New — not reviewed yet
- Viewed — no reply copied yet
- Reply copied — waiting for booked/lost
- Follow-up due today
- Overdue

Tracked fields:

- first_viewed_at
- first_reply_copied_at
- last_owner_action_at
- response_status
- response_sla_state
- first_response_latency

---

## 13. Manual Outcome Tracking

BizPilot does not build a booking engine in MVP.

Allowed manual outcomes:

- Booked
- Lost
- No response
- Not a fit
- Asked info

Manual outcomes validate whether BizPilot is contributing to real commercial outcomes without adding booking complexity.

---

## 14. Revenue Recovery Proof

BizPilot must show simple proof of value.

Example owner summary:

```text
This week:
- 12 quote requests captured
- 7 AI drafts copied
- 3 follow-ups due
- 2 overdue leads recovered
- 4 strong leads acted on
- 5 outcomes marked
```

This is not advanced analytics. It is visible proof that quote requests are being handled better.

---

## 15. Cost Control Policy

BizPilot must stay low-cost before validation.

Rules:

- Rule-based first, AI second
- AI generation once-per-lead or on-demand
- Cache AI outputs
- Regenerate only when lead data or business context changes
- No background AI agents in MVP
- No vector database in MVP
- No always-on workers in MVP
- No file storage unless required
- Track model, token usage, estimated cost, and cost per lead
- AI cost should not exceed 10% of monthly customer revenue from BizPilot
- Use cost-sensitive models first when quality is acceptable

---

## 16. Privacy and Consent

Privacy is a product feature.

MVP privacy modes:

1. Standard Mode
2. Minimal Data Mode

Future mode:

- Forward-Only Mode

Required privacy fields/concepts:

- consent_version
- consent_accepted_at
- ai_processing_disclosure
- privacy_contact_email
- data_retention_days
- delete_request_status

Canonical consent notice:

```text
By submitting this request, you agree that your information will be shared with [Business Name] to respond to your quote request. BizPilot may help prepare internal AI drafts, but the business reviews messages before sending.
```

---

## 17. Business Model

### Founder Setup

```text
$199 setup
$49/month
```

Includes:

- Done-for-you setup
- Branded quote page
- Editable Cleaning Smart Quote Template
- Lead Conversion Desk
- AI reply drafts
- Owner email notification
- 14-day adjustment

### Founder Plus — Recommended Default

```text
$299 setup
$79/month
```

Includes everything in Founder Setup plus:

- FAQ setup
- Before/after demo
- Public link placement guide
- Monthly optimization review

### Later Standard

```text
$499 setup
$99/month
```

Only after validation.

Payment path:

- Stripe Payment Links first
- Full Stripe Billing later

---

## 18. Demo Generator

Demo Generator is a core sales asset.

It must show value in under two minutes.

```text
Before:
"Hi, how much for cleaning?"

After:
Structured lead
Lead Quality
Missing Info
Suggested Next Action
AI Reply Draft
AI Follow-Up Draft
Today’s Action Panel
Revenue Recovery Proof
Public quote link
```

---

## 19. Validation Gate

Before Booking Lite, Growth Studio, self-serve, second vertical, or complex automation:

- 3 businesses onboarded
- 30 real or semi-real leads submitted
- 50% owner review rate
- 30% AI draft copy/edit rate
- 1 paying or payment-ready customer
- At least 2 public link placements per business
- At least 20% leads with source_channel tracked
- Time-to-Value <= 20 minutes

90-day target:

- 5 paying or payment-ready businesses
- $500-$1,500 CAD MRR
- 50+ submitted leads
- AI Draft Adoption >= 30%
- Owner Review Rate >= 50%

---

## 20. Strict Non-Goals / Not Now

The MVP must not include:

- Full CRM
- Full booking engine
- Calendar sync
- WhatsApp API
- Instagram API
- Facebook Messenger API
- SMS sending
- Auto-send
- AI operator
- Full content studio
- Multi-vertical launch
- Mobile app
- Marketplace
- Custom domain
- Full Stripe Billing
- Advanced analytics warehouse
- Vector database
- Microservices
- Kubernetes
- Complex integrations

---

## 21. Definition of Done

This document is complete when:

- BizPilot is defined as AI Quote Recovery & Lead Conversion Desk.
- Universal core and Cleaning-first GTM are clear.
- MVP avoids full CRM and booking complexity.
- Revenue Recovery Proof is included.
- Cost Control Policy is included.
- Manual Outcome Tracking is included.
- AI boundaries are explicit.
- Validation Gate is explicit.
- Strict Non-Goals are explicit.
