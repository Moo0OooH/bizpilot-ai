# BizPilot Website V4 — Current Report

Date: 2026-07-14  
Status: release candidate; production promotion pending public Preview QA  
Scope: public marketing routes only; dashboard, auth, quote intake, and production data unchanged

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

## V4 design decisions

- Replaced the uniform white/blue card template with an ink, cobalt, mint, coral, lime,
  and violet system that still meets semantic light/dark token requirements.
- Increased display contrast and product-scene text size; removed the 9–10px product
  labels that made the old hero difficult to read.
- Rebuilt the homepage as distinct visual chapters: message pressure, four-step path,
  team-ready record, cleaning walkthrough, human-control boundary, and focused CTA.
- Added a large first-fold product story that shows the actual transformation from
  scattered questions to an intake link and a review-ready request.
- Gave Product, Demo, Pricing, Pilot, FAQ, and Trust distinct first-fold visuals and
  content rhythms while keeping one maintainable renderer.
- Changed the desktop navigation threshold from 1440px to 1180px now that the route set
  is smaller; compact navigation remains below that measured fit point.
- Kept motion optional and decorative transforms disabled by `prefers-reduced-motion`.
- Kept every layout free of nested scrolling and viewport-width traps.

## Reference audit

The redesign used current public SaaS patterns as directional references, not templates:

- Linear: compact navigation, strong hierarchy, and feature-led product story;
- Attio: large product UI as the main visual proof;
- Front: operational workflow clarity and customer-message context;
- Typeform: one clear intake action and low-cognitive-load progression;
- Intercom, Crisp, Trengo, and respond.io: category language and inbox/workflow comparison.

BizPilot intentionally does not reuse direct-inbox language from omnichannel products
because the current product is a shareable intake and reply workspace.

## Documentation cleanup

Fourteen V3 planning, research, implementation, and acceptance reports were removed from
the active `docs/rebuild-v3` path and moved together to
`docs/archive/website-v3-2026-07-13/`. This document is the sole active website-design
report. Historical reports remain available only for traceability.

## Verification evidence

- TypeScript: PASS
- ESLint: PASS
- Unit tests: 249/249 PASS
- Production build: PASS; 23 static/dynamic public and application routes generated
- Responsive bilingual route smoke: 20/20 PASS
- EN/fr-CA structural parity and manual-first claim guards: PASS
- Light/dark token contrast guard: PASS
- Local Chrome interaction smoke: pending public Preview because this workspace does not
  include a Chrome binary and the managed cloud browser cannot access loopback URLs

## Production and data safety

No Supabase migration, production database write, seed data, auth setting, billing flow,
or environment variable change is part of Website V4. Production promotion requires a
public Preview browser pass, CI success, and a final production URL smoke.
