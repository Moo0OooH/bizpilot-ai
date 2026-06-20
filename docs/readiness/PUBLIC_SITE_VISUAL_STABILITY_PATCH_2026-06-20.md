# Public Site Visual Stability Patch - 2026-06-20

## Decision

**GO to verify and deploy the final public-site visual stability patch before dashboard redesign work.**

This patch does not approve real customer data, paid-pilot launch, dashboard redesign, billing automation, AI provider changes, auth changes, database changes, RLS changes, or production data-flow changes.

## Scope

This patch closes the owner review follow-up after the final pre-dashboard public-site readiness report. It is limited to public UI/UX stability, responsive consistency, EN/fr-CA layout parity, and dashboard-readiness handoff.

Surfaces covered:

- Public marketing grids and wrapping primitives
- Compact public navigation menu
- Shared theme preference menu
- Source-level visual stability contracts
- Local browser viewport checks on public routes

## Product Truth Preserved

- BizPilot AI remains manual-first and cleaning-first.
- AI drafts; the owner reviews, edits, copies, and sends manually.
- No auto-send, SMS/WhatsApp automation, booking confirmation, invoicing, full CRM claim, invented pricing, guaranteed revenue, or broad multi-industry launch claim was added.

## Implementation Summary

- Public text wrapping now uses `overflow-wrap: anywhere` to prevent long EN/fr-CA strings from forcing horizontal overflow.
- Public card/grid children now receive `min-width: 0` so long copy cannot blow out CSS grid tracks.
- Equal-height grid forcing was removed from content-driven public grids by replacing `grid-auto-rows: 1fr` with stretch alignment where appropriate.
- The compact marketing menu uses a viewport-safe width: `min(calc(100vw - 2rem), 22rem)`.
- The shared theme menu uses a viewport-safe width: `min(15rem, calc(100vw - 2rem))`.
- The compact navigation trigger now uses `aria-haspopup="menu"`.
- A source contract test was added to protect against public overflow masking, viewport-width traps, forced grid row heights, unsafe menu widths, and fr-CA theme label mojibake.

## Local Browser Evidence

Browser checks were run against the local production server on `http://127.0.0.1:3000`.

Viewport matrix:

- Viewports: `320x568`, `390x844`, `844x390`, `1280x720`
- Routes: `/`, `/?language=fr-CA`, `/features?language=fr-CA`, `/pricing?language=fr-CA`, `/pilot?language=fr-CA`
- Result: `20` route/viewport checks, `0` visual stability failures

Checked for:

- `documentElement.scrollWidth <= clientWidth`
- `body.scrollWidth <= clientWidth`
- one H1 per route
- `main` present
- no elements protruding beyond the viewport
- no nested scroll containers inside public main content

Explicit EN narrow-mobile checks:

- `/?language=en`
- `/features?language=en`
- `/pricing?language=en`
- `/pilot?language=en`

Result: all rendered `lang="en"`, one H1, and no horizontal overflow at `320x568`.

Theme/menu interaction evidence:

- Mobile compact menu at `390x844` stayed within the effective viewport: `clientWidth=375`, `scrollWidth=375`, menu width about `352px`.
- Switching theme through the fr-CA theme menu from Dark to Light kept header dimensions, menu dimensions, and page scroll width unchanged.
- The theme menu exposed the expected fr-CA choices: Light, Dark, and device setting.

## Verification

Final required verification for this patch:

| Command | Result |
| --- | --- |
| `git status --short` | PASS: only scoped patch files changed before commit |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test:unit` | PASS: 111 tests |
| `pnpm build` | PASS |
| `pnpm smoke:public` | PASS |
| `pnpm smoke:responsive` | PASS |
| `pnpm smoke:quote -- --inactive-slug=phase1-unavailable-synthetic` | PASS |
| `pnpm smoke:ui-matrix -- --en-quote-url=http://127.0.0.1:3000/quote/phase1-unavailable-synthetic --fr-quote-url=https://bizpilo.com/quote/akora?language=fr-CA` | PASS: extra local/public matrix |
| `git diff --check` | PASS |

## Dashboard Handoff

Dashboard redesign is still not started. The dashboard work may proceed only after this public-site visual stability patch is committed, pushed, deployed, and production-checked.

## Remaining Risks

- The homepage body has known Phase 1 legacy hardcoded English areas when language routing is not explicitly active; do not treat this patch as a full bilingual marketing rewrite beyond the already completed public-site localization work.
- Active fr-CA production quote submission is still not performed here. Production quote validation remains safe GET only unless an approved synthetic active slug and owner approval are provided.
- Real customer data and paid-pilot operations remain gated by their separate readiness approvals.
