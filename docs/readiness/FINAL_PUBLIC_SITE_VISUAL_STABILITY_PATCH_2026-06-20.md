# Final Public Site Visual Stability Patch - 2026-06-20

## Decision

**GO for starting dashboard work after the public-site visual stability patch.**

This is not approval for real customer data, paid-pilot launch, billing automation,
dashboard feature expansion, AI provider changes, auth changes, database changes,
RLS changes, or production data-flow changes.

## Scope

This verification covers the Phase 11 public-site stability patch sequence after
the auth, quote, and report shell alignment commit.

Production URL checked:

- `https://bizpilo.com`

Latest deployed commit checked:

- `df24dc4ca450168641eeed00b2c19412addc1ff5`
- Subject: `fix(shell): align auth quote and report visual foundations`

## Git And Deployment Proof

| Check | Result |
| --- | --- |
| `git status --short --branch` | PASS: `main...origin/main`, clean before evidence capture |
| `git log -1 --format="%H%n%s%n%D"` | PASS: HEAD is `df24dc4ca450168641eeed00b2c19412addc1ff5` |
| `git rev-parse origin/main` | PASS: `origin/main` is `df24dc4ca450168641eeed00b2c19412addc1ff5` |
| `git ls-remote origin refs/heads/main` | PASS: remote `main` is `df24dc4ca450168641eeed00b2c19412addc1ff5` |
| GitHub commit status API | PASS: Vercel status `success`, description `Deployment has completed` |
| GitHub deployment API | PASS: Production deployment `5135327281`, status `success` |
| Vercel status target | `https://vercel.com/moo0ooohs-projects/bizpilot-ai/DZU5GQStNBuN6AcQq9Ga8Qtb2r4F` |
| Vercel environment URL from deployment status | `https://bizpilot-494j2q6m4-moo0ooohs-projects.vercel.app` |
| Direct Vercel environment URL GET | Informational: returned `401 Unauthorized`; live production alias was used for public verification |
| Live production alias | PASS: `https://bizpilo.com` returned HTTP 200 with Vercel headers |

The production deployment is confirmed through the GitHub/Vercel integration for
the latest commit, plus live behavior checks on the public alias.

## Commands Run

| Command | Result |
| --- | --- |
| `pnpm verify` | PASS: lint, typecheck, 112 unit tests, and build |
| `pnpm smoke:public -- --base-url=https://bizpilo.com --timeout-ms=20000` | PASS: 9 passed, 0 failed |
| `pnpm smoke:responsive -- --base-url=https://bizpilo.com` | PASS: 12 routes, 0 failures |
| `pnpm smoke:quote -- --base-url=https://bizpilo.com --inactive-slug=phase1-unavailable-synthetic --timeout-ms=20000` | PASS: 1 passed, 0 failed |
| `pnpm smoke:ui-matrix -- --base-url=https://bizpilo.com --en-quote-url=https://bizpilo.com/quote/phase1-unavailable-synthetic --fr-quote-url=https://bizpilo.com/quote/akora?language=fr-CA --timeout-ms=20000` | PASS: final UI matrix failures 0 |
| Production route/link check | PASS: 18/18 requested routes, 15/15 discovered safe links |
| Production fresh Light check | PASS: no-cookie homepage rendered `data-theme="light"` and `data-theme-preference="light"` |
| Browser visual matrix | PASS: 96 checks, 0 failures |
| Lighthouse | NOT RUN: no local `lighthouse`, local `playwright`, Chrome, or Edge command was available in this environment |
| `git diff --check` | PASS |

`pnpm smoke:dashboard` was not run. That script creates synthetic Supabase
workspace data and is intentionally production-prohibited. This phase is public
site verification only.

## Production Routes Verified

All requested routes returned the expected safe status and content boundaries:

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
- `/auth/sign-in`
- `/quote/akora?language=fr-CA` - safe GET only
- `/robots.txt`
- `/sitemap.xml`

Evidence:

- `docs/readiness/final-public-site-visual-stability-patch-2026-06-20/production-route-link-check.json`
- `docs/readiness/final-public-site-visual-stability-patch-2026-06-20/production-fresh-light-check.json`

## Visual Verification

Browser matrix:

- Themes: Light and Dark
- Viewports: `390x844`, `1280x720`, `1366x768`
- Routes: homepage EN/fr-CA, Features EN/fr-CA, Cleaning EN/fr-CA,
  Trust EN/fr-CA, Demo EN/fr-CA, Pricing EN/fr-CA, Pilot EN/fr-CA,
  auth sign-in, and `akora` fr-CA quote GET

Result:

- 96 browser visual checks
- 0 failures
- No horizontal overflow beyond a 1px browser rounding tolerance
- No protruding elements
- No nested internal scroll containers in public main content
- One H1 per checked route
- Auth sign-in has no marketing nav
- Quote fr-CA page rendered expected French quote labels and noindex metadata
- Pilot did not show a long disabled form
- Pricing retained the staged price numbers and manual-billing guardrail

Homepage hero:

| Route | Viewport | Hero Height | CTA Status |
| --- | ---: | ---: | --- |
| `/?language=en` | `1280x720` | 671px | Hero CTAs visible in first fold |
| `/?language=fr-CA` | `1280x720` | 782px | Hero CTAs visible in first fold |
| `/?language=en` | `1366x768` | 696px | Hero CTAs visible in first fold |
| `/?language=fr-CA` | `1366x768` | 811px | Hero CTAs visible in first fold |

Grid balance:

- Homepage six-card grid: `3+3` at desktop widths.
- Features six-card grid: `3+3` at desktop widths.
- Trust grouped columns: `3` at desktop widths; no `4+3` seven-card layout.
- Pricing cards: `3` at desktop widths.

Evidence:

- `docs/readiness/final-public-site-visual-stability-patch-2026-06-20/production-visual-metrics.json`

## Screenshots

Fresh production screenshots captured for this phase:

- `docs/readiness/final-public-site-visual-stability-patch-2026-06-20/live-home-en-1280x720-light.png`
- `docs/readiness/final-public-site-visual-stability-patch-2026-06-20/live-home-fr-ca-1366x768-light.png`
- `docs/readiness/final-public-site-visual-stability-patch-2026-06-20/live-home-en-1280x720-dark.png`
- `docs/readiness/final-public-site-visual-stability-patch-2026-06-20/live-features-fr-ca-1280x720-dark.png`
- `docs/readiness/final-public-site-visual-stability-patch-2026-06-20/live-pricing-fr-ca-1280x720-light.png`
- `docs/readiness/final-public-site-visual-stability-patch-2026-06-20/live-pilot-fr-ca-1280x720-light.png`
- `docs/readiness/final-public-site-visual-stability-patch-2026-06-20/live-auth-sign-in-390x844-light.png`
- `docs/readiness/final-public-site-visual-stability-patch-2026-06-20/live-quote-akora-fr-ca-390x844-light.png`

## Metadata, Sitemap, Robots, And Links

The production UI matrix and route/link evidence verified:

- localized document `lang` on EN and fr-CA routes,
- localized H1 and title metadata,
- canonical and hreflang metadata,
- auth route noindex boundaries,
- quote route noindex boundaries,
- sitemap route count and localized alternates,
- sitemap excludes `/auth` and `/quote`,
- robots disallows `/auth`, `/dashboard`, and `/quote`,
- official external links use safe new-tab attributes,
- discovered safe internal links return successful statuses.

## Remaining Known Limitations

- Lighthouse was not run in this environment because no local Lighthouse,
  Playwright, Chrome, or Edge command was available. Existing Phase 10 local
  Lighthouse lab evidence remains historical supporting evidence, but this 11E
  production pass does not add new Lighthouse scores.
- The `akora` quote check was GET-only. No production quote submit was performed.
- Browser EN homepage screenshots use `?language=en` to avoid a persisted fr-CA
  browser cookie during automation. The no-cookie HTTP route check confirmed `/`
  itself renders EN and Light by default.
- This is not approval for real customer data, paid-pilot launch, payment
  collection, dashboard feature expansion, or production data-flow changes.

## Final Decision

```text
GO for dashboard work to begin after the public-site visual stability patch.
NO-GO for real customer data, paid pilot, billing/payment automation, or feature expansion until their separate gates are explicitly closed.
```
