# BizPilot Dashboard Master Standard and Codex Execution Guide

Date: 2026-06-27
Source import: `C:\Users\mbeag\Downloads\BizPilot_Dashboard_Master_Standard_And_Codex_Guide_2026-06-27.docx`
Canonical status: active source of truth for dashboard design and Codex execution
Language: Persian-first decisions with English product/code labels

## Canonical Decision

This is now the master dashboard standard for BizPilot.

Use this document before any new dashboard design or implementation pass. Older
dashboard notes, P20/P21 drafts, visual audits, and implementation reports are
supporting evidence only. If another document conflicts with this one, this
document wins unless the repo has changed and a newer canonical standard
explicitly replaces it.

The central rule:

```text
BizPilot dashboards must make the safest next manual action obvious, while
preserving product honesty, security gates, and owner-reviewed AI.
```

If a design makes this clearer, it can move forward. If it makes the product
busy, ambiguous, unsafe, or fake, remove it or gate it.

## Executive Summary

BizPilot is currently a cleaning-first, manual-first, owner-controlled lead
recovery system.

It is not a full CRM, booking system, invoicing system, auto-send messaging
system, or guaranteed-revenue product.

The product has two primary dashboards:

- Owner/User Dashboard: helps a cleaning business owner see important quote
  requests, review AI drafts, copy/send manually, follow up, and keep the quote
  link ready.
- Founder/Admin Dashboard: helps the founder search users, inspect workspaces,
  review access/plan/quote-link state, record notes, view audit trails, and
  perform only guarded operations.

Real customer data and paid pilot remain gated. Visual polish must never imply
that those gates are closed.

AI is assistant-only. It may draft, summarize, and recommend. It must not send,
book, price, promise availability, or pretend the owner has completed an action.

The biggest dashboard weakness to fix is priority hierarchy. The first viewport
must answer: what should this user do now?

## Source Map

| Source group | Supporting docs | Role |
|---|---|---|
| Project truth | `CURRENT_PROJECT_STATUS_2026-06-26.md`, D1/P14/P15 reports | Current readiness, synthetic-only acceptance, blocked real data/pilot gates |
| Dashboard design | `P20_DASHBOARD_PRIORITY_HIERARCHY_REDESIGN_2026-06-27.md`, previous P21 draft | V3 dashboard hierarchy and implementation evidence |
| Operating standard | `BIZPILOT_DASHBOARD_MARKETING_SEO_OPERATING_STANDARD_2026-06-27.md` | Role separation, SEO/marketing boundaries, dashboard north star |
| Founder/Admin | `P13_FOUNDER_ADMIN_CONSOLE_PROFESSIONALIZATION_REPORT_2026-06-26.md`, founder admin specs | Internal operations console, user search, guarded actions |
| Security | RLS, privacy, access-control, deletion/lifecycle docs | Tenant isolation, service-role boundaries, deletion/access gates |
| Agent execution | Codex prompts and engineering standards | Repo inspection, phased implementation, validation commands |

External standards informing this guide:

- Figma: components, variants, variables, modes, auto layout, interactive
  components, Dev Mode, Code Connect.
- Nielsen Norman Group: dashboard scanning, complex applications, chart choice,
  clutter reduction, data-table usability.
- Microsoft Power BI guidance: one-screen story, remove non-essential dashboard
  information.
- W3C/WCAG 2.2: contrast, non-text contrast, keyboard/focus, status clarity.
- OpenAI Codex docs: sandboxing, approvals/security, auto-review, config
  discipline.

## Product Truth

BizPilot should be understood as:

```text
Quote Recovery Command Center for cleaning business owners
+
Founder Admin Operations Console for internal oversight
```

Every change must improve at least one of these:

- Response speed: owner replies faster.
- Lead organization: quote requests become easier to scan and act on.
- Follow-up recovery: at-risk leads are not forgotten.
- Owner clarity: owner understands the most important next action.
- Conversion probability: more quote requests can become real cleaning jobs.

Forbidden product implications:

- Auto-send.
- Automatic SMS, WhatsApp, or email automation.
- Booking confirmation.
- Invoice or payment automation.
- Full CRM scope.
- Guaranteed revenue.
- Fake analytics or fake growth metrics.
- Fake "sent" state when only copy happened.
- Raw `tenant`, `RLS`, `schema`, `migration`, `service role`, `synthetic`, or
  `phase` language in owner-facing UI.

