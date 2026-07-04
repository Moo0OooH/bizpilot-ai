# Phase 25F - Workflow-Led Public Copy

Date: 2026-07-04
Repo: `E:\bizpilot-ai`
Branch: `main`

## Decision

Tighten the public feature and cleaning-industry copy around the actual
BizPilot workflow:

```text
capture -> organize/source -> draft -> owner review/copy/send -> follow up
```

This improves buyer clarity without adding new product promises.

## What Changed

- Reworked feature-card copy from generic feature labels into the manual quote
  recovery workflow:
  - Capture requests where customers already find the business.
  - Organize each request before it becomes inbox work.
  - Keep source context visible on the lead.
  - Prepare the first reply without inventing details.
  - Review, copy, and send manually.
  - Keep follow-up from disappearing.
- Updated the product proof strip to mention service, source, timing, missing
  details, draft review, manual send, and follow-up visibility.
- Updated the cleaning-industry page copy to call out residential, office,
  move-out, deep-clean, and recurring quote requests.
- Updated cleaning workflow copy so the path starts from the quote link and
  ends with owner review, copy, and manual send.
- Added source guards so future copy changes do not drift back to generic AI or
  booking/auto-send claims.

## Product Boundary

This is copy/positioning only. It does not enable booking, invoicing, SMS,
WhatsApp, autonomous sending, broad CRM behavior, integrations, analytics
charts, or real customer data.

## Backlog Items Advanced

```text
23 done
24 advanced
37 advanced
41 reinforced
47 advanced
51 reinforced
54 reinforced
74 preserved
```

## Verification

```text
git diff --check PASS
pnpm test:unit PASS
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
```
