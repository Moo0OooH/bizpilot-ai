# V3 Visual System Specification

Date: 2026-07-13

Status: approved build contract for Phases 4–7

## Direction

The visual system should feel like a calm operational tool: clear enough for a busy owner, polished enough to build trust, and restrained enough that the product story—not decoration—holds attention.

The signature visual idea is “from scattered to ready”: small, loose message fragments resolve into one structured request card. This can appear through layout, connector lines, grouping, and restrained state color. It should not become an animated spectacle.

## Design principles

1. Read before decorate.
2. One dominant action per decision point.
3. Large product evidence, not miniature dashboards.
4. Calm density: compact cards, generous section separation, short copy.
5. Honest states: Provided, Still needed, Ready for review.
6. Same information architecture in EN and fr-CA; layouts flex for text length.
7. Motion explains state change only and disappears under reduced motion.

## Typography

Use the existing locally optimized Geist variable family through the installed Next font API. Do not add a render-blocking remote font dependency.

| Token | Desktop target | Mobile target | Usage |
| --- | --- | --- | --- |
| Display | `clamp(2.5rem, 4.2vw, 4.75rem)` / 0.98–1.02 | floor 2.35rem | Homepage H1; max 3–4 desktop lines |
| H1 page | `clamp(2.25rem, 3.5vw, 4rem)` / 1.02 | floor 2.15rem | Secondary route heroes |
| H2 | `clamp(1.85rem, 2.5vw, 3rem)` / 1.08 | floor 1.75rem | Major sections |
| H3 | 1.125–1.375rem / 1.25 | same range | Card titles |
| Lead | 1.0625–1.2rem / 1.6 | 1rem / 1.55 | Hero and page intros |
| Body | 1rem / 1.6 | 1rem / 1.55 | Default copy |
| Small | 0.875rem / 1.45 | 0.875rem | Metadata and support copy |
| Eyebrow | 0.75rem / 1.2, 0.08em tracking | same | Short category labels only |

Rules:

- Body copy measure: 60–70 characters.
- Hero copy maximum measure: approximately 18–22 display characters per line in English, with flexible French measure.
- Do not grow the font beyond the max at ultrawide widths.
- Avoid all-caps paragraph text and low-contrast microcopy.
- Use tabular numerals for prices and request metadata where supported.

## Layout and spacing

| Token | Value/behavior |
| --- | --- |
| Page gutter | `clamp(1rem, 3vw, 2rem)` |
| Content max | 1200px |
| Reading max | 720px |
| Hero gap | `clamp(2rem, 5vw, 5rem)` |
| Section block | `clamp(4.5rem, 8vw, 8rem)` |
| Card padding | 1rem compact; 1.5rem standard; 2rem feature |
| Grid gap | 1rem compact; 1.5rem standard; 2rem spacious |
| Radius small | 10px |
| Radius medium | 16px |
| Radius large | 24px |

Use an 8px base rhythm with 4px adjustments for compact controls. Section spacing creates calm; card padding stays compact. Avoid a page made of oversized rounded containers nested inside one another.

## Color roles

Implementation should map these roles onto existing token names where possible instead of creating page-local hex values.

### Light theme

- Canvas: warm/cool near-white, not pure white everywhere.
- Surface: white for primary product cards.
- Surface muted: pale blue-slate for grouped content.
- Ink: deep navy-charcoal with WCAG-compliant contrast.
- Muted ink: slate, still at least 4.5:1 for body-size text.
- Brand: confident blue.
- Accent: restrained teal for “ready/organized,” not a second CTA color.
- Missing: warm amber used with text/icon, never color alone.
- Border: cool translucent slate with sufficient visible separation.

### Dark theme

- Canvas: deep navy, not full black.
- Surface: one step lighter than canvas.
- Ink: soft white.
- Muted ink: cool light slate with compliant contrast.
- Brand/accent colors are reduced in saturation and checked against both surface levels.
- Shadows become subtle borders/ambient highlights rather than black glows.

### State mapping

| State | Color role | Required text/icon |
| --- | --- | --- |
| Provided | Neutral/brand tint | `Provided` / `Fourni` |
| Still needed | Amber tint | `Still needed` / `À confirmer` |
| Ready for review | Teal tint | `Ready for review` / `Prêt à valider` |
| Human control | Brand tint | person/check icon plus explicit review language |

## Core components

### Header

- Sticky only if it remains under 72px and does not obscure anchored content.
- Translucent surface is optional; text and borders must remain legible without backdrop-filter support.
- Desktop items fit at the actual 1280px client width. If they do not, use the compact menu earlier.
- Language and theme controls expose their full accessible names.

