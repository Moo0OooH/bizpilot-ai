<!--
 * ============================================================
 * File: docs/archive/README.md
 * Project: BizPilot AI
 * Description: Defines how historical documentation is retained and interpreted.
 * Role: Prevents archived or point-in-time reports from authorizing current work.
 * Related:
 * - docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md
 * - docs/readiness/FINAL_GIT_BRANCH_ARCHIVE_AND_CLEANUP_2026-07-12.md
 * Author: MoOoH
 * Created: 2026-07-12
 * Last Updated: 2026-07-14
 * Change Log:
 * - 2026-07-14: Updated the authority order for Documentation V2 and clarified that deleted superseded reports remain recoverable through Git history.
 * - 2026-07-12: Created the historical-evidence and archive interpretation guide.
 * ============================================================
 -->

# BizPilot AI Historical Documentation Archive

Selected historical documents remain in the archive or evidence folders. Reports
deleted during V2 consolidation remain recoverable through Git history, which is
the durable audit trail. Historical material is not current authorization.

## What is historical evidence

The following are historical evidence unless the current source of truth links
to a specific finding:

- phase and slice reports, including Phase 25 through Phase 30;
- dated readiness, audit, QA, and “final” reports;
- legacy canonical packages, implementation prompts, work logs, and handoffs;
- branch archive records and archived Git tags.

Words such as *final*, *passed*, *ready*, or *production* in a historical report
apply only to that report's stated scope, date, target, and assumptions. They
do not authorize production changes, real customer data, paid pilot work, or a
claim that a later blocker has closed.

## Current authority order

1. [`docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md`](../readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md)
2. [`docs/readiness/current-status.json`](../readiness/current-status.json)
3. [`docs/CURRENT_CANONICAL_DOCS_v2.0.md`](../CURRENT_CANONICAL_DOCS_v2.0.md)
4. Current standards named in that map.
5. Historical evidence, only for traceability or a specifically cited result.

Do not move large historical sets merely to make the tree look cleaner. If a
future move is approved, preserve the old path through redirects or repaired
links and validate every affected internal Markdown link.
