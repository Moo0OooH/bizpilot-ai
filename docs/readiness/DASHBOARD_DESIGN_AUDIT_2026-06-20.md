# Dashboard Design Audit - 2026-06-20

## Decision

Status: GO to plan dashboard visual implementation, NO-GO for real customer data, paid pilot launch, billing automation, auth/RLS/database changes, AI provider changes, or production data-flow expansion.

This D0 phase is audit-only. No dashboard code, schema, auth, RLS, billing, AI provider, or data-flow implementation is approved by this document.

Latest audited HEAD:

```text
ee5dc674c908e794268e86469acfd7b7fcdd63c2
docs(release): record public site visual truth verification
```

## Sources Read

- `docs/product/BIZPILOT_FINAL_PUBLIC_SITE_STANDARD_v1.0.md`
- `docs/readiness/FINAL_PRE_DASHBOARD_SITE_READINESS_2026-06-20.md`
- `docs/readiness/FINAL_PUBLIC_SITE_VISUAL_STABILITY_PATCH_2026-06-20.md`
- `docs/readiness/FINAL_PUBLIC_SITE_VISUAL_TRUTH_FIX_2026-06-20.md`
- `docs/product/BIZPILOT_DASHBOARD_UX_STANDARD_v1.0.md`
- `docs/product/BIZPILOT_DASHBOARD_DESIGN_SYSTEM_v1.0.md`
- `docs/engineering/BIZPILOT_SERVICE_REPOSITORY_BOUNDARY_AUDIT_v1.0.md`
- `docs/engineering/BIZPILOT_SUPABASE_CLIENT_ARCHITECTURE_v1.0.md`
- `docs/readiness/PHASE_21I_DASHBOARD_I18N_SYSTEMIZATION.md`
- `docs/readiness/PHASE_21L_DASHBOARD_I18N_ADMIN_RECOVERY.md`
- `docs/readiness/PHASE_21Q_DASHBOARD_REDESIGN_EVIDENCE.md`
- `docs/readiness/PHASE_24_REAL_DATA_APPROVAL_GATE_2026-05-30.md`
- `docs/README.md`
- `docs/CURRENT_CANONICAL_DOCS_v1.7.md`
- Dashboard routes, components, services, actions, repositories, unit tests, smoke scripts, and relevant Next.js 16 docs under `node_modules/next/dist/docs/`.

## Product Truth

BizPilot AI is manual-first, cleaning-first, owner-controlled lead recovery for cleaning businesses. AI may draft summaries and replies, but the owner reviews, edits, copies, and sends manually.

Do not introduce or imply:

- Auto-send.
- SMS or WhatsApp automation.
- Automatic booking confirmation.
- Invented prices.
- Invoicing or billing automation.
- Full CRM positioning.
- Guaranteed revenue.
- Active multi-industry support.
- Real customer data readiness before the separate readiness gate closes.

## Route Map

