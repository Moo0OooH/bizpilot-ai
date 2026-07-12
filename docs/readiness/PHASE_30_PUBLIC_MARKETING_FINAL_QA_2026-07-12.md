# Phase 30 Public Marketing Final QA

Date: 2026-07-12
Project: BizPilot AI
Scope: Public marketing routes only

## Outcome

The public marketing site now preserves `language=fr-CA` on internal public navigation, footer links, shared CTA primitives, and page-level conversion paths. The story remains cleaning-first and manual-first: BizPilot organizes scattered quote requests, surfaces missing details, prepares a draft, and leaves review, copy, and sending with the owner.

## Files Changed

- `lib/i18n/public-href.ts`: New shared internal-public URL helper.
- `components/public/marketing-ui.tsx`: Locale-preserving header, footer, brand, hero, next-step, and button links.
- `components/public/pilot-request-template-card.tsx`: Copy-template path plus a recipient-free local email draft; no data submission endpoint.
- `lib/i18n/public-site-copy.ts`: English and fr-CA pilot conversion copy updates.
- `app/page.tsx`, `app/features/page.tsx`, `app/industries/cleaning/page.tsx`, `app/comparison/page.tsx`, `app/quote-link-guide/page.tsx`, `app/faster-quote-replies/page.tsx`, `app/trust/page.tsx`, `app/demo/page.tsx`, `app/pricing/page.tsx`, `app/pilot/page.tsx`, `app/faq/page.tsx`, and `app/content-studio/page.tsx`: Pass the active language to shared public CTA primitives.
- `tests/unit/public-language-links.test.mts`: Unit coverage for the href helper and shared shell integration.
- `tests/unit/i18n-copy.test.mts` and `tests/unit/public-visual-stability-source.test.mts`: Updated copy and homepage-component expectations.
- `tests/smoke/public-route-smoke.mts`: French route and internal-link persistence coverage.
- `tests/smoke/public-responsive-smoke.mts`: Updated bilingual CTA and pilot conversion expectations.
- Existing public source guards: Updated only where their expected component signatures or copy changed.

## Copy Decisions

- The public message remains focused on cleaning quote recovery, not a generic CRM.
- All public copy keeps AI in a draft-assistance role; owners review, edit, copy, and send manually.
- `/pilot` now explains a clear manual request path: copy the template or open a prefilled recipient-free email draft, then choose the founder contact and send manually.
- `/pricing` remains founder-pilot, manual-approval, and manual-billing only. It does not offer self-serve checkout or production activation.
- Privacy, security, and terms retain the plain-language summary before detailed operational and legal material.

## Bilingual Parity And Language Persistence

- EN and fr-CA share the same route hierarchy, responsive components, conversion actions, guardrails, and product boundaries.
- The French header, compact menu, footer, hero actions, next-step panels, direct route CTAs, homepage cards, and pilot pricing link retain `language=fr-CA`.
- A live desktop click on French `Fonctions` navigated to `/features?language=fr-CA`.
- Public smoke checks every required French route for localized rendering and for internal public hrefs that retain the French query parameter.

## Route And Device QA

| Viewport | Locale and route | Result |
| --- | --- | --- |
| 1440x900 | EN `/` | First fold shows pain, solution, proof board, and two readable CTAs; no horizontal overflow. |
| 1440x900 | fr-CA `/` | Header and footer links retain French; desktop navigation click retained `language=fr-CA`. |
| 1280x720 | fr-CA `/features` | French hero and product proof panel fit cleanly with no clipped CTA or overflow. |
| 768x1024 | fr-CA `/pilot` | Compact header, pilot message, request CTA, and next steps remain readable; local email-draft link is present. |
| 390x844 | EN `/pricing` | Manual founder-pilot pricing and approval-gated billing boundary remain clear and intentional. |
| 360x740 | fr-CA `/privacy` | Plain-language privacy summary is readable above detailed material; no overflow and no English leakage. |

## Validation

| Command | Result |
| --- | --- |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test:unit` | PASS, 223 tests |
| `pnpm build` | PASS |
| `pnpm smoke:public -- --base-url=http://127.0.0.1:3000` | PASS, 33 checks including all French persistence routes |
| `pnpm smoke:responsive -- --base-url=http://127.0.0.1:3000` | PASS, 25 routes |
| `pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3000` | PASS, 0 failures |
| `git diff --check` | PASS |

## Remaining Risks

- The pilot email draft intentionally has no hard-coded recipient because no approved public founder inbox is configured in the marketing surface. Visitors must add the founder contact they already use before sending.
- The manual request path does not create a BizPilot record, by design. No new real-data flow, automated onboarding, or paid activation was opened.

## Approval Boundary

Real customer data and paid-pilot activation remain blocked unless separately approved. This work does not alter Supabase migrations, RLS, database schema, authentication, dashboard logic, founder/admin controls, AI provider behavior, payment automation, customer messaging automation, booking, invoicing, or CRM scope.
