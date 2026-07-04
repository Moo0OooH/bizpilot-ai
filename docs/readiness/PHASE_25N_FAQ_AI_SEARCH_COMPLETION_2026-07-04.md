# Phase 25N - FAQ And AI-Search Completion

Date: 2026-07-04
Repo: `E:\bizpilot-ai`
Branch: `main`

## Decision

Complete the FAQ AI-search/content gap without overclaiming FAQ rich results,
rankings, AI Overview visibility, or any autonomous product behavior.

Phase 25A already added FAQPage JSON-LD and breadcrumb JSON-LD on `/faq`.
Phase 25N expands the actual answer content around the owner questions most
likely to matter before a cleaning-business pilot conversation.

## Sources Reviewed

Reviewed on 2026-07-04:

- Google structured data intro:
  `https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data`
- Google Search structured data gallery:
  `https://developers.google.com/search/docs/appearance/structured-data/search-gallery`
- Google FAQ rich result change notice:
  `https://developers.google.com/search/blog/2023/08/howto-faq-changes`
- Google people-first helpful content:
  `https://developers.google.com/search/docs/fundamentals/creating-helpful-content`
- Google AI-search optimization guide:
  `https://developers.google.com/search/docs/fundamentals/ai-optimization-guide`

## What Changed

- Expanded `lib/i18n/public-site-copy.ts` FAQ content in both EN and fr-CA.
- Kept the existing five-section FAQ structure so the layout and localized copy
  shape remain stable.
- Added owner-intent FAQ answers for:
  - BizPilot versus form builders,
  - SMS/WhatsApp/Instagram/email reply automation boundaries,
  - paid-pilot support/refund/payment prerequisites,
  - safe quote-source attribution and no analytics PII,
  - FAQ schema / AI-search visibility expectations.
- Kept `/faq` JSON-LD powered by the visible FAQ answers through
  `buildFaqPageJsonLd`.

## Product Boundary

The expanded FAQ still says:

- BizPilot is not a full CRM.
- BizPilot does not auto-send messages.
- BizPilot does not connect SMS, WhatsApp, Instagram, Facebook, or email
  accounts for automatic replies.
- BizPilot does not confirm bookings, schedules, deposits, prices, or invoices.
- Real customer data remains blocked until explicit approval.
- Paid pilot collection remains blocked until support, refund, payment,
  rollback, restored app/RLS, and real-data gates close.
- FAQPage JSON-LD does not guarantee indexing, rankings, rich results, AI
  Overviews, or AI Mode visibility.

## Backlog Items Advanced

```text
17 verified from Phase 25A and documented with current Google FAQ caveat
28 done
30 preserved
76 preserved
77 preserved
78 preserved
79 preserved
83 preserved as paid-pilot blocked
93 preserved
94 preserved
95 preserved
96 preserved
97 preserved
100 preserved
```

## Verification

```text
git diff --check PASS
pnpm test:unit PASS
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
pnpm smoke:public -- --base-url=http://127.0.0.1:3035 PASS
pnpm smoke:responsive -- --base-url=http://127.0.0.1:3035 PASS
pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3035 --timeout-ms=60000 PASS
```
