# Phase 25S - Product-Real Demo Visual Polish

Date: 2026-07-04

## Scope

Phase 25S upgrades `/demo` from a text-heavy walkthrough into a product-real,
static owner-view preview. The goal is to help cleaning owners see the actual
quote recovery moment faster: quote link, organized lead, missing details, AI
summary, reply draft, and owner-controlled manual actions.

This phase did not add real customer data, dashboard writes, analytics sinks,
automation, messaging, booking, payment collection, or paid-pilot approval.

## Implemented

- Added a static owner-view demo workspace on `/demo`.
- Added dictionary-owned EN/fr-CA copy for:
  - public quote link preview,
  - organized move-out cleaning lead,
  - missing details before a responsible quote,
  - AI summary,
  - reply draft for owner review,
  - review/copy/mark-contacted actions,
  - visible demo/no-auto-send/no-price/no-booking guardrails.
- Shortened the `/demo` H1 to a category-led promise:
  "Cleaning quote recovery demo." and "Démo de récupération de soumission."
- Added `/demo` to public route smoke coverage.
- Updated responsive smoke and unit guards so the product-real demo workspace
  cannot disappear silently.
- Kept the existing four-chapter narrative below the owner-view preview for
  readers who want the step-by-step explanation.

## Product Truth Preserved

- Demo content is static and clearly labeled as sample/demo state.
- The reply is still a draft for owner review.
- The visible actions are review, copy, and mark-contacted; no automatic send is
  promised.
- The demo does not invent price, confirm availability, confirm booking, claim
  SMS/WhatsApp automation, or present BizPilot as a full CRM.
- Paid pilot, real customer data, and local RLS/restored-app proof gates remain
  open.

## Visual QA

Playwright Chrome checks were run against local Next on
`http://127.0.0.1:3038`.

| View | Result |
|---|---|
| EN desktop 1366x768 | PASS - no horizontal overflow, H1 47px high, workspace inside viewport width |
| fr-CA desktop 1366x768 | PASS - no horizontal overflow, H1 93px high, workspace inside viewport width |
| EN mobile 390x844 | PASS - no horizontal overflow, H1 73px high, workspace inside viewport width |
| fr-CA mobile 390x844 | PASS - no horizontal overflow, H1 109px high, workspace inside viewport width |

Manual screenshot review of EN desktop and fr-CA mobile confirmed no text
overlap in the hero, guardrail chips, quote-link panel, or owner-view preview.

## Backlog Items Advanced

```text
27 done - /demo now shows product-real owner-view visuals
45 reinforced - EN/fr-CA demo copy and layout parity guarded
47 reinforced - demo copy leads with quote recovery, not generic AI language
66 prepared - public demo screenshot/geometry QA captured locally
74 preserved - no booking, price, or availability confirmation implied
82 reinforced - public demo now matches the owner-review run-of-show more closely
89 preserved as paid-pilot blocker
90 preserved; no local RLS/database proof was claimed
93-100 preserved - future email, messaging, booking, payments, team access, multi-vertical, and autonomous AI remain blocked
```

## Verification

```text
git diff --check PASS
pnpm test:unit PASS
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
pnpm smoke:public -- --base-url=http://127.0.0.1:3038 PASS
pnpm smoke:responsive -- --base-url=http://127.0.0.1:3038 PASS
pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3038 --timeout-ms=60000 PASS
Playwright Chrome /demo geometry QA PASS
```

## Next Recommended Slice

Phase 25T should capture the final public smoke/screenshot matrix across the
highest-value public routes, then decide whether to continue to dashboard/admin
browser QA once a confirmed local Supabase target exists.
