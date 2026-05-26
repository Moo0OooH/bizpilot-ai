# BizPilot AI - Dashboard Design System v1.0

**Status:** Active canonical reference for every protected and public surface in the app
**Scope:** Tokens, components, layout, typography, motion, accessibility, conflict-with-older-standards register
**Owner:** MoOoH
**Created:** 2026-05-19
**Source of truth:** approved `index (7).html` Quote Recovery Command Center prototype, distilled into the live codebase

---

## 1. Why this document exists

The project already has three older visual standards:

- `docs/product/BIZPILOT_DESIGN_SYSTEM_SPEC_v1.0.md` - the original "calm operational tool" tokens
- `docs/product/BIZPILOT_HOMEPAGE_AND_VISUAL_THEME_STANDARD_v1.0.md` - marketing-side color guidance
- `docs/product/BIZPILOT_UI_UX_SYSTEM_STANDARD_v1.1.md` - density, accessibility, page rules

They remain valid, but the live dashboard has been rebuilt from the approved `index (7).html` prototype with a teal/navy command-center palette that supersedes the parts of those documents that disagree. This file records exactly what the implementation uses now so that every new page - protected or public - can match without guessing.

When this document and an older one conflict, this document wins for any **rendered chrome, surface, button, badge, form field, layout grid, or interactive component**. `BIZPILOT_FEATURE_ENTITLEMENT_AND_GUIDE_STANDARD_v1.0.md` wins for future feature expansion, Settings feature visibility, and guide requirements. Older documents still win for **security, AI behavior, GTM, and validation gates** unless a newer canonical standard explicitly supersedes them.

---

## 2. Color tokens - single source of truth

Every dashboard surface uses `--dash-*` variables defined in `app/globals.css`. Marketing/public surfaces may use `--biz-*` (homepage tokens). Both palettes share the same brand teal.

### 2.1 Dashboard dark (default) - `.biz-dashboard-dark`

| Token | Hex / value | Role |
| --- | --- | --- |
| `--dash-bg` | `#071018` | App background, full page |
| `--dash-bg-soft` | `#071018` | Atmospheric fall-off |
| `--dash-surface` | `#0d1721` | Card surface |
| `--dash-surface-muted` | `rgba(13, 23, 33, 0.78)` | Nested cells, table headers, hover wells |
| `--dash-surface-elevated` | `rgba(13, 23, 33, 0.92)` | Topbar, sticky panels, input fill |
| `--dash-border` | `rgba(255, 255, 255, 0.08)` | Default border |
| `--dash-border-strong` | `rgba(255, 255, 255, 0.14)` | Input border, dividers needing more contrast |
| `--dash-text` | `#f5f7fa` | Primary text |
| `--dash-text-secondary` | `rgba(245, 247, 250, 0.72)` | Body copy |
| `--dash-text-muted` | `rgba(245, 247, 250, 0.46)` | Captions, eyebrows |
| `--dash-primary` | `#17d492` | Brand teal - primary CTA, brand mark, active nav |
| `--dash-primary-hover` | `#21e6a0` | Hover state for primary CTA |
| `--dash-primary-soft` | `rgba(23, 212, 146, 0.08)` | Active nav fill, hover wells |
| `--dash-warning-soft` | `rgba(255, 184, 77, 0.12)` | Amber badge fill |
| `--dash-danger-soft` | `rgba(255, 92, 92, 0.10)` | Red badge fill |
| `--dash-ai-soft` | `rgba(23, 212, 146, 0.08)` | AI assistant card accent |

### 2.2 Dashboard light - `.biz-dashboard-light`

Same role mapping with these overrides:

