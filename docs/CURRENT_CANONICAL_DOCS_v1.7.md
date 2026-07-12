<!--
 * ============================================================
 * File: docs/CURRENT_CANONICAL_DOCS_v1.7.md
 * Project: BizPilot AI
 * Description: Canonical documentation authority map.
 * Role: Resolves documentation conflicts and prevents historical reports from directing work.
 * Related:
 * - docs/readiness/BIZPILOT_FINAL_SOURCE_OF_TRUTH_2026-07-12.md
 * - docs/readiness/current-status.json
 * - docs/AI_CODING_AGENT_START_HERE_v1.7.md
 * Author: MoOoH
 * Created: 2026-05-28
 * Last Updated: 2026-07-12
 * Change Log:
 * - 2026-07-12: Consolidated current authority around the final source of truth.
 * ============================================================
 -->

# BizPilot AI — Current Canonical Documentation Map v1.7

## Authority order

1. [Final source of truth](readiness/BIZPILOT_FINAL_SOURCE_OF_TRUTH_2026-07-12.md)
2. [Machine-readable current status](readiness/current-status.json)
3. This map and the [AI coding agent guide](AI_CODING_AGENT_START_HERE_v1.7.md)
4. Applicable standards listed below
5. Historical evidence and archive records

The first two documents control current product, release, data, and pilot
status. No older phase report can override them.

## CURRENT

| Document | Purpose |
| --- | --- |
| `readiness/BIZPILOT_FINAL_SOURCE_OF_TRUTH_2026-07-12.md` | Current product definition, implemented scope, exact blockers, and owner actions. |
| `readiness/current-status.json` | Machine-readable equivalent for tooling and quick checks. |
| `README.md` and `docs/README.md` | Entry points that link only to current authority and classification. |
| `AI_CODING_AGENT_START_HERE_v1.7.md` | Implementation guardrails and required pre-edit reading. |

## STANDARD

Use these where relevant. They are binding constraints, not evidence that a
release gate passed.

- `product/BIZPILOT_FEATURE_ENTITLEMENT_AND_GUIDE_STANDARD_v1.0.md`
- `product/BIZPILOT_MULTILINGUAL_RESPONSIVE_UI_STANDARD_v1.0.md`
- `engineering/BIZPILOT_ENGINEERING_STANDARD_v1.5.md`
- `engineering/BIZPILOT_BACKEND_DATABASE_RLS_STANDARD_v1.5.md`
- `security/BIZPILOT_SECURITY_PRIVACY_COMPLIANCE_STANDARD_v1.5.md`
- `operations/BIZPILOT_DOMAIN_DEPLOYMENT_RUNBOOK_v1.0.md`
- `ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`
- `business/PILOT_TERMS_DECISION_GATE.md`

## HISTORICAL EVIDENCE

All dated phase/readiness reports, including Phase 25–30, remain useful
evidence. Their results are bounded by their recorded date, target, data class,
and command. They cannot authorize a new production mutation, real customer
data, or paid-pilot claim.

## ARCHIVED

`archive/README.md` defines historical-document handling. The 2026-07-12
branch archive record and `archive/branches/*` Git tags preserve branch history
without preserving active branch authority.

## Non-negotiable current boundaries

- Cleaning-first, manual-first quote recovery remains the product surface.
- AI is owner-reviewed draft support only.
- Real customer data and paid pilot are blocked.
- Google OAuth code is not proof of configured/live Google login; phone auth is
  not implemented.
- Local/synthetic dashboard and RLS results are not production-final proof.
- DB-level restore proof is not strict restored application/dashboard/RLS proof.
- Do not claim Vercel or production readiness without current, non-secret
  deployment evidence.
