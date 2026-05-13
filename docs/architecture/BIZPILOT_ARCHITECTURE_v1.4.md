# BizPilot AI — Architecture v1.4

**Project:** BizPilot AI
**Document Type:** Architecture
**Version:** v1.4
**Status:** Final Founder-Grade Canonical Draft — Phase 5 Alignment Synced
**Owner:** MoOoH
**Phase:** Phase 5 Stabilization / Completion Candidate; Phase 6 Foundation Started
**Last Updated:** 2026-05-11

---

## Current Implementation Status — 2026-05-11

The protected dashboard architecture has reached Phase 5 stabilization / completion candidate status. The shared shell, dashboard overview, business configuration workspace, lead workspace, and lead detail routes are implemented.

The next architecture step is end-to-end manual QA and demo readiness. Keep the product focused on quote request capture, lead organization, reply urgency, follow-up discipline, public quote link visibility, business readiness, and simple recovery proof.

Phase 6 foundation has started with a manual, on-demand AI Lead Assistant. Full Phase 6 remains open. AI auto-send, email sending, billing, booking, integrations, and generic CRM expansion remain out of scope.

---

## 1. Architecture Purpose

This document defines the canonical architecture for BizPilot AI v1.4.

BizPilot is an:

```text
AI Quote Recovery & Lead Conversion Desk
```

It is built as:

```text
Universal Smart Intake Core + AI Lead Conversion Core + Editable Industry Templates
```

The first GTM wedge is Cleaning.

---

## 2. Architecture Principles

- Build like a platform.
- Ship like a simple cleaning lead recovery product.
- Sell like a done-for-you revenue recovery service.
- Keep server cost near zero before validation.
- Keep MVP narrow.
- Keep core reusable.
- Keep AI assistant-only.
- Keep owner in control.
- Enforce tenant isolation from Phase 2.
- Avoid CRM, booking, integrations, and background automation until validation.

---

## 3. High-Level Layers

BizPilot has nine architecture layers:

1. Core SaaS Layer
2. Business Operating Layer
3. Industry Template Layer
4. Universal Smart Intake Layer
5. Lead Conversion Desk Layer
6. AI Assistant Layer
7. Concierge / Sales Setup Layer
8. Validation and Revenue Proof Layer
9. Cost Control and Reliability Layer

---

## 4. Core SaaS Layer

Responsibilities:

- Authentication
- Profiles
- Businesses
- Business members
- Tenant isolation
- RLS policies
- Usage events
- Subscription placeholder

Core tables:

- profiles
- businesses
- business_members
- usage_events
- subscriptions

---

## 5. Business Operating Layer

Responsibilities:

- Business profile
- Branding
- Services
- FAQ
- Service areas
- Privacy mode
- Consent settings
- Business readiness score
- Public link placement checklist

Tables:

- business_branding
- business_services
- business_faqs
- business_service_areas
- business_privacy_settings
- business_consent_settings
- business_onboarding_tasks

---

## 6. Industry Template Layer

Responsibilities:

- Vertical definitions
- Cleaning-first template
- Editable template fields
- Template-level missing info rules
- Template-level AI context
- Future vertical template support

Tables:

- verticals
- industry_templates
- industry_template_fields
- business_template_settings

MVP includes only Cleaning as active GTM.

Future verticals:

- Car Detailing
- Salon / Beauty
- Education / Tutoring
- Home Services
- Wellness

No second vertical before validation.

---

## 7. Universal Smart Intake Layer

Responsibilities:

- Public branded quote page
- Business slug resolution
- Dynamic form rendering
- Field value capture
- Server-side validation
- Consent version capture
- Lead source tracking
- Public link variants
- Submission preview QA
- Basic spam protection

Tables:

- intake_forms
- intake_form_fields
- intake_submissions
- intake_submission_values
- leads
- lead_source_metadata
- consent_versions
- public_link_variants

Public page rules:

