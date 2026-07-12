<!--
 * ============================================================
 * File: docs/README.md
 * Project: BizPilot AI
 * Description: Documentation index and authority classification.
 * Role: Directs readers to current controls before standards or historical evidence.
 * Related:
 * - docs/readiness/BIZPILOT_FINAL_SOURCE_OF_TRUTH_2026-07-12.md
 * - docs/CURRENT_CANONICAL_DOCS_v1.7.md
 * - docs/archive/README.md
 * Author: MoOoH
 * Created: 2026-05-28
 * Last Updated: 2026-07-12
 * Change Log:
 * - 2026-07-12: Replaced the phase-by-phase entry list with current authority classes.
 * ============================================================
 -->

# BizPilot AI Documentation

Start with the current source of truth. Do not choose a phase report because it
has the newest-sounding title or calls itself final.

## CURRENT — controls present work

1. [Final source of truth](readiness/BIZPILOT_FINAL_SOURCE_OF_TRUTH_2026-07-12.md)
2. [Machine-readable status](readiness/current-status.json)
3. [Canonical documentation map](CURRENT_CANONICAL_DOCS_v1.7.md)
4. [AI coding agent start guide](AI_CODING_AGENT_START_HERE_v1.7.md)

These documents state what is implemented, what is blocked, and which gates
need owner approval. They override older status, readiness, phase, and “final”
reports.

## STANDARD — constrains implementation, does not prove readiness

- `product/BIZPILOT_FEATURE_ENTITLEMENT_AND_GUIDE_STANDARD_v1.0.md`
- `product/BIZPILOT_MULTILINGUAL_RESPONSIVE_UI_STANDARD_v1.0.md`
- `engineering/BIZPILOT_ENGINEERING_STANDARD_v1.5.md`
- `engineering/BIZPILOT_BACKEND_DATABASE_RLS_STANDARD_v1.5.md`
- `security/BIZPILOT_SECURITY_PRIVACY_COMPLIANCE_STANDARD_v1.5.md`
- `operations/BIZPILOT_DOMAIN_DEPLOYMENT_RUNBOOK_v1.0.md`
- `ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`
- `business/PILOT_TERMS_DECISION_GATE.md`

Follow a standard whenever it applies, but do not infer that its checklist has
been completed. Current release status remains controlled by the CURRENT set.

## HISTORICAL EVIDENCE — preserve and cite narrowly

- `readiness/PHASE_25*` through `readiness/PHASE_30*`
- Earlier `readiness/` reports, audits, QA records, and handoffs
- Older canonical packages, work logs, and dated implementation reports

These files are valuable records of a point-in-time test, decision, or change.
They cannot override the current source of truth or authorize production work.

## ARCHIVED — retained for traceability

See [docs/archive/README.md](archive/README.md) for the interpretation rule.
Archive tags and the branch cleanup record preserve historic Git branch state;
they do not change release approval.

## Documentation conflict rule

1. Current source of truth and JSON status win.
2. Security, RLS, privacy, and production-data restrictions win over convenience.
3. Applicable standards constrain implementation.
4. Historical evidence may establish a specific past result, but never a later
   gate closure that it does not explicitly prove.

When adding a new report, classify it as CURRENT only if it replaces the source
of truth with evidence-backed, owner-approved status. Otherwise label it as
historical evidence and link it from the appropriate current document.
