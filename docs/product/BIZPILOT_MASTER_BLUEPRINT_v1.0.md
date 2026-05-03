# BizPilot AI — Master Blueprint v1.0

**Status:** Phase 0 Final Canonical Draft  
**Project:** BizPilot AI  
**Document Type:** Product Master Blueprint  
**Owner:** MoOoH  
**Version:** v1.0  
**Phase:** Phase 0 — Documentation Lock

---

## 1. Product Identity

BizPilot AI is a reusable AI Operating Core for local service businesses.

The product starts with a narrow, sellable market entry:

**Branded Smart Quote Page + AI Reply Assistant for Cleaning Businesses**

The long-term product vision is broad, but the MVP is intentionally narrow.

---

## 2. Strategic Formula

BizPilot AI is defined by this locked formula:

**Generic AI Operating Core + Cleaning Smart Quote MVP**

This means:

- The core platform must be reusable across many local service categories.
- The first market entry is cleaning businesses only.
- Expansion happens through Industry Packs.
- New verticals are not built until validation gates are passed.
- AI assists business owners but does not operate autonomously in the MVP.

---

## 3. Internal Vision

**AI Operating Core for local service businesses.**

BizPilot AI provides the operational foundation for local service businesses to capture customer requests, organize leads, prepare replies, follow up, and eventually support booking and growth workflows.

---

## 4. Market Entry Product

**Branded Smart Quote Page + AI Reply Assistant for Cleaning Businesses.**

For customers, BizPilot should be explained simply:

**A branded smart quote page that turns cleaning requests into clean leads, ready-to-send replies, and follow-up drafts.**

Primary sales message:

**Stop losing cleaning customers because of slow, messy, or incomplete replies.**

---

## 5. Positioning

BizPilot comes before CRM.

It is not positioned as a full CRM, booking engine, dispatch platform, or automation suite in the MVP.

BizPilot solves the earlier problem:

A customer request is often messy, incomplete, scattered across channels, and hard to answer quickly. BizPilot turns that request into:

- a structured lead
- a lead summary
- missing information detection
- a ready-to-send AI reply draft
- a follow-up draft
- a suggested next action

---

## 6. First Customer Segment

The first target customer is:

**Small cleaning businesses with manual message handling.**

Ideal early customer profile:

- cleaning business with 1–10 people
- owner replies to messages manually
- gets requests from Instagram, Facebook, Google, WhatsApp, website, SMS, or phone
- has no clean quote form
- loses leads because of slow or incomplete replies
- wants more bookings
- is not ready for complex CRM software
- is open to a done-for-you setup

Bad-fit early customers:

- large franchises
- businesses needing full dispatch workflows
- businesses requiring custom integrations immediately
- businesses demanding WhatsApp automation from day one
- businesses with no incoming leads
- businesses needing enterprise procurement
- businesses wanting AI to replace staff completely

---

## 7. Core Product Principle

The core product principle is:

**Big vision, narrow entry, validated expansion.**

Meaning:

- Build the core in a reusable way.
- Enter the market with one narrow, sellable product.
- Validate with real customers before expanding.
- Do not build future features just because they are possible.
- Do not let the MVP become a full operations platform too early.

---

## 8. Product Architecture Concept

BizPilot AI has two main layers:

### 8.1 Generic Core

The Generic Core is shared across all service business categories.

It includes:

- accounts
- profiles
- businesses
- business members
- business profile
- branding
- services
- service areas
- FAQ
- privacy mode
- consent settings
- lead intake
- lead summary
- AI reply draft
- follow-up draft
- missing info detection
- owner dashboard
- admin/concierge setup
- prompt registry
- notification system
- industry pack activation
- usage tracking
- billing placeholder

### 8.2 Industry Packs

Each service category is added through an Industry Pack.

An Industry Pack includes:

- form fields
- service templates
- default FAQ
- AI prompt context
- missing info rules
- reply templates
- follow-up templates
- demo data
- validation rules
- industry wording
- sales page copy
- lead scoring hints later

---

## 9. MVP Industry Pack

Only one Industry Pack is built in the MVP:

**Cleaning Pack v1**

All other verticals are roadmap only.

Roadmap verticals include:

- Car Detailing
- Salon / Beauty
- Home Services
- Restaurant
- Other local service categories

---

## 10. Cleaning Pack v1

Cleaning Pack v1 must remain simple and focused.

Locked form fields:

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

The form must not become too long. Extra fields are not added unless real usage data proves they are necessary.

---

## 11. MVP Scope

The MVP includes:

- business signup/login
- business profile
- business branding
- services setup
- FAQ setup
- service areas
- privacy mode
- consent settings
- selected Industry Pack = Cleaning
- public branded quote page
- Cleaning Pack v1 form
- lead submission
- lead storage according to privacy mode
- lead dashboard
- lead detail
- lead status management
- AI lead summary
- AI reply draft
- AI follow-up draft
- missing info detection
- suggested next action
- copy-to-clipboard actions
- owner email notification
- admin/concierge setup mode
- demo business mode
- basic usage tracking
- Stripe Payment Link support

