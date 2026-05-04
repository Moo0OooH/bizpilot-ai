# BizPilot AI — Full Canonical Package v1.4

**Generated:** 2026-05-03

---


---

# FILE: `README.md`

# BizPilot AI v1.4 Final Founder-Grade Canonical Documents

**Project:** BizPilot AI  
**Owner:** MoOoH  
**Status:** Final Founder-Grade Canonical Set  
**Phase:** Phase 0 Final Lock -> Ready for Phase 1  
**Last Updated:** 2026-05-03

---

## Final Locked Strategy

```text
BizPilot AI = AI Quote Recovery & Lead Conversion Desk
Core = Universal Smart Intake Core + AI Lead Conversion Core
GTM = Cleaning-first
MVP = Editable Cleaning Smart Quote Template + Lead Conversion Desk + AI Drafts
Operating Mode = Rule-first, AI-on-demand, cache-heavy, validation-first
Business Mode = Done-for-you founding customer setup before self-serve SaaS
```

BizPilot is not a simple form builder.  
BizPilot is not a full CRM.  
BizPilot is not a booking engine.  
BizPilot is not an AI operator.  
BizPilot is a quote recovery and lead conversion system for small local service businesses, starting with cleaning.

---

## Included Documents

### Product

- `docs/product/BIZPILOT_MASTER_BLUEPRINT_v1.4.md`
- `docs/product/BIZPILOT_BUILD_PLAN_v1.4.md`
- `docs/product/BIZPILOT_SCORING_SPEC_v1.1.md`
- `docs/product/BIZPILOT_VALIDATION_DASHBOARD_SPEC_v1.1.md`
- `docs/product/BIZPILOT_DEMO_GENERATOR_AND_SALES_ASSETS_SPEC_v1.0.md`
- `docs/product/BIZPILOT_VERTICAL_EXPANSION_PLAYBOOK_v1.0.md`

### Architecture

- `docs/architecture/BIZPILOT_ARCHITECTURE_v1.4.md`

### Engineering

- `docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.4.md`
- `docs/engineering/BIZPILOT_EXECUTION_ROADMAP_v1.4.md`
- `docs/engineering/BIZPILOT_DATABASE_RLS_POLICY_BASELINE_v1.0.md`

### GTM / Sales

- `docs/gtm/BIZPILOT_GTM_PLAYBOOK_v1.1.md`

### Finance / Risk / Security

- `docs/finance/BIZPILOT_COST_CONTROL_AND_UNIT_ECONOMICS_v1.0.md`
- `docs/security/BIZPILOT_PRIVACY_SECURITY_COMPLIANCE_BASELINE_v1.0.md`
- `docs/operations/BIZPILOT_RISK_REGISTER_AND_DECISION_RULES_v1.0.md`
- `docs/operations/BIZPILOT_PHASE_1_START_CHECKLIST_v1.0.md`

### Consolidated

- `docs/BIZPILOT_FULL_CANONICAL_PACKAGE_v1.4.md`

---

## Phase 0 Final Decision

```text
Approved — Phase 0 Final Lock
Next Step — Start Phase 1: Project Foundation
```

Do not keep expanding the documents before starting execution. Patch only if a real contradiction appears during implementation.

---

## Official Reference Baseline

The v1.4 set is aligned with these official sources as of 2026-05-03:

- Node.js release schedule: https://nodejs.org/en/about/previous-releases
- Node.js release working group schedule: https://github.com/nodejs/release
- Next.js App Router docs: https://nextjs.org/docs/app
- pnpm installation docs: https://pnpm.io/installation
- Supabase RLS docs: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase database docs: https://supabase.com/docs/guides/database/overview
- OpenAI pricing and model docs: https://openai.com/api/pricing/ and https://developers.openai.com/api/docs/models/gpt-5-mini
- Resend pricing: https://resend.com/pricing
- Vercel pricing: https://vercel.com/pricing


---

# FILE: `docs/product/BIZPILOT_MASTER_BLUEPRINT_v1.4.md`

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


---

# FILE: `docs/architecture/BIZPILOT_ARCHITECTURE_v1.4.md`

# BizPilot AI — Architecture v1.4

**Project:** BizPilot AI  
**Document Type:** Architecture  
**Version:** v1.4  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Phase:** Phase 0 Final Lock  
**Last Updated:** 2026-05-03

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

## 19. Definition of Done

This architecture is complete when:

- Universal core and Cleaning-first GTM are clear.
- Lead Conversion Desk is central.
- AI Assistant is bounded.
- Revenue Recovery Proof is included.
- Cost Control Architecture is included.
- RLS and tenant isolation are mandatory.
- MVP avoids CRM, booking, and integration complexity.


---

# FILE: `docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.4.md`

# BizPilot AI — Engineering Standard v1.4

**Project:** BizPilot AI  
**Document Type:** Engineering Standard  
**Version:** v1.4  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Phase:** Phase 0 Final Lock  
**Last Updated:** 2026-05-03

---

## 1. Engineering Mission

Build a simple, secure, low-cost, validation-first SaaS foundation that can sell quickly and scale later.

BizPilot must be:

- Clean
- Multi-tenant
- Privacy-aware
- Cost-controlled
- AI-assisted, not AI-operated
- Modular enough for future verticals
- Simple enough to ship quickly
- Strict about MVP scope
- Reliable enough for early paying customers

---

## 2. Locked MVP Stack

MVP stack:

- Node.js 24 LTS
- pnpm 10.x or 11.x pinned per project after initialization
- Next.js App Router
- TypeScript strict
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase PostgreSQL
- Supabase RLS
- OpenAI API through server-side AI abstraction
- Prompt Registry
- Structured outputs where useful
- Resend for owner email notification
- Stripe Payment Links first
- Vercel for deployment
- GitHub for source control

Removed from MVP:

- Prisma
- Docker-first path
- Kubernetes
- Microservices
- Vector database
- Custom model training
- Full Stripe Billing
- WhatsApp/SMS/Instagram APIs
- Full CRM architecture
- Background AI agents
- Always-on workers

---

## 3. Architecture Rule

All business workflows must follow:

```text
UI -> Server Actions / Route Handlers -> Services -> Repositories -> Supabase
```

Rules:

- UI components do not own business logic.
- Repositories own database operations.
- Services own business workflows.
- Policies own authorization decisions.
- AI provider calls are server-side only.
- Tenant-sensitive access must be server-side.
- RLS is mandatory for tenant-owned data.

---

## 4. Folder Standard

```text
app/                 routes and layouts
components/          reusable UI
features/            domain UI and workflows
server/actions/      server actions
server/services/     business logic
server/repositories/ data access
server/policies/     tenant and authorization rules
server/ai/           AI provider abstraction
lib/                 shared helpers and infrastructure
prompts/             prompt registry and prompt versions
types/               shared TypeScript types and schemas
supabase/migrations/ SQL migrations
docs/                canonical documentation
tests/rls/           RLS and policy tests
tests/unit/          rule and service tests
tests/integration/   flow tests
scripts/             future scripts
```

---

## 5. TypeScript Standard

- TypeScript strict mode is required.
- No implicit `any`.
- Use explicit return types for exported service/repository functions where useful.
- Avoid unsafe casting.
- Validate API inputs and AI outputs before use.
- Shared domain types must be centralized.
- Schema validation is required for structured AI outputs.
- External data must never be trusted directly.

---

## 6. File Header Standard

Important source files should include:

```ts
/**
 * File: server/services/lead-quality.service.ts
 * Project: BizPilot AI
 * Description: Calculates rule-based lead quality for intake submissions.
 * Author: MoOoH
 * Created: 2026-05-03
 * Last Updated: 2026-05-03
 */
```

