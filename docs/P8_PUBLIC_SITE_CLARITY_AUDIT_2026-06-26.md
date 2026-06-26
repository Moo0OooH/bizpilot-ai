# P8 Public Site Clarity Audit

Date: 2026-06-26

## 1. Current Branch And Commit

- Original branch: `review/public-site-clarity-and-breathing-room`
- Original review commit: `8848259 feat(home): add chaos-to-clarity hero`
- Main public-site commit: `6e7cfc3 feat(home): add chaos-to-clarity hero`
- Main dashboard D1 sync commit after P8: `654a645 fix(dashboard): stabilize d1 owner lead workflow`
- Starting git status: clean (`git status --short --branch` showed only the branch line)
- D1 was later applied to `main` in a separate commit after the P8 public-site commit.

## 2. Route Audit Matrix

| Route | Primary files inspected | Current state | P8 action |
| --- | --- | --- | --- |
| `/` | `app/page.tsx`, `lib/i18n/public-site-copy.ts`, `app/globals.css` | Safe truth, but crowded. Hero, trust badges, problem cards, solution cards, product preview, AI guardrail, use-case grid, FAQ, and CTA all repeat closely related points. | Simplify and rebuild homepage rhythm. |
| `/features` | `app/features/page.tsx`, `lib/i18n/public-site-copy.ts` | Clear but dense six-card grid plus proof strip and roadmap callout. | Light copy/spacing standardization if needed. |
| `/industries/cleaning` | `app/industries/cleaning/page.tsx`, `components/public/cleaning-service-details.tsx` | Cleaning-specific and within scope. Service cards plus selector are useful but text-heavy. | Inspect/minor copy clarity only. |
| `/trust` | `app/trust/page.tsx` | Correct guardrails, repeated with homepage AI section. | Keep as deeper trust page; homepage should link/strip instead of duplicating heavily. |
| `/demo` | `app/demo/page.tsx` | Good manual-first workflow. Uses four chapters and guardrails. | Keep stable; homepage should summarize and link here. |
| `/pricing` | `app/pricing/page.tsx`, `lib/i18n/public-site-copy.ts` | Staged pilot pricing and payment guardrails are explicit. | Do not change pricing values; only inspect for visual regression. |
| `/pilot` | `app/pilot/page.tsx`, `components/public/pilot-request-template-card.tsx` | Safe non-submitting copy-template flow. | Keep safe; no endpoint/form expansion. |
| `/content-studio` | `app/content-studio/page.tsx` | Clearly roadmap-only. | Keep roadmap label; no feature expansion. |
| `/faq` | `app/faq/page.tsx` | Dedicated FAQ is useful; homepage mini FAQ can stay short. | Update tests if homepage FAQ wording changes. |
| `/privacy` | `app/privacy/page.tsx`, `components/public/policy-page.tsx` | Policy route with readable shared shell. | Do not touch for P8 unless smoke fails. |
| `/security` | `app/security/page.tsx`, `components/public/policy-page.tsx` | Policy route with readable shared shell. | Do not touch for P8 unless smoke fails. |
| `/terms` | `app/terms/page.tsx`, `components/public/policy-page.tsx` | Policy route with pilot/payment boundaries. | Do not touch for P8 unless smoke fails. |
| `/quote` | `app/(public)/quote/page.tsx`, `components/public/quote-unavailable.tsx` | Safe unavailable state. | Inspect only. |
| `/quote/[slug]` | `app/(public)/quote/[slug]/page.tsx`, `components/public/quote-form-wizard.tsx` | Real public intake surface tied to backend service/action. | Do not touch in P8 unless quote smoke exposes visual regression. |
| `/quote/[slug]/success` | `app/(public)/quote/[slug]/success/page.tsx` | Correct no-booking/no-price expectation after submit. | Inspect only. |
| `/auth/sign-in` | `app/auth/sign-in/page.tsx`, `components/auth/*` | Owner access route, noindex. | Inspect only; no auth changes. |
| `/auth/sign-up` | `app/auth/sign-up/page.tsx`, `components/auth/*` | Owner access route with pilot prompt. | Inspect only; no auth changes. |
| `/auth/forgot-password` | `app/auth/forgot-password/page.tsx` | Auth route. | Inspect only. |
| `/auth/reset-password` | `app/auth/reset-password/page.tsx` | Auth route. | Inspect only. |
| `/auth/check-email` | `app/auth/check-email/page.tsx` | Auth route. | Inspect only. |

## 3. Crowded Pages

- Homepage is the main crowded surface.
- Features is moderately crowded because it combines six feature cards, a proof strip, roadmap disclosure, badges, and two CTAs.
- Cleaning page is long but purposeful; it should remain deeper detail rather than moving more detail onto the homepage.
- FAQ is intentionally detailed and should remain the deeper answer page.

## 4. Repeated Messages

