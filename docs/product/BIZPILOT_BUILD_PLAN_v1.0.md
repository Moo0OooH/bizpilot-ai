# BizPilot AI — Build Plan v1.0

**Project:** BizPilot AI  
**Document Type:** Build Plan  
**Version:** v1.0  
**Status:** Final Canonical Draft  
**Owner:** MoOoH  
**Phase:** Phase 0 — Documentation Lock  
**Last Updated:** 2026-05-03  

---

## 1. Build Plan Purpose

This document defines the phased execution plan for BizPilot AI.

The plan is designed to maximize startup success by balancing:

- Speed to MVP
- Product quality
- Customer value
- Technical scalability
- Multi-tenant security
- Scope control
- Sales readiness

The MVP strategy is:

**Universal Smart Intake Core. Cleaning-first GTM. Editable Cleaning Template. AI drafts only. Human review required. Concierge setup. Validate before expansion.**

---

## 2. Phase Overview

The locked phases are:

1. Phase 0 — Documentation Lock
2. Phase 1 — Project Foundation
3. Phase 2 — Auth + Tenant Foundation
4. Phase 3 — Business + Template Configuration Core
5. Phase 4 — Universal Smart Intake Core + Cleaning Template
6. Phase 5 — Lead Workspace + Today’s Action Panel
7. Phase 6 — AI Lead Conversion Assistant
8. Phase 7 — Sales-Ready MVP
9. Validation Gate
10. Phase 8 — Booking Lite
11. Phase 9 — Second Vertical Template
12. Phase 10 — Growth Studio Lite

Phases 8–10 are future only and must not start until the Validation Gate is passed.

---

## 3. Phase 0 — Documentation Lock

### Goal

Create and approve the canonical documents that guide the project.

### Deliverables

- docs/product/BIZPILOT_MASTER_BLUEPRINT_v1.0.md
- docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.0.md
- docs/architecture/BIZPILOT_ARCHITECTURE_v1.0.md
- docs/product/BIZPILOT_BUILD_PLAN_v1.0.md

### Required Decisions

Phase 0 must lock:

- Universal Smart Intake + AI Lead Conversion Core
- Cleaning-first GTM
- Editable Cleaning Smart Quote Template
- Supabase-first MVP stack
- AI Assistant, not AI Operator
- Standard and Minimal Data privacy modes
- Concierge setup workflow
- Validation Gate
- Strict Non-Goals

### Definition of Done

Phase 0 is complete when:

- All four documents are clean and consistent.
- MVP scope is clear.
- Supabase-first stack is locked.
- Docker and Prisma are excluded from MVP.
- Cleaning is the only GTM vertical.
- The product core remains universal.
- Strict Non-Goals are included.
- MoOoH approves the documents.

---

## 4. Phase 1 — Project Foundation

### Goal

Create the technical foundation only.

### Critical Rule

Phase 1 must not include product features.

No:

- Lead submission
- Quote page functionality
- Business onboarding workflow
- AI generation
- Payment workflow
- Owner dashboard feature logic
- Customer-facing product workflow

### Deliverables

- Next.js App Router setup
- TypeScript strict configuration
- Tailwind CSS setup
- shadcn/ui setup
- Base folder structure
- Environment variable structure
- Environment validation
- Supabase client foundation
- Lint script
- Build script
- Base layout
- Base route groups
- Basic UI shell
- README skeleton
- Git checkpoint

### Definition of Done

Phase 1 is complete when:

- App runs locally.
- TypeScript is strict.
- Tailwind works.
- shadcn/ui is installed.
- Environment validation exists.
- Supabase client is configured but not used for product workflows.
- Lint passes.
- Build passes.
- Folder structure is ready.
- README exists.
- No product features have been implemented.

---

## 5. Phase 2 — Auth + Tenant Foundation

### Goal

Create secure authentication and tenant foundation.

### Deliverables