| Token | Hex / value |
| --- | --- |
| `--dash-bg` | `#f8fafc` |
| `--dash-bg-soft` | `#eef2f7` |
| `--dash-surface` | `#ffffff` |
| `--dash-surface-muted` | `#f8fafc` |
| `--dash-surface-elevated` | `#ffffff` |
| `--dash-border` | `rgba(15, 23, 42, 0.10)` |
| `--dash-border-strong` | `rgba(15, 23, 42, 0.16)` |
| `--dash-text` | `#0f172a` |
| `--dash-text-secondary` | `#475569` |
| `--dash-text-muted` | `#64748b` |
| `--dash-primary` | `#059669` |
| `--dash-primary-hover` | `#047857` |
| `--dash-primary-soft` | `rgba(5, 150, 105, 0.10)` |

### 2.3 Homepage / public marketing - `--biz-*`

| Token | Hex |
| --- | --- |
| `--biz-page-bg` | `#080d12` |
| `--biz-page-surface` | `#0f1a24` |
| `--biz-page-surface-elevated` | `#13202e` |
| `--biz-page-border` | `rgba(255, 255, 255, 0.07)` |
| `--biz-page-text` | `#eef2f6` |
| `--biz-page-text-soft` | `#7a90a4` |
| `--biz-primary` | `#00d084` |
| `--biz-primary-hover` | `#00a868` |
| `--biz-warning` | `#ffab00` |
| `--biz-danger` | `#ff4757` |
| `--biz-blue-accent` | `#4fa8ff` |

### 2.4 Semantic colors with dark variants

Status indicators in code **must** include a `dark:` Tailwind modifier so they render correctly in either theme:

```text
text-emerald-700 dark:text-emerald-300   (success / Done)
text-amber-700  dark:text-amber-300     (warning / Open)
text-red-700    dark:text-red-300       (danger / Lost)
text-sky-700    dark:text-sky-300       (info / Ready)
```

The shared `StatusBadge` component (see Section 6) already applies these correctly.

### 2.5 What is **banned**

To stay on-token the codebase forbids these patterns inside `app/(dashboard)/**` and dashboard components:

- `bg-white`, `bg-zinc-*`, `bg-slate-*`
- `border-zinc-*`, `border-slate-*`
- `text-zinc-*`, `text-slate-*`
- Hard-coded hex values for surface, border, text, or brand teal

Any of the above must be replaced with the matching `--dash-*` token. Semantic emerald/amber/red are allowed **only** when paired with `dark:` variant.

### 2.6 Allowed exception - `bg-white/[0.03-0.07]` overlays on dark surfaces

Public marketing and customer-facing pages render over `--biz-page-bg` (`#080d12`) rather than the dashboard tokens. On those surfaces the existing implementation uses small white-alpha overlays (`bg-white/[0.025]`, `bg-white/[0.035]`, `bg-white/[0.06]`, `bg-white/[0.07]`) to fake nested cards without dragging in a separate token.

This is allowed because:

- The opacity is low enough (<= 7%) that the rendered color matches `--dash-surface-muted` (`rgba(13,23,33,0.78)`) within 1 step of the lightness ramp.
- The pattern only ever appears on top of an already-dark surface - never on a light page.
- Switching them to literal CSS variables would force Tailwind to drop the opacity modifier and bloat globals.css with many one-off tokens.

These overlays are **not** allowed on `app/(dashboard)/**` chrome - the dashboard always uses the explicit `--dash-surface-muted` / `--dash-surface-elevated` tokens through `DashboardCard`. The exception applies only to:

- `app/page.tsx` (homepage)
- `app/(auth)/**` and `components/auth/**`
- `app/(public)/quote/[slug]/page.tsx`

Any new marketing/public surface should prefer the explicit `--biz-page-surface` / `--biz-page-surface-elevated` tokens when a fresh component is created, but the overlay pattern is the canonical way to render translucent nested cards inside an existing dark layout.

---

## 3. Typography scale

Font: system-ui stack via Tailwind default. No web font load.

