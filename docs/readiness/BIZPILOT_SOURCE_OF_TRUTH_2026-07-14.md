<!--
 * ============================================================
 * File: docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md
 * Project: BizPilot AI
 * Description: Evidence-bounded whole-project source of truth for Website V4, Dashboard V4, and Documentation V2.1.
 * Role: Controls release claims, product boundaries, current gaps, next actions, and production/data gates.
 * Related:
 * - docs/readiness/current-status.json
 * - docs/dashboard-v4/CURRENT.md
 * - docs/website-v4/CURRENT.md
 * - docs/CURRENT_CANONICAL_DOCS_v2.1.md
 * - docs/project-v2/CURRENT.md
 * Author: MoOoH
 * Created: 2026-07-14
 * Last Updated: 2026-07-15
 * Change Log:
 * - 2026-07-15: Closed the V2.1 push, CI, Vercel, HTTPS, and Production public read-only release with exact evidence.
 * - 2026-07-15: Recorded the final V2.1 local verification, documentation cleanup, safe quote-read fallback, and unchanged external gates.
 * - 2026-07-15: Added the exhaustive project/route/flow audit, bilingual 404/error coverage, V2.1 phase plan, and consolidated external gates.
 * - 2026-07-14: Recorded the pushed release SHA, successful GitHub CI/Vercel rollout, and read-only Production smoke evidence.
 * - 2026-07-14: Consolidated the current public, dashboard, admin, documentation, verification, and external-gate posture.
 * ============================================================
 -->

# BizPilot AI Source of Truth — Updated 2026-07-15

## Executive status

BizPilot is implemented as a bilingual, manual-first Smart Intake and reply-preparation product for service businesses, with cleaning as the first complete pilot vertical. Website V4 explains the problem and workflow; Dashboard V4 supports configuration, triage, missing-information review, draft edit/copy, and manual follow-up. Documentation V2.1 now provides one phase/dependency plan and one complete EN/fr-CA route/workflow audit.

This code release does **not** approve real customer data, a paid pilot, Google login as live, remote migration changes, or Production data mutation. Those remain separately gated even when lint, tests, and build pass.

## Product boundary

### Implemented

- Bilingual public marketing/legal routes and business-specific public quote intake.
- Structured service/area/custom-field/consent capture with validation and abuse safeguards.
- Owner lead queue with search, filters, sorting, pagination, scoring, missing-information and SLA cues.
- Rule/AI-assisted summaries and drafts with explicit owner review/edit/copy/manual-send workflow.
- Quote Setup, business profile, language/theme/account settings, audit/history, and lifecycle surfaces.
- Founder-only user/workspace/lead/health/activity oversight with guarded manual controls and cleanup dry runs.
- Email/password auth and application-side Google login path with login-only scopes.

### Not represented as live

- Direct Instagram, WhatsApp, Facebook, Gmail, or CRM inbox integration.
- Automatic sending, autonomous customer decisions, price invention, confirmed booking, or guaranteed availability.
- Full CRM, scheduler, invoice platform, payment capture, SMS/WhatsApp automation, or self-serve activation.
- Phone authentication.
- Live-approved Google OAuth before provider configuration and owner QA.

## Current application routes

No route was added by Dashboard V4.

