# BizPilot Website V3 — Current State

Local date: 2026-07-13

Branch: `codex/website-v3-rebuild`

Baseline: `f86ad3a3e24aac31e1b459a23d9bf6d72cefec22`

Production: <https://bizpilo.com>

## Product truth

BizPilot helps service businesses turn scattered, incomplete customer questions into structured requests and human-approved reply drafts through one shareable Smart Intake Link. The current product does not ingest social inboxes directly, send replies automatically, invent prices, book appointments, collect payments, or replace a CRM.

## Phase status

| Phase | Status | Evidence |
| --- | --- | --- |
| V3.1 Research and evidence audit | Complete | Commit `f09d3aebf8e32417476ae4225b9d4410c2f6d8d1` plus audit, defect, and positioning documents |
| V3.2 Information architecture and bilingual copy | Complete | Commit `0fbd589b6b703033ec3b2dc2141ceed6c7d9ddfa`; ten retained routes, five merge redirects, seven homepage sections, and typed EN/fr-CA contract |
| V3.3 Public-shell reliability | Complete | Commit `760beb297a8b686a762e5ac81c58a47f746db797`; native locale navigation, explicit cookie transition, 1440px desktop threshold, compact final header IA, and real Chrome interaction smoke |
| V3.4 Marketing design foundation | Complete | Consolidated V3 tokens and primitives, simplified header/footer, corrected landmarks, 100 accessibility score, and documented browser/visual evidence |
| V3.5 Homepage conversion rebuild | Complete | Seven-section V3 story, three-stage product scene, EN/fr-CA first-view evidence, 100 accessibility, and 96 performance |
| V3.6 Page consolidation and conversion | Complete | Ten canonical routes, five direct 308 redirects, distinct bilingual page jobs, safe interactive demo, and copy-only pilot path |
| V3.7 Quality hardening | Complete | 98–99 Performance, 100 Accessibility/Best Practices/SEO, 1.956–2.495s LCP, 0 CLS, 249 tests, keyboard/reflow/SEO hardening |
| V3.8 Production acceptance | Pending | Exact main SHA, deployment match, live proof |

## Confirmed production defects

- P0: Clicking `FR — Français (Canada)` does not change visible copy, URL state, selected state, or `html lang` to French.
- P0: On `/?language=en`, the same failed FR click remains on the English query and English content.
- P1: At a requested 1280px viewport, the document has 56px horizontal overflow caused by desktop header actions.
- P1: At 1024, 1440, and 1920 widths, the hero H1 consumes about 9, 8, and 9 lines respectively.
- P1: The homepage has 12 meaningful sections and repeats the same mechanism, control boundary, and current-product limitations.
- P1: The mobile menu creates a tall, internally scrolling first-viewport panel; Sign in and the pilot CTA sit below the initial panel viewport.
- P2: The hero product scene is dense, low-contrast, and copy-heavy in the first viewport.

## Root causes established

- `MarketingLanguageMenu` submits through `setInterfaceLanguageAction` while synchronizing `redirectTo` from the old URL. An existing `language=en` query overrides the newly written FR cookie in `proxy.ts` on redirect.
- The same form closes and unmounts its submit buttons in `onSubmit`, making the submitter-carried `name="language"` value timing-sensitive.
- Existing tests validate source strings and direct localized URLs; they do not open the menu and click FR in a browser.
- Desktop header visibility begins at 1240px while its brand, grouped navigation, utility controls, sign-in, and CTA require more width than the 1280px viewport can supply.
- Hero copy width remains about 432px at wide screens while font size grows to 84px, so line count gets worse at 1920px.

## Baseline evidence

