# Final Visual Rhythm Audit - 2026-06-21

## Decision

**NO-GO for Dashboard D1 from the final visual rhythm gate.**

The public site is functionally stable, bilingual routes render, dark mode works, and the FAQ/Cleaning de-duplication concerns are already closed in the current code. The remaining blocker is visual rhythm on the homepage: the hero product mockup still feels heavier than the copy column, the lower hero whitespace/transition into the Problem section is too loose on tablet and mobile, and the first Problem heading still reads too dominant for a follow-up section.

This V1 phase made no product implementation changes. It only records the audit evidence and the next correct phase.

## Scope Audited

Local target:

- `http://127.0.0.1:3100`

Production target:

- `https://bizpilo.com`

Routes audited on local and production:

- `/` after explicit EN session priming
- `/?language=fr-CA`
- `/features` as `?language=en`
- `/features?language=fr-CA`
- `/industries/cleaning` as `?language=en`
- `/industries/cleaning?language=fr-CA`
- `/trust` as `?language=en`
- `/demo` as `?language=en`
- `/pricing` as `?language=en`
- `/pilot` as `?language=en`
- `/faq` as `?language=en`
- `/quote/akora?language=fr-CA` safe GET only
- `/auth/sign-in` as `?language=en`

Viewport matrix:

- Desktop: `1366x768`
- Tablet: `768x1024`
- Mobile: `390x844`

Theme coverage:

- Light route matrix on all listed routes, local and production
- Dark spot checks on homepage desktop, fr-CA quote mobile, and sign-in desktop, local and production

Rendered measurements:

- Light matrix: `78` route/viewport/base checks
- Dark spot checks: `6` rendered route checks plus set/restore checks
- Matrix errors: `0`

## What Is Closed

| Area | Result | Evidence |
| --- | --- | --- |
| Public route availability | Closed | All `78` local/production light-mode route checks rendered without navigation errors. |
| Homepage mini FAQ | Closed | Homepage renders `3` FAQ details locally and in production. |
| Full FAQ split | Closed | `/faq` renders `16` FAQ details locally and in production; public footer includes `/faq`. |
| Cleaning service de-duplication | Closed | Cleaning page renders `6` compact service cards and `0` nested/repeated service cards inside detail panels locally and in production. |
| fr-CA quote safe GET | Closed for V1 audit | `/quote/akora?language=fr-CA` renders a form with `3` sections and `17` fields on local and production. No submit was performed. |
| Dark theme functional rendering | Closed for V1 audit | Local and production theme controls set `data-theme="dark"`; homepage, quote, and sign-in spot checks rendered without layout failure. |
| Horizontal overflow | No visible blocker | Max measured overflow was `1px` on desktop marketing routes only, matching a body/browser rounding artifact. Tablet and mobile measured `0px`. |

## Open Findings

| Severity | Finding | Evidence | Next Phase |
| --- | --- | --- | --- |
| P1 | Homepage hero left/right balance is still off. The right product mockup feels heavier than the copy column and begins higher than the copy stack. | Desktop EN local and production: mockup `475px` high vs copy `373px` high, ratio `1.27x`; mockup top `102px`, copy top `152px`; mockup bottom `576px`, copy bottom `526px`. Desktop fr-CA ratio is lower but still heavy at `1.14x`. | V2 |
| P1 | Hero transition into the Problem section is too loose on tablet and mobile. | Tablet EN: hero section bottom `1037px`, Problem H2 top `1127px`, Problem is not in first fold. Mobile EN: hero section bottom `1182px`, Problem H2 top `1268px`. Mobile fr-CA: hero section bottom `1316px`, Problem H2 top `1402px`. | V2/V3 |
| P2 | Product mockup card is too tall for its supporting role. | Desktop EN mockup height `475px`; mobile EN mockup height remains `475px` after the copy stack, extending the hero to `1144px` before the first follow-up section. | V2 |
| P2 | Problem section heading still reads too dominant relative to its role as the next section. | Desktop Problem H2 is `40px`, `86px` tall, and appears immediately after a large hero H1. Mobile Problem H2 is `30px`, up to `97px` tall in EN. It should feel like a section transition, not a second hero. | V2 |
| P2 | Quote form helper spacing should be re-checked visually in final acceptance, but no measured spacing defect was found in fr-CA. | Standard label-to-control and control-to-helper gaps measured `6px`; long helper text wraps cleanly to `40px` height on mobile. Boolean checkbox rows are horizontal, so vertical gap metrics are not comparable. | V5 |

