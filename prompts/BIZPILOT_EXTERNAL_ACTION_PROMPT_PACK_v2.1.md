<!--
 * ============================================================
 * File: prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.1.md
 * Project: BizPilot AI
 * Description: Dependency-ordered prompts for work requiring owner credentials, external consoles, or production authority.
 * Role: Lets Codex finish all authorized external gates without embedding secrets or widening scope.
 * Related:
 * - docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md
 * - docs/project-v2/BILINGUAL_ROUTE_AND_FLOW_AUDIT_2026-07-15.md
 * - docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v2.0.md
 * Author: MoOoH
 * Created: 2026-07-15
 * Last Updated: 2026-07-15
 * Change Log:
 * - 2026-07-15: Replaced V2.0 with complete Auth, OAuth, Supabase, Production, SEO, analytics, real-data, and paid-pilot prompts.
 * ============================================================
 -->

# BizPilot External Action Prompt Pack V2.1

Use one prompt at a time and in dependency order. Never paste credentials, tokens, cookies, keys, personal data, or customer messages into chat, source, screenshots, logs, or commits. Authenticate directly in official tooling. Each prompt authorizes only its named scope.

## 01 — Disposable authenticated target and complete browser QA

```text
Work in the existing BizPilot AI main worktree. Read AGENTS.md, docs/project-v2/CURRENT.md, the master phase plan, bilingual route/flow audit, manual QA checklist, and scripts/check-local-targets.mts.

Goal: complete Auth, active Intake, Owner Dashboard V4, and Founder/Admin browser QA against an explicitly approved local/disposable synthetic target.

Rules:
- Run the target classifier first. Stop unless App URL, Supabase URL, and database are proven local/disposable and non-Production.
- Never print, persist, screenshot, or commit credentials/session tokens.
- Use synthetic test identities and data only in the approved disposable target.
- Cover EN and fr-CA, light/dark, keyboard, 390x844, 768x1024, 1366x768, and 1440x900.
- Test sign-up, confirmation/callback as available, sign-in, sign-out, reset, redirects, errors, and language persistence.
- Test active quote submission and success in both languages, consent/validation, one created lead, and no booking/price/availability promise.
- Test Overview, Leads, filters/sort/pagination, Lead Detail source/missing info/edit/copy/manual status, Quote Setup six sections/save/refresh, Business Profile, Settings, and Guide.
- Use two synthetic owners for cross-tenant negative checks.
- Use a separately allowlisted synthetic founder for /founder and /admin; confirm a normal owner is denied.
- Record exact commands, pass/fail counts, sanitized screenshots, defects fixed, and cleanup decision.
- Re-run lint, typecheck, unit, build, and applicable smoke after fixes.
- Do not deploy, mutate Production, commit, or push unless separately instructed.
```

## 02 — Google OAuth decision and verification

```text
Audit BizPilot Google login without exposing secrets. The owner chooses exactly one state: KEEP OFF or CONFIGURE.

KEEP OFF: verify every Auth surface communicates unavailability honestly and no CTA implies Google login is live. Make only required copy/UI/test changes.

CONFIGURE: have the authenticated operator use official Google Cloud and Supabase consoles. Verify exact local/Preview/Production origins and callback URLs, login-only identity scopes, existing-account behavior, cancel/error states, and EN/fr-CA UI. Do not request Gmail scopes and do not bootstrap a workspace from Google login.

Return a redacted evidence table and disable/rollback instructions. Do not claim live approval before owner browser QA passes. Do not paste client secrets or change unrelated provider settings.
```

## 03 — Auth email, redirect, and SMTP readiness

```text
Perform a no-secret BizPilot Auth email readiness audit through official Supabase/Vercel tooling. Inspect environment-key presence without values, site URL, allowed redirects, confirmation/reset templates, sender identity, SMTP/provider status, bounce/failure visibility, rate limits, and EN/fr-CA user-facing recovery behavior. Send only to an explicitly approved synthetic test mailbox. Do not expose reset links/tokens in evidence. Produce PASS/FAIL/UNKNOWN, exact owner actions, and rollback. Do not change provider or production values without a separately approved exact plan.
```

## 04 — Managed Supabase read-only reconciliation

