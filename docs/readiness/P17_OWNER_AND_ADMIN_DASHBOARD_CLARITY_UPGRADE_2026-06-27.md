# P17 Owner and Founder/Admin Dashboard Clarity Upgrade

Date: 2026-06-27
Repo: `E:\bizpilot-ai`
Branch: `main`
Scope: Public homepage hero clarity, owner first-run guidance,
founder/admin user-control priority, searchable 10-user default directory,
navigation order, and release checks.

## Research Baseline

Useful standards and articles applied:

- NN/g progressive disclosure:
  https://www.nngroup.com/articles/progressive-disclosure/
  - Keep primary actions visible and move secondary/rare actions behind a
    secondary interaction.
- GOV.UK task list:
  https://design-system.service.gov.uk/components/task-list/
  - Show what tasks exist, what is done, and what still needs attention.
- GOV.UK complete multiple tasks pattern:
  https://design-system.service.gov.uk/patterns/complete-multiple-tasks/
  - Give users a clear order for multi-step service setup.
- Material data tables:
  https://m2.material.io/components/data-tables
  - Put search, filter, pagination, and table/list controls directly around
    the data they manipulate.
- WCAG target size:
  https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
  - Controls should be easy to activate without hitting adjacent controls.
- WCAG labels or instructions:
  https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html
  - Form controls need clear labels and instructions.

## Decisions

Public Homepage Hero:

- Reworked the first-fold visual around a cleaner chaos-to-clarity signal:
  source channels, quote-request pain, BizPilot organization, and an owner
  review draft.
- Replaced generic channel symbols with stronger Website, Google, Facebook,
  and Instagram/Text marks while preserving manual-first boundaries.
- Reduced desktop density by fixing narrow source cards, tightening the
  short-height visual, and keeping mobile simplified.
- Tightened EN and fr-CA hero copy so both languages stay claim-safe and fit
  responsive budgets.

Owner/User Dashboard:

- The first screen should answer: where do I start, what is already done, and
  what should I open next?
- Added a compact `Start here` task path above the operational lane:
  1. Finish quote setup.
  2. Share the quote link.
  3. Review new requests.
- Each step has a stable action target and a `Done` / `Next` badge.
- The existing manual recovery lane stays below as operational context, not as
  the first thing the user must decode.

Founder/Admin Dashboard:

- `/admin` now defaults to the Users control lane because account and user
  flow review is the highest-priority founder job.
- Admin tabs are ordered by operating priority:
  Users, Businesses, Leads, Health, Activity.
- Business routes are explicit with `adminPanel=businesses`, so the new default
  does not mix user and business state.
- The Users page now shows the user directory immediately instead of hiding it
  behind a closed details panel.
- User paging defaults to 10 users. Search, access filter, auth filter, and
  pagination live directly beside the visible list.
- Risk/work-queue chips remain available, but secondary to the searchable user
  directory.

## Files Changed

- `app/(dashboard)/dashboard/page.tsx`
- `app/admin/page.tsx`
- `app/globals.css`
- `app/page.tsx`
- `lib/i18n/bizpilot-copy.ts`
- `lib/i18n/public-site-copy.ts`
- `server/services/founder-admin.service.ts`
- `tests/unit/dashboard-professionalization-source.test.mts`
- `tests/unit/founder-admin-source.test.mts`
- `tests/unit/i18n-copy.test.mts`

## Safety Notes

- No production data deletion, cleanup, invite, role change, or destructive
  admin operation was executed.
- This phase changes layout, copy, route defaults, and list/page behavior only.
- No auto-send, booking confirmation, invented pricing, billing, payment,
  SMS/WhatsApp automation, migrations, RLS, or auth policy changes were made.
- Synthetic dashboard smoke remains blocked on production Supabase targets by
  design.

## Verification Run

- `pnpm verify` - PASS
  - `pnpm lint` - PASS
  - `pnpm typecheck` - PASS
  - `pnpm test:unit` - PASS, 152/152 tests
  - `pnpm build` - PASS
- `pnpm smoke:public -- --base-url=http://127.0.0.1:3052` - PASS, 10/10 routes
- `pnpm smoke:responsive -- --base-url=http://127.0.0.1:3052` - PASS, 19/19 routes
- `pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3052` - PASS, 0 failures
- `pnpm smoke:quote -- --base-url=http://127.0.0.1:3052 --inactive-slug=phase1-unavailable-synthetic` - PASS, 1/1 check
- Browser read-only DOM visual check - PASS
  - `390x844`: no horizontal overflow, mobile visual simplified, 1 lead, 1 draft
  - `768x1024`: no horizontal overflow, 4 source marks, 4 messages, 2 leads, 1 draft
  - `1280x720`: no horizontal overflow, hero reduced to 577px height, 3 messages,
    2 leads, 1 draft, no console warnings/errors
- `git diff --check` - PASS
