# P10 Premium Hero And Site Audit

Date: 2026-06-26
Repo: `E:\bizpilot-ai`
Branch: `review/p10-hero-admin-console-polish`
Base commit: `37247679287c11af08a190c757a6136337a1747c`

## Decision Before Implementation

P10 public homepage polish is safe to start, scoped to public homepage UI,
public copy, visual CSS, and public visual/source tests.

A2 admin/owner console implementation is not safe to assume yet. It requires a
separate architecture/security audit before any admin or owner access changes.

## Canonical Docs Read

- `docs/CURRENT_CANONICAL_DOCS_v1.7.md`
  - Matters because it defines the current canonical docs package and scope
    control.
  - Latest decision: public site is accepted, dashboard D1 is the next safe
    phase, and real data/paid pilot remain blocked.
  - Conflict: none found for P10 public-only work.
- `docs/AI_CODING_AGENT_START_HERE_v1.7.md`
  - Matters because it defines agent safety boundaries.
  - Latest decision: cleaning-first, manual-first, no auto-send, owner review,
    and no real customer data without explicit approval.
  - Conflict: none found.
- `docs/readiness/CURRENT_PROJECT_STATUS_2026-06-26.md`
  - Matters because it records the active project phase.
  - Latest decision: P8/D1 are on main; real data and paid pilot are blocked.
  - Conflict: an older verification table is superseded by the later release
    hygiene report.
- `docs/readiness/POST_P8_D1_RELEASE_HYGIENE_AND_NEXT_GATES_2026-06-26.md`
  - Matters because it is the latest release hygiene state.
  - Latest decision: main is clean and pushed, public/D1 hygiene is complete,
    next gates remain local synthetic QA, local DB/RLS proof, real-data gate,
    and pilot ops gate.
  - Conflict: none found.
- `docs/P8_PUBLIC_SITE_CLARITY_FINAL_REPORT_2026-06-26.md`
  - Matters because P10 builds on the P8 chaos-to-clarity homepage.
  - Latest decision: P8 public clarity shipped within manual-first boundaries.
  - Conflict: P10 is a visual and language refinement, not a product scope
    expansion.
- `docs/D1_FULL_PROJECT_REVIEW_AND_QA_REPORT_2026-06-26.md`
  - Matters because it records dashboard D1 review boundaries.
  - Latest decision: D1 code/test ready, owner visual review pending; real data
    and paid pilot blocked.
  - Conflict: none found.
- `docs/P9_LANGUAGE_ISOLATION_AUDIT_AND_FIX_REPORT_2026-06-26.md`
  - Matters because P10 must preserve public and dashboard language isolation.
  - Latest decision: dashboard error boundary copy was moved into the
    dictionary; admin/founder remains a separate A1/A2 audit item.
  - Conflict: none found.
- `docs/A1_ADMIN_OWNER_USER_ACCESS_AUDIT_AND_SPEC_2026-06-26.md`
  - Matters because P10 includes an A2 admin/owner console request.
  - Latest decision: A1 implementation was not safe in that pass; owner/team
    management likely needs route design, server actions, audit logs, and RLS
    proof.
  - Conflict: A2 must start with audit/spec and stop if schema/RLS is required.

## Current Repo State

- `git status --short --branch`: clean on
  `review/p10-hero-admin-console-polish`.
- `origin/main`: `37247679287c11af08a190c757a6136337a1747c`.
- Package manager: `pnpm@10.18.3`.
- Main scripts found:
  - `pnpm verify`
  - `pnpm verify:local-db`
  - `pnpm test:unit`
  - `pnpm test:rls`
  - `pnpm smoke:public`
  - `pnpm smoke:responsive`
  - `pnpm smoke:quote`
  - `pnpm smoke:ui-matrix`
  - `pnpm smoke:dashboard`

## Routes And Files Inspected

Public routes:

- `app/page.tsx`
- `app/features/page.tsx`
- `app/industries/cleaning/page.tsx`
- `app/trust/page.tsx`
- `app/demo/page.tsx`
- `app/pricing/page.tsx`
- `app/pilot/page.tsx`
- `app/faq/page.tsx`
- `app/privacy/page.tsx`
- `app/security/page.tsx`
- `app/terms/page.tsx`
- `app/content-studio/page.tsx`

Public shared files:

- `components/public/marketing-ui.tsx`
- `components/public/marketing-compact-menu.tsx`
- `components/public/marketing-language-menu.tsx`
- `components/ui/theme-preference-control.tsx`
- `lib/i18n/public-site-copy.ts`
- `lib/i18n/home-copy.ts`
- `lib/seo.ts`
- `app/globals.css`

Dashboard/admin files sampled for scope boundaries:

- `app/admin/page.tsx`
- `app/(dashboard)/founder/page.tsx`
- `app/(dashboard)/dashboard/page.tsx`
- `app/(dashboard)/dashboard/leads/page.tsx`
- `app/(dashboard)/dashboard/leads/[leadId]/page.tsx`
- `components/dashboard/lead-workspace-queue.tsx`
- `server/actions/founder-admin.actions.ts`
- `server/services/founder-admin.service.ts`
- `server/repositories/founder-admin.repository.ts`
- `server/repositories/business-members.repository.ts`
- `server/policies/business-membership.policy.ts`

Tests/smokes inspected:

- `tests/unit/i18n-copy.test.mts`
- `tests/unit/public-visual-stability-source.test.mts`
- `tests/unit/public-pseudolocale-visual-contract.test.mts`
- `tests/unit/dashboard-shell-copy.test.mts`
- `tests/smoke/public-route-smoke.mts`
- `tests/smoke/public-responsive-smoke.mts`
- `tests/smoke/final-ui-matrix-smoke.mts`
- `tests/smoke/quote-route-smoke.mts`
- `tests/smoke/dashboard-auth-smoke.mts`

