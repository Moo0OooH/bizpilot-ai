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
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Closed Premium Operations local/restore/RLS/concurrency/authenticated/intake proof and recorded the current Production reconciliation/export state.
 * - 2026-07-22: Corrected the historical V4.7 local object identity while keeping external evidence and the current candidate independently gated.
 * - 2026-07-21: Reopened remote/deployment/Production evidence for revalidation and added the Premium Operations proof gate.
 * - 2026-07-17: Recorded Dashboard V4.7 configurable quote structure, responsive shell, navigation controls, OAuth hardening, runtime-boundary fixes, functional main publication, CI/deployment success, and Production read-only acceptance.
 * - 2026-07-16: Recorded Dashboard V4.6 main publication, successful Vercel rollout, and Production public read-only acceptance.
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

# BizPilot AI Source of Truth — Updated 2026-07-22

## Executive status

BizPilot is implemented as a bilingual, manual-first Smart Intake and reply-preparation product for service businesses, with cleaning as the first complete pilot vertical. Website V4 explains the problem and workflow. Dashboard V4.7 supports ordered setup, configurable public-form title and section structure, list/tab/step presentation, public quote branding, triage, missing-information review, draft edit/copy, manual follow-up, and submitted-request reporting by privacy-safe tracked placement. Documentation V2.1 provides one phase/dependency plan and one complete EN/fr-CA route/workflow audit.

Premium Operations is a separately sold add-on release candidate for priority work, reviewed bulk-reply drafts, and internal availability coordination. It adds ordered migrations `0025_premium_operations_addons.sql` then additive `0026_premium_operations_schedule_integrity.sql`; its local and strict restored-target gates pass, but it is not yet a live Production claim. It does not turn BizPilot into a CRM, booking system, or automatic messaging system.

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

The historical V4.7 intake work retains the protected owner route `/dashboard/reports` introduced in V4.6 and adds no public route. Premium Operations adds the protected, entitlement-gated source route `/dashboard/operations`; ordered `0025` and additive `0026` now pass the required non-Production database proof, while exact-commit publication and live Production release remain pending.

