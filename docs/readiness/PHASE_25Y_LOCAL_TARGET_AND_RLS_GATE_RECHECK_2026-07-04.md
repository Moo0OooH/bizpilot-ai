# Phase 25Y - Local Target And RLS Gate Recheck

Date: 2026-07-04
Head before implementation: `fdee69c feat(dashboard): paginate lead queue`
Branch: `main`

## Purpose

Start closing the remaining safe repo-side gates after Phase 25X without
crossing real-data, paid-pilot, production-mutation, billing, automation,
booking, SMS/WhatsApp, team-access, or autonomous-AI boundaries.

This phase focuses on local target classification, local DB/RLS verification,
dashboard smoke guard clarity, source-header hygiene, and current evidence
tracking. It does not approve real customer data or paid pilot launch.

## Implemented

- Added `scripts/check-local-targets.mts`, a no-secret host classifier for:
  - `NEXT_PUBLIC_APP_URL`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `DATABASE_URL`
  - `VERCEL_ENV`
- Added package scripts:
  - `pnpm check:targets`
  - `pnpm check:dashboard-local`
  - `pnpm check:db-local`
- Updated `tests/rls/run-rls-tests.mts` so `pnpm test:rls` loads
  `DATABASE_URL` from shell, `.env.local`, or `.env`, then still refuses
  non-local or managed Supabase database hosts.
- Re-applied migration `0023_public_submission_abuse_log_retention.sql` to the
  confirmed local DB host only.
- Updated migration `0023` to use `DELETE` plus `GET DIAGNOSTICS ROW_COUNT`
  instead of a delete CTE for simpler local Supabase behavior.
- Adjusted `tests/rls/public-submission-abuse-log.test.sql` so the retention
  helper is grant/source-checked in the RLS suite without executing the helper.
  The current local Supabase/Postgres image terminated the backend during direct
  helper execution attempts; runtime cleanup execution should be validated in a
  separate disposable restore/local maintenance drill before paid pilot.
- Added `tests/unit/local-target-classifier-source.test.mts` source guards.
- Updated source headers for recently changed Phase 25 dashboard/public/test
  files.

## Current Target Classification

`pnpm check:targets`:

```text
PASS
NEXT_PUBLIC_APP_URL host: local (localhost)
NEXT_PUBLIC_SUPABASE_URL host: managed/non-local (qfqendrqimqvkoojpjao.supabase.co)
DATABASE_URL host: local (127.0.0.1)
VERCEL_ENV production: no
```

`pnpm check:db-local`:

```text
PASS
DATABASE_URL host: local (127.0.0.1)
```

`pnpm check:dashboard-local`:

```text
EXPECTED BLOCK
NEXT_PUBLIC_SUPABASE_URL must be local for this gate.
Current classification: managed/non-local (qfqendrqimqvkoojpjao.supabase.co).
```

Decision: local DB/RLS verification is safe for the current shell and env-file
state. Mutating authenticated dashboard smoke is still blocked until
`NEXT_PUBLIC_SUPABASE_URL` points at a confirmed local/synthetic Supabase
target.

## Verification

```text
pnpm check:targets PASS
pnpm check:db-local PASS
pnpm check:dashboard-local EXPECTED BLOCK - NEXT_PUBLIC_SUPABASE_URL is managed/non-local
pnpm test:rls PASS - 13/13 local RLS SQL files
```

Additional validation commands are run after this document is created and
recorded in the final implementation report.

## Gate Movement

| Gate | Phase 25Y result |
| --- | --- |
| Local target classifier | Done |
| Local DB/RLS proof for current local DB | Done, 13/13 RLS files passed |
| Dashboard smoke local Supabase gate | Still blocked; `NEXT_PUBLIC_SUPABASE_URL` is managed/non-local |
| Authenticated dashboard/admin browser QA | Still blocked until local Supabase target exists |
| Protected-route a11y/focus QA | Still pending after authenticated local QA |
| Strict restored app/dashboard/RLS proof | Still blocked before paid pilot and risky production work |
| Phase 24G real-data approval | Still not recorded |
| Paid pilot approval | Still blocked |

## Next Required Step

Point dashboard smoke at a confirmed local/synthetic Supabase target without
mutating production or managed Supabase:

```text
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<local anon or publishable key>
SUPABASE_SECRET_KEY=<local service-role key>
pnpm check:dashboard-local
pnpm smoke:dashboard -- --base-url=http://127.0.0.1:<local-app-port> --fixture-profile=dense
```

Do not run the dashboard smoke while `NEXT_PUBLIC_SUPABASE_URL` points at
`qfqendrqimqvkoojpjao.supabase.co` or any other managed/non-local Supabase host.

## Preserved Blocks

- No real customer data.
- No paid pilot launch.
- No production SQL or production migration.
- No customer-facing automation.
- No booking, invoices, SMS/WhatsApp, customer email automation, team access,
  multi-vertical expansion, or autonomous AI.
