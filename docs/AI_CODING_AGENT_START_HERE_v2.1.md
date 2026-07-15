<!--
 * ============================================================
 * File: docs/AI_CODING_AGENT_START_HERE_v2.1.md
 * Project: BizPilot AI
 * Description: Current start guide for Codex and other coding agents.
 * Role: Defines reading order, boundaries, execution sequence, verification, and handoff rules.
 * Related:
 * - AGENTS.md
 * - docs/CURRENT_CANONICAL_DOCS_v2.1.md
 * - docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md
 * - prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.1.md
 * Author: MoOoH
 * Created: 2026-07-15
 * Last Updated: 2026-07-15
 * Change Log:
 * - 2026-07-15: Replaced V2.0 with the consolidated V2.1 project-first workflow.
 * ============================================================
 -->

# AI Coding Agent: Start Here V2.1

## Read before editing

1. `AGENTS.md`
2. `docs/project-v2/CURRENT.md`
3. `docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md`
4. `docs/readiness/current-status.json`
5. `docs/dashboard-v4/CURRENT.md` or `docs/website-v4/CURRENT.md`
6. The applicable standard from `docs/CURRENT_CANONICAL_DOCS_v2.1.md`

Do not recover a deleted phase report from Git and use it as the implementation brief.

## Non-negotiable product boundary

BizPilot is a manual-first Smart Intake and reply-preparation workspace. The customer submits structured information; the owner reviews the request and AI/rule-assisted draft; the owner sends manually. Do not imply connected inboxes, autonomous sending, booking, guaranteed availability, invented prices, payments, invoicing, or a full CRM.

## Current protected UX contract

- Five primary destinations: Overview, Leads, Quote Setup, Business Profile, Settings.
- Operating Guide is secondary help.
- One H1 per page; shell chrome does not repeat page titles.
- Overview has one recommended action, compact readiness, priorities, honest metrics, and a short queue.
- Lead Detail keeps source answers, missing information, edit/copy, and manual status/follow-up.
- Quote Setup owns services, areas, intake fields, branding, FAQ/AI context, privacy, and readiness.
- Business Profile owns identity/contact; Settings owns account/language/theme/history/lifecycle.
- Founder/Admin stays guarded, localized, manual, and separate from customer-facing scope.

## Safe execution order

1. Confirm `main`, worktree, instructions, dirty state, and current authority docs.
2. Audit source, tests, migrations, docs, logs, route/language matrices, and current gates.
3. Make the smallest coherent in-scope change; do not add a branch, worktree, or product route unless required.
4. Preserve tenant isolation, manual-first behavior, localization, responsive containment, and accessibility.
5. Update materially edited source headers and current docs.
6. Run lint, typecheck, full unit suite, build, and applicable read-only smokes.
7. Run authenticated/database/write tests only against a classifier-approved local/disposable target.
8. Record exact evidence and blocked gates. `GATED` is not `PASS`.

## Production/data restrictions

- Never use managed Production for synthetic writes.
- Never expose secrets in logs, docs, screenshots, prompts, commits, or command output.
- Remote migration, cleanup, deletion, provider configuration, real-data use, person contact, and payment require explicit scoped authority.
- A successful build/public GET does not prove authenticated tenant isolation or restored-target RLS.

## Handoff

Report the commit, branch, tests, public route counts, CI/Vercel/deployment mapping, database actions, and exact remaining gates. For unavailable external access, use the V2.1 prompt pack instead of inventing completion evidence.
