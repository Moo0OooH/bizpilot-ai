# Phase 21Q - Current Execution Starter

**Project:** BizPilot AI
**Document Type:** Next-tab/current-execution starter
**Status:** Start from this file before continuing Phase 21 readiness closure
**Owner:** MoOoH
**Last Updated:** 2026-05-25

---

## 1. Read This First

Use this document to start any new Codex tab or continuation session.

Read these docs before making changes:

1. `docs/readiness/PHASE_21Q_CURRENT_EXECUTION_STARTER.md`
2. `docs/readiness/PHASE_21_NEXT_TAB_HANDOFF.md`
3. `docs/readiness/PHASE_21M_CONSOLIDATED_STATUS_AND_SERVICE_CAPABILITIES.md`
4. `docs/readiness/PHASE_21P_NO_COST_READINESS_HARDENING.md`
5. `docs/readiness/PHASE_21N_SYNTHETIC_PRODUCTION_SMOKE_PLAN.md`
6. `docs/readiness/PHASE_21G_OPENAI_REAL_KEY_VALIDATION.md`
7. `docs/operations/BIZPILOT_PRODUCTION_QA_CHECKLIST_v1.0.md`
8. `docs/operations/BIZPILOT_AUTH_EMAIL_SMTP_INTEGRATION_PLAN_v1.0.md`
9. `docs/operations/BIZPILOT_BACKUP_EXPORT_RESTORE_DECISION_MATRIX_v1.0.md`
10. `docs/readiness/PHASE_21R_PRODUCTION_HORIZONTAL_ACCESS_SMOKE.md`
11. `docs/readiness/PHASE_21S_ADMIN_VISUAL_QA_CHECKLIST.md`

## 2. Current Baseline

The older pasted baseline mentioning `9dbc758` is stale for branch position.
The current verified baseline is:

```text
Repo: E:\bizpilot-ai
Current branch: main
Latest validated continuation baseline before this note: 0b89880 docs: prepare phase 21q readiness continuation
origin/main at validation: 0b89880
origin/phase-21-production-alignment at validation: 0b89880
Current branch tip may be a newer documentation-only evidence follow-up; run git log -1 --oneline.
Production: https://bizpilo.com is live
```

Recent continuation commits after `2c16362` include:

```text
6263ecb feat(admin): sharpen founder user controls
44f18e6 docs: record phase 21p continuation sync
f1c5346 test: add synthetic quote route smoke
0b89880 docs: prepare phase 21q readiness continuation
```

## 3. Product Truth

```text
BizPilot is production-live and synthetic-demo-ready.
BizPilot is not real-pilot-ready.
No real customer data is approved.
No paid pilot is approved.
```

Current product scope remains:

```text
Cleaning-first Quote Recovery / Lead Recovery Command Center.
```

Do not expand into booking, invoices, calendar sync, SMS, WhatsApp, Instagram
API, AI auto-send, marketplace, full CRM replacement, mobile app, or
multi-industry packs.

## 4. Current Owner Approval

The owner approved continuing all practical readiness work that can be done
from the current environment and access.

Treat this as approval for:

- git baseline verification and safe sync,
- repo/docs/tests/QA improvements,
- local validation,
- public production route smoke,
- synthetic quote-route smoke tooling,
- synthetic production readiness planning,
- non-destructive production verification that does not expose secrets,
- preparation of quote security, fr-CA, horizontal-access, admin QA, SMTP, and
  backup/restore evidence docs.

This approval does not mean:

- print, pull, or commit secrets,
- commit env files, dumps, customer data, or provider credentials,
- use real customer data,
- start a paid pilot,
- run destructive cleanup,
- execute fake/test auth deletion,
- weaken RLS,
- add `leads.source`,
- blindly re-apply `0018`,
- apply production SQL without a specific safety reason and explicit migration
  path,
- resume OpenAI debugging while the owner-side support ticket remains the
  active blocker.

## 5. Database And Schema Rules

```text
Use leads.source_channel.
Do not add leads.source.
Do not blindly re-apply 0018.
Treat 0018 as object-verified/manual drift in production.
Treat 0019 as production-applied and verified.
Treat 0020 as repo/local verified only, not production-applied.
Do not weaken RLS.
```

## 6. OpenAI Status

OpenAI remains paused.

Production reaches the OpenAI provider, but the provider/account returns:

```text
HTTP 429 / insufficient_quota / ai_provider_quota_exceeded
```

The owner has an OpenAI support ticket open. Do not keep debugging OpenAI or
run repeated provider tests until the owner confirms the account/provider issue
is resolved. Never print or pull the OpenAI key.

## 7. What To Do First In A New Tab

Run:

```bash
git status --short --branch
git log -1 --oneline
git rev-parse --short HEAD
git rev-parse --short origin/main
git rev-parse --short origin/phase-21-production-alignment
pnpm verify
pnpm smoke:public -- --base-url=https://bizpilo.com
```

If a local server is needed for local route smoke, start it temporarily and run:

```bash
pnpm smoke:public
```

Stop the local server after the smoke.

## 8. Next Practical Work

Continue in this order:

1. Keep docs aligned to the real baseline.
2. Run local and production validation.
3. Prepare/run `pnpm smoke:quote` only when an approved synthetic quote slug is
   available.
4. Continue Phase 21E production public quote security once an active synthetic
   slug/session is available.
5. Continue Phase 21F fr-CA quote smoke once an active fr-CA synthetic
   slug/session is available.
6. Run Phase 21R production horizontal-access smoke once two synthetic owner
   sessions/businesses/leads are available.
7. Use Phase 21S for owner-run live admin visual QA.
8. Leave SMTP DNS/provider setup, backup path choice, and OpenAI provider-ticket
   resolution as owner-side actions unless the owner supplies the needed
   non-secret decisions.

## 9. Output Expected From Continuation

Report:

- current branch,
- HEAD,
- `origin/main`,
- `origin/phase-21-production-alignment`,
- working tree status,
- validation results,
- production public smoke status,
- any new docs/tests/tooling,
- commit/push status,
- exact remaining owner actions before real data.

## 10. Latest Validation

2026-05-25 continuation validation after `f1c5346`:

```text
pnpm verify: pass
pnpm test:unit within verify: pass, 59/59
pnpm smoke:public -- --base-url=http://127.0.0.1:3000: pass, 9/9
pnpm smoke:public -- --base-url=https://bizpilo.com: pass, 9/9
pnpm smoke:quote -- --base-url=https://bizpilo.com --inactive-slug=phase-21-synthetic-unavailable-check: pass, 1/1
pnpm test:rls: not run because DATABASE_URL is not set in the current shell
```

RLS note: previous Phase 21 evidence records a local RLS pass through a
temporary local-only proxy. In the current shell, the RLS runner stops before
connecting because `DATABASE_URL` is absent. Treat that as an environment setup
blocker, not an application regression.
