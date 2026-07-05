# Phase 26A - Owner Dashboard Guide And Queue Finalization

Date: 2026-07-04
Branch: `main`
Scope: protected owner dashboard navigation, operating guide, manual queue
clarity, source guards, and final local validation before push.

## Purpose

Make the owner dashboard feel complete without expanding BizPilot beyond the
approved manual-first recovery product. The work adds a real protected guide
route, makes the overview manual queue clearer, and keeps known gaps visible
instead of implying unsupported automation.

## Implemented

- Added `/dashboard/guide` as a protected owner route.
- Added the guide to the desktop sidebar, mobile route set, topbar page context,
  and topbar Actions menu.
- Added bilingual dashboard copy for the owner operating guide.
- Upgraded the overview "today" panel into a richer manual recovery queue:
  - reply needed,
  - follow-up due,
  - setup blocking,
  - missing info,
  - AI draft ready.
- Each manual queue row now has a reason and a route-level CTA instead of only a
  repeated count.
- Added source guards so the guide route, navigation, smoke route, and
  dashboard dictionary shape stay protected.

## Product Decisions

- The dashboard guide is internal/protected because it is operational context
  for the owner, not public marketing content.
- The guide describes current manual operating loops and gated gaps; it does not
  claim booking, payment, messaging automation, or team assignment.
- The overview keeps insights/charts secondary. The first dashboard job remains
  "what should the owner manually do next?"
- The mobile dashboard still limits bottom navigation to five items. Settings
  remains available through desktop navigation and topbar Actions.

## Remaining Gaps Kept Visible

| Gap | Status | Reason |
| --- | --- | --- |
| Dedicated keyboard/focus and screenshot QA | Open | Requires a browser QA pass before paid pilot. |
| Saved lead queue views | Future | Useful after real owner behavior proves which filters matter. |
| Team assignment | Blocked | Requires explicit owner/team access and RLS approval. |
| Notification automation | Blocked | Requires consent, provider, cost, logging, smoke, and rollback gates. |
| Paid pilot | Blocked | Requires support, payment, refund, rollback, and restored-app proof. |

## Validation Evidence

Supabase/static gate audit:

```text
pnpm audit:supabase
PASS - local target classifier plus explicit grant/RLS posture audit
```

RLS/local DB:

```text
pnpm test:rls
PASS - 13/13 RLS files
```

Full app verification:

```text
pnpm verify
PASS - lint, typecheck, unit 210/210, and Next build
```

Authenticated local dashboard/admin smoke:

```text
pnpm check:dashboard-local
PASS - app, Supabase, and DATABASE_URL targets classified local

pnpm smoke:dashboard -- --base-url=http://127.0.0.1:3043 --fixture-profile=dense --include-admin=true --dashboard-smoke-email=codex-founder-admin-20260704-phase27b@example.test --timeout-ms=30000
PASS - 15/15 routes
```

Routes covered:

```text
/dashboard
/dashboard/leads
/dashboard/configuration
/dashboard/business-profile
/dashboard/quote-setup
/dashboard/settings
/dashboard/guide
/dashboard/leads/[syntheticLeadId]
/founder
/admin?adminPanel=overview
/admin?adminPanel=users
/admin?adminPanel=businesses
/admin?adminPanel=leads
/admin?adminPanel=health
/admin?adminPanel=activity
```

Source hygiene:

```text
git diff --check
PASS
```

Use local Supabase overrides for mutating dashboard smoke. Do not run synthetic
dashboard smoke against managed Supabase or production.

Do not run synthetic dashboard smoke against managed Supabase or production.
