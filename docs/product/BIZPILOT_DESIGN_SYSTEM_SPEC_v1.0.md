# BizPilot AI — Design System Spec

**Version:** v1.0
**Status:** Pilot-ready handoff
**Owner:** MoOoH
**Scope:** Tokens, components, layout grid, breakpoints, per-page wireframes for the full BizPilot surface
**Last Updated:** 2026-05-17
**Related:**
- `docs/BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md` (Section 6: Operational Calm UX, Section 15: Landing Page)
- `docs/product/BIZPILOT_UI_UX_SYSTEM_STANDARD_v1.1.md`
- `docs/product/BIZPILOT_DASHBOARD_UX_STANDARD_v1.0.md`

---

## 1. Design intent

BizPilot must read like a calm operational tool for a busy local-service owner — not a crypto app, not a marketing landing, not an enterprise CRM. The product is a **Quote Recovery Command Center**. The visual system supports three jobs at once:

- Convince a cleaning-business owner in under three minutes that this tool will help them stop losing leads.
- Let that same owner scan their inbox of quote requests in seconds, in good or poor lighting, on a phone or a 13-inch laptop, at 100% browser zoom.
- Feel trustworthy enough that they paste a private quote link on Instagram or Google Business Profile without second-guessing.

The whole system is built around: dark navy surface, calm emerald accent for action and value, restrained type, generous-but-not-cinematic spacing, no decorative gradients, no glow.

---

## 2. Color tokens

All colors are referenced by name in code (Tailwind class) and by role here. Use the role description to decide which token applies; never invent off-table colors.

| Token | Hex | Tailwind | Role |
| --- | --- | --- | --- |
| `navy.base` | `#07101A` | `bg-[#07101a]` | App background, full page |
| `navy.surface` | `#0E1B2C` | `bg-white/[0.04]` overlay | Card surface on navy |
| `navy.surface-strong` | `#152437` | `bg-white/[0.06]` overlay | Hover card, nav pill |
| `border.subtle` | `rgba(255,255,255,0.08)` | `border-white/10` | Default card border |
| `border.muted` | `rgba(255,255,255,0.15)` | `border-white/15` | Input border |
| `emerald.600` | `#059669` | `bg-emerald-600` | Primary CTA fill |
| `emerald.500` | `#10B981` | `hover:bg-emerald-500` | Primary CTA hover |
| `emerald.400` | `#34D399` | `text-emerald-400` | Accent in headlines, badges, success |
| `emerald.300` | `#6EE7B7` | `text-emerald-300` | Eyebrow labels, small accent text |
| `red.400` | `#F87171` | `text-red-400` | "Needs reply" stat, SLA overdue |
| `red.300` | `#FCA5A5` | `text-red-300` | Danger badge text |
| `amber.400` | `#FBBF24` | `text-amber-400` | "At risk", warn |
| `amber.300` | `#FCD34D` | `text-amber-300` | Warn detail text |
| `violet.300` | `#C4B5FD` | `text-violet-300` | AI drafts ready |
| `slate.200` | `#E2E8F0` | `text-slate-200` | Body text on dark |
| `slate.300` | `#CBD5E1` | `text-slate-300` | Secondary body text |
| `slate.400` | `#94A3B8` | `text-slate-400` | Muted text, captions |
| `slate.500` | `#64748B` | `text-slate-500` | Chevron, separator |
| `white` | `#FFFFFF` | `text-white` | Primary text, headlines |

**Semantic mappings (use these names in code, not raw hex):**

```text
bg.app              → navy.base
bg.card             → white/[0.04]
bg.card.hover       → white/[0.06]
text.primary        → white
text.secondary      → slate.300
text.muted          → slate.400
border.default      → white/10
border.input        → white/15
brand.primary       → emerald.600
brand.accent        → emerald.400
state.danger        → red.400
state.warn          → amber.400
state.success       → emerald.400
state.info          → violet.300
```

---

## 3. Typography scale

Font family: system-ui stack (Tailwind default). The product never embeds custom web fonts — keeps first-paint fast for owners on weak connections.

| Token | Size | Weight | Line height | Use |
| --- | --- | --- | --- | --- |
| `text.display` | 52px desktop / 44px tablet / 36px mobile | 600 | 1.08 | Landing hero only |
| `text.h2` | 28px desktop / 22px mobile | 600 | 1.2 | Section titles |
| `text.h3` | 18px | 600 | 1.3 | Card titles, step titles |
| `text.lead` | 15–16px | 400 | 1.7 | Hero subhead, lead paragraph |
| `text.body` | 14–15px | 400 | 1.55 | Default body |
| `text.small` | 13px | 400 | 1.5 | Table rows, helper text |
| `text.caption` | 12px | 400 | 1.4 | Meta, timestamps |
| `text.meta` | 11px uppercase, tracking 0.06em | 500 | 1.2 | Eyebrows, labels above stats |
| `text.numeric.lg` | 32px | 600 | 1 | Stat card primary number |
| `text.numeric.md` | 22px | 600 | 1 | Inline metric |

