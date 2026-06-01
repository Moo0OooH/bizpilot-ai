# BizPilot AI — Current Canonical Docs Map v1.7

## Purpose

This file is the active documentation map for BizPilot AI after the v1.6 strategic alignment update. It does **not** delete or replace the original documents. It clarifies which files should be treated as current authority by MoOoH, Cloud Code, Codex, or any AI coding agent.

## Active Strategic Direction

BizPilot AI must be executed as:

> **A Lead Recovery & Response System for cleaning businesses.**

Customer-facing framing:

> **Quote Recovery Command Center for Cleaning Businesses.**

2026-05-26 owner update: the product may expand beyond the early cleaning-first quote recovery MVP. Expansion must happen through explicit feature entitlement, owner-controlled activation, Settings visibility, customer/owner guides, and validation evidence. Do not default-enable or overpromise broad capabilities before the implementation, provider/payment/API posture, and smoke evidence are real.

## Highest Authority Files

Read these first, in this exact order:

2026-05-30 product decision addendum: owner notification email is intentionally
deferred for the first pilot. The approved communication workflow is manual
dashboard review and manual response. See
`product/PRODUCT_DECISION_OWNER_NOTIFICATION_EMAIL_DEFERRED_FIRST_PILOT_2026-05-30.md`.

1. `CURRENT_CANONICAL_DOCS_v1.7.md` — this file; active source-of-truth map.
2. `AI_CODING_AGENT_START_HERE_v1.7.md` — execution instructions for Cloud Code/Codex.
3. `BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md` — active strategic overlay.
4. `product/BIZPILOT_FEATURE_ENTITLEMENT_AND_GUIDE_STANDARD_v1.0.md` — active expansion, Settings visibility, and guide standard.
5. `security/BIZPILOT_SECURITY_PRIVACY_COMPLIANCE_STANDARD_v1.5.md` — active security/privacy standard.
6. `engineering/BIZPILOT_BACKEND_DATABASE_RLS_STANDARD_v1.5.md` — active backend/RLS hardening standard.
7. `engineering/BIZPILOT_ENGINEERING_STANDARD_v1.5.md` — active engineering standard.
8. `product/BIZPILOT_MASTER_BLUEPRINT_v1.4.md` — preserved product blueprint plus v1.6 addendum.
9. `product/BIZPILOT_BUILD_PLAN_v1.4.md` — active build plan with v1.6 alignment applied and 2026-05-26 expansion update.
10. `operations/BIZPILOT_MVP_HARDENING_CHECKLIST_v1.0.md` — hardening execution checklist.
11. `operations/BIZPILOT_STRATEGIC_ALIGNMENT_IMPLEMENTATION_CHECKLIST_v1.6.md` — alignment checklist.
12. `operations/BIZPILOT_REPO_INSPECTION_AND_READINESS_GAP_REPORT_v1.0.md` — current repo inspection and readiness truth table.

Additional active lifecycle/deletion authorities:

- `security/BIZPILOT_BUSINESS_LIFECYCLE_AND_DELETION_POLICY_v1.0.md`
- `operations/BIZPILOT_DELETION_AND_CLEANUP_RUNBOOK_v1.0.md`
- `readiness/PHASE_19_BUSINESS_LIFECYCLE_DELETION_READINESS.md`

## Current Readiness Snapshot - 2026-05-30

Use these files for the latest production and documentation status before
starting new work:

- `readiness/WHERE_WE_ARE_WITH_NEXT_STEP_2026-05-29.md` - current operator
  handoff and source-of-truth summary after Phase 23F; includes completed
  synthetic production proof, remaining blockers, and corrected next steps.
- `readiness/PHASE_24_REAL_DATA_APPROVAL_GATE_2026-05-30.md` - active real-data
  approval gate; do not start real customer data until this gate closes.
- `readiness/PHASE_23_PRODUCTION_FUNCTIONAL_SMOKE_2026-05-29.md` - Phase 23B
  through Phase 23F production evidence; core synthetic flow, OpenAI provider
  proof, and external Auth email/custom SMTP proof passed.