## Homepage Evidence

| Viewport | Language | Hero Copy | Mockup | Mockup/Copy | Problem Top | Problem In First Fold |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `1366x768` | EN | `373px` | `475px` | `1.27x` | `706px` | Yes, but bottom is below fold |
| `1366x768` | fr-CA | `401px` | `459px` | `1.14x` | `690px` | Yes, but bottom is below fold |
| `768x1024` | EN | `401px` | `455px` | `1.13x` | `1127px` | No |
| `768x1024` | fr-CA | `401px` | `459px` | `1.14x` | `1131px` | No |
| `390x844` | EN | `543px` | `475px` | `0.87x` | `1268px` | No |
| `390x844` | fr-CA | `672px` | `479px` | `0.71x` | `1402px` | No |

## Quote Form Evidence

`/quote/akora?language=fr-CA` was checked by safe GET only.

| Viewport | Sections | Fields | Standard Label Gap | Standard Helper Gap | Result |
| --- | ---: | ---: | ---: | ---: | --- |
| Desktop `1366x768` | `3` | `17` | `6px` | `6px` | Pass for V1 |
| Mobile `390x844` | `3` | `17` | `6px` | `6px` | Pass for V1 |

Long helper text wraps without overflow. The checkbox row uses a horizontal label/help layout, so its negative vertical metric is expected and not a spacing failure.

## Current Project Status

BizPilot AI is still a cleaning-first lead recovery product: public marketing pages, safe public quote intake, founder pilot copy, trust/pricing/FAQ surfaces, auth shell, and manual AI-draft positioning are live. The public site has passed the earlier copy polish and visual stability phases.

Closed from the previous phase:

- Public copy polish in EN and fr-CA
- Dedicated full FAQ route
- Short homepage FAQ
- Cleaning page compact service structure
- Manual-send AI guardrails in public copy
- Production public route rendering

Still blocked before Dashboard D1:

- Final homepage hero and typography rhythm patch
- Homepage compression acceptance
- Final visual QA on production after patches

Next correct phase:

- **V2: Hero and typography rhythm patch**

## Verification For This Audit Commit

Required local verification after writing this docs-only audit:

| Command | Result |
| --- | --- |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test:unit` | PASS: `133` tests, `0` failures |
| `pnpm build` | PASS |
| `git diff --check` | PASS |

## V4 Cleaning Closeout Addendum

V4 required no product-code change. The current Cleaning page already renders the de-duplicated structure introduced before this phase:

- `app/industries/cleaning/page.tsx` flattens service anchors into one compact `cleaning-service-grid`.
- Detail content renders as desktop tabs and mobile accordion panels without repeating service cards.
- The public copy keeps three families with two services each: `6` total cards.
- `Small commercial cleaning` / `Petit nettoyage commercial` remains absent from the final public Cleaning page copy.

Verification for the V4 closeout:

| Command / Check | Result |
| --- | --- |
| `git status --short` before verification | PASS: clean |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test:unit` | PASS: `133` tests, `0` failures |
| `pnpm build` | PASS |
| `git diff --check` | PASS |
| `pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3100 --en-quote-url=http://127.0.0.1:3100/quote/akora?language=en --fr-quote-url=http://127.0.0.1:3100/quote/akora?language=fr-CA` | PASS: final UI matrix failures `0` |
| `pnpm smoke:responsive -- --base-url=http://127.0.0.1:3100` | PASS: responsive smoke failures `0` |

Cleaning-specific assertions covered in smoke:

- EN and fr-CA, light and dark, each render `6` compact service cards.
- EN and fr-CA, light and dark, each keep desktop tabs and mobile accordion markers.
- EN and fr-CA, light and dark, each keep service titles at `<= 1` visible occurrence.
- EN and fr-CA, light and dark, each exclude small-commercial cleaning copy.
