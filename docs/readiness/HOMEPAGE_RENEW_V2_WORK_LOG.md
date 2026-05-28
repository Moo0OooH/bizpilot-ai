# Homepage Renew v2 - Work Log

**Project:** BizPilot AI
**Document Type:** Work log for homepage rebuild (full redesign)
**Status:** In progress
**Branch:** `homepage-renew-v2` (off `main` at `671b5ea`)
**Owner:** MoOoH
**Started:** 2026-05-27
**Last Updated:** 2026-05-27

---

## 1. Purpose

Full rebuild of the public homepage `/` (`https://bizpilo.com/`) with:

- A scalable, standard-conforming layout (1280/1440/1920 desktop + 390 mobile).
- Marketing-driven copy and information hierarchy informed by competitor research and cleaning-business buyer psychology.
- Preserved product scope: cleaning-first Quote Recovery Command Center, owner-reviewed AI drafts, manual copy/send, no auto-send, no booking/invoice/calendar/SMS/WhatsApp claims, no full CRM language.
- EN + fr-CA copy parity through the existing `lib/i18n/home-copy.ts` dictionary.
- Light future-verticals teaser to support broader curiosity without breaking cleaning-first focus.

This rebuild **does not** add new product features, change product scope, or expand customer-facing claims. It only changes how the homepage presents the existing product.

## 2. Constraints (carried forward from canonical docs)

- `docs/product/BIZPILOT_HOMEPAGE_AND_VISUAL_THEME_STANDARD_v1.0.md` defines the design system tokens, container max width (1200px), button heights (44px primary), and copy guardrails.
- `docs/product/BIZPILOT_DESIGN_SYSTEM_SPEC_v1.0.md` defines the typography scale and color tokens.
- `docs/BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md` locks the active positioning as Quote Recovery Command Center for Cleaning Businesses.
- `docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v1.0.md` blocks any new claims that imply auto-send, booking, invoicing, calendar sync, SMS/WhatsApp automation, Instagram API, or full CRM.
- `docs/business/PILOT_TERMS_DECISION_GATE.md` defines staged pricing (customers 1-5 free, 6-20 $149+$49, after 20 $199+$79).
- No production deploy or `main` push without explicit owner approval per `PHASE_21_PILOT_APPROVAL_GATE.md`.

## 3. Workstream

| # | Task | Status | Notes |
| --- | --- | --- | --- |
| 1 | Explore repo + read current homepage | Completed | `app/page.tsx`, `components/public/marketing-ui.tsx`, `lib/i18n/home-copy.ts` reviewed. |
| 2 | Create branch + start work log | Completed | `homepage-renew-v2` off `main@671b5ea`. |
| 3 | Market research (competitors, copy patterns) | Pending | Jobber, Housecall Pro, GoHighLevel, ServiceTitan, ZenMaid, Maidily, ZenMaid, BookingKoala. |
| 4 | Design plan (structure + copy + scaling) | Pending |  |
| 5 | Implement new homepage | Pending |  |
| 6 | Validation (lint, typecheck, build, smoke) | Pending |  |
| 7 | Commits + finalize work log | Pending |  |

## 4. Git Commit History

Commits will be appended here as work progresses.

| # | SHA | Subject | Files touched | Notes |
| --- | --- | --- | --- | --- |
| - | (initial) | docs: start homepage renew v2 work log | `docs/readiness/HOMEPAGE_RENEW_V2_WORK_LOG.md` | Branch baseline. |

## 5. Files Added / Edited

This section is filled as each commit lands. New files marked `[+]`, edited files marked `[~]`, deleted files marked `[-]`.

| Path | Change | Reason |
| --- | --- | --- |
| `docs/readiness/HOMEPAGE_RENEW_V2_WORK_LOG.md` | `[+]` | This work log file. |
| `docs/readiness/HOMEPAGE_RENEW_V2_PREVIEW.html` | `[+]` | Self-contained static preview of the new homepage design (open in browser before porting to Next.js). |

## 6. Market Research Findings

### Hero / Landing best practices for 2026

- Lead with **clarity over cleverness**: one outcome-driven headline, one primary CTA, one secondary.
- **Static heroes win**: carousels are conversion killers in 2026 (most users ignore slides 2 and 3).
- **Split-screen** layout works well for service businesses (copy left, product visual right).
- Hero should occupy roughly **60-100% of desktop viewport**, 50-70% mobile.
- **Trust signals above the fold** (logo strip, usage stat, or testimonial quote) raise conversion by a median 37%.
- **Measurable outcomes in headlines** convert better than generic value props ("12x Faster", "47 seconds", "67% ROI").
- **Forms with <4 fields** convert 120% better than 11-field forms.
- **Embedded product previews / video** in hero is the 2026 trend - users want to see how it works.
- **Core Web Vitals**: LCP <2.5s, INP <200ms, CLS <0.1.

