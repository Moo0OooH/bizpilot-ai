# BizPilot AI

**Project:** BizPilot AI
**Owner:** MoOoH
**Current Phase:** Phase 26H dashboard lead queue focus command
**Standards Layer:** v1.7 canonical docs map active
**Product:** AI Quote Recovery & Lead Conversion Desk
**GTM:** Cleaning-first
**Last Updated:** 2026-07-05

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

## Current Phase 26 Status

Use `docs/readiness/PHASE_25_SITE_DASHBOARD_GROWTH_BACKLOG_2026-07-04.md` as
the current source-backed backlog for final public-site, dashboard, SEO,
AI-search, local GTM, analytics, demo, and pilot-ops work.

Latest dashboard source-level slice:
`docs/readiness/PHASE_25X_DASHBOARD_LEAD_QUEUE_PAGINATION_2026-07-04.md`
adds full lead queue pagination and EN/fr-CA controls while preserving the
local-Supabase-only dashboard QA gate.

Latest local-gate slice:
`docs/readiness/PHASE_25Y_LOCAL_TARGET_AND_RLS_GATE_RECHECK_2026-07-04.md`
adds no-secret target classification and confirms local DB/RLS proof for the
current `DATABASE_URL`.

Latest finalization slice:
`docs/readiness/PHASE_26_FINALIZATION_CHECKLIST_AND_DASHBOARD_ADMIN_GATE_2026-07-04.md`
records local Supabase target classification, dense owner-dashboard smoke
passing 7/7, and owner plus founder-admin route smoke passing 14/14 with
explicit synthetic founder email gating.

Latest owner-dashboard completion slice:
`docs/readiness/PHASE_26A_OWNER_DASHBOARD_GUIDE_AND_QUEUE_FINALIZATION_2026-07-04.md`
adds the protected `/dashboard/guide` route, richer manual recovery queue rows,
and 15/15 owner plus founder-admin local smoke coverage.

Latest owner-only cleanup slice:
`docs/readiness/PHASE_26B_OWNER_ONLY_SUPABASE_CLEANUP_2026-07-05.md`
records the owner-approved managed Supabase cleanup, off-repo backup, and
remaining owner-only workspace state.

Latest public page-content slice:
`docs/readiness/PHASE_26C_PUBLIC_PAGE_CONTENT_BREADCRUMB_SWEEP_2026-07-05.md`
adds BreadcrumbList JSON-LD to deeper canonical public pages and shared policy
pages without changing product scope or opening real-data/paid-pilot gates.

Latest owner dashboard standardization slice:
`docs/readiness/PHASE_26D_OWNER_DASHBOARD_PRIORITY_STANDARDIZATION_2026-07-05.md`
keeps the owner overview action-first, demotes quote-page preview to a utility
action, tokenizes secondary insight visuals, and preserves all real-data,
paid-pilot, automation, booking, invoice, SMS/WhatsApp, and CRM gates.

Latest owner access and dashboard evidence:

- `docs/readiness/PHASE_26E_OWNER_ACCESS_AND_SECRET_HYGIENE_GATE_2026-07-05.md`
  records the post-cleanup owner access and secret-hygiene gate.
- `docs/readiness/PHASE_26F_DASHBOARD_CURRENT_STATE_AND_FINAL_POSITION_2026-07-05.md`
  records the current dashboard route-guide, source, and validation posture.
- `docs/readiness/PHASE_26G_DASHBOARD_LOCAL_SMOKE_AND_PUBLIC_SITE_PAGE_AUDIT_2026-07-05.md`
  records green local/synthetic dashboard smoke and green public route,
  responsive, quote, and UI-matrix smoke.
- `docs/readiness/PHASE_26H_DASHBOARD_LEAD_QUEUE_FOCUS_COMMAND_2026-07-05.md`
  is the latest evidence slice and records the lead queue focus command strip.

Phase 25/26 finalization does not approve real customer data, paid pilot
launch, production mutations, automation, booking, invoices, SMS/WhatsApp,
autonomous AI, or broad feature expansion. Those remain gated by the canonical
docs.

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

Current Phase 26 evidence status:

- public site smoke is green for the current repo evidence.
- local/synthetic dashboard smoke is green when explicit local Supabase
  environment overrides are used.
- production owner-authenticated dashboard visual proof is still pending.
- real customer data is still blocked.
- paid pilot is still blocked.

Phase 24E OpenAI operating posture documentation is accepted for first limited
pilot. This is not a new runtime AI proof; Phase 23E remains the runtime
OpenAI provider proof. Phase 24E records:
cost monitoring is daily during the first 14 pilot days and weekly after that;
usage/quota is checked before onboarding each real pilot customer and weekly
afterward; budget control uses an owner-defined monthly soft budget in OpenAI
project settings; failures keep leads saved and fall back to the existing safe
manual workflow with no customer-facing auto-send.

Phase 24C.0 DB-level backup/export/restore proof is passed. The drill used a
Supabase CLI logical export and local Docker Postgres restore, with sanitized
count checks, specific `MrTester` business/lead count checks, DB-level RLS
metadata checks on core tables, and no dump files tracked by git. Phase 24C.1
restored app/RLS smoke is not passed: the existing RLS suite against the
restored database did not pass, and app/dashboard smoke against the restored
target was not run. Phase 24C is not being claimed as a strict full pass.
Owner decision: strict restored app/dashboard/RLS smoke is not required for the
first limited pilot. It is deferred to P1 before paid pilot, before production
migrations, or before destructive/bulk data work.

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
