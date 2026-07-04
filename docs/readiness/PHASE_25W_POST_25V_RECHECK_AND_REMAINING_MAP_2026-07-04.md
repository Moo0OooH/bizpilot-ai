# Phase 25W - Post-25V Recheck And Remaining Map

Date: 2026-07-04
Head checked: `af22497 feat(settings): expose feature guide details`
Branch: `main` tracking `origin/main`
Untracked local output: `.codex-screenshots/` only; not staged

## Purpose

This recheck compares the Phase 25Q whole-project checklist with the work
completed through Phases 25R, 25S, 25T, 25U, and 25V. It records what is now
done, what remains blocked by required external/local gates, and what is still
optional polish.

## Completed Since Phase 25Q

```text
21 done - homepage hero and first impression polished in EN/fr-CA
27 done - /demo now includes a static product-real owner workspace preview
37 reinforced - slogan/H1 hierarchy shortened and geometry checked
38 done - practical reply-speed guide exists
39 done - lean local acquisition/content calendar exists
40 done - reply-speed education route exists
45 reinforced - bilingual public parity covered by source, smoke, and matrix checks
46 done - lean content calendar packaged in /faster-quote-replies
47 reinforced - generic AI positioning reduced
58 done - Settings feature registry now exposes guide details
66 done for public routes - public geometry/matrix completed; dashboard matrix still separate
82 reinforced - demo/content now match owner-review run-of-show more closely
```

## Current Safe Public-Site State

```text
Canonical public routes: 14
Latest public route added: /faster-quote-replies
Languages: EN and fr-CA
Public smoke: 14/14 pass
Responsive smoke: 25/25 pass
Final UI matrix: 14 public routes, final failures 0
Latest visual geometry: /faster-quote-replies EN/fr-CA desktop/mobile pass
```

Public conversion and SEO readiness are now strong enough for founder-led
validation content review, subject to deployment QA and owner approval. The site
still avoids fake testimonials, ranking guarantees, revenue guarantees,
auto-send, booking, payment, and full-CRM claims.

## Current Dashboard State

```text
Settings source-level guide details: done
Dashboard smoke guard: local-only
Authenticated dashboard/admin browser QA: still waiting for confirmed local Supabase
Dashboard screenshot matrix: still separate from completed public matrix
Local DB/RLS proof: still waiting for confirmed local database target
```

Dashboard source safety improved, but visual/browser acceptance for protected
routes is not complete until the environment points at a confirmed local or
synthetic Supabase target.

## Remaining Open Or Blocked Items

```text
1 blocked - real customer data requires explicit Phase 24G owner approval
2 blocked - paid pilot requires support/payment/refund/rollback/restored-app gates
18 optional - BreadcrumbList polish for deeper public pages
24 optional - more cleaning-specific local scenario content can still help
26 optional - pilot request microcopy can still improve after owner review
49 pending - admin seeded-data browser retest needs local Supabase
50 pending - owner empty/first-run browser retest needs local Supabase
51 pending - lead queue source/status browser QA remains
52 pending - lead detail next-action browser QA remains
53 pending - owner notes/history review after seeded QA remains
55 pending - draft review/copy affordance browser QA remains
59 pending - business-profile density browser QA remains
60 pending - Quote Setup long-form ergonomics browser QA remains
61 pending - protected-route keyboard/focus browser audit remains
62 pending - admin detail overflow browser QA remains
63 pending - admin activity dense/empty QA remains
64 partial - validation dashboard remains spec-only until real usage
65 pending - owner help microcopy should follow observed dashboard QA gaps
66 pending for dashboard - protected route screenshot matrix waits for local QA
67 blocked - dashboard smoke waits for confirmed local Supabase
77 blocked - first-party analytics sink requires owner approval
78 blocked - live public event tracking waits for approved sink
89 blocked - strict restored app/dashboard/RLS proof required before paid pilot
90 blocked - local DB/RLS verification waits for confirmed local target
93-100 future-blocked - email automation, messaging, booking, payments, team access, multi-vertical, autonomous AI
```

## Current Priority Order

```text
P0 - Do not use real customer data.
P0 - Do not charge or call this a paid pilot.
P0 - Do not run mutating dashboard smoke against managed/non-local Supabase.
P1 - Confirm local/synthetic Supabase, then run dashboard/admin smoke and browser QA.
P1 - Complete protected-route accessibility/focus QA after authenticated local QA is safe.
P2 - Optional public polish: breadcrumbs, more local cleaning scenarios, pilot microcopy.
P2 - Analytics sink only after explicit owner approval.
P3 - Future product families remain blocked until cleaning validation proves demand.
```

## Verification Baseline Through Phase 25V

```text
Phase 25T:
git diff --check PASS
pnpm test:unit PASS - 198 tests
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
public/responsive/ui-matrix smoke PASS
public geometry matrix PASS - 104 states, 0 failures

Phase 25U:
git diff --check PASS
pnpm test:unit PASS - 198 tests
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
public smoke PASS - 14/14
responsive smoke PASS - 25/25
ui-matrix PASS - final failures 0
/faster-quote-replies geometry/screenshot QA PASS

Phase 25V:
git diff --check PASS
pnpm test:unit PASS - 199 tests
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
```

## Decision

Public website finalization is now substantially complete for the current
manual-first, cleaning-first, founder-led validation stage. The next real
product acceptance step is not more public copy; it is confirmed local Supabase
plus authenticated dashboard/admin browser QA. Without that local target, only
non-mutating source-level preparation should continue.
