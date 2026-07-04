# Phase 25R - Homepage Hero Bilingual Visual Polish

Date: 2026-07-04

## Scope

Phase 25R closed the highest-value safe public-site gap from Phase 25Q:
homepage hero first impression, bilingual scan quality, and visual proof
hierarchy. This phase did not add product scope, automation, billing, booking,
messaging, analytics sinks, real customer data, or paid-pilot approval.

## Implemented

- Reframed the homepage hero headline as a short category promise:
  "Cleaning quote recovery." and "Récupération de soumissions."
- Rewrote the EN/fr-CA hero body and bullets around owner-reviewed quote
  recovery instead of generic AI or broad CRM positioning.
- Added a three-part hero proof rail before the visual mockup:
  capture, triage, and owner-reviewed reply.
- Tightened desktop hero title sizing so 1366px EN/fr-CA first-fold layouts no
  longer feel heavy or crowded.
- Stacked the proof rail on mobile so labels and values do not squeeze or
  overlap in fr-CA.
- Shortened the desktop header pilot CTA and reduced the brand minimum width so
  the public nav stays stable at the 1240px desktop breakpoint.
- Added source and smoke coverage for the new hero copy, proof rail, and
  header behavior.

## Product Truth Preserved

- BizPilot remains cleaning-first quote recovery and lead recovery, not a full
  CRM, booking platform, payment system, or autonomous operator.
- AI remains owner-reviewed: draft, summarize, recommend, and prepare only.
- Public copy still states no auto-send.
- Real customer data remains blocked until Phase 24G explicit owner approval.
- Paid pilot remains blocked until support, payment/refund, rollback,
  restored-app/RLS, and readiness gates close.

## Visual QA

Playwright Chrome checks were run against a fresh local Next dev server on
`http://127.0.0.1:3037`.

| View | Result |
|---|---|
| EN desktop 1366x768 | PASS - no horizontal overflow, title 96px high, proof rail inside viewport |
| fr-CA desktop 1366x768 | PASS - no horizontal overflow, title 96px high, proof rail inside viewport |
| EN mobile 390x844 | PASS - no horizontal overflow, title 28px high, proof rail stacked |
| fr-CA mobile 390x844 | PASS - no horizontal overflow, title 55px high, proof rail stacked |

Manual screenshot review of the fr-CA desktop and mobile first fold confirmed
that the hero, proof rail, CTA row, no-auto-send note, and chaos-to-clarity
mockup remain readable without text overlap.

## Backlog Items Advanced

```text
21 done - homepage headline and first-impression polish completed
37 done - hero slogan hierarchy now has short category headline plus outcome body
45 reinforced - EN/fr-CA hero parity preserved with source and smoke checks
47 reinforced - generic AI language reduced in the first fold
66 prepared - screenshot/geometry QA captured locally for public hero views
74 preserved - no booking, price, or availability confirmation implied
89 preserved - paid-pilot restored-app/RLS blocker remains open
90 preserved - no database/RLS proof was claimed
93-100 preserved - future email, messaging, booking, payments, team access, multi-vertical, and autonomous AI remain blocked
```

## Verification

```text
git diff --check PASS
pnpm test:unit PASS
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
pnpm smoke:public -- --base-url=http://127.0.0.1:3037 PASS
pnpm smoke:responsive -- --base-url=http://127.0.0.1:3037 PASS
pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3037 --timeout-ms=60000 PASS
Playwright Chrome hero geometry QA PASS
```

Note: one UI-matrix run on a hot-reloaded dev server returned a transient Next
dev "module factory is not available" 500. The server was restarted and the
same UI-matrix command passed with `Final UI matrix failures: 0`.

## Next Recommended Slice

Phase 25S should polish `/demo` with more product-real owner-inspection visuals:
what the cleaning owner sees, checks, copies, and follows up on. That can
improve conversion without crossing real-data, automation, booking, payment, or
paid-pilot gates.