- Browser audit: Chrome, production, real click interactions.
- Viewport matrix: 320, 360, 390, 430, 768, 1024, 1280, 1440, and 1920.
- Languages: EN and direct fr-CA; click-path failure separately reproduced.
- Themes: light and dark both render; theme selection works.
- Reduced motion: media preference is recognized; no active keyframe animation was observed in the sampled hero.
- Console/network: no application warning/error and no failed response in the sampled cold page load.
- Cold CDP sample: 34 successful responses and about 304KiB encoded transfer.
- Lighthouse 13.4.0 mobile EN: Performance 98, Accessibility 100, Best Practices 100, SEO 100; LCP 2.4s, TBT 70ms, CLS 0.
- Lighthouse 13.4.0 desktop fr-CA: 100/100/100/100; LCP 0.6s, TBT 10ms, CLS 0.
- Ignored artifacts: `artifacts/rebuild-v3/baseline/`.

## Open risks and constraints

- Public search currently surfaces only stale homepage content; no evidence of independently indexed secondary routes was found. Route consolidation must still use redirects and preserve canonical intent.
- No private analytics or backlink platform was opened. Destructive route removal is not authorized without evidence; V3.2 should prefer redirect/merge decisions.
- Field Core Web Vitals were not available from a project-owned RUM dataset. Lighthouse values are lab evidence only.
- Dashboard, auth, quote flow, Supabase, migrations, RLS, customer data, and founder controls remain out of scope except for minimal public-shell integration fixes.

## Phase 2 decisions

- Retain `/`, `/features`, `/demo`, `/pricing`, `/pilot`, `/faq`, `/trust`, `/privacy`, `/security`, and `/terms` as distinct public marketing/legal pages.
- Keep auth, dashboard, quote, intake, and founder/admin routes distinct from the public marketing rewrite.
- Merge `/comparison`, `/quote-link-guide`, `/faster-quote-replies`, `/content-studio`, and `/industries/cleaning` through direct permanent redirects in Phase 6.
- Use one compact navigation with Product, How it works, Demo, Pricing, Resources, Sign in, and Pilot.
- Keep the homepage at exactly seven sections: Hero, Problem, Workflow, Outcomes, Cleaning demo, Trust, Final CTA.
- Use `lib/i18n/public-v3-spec.ts` as the typed implementation source for both languages.
- Preserve the approved prices: `$0 setup`, `$149 setup + $49/month`, and `$199 setup + $79/month`, with no self-serve checkout.
- Keep the public pilot action copy-only until a verified public founder contact or approved submission path exists.

## Phase 3 entry conditions

- Complete: public locale selection uses native document navigation and an explicit locale query rather than the old Server Action form.
- Complete: FR and EN clicks, selected state, internal navigation, reload, cookie persistence, visible copy, and `<html lang>` pass in real Chrome.
- Complete: EN/fr-CA root overflow is 0px at 320, 360, 390, 430, 768, 1024, 1280, 1440, and 1920 requested widths.
- Complete: the 390×844 mobile menu fits from 64px to 663px with no nested scroll.
- Complete: the browser smoke reports zero application console/runtime errors.

## Phase 4 entry conditions

- Preserve the working locale anchors, explicit switch helper, 1440px measured fit rule, and real browser smoke.
- Implement semantic marketing tokens and primitives without creating a second competing CSS system.
- Rebuild the header and footer to the approved V3 architecture while preserving the reliability behavior.
- Establish typography, layout, button, card, focus, motion, light/dark, and product-scene foundations from `V3_VISUAL_SYSTEM_SPEC.md`.
- Do not implement the final seven-section homepage until the foundation passes unit, build, public smoke, responsive smoke, and browser interaction smoke.

## Phase 4 result

- Complete: type, line-height, spacing, radius, border, elevation, width, focus, and motion tokens form one V3 public foundation while legacy `bp-*` roles map forward to it.
- Complete: shared shell, card, button, brand, skip-link, and product-scene primitives replace repeated one-off values where current route use allowed.
- Complete: header and compact menu preserve the reliable language path, theme control, 1440px measured desktop fit, one primary CTA, and no nested scrolling.
- Complete: footer now exposes only Product, Resources, Trust/Legal, and Account jobs; links scheduled for Phase 6 redirects are no longer promoted.
- Complete: semantic landmarks now separate banner, main, and contentinfo; Lighthouse accessibility is 100 after repairing the one 4.39:1 footer contrast failure.
- Complete: EN/fr-CA overflow is 0px at 320, 360, 390, 430, 768, 1024, 1280, 1440, and 1920; the French 390×844 menu fits from 64px to 661px without nested scroll.
- Complete: lint, typecheck, 249 unit tests, production build, 33-route public smoke, 25-route responsive smoke, and real-browser interaction smoke pass.
- Evidence: [V3 design-system implementation report](./V3_DESIGN_SYSTEM_IMPLEMENTATION_REPORT.md).

