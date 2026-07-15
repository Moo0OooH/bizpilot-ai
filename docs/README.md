<!--
 * ============================================================
 * File: docs/README.md
 * Project: BizPilot AI
 * Description: Documentation index and authority classification.
 * Role: Directs readers to the V2 current set before standards or historical evidence.
 * Related:
 * - docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md
 * - docs/CURRENT_CANONICAL_DOCS_v2.0.md
 * - docs/archive/README.md
 * Author: MoOoH
 * Created: 2026-05-28
 * Last Updated: 2026-07-14
 * Change Log:
 * - 2026-07-14: Replaced the V1.7/phase-oriented index with the compact V2 current working set.
 * ============================================================
 -->

# BizPilot AI Documentation

## Start here

1. [Whole-project source of truth](readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md)
2. [Machine-readable status](readiness/current-status.json)
3. [Canonical authority map V2.0](CURRENT_CANONICAL_DOCS_v2.0.md)
4. [Dashboard V4 current contract](dashboard-v4/CURRENT.md)
5. [Website V4 current contract](website-v4/CURRENT.md)
6. [AI coding-agent start guide V2.0](AI_CODING_AGENT_START_HERE_v2.0.md)
7. [Manual QA checklist V2.0](operations/BIZPILOT_MANUAL_QA_CHECKLIST_v2.0.md)
8. [Pilot-readiness checklist V2.0](operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v2.0.md)
9. [External-access prompt pack](../prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.0.md)

These files control current planning and claims. A dated phase report, work log, or file named “final” is not current unless the authority map lists it.

## Classification

- `CURRENT`: the nine links above.
- `STANDARD`: current engineering, security, product, operations, and business constraints listed by the authority map.
- `EVIDENCE`: retained migration, security, GTM, release, or QA records that prove only their point-in-time result.
- `ARCHIVE`: superseded public-design material intentionally retained under `docs/archive/` for traceability.

## Conflict rule

Security/RLS/production-data restrictions win first. Then the current source of truth and status JSON. Then the current surface contract. Standards constrain implementation but do not prove readiness. Historical evidence cannot close a later gate.

Git history preserves deleted superseded reports, so active documentation does not need multiple competing “final” files.
