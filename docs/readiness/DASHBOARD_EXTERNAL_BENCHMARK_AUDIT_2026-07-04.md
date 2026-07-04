# Dashboard External Benchmark Audit

Date: 2026-07-04
Scope: Owner dashboard, owner lead queue/detail, founder/admin dashboard
Mode: Research + source audit plus Phase 26 P0 honesty fix

## Purpose

Compare the current BizPilot dashboard implementation against strong dashboard
design guidance and leading operational product patterns, then identify exact
remove/change/upgrade opportunities that preserve BizPilot's manual-first,
cleaning-first, owner-reviewed scope.

## Sources Used

- Nielsen Norman Group, data tables: tables should support finding records,
  comparing records, viewing/editing one row, and taking action on records.
  https://www.nngroup.com/articles/data-tables/
- Nielsen Norman Group, dashboard charts: dashboards are single-page,
  at-a-glance views for fast action, not exploratory report pages; circular
  charts are harder to interpret quickly.
  https://www.nngroup.com/articles/dashboards-preattentive/
- Tableau dashboard guidance: start with purpose and audience before choosing
  visuals.
  https://help.tableau.com/current/pro/desktop/en-us/dashboards_best_practices.htm
- Microsoft Power BI dashboard guidance: a dashboard is a single-page canvas
  that should contain only the highlights of the story.
  https://learn.microsoft.com/en-us/power-bi/create-reports/service-dashboards
- Shopify Home: daily tasks, next steps, recent activity, personalized
  recommendations, and four customizable metrics.
  https://help.shopify.com/en/manual/shopify-admin/shopify-home
- Stripe Dashboard: customizable home widgets, important notifications, strong
  resource search, filters, status badges, and actions-required lists.
  https://docs.stripe.com/dashboard/basics
  https://docs.stripe.com/dashboard/search
  https://docs.stripe.com/connect/dashboard
- Linear Triage and Inbox: intake items are reviewed, prioritized, accepted,
  declined, snoozed, or asked for more information before entering normal
  workflow.
  https://linear.app/docs/triage
  https://linear.app/docs/inbox
- Intercom Inbox: assignment and prioritization are built around team inboxes,
  priority, SLA, waiting time, and capacity. For BizPilot's current single-owner
  scope, this translates to visible priority lanes, not automatic assignment.
  https://www.intercom.com/help/en/articles/197-organize-team-inboxes
  https://www.intercom.com/help/en/articles/6553774-balanced-assignment-deep-dive
- HubSpot task queues: queues group tasks and can be filtered/saved as views.
  https://knowledge.hubspot.com/tasks/use-task-queues

## Current Repo Reality

The core dashboard routes and components exist:

- Owner overview: `app/(dashboard)/dashboard/page.tsx`
- Lead queue: `app/(dashboard)/dashboard/leads/page.tsx`
- Lead detail: `app/(dashboard)/dashboard/leads/[leadId]/page.tsx`
- Quote setup: `app/(dashboard)/dashboard/configuration/page.tsx`
- Business profile: `app/(dashboard)/dashboard/business-profile/page.tsx`
- Settings: `app/(dashboard)/dashboard/settings/page.tsx`
- Founder/admin: `app/admin/page.tsx`
- Shared shell and primitives: `components/dashboard/*`

Current target check:

```text
NEXT_PUBLIC_APP_URL host: local (localhost)
NEXT_PUBLIC_SUPABASE_URL host: managed/non-local (qfqendrqimqvkoojpjao.supabase.co)
DATABASE_URL host: local (127.0.0.1)
VERCEL_ENV production: no
```

Phase 26 update: authenticated owner dashboard, founder handoff, and
founder-admin route smoke passed 14/14 against local Supabase with explicit
synthetic founder email gating. See
`docs/readiness/PHASE_26_FINALIZATION_CHECKLIST_AND_DASHBOARD_ADMIN_GATE_2026-07-04.md`.
Dedicated screenshot/focus QA still remains separate because no Playwright/axe
visual tooling is installed in the repo.

## Benchmark Synthesis

Strong dashboards do four things well:

1. Lead with the user's immediate decision.
2. Keep charts secondary unless they change today's action.
3. Make queues searchable, filterable, comparable, and directly actionable.
4. Keep workflow ownership explicit: who owns the item, why it is next, and what
   action is safe now.

For BizPilot, "best in the world" does not mean copying Stripe's finance charts
or Intercom's team automation. It means applying their operational clarity to
BizPilot's honest scope:

