# Phase 25X - Dashboard Lead Queue Pagination

Date: 2026-07-04
Head before implementation: `6bb54fb docs: record post-25v remaining map`
Branch: `main` tracking `origin/main`

## Scope

Phase 25X improves the protected owner lead queue source experience without
running authenticated browser QA or mutating dashboard smoke against the current
Supabase target.

The change focuses on the dashboard lead queue display model: owners should be
able to filter, sort, and scan priority leads without the page becoming an
unbounded table. The dashboard overview preview still remains capped and
compact.

This phase does not enable real customer data, paid pilot collection,
automation, booking, invoices, SMS/WhatsApp, autonomous AI, or broad CRM scope.

## Implemented

- Split the lead queue into a full filtered result set and a rendered page.
- Added smart pagination to the full `/dashboard/leads` queue: 10, 25, or 50
  rows per page, previous/next controls, page range, and page status.
- Kept the default sort as most urgent so overdue requests, missing details,
  new leads, and open owner actions stay first.
- Reset pagination to page 1 when the owner changes search, status filter, sort
  order, page size, or clears filters.
- Preserved the dashboard overview queue as a deterministic five-row preview
  through `limit={5}` with no pagination bar.
- Added EN/fr-CA pagination copy and accessible labels for rows-per-page.
- Added source guards for lead queue pagination, filter accessibility, and
  bilingual copy parity.

## Product Truth Preserved

- The queue remains an owner-reviewed lead recovery surface, not an automated
  sender.
- AI remains draft/recommendation support only.
- The queue does not imply booking, pricing confirmation, payment collection,
  SMS/WhatsApp automation, or full CRM replacement.
- Existing source/status and manual next-action visibility remains the priority.
- Real customer data and paid pilot gates remain blocked.
- Mutating dashboard smoke remains local-Supabase-only before synthetic writes.

## QA Boundary

Authenticated dashboard browser QA and the dashboard screenshot matrix were not
run in this phase because the current environment is still not confirmed as a
local/synthetic Supabase target. This phase is covered by source tests,
typecheck, lint, build, and git whitespace checks only.

## Backlog Items Advanced

```text
51 advanced at source level - lead queue filtering, sorting, counts, and page controls are clearer
55 reinforced - queue still routes owners to manual review/copy workflows
61 prepared at source level - controls have accessible labels and keyboard-native select/buttons
66 preserved - protected route screenshot matrix still waits for local authenticated QA
67 preserved - mutating dashboard smoke still waits for confirmed local Supabase
77 preserved - no analytics sink enabled
89 preserved as paid-pilot blocker
90 preserved; no local RLS/database proof was claimed
93 preserved
94 preserved
95 preserved
96 preserved
97 preserved
98 preserved
99 preserved
100 preserved
```

## Verification

```text
git diff --check PASS
pnpm test:unit PASS - 199 tests
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
```

## Next Recommended Slice

The next dashboard acceptance step remains:

```text
1. point the environment at a confirmed local/synthetic Supabase target;
2. run dashboard/admin smoke with dense fixtures;
3. run authenticated desktop/mobile EN/fr-CA light/dark browser QA;
4. capture the protected-route screenshot matrix and fix visual/focus findings.
```