| Token | Size | Weight | Line height | Use |
| --- | --- | --- | --- | --- |
| `text.display` | 38-42px desktop / 30px mobile | 800 | 1.04 | Hero card headline |
| `text.h1` | 26-30px | 800 | 1.1 | Page title (PageHeader) |
| `text.h2` | 22-24px | 800 | 1.2 | Detail-header customer name |
| `text.h3` | 18px | 800 | 1.3 | Section / card titles |
| `text.lead` | 15px | 400 | 1.65 | Hero subhead, page description |
| `text.body` | 13-14px | 400 | 1.55 | Default body |
| `text.small` | 12-13px | 400 | 1.5 | Table cells, helper text |
| `text.meta` | 11px uppercase, tracking `0.14em` | 800 | 1.2 | Eyebrows, labels above stats |
| `text.numeric.lg` | 34px | 850 | 1 | MetricCard primary number |

Only two weights are used in dashboard chrome: **regular 400** and **extra-bold 800 (`font-black`)**.

---

## 4. Spacing scale

4-px grid:

```text
0  2  4  6  8  12  14  16  18  20  22  24  28  32  40  48  64
```

| Token | px | Common use |
| --- | --- | --- |
| `sp.2` | 8 | Inline icon-to-text gap |
| `sp.3` | 12 | Compact card padding lower bound |
| `sp.4` | 16 | Section gap mobile, card content gap |
| `sp.5` | 18 | Default card padding (`p-[18px]`) |
| `sp.6` | 22 | Hero/lead-detail card padding (`p-[22px]`) |
| `sp.7` | 24 | Section padding-y desktop |
| `sp.8` | 28 | Topbar/content vertical rhythm |

---

## 5. Layout & breakpoints

| Token | Value |
| --- | --- |
| `container.max` (dashboard) | `1220px` |
| `container.padding.lg` | `30px` |
| `container.padding.md` | `24px` |
| `container.padding.sm` | `18px` |
| `sidebar.width` | `272px` |
| `topbar.height` | `76px` |
| `right-rail.width` | `320px` |
| `quote-form.max` | `720px` |
| `auth-card.max` | `460px` |

Tailwind breakpoints: `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`.

### 5.1 Dashboard shell grid

```
app shell  --- lg+: grid-cols-[272px_minmax(0,1fr)]
            `--- md-:  hidden sidebar, mobile bottom-nav (5 items)

main         --- max-w-[1220px] mx-auto px-[30px] py-7
content     --- grid xl:grid-cols-[minmax(0,1fr)_320px]   (queue + right-rail)
```

### 5.2 No horizontal scroll

Dashboard pages **must not** introduce horizontal scroll at `1280px @ 100% zoom`. This means:

- No `min-w-[NNNpx]` on tables, grids, or rows
- Use `grid-cols-[minmax(0,1fr)_...]` (the `minmax(0,1fr)` is required to defeat content overflow)
- Mobile (`<xl`) uses dedicated card layout, not a squeezed table
- Test queue at exactly `1280px` and `1440px` before merging

---

## 6. Component primitives

Source: `components/dashboard/dashboard-ui.tsx`.

### 6.1 `DashboardCard`

```tsx
<DashboardCard variant="default | elevated | muted | priority" className="p-[18px]" />
```

CSS class mapping (in `globals.css`):

- `biz-card` - default surface with subtle shadow
- `biz-card-elevated` - slightly raised, for primary content
- `biz-card-muted` - dim wells
- `biz-card-priority` - emerald-tinted attention surface (hero card, recovery focus)
- `biz-card-ai` - radial teal accent for AI Summary / Suggested reply / Follow-up draft cards

Default radius: `24px`. Border: `--dash-border`. Padding owned by caller (use `p-[18px]` for body cards, `p-[22px]` for hero/detail cards).

### 6.2 `PageHeader`

```tsx
<PageHeader
  eyebrow="Leads"
  title="Lead Recovery Queue"
  description="Prioritize quote requests before customers move on."
  actions={<><CopyButton ... /><Link ... /></>}