```text
Owner: Which quote request needs attention, and what should I manually do now?
Founder: Which user/workspace needs review, and what guarded action is allowed?
```

## Priority Findings

### P0 - Remove Or Rename Misleading Admin Metrics

File: `app/admin/page.tsx`

Phase 26 status: fixed.

Issue:

- The admin overview labels `AI Replies Sent` even though BizPilot does not send
  AI replies; the product promise is owner-reviewed copy/send only.
- `Average Reply Time` is hard-coded to `28m` when `aiReplySignal > 0`.
- `Setup Conversion Rate` and `Quote Link Sent Rate` sound like analytics
  outcomes, but they are computed from current workspace/plan/link state, not
  measured funnel events.

Relevant lines:

- `app/admin/page.tsx:3867-3871`
- `app/admin/page.tsx:3947-3952`
- `app/admin/page.tsx:3953-3969`

Recommendation:

- `AI Replies Sent` is now `Reply Traces`.
- `AI Replied` status segment is now `Reply copied`.
- `Average Reply Time` is now `Response Time Tracking` with `Not enabled`.
- `Quote Link Sent Rate` is now `Active Link Coverage`.
- `Setup Conversion Rate` is now `Payment-Ready Workspaces`.
- `Leads This Month`, `Last 7 days`, and the misleading `Export` link copy were
  replaced with current-snapshot wording.

Why:

This is the clearest product-honesty risk found in the dashboard source audit.

### P1 - Put Owner Next Action Before Charts

File: `app/(dashboard)/dashboard/page.tsx`

Phase 26 status: already satisfied in current source. The overview renders the
priority next-action cockpit and start guide before the lower trend/source
insight section. Keep this order.

Issue:

- Earlier audit notes said the overview rendered trend/source panels before the
  main suggested-action cockpit. The current source has since moved the
  suggested-action board before charts.
- NN/g and Microsoft-style dashboard guidance both support a one-page,
  at-a-glance story, but BizPilot's owner story is action-first, not analytics
  first.

Relevant lines:

- Charts/to-do/source panels: `app/(dashboard)/dashboard/page.tsx:890-915`
- Main suggested action: `app/(dashboard)/dashboard/page.tsx:918-952`
- Start guide: `app/(dashboard)/dashboard/page.tsx:955-1004`

Recommendation:

- Keep the priority cockpit at the top of the page.
- Keep `Today` tasks immediately adjacent to the primary action.
- Move `OwnerTrendChart` and `LeadSourcesDonut` below the queue preview or behind
  a compact `Insights` disclosure.
- Prefer one compact source list over a donut for now; circular charts are less
  useful for quick magnitude comparison.

### P1 - Turn "Today" Into A Real Manual Work Queue

File: `app/(dashboard)/dashboard/page.tsx`

Issue:

- `OwnerTodoTodayPanel` exists, but it competes with `priorityTiles`,
  `commandFlow`, and `recoveryFocus`, which all express similar work.

Relevant lines:

- `OwnerTodoTodayPanel`: `app/(dashboard)/dashboard/page.tsx:454`
- Today panel render: `app/(dashboard)/dashboard/page.tsx:902-907`
- Priority tiles: `app/(dashboard)/dashboard/page.tsx:1007-1025`
- Command flow: `app/(dashboard)/dashboard/page.tsx:1028-1055`
- Recovery focus: `app/(dashboard)/dashboard/page.tsx:1227-1268`

Recommendation:

- Consolidate these into one `Today's manual queue` component:
  - Overdue / at risk
  - Needs reply
  - Missing info
  - Follow-up due
  - Setup blocking quote link
- Each row should show count, reason, and one CTA.
- Do not add team assignment yet. For current scope, "task division" means
  status lanes and owner routine, not multi-user workload management.

### P1 - Lead Queue Is Strong; Upgrade The Filters To Saved Views Later

File: `components/dashboard/lead-workspace-queue.tsx`

Strength:

- Search, status filter, urgency sort, pagination, mobile cards, and desktop row
  table are already aligned with data-table best practices.

Relevant lines:

- Filters/sort/search UI: `components/dashboard/lead-workspace-queue.tsx:704-754`
- Mobile/desktop split: `components/dashboard/lead-workspace-queue.tsx:760-770`
- Pagination: `components/dashboard/lead-workspace-queue.tsx:771-783`

Recommendation:

- Make the insight badges clickable filter shortcuts.
- Add date range and service/source filter when real dashboard QA is available.
- Add saved views only after owner behavior proves which lanes matter.

