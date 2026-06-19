# Final Public Site Polish Baseline - 2026-06-19

## Scope

This baseline records the current public-site state before starting the final polish sequence from `BIZPILOT_FINAL_POLISH_CODEX_PROMPTS_v3.0.md`.

The active product truth remains: BizPilot AI is manual-first, cleaning-first, owner-controlled lead recovery for cleaning businesses. AI drafts; the owner reviews, edits, copies, and sends manually.

This audit does not approve real customer data, automated sending, booking confirmation, invoicing, CRM expansion, payment changes, auth changes, database changes, RLS changes, or AI provider changes.

## Repository State

- Branch: `main`
- Status before Phase 00 documentation: clean and tracking `origin/main`
- Current pushed HEAD: `13eda8ed00fbb013caa3d9cea051e6da3ffd47f6`
- Current pushed subject: `feat(ui): add unified responsive theme foundation`

## Phase 1 Confirmation

Phase 1 is present at HEAD and pushed to `origin/main`.

Observed Phase 1 implementation areas:

- Shared semantic public UI tokens in `app/globals.css`.
- Root theme bootstrap and first-paint attributes in `app/layout.tsx`.
- Shared theme helpers in `lib/theme.ts`.
- Shared theme preference control in `components/ui/theme-preference-control.tsx`.
- Theme wiring across marketing, auth, quote, dashboard, and founder admin shells.
- EN/FR theme labels added through `lib/i18n/bizpilot-copy.ts`.
- Auth mobile theme control added in `components/auth/auth-ui.tsx`.

## Current Route And Component Map

Primary public marketing routes:

- `/` -> `app/page.tsx`
- `/features` -> `app/features/page.tsx`
- `/industries/cleaning` -> `app/industries/cleaning/page.tsx`
- `/trust` -> `app/trust/page.tsx`
- `/demo` -> `app/demo/page.tsx`
- `/pricing` -> `app/pricing/page.tsx`
- `/pilot` -> `app/pilot/page.tsx`
- `/content-studio` -> `app/content-studio/page.tsx`
- `/privacy` -> `app/privacy/page.tsx`
- `/security` -> `app/security/page.tsx`
- `/terms` -> `app/terms/page.tsx`

Primary shared public components:

- Marketing shell/header/footer/buttons/cards: `components/public/marketing-ui.tsx`
- Compact public menu: `components/public/marketing-compact-menu.tsx`
- Policy page template: `components/public/policy-page.tsx`
- Theme control: `components/ui/theme-preference-control.tsx`
- Theme helpers: `lib/theme.ts`

Primary localization sources:

- Home shell copy: `lib/i18n/home-copy.ts`
- Policy page copy: `lib/i18n/policy-copy.ts`
- Pricing copy: `lib/i18n/pricing-copy.ts`
- Shared BizPilot labels: `lib/i18n/bizpilot-copy.ts`

Primary auth routes:

- Sign in: `app/auth/sign-in/page.tsx`
- Sign up: `app/auth/sign-up/page.tsx`
- Forgot password: `app/auth/forgot-password/page.tsx`
- Reset password: `app/auth/reset-password/page.tsx`
- Auth UI shell: `components/auth/auth-ui.tsx`

Primary quote routes:

- Quote entry route: `app/(public)/quote/page.tsx`
- Quote form route: `app/(public)/quote/[slug]/page.tsx`
- Quote success route: `app/(public)/quote/[slug]/success/page.tsx`
- Quote wizard: `components/public/quote-form-wizard.tsx`
- Unavailable quote state: `components/public/quote-unavailable.tsx`

## P0 Findings To Address

- First-time visitors can still resolve to dark mode on OS-dark machines because `app/layout.tsx` falls back to `"system"` in the inline bootstrap script, while `lib/theme.ts:28` also defaults missing values to `"system"`.
- Dark homepage surfaces remain mixed after Phase 1; preview cards and marketing bands need final contrast passes in `app/page.tsx` and the shared tokens in `app/globals.css`.
- Header utility controls are still too wide for professional public navigation. The main pressure points are the desktop utility cluster in `components/public/marketing-ui.tsx:467`, the wide theme control at `components/public/marketing-ui.tsx:469`, and the truncating brand tagline at `components/public/marketing-ui.tsx:381`.
- The Pilot page still contains a long disabled form preview, including the disabled fieldset in `app/pilot/page.tsx:208` and disabled controls through `app/pilot/page.tsx:218`.
- Public fr-CA body localization is incomplete. The clearest example is `app/page.tsx`, where most homepage section arrays and paragraphs remain hardcoded English even when the route language is fr-CA.
- Auth pages still expose language and theme controls through `components/auth/auth-ui.tsx:103` and `components/auth/auth-ui.tsx:130`, which conflicts with the final polish direction to keep auth focused.
- Canonical active fr-CA quote smoke evidence exists for production, but the local smoke runner does not currently support a query-bearing slug cleanly because `tests/smoke/quote-route-smoke.mts` encodes the slug path segment.

## P1 Findings To Address

