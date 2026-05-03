# BizPilot AI — Architecture v1.0

**Project:** BizPilot AI  
**Document Type:** Architecture  
**Version:** v1.0  
**Status:** Final Canonical Draft  
**Owner:** MoOoH  
**Phase:** Phase 0 — Documentation Lock  
**Last Updated:** 2026-05-03  

---

## 1. Architecture Purpose

This document defines the canonical architecture for BizPilot AI MVP and future expansion.

The system must support:

- Universal smart intake forms
- Editable industry templates
- Cleaning-first go-to-market
- AI lead conversion workflows
- Multi-tenant security
- Privacy-first behavior
- Fast MVP execution
- Future vertical expansion without major rewrites

---

## 2. Canonical Architecture Statement

BizPilot AI is built as:

**Universal Smart Intake Core + AI Lead Conversion Core + Editable Industry Templates**

The first market template is:

**Cleaning Smart Quote Template v1**

The architecture must not hardcode BizPilot as only a cleaning product.

---

## 3. High-Level System Layers

BizPilot AI has eight architecture layers:

1. Core SaaS Layer
2. Business Operating Layer
3. Industry Template Layer
4. Universal Intake Layer
5. Lead Conversion Layer
6. AI Assistant Layer
7. Owner Workspace Layer
8. Concierge / Sales Setup Layer

---

## 4. Core SaaS Layer

The Core SaaS Layer handles identity, tenancy, authorization, and platform-level records.

Responsibilities:

- Supabase Auth
- User profiles
- Business accounts
- Business membership
- Tenant isolation
- RLS policies
- Protected dashboard access
- Usage tracking foundation
- Subscription placeholder

Core entities:

- profiles
- businesses
- business_members
- usage_events
- subscriptions

---

## 5. Business Operating Layer

The Business Operating Layer stores business configuration used by public intake pages, AI outputs, and lead workflows.

Responsibilities:

- Business profile
- Branding
- Services
- FAQ
- Service areas
- Language/tone
- Privacy mode
- Consent settings
- Active template settings

Entities:

- business_branding
- business_services
- business_faqs
- business_service_areas
- business_privacy_settings
- business_consent_settings
- business_template_settings

---

## 6. Industry Template Layer

Industry templates provide reusable starting points for different service categories.

A template defines:

- Default fields
- Field labels
- Field types
- Required/optional defaults
- Field order
- Missing information rules
- AI prompt context
- Reply context
- Follow-up context
- Demo data
- Industry wording

MVP includes only:

**Cleaning Smart Quote Template v1**

Future templates:

- Car Detailing
- Salon / Beauty
- Education / Tutoring
- Home Services
- Wellness
- Repair Services

Entities:

- industry_templates
- industry_template_fields

---

## 7. Universal Intake Layer

The Universal Intake Layer renders dynamic public intake forms from configuration.

Responsibilities:

- Create intake forms
- Configure intake fields
- Render public form
- Validate submissions
- Store submission values
- Convert submission into lead
- Show success state
- Respect privacy mode

Entities:

- intake_forms
- intake_form_fields
- intake_form_output_settings
- intake_submissions
- intake_submission_values

The intake system must be configurable but not a full drag-and-drop builder in MVP.

---

## 8. Cleaning Smart Quote Template Architecture

Cleaning Smart Quote Template v1 includes default fields:

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

The business or concierge workflow may customize:

- Label
- Required/optional setting
- Field order
- Help text
- Placeholder
- Active/inactive field
- Success message

Advanced conditional logic is not part of MVP.

---

## 9. Lead Conversion Layer

The Lead Conversion Layer transforms submissions into actionable lead workflows.

Responsibilities:

- Lead creation
- Lead status
- Lead detail
- Missing information
- Lead Quality Score
- Suggested Next Action
- Lead action items
- Follow-up state

Entities:

- leads
- lead_action_items
- lead_quality_scores

Lead statuses:

- New
- Reviewed
- Replied
- Follow-Up Needed
- Booked
- Lost
- Archived

---

## 10. AI Assistant Layer

The AI Assistant Layer is server-side only.

Responsibilities:

- Lead summary generation
- Reply draft generation
- Follow-up draft generation
- Missing-info detection
- Suggested next action
- Lead quality reasoning
- Tone variants
- Prompt Registry
- Structured output validation
- Privacy-aware persistence

