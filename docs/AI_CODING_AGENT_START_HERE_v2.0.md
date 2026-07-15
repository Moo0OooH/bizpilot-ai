<!--
 * ============================================================
 * File: docs/AI_CODING_AGENT_START_HERE_v2.0.md
 * Project: BizPilot AI
 * Description: Current start guide for Codex and other coding agents.
 * Role: Defines reading order, product boundaries, safe execution order, verification, and handoff rules.
 * Related:
 * - AGENTS.md
 * - docs/CURRENT_CANONICAL_DOCS_v2.0.md
 * - docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md
 * - prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.0.md
 * Author: MoOoH
 * Created: 2026-07-14
 * Last Updated: 2026-07-14
 * Change Log:
 * - 2026-07-14: Replaced the V1.7 phase map with a V2 task-first and evidence-first workflow.
 * ============================================================
 -->

# AI Coding Agent: Start Here V2.0

## Read before editing

1. `AGENTS.md`
2. `docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md`
3. `docs/readiness/current-status.json`
4. The current surface document for the task: `docs/dashboard-v4/CURRENT.md` or `docs/website-v4/CURRENT.md`
5. The applicable engineering/security standard from `docs/CURRENT_CANONICAL_DOCS_v2.0.md`

Do not use an older phase report as the implementation brief.

## Non-negotiable product boundary

BizPilot is a manual-first Smart Intake and reply-preparation workspace. The customer submits structured information; the business owner reviews the request and any AI-assisted draft; the owner sends manually. Do not imply direct inbox integrations, automatic sending, confirmed booking, guaranteed availability, invented pricing, payments, invoicing, or a full CRM.

## Current protected UX contract

- Five primary owner destinations: Overview, Leads, Quote Setup, Business Profile, Settings.
- Operating Guide is secondary help, not a sixth primary workflow.
- Every page owns one H1; shell chrome must not repeat route titles.
- Overview presents one recommended next action, compact readiness, three daily priorities, metrics, and a short queue.
- Leads shows contextual guidance only when a focus filter is requested.
- Lead Detail must keep manual review explicit and must not contain no-op editing or non-persisted owner-note controls.
- Quote Setup owns services, areas, intake fields, branding, FAQ/AI context, privacy, and readiness.
- Business Profile owns identity and contact details.
- Settings owns account, language, theme, session visibility, audit/history, and lifecycle controls.
- Founder operations remain guarded, localized, manual, and separate from the customer dashboard.

## Safe execution order

1. Confirm branch/worktree and read local instructions.
2. Inspect source, tests, docs, and current gate status.
3. Make the smallest coherent change; do not add a route or branch unless explicitly required.
4. Preserve tenant isolation, manual-first behavior, localization, responsive containment, and accessibility.
5. Update materially changed file headers and current docs.
6. Run `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, and `pnpm build` (direct local binaries are acceptable when the package-manager shim is unavailable).
7. Run database/RLS or authenticated dashboard smoke only against a confirmed safe local/synthetic target.
8. Record exact results and remaining external gates; do not turn a blocked environment check into a product pass.

## Production and data restrictions

- Never run synthetic writes against managed Supabase or Production.
- Never expose secrets in logs, docs, prompts, screenshots, or commits.
- Remote migration, cleanup, user deletion, real-data smoke, Google provider setup, and paid-pilot activation require their explicit gates.
- A successful build is not authenticated production dashboard proof.

## Handoff standard

Report the commit, branch, tests, exact blocked checks, production/database actions taken (normally none), and the next owner-controlled action. If access is unavailable, use the prompt pack rather than inventing completion evidence.