/>
```

- `eyebrow`: 11px uppercase, tracking `0.14em`, `--dash-text-muted`
- `title`: 26-30px `font-extrabold`, `tracking-[-0.04em]`
- `description`: 14px `leading-6`
- Actions wrap on the right (md+) or below (sm)
- **Exactly one `PageHeader` per route.** Inner cards must use `SectionHeader`.

### 6.3 `SectionHeader`

```tsx
<SectionHeader title="..." description="..." action={...} />
```

- Used inside cards to label sections; never repeats the page title

### 6.4 `MetricCard`

```tsx
<MetricCard
  label="Needs reply"
  value={3}
  tone="amber"
  detail="Waiting for owner response"
/>
```

- 146px minimum height, 18px padding
- 34px numeric value with `tracking-[-0.06em]`
- Color of value follows `tone` (`emerald | blue | amber | red | neutral`)
- Always includes a 2px round dot in the matching tone next to the label

### 6.5 `StatusBadge`

```tsx
<StatusBadge tone="emerald | amber | red | blue | neutral">Active</StatusBadge>
```

- Pill with leading 1.5px dot, 11px text, `font-extrabold`, padding `2px 9px`
- Tones already include dark variants

Specialized variants:

- `LeadQualityBadge` - maps `strong / good / needs_info / low_fit` -> emerald / blue / amber / red
- `LeadStatusBadge` - maps `new / reviewed / replied / follow_up_needed / booked / lost / archived`
- `ResponseSlaBadge` - maps SLA state

### 6.6 `Avatar` and name helpers

```tsx
<Avatar name={customer.name} size={36} tone="soft" />   // table rows
<Avatar name={customer.name} size={52} tone="primary" /> // detail header
```

- Renders only **initials** via `initials()` (max 2 chars) - never raw PII
- Use `shortCustomerName("Mohammad Ghoorchibeigi") -> "Mohammad G."` for any customer-facing label rendered to the owner

These helpers exist for privacy alignment with Engineering Standard v1.5 Section 10 - the owner needs to recognize the lead, but the surface should not paste their full legal name into UI chrome.

### 6.7 Button hierarchy

| Variant | Class | Use |
| --- | --- | --- |
| `primaryButtonClass` | `biz-button-primary` | One per workflow region: Save, Open queue, Review urgent lead |
| `buttonClass` | `biz-button-secondary` | Supporting actions: Copy link, Preview, Open queue |
| `ghostButtonClass` | `biz-button-ghost` | Low-emphasis utilities |
| `disabledButtonClass` | n/a | Future / not-in-MVP placeholders |

Heights: dashboard 40-44px, auth/public 44-48px. Radius `13px`.

### 6.8 Form fields

| Class | Use |
| --- | --- |
| `inputClass` | Single-line input/select - 42px height, 13px text, `biz-field` background |
| `textareaClass` | Multi-line input - same surface, `leading-6` |
| `labelClass` | `grid gap-1.5 text-sm font-semibold` - wrap the field |

All fields focus to `--dash-primary` with a 4px `--dash-primary-soft` ring (WCAG focus ring).

### 6.9 `EmptyState`

Dashed border, centered title + body + optional action. Used inside queue/table/timeline wells.

### 6.10 `RightRailPanel`

Padding-only wrapper around `DashboardCard`. Width-controlled by parent grid (typically `320px`).

---

## 7. Layout patterns

### 7.1 Standard two-column page

```
<main className="space-y-4">
  <PageHeader ... />
  <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
    <div className="space-y-4">
      ... main content cards ...
    </div>
    <aside className="space-y-4 xl:sticky xl:top-[92px]">
      ... right rail panels ...
    </aside>
  </section>
