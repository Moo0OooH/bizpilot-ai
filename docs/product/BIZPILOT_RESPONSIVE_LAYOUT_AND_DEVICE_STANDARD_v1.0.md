# BizPilot AI - Responsive Layout and Device Standard v1.0

**Status:** Active canonical responsive standard  
**Owner:** MoOoH  
**Last updated:** 2026-06-18  
**Applies to:** Public marketing pages, auth, public quote flow, owner dashboard, founder admin  
**Supersedes:** Responsive, viewport, spacing, overflow, and dark-mode guidance that conflicts with this document in earlier BizPilot design documents  

## 1. Purpose

This standard prevents the recurring BizPilot problems seen in the current public site and anticipated in the dashboard:

- oversized hero content,
- cards that become too tall or too wide,
- inner scrollbars,
- horizontal overflow,
- excessive empty space,
- excessive page length,
- headers that only fit on wide screens,
- layouts that work at one resolution but fail at another,
- fixed-height components that break with English/French copy,
- dashboard tables and rails that become squeezed on tablets and phones.

The goal is not to design for a list of devices. The goal is to create layouts that adapt continuously to available space, text length, zoom, browser chrome, input method, and user preferences.

## 2. Product and visual decision

The current light public-site direction is approved. Do not redesign the public brand again.

Current decisions:

- Public marketing site: light theme only for the founder-pilot stage.
- Owner dashboard: light and dark themes are allowed and should remain token-driven.
- Founder admin: may follow the dashboard theme.
- Public quote form: light-first for clarity and trust.
- No public dark-mode toggle in the header during the founder pilot.

Why:

- The public header is already information-dense with navigation, language, sign-in, and founder-pilot CTA.
- A second public color mode doubles visual QA and contrast QA without improving the primary conversion task.
- Dashboard users may spend longer sessions in the product, so a theme choice has more practical value there.

The public site must still be theme-ready through semantic color tokens. A future dark public theme may be added only after the responsive acceptance matrix passes.

## 3. Normative language

- **MUST**: required before production approval.
- **SHOULD**: expected unless a documented reason exists.
- **MAY**: optional.

## 4. Responsive strategy

### 4.1 Content-first breakpoints

Do not design around named phones or laptop models. Add a layout breakpoint where the content stops fitting comfortably.

Canonical layout bands:

| Band | CSS width | Primary behavior |
| --- | ---: | --- |
| Reflow minimum | 320-359px | One column, no non-exempt horizontal scroll |
| Mobile | 360-639px | One column, stacked CTAs, simplified mockups |
| Tablet | 640-1023px | One or two columns based on content |
| Compact desktop | 1024-1199px | Desktop-like layout with reduced chrome |
| Desktop | 1200-1535px | Full marketing nav and primary two-column layouts |
| Wide | 1536px+ | Content remains capped; whitespace grows outside the container |

Tailwind defaults may remain `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`, but components may use content-driven custom thresholds.

### 4.2 Header-specific threshold

The public header MUST collapse before navigation or actions wrap.

Recommended threshold:

```css
@media (max-width: 1179px) {
  /* use compact/mobile navigation */
}
```

At compact desktop widths:

- hide the long brand tagline or move it to accessible supporting text outside the main row,
- move EN/FR into the menu if needed,
- keep Sign in secondary,
- keep one primary CTA,
- never allow header controls to wrap into a second row.

### 4.3 Component-level responsiveness

Reusable cards, dashboard modules, and quote panels SHOULD use container queries where their layout depends on their own width rather than the viewport.

Example:

```css
.module {
  container-type: inline-size;
}

.module__content {
  display: grid;
  grid-template-columns: 1fr;
}

@container (min-width: 42rem) {
  .module__content {
    grid-template-columns: minmax(0, 1fr) minmax(16rem, 0.8fr);
  }
}
```

## 5. Required viewport and zoom matrix

Every material layout change MUST be checked at these widths. Height matters because the current hero has first-fold problems.

