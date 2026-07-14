# V3 Live Site Defect Matrix

Date: 2026-07-13

Production: <https://bizpilo.com>

Browser: Chrome through real UI interactions

## Severity key

- P0: blocks a core promise or makes a primary control false.
- P1: materially harms comprehension, navigation, responsive use, or conversion.
- P2: visible quality or maintainability defect that should be repaired in the rebuild.

## Confirmed defects

| ID | Severity | Surface | Evidence | Root cause / likely owner | Required acceptance |
| --- | --- | --- | --- | --- | --- |
| LANG-01 | P0 | Desktop language selector | Open EN menu, click `FR — Français (Canada)`; URL remains English/root, H1 remains English, selected state remains EN, `html lang` remains `en` | Server Action redirect target copies the old locale query; proxy reasserts it | FR click visibly changes copy, URL/cookie, selected state, metadata, and `html lang` |
| LANG-02 | P0 | Mobile language selector | From `/?language=en`, FR click remains at the English URL and H1 | Same shared language form | Same as LANG-01 at mobile widths |
| LANG-03 | P1 | Form behavior | Locale value is carried only by the submit button while `onSubmit` closes/unmounts the menu | Timing-sensitive submitter serialization | Locale value must be deterministic and covered by no-JS/progressive behavior or a documented client navigation path |
| TEST-01 | P0 | Regression coverage | Current tests pass direct fr-CA rendering without a real click | Source/fetch tests substitute for interaction | Browser test opens, clicks, asserts, navigates, reloads, and reverses locale |
| RESP-01 | P1 | Header at requested 1280×720 | 56px document overflow; right utility cluster extends to x=1321 while client width is 1265 | Desktop breakpoint activates before full header fits | Numeric document overflow equals zero |
| RESP-02 | P1 | Hero at 1024, 1440, 1920 | H1 uses about 9, 8, and 9 lines | Narrow fixed copy column plus expanding font | Desktop/laptop H1 normally 3–4 lines and CTAs visible in first viewport |
| RESP-03 | P1 | Mobile menu | Panel requires its own long scroll; key actions begin below the initial panel viewport | Too many top-level/grouped destinations | Compact menu exposes core tasks without first-viewport nested scroll |
| CONTENT-01 | P1 | Homepage | 12 sections; statement, problem, flow, control, day, industries, features, and final CTA repeat the same thesis | V2 accumulated explanatory sections | Maximum seven distinct sections |
| CONTENT-02 | P1 | Hero visual | Dense three-column mini-workspace contains disclaimer and small product copy | Product screenshot metaphor used as documentation | Three readable stages understandable without paragraphs |
| CONTENT-03 | P2 | Positioning | Limitations and roadmap language appear inside the hero and again below | Defensive truth is placed before value clarity | Keep truth, move detailed limitations to trust/FAQ/comparison contexts |
| NAV-01 | P1 | Desktop and mobile header | Use cases, Resources, Trust, multiple guides, comparison, and roadmap anchors create choice overload | Navigation mirrors accumulated routes | Navigation reflects current user goals only |
| THEME-01 | P2 | Mobile theme interaction | Theme menu works but sits deep inside the internally scrolling mobile panel | Menu depth, not theme state | Theme control remains reachable and keyboard-safe in a shorter menu |

## Responsive measurements

Chrome reserves about 15px for the desktop scrollbar in these measurements, so a requested 1440px viewport reports 1425px document client width. Overflow is calculated as `documentElement.scrollWidth - documentElement.clientWidth`.

### English direct route

