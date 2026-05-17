# BizPilot Homepage and Visual Theme Standard v1.0

**Status:** Active  
**Last updated:** 2026-05-17  
**Applies to:** Marketing homepage, dashboard shell, public quote pages, auth pages

## 1. Approved Brand Direction

BizPilot is a calm lead recovery workspace for cleaning businesses. The product
should feel trustworthy, operational, focused, and premium. It should help an
overwhelmed owner feel that quote requests are organized, replies are easier,
and follow-up is no longer slipping away.

BizPilot must not feel like a crypto interface, neon AI toy, generic CRM,
enterprise admin console, booking system, invoice product, or broad automation
suite.

## 2. Approved Color Tokens

Use the following visual system as the active direction:

- Page dark base: `#080D12`
- Secondary background: `#0D1520`
- Elevated background: `#111D2A`
- Card surface: `#0F1A24`
- Elevated card surface: `#13202E`
- Subtle border: `rgba(255,255,255,0.07)`
- Medium border: `rgba(255,255,255,0.13)`
- Strong border: `rgba(255,255,255,0.18)`
- Primary text: `#EEF2F6`
- Secondary text: `#7A90A4`
- Muted text: `#435566`
- Primary emerald: `#00D084`
- Primary hover: `#00A868`
- Emerald background: `rgba(0,208,132,0.08)`
- Emerald border: `rgba(0,208,132,0.24)`
- Warning / at-risk: `#FFAB00`
- Warning background: `rgba(255,171,0,0.10)`
- Danger / urgent: `#FF4757`
- Danger background: `rgba(255,71,87,0.08)`
- Warm loss accent: `#E8D5B0`
- Blue accent: `#4FA8FF`
- Blue background: `rgba(79,168,255,0.10)`

Implementation rule: page-level styling should inherit from semantic CSS tokens
before using literal colors. Global brand tokens use `--biz-*`; dashboard-scoped
tokens use `--dash-*`. Changing the brand palette should mostly require updates
to `app/globals.css`, not rewriting individual pages.

Use tokens by role:

- `--biz-*`: brand and public marketing surfaces.
- `--dash-*`: protected dashboard surfaces, controls, text, and status shells.
- Page-specific business branding may influence public quote buttons and borders,
  but the surrounding structure should still use BizPilot typography, spacing,
  borders, and neutral surface logic.

## 3. Color Usage Rules

Emerald is reserved for primary actions, active states, selected navigation,
success confirmations, and healthy system status. Do not use emerald as broad
decoration.

Use mature emerald. Primary CTA and selected states can carry emerald;
supporting dots, icons, and glows should be muted and sparse.

Amber is reserved for at-risk leads, follow-up risk, or time-sensitive caution.

Red is reserved for urgent, blocked, failed, or high-risk states.

Warm loss accent is reserved for emotionally meaningful loss messaging, such as
the homepage headline phrase "your competitor just closed." Do not use it as a
general beige theme.

Violet is reserved for subtle AI-assisted status only when needed. It is not the
brand color and must not dominate the interface.

Avoid heavy gradients, neon glow, purple-heavy branding, and decorative effects
that make BizPilot feel less operational.

## 4. Elevation Logic

Dark UI quality comes from tonal layering first and shadows second:

- Page background is the deepest navy.
- Hero and dashboard preview shells are lifted slate/navy.
- Cards sit on elevated surfaces with subtle borders.
- Priority or active panels receive slightly stronger borders or softer accent
  fills.
- Shadows should be quiet and directional. In dark mode, do not rely on shadow
  alone; raise the surface color slightly.

Avoid flat near-black slabs, large black panels, and glassmorphism effects that
make the product feel speculative instead of operational.

## 5. Page Mood Guidance

Marketing homepage:

- Premium dark navy/slate base.
- Subtle depth and radial atmosphere are allowed.
- Pain-first, conversion-focused, and easy to scan at 100% zoom.
- Dashboard preview should look believable and operational, not like a fake SaaS
  illustration.
- Preserve clear tonal levels: deepest page background, lifted hero/dashboard
  surfaces, elevated cards, then slightly stronger active or priority states.
- Atmospheric lighting must stay soft: weak navy/emerald radial light, restrained
  shadows, no neon or cyberpunk glow.

Dashboard:

- Darker, calmer, and less decorative than marketing.
- Prioritize attention, leads, next actions, and owner review.
- Avoid KPI overload and enterprise dashboard density.
- Light/dark mode may exist, but status colors must keep the same meaning.
- Dashboard cards, buttons, fields, topbar, and shell surfaces should inherit
  from `--dash-*` tokens so light/dark themes stay aligned.

Quote/auth pages:

- Clean, trustworthy, and simple.
- These pages can remain neutral or light where appropriate.
- Do not accidentally apply heavy dashboard dark styling to customer-facing
  quote pages or auth pages.
- Even when light, they must use the same brand logic: slate typography, subtle
  borders, mature emerald actions, restrained shadows, and compact spacing.

## 6. Homepage Information Architecture

The active homepage structure is:

1. Hero: pain-first positioning, primary CTA, trust row, and dashboard proof.
2. Soft proof strip using non-absolute operational benefits.
3. Why cleaning businesses lose leads.
4. What BizPilot handles.
5. Before BizPilot / After BizPilot transformation.
6. How BizPilot works.
7. Sample or verified customer story only.
8. Simple MVP pricing.
9. Final CTA.
10. Minimal footer.

Do not add large pricing systems, extra charts, enterprise feature blocks, or
unrelated marketing sections before pilot validation.

## 7. Above-The-Fold Rules

The first viewport should communicate:

- The specific pain: cleaning quote requests are being lost.
- The product category: lead recovery workspace for cleaning businesses.
- The primary action: Start Recovering Leads.
- A believable operational preview of what the owner will use.

The hero headline remains:

> Every unanswered quote is a job your competitor just closed.

The primary CTA remains:

> Start Recovering Leads

## 8. Density And Scannability Rules

At 100% browser zoom, the homepage should feel compact and professional. Use
section spacing that gives air without creating unnecessary scroll length.

Guidance:

- Prefer compact folds over tall marketing blocks.
- Keep cards proportional to their content.
- Use tight but readable line lengths.
- Avoid oversized decorative panels.
- Keep nav spacing intentional and restrained.
- Make the page scannable in roughly 5-8 seconds.
- Desktop hero headline should remain strong but not overpower the dashboard
  proof. The preview supports the message; it should not become the hero.
- CTA rhythm should be clear: primary action first, secondary demo action quieter.

## 9. Icon Style Rules

Icons should be simple line icons with consistent stroke weight, rounded caps,
and restrained containers. Use icons to clarify workflow or status, not as
decoration.

Homepage icon containers:

- Small, lifted, and consistent.
- Emerald-tinted only when indicating the primary workflow or healthy action.
- No playful illustrations, stock SaaS icon packs, or oversized decorative SVGs.

Dashboard icon/initial containers:

- Compact.
- Status-specific.
- Must not make the UI feel like a game, crypto tool, or analytics toy.

## 10. Dashboard Preview Realism

Homepage dashboard previews should use operational microcopy that a cleaning
business owner recognizes:

- Waiting reply age.
- New quote request timestamps.
- Follow-up due windows.
- Missing info hints.
- Owner review required for AI drafts.

Avoid fake enterprise analytics, generic vanity metrics, complex charts, or
anything that implies booking, auto-send, invoices, or calendar automation.

Customer proof must be labeled honestly. If a quote, metric, or story is not
verified customer evidence, label it as sample, demo, or example copy, or use
softer operational wording instead of hard claims.

## 11. CTA Hierarchy

Primary CTA:

- Use mature emerald.
- Reserved for the main action: Start Recovering Leads, Get Early Access, Review,
  Open Lead Desk, or Save when contextually primary.

Secondary CTA:

- Border/surface treatment.
- Quiet, useful, and visually subordinate.

Tertiary actions:

- Neutral text or ghost buttons.
- No unnecessary emerald.

## 12. Before / After Rationale

The transformation section exists to show the Magic Moment before the owner
starts a trial:

- Before: messy quote message, missing details, scattered DMs, no follow-up.
- After: structured lead, service type identified, property details captured,
  preferred date visible, AI reply ready, and a clear next action.

This section should make the owner think:

> Finally, I can organize quote requests without chaos.

## 13. Visual Avoid List

Avoid:

- Crypto-like dark neon palettes.
- Purple-heavy AI branding.
- Abstract startup hero art.
- Generic CRM positioning.
- Over-animated sections.
- Enterprise reporting dashboards.
- Booking, invoice, calendar, SMS, WhatsApp, or marketplace cues.
- Feature overload before customer validation.
