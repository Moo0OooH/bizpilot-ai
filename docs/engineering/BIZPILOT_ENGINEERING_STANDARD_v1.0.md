# BizPilot AI — Engineering Standard v1.0

**Project:** BizPilot AI  
**Document Type:** Engineering Standard  
**Version:** v1.0  
**Status:** Final Canonical Draft  
**Owner:** MoOoH  
**Phase:** Phase 0 — Documentation Lock  
**Last Updated:** 2026-05-03  

---

## 1. Engineering Mission

Build a clean, secure, scalable, startup-grade MVP that can reach paying customers quickly without becoming overengineered.

BizPilot AI must be:

- Fast enough to validate with real cleaning businesses
- Structured enough to support future vertical templates
- Secure enough for multi-tenant SaaS
- Simple enough for a solo founder to build and maintain
- Modular enough to avoid future rewrites
- Disciplined enough to avoid CRM and form-builder scope creep

---

## 2. Locked MVP Stack

The MVP stack is:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- Supabase Storage only if needed later
- OpenAI API through server-side AI service abstraction
- Prompt Registry
- Structured AI outputs where useful
- Resend for owner email notifications
- Stripe Payment Links for founding customer payments
- Vercel for deployment
- GitHub for source control

---

## 3. Explicitly Removed From MVP Stack

The following are not part of the MVP stack:

- Prisma
- Docker-first local development
- Local PostgreSQL as the main MVP path
- Auth.js
- Clerk
- Kubernetes
- Microservices
- Vector database
- Custom AI model training
- Complex workflow engine
- Full Stripe Billing

They can be reconsidered after validation only if there is a clear technical reason.

---

## 4. Architecture Discipline

BizPilot AI uses a modular monolith architecture.

The project must not become a collection of random UI components calling external services directly.

Canonical flow:

**UI → Server Actions / Route Handlers → Services → Repositories → Supabase**

AI flow:

**UI → Server Action / Route Handler → AI Service → Prompt Registry → AI Provider → Validated Output → Persistence**

---

## 5. Core Engineering Principles

### 5.1 MVP First

Build the smallest reliable product that can be sold to early cleaning businesses.

### 5.2 Universal Core, Template-Specific Entry

The codebase must support universal intake configuration, but the first market template is cleaning.

### 5.3 Server-Side Trust

Business rules, tenant checks, AI calls, payment records, and privacy behavior must be enforced server-side.

### 5.4 Human Review Required

AI outputs are drafts. No automatic outbound messaging is allowed in MVP.

### 5.5 Privacy by Design

Privacy mode must affect storage, AI output persistence, admin visibility, and logging.

### 5.6 No Feature Leakage

Future roadmap features must not leak into MVP implementation.

---

## 6. Application Structure Standard

Required top-level areas:

- app
- components
- features
- lib
- server
- types
- docs
- supabase

Recommended structure:

- `app` — routes, layouts, route groups
- `components` — reusable UI components
- `features` — domain-specific UI/workflow components
- `server/services` — business workflows
- `server/repositories` — database access
- `server/policies` — authorization and tenant rules
- `server/ai` — AI provider abstraction and AI orchestration
- `server/prompts` — Prompt Registry
- `lib` — shared helpers and configuration
- `types` — shared TypeScript types
- `supabase/migrations` — SQL migrations
- `docs` — canonical documentation

Business logic must not live inside random UI components.

---

## 7. Domain Module Standard

Core modules:

- Auth / Profile
- Business / Tenant
- Business Branding
- Services
- FAQ / Knowledge
- Privacy / Consent
- Industry Templates
- Intake Forms
- Submissions
- Leads
- Lead Actions
- AI Outputs
- Usage Events
- Notifications
- Concierge Setup
- Payment Placeholder

Each module should have clear ownership and not mix unrelated responsibilities.

---

## 8. TypeScript Standard

TypeScript must be strict.

Rules:

- No implicit `any`
- No untyped business-critical objects
- Explicit exported function return types where useful
- Typed domain models
- Validated external inputs
- Validated AI outputs before use
- No unsafe casting unless justified
- Shared domain types centralized

