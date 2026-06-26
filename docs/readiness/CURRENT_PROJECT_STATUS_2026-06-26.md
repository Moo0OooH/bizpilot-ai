# BizPilot AI - Current Project Status

Date: 2026-06-26
Repo: `E:\bizpilot-ai`
Branch: `main`
Status scope: repo inspection, D1/P8 sync, cleanup, and release hygiene

## One-Line Status

BizPilot AI is in a controlled post-P8/public-homepage and post-D1-dashboard
stabilization phase. P8 public homepage clarity is on `main`. D1 dashboard
shell and lead workflow stabilization is on `main` as local synthetic
code/test/visual ready. Real customer data and paid pilot remain blocked.

## Current Repo State

| Item | Value |
|---|---|
| Current branch | `main` |
| Remote | `origin/main` |
| P8 public-site commit on main | `6e7cfc3 feat(home): add chaos-to-clarity hero` |
| D1 dashboard commit on main | `654a645 fix(dashboard): stabilize d1 owner lead workflow` |
| Package manager | `pnpm@10.18.3` |
| Framework/runtime | Next.js `16.2.4`, React `19.2.4`, Node engine `>=24 <25` |

## What Was Checked

- `git status`, current branch, latest commits, and branch ancestry.
- `package.json` package manager and scripts.
- App routes under `app/**`.
- Dashboard routes and components under `app/(dashboard)/**` and
  `components/dashboard/**`.
- Lead workflow files, AI draft owner-review surfaces, and dashboard copy.
- Public homepage P8 source files and smoke/unit guards.
- Canonical docs, latest readiness docs, dashboard D0/D1 reports, and P8
  reports.
- Ignored caches/log outputs, especially `.next`, TypeScript build info,
  Supabase temp state, and old artifact logs.

## Current Phase

| Area | Status | Notes |
|---|---|---|
| Public site | GO for current P8 scope | Homepage now uses the chaos-to-clarity concept and manual-first pilot copy. |
| Dashboard D1 | Code/test/visual ready on local synthetic data | Applied to `main`; no real customer data approval is implied. |
| Real data | BLOCKED | Phase 24G explicit owner approval is not recorded. |
| Paid pilot | BLOCKED | Requires separate owner, ops, support, payment/refund, and restored app/RLS readiness gates. |
| Feature expansion | BLOCKED before validation | No auto-send, booking, invoices, SMS/WhatsApp automation, full CRM, or autonomous AI. |

## Completed Work Now Reflected On Main

P8 public homepage:

- Broader quote-request pain statement while still starting with cleaning.
- Desktop chaos -> BizPilot -> clarity hero visual.
- Mobile simplified visual.
- CTAs changed to pilot-safe language.
- No start-free-trial, fake proof, send icon, auto-send, booking, pricing,
  payment, or full CRM implication.

D1 dashboard:

- Dashboard shell/topbar/sidebar visual stabilization.
- Dashboard overview hierarchy improvement.
- Leads inbox scan clarity.
- Lead detail manual owner workflow clarity.
- AI draft presented as review/copy support only.
- EN/fr-CA dashboard copy parity for the inspected surfaces.
- Light/dark dashboard fixes, including badge contrast.
- No database schema, migration, RLS, auth, AI provider, billing/payment, or
  production data-flow changes.

## Files Changed By Current Main Commits

P8 public homepage commit `6e7cfc3`:

```text
app/globals.css
app/page.tsx
docs/P8_PUBLIC_SITE_CLARITY_AUDIT_2026-06-26.md
docs/P8_PUBLIC_SITE_CLARITY_FINAL_REPORT_2026-06-26.md
lib/i18n/public-site-copy.ts
tests/smoke/public-responsive-smoke.mts
tests/smoke/public-route-smoke.mts
tests/unit/i18n-copy.test.mts
tests/unit/public-visual-stability-source.test.mts
```

D1 dashboard commit `654a645`:

```text
app/(dashboard)/dashboard/business-profile/page.tsx
app/(dashboard)/dashboard/leads/[leadId]/page.tsx
app/(dashboard)/dashboard/leads/page.tsx
app/(dashboard)/dashboard/page.tsx
app/(dashboard)/layout.tsx
components/dashboard/copy-button.tsx
components/dashboard/dashboard-sidebar.tsx
components/dashboard/dashboard-theme.tsx
components/dashboard/dashboard-topbar.tsx
components/dashboard/dashboard-ui.tsx
components/dashboard/lead-workspace-queue.tsx
docs/D1_FULL_PROJECT_REVIEW_AND_QA_REPORT_2026-06-26.md
lib/i18n/bizpilot-copy.ts
```

This documentation/status sync:

```text
docs/CURRENT_CANONICAL_DOCS_v1.7.md
docs/AI_CODING_AGENT_START_HERE_v1.7.md
docs/README.md
docs/BIZPILOT_DOCS_FILE_INVENTORY_v1.7.md
docs/BIZPILOT_DOCUMENTATION_UPDATE_MANIFEST_v1.6.md
docs/P8_PUBLIC_SITE_CLARITY_AUDIT_2026-06-26.md
docs/P8_PUBLIC_SITE_CLARITY_FINAL_REPORT_2026-06-26.md
docs/D1_FULL_PROJECT_REVIEW_AND_QA_REPORT_2026-06-26.md
docs/readiness/CURRENT_PROJECT_STATUS_2026-06-20.md
docs/readiness/CURRENT_PROJECT_STATUS_2026-06-26.md
```

## Cleanup Performed

Removed safe local generated outputs only:

- `.next`
- `tsconfig.tsbuildinfo`
- `supabase/.temp`
- temporary local Next server logs
- old ignored `.log` files under `artifacts/`

Kept intentionally:

- `.env.local`
- `.codex-secrets/`
- `.vercel/`
- `node_modules/`
- `artifacts/` directory and non-log evidence artifacts
- `docs.rar`
- `next-env.d.ts`

These are ignored or environment-dependent and should not be deleted as part of
repo hygiene without a separate owner decision.

## Verification Results

Final verification for this status sync:

| Command | Result | Notes |
|---|---:|---|
| `pnpm verify` | PASS | Lint, typecheck, 139/139 unit tests, and production build passed. |
| `pnpm smoke:public -- --base-url=http://127.0.0.1:3030` | PASS | 10/10 public routes passed. |
| `pnpm smoke:responsive -- --base-url=http://127.0.0.1:3030` | PASS | 19 routes checked, 0 failures. |
| `pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3030` | PASS | Final UI matrix failures: 0; EN/fr-CA and light/dark covered. |
| `pnpm smoke:quote -- --base-url=http://127.0.0.1:3030 --inactive-slug=phase1-unavailable-synthetic` | PASS | 1/1 inactive synthetic quote route check passed. |
| `git diff --check` | PASS | Ran before final commit; no whitespace errors. |

Not run in this status sync:

| Command | Reason |
|---|---|
| `pnpm smoke:dashboard -- --base-url=http://127.0.0.1:3030` | Current Supabase URL classification was non-local. The dashboard smoke creates synthetic auth/workspace/lead data and must not run against non-local or production-like Supabase targets. |
| `pnpm verify:local-db` / `pnpm test:rls` | Current Supabase/DB target was not confirmed local in this session. RLS/local DB proof remains a required gate before real-data approval and paid/risky work. |

## Warning Triage

| Warning | Status | Decision |
|---|---|---|
| Shared real credentials appeared in chat | OPEN SECURITY HYGIENE | Credentials were not used for final QA. Rotate the password after this session. |
| D1 originally lived only on review branch | RESOLVED | D1 was cherry-picked to `main` in commit `654a645`. |
| P8 originally lived only on review branch | RESOLVED | P8 was cherry-picked and pushed to `main` in commit `6e7cfc3`. |
| P8 report referenced old review/commit instructions | RESOLVED IN THIS SYNC | Updated to reflect main state. |
| D1 report referenced review-branch readiness | RESOLVED IN THIS SYNC | Updated to reflect main commit state. |
| Historical docs still contain older phase language | NON-BLOCKING | Current canonical map and this status file supersede older conflicts. |
| Dashboard smoke creates synthetic data | CONTROLLED | Run only against local/synthetic Supabase, not production-like env. |
| Real customer data | BLOCKED | No approval recorded. |
| Paid pilot | BLOCKED | Separate business/ops gate required. |

## Remaining Blockers

- Phase 24G explicit owner real-data approval is not recorded.
- Paid pilot operating packet is not fully closed.
- Strict restored app/dashboard/RLS proof remains deferred before paid pilot,
  production migrations, destructive cleanup, bulk work, or broader scale.
- Production deployment must be confirmed after `main` push if Vercel/GitHub
  deploy is expected.
- Password rotation is recommended because credentials were shared in chat.

## Final Recommendation

Current decision:

```text
D1 code/test/visual ready on local synthetic data.
P8 public homepage code/test/visual ready on main.
Real data and paid pilot remain blocked.
```

Next safe sequence:

```text
1. Push the final status-sync commit.
2. Confirm production deploy/cache for the public homepage.
3. Use only local/synthetic dashboard QA unless a real-data approval gate closes.
4. Run quote slug smoke before real-data approval.
5. Run local DB/RLS proof before real-data approval.
6. Record Phase 24G explicit owner approval before real customer data.
7. Close pilot ops/payment/support/rollback gates before any paid pilot.
```
