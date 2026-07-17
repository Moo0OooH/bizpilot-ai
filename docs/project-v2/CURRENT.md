<!--
 * ============================================================
 * File: docs/project-v2/CURRENT.md
 * Project: BizPilot AI
 * Description: Compact entry point for the whole-project V2.1 documentation set.
 * Role: Directs contributors to the current phase plan, bilingual route audit, and discovery checklist.
 * Related:
 * - docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md
 * - docs/project-v2/BILINGUAL_ROUTE_AND_FLOW_AUDIT_2026-07-15.md
 * - docs/CURRENT_CANONICAL_DOCS_v2.1.md
 * Author: MoOoH
 * Created: 2026-07-15
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Recorded Dashboard V4.7 functional publication, configurable intake/runtime hardening, successful CI/deployment/Production read-only acceptance, and remaining authenticated/data gates.
 * - 2026-07-16: Recorded the final Website V4 design-polish release, CI, Vercel, and Production browser evidence.
 * - 2026-07-15: Closed the V2.1 public release with exact GitHub CI, Vercel, and Production read-only evidence.
 * - 2026-07-15: Recorded consolidation to 55 active documentation artifacts with historical snapshots retained only in Git history.
 * - 2026-07-15: Created the V2.1 whole-project documentation entry point.
 * ============================================================
 -->

# BizPilot Project V2.1 — Current

BizPilot is a bilingual, manual-first Smart Intake and owner-reviewed reply-preparation product for service businesses. Cleaning is the first complete pilot vertical. The public site, configurable public quote intake, owner dashboard, source-aware Reports, and guarded founder console are implemented in source; real customer data and paid pilot activation remain separate approval gates.

Dashboard V4.7 SHA `d9e25bbf50ccf42de2da4d70aa235ab7d289dc91`, exact tree `17d6b65cc9fb196c8d0d4ccaa46f5fd6f736076d`, is on `main`. Local lint, typecheck, `295/295` tests, and the Next.js production build passed. GitHub CI run `29558683869` (`CI #443`), GitHub Production deployment `5484816130` with status record `15596534668`, and Vercel target `4zpXiTSDYdZjKkwG3ukyaVFj2VwR` succeeded. Production read-only acceptance passed public `46/46`, responsive `20/20`, UI matrix `621/621` with zero failures, and active/inactive Quote EN/fr-CA `4/4` HTTP 200. No submission or mutation was performed.

V4.7 adds configurable public-form title/section structure, list/tab/step layouts, optional Reports/Guide owner navigation, responsive protected/public layouts, Google login without silent workspace bootstrap, and regression coverage that prevents callable translation helpers from crossing Server/Client Component boundaries. The owner-provided authenticated screenshot renders the role-gated Founder Admin entry, proving the founder allowlist is active; full protected/admin route visual acceptance and normal-owner denial remain gated.

Website V4 / Documentation V2.1 commit `c78596b1f1530ff3586b9b076702822b0b711802`, CI run `29517118330`, and Vercel target `CbDDUpqxCVMoG3L8hTgGRoymvi5m` remain historical public-site evidence only. No Production database or customer-data mutation was performed for Dashboard V4.7.

## Current control documents

1. [Master phase and finalization plan](MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md)
2. [Bilingual route and workflow audit](BILINGUAL_ROUTE_AND_FLOW_AUDIT_2026-07-15.md)
3. [SEO, analytics, and discovery checklist](SEO_ANALYTICS_AND_DISCOVERY_CHECKLIST_2026-07-15.md)
4. [Whole-project source of truth](../readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md)
5. [Machine-readable status](../readiness/current-status.json)
6. [Dashboard V4 contract](../dashboard-v4/CURRENT.md)
7. [Website V4 contract](../website-v4/CURRENT.md)
8. [Manual QA V2](../operations/BIZPILOT_MANUAL_QA_CHECKLIST_v2.0.md)
9. [Pilot readiness V2](../operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v2.0.md)
10. [External action prompt pack V2.1](../../prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.1.md)

## Status vocabulary

- `DONE`: implemented and verified at the stated evidence level.
- `GATED`: code or procedure exists, but credentials, a safe target, external-console access, production-change authority, or owner approval is required.
- `TODO`: approved work remains inside the repository and can be implemented without widening product scope.
- `ROADMAP`: explicitly outside the current product or pilot contract.

Git history is the historical audit trail. Dated phase reports and obsolete visual evidence are not part of the active documentation set. The `docs/` tree is consolidated to 55 active artifacts: 53 Markdown authorities, one machine-readable status JSON, and one header-only CRM CSV template.
