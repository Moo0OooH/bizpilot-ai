# P9 Language Isolation Audit And Fix Report

Date: 2026-06-26
Repo: `E:\bizpilot-ai`
Scope: public/D1 language isolation audit and safe copy fix

## Decision

```text
P9 language isolation fix is safe and in scope.
No backend, database, RLS, auth, AI provider, billing, or production data-flow
changes were made.
```

## What Was Audited

- Dashboard route group copy usage.
- D1 dashboard visible labels in EN/fr-CA.
- Error boundary and fallback UI.
- Admin/founder console copy boundaries.
- Existing i18n tests and source guards.

## Issue Found

`app/(dashboard)/dashboard/error.tsx` had hardcoded English visible copy:

```text
Dashboard
This workspace needs a refresh.
BizPilot caught a safe dashboard error...
Reload dashboard
```

This was user-facing inside the protected dashboard route group, so it should
use the EN/fr-CA copy dictionary.

## Fix Applied

Files changed:

```text
app/(dashboard)/dashboard/error.tsx
lib/i18n/bizpilot-copy.ts
tests/unit/i18n-copy.test.mts
```

Implementation:

- Added `dashboard.errorBoundary` copy to EN and fr-CA.
- Updated the dashboard error boundary to read
  `getBizPilotCopy(language).dashboard.errorBoundary`.
- Read the active document language through `document.documentElement.lang`.
- Added unit guards so hardcoded English error-boundary labels do not return.

## Intentional Exceptions

These are not P9 defects:

- `BizPilot` brand text.
- Technical filenames, test names, code comments, route names, and internal IDs.
- Synthetic test fixture names.
- Internal admin/founder console copy, which remains a separate A1 audit/spec
  item before any broader localization or access-management work.

## Safety Boundary

No changes were made to:

```text
supabase/migrations/**
types/database.ts
lib/supabase/**
server/actions/**
server/repositories/**
server/services/**
billing/payment code
AI provider configuration
production data flow
```

## Verification

Initial verification after the fix:

```text
pnpm test:unit
```

Result: PASS, 139/139 tests.

Full project verification is recorded in
`docs/readiness/POST_P8_D1_RELEASE_HYGIENE_AND_NEXT_GATES_2026-06-26.md`.

## Remaining Watchpoints

- Admin/founder remains internal and English-first until A1 defines a safe
  access-management and localization path.
- Dashboard synthetic smoke must run only against confirmed local/synthetic
  Supabase targets.
- Real data and paid pilot remain blocked.
