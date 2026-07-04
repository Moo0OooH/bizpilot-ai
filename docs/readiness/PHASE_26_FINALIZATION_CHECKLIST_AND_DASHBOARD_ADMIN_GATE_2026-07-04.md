# Phase 26 - Finalization Checklist And Dashboard/Admin Gate

Date: 2026-07-04
Branch: `main`
Scope: safe repo-side finalization, local/synthetic dashboard and founder-admin
gate closure, and updated remaining-gap map.

## Purpose

Move the project from "dashboard smoke blocked by environment" to repeatable
local/synthetic dashboard and founder-admin route verification without opening
real customer data, paid pilot, production mutation, billing, messaging,
booking, team access, analytics sink, multi-vertical, or autonomous AI gates.

## Implemented In This Pass

- Confirmed local Supabase API was available on `http://127.0.0.1:54321`.
- Ran `pnpm check:dashboard-local` with local-only Supabase environment
  overrides and passed target classification.
- Ran dense authenticated dashboard smoke against the local app and local
  Supabase target.
- Extended `tests/smoke/dashboard-auth-smoke.mts` with an opt-in
  `--include-admin` mode.
- Added `--dashboard-smoke-email=<unique>@example.test` so founder/admin smoke
  can use an explicit synthetic founder allowlist email.
- Added founder/admin route targets:
  - `/founder`
  - `/admin?adminPanel=overview`
  - `/admin?adminPanel=users`
  - `/admin?adminPanel=businesses`
  - `/admin?adminPanel=leads`
  - `/admin?adminPanel=health`
  - `/admin?adminPanel=activity`
- Preserved local-only smoke protection:
  - production `VERCEL_ENV` remains blocked,
  - canonical production host remains blocked,
  - managed/non-local Supabase hosts remain blocked,
  - admin route smoke requires `@example.test` synthetic email,
  - admin route smoke requires the same email in `BIZPILOT_FOUNDER_EMAILS`.
- Added source guards in
  `tests/unit/dashboard-smoke-fixture-source.test.mts`.
- Pulled in the dashboard external benchmark audit and fixed its P0
  founder-admin metric honesty finding:
  - `AI Replies Sent` -> `Reply Traces`
  - `AI Replied` -> `Reply copied`
  - fake/hard-coded `Average Reply Time` -> `Response Time Tracking: Not enabled`
  - `Quote Link Sent Rate` -> `Active Link Coverage`
  - `Setup Conversion Rate` -> `Payment-Ready Workspaces`
  - misleading `Last 7 days`, `Leads This Month`, and `Export` copy replaced
    with current-snapshot wording.

## Verification Evidence

`pnpm check:dashboard-local` with local Supabase env override:

```text
PASS
NEXT_PUBLIC_APP_URL host: local (127.0.0.1)
NEXT_PUBLIC_SUPABASE_URL host: local (127.0.0.1)
DATABASE_URL host: local (127.0.0.1)
VERCEL_ENV production: no
```

Dense owner-dashboard smoke:

```text
pnpm smoke:dashboard -- --base-url=http://127.0.0.1:3042 --fixture-profile=dense --timeout-ms=30000
PASS - 7/7 routes
```

Dense owner-dashboard plus founder-admin smoke:

```text
pnpm smoke:dashboard -- --base-url=http://127.0.0.1:3042 --fixture-profile=dense --include-admin=true --dashboard-smoke-email=codex-founder-admin-20260704-phase26c@example.test --timeout-ms=30000
PASS - 14/14 routes
```

Routes covered:

```text
/dashboard
/dashboard/leads
/dashboard/configuration
/dashboard/business-profile
/dashboard/quote-setup
/dashboard/settings
/dashboard/leads/[syntheticLeadId]
/founder
/admin?adminPanel=overview
/admin?adminPanel=users
/admin?adminPanel=businesses
/admin?adminPanel=leads
/admin?adminPanel=health
/admin?adminPanel=activity
```

Unit/source guard verification:

```text
pnpm test:unit
PASS - 203/203 tests
```

## Checklist Movement

