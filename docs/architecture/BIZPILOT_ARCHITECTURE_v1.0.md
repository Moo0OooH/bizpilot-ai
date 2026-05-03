# BizPilot AI — Architecture v1.0

**Status:** Phase 0 Final Canonical Draft  
**Project:** BizPilot AI  
**Document Type:** Architecture  
**Owner:** MoOoH  
**Version:** v1.0  
**Phase:** Phase 0 — Documentation Lock

---

## 1. Architecture Purpose

This document defines the canonical architecture for BizPilot AI MVP.

BizPilot AI must be designed as:

**Generic Core + Industry Packs**

The MVP uses only:

**Cleaning Pack v1**

The architecture must support future expansion without making the MVP heavy.

---

## 2. Architecture Summary

BizPilot AI has seven architecture layers:

1. Core SaaS Layer
2. Business Operating Core
3. Industry Pack Layer
4. Customer Interaction Layer
5. AI Assistant Layer
6. Owner Operations Layer
7. Admin / Concierge Layer

---

## 3. High-Level Architecture

BizPilot AI:

- Core SaaS Layer
  - Supabase Auth
  - Profiles
  - Businesses
  - Business Members
  - Tenant Isolation
  - RLS Policies
  - Usage Tracking
  - Billing Placeholder

- Business Operating Core
  - Business Profile
  - Branding
  - Services
  - FAQ
  - Service Areas
  - Language / Tone
  - Privacy Mode
  - Consent Settings
  - Industry Pack Activation

- Industry Pack Layer
  - Cleaning Pack v1
    - Form Fields
    - Validation Rules
    - Missing Info Rules
    - Reply Context
    - Follow-up Context
    - Demo Data

- Customer Interaction Layer
  - Public Branded Quote Page
  - Lead Submission
  - Consent Notice
  - Success Page

- AI Assistant Layer
  - AI Service Abstraction
  - Prompt Registry
  - Lead Summary
  - Reply Draft
  - Follow-up Draft
  - Missing Info Detection
  - Suggested Next Action

- Owner Operations Layer
  - Owner Dashboard
  - Lead List
  - Lead Detail
  - Status Management
  - Copy Actions
  - Owner Email Notification

- Admin / Concierge Layer
  - Demo Business Setup
  - Customer Business Setup
  - Pack Activation
  - Privacy Configuration
  - Support View

---

## 4. Core SaaS Layer

The Core SaaS Layer handles identity, tenancy, authorization, and platform-level records.

Responsibilities:

- user authentication
- profile management
- business creation
- business membership
- tenant isolation
- role-based access
- basic usage tracking
- billing placeholder
- protected dashboard access

Core entities:

- profiles
- businesses
- business_members
- usage_events
- subscriptions
- reports

---

## 5. Business Operating Core

The Business Operating Core stores operational configuration for a business.

Responsibilities:

- business identity
- branding
- services
- service areas
- FAQs
- language and tone
- privacy mode
- consent settings
- active Industry Pack selection
- default intake behavior

Core entities:

- business_branding
- business_services
- business_faqs
- business_service_areas
- business_privacy_settings
- business_consent_settings
- business_industry_settings

---

## 6. Industry Pack Layer

Industry Packs make the platform expandable.

An Industry Pack defines:

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

The MVP includes only:

**Cleaning Pack v1**

---

## 7. Cleaning Pack v1 Architecture

Cleaning Pack v1 includes these locked form fields:

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

Cleaning Pack v1 must define:

- required fields
- optional fields
- validation rules
- missing info rules
- prompt context
- reply context
- follow-up context
- demo data

---

## 8. Customer Interaction Layer

The Customer Interaction Layer is public and does not require customer login.

Responsibilities:

- resolve business by slug or domain
- render branded quote page
- show consent notice
- collect Cleaning Pack v1 form data
- validate form data
- submit lead
- show success state

Public quote page must not read private dashboard data.

Public quote page can only create leads for the resolved business.

---

## 9. Owner Operations Layer

The Owner Operations Layer is private and authenticated.

Responsibilities:

- show lead list
- show lead detail
- show AI outputs
- allow status changes
- provide copy-to-clipboard actions
- display missing information
- display suggested next action
- support manual workflow

Lead statuses:

- New
- Reviewed
- Replied
- Booked
- Lost

The dashboard must remain simple and not become a full CRM in MVP.

---

## 10. AI Assistant Layer

The AI Assistant Layer is server-side only.

Responsibilities:

