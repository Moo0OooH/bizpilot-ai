# BizPilot AI - Final Public Site Standard v1.0

**Status:** Active canonical pre-dashboard public-site standard  
**Owner:** MoOoH  
**Last updated:** 2026-07-11
**Applies to:** Marketing, legal, auth, public quote, and pre-dashboard report shells  
**Supersedes when conflicting:** older public dark-homepage direction, public light-only/no-toggle guidance, wide segmented header utilities, two-viewport QA guidance, stale Pilot long-form preview guidance, and incomplete EN/fr-CA public-copy guidance.

## 1. Product Truth

BizPilot AI is manual-first, cleaning-first, owner-controlled lead recovery for cleaning businesses.

AI drafts. The owner reviews, edits, copies, and sends manually.

Do not claim or imply auto-send, SMS or WhatsApp automation, booking confirmation, invoicing, a full CRM, guaranteed revenue, active multi-industry support, or real customer data readiness before explicit approval.

## 2. Theme Standard

- First-time visitors resolve to Light, including visitors whose operating system is dark.
- Supported preferences are Light, Dark, and Use device setting.
- Public marketing uses one compact sun/moon theme button with a menu. Do not show a wide "System Light Dark" segmented control.
- Auth pages do not show visible theme controls.
- Public quote pages inherit the active theme shell behavior but do not show a theme control.
- Dashboard and founder admin shells may continue to use the shared theme preference where already wired.
- Dark theme must keep readable public preview cards, elevated surfaces, form controls, borders, focus rings, and manual-copy/send affordances.

## 3. Responsive And Device Standard

The active viewport matrix is:

```text
320x568, 360x800, 390x844, 430x932, 844x390,
768x1024, 1024x768, 1280x720, 1366x768,
1440x900, 1920x1080
```

Required behavior:

- No ordinary public, auth, or quote route may create page-level horizontal overflow.
- Do not use global `overflow-x: hidden` to mask layout defects.
- Marketing cards, demo panels, pricing cards, legal content, and FAQ content use natural page scroll, not nested vertical scroll.
- Header expansion is content-fit; it collapses before nav or utility controls wrap.
- Homepage service grid: 3x2 desktop, 2x3 tablet, 1x6 mobile.
- Features grid: 3x2 desktop, 2x3 tablet, 1x6 mobile.
- Trust route uses three primary pillars, with technical notes lower on the page.
- Demo route uses four owner-controlled chapters with no autoplay, forced swipe, or nested scroll.

## 4. EN/fr-CA Content And Glossary Standard

English and Canadian French are supported on public marketing and legal routes.

Requirements:

- `?language=fr-CA` sets the public route language and document language to `fr-CA`.
- Public metadata, canonical URLs, hreflang alternates, Open Graph locale, H1 text, body copy, nav labels, CTA labels, legal copy, and quote labels must be localized.
- Route switching keeps the equivalent canonical path.
- No missing dictionary keys, raw internal keys, or known English body copy should appear on fr-CA public routes.
- Internal links stay in the same tab. Official external references may open a new tab only with `target="_blank"`, `rel="noopener noreferrer"`, an icon, and accessible new-tab warning copy.

Glossary anchors:

| English | fr-CA direction |
| --- | --- |
| lead recovery | recuperation de prospects |
| quote request | demande de soumission |
| cleaning business | entreprise de nettoyage |
| owner-reviewed AI draft | brouillon d'IA revise par le proprietaire |
| manual copy/send | copie et envoi manuels |
| founder pilot | pilote fondateur |
| use device setting | utiliser le reglage de l'appareil |

## 5. Header And Navigation Standard

Desktop nav order:

```text
Features, Cleaning, Trust, Demo, Pricing, Pilot
```

Header requirements:

- Brand remains "BizPilot AI".
- Optional tagline is "Lead recovery for cleaning businesses" and is complete or hidden, never truncated.
- Sign in is secondary.
- Join founder pilot is the primary CTA.
- Language control is one compact EN/FR menu.
- Theme control is one compact icon button in the header.
- Compact menu supports keyboard use, Escape close, focus return, outside click, `aria-expanded`, and active route state.

## 5A. Research-Backed Hero And Page Pitch Standard

2026-07-11 research pass:

- Nielsen Norman Group homepage guidance says the homepage must act as an elevator pitch, communicate what the organization does at a glance, and make the unique value proposition clear in the hero space.
- CXL landing-page guidance emphasizes that visitors decide usefulness within seconds, so the first screen must answer what this is, whether it fits them, whether they can trust it, and what action comes next.
- Unbounce's 2026 landing-page examples summarize the conversion pattern as one clear goal, strong headline, trust/proof near the action, and reduced distractions.
- Figma's 2026 web-design trend guidance supports richer product scenes, thoughtful motion, dark/light personalization, accessibility, and progressive lead nurturing, but BizPilot must translate those ideas into manual-first quote recovery rather than autonomous automation.
- Baymard's 2025 benchmark shows homepage/navigation UX remains weak on many desktop and mobile sites, so compact navigation and route-to-route clarity are conversion work, not decoration.
- Google Search Central and web.dev reinforce useful, organized content plus Core Web Vitals: fast loading, responsive interaction, and visual stability.
- WCAG 2.2 resize-text guidance requires text and controls to survive 200% text scaling without clipping, truncation, or obscuring content.

Public hero requirements:

- Every primary public marketing route must open with a clear role-specific pitch: audience, pain, manual-first remedy, proof or guardrail, and one primary next action.
- The homepage hero must be the strongest product signal: copy plus a real product-scene mockup above the fold, not a generic SaaS splash.
- Supporting routes should reuse a consistent page-hero pattern with a compact proof rail or product-signal panel when the route is part of the main public site.
- Proof near CTAs must use approved evidence only: manual workflow boundaries, pilot learning metrics, source context, readiness gates, and product capabilities already implemented or explicitly gated.
- Do not use fake testimonials, fake revenue, fake conversion rates, fake customer logos, fake analytics, or unsupported AI/autonomous claims.
- Dynamic visual polish is allowed only when it improves comprehension: product-scene boards, signal flows, compact status rails, restrained hover/focus states, and bilingual-safe sizing.
- Trend-led visuals that create clutter, dark patterns, performance risk, or unclear product scope are not allowed.
- The first viewport must hint at the next section on mobile and desktop, and no route may rely on oversized hero height that hides the product story below.

## 6. Pilot Conversion-State Specification

The Pilot route must not render a long fake, disabled, or non-submitting form.

Allowed states:

- If no secure approved endpoint exists, show a concise copy-template conversion card and clear "what happens next" expectations.
- If an approved endpoint exists later, a short live form may be added only after the endpoint, storage, privacy, spam, and support workflow are approved.
- Do not invent pricing, promise acceptance, or imply automated onboarding.

## 7. Auth, Quote, And Report Shell Standard

Auth:

- Use a focused AuthShell.
- No visible language or theme controls.
- Sign-in primary action is blue.
- Password visibility is accessible and does not use a decorative field icon.
- Autofill metadata and form labels remain compatible with password managers.
- Auth routes are noindex/nofollow.

Quote:

- Public quote remains mobile-first, customer-facing, and localized.
- Quote pages are noindex/nofollow.
- Customer language switching may remain.
- Do not change quote authorization, data flow, or submission behavior during public-site polish.

Report shells:

- Use shared semantic tokens.
- Do not communicate status by color alone.
- One intentional horizontal table scroll is allowed for real report tables; ordinary cards must not create nested vertical scroll.

## 8. QA Evidence Standard

Every future material public-site change should record:

- Commands run and pass/fail results.
- Routes tested.
- Locale matrix.
- Theme matrix.
- Viewport matrix.
- Overflow results.
- Keyboard/menu results.
- External link target/rel results.
- Metadata/sitemap/robots results.
- Lighthouse or equivalent local lab performance values where available.
- Screenshot/evidence paths under `docs/readiness`.

The Phase 10 evidence index is:

- `docs/readiness/FINAL_PRE_DASHBOARD_SITE_READINESS_2026-06-20.md`
- `docs/readiness/final-public-site-evidence-2026-06-20/`

## 9. Definition Of Done

The pre-dashboard public site is ready to freeze for dashboard work when:

- no P0 responsive or contrast defect remains,
- first-time sessions default to Light,
- explicit Dark remains usable,
- EN/fr-CA public copy and metadata are complete,
- header, language, and theme controls are compact and responsive,
- Pilot has no dead long form,
- auth/quote/report shells are consistent,
- synthetic quote smoke is honestly recorded,
- lint/typecheck/unit/build/smoke/UI matrix checks pass,
- deployed commit evidence is recorded.

This standard does not approve real customer data, paid pilot readiness, billing automation, or dashboard feature expansion.