Entities:

- ai_outputs
- prompt_templates
- prompt_versions
- usage_events

AI must not:

- Send messages automatically
- Confirm bookings
- Invent pricing
- Invent availability
- Negotiate
- Speak directly to customers
- Replace the business owner

---

## 11. Owner Workspace Layer

The Owner Workspace is the private dashboard for business owners.

Responsibilities:

- Lead list
- Lead detail
- Lead status management
- Copy-to-clipboard actions
- AI output review
- Missing information display
- Suggested next action display
- Today’s Action Panel

The Owner Workspace must not become a full CRM in MVP.

---

## 12. Today’s Action Panel Architecture

Today’s Action Panel summarizes practical work.

Inputs:

- New leads
- Leads not reviewed
- Leads needing follow-up
- Leads with missing information
- Strong leads
- Recently submitted leads

Outputs:

- Simple action cards
- Counts
- Links to relevant lead details

The goal is action clarity, not advanced analytics.

---

## 13. Concierge / Sales Setup Layer

The Concierge Setup Layer supports done-for-you early onboarding.

Responsibilities:

- Create demo businesses
- Create customer businesses
- Configure profile
- Configure branding
- Add services
- Add FAQs
- Set service areas
- Activate Cleaning template
- Configure privacy mode
- Configure consent notice
- Prepare demo and sales flow

This is not a full admin platform in MVP.

It is a controlled internal workflow for early customer setup.

---

## 14. Public Page Architecture

The public intake page:

- Does not require customer login
- Resolves business by public slug
- Loads only public-safe business data
- Renders active intake form
- Shows consent notice
- Validates customer input
- Creates submission and lead
- Shows success page

The public page must not expose:

- Private dashboard data
- Other tenants’ records
- AI outputs
- Usage data
- Business owner private information

---

## 15. Tenant Isolation Architecture

Tenant isolation is mandatory.

Rules:

- Every tenant-owned operational table includes business_id.
- A user can access only businesses where they are a business member.
- Leads belong to one business.
- Submissions belong to one business.
- AI outputs belong to one business and one lead.
- Public intake pages can create only scoped submissions/leads.
- Public pages cannot read private tenant data.
- Concierge/admin access is separated and restricted.

Tenant checks must happen at both:

- Supabase RLS level
- Server policy/service level

---

## 16. RLS Architecture

Supabase Row Level Security protects tenant data at the database layer.

RLS must be enabled for:

- profiles
- businesses
- business_members
- business_branding
- business_services
- business_faqs
- business_service_areas
- business_privacy_settings
- business_consent_settings
- business_template_settings
- intake_forms
- intake_form_fields
- intake_form_output_settings
- intake_submissions
- intake_submission_values
- leads
- lead_action_items
- lead_quality_scores
- ai_outputs
- usage_events
- subscriptions

RLS policy types:

- Own profile access
- Member business access
- Member lead access
- Scoped public insert
- No public read of private data
- Service-role only maintenance operations

---

## 17. Privacy Architecture

MVP privacy modes:

1. Standard Mode
2. Minimal Data Mode

Future:

3. Forward-Only Mode

### 17.1 Standard Mode

Stores:

- Full submission values
- Lead details
- AI outputs
- Status history
- Usage events

### 17.2 Minimal Data Mode

Stores:

- Minimum useful lead data
- Business relationship
- Status
- Contact method
- Created timestamp

Limits:

- Less free-text retention
- More careful AI output storage

### 17.3 Forward-Only Mode

Future only.

It may support forwarding request data to the owner and deleting or minimizing stored data after a retention window.

---

## 18. Consent Architecture

The public intake page must show the canonical consent notice:

**By submitting this request, you agree that your information will be shared with [Business Name] to respond to your quote request. BizPilot may help prepare internal AI drafts, but the business reviews messages before sending.**

Submission implies consent for:

- Sharing request information with the business
- BizPilot preparing internal AI drafts
- Business owner reviewing and manually sending any message

---

## 19. Notification Architecture

MVP required notification:

- Owner email notification when a new lead is submitted

MVP optional later:

- Customer confirmation email

Future:

- Follow-up reminders
- Weekly owner summary
- SMS/WhatsApp only after validation

---

## 20. Payment Architecture

MVP payment path:

- Stripe Payment Links first
- Basic subscription placeholder record
- Stripe Billing later

