# Public Multilingual Theme And Policy Localization Fix

Date: 2026-06-21
Status: Local PASS; ready to deploy after normal push/deployment flow.
Scope: Public-site Dark theme contrast, fr-CA policy-page localization, and
expanded public responsive smoke coverage.

## Trigger

Owner-provided screenshots showed two remaining public-site quality risks after
the multilingual sizing/pricing pass:

- Dark theme contained unreadable mint/teal callout panels where Light-mode
  utility classes stayed bright while text inherited Dark-mode colors.
- Some fr-CA public policy pages still used no-accent fallback wording such as
  `Regles`, `securite`, `donnees reelles`, and `automation cachee`.

These issues made the site look unfinished and could weaken trust before the
dashboard D1 phase. This patch is limited to public UI/copy/theme quality. It
does not change database, auth, RLS, AI provider behavior, billing/payment
automation, real customer data, or production data flows.

## Reference Standard Updated

Updated active standard:

- `docs/product/BIZPILOT_MULTILINGUAL_RESPONSIVE_UI_STANDARD_v1.0.md`

The standard now explicitly requires Dark-mode mappings for Light utility
panels and WCAG-informed contrast checks when multilingual UI work is claimed
complete.

Additional references reviewed on 2026-06-21:

- W3C WCAG 2.2 contrast guidance.
- W3C WAI Understanding Success Criterion 1.4.3 Contrast (Minimum).

## Implementation Summary

Dark theme:

- Added scoped public Dark mappings for:
  - `bg-teal-50`
  - `border-teal-200`
  - `text-teal-700`
  - `bg-slate-950`
  - `text-white`
- The homepage product preview and cleaning before/after callout panels now use
  semantic Dark surfaces instead of bright Light-mode mint cards.

fr-CA policy copy:

- Restored accented public policy H1s:
  - `Règles de confidentialité pour la récupération des soumissions.`
  - `Frontières de sécurité avant les données réelles.`
  - `Conditions claires, sans automatisation cachée.`
- Replaced no-accent and partial-English visible policy wording with cleaner
  fr-CA equivalents while preserving product truth and legal caution.

Regression coverage:

- Added unit guards for fr-CA policy accent and meaning-equivalent text.
- Added source guards for public Dark-mode callout utility mappings.
- Added fr-CA `/privacy`, `/security`, and `/terms` routes to responsive smoke.

## Browser Visual Metrics

Local browser target:

```text
http://127.0.0.1:3000
```

Routes checked in the focused browser audit:

- `/?language=en`
- `/?language=fr-CA`
- `/industries/cleaning?language=en`
- `/industries/cleaning?language=fr-CA`
- `/privacy?language=fr-CA`
- `/security?language=fr-CA`
- `/terms?language=fr-CA`

Viewports:

- `1280x720`
- `390x844`

Final local browser findings:

| Check | Result |
| --- | --- |
| Root horizontal overflow | PASS |
| Homepage EN/fr-CA H1 line parity at 1280x720 | PASS: 3 / 3 |
| Homepage EN/fr-CA H1 line parity at 390x844 | PASS: 4 / 4 |
| Dark `bg-teal-50` public callout mappings | PASS: mapped to semantic Dark surface |
| Dark `text-teal-700` public callout label mapping | PASS: mapped to accent token |
| fr-CA policy H1 accents | PASS |
| Desktop repeated card-row height spread | PASS: no first-row spread in audited decks |

## Local Verification

Commands run locally on 2026-06-21:

| Command | Result |
| --- | --- |
| `pnpm test:unit` | PASS: 122 tests |
| `pnpm smoke:public` | PASS: 9 passed, 0 failed |
| `pnpm smoke:responsive` | PASS: 16 routes, 0 failures |
| `pnpm smoke:quote -- --inactive-slug=phase1-unavailable-synthetic` | PASS: 1 passed, 0 failed |
| `pnpm verify` | PASS: lint, typecheck, 122 unit tests, build |
| `git diff --check` | PASS |

## Dashboard Boundary

The standard update applies to dashboard D1, especially dashboard Light/Dark
surface parity. This patch does not begin dashboard implementation and does not
approve production data-flow expansion.

`pnpm smoke:dashboard` was intentionally not run because the current dashboard
smoke creates synthetic workspace data and must not be used with
production-like Supabase credentials.

## Decision

The remaining owner-reported public multilingual/dark-theme visual defects are
locally corrected and guarded. The next implementation phase remains:

```text
Phase D1 - Dashboard shell and lead workflow visual stabilization
```