| Requested viewport | Client width | Overflow | H1 font | H1 height | Approx. lines | Result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| 320×844 | 305 | 0 | 34.4px | 204px | 6 | No horizontal overflow; hero still tall |
| 360×844 | 345 | 0 | 39.2px | 233px | 6 | No horizontal overflow; CTA depth increases |
| 390×844 | 375 | 0 | 39.2px | 194px | 5 | Readable but first viewport is copy-heavy |
| 430×844 | 415 | 0 | 39.2px | 194px | 5 | Readable but first viewport is copy-heavy |
| 768×1024 | 753 | 0 | 62.99px | 249px | 4 | Acceptable line count; visual still below copy |
| 1024×720 | 1009 | 0 | 52.8px | 470px | 9 | Fail: H1 dominates laptop viewport |
| 1280×720 | 1265 | 56px | 65.28px | 388px | 6 | Fail: header overflow and poor first viewport |
| 1440×900 | 1425 | 0 | 73.44px | 582px | 8 | Fail: CTA and mechanism displaced |
| 1920×900 | 1905 | 0 | 84px | 748px | 9 | Fail: wider screen makes the title taller |

### French direct route

Direct `/?language=fr-CA` correctly renders French copy, localized links, and `html lang="fr-CA"`. Its measured geometry matched the table above at the sampled widths because the current approved French hero title happens to occupy a similar measured block. The visual screenshot confirms an uncontrolled multi-line French hero despite zero overflow at 1440.

## Interaction matrix

| Interaction | EN start | Expected | Actual baseline | Status |
| --- | --- | --- | --- | --- |
| Desktop menu open | `/` | EN and FR options, EN selected | Correct | Pass |
| Desktop click FR | `/` | French content and selected FR | English remains | P0 fail |
| Desktop direct fr-CA | `/?language=fr-CA` | French content and links | Correct | Pass, not a substitute for click |
| Mobile menu open | `/?language=en` | Compact menu | Opens after transition, but requires nested scroll | P1 fail |
| Mobile click FR | `/?language=en` | French content | English remains | P0 fail |
| Theme choose Light | EN mobile | Light UI and persistent preference | Correct | Pass |
| Reduced-motion emulation | EN desktop | Stable experience without keyframe dependence | Preference recognized; no active keyframe animation sampled | Pass with later full QA |

## Console and network matrix

| Check | Result |
| --- | --- |
| Application console errors | None observed in sampled homepage/menu/theme flows |
| Application console warnings | None observed |
| HTTP responses >=400 | None in sampled cold reload |
| Sampled response statuses | 34 × HTTP 200 |
| Sampled encoded transfer | 311,676 bytes |

## Lighthouse baseline

| Profile | Perf | A11y | Best | SEO | LCP | FCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile EN | 98 | 100 | 100 | 100 | 2.4s | 1.2s | 70ms | 0 |
| Desktop fr-CA | 100 | 100 | 100 | 100 | 0.6s | 0.4s | 10ms | 0 |

These strong static scores do not invalidate LANG-01, RESP-01, or the conversion defects. Lighthouse loaded direct URLs and did not execute the failing locale interaction.

## Screenshot evidence

All evidence is local, ignored from Git, and contains only public production pages:

- `artifacts/rebuild-v3/baseline/live-home-en-desktop-1440x900.png`
- `artifacts/rebuild-v3/baseline/live-home-fr-desktop-1440x900.png`
- `artifacts/rebuild-v3/baseline/live-home-en-mobile-390x844.png`
- `artifacts/rebuild-v3/baseline/live-home-fr-mobile-390x844.png`
- `artifacts/rebuild-v3/baseline/live-home-fr-overflow-1280x720.png`
- `artifacts/rebuild-v3/baseline/live-language-menu-open-en-1440x900.png`
- `artifacts/rebuild-v3/baseline/live-language-click-fr-stays-en-1440x900.png`

## Phase 3 release gates derived from the matrix

1. Real FR and EN click tests pass on desktop and mobile.
2. Locale survives refresh, internal route navigation, hash navigation, and query-bearing navigation.
3. Visible copy, URL/persistence, selected menu state, `html lang`, metadata, canonical, OG locale, and hreflang agree.
4. Numeric overflow is zero at every listed viewport.
5. No global `overflow-x: hidden` is accepted as the only repair.
6. Mobile navigation has no first-viewport nested-scroll dependency.
7. Browser test fails on application console/runtime error.