Only two weights are used in product UI: **regular 400** and **semibold 600**. Never 700/800/900. Never italic.

---

## 4. Spacing scale

A single 4-px base grid, no half steps:

```text
0   2   4   6   8   12   16   20   24   32   40   48   56   64   80
```

| Token | Px | Common use |
| --- | --- | --- |
| `sp.1` | 4 | Inline icon-to-text |
| `sp.2` | 8 | Card padding small, label-input gap |
| `sp.3` | 12 | Stat card padding, button padding-x |
| `sp.4` | 16 | Card padding default, section gap mobile |
| `sp.5` | 20 | Card padding desktop |
| `sp.6` | 24 | Section padding-y mobile |
| `sp.7` | 32 | Section padding-y desktop |
| `sp.8` | 40 | Hero padding-y mobile |
| `sp.9` | 48 | Hero padding-y desktop |
| `sp.10` | 56 | Hero margin-bottom desktop |
| `sp.11` | 64 | Major section break desktop |
| `sp.12` | 80 | Reserved for full-bleed sections |

---

## 5. Radius and elevation

```text
radius.sm   6px   chips, small inputs
radius.md   10px  CTAs, buttons, pill nav items
radius.lg   12px  inputs, small cards
radius.xl   14px  feature cards, stat cards
radius.2xl  16px  panel containers, dashboard preview, final CTA strip
radius.full 9999  avatars, badges, status pills
```

Shadows are reserved for floating surfaces only:

```text
shadow.preview   0 22px 60px rgba(0,0,0,0.34)   landing dashboard preview
shadow.modal     0 24px 80px rgba(0,0,0,0.5)    future modal (not yet used)
```

The app does not use shadow for cards or buttons on the navy surface — the dark background provides enough separation.

---

## 6. Layout grid

| Token | Value |
| --- | --- |
| `container.max` | 1200px |
| `container.padding.mobile` | 16px |
| `container.padding.tablet` | 24px |
| `container.padding.desktop` | 32px |
| `hero.text.max` | 620px |
| `hero.lead.max` | 560px |
| `hero.preview.max` | 560px |
| `auth.column.max` | 380px |
| `quote.form.max` | 720px |
| `dashboard.sidebar` | 152px |

Breakpoints (Tailwind defaults):

```text
sm  640px   phones rotated, small tablets
md  768px   tablets
lg  1024px  laptops, desktop dashboard
xl  1280px  wide desktops
```

**Reflow rules** (most important):

- Below `lg`: hero stacks vertically. Dashboard preview drops below the headline+CTA block.
- Below `lg`: dashboard sidebar collapses to icon-only (`lg:block` shows it). Mobile nav exposes a single primary CTA + menu trigger.
- Below `md`: "Why" cards stack to 1 column.
- Below `sm`: stat-card grids stack to 1 column; lead-list row truncates the "Service" cell first.

---

## 7. Component variants

### 7.1 Primary CTA

```text
height        44px
padding-x     20px
radius        radius.md (10px)
bg            emerald.600
hover bg      emerald.500
text          white, 14px, 600
icon          optional trailing arrow at right
min-width     200px on sm+
```

### 7.2 Secondary CTA

```text
height        44px
padding-x     20px
radius        radius.md (10px)
bg            white/[0.04]
border        0.5px white/15
text          white, 14px, 600
hover bg      white/[0.08]
```

### 7.3 Ghost button (sidebar, tab pill)

```text
height        32px
padding       6px 12px
radius        radius.sm (6px)
bg            transparent
text          slate.300
hover         text-white + bg white/[0.06]
active        bg white/[0.08] + text-white + weight 600
```

### 7.4 Eyebrow pill

```text
display       inline-flex
height        24px
padding       4px 12px
radius        radius.full
bg            white/[0.06]
border        0.5px white/10
text          slate.300, 12px, 500
```

### 7.5 Status badge

| Tone | Fill | Border | Text |
| --- | --- | --- | --- |
| Success (new, ready) | emerald.500/15 | emerald.400/30 | emerald.300 |
| Warn (at risk) | amber.500/15 | amber.400/20 | amber.300 |
| Danger (overdue) | red.500/15 | red.400/20 | red.300 |
| Info (AI ready) | violet.500/15 | violet.400/25 | violet.300 |
| Neutral (archived) | white/[0.06] | white/10 | slate.300 |

