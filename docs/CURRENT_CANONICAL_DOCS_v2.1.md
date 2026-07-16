<!--
 * ============================================================
 * File: docs/CURRENT_CANONICAL_DOCS_v2.1.md
 * Project: BizPilot AI
 * Description: Version 2.1 documentation authority map.
 * Role: Identifies the current product, route, phase, release, security, and external-gate authorities.
 * Related:
 * - docs/project-v2/CURRENT.md
 * - docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md
 * - docs/readiness/current-status.json
 * Author: MoOoH
 * Created: 2026-07-15
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Confirmed the Website V4 authority now contains the final public design-polish release evidence.
 * - 2026-07-15: Replaced V2.0 with the consolidated whole-project V2.1 authority hierarchy.
 * ============================================================
 -->

# BizPilot AI Canonical Documentation V2.1

## Authority order

1. Security, privacy, RLS, production-data, credential, and destructive-operation guards.
2. [Current project entry](project-v2/CURRENT.md), [master phase plan](project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md), and [source of truth](readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md).
3. [Machine-readable status](readiness/current-status.json).
4. [Bilingual route/flow audit](project-v2/BILINGUAL_ROUTE_AND_FLOW_AUDIT_2026-07-15.md), [Website V4](website-v4/CURRENT.md), and [Dashboard V4](dashboard-v4/CURRENT.md).
5. The current engineering, security, product, operations, sales, and business standards below.

Git history preserves point-in-time phase reports. A historical file cannot reopen a gate, authorize production data, or override a current document.

## Current working set

| Purpose | Authority |
| --- | --- |
| Whole-project phase/dependency order | `docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md` |
| Every route, language, state, and workflow | `docs/project-v2/BILINGUAL_ROUTE_AND_FLOW_AUDIT_2026-07-15.md` |
| SEO, CWV, discovery, and no-PII measurement | `docs/project-v2/SEO_ANALYTICS_AND_DISCOVERY_CHECKLIST_2026-07-15.md` |
| Release posture and product boundary | `docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md` |
| Machine-readable state | `docs/readiness/current-status.json` |
| Public Website contract | `docs/website-v4/CURRENT.md` |
| Dashboard product/UI contract and progress | `docs/dashboard-v4/CURRENT.md`, `docs/dashboard-v4/PHASE_PROGRESS.md`, `docs/dashboard-v4/CHANGELOG.md` |
| Manual acceptance | `docs/operations/BIZPILOT_MANUAL_QA_CHECKLIST_v2.0.md` |
| Real-data and paid-pilot gates | `docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v2.0.md` |
| Coding-agent entry | `docs/AI_CODING_AGENT_START_HERE_v2.1.md` |
| Tasks needing external/owner access | `prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.1.md` |

## Binding standards

- Architecture/portability: `docs/architecture/BIZPILOT_ARCHITECTURE_v1.4.md`, `docs/architecture/BIZPILOT_VENDOR_INDEPENDENCE_AND_PORTABILITY_STANDARD_v1.0.md`
- Engineering: `docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.5.md`
- Backend/RLS: `docs/engineering/BIZPILOT_BACKEND_DATABASE_RLS_STANDARD_v1.5.md`, `docs/engineering/BIZPILOT_DATABASE_RLS_POLICY_BASELINE_v1.0.md`
- Safe errors/logging: `docs/engineering/BIZPILOT_SAFE_ERROR_HANDLING_STANDARD_v1.0.md`, `docs/engineering/BIZPILOT_SAFE_LOGGING_BASELINE_v1.0.md`
- Multilingual/responsive: `docs/product/BIZPILOT_MULTILINGUAL_RESPONSIVE_UI_STANDARD_v1.0.md`, `docs/product/BIZPILOT_RESPONSIVE_LAYOUT_AND_DEVICE_STANDARD_v1.0.md`
- Lead scoring: `docs/product/BIZPILOT_SCORING_SPEC_v1.1.md`
- Security/privacy/access/lifecycle: the current files in `docs/security/`
- Deploy/rollback/backup: `docs/operations/BIZPILOT_PRODUCTION_DEPLOYMENT_RUNBOOK_v1.0.md`, `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`
- Commercial gate: `docs/business/PILOT_TERMS_DECISION_GATE.md`

Standards constrain work; they do not prove a gate passed.

## Product truth

- One Smart Intake Link collects structured requests where the business chooses to share it.
- BizPilot exposes missing information, prioritizes follow-up, and prepares owner-reviewed drafts.
- Owners edit, copy, and manually send through existing channels.
- Direct social/email inbox connections, auto-send, booking, invented pricing, payments, invoicing, and full CRM scope are not live.
- Cleaning is the first complete pilot vertical; other service verticals remain validation work.
