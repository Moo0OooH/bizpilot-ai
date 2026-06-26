# BizPilot AI — AI Coding Agent Start Here v1.7

## Purpose

This file is the first instruction document for Cloud Code, Codex, or any coding agent working on BizPilot AI. It is designed to prevent unsafe expansion, security regressions, and misinterpretation of older documentation.

## Non-Negotiable Starting Rule

Before changing code, inspect the actual repository. Documentation may be ahead of implementation.

Do not assume a file, route, migration, table, package, or component exists until verified in the repo.

## Active Product Identity

BizPilot AI's current live surface is:

> **A Lead Recovery & Response System for cleaning businesses.**

2026-05-26 owner update: BizPilot may expand into broader product capabilities. Expansion must happen through explicit feature entitlement, owner-controlled activation, Settings visibility, visual/text guides, and validation evidence. Do not default-enable or overpromise broader capabilities before the implementation and provider/payment/API posture are real.

## Golden Product Rule

Every implementation must improve at least one of these outcomes:

- response speed,
- lead organization,
- follow-up recovery,
- owner clarity,
- conversion probability.

If the change does not improve one of these, keep it out of the active surface or place it behind an owner-controlled feature level with honest Settings state.

## Active Priority Override - 2026-06-26

For the shortest current status, read
`docs/readiness/CURRENT_PROJECT_STATUS_2026-06-26.md`.

2026-06-26 update: P8 public homepage clarity and D1 dashboard shell/lead
workflow stabilization are both on `main`. D1 is code/test/visual ready on
local synthetic data only. P9 language isolation moved dashboard error-boundary
copy into the EN/fr-CA dictionary. A1 admin/owner user access remains
audit/spec only and must not be implemented without a separate owner-approved
schema/RLS/route gate. Do not start new feature expansion. The next safe work is
release hygiene, production deploy confirmation, local synthetic QA, quote slug
smoke, local DB/RLS proof, Phase 24G explicit owner approval before real
customer data, and a separate pilot ops/payment/support gate before paid pilot.

Real customer data and paid pilot remain blocked.

## Previous Active Priority Override - 2026-06-21

For the shortest current status, read `docs/readiness/CURRENT_PROJECT_STATUS_2026-06-20.md`.

2026-06-21 update: public-site acceptance P0-P5, final public-site polish,
visual stability patch, visual truth fix, and dashboard D0 design audit are
complete. The next correct implementation phase is scoped dashboard shell and
lead workflow visual stabilization. Do not restart homepage/public-site work
unless a new defect is reported.

For public-site fixes and dashboard D1 visual work, also read
`docs/product/BIZPILOT_MULTILINGUAL_RESPONSIVE_UI_STANDARD_v1.0.md`. EN/fr-CA
text length, fr-CA accent/meaning quality, Light/Dark contrast mappings, card
heights, CTA alignment, and multi-viewport visual parity are now explicit
implementation constraints.

Read `docs/operations/BIZPILOT_FINAL_EXECUTION_AND_VALIDATION_PRIORITY_STANDARD_v1.0.md` before choosing execution order.

BizPilot does not need a strategic reset. After the remaining Phase 24F/24G real-data gates, the main risk is product readiness, demo readiness, and customer validation.

Highest current execution priorities after the 2026-06-26 sync:

1. Release hygiene and production deploy/cache confirmation
2. P9 language-isolation guardrails and no hardcoded user-facing dashboard copy
3. Local synthetic dashboard QA only
4. Quote slug smoke and local DB/RLS proof
5. Phase 24G explicit owner real-data approval gate
6. Pilot ops/payment/support readiness gate

Historical execution priorities before D1 landed:

1. Dashboard shell and lead workflow visual stabilization
2. Manual email templates
3. End-to-end smoke test
4. Demo creation
5. Demo video
6. Founder-led customer outreach

Feature expansion is forbidden until validation evidence exists. P3/future scope includes owner notification email, customer email automation, SMS, WhatsApp, booking, invoices, billing automation, calendar sync, multi-vertical expansion, full CRM, and autonomous AI.

## Current Implementation Priorities

### Priority 1 — Safety and Trust

- RLS hardening,
- explicit GRANT verification,
- public quote submission abuse protection,
- server-only boundaries,
- secure Supabase client usage,
- safe logging and error handling,
- AI metadata cleanup,
- structured AI output validation.

### Priority 2 — Magic Moment

The owner’s first dashboard experience must show value immediately:

- sample cleaning lead,
- urgency/status tag,
- AI summary,
- suggested reply,
- follow-up risk/action,
- clear CTA such as Review reply / Mark contacted / Copy response.

The user should understand the product in under 3 minutes.

### Priority 3 — Operational Calm UX

Design should reduce stress, not create SaaS noise:

- calm hierarchy,
- readable density,
- clear primary actions,
- useful empty states,
- restrained AI visual treatment,
- no heavy gradients, glow spam, or metric overload.

### Priority 4 — Founder-Led GTM Support

Build for concierge onboarding first:

- founder can configure business manually,
- founder can create demo/sample lead,
- founder can prepare quote page for pilot owners,
- owner does not need full self-serve onboarding yet.

## Security Rules

### Database-First Security Hierarchy

Security must be enforced in this order:

1. database policies,
2. explicit grants,
3. RLS and tenant isolation,
4. repository/service boundaries,
5. server-side validation,
6. client-side UX validation.

Client/app validation is never the final security boundary.

### Public Quote Path Is Critical

The public quote submission path is the highest-risk MVP surface because it may involve:

- anonymous/public access,
- public inserts,
- dynamic intake fields,
- customer data,
- AI workflow triggers.

Any work here must include tests or verification notes.

### AI Safety Rules

AI must be:

- assistant-only,
- owner-reviewed,
- concise,
- structured,
- operational,
- privacy-aware.

AI must not:

- auto-send to customers,
- invent pricing or availability,
- act autonomously,
- produce verbose marketing copy by default,
- store raw sensitive error metadata.

## Feature Entitlement Boundary

Feature growth is allowed, but every customer-visible capability needs:

- feature registry/entitlement state,
- owner-controlled activation,
- Settings state/level visibility,
- visual guide,
- customer-facing text guide,
- owner/admin enablement guide,
- validation evidence appropriate to its data/API/payment/automation risk.

For the current live response channel, BizPilot prepares drafts. The owner manually sends or copies them into their preferred channel such as email, Instagram DM, SMS, or phone follow-up. Automated sending can be implemented only behind explicit feature entitlement and must not look active until it really works.

## Required Repo Inspection Checklist

Before editing, inspect:

- package manager and scripts,
- Next.js version and routing structure,
- Supabase client architecture,
- migration files,
- RLS policies and grants,
- dashboard routes/components,
- public quote routes,
- AI service/provider layer,
- logging/error handling utilities,
- tests and test scripts.

## Required Validation After Changes

When relevant, run or add:

- typecheck,
- lint,
- build,
- RLS tests,
- migration verification,
- public quote submission tests,
- manual QA notes for dashboard and quote flow.

If the repo lacks a test script, do not pretend tests passed. Add a clear note saying what could and could not be verified.

## Implementation Style

Follow:

- TypeScript strictness,
- server-only boundaries where needed,
- repository/service separation,
- SQL-first migrations,
- no direct scattered Supabase calls from UI components,
- no secrets in client code,
- no sensitive data in logs,
- no broad refactors unrelated to the requested task.

## Active Prompt for Cloud Code/Codex

Use this prompt when starting implementation work:

```text
You are working on BizPilot AI. Before editing, read docs/CURRENT_CANONICAL_DOCS_v1.7.md and docs/AI_CODING_AGENT_START_HERE_v1.7.md.

Treat the current live surface as a Lead Recovery & Response System for cleaning businesses. Future broader product growth is allowed only through the feature entitlement and guide standard.

Inspect the repo before making any assumptions. Prioritize security/RLS/public quote hardening, Magic Moment, Operational Calm UX, founder-led pilot readiness, and Settings-visible feature levels. Do not default-enable booking, invoices, WhatsApp/SMS automation, autonomous AI, multi-vertical expansion, marketplace, or advanced analytics before entitlement, guides, provider/payment/API posture, and smoke evidence exist.

Preserve existing architecture. Make small, reviewable changes. Add or update tests where relevant. Report exactly what changed, what was verified, and what remains unverified.
```

## Definition of Done

A coding task is complete only when:

- it respects the active feature entitlement standard,
- it does not weaken RLS/security/privacy,
- it improves one of the Golden Product Rule outcomes,
- it keeps AI owner-reviewed,
- it includes visual/text guide updates when adding a feature,
- it shows customer-visible feature state in Settings when relevant,
- it includes verification notes,
- it avoids fake or default-enabled scope expansion.
