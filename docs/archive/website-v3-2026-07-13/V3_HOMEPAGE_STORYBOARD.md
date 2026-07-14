# V3 Homepage Storyboard

Date: 2026-07-13

Status: approved build contract for Phase 5

## Narrative in one frame

The page visually moves from disorder to control:

`Vague questions in familiar channels → one Smart Intake Link → organized request + visible gap + reply ready for human review`

The left-to-right sequence is descriptive, not an integration diagram. The channel labels show where the business can share the link; they never imply BizPilot reads those inboxes.

## Section 1 — Hero

### Job

Identify the audience, pain, product mechanism, result, and manual approval boundary within five seconds.

### Desktop composition

- Two-column layout inside a 1200px content frame.
- Copy uses roughly 46% of the width; visual uses 54%.
- Eyebrow, three-to-four-line H1 target, one paragraph, primary/secondary CTA pair, then three compact proof statements.
- The visual is one code-native scene with three visibly labelled stages, large enough to read without zooming.
- Stage 1: four short message chips labelled Instagram, WhatsApp, Website, and Email.
- Stage 2: a Smart Intake card with two or three large question rows.
- Stage 3: an organized cleaning request, one “Still needed” row, a short draft, and Review/Edit/Copy controls.
- A visible note states that channel names are link-placement examples, not inbox integrations.

### Mobile composition

- Copy first; CTA buttons stack only if two inline buttons cannot fit.
- Product scene follows as a vertical three-stage flow; no miniature dashboard, horizontal carousel, or clipped side-scroll.
- Hero plus the start of the product scene should communicate the mechanism within the first 1.5 mobile viewports.

### Interaction

- Primary CTA scrolls to `#how-it-works` with focus management and sticky-header offset.
- Secondary CTA navigates to `/pilot` and preserves language.
- Any decorative transition is opacity/transform only, under 240ms, and disabled for reduced motion.

## Section 2 — The problem

### Job

Make the pain recognizable without turning the page into a list of integrations.

### Composition

- One concise heading and paragraph.
- Four message cards: “How much?”, “Are you free Friday?”, “Do you cover my area?”, “Can you quote this?”
- One quiet supporting strip names the operational cost: repeated follow-up, rebuilt context, and slower responsible replies.
- No fake notification counts, unread badges, customer photos, or alarm-red visual treatment.

### Mobile

Use a 2×2 grid where viable and one column at the narrowest size. Cards size to content; no internal scroll.

## Section 3 — How it works

Anchor: `#how-it-works`

### Job

Explain the current mechanism completely in four verbs.

### Composition

Four numbered steps connected by a subtle line on desktop:

1. Share — put one link where customers already reach the business.
2. Ask — collect service, scope, location, timing, access, and relevant details.
3. Organize — create one readable request and show remaining gaps.
4. Review — edit/copy the assisted draft and send it manually in the real channel.

Each step uses a simple code-native symbol and no more than two sentences. The final step gets a small human-control badge.

### Mobile

Vertical stepper with the connector on the left. All content remains visible in document flow; it is not a swipe-only carousel.

## Section 4 — What the team gets

### Job

Translate the mechanism into four concrete work outputs.

### Composition

- A large organized-request panel occupies the visual half.
- Four compact outcome cards occupy the text half: Complete request, Visible gaps, Reply ready to review, Clear next action.
- Use meaningful states such as `Provided`, `Still needed`, and `Ready for review`; never use fake analytics or revenue numbers.
- Make the missing-detail state visually distinct but calm—not an error or emergency.

### Mobile

Request panel first, outcome cards below in a two-column grid where room permits. The panel has no fixed height or nested scroll.

## Section 5 — Cleaning demo

### Job

Prove the workflow with the single validated public pilot category and lead into `/demo`.

### Composition

- Incoming request: “How much for a move-out cleaning this Friday?”
- Intake questions: property size, scope, access, timing.
- Organized result: move-out cleaning, two-bedroom condo, oven/fridge, Friday 9–noon.
- Visible gap: parking and key instructions.
- Review controls: Review, Edit, Copy.
- Boundary note: no price, booking, submission, or message is produced by the demo.
- One primary link opens the full safe walkthrough.

### Interaction

The homepage version may reveal stages on explicit button/step selection, but its default state must remain understandable without JavaScript. It must not store or submit visitor data.

## Section 6 — Human control and trust

### Job

Resolve the most important adoption fear without another long feature grid.

### Composition

- Headline: AI helps prepare; the team decides what is sent.
- Four assurance chips: no auto-send, no invented price, no automatic booking, founder-led setup.
- Compact three-column explanation: explicit inputs, visible gaps, human review.
- Contextual links to `/trust`, `/privacy`, and `/security`.
- No unsupported compliance badge, encryption superlative, uptime promise, or customer-data diagram.

### Mobile

Assurance chips wrap naturally. Trust links remain ordinary document-flow links with 44px minimum target height where styled as controls.

## Section 7 — Final conversion

### Job

Give a clear next step after the story is complete.

### Composition

- Short high-contrast panel, not a full additional hero.
- Title: “Make the next customer request easier to answer.”
- One sentence: walk through the cleaning demo, then apply if the workflow fits.
- Primary: Walk through the demo.
- Secondary: Apply for the founder pilot.
- One quiet line repeats manual review, not all product disclaimers.

## Responsive behavior

| Width | Required behavior |
| --- | --- |
| 320–389 | Single-column copy, full-width actionable controls, no clipped words, no horizontal overflow |
| 390–767 | Single-column hero; 2-up compact cards only when readable; no nested first-screen scroll |
| 768–1023 | Wider text measure and selective 2-column grids; hero may remain stacked when the visual would become too small |
| 1024–1279 | Two-column hero only when minimum readable widths are satisfied; header may remain compact/mobile |
| 1280–1535 | Full desktop composition with zero overflow at actual client width |
| 1536+ | Content frame stops growing; H1 line count must not increase because font size continues growing |

## Accessibility and semantics

- One H1, followed by ordered H2 sections.
- DOM order matches reading order and mobile presentation.
- Message-source labels are text, not logo-only meaning.
- The four workflow steps use an ordered list.
- Interactive demo controls are buttons; navigation remains links.
- Focus is visible in light and dark themes.
- Color never carries missing/provided state alone.
- Reduced motion retains all content and removes nonessential movement.

## Rejected patterns

- A tiny full-dashboard screenshot in the hero.
- A 3D orbit, autoplay video, or cursor-following scene.
- Social-platform icons that imply authenticated integrations.
- Scrolling logo walls or invented customer proof.
- Twelve-section documentation-style homepage.
- Mobile carousel required to discover core product steps.
- Multiple sticky elements competing with the header.
