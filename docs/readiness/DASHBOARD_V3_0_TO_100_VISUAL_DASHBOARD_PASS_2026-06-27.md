# Dashboard V3 0-to-100 Visual Dashboard Pass

Date: 2026-06-27
Branch: `codex/full-system-dashboard-qa-polish`
Reference image: `C:\Users\mbeag\AppData\Local\Temp\codex-clipboard-b9674911-97ac-4574-9b0d-f1bd23da4eda.png`
Canonical standard: `docs/readiness/BIZPILOT_DASHBOARD_MASTER_STANDARD_AND_CODEX_GUIDE_2026-06-27.md`

## Objective

Bring the owner and founder/admin dashboards closer to the final visual target:
compact left-shell product dashboards with KPI rows, action queues, trend/donut
analytics, operational task panels, health summaries, and clear next actions.

The pass preserves the master standard:

- Cleaning-first quote recovery remains the owner dashboard purpose.
- AI remains review-only and manual-send.
- Founder/admin remains read-first and guarded.
- No real customer data or paid pilot gate is opened.
- Owner-facing dashboard copy remains EN/fr-CA localized through
  `getBizPilotCopy`.

## Owner Dashboard Implementation

File: `app/(dashboard)/dashboard/page.tsx`

Implemented first-screen dashboard structure:

- Localized top header with date range, filters, and new-lead public quote link.
- Six KPI cards: new leads, AI replies, awaiting reply, quote link sent,
  readiness completed, and setup wins.
- Lead Queue (Needs Your Action) with owner-safe lead names and per-row status.
- Leads Trend SVG chart for the last seven days.
- To Do Today panel with reply, follow-up, readiness, and quote-prep tasks.
- AI Assistant note that reiterates owner review before sending.
- Lead Sources donut with source percentages and full-report link.

Existing deeper workflow blocks remain below the first viewport:

- Suggested next action.
- Start Here setup guide.
- Manual recovery lane.
- Featured urgent lead.
- Full `LeadWorkspaceQueue`.
- Readiness checklist and manual AI controls.

## Founder/Admin Dashboard Implementation

File: `app/admin/page.tsx`

Implemented `/admin` default `overview` panel:

- Admin Overview page header with workspace/date/export controls.
- Six KPI cards: total users, active businesses, leads this month, AI reply
  signals, readiness completed, users needing attention.
- Users mini table for fast search/manage scanning.
- Leads by Status donut.
- System Health summary tied to production health checks.
- Recent Activities summary.
- Bottom metrics for lead sources, reply-time signal, readiness rate, quote-link
  rate, and setup conversion rate.

The previous admin sections remain available:

- Users search and guarded account support.
- Businesses search/detail controls.
- Leads inbox triage.
- Production health.
- Activity log.

## Localization

Owner first-screen labels are now part of
`lib/i18n/bizpilot-copy.ts` under `overview.visualDashboard`.

Covered languages:

- English (`en`)
- Canadian French (`fr-CA`)

Founder/admin copy remains internal founder-operations copy in English.

## Guardrails

Source guards were extended in
`tests/unit/dashboard-v3-final-acceptance-source.test.mts` to require:

- `ownerOverviewKpiCards`
- `OwnerTrendChart`
- `LeadSourcesDonut`
- `OwnerTodoTodayPanel`
- `overview` admin panel
- `FounderAdminOverviewSection`
- `FounderLeadsStatusDonut`
- `FounderSystemHealthSummary`

## Validation Status

Final QA batch result: PASS.

- `pnpm test:unit`: PASS, 163/163.
- `pnpm verify`: PASS for lint, typecheck, unit tests, and production build.
- `git diff --check`: PASS.
- Browser QA screenshots and JSON for `/dashboard` and `/admin` at desktop and
  mobile viewports: PASS.

Browser QA file:
`C:\Users\mbeag\Documents\Codex\2026-06-27\files-mentioned-by-the-user-bizpilot\outputs\dashboard-v3-0-to-100-visual-qa\dashboard-v3-0-to-100-browser-qa.json`

Viewport screenshots:

- `C:\Users\mbeag\Documents\Codex\2026-06-27\files-mentioned-by-the-user-bizpilot\outputs\dashboard-v3-0-to-100-visual-qa\owner-dashboard-desktop-1440x900-viewport.png`
- `C:\Users\mbeag\Documents\Codex\2026-06-27\files-mentioned-by-the-user-bizpilot\outputs\dashboard-v3-0-to-100-visual-qa\owner-dashboard-mobile-390x844-viewport.png`
- `C:\Users\mbeag\Documents\Codex\2026-06-27\files-mentioned-by-the-user-bizpilot\outputs\dashboard-v3-0-to-100-visual-qa\admin-overview-desktop-1440x900-viewport.png`
- `C:\Users\mbeag\Documents\Codex\2026-06-27\files-mentioned-by-the-user-bizpilot\outputs\dashboard-v3-0-to-100-visual-qa\admin-overview-mobile-390x844-viewport.png`