| Route | File | Purpose | Current audit note |
| --- | --- | --- | --- |
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | Owner operational overview. | Loads workspace, configuration, and lead conversion desk. Shows urgent lead CTA, metrics, readiness, recent queue, activity, and guides. Needs stronger "what to do next" hierarchy for first use. |
| `/dashboard/leads` | `app/(dashboard)/dashboard/leads/page.tsx` | Lead inbox / queue. | Uses client-side filtering and sorting through `LeadWorkspaceQueue`. Strong manual workflow foundation, but empty/sample state and queue hierarchy can be clarified. |
| `/dashboard/leads/[leadId]` | `app/(dashboard)/dashboard/leads/[leadId]/page.tsx` | Lead detail, AI summary, AI draft, manual actions. | Functionally rich but visually dense. Manual next action should be more obvious than internal/system details. |
| `/dashboard/configuration` | `app/(dashboard)/dashboard/configuration/page.tsx` | Quote setup and business configuration. | Large setup surface with many tabs and a sticky save bar. Appropriate for configuration, but not the first mental model of the product. |
| `/dashboard/business-profile` | `app/(dashboard)/dashboard/business-profile/page.tsx` | Owner-facing business identity and operating context. | Uses same configuration save flow and hidden preserve fields. Should remain setup/supporting context, not the core daily workflow. |
| `/dashboard/settings` | `app/(dashboard)/dashboard/settings/page.tsx` | Workspace language, theme, account, feature registry, lifecycle, deletion. | Truthful and useful, but visually heavy before core lead workflow is understood. Future/planned items should stay secondary. |
| `/dashboard/quote-setup` | `app/(dashboard)/dashboard/quote-setup/page.tsx` | Compatibility redirect. | Redirects to `/dashboard/configuration`. No separate UX surface. |
| `/dashboard/error` | `app/(dashboard)/dashboard/error.tsx` | Dashboard route error boundary. | Safe generic recovery UI. Copy is English-only and not dictionary-backed. |
| `/founder` | `app/(dashboard)/founder/page.tsx` | Founder admin surface inside dashboard route group. | Shares protected shell context but is not owner dashboard work. Avoid coupling owner dashboard polish to founder admin changes unless necessary. |

## Dashboard Shell Files

- `app/(dashboard)/layout.tsx`
- `components/dashboard/dashboard-shell.tsx`
- `components/dashboard/dashboard-theme.tsx`
- `components/dashboard/dashboard-sidebar.tsx`
- `components/dashboard/dashboard-topbar.tsx`
- `components/dashboard/dashboard-ui.tsx`
- `app/globals.css`
- `lib/theme.ts`
- `lib/i18n/bizpilot-copy.ts`
- `lib/i18n/language.ts`

Supporting owner dashboard components:

- `components/dashboard/lead-workspace-queue.tsx`
- `components/dashboard/copy-button.tsx`
- `components/dashboard/configuration-tabs.tsx`
- `components/dashboard/custom-quote-field-builder.tsx`
- `components/dashboard/quote-field-type-control.tsx`
- `components/dashboard/flash-message.tsx`
- `components/dashboard/workspace-deletion-request-form.tsx`

## Data Flow Map

1. A request to `/dashboard*` is checked by `proxy.ts` for session routing.
2. `app/(dashboard)/layout.tsx` calls `getCurrentUser()` and redirects unauthenticated users to `/auth/sign-in`.
3. The layout calls `getBusinessWorkspace()` and renders a workspace recovery/paused/deletion shell when no active business is available.
4. The active business, workspace language, theme preference, and dashboard dictionary flow into `DashboardShell`.
5. `/dashboard` loads `getBusinessConfigurationWorkspace()` and `getLeadConversionDesk()`.
6. `/dashboard/leads` loads `getLeadConversionDesk()` and passes server data to the client queue component for search, filter, and sort.
7. `/dashboard/leads/[leadId]` loads `getLeadDetail()` and `getLatestLeadAiOutput()`.
8. Lead workflow actions call server actions in `server/actions/lead-conversion.actions.ts`, re-check the current user/workspace, update through lead services/repositories, then revalidate and redirect.
9. AI draft generation calls `generateLeadAiBundleAction()`, which re-checks auth/workspace, calls `generateLeadAiBundle()`, uses the configured provider when available, and falls back to rules when AI is unavailable.
10. Configuration forms post to `saveBusinessConfigurationAction()`, which validates input and persists business configuration through the configuration service.
11. Workspace language changes post to `updateWorkspaceLanguageAction()`, which updates both the workspace preference and interface language cookie.

## Auth And Workspace Boundary

