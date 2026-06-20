# Public Site Visual Stability Audit - 2026-06-20

## Decision

**GO for dashboard start from a public-site visual stability perspective.**

No P0 or P1 production visual/layout blockers were found. The remaining findings are P2 polish items or audit coverage limits. This audit does not approve real customer data, paid-pilot launch, billing automation, AI provider changes, auth changes, database changes, RLS changes, or production data-flow changes.

## Scope Audited

Production target: `https://bizpilo.com`

Routes:

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
- `/quote/akora?language=fr-CA` safe synthetic GET only

Viewport matrix:

- `320x568`
- `360x800`
- `390x844`
- `430x932`
- `768x1024`
- `1024x768`
- `1280x720`
- `1366x768`
- `1440x900`
- `1920x1080`

Theme/language coverage:

- Light
- Dark
- EN plain-path routes after explicit EN session priming
- `fr-CA` query routes

Total rendered production measurements: `460`.

## Issue List

| Severity | Issue | Affected Route | Viewport / Language / Theme | Recommended Fix | Blocks Dashboard Start |
| --- | --- | --- | --- | --- | --- |
| P2 | Homepage fr-CA hero is materially taller than EN. The French H1/body pushes the hero composition lower, especially on mobile and ultra-wide desktop. | `/` vs `/?language=fr-CA` | `360x800`, `390x844`, `430x932`, `1920x1080`; EN/fr-CA; Light and Dark | Shorten the fr-CA hero body and/or tune homepage hero spacing so the fr-CA first fold stays closer to EN while preserving meaning. | No |
| P2 | Supporting-page primary CTA is below the first fold on common desktop review sizes. This is a conversion polish issue, not a layout break. | `/features`, `/features?language=fr-CA`, `/trust`, `/trust?language=fr-CA`, `/pricing`, `/pricing?language=fr-CA`, `/content-studio`, `/content-studio?language=fr-CA` | `1280x720`, `1366x768`; EN/fr-CA where applicable; Light and Dark | Add or move a primary CTA closer to the top hero area, or reduce above-fold vertical density. Keep EN/fr-CA structure aligned. | No |
| P2 | Pricing page card CTAs sit below the first fold at `1280x720` and `1366x768`. Cards remain balanced, but the first fold reads more informational than action-oriented. | `/pricing`, `/pricing?language=fr-CA` | `1280x720`, `1366x768`; EN/fr-CA; Light and Dark | Keep current balanced cards, but add a compact hero-level CTA or tighten the gap before cards. Do not invent pricing or change billing logic. | No |
| P2 | True browser zoom coverage could not be executed through the available browser automation surface. Keyboard zoom did not change `devicePixelRatio`, `visualViewport.scale`, or CSS viewport metrics. | All audited routes | 200% zoom and 400% reflow requested if possible | Run a manual browser zoom pass before a major public-site release. The `320x568` and `430x932` reflow checks passed and provide partial coverage, but they are not a substitute for real zoom. | No |

## Audit Question Results

| Question | Result |
| --- | --- |
| Does switching EN to fr-CA change hero height too much? | P2 on homepage only. At `390x844`, homepage section height moved from `1398px` EN to `1660px` fr-CA in both themes. At `1920x1080`, it moved from `677px` to `894px`. |
| Do CTA buttons stay visible within first fold at `1280x720` and `1366x768`? | Homepage and Cleaning primary hero CTAs are visible. Features, Trust, Pricing, and Content Studio place their main CTAs below the first fold. |
| Are hero visual cards too tall or too wide? | No blocking issue found. No root overflow or protruding hero visual was detected. |
| Are any grids creating `4+2`, `4+3`, or large empty spaces? | No. No `4+2` or `4+3` grid row patterns were detected in the rendered production matrix. |
| Are feature/service cards balanced in rows? | Yes. No row-height spread above the audit threshold was found. |
| Does pricing remain balanced without awkward card-height jumps? | Mostly yes. Pricing cards remain structurally balanced; CTA placement below fold is the only pricing-specific P2 finding. |
| Does Pilot still feel clean and not form-heavy? | Yes. Pilot uses a copy-template flow and avoids a heavy submitting form. |
| Are header controls stable across EN/fr-CA? | Yes. Header height delta was `0px` across EN/fr-CA route pairs in the sampled matrix. |
| Are auth pages simpler than marketing pages? | Yes. Auth pages use a simpler owner-access shell and fewer controls than marketing pages. |
| Is there any horizontal overflow? | No visible/root overflow. `documentElement.scrollWidth` matched `clientWidth` and no protruding elements were found. A `1px` body-only rounding difference appeared at some `430x932` measurements, with no root overflow or protruding element. |
| Is any marketing card internally scrollable? | No. Internal scroll container count was `0` across the production matrix. |
| Does Dark mode preserve contrast and spacing? | Yes from a layout perspective. Light/Dark geometry deltas were `0px` for nav height, H1 position, page height, client width, and scroll width across `230` route/viewport pairs. No spacing regression was found. |

## Non-Issues Confirmed

- No P0 public route failure.
- No H1 count mismatch.
- No EN/fr-CA document language mismatch.
- No Light/Dark theme mismatch.
- No root-level horizontal overflow.
- No protruding elements beyond the viewport.
- No nested scroll inside marketing cards.
- No `4+2` or `4+3` rendered grid pattern.
- No header height shift between EN and fr-CA.
- No Light/Dark layout dimension shift.
- Safe production quote GET route rendered fr-CA with one H1, no overflow, and no internal scroll.

## Dashboard Start Gate

Public-site visual stability does not block dashboard start.

Dashboard work may begin after this audit is committed and pushed, provided the separate non-visual gates remain respected:

- No real customer data until explicit readiness approval.
- No paid-pilot launch until explicit approval.
- No dashboard redesign changes inside this audit phase.
- No database schema, auth, RLS, AI provider, payment/billing, or production data-flow changes from this phase.

## Verification For This Audit Commit

Required local verification after writing this docs-only audit:

| Command | Result |
| --- | --- |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test:unit` | PASS: 111 tests |
| `pnpm build` | PASS |
| `git diff --check` | PASS |
