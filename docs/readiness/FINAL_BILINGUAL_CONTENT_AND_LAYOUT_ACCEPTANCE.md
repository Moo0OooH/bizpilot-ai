# Final Bilingual Content And Layout Acceptance

Date: 2026-06-21

Status: PASS for public-site bilingual content, layout, theme, and production
acceptance before Dashboard D1.

Dashboard D1 status: GO only after owner acceptance of this production evidence.
Dashboard D1 was not started in this phase.

## Scope

Accepted public scope:

- Marketing routes: `/`, `/features`, `/industries/cleaning`, `/trust`,
  `/demo`, `/pricing`, `/pilot`, `/content-studio`.
- Legal and policy routes: `/privacy`, `/security`, `/terms`.
- Auth shell routes: `/auth/sign-in`, `/auth/sign-up`,
  `/auth/forgot-password`, `/auth/reset-password`.
- Safe quote shells: `/quote`, inactive quote route,
  `/quote/phase1-unavailable-synthetic`, and safe fr-CA quote render
  `/quote/akora?language=fr-CA`.
- Languages: `en` and `fr-CA`.
- Representative themes: Light and Dark.
- Viewports recorded by the final matrix: 320x568, 360x800, 390x844, 430x932,
  844x390, 768x1024, 1024x768, 1280x720, 1366x768, 1440x900, 1920x1080.

Out of scope and still blocked:

- Dashboard D1 implementation.
- Auth behavior changes, RLS changes, database/schema changes, migrations, AI
  provider behavior changes, billing/payment automation, and production
  data-flow expansion.
- Real customer data and paid pilot execution.

## Product Truth

BizPilot AI remains manual-first, cleaning-first, owner-controlled lead recovery
for cleaning businesses.

Approved loop:

```text
Public quote intake -> lead organization -> AI summary/draft -> owner review -> manual copy/send
```

Accepted copy does not claim auto-send, SMS/WhatsApp automation, automatic
booking confirmation, invented pricing or availability, invoicing, a full CRM,
guaranteed revenue, or active multi-industry operation.

## Git And Deployment Confirmation

| Item | Value |
| --- | --- |
| Repository | `https://github.com/Moo0OooH/bizpilot-ai.git` |
| Branch | `main` |
| Working tree before F6 report/evidence update | Clean |
| Local HEAD before F6 report/evidence update | `bf827a9dbb6d4a038b1fb899e0156bec8ba7869f` |
| `origin/main` before F6 report/evidence update | `bf827a9dbb6d4a038b1fb899e0156bec8ba7869f` |
| Production URL | `https://bizpilo.com` |
| Production implementation commit verified | `bf827a9dbb6d4a038b1fb899e0156bec8ba7869f` |
| GitHub/Vercel status context | `Vercel` |
| GitHub/Vercel status | `success` |
| Vercel deployment target | `https://vercel.com/moo0ooohs-projects/bizpilot-ai/BHvX3t8LTLmSC9nmniNvohXAtbeC` |
| Mixed deployment check | PASS: production smokes and visual evidence were captured from the same production URL after the Vercel success status for the verified implementation commit. |

`gh` and `vercel` CLIs were not installed in this local environment, so commit
metadata and the Vercel status context were verified through the GitHub
connector plus direct production smoke tests.

## Implementation Commits

| Phase | Commit | Result |
| --- | --- | --- |
| F0 final bilingual copy/UX contract | `97f1d843dd7ab43f52f280397a5314ea28a48987` | PASS |
| F1 canonical English public copy | `740fe641a399fdf06a696ccb04c8bba87c831eff` | PASS |
| F2 professional Canadian French public copy | `0809bea592e5b5c533420d5a3e55f2ca52e276e6` | PASS |
| F3 localization-aware public layout | `f85ac8b66265a6076fd79e8903a1a538e847dd16` | PASS |
| F4 public Light/Dark hierarchy | `543b0c3c1bf55570e0b41e1ba7282358ff170612` | PASS |
| F5 bilingual visual contracts and pseudolocale tests | `bf827a9dbb6d4a038b1fb899e0156bec8ba7869f` | PASS |
| F6 production acceptance report and evidence | This document/evidence commit | PASS after commit and push |

## Routes Changed Or Covered

Implementation phases updated the dictionary-backed public route content,
localized policy/auth/quote shells, shared marketing shell, pricing cards,
cleaning route service/detail layout, theme control, public Dark-mode token
mapping, and final smoke/unit contracts.

Accepted route families:

- `/`, `/features`, `/industries/cleaning`, `/trust`, `/demo`, `/pricing`,
  `/pilot`, `/content-studio`