- `product/PRODUCT_DECISION_OWNER_NOTIFICATION_EMAIL_DEFERRED_FIRST_PILOT_2026-05-30.md` -
  owner notification email is intentionally deferred for the first pilot.
- `readiness/DOCS_PROGRESS_AND_GAP_REPORT_2026-05-28.md` - current docs audit,
  progress summary, repaired inventory gap list, and remaining operational gaps.
- `readiness/PHASE_22_PRODUCTION_ACCESS_AND_RUNTIME_AUDIT_2026-05-27.md` -
  latest production access/runtime evidence; founder/admin backend data loading
  recovered, public smoke passing, quote smoke passing, and RLS coverage
  recorded.
- `readiness/PHASE_21Z_AUTONOMOUS_STATUS_AND_OWNER_ACTIONS_2026-05-26.md` -
  living owner-action and autonomous-status handoff.
- `readiness/HOMEPAGE_RENEW_V2_WORK_LOG.md` and
  `readiness/HOMEPAGE_RENEW_V2_PREVIEW.html` - homepage redesign preview path;
  not production implementation by itself.

Current top-level interpretation:

- Production access/admin-data loading is no longer the primary blocker after
  Phase 22 evidence.
- Synthetic production readiness is strong after Phase 23. `MrTester` is the
  reusable synthetic smoke tenant.
- Real customer-data scale is still gated by OpenAI operational monitoring and
  owner approval. External Auth email/custom SMTP proof is now passed by
  owner-provided Resend/Supabase SMTP evidence. Phase 24C.0 DB-level
  backup/export/restore proof passed with local Docker Postgres restore and
  sanitized count checks, including the `MrTester` synthetic target. DB-level
  RLS metadata checks on core tables passed. Phase 24C.1 restored app/RLS smoke
  is not passed: the existing RLS suite against the restored database did not
  pass, and app/dashboard smoke against the restored target was not run. Strict
  Phase 24C full-pass acceptance is not claimed. Owner decision: strict
  restored app/dashboard/RLS smoke is not required for the first limited pilot;
  it is deferred to P1 before paid pilot, production migrations, or
  destructive/bulk data work.
  Owner notification email is not a first-pilot readiness requirement because
  it is intentionally deferred.
- Broader feature work remains allowed only through feature entitlement,
  Settings visibility, guide coverage, smoke evidence, and honest
  customer-facing copy.

## Supporting Active Files

### Product and UX

- `product/BIZPILOT_DASHBOARD_UX_STANDARD_v1.0.md`
- `product/BIZPILOT_DASHBOARD_DESIGN_SYSTEM_v1.0.md`
- `product/BIZPILOT_FEATURE_ENTITLEMENT_AND_GUIDE_STANDARD_v1.0.md`
- `product/PRODUCT_DECISION_OWNER_NOTIFICATION_EMAIL_DEFERRED_FIRST_PILOT_2026-05-30.md`
- `product/BIZPILOT_CONFIGURABILITY_STANDARD_v1.0.md`
- `product/BIZPILOT_DESIGN_SYSTEM_SPEC_v1.0.md`
- `design/DASHBOARD_COLOR_SYSTEM_2026.md`
- `product/BIZPILOT_HOMEPAGE_AND_VISUAL_THEME_STANDARD_v1.0.md`
- `product/BIZPILOT_UI_UX_SYSTEM_STANDARD_v1.1.md`
- `product/BIZPILOT_VALIDATION_DASHBOARD_SPEC_v1.1.md`
- `product/BIZPILOT_DEMO_GENERATOR_AND_SALES_ASSETS_SPEC_v1.0.md`
- `product/BIZPILOT_MAGIC_DEMO_DATA_SPEC_v1.0.md`
- `product/BIZPILOT_FOUNDER_ADMIN_CONSOLE_SPEC_v1.0.md`
- `product/BIZPILOT_FOUNDER_ADMIN_MINI_CONSOLE_SPEC_v1.0.md`
- `product/BIZPILOT_PLAN_ENTITLEMENTS_AND_MANUAL_BILLING_SPEC_v1.0.md`
- `product/BIZPILOT_PRICING_PAGE_SPEC_v1.0.md`
- `product/BIZPILOT_SCORING_SPEC_v1.1.md`
- `product/BIZPILOT_VERTICAL_EXPANSION_PLAYBOOK_v1.0.md`