Decision question for every new component:

```text
Does this help the owner capture quote requests, reply faster, or follow up better?
```

If the answer is not obvious, the component does not belong in the main
dashboard.

## Current Gates

Reliable current interpretation:

- Public site is closer to ready for current scope but still needs deploy/cache
  verification.
- Owner dashboard is acceptable only for local synthetic scope until real-data
  approval.
- Founder/Admin console has stronger guardrails, but production user deletion
  and access mutation remain blocked.
- D1/P20 visual acceptance applies to local synthetic data only.

Blocked or controlled:

- Real customer data: blocked.
- Paid pilot: blocked.
- Destructive cleanup: blocked unless a separate gate closes.
- Production user deletion: blocked.
- Production synthetic writes: blocked.
- Owner/team access management: requires A1/A2 security/RLS gate.
- Dashboard/auth smoke that creates auth/workspace/lead data: local/synthetic
  target only.

Important execution rule:

```text
Documentation may be ahead of implementation. Do not assume. Inspect the repo first.
```

Routes, components, tests, migrations, and services must be verified in the
actual repo before coding.

## Dashboard Roles

| Surface | Audience | Primary job | Core question |
|---|---|---|---|
| Owner/User Dashboard | Cleaning business owner | Recover quote requests, review drafts, copy/send manually, manage setup | What quote request needs attention, and what is the safest next manual action? |
| Founder/Admin Dashboard | Founder/internal admin | Search users, inspect workspaces, review gates, support accounts, audit changes | Which user or workspace needs review, and which guarded operation is actually allowed? |
| Customer quote page | Customer/lead | Submit a quote request with minimal friction | Can I request a quote clearly and safely? |

Role separation rule:

- Owner dashboard, Founder/Admin console, and Customer quote page must not share
  the same language, navigation, or permissions model.
- Founder/Admin may use operational/security language.
- Owner-facing UI must stay plain, business-oriented, and action-first.

## Three V3 Design Frames

| Frame | Surface | Goal |
|---|---|---|
| Frame 1 | Owner/User Dashboard V3 | Owner sees the next setup/lead/queue action in one screen. |
| Frame 2 | Founder/Admin Users V3 | Founder finds a user through search-first directory and sees support/gated actions. |
| Frame 3 | Founder/Admin Business Detail V3 | Selected workspace has one clear operations path; cleanup/danger stays collapsed. |

## North Star

```text
Owner-reviewed quote requests that receive a useful first response before the
lead recovery threshold.
```

Acceptable metrics when real/reliable:

- Quote requests captured.
- Urgent leads reviewed.
- Draft replies copied.
- Manual replies marked sent.
- Follow-ups completed.
- Missing-information requests handled.
- Quote-link readiness completed.
- Time from request to owner action.
- Leads with safe AI draft available.
- Leads with manual outcome recorded.

Do not show:

- Fake revenue recovered.
- Fake conversion growth.
- Fake benchmark.
- Fake AI success rate.
- Decorative charts that do not change today's action.

Chart rule:

Charts belong on the first dashboard only when they help the owner decide what
to do today. If the owner needs to reply now or follow up today, the command
panel outranks the chart.

## Route Map

Owner/User:

- `/dashboard`: operational overview.
- `/dashboard/leads`: lead recovery queue.
- `/dashboard/leads/[leadId]`: owner decision/action workspace.
- `/dashboard/configuration`: guided business setup and quote setup.
- `/dashboard/quote-setup`: quote setup if the route remains separate.
- `/dashboard/business-profile`: business identity and operating context.
- `/dashboard/settings`: preferences, language, theme, feature levels,
  lifecycle/danger zone.

Founder/Admin:

- `/admin`: Founder Admin Operations Console.
- `/admin?adminPanel=users`: search-first user directory.
- `/admin?adminPanel=businesses`: workspace/business control lane.
- `/admin?adminPanel=health`: production/admin health.
- `/admin?adminPanel=leads`: admin-level lead oversight, not owner CRM.
- `/admin?adminPanel=activity`: audit and operational activity.
- `/founder`: focused founder handoff, not a stale phase shell.

Customer:

- `/quote/[slug]`: quote request form.
- `/quote/[slug]/success`: safe intake confirmation.

## Owner/User Dashboard V3

Goal: show what needs attention now.

First viewport hierarchy:

1. One page-owned H1.
2. Suggested next action.
3. Primary CTA.
4. Start Here task list.
5. Four compact operating signals.
6. Lead queue preview.
7. Quote readiness support.

Primary CTA logic:

| State | Primary CTA | Reason |
|---|---|---|
| Quote setup incomplete | Finish setup | Intake must be ready before sharing quote link. |
| Urgent/at-risk lead exists | Review urgent lead | The most important lead must not get lost. |
| No single urgent lead | Open lead queue | Owner can scan the queue. |
| Empty first run | Complete quote setup | Dashboard must not fake activity. |

Owner overview rules:

- No big marketing hero inside the app.
- No chart before the owner has a reason to inspect a chart.
- No nested scroll in the first viewport.
- One H1 owned by page content.
- Onboarding is a task list, not a paragraph.
- Metrics support work; they do not compete with next action.
- Empty state should guide setup, not create fake leads.
- Loading state uses skeletons with stable dimensions.
- Error state uses safe copy and a retry path.

Owner lead queue fields:

| Field | Purpose |
|---|---|
| Customer short name | Scan identity without overexposing PII. |
| Service | Understand request quickly. |
| Area/location | Cleaning business context. |
| Status | New, viewed, reply copied, follow-up due, overdue, missing info. |
| Quality | Strong, good, needs info, low fit. |
| SLA/risk | Urgent, at risk, overdue. |
| Next action | Reply now, ask missing info, follow up today. |
| Last activity | Recency. |

Lead queue filters:

- Status.
- Risk/SLA.
- Service.
- Missing info.
- AI draft ready.
- Date range.

Desktop queue pattern:

- Compact filter bar.
- Table or structured row list.
- Sticky-ish column meaning through clear labels.
- Customer/service/status/next action visible without opening detail.

Mobile queue pattern:

- Card list.
- Customer/service/status/next action first.
- Secondary details collapsed or lower in the card.
- No forced horizontal scroll.

Lead detail:

- Show lead identity, service, location, request time, risk, missing info, and
  owner-safe AI summary.
- AI draft must be editable/copyable only.
- No auto-send.
- No invented pricing, booking, availability, or promises.
- Manual outcomes may include copied reply, sent manually, follow-up scheduled,
  no fit, won, lost, spam/test, or needs info.

Quote Setup and Business Profile:

- Quote Setup should feel like readiness, not a settings dump.
- Business Profile should provide operating context for better lead handling.
- Settings should contain preferences, language, theme, feature levels, and a
  separated danger zone.
- Owner danger zone is separated, explicit-confirmation, audit-backed, and
  collapsed/low-emphasis until intentionally opened.

## Founder/Admin Users V3

Goal: founder can find, verify, support, and audit accounts quickly.

Visual priority:

1. Search and filters.
2. Risk lane.
3. 10-row user directory.
4. Selected user inspector.
5. Guarded account operations.

Structure:

- Header:
  - H1: Users.
  - Subtitle: Find, verify, support, and audit accounts.
  - Lane actions: Businesses, Health, Activity, Gated ops.
- Search bar:
  - Search users by name, email, phone.
  - Page size: 10 users default.
  - Access filter.
  - Auth filter.
  - Search/Reset.
- Risk chips:
  - Unconfirmed.
  - No business.
  - Paused access.
  - Recent changes.
- Directory table:
  - User.
  - Business.
  - Access.
  - Auth.
  - Action.
- Selected user inspector:
  - Identity.
  - Business context.
  - Support actions.
  - Guarded/destructive account zone.

Rules:

- Search/filter comes before queues.
- 10 users is the normal default.
- User identity leads; UUIDs are secondary.
- Metrics become small chips, not large dashboard cards.
- Destructive operations stay guarded and secondary until selected.
- Invite, role change, suspend, remove, and production deletion remain blocked
  until A1/A2 security/RLS gate closes.

Support action status:

| Action | Status |
|---|---|
| Password reset link | Allowed only if safe founder-only action exists. |
| Role/access change | Blocked until RLS gate. |
| Delete auth user | Fake/test only, double confirmation. |
| Production deletion | Blocked. |
| Invite member | Blocked until A1/A2. |

