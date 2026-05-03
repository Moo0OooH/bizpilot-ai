# BizPilot AI — Engineering Standard v1.0

**Status:** Phase 0 Final Canonical Draft  
**Project:** BizPilot AI  
**Document Type:** Engineering Standard  
**Owner:** MoOoH  
**Version:** v1.0  
**Phase:** Phase 0 — Documentation Lock

---

## 1. Engineering Mission

The engineering mission is to build a clean, secure, simple, scalable MVP that validates the business quickly without overengineering.

BizPilot must be:

- simple enough for fast MVP execution
- structured enough for future vertical expansion
- secure enough for multi-tenant SaaS
- reliable enough for early paying customers
- modular enough to support Industry Packs
- disciplined enough to avoid feature creep

---

## 2. Locked MVP Stack

The MVP stack is locked as:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage only if needed
- OpenAI API through AI service abstraction
- Prompt Registry
- structured outputs where useful
- Resend
- Stripe Payment Links first
- Stripe Billing later
- Vercel + Supabase hosting

---

## 3. Explicitly Removed From MVP

The following are not MVP decisions:

- Prisma
- Auth.js
- Clerk
- Docker-first as the main path
- Kubernetes
- microservices
- vector database
- custom model training
- complex integrations

They can be reconsidered only after validation and only if there is a clear technical reason.

---

## 4. Engineering Principles

### 4.1 MVP First

Build the smallest reliable product that can be sold to cleaning businesses.

### 4.2 Generic Core, Specific Pack

The core must not be hardcoded only for cleaning.

Cleaning is the first Industry Pack, not the entire product.

### 4.3 Server-Side Trust

Business rules, tenant checks, AI generation, and data access must be enforced server-side.

### 4.4 Human Review Required

AI outputs are drafts.

No automatic customer messaging is allowed in the MVP.

### 4.5 Privacy by Design

Privacy mode must affect storage, AI output handling, admin support visibility, and retention behavior.

### 4.6 No Feature Leakage

Roadmap features must not leak into MVP implementation.

---

## 5. Application Structure Standard

The project should be organized around product domains, not random utility folders.

Required high-level areas:

- app
- features
- components
- lib
- server
- services
- repositories
- policies
- prompts
- types
- docs

Recommended conceptual structure:

- app for routes and layouts
- components for reusable UI
- features for domain-specific UI and workflows
- server for server-only logic
- services for business logic
- repositories for database access
- policies for authorization and tenant rules
- prompts for prompt registry definitions
- lib for shared helpers
- types for shared TypeScript types
- docs for canonical documentation

---

## 6. TypeScript Standard

TypeScript must be strict.

Required rules:

- no implicit any
- explicit return types for exported functions where useful
- no business-critical untyped objects
- no unsafe type casting unless justified
- shared domain types must be centralized
- API and AI outputs must be validated before use

---

## 7. Data Access Standard

Database access must not be scattered inside UI components.

Rules:

- UI components do not directly own business rules.
- Repositories handle database operations.
- Services handle business workflows.
- Policies enforce authorization.
- Server actions or route handlers orchestrate requests.
- Tenant isolation must be enforced with Supabase RLS and server-side checks.

---

## 8. Multi-Tenant Standard

Every tenant-owned operational record must include business_id.

Examples:

- business_services
- business_faqs
- business_service_areas
- business_privacy_settings
- business_consent_settings
- business_industry_settings
- lead_forms
- leads
- lead_field_values
- lead_messages
- ai_outputs
- usage_events
- subscriptions
- reports

Access rules:

- a user can only access businesses where they are a business_member
- a lead belongs to exactly one business
- AI outputs belong to a lead and a business
- public quote page can create leads only for the resolved business slug
- public quote page cannot read private dashboard data
- admin access must be separated and restricted
- Forward-Only Mode must not accidentally store full lead data

---

## 9. Supabase RLS Standard

Supabase RLS is required from Phase 2.

RLS must protect:

- profiles
- businesses
- business_members
- business settings
- services
- FAQs
- service areas
- leads
- lead field values
- AI outputs
- usage events
- subscription-related records

Public quote submission must be carefully scoped.

The public page may create a lead for a valid business, but it must not read dashboard data.

---

## 10. Database Standard