### Architecture and Portability

- `architecture/BIZPILOT_ARCHITECTURE_v1.4.md`
- `architecture/BIZPILOT_VENDOR_INDEPENDENCE_AND_PORTABILITY_STANDARD_v1.0.md`
- `engineering/BIZPILOT_SERVICE_REPOSITORY_BOUNDARY_AUDIT_v1.0.md`
- `engineering/BIZPILOT_SUPABASE_CLIENT_ARCHITECTURE_v1.0.md`

### Security and Compliance

- `security/BIZPILOT_RLS_AUDIT_REPORT_v1.0.md`
- `security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md`
- `security/BIZPILOT_AUTH_ROUTE_PROTECTION_AUDIT_v1.0.md`
- `security/BIZPILOT_PRIVACY_SECURITY_COMPLIANCE_BASELINE_v1.0.md`
- `security/BIZPILOT_ACCESS_CONTROL_AND_SUSPENSION_STANDARD_v1.0.md`
- `security/BIZPILOT_BUSINESS_LIFECYCLE_AND_DELETION_POLICY_v1.0.md`
- `engineering/BIZPILOT_SAFE_LOGGING_BASELINE_v1.0.md`
- `engineering/BIZPILOT_SAFE_ERROR_HANDLING_STANDARD_v1.0.md`

### GTM, Operations, and Finance