## Founder/Admin Business Detail V3

Goal: control selected workspace state without chaos.

Current failure to avoid:

- Tall columns.
- Oversized red cleanup blocks.
- Empty panels.
- Unclear action path.
- Internal scrollbars that make the screen feel broken.

Hierarchy:

1. Workspace decision header.
2. Priority state tiles.
3. Main control rail: access, quote link, plan, session.
4. Notes and audit rail.
5. Cleanup drawer collapsed by default.

Structure:

- Business Operations header:
  - Selected workspace name.
  - Recommended founder action.
  - Open customer profile/open controls.
- Business list:
  - 10 rows max.
  - Search replaces tall inner scroll.
  - Selected business stays visible.
- Priority state tiles:
  - Access status.
  - Quote link status.
  - Plan.
  - Session policy.
  - Audit events.
- Main controls:
  - Lifecycle/status.
  - Quote link active/inactive.
  - Plan/manual billing state.
  - Workspace kind.
  - Session policy.
- Founder note:
  - Concise internal note.
  - Save note.
- Recent changes:
  - Timeline strip, not a large empty card.
- Test/demo cleanup:
  - Collapsed by default.
  - Dry-run first.
  - Exact confirmation.

Danger/cleanup rules:

- Danger panel must not dominate the default screen.
- Red is for labels, borders, and collapsed drawer markers, not huge red blocks.
- Production workspace cleanup must not be visually presented as available.
- Fake/test deletion requires exact email/user ID and double confirmation.
- Cleanup never weakens server-side gates.

## Visual System

Color direction:

| Token / meaning | Light | Dark | Usage |
|---|---|---|---|
| App background | Cool neutral / `#f6f8fb` | Deep blue-green / `#071016` | Dashboard shell |
| Card surface | White | Lifted neutral dark | Cards/panels |
| Primary | Deep teal / `#0f766e` | Teal / `#14b8a6` | One main action, active nav |
| Success | Green | Green | Ready/active/completed |
| Warning | Amber | Amber | Needs setup/onboarding |
| Danger | Restrained red | Restrained red | Blocked/destructive only |
| Info | Blue | Blue | Neutral information |

Color rules:

- Primary teal is for the one main action and active navigation.
- Warning amber is for setup/onboarding/guarded attention.
- Danger red appears only in destructive or blocked contexts.
- Status is always text plus badge/dot/icon; never color-only.
- Hard-coded component colors are forbidden unless the component is a
  deliberate destructive exception.
- Owner and Founder/Admin dashboards must stay in one token family.

Density:

| Element | Standard |
|---|---|
| Top-level card radius | 8px max for new V3 direction, or existing rounded-lg standard |
| Form controls | 44-48px |
| Dashboard controls | 36-44px |
| Admin grid gutters | 12-16px |
| Business/user directory | Default 10 rows |
| Inner scrollbars | Avoid unless true virtualized table/list |
| Hero-scale type | Forbidden inside dashboard panels |

Scroll architecture:

- Desktop uses one page scroll.
- Sticky topbar allowed.
- Sticky left nav allowed.
- No nested first-viewport scroll.
- List default is 10 rows.
- Detail panels wrap into the page grid instead of becoming tall columns.
- Mobile order: command header, search/action, selected record, task list,
  queue/list, secondary controls, audit, destructive drawer.
- No horizontal overflow.
- Danger controls stay collapsed on mobile.

## Component System

Required component inventory:

| Component | Variants / states |
|---|---|
| AppShell | Owner, admin; desktop, mobile; light, dark |
| SidebarItem | Default, hover, active, disabled/collapsed |
| Topbar | Owner, admin, mobile wrapped |
| PageHeader | Default, compact, with actions |
| SuggestedActionPanel | Setup, urgent lead, queue, empty, error |
| StartHereTaskList | Todo, next, done, blocked |
| PriorityTile | Neutral, success, warning, danger, info, loading |
| LeadQueueRow | Default, hover, selected, urgent, missing-info, overdue |
| LeadQueueCard | Mobile default, urgent, missing-info, empty |
| StatusBadge | Success, warning, danger, info, neutral |
| FilterBar | Compact, expanded, mobile stacked |
| SearchInput | Empty, filled, focused, error |
| DirectoryTable | 10-row, empty, loading, error |
| UserInspector | Selected, no selection, blocked, loading |
| BusinessList | 10-row, selected, search-empty |
| WorkspaceControlCard | Access, quote link, plan, session, disabled |
| DangerDrawer | Collapsed, dry-run, confirm, blocked, completed |
| AI Draft Card | Unavailable, generating, ready, fallback, error |
| EmptyState | No leads, no search results, setup incomplete |
| Toast | Success, warning, error, info |