## Phase 5 entry conditions

- Replace the V2 homepage renderer with the approved typed V3 seven-section story; do not reopen IA or copy strategy.
- Preserve the working locale, theme, semantic landmark, focus, reduced-motion, and responsive-shell contracts.
- Use the new product-frame primitives for a readable three-stage visual and keep channel placement distinct from direct inbox integration.
- Prove H1 line count, CTA visibility, product-story readability, no clipping, and 0px overflow at the required desktop, laptop, tablet, and mobile evidence sizes.
- Re-run accessibility and Lighthouse; the Phase 4 local mobile performance sample was 94 with 2.9s LCP, 110ms TBT, 0 CLS, and 311KiB transfer.

## Phase 5 result

- Complete: `/` now renders exactly seven direct story sections and no longer uses the repeated V2 homepage narrative.
- Complete: the EN and fr-CA headlines state message overload, complete requests, and review-ready replies without unsupported automation claims.
- Complete: the product scene shows Scattered questions → One Smart Intake Link → Ready for your team and labels direct inbox integrations as roadmap.
- Complete: both CTAs are visible at every captured viewport; the product story is visible in the first viewport at 390×844 and above, with the full mechanism already stated in copy at 360×740.
- Complete: EN/fr-CA browser checks have 0px overflow at 320 through 1920, the mobile menu remains contained, and the application reports zero runtime errors.
- Complete: Lighthouse mobile EN is 96 performance, 100 accessibility, 100 best practices, and 100 SEO, with 2.8s LCP, 20ms TBT, 0 CLS, and 298KiB transfer.
- Complete: `pnpm verify`, 33-route public smoke, 25-route responsive smoke, browser interaction smoke, and the final UI matrix pass.
- Evidence: [V3 homepage and hero acceptance](./V3_HOMEPAGE_AND_HERO_ACCEPTANCE.md).

## Phase 6 entry conditions

- Preserve the accepted homepage, locale reliability, 0px responsive overflow, human-review boundary, and product-scene readability.
- Migrate the retained Features, Demo, Pricing, Pilot, FAQ, Trust, Privacy, Security, and Terms routes to the V3 copy contract and shared shell.
- Implement the five approved permanent redirects with direct destinations, fragments, and locale query preservation.
- Keep each retained route short and job-specific; do not reproduce merged guide content as new long-form pages.
- Use a safe copy-only pilot request until a verified public founder contact or submission path is approved.

## Phase 6 result

- Complete: ten canonical public routes now use the V3 content contract, shell, metadata, and one distinct conversion job per page.
- Complete: `/comparison`, `/quote-link-guide`, `/faster-quote-replies`, `/content-studio`, and `/industries/cleaning` are removed and return direct HTTP 308 redirects with locale/campaign queries preserved.
- Complete: Demo moves from a vague cleaning question through the Smart Intake Link to an organized request and owner-reviewed draft without submitting data or inventing a quote.
- Complete: Pilot uses a localized copy-only 60-second request with no empty-recipient `mailto:`, form submission, storage, payment, account creation, or production-data access.
- Complete: Features, Demo, Pricing, Pilot, FAQ, Trust, and legal pages are concise, bilingual, responsive, and connected to one logical next step.
- Complete: `pnpm verify` passes with 249/249 unit tests; public smoke is 34/34, responsive smoke is 20/20, the final UI matrix has zero failures, and browser smoke passes 54 retained-page responsive states with zero runtime errors.
- Evidence: [V3 page consolidation and conversion report](./V3_PAGE_CONSOLIDATION_AND_CONVERSION_REPORT.md).

