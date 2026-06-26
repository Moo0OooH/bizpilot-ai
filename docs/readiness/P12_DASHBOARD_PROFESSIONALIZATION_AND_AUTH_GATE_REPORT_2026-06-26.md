# P12 Dashboard Professionalization And Auth Gate Report

Date: 2026-06-26
Repo: `E:\bizpilot-ai`
Branch: `review/p12-dashboard-professionalization-gates`
Status: code/test ready, safe dashboard/UI scope only

## Owner Direction

The owner requested a full dashboard quality pass, modern visual/readability
improvements, test coverage, cleanup, commit, and push. The owner also asked to
remove all non-owner users, create a test account, use the owner account for
tests, and later add Google/mobile signup/login.

## Non-Negotiable Safety Decision

This phase does not delete real auth users, does not create production test
accounts, does not use owner credentials, and does not change auth providers.

Reason:

- Auth user deletion is destructive and irreversible.
- Production user cleanup can touch real data and tenant access.
- Google and phone auth require provider settings, redirect URLs, secrets, and
  local RLS/auth proof before product use.
- Credentials were previously shared in chat; they were not used in this phase
  and should be rotated.

## Current Sources Checked

- Web performance: [web.dev Core Web Vitals](https://web.dev/articles/vitals)
- Accessibility baseline: [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- Google auth gate: [Supabase Google login docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
- Phone auth gate: [Supabase phone login docs](https://supabase.com/docs/guides/auth/phone-login)

Applied interpretation:

- Keep dashboard scanning fast and stable; avoid layout jumps and over-heavy UI.
- Improve visible keyboard/screen-reader labels on controls.
- Keep the owner workflow explicit before real data.
- Do not begin auth provider changes until secrets/config/RLS proof are ready.

## Safe Dashboard Changes Implemented

Files changed:

```text
app/(dashboard)/dashboard/page.tsx
app/(dashboard)/dashboard/leads/[leadId]/page.tsx
components/dashboard/dashboard-ui.tsx
components/dashboard/lead-workspace-queue.tsx
lib/i18n/bizpilot-copy.ts
tests/unit/dashboard-professionalization-source.test.mts
docs/readiness/P12_DASHBOARD_PROFESSIONALIZATION_AND_AUTH_GATE_REPORT_2026-06-26.md
```

### Dashboard Overview

- Added a compact manual recovery lane:
  - Capture
  - Prioritize
  - Draft
  - Manual send
- Uses existing workspace/lead/action counts only.
- Keeps the workflow manual-first and owner-controlled.
- Does not add automation, sending, booking, pricing, billing, or CRM claims.

### Lead Queue

- Added queue insight strip:
  - visible / total
  - needs reply
  - at risk
  - missing info
- Added explicit priority explanation.
- Added accessible labels for search, status filter, and sort controls.
- Added next-action text to mobile lead cards.
- Made desktop queue header sticky inside the card for easier scanning.

### Lead Detail

- Added a four-step owner workflow strip:
  - Review
  - Draft
  - Copy
  - Record
- Reinforces that the owner edits/sends outside BizPilot.
- No send button, booking confirmation, invented pricing, invoice/payment, or
  SMS/WhatsApp automation was added.

### Shared Dashboard UI

- Stopped CSS capitalization from turning acronym copy such as `AI` into `Ai`.
- Kept humanized fallback statuses readable without mutating localized copy.

### EN/fr-CA Copy

- Added EN/fr-CA copy for:
  - overview manual recovery lane
  - lead queue insight/accessibility labels
  - lead detail manual workflow steps
- Existing i18n shape tests continue to guard language parity.

## Tests Added

Added:

```text
tests/unit/dashboard-professionalization-source.test.mts
```

The source guard checks:

- dashboard command lane stays manual-first
- lead queue insight/accessibility labels remain present
- owner review steps remain visible on lead detail
- no auto-send / invented-pricing boundaries stay in source copy

## Auth/User Cleanup Gate

Requested destructive user cleanup is not safe to run in this phase.

Already-existing code confirms the correct boundary:

```text
server/services/founder-auth-user-cleanup.service.ts
lib/founder-cleanup/auth-user-deletion.ts
```

Current guardrails already block:

- deleting the signed-in founder account
- deleting founder allowlist accounts
- deleting users attached to production workspaces unless explicitly
  reclassified and acknowledged
- deleting users tied to non-test/non-demo/non-seed workspaces

Required before any real user cleanup:

1. Confirm target environment is local or explicitly approved production.
2. Take/export an auth + database backup.
3. List target auth users without printing secrets.
4. Confirm one canonical owner account by user id and email.
5. Confirm each deletion target is fake/test only.
6. Confirm linked workspaces are test/demo/seed or safely reclassified.
7. Run local RLS proof.
8. Run deletion in a controlled admin path with audit log.
9. Verify dashboard access for the owner after cleanup.

Until this gate closes:

```text
Do not delete real users.
Do not create production test accounts.
Do not use shared owner credentials in automation.
```

## Google And Phone Auth Gate

Google signup/login and phone/mobile login are not implemented in this phase.

Required before implementation:

- Supabase provider configuration decision.
- Google OAuth client ID/secret and authorized redirect URLs.
- Phone provider/SMS cost/abuse decision.
- Auth callback route review.
- Local auth/RLS tests for email, Google, and phone identities.
- UI copy that does not imply unavailable login methods are live.
- Secret handling without printing env values.

Recommended future implementation path:

```text
P13-A: Auth provider configuration plan
P13-B: Local-only Google auth callback proof
P13-C: Local-only phone auth proof or defer phone behind pilot decision
P13-D: EN/fr-CA auth UI copy
P13-E: RLS proof for identity-linked workspace access
P13-F: Owner approval before production provider enablement
```

## Files Not Touched

Not touched in P12:

- database schema
- migrations
- RLS policies
- Supabase auth provider config
- production data flow
- billing/payment
- AI provider config
- real customer data handling
- SMS/WhatsApp automation

## Verification Results

Executed:

| Command | Result | Notes |
|---|---:|---|
| `git diff --check` | PASS | No whitespace errors before verification. |
| `pnpm typecheck` | PASS | Initial targeted typecheck after code edits. |
| `pnpm verify` | PASS | Lint, typecheck, 142/142 unit tests, and production build passed. |
| `pnpm smoke:public -- --base-url=http://127.0.0.1:3042` | PASS | 10/10 public/auth routes passed. |
| `pnpm smoke:responsive -- --base-url=http://127.0.0.1:3042` | PASS | 19/19 routes passed; 0 responsive failures. |
| `pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3042` | PASS | Final UI matrix failures: 0. |
| `pnpm smoke:quote -- --base-url=http://127.0.0.1:3042 --inactive-slug=phase1-unavailable-synthetic` | PASS | 1/1 synthetic inactive quote route check passed. |
| Browser visual check at `http://127.0.0.1:3042/` | PASS | Home hero visible, no horizontal overflow, pilot CTA present, forbidden trial copy absent. |
| Browser protected route check at `/dashboard` | PASS | Redirected to `/auth/sign-in?next=%2Fdashboard`; protected dashboard content not exposed; no browser console errors observed. |

Skipped:

| Command | Reason |
|---|---|
| `pnpm smoke:dashboard -- --base-url=http://127.0.0.1:3042` | Current Supabase URL classified as managed non-local. This smoke creates synthetic auth/workspace/lead data and must only run against a confirmed local/synthetic target. |
| `pnpm verify:local-db` | `DATABASE_URL` was missing in the shell. Local DB/RLS proof remains required before real-data, destructive cleanup, or auth-provider rollout. |

Cleanup after verification:

```text
local Next process stopped
p12-next-start-3042.log removed
.next removed
```

## Current Recommendation

P12 safe dashboard professionalization is appropriate to finish and commit.

Real data, real user deletion, production test-account creation, Google auth,
phone auth, and paid pilot remain blocked until their gates are explicitly
closed.

Current owner-facing status:

```text
Dashboard P12 visual/readability polish is safe to review.
Auth/user cleanup remains gate-blocked.
Real data and paid pilot remain blocked.
```