- Can resolve business by slug.
- Can show public-safe business data.
- Can insert scoped submission and lead for the resolved business.
- Cannot read private dashboard data.
- Cannot read AI outputs.
- Cannot read usage or subscription data.
- Cannot read another business’s private configuration.

---

## 8. Lead Conversion Desk Layer

Responsibilities:

- Lead list
- Lead detail
- Lead quality
- Missing info
- Response SLA state
- Lead events timeline
- Today’s Action Panel
- Follow-up needed rule
- Manual outcome tracking
- Revenue recovery proof

Tables:

- lead_quality_scores
- lead_action_items
- lead_events

Important lead fields:

- first_viewed_at
- first_reply_copied_at
- last_owner_action_at
- response_status
- response_sla_state
- first_response_latency
- manual_outcome

Lead statuses:

- New
- Reviewed
- Replied
- Follow-Up Needed
- Booked
- Lost
- Archived

Manual outcomes:

- Booked
- Lost
- No response
- Not a fit
- Asked info

---

## 9. AI Assistant Layer

Responsibilities:

- Lead summary
- Reply draft
- Follow-up draft
- Missing info reasoning
- Suggested next action
- Lead quality explanation
- Tone variants
- Prompt Registry
- Structured output validation
- AI privacy filter
- AI cost tracking
- AI fallback behavior

Tables:

- ai_outputs
- prompt_templates
- prompt_versions
- ai_prompt_evaluations
- usage_events

AI boundaries:

- No auto-send
- No booking confirmation
- No invented pricing
- No invented availability
- No negotiation
- No direct customer chat
- No AI operator

---

## 10. Concierge / Sales Setup Layer

Responsibilities:

- Done-for-you business setup
- Demo Generator
- Before/After Sales View
- Public link placement guide
- Founding customer setup
- Founder Plus support
- Monthly optimization review later

Key assets:

- Demo cleaning business
- Demo public quote page
- Demo lead
- Demo AI drafts
- Demo Today’s Action Panel
- Demo Revenue Recovery Proof

---

## 11. Validation and Revenue Proof Layer

Responsibilities:

- Track validation gate
- Track owner review rate
- Track AI draft usage
- Track source channel
- Track time-to-value
- Track lead outcomes
- Track revenue recovery proof
- Track AI cost per lead

Core validation metrics:

- businesses_onboarded
- leads_submitted
- owner_review_rate
- ai_draft_copy_rate
- paying_or_payment_ready_customers
- public_link_placements
- source_channel_coverage
- time_to_value_minutes
- cost_per_lead

---

## 12. Cost Control and Reliability Layer

Responsibilities:

- Keep AI calls on-demand
- Cache AI outputs
- Track token usage and estimated cost
- Prevent background AI agents
- Prevent always-on worker dependency in MVP
- Keep infrastructure cloud-managed and minimal
- Track AI cost as percent of revenue
- Support graceful fallbacks when AI/email fails

Reliability rule:

```text
Lead capture must work even if AI generation fails.
```

AI is value-add. Lead capture, storage, and owner review are core.

---

## 13. Request Flows

### 13.1 Public Submission Flow

1. Customer opens public quote URL.
2. System resolves business by slug.
3. System loads only public-safe data.
4. System loads active intake form and fields.
5. Customer submits form.
6. Server validates input.
7. System captures consent version.
8. System captures source metadata when available.
9. System stores submission according to privacy mode.
10. System creates lead.
11. System creates initial lead events/action items.
12. Customer sees success page.
13. Owner receives notification later in Sales-Ready phase.

### 13.2 Owner Review Flow

1. Owner signs in.
2. System resolves authenticated user.
3. System checks business membership.
4. Owner opens Lead Conversion Desk.
5. System loads tenant-scoped leads.
6. Owner views lead detail.
7. System marks first_viewed_at if not already set.
8. Owner reviews missing info, lead quality, response SLA, and AI drafts.
9. Owner copies reply/follow-up draft.
10. System records first_reply_copied_at and lead event.
11. Owner sends message manually outside BizPilot.
12. Owner marks outcome.

