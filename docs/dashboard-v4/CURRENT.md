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
 * - app/(dashboard)/dashboard/operations/page.tsx
 * - app/admin/page.tsx
 * - supabase/migrations/0026_premium_operations_schedule_integrity.sql
 * - docs/dashboard-v4/PHASE_PROGRESS.md
 * Author: MoOoH
 * Created: 2026-07-14
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Recorded the merged `6fd1f96` Premium Operations release, Production schema/deployment, and final read-only acceptance.
 * - 2026-07-22: Closed the ordered disposable/restore database, RLS, concurrency, authenticated Operations/Admin, and EN/fr-CA intake gates ahead of exact-commit publication.
 * - 2026-07-22: Recorded exhaustive Persian owner-route coverage, its checked-in `1,000`-value map, and exact protected-value inventory.
 * - 2026-07-22: Recorded complete reviewed Arabic owner-route coverage and the exact protected fallback inventory.
 * - 2026-07-22: Added the hardened Premium Operations candidate, canonical exact-time/Toronto contract, founder entitlement controls, public-catalog boundary, current runtime, and ordered `0025` + `0026` release gates.
 * - 2026-07-21: Added the separately sold Premium Operations route, five-language protected interface scope, RTL/numeric-input contract, and manual-review-only coordination boundary; separated V4.7 local-Git evidence from unverified remote/deployment claims and recorded the `0025` release gate.
 * - 2026-07-17: Added the V4.7 responsive shell, configurable public-form structure, optional navigation visibility, and Google OAuth workspace-safety contract.
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

The historical Dashboard V4.7 intake work completes the owner-controlled intake experience without a database migration. Quote Setup lets an owner name and describe the public form, create and order sections, assign each question to a section, hide optional sections safely, and choose list, tab, or guided multi-step presentation. The protected shell keeps authorized destinations in one predictable place, prevents fixed controls from covering content, and lets each signed-in owner show or hide optional Reports and Guide navigation. Google sign-in can repair an existing approved workspace but cannot silently create a new tenant through the recovery path.

Premium Operations is a separately gated release on `main`. It requires `0025_premium_operations_addons.sql` followed by additive hardening migration `0026_premium_operations_schedule_integrity.sql`; it is not covered by the historical V4.7 no-migration claim. Ordered disposable and current-export restore proof passes RLS `14/14`, seven concurrency pairs, authenticated dashboard/Admin `17/17`, active EN/fr-CA quote GET `2/2`, and independent localized submissions. PR #11 merged as `6fd1f96`; Production migrations, main CI, Vercel deployment, public `16/16`, and authorized protected read-only acceptance pass without activating an entitlement.

## Jobs to be done

| Surface | One primary job |
| --- | --- |
| Overview | Tell the owner what to do next and show the shortest path to the lead queue. |
| Leads | Search, filter, prioritize, and open customer requests. |
| Lead Detail | Understand the request, fill information gaps, review/edit a draft, and record manual progress. |
| Premium Operations | Use separately entitled priority filters, manager-reviewed group drafts, and internal availability coordination without automatic delivery or booking. |
| Reports | Compare submitted quote requests by tracked placement, campaign tag, workflow status, and manual outcome without claiming views, clicks, revenue, or automatic conversion. |
| Quote Setup | Configure services, questions, branding, approved FAQ knowledge, privacy, and the unique customer link through progressive tasks. |
| Business Profile | Maintain business identity and contact context. |
| Settings | Manage personal preferences, session visibility, audit/history, and lifecycle controls. |
| Guide | Explain first-session setup, the daily routine, route ownership, troubleshooting, and manual boundaries. |
| Founder Admin | Inspect users/workspaces/health and perform explicitly gated manual controls without presenting every sensitive form at once. |

## Information architecture

Desktop owner navigation is grouped by job: Command (Overview, Leads, Reports), Setup (Quote Setup, Business Profile), and Control (Settings, Guide). The authorized Founder Admin entry is explicit and role-gated. Mobile keeps five focused primary tasks in the bottom bar, with Reports, Guide, and Admin available through compact utilities. The `/dashboard/quote-setup` compatibility alias may redirect to the canonical `/dashboard/configuration` route; it must not create a duplicate UI.

