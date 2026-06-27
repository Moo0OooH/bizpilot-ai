# P20 Dashboard Priority Hierarchy Redesign

Date: 2026-06-27
Repo: `E:\bizpilot-ai`
Branch: `codex/full-system-dashboard-qa-polish`
Scope: Owner/User Dashboard and Founder/Admin Dashboard

> Canonical dashboard design note, 2026-06-27: this P20 report remains
> implementation evidence. Future dashboard design and Codex execution decisions
> are governed by `docs/readiness/BIZPILOT_DASHBOARD_MASTER_STANDARD_AND_CODEX_GUIDE_2026-06-27.md`.

## Why This Pass Exists

The dashboards had the right raw ingredients, but the visual priority was weak:
too many items had the same weight, key actions were not dominant enough, and
the founder/admin user-control lane still made the founder scan too much before
reaching the search and control tools.

This pass treats the dashboards as operating tools, not decorative landing
pages. The first viewport must answer the user question immediately:

- Owner/User Dashboard: what should I do next to recover the lead or finish
  setup?
- Founder/Admin Dashboard: which user or workspace needs review, and which
  guarded operation is available?

## External Standards Applied

The redesign used these public UX references as practical guardrails:

- Nielsen Norman Group dashboard guidance:
  https://www.nngroup.com/articles/dashboards-preattentive/
  - Dashboards should communicate critical information quickly and avoid
    exploratory clutter.
  - Operational dashboards support time-sensitive decisions and immediate
    action.
  - Color should reinforce status, not carry the whole meaning alone.
- Nielsen Norman Group data-table guidance:
  https://www.nngroup.com/articles/data-tables/
  - Admin tables/directories must support finding records, comparing records,
    viewing/editing one record, and taking actions on records.
  - Filters should be discoverable and quick.
  - Human-readable identifiers should lead the scan path.
- GOV.UK task list component:
  https://design-system.service.gov.uk/components/task-list/
  - Task lists are useful when users need control over multi-step setup work.
  - Each task needs a clear name, optional hint, and visible status.
- Fluent 2 layout guidance:
  https://fluent2.microsoft.design/layout
  - Consistent columns, gutters, margins, and alignment make application UIs
    easier to scan.
  - The most important content should occupy the strongest grid region.
- Fluent 2 card guidance:
  https://fluent2.microsoft.design/components/web/react/core/card/usage
  - Cards should group information and actions around one concept.
  - When there is one obvious action, the card or panel should make that action
    clear.
- Material Design layout density guidance:
  https://m3.material.io/foundations/layout/grids-spacing/density
  - Dense forms and lists can be appropriate when the goal is to keep more
    work-critical content available on-screen.

## Owner/User Dashboard Changes

File changed: `app/(dashboard)/dashboard/page.tsx`

### First Viewport

Before this pass, the first viewport had several competing cards and the most
important next step could be buried behind metrics or a separate onboarding
panel.

Now the first viewport is a single prioritized cockpit:

- One H1 remains the page anchor.
- A "Suggested next action" panel appears immediately under the H1.
- The primary CTA changes based on state:
  - Finish setup when quote readiness is incomplete.
  - Review urgent lead when a lead needs attention.
  - Open Lead Queue when no single urgent lead is dominant.
- "Start here" setup guidance is integrated into the first viewport instead of
  being a separate long-scroll card.
- Four compact priority tiles sit below the cockpit:
  - New quote requests
  - Needs reply
  - At risk leads
  - AI drafts ready

### Manual Recovery Lane

The manual recovery lane is now tighter and more sequential:

- Cards are numbered so the owner can see the workflow order.
- Each card uses a stable minimum height.
- Secondary labels were removed from the bottom of the cards to reduce repeated
  reading.
- The featured lead summary moved below the lane, so it supports the workflow
  without fighting the first viewport.

### Owner Dashboard Product Rule

The owner dashboard must stay calm:

- No chart-heavy first viewport.
- No autonomous-AI implication.
- No internal admin/security language.
- No long instructional blocks above the next action.
- No horizontal overflow on mobile or desktop.

## Founder/Admin Dashboard Changes

File changed: `app/admin/page.tsx`

### Users Panel Priority

The founder/admin dashboard's most frequent early job is user control. The
Users panel now behaves like a search-first operating console:

- Header actions expose adjacent admin lanes: Businesses, Health, and Gated
  operations.
- Metrics remain visible, but they no longer consume the full operating width.
- The safety explanation is now a dedicated "Operating rule" panel beside the
  metrics.
- Search users, page size, access status, auth status, Search, and Reset moved
  above Work queues.
- Default directory size remains 10 users.
- The search/filter form uses a compact responsive grid so controls stay
  aligned without creating horizontal overflow.

### Business Operations Priority

The Businesses panel now has a "Priority workspace" strip above the metrics:

- It picks the selected workspace, or the first available workspace.
- It shows the recommended founder action.
- It provides a direct "Open controls" action.
- It keeps workspace metrics below the first decision instead of forcing the
  founder to interpret cards first.

### Admin Product Rule

The founder/admin dashboard must stay operational:

- Search and filters before queue summaries.
- Human-readable business/user identity before IDs.
- Guarded/destructive controls remain explicit and server-gated.
- Production deletion and cleanup are not loosened by visual polish.
- Dense layout is allowed only when it improves scanning and comparison.

## Source Tests Added

Updated source guards:

- `tests/unit/dashboard-professionalization-source.test.mts`
  - Guards the owner primary action and priority tile structure.
- `tests/unit/dashboard-heading-source.test.mts`
  - Guards the new compact first-viewport shell and priority tile dimensions.
- `tests/unit/founder-admin-source.test.mts`
  - Guards the Admin operating rule.
  - Guards Search users appearing before Work queues.
  - Guards the Business Operations priority workspace strip.

## Browser QA Evidence

Authenticated local Browser checks were run after the redesign.

Owner/User Dashboard:

- Route: `/dashboard`
- Desktop: no horizontal overflow.
- Mobile 390x844: no horizontal overflow.
- First viewport contains:
  - H1
  - Suggested next action
  - Start here
  - priority tiles
  - manual recovery lane directly below

Founder/Admin Dashboard:

- Route: `/admin`
- Desktop: no horizontal overflow after compacting the search action column.
- Mobile 390x844: no horizontal overflow.
- Users panel contains:
  - H1 Users
  - Operating rule
  - Search users before Work queues
  - default 10-user page-size option

## Verification Commands

Passed:

```text
pnpm typecheck
pnpm lint
pnpm test:unit
pnpm build
```

Final unit-test result:

```text
tests 156
pass 156
fail 0
```

Final production build result:

```text
Compiled successfully
Generating static pages (24/24)
```

## Safety Notes

- No production cleanup was executed.
- No user deletion was executed.
- No fake account creation was executed in this pass.
- Existing unrelated local changes in `app/page.tsx`, `app/globals.css`, and
  `hero-right-3053.*.log` were not part of this dashboard redesign.

## Acceptance Decision

This pass materially changes the dashboard feel and operating order:

- Owner/User Dashboard now starts with a next-action cockpit instead of equal
  weight content blocks.
- Founder/Admin Dashboard now starts with user search/control behavior instead
  of making the founder scan queues first.
- The most-used actions are closer to the top.
- Secondary content remains available but no longer dominates the first
  decision.

The dashboards are not declared "finished forever"; they are now on the right
professional hierarchy path and have source/browser/build evidence protecting
the most important changes.
