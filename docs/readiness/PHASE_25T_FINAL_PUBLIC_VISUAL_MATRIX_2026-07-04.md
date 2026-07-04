# Phase 25T - Final Public Visual Matrix

Date: 2026-07-04

## Scope

Phase 25T rechecked the public marketing surface after the homepage and demo
polish in Phases 25R and 25S. The goal was to catch remaining bilingual visual
fit risks across the public website before moving back to dashboard/admin work.

This phase did not add product scope, real customer data, analytics sinks,
automation, messaging, booking, payment collection, or paid-pilot approval.

## Implemented

- Ran a local Playwright Chrome geometry matrix across 13 public routes,
  EN/fr-CA locales, light/dark themes, and mobile/desktop viewports.
- Shortened the `/comparison` EN/fr-CA H1 after the matrix showed the previous
  fr-CA mobile headline was close to the visual risk threshold.
- Updated public route and responsive smoke contracts for the new comparison
  headline.
- Preserved manual-first comparison copy in the supporting text: BizPilot is
  still positioned against CRMs, forms, booking tools, and manual inbox work
  without claiming to replace a full CRM or automate sending.

## Product Truth Preserved

- BizPilot remains cleaning-first quote recovery and lead recovery.
- The public website still avoids booking, pricing confirmation, payment
  collection, SMS/WhatsApp automation, and full-CRM replacement claims.
- AI remains assistant-only: summarize, draft, and recommend for owner review.
- Real customer data remains blocked until Phase 24G explicit owner approval.
- Paid pilot remains blocked until support, payment/refund, rollback,
  restored-app/RLS, and readiness gates close.
- Dashboard smoke remains local-Supabase-only before synthetic writes.

## Visual Matrix

Local Playwright Chrome matrix target:

```text
Routes: 13
Locales: en, fr-CA
Themes: light, dark
Viewports: 390x844 mobile, 1366x768 desktop
Total public states checked: 104
Failures: 0
```

Routes covered:

```text
/
/faq
/features
/comparison
/quote-link-guide
/industries/cleaning
/trust
/demo
/pricing
/pilot
/privacy
/security
/terms
```

Largest measured H1 heights after the comparison fix:

```text
Max mobile H1: 182px on /privacy?language=fr-CA
Max desktop H1: 140px on /faq?language=fr-CA and /pilot?language=fr-CA
/comparison mobile H1 after fix: 109px in both EN and fr-CA
/comparison desktop H1 after fix: 93px in both EN and fr-CA
```

The matrix found no horizontal overflow, no H1 threshold failure, and no hero
or guardrail text overlap across the checked public states.

## Smoke Evidence

```text
pnpm smoke:responsive -- --base-url=http://127.0.0.1:3039 PASS
pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3039 --timeout-ms=60000 PASS
pnpm smoke:public -- --base-url=http://127.0.0.1:3039 PASS on retry
```

Note: the first public smoke run on the hot dev server returned one transient
Next dev 500 on `/security`. The same public smoke command was retried against
the same local server and passed for all 13 routes.

## Backlog Items Advanced

```text
21 reinforced - homepage first impression remains visually checked after the final public matrix
27 reinforced - /demo product-real owner-view remains in public smoke and responsive coverage
37 reinforced - short public slogans and H1 hierarchy remain protected across routes
45 reinforced - EN/fr-CA public visual parity was checked across 104 states
47 reinforced - public copy stays quote-recovery specific and avoids generic AI positioning
66 done for public marketing routes - local screenshot/geometry matrix completed with zero failures
74 preserved - no booking, price, or availability confirmation implied
82 reinforced - public demo and owner-review run-of-show stay aligned
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
pnpm test:unit PASS - 198 tests
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
pnpm smoke:public -- --base-url=http://127.0.0.1:3039 PASS on retry
pnpm smoke:responsive -- --base-url=http://127.0.0.1:3039 PASS
pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3039 --timeout-ms=60000 PASS
Playwright Chrome final public geometry matrix PASS - 104 states, 0 failures
```

## Next Recommended Slice

Phase 25U should return to dashboard/admin browser QA only after the environment
is pointed at a confirmed local or synthetic Supabase target. If that target is
not available, the next safe non-mutating work is source-level prep for
protected-route accessibility and dashboard visual-review criteria, without
running mutating dashboard smoke against a managed Supabase project.