### Buttons

- Minimum 44px target; 46–48px preferred for primary marketing CTAs.
- Primary: brand fill, high-contrast label, restrained hover lift or tonal shift.
- Secondary: transparent/subtle surface with visible border.
- Tertiary: underlined or icon-supported text link.
- Disabled is visually distinct and semantically disabled; never use low opacity alone.
- Loading states preserve width and do not cause layout shift.

### Cards

- One border, one surface, one radius, and minimal shadow.
- Avoid decorative cards for single sentences that could remain plain text.
- Card titles are action/result-led, not internal feature names.
- Hover only when the whole card is an interactive target.

### Product scene

- Code-native HTML/CSS for clarity, accessibility, localization, and performance.
- Three labelled stages; large text; no chart junk.
- Connector lines remain decorative and `aria-hidden`.
- The organized request and draft should be readable at 390px without zoom.

### Menus and dialogs

- Menu trigger includes expanded state and controls relationship.
- Keyboard: Enter/Space opens, arrows where menu semantics apply, Escape closes, focus restores.
- Mobile navigation uses a page-level sheet/panel sized to the viewport, not an internally scrolling card in the first viewport.
- Background does not horizontally shift when scroll is locked.

### FAQ

- Native disclosure/accessible accordion behavior with persistent question headings.
- Only one-open-at-a-time is optional; content remains indexable and usable without animation.
- Chevron rotation is disabled under reduced motion.

## Breakpoints

Use content-driven layout changes. Named widths are validation points, not permission to expose overflowing UI.

- Compact: under 640px.
- Medium: 640–1023px.
- Wide: 1024–1279px, with header still compact if required.
- Full: 1280px and above only after measured fit.
- Content maximum: 1200px; ultrawide screens add outer space rather than larger type/cards.

Required QA widths: 320, 360, 390, 430, 768, 1024, 1280, 1440, and 1920.

## Motion

- Default duration: 140–220ms; maximum 300ms for a panel.
- Easing: standard ease-out for entrances, ease-in-out for state changes.
- Animate opacity and transform; avoid layout properties.
- No continuous hero motion, autoplay carousel, parallax, cursor follower, or attention loop.
- `prefers-reduced-motion: reduce` removes smooth scrolling and nonessential transitions/animations.
- Content never depends on an animation completing.

## Accessibility

- WCAG 2.2 AA target for public marketing interactions.
- Text contrast 4.5:1; large text 3:1; non-text UI indicators 3:1.
- Visible focus ring in both themes, with at least 2px thickness and offset from the component boundary.
- Logical heading hierarchy, landmarks, skip link, and descriptive page titles.
- 44×44px minimum pointer targets where controls are not inline text.
- Labels do not rely on placeholders.
- Language menu selected state is announced.
- Product visual content has a concise accessible text equivalent; decorative connectors/icons are hidden.
- Zoom to 200% and text spacing do not cause loss of content or two-dimensional scrolling.

## Performance budgets

The current production page already has strong lab scores, so V3 must not buy visual polish with avoidable weight.

| Budget | Target |
| --- | --- |
| Lighthouse Performance | ≥95 mobile on representative production build |
| Accessibility / Best Practices / SEO | 100 target; no known critical violation |
| LCP | ≤2.5s lab mobile |
| CLS | ≤0.05 lab |
| TBT | ≤150ms lab |
| Initial encoded transfer | Prefer ≤350KiB for homepage; explain any increase |
| Hero image | None required; if introduced, responsive and ≤120KiB encoded |
| Client JavaScript | Only interactive controls; marketing copy stays server-rendered |

## SEO and metadata presentation

- One descriptive H1 and unique route title/description.
- Canonical and alternate language intent agree with the rendered language.
- Product and FAQ structured data include only visible, truthful content.
- No review stars, customer counts, founding dates, or performance numbers without evidence.
- Anchored sections have scroll margin for the sticky header.

## Visual QA acceptance

- H1 remains approximately 3–4 desktop lines at 1024, 1280, 1440, and 1920.
- No document horizontal overflow at required widths.
- No first-viewport nested scroll on mobile.
- EN and fr-CA layouts remain stable with natural text wrapping.
- Light/dark themes and reduced motion preserve meaning and controls.
- Product scene is readable, not merely decorative.
- CTA hierarchy is obvious without relying on color alone.
- Screenshots are captured at desktop and mobile in both languages before release.
