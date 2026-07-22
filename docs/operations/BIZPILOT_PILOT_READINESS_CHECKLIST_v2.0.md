<!--
 * ============================================================
 * File: docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v2.0.md
 * Project: BizPilot AI
 * Description: Current evidence-based gate for synthetic demos, real customer data, and paid pilots.
 * Role: Prevents code readiness from being mistaken for operational or commercial readiness.
 * Related:
 * - docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md
 * - docs/operations/BIZPILOT_MANUAL_QA_CHECKLIST_v2.0.md
 * - docs/business/PILOT_TERMS_DECISION_GATE.md
 * - prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.1.md
 * Author: MoOoH
 * Created: 2026-07-14
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Recorded the completed Production migration history repair, drift replay, Premium Operations apply, and zero-entitlement verification.
 * - 2026-07-22: Closed the ordered local/restore Premium Operations proof and current backup/schema/rollback preparation while preserving live release, real-data, and paid-pilot gates.
 * - 2026-07-22: Corrected the historical V4.7 local object identity and recorded the ordered `0025` + `0026` non-Production proof gate.
 * - 2026-07-21: Corrected the V4.7 Git identity, reopened unverified remote/Production evidence, and added the Premium Operations `0025` proof gate.
 * - 2026-07-17: Rebased the gate on Dashboard V4.7 and restored the strict restored-app/dashboard/RLS requirement before any real customer data.
 * - 2026-07-15: Closed the V2.1 public read-only release gate at SHA e922485 while preserving authenticated, real-data, and paid-pilot gates.
 * - 2026-07-15: Recorded the V2.1 local candidate gate while keeping release, authenticated, real-data, and paid-pilot evidence separate.
 * - 2026-07-15: Aligned gated execution with the complete V2.1 external-action sequence.
 * - 2026-07-14: Closed the code-release gate with pushed SHA, CI, Vercel, and Production public read-only evidence.
 * - 2026-07-14: Replaced contradictory historical phase tables with one current, evidence-first V2 gate.
 * ============================================================
 -->

# BizPilot AI Pilot Readiness Checklist V2.0

## Current posture — 2026-07-22

| Level | Status | Meaning |
| --- | --- | --- |
| Historical V4.7 source identity | Local Git fact | Commit `d9e25bbf50ccf42de2da4d70aa235ab7d289dc91` is present with tree `17d6b65cc9fb196c8d0d4ccaa46f5fd6f736076d`; the previously documented `a82af72bf8960b2bce1583e6446abca706c2a2bc` object is absent. These local facts do not independently revalidate historical external evidence. |
| Local source/build and public smoke | PASS | Exact-tree frozen install, zero-vulnerability audits, lint, typecheck, `359/359` unit/source, static RLS/grant audit, build, local public `46/46`, responsive `20/20`, UI zero, Quote `2/2`, and image optimizer HTTP 200 are recorded. |
| Publication, CI, Vercel, and Production read-only release | GATED / RE-VERIFY | Publish an exact commit only after destination authorization, then link fresh CI/preview evidence and run owner-approved no-write Production acceptance. Historical results do not close this gate. |
| Premium Operations schema proof | PASS on local/restore | Ordered `0025` + `0026`, RLS `14/14`, tenant/lifecycle/provenance checks, seven concurrency pairs, authenticated Operations/Admin, and EN/fr-CA active intake passed on disposable local Supabase. |
| Authenticated synthetic QA | PASS for release candidate | Restored-target dense owner/founder route smoke passed `17/17`; no Production writes or entitlement activation were used. |
| Real customer data | NOT APPROVED | Requires all real-data gates below and explicit owner approval. |
| Paid pilot | NOT APPROVED | Requires real-data readiness plus commercial, payment, support, backup, and rollback evidence. |

The first pilot remains cleaning-focused, manual-first, and owner-reviewed. BizPilot collects structured requests through a shared link, prepares drafts, and supports manual follow-up. It does not auto-send, book, invoice, collect payment, or operate as a full CRM.

## Gate A — code release

