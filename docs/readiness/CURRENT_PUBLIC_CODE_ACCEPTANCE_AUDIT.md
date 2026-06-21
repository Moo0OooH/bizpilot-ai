# Current Public Code Acceptance Audit

Status: P0 audit recorded; product-code remediation still required before public acceptance.
Audit date: 2026-06-21.
Repository: `E:\bizpilot-ai`.
Branch at audit start: `main`.
HEAD at audit start: `b78c969940de19ef118dc361215438a07c04ad7c` (`docs(readiness): record post-d0 project status`).
Remote: `https://github.com/Moo0OooH/bizpilot-ai.git`.

## Scope

This audit was created from the post-D0 public-site acceptance prompt. It is intentionally read-only for product code. The only file created in P0 is this audit record.

P0 inspected the canonical docs, git status/log, the public code surface, and the current production site at `https://bizpilo.com`. The scan covered the public marketing/legal/auth/quote routes across English, French Canadian, light theme, dark theme, desktop `1280x720`, and mobile `390x844`.

No database, auth, RLS, Supabase, AI provider, payment, billing, production data-flow, real customer data, SMS/WhatsApp, booking, invoicing, CRM, or unsupported-claims work is approved by this audit.

## Product Truth

BizPilot AI remains cleaning-first, manual-first, owner-controlled lead recovery for cleaning businesses. AI drafts only. The owner reviews, edits, copies, and sends manually.

Real customer data remains NO-GO until Phase 24G explicit owner approval is recorded. Paid pilot remains NO-GO until public acceptance, owner approval, payment/support/rollback readiness, and restored app/dashboard/RLS proof are complete.

## Production Evidence Summary

Production route matrix:

- Total observations: 160.
- Header CTA duplicate text observations: 88.
- Header CTA duplicate visible/header-inner observations: 22.
- Homepage demo duplicate number observations: 8.
- French no-accent `Confidentialite` / `Securite` observations: 44.
- Root horizontal overflow observations in this matrix: 0.
- Nested scroll observations in this matrix: 0.
- Hero CTA observations with detectable hero actions: 8 of 8 visible in the first fold.

The public headers confirm the site is served by Vercel/Next.js, but public response headers did not expose the deployment commit. Local `gh` and `vercel` CLIs were not installed in this environment, so the exact deployment SHA could not be independently extracted at P0. The production DOM symptoms match root causes present in `origin/main` at `b78c969`.

## Acceptance Blockers

| Severity | Area | Evidence | Source root cause | Required phase |
| --- | --- | --- | --- | --- |
| P1 | Global public shell CTA duplication | Production exposed duplicate founder-pilot CTA text in 88/160 observations and duplicate visible/header-inner text in 22/160 observations. French desktop header showed `Rejoindre le pilote fondateur` duplicated. | `components/public/marketing-ui.tsx:473`, `components/public/marketing-ui.tsx:479`, and `components/public/marketing-ui.tsx:516` render desktop, tablet, and compact-menu CTAs in overlapping shell markup. | P1 |
| P1 | Homepage demo duplicate numbers | Production homepage showed visible pairs `1 1`, `2 2`, `3 3`, `4 4` in English and French, light and dark, desktop and mobile. | `app/page.tsx:300` and `app/page.tsx:314` both render `{index + 1}` inside each `ProductPreview` step. | P1 |
| P1 | French Canadian shell copy quality | Production French pages showed no-accent `Confidentialite` and `Securite` in 44 observations. | `lib/i18n/home-copy.ts:882`, `lib/i18n/home-copy.ts:883`, and related French homepage workflow strings use no-accent labels. | P1 |
| P1 | Public shell parity and crawlable text | Raw/header text duplicates exist even where CSS hides one control visually. This is a crawler/accessibility risk and fails the prompt requirement for one active primary CTA per state. | The global shell keeps multiple CTA variants mounted simultaneously across `components/public/marketing-ui.tsx:463` to `components/public/marketing-ui.tsx:520`. | P1 |
| P2 | Homepage length and repeated workflow explanation | The homepage renders a five-card workflow section and then immediately renders a separate four-step product preview/demo. This contributes to the owner-reported long-scroll/repetition issue. | `app/page.tsx:437` to `app/page.tsx:458`. | P3 |
| P2 | Grid stability at awkward widths | Feature proof uses a four-column breakpoint for a short ordered strip, which can create visually uneven row grouping at mid widths. | `app/features/page.tsx:116`. | P2 |
| P2 | Compact menu scroll containment | The compact menu intentionally uses `max-h` plus `overflow-y-auto`; this is acceptable only as a menu escape hatch and must not spread to marketing cards/sections. | `components/public/marketing-compact-menu.tsx:105`. | P2 |

## Production Samples

Representative production samples from the matrix:

- `/` English light desktop: header raw CTA count 2, header inner CTA count 1, homepage demo visible digits included two each of 1, 2, 3, and 4.
- `/` French light desktop: header raw CTA count 3, header inner CTA count 2, header showed `Rejoindre le pilote fondateur` duplication.
- `/features`, `/industries/cleaning`, `/trust`, `/demo`, `/pricing`, `/pilot`, `/content-studio`, `/privacy`, `/security`, and `/terms` French desktop also showed duplicate visible/header-inner founder-pilot CTA text.
- French routes across desktop and mobile showed no-accent `Confidentialite` and `Securite` labels.
- In the limited P0 matrix, root `scrollWidth` did not exceed `clientWidth`; overflow still needs stricter P4 automated coverage after implementation.

## Closed Work That Remains Closed

- Phase 19 through Phase 23 readiness/security/synthetic production evidence remain documented.
- Phase 24F final no-secret production smoke remains passed.
- Public-site Phase 00 through Phase 10 remain completed.
- Phase 11A through 11E public visual stability patch remains completed.
- Phase 12 public visual truth fix remains completed and deployed.
- Phase D0 dashboard design audit remains completed and pushed.

## Still Blocked

- Phase 24G explicit owner real-data approval is still open.
- Real customer data remains NO-GO.
- Paid pilot remains NO-GO.
- Billing/payment automation remains NO-GO.
- Auth/RLS/database changes remain NO-GO for public-site visual work.
- AI provider behavior changes remain NO-GO.
- Production data-flow expansion remains NO-GO.
- Dashboard D1 must not start until public acceptance P1 through P5 genuinely pass.

## Next Required Sequence

The next correct work is not dashboard D1 yet. The required sequence is:

1. P1: repair global public shell, duplicated public markup, homepage demo numbering, and French Canadian shell/localization defects.
2. P2: stabilize responsive sizing and awkward-width grid behavior.
3. P3: reduce repeated homepage workflow/scroll weight and polish conversion hierarchy without changing product claims.
4. P4: add source and smoke coverage for public acceptance defects.
5. P5: verify local and production acceptance, then record final public-site acceptance.
6. D1: start dashboard shell and lead workflow visual stabilization only after P5 is genuinely GO.

## P0 Verification

Local verification on 2026-06-21:

- `pnpm verify`: PASS.
- `pnpm lint`: PASS through `pnpm verify`.
- `pnpm typecheck`: PASS through `pnpm verify`.
- `pnpm test:unit`: PASS through `pnpm verify`, 113 tests.
- `pnpm build`: PASS through `pnpm verify`.
- `git diff --check`: PASS.

`pnpm smoke:dashboard` was not run in P0 because the canonical readiness docs explicitly reserve dashboard smoke for safe synthetic/local data contexts and prohibit running it against production-like Supabase credentials.