---

## 12. AI Strategy

The locked AI rule is:

**AI Assistant, not AI Operator.**

In the MVP, AI generates:

- lead summary
- reply draft
- follow-up draft
- missing info detection
- suggested next action
- tone-adjusted responses
- FAQ-aware response drafts

AI must not:

- auto-send messages
- confirm bookings
- invent prices
- invent availability
- negotiate with customers
- talk directly to customers
- replace owner decisions
- make unsupported promises

All AI outputs are drafts. Human review is required.

---

## 13. Privacy and Consent

Privacy is a product feature, not only a legal detail.

BizPilot supports three privacy modes.

### 13.1 Standard Mode

Stores:

- lead data
- AI outputs
- status history
- basic usage data

### 13.2 Minimal Data Mode

Stores only the minimum useful data, such as:

- name
- contact
- service type
- city or service area
- status
- created date
- business_id

### 13.3 Forward-Only Mode

Designed for more privacy-sensitive businesses.

Behavior:

- request is forwarded to the owner
- no permanent full lead storage
- optional deletion after 24/48 hours
- minimal technical metadata only if needed

### 13.4 Canonical Consent Notice

The public quote page must include this consent notice:

**By submitting this request, you agree that your information will be shared with [Business Name] to respond to your quote request. BizPilot may help prepare internal AI drafts, but the business reviews messages before sending.**

---

## 14. Admin / Concierge Setup Mode

Admin / Concierge Setup Mode is required for service-first early sales.

Admin must be able to:

- create demo businesses
- create real customer businesses
- configure business profile
- set branding
- add services
- add FAQ
- set service areas
- activate Cleaning Pack
- choose privacy mode
- configure consent settings
- view support data only when privacy mode allows it
- support onboarding manually

This avoids forcing early customers into full self-serve setup.

---

## 15. Business Model

BizPilot starts with a service-first business model.

### 15.1 Founding Customer Offer

First 3 customers:

- $199 setup
- $49/month

After 3–5 customers:

- $299 setup
- $79/month

After 10 customers:

- $499 setup
- $99/month

### 15.2 Future Public Plans

- Starter: $99/month
- Pro: $199/month
- Growth: $299/month

### 15.3 Payments

Payment path:

- Stripe Payment Links first
- Stripe Billing later

The first goal is not 300 free users.

The first goal is:

**3 paying cleaning businesses.**

---

## 16. Go-To-Market

Primary early channels:

- Instagram DM
- Google Maps prospecting
- personalized Loom demos
- cold email
- Facebook groups
- short educational videos
- referrals

Early sales flow:

1. Find a cleaning business.
2. Check whether their quote/request flow is weak.
3. Create a mini demo using their brand name and services.
4. Send short outreach.
5. Offer a free demo.
6. Show messy request versus clean BizPilot lead.
7. Offer 48-hour setup.
8. Charge setup fee.
9. Deliver.
10. Ask for testimonial.

---

## 17. Validation Gate

Before building Booking Lite, Growth Studio, integrations, or a second vertical, the following gate must be passed:

- 3 businesses onboarded
- 30 real or semi-real leads submitted
- 50% owner review rate
- 30% AI draft usage or edit rate
- 1 paying or payment-ready customer

If this gate is not passed, the answer is not more features.

The team must review:

- positioning
- demo quality
- onboarding friction
- pricing
- customer segment
- form friction
- AI output quality
- owner workflow

---

## 18. Future Roadmap

Future features are roadmap only.

They are not part of MVP.

Roadmap includes:

- Booking Lite
- Car Detailing Pack
- Salon Pack
- Home Services Pack
- Growth Studio
- Campaign Engine
- review request drafts
- Google Business Profile content
- social content drafts
- integrations
- white-label
- marketplace
- AI Operator

---

## 19. Strict Non-Goals / Not Now

The MVP must not include:

- full CRM
- full booking engine
- payments inside product
- invoice generation
- WhatsApp API
- Instagram API
- Facebook Messenger API
- SMS sending
- auto outbound customer messaging
- AI chatbot directly talking to customers
- mobile app
- marketplace
- white-label
- content studio
- restaurant booking
- multi-vertical build
- AI voice
- fully automated pricing
- custom AI model training
- vector database
- microservices
- Kubernetes
- complex integrations

---

## 20. Definition of Done

This document is complete when:

- BizPilot AI is defined as Generic AI Operating Core + Cleaning Smart Quote MVP.
- The MVP is limited to Cleaning Pack v1.
- Customer-facing positioning is simple and non-technical.
- Industry Pack architecture is defined.
- AI boundaries are explicit.
- Privacy modes and consent notice are defined.
- Admin / Concierge Setup Mode is required.
- Validation Gate is included.
- Strict Non-Goals are included.
- Future roadmap is separated from MVP.