### 13.3 AI Generation Flow

1. Lead exists.
2. Server checks tenant access.
3. Server gathers allowed lead data and business context.
4. AI privacy filter removes unnecessary data.
5. Prompt Registry selects prompt version.
6. AI Provider generates structured output.
7. Output parser validates schema.
8. Usage and cost are tracked.
9. Output is cached.
10. Owner sees draft and can copy/edit manually.

---

## 14. Tenant Isolation Rules

Rules:

- Every business-owned operational record includes business_id.
- Dashboard reads require business membership.
- Public quote page can only create records for resolved business slug.
- Public quote page can read only public-safe fields.
- AI outputs belong to both lead and business.
- Lead metadata belongs to business.
- No user can access another business’s private data.
- Admin/concierge access is separated and restricted.

---

## 15. RLS Requirements

RLS is required for:

- profiles
- businesses
- business_members
- business settings
- templates
- intake forms
- submissions
- leads
- lead metadata
- AI outputs
- usage events
- subscriptions

Policy tests are required for each phase.

---

## 16. Public Intake Security

Public intake must include:

- Server-side validation
- Honeypot field
- Scoped public insert
- Public-safe read only
- No private dashboard data read
- No AI output read
- No usage data read
- Basic spam protection
- RLS tests
- Consent capture

Rate limiting may be added when needed.

---

## 17. Deployment Architecture

MVP path:

- Local development first
- Supabase Cloud
- Vercel deploy
- Resend
- Stripe Payment Links
- OpenAI server-side API calls

No paid infrastructure should be required before validation unless needed.

Docker, self-hosting, replicas, queues, workers, and advanced infrastructure are future only.

---

## 18. Strict Non-Goals / Not Now

The MVP architecture must not include:

- Microservices
- Kubernetes
- Vector database
- Custom model hosting
- Full CRM
- Full booking engine
- Calendar sync
- WhatsApp/SMS/Instagram APIs
- AI operator
- Full billing system
- Advanced analytics warehouse
- Marketplace
- Always-on workers
- Background AI agents

---

## Dashboard Shell and Information Architecture — v1.4.1

Dashboard IA and UX decisions are canonical and detailed in:

```text
docs/product/BIZPILOT_DASHBOARD_UX_STANDARD_v1.0.md
```

### Protected Dashboard Shell

All protected dashboard pages must use the shared dashboard shell.

Canonical files:

```text
app/(dashboard)/layout.tsx
components/dashboard/dashboard-shell.tsx
components/dashboard/dashboard-sidebar.tsx
```

The shell owns:

- Protected dashboard frame
- Sidebar
- Shared dashboard header when applicable
- App-level navigation
- Common spacing and layout
- Responsive dashboard structure

Pages own only page-specific content.

### Route Semantics

```text
/dashboard                     = Dashboard Overview
/dashboard/configuration       = Business Configuration
/dashboard/leads               = Leads
/dashboard/leads/[leadId]      = Lead Detail
```

### Page Content Boundary

Pages must not duplicate:

- Sidebar
- Global dashboard header
- App-level navigation
- Shell-level responsive layout logic

### Right Rail Rule

The right rail must be operational context only.

Allowed:

- Readiness hints
- Quote link guidance
- Lead context
- Save status
- Preview
- Page-specific operational help

Not allowed:

- Duplicate app navigation
- Repeated sidebar links
- Unrelated marketing content

## 19. Definition of Done

This architecture is complete when:

- Universal core and Cleaning-first GTM are clear.
- Lead Conversion Desk is central.
- AI Assistant is bounded.
- Revenue Recovery Proof is included.
- Cost Control Architecture is included.
- RLS and tenant isolation are mandatory.
- MVP avoids CRM, booking, and integration complexity.
