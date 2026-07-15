<!--
 * ============================================================
 * File: docs/dashboard-v4/CURRENT.md
 * Project: BizPilot AI
 * Description: Current Dashboard V4 product, information architecture, and UX contract.
 * Role: Controls protected owner and founder dashboard decisions after the July 2026 simplification pass.
 * Related:
 * - app/(dashboard)/dashboard/page.tsx
 * - app/(dashboard)/dashboard/leads/page.tsx
 * - app/(dashboard)/dashboard/leads/[leadId]/page.tsx
 * - app/admin/page.tsx
 * - docs/dashboard-v4/PHASE_PROGRESS.md
 * Author: MoOoH
 * Created: 2026-07-14
 * Last Updated: 2026-07-14
 * Change Log:
 * - 2026-07-14: Established the task-first Dashboard V4 contract and superseded the V3/P12–P28 dashboard reports.
 * ============================================================
 -->

# Dashboard V4 — Current

## Outcome

Dashboard V4 is a simplification and reliability release, not a new product expansion. It removes repeated guidance, decorative analytics, hidden mobile destinations, and no-op controls while preserving every safe owner workflow.

## Jobs to be done

| Surface | One primary job |
| --- | --- |
| Overview | Tell the owner what to do next and show the shortest path to the lead queue. |
| Leads | Search, filter, prioritize, and open customer requests. |
| Lead Detail | Understand the request, fill information gaps, review/edit a draft, and record manual progress. |
| Quote Setup | Configure what customers are asked and when the public link is ready to share. |
| Business Profile | Maintain business identity and contact context. |
| Settings | Manage personal preferences, session visibility, audit/history, and lifecycle controls. |
| Guide | Explain the manual operating model as secondary help. |
| Founder Admin | Inspect users/workspaces/health and perform explicitly gated manual controls. |

## Information architecture

Primary owner navigation is exactly five destinations: Overview, Leads, Quote Setup, Business Profile, and Settings. The Operating Guide is a secondary link. The `/dashboard/quote-setup` compatibility alias may redirect to the canonical `/dashboard/configuration` route; it must not create a duplicate UI.

No new application route was added in this release. `/founder` now performs guarded role checks and sends an authorized founder directly to `/admin`.

## Interaction rules

- One visible route heading; utility chrome contains no repeated title/subtitle.
- One primary action per decision area.
- Contextual help appears only when needed or inside a disclosure.
- Mobile navigation includes Settings and respects safe-area padding.
- Menus stay within the viewport; pages avoid nested-scroll cards.
- Owner-facing controls either work or are absent. Editing the AI draft is real local editing; non-persisted owner scratchpads are removed.
- The manual workflow and attribution/routing detail remain available inside disclosures.
- AI is bounded draft assistance. No automatic send, booking, price, availability, or autonomous decision is implied.

## Visual system

- Protected content measure: `90rem` maximum.
- Native UI font stack; no route-wide webfont request or text-LCP swap.
- Semantic light/dark tokens, visible focus, minimum practical control sizes, concise cards, and responsive grids.
- Typography hierarchy favors 20–32px route/section headings, 13–16px operational body text, and 11–12px metadata only.
- Color communicates priority but is never the sole status signal.

## Localization

English and Canadian French use the central `getBizPilotCopy` dictionary. Route/component language branches and visible admin literals are prohibited. French owner/admin copy must keep natural accents and equivalent manual-first claims. Language changes persist through the existing workspace action and preserve the current route.

## Data and security posture

Dashboard V4 changes presentation and safe local editing only. It does not apply a migration, mutate Production data, enable an integration, open real-customer-data access, or approve a paid pilot. Founder cleanup and lifecycle controls retain their confirmation and authorization guards.

## Verification status

Source contracts, localization shape, TypeScript, lint, unit tests, and production build are required for completion. Authenticated browser smoke additionally requires an approved local/synthetic auth target; absence of that target must be reported as an environment gate rather than silently skipped or run against Production.

See `PHASE_PROGRESS.md` for exact completion evidence and remaining gates.