| Item | Previous state | Phase 26 state |
| --- | --- | --- |
| 49 admin seeded-data browser retest | Pending/local Supabase | Done at authenticated SSR route-smoke level with local synthetic founder |
| 50 owner empty/first-run browser retest | Pending/local Supabase | Owner routes smoke-tested with dense synthetic workspace; separate visual empty-state QA remains optional |
| 51 lead queue source/status clarity | Source-level advanced | Dense owner smoke passed, including lead queue route |
| 52 lead detail next-action hierarchy | Pending browser QA | Dense owner smoke passed for a synthetic lead detail route |
| 53 owner notes/history review | Pending after seeded QA | Source and route smoke passed; deeper UX review remains optional polish |
| 55 draft review/copy affordances | Pending browser QA | Owner route smoke passed; manual browser visual pass remains optional polish |
| 59 business-profile density | Pending browser QA | Authenticated route smoke passed |
| 60 Quote Setup ergonomics | Pending browser QA | Authenticated route smoke passed |
| 61 protected-route keyboard/focus audit | Pending | Still requires dedicated manual/browser focus QA; no Playwright/axe dependency is installed |
| 62 admin detail overflow | Pending browser QA | Founder-admin route smoke passed across all core panels |
| 63 admin activity dense/empty QA | Pending browser QA | Founder-admin activity route smoke passed |
| P0 admin metric honesty | Open in benchmark audit | Done; misleading sent-reply, fake response-time, and conversion labels removed |
| 66 dashboard screenshot matrix | Pending local QA | SSR route smoke done; screenshot matrix remains optional/manual without adding visual tooling |
| 67 dashboard smoke | Blocked/local Supabase | Done locally, 14/14 with admin included |
| 89 strict restored app/dashboard/RLS proof | Blocked before paid pilot | Still blocked for paid pilot; current proof is local current DB/app, not restored-app drill |
| 90 local DB/RLS verification | Done in Phase 25Y | Preserved, 13/13 RLS files passed in Phase 25Y |

## Current Finalization Status

Public site, SEO, public quote intake, GTM packet, trust/security copy,
reply-speed content, demo visuals, Settings guide details, lead queue
pagination, local DB/RLS, and local authenticated owner/admin route smoke are
now covered by repo evidence.

This is still not a real-customer-data or paid-pilot approval. The product is
ready for founder-controlled synthetic/local validation and owner review, with
the remaining gates below.

## Remaining Gated Items

| Gate | Status | Required before opening |
| --- | --- | --- |
| Real customer data | Blocked | Explicit Phase 24G owner approval and final no-secret production smoke decision |
| Paid pilot | Blocked | Support/payment/refund/rollback/restored-app gate evidence |
| Production mutations/migrations | Blocked | Explicit owner approval plus backup/export/restore posture |
| Strict restored app/dashboard/RLS proof | Blocked before paid pilot/risky production work | Disposable restored target plus app/dashboard/RLS recheck |
| First-party analytics sink | Blocked | Owner-approved no-PII analytics destination and rollback plan |
| Customer email automation | Future-blocked | Feature entitlement, provider posture, consent, logs, smoke, and rollback |
| SMS/WhatsApp/Instagram automation | Future-blocked | Separate provider/API, consent, entitlement, cost, and safety gates |
| Booking/invoices/payments automation | Future-blocked | Separate billing/legal/provider/product gates |
| Team access/owner invites | Future-blocked | A2 owner-approved security/RLS gate |
| Multi-vertical expansion | Future-blocked | Cleaning validation evidence first |
| Autonomous AI/operator behavior | Future-blocked | Not part of the current manual-first product |

## Operator Notes

- The local `.env.local` still points public Supabase config at a managed
  project by default. For mutating smoke, run with explicit local environment
  overrides.
- `supabase status` reported a local environment-file parse issue before this
  pass. The file was not modified because it may contain private owner secrets.
- No secrets were printed in the smoke output or readiness evidence.
- The existing untracked `.codex-screenshots/` directory remains local output
  and should not be staged.

## Decision

Dashboard/admin local smoke is no longer blocked when local Supabase is
available and explicit local env overrides are used. The next useful work is
either manual/browser visual focus QA or owner approval decisions for the
remaining real-data and paid-pilot gates. Do not open those gates implicitly.
