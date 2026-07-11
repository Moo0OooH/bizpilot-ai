# Phase 29 - Public Site Research And Hero Redesign

Date: 2026-07-11

## Scope

This phase covers the main public BizPilot AI site pages only. Dashboard,
founder/admin internals, auth behavior, quote submission behavior, RLS,
migrations, real customer data, billing, and automation behavior remain out of
scope unless separately approved.

## Research Read

Sources reviewed:

- Nielsen Norman Group, Homepage Design: 5 Fundamental Principles:
  https://www.nngroup.com/articles/homepage-design-principles/
- Baymard Institute, Homepage and Category Navigation UX 2025:
  https://baymard.com/blog/ecommerce-navigation-best-practice
- CXL, How to Build a High-Converting Landing Page:
  https://cxl.com/blog/how-to-build-a-high-converting-landing-page/
- Unbounce, 40 best landing page examples of 2026:
  https://unbounce.com/landing-page-examples/best-landing-page-examples/
- Figma, Top Web Design Trends for 2026:
  https://www.figma.com/resource-library/web-design-trends/
- Google Search Central, SEO Starter Guide:
  https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- web.dev, Web Vitals:
  https://web.dev/articles/vitals
- W3C, WCAG 2.2 Quick Reference:
  https://www.w3.org/WAI/WCAG22/quickref/

Additional 2026 market scan on 2026-07-11:

- SaaSFrame, 10 SaaS Landing Page Trends for 2026:
  https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples
- Hedrick, Startup landing page examples 2026:
  https://hedrick.io/post/startup-landing-page-examples
- LearnyBox, Landing Page Best Practices for 2026:
  https://learnybox.com/en/blog/landing-page-best-practices/
- Dynamic Yield, Website personalization strategy and best practices:
  https://www.dynamicyield.com/lesson/web-personalization/

Directional takeaway: current SaaS/startup guidance continues to favor a
specific audience/pain/outcome hero, a real product visual above the fold,
proof or trust close to the CTA, mobile-first clarity, and restrained dynamic
personalization. BizPilot should apply that pattern as route-specific product
signals and bilingual-safe product boards, not as unsupported automation,
fake social proof, or noisy trend decoration.

## Comparison Against Current Docs

Already covered well:

- Product truth is clear: cleaning-first, manual-first lead recovery.
- Prohibited claims are explicit: no auto-send, booking, invoices, payments,
  fake revenue, full CRM, unsupported automation, or real customer data before
  approval.
- EN/fr-CA dictionary, metadata, route-switching, and no-overflow expectations
  are documented.
- Public QA matrix already covers viewport, theme, language, metadata, links,
  and smoke validation.

Gaps added in this phase:

- A route-level hero formula: audience, pain, remedy, proof/guardrail, and next
  action.
- Explicit product-scene requirement for the homepage instead of generic SaaS
  visuals.
- Proof placement near CTAs without fake testimonials or fake metrics.
- Dynamic website guidance translated into safe BizPilot UI: product boards,
  signal flows, restrained interaction, and bilingual-safe sizing.
- A stronger connection between SEO/useful-content guidance and public route
  structure.
- A resize-text and bilingual-fit reminder based on WCAG 2.2.

Follow-up gaps closed in the continuation pass:

- Primary public marketing route smoke coverage now includes `/features`,
  `/industries/cleaning`, `/trust`, `/pilot`, and roadmap-only
  `/content-studio`.
- Supporting page hero visuals now include a consistent product-board chrome
  cue so the first fold reads more like a working product surface and less like
  a generic content card.
- `/content-studio` now has breadcrumb JSON-LD parity while staying noindex and
  roadmap-only.
- Founder-admin text localization touched only existing internal labels and did
  not change dashboard behavior, automation, customer data, or paid-pilot
  gates.

## Design Direction

- Homepage: strongest first screen, with product scene, hot quote risk, missing
  detail detection, owner-reviewed draft, and manual copy/send guardrail.
- Supporting public pages: consistent compact page hero with proof rail or
  product-signal panel, then dense action-first body sections.
- Copy: heavier, more specific, and less generic. It should sound like a
  cleaning owner problem, not broad SaaS positioning.
- Sizing: use shared `bp-*` primitives, avoid nested scroll, avoid viewport font
  scaling, keep CTA labels stable in English and fr-CA.
- Conversion path: pilot, demo, trust, pricing, quote-link guidance, and reply
  speed pages should reinforce one manual-first story instead of competing
  messages.

## Acceptance Notes

Implementation should update source headers for materially edited code files,
preserve dictionary parity, and run at least:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:unit`
- `pnpm build`
- `git diff --check`

Continuation validation on 2026-07-11 should also include:

- `pnpm smoke:public` against a local production server, because primary public
  route coverage was expanded.
- `pnpm smoke:responsive` and `pnpm smoke:ui-matrix`, because the hero visual
  system is layout-sensitive in EN/fr-CA.

## Continuation Validation Run

Local production target: `http://127.0.0.1:3002`

Commands completed on 2026-07-11:

- `pnpm test:unit` - pass, 217/217.
- `pnpm lint` - pass.
- `pnpm typecheck` - pass after narrowing breadcrumb JSON-LD routing and
  completing founder-admin copy shape.
- `pnpm build` - pass, 28 static pages generated.
- `BIZPILOT_SMOKE_BASE_URL=http://127.0.0.1:3002 pnpm smoke:public` - pass,
  19/19 routes.
- `BIZPILOT_SMOKE_BASE_URL=http://127.0.0.1:3002 pnpm smoke:responsive` -
  pass, 25 routes.
- `BIZPILOT_SMOKE_BASE_URL=http://127.0.0.1:3002 pnpm smoke:ui-matrix` - pass,
  0 failures.
- `git diff --check` - pass.

Browser visual QA:

- Desktop `/features`, 1280x720: product-board chrome rendered once, stayed
  inside the hero panel, stayed away from the H1, and produced no horizontal
  overflow.
- Mobile `/features?language=fr-CA`, 390x844: document language stayed `fr-CA`,
  product-board chrome rendered once, stayed inside the hero panel, appeared
  below the H1, and produced no horizontal overflow.
