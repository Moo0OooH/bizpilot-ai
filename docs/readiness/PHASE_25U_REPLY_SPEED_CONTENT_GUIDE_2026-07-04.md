# Phase 25U - Reply-Speed Content Guide

Date: 2026-07-04

## Scope

Phase 25U closes the safest remaining public growth gap after the final visual
matrix: a practical, bilingual reply-speed guide for cleaning quote requests.
The goal is to give cleaning owners useful education and a lean content calendar
without adding automation, analytics, booking, payment, real customer data, or
paid-pilot approval.

Dashboard/admin browser QA remains blocked until a confirmed local Supabase
target exists.

## Implemented

- Added `/faster-quote-replies` as a canonical public route.
- Added EN/fr-CA dictionary copy for:
  - faster quote replies without auto-send,
  - a static owner review board,
  - capture, triage, draft, and review workflow steps,
  - safer fast-reply checklist,
  - four-week reply-speed content and operations calendar,
  - explicit no-auto-send/no-booking/no-price/no-proof guardrails.
- Linked `/quote-link-guide` to the new reply-speed guide.
- Added `/faster-quote-replies` to canonical URLs, sitemap, hreflang metadata,
  proxy language handling, public smoke, responsive smoke, and final UI matrix
  coverage.
- Added source guards so the route stays dictionary-owned, bilingual, visually
  structured, and manual-first.

## External Baseline Rechecked

The page follows the same current public-growth standard used earlier in Phase
25: helpful, crawlable, people-first content rather than generic AI filler.

References:

```text
Google Search Central - AI optimization guidance
https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

Google Search Central - helpful, reliable, people-first content
https://developers.google.com/search/docs/fundamentals/creating-helpful-content
```

## Product Truth Preserved

- BizPilot remains cleaning-first quote recovery and lead recovery.
- Faster replies are framed as a process target, not a revenue guarantee.
- AI remains assistant-only: summarize, draft, and recommend for owner review.
- The guide does not promise automatic email, SMS, WhatsApp, Instagram, or
  customer messaging.
- The guide does not confirm price, availability, booking, scheduling, or
  payment.
- No analytics sink was enabled.
- Real customer data and paid pilot gates remain blocked.

## Visual QA

Playwright Chrome checks were run against local Next on
`http://127.0.0.1:3041`.

| View | Result |
|---|---|
| EN desktop 1366x768 | PASS - no overflow, H1 93px high, board inside viewport |
| fr-CA desktop 1366x768 | PASS - no overflow, H1 93px high, board inside viewport |
| EN mobile 390x844 | PASS - no overflow, H1 109px high, board inside viewport |
| fr-CA mobile 390x844 | PASS - no overflow, H1 109px high, board inside viewport |

Manual screenshot review of EN desktop and fr-CA mobile confirmed that the hero,
CTA row, owner review board, and first workflow band remain readable without
text overlap. The black local `N` overlay in screenshots is an external tooling
overlay, not project UI.

## Backlog Items Advanced

```text
38 done - practical reply-speed guide now exists as a public route
39 done - lean local acquisition/content plan added as a four-week calendar
40 done - reply-speed education content added
45 reinforced - EN/fr-CA copy, metadata, smoke, and UI matrix coverage added
46 done - lean content calendar packaged in the route
47 reinforced - copy stays quote-recovery specific and avoids commodity AI claims
66 reinforced - route geometry and screenshot review completed for EN/fr-CA
74 preserved - no booking, price, or availability confirmation implied
77 preserved - no analytics sink enabled
78 preserved - no live public event tracking enabled
82 reinforced - demo and content now share the owner-review run-of-show
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
pnpm smoke:public -- --base-url=http://127.0.0.1:3040 PASS - 14/14
pnpm smoke:responsive -- --base-url=http://127.0.0.1:3040 PASS - 25/25
pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3040 --timeout-ms=60000 PASS - final failures 0
Playwright Chrome /faster-quote-replies geometry QA PASS
Playwright screenshot review PASS - EN desktop and fr-CA mobile
```

## Next Recommended Slice

Phase 25V can prepare protected-route accessibility and dashboard visual-review
criteria at source level, but mutating dashboard smoke and authenticated
browser QA should still wait for confirmed local Supabase.
