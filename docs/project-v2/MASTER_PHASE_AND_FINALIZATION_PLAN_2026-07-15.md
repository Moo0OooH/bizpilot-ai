<!--
 * ============================================================
 * File: docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md
 * Project: BizPilot AI
 * Description: Exhaustive dependency-ordered plan for code release, synthetic acceptance, real-data readiness, and paid pilot readiness.
 * Role: Separates completed repository work from external gates and future product scope.
 * Related:
 * - docs/project-v2/BILINGUAL_ROUTE_AND_FLOW_AUDIT_2026-07-15.md
 * - docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v2.0.md
 * - prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.1.md
 * Author: MoOoH
 * Created: 2026-07-15
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Corrected the historical V4.7 local object identity without promoting it to external release evidence.
 * - 2026-07-21: Reopened the unverified V4.7 publication/deployment assertion and added the Premium Operations proof sequence.
 * - 2026-07-17: Recorded Dashboard V4.7 functional publication, configurable intake/runtime hardening, successful CI/deployment/Production read-only acceptance, and the remaining authenticated, OAuth, restored-RLS, real-data, and pilot gates.
 * - 2026-07-15: Added the pre-existing remote legacy-branch retirement gate and exact safe external procedure.
 * - 2026-07-15: Closed the V2.1 public release phase with exact main, CI, Vercel, HTTPS, and Production smoke evidence.
 * - 2026-07-15: Created the consolidated whole-project phase, dependency, responsibility, and ideal-exit plan.
 * ============================================================
 -->

# BizPilot Master Phase and Finalization Plan — 2026-07-15

## North-star outcome

A service business shares one Smart Intake Link anywhere customers already reach it. The customer intentionally provides the service, location, timing, scope, and contact details needed for a useful request. BizPilot organizes the request, makes missing information visible, and prepares a cautious draft. A human reviews, edits, copies, and sends it through the existing customer channel.

The current product does not claim direct social inbox integration, autonomous sending, invented prices, guaranteed availability, confirmed booking, payments, invoicing, or a full CRM.

## Dependency order

| Order | Phase | Current status | Ideal exit evidence | Responsibility |
| ---: | --- | --- | --- | --- |
| 0 | Repository, branch, instructions, version, and documentation authority | DONE | One `main` worktree; current docs only; product/version manifests agree | Codex |
| 0A | Remote legacy-branch retirement | GATED | Eleven merged legacy refs can be revalidated and retired; four unmerged refs require owner classification or approved archival before deletion; Prompt 00 records the exact procedure | Owner-authenticated GitHub action, then Codex verification |
| 1 | Public product story and conversion UX | DONE | Ten intentional routes; distinct page jobs; clear problem → intake → organized request → human-reviewed reply story | Codex |
| 2 | EN/fr-CA public, Auth, Intake, 404, error, metadata, nav, footer | DONE | Structural parity, correct document language, locale-preserving links, no mixed copy, public 46/46, responsive 20/20, UI zero failures | Codex |
| 3 | Email/password Auth foundation | DONE in source | Sign-up/sign-in/reset/callback tests plus safe synthetic browser proof | Codex + approved synthetic target |
| 4 | Google OAuth | HARDENED in source; live callback GATED | Provider configured with approved origins/callbacks; login never silently bootstraps a workspace; owner browser QA passes | Owner/external console, then Codex QA |
| 5 | Smart Intake and public quote flow | DONE in V4.7 source/local evidence; current read-only Production acceptance and submitted synthetic flow GATED | Configurable title/sections/list-tabs-steps; local active/inactive EN/fr-CA GET contract; consent/validation; abuse safeguards; success boundary; no Production test writes | Codex + approved synthetic target |
| 6 | Owner Dashboard V4.7 | DONE in source/local gates; authenticated visual proof GATED | Overview, Leads, Lead Detail, Reports, Quote Setup, Business Profile, Settings, Guide; optional Reports/Guide nav; responsive mobile/desktop EN/fr-CA; edit/copy/manual-send | Codex + approved synthetic target |
| 7 | Founder/Admin controls | DONE in source; screenshot visibility observed; live authorization proof GATED | Founder-only access, normal-owner denial, guarded actions, dry runs, audit evidence, no decorative business claims | Codex + approved synthetic target |
| 8 | AI summary/draft boundary | DONE in source | Structured output and fallback tests, no content logging, owner review, provider failure path, cost/budget monitoring | Codex; monitoring configuration may require owner |
| 9 | Tenant isolation, RLS, schema, backup, restore | GATED for current managed/restored evidence | Read-only drift map, current backup, disposable restore, RLS suite, authenticated restored-app smoke, rollback proof | Owner authorizes target; Codex executes bounded plan |
| 10 | GitHub, CI, Vercel, domain, HTTPS, read-only Production release | GATED / RE-VERIFY | Local Git contains V4.7 commit `d9e25bbf…` with tree `17d6b65…`; the previously documented `a82af72…` object is absent. Fresh exact-commit CI/deployment and no-write acceptance evidence are required before closure. | Codex after remote/owner access |
| 10A | Premium Operations schema/release proof | GATED | Apply `0025_premium_operations_addons.sql` then additive `0026_premium_operations_schedule_integrity.sql`, in order, to an approved local/disposable target; prove entitlement/RLS/tenant isolation, lifecycle/review/copy, overlap, provenance/currentness, and concurrency controls; re-run source verification; then obtain a separately approved Production reconciliation/apply plan. | Codex for local proof; owner for target/Production approval |
| 11 | Search discovery and non-PII measurement | PARTIAL / GATED | Sitemap submitted, indexing inspected, field CWV reviewed, analytics sink separately approved or intentionally off | Owner external access; Codex audit |
| 12 | Real customer data | NOT APPROVED | Privacy/consent/retention/deletion/incident/support evidence plus restored-target proof and explicit owner approval | Owner decision after Codex packet |
| 13 | Paid pilot | NOT APPROVED | Real-data gate passed; offer, taxes, manual billing, refund/cancellation, support, onboarding, offboarding, rollback and metrics approved | Owner/commercial action after Codex packet |
| 14 | Direct inboxes, auto-send, booking, payments, full CRM, multi-vertical activation | ROADMAP | New product decision, threat model, data model, UX, legal/ops and separate release plan | Not authorized now |

