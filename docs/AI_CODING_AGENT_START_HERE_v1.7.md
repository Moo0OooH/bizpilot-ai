# BizPilot AI — AI Coding Agent Start Here v1.7

## Purpose

This file is the first instruction document for Cloud Code, Codex, or any coding agent working on BizPilot AI. It is designed to prevent scope creep, security regressions, and misinterpretation of older documentation.

## Non-Negotiable Starting Rule

Before changing code, inspect the actual repository. Documentation may be ahead of implementation.

Do not assume a file, route, migration, table, package, or component exists until verified in the repo.

## Active Product Identity

BizPilot AI is currently:

> **A Lead Recovery & Response System for cleaning businesses.**

It is not currently a generic AI operating system, full CRM, form builder, booking platform, invoice system, marketing automation platform, or multi-vertical SaaS.

## Golden Product Rule

Every implementation must improve at least one of these outcomes:

- response speed,
- lead organization,
- follow-up recovery,
- owner clarity,
- conversion probability.

If the change does not improve one of these, do not implement it in the MVP.

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

## MVP Response Channel Boundary

For the MVP, BizPilot prepares drafts. The owner manually sends or copies them into their preferred channel such as email, Instagram DM, SMS, or phone follow-up.

Do not implement automated SMS, WhatsApp, Instagram, or email sending unless explicitly approved in a later phase.

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

Treat BizPilot as a Lead Recovery & Response System for cleaning businesses, not a generic AI platform or full CRM.

Inspect the repo before making any assumptions. Prioritize security/RLS/public quote hardening, Magic Moment, Operational Calm UX, and founder-led pilot readiness. Do not add booking, invoices, WhatsApp/SMS automation, autonomous AI, multi-vertical expansion, marketplace, or advanced analytics unless explicitly instructed.

Preserve existing architecture. Make small, reviewable changes. Add or update tests where relevant. Report exactly what changed, what was verified, and what remains unverified.
```

## Definition of Done

A coding task is complete only when:

- it respects the active MVP lock,
- it does not weaken RLS/security/privacy,
- it improves one of the Golden Product Rule outcomes,
- it keeps AI owner-reviewed,
- it includes verification notes,
- it avoids unrelated scope expansion.
