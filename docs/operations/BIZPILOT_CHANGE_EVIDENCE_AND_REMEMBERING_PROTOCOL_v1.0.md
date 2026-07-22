# BizPilot Change Evidence and Memory Protocol v1.0

Updated: 2026-07-22 — corrected the historical local Git identity and recorded the ordered Premium Operations `0025` + `0026` proof gate.

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
- Working branch (if any; discover at runtime):
- Commit range or SHAs:
- Current branch HEAD:
- Remote baseline discovered immediately before the change:
- Source -> Target branch (if PR candidate):

### 2) Safety guardrails in this phase
- No merge (if not explicitly approved).
- No deploy (unless explicitly approved).
- No production SQL (unless explicitly approved).
- No blind re-apply of any migration, including `0010`, `0018`, or `0020`.
- Repository source includes ordered Premium Operations migrations `0025_premium_operations_addons.sql` then additive `0026_premium_operations_schedule_integrity.sql`. They are a gated candidate: run both, in order, only on an approved local/disposable target first; prove RLS, tenant isolation, lifecycle, and concurrency; and never treat source presence as Production authorization.
- No real customer data.
- No cleanup execution.
- RLS must not be weakened.
- `leads.source` must not be introduced.
- Dashboard mutating smoke (`smoke:dashboard`) is local-only and must not run against:
  - `bizpilo.com`
  - canonical production Supabase `qfqendrqimqvkoojpjao`
  - any managed/non-local Supabase host
- Production readiness smoke is read-only and must not use or submit synthetic payloads.
- Production readiness smoke must not create dashboard test artifacts (businesses, links, users, forms, leads, auth artifacts).
- Production QA is read-only: no signup, quote submission, setup save, lead/status edit, user creation, provider-driven workspace setup, or database mutation.
- Google authentication must never create a workspace silently; runtime callback/setup proof stays gated to an approved synthetic target.
- Synthetic login/setup and all write-capable smoke paths belong only on an explicitly approved disposable target, with a documented cleanup decision.
- Phase 24C.0 is historical DB-level partial evidence only. Real customer data remains blocked until a current disposable restore passes app/dashboard/intake/RLS, tenant-isolation, and founder-denial proof.

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
  - example: “Approve running the strict restored-target acceptance on the named disposable database”.

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

### 8) Command safety exception
- `smoke:dashboard` and synthetic dashboard-auth smoke helpers must fail fast when any production or managed/non-local signal is detected:
  - `VERCEL_ENV=production`
  - `NEXT_PUBLIC_APP_URL` contains `bizpilo.com`
  - `NEXT_PUBLIC_SUPABASE_URL` contains `qfqendrqimqvkoojpjao`
  - `NEXT_PUBLIC_SUPABASE_URL` is not local (`localhost`, `127.0.0.1`, `::1`, `host.docker.internal`, or `*.localhost`)
  - smoke base URL host is `bizpilo.com`
- Dashboard mutating smoke remains prohibited in production and managed/non-local Supabase regardless of guard behavior.

## Canonical files to attach to every handoff
- `docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md`
- `docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md`
- This protocol itself
- Any smoke or verification evidence docs used in the current change set

## Repeatability rule

Before starting the next change phase:

1. Open the last change evidence doc and continue there.
2. Append a new dated section for the new change set.
3. Never archive required evidence in a chat message only.
4. Never mark a step complete without command-backed evidence.

## Current project status note — 2026-07-22

Current functional source identity:

- historical local commit `d9e25bbf50ccf42de2da4d70aa235ab7d289dc91`;
- tree `17d6b65cc9fb196c8d0d4ccaa46f5fd6f736076d`;
- the previously documented `a82af72bf8960b2bce1583e6446abca706c2a2bc` object is absent from the current checkout;
- remote ref, CI, deployment, and Production smoke are `GATED` pending a fresh evidence revalidation; historical external IDs are not a substitute;
- ordered migrations `0025_premium_operations_addons.sql` then `0026_premium_operations_schedule_integrity.sql` require approved local/disposable execution plus RLS, tenant-isolation, lifecycle, and concurrency proof before a separately approved Production plan;
- owner screenshot evidence is historical only; full protected/Admin route acceptance remains GATED.

Dashboard V4.7 includes Reports, owner-configurable quote sections with list/tabs/steps presentation, optional Reports/Guide navigation visibility, and one guarded Admin shell entry. Google provider handling does not silently create a workspace; authenticated callback proof remains gated.

No remote publication or Production-release gate is closed from this local record. Do not treat historical evidence as authenticated-acceptance, restore, or real-data readiness. Phase 24C.0 remains historical partial DB-level evidence; the documented restore procedure still needs a strict passing exercise across restored app/dashboard/intake/RLS, tenant isolation, and founder denial before real customer data.

## Enforcement

If this protocol is skipped once, the next step is blocked until:

1. missing evidence is written in canonical format, and
2. next owner approval is explicitly captured.
