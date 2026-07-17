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
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Added Dashboard V4.6 ordered setup, two-part Guide, tracked placement reports, Admin aggregates, and brand/runtime parity evidence.
 * - 2026-07-16: Recorded the final Website V4 typography, hierarchy, CTA, legal-shell, CI, Vercel, and managed-browser release evidence.
 * - 2026-07-15: Recorded the pre-existing remote legacy-branch inventory and least-destructive owner-authenticated retirement gate.
 * - 2026-07-15: Closed the V2.1 push, CI, Vercel, HTTPS, and Production public read-only release with exact evidence.
 * - 2026-07-15: Recorded the final V2.1 local verification, documentation cleanup, safe quote-read fallback, and unchanged external gates.
 * - 2026-07-15: Added the exhaustive project/route/flow audit, bilingual 404/error coverage, V2.1 phase plan, and consolidated external gates.
 * - 2026-07-14: Recorded the pushed release SHA, successful GitHub CI/Vercel rollout, and read-only Production smoke evidence.
 * - 2026-07-14: Consolidated the current public, dashboard, admin, documentation, verification, and external-gate posture.
 * ============================================================
 -->

# BizPilot AI Source of Truth — Updated 2026-07-16

## Executive status

BizPilot is implemented as a bilingual, manual-first Smart Intake and reply-preparation product for service businesses, with cleaning as the first complete pilot vertical. Website V4 explains the problem and workflow; Dashboard V4.6 supports ordered setup, public quote branding, triage, missing-information review, draft edit/copy, manual follow-up, and submitted-request reporting by privacy-safe tracked placement. Documentation V2.1 provides one phase/dependency plan and one complete EN/fr-CA route/workflow audit.

This code release does **not** approve real customer data, a paid pilot, Google login as live, remote migration changes, or Production data mutation. Those remain separately gated even when lint, tests, and build pass.

## Product boundary

### Implemented

- Bilingual public marketing/legal routes and business-specific public quote intake.
- Structured service/area/custom-field/consent capture with validation and abuse safeguards.
- Owner lead queue with search, filters, sorting, pagination, scoring, missing-information and SLA cues.
- Rule/AI-assisted summaries and drafts with explicit owner review/edit/copy/manual-send workflow.
- Quote Setup, business profile, language/theme/account settings, audit/history, and lifecycle surfaces.
- Privacy-safe tracked quote-link variants and owner/founder reports for submitted requests by source, campaign tag, workflow status, and manually recorded outcome.
- Founder-only user/workspace/lead/health/activity oversight with guarded manual controls and cleanup dry runs.
- Email/password auth and application-side Google login path with login-only scopes.

### Not represented as live

- Direct Instagram, WhatsApp, Facebook, Gmail, or CRM inbox integration.
- Automatic sending, autonomous customer decisions, price invention, confirmed booking, or guaranteed availability.
- Full CRM, scheduler, invoice platform, payment capture, SMS/WhatsApp automation, or self-serve activation.
- Phone authentication.
- Live-approved Google OAuth before provider configuration and owner QA.

## Current application routes

Dashboard V4.6 adds one protected owner route, `/dashboard/reports`; it adds no public route.