- Supabase project setup
- Supabase Auth
- profiles table
- businesses table
- business_members table
- RLS policies
- Tenant access policy
- Protected dashboard shell
- Basic authenticated layout
- Basic membership checks

### Database Tables

- profiles
- businesses
- business_members

### Requirements

Phase 2 must include:

- RLS enabled for tenant-owned tables
- User-to-business relationship
- Business membership model
- Dashboard route protection
- No public access to private tenant data
- No lead/service/AI tables yet

### Definition of Done

Phase 2 is complete when:

- User can sign up/login.
- Authenticated user can access protected shell.
- User can be associated with a business.
- User cannot access businesses they do not belong to.
- RLS policies are active.
- business_members is working.
- Tenant-safe foundation is ready for product features.

---

## 6. Phase 3 — Business + Template Configuration Core

### Goal

Build business configuration needed before public intake.

### Deliverables

- Business profile
- Branding
- Services
- FAQ
- Service areas
- Language/tone preference
- Privacy mode
- Consent settings
- Industry template seed
- Cleaning template activation
- Editable form configuration foundation

### Database Tables

- business_branding
- business_services
- business_faqs
- business_service_areas
- business_privacy_settings
- business_consent_settings
- industry_templates
- industry_template_fields
- business_template_settings

### Requirements

The system must support Cleaning Template v1 without hardcoding the full platform to cleaning.

Editable template configuration must support:

- Field label
- Required/optional
- Field order
- Help text
- Placeholder
- Active/inactive state
- Success message

No drag-and-drop builder.

### Definition of Done

Phase 3 is complete when:

- Owner can configure business profile.
- Owner can configure brand basics.
- Owner can add/edit services.
- Owner can add/edit FAQ.
- Owner can set service areas.
- Owner can choose language/tone.
- Owner can choose privacy mode.
- Consent settings exist.
- Cleaning template can be activated.
- Editable template configuration exists.
- Configuration is tenant-safe.

---

## 7. Phase 4 — Universal Smart Intake Core + Cleaning Template

### Goal

Build the public intake flow using the universal intake engine and Cleaning Template v1.

### Deliverables

- Dynamic form renderer
- Public branded intake page
- Cleaning Template v1 fields
- Form validation
- Consent notice
- Submission storage
- Lead creation
- Privacy-aware storage
- Success page

### Database Tables

- intake_forms
- intake_form_fields
- intake_submissions
- intake_submission_values
- leads

### Cleaning Template v1 Fields

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

- Public intake page resolves the correct business.
- Public page loads only public-safe data.
- Dynamic form renders from configuration.
- Cleaning Template v1 renders correctly.
- Consent notice is visible.
- Customer can submit a request.
- Submission and lead are stored under the correct business.
- Privacy mode is respected.
- Success page appears after submission.
- Public page cannot read private dashboard data.
- No AI generation is required yet.

---

## 8. Phase 5 — Lead Workspace + Today’s Action Panel

### Goal

Build the basic owner workflow for reviewing and acting on leads.

### Deliverables

- Lead list
- Lead detail
- Lead status update
- Missing info placeholder/rule-based detection
- Lead Quality Score placeholder/rule-based score
- Suggested Next Action placeholder/rule-based action
- Today’s Action Panel
- Copy actions
- Basic filters
- Tenant-safe access

### Database Tables

- lead_action_items
- lead_quality_scores

### Lead Statuses

- New
- Reviewed
- Replied
- Follow-Up Needed
- Booked
- Lost
- Archived


### Follow-Up Needed Rule

A lead should be marked or suggested as Follow-Up Needed when:

- Status is New for more than 24 hours
- Status is Replied but not Booked after 48 hours
- Missing information was requested but remains unresolved
- Owner manually marks the lead for follow-up

This is rule-based in MVP. No automatic customer messaging is allowed.

### Lead Quality Score Rule

MVP categories:

- Strong
- Good
- Needs Info
- Low Fit

Starting logic:

- Strong = contact + service + area + preferred timing + required fields complete
- Good = contact + service + area complete, but some useful optional information is missing
- Needs Info = one or more key quote details are missing
- Low Fit = outside service area, unclear request, or poor match with offered services

### Definition of Done

Phase 5 is complete when:

- Owner can view leads for their business.
- Owner cannot view other businesses’ leads.
- Owner can open lead detail.
- Owner can update lead status.
- Owner can copy relevant customer/contact information.
- Owner can see missing information.
- Owner can see lead quality score.
- Owner can see suggested next action.
- Owner can see Today’s Action Panel.
- Dashboard remains simple and does not become a CRM.

---

## 9. Phase 6 — AI Lead Conversion Assistant

### Goal

Add AI assistance to the existing lead workflow.

### Deliverables

- AI service abstraction
- Prompt Registry
- Prompt versioning
- Lead summary generation
- Reply draft generation
- Follow-up draft generation
- Missing info detection
- Suggested next action
- Lead quality reasoning
- Tone variants
- Structured outputs where useful
- AI error fallback
- AI output storage respecting privacy mode
- Usage tracking

### Database Tables

- ai_outputs
- prompt_templates
- prompt_versions
- usage_events

### AI Must Generate

- Lead summary
- Reply draft
- Follow-up draft
- Missing info
- Suggested next action
- Lead quality reasoning
- Tone variants

### AI Must Not

- Auto-send
- Confirm bookings
- Invent prices
- Invent availability
- Negotiate
- Talk directly to customers
- Replace owner decision

### Definition of Done

Phase 6 is complete when:

- AI outputs are generated server-side.
- Prompt Registry is used.
- AI output format is consistent.
- AI failure has fallback behavior.
- AI output respects privacy mode.
- Owner can review and copy drafts.
- Tone variants exist.
- No auto-send exists.

---

## 10. Phase 7 — Sales-Ready MVP

### Goal

Make the MVP ready for real early customers and paid validation.

### Required Deliverables

- Owner email notification
- Concierge setup workflow
- Demo business
- Sales-ready demo page
- Onboarding checklist
- Sales demo script
- Before/after sales view
- Stripe Payment Link support
- Basic subscription placeholder
- Founding customer workflow

### Database Table

- subscriptions

### Admin / Concierge Capabilities

Concierge can:

- Create demo businesses
- Create customer businesses
- Configure business profile
- Set branding
- Add services
- Add FAQ
- Set service areas
- Activate Cleaning template
- Configure privacy mode
- Configure consent settings
- Prepare public intake link
- Support onboarding manually

This should not become a full admin platform.

### Definition of Done

Phase 7 is complete when:

- New lead triggers owner email notification.
- Concierge can set up a customer manually.
- Demo business can be shown in sales.
- Before/after value demo exists.
- Onboarding checklist exists.
- Sales demo script exists.
- Stripe Payment Links can be used for founding customers.
- MVP can be sold to 1–3 cleaning businesses.

---

## 11. MVP Validation Gate

Before starting Phase 8, Phase 9, or Phase 10, the following must be true:

- 3 businesses onboarded
- 30 real or semi-real leads submitted
- 50% owner review rate
- 30% AI draft copy/edit usage
- 1 paying or payment-ready customer

If this gate is not passed, do not build new features.

Review:

- Positioning
- Demo quality
- Onboarding friction
- Pricing
- Customer segment
- Form friction
- AI output quality
- Owner workflow
- Sales message

---

## 12. Phase 8 — Booking Lite

### Status

Future phase only.

### Start Condition

Only after MVP Validation Gate is passed.

### Possible Scope

- Owner-confirmed booking status
- Preferred appointment note
- Manual booking confirmation state
- Simple calendar view later

### Not Included

- Full calendar engine
- Automatic booking confirmation
- Calendar sync
- Dispatching

### Definition of Done

Defined later after validation.

---