Figma/component properties:

- Label text.
- Status.
- Tone.
- Count/value.
- Primary/secondary action.
- Selected state.
- Loading state.
- Empty state.
- Error state.
- Disabled/gated reason.

Mandatory states:

```text
Default, Hover, Focus, Active/Selected, Disabled/Gated, Loading, Empty, Error,
Success/Confirmed
```

No operational component may have only a default state.

## Figma File Architecture

Recommended pages:

- `00_Cover_And_Project_Truth`
- `01_Source_Digest_And_Decisions`
- `02_Information_Architecture`
- `03_Flows_And_User_Journeys`
- `04_Design_System_Tokens`
- `05_Components`
- `06_Owner_Dashboard_V3`
- `07_Admin_Users_V3`
- `08_Admin_Business_Detail_V3`
- `09_Responsive_Mobile`
- `10_Prototype_And_Handoff`
- `99_Archive`

Naming convention:

```text
Surface / Route / State / Viewport
Owner / Dashboard Overview / Setup incomplete / Desktop
Admin / Users / Search results / Desktop
Admin / Business Detail / Cleanup collapsed / Desktop
```

Variables/token groups:

| Token group | Examples |
|---|---|
| `color/bg` | default, soft, card, elevated |
| `color/text` | primary, secondary, muted, inverse |
| `color/status` | success, warning, danger, info, neutral |
| `color/action` | primary, primary-hover, secondary, disabled |
| `spacing` | 4, 8, 12, 16, 20, 24, 32, 40 |
| `radius` | sm, md, lg |
| `density` | compact, comfortable |

Prototype interactions:

| Interaction | Figma method |
|---|---|
| Button hover/press | Interactive components |
| Sidebar active state | Variants |
| Theme toggle | Variables/modes |
| Language EN/fr-CA | Variable mode or separate frame state |
| Search/filter mock | Variables or component states |
| Drawer open/close | Overlay or component variant |
| Modal confirmation | Overlay with clear CTA hierarchy |
| Multi-step setup | Variables plus conditional next actions |

Prototype safety rule:

- Prototype may show gated operations as blocked.
- Prototype must not imply production deletion, real customer data access, or
  paid-pilot readiness.

## Copy And Bilingual Standard

Preferred owner-facing words:

- Quote request.
- Lead recovery.
- Follow up.
- Manual reply.
- Review draft.
- Copy reply.
- Missing info.
- At risk.
- Ready.
- Needs setup.

Preferred founder/admin words:

- Workspace.
- Auth user.
- Access state.
- Gated operation.
- Audit trail.
- Production guard.
- Test/demo cleanup.
- Dry run.
- Exact confirmation.

Avoid owner-facing:

- Tenant.
- RLS.
- Schema.
- Migration.
- Provider error.
- Service role.
- Synthetic.
- Phase.
- Internal deletion.
- Full CRM.
- Auto-send.
- Guaranteed revenue.

Message safety:

- User messages must be short, non-technical, and action-oriented.
- Error messages must not leak raw provider/service/database details.
- Success messages must not imply actions that did not happen.
- EN and fr-CA copy must stay structurally equivalent.
- Translation must fit inside controls on mobile and desktop.

## Accessibility And Responsive Acceptance

Minimum accessibility:

- One H1 per page content area.
- Semantic buttons/links/forms.
- Inputs have labels.
- Status is text plus color/icon, not color-only.
- Keyboard focus is visible.
- Contrast follows WCAG 2.2 expectations.
- No text overlap.
- No clipped controls.
- Loading/empty/error states are explicit.

Responsive targets:

- Desktop wide: 1920x900.
- Laptop: 1366x768.
- Tablet where relevant.
- Mobile: 390x844 and 375x667.

Overflow rule:

```text
No horizontal overflow is acceptable on any target viewport.
```

## Data, Security, And RLS Guardrails

Tenant/security rules:

- Never loosen RLS for UI polish.
- Never expose service-role logic to client components.
- Never create admin-side production mutation just because a control exists.
- Server actions must enforce authorization.
- UI disabled/gated state is informational only; server remains source of
  truth.

Admin dangerous actions:

- Destructive actions require exact target confirmation.
- Production deletion stays blocked.
- Fake/test cleanup requires dry-run first.
- Auth user deletion is separate from workspace cleanup.
- Audit who/what/when/why.

PII/privacy:

- Use short customer names in scan lists.
- Avoid overexposing email/phone unless the user is in a detail/support context.
- Do not log raw customer content unnecessarily.
- Keep sensitive admin details out of owner-facing UI.

Safe analytics:

- Track quote request captured.
- Track draft generated/reviewed/copied.
- Track manual outcome recorded.
- Track readiness completed.
- Track follow-up completed.
- Do not track fake revenue or unsupported conversion claims.

## Codex Execution Standard

Non-negotiable start prompt for future implementation:

```text
Before coding, inspect the repo reality. Do not assume the docs are fully
implemented. Identify existing routes, components, data services, tests, and
security gates. Then implement only the next approved dashboard slice according
to the master dashboard standard.
```

Repo inspection before coding:

- Read `app/(dashboard)` routes.
- Read `app/admin/page.tsx`.
- Read dashboard shell/components.
- Read dashboard copy/i18n registry.
- Read server actions/services touched by the slice.
- Read unit/source tests guarding dashboard behavior.
- Check `git status` and do not overwrite unrelated work.

Approved implementation order:

1. Founder/Admin Business Detail V3.
2. Founder/Admin Users V3.
3. Owner/User Dashboard V3 first viewport.
4. Owner lead queue/detail.
5. Quote Setup/Business Profile/Settings cleanup.
6. Final dashboard QA gate.

Never do in the same pass:

- Redesign every route plus change database/security behavior.
- Add fake features to make the UI look complete.
- Open real-data/pilot gates.
- Mix public marketing rewrite with dashboard rebuild.
- Delete production data or auth users.
- Change RLS to satisfy UI.

## Codex Implementation Prompts

Prompt A - Repo reality audit:

```text
Audit the current BizPilot dashboard implementation against
BIZPILOT_DASHBOARD_MASTER_STANDARD_AND_CODEX_GUIDE_2026-06-27.md. Report:
existing routes/components/data services/tests, mismatches, and the safest next
implementation slice. Do not code yet unless the slice is obvious and local.
```

Prompt B - Owner Dashboard V3 first viewport:

```text
Implement Owner/User Dashboard V3 first viewport only. Keep the current data
plumbing. Make the safest next manual action dominant, integrate Start Here,
show four compact signals, keep metrics secondary, no nested first-viewport
scroll, no fake features. Validate with typecheck, lint, unit tests, build, and
Browser QA at desktop/laptop/mobile widths.
```

Prompt C - Founder/Admin Users V3:

```text
Implement Founder/Admin Users V3. Search/filter must appear before queues.
Default directory size is 10 users. Add selected user inspector and gated
support-action hierarchy without enabling blocked production operations.
Validate source guards and Browser QA.
```

Prompt D - Founder/Admin Business Detail V3:

```text
Implement Founder/Admin Business Detail V3. Fix scroll, empty-space, and safety
hierarchy. Business list max 10 rows and search-driven. Main controls compact:
access, quote link, plan, session. Founder note compact. Recent changes as
timeline strip. Cleanup drawer collapsed by default. No production cleanup or
deletion. Validate source guards, typecheck, lint, unit tests, build, and
Browser QA at 1920x900, 1366x768, and 390x844.
```

Prompt E - Final dashboard QA gate:

```text
Evaluate Owner/User and Founder/Admin dashboards against: first viewport
priority, empty-space control, scroll behavior, admin user search, business
detail safety hierarchy, owner first-run guidance, desktop/mobile overflow,
light/dark contrast, EN/fr-CA copy fit, no fake unsupported claims, and no
real-data/pilot gate bypass. Return PASS/BLOCKERS/NON-BLOCKING POLISH/UNVERIFIED.
```