### Competitor positioning (Jobber / Housecall Pro / ZenMaid)

- **Jobber** is a polished generalist for small home-service businesses.
- **Housecall Pro** is heavier all-in-one field service - dispatching, on-site quoting, payment.
- **ZenMaid** is maid-specific - speaks maid service language naturally.
- **All three serve *after* the booking** (scheduling, dispatch, invoicing). None focus on the *pre-quote response gap* that BizPilot owns.

### Cleaning-business pain (validated direction)

- Customers expect DM replies in **under 30 minutes**.
- DMs often **stay unseen** in the Instagram "Requests" tab.
- Cleaning owners manage messages **reactively**, not strategically.
- Quote requests are commonly **incomplete** (size, access, date, frequency missing).
- Most cleaning teams have **no structured intake** - leads come as raw chat messages.

### Implications for our homepage

1. Keep one clear primary CTA per region; reduce CTA noise from the current design.
2. Lead the hero with a benefit-driven headline + a real dashboard mock (not abstract illustrations).
3. Add **trust signals above the fold** ("No auto-send", "Owner-reviewed AI", "Built for Montreal teams").
4. Add a **pricing section on the homepage** (currently missing) - shows founder pilot is free and the path forward is paid.
5. Add an **FAQ section** addressing the 6-8 most common cleaning owner objections (Jobber/HCP comparison, AI sending, CRM concerns, integrations, privacy, cancellation).
6. Add a **subtle future-verticals teaser** to support curiosity without breaking cleaning-first focus.
7. Keep the **interactive 7-step demo** - it is the strongest existing asset and proves the workflow tab-by-tab.

## 7. Design Plan

### Final section structure (13 visible regions, top to bottom)

1. **Preview banner** (preview file only - not in production).
2. **Sticky header**: brand + nav + lang toggle + sign-in + primary CTA.
3. **Hero**: badge eyebrow + benefit headline + 1-paragraph sub + 2 CTAs + 3 trust bullets + product mockup right.
4. **Recovery snapshot strip**: 4 KPIs (12 organized / 8 drafted / 3 at-risk / 0 auto-send) - immediate proof of value pattern.
5. **Pain story**: 5-step narrative of how a cleaning lead is actually lost (you finish job → check IG late → customer already left → ...).
6. **Leak map**: 4 problem cards (slow reply, inbox chaos, missing info, quiet loss).
7. **Recovery loop**: 4 horizontal steps - Capture → Organize → Draft → Recover.
8. **Live workflow demo**: 7-step interactive tabbed walkthrough.
9. **Quote Recovery Desk mockup**: 3-column dashboard preview (queue / draft desk / actions).
10. **Before / After**: messy DM versus organized lead with recovered details.
11. **Pricing snapshot**: 3 cards (Founder Pilot free / Starter $149+$49 / Pro $199+$79) - opens path to /pricing.
12. **Future verticals teaser strip**: light "Cleaning first, then car detailing / salon / home services" chip row.
13. **FAQ**: 8 accordion questions covering common cleaning-owner objections.
14. **Final CTA band**: re-pitch + 2 buttons + 3 assurances.
15. **Footer**: brand, product/business/trust/language link groups, copyright.

### Scaling & breakpoints

- **Container**: `max-width: 1200px`, padding `20px` (mobile) / `24px` (>=640px).
- **Acceptance breakpoints**: 390px, 768px, 1024px, 1280px, 1536px, 1920px.
- **Hero scaling**: H1 36px → 40px → 48px → 54px across mobile → 1280px.
- **Section padding**: 36px mobile → 56px desktop (tight sections 28px).
- **No horizontal overflow at any breakpoint** (`overflow-x: hidden` on body as safety).
- **100% browser zoom** is the acceptance baseline.

### Tokens & components (matches existing project)

- Color tokens identical to `components/public/marketing-ui.tsx::marketingTone`.
- Background gradient identical to `marketingBackground`.
- Primary button: 44px height, 10px radius, teal→emerald gradient, `#03130C` text.
- Secondary button: 44px height, 1px border, transparent translucent background.
- Card radius: 16-22px. Major panel radius: 22-24px. Badge radius: full.
- Typography: Geist Sans (with system fallbacks in preview). Display 40-54px / Section 28-36px / Body 13-16px / Meta 10-12px uppercase.

### Copy direction (cleaning-specific, owner-facing)

