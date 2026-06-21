# Public Multilingual Responsive Stability Fix

Date: 2026-06-21
Status: Local PASS; ready to deploy after normal push/deployment flow.
Scope: Public-site EN/fr-CA sizing, pricing alignment, and canonical
multilingual responsive standard.

## Trigger

Owner-provided screenshots showed that the French public homepage and pricing
page did not keep the same visual rhythm as English:

- French homepage text wrapped more heavily than English.
- French hero and mockup labels made the first fold feel lower and denser.
- Pricing cards had uneven header rhythm and CTA placement.
- The project needed a reusable standard for multilingual sizing across public
  pages and upcoming dashboard D1 work.

This is a public visual/copy/layout correction only. It does not touch
database, auth, RLS, AI provider behavior, billing/payment automation, real
customer data, or production data flows.

## Reference Standard Added

New active product standard:

- `docs/product/BIZPILOT_MULTILINGUAL_RESPONSIVE_UI_STANDARD_v1.0.md`

Canonical docs now point to this standard for public-site and dashboard D1
EN/fr-CA sizing, card alignment, CTA anchoring, and multi-viewport parity.

## External Research Summary

References reviewed on 2026-06-21:

- W3C Internationalization text expansion guidance.
- Material Design localization principles.
- MDN CSS grid alignment and track sizing references.
- web.dev internationalization guidance.
- Crowdin and Localize localization QA guidance.
- Ben Myers multilingual accessibility guidance.

Shared conclusion: translated text must be handled through flexible components,
copy budgets, responsive layout testing, and target-language visual QA. Fixed
English-first widths, hidden overflow, and per-locale font shrinking are not
acceptable long-term fixes.

## Implementation Summary

Public copy changes:

- English homepage H1 shortened from "cleaning quote requests" to "cleaning
  quotes" to keep EN/fr-CA line parity.
- French homepage H1 replaced with a shorter claim-equivalent line:
  `Répondez plus vite aux demandes de nettoyage.`
- French hero CTAs and badges were shortened while preserving manual-first
  product truth.
- French hero mockup labels were shortened:
  `Nettoyage de départ`, `À répondre`.
- English and French pricing cohort/highlight labels were shortened to stay
  inside copy budgets.
- French pricing H1 was shortened to:
  `Tarifs pilotes simples pour le nettoyage.`

Layout changes:

- Added pricing title width control with `public-pricing-title`.
- Added pricing card hooks:
  - `public-pricing-grid`
  - `public-plan-card`
  - `public-plan-card-header`
  - `public-plan-card-price`
  - `public-plan-card-highlight`
  - `public-plan-card-features`
  - `public-plan-card-cta`
- Pricing card root remains flex-column.
- Pricing feature list grows naturally.
- Pricing CTA is anchored with `mt-auto`.
- Desktop pricing card heights and CTA top/bottom positions now align.

Regression coverage:

- Added EN/fr-CA hero and pricing copy budgets.
- Added source contracts for pricing card action anchoring and title hook.
- Added fr-CA pricing route to responsive smoke.

## Browser Visual Metrics

Local browser target:

```text
http://127.0.0.1:3000
```

Routes:

- `/?language=en`
- `/?language=fr-CA`
- `/pricing?language=en`
- `/pricing?language=fr-CA`

Viewports:

- `1280x720`
- `1440x900`
- `768x1024`
- `390x844`

Final local browser matrix:

| Viewport | Page | EN H1 lines | fr-CA H1 lines | Overflow | Desktop card/CTA alignment |
| --- | --- | ---: | ---: | --- | --- |
| 1280x720 | Home | 3 | 3 | PASS | N/A |
| 1280x720 | Pricing | 2 | 2 | PASS | PASS: card/CTA spread 0 |
| 1440x900 | Home | 3 | 3 | PASS | N/A |
| 1440x900 | Pricing | 2 | 2 | PASS | PASS: card/CTA spread 0 |
| 768x1024 | Home | 2 | 2 | PASS | Pricing stacked; no horizontal overflow |
| 768x1024 | Pricing | 2 | 2 | PASS | Stacked cards; CTA anchoring retained |
| 390x844 | Home | 4 | 4 | PASS | N/A |
| 390x844 | Pricing | 3 | 3 | PASS | Stacked cards; CTA anchoring retained |

Homepage hero CTA stayed visible in all tested homepage viewports.

## Local Verification

Commands run locally on 2026-06-21:

| Command | Result |
| --- | --- |
| `pnpm test:unit` | PASS: 120 tests |
| `pnpm smoke:public` | PASS: 9 passed, 0 failed |
| `pnpm smoke:responsive` | PASS: 13 routes, 0 failures |
| `pnpm smoke:quote -- --inactive-slug=phase1-unavailable-synthetic` | PASS: 1 passed, 0 failed |
| `pnpm verify` | PASS: lint, typecheck, 120 unit tests, build |
| `git diff --check` | PASS |

## Dashboard Boundary

The new standard applies to dashboard D1, but this fix did not redesign
dashboard surfaces. D1 should use the same rules for dashboard topbar, lead
queue cards, lead detail action panels, AI draft surfaces, and settings panels.

`pnpm smoke:dashboard` was intentionally not run because the current dashboard
smoke creates synthetic workspace data and must not be used with
production-like Supabase credentials.

## Decision

The owner-reported public multilingual sizing defects are locally corrected and
guarded by tests. Public deployment verification should be run after the commit
is deployed to production.