## Detailed ideal expectations

### Product and customer behavior

- First five seconds explain the customer-message overload and the single-link solution.
- Every primary page has one job and one dominant next action.
- The public site demonstrates the real workflow instead of generic AI promises.
- Cleaning-specific validation appears after the universal service-business message.
- Pricing is explicit about founder-led approval and no self-serve checkout.
- Trust content states what is known, unknown, human-reviewed, retained, and not automated.
- Empty/loading/error/permission states explain the next safe action.

### Design, responsiveness, and accessibility

- No horizontal overflow at 320–1440+ CSS pixels, 200% zoom, or long fr-CA content.
- One H1 per page, meaningful landmarks, keyboard focus, reduced motion, minimum touch targets, readable contrast, and no color-only state.
- Hero type, cards, icons, spacing, and information density follow the active V4 tokens; no page-level visual fork.
- Public routes may have distinct compositions while using shared primitives.
- Protected routes stay compact, action-first, low-scroll, and free of nested first-viewport scrolling.

### Reliability, security, and privacy

- Secrets never enter source, docs, screenshots, test output, or prompts.
- Production is read-only unless an exact separately approved change plan names backup and rollback.
- Synthetic writes run only against a classifier-approved local/disposable target.
- Tenant isolation, public-slug boundaries, least privilege, safe logs/errors, rate limits, consent, retention, export, deletion, and incident response remain explicit.
- Provider failure uses sanitized rule fallback; AI never controls sending, pricing, booking, payment, or account access.

### Release and evidence

- Lint, typecheck, full unit suite, build, documentation-link audit, public route smoke, responsive smoke, UI matrix, and safe quote GET pass on the final tree.
- Authenticated and RLS results are marked `GATED`, never `PASS`, when safe target variables are missing.
- The release record names commit, branch, CI, Vercel deployment, Production URL, route counts, failures, and database actions.
- Server-rendered pages must not pass functions or other non-serializable translation/configuration values into Client Components; recursive source regression coverage guards this boundary.
- No extra branch, worktree, product route, production test record, or unapproved migration is created.

## Current priority queue

1. `P0 — GATED / RE-VERIFY`: publish the exact current candidate and map fresh CI, deployment, and no-write acceptance evidence to that commit; historical V4.7 local object identity is not current release evidence.
2. `P0 — DONE locally`: current-candidate source verification and documentation synchronization pass with the exact results recorded in the Dashboard phase ledger.
3. `P0 — Owner → Codex`: provide/authorize a disposable target for ordered Premium Operations migrations `0025` then `0026`; then run migration/RLS/tenant-isolation/lifecycle/concurrency proof and authenticated Owner/Admin/Auth/active-Intake workflows.
4. `P0 — Owner → Codex`: authorize read-only managed Supabase reconciliation, backup confirmation, disposable restore, restored-application smoke, and RLS proof; any Production `0025` + `0026` apply remains separate.
5. `P1 — Owner → Codex`: complete one live Google OAuth callback test after confirming approved provider origins/callbacks; do not share credentials.
6. `P1 — Owner → Codex`: complete Search Console/CWV external checks; keep analytics disabled unless a no-PII sink is explicitly approved.
7. `P1 — Owner`: review and explicitly decide the real-data gate only after restored-target proof.
8. `P1 — Owner`: only after real-data approval, decide the paid-pilot gate.

## Stop rules

Stop rather than infer permission if an action would expose credentials, mutate managed Production, insert synthetic or real customer data, contact a person, collect payment, change OAuth/provider settings, run a remote migration, delete users, or expand into roadmap scope.
