# BizPilot AI - Public Site Visual, Responsive, and Theme Audit

**Status:** Final audit for responsive-hardening implementation  
**Audit date:** 2026-06-18  
**Audited production URL:** `https://bizpilo.com/`  
**Applies to:** Homepage, Features, Cleaning, Trust, Demo, Pricing, Pilot, Privacy, Security, Terms, Sign-in  
**Companion standard:** `docs/product/BIZPILOT_RESPONSIVE_LAYOUT_AND_DEVICE_STANDARD_v1.0.md`

> 2026-06-20 superseded status: this audit remains historical evidence for the responsive-hardening baseline. Final public-site decisions, theme behavior, and GO/NO-GO status now live in `docs/product/BIZPILOT_FINAL_PUBLIC_SITE_STANDARD_v1.0.md` and `docs/readiness/FINAL_PRE_DASHBOARD_SITE_READINESS_2026-06-20.md`.

## 1. Executive decision

The new light redesign is materially better than the former dark command-center direction. It is simpler, more trustworthy, more cleaning-specific, and more consistent with the manual-first founder pilot.

Do **not** redesign the site again. Run a responsive-hardening and content-density pass.

The principal remaining defects are:

1. Hero scale and first-fold composition are not stable across laptop-height and intermediate-width viewports.
2. The header contains too many always-visible items and duplicates the founder-pilot CTA in the accessibility/DOM output.
3. Marketing components appear designed around a wide desktop screenshot rather than continuous available space.
4. Cards and demo panels need a strict no-inner-scroll rule.
5. Sparse secondary pages need better visual proof and tighter page templates, not more empty vertical space.
6. Legal/trust content is accurate but exposes internal phase vocabulary too early.
7. Theme behavior is not yet governed by one canonical policy.
8. Existing design documents contain contradictory, outdated dark-homepage and breakpoint guidance.

## 2. Audit evidence and limitations

The audit used:

- the production site's rendered text and routes on 2026-06-18,
- the supplied 1895 x 887 desktop hero screenshot,
- the uploaded project documentation package,
- current W3C, MDN, web.dev, and Next.js primary documentation.

The uploaded ZIP contains project documentation and configuration files but not the complete application/component source. Therefore this audit can specify changes and acceptance criteria, but it cannot name every live component file or verify computed CSS at every breakpoint. Codex must perform a repo-level file map before editing.

## 3. Global findings

### 3.1 What is now correct

- The homepage promise is understandable: cleaning quote requests, organized leads, owner-reviewed drafts.
- Manual-first and no-auto-send are visible above the fold.
- The product preview is relevant to the cleaning use case.
- The demo now follows one realistic quote request.
- Dedicated Features, Cleaning, Trust, Demo, Pricing, and Pilot routes exist.
- Approved staged pilot prices are visible with payment/product guardrails.
- Trust, Privacy, Security, and Terms are unusually transparent for an early product.

### 3.2 Highest-risk responsive defects

#### Hero typography

In the supplied wide screenshot, the H1 occupies four large lines and dominates the first fold. The support paragraph is visible, but the CTA row is pushed close to or below the screenshot boundary. On a 1280 x 720 or 1366 x 768 laptop, the risk is greater.

Required correction:

- cap hero type at 72px,
- target approximately 58-66px at 1280-1440 widths,
- use a copy column of about 600-650px,
- allow the hero to stack before either column is squeezed,
- remove any full-viewport hero minimum height,
- ensure CTAs and initial trust signals are visible at 1280 x 720.

#### Header density

The desktop header currently includes:

- logo mark,
- product name,
- long tagline,
- six navigation links,
- EN/FR control,
- Sign in,
- large founder-pilot CTA.

This is too much to guarantee a clean single row at 1024-1366 widths, 125-200% zoom, French copy, or larger default fonts.

Required correction:

- full desktop header only at approximately 1180px and above,
- hide the long tagline before the navigation begins to crowd,
- move language selection into the compact menu,
- retain one founder-pilot CTA,
- do not allow wrapping,
- fix duplicate accessible/visible CTA output (`Join founder pilot Join founder pilot`).

#### Fixed-height and inner-scroll risk

Marketing cards must expand naturally. Internal scrollbars are prohibited in hero cards, demo cards, feature cards, trust cards, pricing cards, FAQ, and legal content. Only true two-dimensional operational content, such as dashboard data tables, may use a contained horizontal scroll region.

