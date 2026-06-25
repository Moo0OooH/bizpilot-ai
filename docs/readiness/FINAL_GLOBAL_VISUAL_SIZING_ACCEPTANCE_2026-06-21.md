# Final Global Visual Sizing Acceptance

Date: 2026-06-25

Scope: Final public-site sizing, rhythm, typography, Cleaning duplication, quote form, auth shell, and multi-resolution visual acceptance before any Dashboard D1 work.

This pass did not change Dashboard D1, database schema, migrations, RLS, auth behavior, AI provider behavior, billing/payment automation, customer data flows, real data access, or pricing amounts.

## R5 Changes

- Added final visual acceptance guards to the final UI matrix smoke for homepage visual hooks, stale CTA artifacts, and six-card grid compression.
- Added source-level guards for homepage visual hooks, six-card grids, and nested marketing-card scroll traps.
- Removed the pilot request fallback template preview's internal scroll cap so the public card expands naturally.
- Shortened the first pricing plan highlight labels to fit 320px badge budgets:
  - EN: `Feedback required`
  - fr-CA: `Commentaires requis`

## Command Verification

All checks passed on the final local production build:

| Check | Result |
| --- | --- |
| `pnpm verify` | PASS |
| `pnpm smoke:public -- --base-url=http://127.0.0.1:3001 --timeout-ms=20000` | PASS |
| `pnpm smoke:responsive -- --base-url=http://127.0.0.1:3001 --timeout-ms=20000` | PASS |
| `pnpm smoke:quote -- --base-url=http://127.0.0.1:3001 --inactive-slug=phase1-unavailable-synthetic --timeout-ms=20000` | PASS |
| `pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3001 --timeout-ms=20000` | PASS |
| `git diff --check` | PASS |

`smoke:ui-matrix` covers localized route contracts, auth noindex boundaries, internal/external link rules, metadata, sitemap, robots, Cleaning de-duplication markers, pricing CTA anchoring, and missing-copy/stale-control artifacts.

## Browser Visual Matrix

Rendered browser matrix: 640 checks, 0 failures, 0 light/dark geometry drift findings.

Routes checked:

- `/`
- `/features`
- `/industries/cleaning`
- `/trust`
- `/demo`
- `/pricing`
- `/pilot`
- `/faq`
- `/content-studio`
- `/privacy`
- `/security`
- `/terms`
- `/auth/sign-in`
- `/auth/sign-up`
- `/auth/forgot-password`
- `/quote/akora?language=fr-CA`
- `/quote/phase1-unavailable-synthetic`

Languages: `en`, `fr-CA`

Themes: `light`, `dark`

Viewports:

- `320x568`
- `360x800`
- `390x844`
- `430x932`
- `768x1024`
- `1024x768`
- `1280x720`
- `1366x768`
- `1440x900`
- `1920x1080`

Assertions measured:

- No horizontal page overflow.
- No visible nested marketing-card scroll traps.
- Homepage hero CTA visible at `1280x720` and `1366x768`.
- No giant homepage hero bottom whitespace.
- Homepage hero mockup stayed within accepted visual ratio.
- Section headings did not exceed page/hero title scale.
- Six-card sections never rendered more than three columns.
- Cleaning rendered six service cards and six detail panels with no old service groups.
- Quote honeypot stayed hidden.
- Quote consent block appeared once on the active quote form.
- Header/buttons/badges avoided measurable clipping after the pricing label fix.
- Auth pages had no marketing utility controls.
- Light and Dark geometry stayed stable.
- No missing-copy artifacts, stale raw header controls, duplicated CTA artifacts, or duplicated homepage demo grid.

Key evidence:

| Surface | Evidence |
| --- | --- |
| Homepage fr-CA dark `1280x720` | CTA visible; horizontal overflow `0`; hero bottom whitespace `20px`; hero-to-Problem gap `0px`; mockup ratio `0.512`; H2/H1 ratio `0.800`. |
| Homepage fr-CA dark `1366x768` | CTA visible; horizontal overflow `0`; hero bottom whitespace `22px`; hero-to-Problem gap `0px`; mockup ratio `0.480`; H2/H1 ratio `0.800`. |
| Cleaning fr-CA dark `1366x768` | Six service cards; six detail panels; row counts `[3, 3]`; max columns `3`; old groups `0`; horizontal overflow `0`. |
| Quote fr-CA dark `390x844` | One consent block; one honeypot input; honeypot hidden; nested scroll `0`; horizontal overflow `0`. |

## Required Answers

1. Is homepage hero balanced?
   Yes. Browser evidence shows the CTA visible at both target desktop folds, small bottom whitespace, and a mockup ratio below the accepted threshold.

2. Is hero-to-Problem spacing fixed?
   Yes. The measured hero-to-Problem gap was `0px` at the target desktop viewports, with only normal section padding remaining.

3. Is typography scale consistent?
   Yes. Public pages use canonical `bp-*` sizing primitives, and rendered browser checks found no section heading exceeding the page/hero title scale.

4. Is Cleaning duplication removed?
   Yes. The page renders six compact service cards, one shared desktop detail selector with six panels, mobile details, and no old Homes/Moves/Commercial family groups.

5. Is quote form clean?
   Yes. The active synthetic quote form rendered with one consent block, a hidden honeypot, no horizontal overflow, and no nested scroll.

6. Is EN/fr-CA stable?
   Yes. The browser matrix and CLI smokes covered both languages across public, auth, and quote surfaces.

7. Is Dark mode acceptable?
   Yes for local acceptance. Light/Dark browser geometry drift count was `0`, and dark-theme smokes/browser checks passed.

8. Are all target viewports checked?
   Yes. All ten requested viewport sizes were rendered in the browser matrix.

9. Does production match latest commit?
   Pending at document-authoring time. This acceptance document must be committed, pushed, and verified on Vercel before the final answer marks production as matching the latest commit.

10. Is Dashboard D1 GO or NO-GO?
    NO-GO. Dashboard D1 must not start from this phase alone. The next correct phase is post-push production deployment verification plus owner-visible review of the public pages; only after owner approval should Dashboard D1 be considered.

## Final Gate

Local R5 visual acceptance is PASS. Dashboard D1 remains blocked until the pushed production deployment for this acceptance commit is verified and the owner completes visible public-page review.
