# BizPilot Homepage and Visual Theme Standard v1.1

**Status:** Active canonical visual standard
**Last updated:** 2026-05-24
**Applies to:** `/`, `/pricing`, `/admin`, `/auth/*`, `/quote/[slug]`, `/quote/[slug]/success`, and any new pre-dashboard or founder-facing page
**Source implementation:** `app/page.tsx`, `components/public/marketing-ui.tsx`, `app/admin/page.tsx`

## 1. Current Decision

The homepage design is accepted as the visual reference. Do not keep changing
`/` to make other pages fit. New or unfinished pages must adapt to the current
homepage theme, not the other way around.

The product remains:

- cleaning quote recovery first,
- owner-reviewed AI drafts only,
- manual owner copy/send only,
- founder-led pilot validation before feature expansion.

No visual design may imply booking, invoices, calendar automation, SMS/WhatsApp
automation, marketplace scope, auto-send, or autonomous AI.

## 2. Brand Mood

BizPilot should feel like a premium, calm recovery command center for cleaning
business owners. The tone is operational and trustworthy, not playful, not
generic SaaS, not enterprise analytics, and not crypto/neon.

The user should immediately understand:

- quote requests arrive from many channels,
- delayed replies cost real cleaning jobs,
- missing details are detected,
- AI drafts replies safely,
- the owner approves and sends,
- follow-up stays visible.

## 3. Active Color Tokens

Public marketing tokens live in `components/public/marketing-ui.tsx` as
`marketingTone`.

| Role | Token | Value |
| --- | --- | --- |
| Deep page base | `marketingTone.bg` | `#050B12` |
| Soft page base | `marketingTone.bgSoft` | `#07111C` |
| Primary text | `marketingTone.text` | `#F7FAFC` |
| Secondary text | `marketingTone.soft` | `rgba(247,250,252,0.76)` |
| Muted text | `marketingTone.muted` | `rgba(247,250,252,0.52)` |
| Faint line | `marketingTone.faint` | `rgba(247,250,252,0.18)` |
| Default border | `marketingTone.border` | `rgba(255,255,255,0.10)` |
| Strong border | `marketingTone.borderStrong` | `rgba(255,255,255,0.16)` |
| Surface | `marketingTone.surface` | `rgba(9,20,31,0.82)` |
| Strong surface | `marketingTone.surfaceStrong` | `rgba(12,25,38,0.96)` |
| Teal accent | `marketingTone.teal` | `#2DD4BF` |
| Emerald CTA | `marketingTone.emerald` | `#17D492` |
| Gold caution | `marketingTone.gold` | `#F6B84B` |
| Red danger | `marketingTone.red` | `#FF5F66` |
| Blue support | `marketingTone.blue` | `#54A7FF` |

Dashboard and admin pages should use `--dash-*` variables, but their dark theme
must visually align with these public tokens. Founder admin uses the dark
dashboard variables over the public `marketingBackground`.

## 4. Background And Gradients

Use the final public page background:

```text
radial-gradient(circle at 7% 7%, rgba(45,212,191,0.13), transparent 24rem),
radial-gradient(circle at 91% 2%, rgba(23,212,146,0.14), transparent 26rem),
radial-gradient(circle at 47% 38%, rgba(84,167,255,0.06), transparent 34rem),
linear-gradient(180deg, #07111C 0%, #050B12 52%, #04080E 100%)
```

Use gradients sparingly. They are allowed for:

- hero/product preview surfaces,
- suggested reply surfaces,
- final CTA surfaces,
- founder/admin priority panels.

Do not use random decorative blobs, heavy purple, or flat black slabs.

## 5. Suggested Reply Surface

The accepted premium reply gradient is:

```text
radial-gradient(circle at 96% 4%, rgba(226,232,240,0.24), transparent 10rem),
radial-gradient(circle at 88% 16%, rgba(246,184,75,0.18), transparent 9rem),
linear-gradient(135deg, #2A3033 0%, #1D252B 45%, #0E151D 100%)
```

Use this treatment only where the UI needs a special owner-reviewed AI reply or
high-confidence response-desk moment. Do not apply it to every card.

## 6. Typography

Font family:

```text
Geist Sans via --font-geist-sans, fallback Arial/Helvetica/sans-serif
Geist Mono via --font-geist-mono for code only
```

Current public scale:

| Use | Desktop | Mobile | Weight | Line height |
| --- | --- | --- | --- | --- |
| Hero H1 | 40px accepted desktop | 34px-36px | 900 | 1.08 |
| Major section H2 | 30px-36px | 28px-30px | 900 | 1.1-1.14 |
| Card title | 15px-18px | 14px-17px | 800-900 | 1.2-1.3 |
| Body | 13px-16px | 13px-15px | 400-700 | 1.55-1.75 |
| Meta/eyebrow | 10px-12px uppercase | 10px-11px | 800-900 | 1.1-1.2 |
| Buttons | 12px-13px | 12px-13px | 800-900 | compact |

Rules:

- Do not scale type with viewport width.
- Letter spacing is normal by default. Only uppercase meta labels use positive
  tracking.
- Large type is reserved for real page/section headers. Tool surfaces and cards
  use compact headings.

## 7. Layout And Sizing

Main public container:

```text
max-width: 1200px
mobile padding: 20px
tablet/desktop padding: 24px
```

Accepted QA baselines:

```text
desktop: 1280 x 720, no horizontal overflow
mobile: 390 x 844, no horizontal overflow
browser zoom: 100%
```

Section rhythm:

- Hero remains compact and should not require zooming out.
- Section padding is usually `py-7` to `py-10` on public pages.
- Dense operational panels may be 440px-560px tall if they contain real UI.
- Avoid repeated same-size cards in consecutive sections. Vary structure with
  snapshot strips, workflow rails, command panels, before/after panels, and CTA
  bands.

## 8. Radius And Card Rules

Current public UI uses:

```text
button radius: 10px
small row radius: 11px-13px
card radius: 14px-18px
large panel radius: 20px-24px
badge radius: full
```

Cards should feel lifted through surface tone, border, and restrained shadow.
Do not nest card inside card unless the inner item is a real repeated object
such as a lead row, form row, or response block.

## 9. Button Rules

Primary public CTA:

```text
height: 44px
background: linear-gradient(135deg, #2DD4BF 0%, #17D492 100%)
text: #03130C
radius: 10px
font: 13px / 900
```

Mobile header CTA may shorten to `Start`. Desktop header CTA remains
`Start free recovery`.

Secondary CTA:

```text
height: 44px
border: marketingTone.borderStrong
background: rgba(255,255,255,0.035)
text: marketingTone.text
```

Do not place more than one visually primary CTA in the same region.

## 10. Icon Rules

Use the line icons from `MarketingIcon` or the dashboard icon system. Icons:

- are outline only,
- use consistent stroke weight,
- sit in compact containers,
- support meaning rather than decoration.

No emoji in product UI.

## 11. Current Homepage Structure

The accepted homepage structure is:

1. Header with brand, nav, sign-in, and primary CTA.
2. Hero: cleaning pain, CTA pair, trust bullets, and outcome-first recovery desk preview.
3. Recovery snapshot strip.
4. Operational pain story: what a lost cleaning lead actually looks like.
5. Leak map: demand is not the problem, response chaos is.
6. One operational loop: capture, organize, draft, recover.
7. Live workflow demo: incoming request, missing info, draft, follow-up.
8. Quote Recovery Desk command-center mock.
9. Before/After recovery pass.
10. Pilot terms strip.
11. Final CTA band.
12. Minimal footer.

Do not add About, Blog, Contact, Features, Case Studies, or broad marketing
pages before pilot validation.

## 12. Admin And New Page Alignment

New pages like `/admin` must use the same visual language:

- dark base with public `marketingBackground`,
- `max-width: 1200px`,
- compact operational cards,
- teal/emerald primary accents,
- gold only for caution,
- red only for blocked/danger states,
- no fake analytics or customer-facing claims.

Founder admin is internal and must not appear in public nav. It can use dashboard
cards and forms, but the frame should match the final public theme.

## 13. Copy Rules

Approved public language should be direct and business-facing:

- "Stop losing cleaning jobs one delayed reply at a time."
- "Every delayed quote reply is a customer already comparing you to another cleaner."
- "The lead was warm. The reply was late."
- "Quote requests organized"
- "Replies drafted"
- "Leads at risk"
- "Auto-send messages: 0"
- "Owner-reviewed AI"
- "Manual copy/send only"

Avoid:

- internal phase names,
- "AI magic",
- fake customer proof,
- "sent" unless BizPilot actually sent a message,
- booking/invoice/calendar language.

## 14. Definition Of Done

A new page is visually aligned when:

- it uses the active tokens above,
- it fits 1280 desktop and 390 mobile with no horizontal overflow,
- it keeps 100% browser zoom as the acceptance baseline,
- it has a single clear primary action per region,
- it uses real product language,
- it does not expand product scope,
- it passes lint, typecheck, build, and relevant unit tests.
