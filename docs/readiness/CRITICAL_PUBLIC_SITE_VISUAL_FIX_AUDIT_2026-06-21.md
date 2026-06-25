# Critical Public Site Visual Fix Audit

Date: 2026-06-21  
Phase: C0 audit only  
Repository: `E:\bizpilot-ai`  
Production: `https://bizpilo.com`

## Scope

This audit covers the final public-site visual and copy defects reported after the previous readiness passes. No product code was changed in this phase.

Routes checked:

- `/`
- `/?language=fr-CA`
- `/features`
- `/features?language=fr-CA`
- `/industries/cleaning`
- `/industries/cleaning?language=fr-CA`
- `/trust`
- `/demo`
- `/pricing`
- `/pilot`
- `/faq`
- `/privacy`
- `/security`
- `/terms`
- `/auth/sign-in`
- `/quote/akora?language=fr-CA` with safe GET only

## Current State

- Git status before C0 was clean.
- Latest commit before C0 was `fbecf3f docs(readiness): record final global visual sizing acceptance`.
- Production HTTP checks returned `200` for the public routes above.
- Each checked production route rendered one H1.
- The prior automated checks were not enough to catch owner-visible visual, duplication, and bilingual copy defects.

## Root Causes Found

### Homepage Hero Rhythm

Production viewport measurement still shows the hero consuming most of the first fold before the Problem section begins.

- At `1280x720`, the hero block measured about `433px` tall and ended around `510px`.
- At `1366x768`, the hero block measured about `436px` tall and ended around `513px`.
- At `1440x900`, the hero block measured about `458px` tall and ended around `535px`.
- The CTA row is visible at these sizes, but the composed layout still reads too tall because the mockup height is close to the copy stack height.
- The measured mockup-to-copy height ratio was about `0.94` on the checked desktop viewports.

The issue is not only a raw CSS gap after the hero. The measured hero-to-Problem gap is effectively `0`, but the hero itself is still tall enough that the Problem section feels far away.

### Typography Scale

The current desktop production ratio between the Problem H2 and Hero H1 is too close.

- Hero H1 measured about `52.48px`.
- Problem H2 measured about `42px`.
- H2/H1 ratio is about `0.80`.

The requested visual system target is closer to `0.65` to `0.75`, with section headings clearly below the hero headline and card titles clearly below section headings.

### Cleaning Page Duplicate Service Content

Local code renders service detail content through separate desktop and mobile structures in `app/industries/cleaning/page.tsx`.

Relevant local structure:

- `cleaning-detail-desktop cleaning-detail-tabs`
- `cleaning-detail-mobile`
- six desktop tab panels
- six mobile `<details>` blocks

Production rendered text and DOM inspection confirms repeated service detail content.

At mobile width (`390x844`):

- Six service cards were visible.
- The mobile detail root was visible.
- The desktop detail root was visually hidden.
- Each service title appeared twice in visible `innerText`.
- Each service title appeared about eight times in raw `textContent` because hidden and inactive structures remain in the DOM/RSC output.

At desktop width (`1366x768`):

- Six service cards were visible.
- The desktop detail root was visible.
- The mobile detail root was visually hidden.
- Only one desktop panel was visible, but inactive panel text remains in raw DOM text.
- Each service title appeared multiple times in visible text, and about eight times in raw `textContent`.

This explains why earlier source/HTML checks could pass while owner-visible and accessibility/text-extraction defects remained.

### Cleaning Workflow Number Duplication

Local code uses an ordered list and also renders manual number badges:

- `const workflowSteps = copy.example.workflow.split(" -> ")`
- `<ol className="mt-4 grid gap-2">`
- manual badge text: `{index + 1}`

That combination can render or be announced as duplicate numbering such as `1. 1`, `2. 2`, `3. 3`. The fix should choose one numbering system only.

### Responsive Duplicate Structures

The current CSS hides alternate desktop/mobile Cleaning detail structures visually:

- `.cleaning-detail-desktop { display: none; }`
- `.cleaning-detail-mobile { display: grid; }`
- desktop media query swaps those displays.

However, both structures still exist in the DOM and source payload. The inactive tab panels also remain present. Future smoke tests must assert rendered text and accessibility exposure, not only source markers.

### fr-CA Copy

The fr-CA Features page still contains literal phrasing:

- `Suivez si la prochaine étape est répondre...`

The public copy dictionary also still contains older English phrasing:

- `prepare replies to approve`

The next copy phase must remove literal French syntax and internal/product-team wording while preserving product truth: manual-first, AI-assisted drafts, owner review, no auto-send.

### Quote Form Spacing

Safe GET checks for `/quote/akora?language=fr-CA` did not find a functional regression.

- One visible consent block was found in browser-rendered DOM.
- The honeypot was hidden.
- No horizontal overflow was measured.
- No nested scroll was measured.

The form is still dense: browser inspection found many field/helper rows in a single flow. C4 should tighten visual rhythm, helper spacing, consent spacing, and mobile grouping without changing backend submission behavior.

## Searches Completed

Local source searches covered:

- duplicated desktop/mobile blocks
- CSS counters and manual numbering risks
- missing responsive hiding patterns
- public `overflow-auto` and `overflow-y-auto`
- nested scroll risks
- fixed height and max-height patterns
- global horizontal overflow hiding
- old public copy strings
- bilingual dictionary text

Known allowed public overflow exception:

- `components/public/marketing-compact-menu.tsx` uses `overflow-y-auto` for the compact navigation menu.

## What Is Closed

- C0 orientation is complete.
- Production public routes are reachable.
- The latest commit and clean starting status were confirmed.
- The exact high-risk root causes have been identified.
- Quote route safe GET behavior did not show backend or submission changes.

## What Remains Blocked

Dashboard D1 remains blocked.

Blocking public-site defects:

- Cleaning service detail duplication.
- Cleaning workflow duplicate numbering risk.
- Homepage hero rhythm and typography mismatch.
- Remaining awkward fr-CA public copy.
- Quote form visual spacing needs a final pass.
- Automated checks need to be strengthened around rendered text and responsive DOM exposure.

## Next Correct Phase

Proceed to C1 first.

C1 must remove the Cleaning page structural duplication and fix workflow numbering before the homepage rhythm or copy polish work continues. This is the highest-risk defect because it affects rendered content, accessibility output, and visible owner review.

## C0 Verification Plan

After creating this audit file only:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:unit`
- `pnpm build`
- `git diff --check`

Then commit:

- `docs(audit): record critical public visual defects`