| Surface | Canonical routes |
| --- | --- |
| Public | `/`, `/features`, `/demo`, `/pricing`, `/pilot`, `/faq`, `/trust`, `/privacy`, `/security`, `/terms`; unmatched URLs use the shared bilingual 404 state |
| Intake | `/quote`, `/quote/[slug]`, `/quote/[slug]/success` |
| Auth | `/auth/sign-in`, `/auth/sign-up`, `/auth/check-email`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/callback` |
| Owner | `/dashboard`, `/dashboard/leads`, `/dashboard/leads/[leadId]`, `/dashboard/reports`, `/dashboard/configuration`, `/dashboard/business-profile`, `/dashboard/settings`, `/dashboard/guide` |
| Compatibility | `/dashboard/quote-setup` redirects to Quote Setup |
| Internal | `/founder` performs authorization then redirects to `/admin`; `/admin` is founder-only |

## Dashboard V4.6 result

- Five primary mobile owner destinations; the grouped desktop and compact-action navigation still expose every authorized owner route, including Reports.
- Repeated topbar titles, route guide rail, display-preference framework, and low-signal charts removed.
- Overview reduced to a next action, readiness, priorities, metrics, and short queue.
- Leads and Lead Detail reduced without removing search, pagination, attribution, routing, manual workflow, draft generation, or status controls.
- Draft Edit now changes the local draft used by Copy; non-persisted owner notes were removed.
- Quote Setup exposes six ordered readiness stages and seven coherent mounted panels, including Public Link, without changing save semantics or adding a migration.
- Public Link builds channel/campaign variants using the existing attribution allowlist; no direct social integration or customer identifier is added.
- Reports summarizes submitted requests only, with 7/30/90/all-time owner filters and a bounded founder aggregate. Direct and Unknown remain visible; views, clicks, revenue, and automatic conversions are not invented.
- Guide is explicitly divided into Setup and optimization and Workflow and reporting, with live tenant readiness and direct route actions.
- Branding preview, public intake, and success states share validated logos and WCAG-derived color/contrast rules; semantic success colors stay independent.
- Settings reduced to essentials plus guardrail/history/lifecycle disclosures.
- Founder overview localized and simplified; detailed guarded operations remain in their tabs.
- Canadian French protected copy and field-builder examples polished.

Full detail: `docs/dashboard-v4/CURRENT.md` and `docs/dashboard-v4/CHANGELOG.md`.

## Verification truth

The final verification ledger is maintained in `docs/dashboard-v4/PHASE_PROGRESS.md` and updated only with commands actually run on the final tree.

The V4.6 candidate passes ESLint with zero warnings, TypeScript, `272/272` unit/source tests, the Next.js 16.2.4 production build, local public route smoke `46/46`, bilingual responsive smoke `20/20`, and the final UI matrix with zero failures on the tree merged with the latest public-site `main` baseline. The active Quote fixture and authenticated owner/admin visual smoke remain gated because no approved synthetic slug or authenticated target was supplied. No submission, migration, or Production data mutation was performed.

The latest published Website V4 / Documentation V2.1 release commit is `c78596b1f1530ff3586b9b076702822b0b711802`. GitHub CI run `29517118330` completed successfully, and Vercel reported success at deployment target `CbDDUpqxCVMoG3L8hTgGRoymvi5m`. Dashboard V4.6 publication evidence remains separate until its exact commit is recorded.

That published public release passed ESLint with zero warnings, TypeScript, `249/249` unit tests, Next.js 16.2.4 production build, local and Production public route `46/46`, bilingual responsive `20/20`, final UI matrix with zero failures, and inactive dynamic Quote GET `2/2` in EN/fr-CA. The Production route set directly covers every Auth page, base/dynamic unavailable Quote states, invalid Quote-success recovery, bilingual 404, localized global error source contract, redirects, metadata, sitemap, robots, locale-preserving links, and light/dark contracts. HTTPS responded successfully with CSP, HSTS, frame, content-type, referrer, and permissions controls present.

Environment fact: the local workspace does not currently contain `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, or `DATABASE_URL`. The safe classifier explicitly blocked Dashboard/Auth and RLS-required tests. Chrome/Chromium is absent, so the repository's standalone local browser runner remains gated; the public Production site was instead verified read-only through the managed browser across all ten routes in EN/fr-CA, with no authenticated or data-writing action. These are honest environment gates, not permission to use managed Production for synthetic writes.

No Production database change, migration, cleanup, user deletion, or test-data insertion was performed in this release.

Repository hygiene fact for the latest recorded published baseline: local Git had one clean `main` branch and one worktree synchronized `0/0` with `origin/main`. Dashboard V4.6 publication evidence is still pending in this candidate record. GitHub still contains 15 pre-existing legacy branches. Eleven are ancestors of the recorded `main`; four contain unmerged commits and therefore require explicit superseded/archival classification before deletion. The current connector cannot delete remote refs, so Prompt 00 in the external-action pack is the exact owner-authenticated retirement procedure. No new branch was created in this release candidate.

## Gate sequence and current state

1. **V2.1 code and public release gate — CLOSED:** lint, typecheck, full unit suite, build, documentation links, safe local HTTP smokes, `main` push, CI, Vercel mapping, HTTPS/security headers, and final Production read-only smokes passed.
2. **Remote branch hygiene:** owner-authenticated Prompt 00 retires revalidated merged refs and classifies/archives four unmerged refs before any deletion.
3. **Safe authenticated QA target:** owner supplies/authorizes a local or disposable synthetic auth target; run desktop/mobile EN/fr-CA dashboard smoke.
4. **External OAuth decision:** keep Google unavailable or configure Google/Supabase provider and complete owner QA.
5. **Managed database reconciliation:** read-only migration/status audit, backup confirmation, explicit change plan, then separately authorized apply if needed.
6. **Production authenticated read-only acceptance:** protected dashboard visual QA requires an owner-approved no-secret session procedure.
7. **Real customer data:** explicit owner approval only after restored-target app/dashboard/RLS proof.
8. **Paid pilot:** support, payment/manual billing, refund, incident, backup, and rollback rehearsal after the real-data gate.

The copy-ready, least-privilege prompts for all external gates are in `prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.1.md`.

## Owner decisions still required

- Run Prompt 00 with owner-authenticated GitHub access; classify or approve archival for the four unmerged legacy branches.
- Choose whether Google login remains unavailable or proceeds to external configuration/QA.
- Authorize and provide access for a safe authenticated QA target.
- Approve any managed Supabase inspection or later change after a read-only plan.
- Approve real-data and paid-pilot gates only after their prerequisites have evidence.

The dependency order, ideal expectations, Codex work, owner work, and stop rules are maintained in `docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md`.