---

## 7. Comment Standard

Comments must be in English.

Use comments for:

- Business rules
- Security rules
- Tenant/RLS assumptions
- Privacy behavior
- AI fallback logic
- Non-obvious decisions

Avoid comments that simply repeat the code.

---

## 8. Multi-Tenant Standard

Every tenant-owned operational record must include `business_id` unless explicitly justified.

Tenant-owned tables include:

- business_branding
- business_services
- business_faqs
- business_service_areas
- business_privacy_settings
- business_consent_settings
- business_onboarding_tasks
- business_template_settings
- intake_forms
- intake_form_fields
- intake_submissions
- intake_submission_values
- leads
- lead_source_metadata
- lead_quality_scores
- lead_action_items
- lead_events
- public_link_variants
- ai_outputs
- usage_events
- subscriptions

Rules:

- A user can only access businesses where they are a business_member.
- Public quote page can create leads only for the resolved business slug.
- Public quote page cannot read private tenant data.
- Admin/concierge access must be separated.
- RLS must be enabled before real feature work depends on the table.

---

## 9. RLS Standard

RLS is required from Phase 2.

For each tenant-owned table:

- Enable RLS.
- Add read/write policies.
- Write at least one RLS test.
- Test member access.
- Test cross-tenant denial.
- Test public insert behavior when applicable.

Public intake rule:

```text
Public users may insert scoped submissions for a valid business.
Public users must not read private dashboard data.
```

---

## 10. Data Model Standard

### Phase 2

- profiles
- businesses
- business_members

### Phase 3

- verticals
- business_branding
- business_services
- business_faqs
- business_service_areas
- business_privacy_settings
- business_consent_settings
- industry_templates
- industry_template_fields
- business_template_settings
- business_onboarding_tasks

### Phase 4

- intake_forms
- intake_form_fields
- intake_submissions
- intake_submission_values
- leads
- lead_source_metadata
- consent_versions
- public_link_variants

### Phase 5

- lead_quality_scores
- lead_action_items
- lead_events

### Phase 6

- ai_outputs
- prompt_templates
- prompt_versions
- usage_events
- ai_prompt_evaluations

### Phase 7

- subscriptions

---

## 11. Cost Control Engineering Policy

AI and infrastructure must stay low-cost before validation.

Rules:

- No AI auto-generation by default.
- Use rule-based logic before AI where possible.
- One AI bundle per lead by default.
- Cache AI outputs.
- Regenerate only when lead data or business context changes.
- Track model, input tokens, output tokens, cached tokens, and estimated cost.
- Store `cost_per_lead` or equivalent usage metadata.
- Alert internally if AI cost exceeds 10% of customer monthly revenue.
- Do not add always-on workers in MVP.
- Do not add vector database in MVP.
- Do not add file storage unless required.
- Do not send AI calls from the browser.

---

## 12. AI Engineering Standard

AI components:

- AI service abstraction
- Prompt Registry
- Prompt versions
- Structured output schemas
- Privacy filter
- Cost tracker
- Error fallback
- Usage event logging

AI output types:

- Lead summary
- Reply draft
- Follow-up draft
- Missing info reasoning
- Suggested next action
- Lead quality explanation
- Tone variants

AI must not:

- Auto-send
- Confirm booking
- Invent price
- Invent availability
- Negotiate
- Directly message customers
- Replace owner judgment

---

## 13. Prompt Registry Standard

Each prompt entry must define:

- Prompt name
- Version
- Purpose
- Input context
- Output schema
- Privacy notes
- Cost notes
- Failure fallback
- Approved model tier

Prompts must not live inside UI components.

---

## 14. Scoring Standard

MVP scoring must be rule-based first.

Canonical Lead Quality levels:

- Strong
- Good
- Needs Info
- Low Fit

Scoring must be explainable to the owner.

AI may enhance reasoning in Phase 6, but core status must not depend entirely on AI.

---

## 15. Response SLA Standard

The product must track response state without building a CRM.

Fields on lead or related records may include:

- first_viewed_at
- first_reply_copied_at
- last_owner_action_at
- response_status
- response_sla_state
- first_response_latency

States:

- New — not reviewed yet
- Viewed — no reply copied yet
- Reply copied — waiting for booked/lost
- Follow-up due today
- Overdue

---

## 16. Revenue Recovery Proof Standard

The product must track lightweight proof of value:

- quote requests captured
- AI drafts copied
- follow-ups due
- overdue leads recovered
- strong leads acted on
- manual outcomes marked
- follow-up actions completed

This must remain simple and must not become an analytics warehouse in MVP.

---

## 17. Privacy Engineering Standard

Required fields/concepts:

- privacy mode
- consent version
- consent accepted timestamp
- AI processing disclosure
- privacy contact email
- data retention days
- delete request status

MVP privacy modes:

- Standard Mode
- Minimal Data Mode

Forward-Only Mode is future.

---

## 18. Public Intake Security Standard

Public intake must include:

- Server-side validation
- Honeypot field
- Scoped public insert
- No public read of private data
- Safe business slug lookup
- Basic spam protection
- RLS tests
- Consent capture

Rate limiting may be added when needed.

---

## 19. Email Standard

Resend is used for MVP owner email notifications.

Required:

- Owner email notification for new lead

Optional later:

- Customer confirmation email

The public success page is sufficient for initial MVP validation.

---

## 20. Payment Standard

MVP uses Stripe Payment Links.

Do not build full billing in MVP.

Allowed:

- Payment link storage
- Manual subscription placeholder
- Founding customer package tracking

Future:

- Stripe webhook
- Trial cron
- Subscription sync
- DIY plan

---

## 21. Testing Standard

Minimum tests:

- RLS member access
- RLS cross-tenant denial
- Public intake insert scope
- Business membership policy
- Lead quality rules
- Missing info rules
- Follow-up rule
- Manual outcome update
- Revenue Recovery Proof summary calculation
- AI output schema validation
- Cost tracking calculations where applicable

---

## 22. Git Commit Standard

Examples:

```text
docs: lock bizpilot v1.4 canonical documents
chore: initialize project foundation
feat(auth): add tenant foundation
feat(intake): add public quote submission
feat(leads): add lead conversion desk
feat(ai): add reply draft generation
fix(auth): enforce business membership check
```

---

## 23. Strict Non-Goals / Not Now

The MVP must not include:

- Full CRM
- Full booking engine
- Calendar sync
- WhatsApp API
- SMS sending
- Instagram API
- Auto-send
- AI operator
- Mobile app
- Marketplace
- Custom domain
- Full Stripe Billing
- Advanced analytics warehouse
- Vector database
- Microservices
- Kubernetes
- Always-on workers
- Background AI agents

---

## 24. Definition of Done

This document is complete when:

- Supabase-first stack is locked.
- Cost control rules are explicit.
- RLS standards are explicit.
- AI boundaries are explicit.
- Revenue Recovery Proof is included.
- Manual outcome tracking is supported.
- MVP scope prevents overbuilding.


---

# FILE: `docs/product/BIZPILOT_BUILD_PLAN_v1.4.md`

# BizPilot AI — Build Plan v1.4

**Project:** BizPilot AI  
**Document Type:** Build Plan  
**Version:** v1.4  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Phase:** Phase 0 Final Lock  
**Last Updated:** 2026-05-03

---

## 1. Build Strategy

Build like a platform.  
Ship like a simple cleaning lead recovery product.  
Sell like a done-for-you revenue recovery service.

The goal is not to build everything.  
The goal is to reach paying validation quickly with low server cost and controlled scope.

---

## 2. Phase Overview

