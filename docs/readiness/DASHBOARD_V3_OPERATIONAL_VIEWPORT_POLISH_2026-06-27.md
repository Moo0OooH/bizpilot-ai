# Dashboard V3 Operational Viewport Polish

Date: 2026-06-27
Branch: `main`
Scope: owner dashboard shell, founder/admin shell, admin users panel, owner
overview sizing, bilingual navigation copy, browser overflow QA.

## Objective

Make the dashboard feel like an operational product surface instead of a long
document page:

- keep browser-level vertical and horizontal overflow closed,
- move founder/admin navigation into a left operational rail on desktop,
- keep admin mobile navigation visible without horizontal scrolling,
- group owner navigation into practical command/setup/control sections,
- preserve the manual-first and gate-aware Dashboard V3 standard,
- keep English and fr-CA dashboard copy in the central dictionary.

## Changes

- Founder/Admin now uses a fixed viewport shell with a desktop left rail:
  Command, Operations, and System.
- Founder/Admin mobile uses a two-row grid nav instead of a horizontal scroller.
- Founder/Admin work content scrolls inside the controlled work area; the browser
  document itself stays at viewport height.
- Owner dashboard shell now uses the same viewport-frame pattern: the browser
  document stays fixed and dashboard content scrolls inside the workspace.
- Owner sidebar groups are localized through `lib/i18n/bizpilot-copy.ts`:
  Command, Setup, Control, with fr-CA equivalents.
- Owner overview first-screen grid was resized so the lead queue, trend, tasks,
  and source panels do not create horizontal overflow beside the desktop sidebar.

## Browser QA Evidence

Checked locally at `http://localhost:3000` with authenticated founder access:

| Route | Viewport | Result |
| --- | --- | --- |
| `/admin?adminPanel=users` | 1280 x 720 | Document scroll width equals viewport width; document scroll height equals viewport height; desktop left rail visible. |
| `/admin?adminPanel=overview` | 1280 x 720 | Document-level overflow closed; production/admin panels render inside work area. |
| `/admin?adminPanel=users` | 390 x 844 | Document scroll width equals viewport width; mobile admin nav is a two-row grid; work area scroll is internal. |
| `/dashboard` | 1280 x 720 | Document-level overflow closed; owner sidebar groups visible; internal horizontal overflow removed. |
| `/dashboard` | 390 x 844 | Document-level overflow closed; bottom mobile nav visible; content scroll is internal. |
| `/dashboard/leads` | 1280 x 720 and 390 x 844 | Document-level overflow closed. |
| `/dashboard/settings` | 1280 x 720 and 390 x 844 | Document-level overflow closed. |

Internal work-area scrolling remains intentional for long operational content.
The standard is that the browser page itself must not become the scrolling
surface for protected dashboards.

## Safety Notes

- No production database mutation was performed.
- No access/role/deletion gate was opened.
- No secrets or credentials were committed.
- Founder/admin destructive controls remain gated.
- Owner-facing copy remains business-oriented and avoids raw technical language.
