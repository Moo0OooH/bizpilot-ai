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
| V3.2 Information architecture and bilingual copy | Complete pending commit | Ten retained routes, five merge redirects, seven homepage sections, typed EN/fr-CA contract, and parity tests |
| V3.3 Public-shell reliability | Pending | P0 locale switch plus 1280px header overflow |
| V3.4 Marketing design foundation | Pending | Tokens, shell, compact menu, typography, primitives |
| V3.5 Homepage conversion rebuild | Pending | Seven sections and three-stage product story |
| V3.6 Page consolidation and conversion | Pending | Route decisions, redirects, distinct page jobs |
| V3.7 Quality hardening | Pending | Performance, accessibility, SEO, resilient browser tests |
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

- Replace the fragile language form submission with a deterministic URL/cookie transition.
- Ensure query, cookie, selected state, rendered copy, metadata, and `<html lang>` agree after a language change and reload.
- Add a real interaction regression test that opens the language menu and clicks French.
- Remove the 1280px header overflow without changing the marketing visual system yet.
- Preserve unrelated query parameters and hashes while replacing stale `language` values.

## Canonical V3 documents

- [Research and benchmark audit](./V3_RESEARCH_AND_BENCHMARK_AUDIT.md)
- [Live defect matrix](./V3_LIVE_SITE_DEFECT_MATRIX.md)
- [Product truth and positioning](./V3_PRODUCT_TRUTH_AND_POSITIONING.md)
- [Final information architecture](./V3_FINAL_INFORMATION_ARCHITECTURE.md)
- [Final EN/fr-CA copy matrix](./V3_FINAL_EN_FR_COPY_MATRIX.md)
- [Route consolidation and redirect plan](./V3_ROUTE_CONSOLIDATION_AND_REDIRECT_PLAN.md)
- [Homepage storyboard](./V3_HOMEPAGE_STORYBOARD.md)
- [Visual system specification](./V3_VISUAL_SYSTEM_SPEC.md)