---

## 9. Supabase Standard

Supabase is the MVP platform for:

- Authentication
- PostgreSQL database
- Row Level Security
- SQL migrations
- Optional future storage

Supabase client usage must follow these rules:

- Browser client only for safe client-side needs
- Server client for authenticated server operations
- Service role key never exposed client-side
- Server-side checks still required even with RLS
- RLS must be enabled for tenant-owned tables

---

## 10. Database Access Standard

Database access must be centralized.

Rules:

- UI components do not own database logic.
- Repositories handle Supabase queries.
- Services handle business workflows.
- Policies enforce authorization and tenant access.
- Server actions or route handlers orchestrate calls.
- RLS protects tenant data at the database layer.
- Public intake submission must be write-scoped and safe.

---

## 11. Multi-Tenant Standard

Every tenant-owned operational record must include `business_id`.

Tenant-owned records include:

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

Rules:

- A user can access only businesses where they are a business member.
- A lead belongs to exactly one business.
- AI outputs belong to a lead and a business.
- Public intake pages can create submissions only for the resolved business.
- Public intake pages cannot read private dashboard data.
- Admin/concierge access must be separated and restricted.

---

## 12. RLS Standard

Row Level Security is required from Phase 2.

RLS must protect:

- profiles
- businesses
- business_members
- business settings
- templates and form configuration
- submissions
- leads
- AI outputs
- usage events
- subscription placeholders

RLS must enforce:

- Member-only business access
- Member-only lead access
- Member-only AI output access
- Scoped public insert for intake submission
- No public read of private data
- Admin-only support behavior when added
- Privacy-aware data access

RLS is not optional.

---

## 13. Database Phasing Standard

Tables must be added by phase to avoid overbuilding.

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

Future-only tables:

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

---

## 14. Universal Intake Engineering Standard

The intake system must be dynamic but not overbuilt.

MVP supports:

- Form title
- Form description
- Field label
- Field type
- Required/optional
- Field order
- Placeholder
- Help text
- Active/inactive state
- Success message
- Consent notice

MVP does not support:

- Drag-and-drop builder
- Complex conditional logic
- Multi-step funnels
- Visual workflow builder
- Marketplace templates
- Advanced analytics

---

## 15. Field Type Standard

MVP field types:

- short_text
- long_text
- email
- phone
- select
- multi_select
- number
- date
- time_window
- yes_no

Future field types:

- file_upload
- address_autocomplete
- conditional_fields
- payment_deposit
- calendar_preference

---

## 16. Industry Template Standard

Industry templates are editable templates.

A template defines:

- Template name
- Industry category
- Default fields
- Field ordering
- Required/optional defaults
- Missing-info rules
- AI prompt context
- Suggested reply context
- Follow-up context
- Demo data
- Sales copy hints

Templates must not hardcode the platform to one industry.

The first template is:

**Cleaning Smart Quote Template v1**

---

## 17. Lead Workspace Engineering Standard

The lead workspace must stay simple.

MVP includes:

- Lead list
- Lead detail
- Status update
- Missing info display
- Lead Quality Score
- Suggested Next Action
- Copy actions
- Today’s Action Panel
- AI outputs

It must not become a full CRM.

---

## 18. Lead Quality Standard

Lead Quality Score can start rule-based.

Categories:

- Strong
- Medium
- Missing Info
- Low Fit

Inputs may include:

- Required field completion
- Contact information present
- Preferred date present
- Service area match
- Notes quality
- Service type selected

AI can enhance the score in Phase 6.

---

## 19. AI Engineering Standard

AI must be implemented through a server-side AI service abstraction.

Required AI components:

- AI service abstraction
- Prompt Registry
- Structured output schema where useful
- Output validation
- Error fallback
- Privacy-aware persistence
- Usage tracking

AI output types:

- lead_summary
- reply_draft
- follow_up_draft
- missing_info
- suggested_next_action
- lead_quality_reasoning
- tone_variant

AI must not:

- Auto-send
- Confirm booking
- Invent prices
- Invent availability
- Negotiate
- Directly message customers
- Replace owner decision