Common implementation causes to remove:

- fixed `height` or `max-height` on content cards,
- `overflow-y-auto` on marketing components,
- `min-h-screen` on page heroes,
- `100vw` inside padded parents,
- grid tracks without `minmax(0, 1fr)`,
- flex/grid children without `min-width: 0`,
- absolute positioning used for primary content.

#### Excess vertical whitespace

The supplied screenshot shows a large gap between the header and hero content. Secondary pages are also structurally sparse, so landing-page-scale spacing makes them feel unfinished and makes the site longer than its content requires.

Required correction:

- hero top spacing: 48-72px desktop, 32-48px mobile,
- major homepage sections: 72-96px desktop, 56-72px mobile,
- sparse secondary-page sections: 48-72px,
- use natural content height rather than equal-height empty panels.

## 4. Page-by-page audit

### 4.1 Homepage `/`

**Verdict:** Direction approved; responsive-hardening required.

Keep:

- cleaning-first eyebrow,
- current H1 and product promise,
- owner-control messaging,
- cleaning-specific product preview,
- compact three-step demo,
- AI-can / AI-will-not trust framing,
- founder-pilot CTA.

Change:

- reduce hero H1 scale and control its measure,
- bring CTAs and trust badges into the first laptop fold,
- constrain preview width and let its content height be natural,
- stack hero below about 1100px rather than squeezing two columns,
- reduce top whitespace,
- remove duplicate CTA label from DOM/accessibility output,
- shorten the page visually through tighter section spacing and more varied layouts,
- make `Watch demo` a real link to `/demo`, not a non-link or ambiguous control.

Acceptance:

- no page-level horizontal overflow at 320px,
- no inner scrollbars,
- H1 no more than roughly three lines on normal desktop widths,
- CTA row visible at 1280 x 720,
- preview text readable without browser zoom.

### 4.2 Features `/features`

**Verdict:** Correct content, visually too sparse.

Change:

- use one clear page hero and a 2x3 intrinsic feature grid,
- add one compact workflow/product visual,
- include one trust strip and one final CTA,
- avoid placing each short feature in an oversized full-width section,
- keep total page length concise.

### 4.3 Cleaning `/industries/cleaning`

**Verdict:** Correct SEO intent, insufficient proof and specificity.

Change:

- add one cleaning quote example,
- group service types into a responsive chip/grid pattern,
- show a simple cleaning-specific workflow,
- include the information BizPilot organizes: service, property, timing, missing details, status,
- keep one founder-pilot CTA near the top and one at the end.

Do not add unsupported testimonials or results.

### 4.4 Trust `/trust`

**Verdict:** Strong product truth; needs hierarchy polish.

Change:

- keep the owner-friendly summary first,
- present six trust points in a compact grid,
- move technical readiness language into a lower `Technical readiness notes` disclosure or clearly secondary block,
- do not lead with internal identifiers such as Phase 24F/24G,
- link to Privacy and Security for detail.

### 4.5 Demo `/demo`

**Verdict:** Content is correct; presentation must avoid a long repetitive scroll.

Recommended model:

- desktop: sticky or static step index beside a single active detail panel, only if the page itself remains the sole scroll container,
- alternative: four grouped chapters rather than eight equally large cards,
- mobile: natural stacked flow with concise panels,
- no horizontal carousel required,
- no auto-advance,
- no inner vertical scroll,
- direct labeled step controls if interaction is used,
- full content remains accessible with JavaScript disabled or interaction unavailable.

Group the current eight steps into:

1. Request arrives.
2. BizPilot organizes and highlights missing details.
3. AI prepares an owner-reviewed draft.
4. Owner copies and sends manually, with guardrails.

This preserves the story while cutting repetition and page length.

### 4.6 Pricing `/pricing`

**Verdict:** Commercial structure is now aligned, but duplicate price output must be fixed.

Observed content includes:

- Founder Feedback Pilot: $0 setup,
- Starter Pilot: $149 setup + $49/month,
- Pro Pilot: $199 setup + $79/month,
- manual/payment-readiness guardrails.

Change:

- remove duplicated `$49/month` and `$79/month` text in DOM/UI,
- align the three pricing cards at desktop without fixed equal heights that create blank space,
- stack cleanly on tablet/mobile,
- use one primary CTA per card,
- keep guardrail block immediately below the cards,
- avoid highlighting Pro as “best” before evidence supports it.

