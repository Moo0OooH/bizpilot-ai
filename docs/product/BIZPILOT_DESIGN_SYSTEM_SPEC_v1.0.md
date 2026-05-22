# BizPilot AI Design System Spec v1.1

**Status:** Active
**Last updated:** 2026-05-22
**Scope:** Public pages, auth pages, public quote pages, dashboard pages, founder admin pages
**Implementation references:** `components/public/marketing-ui.tsx`, `components/dashboard/dashboard-ui.tsx`, `app/globals.css`

## 1. Product Design Intent

BizPilot is a cleaning-first Quote Recovery Command Center. The interface should
make a busy owner feel that requests are captured, details are organized,
drafts are safer, and follow-up is visible.

The interface must not feel like:

- a generic CRM,
- a booking system,
- an invoice product,
- a marketplace,
- a broad automation suite,
- a crypto/neon dashboard,
- an internal developer tool.

The current homepage is the frozen visual reference for public theme direction.
Do not change the homepage just to align a new page.

## 2. Token Sources

Public marketing pages use:

```text
components/public/marketing-ui.tsx
marketingTone
marketingBackground
MarketingShell
MarketingCard
MarketingButton
MarketingBadge
MarketingIcon
```

Protected/dashboard/admin pages use:

```text
app/globals.css
.biz-dashboard-dark
--dash-*
components/dashboard/dashboard-ui.tsx
```

When a founder/internal page is outside the dashboard route group, add
`.biz-dashboard-dark` to the page frame and use `marketingBackground` as the
outer background so it still matches the accepted public theme.

## 3. Color System

### 3.1 Public Theme

| Role | Value |
| --- | --- |
| Page base | `#050B12` |
| Soft page base | `#07111C` |
| Main text | `#F7FAFC` |
| Secondary text | `rgba(247,250,252,0.76)` |
| Muted text | `rgba(247,250,252,0.52)` |
| Border | `rgba(255,255,255,0.10)` |
| Strong border | `rgba(255,255,255,0.16)` |
| Surface | `rgba(9,20,31,0.82)` |
| Strong surface | `rgba(12,25,38,0.96)` |
| Teal | `#2DD4BF` |
| Emerald | `#17D492` |
| Gold | `#F6B84B` |
| Red | `#FF5F66` |
| Blue | `#54A7FF` |

### 3.2 Dashboard/Admin Dark Theme

| CSS variable | Value |
| --- | --- |
| `--dash-bg` | `#071018` |
| `--dash-surface` | `#0d1721` |
| `--dash-surface-muted` | `rgba(13,23,33,0.78)` |
| `--dash-surface-elevated` | `rgba(13,23,33,0.92)` |
| `--dash-border` | `rgba(255,255,255,0.08)` |
| `--dash-border-strong` | `rgba(255,255,255,0.14)` |
| `--dash-text` | `#f5f7fa` |
| `--dash-text-secondary` | `rgba(245,247,250,0.72)` |
| `--dash-text-muted` | `rgba(245,247,250,0.46)` |
| `--dash-primary` | `#17d492` |
| `--dash-primary-hover` | `#21e6a0` |
| `--dash-primary-soft` | `rgba(23,212,146,0.08)` |

### 3.3 State Meaning

| State | Color role | Use |
| --- | --- | --- |
| Primary/action/success | Teal/Emerald | CTA, ready, active, healthy |
| Attention/caution | Gold/Amber | at-risk, missing info, onboarding |
| Danger/blocked | Red | suspended, cancelled, error, overdue |
| Support/info | Blue | draft ready, informational status |
| Neutral | Slate/white alpha | inactive, meta, supporting controls |

Color must never be the only status signal. Use text and badge labels.

## 4. Typography

Font family:

```text
Geist Sans: var(--font-geist-sans)
Geist Mono: var(--font-geist-mono), code only
```

Accepted scale:

| Token | Desktop | Mobile | Weight | Use |
| --- | --- | --- | --- | --- |
| Display | 40px-46px | 34px-36px | 900 | Public hero only |
| Section H2 | 30px-36px | 28px-30px | 900 | Public sections, CTA bands |
| Page H1 | 22px-28px | 22px-24px | 800-900 | Dashboard/admin page headers |
| Card title | 15px-18px | 14px-17px | 800-900 | Cards, workflow steps |
| Body | 13px-16px | 13px-15px | 400-700 | Paragraphs, rows, descriptions |
| Meta | 10px-12px uppercase | 10px-11px | 800-900 | Eyebrows, labels, captions |
| Button | 12px-13px | 12px-13px | 800-900 | Primary and secondary actions |

Rules:

- No viewport-width font sizing.
- No negative letter spacing.
- Use positive tracking only on uppercase meta labels.
- Do not place hero-size type inside dashboard/admin cards.