1. Phase 0 — Canonical Docs Lock
2. Phase 1 — Project Foundation
3. Phase 2 — Auth + Tenant Foundation
4. Phase 3 — Business + Template Configuration Core
5. Phase 4 — Universal Smart Intake + Public Quote Link
6. Phase 5 — Lead Conversion Desk
7. Phase 6 — AI Lead Conversion Assistant
8. Phase 7 — Sales-Ready MVP
9. Validation Gate
10. Phase 8 — Post-Validation Revenue Automation
11. Phase 9 — Second Vertical Template
12. Phase 10 — Growth Studio Lite

---

## 3. Phase 0 — Canonical Docs Lock

### Goal

Lock the final product, engineering, architecture, build, GTM, scoring, validation, cost, security, and operating direction.

### Deliverables

- docs/product/BIZPILOT_MASTER_BLUEPRINT_v1.4.md
- docs/architecture/BIZPILOT_ARCHITECTURE_v1.4.md
- docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.4.md
- docs/product/BIZPILOT_BUILD_PLAN_v1.4.md
- docs/engineering/BIZPILOT_EXECUTION_ROADMAP_v1.4.md
- docs/gtm/BIZPILOT_GTM_PLAYBOOK_v1.1.md
- docs/product/BIZPILOT_SCORING_SPEC_v1.1.md
- docs/product/BIZPILOT_VALIDATION_DASHBOARD_SPEC_v1.1.md
- docs/product/BIZPILOT_DEMO_GENERATOR_AND_SALES_ASSETS_SPEC_v1.0.md
- docs/product/BIZPILOT_VERTICAL_EXPANSION_PLAYBOOK_v1.0.md
- docs/finance/BIZPILOT_COST_CONTROL_AND_UNIT_ECONOMICS_v1.0.md
- docs/security/BIZPILOT_PRIVACY_SECURITY_COMPLIANCE_BASELINE_v1.0.md
- docs/operations/BIZPILOT_RISK_REGISTER_AND_DECISION_RULES_v1.0.md
- docs/operations/BIZPILOT_PHASE_1_START_CHECKLIST_v1.0.md
- docs/engineering/BIZPILOT_DATABASE_RLS_POLICY_BASELINE_v1.0.md

### Definition of Done

- BizPilot is locked as AI Quote Recovery & Lead Conversion Desk.
- Supabase-first MVP is locked.
- Cleaning-first GTM is locked.
- Cost Control Policy is included.
- Revenue Recovery Proof is included.
- Manual Outcome Tracking is included.
- Strict Non-Goals are included.
- Phase 1 is allowed to begin.

---

## 4. Phase 1 — Project Foundation

### Goal

Create the technical foundation only.

### Tools

- Node.js 24 LTS
- pnpm pinned after initialization
- Git latest
- VS Code latest
- Chrome latest
- GitHub account
- Supabase account

### Deliverables

- Next.js App Router setup
- TypeScript strict
- Tailwind CSS
- shadcn/ui
- Base folder structure
- Environment validation
- Supabase client placeholder
- README skeleton
- lint/build/dev scripts

### Required files

- lib/env/server-env.ts
- lib/env/public-env.ts
- lib/supabase/client.ts
- lib/supabase/server.ts
- lib/utils/cn.ts
- README.md
- .env.example

### Forbidden

- Auth implementation
- Database tables
- Leads
- AI
- Billing
- Email
- Product features

### Definition of Done

- App runs locally.
- lint passes.
- build passes.
- Folder structure exists.
- Supabase client placeholder exists.
- README skeleton exists.
- No product features implemented.
- Git commit pushed.

---

## 5. Phase 2 — Auth + Tenant Foundation

### Goal

Create secure authentication and tenant foundation.

### Tables

- profiles
- businesses
- business_members

### Deliverables

- Supabase project setup
- Supabase Auth
- profiles table
- businesses table
- business_members table
- RLS policies
- RLS tests
- protected dashboard shell
- business membership check

### Required files

- app/auth/sign-in/page.tsx
- app/auth/sign-up/page.tsx
- app/(dashboard)/dashboard/page.tsx
- lib/supabase/middleware.ts
- server/repositories/profiles.repository.ts
- server/repositories/businesses.repository.ts
- server/repositories/business-members.repository.ts
- server/services/auth.service.ts
- server/services/business.service.ts
- server/policies/business-membership.policy.ts
- supabase/migrations/0001_auth_tenant_foundation.sql
- tests/rls/auth-tenant-foundation.test.sql

### Forbidden

- Services
- Templates
- Intake
- Leads
- AI
- Billing

### Definition of Done

- User can sign up/login.
- User profile exists.
- Business exists.
- User belongs to business.
- Dashboard is protected.
- RLS tests pass.
- Cross-tenant access is blocked.

---

## 6. Phase 3 — Business + Template Configuration Core

### Goal

Allow owner or concierge to configure business and editable Cleaning Template.

### Tables

- verticals
- business_branding
- business_services
- business_faqs
- business_service_areas
- business_privacy_settings
- business_consent_settings
- industry_templates
- industry_template_fields
- business_template_settings
- business_onboarding_tasks

### Deliverables

- Business profile
- Branding
- Services
- FAQ
- Service areas
- Privacy settings
- Consent settings
- Vertical = Cleaning
- Editable Cleaning Template
- Business Readiness Score

### Forbidden

- Drag-and-drop builder
- Conditional logic
- Multi-step funnel
- Marketplace
- Second vertical launch

### Definition of Done

- Business can configure profile.
- Business can configure services, FAQ, service areas.
- Cleaning template can be edited.
- Business Readiness Score works.
- RLS tests pass.

---

## 7. Phase 4 — Universal Smart Intake + Public Quote Link

### Goal

Create public branded quote link and submit leads.

### Tables

- intake_forms
- intake_form_fields
- intake_submissions
- intake_submission_values
- leads
- lead_source_metadata
- consent_versions
- public_link_variants

### Deliverables

- Public branded quote page
- Dynamic form renderer
- Editable Cleaning Template rendering
- Lead submission
- Consent capture
- Source tracking
- Success page
- Submission preview QA
- Basic spam protection

### Definition of Done

- Public quote page works.
- Dynamic fields render from config.
- Lead submission works.
- Lead belongs to correct business.
- Source tracking works.
- Consent version is captured.
- Public page cannot read private data.
- RLS tests pass.

---

## 8. Phase 5 — Lead Conversion Desk

### Goal

Create the owner workspace that turns leads into actions.

### Tables

- lead_quality_scores
- lead_action_items
- lead_events

### Lead fields

- first_viewed_at
- first_reply_copied_at
- last_owner_action_at
- response_status
- response_sla_state
- first_response_latency
- manual_outcome

### Deliverables

- Lead list
- Lead detail
- Lead status
- Lead Quality Score
- Missing Info Detection
- Response SLA State
- Lead Events Timeline
- Today’s Action Panel
- Follow-Up Needed Rule
- Copy actions
- Manual Outcome Tracking
- Revenue Recovery Proof basics

### Today’s Action Panel CTAs

- Reply
- Ask Info
- Follow-up

### Definition of Done

- Owner sees only own leads.
- Lead quality works.
- Missing info works.
- Response SLA works.
- Timeline works.
- Copy actions update timestamps.
- Manual outcome can be set.
- Revenue Recovery Proof summary appears.
- RLS tests pass.

---

## 9. Phase 6 — AI Lead Conversion Assistant

### Goal

Add AI assistance after the lead workflow exists.

### Tables

- ai_outputs
- prompt_templates
- prompt_versions
- usage_events
- ai_prompt_evaluations

### Deliverables

