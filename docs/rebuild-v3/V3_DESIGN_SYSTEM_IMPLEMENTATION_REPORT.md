# BizPilot Website V3 — Design System Implementation Report

Date: 2026-07-13  
Phase: V3.4 — Marketing design foundation  
Branch: `codex/website-v3-rebuild`

## Outcome

The public marketing surface now has one restrained V3 foundation for typography, layout, spacing, radii, borders, shadows, semantic color, focus, motion, cards, buttons, shell chrome, and product-scene composition. The implementation preserves the Phase 3 locale-navigation fix and measured 1440px desktop-header threshold. It does not yet replace the complete homepage narrative; that remains Phase 5.

## Token consolidation

| Family | V3 source of truth | Implementation result |
| --- | --- | --- |
| Width | `--v3-content-max`, `--v3-reading-max`, `--v3-gutter` | One 75rem content container and one 45rem reading width, with fluid mobile gutters |
| Type | `--v3-type-display/page/section/card/lead/body/small` | Existing `bp-*` public roles now map to the V3 scale to avoid a competing system |
| Leading | `--v3-leading-display/heading/body` | Explicit display, heading, and readable body rhythm |
| Space | `--v3-space-1` through `--v3-space-7`, section and compact-section tokens | Shared section and component spacing with fluid section rhythm |
| Shape | `--v3-radius-sm/md/lg`, `--v3-border` | Restrained 10/16/24px radius hierarchy and one semantic border |
| Elevation | `--v3-shadow-card`, `--v3-shadow-float` | Two elevation levels with dedicated dark-theme values |
| Motion | `--v3-motion-fast/standard/panel`, `--v3-ease-out` | Short, communicative transitions with a global public reduced-motion override |
| Shell | `--v3-header-height` | 64px compact header foundation at every breakpoint |

The light and dark `--marketing-background` values were simplified from multiple decorative radial gradients to calm linear surfaces. No dashboard theme, auth flow, quote flow, customer data, migration, RLS, or production state was changed.

## Shared primitives

- `MarketingShell` now uses `.v3-container`.
- `MarketingCard` now uses `.v3-card` instead of repeating radius, border, surface, and shadow styles inline.
- `MarketingButton` now uses `.v3-button` with primary, secondary, and ghost variants. The oversized decorative CTA gradient and one-off shadow were removed.
- The brand mark, sticky header, footer, skip link, focus states, and responsive container are shared V3 primitives.
- `MarketingProductFrame`, `MarketingProductStage`, and `MarketingStateChip` establish the composition API for Phase 5 product-led scenes.
- The compact menu keeps 44px touch sizing, no nested scroll, Escape/outside-click behavior, and now exposes localized English and French accessible names.

## Header and footer

The header keeps the approved compact information architecture: Product, How it works, Demo, Pricing, Resources, language, theme, Sign in, and one Pilot CTA. Desktop expansion remains at the measured 1440px fit point; smaller viewports use the compact menu.

The footer is reduced to four distinct jobs:

1. Product: Product, How it works, Demo, Pricing.
2. Resources: Pilot, FAQ, Trust.
3. Trust and legal: Privacy, Security, Terms.
4. Account: Sign in.

Obsolete footer links to Comparison, Intake link guide, and Faster replies guide were removed ahead of their Phase 6 redirects. Their route implementations and legacy styles were not deleted because the live routes still render until Phase 6.

## Accessibility implementation and scan

- Added an EN/fr-CA skip link targeting the actual page content.
- Corrected page landmarks so `header`, `main`, and `footer` are siblings; the earlier renderer incorrectly placed navigation and footer inside `main`.
- Added a named primary-navigation landmark.
- Consolidated visible focus treatment with a 2px semantic focus ring and 3px offset.
- Localized compact-menu open/close names.
- Added a public-site `prefers-reduced-motion: reduce` override for animation, transitions, and smooth scrolling.
- Preserved 44px or larger shell controls and 0px responsive overflow.

Lighthouse 13.4.0 accessibility initially scored 95 and identified one failure: the 12px footer copyright text had 4.39:1 contrast. The text was moved from `--text-muted` to `--text-default` and given medium weight. The repeated report scored **100 with zero failed accessibility audits**.

The Lighthouse CLI wrote valid reports but returned exit code 1 during Windows temporary-profile cleanup:

```text
npx --yes lighthouse http://127.0.0.1:3100/?language=en ...
EPERM, Permission denied: C:\Users\mbeag\AppData\Local\Temp\lighthouse.*
```

