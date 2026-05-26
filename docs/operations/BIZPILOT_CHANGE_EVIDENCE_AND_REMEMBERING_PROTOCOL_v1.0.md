# BizPilot Change Evidence and Memory Protocol v1.0

## Purpose

This protocol is mandatory for every future change request, no matter how small.
Its goal is to prevent knowledge loss and ensure every meaningful action is captured in
an auditable document before moving to the next step.

For every requested or completed work item, the team must:

1. Record exactly what changed.
2. Record exact command evidence.
3. Record environment and safety constraints.
4. Record the next required owner approval.
5. Record what remains blocked and why.

## Required record structure (must be filled for each change set)

### 1) Identity
- Scope name:
- Branch:
- Commit range or SHAs:
- Current branch HEAD:
- Remote baseline:
- Source -> Target branch (if PR candidate):

### 2) Safety guardrails in this phase
- No merge (if not explicitly approved).
- No deploy (unless explicitly approved).
- No production SQL (unless explicitly approved).
- No `0010`? no `0018` blind re-apply.
- No `0020` unless explicitly approved.
- No real customer data.
- No cleanup execution.
- RLS must not be weakened.
- `leads.source` must not be introduced.

### 3) What exactly changed
- File list (path + change type).
- Commit list with messages and hashes.
- Why changed (decision rationale in one line).

### 4) Evidence collected (required)
- Validation commands run:
  - `git status --short --branch`
  - `git log -1 --oneline`
  - `pnpm verify` (PASS/FAIL + details)
  - smoke commands (commands + results)
  - unit/integration test suites
  - RLS checks if safe DB env is available
- If smoke/DB checks are not run:
  - environment blocker reason must be explicit
  - reason must be file-level or shell environment-based, not speculative.

### 5) Risk notes
- Regression risk:
- Data safety risk:
- Operational risk:
- Owner dependency risk:

### 6) Merge-readiness status
- Candidate status: `Not ready / Readiness evidence complete / Pending blockers`.
- Remaining blockers before real-customer data:
  - list each blocker with one-line ownership and what approval is needed.

### 7) Explicit next approval
- What owner approval is required next, written as one action:
  - example: “Approve running synthetic production quote security smoke”.

## Mandatory minimum fields for every merge candidate package
- PR title
- Source branch
- Target branch
- Included commits
- Validation summary
- Changed files
- Final git status
- Exact remaining blockers before real-data/go-live
- Exact next approval needed

## Canonical files to attach to every handoff
- `docs/readiness/PHASE_21V_SYNTHESIS_STATUS_AND_ACTION_REPORT_2026-05-26.md`
- This protocol itself
- Any smoke or verification evidence docs used in the current change set

## Repeatability rule

Before starting the next change phase:

1. Open the last change evidence doc and continue there.
2. Append a new dated section for the new change set.
3. Never archive required evidence in a chat message only.
4. Never mark a step complete without command-backed evidence.

## Current project status note

As of the latest completed merge-readiness closure, the current evidence updates are:

- `57a5256 docs(readiness): add phase 21v synthesis status report`
- `81daca1 docs(readiness): record merge-readiness evidence closure`

with verified baseline:

- `pnpm verify` PASS
- production public smoke PASS `9/9` against `https://bizpilo.com`
- unit tests PASS `63/63`
- RLS tests blocked by missing local `DATABASE_URL` (environmental blocker)

Do not treat this as production-readiness complete for real customer data.
The remaining blockers are still active (quote security smoke, fr-CA smoke, horizontal access smoke,
live founder-admin visual QA, SMTP/provider checks, OpenAI quota block, backup/export drill, and `0020` owner approval).

## Enforcement

If this protocol is skipped once, the next step is blocked until:

1. missing evidence is written in canonical format, and
2. next owner approval is explicitly captured.

