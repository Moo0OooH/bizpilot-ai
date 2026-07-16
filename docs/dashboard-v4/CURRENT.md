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
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Recorded the V4.1 main release, successful CI/Vercel rollout, and Production read-only acceptance evidence.
 * - 2026-07-16: Added the V4.1 guided Quote Setup, safe local branding, approved AI knowledge, unique-link workflow, and owner preview recovery contract.
 * - 2026-07-14: Established the task-first Dashboard V4 contract and superseded the V3/P12–P28 dashboard reports.
 * ============================================================
 -->

# Dashboard V4 — Current

## Outcome

Dashboard V4.1 completes the simplification and reliability release with a guided Quote Setup workflow. It removes repeated guidance, decorative analytics, hidden mobile destinations, and no-op controls while making the customer quote link, branding, questions, and AI knowledge understandable without technical setup knowledge.

## Jobs to be done

| Surface | One primary job |
| --- | --- |
| Overview | Tell the owner what to do next and show the shortest path to the lead queue. |
| Leads | Search, filter, prioritize, and open customer requests. |
| Lead Detail | Understand the request, fill information gaps, review/edit a draft, and record manual progress. |
| Quote Setup | Configure services, questions, branding, approved FAQ knowledge, privacy, and the unique customer link through progressive tasks. |
| Business Profile | Maintain business identity and contact context. |
| Settings | Manage personal preferences, session visibility, audit/history, and lifecycle controls. |
| Guide | Explain the manual operating model as secondary help. |
| Founder Admin | Inspect users/workspaces/health and perform explicitly gated manual controls. |

## Information architecture

Primary owner navigation is exactly five destinations: Overview, Leads, Quote Setup, Business Profile, and Settings. The Operating Guide is a secondary link. The `/dashboard/quote-setup` compatibility alias may redirect to the canonical `/dashboard/configuration` route; it must not create a duplicate UI.

No new application route was added in this release. `/founder` now performs guarded role checks and sends an authorized founder directly to `/admin`.

Quote Setup uses one horizontal task bar with seven mounted panels: Overview, Public Link, Services, Form Questions, Branding, AI Instructions, and Privacy. The panel system keeps every required form value mounted while showing only one owner task at a time. It must not reintroduce a nested left sidebar.

## Interaction rules

- One visible route heading; utility chrome contains no repeated title/subtitle.
- One primary action per decision area.
- Contextual help appears only when needed or inside a disclosure.
- Mobile navigation includes Settings and respects safe-area padding.
- Menus stay within the viewport; pages avoid nested-scroll cards.
- The desktop Actions menu opens into the content column and never beneath the fixed sidebar.
- Add Field starts empty, offers cleaning-specific starters, previews customer-facing output, and hides priority/key controls under Advanced settings.
- Branding accepts a bounded PNG/JPG/WebP selected from the owner device or a secure HTTPS URL, provides a live preview, and applies the saved logo/colors to the public quote page.
- The full unique business URL is visible and copyable. `Save & preview` first saves owner choices and synchronizes the derived public link, consent version, and intake form.
- An owner preview that is not ready returns to Quote Setup with an actionable explanation; anonymous visitors still receive a tenant-safe unavailable state and a marketing-site return.
- Saved FAQs, services, and service areas are the only approved business-knowledge inputs added to AI draft context. Missing facts stay missing and every draft remains owner-reviewed.
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

Dashboard V4.1 applies presentation, validation, and existing-record synchronization only. It adds no migration, external upload service, autonomous integration, real-customer-data access, or paid-pilot approval. Local logos are resized in the browser and stored only after the authenticated owner submits Quote Setup. Founder cleanup and lifecycle controls retain their confirmation and authorization guards.

## Verification status

Dashboard V4.1 release SHA `510043f8f5d6985e26aa5db52989f6b6806b009c` is on `main`. GitHub CI run `29524786852` and Vercel target `9dK6XxKYcGM6TiMHBng2DwDY4pRZ` succeeded. Production read-only acceptance passed public routes `46/46`, bilingual responsive routes `20/20`, the final UI matrix with zero failures, and inactive Quote GET `2/2` in EN/fr-CA.

Source contracts, localization shape, TypeScript, lint, unit tests, production build, and bilingual public/responsive smoke are complete. Authenticated browser smoke additionally requires an approved local/synthetic auth target; absence of that target remains an environment gate and was not silently skipped or run against Production.

See `PHASE_PROGRESS.md` for exact completion evidence and remaining gates.
