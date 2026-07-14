# BizPilot Website V3 — Homepage and Hero Acceptance

Date: 2026-07-13  
Phase: V3.5 — Homepage conversion rebuild  
Branch: `codex/website-v3-rebuild`

## Outcome

The homepage now tells one compact, honest story in exactly seven sections: the message-overload problem, one Smart Intake Link, structured request completion, an AI-assisted draft, human review, a cleaning-specific proof example, and one founder-pilot conversion path. The former V2 homepage renderer and its repeated workflow explanations are no longer used on `/`.

The first-view headline is:

- EN: **Turn scattered customer messages into complete requests—and replies ready to review.**
- fr-CA: **Transformez les messages dispersés en demandes complètes et en réponses prêtes à valider.**

The visual mechanism uses three readable stages: **Scattered questions → One Smart Intake Link → Ready for your team**. A visible placement note says the link can be shared where customers already reach the business and explicitly states that direct inbox integrations are roadmap, not a current capability.

## Seven-section acceptance

| Order | Section | Conversion job | Accepted result |
| --- | --- | --- | --- |
| 1 | Hero | State the pain, mechanism, outcome, and two actions | Complete; one H1 and one product scene |
| 2 | Problem | Make message overload recognizable | Complete; three short source examples without claiming direct integrations |
| 3 | Workflow | Explain the product in three steps | Complete; collect, organize, review |
| 4 | Outcomes | Translate features into owner value | Complete; less back-and-forth, clearer handoff, faster manual follow-up |
| 5 | Cleaning demo | Prove the workflow with the first complete vertical | Complete; concrete move-out request and reply-draft example |
| 6 | Trust | State current-product boundaries | Complete; human approval, no invented price, no auto-send |
| 7 | Final CTA | Offer a next step without fake urgency | Complete; demo and founder-pilot actions |

## Product-truth controls

- The site does not claim social inbox ingestion, automatic sending, booking, invoicing, payment collection, or CRM replacement.
- AI output is consistently described as assisted and ready for human review.
- The customer-facing outcome remains an organized request and a draft; the owner edits, copies, and sends through the real customer channel.
- Cleaning is presented as the first complete demo vertical, not as the only possible audience.
- No customer data, dashboard behavior, Supabase policy, migration, RLS, or production access state was changed.

## First-viewport evidence

The browser smoke captured raw Chrome screenshots and measurements under `artifacts/rebuild-v3/phase5/`. These artifacts are intentionally ignored by Git.

| Evidence state | H1 lines | CTAs visible | Product story visible | Overflow |
| --- | ---: | ---: | --- | ---: |
| EN 1440×900 | 4 | 2 | Yes | 0px |
| fr-CA 1440×900 | 4 | 2 | Yes | 0px |
| EN 1280×720 | 4 | 2 | Yes | 0px |
| EN 768×1024 | 5 | 2 | Yes | 0px |
| EN 390×844 | 7 | 2 | Yes | 0px |
| fr-CA 390×844 | 7 | 2 | Yes | 0px |
| EN 360×740 | 7 | 2 | Begins below first viewport | 0px |
| EN dark 1440×900 | 4 | 2 | Yes | 0px |
| EN reduced motion 1440×900 | 4 | 2 | Yes | 0px |

At 360×740 the full product frame intentionally follows the first viewport, but the complete mechanism is already stated in the body copy, both conversion actions are visible, and the first human-control assurance is visible. At 390×844 and above, the product story itself enters the first viewport.

The full responsive browser matrix also passed at 320, 360, 390, 430, 768, 1024, 1280, 1440, and 1920 in both languages with 0px horizontal overflow. The compact menu remained contained between 64px and 661px, and the browser reported zero application console/runtime errors.

## Accessibility and performance

Lighthouse 13.4.0 mobile EN on the optimized local production build produced:

| Metric | Phase 4 sample | Phase 5 final | Change |
| --- | ---: | ---: | ---: |
| Performance | 94 | **96** | +2 |
| Accessibility | 100 | **100** | Maintained |
| Best Practices | 100 | **100** | Maintained |
| SEO | 100 | **100** | Maintained |
| LCP | 2.9s | **2.8s** | -0.1s |
| TBT | 110ms | **20ms** | -90ms |
| CLS | 0 | **0** | Maintained |
| Transfer | 311KiB | **298KiB** | -13KiB |

The JSON report is complete and parseable at `artifacts/rebuild-v3/phase5/lighthouse-mobile-final.json`. Lighthouse again returned exit code 1 only while deleting its Windows temporary Chrome profile:

```text
npx --yes lighthouse "http://127.0.0.1:3100/?language=en" --output=json --output-path=artifacts/rebuild-v3/phase5/lighthouse-mobile-final.json --chrome-flags="--headless=new --no-sandbox --disable-gpu" --quiet
EPERM, Permission denied: C:\Users\mbeag\AppData\Local\Temp\lighthouse.*
```

The report was written before cleanup and contains the scores above. This matches the previously documented local `chrome-launcher` cleanup issue and is not an application runtime failure.

## Validation record

Passed on the final source and optimized build:

- `pnpm verify`: lint, typecheck, 249/249 unit tests, and Next.js 16.2.4 production build.
- `pnpm smoke:public -- --base-url=http://127.0.0.1:3100`: 33/33 checks.
- `pnpm smoke:responsive -- --base-url=http://127.0.0.1:3100`: 25/25 routes.
- `pnpm smoke:browser -- --base-url=http://127.0.0.1:3100 --evidence-dir=artifacts/rebuild-v3/phase5`: both locales, nine evidence states, locale persistence, theme, menu containment, and zero runtime errors.
- `pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3100`: zero failures across public, auth, language, theme, metadata, sitemap, and optional fixture checks.

Two local validation invocations failed before the final pass and were corrected without hiding them:

- `pnpm smoke:public -- --base-url=http://127.0.0.1:3100` initially expected the retired V2 H1. This was a test-label mismatch introduced by the planned homepage replacement; the marker now verifies the V3 headline and manual-send workflow, and the repeated run passed 33/33.
- `pnpm smoke:ui -- --base-url=http://127.0.0.1:3100` failed because no such package script exists. The repository-defined command is `pnpm smoke:ui-matrix`, which passed with zero failures.

## Phase 6 entry conditions

- Keep this seven-section homepage and its measured first-view budgets stable.
- Migrate only the ten retained routes to the V3 content contract and shared design foundation.
- Implement direct permanent redirects for the five approved merge routes while preserving locale query state and destination fragments.
- Give Features, Demo, Pricing, Pilot, FAQ, and Trust one distinct job each; do not recreate long guide pages or repeated homepage sections.
- Replace the pilot page’s empty-recipient email dead end with the approved copy-only founder request mechanism unless a verified public recipient is explicitly approved.
- Keep privacy, security, and terms readable, localized, canonical, and inside the same compact public shell.
