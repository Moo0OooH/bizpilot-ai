# BizPilot Website V3 — Page Consolidation and Conversion Report

Local date: 2026-07-13

Branch: `codex/website-v3-rebuild`

Phase: V3.6 — Page consolidation and conversion journey

## Outcome

The public website now has ten canonical, indexable marketing and legal routes. Each retained page has one distinct job, one logical next step, complete EN/fr-CA content, V3 shell integration, and responsive behavior. Five overlapping V2 pages are removed from the route tree and resolve through direct permanent redirects that preserve language and campaign query parameters.

The conversion path remains accurate to the current product: a customer starts with a vague question, the business shares one Smart Intake Link, BizPilot organizes the missing details, and a human reviews, edits, copies, and manually sends the resulting draft. No page claims direct inbox ingestion, auto-send, invented pricing, booking, payments, or CRM replacement.

## Canonical route outcomes

| Route | Decision | Page job and primary next step |
| --- | --- | --- |
| `/` | Keep | Seven-section overview; continue to the demo or pilot application. |
| `/features` | Keep and rebuild | Explain the current product with concrete evidence; continue to the demo. |
| `/demo` | Keep and rebuild | Interactive three-stage cleaning walkthrough; continue to the pilot. |
| `/pricing` | Keep and rebuild | Explain the approved founder-pilot tiers and boundaries; continue to the pilot. |
| `/pilot` | Keep and rebuild | Copy a safe 60-second founder-pilot request; no public submission or storage. |
| `/faq` | Keep and rebuild | Answer ten buying and product-truth objections; continue to the pilot. |
| `/trust` | Keep and rebuild | Summarize privacy, security, operational control, and current limits; continue to the pilot. |
| `/privacy` | Keep and reshell | Preserve policy detail in the V3 shell with readable navigation and metadata. |
| `/security` | Keep and reshell | Preserve security detail in the V3 shell with readable navigation and metadata. |
| `/terms` | Keep and reshell | Preserve terms detail in the V3 shell with readable navigation and metadata. |

Auth, dashboard, quote, intake, founder/admin, Supabase, migrations, RLS, and customer data remain outside the marketing rebuild.

## Consolidated routes and redirect evidence

All redirects are defined in `next.config.ts` as `permanent: true` and return HTTP 308 before route rendering.

| Removed route | Destination | Verified locale/campaign behavior |
| --- | --- | --- |
| `/comparison` | `/features#focused-by-design` | `?language=fr-CA&source=smoke` becomes `/features?language=fr-CA&source=smoke#focused-by-design`. |
| `/quote-link-guide` | `/features#share-anywhere` | Query parameters are preserved before the fragment. |
| `/faster-quote-replies` | `/#how-it-works` | Query parameters are preserved before the fragment. |
| `/content-studio` | `/features#reply-drafts` | Query parameters are preserved before the fragment. |
| `/industries/cleaning` | `/demo` | Query parameters are preserved. |

The removed pages are absent from the production route manifest, internal navigation, sitemap, and canonical route list. The sitemap contains only the ten canonical public routes with EN/fr-CA alternates.

## Conversion-path result

- Features uses a current-capability product frame instead of a generic feature wall.
- Demo begins with “How much for a move-out cleaning this Friday?”, collects the missing property, scope, timing, and access details, then shows an organized request and a human-review draft.
- The Demo interaction changes accessible tab and tabpanel state without submitting data, creating an account, inventing a quote, confirming a booking, or sending a message.
- Pricing retains the approved `$0 setup`, `$149 setup + $49/month`, and `$199 setup + $79/month` options and exposes no checkout.
- Pilot uses a copy-only request template. The browser click produced the localized live status `Demande de pilote copiée.` No form, `mailto:`, fetch, storage, account, payment, or production-data access is involved.
- FAQ contains ten visible answers and matching FAQ structured data.
- Trust states the human-control and operational boundaries without invented certifications or guarantees.

## Implementation consolidation

- Added one shared `PublicV3Page` renderer and one page-specific CSS module for all six marketing secondary pages.
- Added small client islands only where interaction is required: the three-step Demo and copy-only Pilot request.
- Removed the obsolete V2 page renderer, V2 homepage renderer/styles, cleaning demo, and pilot template components after all retained routes migrated.
- Updated typed bilingual route content, metadata, canonical route lists, sitemap, route tests, responsive tests, browser tests, and redirect checks together.
- Preserved the V3 shell, language navigation, theme control, focus states, compact mobile menu, legal content, and manual-first product boundary.

## Visual and interaction evidence

Ignored local evidence is stored at:

- `artifacts/rebuild-v3/phase6/features-desktop-en.png`
- `artifacts/rebuild-v3/phase6/demo-ready-desktop-en.png`
- `artifacts/rebuild-v3/phase6/pilot-mobile-fr-ca.png`

The browser pass confirmed one H1 per retained route, the final Demo tab state, the localized Pilot copy state, mobile-first-viewport containment, and zero application console/runtime errors.

## Validation

| Command or check | Result |
| --- | --- |
| `pnpm verify` | Pass: lint, typecheck, 249/249 unit tests, and Next.js 16.2.4 production build. |
| `pnpm smoke:public -- --base-url=http://127.0.0.1:3100` | Pass: 34/34 retained, auth, redirect, locale-query, and language-link checks. |
| `pnpm smoke:responsive -- --base-url=http://127.0.0.1:3100` | Pass: 20/20 canonical EN/fr-CA page checks. |
| `pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3100` | Pass: zero failures across ten public routes, EN/fr-CA, light/dark, metadata, links, sitemap, robots, and auth isolation. |
| `pnpm smoke:browser -- --base-url=http://127.0.0.1:3100` | Pass: locale navigation/reload/reverse switch, 18 homepage overflow states, 54 retained-page H1/overflow states, mobile menu containment, theme interaction, and zero runtime errors. |
| Manual Demo/Pilot browser checks | Pass: accessible tab selection and localized clipboard live status. |
| Required source-header audit | Pass: all 27 materially edited source/test files contain the BizPilot header fields and 2026-07-13 change entry. |

The first production build referenced deleted routes through stale `.next/dev/types`; the generated `.next` directory was verified and removed, then the clean build passed. The first rewritten responsive smoke inspected serialized script text and overcounted FAQ `<details>` elements; it was narrowed to visible markup and page-specific FAQ items, then 20/20 passed. The first expanded browser matrix inherited the French locale cookie for the English cases; each state now sets its language explicitly and all 54 states pass.

## Phase 7 entry conditions

- Preserve the ten-route canonical matrix, direct 308 redirects, safe copy-only pilot path, current-product claims, and zero-overflow browser matrix.
- Measure route-level transfer/bundle evidence and Lighthouse mobile scores against the Phase 5 homepage baseline.
- Audit Server/Client boundaries, metadata uniqueness, structured-data parity, keyboard behavior, contrast, reduced motion, reflow, console errors, and secrets.
- Replace remaining brittle source checks with behavior checks where doing so improves regression resistance.
- Do not add analytics or monitoring unless it is demonstrably privacy-safe, lightweight, and needed.
