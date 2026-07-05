# Phase 26D - Owner Dashboard Priority Standardization

Date: 2026-07-05
Branch: `main`
Scope: protected owner dashboard overview hierarchy, visual-token cleanup,
source guards, and documentation index updates.

## Purpose

Continue dashboard standardization against the active Dashboard V3 master
standard. This pass keeps the owner dashboard focused on one safe manual next
action, makes quote-page actions secondary utilities, and removes decorative
hard-coded overview insight colors from the owner overview.

## Implemented

- Kept the overview cockpit as the only first-screen primary action region.
- Added source markers for:
  - `data-dashboard-primary-action`,
  - `data-dashboard-priority-order`,
  - `data-dashboard-utility-actions`,
  - `data-dashboard-secondary-insights`.
- Demoted the header quote-page action from a primary button to a secondary
  utility button.
- Changed the overview quote-page utility copy from "Open quote form" to
  "Preview quote page" / "Previsualiser la page de soumission".
- Removed the owner overview `violet` action tone and mapped reply urgency to
  existing warning/danger dashboard states.
- Replaced hard-coded owner insight colors with dashboard CSS variables.
- Localized the lead-source donut aria label through existing dashboard copy.
- Added source guards so future dashboard work does not reintroduce a competing
  quote-form primary CTA, purple owner priority tone, or hard-coded owner
  insight colors.

## Product And Gate Notes

- No customer data was opened.
- No Supabase data was read or mutated.
- No auth, RLS, migration, server action, AI provider, payment, booking,
  invoice, SMS/WhatsApp, team access, or automation behavior changed.
- No paid-pilot, real-data, destructive cleanup, production mutation, or broad
  CRM gate was opened.
- This is a UI hierarchy/source-guard pass only.

## Validation

Targeted dashboard source guards:

```text
node --test tests/unit/dashboard-professionalization-source.test.mts tests/unit/dashboard-v3-final-acceptance-source.test.mts
PASS - 11/11 tests
```

Full validation:

```text
git diff --check
PASS

pnpm test:unit
PASS - 210/210 tests

pnpm lint
PASS

pnpm typecheck
PASS

pnpm build
PASS
```

Dashboard local smoke gate:

```text
pnpm check:dashboard-local
BLOCKED AS DESIGNED - NEXT_PUBLIC_SUPABASE_URL is managed/non-local, so
authenticated dashboard smoke was not run.
```

Validation caveat:

```text
pnpm exec prettier --check "app/(dashboard)/dashboard/page.tsx" "lib/i18n/bizpilot-copy.ts" "tests/unit/dashboard-professionalization-source.test.mts" "tests/unit/dashboard-v3-final-acceptance-source.test.mts"
FAILED - prettier is not installed/exposed as a repo command
```

Formatting and syntax are covered by the repo lint/typecheck/build validation
instead.

## Remaining Dashboard Queue

- Protected-route browser screenshot/focus QA for owner and admin routes after a
  confirmed local/synthetic dashboard session is available.
- Data-rich admin/owner visual QA with production-like synthetic rows.
- Real customer data and paid pilot remain blocked until explicit owner gates
  close.