## Current Public Hero Findings

Current implementation:

- `app/page.tsx` has a P8 `MiniProductMockup` with left chaos, center
  BizPilot node, and right clarity queue.
- `lib/i18n/public-site-copy.ts` already contains the P8 approved copy:
  "Never lose a quote request in the chaos."
- `app/globals.css` controls the responsive compression of the hero and mockup.
- No new icon package is needed; `MarketingIcon` already supplies generic
  glyphs.

Desktop visual audit at local `http://127.0.0.1:3010/`:

- H1 is present and first-viewport dominant.
- Hero mockup is visible in the first viewport.
- The next Problem section is visible below the fold handoff.
- No horizontal overflow was detected by DOM metrics at the default desktop
  viewport.
- Issue: the three hero bullet labels are compressed into one row and visually
  collide/truncate around the third bullet. This fails the premium visual goal.
- Issue: the current visual still reads like a dense card diagram, not a
  polished signal-flow product story.

Mobile visual audit at 390px:

- H1, body, CTAs, and note are visible.
- The chaos/BizPilot/clarity stack is present.
- Issue: the badge and hero visual are clipped horizontally.
- Issue: mobile hero visual keeps too much desktop-style density and does not
  reduce cleanly to the requested simplified story.

## Gap: Docs/Prompt Vs Code

Docs/prompt claim desired state:

- A premium, trustable, polished "signal flow" hero.
- Stronger chaos-to-clarity story without copying reference imagery.
- Desktop: clear left-to-right flow.
- Mobile: simplified story with no horizontal overflow.
- EN/fr-CA must both fit.
- Manual-first, no auto-send, no booking, no invented pricing.

Code currently contains:

- Correct P8 manual-first chaos-to-clarity concept.
- Correct limits on source cards, message cards, lead cards, and draft review
  button.
- Public copy centralized in `lib/i18n/public-site-copy.ts`.
- Visual contract tests that must be updated if accepted P10 wording/classes
  change.

Missing or risky:

- Premium visual hierarchy.
- Mobile no-overflow proof.
- Bullet wrapping and button row robustness on desktop.
- Stronger visual distinction between raw noisy requests and organized signal.
- P10 reports are not yet present.
- A2 admin/owner implementation is not yet proven safe.

## Files Likely Needed For P10 Public Work

- `app/page.tsx`
  - Replace/refine hero mockup markup into a premium signal-flow composition.
- `app/globals.css`
  - Fix hero bullet wrapping, mobile clipping, hero mockup sizing, and
    responsive signal-flow layout.
- `lib/i18n/public-site-copy.ts`
  - Adjust only public homepage copy needed for P10 while preserving EN/fr-CA
    shape and manual-first boundaries.
- `tests/unit/i18n-copy.test.mts`
  - Update public copy contracts if P10 copy changes.
- `tests/unit/public-visual-stability-source.test.mts`
  - Lock new visual hooks and no-overflow classes.
- `tests/smoke/public-responsive-smoke.mts`
  - Update homepage route markers if copy/classes change.
- `tests/smoke/final-ui-matrix-smoke.mts`
  - Update final public UI matrix markers if P10 visual hooks change.

## Files That Must Not Be Touched In P10 Public Work

- `supabase/migrations/**`
- `types/database.ts`
- `lib/supabase/**`
- `server/providers/ai/**`
- `server/actions/**`
- `server/repositories/**`
- `server/services/**`
- billing/payment files
- production data-flow files
- real customer data handling

## A2 Admin/Owner Console Preliminary Risk

Existing admin code contains founder-only internal console surfaces backed by
founder authorization and service-role server code. Existing A1 docs state that
owner-facing team/user management is not safe to implement without explicit
route design, server actions, audit logging, and likely schema/RLS proof.

Therefore A2 must begin with audit/spec. If required changes touch schema, RLS,
auth, service-role behavior, production data flow, or cross-tenant permissions,
implementation must stop and produce a security/RLS gate proposal instead of
fake UI.

## Safe Implementation Plan

P10-A:

- Upgrade homepage hero visual only.
- Keep P8 product boundaries.
- Fix desktop bullet collision and mobile clipping.
- Avoid new dependencies and external logo downloads.

P10-B:

- Polish public homepage copy and fr-CA parity only where needed.
- Preserve copy dictionary ownership.

P10-C:

- Run public source/unit/smoke verification.
- Browser/Chrome visual review for EN/fr-CA, light/dark, desktop/mobile.
- Create public final report.

P10-D:

- Audit dashboard/admin language isolation.
- Apply only safe dictionary/source fixes if found.

P10-E:

- Audit A2 admin/owner console.
- Stop at gate proposal if security/RLS/route/schema work is needed.

## Verification To Run After Implementation

Commands exist in `package.json`:

- `pnpm verify`
- `pnpm smoke:public`
- `pnpm smoke:responsive`
- `pnpm smoke:ui-matrix`
- `pnpm smoke:quote`
- `pnpm verify:local-db`
- `pnpm smoke:dashboard`
- `git diff --check`

Run `verify:local-db` only after confirming the database URL is local/synthetic.
Run dashboard smoke only against confirmed local/synthetic Supabase settings.

## Recommendation

P10 public homepage polish is safe to start now.

A2 admin/owner console implementation is not yet safe to start. It needs audit
and likely a security/RLS gate proposal before any implementation.

Real data and paid pilot remain blocked.
