# Final Global Visual Sizing Audit

Prompt artifact date: 2026-06-21  
Execution date: 2026-06-25  
Repository: `E:\bizpilot-ai`  
Branch: `main`  
Starting commit: `2629267 fix(pricing): add first-fold pilot CTA`  
Production target audited: `https://bizpilo.com`  
R0 scope: audit only. No product code, schema, auth, AI, billing, production data flow, dashboard, or dashboard implementation changes.

## Decision

Dashboard D1 remains **NO-GO**.

The public site has several closed items from prior visual work, but the current implementation still does not have one canonical sizing, typography, spacing, grid, and route-visual contract. The next correct phase is **R1: establish the global responsive sizing and typography system** before any dashboard work starts.

## What Is Closed

- Production public routes render without measured horizontal overflow in the sampled browser matrix.
- No nested marketing card scroll was detected in the production browser matrix.
- Homepage desktop first fold is materially improved from earlier work: at `1366x768`, the hero section measured `444px` high, the mockup measured `396px`, and the mockup-to-copy ratio was `1.04`.
- Cleaning page exact six-service title duplication is closed in production. The audited service names rendered once each, with six `.cleaning-service-card` cards.
- Quote form safe GET rendered for `/quote/akora?language=fr-CA`; honeypot was hidden, consent appeared once, and first helper gaps measured `6px`.
- Auth pages are compact and did not expose marketing utility controls in the measured matrix.
- Light and Dark theme spot checks showed zero geometry delta for homepage, pricing, quote, and auth at `1366x768` and `390x844`.

## What Remains Blocked

- There is no canonical structural public-site sizing system yet. Required classes such as `bp-page`, `bp-container`, `bp-section`, `bp-grid-six`, `bp-display`, `bp-page-title`, `bp-section-title`, and `bp-card-title` are absent.
- Public routes still rely on many route-local Tailwind literal sizes and bespoke classes. The audited public/auth/quote route set contains `144` `text-[...]` occurrences; the broader source scan found `714`.
- Existing visual tests still lock old/bespoke selectors such as `supporting-four-grid`, `homepage-hero-title`, `homepage-problem-section`, `cleaning-service-grid`, and `public-pricing-grid`, instead of enforcing final visual ratios.
- Homepage mobile remains tall. At `390x844`, the homepage measured `8967px` document height, the hero measured `1035px`, and the Problem section measured `887px`.
- Legal pages have section headings that can visually compete with page titles. Privacy/Security H2-to-H1 ratio measured `0.88` at `390x844` and `0.94` at `768x1024`.
- Cleaning is no longer exactly duplicating the six service titles, but it still has a long bespoke page shape and hidden desktop/mobile detail variants in the same DOM. It needs the R3 structure reset before the dashboard phase.
- Language state is cookie-sensitive. Browser route checks without a deterministic language query can inherit a previous `fr-CA` cookie, so EN/fr-CA visual parity must be tested with explicit language state.
- Smoke tests still pass mostly from HTML/copy/class presence and cannot prove owner-visible hero balance, section rhythm, type hierarchy, or visual ratio correctness.

## Source Audit Findings

| Finding | Severity | Evidence | Affected areas | Recommended fix |
| --- | --- | --- | --- | --- |
| Canonical structural primitives are missing | P0 | Counts for `bp-page`, `bp-container`, `bp-section`, `bp-grid-six`, `bp-display`, `bp-page-title`, `bp-section-title`, `bp-card-title`: all `0` | `app/globals.css`, all public route pages, auth shell, quote shell | R1: add the requested primitives and migrate public surfaces to them. |
| Typography and spacing are still route-local | P0 | Public/auth/quote route scan found `144` literal `text-[...]` utilities; broad source scan found `714` | `app/page.tsx`, `app/features/page.tsx`, `app/industries/cleaning/page.tsx`, `app/trust/page.tsx`, `app/demo/page.tsx`, `app/pricing/page.tsx`, `app/pilot/page.tsx`, `app/content-studio/page.tsx`, `app/faq/page.tsx`, legal routes, auth pages, `components/public/quote-form-wizard.tsx` | R1/R4: replace route-local type and spacing with shared visual classes and route-specific content only. |
| Tests enforce old selectors more than final visual ratios | P0 | `tests/unit/public-visual-stability-source.test.mts` expects old homepage and grid markers; responsive smoke checks class presence | `tests/unit/public-visual-stability-source.test.mts`, `tests/smoke/public-responsive-smoke.mts`, `tests/smoke/final-ui-matrix-smoke.mts` | R5: add browser-measured ratio contracts and update old selector expectations. |
| Homepage still depends on bespoke media queries | P1 | `.homepage-hero-title`, `.homepage-section-heading`, `.homepage-problem-section`, `.homepage-hero-mockup` control the main fold | `app/globals.css`, `app/page.tsx` | R2: migrate hero/section rhythm to R1 primitives and verify 1280x720, 1366x768, and 1440x900. |
| Mobile homepage and Problem section are still too tall | P1 | Production at `390x844`: document `8967px`, hero `1035px`, Problem `887px` | `/`, `/?language=fr-CA`, `app/page.tsx` | R2: reduce mobile section height, H2 dominance, and unnecessary vertical stacking. |
| Cleaning page is partially closed but not structurally reset | P1 | Six exact service titles render once, but page still uses bespoke service grid, desktop tabs, mobile accordions, and long example/detail blocks | `/industries/cleaning`, `/industries/cleaning?language=fr-CA`, `app/industries/cleaning/page.tsx` | R3: rebuild to Hero, one before/after example, six compact cards, one shared detail panel, workflow, CTA. |
| Legal heading rhythm is too competitive | P1 | Privacy/Security H2-to-H1 ratio measured `0.88` on mobile and `0.94` on tablet | `/privacy`, `/security`, localized variants, policy page styles | R4: normalize legal summary and technical-note hierarchy under shared title classes. |
| Public menu uses viewport-width calc and compact menu scroll | P2 | `calc(100vw-2rem)` and compact menu `overflow-y-auto` exist in public controls | `components/ui/theme-preference-control.tsx`, `components/public/marketing-compact-menu.tsx` | R4/R5: keep intentional menu behavior, but ensure it is not used as a layout escape hatch. |
| Quote form is visually close but not tokenized | P2 | Safe GET: `14` controls, `15` helpers, helper gaps `6px`, consent `1`, honeypot hidden | `/quote/akora?language=fr-CA`, `components/public/quote-form-wizard.tsx` | R4: migrate form rhythm to shared field/group primitives without changing submit behavior. |