---

## 20. Prompt Registry Standard

Prompts must live in a Prompt Registry.

Each prompt entry should define:

- Prompt name
- Version
- Purpose
- Input context
- Expected output
- Output schema if structured
- Privacy handling notes
- Failure fallback

Prompts must not be scattered across UI components.

---

## 21. Privacy Engineering Standard

MVP privacy modes:

- Standard Mode
- Minimal Data Mode

Future mode:

- Forward-Only Mode

### Standard Mode

Allowed:

- Store full submission data
- Store lead data
- Store AI outputs
- Store status and usage events

### Minimal Data Mode

Allowed:

- Store minimum useful lead data
- Limit free-text storage where appropriate
- Store business relationship, status, and timestamps

### Forward-Only Mode

Future only.

Not implemented in MVP.

---

## 22. Error Handling Standard

Required error categories:

- Authentication error
- Authorization error
- Tenant access error
- Validation error
- Public form submission error
- AI generation error
- Email delivery error
- Payment link error
- Unexpected server error

User-facing errors should be simple.

Internal errors should be logged with diagnostic context without leaking sensitive data.

---

## 23. Logging Standard

Logs may include:

- request_id
- business_id
- user_id when authenticated
- route/action name
- error code
- timestamp
- operation status

Logs should avoid:

- Full customer messages
- Secrets
- API keys
- Tokens
- Payment details
- Private contact details unless needed and allowed

---

## 24. Email Standard

Resend is used for MVP email.

Required MVP email:

- Owner notification for new lead

Optional later:

- Customer confirmation email
- Follow-up reminders
- Weekly summary

Customer confirmation email is not required in the first MVP because the public success page is enough for initial validation.

---

## 25. Payment Standard

Stripe Payment Links are used first.

MVP supports:

- Setup fee payment link
- Monthly payment link
- Basic subscription placeholder record

Not MVP:

- Full in-app billing
- Stripe customer portal
- Webhook-heavy subscription engine
- Usage-based billing

---

## 26. UI Engineering Standard

The UI must be simple and conversion-focused.

Rules:

- Mobile-first public intake page
- Clear form labels
- Low form friction
- Clear consent notice
- Clear success state
- Simple dashboard
- Strong empty states
- Copy-to-clipboard actions
- Today’s Action Panel visible
- No unnecessary animations
- No complex CRM UI

---

## 27. Security Standard

Required rules:

- Dashboard pages require authentication.
- Dashboard data requires business membership.
- Public intake page has scoped create behavior only.
- Public page cannot read private dashboard data.
- Admin/concierge access is separated.
- No client-side trust for tenant access.
- No AI keys exposed client-side.
- Environment variables validated.
- Sensitive data minimized according to privacy mode.
- Service role key is never exposed to the browser.

---

## 28. Testing Standard

Priority tests:

- Auth flow
- Business membership access
- RLS policy behavior
- Public intake submission
- Tenant isolation
- Lead creation
- Lead status update
- AI output validation
- Privacy mode behavior
- Owner notification behavior

Tenant isolation tests are mandatory before real customer use.

---

## 29. Phase Discipline Standard

No phase can begin until the previous phase meets its Definition of Done.

Phase 1 is foundation only.

Phase 1 must not include:

- Product features
- Business logic
- Lead workflows
- AI generation
- Billing
- Customer-facing quote functionality
- Dashboard feature workflows

---

## 30. Strict Non-Goals / Not Now

The MVP must not include:

- Full CRM
- Full booking engine
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

## 31. Definition of Done

This document is complete when:

- The Supabase-first MVP stack is locked.
- Removed technologies are explicit.
- Modular architecture boundaries are defined.
- Universal intake rules are defined.
- Editable industry template rules are defined.
- Multi-tenant and RLS requirements are explicit.
- AI service boundaries are defined.
- Prompt Registry is required.
- Privacy engineering behavior is defined.
- Phase discipline is clear.
- Strict Non-Goals prevent overbuilding.

---

## 32. Approval Status

**Status:** Pending MoOoH Approval

After approval, this document becomes canonical for BizPilot AI engineering work.
