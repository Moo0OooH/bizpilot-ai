# BizPilot Website V3 — Performance, Accessibility, SEO, and Regression Report

Local date: 2026-07-13

Branch: `codex/website-v3-rebuild`

Phase: V3.7 — Quality hardening

## Outcome

The ten-route Website V3 is hardened without changing its manual-first product boundary. The exact final local production build scores 98–99 for mobile Performance and 100 for Accessibility, Best Practices, and SEO across the 12-route/language Lighthouse matrix. Lab LCP is 1.956–2.495s, TBT is 18–47ms, CLS is 0, and transferred data is 227–238KiB.

The public experience still uses one Smart Intake Link, organized requests, AI-assisted drafts reviewed by a person, and manual sending. No monitoring sink, direct inbox integration, auto-send, booking, checkout, payment, CRM, production-data access, Supabase mutation, or unsupported automation was added.

## Before and after

| Measure | Phase 7 starting sample | Final exact-build result | Change |
| --- | ---: | ---: | ---: |
| Lighthouse Performance | 94–95 | 98–99 | +3 to +5 points |
| Accessibility | 96–100 | 100 on every route | Pricing contrast repaired |
| Best Practices | 100 | 100 on every route | Maintained |
| SEO | 100 | 100 on every route | Maintained with stronger route tests |
| LCP | 2.834–3.050s | 1.956–2.495s | All final samples at or below 2.5s |
| TBT | 18–112ms | 18–47ms | Lower worst case |
| CLS | 0 | 0 | Maintained |
| Transfer | 290–301KiB | 227–238KiB | About 63KiB lower at both range ends |
| Font transfer | About 54KiB | 0KiB | Removed route-wide font requests |
| Compiled global CSS | 151,440 bytes | 100,259 bytes | −51,181 bytes (−33.8%) |

JavaScript transfer remains 159–160KiB. The optimization did not hide JavaScript cost by moving equivalent work elsewhere; it removed dead CSS, route-wide font downloads, obsolete primitives, and nonessential hero motion.

## Final Lighthouse matrix

All runs used the exact production build served by `next start` on mobile Lighthouse settings.

| Route state | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Demo EN | 99 | 100 | 100 | 100 | 1.058s | 1.958s | 19ms | 0 | 230KiB |
| FAQ EN | 99 | 100 | 100 | 100 | 1.058s | 2.108s | 22ms | 0 | 233KiB |
| Features EN | 99 | 100 | 100 | 100 | 1.060s | 1.960s | 18ms | 0 | 232KiB |
| Home EN | 98 | 100 | 100 | 100 | 1.057s | 2.495s | 38ms | 0 | 236KiB |
| Home fr-CA | 99 | 100 | 100 | 100 | 1.056s | 2.106s | 47ms | 0 | 238KiB |
| Pilot EN | 99 | 100 | 100 | 100 | 1.058s | 1.958s | 34ms | 0 | 234KiB |
| Pilot fr-CA | 99 | 100 | 100 | 100 | 1.060s | 1.960s | 30ms | 0 | 236KiB |
| Pricing EN | 99 | 100 | 100 | 100 | 1.056s | 1.956s | 42ms | 0 | 233KiB |
| Privacy EN | 98 | 100 | 100 | 100 | 0.908s | 2.345s | 37ms | 0 | 229KiB |
| Security EN | 99 | 100 | 100 | 100 | 0.908s | 2.108s | 41ms | 0 | 230KiB |
| Terms EN | 99 | 100 | 100 | 100 | 0.908s | 2.108s | 37ms | 0 | 227KiB |
| Trust EN | 99 | 100 | 100 | 100 | 1.057s | 1.957s | 18ms | 0 | 231KiB |

Lighthouse 13.4.0 produced valid JSON for all 12 cases. Eleven CLI invocations returned exit 1 only after writing the report because Chrome Launcher could not remove its Windows temporary folder: `EPERM, Permission denied: \\?\C:\Users\mbeag\AppData\Local\Temp\lighthouse.*`. The remaining invocation exited 0. Report contents, categories, audits, and network evidence were readable in every case.

## Performance implementation

- Replaced route-wide Geist downloads with a zero-request native UI/monospace stack. The final matrix has zero font requests and no text swap caused by webfont arrival.
- Removed 51,181 compiled bytes of retired V2 homepage/cleaning styles while preserving shared legal containers and protected dashboard density/display rules.
- Removed unused V2 marketing hero primitives and two unreferenced client components.
- Removed first-view backdrop blur, reduced unnecessary reveal work, and kept the homepage animation-free.
- Added `content-visibility: auto` and intrinsic-size containment only to below-fold homepage sections; first-fold content and accessibility semantics remain present.
- Kept global client work limited to language selection, theme preference, and the compact menu. Demo tabs and Pilot copy are route-specific client islands.
- Tested documented Next.js `experimental.inlineCss`; it increased transfer to about 273KiB and worsened LCP to about 2.97s by duplicating CSS in HTML/RSC, so the experiment was reverted.
- Did not add Web Vitals reporting because there is no approved privacy-safe analytics sink. Field Core Web Vitals remain unavailable.