- generate lead summaries
- generate reply drafts
- generate follow-up drafts
- detect missing information
- suggest next action
- use business profile, services, FAQ, tone, and Cleaning Pack context
- respect privacy mode
- store AI outputs only when allowed

AI components:

- AI service abstraction
- Prompt Registry
- structured output validation
- fallback handling
- privacy-aware persistence

AI must not:

- send messages
- confirm bookings
- invent pricing
- invent availability
- negotiate
- speak directly to customers
- replace the owner

---

## 11. Admin / Concierge Layer

The Admin / Concierge Layer enables service-first onboarding.

Responsibilities:

- create demo businesses
- create customer businesses
- configure profile
- configure branding
- configure services
- configure FAQ
- configure service areas
- activate Cleaning Pack
- configure privacy mode
- configure consent settings
- support onboarding
- view support data only when privacy mode allows it

Admin access must be separated and restricted.

---

## 12. Privacy Architecture

Privacy mode must affect storage and visibility.

### 12.1 Standard Mode

Stores:

- full lead data
- AI outputs
- status history
- usage events

### 12.2 Minimal Data Mode

Stores:

- minimum lead data required for workflow
- business relationship
- status
- timestamp

Free-text notes may be limited.

### 12.3 Forward-Only Mode

Behavior:

- forward request to owner
- avoid permanent full lead storage
- optional deletion after 24/48 hours
- minimal metadata only if needed
- restrict admin/support visibility

---

## 13. Consent Architecture

The public quote page must show this canonical notice:

**By submitting this request, you agree that your information will be shared with [Business Name] to respond to your quote request. BizPilot may help prepare internal AI drafts, but the business reviews messages before sending.**

The notice must be visible before submission.

Submission implies consent for:

- sharing request information with the business
- using BizPilot internally to prepare AI drafts
- business owner reviewing and sending any message manually

---

## 14. Data Model

### 14.1 Core MVP Tables

Core MVP tables:

- profiles
- businesses
- business_members
- business_branding
- business_services
- business_faqs
- business_service_areas
- business_privacy_settings
- business_consent_settings
- industry_packs
- business_industry_settings
- lead_forms
- leads
- lead_field_values
- lead_messages
- ai_outputs
- usage_events
- subscriptions
- reports

### 14.2 Future Tables

Future tables:

- booking_requests
- appointments
- review_requests
- content_projects
- social_posts
- campaigns
- media_assets
- integrations
- automation_runs
- audit_logs

Future tables must not be implemented until the relevant future phase is approved.

---

## 15. Tenant Isolation Rules

Required rules:

- every tenant-owned operational record includes business_id
- a user can access only businesses where they are a business_member
- a lead belongs to exactly one business
- AI outputs belong to a lead and a business
- public quote page can create leads only for the resolved business slug
- public quote page cannot read dashboard/private data
- admin access is separated and restricted
- Forward-Only Mode must not accidentally store full lead data

---

## 16. RLS Policy Requirements

RLS must be enabled for tenant-owned tables.

RLS must enforce:

- member-only business access
- member-only lead access
- member-only AI output access
- scoped public insert for quote submission
- no public read of private data
- admin-only support behavior
- privacy-aware data access

RLS is required in Phase 2.

---

## 17. Notification Architecture

MVP required notification:

- owner email notification for new lead

MVP optional notification:

- customer confirmation email

Customer confirmation email can be added later.

The public success page is enough for first MVP validation.

---

## 18. Payment Architecture

MVP payment approach:

- Stripe Payment Links first
- Stripe Billing later

The system should include a basic subscription/billing placeholder but must not build a full billing engine in MVP.

---

## 19. Future Architecture Boundaries

Future systems must not be built in MVP.

Future architecture may support:

- Booking Lite
- second vertical pack
- Growth Studio
- campaigns
- social drafts
- review requests
- integrations
- automation runs
- audit logs
- white-label
- marketplace

These are allowed only after validation.

---

## 20. Strict Non-Goals / Not Now

The architecture must not include MVP implementation for:

- full CRM
- full booking engine
- payments inside app
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

## 21. Definition of Done

This document is complete when:

- seven architecture layers are defined
- Generic Core + Industry Packs is the canonical architecture
- Cleaning Pack v1 is the only MVP pack
- privacy architecture is defined
- consent architecture is defined
- tenant isolation rules are explicit
- RLS requirements are explicit
- AI architecture is server-side and draft-only
- admin/concierge layer is included
- roadmap architecture is separated from MVP