- AI service abstraction
- Prompt Registry
- Lead summary
- Reply draft
- Follow-up draft
- Missing info reasoning
- Suggested next action
- Lead quality explanation
- Tone variants
- Structured output schemas
- AI privacy filter
- AI cost tracker
- Usage/cost tracking

### AI cost rules

- One AI bundle per lead by default.
- Cache outputs.
- Regenerate only on change.
- Track estimated cost.
- No background agents.

### Definition of Done

- AI outputs are generated server-side.
- Prompt Registry is used.
- Structured validation works.
- Usage/cost tracking works.
- Privacy filter works.
- No auto-send exists.

---

## 10. Phase 7 — Sales-Ready MVP

### Goal

Make the product sellable to 1-3 real cleaning businesses.

### Tools

- Resend
- Stripe Payment Links
- Vercel

### Tables

- subscriptions

### Deliverables

- Owner email notification
- Concierge setup workflow
- Demo Generator
- Before/After Sales View
- Public Link Placement Guide
- Founding customer package
- Stripe Payment Links
- GTM Playbook

### Definition of Done

- Email notification works.
- Demo Generator works.
- Before/After view works.
- Concierge setup works.
- Stripe Payment Links ready.
- GTM Playbook ready.
- 5 demo prospects prepared.
- MVP can be sold manually.

---

## 11. Validation Gate

Before Phase 8 or any expansion:

- 3 businesses onboarded
- 30 real/semi-real leads submitted
- 50% owner review rate
- 30% AI draft copy/edit rate
- 1 paying or payment-ready customer
- At least 2 active public link placements per business
- At least 20% leads with source_channel tracked
- Time-to-Value <= 20 minutes

90-day target:

- 5 paying or payment-ready businesses
- $500-$1,500 CAD MRR
- 50+ submitted leads
- AI Draft Adoption >= 30%
- Owner Review Rate >= 50%

---

## 12. Phase 8 — Post-Validation Revenue Automation

Only after validation.

Possible scope:

- Stripe webhook
- Trial cron
- DIY plan
- Basic self-serve onboarding
- Subscription sync

---

## 13. Phase 9 — Second Vertical Template

Only after Cleaning validation.

Priority:

1. Car Detailing
2. Salon / Beauty
3. Education / Tutoring
4. Home Services
5. Wellness

Possible scope:

- scripts/add-vertical.ts
- Preset packs
- Template library
- Vertical-specific scoring weights

---

## 14. Phase 10 — Growth Studio Lite

Only after real usage.

Possible scope:

- Review request drafts
- Google Business post drafts
- Seasonal promotion drafts
- Follow-up campaign drafts
- Social caption drafts

Do not build auto-posting or social APIs.

---

## 15. Definition of Done

This build plan is complete when:

- Phase order is clear.
- MVP is sellable but controlled.
- Cost control is explicit.
- Expansion is blocked by validation.
- Non-goals prevent overbuilding.


---

# FILE: `docs/engineering/BIZPILOT_EXECUTION_ROADMAP_v1.4.md`

# BizPilot AI — Execution Roadmap v1.4

**Project:** BizPilot AI  
**Document Type:** Execution Roadmap  
**Version:** v1.4  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Final Execution Principle

```text
Build small.
Sell manually.
Keep server cost near zero.
Use AI only where it creates visible value.
Measure validation before expansion.
```

---

## 2. Required Tools

- Node.js 24 LTS
- pnpm pinned after project creation
- Git latest
- VS Code latest
- Chrome latest
- Supabase account
- GitHub account

Later:

- OpenAI API key
- Resend account
- Stripe account
- Vercel account

---

## 3. Initial Commands

```powershell
node -v
pnpm -v
git --version
```

Create project:

```powershell
E:
mkdir bizpilot-ai
cd bizpilot-ai
pnpm create next-app@latest .
```

Recommended selections:

```text
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src directory: No
App Router: Yes
Turbopack: Yes
Import alias: @/*
```

Install shadcn/ui:

```powershell
pnpm dlx shadcn@latest init
```

---

## 4. Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI - Phase 6
OPENAI_API_KEY=

# Email - Phase 7
RESEND_API_KEY=

# Stripe - Phase 7
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## 5. Canonical Folder Structure

```text
bizpilot-ai/
├─ app/
├─ components/
├─ features/
├─ server/
├─ lib/
├─ prompts/
├─ types/
├─ supabase/
├─ docs/
├─ tests/
├─ scripts/
├─ .env.example
├─ .env.local
├─ package.json
├─ tsconfig.json
├─ next.config.ts
└─ README.md
```

---

## 6. Phase Execution Order

1. Phase 0 — Docs Lock
2. Phase 1 — Project Foundation
3. Phase 2 — Auth + Tenant + RLS
4. Phase 3 — Business + Template Config
5. Phase 4 — Public Quote Link
6. Phase 5 — Lead Conversion Desk
7. Phase 6 — AI Assistant
8. Phase 7 — Sales-ready MVP
9. Validation Gate
10. Expansion only after proof

---

## 7. No-Build List Before Validation

Do not build:

- Full CRM
- Booking engine
- Calendar sync
- WhatsApp/SMS/Instagram integration
- AI operator
- Mobile app
- Marketplace
- Second vertical
- Growth Studio
- Full Stripe Billing
- Advanced analytics
- Vector database
- Microservices
- Kubernetes
- Always-on workers
- Background AI agents

---

## 8. Operating Cadence

Weekly founder cadence:

1. Build one small approved phase item.
2. Run lint/build/tests.
3. Commit.
4. Show demo to at least one prospect when demo-able.
5. Track customer reactions.
6. Do not expand roadmap unless validation data proves demand.

---

## 9. Final Reminder

The project is successful when a cleaning business says:

```text
This helps me stop losing quote requests, reply faster, and follow up better.
I’m willing to pay for it.
```


---

# FILE: `docs/gtm/BIZPILOT_GTM_PLAYBOOK_v1.1.md`

# BizPilot AI — GTM Playbook v1.1

**Project:** BizPilot AI  
**Document Type:** GTM Playbook  
**Version:** v1.1  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. GTM Objective

Get the first paying or payment-ready cleaning businesses through manual founder-led sales.

Primary goal:

```text
3 paying or payment-ready cleaning businesses
```

The GTM objective is not broad awareness. It is paid validation.

---

## 2. Positioning

BizPilot is not sold as AI software.

Sell it as:

```text
A done-for-you quote recovery system for cleaning businesses.
```

Customer-facing promise:

```text
Stop losing cleaning quote requests. We set up a branded quote link for your business so customers give better details, you get clean leads, AI reply drafts, follow-up guidance, and today’s next action — without a full CRM.
```

---

## 3. Ideal Customer Profile

Ideal customers:

- Small cleaning business
- 1-10 people
- Owner replies manually
- Gets quote requests from DMs, SMS, website, Google, Facebook, Instagram
- Has no structured quote form
- Wants more bookings
- Is not ready for full CRM
- Open to done-for-you setup
- Will place the public quote link in at least two locations

---

## 4. Bad-Fit Customers

Avoid:

- Large franchises
- Businesses needing dispatch
- Businesses requiring API integrations immediately
- Businesses with no incoming leads
- Businesses requiring full booking system
- Businesses wanting AI to message customers automatically
- Businesses that will not place the public link anywhere

---

## 5. Core Sales Message

```text
You don’t need a full CRM yet.
You need to stop losing quote requests.
```

Secondary message:

```text
Recover quote requests that normally get lost in DMs, texts, and delayed replies.
```

Trust message:

```text
BizPilot does not message your customers automatically. It prepares drafts. You stay in control.
```

---

## 6. Founding Offers

### Founder Setup

```text
$199 setup
$49/month
```

### Founder Plus — Recommended Default