- `/privacy`, `/security`, `/terms`
- `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password`,
  `/auth/reset-password`
- `/quote`, `/quote/[slug]`, `/quote/[slug]/success`, inactive/unavailable
  quote shells
- localized metadata, sitemap, robots, canonical and hreflang output

## Canonical Copy Summary

English now uses one stable public position:

- Stop losing cleaning quote requests to slow replies.
- Capture quote requests, organize leads, and prepare replies for owner review.
- AI drafts, but the owner reviews, edits, copies, and sends manually.
- No auto-send, no invented price, no booking confirmation.
- Pricing is pilot-stage, approval-gated, and manually billed after readiness
  approval.
- Content Studio remains roadmap-only and owner-reviewed.

fr-CA preserves the same intent and product boundaries without literal,
English-shaped phrasing. French copy is shorter where needed, but the manual
owner-control boundary remains visible.

## fr-CA Glossary

| Concept | Accepted fr-CA |
| --- | --- |
| Cleaning business | entreprise de nettoyage |
| Quote request | demande de soumission |
| Quote | soumission |
| Lead | prospect |
| Lead recovery | suivi des demandes |
| Owner workspace | espace de travail |
| Owner-reviewed | validé par vous / à valider par vous |
| AI draft | brouillon IA / brouillon suggéré |
| Manual copy/send | copie et envoi manuels |
| No auto-send | aucun envoi automatique |
| Founder pilot | projet pilote / pilote fondateur where compact |
| Manual billing after approval | facturation après approbation |

Official French names and accents are preserved, including:

- `Commission d'accès à l'information du Québec`
- `Commissariat à la protection de la vie privée du Canada`

## Before And After Examples

| Area | Before | After |
| --- | --- | --- |
| Product promise | Mixed "owner-reviewed AI drafts" wording could read as broader automation. | Stable boundary: AI drafts; owner reviews, copies, and sends manually. |
| Homepage fr-CA hero | Longer literal French copy created first-fold pressure. | `Ne perdez plus de soumissions faute de réponse rapide.` |
| Pricing cards | French card content could make plan CTAs drift. | Three equal plan cards with anchored CTAs and matched card bottoms. |
| Cleaning route | Large service groups made scanning heavy. | Six compact service cards plus one shared detail region. |
| Dark theme | Some Light utility panels had weak Dark-mode mappings. | Explicit public Dark-mode mappings keep contrast and geometry stable. |
| Pseudolocale | Earlier pseudo output did not force real expansion accents. | Test-only `en-XA` expands with accented characters while preserving tokens. |

## Verification Results

Production checks on `https://bizpilo.com`:

| Command | Result |
| --- | --- |
| `pnpm smoke:public -- --base-url=https://bizpilo.com --timeout-ms=20000` | PASS: 9 passed, 0 failed |
| `pnpm smoke:responsive -- --base-url=https://bizpilo.com` | PASS: 16 routes, 0 failures |
| `pnpm smoke:quote -- --base-url=https://bizpilo.com --inactive-slug=phase1-unavailable-synthetic --timeout-ms=20000` | PASS: 1 passed, 0 failed |
| `pnpm smoke:ui-matrix -- --base-url=https://bizpilo.com --en-quote-url=https://bizpilo.com/quote/phase1-unavailable-synthetic --fr-quote-url=https://bizpilo.com/quote/akora?language=fr-CA --timeout-ms=20000` | PASS: final UI matrix failures 0 |

Local verification completed during F5:

| Command | Result |
| --- | --- |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test:unit` | PASS: 132 tests |
| `pnpm verify` | PASS |
| `pnpm smoke:public` | PASS |
| `pnpm smoke:responsive` | PASS |
| `pnpm smoke:quote -- --inactive-slug=phase1-unavailable-synthetic` | PASS |
| `pnpm smoke:ui-matrix` | PASS: final UI matrix failures 0 |
| `git diff --check` | PASS |

F6 report/evidence verification completed with `pnpm verify`, the production
smokes above, refreshed production screenshots/metrics, and `git diff --check`
passing before this document was committed.

`pnpm smoke:dashboard` remains intentionally not run against production-like
credentials because it can create synthetic workspace data.

## Visual Evidence

Evidence directory:

`docs/readiness/final-bilingual-content-layout-acceptance-2026-06-21/`

Production visual evidence file:

- `production-visual-evidence.json`

Captured screenshots:

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

Visual evidence summary:

- Checked pages: 10 representative production pages.
- Visual evidence failure count: 0.
- Root horizontal overflow: 0 observed failures.
- Browser console/page errors: 0 observed failures.
- Compact main controls/CTAs: 0 observed overflow failures.
- Homepage primary CTA visible in first fold at 1280x720 for EN/fr-CA Light
  and fr-CA Dark.
- Pricing fr-CA Light/Dark: 3 plan cards; card bottoms aligned.
- Cleaning fr-CA desktop: 6 compact service cards plus shared detail region.
- Quote fr-CA mobile: one visible consent checkbox block; honeypot is hidden
  and `tabIndex=-1`.

Manual visual spot checks were performed on the new production screenshots for
fr-CA homepage Light, fr-CA pricing Dark, fr-CA cleaning Light, and fr-CA quote
mobile. No blank pages, incoherent overlap, unreadable Dark-mode panel, CTA
loss, or page-level horizontal overflow was observed.

## Pseudolocale Results

F5 added and verified a test-only `en-XA` pseudolocale contract:

- `en-XA` is not in production `supportedLanguages`.
- `en-XA` is not in language definitions, the language menu, sitemap, or
  visible production HTML.
- Production request `/?language=en-XA` falls back to English.
- Pseudolocalized strings expand 35-45% and include accented expansion
  characters.
- Protected tokens such as `{ownerName}`, URLs, percentage tokens, and prices
  remain preserved.

## Explicit Acceptance Answers

| Question | Answer |
| --- | --- |
| 1. Is canonical English complete and consistent? | Yes. English copy is dictionary-backed and consistent with the final product truth. |
| 2. Does fr-CA preserve the same intent and product boundaries? | Yes. fr-CA preserves manual owner review, no auto-send, no invented prices, and pilot gating. |
| 3. Are prohibited literal French phrases left? | No. Unit/source tests and production matrix checks reject stale literal/hybrid terms and no-accent fallbacks. |
| 4. Are compact UI strings one line at required reference widths? | Yes for required CTAs, controls, plan labels, badges, and quote/auth controls. No compact main-control overflow was observed in F6 visual evidence. |
| 5. Is hero stable EN/fr-CA? | Yes. EN and fr-CA heroes render without root overflow and keep the primary CTA visible at required desktop reference sizes. |
| 6. Are CTAs visible at 1280x720 and 1366x768? | Yes. Hero CTAs are visible at 1280x720; cleaning and pricing CTAs remain visible/aligned in captured desktop evidence. |
| 7. Are card title/body budgets respected? | Yes. Pricing, cleaning, and homepage repeated card decks respect the approved line and geometry budgets. |
| 8. Does Cleaning use six compact cards plus shared detail region? | Yes. Production and source contracts show six `.cleaning-service-card` items plus the shared detail tabs/accordion region. |
| 9. Is all essential content preserved without nested scroll? | Yes for accepted public surfaces. No nested main scroller failures were recorded in F6 visual evidence. |
| 10. Does Dark preserve geometry/readable contrast? | Yes. Dark-mode production screenshots and source contracts show stable geometry and readable semantic surfaces. |
| 11. Are official French names/accents correct? | Yes. The accepted policy/legal copy preserves official French names and accented public copy. |
| 12. Is quote consent shown once and the honeypot hidden? | Yes. F6 visual evidence records one visible consent checkbox block and a hidden `companyWebsite` honeypot with `tabIndex=-1`. |
| 13. Does production match the pushed commit? | Yes for the pushed implementation commit `bf827a9dbb6d4a038b1fb899e0156bec8ba7869f`; GitHub reports Vercel success for that commit and production smokes pass on `https://bizpilo.com`. |

## Remaining Limitations

- Privacy and Terms still require appropriate professional legal review before
  real customer data or any paid pilot.
- Real customer data remains NO-GO until explicit owner approval is recorded.
- Paid pilot remains NO-GO until payment, support, rollback, legal, and owner
  readiness gates close.
- Billing/payment automation remains NO-GO.
- Auth/RLS/database/schema work remains NO-GO for the next dashboard visual
  phase unless separately approved.
- AI provider behavior changes remain NO-GO.
- Production data-flow expansion remains NO-GO.
- This phase verified public surfaces and safe quote shells only; it did not
  submit public quote forms or mutate production customer/workspace data.

## Acceptance Decision

Public bilingual content and layout acceptance: GO.

Dashboard Phase D1 - dashboard shell and lead workflow visual stabilization:
GO after owner acceptance of this F6 production evidence.

Real customer data, paid pilot, billing automation, production data-flow
expansion, auth/RLS/database work, and AI provider behavior changes: NO-GO.

Stop point: Push this F6 report/evidence commit and do not start Dashboard D1.
