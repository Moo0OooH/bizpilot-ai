<!--
 * ============================================================
 * File: docs/dashboard-v4/CHANGELOG.md
 * Project: BizPilot AI
 * Description: Human-readable Dashboard V4 change log.
 * Role: Summarizes user-visible and engineering changes without duplicating the source-of-truth status.
 * Related:
 * - docs/dashboard-v4/CURRENT.md
 * - docs/dashboard-v4/PHASE_PROGRESS.md
 * Author: MoOoH
 * Created: 2026-07-14
 * Last Updated: 2026-07-14
 * Change Log:
 * - 2026-07-14: Created for Dashboard V4.
 * ============================================================
 -->

# Dashboard V4 Changelog

## 2026-07-14

### Owner shell

- Reduced primary navigation to five task destinations and exposed Settings in mobile navigation.
- Removed the repeated page-guide rail, local density/display preference framework, and duplicated topbar route heading.
- Narrowed protected content from 108rem to 90rem for more consistent laptop and large-screen composition.

### Owner workflow

- Rebuilt Overview around one next action, compact readiness, daily priorities, useful metrics, and a short lead queue.
- Simplified Leads to one contextual focus cue plus the full searchable/sortable/paginated queue.
- Simplified Lead Detail, kept advanced context in disclosures, removed a non-persisted notes box, and replaced a no-op Edit control with real draft editing.
- Reduced Quote Setup to Overview, Services, Fields, Branding, FAQ/AI, and Privacy while preserving all required form values.
- Reduced Settings to account/language/theme/session essentials plus guardrail, history, and lifecycle disclosures.

### Founder operations

- Removed the extra founder handoff screen after authorization.
- Replaced the decorative overview chart matrix with compact localized metrics and operational priorities.
- Retained search, health, lead, activity, cleanup, lifecycle, and audit controls behind existing guards.

### Localization and quality

- Polished Canadian French owner/admin accents and built-in custom-field examples.
- Replaced obsolete Dashboard V3/P12 regression tests with Dashboard V4 contracts.
- Consolidated current docs and removed reports superseded by the V4 source of truth.

### Boundaries

- No application route, feature entitlement, database migration, Production data mutation, automatic sending, booking, payment, or direct social integration was added.
