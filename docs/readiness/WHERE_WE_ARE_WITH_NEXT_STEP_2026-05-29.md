# Where We Are With Next Step

**Project:** BizPilot AI
**Date:** 2026-05-29
**Status:** Synthetic production readiness is strong, but real-customer pilot readiness is not fully open yet.
**Current branch:** `main...origin/main`
**Design status:** Frozen. Do not continue homepage, dashboard, admin redesign, preview docs, or visual polish until owner explicitly reopens design work.

## Executive Summary

BizPilot AI has moved from broad documentation and access recovery work into
real production runtime proof using controlled synthetic data.

The current production app at `bizpilo.com` has passed:

- public route smoke,
- auth redirect smoke,
- authenticated owner dashboard smoke,
- controlled synthetic quote intake on `MrTester`,
- targeted OpenAI provider proof on the synthetic `MrTester` lead,
- safe password-reset request handling for the synthetic owner account.

The strongest current evidence is Phase 23:

- Phase 23B passed: production functional/auth smoke.
- Phase 23C passed: controlled synthetic tenant mutation and quote intake.
- Phase 23D passed: synthetic owner dashboard runtime proof.
- Phase 23E passed: OpenAI provider success on the synthetic lead after parser
  and token-budget fixes.
- Phase 23F partially passed: password reset request path is safe, but real
  email delivery and custom SMTP posture are not fully proven.

The project is **not yet approved for real customer data** because the remaining
operational gates are still open:

1. Custom SMTP/email delivery proof.
2. Password reset email arrival and reset-link open proof.
3. Owner notification email implementation/proof, if this is required for pilot.
4. Backup/export/restore posture and restore drill.
5. Ongoing OpenAI cost/quota/fallback monitoring.

## Current Git And Documentation State

At the time this document was created:

```text
main...origin/main
M docs/readiness/PHASE_23_PRODUCTION_FUNCTIONAL_SMOKE_2026-05-29.md
```

The Phase 23 core readiness docs were previously committed and pushed:

```text
319e4a4 docs: record phase 23 production functional smoke
```

After that commit, Phase 23F evidence was appended to:

```text
docs/readiness/PHASE_23_PRODUCTION_FUNCTIONAL_SMOKE_2026-05-29.md
```

That Phase 23F doc update is currently uncommitted unless committed later by
owner approval.

This new summary document is intended to become the current operator handoff:

```text
docs/readiness/WHERE_WE_ARE_WITH_NEXT_STEP_2026-05-29.md
```

## Production Target

| Item | Current value |
| --- | --- |
| Production domain | `https://bizpilo.com` |
| Latest known production app state | Healthy |
| Latest public smoke | Passed 9/9 after Phase 23F reset request |
| Design | Frozen |
| Real customer data | Not approved yet |
| Approved synthetic smoke tenant | `MrTester` |

## Approved Synthetic Tenant State

`MrTester` is the reusable production smoke tenant.

| Field | Value |
| --- | --- |
| Business name | `MrTester` |
| Business id | `131561a7-9b5b-4ff9-a7fe-403d5c46462b` |
| `workspace_kind` | `founder_test` |
| `status` | `active` |
| `lifecycle_status` | `active` |
| `plan_slug` | `founder_pilot` |
| Quote link | `/quote/mrtester`, active |
| Lead count | `1` |
| Approved lead | `BizPilot QA Test Lead` |
| Lead id | `3f46045b-47d1-4d92-b99d-0bdfe6eab10e` |
| Lead source | `phase23c_qa` |
| Current lead status | `reviewed` |
| `response_status` | `viewed` |
| `response_sla_state` | `viewed` |

The lead status changed from `new` to `reviewed` during normal owner dashboard
lead-detail viewing. The owner accepted this as expected owner-view behavior,
not a blocker.

Do not touch:

- real customers,
- real customer emails,
- `BizPilot Synthetic Cleaning QA MailTM`,
- any tenant other than the approved `MrTester` synthetic target,
- homepage/design/docs stashes.