- [x] Current product/dashboard/source-of-truth documents exist.
- [x] Obsolete current-status and dashboard standards are removed from the active documentation set.
- [x] Fresh frozen install, zero-vulnerability audits, lint, typecheck, `359/359` unit/source tests, static RLS/grant audit, and production build pass on the exact local candidate tree.
- [x] Navigation and route contracts add no unapproved route.
- [x] V4.7 includes tenant-scoped Reports; configurable list/tabs/steps quote-form sections; optional Reports/Guide visibility; and one guarded Founder Admin shell entry.
- [x] Google provider handling does not silently create a workspace; live callback evidence remains Gate B work.
- [x] Local Git contains historical V4.7 commit `d9e25bbf50ccf42de2da4d70aa235ab7d289dc91` with tree `17d6b65cc9fb196c8d0d4ccaa46f5fd6f736076d`; the previously documented `a82af72bf8960b2bce1583e6446abca706c2a2bc` object is absent. This is local-object evidence only.
- [ ] Exact candidate commit is published to a freshly verified remote ref and its CI/deployment results are linked to that commit.
- [ ] Exact-release Production read-only smoke is re-run after target confirmation; no Production mutation occurs.
- [x] Premium Operations migrations `0025` then `0026` pass approved local/disposable migration, RLS, tenant-isolation, lifecycle, seven-pair concurrency, authenticated UI, and active EN/fr-CA quote proof before the Production migration plan.

## Gate B — authenticated synthetic acceptance

- [ ] The target classifier proves the URL, database, and Supabase project are approved local/Preview synthetic resources.
- [ ] English and fr-CA owner journeys pass the [manual QA checklist](BIZPILOT_MANUAL_QA_CHECKLIST_v2.0.md).
- [ ] Sign-up, sign-in, sign-out, password reset, and Google OAuth decision/configuration have current evidence.
- [ ] Quote Setup save/refresh, configurable list/tabs/steps form rendering, public intake, lead creation, Reports attribution, lead review, draft edit/copy, and manual follow-up work end to end.
- [ ] Cross-tenant negative checks pass for two synthetic owners.
- [ ] Founder access succeeds only for the allowlisted founder; a normal owner is denied.
- [x] Owner-provided screenshot visibly shows the role-gated Founder Admin entry, proving allowlist activation is rendered; protected/Admin route success and normal-owner denial remain unchecked above.
- [ ] Evidence contains no secrets and all temporary synthetic records have an approved cleanup decision.

## Gate C — backup, schema, and rollback

- [x] Production schema and migration history are reconciled read-only: schema matches `origin/main` through `0024` except the absent `0023` retention helper; Premium Operations is absent.
- [x] A current roles/schema/public-data logical export exists temporarily outside git for this release drill; contents and secrets were not printed.
- [x] Restore to disposable local Supabase succeeds using the documented procedure.
- [x] The complete RLS suite plus authenticated app, dashboard, intake, tenant-isolation, and founder-denial smoke pass against that restored target.
- [x] Rollback source is the verified pre-migration export; operator is MoOoH/Codex, execution is immediate on failed migration or smoke, and sanitized evidence is recorded in the backup runbook.
- [x] The owner explicitly authorized this release's Production migration plan, dry run, backup, rollback, merge, and deployment; verified history repair, idempotent `0020`/`0021`/`0023`/`0024` drift replay, and ordered `0025`/`0026` apply completed successfully.
- [ ] `BIZPILOT_IP_HASH_SALT` is configured as a Production secret before public-submission abuse logging is enabled; its value is never exposed in evidence.

## Gate D — real customer data

- [ ] Privacy notice, consent language, retention, deletion, export, access, incident, and subprocessors posture are reviewed for the target market.
- [ ] Support owner and response expectations are named.
- [ ] Monitoring covers auth, quote intake, provider fallback, application errors, and cost without exposing customer content unnecessarily.
- [ ] AI behavior has current fallback, quota, budget, and no-autonomy evidence.
- [ ] Final no-secret production auth/quote/dashboard smoke passes using only an approved synthetic account.
- [ ] Production QA used for this gate is read-only; all write-capable workflow proof comes from the approved disposable target.
- [ ] Owner explicitly approves real customer data after reviewing the evidence packet.

## Gate E — paid pilot

- [ ] Setup fee, recurring price, taxes, included limits, trial, billing start, cancellation, refund, and non-payment handling are decided.
- [ ] Payment collection and receipts are operational; the website wording matches the approved offer.
- [ ] Pilot agreement, onboarding owner, support channel, escalation, offboarding, export, and deletion are ready.
- [ ] At least one real prospect has consented to the defined pilot; no fabricated demand, revenue, or conversion evidence is used.
- [ ] Success metrics are observable: qualified requests, completeness, owner review time, manual replies, follow-up completion, and qualitative feedback.
- [ ] Owner explicitly approves paid-pilot start.

## Responsibilities and order

1. Codex can finish source, docs, static checks, safe public read-only QA, and evidence packaging.
2. The owner supplies or approves authenticated targets, credentials/session handling, external provider decisions, production configuration, migrations, real data, and commercial terms.
3. Codex then executes the approved prompt from the external-action pack and records evidence.
4. Only after every prerequisite gate passes may the next gate be marked `PASS`.

Historical phase reports are evidence only. They cannot override this checklist or convert an unchecked row into approval.
