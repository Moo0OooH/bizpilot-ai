# Phase 21P - No-Cost Readiness Hardening

**Project:** BizPilot AI
**Date:** 2026-05-25
**Status:** Local and production public smoke passed; full validation passed
**Scope:** Repeatable smoke tooling, backup/export planning, SMTP planning, and docs alignment

---

## 1. Purpose

This pass continues Phase 21 after the public trust page deployment by turning
the remaining safe gaps into repeatable tools and operational decisions.

No production SQL, real customer data, secrets, paid upgrades, or hidden
automation are introduced by this pass.

## 2. Implemented In This Pass

- Added `pnpm smoke:public` for repeatable public-route smoke checks.
- Added `pnpm smoke:quote` for approved synthetic public quote-link route
  checks without secrets, SQL, or real data.
- Added backup/export/restore decision matrix:
  `docs/operations/BIZPILOT_BACKUP_EXPORT_RESTORE_DECISION_MATRIX_v1.0.md`.
- Added Auth email/custom SMTP integration plan:
  `docs/operations/BIZPILOT_AUTH_EMAIL_SMTP_INTEGRATION_PLAN_v1.0.md`.
- Added a small homepage UX polish: the main header now links directly to the
  interactive cleaning demo through centralized EN/fr-CA navigation copy.
- Added `tests/unit/source-integrity.test.mts` after a local homepage
  cherry-pick attempt exposed corrupt source bytes and a truncated component.
  The guard scans executable source under `app`, `components`, `lib`, `server`,
  and `tests` for NUL bytes and unsafe control characters before build.
- Updated readiness/operations docs to keep synthetic-only vs real-customer
  gates explicit.

## 3. Public Smoke Coverage

The smoke runner checks only safe public surfaces:

- `/`
- `/pricing`
- `/privacy`
- `/security`
- `/terms`
- `/auth/sign-in`
- `/auth/sign-up`
- `/auth/forgot-password`
- `/auth/reset-password`

Usage:

```bash
pnpm smoke:public
BIZPILOT_SMOKE_BASE_URL=https://bizpilo.com pnpm smoke:public
pnpm smoke:public -- --base-url=https://bizpilo.com
```

The script does not create accounts, submit quote data, inspect secrets, or
touch production SQL.

## 4.1 Quote Route Smoke Coverage

The quote route runner checks only owner-approved synthetic links:

- active quote link loads the public form,
- inactive or unavailable quote link renders the safe unavailable state,
- optional fr-CA quote link renders French Canadian quote copy,
- raw/internal database, env, service-role, and framework error markers are not
  exposed in the response body.

Usage:

```bash
pnpm smoke:quote -- --active-slug=<approved-synthetic-active-slug>
pnpm smoke:quote -- --base-url=https://bizpilo.com --active-slug=<approved-synthetic-active-slug> --inactive-slug=<approved-inactive-slug> --fr-slug=<approved-fr-ca-slug>
```

The script does not create accounts, submit quote data, inspect secrets, or
touch production SQL. Full lead creation, dashboard visibility, and
horizontal-access smokes still require founder-approved synthetic owner
sessions and manual/browser execution.

## 4. Current Real-Pilot Blockers After This Pass

- production public quote security smoke with synthetic lead,
- fr-CA production quote smoke,
- stable custom SMTP/signup/reset-password smoke,
- OpenAI production key/output validation,
- backup/export/restore drill or approved Supabase upgrade path,
- founder-authorized live admin QA,
- production `0020` only if fake/test auth deletion is still needed and safety
  posture is accepted.

## 5. Validation

Validation completed on 2026-05-25:

```text
pnpm smoke:public: pass locally against http://127.0.0.1:3000, 9/9 routes
pnpm smoke:public -- --base-url=https://bizpilo.com: pass, 9/9 routes
pnpm verify: pass
pnpm test:unit: pass, 59/59 after source-integrity guard
pnpm build: pass
pnpm test:rls: pass, 13/13 through a temporary local-only 127.0.0.1:55432 Docker proxy
git diff --check: pass, CRLF warnings only
changed-file secret scan: no secret values found; matches were env-name references and one false-positive text match on "permitted" in docs
```

The temporary RLS proxy was removed after the run.

Post-push production evidence:

```text
Commit 68dba3e was pushed to origin/main and origin/phase-21-production-alignment.
https://bizpilo.com/ rendered the new header Demo navigation marker for /#cleaning-demo.
pnpm smoke:public -- --base-url=https://bizpilo.com passed after the marker appeared, 9/9 routes.
```

Continuation validation on 2026-05-25:

```text
Local main was safely synced to origin/main at 6263ecb after preserving stale local work on a backup branch and stash.
origin/main and origin/phase-21-production-alignment are aligned at 6263ecb.
pnpm test:unit: pass, 59/59
pnpm lint: pass
pnpm typecheck: pass
pnpm build: pass
pnpm smoke:public -- --base-url=https://bizpilo.com: pass, 9/9 routes
```

Data-bearing production quote security, fr-CA, and horizontal-access smokes
remain pending because they require approved synthetic owner sessions,
synthetic workspace/link setup, and a cleanup/retain-evidence decision.

## 6. Current Decision

```text
BizPilot remains ready only for founder-controlled synthetic demos.
This pass improves repeatability and operational clarity, but does not approve
real customer data, payment collection, production SQL, or paid infrastructure.
```