## What Has Been Done

### Production Access And Runtime Foundation

Earlier readiness work established:

- production project access was restored,
- founder/admin runtime paths were inspected,
- public route smoke tooling exists,
- auth route and redirect behavior were hardened,
- documentation indexes and readiness references were repaired,
- design work was frozen to keep readiness work separate from visual polish.

Important supporting references:

- `docs/readiness/PHASE_22_PRODUCTION_ACCESS_AND_RUNTIME_AUDIT_2026-05-27.md`
- `docs/readiness/DOCS_PROGRESS_AND_GAP_REPORT_2026-05-28.md`
- `docs/operations/BIZPILOT_AUTH_EMAIL_SMTP_INTEGRATION_PLAN_v1.0.md`
- `docs/operations/BIZPILOT_BACKUP_EXPORT_RESTORE_DECISION_MATRIX_v1.0.md`

### Phase 23B - Production Functional Smoke

Passed.

Confirmed:

- production deployment for `cfed5f4` was healthy,
- public smoke passed 9/9,
- logged-out protected routes redirected correctly,
- sign-in preserved the intended redirect,
- authenticated read-only `/dashboard` passed,
- authenticated read-only `/dashboard/leads` passed,
- authenticated read-only `/admin?adminPanel=users` passed,
- no destructive or mutating admin action was tested.

### Phase 23C - Controlled Synthetic Tenant Mutation Smoke

Passed.

Actions were scoped only to `MrTester`:

- `MrTester` was reclassified from `production_customer` to `founder_test`,
- one synthetic quote was submitted through `/quote/mrtester`,
- success flow returned expected status,
- lead count changed from `0` to `1`,
- fake lead was scoped to `MrTester`,
- quote link disable/enable was tested only for `MrTester`,
- quote link was restored to active.

No real customer data was touched.

### Phase 23D - Synthetic Owner Dashboard Runtime Proof

Passed.

Approved access path:

- temporary password update only for the existing synthetic `MrTester` owner,
- normal app auth,
- no new owner/member,
- no real user password reset,
- no production SQL,
- no migrations,
- no workspace repair.

Confirmed:

- `/dashboard` returned 200,
- `/dashboard/leads` returned 200,
- dashboard resolved `MrTester`,
- fake QA lead was visible,
- no false empty state,
- no cross-tenant data,
- no sensitive output markers.

### Phase 23E - Targeted AI Provider Proof

Passed after diagnosis and fixes.

Initial provider attempts safely fell back with:

```text
ai_provider_invalid_schema
```

Diagnosis path:

1. Production logs showed OpenAI request and response were happening, but local
   parsing failed.
2. Parser fix was added:

   ```text
   84f35e9 fix(ai): tolerate fenced structured output responses
   ```

3. Safe non-secret diagnostics were added:

   ```text
   e3a94e2 chore(ai): add safe OpenAI response diagnostics
   ```

4. Diagnostics showed the actual blocker:

   ```text
   response status: incomplete
   incomplete reason: max_output_tokens
   balanced JSON found: false
   ```

5. Token budget fix was added:

   ```text
   1bab2f6 fix(ai): increase structured bundle output budget
   ```

Final successful proof:

- exactly one production AI retry was run,
- only on `MrTester` / `BizPilot QA Test Lead`,
- OpenAI provider succeeded,
- response status was `completed`,
- balanced JSON was found,
- bundle validator accepted the parsed object,
- existing synthetic `ai_outputs` row was updated in place to:

  ```text
  provider=openai
  status=generated
  model=gpt-5.1
  ```

- usage event was persisted,
- lead timeline event was persisted,
- draft safety review passed:
  - no invented pricing,
  - no invented availability,
  - no booking confirmation,
  - no guarantees,
  - owner-reviewed/manual-send orientation preserved.

### Phase 23F - Email, SMTP, And Password Reset Proof

Partially passed, not fully passed.

Passed:

- production env/config posture was audited without exposing secrets,
- password reset request was submitted once for the synthetic `MrTester` owner,
- app returned generic non-enumerating response,
- reset redirect target was correct:

  ```text
  https://bizpilo.com/auth/reset-password
  ```

- logs showed:

  ```text
  auth.password_reset.primary_succeeded
  ```

- logs recorded domain only, not full email,
- no token/reset link/password/provider secret was printed,
- public smoke passed 9/9 afterward.

Not passed:

- mailbox arrival was not verified,
- reset link was not opened,
- password reset completion was not tested,
- custom SMTP provider/domain verification remains unconfirmed,
- owner notification email delivery is not implemented/proven,
- From/Reply-To posture is not proven.

## Production Code Changes Completed During This Readiness Push

Code changes already committed and pushed:

| Commit | Purpose |
| --- | --- |
| `84f35e9` | Tolerate fenced/prefixed structured provider output before validator |
| `e3a94e2` | Add safe non-secret OpenAI response/request diagnostics |
| `1bab2f6` | Increase lead conversion bundle max output token budget to `3000` |
| `319e4a4` | Record Phase 23 production functional smoke docs |

The OpenAI fixes were intentionally narrow:

- no schema loosening,
- no prompt-safety weakening,
- no auto-send behavior,
- no real customer data use,
- fallback behavior preserved.

## What Is Still Not Done

### P0 Before Real Customer Data

1. **Backup/export/restore readiness**

   Real customer data remains blocked until one of these is completed:

   - Supabase paid backup/PITR posture is upgraded and recorded, or
   - manual logical export path is performed and verified, and
   - restore drill is completed against a disposable non-production target.

   Current supporting docs say this is still an active gate:

   - `docs/operations/BIZPILOT_BACKUP_AND_EXPORT_STRATEGY_v1.0.md`
   - `docs/operations/BIZPILOT_BACKUP_EXPORT_RESTORE_DECISION_MATRIX_v1.0.md`
   - `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`

2. **Custom SMTP/Auth email proof**

   Current state:

   - password reset request is accepted,
   - app behavior is safe,
   - actual mailbox delivery is not verified,
   - custom SMTP/DNS/provider status is not verified,
   - reset-link open is not verified.

   Required before real users:

   - choose and configure transactional email provider,
   - verify sending domain/DNS,
   - configure Supabase custom SMTP,
   - use one approved receivable test inbox,
   - run signup/confirmation smoke,
   - run forgot/reset-password smoke,
   - open the reset link without printing it,
   - verify reset page and completion if owner approves password change.

3. **Owner notification email decision**

   Current state:

   - dashboard has notification UI,
   - app-level owner notification sender was not found,
   - no `RESEND_API_KEY` was present in Vercel production env listing,
   - owner notification proof was skipped.

   Decision needed:

   - Is owner notification email required for the first real pilot?
   - If yes, implement and test a narrow owner-only notification sender.
   - If no, adjust UI/copy/readiness docs so owner notification is clearly
     "not active yet" and the owner workflow remains manual.

4. **OpenAI monitoring posture**

   Provider proof passed, but real pilot still needs operating limits:

   - cost monitoring,
   - quota monitoring,
   - fallback monitoring,
   - rate-limit behavior,
   - decision on whether Phase 23E diagnostics stay enabled, are gated, or are
     reduced after readiness.

### P1 Before Paid Pilot Operations

1. Payment and commercial pilot execution evidence.
2. Real support/escalation workflow.
3. Provider failure runbook for OpenAI and email.
4. Clear owner-facing statement that AI drafts are manual-send only.
5. Decide whether first pilot needs admin/founder live monitoring dashboard.

### P2 Product/UX Improvements

These are not blockers for synthetic readiness but should be considered:

- Notification settings currently imply owner email awareness, but production
  sender is not implemented/proven. This can confuse pilot operators.
- Email/custom SMTP setup status should be visible somewhere operationally,
  even if only founder/admin-facing.
