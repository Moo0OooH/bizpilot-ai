<!--
 * ============================================================
 * File: docs/website-v4/CURRENT.md
 * Project: BizPilot AI
 * Description: Current public Website V4 product, editorial, design, and release contract.
 * Role: Separates implemented public-site source from local verification, CI, Vercel, and Production evidence.
 * Related:
 * - components/public/public-v3-page.tsx
 * - components/public/public-v3-page.module.css
 * - lib/i18n/public-v3-spec.ts
 * - docs/product/BIZPILOT_PREMIUM_OPERATIONS_ADDONS_v1.0.md
 * Author: MoOoH
 * Created: 2026-07-14
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Recorded the optional Premium Operations catalog, unquoted add-on pricing boundary, current runtime, and exact-candidate release gates.
 * ============================================================
 -->

# BizPilot Website V4 — Current Report

Date: 2026-07-22

Status: Historical Website V4 base evidence remains recorded; the Premium Operations public extension is implemented and exact-tree verified locally, while publication, Vercel, and live acceptance remain gated

Scope: public marketing, Auth GET states, Quote read/recovery states, and system 404/error surfaces; production data unchanged and no deployment performed by this update

## Product truth and approved bilingual message

The English and Canadian French copy is approved for the current product boundary.
Both languages communicate the same customer problem and solution:

- service-business owners, sales managers, and support teams receive vague questions through multiple customer touchpoints;
- BizPilot provides one Smart Intake Link that can be shared in those places;
- the link collects service-specific details and creates an organized request;
- AI prepares a cautious draft or follow-up question;
- a human reviews, edits, copies, and manually sends the response;
- no direct social inbox integration, automatic sending, invented price, or automatic booking is claimed.

Premium Operations is presented as an optional, separately enabled and paid add-on
family. Priority Workbench, Bulk Reply Review, and Availability Coordination extend the
owner workflow without changing its human-control boundary. A manager reviews grouped
reply drafts and copies each approved response manually. Availability blocks and conflict
suggestions remain internal coordination only; they do not create a public calendar,
promise availability, or confirm a customer booking.

Cleaning remains the first complete pilot workflow. The homepage may show Instagram,
WhatsApp, website, email, Google profile, QR code, or direct message as places to share
the link, never as connected inbox integrations.

## Information architecture

The retained public routes remain intentionally small:

`/`, `/features`, `/demo`, `/pricing`, `/pilot`, `/faq`, `/trust`, `/privacy`,
`/security`, and `/terms`.

No retired duplicate landing page was restored. The six supporting product routes now
share one implementation foundation but use separate editorial compositions. Legal pages
use an indexed reading shell instead of imitating marketing cards or hiding policy text.

## Final V4 design decisions

- Replaced the long first-fold promise with a concise outcome: scattered messages become
  requests the team can answer. Supporting copy now uses shorter sentences and one clear
  idea per paragraph in both English and Canadian French.
- Standardized the public scale around a 13–14px microcopy floor, 16–19px body copy,
  35–58px responsive display titles, 650–700 heading weights, and natural word wrapping.
- Introduced a warm off-white canvas, deep navy product surface, electric blue primary,
  teal control accent, and restrained coral/lime signals. Cards use quiet borders and
  shallow editorial shadows instead of generic pastel blocks.
- Rebuilt the logo lockup as a compact BizPilot AI wordmark with a signal-dot brand mark
  and the short supporting line “Smart requests. Human review.”
- Rebuilt the homepage product scene as a two-part message-to-request workspace. It keeps
  source messages readable, gives organized request fields enough width, and presents the
  review draft as the visual payoff instead of forcing content into three narrow columns.
- Uses 720px for card progression, 980–1024px for laptop hero splits, and 1180px for the
  full navigation and wide editorial grids, with short-viewport refinements where needed.
- Reduced the homepage renderer from seven repeated chapters to five: hero, problem,
  workflow plus outcomes, cleaning walkthrough, and a final control/pilot CTA.
- Gave every retained product route a visible bilingual editorial introduction and a
  distinct content composition: Product uses a numbered capability map, Demo uses an
  interactive stage navigator, Pricing uses staged cohort cards, Pilot uses a fit path
  and application console, FAQ uses a category index, and Trust uses a control chain.
- Uses every product-route introduction as a conversion surface: one route-specific
  explanation is paired with three compact proof points in both languages. This removes
  decorative empty space without enlarging titles or compressing the content cards.
- Gives the Demo's first stage a plain-language explanation of what is still unknown in
  the incoming message. Pilot fit criteria use a wide reading rhythm on desktop so each
  qualification point remains complete instead of wrapping through narrow card columns.
- Made the first Product capability the flagship benefit and separated human control
  from the repeated capability-card rhythm. Pricing keeps one active founder-cohort CTA
  with calmer future tiers and no repeated tier actions.
- Added a distinct Premium Operations catalog below the core Product capabilities and a
  compact clarification below the base Pricing tiers. Both surfaces identify the three
  add-ons, state that pricing and enablement are separate, and keep manual review,
  manual copy, no-auto-send, and internal-only availability boundaries visible.
