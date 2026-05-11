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

## Dashboard UI Organization Standard — v1.4.1

Dashboard UI decisions are canonical and detailed in:

```text
docs/product/BIZPILOT_DASHBOARD_UX_STANDARD_v1.0.md
```

### Shared Shell Requirement

Shared protected dashboard UI must live in:

```text
app/(dashboard)/layout.tsx
components/dashboard/dashboard-shell.tsx
components/dashboard/dashboard-sidebar.tsx
```

Rules:

- Do not repeat sidebar/header code inside individual pages.
- Do not place app-level navigation inside route pages.
- Do not duplicate dashboard shell spacing/layout logic across pages.
- Pages render page-specific content only.
- Page-level navigation is allowed only inside the current page.

### Route Ownership

```text
/dashboard                     = Dashboard Overview
/dashboard/configuration       = Business Configuration
/dashboard/leads               = Leads
/dashboard/leads/[leadId]      = Lead Detail
```

### Server / Client Boundary

Keep dashboard shell server-rendered where possible.

Use client components for:

- Interactive forms
- Accordions
- Inline customization
- Copy buttons
- Sticky save bars
- Optimistic UI where useful

Do not convert the entire dashboard shell to a client component unless required.

## 24. Definition of Done

This document is complete when:

- Supabase-first stack is locked.
- Cost control rules are explicit.
- RLS standards are explicit.
- AI boundaries are explicit.
- Revenue Recovery Proof is included.
- Manual outcome tracking is supported.
- MVP scope prevents overbuilding.