`/dashboard/reports` is a protected owner route. It reads only the active workspace through existing RLS-scoped tables and applies a 1,000-request safety bound. `/dashboard/operations` is protected and presents only the modules entitled for that workspace. `/founder` continues to perform guarded role checks and sends an authorized founder directly to `/admin`, where an authorized founder can explicitly enable or disable supported add-ons through the audited service-role path.

Quote Setup uses a six-stage journey backed by the existing eight readiness checks, followed by one horizontal task bar with seven mounted panels: Overview, Services, Form Questions, Branding, AI Instructions, Privacy, and Public Link. Deep links open the correct panel, tabs support standard keyboard movement, and every required form value stays mounted while only one task is visible. Form Questions includes the versioned public-form structure editor; its layout and question-to-section assignments persist inside the existing template-settings and intake-field metadata envelopes for backward compatibility.

## Interaction rules

- One visible route heading; utility chrome contains no repeated title/subtitle.
- One primary action per decision area.
- Contextual help appears only when needed or inside a disclosure.
- Mobile navigation includes Settings and respects safe-area padding.
- Sticky tabs and fixed save controls stay inside the viewport, reserve enough content space, and remain above the mobile navigation without covering fields or actions.
- Menus stay within the viewport; pages avoid nested-scroll cards.
- Wide screens expose the complete grouped route map in a fixed left sidebar; the topbar contains utilities only. Tablet and mobile keep a viewport-bounded Actions disclosure and five-task bottom bar.
- Founder Admin is visible once in the wide-screen sidebar and once inside compact Actions only when the signed-in email passes the server-only founder authorization check.
- Settings can hide or restore the optional Reports and Guide destinations for the current browser; core operating routes and authorized Founder Admin can never be hidden by this preference.
- Protected topbar and mobile destinations use native full-page transitions. A stale client router or failed React Server Component transition must not trap the owner.
- Current-user and business-workspace reads are memoized per server render so layout and page do not repeat the same authenticated queries.
- A caught dashboard route error explains that saved workspace data is unchanged, retries the failed route segment, and offers native links to Overview, Quote Setup, and Guide.
- Server-rendered dashboard pages pass only serializable values into Client Components; dictionary formatter functions remain on the server side.
- Add Field starts empty, offers cleaning-specific starters, previews customer-facing output, and hides priority/key controls under Advanced settings.
- Public form structure owns the customer-facing heading that previously appeared as the fixed “What kind of cleaning?” copy. Owners can create up to eight ordered bilingual-ready sections, label their navigation, add descriptions, assign questions, and choose list, tabs, or guided steps.
- A hidden section cannot strand required inputs: its questions are excluded from the synchronized public intake, and at least one visible section is always retained.
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

## Premium Operations add-ons

`/dashboard/operations` is a protected, separately sold Premium Operations route. It has three independently entitled modules: Priority Workbench for owner-defined priority search, Bulk Reply Review for manager-reviewed group drafts, and Availability Coordination for internal time blocks and exact-time conflict drafts. None is included automatically in a base plan.

Priority Workbench keeps every lead visible while ordering rule matches first, and supports explicit search, service, area, status, and requested-date narrowing. Selection for a bulk draft is limited to the visible eligible audience so a filter change cannot silently submit hidden recipients. Bulk Reply Review creates its parent draft and recipient snapshots atomically, limits a batch to `50` non-terminal leads, requires manager review, and records manual copy only after clipboard success.

Availability Coordination uses the canonical template-linked `preferred_time` field with the real database type `time` when the add-on is active. It combines that time with `preferred_date`, interprets all local schedule values in the fixed `America/Toronto` operating timezone, stores instants in UTC, and rejects nonexistent or ambiguous daylight-saving values. Active internal time blocks cannot overlap. An availability draft captures request/submission/conflict/suggestion provenance and must still be current at manager review and manual copy; a changed lead, request, entitlement, conflict, opening, or workspace lifecycle fails closed.

The route remains manual-first. A group reply is never delivered by BizPilot, and an availability response stays an editable manager-reviewed draft until a user copies it into an external channel. Internal time blocks are coordination records only; they do not expose a public calendar, create a booking, confirm an appointment, take payment, or replace a CRM. Public Product/Pricing copy may identify these as optional separately priced add-ons, but no add-on amount is quoted and founder activation remains a separate deliberate action.