### P1 - Lead Detail CTA Should Follow Draft Availability

File: `app/(dashboard)/dashboard/leads/[leadId]/page.tsx`

Issue:

- The top primary CTA can mark a reply as copied before the owner has interacted
  with the actual draft area.

Relevant lines:

- Manual workflow top CTA: `app/(dashboard)/dashboard/leads/[leadId]/page.tsx:299-355`
- AI draft generation and copy area:
  `app/(dashboard)/dashboard/leads/[leadId]/page.tsx:696-808`

Recommendation:

- If no AI output exists: primary CTA should be `Generate draft`.
- If AI output exists: primary CTA should take the owner to/copy the reply draft.
- `Mark reply copied` should be secondary or appear after the copy action.
- Keep no-send language exactly as-is.

### P1 - Persist Or De-Emphasize Owner Notes

File: `app/(dashboard)/dashboard/leads/[leadId]/page.tsx`

Issue:

- Owner notes are displayed as a normal textarea, but the code comment says
  storage is local-only/TBD.

Relevant lines:

- `app/(dashboard)/dashboard/leads/[leadId]/page.tsx:678-692`

Recommendation:

- Best: persist owner notes through an audited owner action.
- If not implementing persistence now, collapse this as `Scratch note, not
  saved` and keep it lower than the AI draft/manual outcome controls.

### P2 - Quote Setup Should Become A Guided Setup Wizard Plus Advanced Editor

File: `app/(dashboard)/dashboard/configuration/page.tsx`

Issue:

- Quote Setup is powerful but dense: 10 sections, sticky tabs, overview cards,
  readiness, fields, services, branding, FAQ, public page, notifications,
  privacy, and checklist.

Relevant lines:

- Section list: `app/(dashboard)/dashboard/configuration/page.tsx:260-270`
- Field editor: `app/(dashboard)/dashboard/configuration/page.tsx:682-831`
- Bottom save bar: `app/(dashboard)/dashboard/configuration/page.tsx:1064-1084`

Recommendation:

- First-run mode: 3 required steps only:
  1. Business basics
  2. Services/areas
  3. Share quote link
- Advanced mode: fields, FAQ, privacy, branding, notifications.
- Keep current bottom save pattern, but add section-level "saved/unsaved"
  feedback after browser QA.

### P2 - Business Profile Should Stay Minimal

File: `app/(dashboard)/dashboard/business-profile/page.tsx`

Issue:

- Business Profile duplicates some Quote Setup fields and includes future
  roadmap fields.

Relevant lines:

- Hidden preservation fields: `app/(dashboard)/dashboard/business-profile/page.tsx:178-246`
- Main editable profile fields:
  `app/(dashboard)/dashboard/business-profile/page.tsx:247-373`
- Future roadmap fields:
  `app/(dashboard)/dashboard/business-profile/page.tsx:376-403`

Recommendation:

- Keep the route because it separates identity from quote setup.
- Remove or collapse future roadmap fields from the default viewport.
- Make it the place for operating context that improves lead replies, not a
  second configuration workspace.

### P2 - Settings Feature Registry Is Useful But Too Heavy For Owners

File: `app/(dashboard)/dashboard/settings/page.tsx`

Issue:

- The feature registry gives good honesty around enabled/planned/blocked
  features, but it is a lot of product metadata for an owner settings page.

Relevant lines:

- Feature counts and guide details:
  `app/(dashboard)/dashboard/settings/page.tsx:317-424`

Recommendation:

- Keep one compact `Available now / Setup needed / Not enabled` summary.
- Keep detailed guide states collapsed under "Product guide details".
- Avoid making blocked future features feel like dashboard navigation.

## Recommended Execution Order

1. Done in Phase 26: fix admin metric honesty by removing misleading sent-reply,
   hard-coded response-time, and conversion-rate labels.
2. Preserve the current owner overview order: suggested next manual action and
   start guide before lower insight charts.
3. Consolidate duplicated owner work panels into one manual queue.
4. Adjust lead detail CTA behavior around AI draft availability.
5. Persist or clearly downgrade owner notes.
6. Run manual/browser focus and screenshot QA before deeper Quote Setup,
   Business Profile, and Settings density tuning.

## Non-Goals

- No auto-send.
- No booking, invoicing, payments, SMS, WhatsApp, or email automation.
- No real customer data.
- No paid pilot claim.
- No production mutation.
- No team assignment UI until the separate access/team gate exists.