### 5.1 Required visual viewports

| Category | Viewport |
| --- | --- |
| WCAG reflow | 320 x 568 |
| Small mobile | 360 x 800 |
| Common mobile | 390 x 844 |
| Large mobile | 430 x 932 |
| Mobile landscape | 844 x 390 |
| Large mobile landscape | 932 x 430 |
| Tablet portrait | 768 x 1024 |
| Tablet portrait large | 820 x 1180 |
| Tablet/compact desktop | 1024 x 768 |
| Small laptop | 1280 x 720 |
| Common laptop | 1366 x 768 |
| Desktop | 1440 x 900 |
| Large desktop | 1536 x 864 |
| Full HD | 1920 x 1080 |
| QHD sanity check | 2560 x 1440 |

### 5.2 Zoom and text scaling

Required checks:

- 100% browser zoom: visual baseline.
- 200% browser zoom: controls, navigation, forms, and dashboard actions remain usable.
- 400% zoom from a 1280px starting viewport: non-exempt content reflows to approximately 320 CSS pixels without two-dimensional scrolling.
- 200% text-only scaling where supported: no clipped text or overlapping controls.

A layout that only works after zooming out to 75% or 50% fails.

## 6. Containers and readable width

### 6.1 Public pages

```css
:root {
  --public-max: 75rem; /* 1200px */
  --public-gutter: clamp(1rem, 0.55rem + 1.8vw, 2.5rem);
}

.public-container {
  width: min(100% - (2 * var(--public-gutter)), var(--public-max));
  margin-inline: auto;
}
```

Rules:

- Main public content max: 1180-1200px.
- Long-form legal content max: 720-800px.
- Marketing paragraph measure: usually 55-70 characters per line.
- Wide visual panels may reach 1280px only when the visual content needs it.

### 6.2 Dashboard

```text
Dashboard workspace max: 1400-1440px
Desktop shell gutter: 24-32px
Tablet gutter: 20-24px
Mobile gutter: 16-20px
```

Do not force dashboard content into the 1200px marketing container when a data-heavy workspace needs more room.

## 7. Fluid sizing and typography

### 7.1 Public typography

Recommended tokens:

```css
:root {
  --text-hero: clamp(2.5rem, 1.85rem + 2.25vw, 4.5rem);
  --text-section: clamp(1.9rem, 1.55rem + 1.25vw, 3rem);
  --text-page: clamp(2rem, 1.7rem + 0.9vw, 2.75rem);
  --text-lead: clamp(1rem, 0.95rem + 0.2vw, 1.125rem);
  --text-body: 1rem;
}
```

Rules:

- Hero H1 maximum: 72px on very wide screens.
- Hero H1 target at 1280-1440px: about 58-66px.
- Mobile hero H1: 38-44px, depending on language and line length.
- Dashboard page title: 28-36px; never use marketing-hero scale in operational UI.
- Body text minimum: 16px for public pages and forms; dashboard dense text may be 14px when contrast and spacing remain strong.
- Use `rem`, not fixed pixel-only type systems.
- Do not use unrestricted `vw` font sizing.
- `clamp()` maximums must not prevent text from scaling to 200%.

### 7.2 Line length and wrapping

```css
.prose {
  max-inline-size: 68ch;
}

:where(h1, h2, h3, p, a, button, label, td, th) {
  overflow-wrap: anywhere;
}
```

Use `text-wrap: balance` for short headings where supported, but do not depend on it for correctness.

## 8. Spacing system

The previous 96-128px section rhythm is too large for the simplified BizPilot site when applied everywhere.

Canonical spacing:

```css
:root {
  --section-space: clamp(3.5rem, 2.6rem + 2.4vw, 6rem); /* 56-96 */
  --section-space-compact: clamp(2.5rem, 2rem + 1.4vw, 4.5rem); /* 40-72 */
  --card-pad: clamp(1rem, 0.75rem + 0.9vw, 2rem); /* 16-32 */
  --grid-gap: clamp(1rem, 0.75rem + 0.8vw, 1.75rem); /* 16-28 */
}
```