- Dashboard routes are protected in `proxy.ts` and again inside the dashboard layout and server actions.
- Normal dashboard reads and writes use the server session Supabase client.
- Service-role usage is documented for tenant bootstrap/recovery only, not normal dashboard reads/writes.
- Server actions currently re-check the active user and workspace before mutation.
- Some lead workflow mutations rely on active business context plus RLS/business ID scoping rather than a single reusable explicit policy helper. This is a deferred engineering risk, not a D0 visual implementation item.
- `pnpm smoke:dashboard` exists, but it creates synthetic workspace data and must not be run against production-like Supabase credentials.

## Current UX Findings

### Lead Inbox

- The lead queue supports manual owner triage with search, status/urgency filters, sorting, SLA indicators, and sample empty-state data.
- The sample empty state is useful and truthful, but its calls to action can be clearer for first-time owners.
- The table-like layout appears only at `xl`; smaller screens use card layouts. This is safer than forcing wide tables, but still needs browser verification at 320, 360, 390, 768, and 1024 widths.
- The inbox should lead with owner action: review lead, copy draft, mark manual status. Avoid presenting it as a CRM dashboard.

### Lead Detail

- The lead detail page contains customer request, submitted fields, missing info, routing, owner controls, notes, AI summary, copyable drafts, guardrails, actions, and timeline.
- The page is product-complete for a manual workflow, but too many panels have similar visual weight.
- "Mark Won" / booked outcome is a manual status action, not booking confirmation. Its visual placement should avoid implying that BizPilot confirms bookings.
- Owner notes are visible but not persisted. That is truthful in small copy, but the field can still feel like a real notes feature.

### AI Draft

- AI draft generation is owner-triggered, not automatic send.
- Fallback behavior exists when AI is unavailable, which matches the safe owner-review standard.
- The AI output card exposes model/source/estimated cost/fallback details directly. This is helpful during development, but the owner-facing visual treatment should emphasize "safe draft to review" over internal provider mechanics.

### Overview

- The overview correctly presents lead recovery, readiness, and recent activity.
- It should become a focused daily command center for "which lead needs my attention now," not a generic analytics dashboard.
- First-use dashboard experience should highlight one realistic sample cleaning lead and the manual copy/send workflow.

### Configuration And Settings

- Configuration is comprehensive and should remain available.
- Settings includes theme, language, feature registry, account, lifecycle, and deletion controls.
- Future/planned feature cards are truthful but visually heavy. They should stay secondary so owners do not mistake planned capabilities for active product scope.

## Empty, Loading, And Error States

- Lead queue has a sample empty state with dictionary-backed sample lead content.
- Dashboard error boundary exists, but visible copy is English-only.
- Workspace recovery/fallback shell exists in `app/(dashboard)/layout.tsx`, but several visible strings are English-only.
- No dedicated dashboard route loading skeletons were found for the main dashboard pages. Server data loading may feel abrupt, especially because layout-level auth/workspace reads happen before the shell is rendered.

## EN/fr-CA Coverage

- Main dashboard copy is largely centralized in `lib/i18n/bizpilot-copy.ts`.
- Authenticated dashboard language source of truth is `businesses.preferred_language`, with interface cookie fallback before workspace context is available.
- Known remaining gaps:
  - Dashboard error boundary copy is hardcoded English.
  - Workspace recovery/fallback shell has hardcoded English strings.
  - Some client microcopy such as copy button states and topbar "Actions" are hardcoded English.
  - Some aria labels in setup navigation are English-only.
- French layout parity must be verified visually before broad dashboard UI changes are approved.

## Light/Dark And Responsive Support

- Dashboard shell uses shared theme foundation and `biz-dashboard-light` / `biz-dashboard-dark`.
- Fresh public visits default to Light. Dashboard also initializes Light when no stored preference is present.
- Dark mode is available and should not change layout dimensions.
- The shell uses a desktop sidebar and mobile bottom nav.
- Topbar controls can wrap on smaller widths. This is safer than clipping, but may feel dense and visually unstable around tablet widths.
- Fixed/sticky elements to verify carefully:
  - Desktop sticky sidebar.
  - Mobile fixed bottom navigation.
  - Configuration sticky save bar.
  - Lead detail action/header regions.

