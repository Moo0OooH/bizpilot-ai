# Phase 25G - Dashboard Smoke Local-Only Guard

Date: 2026-07-04
Repo: `E:\bizpilot-ai`
Branch: `main`

## Decision

Close the P0 safety gap between documentation and code: the mutating
authenticated dashboard smoke now requires a local Supabase target by default.

`pnpm smoke:dashboard` creates synthetic auth users, businesses, quote links,
submissions, leads, and source metadata. That is useful for dashboard QA, but it
must not run against production, canonical production Supabase, or managed
non-local Supabase projects.

## What Changed

- Added URL parsing for `NEXT_PUBLIC_SUPABASE_URL` inside
  `tests/smoke/dashboard-auth-smoke.mts`.
- Added a local-host allowlist:
  - `localhost`
  - `127.0.0.1`
  - `::1`
  - `host.docker.internal`
  - `*.localhost`
- Added a fail-fast blocked signal for managed/non-local Supabase hosts.
- Updated the dashboard smoke error from "production-prohibited" to
  "local-only" so the runtime behavior matches the Phase 25 backlog.
- Updated source guards to lock the local-only behavior.
- Updated the change evidence protocol so future handoffs do not describe the
  mutating smoke as preview-safe.

## Product Boundary

This does not approve real customer data, production synthetic writes, paid
pilot launch, production migrations, destructive cleanup, auth/RLS changes, or
customer automation. It only hardens the local synthetic dashboard QA command.

## Backlog Items Advanced

```text
8 done
9 reinforced
48 safer
66 safer
67 safer
74 preserved
89 preserved
90 preserved
```

## Verification

```text
git diff --check PASS
pnpm test:unit PASS
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
pnpm smoke:dashboard -- --base-url=http://127.0.0.1:3030 --fixture-profile=dense EXPECTED BLOCK PASS
```

The dashboard smoke guard was executed against the current `.env.local`
Supabase URL and blocked before synthetic data creation. The blocked signals
included:

```text
NEXT_PUBLIC_SUPABASE_URL contains qfqendrqimqvkoojpjao
NEXT_PUBLIC_SUPABASE_URL is managed/non-local (qfqendrqimqvkoojpjao.supabase.co)
```