## Phase 7 entry conditions

- Preserve the ten canonical routes, direct 308 redirects, safe conversion path, EN/fr-CA parity, and zero-overflow matrix.
- Record route-level transfer and bundle evidence and measure the final Lighthouse mobile matrix without gaming scores.
- Audit WCAG 2.2 AA behavior, keyboard/focus order, screen-reader names and states, reflow, contrast, reduced motion, unique metadata, structured-data parity, sitemap/robots isolation, console errors, and secrets.
- Keep client JavaScript limited to necessary language, theme, menu, Demo, and Pilot interactions.

## Phase 7 result

- Complete: the exact final local production build scores 98–99 Performance and 100 Accessibility, Best Practices, and SEO across 12 Lighthouse route/language states.
- Complete: lab LCP is 1.956–2.495s, TBT is 18–47ms, CLS is 0, transfer is 227–238KiB, and no webfont request remains.
- Complete: compiled global CSS is 100,259 bytes, down 51,181 bytes (33.8%), while shared dashboard/legal contracts remain intact.
- Complete: Demo has roving keyboard tabs; skip navigation, Pilot Enter/live status, Escape/focus return, dark/light contrast, and screen-reader names/states are verified.
- Complete: EN/fr-CA reflow has 0px overflow at ten widths including practical 200%/400% proxies; 54 retained-page states and 20 homepage states pass with zero runtime errors.
- Complete: all ten routes have unique localized metadata, canonical/hreflang, matching structured data, canonical sitemap isolation, robots isolation, and direct intent-preserving redirects.
- Complete: `pnpm verify`, public smoke 34/34, responsive smoke 20/20, UI matrix, browser smoke, header audit, secret scan, and `git diff --check` pass.
- Gated: quote smoke requires an approved synthetic slug; no customer data or Supabase fixture was opened or created.
- Evidence: [V3 performance, accessibility, SEO, and regression report](./V3_PERFORMANCE_ACCESSIBILITY_SEO_REPORT.md).

## Phase 8 entry conditions

- Synchronize the branch with `main`, review the V3 reports, and run a clean install plus the full validation set.
- Confirm no secret, environment value, temporary screenshot, dump, archive, artifact, or production data is tracked.
- Merge through reviewed green CI, deploy the exact merged `main` SHA, and confirm the Vercel deployment SHA and Ready alias.
- Run the required read-only production route, language, viewport, redirect, theme, auth, legal, quote-unavailable, console, network, and Lighthouse acceptance without mutating Supabase or submitting customer data.

## Canonical V3 documents

- [Research and benchmark audit](./V3_RESEARCH_AND_BENCHMARK_AUDIT.md)
- [Live defect matrix](./V3_LIVE_SITE_DEFECT_MATRIX.md)
- [Product truth and positioning](./V3_PRODUCT_TRUTH_AND_POSITIONING.md)
- [Final information architecture](./V3_FINAL_INFORMATION_ARCHITECTURE.md)
- [Final EN/fr-CA copy matrix](./V3_FINAL_EN_FR_COPY_MATRIX.md)
- [Route consolidation and redirect plan](./V3_ROUTE_CONSOLIDATION_AND_REDIRECT_PLAN.md)
- [Homepage storyboard](./V3_HOMEPAGE_STORYBOARD.md)
- [Visual system specification](./V3_VISUAL_SYSTEM_SPEC.md)
- [Public shell reliability report](./V3_PUBLIC_SHELL_RELIABILITY_REPORT.md)
- [Design-system implementation report](./V3_DESIGN_SYSTEM_IMPLEMENTATION_REPORT.md)
- [Homepage and hero acceptance](./V3_HOMEPAGE_AND_HERO_ACCEPTANCE.md)
- [Page consolidation and conversion report](./V3_PAGE_CONSOLIDATION_AND_CONVERSION_REPORT.md)
- [Performance, accessibility, SEO, and regression report](./V3_PERFORMANCE_ACCESSIBILITY_SEO_REPORT.md)