```text
$299 setup
$79/month
```

Founder Plus is the recommended default because it includes more service and stronger early cash flow.

---

## 7. Outreach Channels

Start with:

- Google Maps prospecting
- Instagram DM
- Facebook page message
- Cold email
- Local Facebook groups
- Direct website contact forms
- Referrals

---

## 8. Prospecting Checklist

For each cleaning business, collect:

- Business name
- Website
- Instagram
- Facebook
- Google Business Profile
- Service area
- Services offered
- Whether they have a quote form
- Whether they ask customers to DM/call
- Whether replies look slow or messy
- Contact method
- Possible public link placement
- Fit score: Strong fit / Good fit / Maybe / Not now

---

## 9. Cold DM Script

```text
Hi [Name], I saw your cleaning business and noticed most customers probably ask for quotes through DMs or messages.

I’m building BizPilot — a done-for-you quote recovery system for cleaning businesses.

It gives you a branded quote link, collects cleaner customer details, and prepares AI reply/follow-up drafts so you can reply faster without using a full CRM.

I can make a quick demo using your business name and services if you want to see how it would look.
```

---

## 10. Cold Email Script

Subject:

```text
Quick quote page idea for [Business Name]
```

Body:

```text
Hi [Name],

I found [Business Name] and noticed you offer cleaning services in [Area].

I’m building BizPilot, a done-for-you quote recovery system for small cleaning businesses.

Instead of customers sending incomplete messages like “How much for cleaning?”, BizPilot gives you a branded quote link that captures the right details, creates a clean lead, and prepares AI reply/follow-up drafts.

You stay in control — nothing is sent automatically.

I can prepare a quick demo for your business so you can see the before/after.

Would you like me to send it?
```

---

## 11. Demo Script

Show:

1. Before: “Hi, how much for cleaning?”
2. Branded quote link
3. Customer submits structured request
4. Lead appears in dashboard
5. Lead Quality Score
6. Missing Info Detection
7. Response SLA State
8. AI Reply Draft
9. AI Follow-Up Draft
10. Today’s Action Panel
11. Revenue Recovery Proof

Close with:

```text
The goal is simple: fewer lost quote requests, faster replies, better follow-up, and more booked jobs.
```

---

## 12. Objection Handling

### “I already use messages.”

```text
That is exactly why BizPilot helps. It does not replace your messages. It gives customers a better link before they message you, so you receive cleaner details and can reply faster.
```

### “I don’t want AI talking to customers.”

```text
BizPilot does not message customers automatically. It only prepares drafts. You decide what to send.
```

### “I don’t need a CRM.”

```text
BizPilot is not a CRM. It is before CRM. It helps with quote requests before they become organized jobs.
```

### “I’m too busy to set it up.”

```text
That is why the founding offer is done-for-you. We set it up and adjust it for 14 days.
```

### “We already have a website form.”

```text
Most website forms only collect data. BizPilot turns the request into a lead with missing info, response urgency, reply draft, follow-up draft, and today’s next action.
```

---

## 13. Public Link Placement Guide

Each customer should place the link in at least two places:

- Website button
- Instagram bio
- Facebook page
- Google Business Profile
- Email signature
- SMS/DM saved reply
- QR code later

Validation requirement:

```text
At least 2 active public link placements per business
```

---

## 14. Follow-Up Sequence

### Day 0

Send demo.

### Day 1

Ask if they want setup.

### Day 3

Show before/after again.

### Day 7

Offer founding customer package.

### Day 14

Final follow-up.

---

## 15. Success Criteria

GTM is working when:

- 10 demos shown
- 3 businesses onboarded or payment-ready
- 1 customer pays or agrees to pay
- At least 30 leads are submitted
- Owners copy or edit AI drafts
- Public links are placed


---

# FILE: `docs/product/BIZPILOT_SCORING_SPEC_v1.1.md`

# BizPilot AI — Scoring Spec v1.1

**Project:** BizPilot AI  
**Document Type:** Product Scoring Specification  
**Version:** v1.1  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Purpose

This document defines rule-based scoring and action logic for BizPilot MVP.

The MVP must be rule-first and AI-assisted later.

The scoring system exists to help owners know:

- Which leads are strong
- Which leads need more information
- Which leads are overdue
- Which leads need follow-up
- What action to take today
- Whether BizPilot is helping convert leads into outcomes

---

## 2. Lead Quality Score

Canonical levels:

- Strong
- Good
- Needs Info
- Low Fit

---

## 3. Strong Lead

A lead is Strong when:

- Customer contact exists
- Service type exists
- Service area matches business
- Preferred date or timing exists
- Required fields are complete
- Request is clear enough to reply

Example:

```text
Strong = contact + service + area + timing + required fields complete
```

---

## 4. Good Lead

A lead is Good when:

- Contact exists
- Service exists
- Area exists
- Required fields mostly complete
- Some optional details missing

Example:

```text
Good = contact + service + area complete, optional details missing
```

---

## 5. Needs Info Lead

A lead is Needs Info when important quote details are missing.

Examples:

- Missing preferred date
- Missing time window
- Missing bathrooms
- Missing bedrooms
- Missing property type
- Missing phone/email
- Service type unclear

---

## 6. Low Fit Lead

A lead is Low Fit when:

- Outside service area
- Unsupported service
- Unclear request
- Spam-like submission
- Missing core contact data
- Business cannot reasonably respond

---

## 7. Intake Completeness Score

Suggested calculation:

```text
Required fields completed: 60%
Important optional fields completed: 20%
Contact quality: 10%
Service-area match: 10%
```

Outputs:

- Complete
- Mostly Complete
- Needs Info
- Poor

---

## 8. Missing Info Detection

MVP is rule-based.

Cleaning rules:

- Missing cleaning type
- Missing property type
- Missing bedrooms
- Missing bathrooms
- Missing preferred date
- Missing preferred time window
- Missing service area
- Missing contact
- Outside service area

---

## 9. Response SLA State

States:

- New — not reviewed yet
- Viewed — no reply copied yet
- Reply copied — waiting for booked/lost
- Follow-up due today
- Overdue

Suggested fields:

- first_viewed_at
- first_reply_copied_at
- last_owner_action_at
- response_status
- response_sla_state
- first_response_latency

---

## 10. Follow-Up Needed Rule

A lead should be marked or suggested as Follow-Up Needed when:

- New for more than 24 hours
- Replied but not booked after 48 hours
- Missing info requested but unresolved
- Owner manually marks follow-up

No automatic customer messaging is allowed.

---

## 11. Next Best Action

Allowed actions:

- Reply now
- Ask missing info
- Follow up today
- Mark as booked
- Archive low-fit lead

The action panel must remain simple.

MVP Today’s Action Panel should show only:

- Reply
- Ask Info
- Follow-up

---

## 12. Manual Outcome Tracking

Allowed manual outcomes:

- Booked
- Lost
- No response
- Not a fit
- Asked info

Manual outcomes help validate whether BizPilot contributes to bookings without building a booking engine.

---

## 13. Revenue Recovery Proof Inputs

Revenue Recovery Proof may aggregate:

- quote_requests_captured
- leads_reviewed
- ai_drafts_copied
- follow_ups_due
- follow_ups_completed
- overdue_leads_recovered
- strong_leads_acted_on
- outcomes_marked

This is lightweight proof, not an analytics warehouse.

---

## 14. AI Enhancement

In Phase 6, AI may enhance:

- Lead quality explanation
- Missing info reasoning
- Suggested reply wording
- Follow-up draft
- Suggested next action

AI must not replace rule-based core scoring.

---

## 15. Definition of Done

This spec is complete when:

