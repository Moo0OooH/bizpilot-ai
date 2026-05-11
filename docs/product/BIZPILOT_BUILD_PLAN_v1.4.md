# BizPilot AI — Build Plan v1.4

**Project:** BizPilot AI
**Document Type:** Build Plan
**Version:** v1.4
**Status:** Final Founder-Grade Canonical Draft — Phase 5 Alignment Synced
**Owner:** MoOoH
**Phase:** Phase 5 Stabilization / Completion Candidate
**Last Updated:** 2026-05-11

---

## Current Implementation Status — 2026-05-11

Phase 1 through Phase 4 are implemented.

Phase 5 is implemented and in stabilization / completion candidate status. The next step is Phase 5 closure checks: docs sync, operational dashboard copy cleanup, tenant-safe smoke testing, and `pnpm typecheck`, `pnpm lint`, and `pnpm build`.

Phase 6 has not started. Do not add AI generation, email sending, billing, booking, integrations, generic CRM scope, or automation while closing Phase 5.

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

## Dashboard IA / UX Patch — v1.4.1

The following dashboard IA decisions are canonical and are detailed in:

```text
docs/product/BIZPILOT_DASHBOARD_UX_STANDARD_v1.0.md
```

### Route Ownership

```text
/dashboard                     = Dashboard Overview
/dashboard/configuration       = Business Configuration
/dashboard/leads               = Leads
/dashboard/leads/[leadId]      = Lead Detail
```

`/dashboard` is not Business Configuration.

Business Configuration belongs to:

```text
/dashboard/configuration
```

### Dashboard Overview Content

Dashboard Overview must include:

- Business Readiness
- Recent Leads
- Today’s Actions
- Public Quote Link
- Quick Actions
- Revenue Recovery Proof later

### Navigation

BizPilot uses two levels of navigation:

- App-level navigation for main dashboard pages
- Page-level navigation only inside the current page

Active nav rules:

```text
/dashboard                => Dashboard Overview
/dashboard/leads*         => Leads
/dashboard/configuration  => Business Configuration
```

### Business Configuration UX

Business Configuration should use a guided accordion setup model, not a raw form.

It should include:

- Business Basics
- Branding
- Services
- Service Areas
- FAQ
- Quote Link and Public Page
- Cleaning Template
- Privacy and Consent
- Preview and Publish Readiness

The sticky bottom save bar belongs only to `/dashboard/configuration`.

### Phase Mapping

These decisions affect:

- Phase 3: Business + Template Configuration Core
- Phase 4: Public Quote Link preview and configuration
- Phase 5: Dashboard Overview and Lead Conversion Desk

## 15. Definition of Done

This build plan is complete when:

- Phase order is clear.
- MVP is sellable but controlled.
- Cost control is explicit.
- Expansion is blocked by validation.
- Non-goals prevent overbuilding.