| Surface | Canonical routes |
| --- | --- |
| Public | `/`, `/features`, `/demo`, `/pricing`, `/pilot`, `/faq`, `/trust`, `/privacy`, `/security`, `/terms`; unmatched URLs use the shared bilingual 404 state |
| Intake | `/quote`, `/quote/[slug]`, `/quote/[slug]/success` |
| Auth | `/auth/sign-in`, `/auth/sign-up`, `/auth/check-email`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/callback` |
| Owner | `/dashboard`, `/dashboard/leads`, `/dashboard/leads/[leadId]`, `/dashboard/configuration`, `/dashboard/business-profile`, `/dashboard/settings`, `/dashboard/guide` |
| Compatibility | `/dashboard/quote-setup` redirects to Quote Setup |
| Internal | `/founder` performs authorization then redirects to `/admin`; `/admin` is founder-only |

## Dashboard V4 result

- Five primary owner destinations; Settings is no longer hidden on mobile.
- Repeated topbar titles, route guide rail, display-preference framework, and low-signal charts removed.
- Overview reduced to a next action, readiness, priorities, metrics, and short queue.
- Leads and Lead Detail reduced without removing search, pagination, attribution, routing, manual workflow, draft generation, or status controls.
- Draft Edit now changes the local draft used by Copy; non-persisted owner notes were removed.
- Quote Setup reduced from ten tabs to six coherent sections without changing save semantics or adding a migration.
- Settings reduced to essentials plus guardrail/history/lifecycle disclosures.
- Founder overview localized and simplified; detailed guarded operations remain in their tabs.
- Canadian French protected copy and field-builder examples polished.

Full detail: `docs/dashboard-v4/CURRENT.md` and `docs/dashboard-v4/CHANGELOG.md`.

## Verification truth

The final verification ledger is maintained in `docs/dashboard-v4/PHASE_PROGRESS.md` and updated only with commands actually run on the final tree.

V2.1 release commit `e922485fff985dfe03a508b1d2c8a5794db9d3cb` is on `main` with the exact locally verified tree. GitHub CI run `29390428140` completed successfully, and Vercel reported success at deployment target `FMTLX7SnzUMBsPLsf1iKgeNbPyvi`.

The release passed ESLint with zero warnings, TypeScript, `249/249` unit tests, Next.js 16.2.4 production build, local and Production public route `46/46`, bilingual responsive `20/20`, final UI matrix with zero failures, and inactive dynamic Quote GET `2/2` in EN/fr-CA. The Production route set directly covers every Auth page, base/dynamic unavailable Quote states, invalid Quote-success recovery, bilingual 404, localized global error source contract, redirects, metadata, sitemap, robots, locale-preserving links, and light/dark contracts. HTTPS responded successfully with CSP, HSTS, frame, content-type, referrer, and permissions controls present.

Environment fact: the local workspace does not currently contain `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, or `DATABASE_URL`. The safe classifier explicitly blocked Dashboard/Auth and RLS-required tests. Chrome/Chromium is also absent, so real browser interaction smoke is gated. These are honest environment gates, not permission to use managed Production for synthetic writes.

No Production database change, migration, cleanup, user deletion, or test-data insertion was performed in this release.

## Gate sequence and current state

1. **V2.1 code and public release gate — CLOSED:** lint, typecheck, full unit suite, build, documentation links, safe local HTTP smokes, `main` push, CI, Vercel mapping, HTTPS/security headers, and final Production read-only smokes passed.
2. **Safe authenticated QA target:** owner supplies/authorizes a local or disposable synthetic auth target; run desktop/mobile EN/fr-CA dashboard smoke.
3. **External OAuth decision:** keep Google unavailable or configure Google/Supabase provider and complete owner QA.
4. **Managed database reconciliation:** read-only migration/status audit, backup confirmation, explicit change plan, then separately authorized apply if needed.
5. **Production authenticated read-only acceptance:** protected dashboard visual QA requires an owner-approved no-secret session procedure.
6. **Real customer data:** explicit owner approval only after restored-target app/dashboard/RLS proof.
7. **Paid pilot:** support, payment/manual billing, refund, incident, backup, and rollback rehearsal after the real-data gate.

The copy-ready, least-privilege prompts for all external gates are in `prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.1.md`.

## Owner decisions still required

- Choose whether Google login remains unavailable or proceeds to external configuration/QA.
- Authorize and provide access for a safe authenticated QA target.
- Approve any managed Supabase inspection or later change after a read-only plan.
- Approve real-data and paid-pilot gates only after their prerequisites have evidence.

The dependency order, ideal expectations, Codex work, owner work, and stop rules are maintained in `docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md`.