Rules:

- Homepage major sections: 72-96px desktop, 56-72px mobile.
- Sparse secondary pages: 48-72px; do not use landing-page spacing on every small section.
- Hero top spacing after header: 48-72px desktop, 32-48px mobile.
- Avoid blank space created by `min-height`, fixed heights, or equal-height grids.
- Use visual rhythm, not repeated identical card blocks.

## 9. Hero standard

The hero is the current highest-priority layout issue.

### 9.1 First-fold requirement

At `1280 x 720`, without zooming out, the user SHOULD see:

- eyebrow,
- full H1,
- main supporting paragraph,
- both primary and secondary CTA,
- at least the first trust signals,
- enough of the product preview to understand it.

### 9.2 Hero layout

```css
.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(28rem, 0.98fr);
  align-items: center;
  gap: clamp(2rem, 1rem + 3vw, 5rem);
}

@media (max-width: 1099px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
}
```

Rules:

- No `min-height: 100vh` or `min-h-screen` on the marketing hero.
- Do not set a fixed height on either hero column.
- Hero copy max width: approximately 650px.
- Product preview max width: approximately 560-620px.
- All grid/flex children MUST have `min-width: 0`.
- The preview may simplify below 640px; do not shrink desktop UI into unreadable miniature text.
- H1 should normally occupy no more than three lines on desktop and four lines on mobile.

## 10. Header standard

Desktop header:

- Height: 72-84px.
- Logo mark and name at left.
- Tagline may appear only when there is enough room.
- Primary nav centered or left-aligned after brand.
- EN/FR, Sign in, and primary CTA at right.

Compact/mobile header:

- Logo name only.
- Menu button with accessible name.
- Primary CTA may remain visible only if it does not crowd the row.
- Language control belongs inside the menu when the row is crowded.
- Menu uses a single vertical scrolling region only if the viewport height is extremely short.

Accessibility:

- Do not render duplicate visible or screen-reader CTA labels.
- Sticky header must not obscure focused elements.
- Anchor targets use `scroll-margin-top` equal to header height plus spacing.

## 11. Grid and card behavior

