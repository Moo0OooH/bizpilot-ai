# Final Bilingual Content and Layout Acceptance

Date: 2026-06-21

Status: PASS for public-site bilingual content and layout acceptance.

This document closes the final localization, copy, sizing, and visual acceptance
program for the BizPilot AI public surface before Dashboard Phase D1.

## Scope

Accepted scope:

- Public marketing routes: `/`, `/features`, `/industries/cleaning`, `/trust`,
  `/demo`, `/pricing`, `/pilot`, `/content-studio`.
- Legal/policy routes: `/privacy`, `/security`, `/terms`.
- Auth shell routes: `/auth/sign-in`, `/auth/sign-up`,
  `/auth/forgot-password`, `/auth/reset-password`.
- Safe quote GET-only checks: inactive synthetic quote and existing safe
  fr-CA quote render.
- Languages: `en` and `fr-CA`.
- Themes: light and dark.
- Viewports: 320x568, 360x800, 390x844, 430x932, 844x390, 768x1024,
  1024x768, 1280x720, 1366x768, 1440x900, 1920x1080.

Out of scope and unchanged:

- Dashboard Phase D1 implementation.
- Auth behavior, RLS, database schema, migrations, AI provider behavior,
  billing/payment automation, production data-flow expansion.
- Real customer data and paid pilot execution.

## Product Truth

BizPilot AI remains manual-first, cleaning-first, owner-controlled lead
recovery for cleaning businesses.

AI drafts; the owner reviews, edits, copies, and sends manually.

The accepted public content does not claim auto-send, SMS/WhatsApp automation,
automatic booking confirmation, invoicing, a full CRM, guaranteed revenue, or
active multi-industry operation.

## Phase Record

| Phase | Commit | Result |
| --- | --- | --- |
| Pre-fix sizing and pricing stabilization | `d19ce5a` | PASS |
| Theme and policy copy hardening | `e500e09` | PASS |
| L0 canonical bilingual copy contract | `8c018ee` | PASS |
| L1 canonical English public content | `8e93876` | PASS |
| L2 professional Canadian French copy | `3afc698` | PASS |
| L3 localization-aware visual system | `8fc76b7` | PASS |
| L4 multilingual visual contracts | `6b817e1` | PASS |
| L5 production acceptance evidence | this document | PASS after commit/push |

## Canonical English Summary

The English public site now uses one clear product position:

- Stop losing cleaning quote requests to slow replies.
- Collect quote requests, organize leads, and draft fast
  owner-reviewed replies.
- No auto-send; the owner controls copy/send.
- Pricing is pilot-stage and approval-gated.
- Billing remains manual after readiness approval.
- Dashboard work is still visual/workflow stabilization, not production data
  expansion.

## fr-CA Glossary

The accepted fr-CA copy uses stable Canadian French terms:

| Concept | fr-CA term |
| --- | --- |
| Cleaning businesses | entreprises de nettoyage |
| Quote request | demande de soumission |
| Lead recovery | suivi des demandes |
| Owner-reviewed | validé par le propriétaire / validé par vous |
| AI draft | brouillon IA |
| Copy/send manually | copie et envoi manuels |
| No auto-send | aucun envoi automatique |
| Founder pilot | pilote fondateur |
| Manual billing after readiness approval | facturation après approbation |

The French copy is intentionally professional and compact. It does not mirror
English word-for-word when that would create longer, less natural text.

## Before/After Examples

| Area | Before | After |
| --- | --- | --- |
| fr-CA homepage hero | Long French headline caused larger vertical pressure. | Shorter, natural fr-CA headline: "Ne perdez plus de soumissions faute de réponse rapide." |
| Pricing | Plan cards had uneven card/body/button alignment. | Three plan cards are equal-width and equal-height with anchored CTAs. |
| Dark demo section | Reply draft card had low-contrast white text on pale surface. | Dark theme now keeps text readable and surfaces consistent. |
| Cleaning route | Three oversized category columns became visually heavy and uneven. | Six compact service cards plus a shared detail panel preserve scanability. |
| Language sizing | French text could wrap unpredictably against English layouts. | Copy-role classes and structured cards define per-role sizing and wrapping budgets. |

## Line-Budget And Geometry Results

Production visual evidence was captured from `https://bizpilo.com` after the
Vercel deployment for `6b817e1b0a95b76b5f2039762a3c89a69d5d9f2b` completed.

Measured results:

- Homepage EN 1280x720: no horizontal overflow; `scrollWidth=1280`,
  `clientWidth=1280`.
- Homepage fr-CA 1280x720 light/dark: no horizontal overflow;
  `scrollWidth=1280`, `clientWidth=1280`.
- Homepage fr-CA mobile 390x844: no horizontal overflow; `scrollWidth=390`,
  `clientWidth=390`.
