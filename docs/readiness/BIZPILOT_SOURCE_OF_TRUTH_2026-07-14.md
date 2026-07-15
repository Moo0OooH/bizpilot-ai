<!--
 * ============================================================
 * File: docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md
 * Project: BizPilot AI
 * Description: Evidence-bounded whole-project source of truth after the Website V4 and Dashboard V4 consolidation.
 * Role: Controls release claims, product boundaries, current gaps, next actions, and production/data gates.
 * Related:
 * - docs/readiness/current-status.json
 * - docs/dashboard-v4/CURRENT.md
 * - docs/website-v4/CURRENT.md
 * - docs/CURRENT_CANONICAL_DOCS_v2.0.md
 * Author: MoOoH
 * Created: 2026-07-14
 * Last Updated: 2026-07-14
 * Change Log:
 * - 2026-07-14: Recorded the pushed release SHA, successful GitHub CI/Vercel rollout, and read-only Production smoke evidence.
 * - 2026-07-14: Consolidated the current public, dashboard, admin, documentation, verification, and external-gate posture.
 * ============================================================
 -->

# BizPilot AI Source of Truth — 2026-07-14

## Executive status

BizPilot is implemented as a bilingual, manual-first Smart Intake and reply-preparation product for service businesses, with cleaning as the first complete pilot vertical. The public Website V4 explains the problem and workflow; the protected Dashboard V4 helps an owner configure one intake link, triage requests, identify missing information, and review/edit drafts before sending through an existing channel.

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
| Public | `/`, `/features`, `/demo`, `/pricing`, `/pilot`, `/faq`, `/trust`, `/privacy`, `/security`, `/terms` |
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

Functional release commit `b81f71d870528219a13eae8575e387397c4883e7` is on `main`. GitHub App validation completed successfully, Vercel reported success for the same SHA, and `https://bizpilo.com` passed public route `34/34`, bilingual responsive `20/20`, final UI matrix with zero failures, and inactive quote GET `1/1`.

Environment fact: the local workspace does not currently contain the approved local dashboard/auth target variables required for authenticated browser smoke. The safe target classifier therefore blocks that test. This is an honest environment gate, not permission to use managed Production for synthetic writes.

No Production database change, migration, cleanup, user deletion, or test-data insertion was performed in this release.

## Gate sequence and current state

1. **Code release — CLOSED:** lint, typecheck, full unit suite, build, push, CI, Vercel status, and Production public read-only smoke passed.
2. **Safe authenticated QA target:** owner supplies/authorizes a local or disposable synthetic auth target; run desktop/mobile EN/fr-CA dashboard smoke.
3. **External OAuth decision:** keep Google unavailable or configure Google/Supabase provider and complete owner QA.
4. **Managed database reconciliation:** read-only migration/status audit, backup confirmation, explicit change plan, then separately authorized apply if needed.
5. **Production authenticated read-only acceptance:** public Vercel/domain/read-only smoke passed; protected dashboard visual QA still requires an owner-approved no-secret session procedure.
6. **Real customer data:** explicit owner approval only after restored-target app/dashboard/RLS proof.
7. **Paid pilot:** support, payment/manual billing, refund, incident, backup, and rollback rehearsal after the real-data gate.

The copy-ready, least-privilege prompts for steps 2–7 are in `prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.0.md`.

## Owner decisions still required

- Choose whether Google login remains unavailable or proceeds to external configuration/QA.
- Authorize and provide access for a safe authenticated QA target.
- Approve any managed Supabase inspection or later change after a read-only plan.
- Approve real-data and paid-pilot gates only after their prerequisites have evidence.

Everything else in the Dashboard V4 code/documentation release is suitable for Codex to complete without owner intervention.
