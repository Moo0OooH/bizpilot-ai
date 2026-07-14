# V3 Public Shell Reliability Report

Date: 2026-07-13

Status: Phase 3 complete pending commit

Target: optimized local production build at `http://127.0.0.1:3100`

## Outcome

The confirmed production P0 locale defect and 1280px shell overflow are repaired in source and covered by a real Chrome interaction smoke. The repair does not depend on a source-string assertion or direct French URL alone.

The test opens the language menu, follows the French option with existing query/hash state, verifies visible French and selected state, follows an internal Product link, reloads, switches back to English, checks the explicit locale persistence URL, changes theme, measures document overflow at nine viewports in both languages, inspects the open mobile menu, and records application console/runtime errors.

## Root cause and repair

### P0: FR click returned to English

The old public language control submitted a conditional button through `setInterfaceLanguageAction`. Its form `onSubmit` copied the live URL into `redirectTo` and immediately closed the menu, unmounting the submitter that carried `name="language"`. Two failure modes existed:

1. On `?language=en`, the Server Action wrote an FR cookie and redirected to the copied EN query. `proxy.ts` correctly treated the query as authoritative and changed the cookie back to EN.
2. Closing the menu during submit made the submitter-provided language value timing-sensitive.

The public locale form and its now-unused public Server Action were removed. Each locale option is now a native anchor with an explicit locale query built from the current pathname, query, and hash. The option remains functional without client JavaScript. The request proxy receives an unambiguous locale and updates the persistence cookie before server rendering.

### Hidden mismatch found by the new browser test

The first repair used `next/link`. It changed the visible text and URL to French, but client-side RSC navigation did not rebuild the root layout, leaving `<html lang="en">`. The browser smoke rejected this mixed state.

Locale options now use native document navigation. Query, cookie, server-rendered copy, metadata request, selected menu state, and `<html lang>` are created from the same request. This is deliberate: language is document-level state, not only page-body state.

### Reverse switch to English

Removing `language=fr-CA` from the current URL was insufficient because the FR persistence cookie remained. A dedicated `publicLanguageHref` helper now always sends `language=en` or `language=fr-CA` for the locale-switch request. Normal English marketing links still use clean URLs through `publicHref`; the English canonical remains clean even when the switching request temporarily contains `?language=en`.

### P1: 1280px header overflow

The old desktop shell became visible at 1240px even though the brand, six/grouped navigation areas, language, theme, sign-in, and pilot CTA required more than the actual 1265px document client width at a requested 1280px viewport.

The repair:

- applies the approved compact header IA: Product, How it works, Demo, Pricing, Resources (FAQ and Trust);
- keeps the desktop header collapsed until the measured 1440px breakpoint;
- preserves Sign in, Pilot, language, and theme in both shell states;
- removes the obsolete Use cases and duplicate guide/comparison entries from the top navigation;
- retains old footer links until the Phase 4/6 footer and redirect implementation.

### P1: nested mobile menu scrolling

The old compact panel capped itself at `70svh` and forced `overflow-y:auto`, placing Sign in and the pilot CTA below the first visible panel region. After the navigation reduction, the nested scroller and overscroll containment were removed. At 390×844 the open panel measured from 64px to 663px, its `scrollHeight` matched its `clientHeight`, and the document had no horizontal overflow.

## Deterministic locale contract

| Event | URL signal | Cookie after response | Rendered state |
| --- | --- | --- | --- |
| Click FR from EN | `language=fr-CA` replaces stale `language=en`; other query/hash state remains | `fr-CA` | French copy, FR selected, `<html lang="fr-CA">` |
| Internal French navigation | `publicHref` carries `language=fr-CA` | `fr-CA` | Destination remains French |
| French reload | Existing query and cookie agree | `fr-CA` | French remains stable |
| Click EN from FR | explicit `language=en` switch request | `en` | English copy, EN selected, `<html lang="en">` |
| Later English navigation | normal English links are clean | `en` | English remains stable through cookie |

The switch helper replaces an existing locale value rather than appending a duplicate. Unrelated query parameters and fragments remain in the current-page language option.

## Real browser evidence

Command:

```text
pnpm smoke:browser -- --base-url http://127.0.0.1:3100
```

Verified sequence:

1. Open `/?language=en&source=browser-smoke#how-it-works`.
2. Open `Website language: English`.
3. Verify the FR anchor is `/?language=fr-CA&source=browser-smoke#how-it-works`.
4. Send a real Chrome pointer click to FR.
5. Assert French H1, `lang=fr-CA`, FR selected, and retained `source` query.
6. Follow Product and assert `/features?language=fr-CA` stays French.
7. Reload and assert French persists.
8. Click EN and assert English H1, `lang=en`, EN selected, and explicit `language=en` persistence request.
9. Select Dark and return to Light; assert root theme state changes.
10. Run the responsive matrix and mobile-menu inspection.
11. Assert zero application `console.error` or runtime exceptions.

Result: PASS.

## Overflow matrix

The requested CDP viewport includes a 15px vertical scrollbar at several desktop widths, so the assertion compares `documentElement.scrollWidth` with the actual `documentElement.clientWidth` rather than assuming the requested width is the content width.

| Requested viewport | EN root overflow | fr-CA root overflow |
| ---: | ---: | ---: |
| 320 | 0px | 0px |
| 360 | 0px | 0px |
| 390 | 0px | 0px |
| 430 | 0px | 0px |
| 768 | 0px | 0px |
| 1024 | 0px | 0px |
| 1280 | 0px | 0px |
| 1440 | 0px | 0px |
| 1920 | 0px | 0px |

No global `overflow-x:hidden` patch was introduced. The measured header fit and navigation density were corrected at their source.

## Local interaction profile

Measured by the Chrome smoke on the optimized local production build:

| Interaction | Observed completion |
| --- | ---: |
| Cold EN → FR document navigation | 771ms |
| French Product client navigation | 126ms |
| French reload | 143ms |
| FR → EN document navigation | 87ms |
| Theme open/select/application | 30ms |

These are local lab observations, not field Core Web Vitals or marketing claims. The slower first FR transition includes the cold document request. No long-running client operation, spinner-worthy wait, hydration warning, application runtime error, or failed network response was observed in the acceptance smoke.

The Phase 1 production baseline already showed mobile Lighthouse Performance 98 and desktop 100, about 304KiB encoded cold transfer, and no sampled application/network failure. The perceived “hang” was primarily a broken state transition and a dense interaction surface, not an oversized static payload.

## Automated validation

| Command | Result |
| --- | --- |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test:unit` | PASS, 245/245 |
| `pnpm build` | PASS; Next.js 16.2.4 optimized build |
| `pnpm smoke:public -- --base-url http://127.0.0.1:3100` | PASS, 33/33 |
| `pnpm smoke:responsive -- --base-url http://127.0.0.1:3100` | PASS, 25 routes, 0 failures |
| `pnpm smoke:browser -- --base-url http://127.0.0.1:3100` | PASS, real locale/theme clicks, 18 viewport-language checks, mobile menu, 0 runtime errors |

## Harness failures that improved the evidence

The following intermediate failures were fixed rather than hidden:

- The first Chrome smoke used a TypeScript parameter property unsupported by Node strip-only mode. Exact failure: `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`. The harness now uses an explicit class field.
- The first link implementation produced French visible copy with `<html lang="en">`. The smoke failed until locale changes became native document navigations.
- The first reverse switch removed the FR query but left the FR cookie. The smoke failed until the language-switch helper began sending explicit EN state.
- The first viewport wait assumed `clientWidth` equals the requested CDP width. The smoke failed at 320px because the scrollbar reduces client width. It now waits on `window.innerWidth` and tests overflow against the real client width.

## Files and ownership

- `components/public/marketing-language-menu.tsx`: native locale anchors and accessible disclosure behavior.
- `lib/i18n/public-href.ts`: normal localized links plus explicit switch-request links.
- `server/actions/business-configuration.actions.ts`: removed obsolete public locale Server Action; protected workspace language action remains.
- `components/public/marketing-ui.tsx`: approved compact header IA and 1440px measured desktop threshold.
- `components/public/marketing-compact-menu.tsx`: removed nested scrolling and aligned breakpoint.
- `tests/smoke/public-browser-interaction-smoke.mts`: self-contained Chrome/CDP interaction regression.
- `tests/unit/public-language-links.test.mts` and `tests/unit/marketing-header-source.test.mts`: pure URL and source contract coverage.
- `package.json`: exposes `smoke:browser`.

## Remaining visual work

This phase deliberately does not rebuild the hero, typography, section system, footer, or secondary pages. The current hero still has excessive wide-screen line count and the current footer still exposes routes scheduled for Phase 6 redirects. Those are implementation work for Phases 4–6, not unresolved shell-reliability failures.

## Safety statement

No Supabase data, customer record, migration, RLS policy, production access state, payment configuration, auth provider, booking function, auto-send function, or deployment was changed. The local smoke used public read-only pages and a temporary OS-level Chrome profile that was removed after each run.