### 4.7 Pilot `/pilot`

**Verdict:** Safe but can feel like a dead-end because the form is preview-only.

Change:

- make preview state unmistakable before the fields,
- visually disable controls that cannot submit,
- provide one real safe action only after a verified public founder email or approved endpoint exists,
- retain the request template so users can copy it,
- make `What happens next` visually compact,
- avoid a very long blank form on mobile if no submission is possible.

### 4.8 Privacy `/privacy`

**Verdict:** Accurate but too operational for a public first read.

Change:

- add a plain-language summary at the top,
- group data collected, data not collected, purpose, consent, retention/deletion, and contact path,
- move phase identifiers into a technical note,
- preserve accurate Canadian/Quebec references,
- use a 720-800px reading column.

### 4.9 Security `/security`

**Verdict:** Strong transparency, but public copy is mixed with internal architecture notes.

Change:

- lead with owner-facing safeguards,
- separate product security summary from technical readiness evidence,
- avoid exposing implementation details that are not useful to a customer,
- do not imply a formal certification or completed security audit,
- use a narrow reading column and compact summary cards.

### 4.10 Terms `/terms`

**Verdict:** Scope and manual billing limitations are clear; pricing statement is stale.

Change:

- align the pilot-pricing paragraph with the now-published staged terms,
- maintain cancellation/refund clarity,
- keep product exclusions explicit,
- use legal-page typography and narrow measure,
- add an effective/updated date and verified contact path when available.

### 4.11 Sign-in `/auth/sign-in`

**Verdict:** Keep simple; harden short-height behavior.

Change:

- use `min-height: 100svh`, not `100vh`,
- ensure the form remains reachable on mobile landscape and with virtual keyboard,
- avoid fixed vertical centering that clips content at short heights,
- preserve labels, password-manager compatibility, error messages, and visible focus,
- keep public pilot CTA outside the authentication form hierarchy.

## 5. Dark-mode decision

### 5.1 Public marketing site

Do not add a dark-mode toggle during the founder-pilot stage.

Reasons:

- the public header is already crowded,
- the light visual direction supports cleanliness, clarity, and trust,
- a public dark mode doubles contrast, asset, screenshot, and regression testing,
- the highest-value work is responsive correctness, conversion clarity, and readiness.

Required now:

- keep colors as semantic tokens,
- declare `color-scheme: light` for the public surface,
- do not hard-code colors inside reusable product components.

### 5.2 Dashboard and founder admin

A user-selectable light/dark theme is appropriate for the dashboard/admin after core responsive layout is stable.

Required implementation behavior:

- semantic tokens only,
- system preference as first-run default,
- explicit user override,
- persist preference,
- apply theme before paint to avoid flash,
- use `color-scheme` so browser controls and scrollbars match,
- test contrast and charts in both themes,
- never communicate status by color alone.

## 6. Canonical implementation rules

### 6.1 No-overflow baseline

```css
html,
body {
  max-width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

img,
svg,
video,
canvas {
  display: block;
  max-width: 100%;
  height: auto;
}

:where(.grid-child, .flex-child, main, section, article, aside) {
  min-width: 0;
}

:where(h1, h2, h3, p, a, button, label, td, th) {
  overflow-wrap: anywhere;
}
```

Do not hide systemic overflow with global `overflow-x: hidden`. Fix the element causing it. A temporary diagnostic rule may be used locally during development only.