## 13. Phase 9 — Second Vertical Template

### Status

Future phase only.

### Start Condition

Only after Cleaning Template validation.

### Recommended Order

1. Car Detailing
2. Salon / Beauty
3. Education / Tutoring
4. Home Services

Each template should include:

- Default fields
- Required/optional rules
- AI prompt context
- Missing-info rules
- Reply templates
- Follow-up templates
- Demo data
- Sales copy

### Definition of Done

Defined later after validation.

---

## 14. Phase 10 — Growth Studio Lite

### Status

Future phase only.

### Start Condition

Only after real owner usage and validated demand.

### Possible Scope

- Review request drafts
- Google Business Profile post drafts
- Seasonal promotion drafts
- Follow-up campaign drafts
- Simple social caption drafts

### Not Included

- Auto-posting
- Social media integrations
- Full content calendar
- Multi-channel automation

### Definition of Done

Defined later after validation.

---

## 15. Deployment Plan

### MVP Development

- Local Next.js development
- Supabase Cloud project
- GitHub repository

### First Deploy

- Vercel for Next.js
- Supabase Cloud for Auth and PostgreSQL
- Resend for owner email
- Stripe Payment Links for founding payments

### Not Needed for MVP

- VPS
- AWS
- Docker-first setup
- Kubernetes
- Self-hosted PostgreSQL
- Supabase local stack

These can be revisited after validation.

---

## 16. Tooling by Phase

### Phase 1

- Node.js
- pnpm
- Git
- VS Code
- Next.js
- TypeScript
- Tailwind
- shadcn/ui

### Phase 2

- Supabase project
- Supabase Auth
- Supabase SQL migrations
- RLS policies

### Phase 3–5

- Supabase PostgreSQL
- Next.js server actions / route handlers
- Tenant-safe services and repositories

### Phase 6

- OpenAI API
- Prompt Registry
- Structured output validation

### Phase 7

- Resend
- Stripe Payment Links
- Vercel deployment

---

## 17. Phase Control Rules

No phase can begin until the previous phase meets its Definition of Done.

Future phases are not started because they are exciting.

Future phases are started only when:

- Validation Gate is passed
- Real customer behavior supports the need
- The added feature supports revenue or retention
- The feature does not break the narrow-entry strategy

---

## 18. First Execution Goal

The first execution goal is:

**3 paying cleaning businesses.**

Not:

- 300 free users
- Multi-vertical launch
- Full automation
- Complex integrations
- Full content platform
- AI operator
- Full CRM

---

## 19. Strict Non-Goals / Not Now

The MVP must not include:

- Full CRM
- Full booking engine
- Full drag-and-drop builder
- Advanced conditional form logic
- Payments inside product
- Invoice generation
- WhatsApp API
- Instagram API
- Facebook Messenger API
- SMS sending
- Auto outbound customer messaging
- AI chatbot directly talking to customers
- Mobile app
- Marketplace
- White-label
- Full content studio
- Restaurant booking
- Multi-vertical public launch
- AI voice
- Fully automated pricing
- Custom AI model training
- Vector database
- Microservices
- Kubernetes
- Complex integrations

---

## 20. Build Plan Definition of Done

This Build Plan is complete when:

- All phases are clearly ordered.
- Phase 1 explicitly excludes product features.
- Phase 2 includes Auth, profiles, businesses, business_members, RLS, and protected dashboard shell.
- Phase 3 includes Business + Template Configuration Core.
- Phase 4 includes Universal Smart Intake Core and Cleaning Template.
- Phase 5 includes Lead Workspace and Today’s Action Panel.
- Phase 6 adds AI only after lead workflow exists.
- Phase 7 makes MVP sales-ready.
- Phases 8–10 are future only.
- Validation Gate blocks premature expansion.
- Strict Non-Goals are included.

---

## 21. Approval Status

**Status:** Pending MoOoH Approval

After approval, this document becomes canonical for BizPilot AI build execution.
