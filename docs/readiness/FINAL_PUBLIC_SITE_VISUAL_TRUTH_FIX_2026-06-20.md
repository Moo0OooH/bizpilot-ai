# Final Public Site Visual Truth Fix - 2026-06-20

## Decision

**Local patch verification: PASS.**

**Dashboard D0 gate: pending production deployment verification.**

This phase does not approve real customer data, paid-pilot launch, payment
collection, billing automation, AI provider changes, auth changes, database
changes, RLS changes, production data-flow changes, or dashboard redesign work.

## Root Cause

Phase 11E checked whether the homepage CTA was technically visible, but the
threshold was too loose. In production, the fr-CA homepage hero still wrapped the
H1 into 5-6 lines at common desktop review sizes. The CTA remained barely
visible, but it sat too close to the fold and made the language switch feel like
a layout jump.

Primary source causes:

- The homepage H1 used a narrow `13ch` inline-size constraint.
- The hero visual column reserved too much desktop grid width.
- Short-height desktop viewports used the same vertical padding as taller
  screens.
- Content Studio six-card roadmap cards were visually balanced but title-only,
  leaving the section feeling thin.

## Routes Fixed Or Rechecked

- `/`
- `/?language=fr-CA`
- `/features`
- `/features?language=fr-CA`
- `/industries/cleaning`
- `/industries/cleaning?language=fr-CA`
- `/trust`
- `/trust?language=fr-CA`
- `/demo`
- `/demo?language=fr-CA`
- `/pricing`
- `/pricing?language=fr-CA`
- `/pilot`
- `/pilot?language=fr-CA`
- `/content-studio`
- `/content-studio?language=fr-CA`
- `/privacy`
- `/security`
- `/terms`
- `/auth/sign-in`
- `/auth/sign-up`
- `/auth/forgot-password`
- `/quote/akora?language=fr-CA` safe GET only

## Changes Made

- Reworked homepage hero sizing around named classes:
  - `homepage-hero-section`
  - `homepage-hero-grid`
  - `homepage-hero-title`
  - `homepage-hero-actions`
  - `homepage-hero-mockup`
- Removed the old `[max-inline-size:13ch]` hero title constraint.
- Added a short-height desktop media rule so `1280x720` and `1366x768` reduce
  hero padding instead of shrinking readable text.
- Tightened the desktop hero grid so the visual card no longer steals too much
  width from the bilingual headline.
- Converted Content Studio roadmap cards from title-only strings to title/body
  pairs in EN and fr-CA.
- Added source and smoke coverage for:
  - no stale raw `ENFR` control text,
  - no stale raw `System Light Dark` control text,
  - no missing-copy artifacts,
  - no auth marketing utility controls,
  - no regression to narrow homepage hero wrapping,
  - no Content Studio title-only six-card grid.

## EN/fr-CA Before And After

Production before patch, `https://bizpilo.com` at commit
`3991dcd5f7815835f77b3bed8546deb9540989af`:

| Route | Viewport | Hero Height | H1 Lines | CTA Bottom Margin |
| --- | ---: | ---: | ---: | ---: |
| `/?language=en` | `1280x720` | 671px | 4 | 82px |
| `/?language=fr-CA` | `1280x720` | 782px | 5 | 15px |
| `/?language=en` | `1366x768` | 696px | 4 | 109px |
| `/?language=fr-CA` | `1366x768` | 811px | 5 | 36px |
| `/?language=en` | `1440x900` | 730px | 4 | 216px |
| `/?language=fr-CA` | `1440x900` | 926px | 6 | 63px |

Local patch after fix:

| Route | Viewport | Hero Height | H1 Lines | CTA Bottom Margin |
| --- | ---: | ---: | ---: | ---: |
| `/?language=en` | `1280x720` | 531px | 3 | 210px |
| `/?language=fr-CA` | `1280x720` | 591px | 4 | 148px |
| `/?language=en` | `1366x768` | 537px | 3 | 248px |
| `/?language=fr-CA` | `1366x768` | 605px | 4 | 180px |
| `/?language=en` | `1440x900` | 659px | 4 | 278px |
| `/?language=fr-CA` | `1440x900` | 659px | 4 | 278px |

Dark-mode local patch geometry matched Light for the sampled homepage sizes:

| Route | Viewport | Hero Height | H1 Lines | CTA Bottom Margin |
| --- | ---: | ---: | ---: | ---: |
| `/?language=en` | `1280x720` | 531px | 3 | 210px |
| `/?language=fr-CA` | `1280x720` | 591px | 4 | 148px |
| `/?language=en` | `1366x768` | 537px | 3 | 248px |
| `/?language=fr-CA` | `1366x768` | 605px | 4 | 180px |

## Route And Grid Evidence

Local browser audit after the patch confirmed:

- no horizontal overflow on audited routes,
- no nested internal scroll in marketing cards,
- no raw `ENFR`,
- no raw `System Light Dark`,
- no marketing language/theme controls on auth pages,
- homepage six-card use-case grid renders `3+3` at desktop,
- Features six-card grid renders `3+3` at desktop,
- Content Studio six-card grid renders `3+3` at desktop with six body-copy
  cards,
- Trust renders three grouped columns,
- Pricing renders three staged cards without price changes,
- Pilot remains a short template flow, not a long disabled form.

## Evidence Paths

- `docs/readiness/final-public-site-visual-truth-fix-2026-06-20/before-production-home-hero-metrics.json`
- `docs/readiness/final-public-site-visual-truth-fix-2026-06-20/before-production-route-consistency-audit.json`
- `docs/readiness/final-public-site-visual-truth-fix-2026-06-20/after-local-home-hero-metrics.json`
- `docs/readiness/final-public-site-visual-truth-fix-2026-06-20/after-local-dark-home-hero-metrics.json`
- `docs/readiness/final-public-site-visual-truth-fix-2026-06-20/after-local-route-consistency-audit.json`
- `docs/readiness/final-public-site-visual-truth-fix-2026-06-20/before-production-home-en-1280x720-light.png`
- `docs/readiness/final-public-site-visual-truth-fix-2026-06-20/before-production-home-fr-ca-1280x720-light.png`
- `docs/readiness/final-public-site-visual-truth-fix-2026-06-20/after-local-home-en-1280x720-light.png`
- `docs/readiness/final-public-site-visual-truth-fix-2026-06-20/after-local-home-fr-ca-1280x720-light.png`
- `docs/readiness/final-public-site-visual-truth-fix-2026-06-20/after-local-home-fr-ca-1366x768-light.png`
- `docs/readiness/final-public-site-visual-truth-fix-2026-06-20/after-local-home-fr-ca-1280x720-dark.png`

## Git And Deployment State

| Item | Value |
| --- | --- |
| Pre-patch production commit | `3991dcd5f7815835f77b3bed8546deb9540989af` |
| Pre-patch Vercel deployment URL | `https://bizpilot-9h7f7gtrv-moo0ooohs-projects.vercel.app` |
| Production alias | `https://bizpilo.com` |
| Phase 12 patch commit | Assigned by Git after this report is committed; record in final handoff |
| Post-push production deployment | Must be verified after `git push origin main` |

## Commands Run

| Command | Result |
| --- | --- |
| `git status --short` | PASS: only intended Phase 12 changes and evidence files |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test:unit` | PASS: 113 tests |
| `pnpm build` | PASS |
| `pnpm smoke:public` | PASS: 9 passed, 0 failed |
| `pnpm smoke:responsive` | PASS after narrowing a false-positive raw `undefined` smoke assertion |
| `pnpm smoke:quote -- --inactive-slug=phase1-unavailable-synthetic` | PASS: 1 passed, 0 failed |
| `pnpm smoke:ui-matrix` | PASS: final UI matrix failures 0 |
| route/link check | No separate script available; UI matrix covers safe internal-link targets, external-link attributes, metadata, sitemap, and robots |
| metadata/sitemap/robots check | PASS through `pnpm smoke:ui-matrix` |
| Lighthouse | Not available in this environment |
| `git diff --check` | PASS |

## Remaining Limitations

- Production-after-push verification is still required before marking dashboard
  D0 as GO.
- The `akora` quote check remains safe GET only; no production quote submit was
  performed.
- Browser zoom at true 200% / 400% was not available through the current browser
  automation surface. The small viewport and desktop short-height checks provide
  partial reflow coverage.
- Lighthouse is not available locally in this environment.

## Final Gate

```text
Local Phase 12 patch: PASS.
Dashboard D0: NO-GO until the pushed commit deploys and production visual parity is verified on https://bizpilo.com.
Real customer data, paid pilot, billing, auth, database, RLS, AI provider, and production data-flow changes: NO-GO.
```
