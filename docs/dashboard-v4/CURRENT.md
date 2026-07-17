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
 * - 2026-07-16: Recorded the V4.6 main publication, successful Vercel rollout, and Production public read-only acceptance.
 * - 2026-07-16: Added the V4.6 ordered setup journey, two-part Guide, owner/founder source reports, tracked-link builder, and accurate public-brand preview contract.
 * - 2026-07-16: Closed the V4.5 source publication and Production public read-only acceptance record.
 * - 2026-07-16: Added the V4.5 complete navigation restoration and founder-admin access resilience contract.
 * - 2026-07-16: Closed V4.4 on main with successful Vercel and Production public read-only acceptance evidence.
 * - 2026-07-16: Added the V4.4 Quote Setup render repair, single-navigation shell, and accurate segment-retry recovery contract.
 * - 2026-07-16: Closed V4.3 on main with successful CI/Vercel and Production public read-only acceptance evidence.
 * - 2026-07-16: Added the V4.3 centered native navigation and request-scoped protected data-read contract.
 * - 2026-07-16: Closed V4.2 on main with successful CI/Vercel and Production public read-only acceptance evidence.
 * - 2026-07-16: Added the V4.2 protected-navigation, first-run Guide, and founder Business Operations polish contract.
 * - 2026-07-16: Recorded the V4.1 main release, successful CI/Vercel rollout, and Production read-only acceptance evidence.
 * - 2026-07-16: Added the V4.1 guided Quote Setup, safe local branding, approved AI knowledge, unique-link workflow, and owner preview recovery contract.
 * - 2026-07-14: Established the task-first Dashboard V4 contract and superseded the V3/P12–P28 dashboard reports.
 * ============================================================
 -->

# Dashboard V4 — Current

## Outcome

Dashboard V4.6 completes the owner operating path from first setup through source-aware reporting. Quote Setup now presents six ordered, readiness-backed stages; Guide separates setup/optimization from workflow/reporting; and the new Reports route summarizes submitted requests by safe tracked source, campaign, and manually recorded outcome. The fixed grouped sidebar still exposes every authorized route, while public branding preview and runtime now share the same accessible color rules.

## Jobs to be done

| Surface | One primary job |
| --- | --- |
| Overview | Tell the owner what to do next and show the shortest path to the lead queue. |
| Leads | Search, filter, prioritize, and open customer requests. |
| Lead Detail | Understand the request, fill information gaps, review/edit a draft, and record manual progress. |
| Reports | Compare submitted quote requests by tracked placement, campaign tag, workflow status, and manual outcome without claiming views, clicks, revenue, or automatic conversion. |
| Quote Setup | Configure services, questions, branding, approved FAQ knowledge, privacy, and the unique customer link through progressive tasks. |
| Business Profile | Maintain business identity and contact context. |
| Settings | Manage personal preferences, session visibility, audit/history, and lifecycle controls. |
| Guide | Explain first-session setup, the daily routine, route ownership, troubleshooting, and manual boundaries. |
| Founder Admin | Inspect users/workspaces/health and perform explicitly gated manual controls without presenting every sensitive form at once. |

## Information architecture

Desktop owner navigation is grouped by job: Command (Overview, Leads, Reports), Setup (Quote Setup, Business Profile), and Control (Settings, Guide). The authorized Founder Admin entry is explicit and role-gated. Mobile keeps five focused primary tasks in the bottom bar, with Reports, Guide, and Admin available through compact utilities. The `/dashboard/quote-setup` compatibility alias may redirect to the canonical `/dashboard/configuration` route; it must not create a duplicate UI.

`/dashboard/reports` is a protected owner route. It reads only the active workspace through existing RLS-scoped tables and applies a 1,000-request safety bound. `/founder` continues to perform guarded role checks and sends an authorized founder directly to `/admin`.

Quote Setup uses a six-stage journey backed by the existing eight readiness checks, followed by one horizontal task bar with seven mounted panels: Overview, Services, Form Questions, Branding, AI Instructions, Privacy, and Public Link. Deep links open the correct panel, tabs support standard keyboard movement, and every required form value stays mounted while only one task is visible.

## Interaction rules