- Manual-first/no auto-send appears in the homepage hero trust badges, product preview badges, AI section, FAQ, final CTA note, trust page, demo page, pricing guardrail, and terms.
- AI draft/owner review appears in hero body, mockup, product preview, AI section, features, demo, trust, quote consent, and dashboard language.
- Cleaning-first appears in hero, problem, solution, use cases, final CTA, cleaning page, pricing, pilot, and FAQ.

The repetition is safe from a claims perspective, but the homepage can feel like it is proving the same boundary too many times before the owner understands the basic workflow.

## 5. Sections To Shorten, Merge, Or Move Deeper

- Merge homepage `solution` and `preview` into one clear three-step workflow plus compact schematic.
- Replace the heavy homepage AI section with a short guardrail strip.
- Keep only three pain cards on homepage.
- Keep homepage FAQ at three questions maximum.
- Move service-specific depth to `/industries/cleaning`.
- Move full guardrails to `/trust`, `/demo`, `/pricing`, and `/faq`.
- Keep roadmap disclosure off the homepage; it already lives on supporting pages.

## 6. Current Homepage Section Map

1. Sticky public header
2. Hero with badge, H1, body, two CTAs, three trust badges, compact lead/draft mockup
3. Problem section with title/body and three cards
4. Solution section with three cards
5. Product preview with four labels, request, organized lead fields, draft, badges, demo CTA
6. AI guardrail section with two list columns
7. Use-case grid with six cleaning service links
8. Mini FAQ with three details cards and FAQ CTA
9. Final pilot CTA card
10. Footer

## 7. Proposed Homepage Section Map

1. Header
2. Hero: short badge, direct H1, two-line body, one primary CTA, one secondary CTA, compact schematic showing messy request -> organized lead -> owner-reviewed draft
3. Pain: three short cards only
4. Workflow: exactly three steps:
   - Capture quote request
   - BizPilot organizes and drafts
   - Owner reviews and sends manually
5. Guardrail strip: no auto-send, no invented price, no booking confirmation
6. Cleaning use-case preview: compact six links or shorter service strip, linked to Cleaning page
7. Pilot CTA: founder-led, approval-gated, no paid-pilot claim
8. Optional three-question FAQ preview linked to `/faq`
9. Footer

## 8. Files Likely To Change

- `app/page.tsx`
- `lib/i18n/public-site-copy.ts`
- `app/globals.css`
- `tests/smoke/public-route-smoke.mts`
- `tests/smoke/public-responsive-smoke.mts`
- `tests/unit/i18n-copy.test.mts`
- `tests/unit/public-visual-stability-source.test.mts`
- `docs/P8_PUBLIC_SITE_CLARITY_FINAL_REPORT_2026-06-26.md`

Possible but not planned unless required by verification:

- `app/features/page.tsx`
- `app/industries/cleaning/page.tsx`
- `app/trust/page.tsx`
- `tests/smoke/final-ui-matrix-smoke.mts`

## 9. Files That Must Not Be Touched

- `supabase/migrations/**`
- `tests/rls/**`
- `lib/supabase/**`
- `server/**`
- `app/(dashboard)/**`
- `components/dashboard/**`
- `app/auth/callback/route.ts`
- Auth action logic in `server/actions/auth.actions.ts`
- Public intake action/service logic in `server/actions/public-intake.actions.ts` and `server/services/public-intake.service.ts`
- AI provider config and provider logic
- Billing/payment files
- Environment files and secrets
- Production data-flow files
- Real customer data handling

## 10. Risk Controls

- Keep EN and fr-CA copy shape synced in `lib/i18n/public-site-copy.ts`.
- Preserve manual-first truth: no auto-send, no invented pricing, no booking confirmation, no invoicing, no SMS/WhatsApp automation, no full CRM claim.
- Preserve cleaning-first scope.
- Do not introduce public data submission or paid-pilot workflow.
- Keep existing light/dark token usage and avoid one-off hardcoded surfaces where possible.
- Keep mobile-first layout with stable `min-width: 0`, existing public visual hooks, and no `overflow-x-hidden`.
- Update source and smoke tests only when public visible copy or homepage structure intentionally changes.
- Run `pnpm verify`, public smokes, UI matrix smoke, and `git diff --check`.
- Run quote smoke only if quote route changes or a synthetic slug is already available and useful.

## 11. Recommendation

P8 is safe to start with strict scope:

- Start with homepage layout/copy simplification only.
- Keep backend, auth, dashboard, database, RLS, AI provider, billing/payment, quote submit logic, and production data flows untouched.
- Use synthetic/local browser review only.
- Real data and paid pilot remain blocked.

D1 status remains:

- D1 code/test ready.
- Owner visual review still required before real data or paid pilot.
- Real data and paid pilot remain blocked until explicit owner approval and later gates are closed.
