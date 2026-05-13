# BizPilot AI

**Project:** BizPilot AI
**Owner:** MoOoH
**Current Phase:** Phase 5 stabilized / completion candidate; Phase 6 foundation started
**Product:** AI Quote Recovery & Lead Conversion Desk
**GTM:** Cleaning-first
**Last Updated:** 2026-05-11

---

## Current Direction

```text
BizPilot AI = AI Quote Recovery & Lead Conversion Desk
Core = Universal Smart Intake Core + AI Lead Conversion Core
GTM = Cleaning-first
MVP = Editable Cleaning Smart Quote Template + Lead Conversion Desk
Operating Mode = Rule-first, manual AI-on-demand foundation, cache-heavy, validation-first
Business Mode = Done-for-you founding customer setup before self-serve SaaS
```

BizPilot is not a simple form builder.
BizPilot is not a full CRM.
BizPilot is not a booking engine.
BizPilot is not an AI operator.

BizPilot helps small cleaning businesses capture quote requests, organize leads, identify missing information, prioritize replies and follow-ups, and show lightweight recovery proof.

---

## Current Implementation Status

Phase 1 through Phase 4 are implemented.

Phase 5 is implemented and being stabilized before it is officially closed.

Phase 6 foundation has started with a manual, on-demand AI Lead Assistant. Full Phase 6 remains open.

The immediate goal is:

```text
Functional dashboard -> product-grade quote recovery cockpit
```

Do not expand Phase 6 beyond the manual AI Lead Assistant foundation until Phase 5 closure and end-to-end manual QA are complete.

---

## Canonical Routes

```text
/dashboard                     = Dashboard Overview
/dashboard/configuration       = Business Configuration
/dashboard/leads               = Lead Workspace
/dashboard/leads/[leadId]      = Lead Detail
/quote/[slug]                  = Public quote link
/quote/[slug]/success          = Public quote success page
```

Protected dashboard routes use the shared shell:

```text
app/(dashboard)/layout.tsx
components/dashboard/dashboard-shell.tsx
components/dashboard/dashboard-sidebar.tsx
components/dashboard/dashboard-topbar.tsx
```

Pages own page-specific content only.

---

## Phase 5 Closure Focus

Allowed now:

- Operational dashboard hierarchy
- Needs Attention Strip
- Recent Leads / lead recovery queue polish
- Contextual right rail cleanup
- Sidebar and header polish
- CTA hierarchy
- Responsive fixes
- Business Configuration grouping
- Outcome-focused microcopy
- Minimal activity timeline and recovery proof already in Phase 5 scope

Do not add now:

- AI generation UX
- Email sending
- Billing
- Booking or calendar
- Integrations
- Team management
- Advanced analytics
- Generic CRM modules
- Second vertical
- Automation workflows

Use this product test for every change:

```text
Does this help the owner reply to quote requests faster and follow up better?
```

---

## Verification

```powershell
pnpm typecheck
pnpm lint
pnpm build
```

Latest known checks passed on 2026-05-11.

---

## Canonical Docs

- `docs/product/BIZPILOT_MASTER_BLUEPRINT_v1.4.md`
- `docs/product/BIZPILOT_BUILD_PLAN_v1.4.md`
- `docs/product/BIZPILOT_DASHBOARD_UX_STANDARD_v1.0.md`
- `docs/product/BIZPILOT_UI_UX_SYSTEM_STANDARD_v1.0.md`
- `docs/product/BIZPILOT_SCORING_SPEC_v1.1.md`
- `docs/architecture/BIZPILOT_ARCHITECTURE_v1.4.md`
- `docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.4.md`
- `docs/engineering/BIZPILOT_EXECUTION_ROADMAP_v1.4.md`
- `docs/engineering/BIZPILOT_DATABASE_RLS_POLICY_BASELINE_v1.0.md`
- `docs/security/BIZPILOT_PRIVACY_SECURITY_COMPLIANCE_BASELINE_v1.0.md`
