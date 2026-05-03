# BizPilot AI — Build Plan v1.0

**Status:** Phase 0 Final Canonical Draft  
**Project:** BizPilot AI  
**Document Type:** Build Plan  
**Owner:** MoOoH  
**Version:** v1.0  
**Phase:** Phase 0 — Documentation Lock

---

## 1. Build Plan Purpose

This document defines the phased execution plan for BizPilot AI.

The build plan exists to prevent feature creep and keep the project focused on validation.

The MVP strategy is:

**Cleaning only. Smart Quote Page only. AI drafts only. Human review required. Concierge setup. Validate first. Expand later.**

---

## 2. Phase Overview

The locked phases are:

1. Phase 0 — Documentation Lock
2. Phase 1 — Project Foundation
3. Phase 2 — Database/Auth Foundation
4. Phase 3 — Business Operating Core
5. Phase 4 — Smart Intake Core + Cleaning Pack
6. Phase 5 — Owner Dashboard Basic
7. Phase 6 — AI Assistant Core
8. Phase 7 — Notifications + Concierge MVP Sales Version
9. Phase 8 — Booking Lite
10. Phase 9 — Second Vertical Pack
11. Phase 10 — Growth Studio

Phases 8–10 are not started until the MVP Validation Gate is passed.

---

## 3. Phase 0 — Documentation Lock

### Goal

Create and approve the canonical documents that guide the project.

### Deliverables

- docs/product/BIZPILOT_MASTER_BLUEPRINT_v1.0.md
- docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.0.md
- docs/architecture/BIZPILOT_ARCHITECTURE_v1.0.md
- docs/product/BIZPILOT_BUILD_PLAN_v1.0.md

### Requirements

Phase 0 must define:

- product identity
- MVP scope
- architecture
- engineering standard
- build phases
- privacy model
- AI boundaries
- validation gate
- strict Non-Goals

### Definition of Done

Phase 0 is complete when:

- all four documents are clean and consistent
- MVP is limited to Cleaning Pack v1
- Generic Core + Industry Packs is locked
- stack is locked
- strict Non-Goals are included
- MoOoH approves the documents

---

## 4. Phase 1 — Project Foundation

### Goal

Create the technical foundation only.

### Critical Rule

Phase 1 must not include product features, business logic, lead workflows, AI generation, billing, or customer-facing quote functionality.

Phase 1 only establishes the technical foundation.

This means no:

- lead submission
- quote page functionality
- business onboarding workflow
- AI generation
- payment workflow
- owner dashboard feature logic
- customer-facing product workflow

### Deliverables

- Next.js App Router setup
- TypeScript strict configuration
- Tailwind CSS setup
- shadcn/ui setup
- base folder structure
- environment validation
- Supabase client setup
- lint/format/build scripts
- base layout
- base route groups
- basic UI shell
- project README skeleton

### Definition of Done

Phase 1 is complete when:

- app runs locally
- TypeScript is strict
- Tailwind works
- shadcn/ui is installed
- environment validation exists
- Supabase client is configured but not used for product workflows
- lint passes
- build passes
- folder structure is ready
- no product features have been implemented

---

## 5. Phase 2 — Database/Auth Foundation

### Goal

Create secure authentication and tenant foundation.

### Deliverables

- Supabase project setup
- Supabase Auth
- profiles table
- businesses table
- business_members table
- RLS policies
- tenant access policy
- protected dashboard shell
- basic authenticated layout
- basic membership checks

### Requirements

Phase 2 must include:

- RLS enabled for tenant-owned tables
- user-to-business relationship
- business membership model
- dashboard route protection
- no public access to private tenant data

### Definition of Done

Phase 2 is complete when:

- user can sign up/login
- authenticated user can access protected shell
- user cannot access businesses they do not belong to
- RLS policies are active
- business_members is working
- tenant-safe foundation is ready for product features

---

## 6. Phase 3 — Business Operating Core

### Goal

Build business configuration needed before lead intake.

### Deliverables

- business profile
- branding
- services
- FAQ
- service areas
- language/tone
- privacy mode
- consent settings
- selected industry pack = Cleaning
- default intake behavior

### Requirements

The business configuration must support Cleaning Pack v1 but must not hardcode the whole platform to cleaning.

The system must preserve the Generic Core + Industry Packs architecture.

### Definition of Done

Phase 3 is complete when:

- owner can configure business profile
- owner can configure brand basics
- owner can add/edit services
- owner can add/edit FAQ
- owner can set service areas
- owner can choose language/tone
- owner can choose privacy mode
- consent settings exist
- Cleaning Pack can be selected as the active pack
- configuration is tenant-safe

---

## 7. Phase 4 — Smart Intake Core + Cleaning Pack

### Goal

Build the public quote flow for Cleaning Pack v1.

### Deliverables

- public branded quote page
- Cleaning Pack v1 form
- form validation
- lead submission
- privacy mode behavior
- consent notice
- lead storage
- success page

### Cleaning Pack v1 Fields

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

### Canonical Consent Notice

**By submitting this request, you agree that your information will be shared with [Business Name] to respond to your quote request. BizPilot may help prepare internal AI drafts, but the business reviews messages before sending.**

### Definition of Done

Phase 4 is complete when:

- public quote page resolves correct business
- form renders with Cleaning Pack v1 fields
- consent notice is visible
- lead can be submitted
- lead is stored according to privacy mode
- success page appears after submission
- public quote page cannot read private dashboard data
- no AI generation is required yet

---

## 8. Phase 5 — Owner Dashboard Basic

### Goal

Build the basic owner workflow for reviewing leads.

### Deliverables

- lead list
- lead detail
- lead status update
- copy actions
- mark reviewed
- mark replied
- mark booked
- mark lost
- basic filters
- tenant-safe access

### Lead Statuses

- New
- Reviewed
- Replied
- Booked
- Lost

### Definition of Done

Phase 5 is complete when:

- owner can view leads for their business
- owner cannot view other businesses’ leads
- owner can open lead detail
- owner can update lead status
- owner can copy relevant customer/contact information
- dashboard remains simple and does not become a CRM

---

## 9. Phase 6 — AI Assistant Core

### Goal

Add AI assistance to the existing lead workflow.

### Deliverables

- AI service abstraction
- Prompt Registry
- lead summary generation
- reply draft generation
- follow-up draft generation
- missing info detection
- suggested next action
- structured outputs where useful
- AI error fallback
- AI output storage respecting privacy mode

### AI Must Generate

- lead summary
- reply draft
- follow-up draft
- missing info detection
- suggested next action

### AI Must Not

- auto-send
- confirm bookings
- invent prices
- invent availability
- negotiate
- talk directly to customers
- replace owner decision

### Definition of Done

Phase 6 is complete when:

- AI outputs are generated server-side
- Prompt Registry is used
- AI output format is consistent
- AI failure has fallback behavior
- AI output respects privacy mode
- owner can review and copy drafts
- no auto-send exists

---

## 10. Phase 7 — Notifications + Concierge MVP Sales Version

### Goal

Make the MVP sales-ready for real early customers.

### Required Deliverables

- owner email notification
- admin/concierge setup mode
- demo business
- sales-ready MVP
- onboarding checklist
- sales demo script
- Stripe Payment Link support

### Optional Deliverable

- customer confirmation email

Customer confirmation email is optional in MVP.

The success page after form submission is enough for first validation.

### Admin / Concierge Capabilities

Admin can:

- create demo businesses
- create customer businesses
- configure business profile
- set branding
- add services
- add FAQ
- set service areas
- activate Cleaning Pack
- choose privacy mode
- configure consent settings
- support onboarding manually
- view support data only when privacy mode allows it

### Definition of Done

Phase 7 is complete when:

- new lead triggers owner email notification
- admin can set up a customer manually
- demo business can be shown in sales
- onboarding checklist exists
- sales demo script exists
- Stripe Payment Link can be used for founding customers
- MVP can be sold to 1–3 cleaning businesses

---

## 11. MVP Validation Gate

Before starting Phase 8, Phase 9, or Phase 10, the following must be true:

- 3 businesses onboarded
- 30 real or semi-real leads submitted
- 50% owner review rate
- 30% AI draft usage or edit rate
- 1 paying or payment-ready customer

If this gate is not passed, do not build new features.

Review:

- positioning
- demo quality
- onboarding friction
- pricing
- customer segment
- form friction
- AI output quality
- owner workflow

---

## 12. Phase 8 — Booking Lite

### Status

Future phase only.

### Start Condition

Only after MVP Validation Gate is passed.

### Possible Scope

- booking request status
- simple availability preference
- manual booking confirmation
- no full calendar engine
- no automated booking confirmation

### Definition of Done

Defined later after validation.

---

## 13. Phase 9 — Second Vertical Pack

### Status

Future phase only.

### Start Condition

Only after Cleaning Pack validation.

### Recommended Order

1. Car Detailing
2. Salon / Beauty
3. Home Services

### Definition of Done

Defined later after validation.

---

## 14. Phase 10 — Growth Studio

### Status

Future phase only.

### Start Condition

Only after real owner usage and validated demand.

### Possible Scope

- review request drafts
- caption generator
- campaign drafts
- seasonal promotion drafts
- Google Business post drafts
- social content drafts

### Definition of Done

Defined later after validation.

---

## 15. Strict Non-Goals / Not Now

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

## 16. Phase Control Rules

No phase can begin until the previous phase meets its Definition of Done.

Future phases are not started because they are exciting.

Future phases are started only when:

- the validation gate is passed
- real customer behavior supports the need
- the added feature supports revenue or retention
- the feature does not break the narrow-entry strategy

---

## 17. First Execution Goal

The first execution goal is:

**3 paying cleaning businesses.**

Not:

- 300 free users
- multi-vertical launch
- full automation
- complex integrations
- content platform
- AI operator

---

## 18. Definition of Done

This Build Plan is complete when:

- all phases are clearly ordered
- Phase 1 explicitly excludes product features
- Phase 2 includes Auth, profiles, businesses, business_members, RLS, and protected dashboard shell
- Phase 3 includes Business Operating Core and Cleaning Pack activation
- Phase 4 includes Smart Intake Core and Cleaning Pack v1
- Phase 5 puts dashboard before AI
- Phase 6 adds AI only after lead workflow exists
- Phase 7 makes MVP sales-ready
- Phase 8–10 are future only
- Validation Gate blocks premature expansion
- strict Non-Goals are included
