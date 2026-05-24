# Phase 20D Local RLS Test Result

**Project:** BizPilot AI
**Document Type:** Local RLS verification result
**Status:** Pass
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Purpose

Phase 20D verifies that the local RLS suite can run against a local Supabase/Postgres target without connecting to production.

No production database was used. No production credentials were used. No customer data was printed.

## 2. RLS Test Setup Inspected

| Item | Result |
| --- | --- |
| `package.json` script | `pnpm test:rls` runs `node --experimental-strip-types tests/rls/run-rls-tests.mts`. |
| Runner safety | The runner refuses missing `DATABASE_URL`, non-local hosts, and managed Supabase hosts such as `*.supabase.co`. |
| Expected local URL | Local Supabase/Postgres on `localhost` or `127.0.0.1`; examples use port `54322`. |
| Test files discovered by runner | 12 `tests/rls/*.test.sql` files. |
| Supabase local config | No `supabase/config.toml` is present in this repo checkout. |
| Local dependency | Docker-backed local Supabase containers are present. |

## 3. Local Service Checks

| Check | Result |
| --- | --- |
| `supabase status` | Not available because `supabase` CLI is not installed on PATH. |
| `docker ps` | Local Supabase containers are running for `bizpilot-ai`. |
| Local DB container | `supabase_db_bizpilot-ai` is running and healthy. |
| DB container readiness | `docker exec supabase_db_bizpilot-ai pg_isready -U postgres` returned accepting connections. |
| Host port `127.0.0.1:54322` | Not available; connection refused. |
| Host port `127.0.0.1:15432` before proxy | Not available; connection refused. |
| Docker port publishing | DB container exposes `5432/tcp` internally but has no published host port. |

## 4. Temporary Local Proxy

Because Docker Desktop did not publish the local Supabase DB to the Windows host, Phase 20D used the same safe pattern recorded in earlier Phase 18 docs: a temporary Docker TCP proxy on a local-only host port.

Proxy command shape:

```powershell
docker run -d --name bizpilot_rls_pg_proxy `
  --network supabase_network_bizpilot-ai `
  -p 15432:5432 `
  alpine/socat `
  TCP-LISTEN:5432,fork,reuseaddr TCP:supabase_db_bizpilot-ai:5432
```

The proxy was removed immediately after the test:

```powershell
docker rm -f bizpilot_rls_pg_proxy
```

Post-cleanup verification showed no running proxy container and `127.0.0.1:15432` was closed again.

## 5. Command Run

The RLS suite was run against a local-only target:

```powershell
# DATABASE_URL was set to a local-only Postgres target on 127.0.0.1:15432.
# The local password is intentionally omitted from this document.
pnpm test:rls
```

The actual test target was local `127.0.0.1`, which satisfies the runner's local-only safety check.

## 6. Result

**Pass.**

```text
BizPilot RLS test runner - found 12 test files
Target: local Postgres on 127.0.0.1:15432, password omitted

ai-output-tenant-isolation.test.sql ... pass
anon-select-policies-d1-d2.test.sql ... pass
auth-tenant-foundation.test.sql ... pass
business-access-plan-admin-log.test.sql ... pass
business-template-configuration.test.sql ... pass
inactive-public-link-blocks-anon.test.sql ... pass
lead-conversion-desk.test.sql ... pass
public-intake-and-leads.test.sql ... pass
public-intake-submission-values-hardening.test.sql ... pass
public-submission-abuse-log.test.sql ... pass
rls-helper-functions.test.sql ... pass
usage-events-tenant-isolation.test.sql ... pass

Results: 12 passed, 0 failed (12 total)
```

## 7. Failure Reason

No RLS policy failure occurred.

The previous failure reason was environment-only:

```text
Configured local Postgres target at 127.0.0.1:54322 refused connection because the Docker DB container was running without a published host port.
```

## 8. Patches Made

No RLS policy, migration, service, repository, or application code was changed.

Documentation patch:

- created `docs/readiness/PHASE_20D_LOCAL_RLS_TEST_RESULT.md`.

## 9. Remaining Blocker

There is no current RLS correctness blocker.

Operational note: future local RLS runs need one of these:

1. local Supabase DB published on `127.0.0.1:54322`,
2. the temporary `alpine/socat` Docker proxy on `127.0.0.1:15432`,
3. another local-only Postgres target allowed by `tests/rls/run-rls-tests.mts`.

Do not point `pnpm test:rls` at production. The runner is intentionally local-only because the SQL tests insert fixtures into `auth.users` and switch Postgres roles.