- Lead with `Stop losing cleaning jobs one delayed reply at a time.`
- Always show `No auto-send. Ever.` near any AI mention.
- Use real cleaning vocabulary: `move-out clean`, `bedrooms`, `parking`, `access details`, `square footage`.
- Avoid: `AI platform`, `automation suite`, `operating system`, `CRM` (except in the FAQ where we clarify why we are *before* CRM).
- Avoid: `sent`, `booked`, `dispatched`, `invoice`, `calendar` (in product claim copy).

### Strict guardrails carried into copy

- No language implying auto-send, booking, invoicing, calendar sync, SMS/WhatsApp/Instagram API automation.
- Pricing copy mirrors `docs/business/PILOT_TERMS_DECISION_GATE.md` (Founder Pilot free for first 1-5, then $149+$49 customers 6-20, then $199+$79).
- "Manual copy/send only" and "Owner-reviewed AI" appear in hero trust strip, demo system view, FAQ, and final CTA.
- Future verticals teaser is light and does not promise dates.

## 8. Implementation Notes

### Preview build

- Single self-contained file: `docs/readiness/HOMEPAGE_RENEW_V2_PREVIEW.html`.
- All CSS inline, no external dependencies (no CDN fonts, no external images).
- All icons are inline SVG paths matching the existing `MarketingIcon` set.
- One small JS block for the language toggle.
- No localStorage, no fetch, no analytics. Pure static preview.

### Preview iteration log

| Version | Date | Change | Reason |
| --- | --- | --- | --- |
| v1 | 2026-05-27 | First preview: 13 sections (dark theme), 7-step interactive demo embedded, multiple product mocks. | Initial design based on competitor research + existing canonical docs. |
| v2 | 2026-05-27 | Cut to 6 sections, hybrid theme (dark hero + light below), 3 alternating step rows with focused visuals. | Owner feedback: page was repetitive, crowded, NASA-cockpit feeling. |
| v3 | 2026-05-27 | Single dark theme throughout, compact sizing (H1 32-48px, body 14-15px, section padding 64px), single accent color (teal only), 3-column horizontal How-it-works (no alternating rows), final CTA inlined inside FAQ section. 5 sections + slim header/footer. | Owner feedback: hybrid sizes mismatched, too many colors, too chunky, too much scroll. Needs standard modern SaaS compact look. |

### Port plan (after preview approval)

When the user approves the preview, the implementation will:

1. Update `lib/i18n/home-copy.ts` to add new namespaces:
   - `pricing` (3 tier cards + future verticals strip).
   - `faq` (8 Q&A items).
   - extend existing `hero`, `painStory`, `problem`, `recoveryFlow`, `commandCenter`, `beforeAfter`, `finalCta`, `trust` with refined copy if needed.
2. Extract reusable sections into `components/public/home/`:
   - `home-hero.tsx`
   - `home-snapshot.tsx`
   - `home-pain-story.tsx`
   - `home-leak-map.tsx`
   - `home-recovery-loop.tsx`
   - `home-command-center.tsx`
   - `home-before-after.tsx`
   - `home-pricing-snapshot.tsx`
   - `home-future-verticals.tsx`
   - `home-faq.tsx`
   - `home-final-cta.tsx`
3. Reduce `app/page.tsx` to a simple composition of the above plus the existing `InteractiveCleaningDemoSection`.
4. Keep `MarketingHeader` / `MarketingFooter` as-is; add `Pricing` link to the footer nav already present.
5. FAQ is implemented with native `<details>/<summary>` for accessibility (no client JS needed except for the demo).
6. Add EN + fr-CA copy parity in one PR so the language toggle keeps working everywhere.

## 9. Validation Results

To be populated after task #6 (post-port).

### Preview pre-validation (static HTML)

- File exists at `docs/readiness/HOMEPAGE_RENEW_V2_PREVIEW.html` (open in browser).
- Manual breakpoint QA expected: 390px, 768px, 1024px, 1280px, 1920px (owner to spot-check before approval).
- Demo step navigation works via `Next` / `Previous` and tab clicks.
- FAQ accordion uses native `<details>`; keyboard-accessible.
- Language toggle is visual only in this static preview (no real i18n switch).

## 10. Open Questions / Risk Notes

- Production deploy requires explicit owner approval; this branch is not yet pushed.
- Existing `app/page.tsx` is the "frozen visual reference" per docs - this rebuild replaces it with a new reference, but the per-page rule "do not change `/` to make other pages fit" still applies after the rebuild.
- Old hero illustration code in `HeroProductScene` is large (~140 lines inline JSX); the rebuild will extract reusable sub-components to reduce file size and improve scaling.
