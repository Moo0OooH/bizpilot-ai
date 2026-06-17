# BizPilot AI - RLS Test Runner

**Phase:** 10D+
**Status:** Active
**Owner:** MoOoH
**Last Updated:** 2026-06-17
**Related:**
- `docs/security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md`
- `docs/engineering/BIZPILOT_BACKEND_DATABASE_RLS_STANDARD_v1.5.md`
- `docs/architecture/BIZPILOT_VENDOR_INDEPENDENCE_AND_PORTABILITY_STANDARD_v1.0.md`
- `supabase/migrations/`

---

## What this runs

Every `tests/rls/*.test.sql` file is executed in lexicographic order against a local Postgres. Each test file:

- opens its own `begin`,
- inserts fixtures into `auth.users`, switches roles via `set local role`, and asserts behavior with `raise exception`,
- ends with `rollback` so nothing persists.

A single uncaught exception in any test file is treated as a runner failure and the process exits with code `1`.

The runner is local-only by design. It refuses any `DATABASE_URL` whose host is not `localhost`, `127.0.0.1`, `::1`, or `host.docker.internal`, and explicitly rejects managed Supabase URLs (`*.supabase.co`, `*.supabase.in`).

---

## Prerequisites

1. Node.js 24 and pnpm 10.18.3. Use `.nvmrc` or another local runtime manager to match the repository runtime.
2. `pnpm install` has been run so `pg` is available.
3. A local Postgres instance is running. Two supported paths:
   - Local Supabase: `npx supabase start` produces a Postgres on `localhost:54322` with the `auth` schema preinstalled.
   - Standalone Postgres: any Postgres 15+ with the migrations from `supabase/migrations/` applied in order, plus the `auth` schema and roles (`anon`, `authenticated`, `service_role`) created by Supabase tooling. The easier path is local Supabase.
4. The migrations in `supabase/migrations/` have been applied against that database in order.
5. `DATABASE_URL` points to a local database only. `.env.example` includes the local Supabase example URL.

---

## Run

PowerShell:

```powershell
$env:DATABASE_URL = "postgresql://postgres:postgres@127.0.0.1:54322/postgres"
pnpm test:rls
```

Bash:

```bash
export DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
pnpm test:rls
```

After the local database is ready, the database-aware verification wrapper is:

```bash
pnpm verify:local-db
```

Expected output on a healthy database:

```text
BizPilot RLS test runner - found <n> test files
Target: postgresql://postgres:***@127.0.0.1:54322/postgres

  auth-tenant-foundation.test.sql ... pass (123ms)
  ...

Results: <n> passed, 0 failed (<n> total)
```

If any test fails, the line shows `FAIL` and the runner prints the Postgres error message before exiting with code `1`.

---

## Safety rules

The runner refuses to start when:

- `DATABASE_URL` is missing or empty.
- `DATABASE_URL` is not a valid URL.
- The host is not in the local allow-list.
- The host ends with `.supabase.co` or `.supabase.in`.

These checks exist because every test file inserts directly into `auth.users` and switches between Postgres roles. Running against production would mutate the `auth` schema. The runner is not a substitute for production verification.

---

## Adding a new test

1. Create `tests/rls/<feature>.test.sql` following the existing file template: header comment, `begin`, fixtures, role-switched assertions, and `rollback`.
2. Use stable UUIDs in fixture inserts so failures are deterministic.
3. Use `set local role authenticated` / `set local role anon` and `select set_config('request.jwt.claim.sub', '<user-uuid>', true)` to simulate roles.
4. Wrap every assertion in `do $$ ... raise exception 'human-readable failure description' ... $$;`.
5. End with `rollback` so the database returns to its pre-test state.
6. Run `pnpm test:rls` locally before opening a PR.

---

## Known limitations

- The runner does not reset the database between test files. Each test file is responsible for its own `begin/rollback` cleanup. If a test file forgets to roll back, subsequent tests will see leaked data.
- The runner connects as a single privileged user (`postgres` in local Supabase). Role switching is simulated inside transactions via `set local role`, which matches how Supabase evaluates RLS in the Data API.
- The runner does not support pgTAP. The current test files use plain `raise exception` assertions.
- The runner does not start or stop the database. Bring up local Supabase yourself before running the tests.
