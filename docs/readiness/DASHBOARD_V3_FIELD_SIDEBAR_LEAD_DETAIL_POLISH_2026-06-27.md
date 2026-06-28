# Dashboard V3 Field, Sidebar, and Lead Detail Polish - 2026-06-27

## Scope

This pass closes the owner-dashboard UX issues reported after the operational viewport polish:

- Quote Setup field creation was too abstract and did not show type-specific examples.
- The owner sidebar had a confusing lower utility block with repeated quote-link/status/plan/workspace labels.
- Lead detail stacked too many operational panels vertically on desktop, making review feel long and unfriendly.

## Changes Completed

### Quote Setup Field Builder

- Added field-type-specific placeholders and live samples for text, textarea, email, phone, number, boolean, date, radio, select, and time-window fields.
- Added French-aware fallback examples so the same builder remains useful when the workspace language is fr-CA.
- Split the add-field area into a practical form column and a contextual sample column.
- Choice field samples now show different examples per type:
  - Radio: furnished home yes/no/partial sample.
  - Select: property type sample.
  - Time window: morning/afternoon/evening sample.

### Owner Sidebar

- Removed the lower quote/status/plan utility card from the sidebar.
- Removed the repeated `Copy quote link`, `Active`, `Plan`, `Pilot`, and generic `Workspace` labels from the navigation rail.
- Kept the sidebar focused on navigation and a compact account identity footer.
- Removed the desktop sidebar's unnecessary internal vertical scroll.

### Lead Detail

- Converted the desktop lead-review layout to a wider operational grid with the AI support rail beside the lead content at `xl` sizes.
- Reduced stacked-card spacing and tightened the manual workflow, identity, intake, missing-info, routing, controls, notes, action items, and timeline panels.
- Changed the long submitted-field list into a bounded internal scroll region with a three-column desktop grid.
- Bounded long AI draft/reply content inside its own scroll region instead of stretching the whole page.

### Dashboard Canvas

- Increased the shared dashboard max width from `90rem` to `108rem` so dense operational pages can use desktop screens better without forcing cramped columns.

## Acceptance Evidence

- `pnpm lint` passed.
- `pnpm typecheck` passed.
- `pnpm test:unit` passed: 165 tests, 31 suites, 0 failures.
- `pnpm build` passed.
- `pnpm verify` passed.

## Notes

- Browser QA confirmed the owner Quote Setup page and lead detail route avoid document-level horizontal/vertical overflow; remaining scrolling is confined to the dashboard work area or bounded long-content panels.
- This pass does not change pricing, plan behavior, auth, tenant boundaries, or database policy.