## 5. Spacing And Container

Base layout:

```text
container.max.public = 1200px
container.max.admin = 1200px
container.padding.mobile = 20px
container.padding.desktop = 24px
dashboard shell max width = route specific, usually 1200px-1480px
```

Common spacing:

```text
section padding public: py-7 to py-10
hero padding public: compact enough to fit the first fold at 1280 x 720
card padding compact: 12px-16px
card padding default: 20px-24px
card padding feature/panel: 24px-32px
grid gap compact: 8px-12px
grid gap default: 16px-24px
```

Acceptance:

- 1280 x 720 desktop must have no horizontal overflow.
- 390 x 844 mobile must have no horizontal overflow.
- 100% browser zoom is the acceptance baseline.

## 6. Radius And Elevation

| Use | Radius |
| --- | --- |
| Small buttons and rows | 9px-13px |
| Inputs | 12px-13px |
| Cards | 14px-18px |
| Major panels | 20px-24px |
| Badges | 9999px |

Elevation comes from surface tone and border first. Shadows are restrained:

```text
public card shadow: 0 24px 70px rgba(0,0,0,0.30)
dashboard card shadow: subtle, inherited from .biz-card*
```

## 7. Component Standards

### 7.1 Public Header

- Height: 58px.
- Container: 1200px.
- Brand at left, nav center on desktop, account actions right.
- Mobile header uses short CTA `Start` to avoid overflow.

### 7.2 Public Button

Primary:

```text
height 44px
radius 10px
teal to emerald gradient
dark text #03130C
font 13px / 900
```

Secondary:

```text
height 44px
radius 10px
border marketingTone.borderStrong
background rgba(255,255,255,0.035)
```

### 7.3 Cards And Panels

Use major panels for grouped experiences:

- live recovery desk,
- recovery snapshot,
- response desk,
- before/after recovery pass,
- founder admin page header,
- final CTA.

Avoid long runs of identical cards. Vary layout by purpose.

### 7.4 Forms

Inputs:

- visible label,
- 42px-44px height,
- 12px-13px radius,
- visible focus ring,
- clear error/notice region.

Founder admin forms use dashboard form primitives. Auth forms use auth
primitives. Public quote forms stay customer-simple.

## 8. Route Surface Map

### `/`

Frozen reference. Use as the theme source. Do not edit unless the owner asks.

### `/pricing`

Public marketing surface. Must use `MarketingHeader`, `MarketingShell`,
`MarketingCard`, `MarketingButton`, and `MarketingFooter`.

### `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/reset-password`

Centered owner access cards. Keep max width around 460px. Use dark navy base,
emerald CTA, visible labels, and simple recovery/account copy.

### `/quote/[slug]`

Customer-facing public quote form. It may carry business branding, but it must
keep BizPilot spacing, label quality, accessibility, and no internal language.

### `/quote/[slug]/success`

Simple confirmation page. Show what happened and what the customer should
expect next.

### `/admin`

Internal founder surface. It must:

- use `.biz-dashboard-dark`,
- use `marketingBackground` for the outer page,
- stay max-width 1200px,
- use compact operational cards,
- avoid public marketing nav,
- never send customer messages,
- never imply automated billing, booking, or messaging.

### `/dashboard/*`

Protected owner workspace. Keep operational density, left nav shell, compact
cards, clear next actions, and owner-reviewed AI labels.

## 9. Copy Rules

Use real business language:

- "quote requests",
- "missing details",
- "owner-reviewed draft",
- "manual follow-up",
- "recovery queue",
- "public quote link",
- "no auto-send".

Avoid:

- internal phase labels,
- demo language without a demo label,
- "sent" unless the system sent it,
- fake analytics,
- broad CRM language,
- booking or invoice language.

## 10. Accessibility And QA

Every page must pass:

- keyboard reachable controls,
- visible focus state,
- visible labels for inputs,
- no color-only status,
- no horizontal overflow at 1280 desktop and 390 mobile,
- buttons do not wrap awkwardly,
- body text readable at 100% zoom,
- errors and notices are announced where appropriate.

## 11. Verification Checklist

Before accepting a frontend change:

```text
pnpm lint
pnpm typecheck
pnpm build
pnpm test:unit
browser QA at desktop 1280 x 720
browser QA at mobile 390 x 844 for public/auth pages
```

Run `pnpm test:rls` only when `DATABASE_URL` is set.

## 12. Definition Of Done

A page is design-system aligned when:

- it supports quote recovery or founder pilot operations,
- it uses the correct public or dashboard token source,
- it fits the documented breakpoints,
- it keeps owner/customer trust,
- it does not expand MVP scope,
- it has clear states and primary action hierarchy,
- it passes the verification checklist.