The app must not implement full in-app billing during MVP.

---

## 21. Data Model by Phase

### Phase 2 — Auth/Tenant

- profiles
- businesses
- business_members

### Phase 3 — Business + Template Configuration

- business_branding
- business_services
- business_faqs
- business_service_areas
- business_privacy_settings
- business_consent_settings
- public_link_settings
- industry_templates
- industry_template_fields
- business_template_settings

### Phase 4 — Universal Intake Core

- intake_forms
- intake_form_fields
- intake_form_output_settings
- intake_submissions
- intake_submission_values
- leads

### Phase 5 — Lead Workspace

- lead_action_items
- lead_quality_scores

### Phase 6 — AI Core

- ai_outputs
- prompt_templates
- prompt_versions
- usage_events

### Phase 7 — Sales Ready

- subscriptions

---

## 22. Request Flows

### 22.1 Public Submission Flow

1. Customer opens public intake URL.
2. System resolves business by slug.
3. System loads public-safe business data.
4. System loads active intake form.
5. Customer submits form.
6. Server validates input.
7. System stores submission according to privacy mode.
8. System creates lead.
9. System creates initial lead action items.
10. System shows success page.
11. Owner sees lead in dashboard.

### 22.2 Owner Review Flow

1. Owner logs in.
2. System resolves authenticated user.
3. System resolves business membership.
4. Owner opens dashboard.
5. System loads tenant-scoped leads.
6. Owner opens lead detail.
7. Owner reviews missing info, quality score, and AI outputs.
8. Owner copies reply or follow-up draft.
9. Owner manually sends message outside BizPilot.
10. Owner updates lead status.

### 22.3 AI Generation Flow

1. Lead exists.
2. Server gathers permitted lead data.
3. Server gathers business profile, services, FAQ, tone, and template context.
4. AI Service selects prompt version.
5. AI Provider returns structured output where useful.
6. Output is validated.
7. Output is stored according to privacy mode.
8. Owner sees drafts and recommendations.

---

## 23. Deployment Architecture

MVP deployment:

- Next.js on Vercel
- Supabase Cloud for Auth and PostgreSQL
- Resend for email
- Stripe Payment Links for payments
- OpenAI API through server-side calls

Docker and self-hosting are not part of MVP.

They may be revisited later if scale, cost, or control requirements justify them.

---

## 24. Scalability Direction

The architecture should scale in stages:

### Stage 1 — MVP

- Single Next.js app
- Supabase Cloud
- Vercel
- Manual/concierge setup

### Stage 2 — Early Paid Customers

- Better monitoring
- Stronger RLS testing
- More template configuration
- Improved AI prompts
- Basic usage tracking

### Stage 3 — Validated Growth

- More templates
- Booking Lite
- Growth Studio Lite
- Better reminders
- Paid plans

### Stage 4 — Scale

- Dedicated background jobs if needed
- Advanced analytics
- More robust billing
- Integrations
- Self-hosting or hybrid infrastructure only if necessary

---

## 25. Future Architecture Boundaries

Future only:

- Booking Lite
- Car Detailing Template
- Salon Template
- Education Template
- Growth Studio Lite
- Review request drafts
- Campaign drafts
- Google Business content drafts
- Integrations
- White-label
- Marketplace
- AI Operator

Do not implement these before validation.

---

## 26. Strict Non-Goals / Not Now

The architecture must not include MVP implementation for:

- Full CRM
- Full booking engine
- Full drag-and-drop builder
- Advanced conditional form logic
- Payments inside app
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
- Multi-vertical public launch
- AI voice
- Fully automated pricing
- Custom AI model training
- Vector database
- Microservices
- Kubernetes
- Complex integrations

---

## 27. Definition of Done

This document is complete when:

- Universal Core + Industry Templates is the canonical architecture.
- Cleaning Smart Quote Template v1 is the first GTM template.
- Supabase-first architecture is locked.
- Tenant isolation rules are explicit.
- RLS requirements are explicit.
- Dynamic intake architecture is defined without overbuilding.
- Lead Conversion Layer is defined.
- AI Assistant Layer is server-side and draft-only.
- Privacy architecture is defined.
- Concierge setup architecture is included.
- Future systems are separated from MVP.

---

## 28. Approval Status

**Status:** Pending MoOoH Approval

After approval, this document becomes canonical for BizPilot AI architecture.