- Aligned every public pilot CTA with `/pilot#application` and truthful copy that says
  the visitor is preparing/copying a request rather than submitting a hidden form.
- Grouped ten FAQ questions into three decision-oriented sections and rebuilt Trust as
  a four-stage control sequence followed by explicit operational boundaries and direct
  policy links.
- Rebuilt Privacy, Security, and Terms as open policy documents with a plain-language
  summary, sticky section index, visible numbered sections, evidence links, and localized
  dates. No policy content is hidden inside a generic accordion.
- Shortened long Canadian French hero lines and localized the remaining mixed-language
  pilot-price wording. The French homepage workspace stays stacked or selectively compact
  until enough width exists for a safe two-column scene.
- Kept the footer task-based and free of a redundant Sign-in link. No retired landing
  page or duplicate route was restored.
- Kept motion optional under `prefers-reduced-motion` and every layout free of nested
  scrolling or viewport-width traps.

## Reference audit

The redesign used current public SaaS patterns as directional references, not templates:

- Linear: compact navigation, strong hierarchy, and feature-led product story;
- Attio: large product UI as the main visual proof;
- Front: operational workflow clarity and customer-message context;
- Typeform: one clear intake action and low-cognitive-load progression;
- Intercom, Crisp, Trengo, and respond.io: category language and inbox/workflow comparison.

BizPilot intentionally does not reuse direct-inbox language from omnichannel products
because the current product is a shareable intake and reply workspace.

## Premium Operations public extension — 2026-07-22

- The existing Product and Pricing heroes are unchanged.
- Product now contains three responsive optional add-on cards with distinct priority,
  review/copy, and availability-coordination explanations.
- Pricing keeps the approved base pilot amounts unchanged. No dollar amount was invented
  for an add-on; fit, scope, price, and workspace activation are confirmed separately.
- The existing pricing FAQ now answers the base-plan versus add-on question without
  increasing the FAQ count or changing its three-group information architecture.
- Public copy remains English and Canadian French only. The protected dashboard's other
  interface languages do not alter public-site language scope.

## Documentation authority

This file is the sole active website-design contract. Superseded V3 planning and visual
evidence were removed from the working tree; Git history remains the point-in-time audit
trail.

## Verification evidence

### Premium Operations extension candidate

- Source scope is implemented for the Product catalog, Pricing clarification, and existing
  FAQ in English and Canadian French.
- Runtime target is Node `>=24 <25`, pnpm `10.34.5`, Next.js `16.2.11`, and React /
  React DOM `19.2.7`.
- Current exact-tree ESLint and TypeScript pass; the full unit/source suite passes
  `359/359`; the Next.js `16.2.11` production build passes; public routes pass `46/46`;
  responsive routes pass `20/20`; the UI matrix has zero failures; inactive Quote GET
  passes `2/2`; and the image optimizer returns HTTP 200. Standalone Chrome interaction
  remains environment-gated because no Chrome/Chromium binary is installed.
- Assertions must continue to prove separate-paid-add-on wording, no invented add-on
  amount, founder-managed activation, manager review, manual copy, no automatic send,
  and internal-only availability.
- GitHub CI is unverified until the exact candidate is published and its run is linked.
- Vercel preview/Production deployment and live-site acceptance are unverified; no
  deployment is inferred from a local build.

### Historical Website V4 baseline

- TypeScript and ESLint: PASS
- Unit tests: 272/272 PASS
- Next.js 16.2.4 production build: PASS; 23 static/dynamic routes generated
- Public route smoke: 46/46 PASS
- Local responsive bilingual route smoke: 20/20 PASS
- Local final UI matrix: zero failures across ten public routes, EN/fr-CA, light/dark,
  metadata, auth boundaries, sitemap, robots, and eleven recorded viewport targets from
  320×568 through 1920×1080
- Browser interaction smoke: PASS across 54 retained-page states, ten responsive widths
  per language, keyboard navigation, Demo tabs, Pilot copy, compact-menu focus return,
  and zero application runtime errors.
- Managed-browser visual review: PASS for all ten routes in EN and fr-CA at 390×844,
  1024×768, and 1440×900. Product, Demo, Pricing, Pilot, FAQ, Trust, Privacy, Security,
  and Terms content sections were also inspected directly; no horizontal overflow or
  clipped visible text remained.
- EN/fr-CA structural parity, manual-first claim guards, and current pricing values: PASS

## Production and data safety

No Supabase migration, Production database write, seed data, auth setting, billing flow,
or environment variable change is part of the public Website V4 extension itself. The
Premium Operations application candidate separately includes ordered migrations `0025`
then additive `0026`; both remain source-only until proven in order on an approved
local/disposable database, with Production reconciliation and apply separately gated.
Those migrations are not applied by a website build or deployment. Production website
deployment is verified only after the exact tested release is published, the Vercel target
is confirmed, and a read-only live acceptance pass succeeds. No customer or workspace data
is opened or changed by the website validation workflow.