- `gtm/BIZPILOT_GTM_PLAYBOOK_v1.1.md`
- `business/PILOT_OFFER_AND_PRICING_DECISIONS.md`
- `sales/FOUNDER_CRM_AND_OUTREACH_PLAYBOOK.md`
- `sales/FOUNDER_CRM_PROSPECT_TEMPLATE.csv`
- `finance/BIZPILOT_COST_CONTROL_AND_UNIT_ECONOMICS_v1.0.md`
- `operations/BIZPILOT_COST_AND_UPGRADE_GATE_v1.0.md`
- `operations/BIZPILOT_RISK_REGISTER_AND_DECISION_RULES_v1.0.md`
- `ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`
- `operations/BIZPILOT_BACKUP_AND_EXPORT_STRATEGY_v1.0.md`
- `operations/BIZPILOT_BACKUP_EXPORT_RESTORE_DECISION_MATRIX_v1.0.md`
- `operations/BIZPILOT_DELETION_AND_CLEANUP_RUNBOOK_v1.0.md`
- `operations/BIZPILOT_AUTH_EMAIL_SMTP_INTEGRATION_PLAN_v1.0.md`
- `operations/BIZPILOT_CHANGE_EVIDENCE_AND_REMEMBERING_PROTOCOL_v1.0.md`
- `operations/BIZPILOT_CODEX_IMPLEMENTATION_PROMPTS_v1.0.md`
- `operations/BIZPILOT_EXECUTIVE_AUDIT_AND_DECISION_v1.5.md`
- `operations/BIZPILOT_PHASE_18_FOUNDER_LED_PILOT_WORKFLOW_v1.0.md`
- `operations/BIZPILOT_PHASE_18A_STANDARDS_AUDIT_v1.0.md`
- `operations/BIZPILOT_BUG_TRIAGE_AND_RELEASE_QA_STANDARD_v1.0.md`
- `operations/BIZPILOT_CUSTOMER_ONBOARDING_CHECKLIST_v1.0.md`
- `operations/BIZPILOT_DOMAIN_DEPLOYMENT_RUNBOOK_v1.0.md`
- `operations/BIZPILOT_PRODUCTION_DEPLOYMENT_RUNBOOK_v1.0.md`
- `operations/BIZPILOT_FOUNDER_CRM_AND_PILOT_TRACKING_WORKFLOW_v1.0.md`
- `operations/BIZPILOT_SUPPORT_AND_INTERNAL_NOTES_WORKFLOW_v1.0.md`
- `operations/BIZPILOT_POST_DOMAIN_EXECUTION_ROADMAP_v1.0.md`
- `operations/BIZPILOT_PRODUCTION_QA_CHECKLIST_v1.0.md`
- `operations/BIZPILOT_PILOT_ONBOARDING_AND_FOUNDER_CRM_WORKFLOW_v1.0.md`
- `readiness/PHASE_19_SUMMARY.md`
- `readiness/PHASE_19_WORK_LOG.md`
- `readiness/PHASE_19_BUSINESS_LIFECYCLE_DELETION_READINESS.md`
- `readiness/PHASE_19C_FR_CA_QUOTE_FLOW_SMOKE.md`
- `readiness/PHASE_19D_OPENAI_REAL_KEY_DRY_RUN.md`
- `readiness/PHASE_21_NEXT_TAB_HANDOFF.md`
- `readiness/PHASE_21_PILOT_APPROVAL_GATE.md`
- `readiness/PHASE_21A_PRODUCTION_TARGET_AND_BACKUP_GATE.md`
- `readiness/PHASE_21B_PRODUCTION_MIGRATION_DRIFT_MAP.md`
- `readiness/PHASE_21C_OWNER_SQL_VERIFICATION_PACK.md`
- `readiness/PHASE_21D_PRODUCTION_MIGRATION_APPLY_RESULT.md`
- `readiness/PHASE_21E_PRODUCTION_PUBLIC_QUOTE_SECURITY.md`
- `readiness/PHASE_21F_FR_CA_PRODUCTION_QUOTE_SMOKE.md`
- `readiness/PHASE_21G_OPENAI_REAL_KEY_VALIDATION.md`
- `readiness/PHASE_21H_SIGNUP_CONFIRMATION_SMOKE.md`
- `readiness/PHASE_21I_DASHBOARD_I18N_SYSTEMIZATION.md`
- `readiness/PHASE_21J_SMART_INTAKE_ROUTING_LITE.md`
- `readiness/PHASE_21L_DASHBOARD_I18N_ADMIN_RECOVERY.md`
- `readiness/PHASE_21M_CONSOLIDATED_STATUS_AND_SERVICE_CAPABILITIES.md`
- `readiness/PHASE_21N_SYNTHETIC_PRODUCTION_SMOKE_PLAN.md`
- `readiness/PHASE_21O_PUBLIC_TRUST_PAGES_AND_SAFE_GAP_REVIEW.md`
- `readiness/PHASE_21P_NO_COST_READINESS_HARDENING.md`
- `readiness/PHASE_21Q_CURRENT_EXECUTION_STARTER.md`
- `readiness/PHASE_21Q_DASHBOARD_REDESIGN_EVIDENCE.md`
- `readiness/PHASE_21R_PRODUCTION_HORIZONTAL_ACCESS_SMOKE.md`
- `readiness/PHASE_21S_ADMIN_VISUAL_QA_CHECKLIST.md`
- `readiness/PHASE_21T_ADMIN_TRACEABILITY_AND_TRANSIENT_ALERTS.md`
- `readiness/PHASE_21T_FEATURE_ENTITLEMENT_SETTINGS_EVIDENCE.md`
- `readiness/PHASE_21U_DASHBOARD_RUNTIME_FIX_AND_SMOKE.md`
- `readiness/PHASE_21V_SYNTHESIS_STATUS_AND_ACTION_REPORT_2026-05-26.md`
- `readiness/PHASE_21W_ADMIN_DASHBOARD_RECOVERY_AUDIT_2026-05-26.md`
- `readiness/PHASE_21X_UI_POLISH_AND_RUNTIME_QA_2026-05-26.md`
- `readiness/PHASE_21Y_AUTONOMOUS_UI_ADMIN_POLISH_2026-05-26.md`
- `readiness/PHASE_21Z_AUTONOMOUS_STATUS_AND_OWNER_ACTIONS_2026-05-26.md`
- `readiness/PHASE_22_PRODUCTION_ACCESS_AND_RUNTIME_AUDIT_2026-05-27.md`
- `readiness/PHASE_23D_NEXT_TAB_HANDOFF_2026-05-29.md`
- `readiness/PHASE_23_PRODUCTION_FUNCTIONAL_SMOKE_2026-05-29.md`
- `readiness/WHERE_WE_ARE_WITH_NEXT_STEP_2026-05-29.md`
- `readiness/PHASE_24_REAL_DATA_APPROVAL_GATE_2026-05-30.md`
- `readiness/HOMEPAGE_DEMO_INTEGRATION.md`
- `readiness/HOMEPAGE_RENEW_V2_WORK_LOG.md`
- `readiness/DOCS_PROGRESS_AND_GAP_REPORT_2026-05-28.md`