- One visible route heading; utility chrome contains no repeated title/subtitle.
- One primary action per decision area.
- Contextual help appears only when needed or inside a disclosure.
- Mobile navigation includes Settings and respects safe-area padding.
- Menus stay within the viewport; pages avoid nested-scroll cards.
- Wide screens expose the complete grouped route map in a fixed left sidebar; the topbar contains utilities only. Tablet and mobile keep a viewport-bounded Actions disclosure and five-task bottom bar.
- Founder Admin is visible on wide screens in both the sidebar and utility area only when the signed-in email passes the existing founder authorization check.
- Protected topbar and mobile destinations use native full-page transitions. A stale client router or failed React Server Component transition must not trap the owner.
- Current-user and business-workspace reads are memoized per server render so layout and page do not repeat the same authenticated queries.
- A caught dashboard route error explains that saved workspace data is unchanged, retries the failed route segment, and offers native links to Overview, Quote Setup, and Guide.
- Server-rendered dashboard pages pass only serializable values into Client Components; dictionary formatter functions remain on the server side.
- Add Field starts empty, offers cleaning-specific starters, previews customer-facing output, and hides priority/key controls under Advanced settings.
- Branding accepts a bounded PNG/JPG/WebP selected from the owner device or a secure HTTPS URL, provides a live preview, and applies the saved logo/colors to the public quote page.
- Branding states exactly where primary and accent colors appear, notes that protected dashboard colors are unaffected, uses WCAG-derived foreground/focus colors, and carries the saved identity through the public success page.
- The full unique business URL is visible and copyable. `Save & preview` first saves owner choices and synchronizes the derived public link, consent version, and intake form.
- An owner preview that is not ready returns to Quote Setup with an actionable explanation; anonymous visitors still receive a tenant-safe unavailable state and a marketing-site return.
- Saved FAQs, services, and service areas are the only approved business-knowledge inputs added to AI draft context. Missing facts stay missing and every draft remains owner-reviewed.
- Owner-facing controls either work or are absent. Editing the AI draft is real local editing; non-persisted owner scratchpads are removed.
- The Public Link panel builds privacy-safe variants for website, Google Business Profile, social, messaging, email, saved replies, and custom placements using the existing attribution allowlist.
- Public submission rebuilds attribution from that same allowlist and keeps safe placement tags through validation retries; arbitrary posted source URLs are not trusted.
- Safe starter services, FAQs, colors, and consent remain editable examples; new workspaces do not mark those tasks complete until the owner reviews and saves setup.
- Business Profile confirms only its identity readiness responsibility; Quote Setup confirms only its seven setup responsibilities, while invalid saved data can still reopen a previously completed task. Save outcomes return to the owning route.
- Reports counts submitted quote requests only. Direct and Unknown stay visible; no profile views, clicks, revenue, or automatic conversions are inferred.
- Owner Reports supports 7-, 30-, 90-day, and all-time filters; source metadata reads are batched in groups of 200 below the 1,000-request bound. Founder Admin receives a bounded cross-workspace aggregate while retaining the detailed inbox.
- Guide has two explicit bilingual parts: Setup and optimization, then Workflow and reporting. It shows live readiness, first-session actions, launch checks, tracked-source guidance, daily routine, route map, boundaries, and troubleshooting.
- Founder Business Operations keeps the workspace snapshot and recommended priority visible while access/plan/quote controls, workspace tools, and sensitive tools open on demand. No guarded capability is removed.
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

Dashboard V4.6 uses the existing `leads.source_channel` and `lead_source_metadata` schema and adds no migration. Owner reporting remains tenant-scoped through RLS; founder aggregation remains founder-gated and bounded. It adds no external upload service, direct social integration, autonomous action, real-customer-data approval, or paid-pilot approval. Founder cleanup and lifecycle controls retain their confirmation and authorization guards.

## Verification status

The published V4.6 release passes all `272/272` unit/source tests, ESLint with zero warnings, TypeScript, and the Next.js 16.2.4 production build. The exact verified tree `43ced7bc8e1914a72366bb1b8581ae4afcc02846` is on `main` at `b2ca255ec45b4ebf015603017728b0a5e5ce8c15`; Vercel reported success at target `BhNUwzTNx2RmLnwXKrjbVZioAxU9`. Local and Production public routes pass `46/46`, bilingual responsive routes pass `20/20`, the Production UI matrix passes `621/621`, and inactive Quote GET passes `2/2` in EN/fr-CA without a submission or data mutation. No active synthetic Quote slug was supplied, so no active-form submission result is claimed.

Authenticated browser smoke still requires an approved local/synthetic auth target. Source, type, build, and public GET evidence do not substitute for owner-authenticated visual confirmation of protected screens.

See `PHASE_PROGRESS.md` for exact completion evidence and remaining gates.