| Surface | Canonical routes |
| --- | --- |
| Public | `/`, `/features`, `/demo`, `/pricing`, `/pilot`, `/faq`, `/trust`, `/privacy`, `/security`, `/terms`; unmatched URLs use the shared bilingual 404 state |
| Intake | `/quote`, `/quote/[slug]`, `/quote/[slug]/success` |
| Auth | `/auth/sign-in`, `/auth/sign-up`, `/auth/check-email`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/callback` |
| Owner | `/dashboard`, `/dashboard/leads`, `/dashboard/leads/[leadId]`, `/dashboard/reports`, `/dashboard/configuration`, `/dashboard/business-profile`, `/dashboard/settings`, `/dashboard/guide`; source candidate `/dashboard/operations` (entitlement-gated, not yet release-evidenced) |
| Compatibility | `/dashboard/quote-setup` redirects to Quote Setup |
| Internal | `/founder` performs authorization then redirects to `/admin`; `/admin` is founder-only |

## Dashboard V4.7 result

- The grouped desktop and compact-action navigation expose every authorized owner route. Reports and Guide can be hidden from owner navigation through display preferences without changing route authorization; core owner routes and founder access are never hidden by that setting.
- The protected shell, tab rows, fixed action areas, and public quote layout are responsive across narrow and wide viewports without duplicate Founder/Admin or Guide entry points.
- Repeated topbar titles, the route guide rail, and low-signal charts were removed; display preferences are limited to optional Reports/Guide owner-navigation visibility.
- Overview reduced to a next action, readiness, priorities, metrics, and short queue.
- Leads and Lead Detail reduced without removing search, pagination, attribution, routing, manual workflow, draft generation, or status controls.
- Draft Edit now changes the local draft used by Copy; non-persisted owner notes were removed.
- Quote Setup exposes six ordered readiness stages and seven coherent mounted panels, including Public Link, without adding a migration.
- Form Questions now controls the public form title/supporting copy, ordered section grouping, and list/tab/step presentation. Existing unstructured tenant values remain compatible, and the public quote flow consumes the saved structure.
- Public Link builds channel/campaign variants using the existing attribution allowlist; no direct social integration or customer identifier is added.
- Reports summarizes submitted requests only, with 7/30/90/all-time owner filters and a bounded founder aggregate. Direct and Unknown remain visible; views, clicks, revenue, and automatic conversions are not invented.
- Guide is explicitly divided into Setup and optimization and Workflow and reporting, with live tenant readiness and direct route actions.
- Branding preview, public intake, and success states share validated logos and WCAG-derived color/contrast rules; semantic success colors stay independent.
- Settings reduced to essentials plus guardrail/history/lifecycle disclosures.
- Founder overview localized and simplified; detailed guarded operations remain in their tabs.
- Canadian French protected copy and field-builder examples polished.
- Google login no longer silently bootstraps a missing workspace; provider/callback success remains an external live-QA gate.
- Server-to-client copy contracts are serializable. Regression coverage prevents callable translation helpers from crossing Client Component boundaries, which directly guards the Quote Setup and active public Quote runtime failures repaired in V4.7.

Full detail: `docs/dashboard-v4/CURRENT.md` and `docs/dashboard-v4/CHANGELOG.md`.

## Verification truth

The final verification ledger is maintained in `docs/dashboard-v4/PHASE_PROGRESS.md` and updated only with commands actually run on the final tree.

Local Git verifies that historical V4.7 commit `d9e25bbf50ccf42de2da4d70aa235ab7d289dc91` is present with tree `17d6b65cc9fb196c8d0d4ccaa46f5fd6f736076d`; the previously documented `a82af72bf8960b2bce1583e6446abca706c2a2bc` object is absent from this checkout. These local object facts do not independently revalidate a remote publication, CI run, Vercel deployment, or Production acceptance and are not evidence for the current Premium Operations candidate.

The current Premium Operations exact-tree local gate passes: frozen pnpm `10.34.5` install; zero-vulnerability full and Production dependency audits; lint; typecheck; `359/359` unit/source tests; static Supabase RLS/grant audit; Next.js `16.2.11` production build; public `46/46`; responsive `20/20`; UI matrix with zero failures; inactive Quote `2/2`; and image optimizer HTTP 200. Database-backed RLS passes `14/14` on clean local and restored targets, all seven two-session concurrency pairs pass, authenticated dashboard/Admin passes `17/17`, and active EN/fr-CA GET and independent submissions pass. Fresh exact-commit GitHub CI, Vercel, and Production remain release gates.

Premium Operations has a distinct release record: current roles/schema/public-data export and disposable restore pass; Production matches repository schema through `0024` except the absent `0023` retention helper; `0025`/`0026` objects are absent. The owner explicitly authorized the reconciled `0023`, `0025`, `0026` apply, merge, deployment, and read-only acceptance for this release. No entitlement activation or real-customer test write is included.

The owner-provided authenticated screenshot renders the role-gated Founder Admin entry, and the restored-target founder session passes every guarded Admin panel plus the intentional `/founder` redirect. Final Production protected read-only acceptance and a separate normal-owner denial check remain gated.

Commit `c78596b1f1530ff3586b9b076702822b0b711802`, CI run `29517118330`, and Vercel target `CbDDUpqxCVMoG3L8hTgGRoymvi5m` remain historical Website V4 / Documentation V2.1 evidence only. That public-site release passed ESLint with zero warnings, TypeScript, `249/249` unit tests, the Next.js production build, local and Production public route `46/46`, bilingual responsive `20/20`, the final UI matrix with zero failures, and inactive dynamic Quote GET `2/2` in EN/fr-CA. This historical evidence must not be relabeled as Dashboard V4.7 acceptance.

Live Google callback and final Production protected acceptance still require the appropriate external configuration/session. RLS and authenticated restored-target acceptance are complete. Managed Production remains prohibited for synthetic writes.

This record authorizes only the owner-requested reconciled release migrations and deployment. It does not authorize Production cleanup, user deletion, test-data insertion, entitlement activation, or real-customer workflow mutation.

Repository hygiene requires a fresh remote fetch before making publication or branch-inventory claims. Any historical branch inventory remains a revalidation input only; Prompt 00 in the external-action pack remains the owner-authenticated retirement procedure.

## Gate sequence and current state

1. **Dashboard V4.7 local Git identity — RECORDED:** commit `d9e25bbf…` is present with tree `17d6…`; the previously documented `a82af72…` object is absent from this checkout.
2. **Dashboard V4.7 remote publication/deployment/Production acceptance — GATED / RE-VERIFY:** fetch the target ref and map fresh CI, deployment, and no-write evidence to an exact commit.
3. **Premium Operations `0025` + `0026` local proof — PASS:** ordered clean/restored migration, RLS/tenant isolation, lifecycle, priority, availability conflict, provenance/currentness, seven concurrency pairs, authenticated UI, and active bilingual intake pass.
4. **Remote branch hygiene:** owner-authenticated Prompt 00 retires revalidated merged refs and classifies/archives unmerged refs before any deletion.
5. **Safe authenticated QA target — PASS for release candidate:** disposable restored local Supabase passed owner/founder route smoke; normal-owner Admin denial remains a separate final authorization check.
6. **External OAuth acceptance:** confirm Google/Supabase provider configuration and complete one live owner callback QA; the app must not silently create a workspace.
7. **Managed database reconciliation — PASS / APPLY PENDING:** read-only audit, current export, disposable restore, restored RLS/app proof, rollback source, and explicit change plan pass; apply the reconciled release sequence next.
8. **Production authenticated read-only acceptance:** protected dashboard visual QA requires an owner-approved no-secret session procedure.
9. **Real customer data:** explicit owner approval only after restored-target app/dashboard/RLS proof.
10. **Paid pilot:** support, payment/manual billing, refund, incident, backup, and rollback rehearsal after the real-data gate.

The copy-ready, least-privilege prompts for all external gates are in `prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.1.md`.

## Owner decisions still required

- Run Prompt 00 with owner-authenticated GitHub access; classify or approve archival for the four unmerged legacy branches.
- Complete one live Google login/callback QA after confirming the external provider configuration; do not share credentials.
- Authorize and provide access for a safe authenticated QA target.
- Approve an explicit local/disposable target for ordered migrations `0025` then `0026` before any database test, then approve any managed Supabase inspection or later change only after a read-only plan, backup confirmation, disposable restore, and restored RLS evidence.
- Ensure `BIZPILOT_IP_HASH_SALT` is stored as a Production secret before enabling public-submission abuse logging; never disclose its value.
- Approve real-data and paid-pilot gates only after their prerequisites have evidence.

The dependency order, ideal expectations, Codex work, owner work, and stop rules are maintained in `docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md`.