### 10.1 Core MVP Tables

MVP database model includes:

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

### 10.2 Future Tables

Future tables may include:

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

Future tables must not be built unless required by an approved future phase.

---

## 11. Privacy Engineering Standard

Privacy mode must affect implementation behavior.

### 11.1 Standard Mode

Allowed:

- store full lead data
- store AI outputs
- store status history
- store usage events

### 11.2 Minimal Data Mode

Allowed:

- store only required lead fields
- limit notes or sensitive free-text storage
- store basic status and business relationship

### 11.3 Forward-Only Mode

Required behavior:

- forward request to owner
- avoid permanent full lead storage
- optionally delete after 24/48 hours
- store minimal technical metadata only when necessary
- prevent support/admin view of full data unless explicitly allowed

---

## 12. AI Engineering Standard

AI must be implemented through an AI service abstraction.

The UI must not call OpenAI directly.

Required AI components:

- AI service abstraction
- Prompt Registry
- structured output schema where useful
- error fallback
- privacy-aware storage behavior
- logging without exposing sensitive customer content unnecessarily

AI output types:

- lead summary
- reply draft
- follow-up draft
- missing info detection
- suggested next action

AI must not:

- auto-send
- confirm booking
- invent prices
- invent availability
- negotiate
- directly message customers
- replace owner decision

---

## 13. Prompt Registry Standard

Prompts must live in a Prompt Registry.

Prompts must not be scattered across UI components.

Each prompt entry should define:

- prompt name
- purpose
- input context
- expected output
- output schema if structured
- privacy handling notes
- failure fallback
- version

Prompt updates must be traceable.

---

## 14. Error Handling Standard

The MVP must handle errors clearly.

Required error categories:

- authentication errors
- authorization errors
- tenant access errors
- validation errors
- public form submission errors
- AI generation errors
- email delivery errors
- payment link errors
- unexpected server errors

User-facing errors should be simple.

Internal errors should be logged with enough diagnostic context without leaking sensitive data.

---

## 15. Logging Standard

Logs should support debugging without exposing unnecessary customer data.

Logs may include:

- request ID
- business_id
- user_id when authenticated
- route/action name
- error code
- timestamp
- operation status

Logs should avoid full customer message content unless required for debugging and allowed by privacy mode.

---

## 16. Email Standard

Resend is used for MVP email.

Required MVP email:

- owner email notification for new leads

Optional MVP email:

- customer confirmation email

Customer confirmation email is optional because it introduces outbound communication and deliverability concerns.

The MVP can start with a success page after quote submission.

---

## 17. Payment Standard

Stripe Payment Links are used first.

Stripe Billing comes later.

The product must not build full subscription billing workflows in MVP unless needed after validation.

Payment-related implementation in MVP should support:

- manual founding customer sales
- setup fee collection
- monthly payment link
- basic subscription tracking placeholder

---

## 18. UI Engineering Standard

The UI should be clean, simple, and fast.

Rules:

- mobile-first quote page
- simple dashboard
- minimal form friction
- clear CTA
- accessible form labels
- clear loading states
- clear success states
- simple copy-to-clipboard actions
- no unnecessary animations
- no complex CRM-like interface in MVP

---

## 19. Security Standard

Required security rules:

- all dashboard pages require authentication
- all dashboard data requires business membership
- public quote page has write-only lead creation behavior
- admin/concierge access is separated
- no client-side trust for tenant access
- no AI keys exposed client-side
- environment variables validated
- sensitive data minimized according to privacy mode

---

## 20. Phase Discipline Standard

Every phase must be completed before moving to the next.

Phase 1 is only technical foundation.

Phase 1 must not include:

- product features
- business logic
- lead workflows
- AI generation
- billing
- customer-facing quote functionality
- dashboard feature workflows

This prevents foundation work from becoming uncontrolled product work.

---

## 21. Strict Non-Goals / Not Now

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

## 22. Definition of Done

This document is complete when:

- the locked MVP stack is clear
- removed technologies are explicit
- multi-tenant and RLS rules are defined
- AI service boundaries are defined
- Prompt Registry is required
- privacy engineering behavior is defined
- Phase 1 no-feature rule is included
- strict Non-Goals are included
- engineering standards support fast MVP validation without overengineering