## Universal Checklist

Before Figma:

- Role is clear.
- User's first question is clear.
- Product truth is respected.
- Fake/unimplemented features are removed or gated.
- Real data and paid pilot implications are checked.

In Figma:

- Frames match route map.
- Components use Auto Layout.
- Variables and modes exist.
- States exist for loading/empty/error/gated.
- Mobile variants exist.
- Danger/cleanup is collapsed by default.

Before Codex:

- Repo inspection is complete.
- Slice is small enough.
- Security gate is understood.
- Tests to add/update are named.
- Browser QA targets are named.

After implementation:

- Typecheck passes.
- Lint passes.
- Unit/source tests pass.
- Build passes.
- Desktop/mobile Browser QA is complete.
- No horizontal overflow.
- No raw technical errors leaked.
- No fake feature added.
- No security boundary weakened.

## Definition Of Done

Owner/User Dashboard DoD:

- Shared dashboard shell is used.
- One content H1.
- First viewport has one dominant next action.
- Start Here is short and task-based.
- Lead queue is scannable.
- AI draft is owner-reviewed and manual.
- Quote readiness is clear.
- Empty/loading/error states are safe.
- EN/fr-CA fit.
- No horizontal overflow.
- No fake analytics.

Founder/Admin Dashboard DoD:

- Founder/Admin is separate from owner dashboard.
- Users view is search-first.
- 10-user default is respected.
- Selected user inspector exists.
- Support actions show gated/allowed state.
- Business detail has workspace decision header.
- Controls are compact.
- Cleanup/danger is collapsed by default.
- All destructive actions are gated/confirmed/audited.
- Production deletion is blocked.
- Role/access change is blocked until A1/A2 gate.
- No horizontal overflow.

## Acceptance Scorecard

| Area | Required score | Acceptance meaning |
|---|---:|---|
| Owner first viewport priority | 10/10 | One clear next action exists before metrics/charts. |
| Owner first-run guidance | 10/10 | Start Here is clear, short, and task-based. |
| Lead queue scanability | 9/10+ | Customer/service/status/next action are visible quickly. |
| Admin user search | 10/10 | Search/filter comes before queues and 10-user default is respected. |
| Admin business safety hierarchy | 10/10 | Cleanup/danger is collapsed and secondary. |
| Empty-space control | 9/10+ | Empty panels or tall columns do not feel broken. |
| Scroll behavior | 10/10 | Body scroll only; no nested first-viewport scroll. |
| Desktop/mobile overflow | 10/10 | No horizontal overflow in target viewports. |
| Accessibility | 9/10+ | Focus, labels, contrast, and text+color status are respected. |
| Product honesty | 10/10 | No fake feature, auto-send, booking, or revenue claim. |
| Security posture | 10/10 | Real data, paid pilot, and destructive actions remain gated. |

## Final Understanding

Owner/User dashboard must not be a generic SaaS dashboard. It is a manual lead
recovery command center for cleaning business owners.

Founder/Admin dashboard must not be a general CRM or a dangerous operations
panel. It is an internal operations console for pilots, users, workspaces, quote
link state, access state, notes, audit, and guarded support actions.

Professional dashboard design for this project means:

- Less chart, more next action.
- Less hero, more workflow.
- Less red danger, more guarded clarity.
- Less fake future, more honest current capability.
- Less scattered UI, more systemized components.

## Superseded/Supporting Documents

The following remain useful as evidence, but this master governs future design
and implementation decisions:

- `P20_DASHBOARD_PRIORITY_HIERARCHY_REDESIGN_2026-06-27.md`
- `BIZPILOT_DASHBOARD_MARKETING_SEO_OPERATING_STANDARD_2026-06-27.md`
- `DASHBOARD_DESIGN_AUDIT_2026-06-20.md`
- `P17_OWNER_AND_ADMIN_DASHBOARD_CLARITY_UPGRADE_2026-06-27.md`
- `P18_OWNER_ADMIN_DASHBOARD_CLARITY_UPGRADE_2026-06-27.md`
- `P19_PUBLIC_MESSAGES_AND_DASHBOARD_WORKFLOW_STANDARD_2026-06-27.md`

The previous P21 standalone blueprint and HTML prototype have been merged into
this master standard to avoid competing dashboard instructions.