## Visual system

- Protected content measure: `90rem` maximum.
- Native UI font stack; no route-wide webfont request or text-LCP swap.
- Semantic light/dark tokens, visible focus, minimum practical control sizes, concise cards, and responsive grids.
- Typography hierarchy favors 20–32px route/section headings, 13–16px operational body text, and 11–12px metadata only.
- Color communicates priority but is never the sole status signal.

## Localization

English and Canadian French public/business content use the central `getBizPilotCopy` dictionary. The protected shell and Premium Operations route use the isolated `dashboard-interface.ts` contract, while the legacy protected route hierarchy uses `dashboard-legacy-interface.ts`, for English, Canadian French, Persian, Arabic, and Spanish. Persian and Arabic each have a checked-in reviewed map of `1,000` exact owner-interface values. Each exhaustive regression permits exactly `119` unchanged unique values (`162` rendered occurrences), all limited to routes, machine identifiers, Latin numeric fixtures, sample identities, or customer/business-language and AI draft content that the dashboard locale must not rewrite. Spanish has the same no-unexpected-fallback contract. The dashboard preference must not change public quote content or AI/business language.

Persian and Arabic render dashboard layout and interface text RTL. Date/time, numeric, phone, and other structured technical inputs remain English/Latin LTR so values such as `09:30` retain their hour/minute order. Customer-provided text remains unaltered. Route/component language branches and visible admin literals are prohibited; dictionary changes must preserve equivalent manual-first claims.

## Data and security posture

The historical V4.7 intake work uses the existing `leads.source_channel`, `lead_source_metadata`, `business_template_settings.field_overrides`, and `intake_form_fields.options` storage and adds no migration. Premium Operations instead has the ordered source-only sequence `0025_premium_operations_addons.sql` then additive `0026_premium_operations_schedule_integrity.sql`; target state must be read-only reconciled before any separately approved apply. The pair provides tenant-scoped entitlements and records, explicit grants/RLS, lifecycle checks, immutable review/copy transitions, transactional draft creation, exact-time provenance, conflict serialization, and audited founder entitlement changes. Owner reporting remains tenant-scoped through RLS; founder aggregation remains founder-gated and bounded. Founder authorization stays in the server-only `BIZPILOT_FOUNDER_EMAILS` environment value and is never embedded in client source. Google OAuth keeps login-only scopes, accepts only exact safe callback destinations, and cannot create a new workspace through the generic recovery action. Neither source change approves an external upload service, direct social integration, autonomous action, real-customer-data handling, paid-pilot activation, or a Production database operation.

## Verification status

Local Git verifies that historical V4.7 commit `d9e25bbf50ccf42de2da4d70aa235ab7d289dc91` is present with tree `17d6b65cc9fb196c8d0d4ccaa46f5fd6f736076d`; the previously documented `a82af72bf8960b2bce1583e6446abca706c2a2bc` object is absent. This document therefore does not infer a matching remote publication, GitHub CI run, Vercel deployment, or Production acceptance from local object identity. Any older external identifiers are historical references only until revalidated from a freshly fetched remote ref and a release-specific evidence record.

The current Premium Operations candidate targets Node `>=24 <25`, pnpm `10.34.5`, Next.js `16.2.11`, and React / React DOM `19.2.7`. Exact-tree local evidence passes: frozen install; full and Production dependency audits with zero vulnerabilities; lint; typecheck; `359/359` unit/source tests; static RLS/grant audit with zero missing or overbroad grants; production build; public `46/46`; responsive `20/20`; UI matrix with zero failures; inactive Quote `2/2`; and image optimizer HTTP 200. Standalone browser interaction remains environment-gated because Chrome/Chromium is unavailable. Database-backed RLS proof requires `0025` then `0026` on an approved local/disposable target; the runner failed closed before connection when `DATABASE_URL` was absent, and no managed Supabase or Production database was contacted. GitHub CI, Vercel preview/Production deployment, live public acceptance, and authenticated dashboard acceptance remain independent gates.

Authenticated browser smoke still requires an approved local/synthetic auth target and a compatible browser runner. Source, type, build, and public GET evidence do not substitute for owner-authenticated visual confirmation of protected screens.

See `PHASE_PROGRESS.md` for exact completion evidence and remaining gates.