## Production Browser Evidence

Representative safe GET checks were run in the in-app browser against `https://bizpilo.com` at `1366x768`, `768x1024`, and `390x844`. The matrix covered all routes requested in the prompt, including localized public pages, auth pages, active quote safe GET, and inactive quote route.

| Route sample | Viewport | Overflow X | Internal scroll | Key measurement |
| --- | ---: | ---: | ---: | --- |
| `/` | `1366x768` | none | `0` | H1 `55.2px`, H2 `36px`, H2/H1 `0.65`, hero `444px`, mockup `396px`, mockup/copy `1.04` |
| `/` | `390x844` | none | `0` | document `8967px`, hero `1035px`, Problem `887px`, H1 `37.6px`, H2 `28px` |
| `/industries/cleaning?language=fr-CA` | `390x844` | none | `0` | document `4888px`, six service cards, service title counts all `1`, grid `1` column |
| `/pricing?language=fr-CA` | `390x844` | none | `0` | document `3759px`, three plan cards stacked, H2/H1 `0.78` |
| `/quote/akora?language=fr-CA` | `390x844` | none | `0` | document `3094px`, `14` controls, `15` helpers, consent `1`, honeypot hidden |
| `/auth/sign-in` | `390x844` | none | `0` | document fits one viewport, no marketing utility header controls |
| `/privacy` and `/security` | `390x844` | none | `0` | H2/H1 `0.88`; legal H2 scale is too close to page title |

Light/Dark geometry spot check:

| Route | Viewports | Result |
| --- | --- | --- |
| `/` | `1366x768`, `390x844` | H1, H2, mockup, scroll height, and overflow all had `0` geometry delta |
| `/pricing?language=fr-CA` | `1366x768`, `390x844` | H1, H2, pricing grid, scroll height, and overflow all had `0` geometry delta |
| `/quote/akora?language=fr-CA` | `1366x768`, `390x844` | H1, H2, quote form, scroll height, and overflow all had `0` geometry delta |
| `/auth/sign-in` | `1366x768`, `390x844` | H1, form, scroll height, and overflow all had `0` geometry delta |

## Affected Routes

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
- `/faq`
- `/faq?language=fr-CA`
- `/privacy`
- `/privacy?language=fr-CA`
- `/security`
- `/security?language=fr-CA`
- `/terms`
- `/terms?language=fr-CA`
- `/auth/sign-in`
- `/auth/sign-up`
- `/auth/forgot-password`
- `/quote/akora?language=fr-CA`
- inactive quote route

## Affected Files

- `app/globals.css`
- `components/public/marketing-ui.tsx`
- `components/public/marketing-compact-menu.tsx`
- `components/ui/theme-preference-control.tsx`
- `components/public/quote-form-wizard.tsx`
- `app/page.tsx`
- `app/features/page.tsx`
- `app/industries/cleaning/page.tsx`
- `app/trust/page.tsx`
- `app/demo/page.tsx`
- `app/pricing/page.tsx`
- `app/pilot/page.tsx`
- `app/content-studio/page.tsx`
- `app/faq/page.tsx`
- `app/privacy/page.tsx`
- `app/security/page.tsx`
- `app/terms/page.tsx`
- `app/auth/sign-in/page.tsx`
- `app/auth/sign-up/page.tsx`
- `app/auth/forgot-password/page.tsx`
- `tests/unit/public-visual-stability-source.test.mts`
- `tests/smoke/public-responsive-smoke.mts`
- `tests/smoke/final-ui-matrix-smoke.mts`

## Recommended Phase Order

1. **R1**: Add canonical responsive sizing, spacing, grid, and typography primitives. Migrate public route shells to them.
2. **R2**: Rebalance homepage hero and Problem/section rhythm using the new primitives and browser evidence.
3. **R3**: Reset the Cleaning page structure and height while preserving product truth.
4. **R4**: Normalize Features, Trust, Demo, Pricing, Pilot, FAQ, Legal, Auth, and Quote form rhythm.
5. **R5**: Add final multi-resolution visual contract tests, create acceptance evidence, deploy, and verify production before any Dashboard D1 GO decision.

## R0 Safety Notes

- No database schema, migrations, RLS, authentication behavior, AI provider logic, billing/payment implementation, production data flows, real customer data gates, pricing values, unsupported claims, or dashboard implementation were changed.
- Production quote checks were safe GET only. No form submissions were performed.
- Dashboard D1 remains blocked until R1-R5 are completed, committed, pushed, deployed, and visually verified in production.
