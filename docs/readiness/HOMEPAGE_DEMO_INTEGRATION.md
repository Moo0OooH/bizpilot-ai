# Homepage Demo Integration Guide

**Project:** BizPilot AI
**Document Type:** Apply-it-yourself integration guide
**Status:** Reference — apply manually; project files remain untouched
**Owner:** MoOoH
**Last Updated:** 2026-05-25

---

## What this guide covers

Two changes to the public homepage (`app/page.tsx`):

1. **Add the interactive 7-step cleaning demo** — replaces or supplements the
   existing `WorkflowDemoSection` (tab-based CSS radio trick) with a proper
   React client component that steps through a realistic cleaning lead scenario.

2. **Hero above-the-fold fix** — reduces vertical padding and trims the
   HeroDesk card so the hero is fully visible at 1080 px without scrolling.

The new component lives at:
`components/public/interactive-cleaning-demo.tsx` (already written — new file, no existing file was changed).

---

## Change 1 — Add the demo import

In `app/page.tsx`, add this import near the top (after the existing imports):

```tsx
import { InteractiveCleaningDemoSection } from "@/components/public/interactive-cleaning-demo";
```

---

## Change 2 — Wire the demo into the page JSX

In the `HomePage` component (bottom of `app/page.tsx`), find the section
that renders `<WorkflowDemoSection>` and the sections around it:

```tsx
<RecoveryFlowSection copy={copy.recoveryFlow} />
<WorkflowDemoSection copy={copy.workflowDemo} />
<CommandCenterSection copy={copy.commandCenter} />
```

**Option A — Replace the tab demo with the interactive demo:**

```tsx
<RecoveryFlowSection copy={copy.recoveryFlow} />
<InteractiveCleaningDemoSection language={language} />
<CommandCenterSection copy={copy.commandCenter} />
```

**Option B — Keep both (tab demo stays; interactive demo is added after):**

```tsx
<RecoveryFlowSection copy={copy.recoveryFlow} />
<WorkflowDemoSection copy={copy.workflowDemo} />
<InteractiveCleaningDemoSection language={language} />
<CommandCenterSection copy={copy.commandCenter} />
```

Option A is recommended — the interactive component covers the same ground
as the tab demo but is more engaging and accessible.

---

## Change 3 — Hero above-the-fold fix (padding)

In `app/page.tsx`, find `HeroSection`:

```tsx
function HeroSection({ copy }: Readonly<{ copy: HomeCopy }>) {
  return (
    <section className="px-0 pb-8 pt-8 sm:pb-10 sm:pt-10">
```

Change the `className` to reduce top/bottom padding:

```tsx
    <section className="px-0 pb-4 pt-5 sm:pb-5 sm:pt-6">
```

This saves ~64 px of vertical space and keeps the hero visible at 1080 px.

---

## Change 4 — HeroDesk card height reduction (optional but recommended)

The `HeroDesk` component renders 6 journey tiles and 4 lead rows, making the
card roughly 700–760 px tall. At 1080 px viewport that pushes the hero below
the fold even with the padding fix. Two targeted trims:

### 4a — Journey grid: show 3 tiles instead of 6

Find in `HeroDesk` (around line 167 in `app/page.tsx`):

```tsx
<div className="mb-3 grid gap-2 sm:grid-cols-3">
  {copy.journey.map((item, index) => (
```

Change `mb-3` → `mb-2` and slice to 3 items:

```tsx
<div className="mb-2 grid grid-cols-3 gap-2">
  {copy.journey.slice(0, 3).map((item, index) => (
```

Also on the individual tiles, change `min-h-[64px]` → `min-h-[52px]`:

```tsx
className="min-h-[52px] rounded-[10px] border px-3 py-2"
```

### 4b — Lead list: show 2 leads instead of 4

Find in `HeroDesk` (the lead list render, around line 191):

```tsx
<div className="grid gap-2.5">
  {copy.leads.map((lead) => (
    <LeadRow fromLabel={copy.fromLabel} item={lead} key={lead.customer} />
  ))}
```

Slice to 2:

```tsx
<div className="grid gap-2">
  {copy.leads.slice(0, 2).map((lead) => (
    <LeadRow fromLabel={copy.fromLabel} item={lead} key={lead.customer} />
  ))}
```

### 4c — Reply card: reduce internal spacing

In the reply card `div` (the `xl:grid-cols-[0.92fr_1.08fr]` panel), change:

```tsx
className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]"
```

to:

```tsx
className="grid gap-3 xl:grid-cols-[0.92fr_1.08fr]"
```

And change the reply text spacing from `space-y-2.5` → `space-y-2`:

```tsx
<div className="mt-2 space-y-2 text-[11px] leading-[1.75]" style={{ color: marketingTone.soft }}>
```

These four sub-changes together reduce HeroDesk from ~740 px to roughly
~460 px, comfortably fitting in a 1080 px viewport with the nav (74 px) and
the reduced hero padding.

---

## Change 5 — Nav link for the demo (optional)

The new demo section has `id="cleaning-demo"`. If you want to add a nav link
to it in the marketing nav, update `home-copy.ts` to add a `demo` key to
`HomeNavCopy` and wire it in `MarketingHeader`. Or simply update the existing
secondary CTA in the hero:

Find in `HeroSection`:

```tsx
<MarketingButton className="w-full px-4 min-[430px]:w-auto" href="#recovery-flow" variant="secondary">
  {copy.hero.secondaryCta}
</MarketingButton>
```

Change `href="#recovery-flow"` → `href="#cleaning-demo"`:

```tsx
<MarketingButton className="w-full px-4 min-[430px]:w-auto" href="#cleaning-demo" variant="secondary">
  {copy.hero.secondaryCta}
</MarketingButton>
```

---

## Professional points applied in the component

All of the following are baked into the interactive demo component:

| Point | Where applied |
| --- | --- |
| No auto-send | Visible in `safety` text of every step |
| No invented pricing | Explicit in steps 3 and 5 |
| Owner review gate | Step 4 (summary), step 5 (draft), step 6 (control point) |
| Manual copy/send only | Repeated in step 5 and 6 outcome/safety text |
| No booking promise | Step 3 safety text |
| Follow-up without automation | Step 7 — explicit owner choice |
| EN/FR bilingual | Full `FR_DEMO_COPY` mirrors every EN step |
| Accessible aria | `aria-live="polite"` on screen content, `aria-current` on active step button, semantic `<nav>` wrapper on sidebar |
| No localStorage in component | State via `useState` only — safe for Next.js SSR |
| `"use client"` directive | Required for `useState`/interactivity in Next.js App Router |

---

## Applying in one shot (summary)

```
1. File already written:
   components/public/interactive-cleaning-demo.tsx   ← NEW (no existing file changed)

2. In app/page.tsx — add import:
   import { InteractiveCleaningDemoSection } from "@/components/public/interactive-cleaning-demo";

3. In app/page.tsx — HeroSection className:
   "px-0 pb-4 pt-5 sm:pb-5 sm:pt-6"   (was pb-8 pt-8 sm:pb-10 sm:pt-10)

4. In app/page.tsx — HeroDesk journey slice:
   copy.journey.slice(0, 3)   + min-h-[52px]

5. In app/page.tsx — HeroDesk leads slice:
   copy.leads.slice(0, 2)

6. In app/page.tsx — replace WorkflowDemoSection in JSX:
   <InteractiveCleaningDemoSection language={language} />

7. Optional: hero secondary CTA href="#cleaning-demo"
```

No migration, no env change, no production SQL, no real customer data.
One new file + targeted edits to `app/page.tsx` only.