- Lead quality levels are defined.
- Missing info rules are defined.
- Response SLA states are defined.
- Follow-up rule is defined.
- Manual outcomes are defined.
- Revenue recovery inputs are defined.
- AI remains assistant-only.


---

# FILE: `docs/product/BIZPILOT_VALIDATION_DASHBOARD_SPEC_v1.1.md`

# BizPilot AI — Validation Dashboard Spec v1.1

**Project:** BizPilot AI  
**Document Type:** Validation Dashboard Specification  
**Version:** v1.1  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Purpose

This document defines the validation metrics required before BizPilot expands beyond the MVP.

The dashboard exists to answer:

```text
Should we keep building, fix the offer, or pivot?
```

---

## 2. Validation Gate

Before Phase 8 or expansion:

- 3 businesses onboarded
- 30 real or semi-real leads submitted
- 50% owner review rate
- 30% AI draft copy/edit rate
- 1 paying or payment-ready customer
- At least 2 active public link placements per business
- At least 20% leads with source_channel tracked
- Time-to-Value <= 20 minutes

---

## 3. 90-Day Target

Target after launch effort:

- 5 paying or payment-ready businesses
- $500-$1,500 CAD MRR
- 50+ submitted leads
- AI Draft Adoption >= 30%
- Owner Review Rate >= 50%

---

## 4. Core Metrics

### Business metrics

- businesses_onboarded
- paying_customers
- payment_ready_customers
- MRR
- setup_revenue
- churn_risk_notes

### Product metrics

- leads_submitted
- owner_review_rate
- ai_draft_copy_rate
- follow_up_action_rate
- manual_outcome_completion_rate
- time_to_value_minutes

### Channel metrics

- source_channel
- source_channel_coverage
- public_link_placements
- leads_by_source
- best_source_channel

### AI cost metrics

- ai_calls
- input_tokens
- output_tokens
- cached_tokens
- estimated_cost
- cost_per_lead
- ai_cost_percent_of_revenue

---

## 5. Revenue Recovery Proof

Show simple proof:

```text
This week:
- Quote requests captured
- AI drafts copied
- Follow-ups due
- Overdue leads recovered
- Strong leads acted on
- Outcomes marked
```

This should be visible to owners.

---

## 6. Continue Criteria

Continue if:

- Owners review leads.
- Owners copy/edit AI drafts.
- Public links are placed.
- At least one customer pays or is payment-ready.
- Leads are submitted through real or semi-real usage.
- Setup can be completed under 20 minutes.
- Support effort remains reasonable compared to revenue.

---

## 7. Fix Criteria

Fix positioning/onboarding if:

- Leads submit but owners do not review.
- AI drafts are not used.
- Public links are not placed.
- Demo does not convert.
- Setup takes too long.
- Owners see it as just another form.
- Cost per lead rises without perceived value.

---

## 8. Stop or Pivot Criteria

Stop or pivot if:

- 10 real demos produce no payment-ready interest.
- 3 businesses onboard but no real leads arrive.
- Owners only want a form and will not pay for AI/desk value.
- Support effort exceeds revenue.
- AI value is not understood or used.
- Cleaning market feedback consistently rejects the quote-recovery positioning.

---

## 9. Validation Dashboard UI

The dashboard may start as an internal admin/concierge view.

Minimum cards:

- Businesses onboarded
- Leads submitted
- Owner review rate
- AI draft adoption
- Public link placements
- Source channel coverage
- Time-to-Value
- MRR/payment readiness
- AI cost per lead
- Top validation risks

---

## 10. Definition of Done

This dashboard spec is complete when:

- Validation Gate is measurable.
- AI adoption is measurable.
- Source tracking is measurable.
- Time-to-Value is measurable.
- Revenue Recovery Proof is defined.
- Continue/fix/pivot criteria are explicit.


---

# FILE: `docs/product/BIZPILOT_DEMO_GENERATOR_AND_SALES_ASSETS_SPEC_v1.0.md`

# BizPilot AI — Demo Generator and Sales Assets Spec v1.0

**Project:** BizPilot AI  
**Document Type:** Demo / Sales Assets Specification  
**Version:** v1.0  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Purpose

The Demo Generator exists to make the value of BizPilot obvious in under two minutes.

The first customers should not be asked to imagine the product. They should see their business name, services, public quote link, lead desk, and AI drafts in a realistic demo.

---

## 2. Demo Promise

Show the transformation:

```text
Before: "Hi, how much for cleaning?"
After: clean structured lead + AI reply draft + follow-up + today’s action
```

---

## 3. Demo Assets

Required assets:

- Demo business profile
- Demo branded public quote page
- Demo Cleaning Smart Quote Template
- Demo submitted lead
- Demo lead quality score
- Demo missing info section
- Demo response SLA state
- Demo AI reply draft
- Demo AI follow-up draft
- Demo Today’s Action Panel
- Demo Revenue Recovery Proof

---

## 4. Demo Flow

1. Show messy customer request.
2. Show branded quote page.
3. Submit sample request.
4. Show lead in dashboard.
5. Show Lead Quality Score.
6. Show Missing Info.
7. Show Response SLA.
8. Show AI Reply Draft.
9. Show AI Follow-Up Draft.
10. Show Today’s Action Panel.
11. Show Revenue Recovery Proof.
12. Offer done-for-you setup.

---

## 5. Before/After View

Before:

```text
Customer DM: "Hi, how much for cleaning?"
Owner must ask multiple questions manually.
Follow-up may be forgotten.
```

After:

```text
Customer submits structured request.
Owner sees lead quality, missing info, reply draft, follow-up draft, and next action.
```

---

## 6. Demo Success Criteria

A demo is successful if the prospect says or implies:

- This would save time.
- This would make quote requests clearer.
- This would help with follow-up.
- This is simpler than a CRM.
- I would try this if setup is done for me.

---

## 7. Definition of Done

This spec is complete when:

- Demo flow is defined.
- Required demo assets are defined.
- Before/after view is defined.
- Sales success criteria are defined.


---

# FILE: `docs/product/BIZPILOT_VERTICAL_EXPANSION_PLAYBOOK_v1.0.md`

# BizPilot AI — Vertical Expansion Playbook v1.0

**Project:** BizPilot AI  
**Document Type:** Vertical Expansion Playbook  
**Version:** v1.0  
**Status:** Future-Only Canonical Draft  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Purpose

This document defines how BizPilot can expand beyond cleaning after validation.

No second vertical is allowed before the validation gate is passed.

---

## 2. Expansion Rule

Do not expand until:

- 3 businesses onboarded
- 30 real/semi-real leads submitted
- 50% owner review rate
- 30% AI draft copy/edit rate
- 1 paying or payment-ready customer
- 2 public link placements per business
- Time-to-Value <= 20 minutes

---

## 3. Recommended Order

1. Car Detailing
2. Salon / Beauty
3. Education / Tutoring
4. Home Services
5. Wellness

---

## 4. Why Car Detailing Second

Car Detailing is close to cleaning:

- Service type
- Vehicle type
- Vehicle condition
- Package preference
- Location
- Preferred date/time
- Quote request
- Follow-up

It can use the same Universal Smart Intake and Lead Conversion Desk with a new template.

---

## 5. New Vertical Template Requirements

Each vertical template must define:

- Default fields
- Required/optional rules
- Missing info rules
- Lead quality rules
- AI prompt context
- Reply draft context
- Follow-up draft context
- Demo data
- Sales copy
- Public link placement guidance

---

## 6. Forbidden Expansion Patterns

Do not:

- Rewrite the core per vertical
- Hardcode cleaning assumptions into universal modules
- Launch multiple verticals publicly at once
- Add integrations before customer proof
- Add marketplace templates before repeatable demand

---

