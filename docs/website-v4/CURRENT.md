# BizPilot Website V4 — Current Report

Date: 2026-07-17

Status: PASS / READY FOR PRODUCTION for the Website V4 editorial redesign

Scope: public marketing, Auth GET states, Quote read/recovery states, and system 404/error surfaces; production data unchanged

## Product truth and approved bilingual message

The English and Canadian French copy is approved for the current product boundary.
Both languages communicate the same customer problem and solution:

- service-business owners, sales managers, and support teams receive vague questions through multiple customer touchpoints;
- BizPilot provides one Smart Intake Link that can be shared in those places;
- the link collects service-specific details and creates an organized request;
- AI prepares a cautious draft or follow-up question;
- a human reviews, edits, copies, and manually sends the response;
- no direct social inbox integration, automatic sending, invented price, or automatic booking is claimed.

Cleaning remains the first complete pilot workflow. The homepage may show Instagram,
WhatsApp, website, email, Google profile, QR code, or direct message as places to share
the link, never as connected inbox integrations.

## Information architecture

The retained public routes remain intentionally small:

`/`, `/features`, `/demo`, `/pricing`, `/pilot`, `/faq`, `/trust`, `/privacy`,
`/security`, and `/terms`.

No retired duplicate landing page was restored. Legal pages remain simple and use the
same bilingual shell without imitating marketing layouts.

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
- Uses 720px for card progression, 1024px for the homepage hero split, and 1180px for the
  full navigation and shared route layouts, with short-viewport refinements where needed.
- Reduced the homepage renderer from seven repeated chapters to five: hero, problem,
  workflow plus outcomes, cleaning walkthrough, and a final control/pilot CTA.
- Made the first Product capability the flagship benefit and separated human control
  from the repeated capability-card rhythm.
- Kept Demo scene-led, gave Pricing one active founder-cohort CTA with calmer future
  tiers, and removed repeated tier actions.
- Aligned every public pilot CTA with `/pilot#application` and truthful copy that says
  the visitor is preparing/copying a request rather than submitting a hidden form.
- Grouped ten FAQ questions into three decision-oriented sections and rebuilt Trust as
  a four-stage control sequence followed by explicit operational boundaries and direct
  policy links.
- Gave Privacy, Security, and Terms a focused legal shell: brand, language, theme,
  document content, legal links, and no marketing conversion CTA.
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

## Documentation authority

This file is the sole active website-design contract. Superseded V3 planning and visual
evidence were removed from the working tree; Git history remains the point-in-time audit
trail.

## Verification evidence

- TypeScript and ESLint: PASS
- Unit tests: 257/257 PASS
- Next.js 16.2.4 production build: PASS; 23 static/dynamic routes generated
- Local responsive bilingual route smoke: 20/20 PASS
- Local final UI matrix: zero failures across ten public routes, EN/fr-CA, light/dark,
  metadata, auth boundaries, sitemap, robots, and eleven recorded viewport targets from
  320×568 through 1920×1080
- Managed-browser visual review: PASS for the homepage and Pricing desktop first folds;
  the homepage product scene has readable fields, natural word wrapping, and no horizontal
  overflow. A 390×844 emulated mobile audit also reports zero horizontal overflow.
- EN/fr-CA structural parity, manual-first claim guards, and current pricing values: PASS

## Production and data safety

No Supabase migration, production database write, seed data, auth setting, billing flow,
or environment variable change is part of this Website V4 redesign. Production deployment
is verified after the tested release commit reaches `main`; no customer or workspace data
is opened or changed by the website validation workflow.
