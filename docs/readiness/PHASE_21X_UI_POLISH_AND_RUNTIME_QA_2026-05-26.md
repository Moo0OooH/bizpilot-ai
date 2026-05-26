# Phase 21X - UI Polish And Runtime QA

**Project:** BizPilot AI  
**Document Type:** Implementation log and next-improvement register  
**Status:** Code changes applied; verification required before push  
**Owner:** MoOoH  
**Last Updated:** 2026-05-26

---

## Purpose

This pass follows the owner request to stop extending the wrong path and bring
the active product surfaces back toward the actual BizPilot direction:

- one canonical public homepage, not duplicate experimental pages;
- dashboard UI that is calmer, consistent, and usable in light/dark modes;
- founder admin that does not hide runtime/data wiring failures behind empty
  counters;
- visible operational logging so future debugging does not repeat the same
  blind spots.

No production SQL or manual production data mutation was performed in this pass.

## Changes Applied

### Removed duplicate public route

`app/page01/page.tsx` was removed after repo search found no active references
to `page01` or `/page01`.

Reason:

- the owner asked that extra pages should not remain user-facing unless they are
  intentionally exposed through product/admin controls;
- `app/page.tsx` is the current localized, cleaning-first public homepage.

### Dashboard visual system

`app/globals.css` now aligns owner-dashboard light and dark themes around the
same teal/emerald product accent used by the active marketing surface.

Reason:

- the dashboard previously mixed blue action states with an emerald/navy brand
  direction, which made buttons, active nav items, and cards feel inconsistent;
- the update keeps founder admin blue as an internal console tone, while owner
  dashboard controls read as one product.

### Sidebar navigation

`components/dashboard/dashboard-sidebar.tsx` now uses inline SVG dashboard icons
instead of single-letter markers.

Reason:

- letter-only icons were visually noisy and ambiguous in both desktop and mobile
  navigation;
- the new icons preserve the existing routes and labels without adding a new
  dependency or changing feature scope.

### Founder admin empty-state diagnostics

`app/admin/page.tsx` now renders production health before the user control desk
and adds a warning when safe runtime checks fail.

Reason:

- the founder admin page can otherwise look like "0 users / 0 businesses" even
  when the root problem is production credential or Supabase target wiring;
- the health panel shows only safe counts/statuses and should be read before
  trusting empty admin results.

## Current Runtime Risk Register

### Admin still empty after refresh

If founder admin still shows zero users/businesses, read the Production health
panel first. The likely causes remain:

- `BIZPILOT_FOUNDER_EMAILS` missing or typo/case mismatch;
- env set for Preview instead of Production;
- production was not redeployed after env change;
- Supabase service role key belongs to a different project than the production
  Supabase URL;
- service role key/project mismatch or missing secret at runtime.

### Dashboard data does not load after workspace recovery

Expected flow:

1. `/dashboard` detects a signed-in user without active owner membership.
2. It shows the recover workspace form.
3. Recovery should create or repair only safe missing workspace/owner membership
   cases.
4. After recovery, the dashboard should load the linked business workspace data.

If it still fails, use production logs for the new `workspace_recovery.*` step
markers and do not assume a single failed request is final when Supabase/Auth
rate limits may be involved.

## QA Required Before Push

- `git status --short --branch`
- `pnpm verify`
- public route smoke on local or production target
- browser visual smoke for:
  - `/`
  - `/auth/sign-in`
  - `/pricing`
  - unauthenticated `/dashboard` redirect behavior
  - unauthenticated `/admin` redirect behavior

Authenticated dashboard/admin smoke still needs a valid signed-in session or
approved test account flow. No password, token, cookie, or service key should be
recorded in docs or terminal summaries.

## Next Improvement Register

- Consolidate founder admin cards so all nested white panels use the same
  tokenized surface classes instead of literal `bg-white`.
- Add founder-admin i18n only if the console becomes customer-support-facing;
  keep internal operational copy English for now.
- Add a safe synthetic test account harness that can create, recover, and remove
  non-production workspaces without touching real production customer records.
- Add a small UI regression checklist for dashboard light/dark screenshots after
  each protected-shell change.
