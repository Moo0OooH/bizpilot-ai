<!--
 * ============================================================
 * File: prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.0.md
 * Project: BizPilot AI
 * Description: Copy-ready prompts for tasks that require owner credentials, external consoles, or production-change authority.
 * Role: Lets Codex continue safely without embedding secrets or pretending gated work is complete.
 * Related:
 * - docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md
 * - docs/dashboard-v4/PHASE_PROGRESS.md
 * - docs/operations/BIZPILOT_PRODUCTION_DEPLOYMENT_RUNBOOK_v1.0.md
 * Author: MoOoH
 * Created: 2026-07-14
 * Last Updated: 2026-07-14
 * Change Log:
 * - 2026-07-14: Created the V2 external-access prompt sequence for authenticated QA, OAuth, Supabase, Production acceptance, real data, and paid-pilot gates.
 * ============================================================
 -->

# BizPilot External Action Prompt Pack V2.0

Use one prompt at a time and in order. Never paste credentials into chat, source, logs, screenshots, or commits. Let the operator authenticate directly in the official tool/console. A prompt authorizes only the scope it names.

## 01 — Safe authenticated Dashboard QA target

Prerequisite: a disposable local or synthetic target that is not the managed Production Supabase project.

```text
You are working in the BizPilot AI repository on main. Read AGENTS.md, docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md, docs/dashboard-v4/CURRENT.md, and scripts/check-local-targets.mts first.

Goal: complete authenticated Dashboard V4 browser QA against an explicitly safe local/disposable synthetic target.

Rules:
- Do not print, copy, persist, or commit any secret.
- Run the target classifier first and stop if the target is managed Production or cannot be proven safe.
- Do not create synthetic data outside the approved disposable target.
- Test owner and founder authorization boundaries, but do not weaken them.
- Cover EN and fr-CA, light/dark, 390x844, 768x1024, 1366x768, and 1440x900.
- Check horizontal overflow, keyboard focus, menus, five-item mobile navigation, language persistence, Quote Setup six tabs, Lead queue filters/pagination, Lead Detail edit/copy/manual workflow, Settings disclosures, and founder redirect/admin tabs.
- Record exact commands, target classification (without identifiers/secrets), pass/fail counts, screenshots/artifacts, and every defect fixed.
- Run lint, typecheck, unit, and build again after fixes.
- Do not deploy, mutate Production, commit, or push unless separately instructed.
```

## 02 — Google OAuth keep-off or configure-and-verify decision

Owner first chooses one option: keep unavailable, or authorize official provider setup.

```text
Audit BizPilot Google login without exposing secrets. Read the current source of truth and Google auth source tests.

If the owner chose KEEP OFF: verify the UI communicates unavailability honestly and does not present Google login as live. Make only copy/UI fixes needed for that state.

If the owner chose CONFIGURE: guide the authenticated operator through the official Google Cloud and Supabase provider consoles. Verify exact authorized origins and callback URLs for local Preview and Production, login-only scopes, existing-account behavior, error/cancel flows, and EN/fr-CA copy. Do not request Gmail scopes, do not bootstrap a workspace from Google, and do not paste client secrets into chat or logs.

Finish with a redacted evidence table, tests run, exact remaining gates, and rollback/disable instructions. Do not claim live approval until owner browser QA passes.
```

## 03 — Managed Supabase read-only reconciliation

```text
Perform a read-only-first BizPilot managed Supabase reconciliation. Read all current RLS, migration, backup, restore, and production-data standards before connecting.

Rules:
- Authenticate through the official CLI/console without printing or storing secrets.
- Confirm project identity and environment; stop on ambiguity.
- Start with read-only migration history, schema, grants, RLS, function/search_path, auth redirect, and backup status inspection.
- Compare migrations 0001–0024 with the managed history and produce an exact drift map.
- Do not run migrations, SQL writes, cleanup, user deletion, policy changes, or test-data insertion.
- Produce a backup-aware, reversible change plan with preconditions, SQL/CLI commands, expected output, verification, and rollback for owner approval.
- Clearly separate PASS, FAIL, UNKNOWN, and OWNER ACTION.
```

## 04 — Separately approved Supabase apply

Use only after Prompt 03 and explicit owner approval of the exact plan.

```text
Execute only the owner-approved BizPilot Supabase reconciliation plan from the read-only drift report. Reconfirm project identity, backup status, maintenance impact, exact statements, and rollback before any write. Apply one bounded step at a time, verify after every step, stop on unexpected output, and never insert synthetic customer data. Run approved read-only RLS/application checks afterward and publish a redacted evidence report. Do not expand scope.
```

## 05 — Vercel Production and authenticated read-only acceptance

```text
Verify the pushed BizPilot main commit through GitHub CI and Vercel Production using read-only checks. Confirm the exact commit/deployment mapping, domain/HTTPS, environment completeness without values, Auth redirect URLs, public EN/fr-CA routes, metadata, responsive matrix, and an owner-authenticated Dashboard V4 visual smoke. Do not create or edit customer records, submit synthetic Production quotes, run migrations, or change environment values. Report deployment ID, commit, route results, visual defects, console/network errors, and any blocked authenticated step. A blocked credential step remains UNKNOWN, not PASS.
```

## 06 — Real customer data approval gate

```text
Prepare, but do not activate, the BizPilot real-customer-data gate. Require evidence for restored-target application/dashboard/RLS isolation, backup/restore, retention/deletion, consent/privacy, support access, incident response, no-secret observability, and owner-approved production smoke. Produce a yes/no checklist with evidence links and unresolved risks. Do not import, enter, or process real customer data. Activation requires a new explicit owner approval after review.
```

## 07 — Paid pilot readiness gate

```text
Prepare, but do not charge or activate, the BizPilot paid-pilot gate. Confirm the real-data gate is already approved. Validate the founder-led offer, manual billing/payment method, terms, refund/cancellation handling, support hours and escalation, onboarding, data deletion, outage communication, backup/rollback, success metrics, and pilot exit plan. Produce the final owner decision packet. Do not collect payment, contact customers, enable self-serve billing, or activate a pilot without a new explicit owner instruction.
```

## Stop conditions

Stop and ask the owner when project identity is ambiguous, a backup is missing, a command would mutate Production beyond the approved plan, credentials would be exposed, a real person/customer would be contacted, a payment would be taken, or the requested action would widen scope beyond the chosen prompt.
