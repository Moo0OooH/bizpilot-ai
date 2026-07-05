# Dashboard V3 Route Pagination Standardization - 2026-07-05

## External Standards Checked

- U.S. Web Design System pagination: current page needs `aria-current="page"` and page links/buttons need explicit labels.
- W3C Design System pagination: every pagination navigation needs a unique accessible name.
- Material Design data tables: table pagination belongs with the table, with predefined rows-per-page options.
- Nielsen Norman Group infinite-scroll guidance: goal-driven finding and comparison tasks are better served by pagination or load-more patterns than endless scrolling.

Reference URLs:

- https://designsystem.digital.gov/components/pagination/
- https://design-system.w3.org/components/pagination.html
- https://m2.material.io/components/data-tables
- https://www.nngroup.com/articles/infinite-scrolling-tips/

## Route Inventory

| Area | Route | Checked surface | Pagination/page-size decision |
| --- | --- | --- | --- |
| Auth | `/auth/sign-in` | Login entry | No pagination; single focused form. |
| Auth | `/auth/sign-up` | Owner onboarding | No pagination; single focused form. |
| Auth | `/auth/forgot-password` | Password reset request | No pagination; single focused form. |
| Auth | `/auth/reset-password` | Recovery completion | No pagination; single focused form. |
| Auth | `/auth/check-email` | Confirmation guidance | No pagination; compact next-step content. |
| Quote | `/quote` | Incomplete link fallback | No pagination; safe unavailable state. |
| Quote | `/quote/[slug]` | Public quote intake | No pagination; all customer questions stay visible and bilingual. |
| Quote | `/quote/[slug]/success` | Request success | No pagination; manual owner-reply expectation. |
| Owner | `/dashboard` | Owner cockpit | Preview queues use a fixed 5-row cap; no nested pagination. |
| Owner | `/dashboard/leads` | Lead queue | Full pagination standardized to 10/25/50 rows, named nav, active page state, and previous/next controls. |
| Owner | `/dashboard/leads/[leadId]` | Single lead workspace | No pagination; one lead per route. |
| Owner | `/dashboard/configuration` | Quote setup | No pagination; tabs/sections instead of paged setup. |
| Owner | `/dashboard/quote-setup` | Legacy setup route | Redirects to configuration. |
| Owner | `/dashboard/business-profile` | Business identity | No pagination; compact profile edit surface. |
| Owner | `/dashboard/settings` | Workspace settings | No pagination; details panels for secondary content. |
| Owner | `/dashboard/guide` | Operating guide | No pagination; route map and gaps in one protected guide. |
| Founder | `/founder` | Founder handoff | No pagination; handoff to `/admin`. |
| Admin | `/admin?adminPanel=overview` | Founder overview | No pagination; snapshot cards and short lists only. |
| Admin | `/admin?adminPanel=users` | User directory | Pagination standardized to 10/25/50 users, panel-preserving search, named nav, active page state, and disabled controls. |
| Admin | `/admin?adminPanel=businesses` | Workspace controls | Search-first 10-row master rail; no full pagination until workspace count requires it. |
| Admin | `/admin?adminPanel=leads` | Internal lead review | Review list remains capped; destructive cleanup stays guarded. |
| Admin | `/admin?adminPanel=health` | Runtime checks | No pagination; diagnostics are grouped by panel. |
| Admin | `/admin?adminPanel=activity` | Audit trail | Capped activity stream; full server pagination deferred until audit volume requires it. |

## Fixes Completed

- Owner Lead Queue now renders pagination inside a named navigation region.
- Owner Lead Queue now shows page buttons with `aria-current="page"` on the active page.
- Owner Lead Queue keeps the rows-per-page selector visible on full queue views with data.
- Admin Users search now preserves `adminPanel=users` instead of falling back to Overview.
- Admin Users page size options are standardized to 10, 25, and 50.
- Admin Users pagination now shows range, active page, disabled Previous/Next states, and page links.

## Remaining Product Decision

Business and Activity admin panels are intentionally capped instead of fully paginated today. They should receive server pagination only when production/staging data shows that the 10-row business rail or capped audit stream creates real scanning friction.