## Risk Register

| Severity | Issue | Affected route/surface | Recommended fix | Blocks dashboard implementation? |
| --- | --- | --- | --- | --- |
| P0 | Real customer data, paid pilot, billing automation, auth/RLS/database changes, AI provider changes, and production data-flow expansion are not approved. | All dashboard work. | Keep D1 scoped to visual/UX only. Use existing data/actions. Do not run production synthetic data flows. | Blocks those expansions, not visual polish. |
| P0 | `smoke:dashboard` creates synthetic workspace data and is unsafe with production-like Supabase env. | Verification workflow. | Do not run dashboard smoke unless environment is confirmed local/synthetic-safe and separately approved. | Blocks using dashboard smoke in D0/D1 production-like env. |
| P1 | Lead detail visual hierarchy is too dense for the core owner workflow. | `/dashboard/leads/[leadId]` | Make next manual owner action primary; group diagnostics/history lower on the page; keep AI as review/copy support. | No, but should be first implementation focus. |
| P1 | Manual "Mark Won" outcome can visually read like booking confirmation if emphasized too early. | `/dashboard/leads/[leadId]` | Reposition or relabel visually as owner-recorded outcome after manual contact. Do not change data behavior. | No, but high product-truth risk. |
| P1 | Owner notes field is visible but not persisted. | `/dashboard/leads/[leadId]` | Make the non-persistence guard obvious or hide behind a disabled/future treatment. No storage/schema work. | No, but can confuse owners. |
| P1 | Topbar controls are dense and may feel unstable across mobile/tablet and EN/fr-CA. | Dashboard shell. | Compact secondary controls, keep language/theme available, preserve workspace language truth. | No, but should be included in D1 visual QA. |
| P1 | AI internals are too prominent in owner-facing draft UI. | `/dashboard/leads/[leadId]` | Reframe provider/fallback details as safe draft status and keep technical metadata secondary. No provider behavior changes. | No. |
| P1 | Settings and feature registry can overwhelm owners with planned/future capabilities. | `/dashboard/settings` | Keep future items secondary and clearly unavailable. Reinforce active manual lead recovery scope. | No. |
| P2 | Error and fallback shell copy is not fully dictionary-backed. | Dashboard error, workspace recovery shell. | Move visible owner copy into `bizpilot-copy` in a later i18n cleanup. | No. |
| P2 | Some microcopy and aria labels are English-only. | Copy button, topbar, configuration tabs. | Localize in a focused pass after layout hierarchy is stable. | No. |
| P2 | No dedicated dashboard loading skeletons were found. | Main dashboard pages. | Add lightweight loading states once visual hierarchy is finalized. | No. |
| P2 | Some design docs still reflect historical dashboard styling notes that predate the public-site theme foundation. | Documentation. | Update docs after D1 implementation decisions are real. | No. |

## Current Test Coverage

Relevant automated coverage:

- `tests/unit/dashboard-shell-copy.test.mts`
- `tests/unit/i18n-copy.test.mts`
- `tests/unit/lead-conversion-rules.test.mts`
- `tests/unit/theme-preference.test.mts`
- `tests/unit/business-lifecycle-lock.test.mts`
- `tests/unit/business-deletion-*.test.mts`
- SQL/RLS coverage under `tests/rls/`
- Public visual smoke scripts under `scripts/smoke-*`
- Dashboard auth smoke script at `tests/smoke/dashboard-auth-smoke.mts`

D0 verification should use:

```text
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build
git diff --check
```

Do not run `pnpm smoke:dashboard` unless the Supabase environment is confirmed local/synthetic-safe.

## Required Manual Owner Actions

The current dashboard already supports or presents these manual owner actions:

- Copy public quote link.
- Review urgent lead.
- Search, filter, and sort the lead inbox.
- Open lead detail.
- Generate or regenerate an AI draft manually.
- Review AI summary and suggested reply.
- Copy reply or follow-up text manually.
- Mark reply copied manually.
- Update lead status manually.
- Record a manual outcome manually.
- Complete action items manually.
- Configure business profile, services, areas, quote form, FAQ, branding, and privacy copy.
- Change workspace language and theme.
- Sign out.
- Request workspace deletion where eligible.

These actions must remain owner-controlled. The dashboard must not send messages, confirm bookings, invent prices, or imply automation that is not active.

## What Must Not Be Touched In D1 Visual Work

- Database schema.
- Migrations.
- RLS policies.
- Auth behavior.
- Supabase tenant/workspace creation behavior.
- AI provider behavior.
- Payment or billing logic.
- Production data flows.
- Real customer data readiness gates.
- Service-role usage boundaries.
- Public quote data capture behavior.
- Founder admin logic unless a shell-level visual fix requires a shared component adjustment.

## Implementation Plan

### P0 Guardrails

- Keep dashboard implementation visual and interaction-clarity only.
- Preserve all existing server actions, repository boundaries, RLS assumptions, and provider behavior.
- Do not run dashboard synthetic-data smoke against production-like Supabase.
- Add/keep tests that prevent auto-send, booking confirmation, invented price, SMS/WhatsApp automation, and full CRM claims from appearing in active owner surfaces.

### P1 Dashboard UX Stabilization

- Refine dashboard shell density:
  - Simplify topbar control grouping on mobile/tablet.
  - Keep language and theme controls available without making them the primary task.
  - Preserve Light/Dark dimensions and EN/fr-CA layout parity.
- Refine overview:
  - Make the first visible action "review the lead that needs attention."
  - Keep metrics secondary to manual response workflow.
- Refine lead inbox:
  - Improve first-use/sample lead state.
  - Keep service, urgency, SLA, status, and next action scannable.
  - Verify no horizontal overflow across 320, 360, 390, 768, 1024, 1280, and 1366 widths.
- Refine lead detail:
  - Make manual next action primary.
  - Present AI summary/draft as owner-reviewed support.
  - Move internal diagnostics, history, and secondary metadata lower or behind calmer grouping.
  - Ensure manual outcome controls do not imply booking confirmation.

### P2 Follow-Up Polish

- Localize remaining dashboard error/fallback/microcopy strings.
- Add route loading states after hierarchy is stable.
- Update dashboard docs to align with the final theme foundation and actual D1 implementation.
- Consider a local-only authenticated dashboard visual matrix once an approved synthetic/local environment is confirmed.

## Recommended First Implementation Phase

Recommended next phase: Phase D1 - Dashboard shell and lead workflow visual stabilization.

Suggested D1 scope:

- `components/dashboard/dashboard-shell.tsx`
- `components/dashboard/dashboard-topbar.tsx`
- `components/dashboard/dashboard-sidebar.tsx`
- `components/dashboard/dashboard-ui.tsx`
- `components/dashboard/lead-workspace-queue.tsx`
- `app/(dashboard)/dashboard/page.tsx`
- `app/(dashboard)/dashboard/leads/page.tsx`
- `app/(dashboard)/dashboard/leads/[leadId]/page.tsx`
- `lib/i18n/bizpilot-copy.ts` only for visible dashboard copy needed by those surfaces
- `app/globals.css` only for token-based dashboard layout adjustments
- Focused unit/source tests for product-truth copy and dictionary structure

D1 should not include configuration redesign, schema/storage work, billing/payment work, AI provider changes, auth changes, or production data-flow changes.

## Dashboard Start Assessment

Dashboard visual implementation can begin after this D0 audit is committed and the required verification passes.

Dashboard data expansion, real customer intake, paid pilot, billing automation, auth/RLS changes, and AI provider behavior changes remain NO-GO until separate readiness gates explicitly close.