### 6.2 Intrinsic grids

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: clamp(1rem, 0.75rem + 0.8vw, 1.75rem);
}
```

### 6.3 Fluid hero type

```css
.hero-title {
  font-size: clamp(2.5rem, 1.85rem + 2.25vw, 4.5rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
  max-inline-size: 12ch;
  text-wrap: balance;
}
```

The design must remain correct without `text-wrap: balance` support.

### 6.4 Short-height and mobile viewport units

- use `svh` for layouts that must always fit within visible browser chrome,
- use `dvh` only where continuous chrome changes are desired,
- do not use full-height heroes on marketing pages,
- make dialogs use `max-block-size` and one intentional internal scroll region.

### 6.5 Scroll policy

Allowed:

- page vertical scroll,
- an explicit horizontally scrollable dashboard table with visible affordance,
- an explicit log/history panel,
- a dialog body with constrained height.

Prohibited:

- inner vertical scroll in marketing cards,
- hero preview scrollbars,
- demo-card scrollbars,
- scrollbars created only because a fixed height is too small,
- nested scroll on mobile for ordinary content.

## 7. Accessibility acceptance

Production target: WCAG 2.2 AA.

Required checks:

- reflow at 320 CSS px / 400% desktop zoom,
- 200% zoom and text enlargement,
- visible focus,
- sticky header does not obscure focused controls,
- keyboard operation for menu, language control, accordions, tabs, and demo controls,
- custom pointer targets should be at least 44 x 44 CSS px even though the WCAG 2.2 AA minimum criterion is smaller,
- correct labels and error associations,
- no meaning conveyed by color alone,
- reduced-motion behavior,
- EN and FR copy expansion without clipping.

## 8. Performance acceptance

Targets at the 75th percentile:

- LCP <= 2.5 seconds,
- INP <= 200 milliseconds,
- CLS <= 0.1.

Implementation priorities:

- use `next/font` for self-hosted optimized font loading,
- reserve dimensions/aspect ratios for visual assets,
- use responsive `next/image` sizing where raster assets exist,
- avoid client-side JavaScript for static marketing layout,
- no large animation libraries for the demo,
- pre-render public routes where compatible with product behavior,
- do not lazy-load the primary LCP element if it is above the fold.

## 9. Required test matrix

At minimum, visually test:

- 320 x 568,
- 360 x 800,
- 390 x 844,
- 430 x 932,
- 844 x 390 landscape,
- 768 x 1024,
- 820 x 1180,
- 1024 x 768,
- 1280 x 720,
- 1366 x 768,
- 1440 x 900,
- 1536 x 864,
- 1920 x 1080,
- 2560 x 1440.

Also test:

- 200% and 400% browser zoom,
- 200% text scaling where supported,
- EN and FR,
- keyboard only,
- reduced motion,
- mobile virtual keyboard on pilot/auth/quote forms,
- long names, long service labels, validation messages, and AI fallback text.

## 10. Implementation priority

### P0 - must fix before dashboard redesign

1. Header collapse and duplicate CTA label.
2. Hero scale, first fold, stack threshold, and excess top whitespace.
3. Global no-overflow/intrinsic-grid baseline.
4. Remove marketing inner scroll/fixed heights.
5. Pricing duplicate amount output.
6. Demo grouped presentation and mobile natural flow.
7. Full viewport/zoom regression matrix.

### P1 - before public pilot outreach

1. Secondary-page visual proof and compact templates.
2. Owner-friendly legal/trust hierarchy.
3. Pilot preview-state clarity and verified contact path.
4. Core Web Vitals measurement and fixes.
5. EN/FR expansion testing.

### P2 - after responsive baseline is stable

1. Dashboard semantic light/dark theme.
2. Component-level container queries across dashboard modules.
3. Visual regression screenshots in CI.
4. Automated accessibility checks plus manual keyboard/zoom QA.

## 11. Canonical document update rule

The following earlier guidance is superseded wherever it conflicts with this audit and its companion standard:

- a dark public homepage as the canonical direction,
- `Start free recovery` as the primary marketing CTA,
- testing only 1280 x 720 and 390 x 844,
- fixed desktop-first card dimensions,
- 96-128px vertical spacing for every section,
- desktop navigation that remains fully expanded until 1024px,
- any instruction that treats the former homepage as visually frozen.

## 12. Primary references

- W3C, WCAG 2.2 Understanding 1.4.10 Reflow: https://www.w3.org/WAI/WCAG22/Understanding/reflow
- W3C, WCAG 2.2 Quick Reference: https://www.w3.org/WAI/WCAG22/quickref/
- W3C, Technique C38 for responsive labels and inputs: https://www.w3.org/WAI/WCAG22/Techniques/css/C38.html
- W3C, Technique G225 for horizontally scrolling panels: https://www.w3.org/WAI/WCAG22/Techniques/general/G225
- MDN, CSS container queries: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries
- MDN, `color-scheme`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme
- MDN, `prefers-color-scheme`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme
- web.dev, Core Web Vitals thresholds: https://web.dev/articles/defining-core-web-vitals-thresholds
- Next.js, Font optimization: https://nextjs.org/docs/app/getting-started/fonts