All badges: 11px text, 500 weight, padding 2px 8px, radius full.

### 7.6 Card

```text
bg          white/[0.04]
border      0.5px white/10
radius      radius.xl (14px)
padding     16–20px
hover       bg white/[0.06]
```

### 7.7 Stat card

```text
inherits Card
padding 12–16px
label       text.meta (11px uppercase)
value       text.numeric.lg in semantic color
detail      text.caption in slate.400
```

### 7.8 Input

```text
height        40px
padding       8px 12px
radius        radius.md (10px)
bg            white/[0.05]
border        0.5px white/15
text          14px white
placeholder   slate.400
focus border  emerald.400
focus ring    2px emerald.400/30
```

Disabled state: `bg white/[0.02]`, `text slate.500`, no hover.

### 7.9 Sidebar item

```text
height          32px
padding         6px 12px
radius          radius.sm (6px)
default text    slate.300
icon            16px outline, slate.400
active bg       white/[0.08]
active text     white, 500
active icon     emerald.400
```

### 7.10 Quote form field group

```text
label         text.meta in slate.300, margin-bottom 6px
input         Component 7.8
help text     text.caption in slate.400, margin-top 4px
required *    emerald.400 inline after label
group gap     16px between groups
```

---

## 8. Iconography

Outline icons only. Two libraries are acceptable: Heroicons Outline 24 and Tabler Outline. Choose **one** at implementation time and standardize. Do not mix.

| Use | Icon (Heroicons) | Stroke | Color |
| --- | --- | --- | --- |
| Inline in body text | matching name | 1.5px | inherit |
| Nav / sidebar | `home`, `inbox`, `cog`, `bell` | 1.5px | slate.400 default, emerald.400 active |
| Status decorations | `check-circle`, `exclamation-triangle`, `clock` | 1.5px | semantic color |
| Trailing CTA arrow | `arrow-right` | 1.5px | inherit (white in CTA) |

Never use emoji in product UI. Never use filled (solid) icons in body content.

---

## 9. Motion

Motion is restrained. Three durations only:

```text
fast    120ms   hover state transitions
base    180ms   tab switch, panel open
slow    260ms   page enter, modal in
ease    cubic-bezier(0.4, 0, 0.2, 1)
```

No spring physics, no rotate, no scale beyond `0.98` for click feedback.

---

## 10. Surface map per page

Each entry lists the page route, primary surfaces, and zoning.

### 10.1 Landing — `/`

```text
nav (56px, sticky)
  | logo BizPilot       | Features · How · For Cleaning   | See Demo · Get Early Access
hero (Fold 1, ~520px desktop)
  | eyebrow pill: For cleaning businesses
  | h1: Stop losing cleaning quote requests.   (emerald accent on "quote requests")
  | lead: 2-line subhead
  | [Primary CTA] [Secondary CTA]
  | 3 outcome chips
  |                     dashboard preview (panel, 560px max)
why (Fold 2, ~360px)
  | h2: Why cleaning businesses lose leads
  | 4 cards: Slow replies · Messy DMs · Missed follow-ups · Quote chaos
how (Fold 3, ~340px)
  | h2: How BizPilot works
  | 3 steps: Customer submits · BizPilot organizes · Owner replies
cta (Fold 4, ~180px)
  | h2: Start recovering leads today.
  | one line subhead
  | [Primary CTA]
footer (~80px)
  | logo strip + copyright
```

### 10.2 Sign in — `/auth/sign-in`

```text
nav (lightweight: logo only)
center column (max 380px)
  | h2: Sign in
  | lead caption
  | email input
  | password input
  | [Primary CTA full-width]
  | secondary link: Create account
```

### 10.3 Sign up — `/auth/sign-up`

```text
nav (lightweight)
center column (max 380px)
  | h2: Create your workspace
  | lead caption (mentions pilot pricing)
  | name input
  | business name input
  | email input
  | password input
  | [Primary CTA full-width: Start free pilot]
  | secondary link: Already have an account?
```

### 10.4 Public quote — `/quote/[slug]`

```text
top strip (~64px)
  | owner logo + business name
  | "Quick quote" badge
form panel (max 720px, centered)
  | h2: Request your cleaning quote
  | lead: "We reply within 1 hour"
  | dynamic intake fields (from intake_form_fields)
  | consent notice (small text block)
  | honeypot input (hidden, off-screen)
  | [Primary CTA: Send quote request]
trust strip
  | small lock icon + privacy note
```

### 10.5 Quote success — `/quote/[slug]/success`