## 7. Definition of Done

This playbook is complete when:

- Expansion condition is explicit.
- Vertical order is defined.
- Template requirements are defined.
- Forbidden patterns are defined.


---

# FILE: `docs/finance/BIZPILOT_COST_CONTROL_AND_UNIT_ECONOMICS_v1.0.md`

# BizPilot AI — Cost Control and Unit Economics v1.0

**Project:** BizPilot AI  
**Document Type:** Cost Control / Unit Economics  
**Version:** v1.0  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Purpose

This document exists because BizPilot must not become an expensive SaaS before validation.

The rule is:

```text
If the product is not generating validation, infrastructure must not keep burning money.
```

The MVP should be able to run with near-zero fixed cost before paid customers.

---

## 2. Cost Philosophy

- Use managed cloud services to avoid ops complexity.
- Use free or low-cost tiers until validation.
- Do not add background workers unless revenue justifies it.
- Do not add vector databases.
- Do not generate AI automatically for every event.
- Do not build full billing before customer proof.
- Track cost per lead from the beginning.

---

## 3. Cost Components

### Fixed or semi-fixed

- Domain later
- Vercel paid plan only when needed
- Supabase Pro only when production usage requires it
- Resend paid plan only when email volume requires it

### Usage-based

- OpenAI token usage
- Email volume
- Database storage and bandwidth
- Function invocations if later used

---

## 4. Pre-Validation Cost Target

Before validation:

```text
Target fixed software infrastructure cost: $0-$25/month
Acceptable temporary ceiling: $50/month only if active customer validation is happening
```

Do not upgrade services just because they look more professional.

Upgrade only when a specific constraint appears.

---

## 5. AI Cost Policy

Rules:

- One AI bundle per lead by default.
- Cache AI outputs.
- Regenerate only when lead data or business context changes.
- Rule-based scoring runs before AI.
- Never call AI on every page refresh.
- Never run AI from the browser.
- Track input tokens, cached tokens, output tokens, model, and estimated cost.
- Alert internally if AI cost exceeds 10% of customer monthly revenue.

---

## 6. AI Bundle Definition

One AI bundle may include:

- Lead summary
- Reply draft
- Follow-up draft
- Missing info reasoning
- Suggested next action
- Lead quality explanation
- Tone variants

This should be generated in one orchestrated server-side call where practical, or in a small number of controlled calls if schema quality requires it.

---

## 7. Unit Economics Targets

For Founder Setup:

```text
Revenue: $199 setup + $49/month
Target AI cost: < $5/month/customer initially
Target email cost: near $0/customer initially
Target support effort: under 2 hours setup + light adjustment
```

For Founder Plus:

```text
Revenue: $299 setup + $79/month
Target AI cost: < $8/month/customer initially
Target support effort: under 3 hours setup + monthly review
```

---

## 8. Cost Per Lead

Track:

- ai_cost_per_lead
- email_cost_per_lead
- infrastructure_cost_estimate_per_customer
- total_cost_per_lead
- ai_cost_percent_of_revenue

MVP target:

```text
AI cost per lead should be low enough that 30-100 leads/month/customer remains profitable.
```

---

## 9. Upgrade Rules

Upgrade Supabase only if:

- Free tier limits block active validation
- Real customer usage needs production reliability
- Database/storage limits are hit
- Auth/usage constraints require it

Upgrade Vercel only if:

- Production deploy needs paid features
- Limits block customer usage
- Commercial reliability requires it

Upgrade Resend only if:

- Email volume exceeds free allowance
- Domain/email reliability requires paid plan

---

## 10. Stop-Build Cost Rule

Stop building new features if:

- Monthly cost rises before customer validation
- Support work exceeds revenue
- AI is used but not copied/edited by owners
- Infrastructure upgrades are needed for features that are not validated

---

## 11. Definition of Done

This cost policy is complete when:

- Fixed cost targets are explicit.
- AI usage rules are explicit.
- Unit economics targets are defined.
- Upgrade rules are defined.
- Stop-build cost rules are defined.


---

# FILE: `docs/security/BIZPILOT_PRIVACY_SECURITY_COMPLIANCE_BASELINE_v1.0.md`

# BizPilot AI — Privacy, Security, and Compliance Baseline v1.0

**Project:** BizPilot AI  
**Document Type:** Privacy / Security / Compliance Baseline  
**Version:** v1.0  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Purpose

This document defines the privacy and security baseline for BizPilot MVP.

BizPilot handles customer quote requests, contact details, service details, and AI-generated internal drafts. The product must be built with privacy and tenant isolation from the beginning.

This is not legal advice. It is an engineering and product baseline that reduces avoidable risk.

---

## 2. Core Security Principles

- Tenant isolation is mandatory.
- RLS is mandatory from Phase 2.
- Service role key is server-only.
- No private data is exposed on public quote pages.
- Public intake can only insert scoped submissions.
- AI calls happen server-side only.
- Logs must not contain unnecessary customer details.
- Data minimization is required.

---

## 3. Privacy Modes

### Standard Mode

Stores:

- Submission values
- Lead detail
- AI outputs
- Status and events
- Usage events

### Minimal Data Mode

Stores only useful minimum data:

- Business relationship
- Customer contact
- Service type
- City/service area
- Status
- Minimal notes when necessary
- Created timestamp

### Forward-Only Mode

Future only. Not MVP.

---

## 4. Required Privacy Fields

- consent_version
- consent_accepted_at
- ai_processing_disclosure
- privacy_contact_email
- data_retention_days
- delete_request_status

---

## 5. Canonical Consent Notice

```text
By submitting this request, you agree that your information will be shared with [Business Name] to respond to your quote request. BizPilot may help prepare internal AI drafts, but the business reviews messages before sending.
```

---

## 6. Public Page Security Rules

Public quote page may:

- Read public-safe business name and branding
- Read active public intake form configuration
- Insert scoped submission for resolved business
- Insert lead for resolved business

Public quote page may not:

- Read dashboard data
- Read AI outputs
- Read usage events
- Read private owner details
- Read subscriptions
- Read other businesses

---

## 7. Logging Rules

Logs may include:

- request_id
- business_id
- user_id when authenticated
- operation name
- error code
- timestamp
- cost metadata

Logs should avoid:

- Full customer messages
- Secrets
- API keys
- Tokens
- Payment details
- Private contact details unless strictly needed

---

## 8. AI Privacy Rules

- AI receives only data required for the specific output.
- Privacy filter runs before AI calls.
- AI outputs are stored according to privacy mode.
- AI must not invent unsupported business details.
- AI must not include hidden system or internal metadata in owner-facing drafts.

---

## 9. Secret Management

- `.env.local` is never committed.
- `.env.example` contains placeholders only.
- Supabase service role key is server-only.
- OpenAI key is server-only.
- Stripe secret key is server-only.
- Resend key is server-only.

---

## 10. Data Deletion Baseline

MVP should support at least operational handling of deletion requests:

- Capture delete request status.
- Allow internal review.
- Remove or minimize records where appropriate.
- Keep audit-safe metadata only when needed.

Full automated deletion workflow can come later.

---

## 11. Definition of Done

This baseline is complete when:

- Privacy modes are defined.
- Consent notice is defined.
- Public page security is defined.
- Logging rules are defined.
- AI privacy rules are defined.
- Secret handling is defined.


---

# FILE: `docs/engineering/BIZPILOT_DATABASE_RLS_POLICY_BASELINE_v1.0.md`

# BizPilot AI — Database and RLS Policy Baseline v1.0

**Project:** BizPilot AI  
**Document Type:** Database / RLS Baseline  
**Version:** v1.0  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Purpose

This document defines the database and Row Level Security baseline for BizPilot MVP.

