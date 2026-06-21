# BizPilot Multilingual Responsive UI Standard v1.0

Date: 2026-06-21
Status: Active for public-site work and Phase D1 dashboard visual stabilization.

## Purpose

BizPilot supports English and French Canadian public and owner-facing surfaces.
Those languages do not have equal string length, so the UI must be designed and
tested as a multilingual product rather than an English layout with translated
text inserted later.

For BizPilot, "English and French must be the same size" means:

- the same component type occupies the same visual role in both languages,
- repeated card decks align their headers, content rhythm, and actions,
- primary CTAs sit on the same row or anchored footer position,
- first-fold public pages keep the same conversion path visible,
- dashboard work surfaces keep the same scanning and next-action priority,
- no locale relies on hidden overflow, truncation, or smaller text to survive.

This standard is a required reference before public-page polish and dashboard
D1 visual work.

## External References Consulted

These references were reviewed on 2026-06-21:

- W3C Internationalization, "Text size in translation":
  `https://www.w3.org/International/articles/article-text-size.en.html`
- Material Design, "Principles and Techniques for Effective Localization":
  `https://m3.material.io/blog/localization-principles-techniques`
- MDN, "Aligning items in CSS grid layout":
  `https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Box_alignment`
- MDN, "`grid-template-columns`":
  `https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-columns`
- web.dev, "Internationalization":
  `https://web.dev/learn/design/internationalization`
- Crowdin, "Advanced UI Localization Guide for Your App or Website":
  `https://crowdin.com/blog/best-practices-for-ui-localization`
- Localize, "UI Localization: How to Adapt Your Web UI for Global Audiences":
  `https://localizejs.com/articles/ui-localization-how-to-adapt-your-web-ui-for-global-audiences`
- Ben Myers, "Lost in Translation: Tips for Multilingual Web Accessibility":
  `https://benmyers.dev/blog/multilingual-web-accessibility/`

The shared guidance is consistent: translated text can expand substantially,
small UI strings expand the most, fixed-width English-first components break,
and localization QA must include layout checks in the target languages.

## Product Truth Boundary

Multilingual layout fixes must not change BizPilot's product promise.

BizPilot remains:

```text
Manual-first, cleaning-first, owner-controlled lead recovery.
AI drafts. The owner reviews, edits, copies, and sends manually.
```

Do not use copy shortening to introduce broader claims. The forbidden list
still includes auto-send, SMS/WhatsApp automation, booking confirmation,
invoicing, full CRM positioning, guaranteed revenue, and active multi-industry
claims.

## Core Design Rules

### 1. Copy Budget Before Font Reduction

When French breaks the visual rhythm, first shorten the copy while preserving
meaning. Do not solve a multilingual problem by shrinking only the French font
or hiding text.

High-visibility budgets for the current EN/fr-CA public site:

| Surface | Budget |
| --- | --- |
| Public homepage H1 | Same tested line count as English, with a hard cap of 58 characters |
| Primary hero CTA | 22 characters or fewer where possible |
| Secondary hero CTA | 18 characters or fewer where possible |
| Pricing cohort label | 36 characters or fewer |
| Pricing plan title | 28 characters or fewer |
| Pricing highlight pill | 38 characters or fewer |
| Pricing CTA | 28 characters or fewer |

If a future feature genuinely needs longer copy, the component must be promoted
to a layout that is designed for long prose rather than forcing a compact
control to absorb it.

### 2. Equal Card Decks Need Anchored Actions

Every repeated card deck with CTAs must use this structure:

```text
card
  header area
  content/list area
  action/footer area pinned with auto margin
```

The action should not simply follow content with a fixed top margin. That makes
shorter cards look unfinished and longer translated cards push CTAs out of
alignment.

Required behavior:

- grid items stretch to the row height,
- card root is `display: flex` with `flex-direction: column`,
- content/list area can grow,
- CTA/action row uses `margin-top: auto`,
- button minimum block size is stable,
- no fixed card height is used as the main solution.

### 3. Responsive Grids Must Use Intrinsic Tracks

Use `minmax(0, 1fr)` for locked multi-column public grids and keep `min-width: 0`
on grid children. Use canonical grid classes rather than one-off route
breakpoints.

Avoid:

- `100vw` page widths,
- `w-screen`,
- `overflow-x-hidden` as a layout bandage,
- fixed card heights that clip translated text,
- route-specific fragile breakpoints for repeated deck patterns.

### 4. Wrapping Is Allowed, Drift Is Not

Text may wrap. Broken parity starts when wrapping changes the user's task path:

- primary CTA moves below the first fold in one language only,
- pricing buttons do not line up in a row,
- dashboard next-action controls move unpredictably,
- pills or badges become taller than their siblings without intent,
- one locale shows a visibly heavier or messier card.

For EN/fr-CA pairs, target component frame parity within roughly one spacing
step. If the difference is larger, shorten copy or promote the layout.

### 5. Dashboard D1 Uses The Same Standard

Dashboard visual stabilization must apply the same rules:

- topbar utilities collapse before crowding the lead workspace,
- lead queue cards keep stable metadata and next-action rows,
- lead detail action panels keep manual owner action primary in both languages,
- AI draft cards present drafting support without visual dominance,
- empty/sample states use equal-height panels and anchored actions,
- settings/configuration panels avoid label/value squeeze in French,
- no dashboard component hides overflow to fake stability.

D1 remains visual/layout/copy scoped. This standard does not approve database,
auth, RLS, AI provider, payment, billing, or production data-flow changes.

## Required QA Matrix

Before claiming multilingual visual stability for a public or dashboard surface,
run or record equivalent evidence for:

- English and fr-CA,
- Light and Dark where the surface supports themes,
- desktop `1280x720`,
- desktop `1440x900`,
- tablet `768x1024`,
- mobile `390x844`,
- first fold and the main repeated card deck,
- no root horizontal overflow,
- no nested scroll inside marketing sections or dashboard cards,
- no hidden/truncated CTA text,
- aligned pricing/action rows where repeated CTAs exist.

`pnpm smoke:dashboard` remains prohibited against production-like Supabase
credentials because it creates synthetic workspace data. Dashboard visual QA
must use local/safe synthetic context until the appropriate gate approves more.

## Engineering Enforcement

Use a mix of source, copy, smoke, and browser checks:

- copy budget unit tests for high-risk strings,
- source tests that require shared layout classes,
- smoke tests for EN/fr-CA route output,
- browser DOM measurements for hero, card, and CTA parity,
- screenshots only after DOM metrics are clean.

When a browser measurement fails, prefer this order:

1. Shorten or clarify the translated string.
2. Move the component to the canonical card/action structure.
3. Promote the layout to a wider or stacked responsive pattern.
4. Adjust spacing tokens.
5. Only then consider typography changes, and never per-locale font shrinking.

## Current Public-Site Implementation Hooks

The public site uses these active hooks:

- `public-pricing-grid`
- `public-plan-card`
- `public-plan-card-header`
- `public-plan-card-price`
- `public-plan-card-highlight`
- `public-plan-card-features`
- `public-plan-card-cta`
- `supporting-three-grid`
- `supporting-four-grid`
- `supporting-six-grid`
- `homepage-hero-section`
- `homepage-hero-title`
- `homepage-demo-grid`

Future dashboard D1 work should add similarly named dashboard hooks when a
repeated owner-workflow surface needs measurable parity.