```text
center column (max 480px)
  | check-circle icon (40px, emerald)
  | h2: Request sent
  | lead: "Sparkle Cleaning will reply within 1 hour"
  | next-steps card (3 bullets)
  | secondary link: Submit another quote
```

### 10.6 Dashboard overview — `/dashboard`

```text
sidebar (152px lg+)
  | logo
  | nav: Overview (active) · Leads · Quote setup · Follow-ups · Settings
  | footer: business name + role
main
  | header bar: greeting + [New lead] CTA
  | 4 stat cards in a row (new / reply / risk / AI)
  | 2-panel split: at-risk leads (1.4fr) + AI drafts ready (0.9fr)
  | quick actions row (3 chips)
```

### 10.7 Lead list — `/dashboard/leads`

```text
sidebar (as above)
main
  | header: "Leads" + filter pills (All · New · At risk · Replied · Lost)
  | table list (Customer · Service · SLA state · Status badge)
  | rows are clickable cards
  | empty state shows quote-link share prompt
```

### 10.8 Lead detail — `/dashboard/leads/[id]`

```text
sidebar (as above)
main
  | back link + customer name + status badge + [Mark replied]
  | 2-col grid (1.4fr · 0.6fr):
  |   left: AI draft card with regenerate/tone variants
  |         quote details card (key/value table)
  |         message log card
  |   right: timeline card (events)
  |          outcome card (mark booked / lost / no-response)
```

### 10.9 Business configuration — `/dashboard/configuration`

```text
sidebar (as above)
main
  | page header + sticky [Save configuration] bar at viewport bottom
  | tab nav: Overview · Profile · Branding · Services · Public Page · Quote Form · FAQ · Privacy · Readiness
  | active panel content (all other panels remain MOUNTED in the DOM with hidden attribute,
    so a single form submit captures every required field — see configuration-tabs.tsx fix)
  | readiness sidebar (right column) summarises 8 setup items + public quote link
```

---

## 11. Light vs dark mode

There is **no light mode** in the MVP. All surfaces are dark navy. A future light variant would only flip the surface tokens; brand color and semantic tones stay identical. Do not author components with conditional theming — the system is one mode.

---

## 12. Accessibility floor

- Color contrast: white-on-navy.base ≥ 14:1; slate.400-on-navy.base ≥ 5:1; emerald.400-on-navy.base ≥ 7:1.
- Every interactive element has a visible focus ring (emerald.400/30, 2px).
- Every form field has a `<label>` even when visually positioned as a placeholder; required fields announce `aria-required="true"`.
- Tab order follows reading order. Modal/dropdown traps focus.
- Icons inside buttons carry `aria-hidden="true"`; icon-only buttons carry `aria-label`.
- 100% browser zoom is the design target. The page must remain usable up to 200% zoom on the dashboard surfaces; landing may degrade gracefully past that.

---

## 13. Component naming for Figma handoff

When recreating this in Figma, mirror the code names so designer and engineer share a vocabulary:

```text
Tokens / Color / brand / emerald-600
Tokens / Color / surface / navy-base
Tokens / Typography / display
Tokens / Typography / h2
Tokens / Spacing / 4 → 80
Components / CTA / Primary
Components / CTA / Secondary
Components / Badge / Success | Warn | Danger | Info
Components / Card / Default
Components / Card / Stat
Components / Input / Default
Components / Input / Disabled
Components / Sidebar / Item
Components / Nav / Top
Layouts / Container / 1200
Layouts / Hero / Fold-1
Pages / Landing
Pages / Auth / Sign-in
Pages / Auth / Sign-up
Pages / Public / Quote
Pages / Public / Quote success
Pages / Dashboard / Overview
Pages / Dashboard / Leads
Pages / Dashboard / Lead detail
Pages / Dashboard / Configuration
```

---

## 14. What is intentionally not in v1.0

These will be added when the matching pilot data justifies them — not before:

- Light mode tokens.
- Onboarding tour overlays.
- Multi-tenant business switcher UI (single-business owners do not need it yet).
- Notification center / bell drawer (rate limit + abuse log produce no user-facing notifications yet).
- Charts and data viz (no analytics surface in MVP scope).
- Marketing-only press kit, blog header, change-log surface.

---

## 15. Definition of Done

A new page or component is "design-system-aligned" when:

- It uses only tokens listed in Sections 2, 3, 4, 5.
- It fits the container grid in Section 6 with no horizontal scroll at any documented breakpoint.
- It uses only the component variants in Section 7 (or the spec is extended first).
- It passes the accessibility floor in Section 12.
- It is referenced under one of the headings in Section 10 or a new one is appended.