Cold Lighthouse is represented by the route matrix. Warm browser interaction evidence measured the final build at: language switch 767ms end-to-end navigation, Product navigation 123ms, reload 143ms, reverse language switch 46ms, theme 23ms, primary same-page CTA 108ms, and compact menu 7ms. Same-document interaction proxies are below 200ms; field INP is not claimed.

## Accessibility findings

- Fixed the one automated contrast failure: the Pricing “After the feedback cohort” badge was 4.36:1 and now passes through the stronger semantic primary token.
- Added roving `tabIndex`, Arrow keys, Home, End, focus movement, `aria-selected`, and tabpanel linkage to the Demo.
- Verified the skip link is the first keyboard target, Pilot copy works with Enter and a polite live status, Escape closes the mobile menu, and focus returns to its trigger.
- Added explicit focus-visible treatment to Demo tabs, the Pilot template, and the copy control.
- Screen-reader snapshots expose localized menu names, language state, one H1 per route, Demo tab/tablist/tabpanel states, and descriptive product-frame names.
- EN and fr-CA reflow have 0px overflow at 320, 360, 390, 430, 640, 768, 1024, 1280, 1440, and 1920px. The 640px and 320px checks are practical 200% and 400% reflow proxies from a 1280px reference.
- Light and dark tokens pass the existing contrast contract; final visual review covered English desktop, French mobile, dark hero/menu, Pricing, and keyboard focus in Demo.
- The homepage has no animation. Shared retained pages explicitly remove transitions under reduced-motion preference.
- Lighthouse Accessibility is 100 on all 12 final route states.

## SEO matrix

- Behavior tests generate and compare unique localized title/description pairs for all ten canonical routes in EN and fr-CA.
- Canonical and `en`/`fr-CA` alternates resolve only to retained public routes.
- The sitemap contains the ten canonical routes with localized alternates and excludes auth, dashboard, founder/admin, quote intake, redirected routes, and the test pseudolocale.
- Robots rules keep private and quote-specific states out of indexing.
- All five retired routes return direct permanent 308 redirects and preserve language/campaign queries.
- FAQ JSON-LD is generated from the same visible FAQ source; service structured data uses the current Smart Intake Link and human-reviewed draft boundary.
- Breadcrumb structured data no longer references retired Content Studio content.
- The OG image now uses the final V3 headline and product-boundary chips.
- No rating, review count, certification, customer, revenue, or organization fact was invented.

## Regression coverage

| Command or check | Result |
| --- | --- |
| `pnpm verify` | Pass: lint, typecheck, 249/249 unit tests, and Next.js 16.2.4 production build. |
| `pnpm smoke:public -- --base-url=http://127.0.0.1:3100` | Pass: 34/34 route, locale, and redirect checks. |
| `pnpm smoke:responsive -- --base-url=http://127.0.0.1:3100` | Pass: 20/20 canonical EN/fr-CA checks. |
| `pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3100` | Pass: zero failures across route, locale, theme, metadata, sitemap, robots, and auth isolation checks. |
| `pnpm smoke:browser -- --base-url=http://127.0.0.1:3100` | Pass: 54 retained-page states, 20 homepage reflow states, keyboard interactions, menu containment, timing, and zero application console/runtime errors. |
| `pnpm smoke:quote -- --base-url=http://127.0.0.1:3100` | Gated: exit 1 with `Provide at least one approved synthetic slug...`; no customer data or synthetic Supabase fixture was opened or created. |
| Lighthouse exact-build matrix | Valid reports for 12/12 states; 11 post-report Windows cleanup EPERM exits documented above. |
| Header audit | Pass for every materially edited source file after correcting two stale comment headers. |
| Secret/path scan | No high-confidence secret; one NIST URL false positive. `.env.example` is the only matching tracked environment path and contains blank keys/local placeholders. No artifact, screenshot, dump, archive, or production-data file is tracked. |
| `git diff --check` | Pass. |

The first full `pnpm verify` attempt failed 245/249 unit tests because the initial dead-CSS removal also removed shared dashboard/legal guards. The shared blocks were restored, motion tests were updated to verify the stronger animation-free behavior, and the complete verify subsequently passed. A new CTA timing check initially expected `/demo`; the V3 contract correctly targets `/#how-it-works`, so the harness expectation was corrected and passed. No application defect was hidden by weakening a behavior check.

## Evidence and remaining constraints

Ignored local evidence is stored under:

- `artifacts/rebuild-v3/phase7/lighthouse-final-current/`
- `artifacts/rebuild-v3/phase7/browser/`

Field LCP, CLS, and INP are not available without approved project-owned RUM. Lab targets are met on the exact local production build. The quote route remains deliberately untested without an approved synthetic slug because production/customer data and Supabase mutations are outside this phase.

## Phase 8 entry conditions

- Preserve the exact ten-route V3 product truth, five direct 308 redirects, locale behavior, keyboard contracts, and zero-overflow matrix.
- Run a clean install and full validation after synchronizing with `main`.
- Confirm no secret, environment value, screenshot, artifact, dump, archive, or production data is tracked.
- Use a reviewed PR and merge only after green CI.
- Deploy the exact merged `main` SHA, confirm Vercel Ready state and alias, and run read-only production acceptance without mutating Supabase or submitting customer data.