## Preserved Reference Files

These files are preserved for context and history. They are not deleted and should not be ignored, but when there is a conflict, newer active files and v1.6/v1.7 rules win.

- `BIZPILOT_FULL_CANONICAL_PACKAGE_v1.4.md`
- `BIZPILOT_FULL_CANONICAL_PACKAGE_v1.5.md`
- `engineering/BIZPILOT_ENGINEERING_STANDARD_v1.4.md`
- `product/BIZPILOT_UI_UX_SYSTEM_STANDARD_v1.0.md`
- `Persian_marhale/*`

## Conflict Resolution Rules

When two documents disagree:

1. Security/privacy rules win over convenience.
2. v1.6 strategic alignment wins over older broad-platform language unless the 2026-05-26 feature entitlement standard is more specific about owner-approved expansion.
3. v1.5 engineering/security standards win over v1.4 engineering language.
4. Feature entitlement and Settings visibility win over blanket scope-freeze language for future planning.
5. Early live surfaces stay quote-recovery focused until the owner enables broader feature levels.
6. Human-reviewed AI wins over autonomous AI.
7. Database-first security wins over app-only validation.
8. Retention and customer validation win over default-enabled feature expansion.

## Active Feature Policy

The current production surface is centered on:

- cleaning-business quote intake,
- public quote page,
- structured lead capture,
- lead workspace,
- AI-assisted summary/reply/follow-up drafts,
- owner-controlled manual sending/copying,
- founder-led setup,
- retention and validation tracking,
- security hardening for public submission paths.

Broader capabilities may be planned or implemented only when they have:

- feature registry/entitlement state,
- owner-controlled activation,
- Settings state/level visibility,
- visual guide,
- customer-facing text guide,
- owner/admin enablement guide,
- validation, smoke, provider/payment/API, and rollback evidence as relevant.

## Explicit Not-Default-On List

Do not default-enable, sell as live, or imply availability until entitlement and validation gates are passed:

- booking system,
- invoices,
- calendar sync,
- WhatsApp automation,
- SMS automation,
- AI auto-send,
- autonomous AI agent behavior,
- multi-industry packs,
- marketplace,
- campaign builder,
- social media automation,
- mobile app,
- advanced analytics warehouse,
- full CRM replacement.

## Validation Gate Before Expansion

No new vertical or major feature family should be enabled for customers until BizPilot has:

- at least 3 paying or payment-ready cleaning businesses,
- repeated weekly usage,
- healthy retention signal,
- real quote submissions,
- evidence that AI drafts save owner time,
- at least one usable testimonial or strong qualitative proof,
- founder-led onboarding notes from real customers.

Implementation behind owner-controlled feature levels is allowed before that point when the feature is honest in Settings and not active by default.

## Definition of Done

This documentation package is ready for use when:

- AI coding agents start from this file and `AI_CODING_AGENT_START_HERE_v1.7.md`,
- v1.6 alignment is treated as active strategy,
- older broad-platform language is understood as long-term vision,
- no implementation starts without repo inspection,
- security/RLS hardening is prioritized before public/pilot usage,
- Magic Moment and founder-led onboarding are treated as product requirements, not optional polish.