```text
Perform a read-only-first BizPilot managed Supabase reconciliation. Read current migration, RLS, grant, backup, restore, privacy, and production-data standards first.

Authenticate through official tooling without printing secrets. Confirm the exact project/environment and stop on ambiguity. Inspect migration history 0001-0024, schema, grants, RLS, functions/search_path, Auth settings, backup/export posture, and drift. Do not run SQL writes, migrations, cleanup, policy changes, user deletion, or test-data insertion.

Produce a redacted drift map with PASS/FAIL/UNKNOWN/OWNER ACTION and a bounded backup-aware apply/rollback plan for separate approval.
```

## 05 — Separately approved Supabase apply, restore, and RLS proof

```text
Execute only the exact owner-approved BizPilot reconciliation plan from the read-only report. Reconfirm project identity, current backup, statements, maintenance impact, verification, and rollback before any write. Apply one bounded step at a time and stop on unexpected output. Never insert synthetic customer data into managed Production.

Restore a current backup/export to a disposable target. Run the complete RLS suite plus authenticated Owner/Admin/Intake smoke against that restored target. Publish redacted evidence for migration alignment, tenant isolation, public-slug access, founder denial, restore success, app compatibility, and rollback. Do not expand scope.
```

## 06 — Final GitHub, Vercel, domain, and authenticated read-only acceptance

```text
Verify the final pushed BizPilot main commit using read-only checks. Confirm local main equals origin/main, GitHub CI succeeds, the Vercel Production deployment maps to the exact commit, bizpilo.com HTTPS/security headers are healthy, and environment keys are complete without showing values.

Run all public EN/fr-CA route, responsive, UI-matrix, 404, Auth GET, and inactive Quote GET smokes. With owner-approved no-secret session handling, perform authenticated read-only Owner/Admin visual acceptance without creating/editing customer records. Do not submit Production quotes, change environment values, run migrations, or create test users/leads. Report exact SHA, CI run, deployment ID, pass/fail totals, blocked checks, and database actions (normally none).
```

## 07 — Search Console and Core Web Vitals

```text
Using owner-authenticated Google Search Console and public PageSpeed/CrUX data, verify the canonical bizpilo.com property, submit/inspect sitemap.xml, inspect the ten canonical URLs and fr-CA alternates, confirm private/intake URLs are not indexed, and record field Core Web Vitals where available. Run a current Lighthouse lab baseline on the exact Production commit. Do not claim indexing, rankings, or field performance when data is absent. Do not change DNS, site ownership, or deploy code unless separately approved. Return exact findings and prioritized code-only performance fixes.
```

## 08 — No-PII analytics decision

```text
Prepare a BizPilot analytics decision packet; do not enable tracking by default. Compare keeping the existing no-op with a minimal first-party sink. Require payload allowlisting, rejection of all customer/personal/free-text/prompt/AI-output/lead-ID data, retention, privacy disclosure, consent/cookie impact, access control, cost, disable switch, and rollback. If the owner chooses KEEP OFF, verify no tracker is loaded. If the owner later approves a named sink and exact schema, implement only that approved plan and test rejection/disable behavior before deployment.
```

## 09 — Real customer data approval gate

```text
Prepare but do not activate the BizPilot real-customer-data gate. Require restored-target Owner/Admin/Intake/RLS proof, backup/restore, consent/privacy, retention/deletion/export/access, subprocessors, incident response, support access, no-secret observability, AI fallback/cost controls, and final synthetic Production read-only acceptance. Produce a yes/no checklist with evidence links and unresolved risks. Do not import, enter, contact, or process real customer data. Activation requires a new explicit owner approval after review.
```

## 10 — Paid pilot readiness gate

```text
Prepare but do not charge or activate the BizPilot paid-pilot gate. First confirm the real-data gate is explicitly approved. Validate the exact offer, setup/recurring prices, taxes, included limits, manual billing/payment method, receipt, refund/cancellation/non-payment handling, pilot agreement, support hours/escalation, onboarding, outage communication, offboarding/export/deletion, backup/rollback, success metrics, and exit plan. Use only real prospect consent evidence; never fabricate demand, reviews, revenue, or conversion. Produce the final owner decision packet. Do not contact a person, collect payment, enable checkout, or activate a pilot without a new explicit instruction.
```

## Stop conditions

Stop and request direction when project identity is ambiguous, a backup is absent, a safe synthetic target cannot be proven, a secret or personal record may be exposed, a step would mutate Production beyond an approved plan, a person would be contacted, payment would be taken, or scope would expand into direct inboxes, auto-send, booking, payments, invoicing, or full CRM behavior.