- Pricing fr-CA light/dark: three cards measured `385x629`, same top and
  bottom positions.
- Cleaning fr-CA 1366x768: six compact service cards present, three per row on
  desktop; no horizontal overflow.
- Quote fr-CA mobile 390x844: no horizontal overflow.
- Auth sign-in mobile 390x844: no horizontal overflow.

## Pseudolocalization Results

L4 added a test-only `en-XA` pseudolocale contract.

Accepted behavior:

- `en-XA` is not in `supportedLanguages`.
- `en-XA` is not in `languageDefinitions`.
- `en-XA` is not exposed in the language menu, sitemap, or visible production
  HTML.
- Pseudolocalized copy expands English strings while preserving tokens such as
  `{ownerName}`, URLs, percentages, and pricing text.
- Production request `/?language=en-XA` falls back to English.

## Production Deployment

| Item | Value |
| --- | --- |
| Production alias | `https://bizpilo.com` |
| Verified code commit | `6b817e1b0a95b76b5f2039762a3c89a69d5d9f2b` |
| Local `main` before L5 docs commit | `6b817e1b0a95b76b5f2039762a3c89a69d5d9f2b` |
| `origin/main` before L5 docs commit | `6b817e1b0a95b76b5f2039762a3c89a69d5d9f2b` |
| GitHub status context | `Vercel` |
| GitHub/Vercel status | `success` |
| GitHub/Vercel description | `Deployment has completed` |
| Vercel status target | `https://vercel.com/moo0ooohs-projects/bizpilot-ai/9XRBqvKe381p4Lsku8m8Qhk8uok4` |
| GitHub Actions check | `App validation`, conclusion `success` |

## Verification Results

Production checks:

| Command | Result |
| --- | --- |
| `pnpm smoke:public -- --base-url=https://bizpilo.com --timeout-ms=20000` | PASS: 9 passed, 0 failed |
| `pnpm smoke:responsive -- --base-url=https://bizpilo.com` | PASS: 16 routes, 0 failures |
| `pnpm smoke:quote -- --base-url=https://bizpilo.com --inactive-slug=phase1-unavailable-synthetic --timeout-ms=20000` | PASS: 1 passed, 0 failed |
| `pnpm smoke:ui-matrix -- --base-url=https://bizpilo.com --en-quote-url=https://bizpilo.com/quote/phase1-unavailable-synthetic --fr-quote-url=https://bizpilo.com/quote/akora?language=fr-CA --timeout-ms=20000` | PASS: final UI matrix failures 0 |

Local checks from L4:

| Command | Result |
| --- | --- |
| `pnpm test:unit` | PASS: 128 tests |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm build` | PASS |
| `pnpm verify` | PASS |
| `pnpm smoke:public` | PASS |
| `pnpm smoke:responsive` | PASS |
| `pnpm smoke:quote -- --inactive-slug=phase1-unavailable-synthetic` | PASS |
| `pnpm smoke:ui-matrix` | PASS |

`pnpm smoke:dashboard` was intentionally not run because dashboard mutating
smoke is prohibited against production-like Supabase credentials.

## Screenshot Evidence

Evidence directory:

`docs/readiness/final-bilingual-content-layout-acceptance-2026-06-21/`

Files:

- `production-home-en-light-1280x720.png`
- `production-home-fr-ca-light-1280x720.png`
- `production-home-fr-ca-mobile-light-390x844.png`
- `production-home-fr-ca-dark-1280x720.png`
- `production-pricing-fr-ca-light-1280x720.png`
- `production-pricing-fr-ca-dark-1280x720.png`
- `production-cleaning-fr-ca-light-1366x768.png`
- `production-demo-dark-1280x720.png`
- `production-auth-sign-in-mobile-390x844.png`
- `production-quote-fr-ca-light-390x844.png`
- `production-visual-evidence.json`

## Remaining Limitations

- Real customer data remains NO-GO until Phase 24G explicit owner approval is
  recorded.
- Paid pilot remains NO-GO until payment/support/rollback readiness is recorded.
- Billing/payment automation remains NO-GO.
- Auth/RLS/database changes remain NO-GO for dashboard visual work.
- AI provider behavior changes remain NO-GO.
- Production data-flow expansion remains NO-GO.
- Restored app/dashboard/RLS proof remains required before paid pilot or risky
  production work.

## Acceptance Decision

Public bilingual content and layout acceptance: GO.

Dashboard Phase D1 - Dashboard shell and lead workflow visual stabilization:
GO after this L5 documentation commit is pushed, with the existing NO-GO
boundaries still active.

Real customer data, paid pilot, billing automation, production data-flow
expansion, auth/RLS/database work, and AI provider behavior changes: NO-GO.
