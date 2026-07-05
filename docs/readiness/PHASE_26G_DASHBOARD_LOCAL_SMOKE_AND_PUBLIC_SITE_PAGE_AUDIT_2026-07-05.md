# Phase 26G Dashboard Local Smoke and Public Site Page Audit

Date: 2026-07-05
Repo: `E:\bizpilot-ai`
Branch: `main`
Baseline HEAD before this pass: `4144e8059fb22c340fa6053a783282e2cdd0370b`

## Verdict

PASS WITH RISKS.

Dashboard local authenticated smoke is now closed for the local/synthetic target. Public site route, responsive, quote, and UI matrix smoke are also green. The remaining risk is production-owner proof: preserved owner access on the managed production-like project still needs an owner-approved authenticated session and production-safe visual smoke before any final production-ready dashboard claim.

## What Changed

- Refreshed the public sitemap polish date to `2026-07-05`.
- Added source guard coverage for the refreshed sitemap date.
- Recorded dashboard-local and public-site verification evidence in this report.
- No production data was created, changed, or deleted.
- No payment, booking, invoice, SMS/WhatsApp, auto-send, AI-provider, auth-flow, RLS, or production migration work was opened.

## Dashboard Gate

Default `.env.local` still points `NEXT_PUBLIC_SUPABASE_URL` at managed Supabase, so mutating dashboard smoke remains blocked by default.

For this pass only, local process environment overrides pointed the app and smoke runner to local Supabase:

```text
NEXT_PUBLIC_APP_URL host: local (127.0.0.1)
NEXT_PUBLIC_SUPABASE_URL host: local (127.0.0.1)
DATABASE_URL host: local (127.0.0.1)
VERCEL_ENV production: no
```

Authenticated dense dashboard smoke:

```text
pnpm smoke:dashboard -- --base-url=http://127.0.0.1:3044 --fixture-profile=dense --timeout-ms=30000
PASS - 8/8 routes
```

Routes covered:

```text
/dashboard
/dashboard/leads
/dashboard/configuration
/dashboard/business-profile
/dashboard/quote-setup
/dashboard/settings
/dashboard/guide
/dashboard/leads/[synthetic-lead-id]
```

## Public Site Page Gate

Public route smoke:

```text
pnpm smoke:public -- --base-url=http://127.0.0.1:3044 --timeout-ms=30000
PASS - 14/14 routes
```

Responsive public smoke:

```text
pnpm smoke:responsive -- --base-url=http://127.0.0.1:3044 --timeout-ms=30000
PASS - 25/25 route/language checks
```

Quote route smoke:

```text
pnpm smoke:quote -- --base-url=http://127.0.0.1:3044 --active-slug=<synthetic-local-active-slug> --timeout-ms=30000
PASS - 1/1 active synthetic quote link
```

Final UI matrix smoke:

```text
pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3044 --timeout-ms=30000
PASS - 0 failures
```

Matrix coverage included:

- 11 viewport sizes from `320x568` through `1920x1080`
- light and dark themes
- English and fr-CA public pages
- canonical public routes
- auth noindex routes
- sitemap and robots checks
- optional quote fixtures skipped unless explicitly provided

## Current Dashboard Position

Local dashboard confidence is now high for source/build/local synthetic scope:

- Source guards pass.
- TypeScript passes.
- Build passes.
- Local authenticated dashboard smoke passes.
- Public site smoke passes after dashboard work.

Do not mark dashboard production-final yet:

- Managed owner-authenticated visual proof is not closed.
- Production-safe owner dashboard smoke still requires an approved owner session.
- Default `.env.local` correctly keeps mutating dashboard smoke blocked while pointed at managed Supabase.

## Next Safe Site Work

The public site is smoke-green. The next safe work should be selective page-level polish only:

- inspect first-fold visuals and CTA clarity on `/`, `/features`, `/industries/cleaning`, `/pricing`, `/pilot`, and `/demo`;
- keep all copy manual-first and cleaning-specific;
- avoid new features, fake proof, self-serve payment, booking, invoice, CRM, SMS/WhatsApp, or auto-send claims;
- keep every public change covered by route, responsive, quote, UI-matrix, lint, typecheck, unit, and build validation.

## Remaining Risks

- Owner production session is still required for final dashboard acceptance.
- Backup `E:\bizpilot-ai-backups\owner-only-cleanup-20260705021645` must remain retained.
- Local synthetic data created by dashboard smoke stays local only.
- No owner permission was given to run destructive cleanup, production mutations, or synthetic managed-Supabase smoke.