Use intrinsic layouts:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: var(--grid-gap);
}
```

Rules:

- Cards are content-driven in height by default.
- Do not use fixed card heights for marketing content.
- Use equal heights only when comparison semantics require them.
- Cards with nested grids use container queries.
- Long English/French copy must wrap without clipping.
- Use `minmax(0, 1fr)`, not bare `1fr`, in grids that contain long text.
- Use `min-width: 0` on flex/grid children.
- Media, charts, and mockups use `max-width: 100%` and explicit aspect ratios or dimensions.

## 12. Scroll and overflow policy

### 12.1 Page-level horizontal scroll

Page-level horizontal scroll is a release blocker on all public, auth, quote, and normal dashboard pages.

Never use `width: 100vw` for full-width page sections when normal `width: 100%` works; `100vw` can include scrollbar width and create overflow.

`overflow-x: clip` MAY be used on the page frame as a final guardrail, but it MUST NOT hide unresolved layout defects.

### 12.2 Inner scrolling

Inner scrolling is prohibited for:

- hero previews,
- marketing demo cards,
- FAQ content,
- feature cards,
- pricing cards,
- normal forms,
- lead detail summaries.

Inner scrolling is allowed only when the content itself requires a two-dimensional or persistent workspace, such as:

- wide data tables,
- code/log viewers,
- long dropdown/listbox menus,
- modal bodies on short-height screens.

When a dashboard table needs horizontal scrolling:

- keep the page itself fixed,
- place the table in one clearly labeled scroll region,
- keep essential row actions visible or provide a mobile card alternative,
- provide a visible affordance that more columns exist,
- ensure each individual cell remains readable.

### 12.3 Overflow diagnostic

Use this in development or Playwright tests:

```js
const overflowing = await page.evaluate(() =>
  [...document.querySelectorAll('*')]
    .filter((el) => el.scrollWidth > el.clientWidth + 1)
    .map((el) => ({
      tag: el.tagName,
      id: el.id,
      className: String(el.className),
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }))
)
```

Review every result. Do not automatically hide it.

## 13. Demo standard

Homepage demo:

- three visible stages maximum,
- no horizontal carousel,
- no auto-rotation,
- no inner scrollbar,
- no tiny dashboard text,
- compact enough to scan in under 60 seconds.

Recommended states:

1. Messy request.
2. BizPilot organizes it.
3. Owner-reviewed draft and manual send.

Desktop: three columns or a labeled step list plus one preview.  
Tablet: two columns only if each card remains readable.  
Mobile: stacked cards in normal document flow.

A dedicated `/demo` route MAY contain the full 5-7 step explanation, but the page still must use normal document scrolling rather than an internally scrolling presentation frame.

## 14. Internationalization and content expansion

English and French are active product languages.

Required:

- allow at least 30% text expansion in navigation, buttons, tabs, badges, and form labels,
- avoid fixed widths on text controls,
- avoid relying on one-line labels,
- use logical properties such as `margin-inline`, `padding-inline`, and `inset-inline`,
- set the correct page `lang`,
- never render EN and FR simultaneously to assistive technology when only one is active.

The language switch must not become the cause of header overflow.

## 15. Mobile viewport and short-height behavior

- Use content-driven height for most sections.
- Avoid `100vh` for full-screen sections on mobile.
- When a minimum viewport fill is truly needed, prefer `min-height: 100svh` and verify browser UI does not obscure content.
- Use `100dvh` only for interfaces that intentionally track dynamic browser chrome; avoid it for long marketing sections because it can resize during scroll.
- Respect safe-area insets for bottom navigation and full-width mobile actions.

Example:

```css
.mobile-bottom-nav {
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}
```

## 16. Public-site theme tokens

Public pages remain light-only now, but MUST use semantic tokens rather than hard-coded component colors.

```css
:root {
  color-scheme: only light;
  --bg-page: #f8fafc;
  --bg-surface: #ffffff;
  --bg-surface-alt: #f1f5f9;
  --text-strong: #0f172a;
  --text-body: #334155;
  --text-muted: #64748b;
  --border-default: #e2e8f0;
  --action-primary: #2563eb;
  --action-primary-hover: #1d4ed8;
  --accent-fresh: #14b8a6;
  --state-success: #10b981;
  --state-warning: #f59e0b;
}
```

Dashboard themes use a `[data-theme]` or equivalent token layer:

```css
[data-theme='light'] { /* semantic dashboard tokens */ }
[data-theme='dark']  { /* semantic dashboard tokens */ }
```

Dashboard theme requirements:

- default may follow stored owner preference, then system preference,
- explicit toggle belongs in dashboard chrome/settings, not public marketing header,
- no flash of the wrong theme during hydration,
- form controls and scrollbars declare compatible `color-scheme`,
- contrast is tested separately in both modes.

## 17. Accessibility baseline

Target: WCAG 2.2 AA for core flows.

Required:

- non-exempt content reflows at 320 CSS px,
- visible focus,
- focused controls are not obscured by sticky headers or overlays,
- keyboard operation for menus, accordions, tabs, dialogs, and copy actions,
- minimum WCAG target size and a BizPilot preferred target of 44x44 CSS px for primary touch controls,
- real labels for form fields,
- errors associated with fields and summarized when useful,
- color is never the only state signal,
- `prefers-reduced-motion` disables non-essential movement,
- no auto-advancing demo or carousel,
- headings follow a logical hierarchy,
- skip link on app-like pages with persistent navigation.

## 18. Performance and visual stability

Core Web Vitals targets at the 75th percentile, segmented by mobile and desktop:

- LCP <= 2.5 seconds.
- INP <= 200 milliseconds.
- CLS <= 0.1.

Implementation requirements:

- define width/height or aspect ratio for images and mockups,
- use `next/font` for self-hosted/optimized fonts when available,
- avoid loading decorative hero images that duplicate CSS UI,
- use `next/image` or equivalent responsive image handling for real raster media,
- do not lazy-load the primary LCP asset,
- lazy-load below-fold media,
- avoid large client-side animation libraries for static marketing effects,
- reserve space for async content and validation messages,
- do not inject banners above existing content after load.

## 19. Route-specific standards

### 19.1 Homepage

- CTA and trust signals visible in the first fold at 1280x720.
- No section uses `min-height: 100vh`.
- Demo is three-step and scroll-free internally.
- Major sections use 56-96px spacing, not 96-128px everywhere.

### 19.2 Features, Cleaning, Trust

- Use concise page heroes.
- Do not leave a large landing-page-height blank region around short content.
- Use one visual proof/workflow section and one CTA, not repeated card grids.

### 19.3 Pricing

- Comparison cards may be equal height on desktop.
- At widths below comfortable three-column comparison, stack cards.
- Price and billing disclaimers must wrap normally.
- Do not use horizontal swipe cards for plan comparison.

### 19.4 Pilot form

- Max form width: 720px.
- One column on mobile.
- Two columns only for short paired fields at >=768px.
- Preview-only fields must not look enabled when they do not submit.

### 19.5 Legal and security pages

- Reading column max: 760px.
- Owner-friendly summary first.
- Technical readiness details may use disclosure sections.
- No oversized marketing hero on policy pages.

### 19.6 Auth

- Card width: min(100%, 460px).
- On short viewports, align to the top with safe padding rather than forced vertical centering.
- Use `min-height: 100svh` only on the outer shell.

### 19.7 Quote form

- Customer-first single-column reading flow.
- Avoid dashboard density.
- Sticky mobile submit MAY be used only if it does not obscure fields, errors, or focused controls.

### 19.8 Dashboard

- Sidebar desktop; compact navigation below its content threshold.
- Data tables become cards or a dedicated scroll region on narrow widths.
- Right rail drops below the main content before either column becomes cramped.
- No dashboard module depends only on viewport media queries; use container queries for reusable cards.

## 20. Automated QA requirements

Recommended tools:

- Playwright for route and viewport screenshots,
- Axe or equivalent for automated accessibility checks,
- Lighthouse for lab performance and accessibility checks,
- production Core Web Vitals/RUM when real traffic exists,
- screenshot diffing for visual regressions.

Every implementation report MUST include:

- routes tested,
- viewport matrix tested,
- overflow detector results,
- keyboard/focus results,
- EN and FR results,
- light and dark dashboard results where applicable,
- lint/typecheck/build/test results,
- known limitations.

## 21. Definition of done

A responsive change is complete only when:

- no page-level horizontal overflow exists at all required widths,
- no marketing card or demo uses an inner scrollbar,
- hero CTA is visible at 1280x720,
- header never wraps,
- English and French both fit,
- content remains usable at 200% zoom,
- non-exempt content reflows at 320 CSS px,
- focus is visible and not obscured,
- public pages pass in light mode,
- dashboard passes in both supported themes,
- no fixed-height component clips content,
- Core Web Vitals lab targets are not materially regressed,
- lint, typecheck, build, and relevant tests pass.

## 22. Primary references

- W3C, Web Content Accessibility Guidelines (WCAG) 2.2.
- W3C, Understanding Success Criterion 1.4.10 Reflow.
- W3C, WCAG 2.2 Focus Not Obscured and Target Size criteria.
- web.dev, Responsive Web Design Basics and Learn Responsive Design.
- web.dev, Core Web Vitals.
- MDN, CSS container queries.
- MDN, CSS `clamp()`.
- MDN, viewport-relative units (`svh`, `lvh`, `dvh`).
- MDN, `prefers-color-scheme`, `color-scheme`, and `prefers-reduced-motion`.
- Next.js, Font Optimization with `next/font`.