RLS is not optional.

---

## 2. Tenant Model

Core tenant entity:

```text
business
```

Membership table:

```text
business_members
```

Rules:

- A user can belong to one or more businesses.
- A business has one or more members.
- Operational records belong to a business.
- Users access only businesses where they are members.

---

## 3. Core Phase 2 Tables

### profiles

Purpose:

- Stores user profile data linked to Supabase Auth user.

Required columns:

- id
- user_id
- display_name
- created_at
- updated_at

### businesses

Purpose:

- Stores tenant business account.

Required columns:

- id
- name
- slug
- owner_user_id
- created_at
- updated_at

### business_members

Purpose:

- Stores user membership in businesses.

Required columns:

- id
- business_id
- user_id
- role
- created_at

Roles:

- owner
- admin
- member
- concierge_limited later

---

## 4. RLS Policy Groups

Required policy groups:

- Own profile read/update
- Business member read
- Business owner/admin update
- Member-only settings access
- Member-only lead access
- Scoped public insert for intake submissions
- No public read of private data
- Service-role only maintenance behavior

---

## 5. Public Insert Baseline

Public quote pages must insert only for a resolved valid business slug.

Rules:

- Public cannot list businesses.
- Public cannot read private settings.
- Public can read only public-safe form/branding fields.
- Public can insert intake submission and lead under resolved business_id.
- Public insert must pass server-side validation.

---

## 6. RLS Test Requirements

Every phase with new tables must include tests for:

- Member can access own business data
- Non-member cannot access business data
- Public cannot read private data
- Public can submit scoped intake where allowed
- Cross-tenant denial works

---

## 7. Migration Naming

Migration files should use clear phase names:

```text
0001_auth_tenant_foundation.sql
0002_business_template_configuration.sql
0003_public_intake_and_leads.sql
0004_lead_conversion_desk.sql
0005_ai_assistant_outputs.sql
0006_sales_ready_subscriptions.sql
```

---

## 8. Definition of Done

This baseline is complete when:

- Tenant model is clear.
- RLS policy groups are defined.
- Public insert rules are defined.
- RLS tests are required by phase.
- Migration naming is standardized.


---

# FILE: `docs/operations/BIZPILOT_RISK_REGISTER_AND_DECISION_RULES_v1.0.md`

# BizPilot AI — Risk Register and Decision Rules v1.0

**Project:** BizPilot AI  
**Document Type:** Risk Register / Decision Rules  
**Version:** v1.0  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Purpose

This document defines the main startup, product, market, technical, cost, and execution risks for BizPilot.

It also defines rules for continuing, fixing, stopping, or pivoting.

---

## 2. Main Risks

### Risk 1 — Product becomes “just another form”

Mitigation:

- Sell quote recovery, not forms.
- Show Lead Conversion Desk and Revenue Recovery Proof in demo.
- Track AI draft usage and owner review rate.

### Risk 2 — Scope creep into CRM/booking

Mitigation:

- Keep booking, CRM, calendar sync, and automation blocked until validation.
- Use Manual Outcome Tracking instead of booking engine.

### Risk 3 — Server/AI cost grows before revenue

Mitigation:

- Rule-first logic.
- AI-on-demand.
- Cached outputs.
- No background workers.
- Track cost per lead.

### Risk 4 — Cleaning businesses do not pay

Mitigation:

- Demo 10 real businesses.
- Offer done-for-you setup.
- Use Founder Plus as default.
- Pivot messaging if owners only see it as a form.

### Risk 5 — Owners do not use dashboard

Mitigation:

- Keep Today’s Action Panel simple.
- Show only Reply, Ask Info, Follow-up.
- Send owner email notifications in Sales-Ready phase.

### Risk 6 — AI drafts are not useful

Mitigation:

- Use FAQ and service context.
- Keep owner in control.
- Add useful / needs edit / not useful feedback later.
- Improve prompts from real examples.

### Risk 7 — Public links are not placed

Mitigation:

- Public Link Placement Guide.
- Require at least 2 placements per business for validation.
- Concierge setup includes placement support.

---

## 3. Continue Rules

Continue if:

- Owners review leads.
- Owners copy/edit AI drafts.
- Businesses place public links.
- At least one customer pays or is payment-ready.
- Leads are submitted through real or semi-real usage.
- Setup stays under 20 minutes.

---

## 4. Fix Rules

Fix positioning/onboarding if:

- Leads submit but owners do not review.
- AI drafts are not used.
- Public links are not placed.
- Demo does not convert.
- Setup takes too long.
- Owners describe BizPilot as “just a form.”

---

## 5. Stop or Pivot Rules

Stop or pivot if:

- 10 real demos produce no payment-ready interest.
- 3 businesses onboard but no real leads arrive.
- Owners only want a form and will not pay for AI/desk value.
- Support effort exceeds revenue.
- AI value is not understood or used.

---

## 6. Decision Cadence

Review every 2 weeks during validation:

- Sales conversations
- Demo conversion
- Business onboarding friction
- Lead volume
- Owner review behavior
- AI adoption
- Cost per lead
- Support effort

Do not expand features until validation gate is passed.

---

## 7. Definition of Done

This risk register is complete when:

- Core risks are explicit.
- Mitigations are defined.
- Continue/fix/stop rules are defined.
- Decision cadence is defined.


---

# FILE: `docs/operations/BIZPILOT_PHASE_1_START_CHECKLIST_v1.0.md`

# BizPilot AI — Phase 1 Start Checklist v1.0

**Project:** BizPilot AI  
**Document Type:** Phase 1 Start Checklist  
**Version:** v1.0  
**Status:** Ready for Execution  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Phase 1 Goal

Create the technical foundation only.

Do not build product features in Phase 1.

---

## 2. Install / Verify Tools

Run:

```powershell
node -v
pnpm -v
git --version
```

Required:

- Node.js 24 LTS
- pnpm pinned after project setup
- Git
- VS Code
- Chrome
- Supabase account
- GitHub account

---

## 3. Create Project

```powershell
E:
mkdir bizpilot-ai
cd bizpilot-ai
pnpm create next-app@latest .
```

Selections:

```text
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src directory: No
App Router: Yes
Turbopack: Yes
Import alias: @/*
```

---

## 4. Install shadcn/ui

```powershell
pnpm dlx shadcn@latest init
```

---

## 5. Create Base Folders

```text
app/
components/
features/
server/actions/
server/services/
server/repositories/
server/policies/
server/ai/
lib/supabase/
lib/env/
lib/utils/
prompts/registry/
types/
supabase/migrations/
docs/
tests/rls/
tests/unit/
tests/integration/
scripts/
```

---

## 6. Create Environment Files

`.env.example`:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI - Phase 6
OPENAI_API_KEY=

# Email - Phase 7
RESEND_API_KEY=

# Stripe - Phase 7
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

`.env.local` must not be committed.

---

## 7. Required Phase 1 Files

- lib/env/server-env.ts
- lib/env/public-env.ts
- lib/supabase/client.ts
- lib/supabase/server.ts
- lib/utils/cn.ts
- README.md
- .env.example

---

## 8. Phase 1 Forbidden List

Do not implement:

- Real auth flow
- Database tables
- Lead workflow
- AI generation
- Email sending
- Billing
- Public quote submission
- Product dashboard logic

---

## 9. End-of-Phase Commands

```powershell
pnpm lint
pnpm build
pnpm dev
```

---

## 10. Definition of Done

Phase 1 is complete when:

- App runs locally.
- Lint passes.
- Build passes.
- Folder structure exists.
- Env example exists.
- Supabase client placeholder exists.
- README skeleton exists.
- No product features implemented.
- Git commit pushed.