</main>
```

`xl:sticky xl:top-[92px]` keeps the right rail visible below the 76px topbar + 16px breathing room.

### 7.2 Hero card (overview)

`DashboardCard variant="priority"` with `xl:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)]`:

- Left: eyebrow badge + 38-42px headline + 15px lead + two CTAs
- Right: featured lead avatar + identity + 3 badges + suggested action well

### 7.3 Configuration tabs

Single-active-tab. Hidden tabs remain mounted (`hidden` class) so their form inputs continue to submit. See `components/dashboard/configuration-tabs.tsx`.

### 7.4 Lead detail two-column

```
<section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
  <div>... details, missing info, controls, notes ...</div>
  <aside>... AI Summary, Suggested reply, Follow-up draft ...</aside>
</section>
```

Right aside uses `biz-card-ai` for the assistant surfaces.

---

## 8. Motion

Three durations only:

```text
fast 120ms - hover state transitions
base 180ms - tab switch, fade-in
slow 260ms - modal in
ease cubic-bezier(0.4, 0, 0.2, 1)
```

No spring physics. No rotate. Click feedback `scale 0.98` only.

---

## 9. Accessibility floor

- White-on-`--dash-bg` contrast: >= 14:1
- `--dash-text-secondary` on `--dash-bg`: >= 5:1
- Every interactive element has a visible focus ring (4px `--dash-primary-soft`)
- Every form field has a visible `<label>` (placeholder is never the only label)
- Icons inside buttons carry `aria-hidden="true"`; icon-only buttons carry `aria-label`
- Tab order follows reading order
- 100% browser zoom is the design target; dashboards must remain usable to 200%
- Color is never the only signal - always paired with text and shape

---

## 10. Pages already using this system

| Route | File | Notes |
| --- | --- | --- |
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | Hero, 4 metrics, queue (limit 5), Recent Activity, right rail |
| `/dashboard/leads` | `app/(dashboard)/dashboard/leads/page.tsx` | Single header, queue with filters, right rail |
| `/dashboard/leads/[leadId]` | `app/(dashboard)/dashboard/leads/[leadId]/page.tsx` | Detail header, two-col AI desk |
| `/dashboard/configuration` | `app/(dashboard)/dashboard/configuration/page.tsx` | 10 tabs single-active |
| `/dashboard/business-profile` | `app/(dashboard)/dashboard/business-profile/page.tsx` | Two-card identity + operating notes + roadmap |
| `/dashboard/settings` | `app/(dashboard)/dashboard/settings/page.tsx` | Three-card row + sticky workspace aside |
| `/dashboard/quote-setup` | `app/(dashboard)/dashboard/quote-setup/page.tsx` | redirect alias to `/dashboard/configuration` |
| `/founder` | `app/(dashboard)/founder/page.tsx` | Pilot tracking shell, "Not owner-facing" badge |

---

## 11. Conflict register - index prototype vs. existing standards

Each row records something the approved `index (7).html` did and how the live implementation decided.

| Index does | Existing standard says | Decision | Doc citation |
| --- | --- | --- | --- |
| Dark **and** light theme toggle in topbar | Design System Spec v1.0 Section 11: "no light mode in MVP" | **Kept** the toggle. The dashboard cookie-driven `DashboardThemeSelector` makes it hydration-safe and Homepage & Visual Theme Standard v1.0 Section 5 explicitly permits "Light/dark mode may exist" for the dashboard. | `DESIGN_SYSTEM_SPEC_v1.0.md` Section 11 vs `HOMEPAGE_AND_VISUAL_THEME_STANDARD_v1.0.md` Section 5 |
| `CleanPro Montreal v` multi-business switcher | Design System Spec v1.0 Section 14: "Multi-tenant business switcher UI (single-business owners do not need it yet)" | **Dropped** the dropdown. Sidebar mini-status shows the active business name. Switcher returns when multi-tenant ownership is real. | `DESIGN_SYSTEM_SPEC_v1.0.md` Section 14 |
| AI reply card with a Send button | Master Blueprint v1.4 Section 8.4 + Engineering Standard v1.5 Section 10: "AI must not auto-send" | **Replaced** with Copy + "No Send button in MVP. Owner copies and sends manually." | `BIZPILOT_MASTER_BLUEPRINT_v1.4.md` Section 8.4, `BIZPILOT_ENGINEERING_STANDARD_v1.5.md` Section 10 |
| Notifications panel with SMS / WhatsApp enabled | Strategic Alignment v1.6 Section 4 Not-Now List | Panel renders fields **disabled** with `Future - disabled`. Email is the only active channel. | `BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md` Section 4 |
| Full customer legal name in table cells ("Sarah Mansfield") | Privacy / Security Standard v1.5 Section 11: "AI receives minimal necessary context" + general data-minimization | Display name shortened to `Sarah M.` via `shortCustomerName()`. Avatar shows initials only. Contact (email/phone) remains in the row because the owner must reach the customer. | `BIZPILOT_SECURITY_PRIVACY_COMPLIANCE_STANDARD_v1.5.md` Section 11 |
| Founder admin showing live cross-tenant data | Backend RLS Standard v1.5 Section 3 + Vendor Independence Section 13 | Page renders with single-tenant accessible data + `TBD` placeholders and a `Not owner-facing` badge. Real cross-tenant aggregation requires a founder-only RLS policy first. | `BIZPILOT_BACKEND_DATABASE_RLS_STANDARD_v1.5.md` Section 3 |
| 7+ owner profile fields (phone, website, languages, response hours ...) | Engineering Standard v1.5 Section 3 + Vendor Independence Section 7: SQL-first migrations only | Identity fields without a column today appear as a separate "Roadmap fields" card with `Phase 18B` badges and disabled CTAs. The visual matches the index without unauthorized schema growth. | `BIZPILOT_ENGINEERING_STANDARD_v1.5.md` Section 3 |
| Hero card with strong gradient + glow | Strategic Alignment v1.6 Section 6: "Operational Calm UX ... no heavy gradients, no glow spam" | Hero uses two soft radial accents (<=18% opacity) on `--dash-surface` - calm but distinctive. No box-shadow glow. | `BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md` Section 6 |
| Recent Activity feed mixing system + customer messages | Privacy Standard v1.5 Section 11 (no raw customer content in logs) | Feed shows lead identifier + summary line only. No raw customer message text is rendered. | `BIZPILOT_SECURITY_PRIVACY_COMPLIANCE_STANDARD_v1.5.md` Section 11 |
| Older docs freeze major feature scope | Owner 2026-05-26 direction: expand the project through owner-controlled feature levels | Scope can expand when the feature is entitlement-backed, visible in Settings, guide-backed, and validated. Disabled/planned features still must not look active. | `BIZPILOT_FEATURE_ENTITLEMENT_AND_GUIDE_STANDARD_v1.0.md` |

---

## 12. Definition of Done for a new page

A new dashboard route is considered design-system-aligned when:

- It mounts under `app/(dashboard)/...` so it inherits `DashboardShell`
- It has exactly one `PageHeader` at the top
- All chrome uses `--dash-*` tokens (no `bg-white / border-zinc / text-zinc / bg-slate / text-slate`)
- Lists/tables use `grid-cols-[minmax(0,1fr)_...]` and have no `min-w-[...]` on tables/rows
- Customer names use `shortCustomerName()` and avatars use `<Avatar>`
- Forms use `inputClass / textareaClass / labelClass / buttonClass / primaryButtonClass`
- Semantic colors include `dark:` modifiers
- Empty / loading / error states exist
- Sticky right rails use `xl:sticky xl:top-[92px]`
- Any new feature is backed by entitlement/level state, Settings visibility, visual guide, text guide, and validation evidence before it is treated as active

---

## 13. Maintenance

When the approved prototype changes or a new conflict appears with an older standard, this document is updated **before** the implementation lands. Older standards are not edited; the conflict register at Section 11 records the decision so future contributors understand both sides.
