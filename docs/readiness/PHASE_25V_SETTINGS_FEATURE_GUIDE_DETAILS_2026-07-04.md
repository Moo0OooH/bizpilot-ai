# Phase 25V - Settings Feature Guide Details

Date: 2026-07-04

## Scope

Phase 25V improves dashboard Settings clarity without running mutating
dashboard smoke or authenticated browser QA against the current Supabase target.
The change is source-level only: Settings now exposes the already-localized
feature guide details in collapsed panels so owners/founders can understand
activation, setup, visual guide, text guide, and owner/admin guide requirements.

This phase did not enable any blocked feature, provider, analytics sink,
booking, payment, messaging, team access, real customer data, or paid pilot.

## Implemented

- Added localized EN/fr-CA labels for feature guide details:
  activation, setup, visual guide, text guide, and owner/admin guide.
- Rendered collapsed guide-detail panels inside each Settings feature registry
  card.
- Kept feature cards scan-friendly by preserving the existing state, level,
  owner authority, and guide status badges.
- Added source guards proving Settings renders guide details and does not
  mutate feature states.

## Product Truth Preserved

- Feature registry states remain the source of truth.
- Planned, setup-required, and blocked features remain non-enabled.
- SMS/WhatsApp, booking, invoices/payments, team access, contact lists, and
  analytics remain behind their documented gates.
- AI remains owner-reviewed and founder/owner-controlled.
- Dashboard smoke remains local-Supabase-only before synthetic writes.
- Real customer data and paid pilot gates remain blocked.

## QA Boundary

Authenticated dashboard browser QA was not run in this phase because the current
environment still must not run mutating synthetic dashboard smoke against a
managed/non-local Supabase project. The source-level Settings improvement is
covered by unit/source tests, typecheck, lint, and production build.

## Backlog Items Advanced

```text
7 reinforced - feature registry remains honest and state-driven
58 done - Settings now explains guide details for feature registry states
61 prepared - collapsed guide details improve keyboard-readable source structure
66 preserved - authenticated dashboard screenshot matrix still waits for local QA
67 preserved - dashboard smoke still waits for confirmed local Supabase
77 preserved - no analytics sink enabled
89 preserved as paid-pilot blocker
90 preserved; no local RLS/database proof was claimed
93 preserved
94 preserved
95 preserved
96 preserved
97 preserved
98 preserved
99 preserved
100 preserved
```

## Verification

```text
git diff --check PASS
pnpm test:unit PASS - 199 tests
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
```

## Next Recommended Slice

The next dashboard phase should either:

```text
1. point the environment at a confirmed local/synthetic Supabase target, then run dashboard/admin smoke and browser QA; or
2. continue only non-mutating source-level a11y/readiness work if no local target is available.
```
