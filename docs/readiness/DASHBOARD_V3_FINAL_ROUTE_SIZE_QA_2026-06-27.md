# Dashboard V3 Final Route and Size QA

Date: 2026-06-27
Branch: `main`
Scope: owner dashboard, founder/admin dashboard, protected route standard,
public first-fold sizing sanity, bilingual route/link confidence.

## Result

Status: PASS.

The owner dashboard and founder/admin dashboard remain on the single Dashboard
V3 standard:

- protected dashboard pages use a fixed viewport shell,
- page-level horizontal and vertical overflow are closed,
- long operational content scrolls only inside the dashboard work area,
- owner navigation is route-owned and grouped by Command, Setup, Control,
- founder/admin navigation is route-owned through `adminPanel` query state,
- mobile dashboard navigation is visible without browser-level horizontal
  scrolling,
- English and fr-CA copy remain dictionary-owned,
- public hero and supporting page sizing remain covered by the final UI matrix.

## Local QA

Local target: `http://127.0.0.1:3000`

| Check | Result |
| --- | --- |
| Fresh dev server health | PASS: `/` returns 200 after restart. |
| Protected dashboard redirect health | PASS: `/dashboard` returns 307 when unauthenticated. |
| Protected admin redirect health | PASS: `/admin?adminPanel=users` returns 307 when unauthenticated. |
| Public route smoke | PASS: 10 passed, 0 failed. |
| Final UI matrix | PASS: 0 failures across public/auth routes, EN/fr-CA, light/dark, and viewport matrix. |
| Dashboard source guard | PASS: fixed shell, internal scroll, owner links, admin query links, and mobile admin grid are locked in unit tests. |

## Smoke Notes

`pnpm smoke:dashboard` intentionally did not run against the current production
Supabase target because the runner is production-prohibited for synthetic data
creation. This is the expected safety behavior. Dashboard validation for this
pass used source guards, redirect checks, and read-only browser inspection.

An initial public/UI matrix run timed out because the existing local dev server
became unresponsive. The server was restarted, health checks passed, and both
public route smoke and the final UI matrix then passed cleanly.

## Verification Commands

- `pnpm test:unit`
- `pnpm smoke:public`
- `pnpm smoke:ui-matrix`
- `pnpm verify`

## Safety Notes

- No production database mutation was performed.
- No destructive admin action was submitted.
- No credentials or secrets are documented here.
- The dashboard auth smoke remains blocked on production targets by design.
- The final dashboard path remains single-standard: no duplicate Vercel/Git
  route path is required for the dashboard surface.