This appears to be a local `chrome-launcher` cleanup failure: the JSON reports were complete and parseable, and Chrome interaction tests terminated normally. It is not an application runtime failure.

## Visual and interaction QA matrix

| Check | EN | fr-CA | Result |
| --- | --- | --- | --- |
| Widths 320, 360, 390, 430 | Tested in real Chrome | Tested in real Chrome | 0px horizontal overflow |
| Widths 768, 1024, 1280 | Tested in real Chrome | Tested in real Chrome | 0px horizontal overflow |
| Widths 1440, 1920 | Tested in real Chrome | Tested in real Chrome | 0px horizontal overflow |
| Desktop header and footer | Light and dark inspected | Locale behavior verified | Compact, no clipping |
| Language click/reload/reverse switch | EN → fr-CA → EN | Visible copy, URL, metadata, `html lang`, selection | Pass |
| Mobile menu at 390×844 | — | Localized trigger; panel 64–661px | Fits viewport, no nested scroll |
| Theme menu | Light → dark → light | Shared localized page survives theme | Pass |
| Reduced motion | Stable final-state CSS contract | Same shared CSS contract | Pass |
| Runtime errors | 0 | 0 | Pass |

Ignored evidence files:

- `artifacts/rebuild-v3/phase4/v3-foundation-light.png`
- `artifacts/rebuild-v3/phase4/v3-foundation-dark.png`
- `artifacts/rebuild-v3/phase4/lighthouse-accessibility-final.json`
- `artifacts/rebuild-v3/phase4/lighthouse-mobile-final.json`

## Performance delta

| Mobile lab run | Phase 1 production baseline | Phase 4 local production build | Delta |
| --- | ---: | ---: | ---: |
| Performance | 98 | 94 | -4 |
| Accessibility | 100 | 100 | 0 |
| Best Practices | 100 | 100 | 0 |
| SEO | 100 | 100 | 0 |
| LCP | 2.4s | 2.9s | +0.5s |
| TBT | 70ms | 110ms | +40ms |
| CLS | 0 | 0 | 0 |
| Encoded transfer | about 304KiB | 311KiB | about +7KiB |

These are separate single-run lab samples on different builds and should not be interpreted as field regression. The Phase 4 build remains responsive and within the package's eventual Performance score target, but its 2.9s lab LCP is above the final 2.5s target. Phase 5 must remeasure after replacing the oversized hero, and Phase 7 owns final performance hardening.

## Validation results

| Command | Result |
| --- | --- |
| `pnpm lint` | Pass |
| `pnpm typecheck` | Pass |
| `pnpm test:unit` | Pass — 249/249 |
| `pnpm build` | Pass — Next.js 16.2.4 production build |
| `pnpm smoke:public -- --base-url=http://127.0.0.1:3100` | Pass — 33/33 |
| `pnpm smoke:responsive -- --base-url=http://127.0.0.1:3100` | Pass — 25 routes, 0 failures |
| `pnpm smoke:browser -- --base-url=http://127.0.0.1:3100` | Pass — 18 locale/width combinations, mobile containment, 0 runtime errors |
| Lighthouse accessibility report | 100, zero failed audits; CLI cleanup returned EPERM after report creation |
| Lighthouse mobile report | 94/100/100/100; CLI cleanup returned EPERM after report creation |
| `git diff --check` | Pass |

Intermediate failures were fixed and retained in the implementation history:

- Unit tests initially failed because an older V2 source guard required the footer links intentionally removed by the V3 IA. The guard now verifies the retained footer and removal contract.
- The first browser rerun hit a stale long-running `next start` process serving the prior build. The owned BizPilot process was verified by command line, restarted, and the test advanced.
- The next browser run correctly exposed that the smoke still searched for an English mobile-menu label after the final locale in its loop was French. The behavior test now verifies the localized French control.
- The first accessibility report found the footer contrast issue described above; the repeated report is 100.

## Phase 5 entry conditions

- Use `lib/i18n/public-v3-spec.ts` and the approved seven-section storyboard as the homepage source of truth.
- Build the three-stage scattered questions → Smart Intake Link → organized request/review draft scene with the new product primitives.
- Preserve the Phase 3 language/navigation/browser-smoke contract and the Phase 4 landmark/focus/reduced-motion contract.
- Keep exactly seven homepage sections and remove repeated V2 thesis/outcome/roadmap sections.
- Capture the required EN/fr-CA desktop, laptop, tablet, mobile, dark, and reduced-motion evidence.
- Remeasure H1 line count, first-viewport CTA/product visibility, accessibility, and Lighthouse performance before committing Phase 5.

