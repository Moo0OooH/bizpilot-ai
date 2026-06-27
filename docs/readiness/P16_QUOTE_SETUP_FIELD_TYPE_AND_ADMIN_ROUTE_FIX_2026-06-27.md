# P16 Quote Setup Field-Type and Admin Route Fix

Date: 2026-06-27
Repo: `E:\bizpilot-ai`
Branch: `main`
Scope: Quote Setup custom-field type crash, founder/admin business routing,
field-type UI copy, browser retest, and release checks.

## Issue Found

The Quote Setup custom field builder crashed when the owner changed the new
field type selector.

Root cause:

- `CustomQuoteFieldBuilder` read `event.currentTarget.value` inside a React
  state updater callback.
- React clears `currentTarget` after the event handler returns.
- When the updater ran, `currentTarget` was `null`, causing:
  `Cannot read properties of null (reading 'value')`.
- The dashboard error boundary then showed the workspace refresh message.

## Fixes Made

Quote Setup:

- Captured the selected field type before calling `setFields`.
- Retested every custom field type:
  `text`, `textarea`, `email`, `phone`, `number`, `select`, `radio`,
  `boolean`, `date`, and `time_window`.
- Verified `Options` appears only for `select`, `radio`, and `time_window`.
- Updated EN/fr-CA helper copy so time-window fields are named in the options
  guidance.

Founder/admin:

- Added a dedicated `adminBusinessHref()` helper for workspace selection.
- Business rail links now stay on the business-control route instead of reusing
  the user paging/filter helper.
- User detail links to business controls now use the same clean business route.

## Browser Verification

Local target:

- `http://127.0.0.1:3045/dashboard/configuration#cleaning-template-fields`
- `http://127.0.0.1:3045/admin`

Quote Setup field-type results:

| Field type | Error boundary | Options box |
|---|---|---|
| text | No | Hidden |
| textarea | No | Hidden |
| email | No | Hidden |
| phone | No | Hidden |
| number | No | Hidden |
| select | No | Visible |
| radio | No | Visible |
| boolean | No | Hidden |
| date | No | Hidden |
| time_window | No | Visible |

Admin route audit:

- `/admin` loaded with one H1.
- No page-level horizontal overflow.
- No dashboard error boundary.

## Safety Notes

- No production user deletion, workspace cleanup, lead deletion, or destructive
  admin action was executed.
- The fix changes client state handling and admin navigation only.
- Synthetic dashboard data creation remains blocked on production-prohibited
  Supabase targets.

## Verification

- `pnpm typecheck` passed.
- `pnpm lint` passed.
- `pnpm test:unit` passed: 152 tests / 29 suites.
- `pnpm build` passed.
- `pnpm smoke:public -- --base-url=http://127.0.0.1:3045` passed:
  10 tests.
- `pnpm smoke:responsive -- --base-url=http://127.0.0.1:3045` passed:
  19 routes / 0 failures.
- `pnpm smoke:quote -- --base-url=http://127.0.0.1:3045 --inactive-slug=phase1-unavailable-synthetic`
  passed.
- `pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3045 --inactive-slug=phase1-unavailable-synthetic`
  passed: final UI matrix failures 0.
- `pnpm smoke:dashboard -- --base-url=http://127.0.0.1:3045` was blocked
  by design because the current env points at the production Supabase project.
  Use founder-approved visual/read-only production validation for `/admin` and
  authenticated dashboards.