- The app should eventually have a repeatable smoke script for password reset
  using a safe inbox workflow, not manual one-off evidence.
- AI provider diagnostics were useful for Phase 23E; decide whether to keep
  them permanently, gate them behind an env flag, or reduce them after launch.
- Add a concise readiness dashboard/checklist doc that separates:
  - synthetic-ready,
  - real-data-ready,
  - paid-pilot-ready.

## Suggested Next Steps

### Next Step 1 - Commit Phase 23F And This Summary

If owner approves docs-only commit:

```powershell
git status --short --branch
git add docs/readiness/PHASE_23_PRODUCTION_FUNCTIONAL_SMOKE_2026-05-29.md docs/readiness/WHERE_WE_ARE_WITH_NEXT_STEP_2026-05-29.md
git commit -m "docs: summarize current readiness and next steps"
git push origin main
```

Do not include production code changes in this docs commit.

### Next Step 2 - Close Email Gate

Owner decisions needed:

1. Pick provider:
   - Postmark,
   - Resend,
   - SendGrid,
   - AWS SES,
   - or another transactional provider.
2. Confirm sender/domain:
   - example: `no-reply@auth.bizpilo.com`,
   - or another owner-approved address.
3. Configure DNS and Supabase custom SMTP outside the repo.
4. Provide one approved receivable test inbox.
5. Run one controlled signup/confirmation and forgot/reset smoke.

No real customer email should be used.

### Next Step 3 - Close Backup/Restore Gate

Owner decisions needed:

1. Upgrade Supabase backup/PITR posture, or approve manual export path.
2. Run a logical export without printing real/customer data.
3. Restore to disposable non-production target.
4. Run RLS/app smoke against restored target.
5. Record result in readiness docs.

No destructive cleanup or real customer data intake should happen before this.

### Next Step 4 - Decide Owner Notification Scope

Two safe paths:

1. **Manual-only pilot**
   - leave owner notifications unimplemented,
   - make UI/copy explicit that notification email is not active,
   - owner checks dashboard manually.

2. **Owner notification pilot**
   - implement narrow owner-only notification sender,
   - no customer-facing email,
   - no AI auto-send,
   - test only on `MrTester` or approved safe inbox,
   - verify subject/body, From/Reply-To, and failure behavior.

### Next Step 5 - Real Pilot Approval Decision

Only after email and backup gates close, decide whether BizPilot is:

| Status | Meaning |
| --- | --- |
| Synthetic-ready | Current state is mostly here |
| Real-data-ready | Requires email + backup/restore gates closed |
| Paid-pilot-ready | Requires real-data-ready plus payment/support/operator readiness |

## Current Real Pilot Decision

As of this document:

```text
Do not start real customer data intake yet.
Do not start paid pilot with real customer data yet.
Continue using synthetic-only production smoke flows until email and backup gates close.
```

## Safety Rules To Keep Carrying Forward

- Do not run production SQL unless owner approves exact scope and backup posture.
- Do not run migrations unless owner approves exact migration and rollback plan.
- Do not delete users.
- Do not hard purge.
- Do not run workspace repair casually.
- Do not mutate real customer data.
- Do not touch `BizPilot Synthetic Cleaning QA MailTM` unless explicitly approved.
- Do not pop homepage/design/docs stashes.
- Do not redesign during readiness phases.
- Do not print passwords, reset links, auth tokens, API keys, SMTP credentials,
  service-role keys, raw prompts, or raw provider output.
- Use `MrTester` only for synthetic production proof unless owner approves a
  different synthetic target.

## Bottom Line

BizPilot AI is now far beyond "docs only." The production app has proven its
core synthetic quote, dashboard, and AI draft paths end to end.

The remaining blockers are operational, not core product-flow blockers:

1. Email delivery/custom SMTP proof.
2. Backup/export/restore proof.
3. Owner notification implementation decision.
4. Ongoing OpenAI operational monitoring.

Once those gates are closed, the project can be reassessed for a carefully
scoped first real pilot.
