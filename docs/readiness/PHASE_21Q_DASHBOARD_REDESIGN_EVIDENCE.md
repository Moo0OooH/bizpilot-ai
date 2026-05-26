# Phase 21Q Dashboard Redesign Evidence

Date: 2026-05-25
Branch: `phase-21q-dashboard-redesign`
Base after safe rebase: `2bd12e1 feat(admin): add traceable session controls`
Phase branch reference at the time of rebase: `3957d56 feat(admin): refresh founder console experience`

## Scope

BizPilot remains a cleaning-first Quote Recovery / Lead Recovery Command Center.
This pass did not add booking, invoices, SMS, WhatsApp, Instagram, calendar sync,
AI auto-send, marketplace, a full CRM, real customer data, production SQL, 0020
production apply, or OpenAI debugging.

## Rollback posture

Pre-redesign rollback refs already exist on GitHub:

- `backup/pre-dashboard-redesign-20260525-194012`
- `backup/pre-dashboard-redesign-synced-20260525-194041`
- `backup/dashboard-redesign-pre-rebase-20260525-202820`

The redesign was kept on `phase-21q-dashboard-redesign` so `main` and
`phase-21-production-alignment` can remain untouched until owner review.

## Design references used

- NN/g visual hierarchy guidance: prioritize the user's eye with contrast,
  scale, grouping, and restrained color.
  https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
- NN/g progressive disclosure guidance: show the most important options first
  and defer secondary complexity.
  https://www.nngroup.com/articles/progressive-disclosure/
- Carbon data-table guidance: lead queues should support efficient scanning,
  filtering, and task-specific navigation.
  https://carbondesignsystem.com/components/data-table/usage/

## What changed

- Default dashboard theme now starts in light mode unless the user has a dark
  cookie, with dark mode still available.
- Dashboard chrome was made calmer: narrower sidebar, lighter surfaces, lower
  shadows, reduced radius, and less decorative gradient treatment.
- Shared dashboard primitives now use 8px card/button/input radius and quieter
  metrics/badges.
- Overview is more action-first: urgent lead, reply/missing-info/at-risk counts,
  KPIs, queue preview, readiness, and AI guardrails have clearer priority.
- Lead queue was tightened for operational scanning with denser rows, clearer
  toolbar spacing, and safer responsive behavior.
- Quote Setup tabs became a vertical section navigator on desktop and compact
  horizontal navigation on mobile.
- Quote Setup overview breakpoints were adjusted after visual QA found a
  cramped laptop-width layout.
- Settings now surfaces immature/future features as quiet maturity notes rather
  than disabled action-heavy cards.
- Phase copy was updated from stale Phase 18A labels to Phase 21Q production
  readiness language in EN and fr-CA.

## Visual QA

Synthetic workspace used: `Codex Visual Cleaning`.
No real customer data was used.
No secrets, tokens, or keys were printed or committed.

Checked in the local browser:

- `/dashboard`
- `/dashboard/leads`
- `/dashboard/configuration`
- `/dashboard/settings`
- `/dashboard/business-profile`

Desktop viewport:

- Dashboard: no horizontal overflow.
- Leads: no horizontal overflow.
- Quote Setup: no horizontal overflow after breakpoint fix.
- Settings: no horizontal overflow.
- Business Profile: no horizontal overflow.

Mobile viewport:

- Dashboard: no horizontal overflow.
- Leads: no horizontal overflow.
- Quote Setup: no horizontal overflow.
- Settings: no horizontal overflow.

## Validation

Passed:

- `git diff --check`
- `pnpm test:unit` (59/59)
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm verify`
- `pnpm smoke:public -- --base-url=http://localhost:3000` (9/9)
- `pnpm smoke:public -- --base-url=https://bizpilo.com` (9/9)
- `pnpm smoke:quote -- --base-url=https://bizpilo.com --inactive-slug=phase-21-synthetic-unavailable-check` (1/1)

Not run in this redesign pass:

- `pnpm test:rls` because no RLS code or policy code changed in this pass.
- Production active quote submission smoke.
- Production fr-CA active quote submission smoke.
- Production horizontal access smoke.

## Remaining blockers

- OpenAI remains paused until owner confirms the support/account quota issue is
  resolved.
- SMTP provider/DNS/custom SMTP still needs owner-side setup and smoke.
- Backup/export/restore posture still needs the owner decision before real data.
- Real customer data and paid pilot remain blocked.
- Production 0020 apply remains blocked.
