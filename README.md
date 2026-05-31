# BizPilot AI

**Project:** BizPilot AI
**Owner:** MoOoH
**Current Phase:** Phase 24A docs-only readiness cleanup; Phase 23 synthetic production proof complete
**Standards Layer:** v1.7 canonical docs map active
**Product:** AI Quote Recovery & Lead Conversion Desk
**GTM:** Cleaning-first
**Last Updated:** 2026-05-30

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

## Current Readiness Status

Phase 23 production functional smoke has completed on synthetic data:

- Phase 23B passed: production functional/auth smoke.
- Phase 23C passed: controlled synthetic quote intake on `MrTester`.
- Phase 23D passed: synthetic owner dashboard runtime proof.
- Phase 23E passed: targeted OpenAI provider proof on the synthetic lead.
- Phase 23F passed for external Auth email/custom SMTP: Resend SMTP is
  configured, domain DNS is verified, signup confirmation passed, password
  reset email/link/completion passed, and login after reset passed.

Real customer data is still not approved. The current blockers are:

- OpenAI cost/quota/fallback monitoring posture.
- strict restored-target app/dashboard/RLS smoke if the owner requires that
  acceptance level before real data.
- final owner real-data approval.

Phase 24C.0 DB-level backup/export/restore proof is passed. The drill used a
Supabase CLI logical export and local Docker Postgres restore, with sanitized
count checks, specific `MrTester` business/lead count checks, DB-level RLS
metadata checks on core tables, and no dump files tracked by git. Phase 24C.1
restored app/RLS smoke is not passed: the existing RLS suite against the
restored database did not pass, and app/dashboard smoke against the restored
target was not run. Phase 24C is not being claimed as a strict full pass.

Owner notification email is intentionally deferred for the first pilot. The
approved first-pilot operating model is manual-only: owners check the dashboard
manually, review AI drafts, and manually respond.

Current source-of-truth docs:

- `docs/readiness/WHERE_WE_ARE_WITH_NEXT_STEP_2026-05-29.md`
- `docs/readiness/PHASE_23_PRODUCTION_FUNCTIONAL_SMOKE_2026-05-29.md`
- `docs/readiness/PHASE_24_REAL_DATA_APPROVAL_GATE_2026-05-30.md`
- `docs/product/PRODUCT_DECISION_OWNER_NOTIFICATION_EMAIL_DEFERRED_FIRST_PILOT_2026-05-30.md`

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

Latest known checks passed on 2026-05-13 before v1.5 documentation sync.

---

## Canonical Docs

### Active v1.5 Hardening Standards

- `docs/BIZPILOT_FULL_CANONICAL_PACKAGE_v1.5.md`
- `docs/reference/BIZPILOT_EXTERNAL_REFERENCE_BASELINE_v1.5.md`
- `docs/operations/BIZPILOT_EXECUTIVE_AUDIT_AND_DECISION_v1.5.md`
- `docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.5.md`
- `docs/engineering/BIZPILOT_BACKEND_DATABASE_RLS_STANDARD_v1.5.md`
- `docs/security/BIZPILOT_SECURITY_PRIVACY_COMPLIANCE_STANDARD_v1.5.md`
- `docs/product/BIZPILOT_UI_UX_SYSTEM_STANDARD_v1.1.md`
- `docs/operations/BIZPILOT_MVP_HARDENING_CHECKLIST_v1.0.md`
- `docs/operations/BIZPILOT_CODEX_IMPLEMENTATION_PROMPTS_v1.0.md`

The v1.5 package is a hardening and standards upgrade. It does not expand MVP scope.

### Active Product Strategy

- `docs/product/BIZPILOT_MASTER_BLUEPRINT_v1.4.md`
- `docs/product/BIZPILOT_BUILD_PLAN_v1.4.md`
- `docs/product/BIZPILOT_DASHBOARD_UX_STANDARD_v1.0.md`
- `docs/product/BIZPILOT_SCORING_SPEC_v1.1.md`
- `docs/architecture/BIZPILOT_ARCHITECTURE_v1.4.md`
- `docs/engineering/BIZPILOT_EXECUTION_ROADMAP_v1.4.md`

Older v1.4/v1.0 standards remain for historical context unless superseded by v1.5.
