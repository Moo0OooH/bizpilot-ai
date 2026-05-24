# Phase 21I Dashboard i18n Systemization

**Project:** BizPilot AI  
**Date:** 2026-05-24  
**Status:** Local/repo-backed, verified, not pushed/deployed

---

## Decision

The protected dashboard now treats `businesses.preferred_language` as the source of truth for authenticated workspace UI. The interface cookie remains a fallback for pre-auth/no-workspace states and is still updated when the owner changes language, but stale per-device cookies no longer override the workspace language after sign-in.

This fixes the observed PC/device drift where one dashboard surface could render English while another rendered French.

## Implemented

- Added `resolveWorkspaceInterfaceLanguage(...)` in `lib/i18n/language.ts`.
- Updated authenticated dashboard routes to resolve language business-first.
- Moved visible dashboard copy into `lib/i18n/bizpilot-copy.ts` for:
  - dashboard shell blocked-workspace state,
  - dashboard overview,
  - lead recovery queue,
  - leads right rail,
  - configuration tabs and panels,
  - business profile,
  - settings lifecycle/deletion copy.
- Kept client shell copy serializable so no function-based dictionary entries are passed into Client Components.
- Added readiness `taskKey` exposure so setup checklist labels can be localized from dictionary copy instead of service-produced English labels.
- Localized the workspace deletion request form through props from settings copy.

## Regression Tests Added

`tests/unit/i18n-copy.test.mts` now verifies:

- workspace language wins over stale interface cookie for authenticated dashboard language resolution,
- localized user-facing source files are free from common mojibake artifacts,
- dashboard routes/components do not reintroduce local `fr-CA` conditional branches,
- every supported language stays structurally synced with the source copy.

## Validation

Passed:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:unit` (`45/45`)
- `pnpm build`
- `pnpm verify`

Browser QA:

- Started fresh local dev server on `http://localhost:3000`.
- Verified `/dashboard`, `/dashboard/configuration`, and `/dashboard/leads` render locally.
- Checked mobile-width viewport around `486px`: no horizontal overflow on the tested dashboard routes.
- Checked browser console on the tested route after the serialization fix: no current console errors.

## Production / Deployment

No push to `main`.
No Vercel deployment.
No production SQL was applied for this i18n/dashboard work.

## Follow-Up

Before adding more languages:

1. Add each new language to `languageDefinitions`.
2. Add the full `BizPilotCopy`, homepage copy, and pricing copy dictionaries.
3. Run `pnpm test:unit`; shape tests must fail until the language is complete.
4. Run `pnpm verify`.
5. Run browser QA on dashboard overview, leads, configuration, business profile, settings, public quote, and pricing.