- Homepage service grid currently risks an uneven 4+2 desktop rhythm through `app/page.tsx:532`; the final target is 3x2 desktop, 2x3 tablet, 1x6 mobile.
- Feature cards use the same uneven repeated grid pattern in `app/features/page.tsx:67`; the final target is also 3x2, 2x3, 1x6.
- Cleaning services currently list seven services in `app/industries/cleaning/page.tsx:44`; the final target is a more balanced cleaning-first service set.
- Trust page currently presents seven equal cards from `app/trust/page.tsx:44`; the final target is three clear pillars.
- Demo page direction is acceptable, but final polish should keep it as four owner-controlled chapters with complete bilingual copy.
- Pricing can stay non-invented, but polish should keep pricing expectations manual and avoid in-app billing implications.
- Policy external references open in a new tab in `components/public/policy-page.tsx:152`; final polish should add visible or screen-reader warning text for official external references.
- Auth metadata and interaction details need polish, including sign-in title copy in `app/auth/sign-in/page.tsx` and password visibility controls in `components/auth/auth-ui.tsx`.
- Quote and quote-success templates need a final token, localization, and report-shell consistency pass.

## P2 Findings To Track

- `components/public/marketing-compact-menu.tsx:73` intentionally uses a scrollable menu surface; this should remain local to the menu and should not become a global `overflow-x-hidden` workaround.
- Several private/dashboard shells use fixed or scrollable surfaces. They should be left alone unless a later phase explicitly touches them.
- Content Studio should remain clearly not active production software unless explicitly approved later.

## Quote Smoke Evidence

The current canonical production fr-CA synthetic quote evidence is recorded in `PHASE_21F_FR_CA_PRODUCTION_QUOTE_SMOKE.md`.

- Production route: `https://bizpilo.com/quote/akora?language=fr-CA`
- Status: PASS on 2026-05-26
- Required French labels observed: `Quel type de nettoyage`, `Envoyer la demande`
- Required-field negative path localized: PASS
- Valid synthetic submit redirected to `/quote/akora/success?language=fr-CA`
- Data posture: synthetic only; real customer data remains deferred until explicit readiness approval

The safest next local work is to update the smoke runner so this canonical route can be tested without relying on an encoded query-bearing slug.

## Recommended Next Phase Order

1. Phase 01 - default first-time public visitors to Light and compact the theme control while preserving explicit system preference.
2. Phase 02 - professionalize header navigation, language control, compact menu behavior, and active route polish.
3. Phase 03 - complete public EN/fr-CA localization for marketing, auth-facing public shell copy, quote copy, policy copy, and metadata.
4. Phase 04 - finalize homepage conversion layout with balanced service and workflow sections.
5. Phase 05 - polish supporting marketing pages: features, cleaning industry, trust, demo, pricing, Content Studio, and legal/supporting pages as directed by the prompt.
6. Phase 06 - replace the disabled Pilot form with a concise founder-controlled conversion path.
7. Phase 07 - simplify auth pages and unify quote/report templates without changing auth behavior or quote data flow.
8. Phase 08 - finalize localized metadata, robots/sitemap expectations, and official trust references.
9. Phase 09 - add automated responsive, locale, and theme coverage.
10. Phase 10 - record final pre-dashboard readiness and release notes after full verification.

## Likely Files Affected Next

Phase 01 likely touches:

- `app/layout.tsx`
- `lib/theme.ts`
- `components/ui/theme-preference-control.tsx`
- `components/public/marketing-ui.tsx`
- `components/auth/auth-ui.tsx` only if needed for the shared control behavior
- `app/globals.css`
- Theme-related unit tests if present or needed

Phase 02 likely touches:

- `components/public/marketing-ui.tsx`
- `components/public/marketing-compact-menu.tsx`
- `lib/i18n/home-copy.ts`
- `lib/i18n/bizpilot-copy.ts`
- Header-related responsive smoke tests if needed

Phase 03 likely touches:

- `app/page.tsx`
- `app/features/page.tsx`
- `app/industries/cleaning/page.tsx`
- `app/trust/page.tsx`
- `app/demo/page.tsx`
- `app/pricing/page.tsx`
- `app/pilot/page.tsx`
- `app/content-studio/page.tsx`
- `app/privacy/page.tsx`
- `app/security/page.tsx`
- `app/terms/page.tsx`
- `app/(public)/quote/[slug]/page.tsx`
- `app/(public)/quote/[slug]/success/page.tsx`
- `components/public/quote-form-wizard.tsx`
- `components/public/quote-unavailable.tsx`
- `lib/i18n/home-copy.ts`
- `lib/i18n/policy-copy.ts`
- `lib/i18n/pricing-copy.ts`
- `lib/i18n/bizpilot-copy.ts`

Later phases likely also touch:

- `app/auth/sign-in/page.tsx`
- `app/auth/sign-up/page.tsx`
- `components/auth/auth-ui.tsx`
- `tests/smoke/public-responsive-smoke.mts`
- `tests/smoke/quote-route-smoke.mts`
- `tests/unit/*.test.mts` if localization/theme helpers gain behavior
- `app/robots.ts` and `app/sitemap.ts` if required by SEO phase

## Verification Commands For Phase 00

Local commands completed before the Phase 00 commit:

- `pnpm lint` - PASS
- `pnpm typecheck` - PASS
- `pnpm test:unit` - PASS
- `pnpm build` - PASS
- `git diff --check` - PASS

Public, responsive, and quote smoke runs are expected in later implementation phases when route behavior changes and a local server is available. The production fr-CA quote route should not be submitted again unless the phase explicitly requires synthetic production smoke.

## Risks Before Continuing

- The final polish is broad and touches multiple public pages; completing it safely requires one phase per commit.
- Phase 03 is the largest localization phase and carries the most copy/layout regression risk.
- Phase 06 will require updating smoke expectations that currently assert the old disabled Pilot form.
- Quote smoke tooling needs a small compatibility improvement before it can represent `akora?language=fr-CA` exactly.
- Any metadata or legal-reference edits must avoid overstating readiness, automation, pricing, support, or compliance posture.
