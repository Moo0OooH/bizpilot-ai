# P18 Owner/Admin Dashboard Clarity Upgrade

Date: 2026-06-27
Repo: `E:\bizpilot-ai`
Branch: `main`
Scope: Owner first-run guidance, founder/admin user-control priority,
searchable 10-user default directory, admin route defaults, and release checks.

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
- `lib/i18n/bizpilot-copy.ts`
- `server/services/founder-admin.service.ts`
- `tests/unit/dashboard-professionalization-source.test.mts`
- `tests/unit/founder-admin-source.test.mts`

## Safety Notes

- No production data deletion, cleanup, invite, role change, or destructive
  admin operation was executed.
- This phase changes layout, copy, route defaults, and list/page behavior only.
- Synthetic dashboard smoke remains blocked on production Supabase targets by
  design.

## Verification

- `pnpm typecheck` passed.
- `pnpm lint` passed.
- `pnpm test:unit` passed: 152 tests / 29 suites.
- `pnpm build` passed.
- Browser visual QA passed:
  - `/dashboard`: `Start here` visible, one H1, no dashboard error boundary,
    no horizontal overflow.
  - `/admin`: defaults to Users, user directory visible, search visible,
    10-user page-size option first, no horizontal overflow.
  - `/admin?adminPanel=businesses`: Business Operations loads only on the
    explicit business route.
  - `/admin?adminPanel=users&userPageSize=10`: Users page-size value is `10`,
    search and directory are visible, no dashboard error boundary, no
    horizontal overflow.
