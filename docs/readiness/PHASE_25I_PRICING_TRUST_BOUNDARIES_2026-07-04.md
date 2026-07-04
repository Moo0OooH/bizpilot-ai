# Phase 25I - Pricing Trust Boundaries

Date: 2026-07-04
Repo: `E:\bizpilot-ai`
Branch: `main`

## Decision

Tighten public pricing and pilot-application trust boundaries without changing
the staged pilot prices or enabling payment collection.

The pricing page now explains what must be agreed before any paid pilot starts:
manual payment, support/refund expectations, and narrow product scope.

## What Changed

- Added localized `pricing.trustBoundary` copy.
- Rendered a `/pricing` trust-boundary section for:
  - manual payment only
  - support and refund terms before payment
  - quote-recovery scope instead of booking, invoicing, SMS/WhatsApp, or CRM
- Added a pilot next-step that support, refund, and payment expectations are
  confirmed before any paid pilot.
- Added source/unit guards that lock the section to localized public copy and
  prevent self-serve/payment-automation claims.

## Product Boundary

This does not approve paid pilot launch, production payment processing,
self-serve checkout, billing automation, booking, invoicing, SMS/WhatsApp,
autonomous AI, or real customer data. It only clarifies the manual approval and
terms boundary before a paid pilot can start.

## Backlog Items Advanced

```text
25 done
26 advanced
43 reinforced
83 prepared
84 prepared
90 preserved
93 preserved
```

## Verification

```text
git diff --check PASS
pnpm test:unit PASS
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
pnpm smoke:public -- --base-url=http://127.0.0.1:3032 PASS
pnpm smoke:responsive -- --base-url=http://127.0.0.1:3032 PASS
pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3032 PASS
```
