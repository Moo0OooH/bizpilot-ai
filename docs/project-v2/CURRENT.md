<!--
 * ============================================================
 * File: docs/project-v2/CURRENT.md
 * Project: BizPilot AI
 * Description: Compact entry point for the whole-project V2.1 documentation set.
 * Role: Directs contributors to the current phase plan, bilingual route audit, and discovery checklist.
 * Related:
 * - docs/readiness/FINAL_SYNC_2026-11-19.md
 * - docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md
 * - docs/project-v2/BILINGUAL_ROUTE_AND_FLOW_AUDIT_2026-07-15.md
 * - docs/CURRENT_CANONICAL_DOCS_v2.1.md
 * Author: MoOoH
 * Created: 2026-07-15
 * Last Updated: 2026-11-19
 * Change Log:
 * - 2026-11-19: Replaced stale source-candidate gates with the synchronized GitHub, Supabase, Vercel, and acceptance posture.
 * - 2026-07-22: Corrected the historical V4.7 local object identity while keeping the current candidate's external gates separate.
 * - 2026-07-21: Separated the later Premium Operations migration from any remote or Production claim.
 * - 2026-07-17: Recorded Dashboard V4.7 functional publication, configurable intake/runtime hardening, successful CI/deployment/Production read-only acceptance, and remaining authenticated/data gates.
 * - 2026-07-16: Recorded the final Website V4 design-polish release, CI, Vercel, and Production browser evidence.
 * - 2026-07-15: Closed the V2.1 public release with exact GitHub CI, Vercel, and Production read-only evidence.
 * - 2026-07-15: Recorded consolidation to 55 active documentation artifacts with historical snapshots retained only in Git history.
 * - 2026-07-15: Created the V2.1 whole-project documentation entry point.
 * ============================================================
 -->

# BizPilot Project V2.1 — Current

BizPilot is a bilingual, manual-first Smart Intake and owner-reviewed reply-preparation product for service businesses. Cleaning is the first complete pilot vertical. The public site, configurable public quote intake, owner dashboard, source-aware Reports, Premium Operations, and guarded founder console are implemented and released; real customer data and paid pilot activation remain separate approval gates.

PR #14 merged to `main` as `c4257025f65f434b1abefadb5bf7f02878f1d9b6`. Main CI and Vercel Production pass. Supabase local and linked migration histories match through `0027`, linked lint reports no schema errors, local RLS passes `14/14`, and read-only Production statistics report zero estimated rows in every public table.

Local public, responsive, Quote, UI-matrix, and browser interaction checks pass. The dense synthetic authenticated Owner/Operations/Founder/Admin suite passes `17/17` on local Supabase and its fixtures were removed by reset. The same public acceptance suites pass on `bizpilo.com`.

The live Google provider callback, Production authenticated real-account acceptance, final backup restore drill, real-data controls, and paid-pilot commercial/operations gates remain open. See the [final synchronization report](../readiness/FINAL_SYNC_2026-11-19.md) for exact receipts, weaknesses, and the R1–R4 remaining phases.

## Current control documents

1. [Final synchronization and remaining phases](../readiness/FINAL_SYNC_2026-11-19.md)
2. [Machine-readable status](../readiness/current-status.json)
3. [Master phase and finalization plan](MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md)
4. [Bilingual route and workflow audit](BILINGUAL_ROUTE_AND_FLOW_AUDIT_2026-07-15.md)
5. [SEO, analytics, and discovery checklist](SEO_ANALYTICS_AND_DISCOVERY_CHECKLIST_2026-07-15.md)
6. [Whole-project source of truth](../readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md)
7. [Dashboard V4 contract](../dashboard-v4/CURRENT.md)
8. [Website V4 contract](../website-v4/CURRENT.md)
9. [Manual QA V2](../operations/BIZPILOT_MANUAL_QA_CHECKLIST_v2.0.md)
10. [Pilot readiness V2](../operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v2.0.md)
11. [External action prompt pack V2.1](../../prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.1.md)

## Status vocabulary

- `DONE`: implemented and verified at the stated evidence level.
- `GATED`: code or procedure exists, but credentials, a safe target, external-console access, production-change authority, or owner approval is required.
- `TODO`: approved work remains inside the repository and can be implemented without widening product scope.
- `ROADMAP`: explicitly outside the current product or pilot contract.

Git history is the historical audit trail. Dated phase reports and obsolete visual evidence are not part of the active documentation set. The current `docs/` tree contains 56 active artifacts: 54 Markdown authorities, one machine-readable status JSON, and one header-only CRM CSV template.
