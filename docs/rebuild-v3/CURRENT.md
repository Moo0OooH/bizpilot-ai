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
| V3.1 Research and evidence audit | Complete pending commit | `V3_RESEARCH_AND_BENCHMARK_AUDIT.md`, `V3_LIVE_SITE_DEFECT_MATRIX.md`, `V3_PRODUCT_TRUTH_AND_POSITIONING.md` |
| V3.2 Information architecture and bilingual copy | Next | Must use the V3.1 evidence and the seven-section ceiling |
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

## Phase 2 entry conditions

- Keep a maximum seven-section homepage.
- Finalize EN and natural fr-CA together.
- Give every retained route one job and one primary conversion action.
- Keep `/`, `/features`, `/demo`, `/pricing`, `/pilot`, `/faq`, `/trust`, legal, auth, and quote routes distinct.
- Prefer merge plus permanent redirect for duplicate public pages; do not delete on assumption.
- Use the recommended hero as the copy baseline unless a clearer truthful version is proven.
- Preserve: one link shared anywhere, service-specific questions, organized request, missing-detail visibility, AI-assisted draft, human review/edit/copy/manual send.

## Canonical V3 documents

- [Research and benchmark audit](./V3_RESEARCH_AND_BENCHMARK_AUDIT.md)
- [Live defect matrix](./V3_LIVE_SITE_DEFECT_MATRIX.md)
- [Product truth and positioning](./V3_PRODUCT_TRUTH_AND_POSITIONING.md)
