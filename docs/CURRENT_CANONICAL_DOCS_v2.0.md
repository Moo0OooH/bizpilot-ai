<!--
 * ============================================================
 * File: docs/CURRENT_CANONICAL_DOCS_v2.0.md
 * Project: BizPilot AI
 * Description: Version 2.0 documentation authority map.
 * Role: Identifies the small set of documents that controls present product, dashboard, release, security, and external-gate decisions.
 * Related:
 * - docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md
 * - docs/dashboard-v4/CURRENT.md
 * - docs/website-v4/CURRENT.md
 * - docs/readiness/current-status.json
 * Author: MoOoH
 * Created: 2026-07-14
 * Last Updated: 2026-07-14
 * Change Log:
 * - 2026-07-14: Replaced the V1.7 phase-oriented index with a compact V2 authority hierarchy.
 * ============================================================
 -->

# BizPilot AI Canonical Documentation V2.0

## Authority order

When documents disagree, use this order:

1. Security, privacy, RLS, production-data, and destructive-operation guards.
2. [Current source of truth](readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md).
3. [Machine-readable current status](readiness/current-status.json).
4. Current surface documents: [Website V4](website-v4/CURRENT.md) and [Dashboard V4](dashboard-v4/CURRENT.md).
5. Current engineering, product, and operations standards listed below.
6. Historical reports only for the exact evidence they recorded at that time.

No dated phase report can reopen a gate, authorize production data, or override a later current document.

## Current working set

| Purpose | Authority |
| --- | --- |
| Whole project and release posture | `docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md` |
| Machine-readable status | `docs/readiness/current-status.json` |
| Dashboard product/UI contract | `docs/dashboard-v4/CURRENT.md` |
| Dashboard phase completion | `docs/dashboard-v4/PHASE_PROGRESS.md` |
| Dashboard change record | `docs/dashboard-v4/CHANGELOG.md` |
| Public Website V4 contract | `docs/website-v4/CURRENT.md` |
| Manual browser acceptance | `docs/operations/BIZPILOT_MANUAL_QA_CHECKLIST_v2.0.md` |
| Real-data and paid-pilot gates | `docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v2.0.md` |
| Coding-agent entry point | `docs/AI_CODING_AGENT_START_HERE_v2.0.md` |
| Tasks requiring owner/external access | `prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.0.md` |

## Binding standards

- Engineering: `docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.5.md`
- Backend/RLS: `docs/engineering/BIZPILOT_BACKEND_DATABASE_RLS_STANDARD_v1.5.md`
- Safe errors and logs: `docs/engineering/BIZPILOT_SAFE_ERROR_HANDLING_STANDARD_v1.0.md`, `docs/engineering/BIZPILOT_SAFE_LOGGING_BASELINE_v1.0.md`
- Multilingual/responsive UI: `docs/product/BIZPILOT_MULTILINGUAL_RESPONSIVE_UI_STANDARD_v1.0.md`
- Security/privacy: `docs/security/BIZPILOT_SECURITY_PRIVACY_COMPLIANCE_STANDARD_v1.5.md`
- Lifecycle/deletion: `docs/security/BIZPILOT_BUSINESS_LIFECYCLE_AND_DELETION_POLICY_v1.0.md`
- Deploy/rollback: `docs/operations/BIZPILOT_PRODUCTION_DEPLOYMENT_RUNBOOK_v1.0.md`
- Backup/restore: `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`
- Acceptance/pilot gate: `docs/operations/BIZPILOT_MANUAL_QA_CHECKLIST_v2.0.md`, `docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v2.0.md`
- Commercial terms gate: `docs/business/PILOT_TERMS_DECISION_GATE.md`

Standards constrain work; they do not prove a gate passed.

## Product truth that must remain consistent

- One Smart Intake Link gathers structured customer requests from channels where the business chooses to share it.
- BizPilot organizes requests, exposes missing information, prioritizes follow-up, and prepares owner-reviewed drafts.
- Owners edit, copy, and send through their existing channels.
- No direct social inbox integration, autonomous reply, booking confirmation, invented price, payment collection, or full CRM is represented as live.
- Cleaning is the first complete pilot vertical; the product architecture remains service-business oriented.

## Historical interpretation

Git history is the durable audit trail. Retained dated reports may support a narrow historical fact, but the V2 current set is the only planning entry point. A file calling itself “final” is not current unless it appears in the table above.
