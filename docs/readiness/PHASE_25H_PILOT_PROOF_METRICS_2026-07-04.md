# Phase 25H - Pilot Proof Metrics

Date: 2026-07-04
Repo: `E:\bizpilot-ai`
Branch: `main`

## Decision

Add a public proof architecture for the founder pilot without inventing
testimonials, revenue claims, conversion lifts, or customer results.

BizPilot can improve conversion by showing what the pilot will measure, but it
must stay honest until real customer proof exists. The proof section therefore
frames measurable learning targets rather than performance outcomes.

## What Changed

- Added localized `pilot.proof` copy to the public-site dictionary.
- Added four pilot learning metrics:
  - response speed
  - missing-detail clarity
  - follow-up visibility
  - source context
- Rendered the metrics on `/pilot` below the application-template card.
- Added an explicit guardrail that the metrics are not testimonials,
  conversion-rate claims, or a performance guarantee.
- Added source/unit guards so the pilot page keeps using localized copy and
  does not introduce a submitting form or fake proof.

## Product Boundary

This does not approve real customer data, paid pilot launch, auto-send,
booking, invoicing, SMS/WhatsApp, autonomous AI, guaranteed revenue, guaranteed
leads, or fake testimonials. It only defines the honest proof framework that a
founder-led pilot should collect.

## Backlog Items Advanced

```text
22 done
43 reinforced
44 done
79 prepared
80 prepared
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
pnpm smoke:public -- --base-url=http://127.0.0.1:3031 PASS
pnpm smoke:responsive -- --base-url=http://127.0.0.1:3031 PASS
pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3031 PASS
```
