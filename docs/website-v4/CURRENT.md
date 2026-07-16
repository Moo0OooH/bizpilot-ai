# BizPilot Website V4 — Current Report

Date: 2026-07-16

Status: PASS / LIVE for the final Website V4 design-polish release

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

- Standardized the public scale around a 14px visible-microcopy floor, 17–18px body
  copy, 56–64px display titles, and a softer 780 display weight. Decorative symbols are
  not treated as copy.
- Consolidated the public responsive system to 720px and 1180px layout thresholds,
  with only short-viewport density refinements at the desktop threshold.
- Compressed the route palette back to disciplined primary, accent, success, warning,
  and semantic surfaces instead of giving every page an unrelated mini-brand.
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

- Final release SHA: `c78596b1f1530ff3586b9b076702822b0b711802` on `main`
- TypeScript and ESLint: PASS
- Unit tests: 249/249 PASS
- Next.js 16.2.4 Production build: PASS; 23 static/dynamic routes generated
- Local public route smoke: 46/46 PASS
- Local responsive bilingual route smoke: 20/20 PASS
- Local final UI matrix: zero failures
- EN/fr-CA structural parity and manual-first claim guards: PASS
- Light/dark token contrast guard: PASS
- GitHub CI: PASS (run `29517118330`)
- Vercel Production: SUCCESS (target `CbDDUpqxCVMoG3L8hTgGRoymvi5m`)
- Production public-route smoke: 46/46 PASS
- Production responsive bilingual smoke: 20/20 PASS
- Production final UI matrix: zero failures across EN/fr-CA, light/dark, metadata,
  auth boundaries, sitemap, robots, and 11 recorded viewport targets
- Managed-browser Production audit: PASS for all ten routes in EN/fr-CA at the desktop
  verification viewport; H1 is 64px/780, Home renders five sections, retained routes
  have zero horizontal overflow, Pricing exposes one tier CTA, FAQ has three groups,
  Trust has four control stages, Legal uses the focused shell, and Footer has no Sign-in
- Managed-browser microcopy audit: PASS; Home and Legal have no visible content label
  below 14px after excluding decorative `aria-hidden` symbols
- Local and Production inactive Quote GET: 2/2 PASS in EN/fr-CA, including safe missing-environment fallback
- V2.1 documentation link audit: zero broken local Markdown links
- Production HTTPS/security headers: PASS for CSP, HSTS, frame, content-type, referrer, and permissions controls
- The repository's standalone Chrome interaction runner remains environment-gated
  because this container has no local Chrome/Chromium binary; public managed-browser
  verification passed and no authenticated or data-writing browser action was attempted

## Production and data safety

No Supabase migration, production database write, seed data, auth setting, billing flow,
or environment variable change is part of Website V4/V2.1. Release SHA `c78596b` was
published directly to `main` without an extra branch or PR. The public Production release
at `https://bizpilo.com` passed the final URL, bilingual responsive, UI-matrix, Quote
fallback, and security-header acceptance checks.
