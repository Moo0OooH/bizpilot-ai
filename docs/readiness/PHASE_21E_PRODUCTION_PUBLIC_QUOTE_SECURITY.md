# Phase 21E Production Public Quote Security

**Project:** BizPilot AI
**Document Type:** Production public quote security verification
**Status:** Blocked - production test not run
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Purpose

This document records whether BizPilot's public quote submission flow was safely verified in production with synthetic data after production schema/RPC alignment.

No production quote submission was created. No production lead was created. No production customer data was read. No real customer data was used. No security policy was weakened. No production SQL was run. No secrets, tokens, database passwords, service role keys, anon keys, OpenAI keys, full connection strings, full emails, or customer payloads were printed or recorded.

## 2. Environment

| Item | Status |
| --- | --- |
| Production app URL | `https://bizpilo.com` |
| Supabase project ref | `qfqendrqimqvkoojpjao` |
| Supabase project name | `bizpilot-production` |
| Test environment | Production |
| Test data policy | Synthetic only |
| Production public quote security test run? | No |

## 3. Preconditions

| Required precondition | Status | Evidence / blocker |
| --- | --- | --- |
| Production migrations aligned | No | Phase 21D did not apply migrations; migration history remains unverified. |
| Required RPCs visible to PostgREST | Partial yes | Phase 21B safe probes showed the three public quote RPCs callable/visible with repo parameter names. Direct SQL verification is still required. |
| Backup/safety documented | No | Phase 21A records unknown DB data status, unknown PITR, unknown backup retention, no schema export, and no restore drill. |
| Test business/link available or safely created | No | No owner-approved synthetic production business/link setup is recorded. |
| Owner approval for production data-bearing smoke | No | Not recorded. |

## 4. Decision

**Do not run production public quote security tests yet.**

Reason:

```text
The preconditions for production data-bearing testing are not satisfied.
```

The safe local/RLS production-equivalent public quote verification from Phase 20 remains useful evidence, but it does not replace a production smoke after backup/migration/history gates are closed.

## 5. Positive Test Matrix

| Positive test | Result | Notes |
| --- | --- | --- |
| Active public quote link | Not run | Requires owner-approved synthetic production business/link. |
| Valid cleaning quote payload | Not run | Do not create production submissions until gates pass. |
| Submission accepted | Not run | No production submission attempted. |
| Lead created | Not run | No production lead created. |
| Intake values created | Not run | No production intake values created. |
| Owner can see lead | Not run | Requires production synthetic owner/session and created lead. |
| Another owner cannot see lead | Not run | Requires second synthetic owner and created lead. |

## 6. Negative Test Matrix

| Negative test | Result | Notes |
| --- | --- | --- |
| Inactive/disabled public quote link blocked | Not run | Requires synthetic inactive production link. |
| Wrong business/form mismatch blocked | Not run | Requires controlled synthetic production forms/businesses. |
| Unknown field key blocked | Not run | Should be covered by `public_can_insert_submission_value`; production direct SQL/policy verification still required. |
| Hidden field value insert blocked | Not run | Should be covered by public submission-value RLS hardening; production direct SQL/policy verification still required. |
| Field from another form blocked | Not run | Should be covered by public submission-value RLS hardening; production direct SQL/policy verification still required. |
| Too-fast submission blocked | Not run | Requires rate/min-submit-age test against production; do not spam production. |
| Honeypot submission blocked | Not run | Requires controlled synthetic production submission. |
| Malformed payload rejected safely | Not run | Requires controlled synthetic production request. |
| Raw DB/provider error not exposed to user | Not run | Requires production app request/response smoke without exposing internals. |

## 7. Known Supporting Evidence

Phase 21B safe PostgREST probes found the public quote hardening RPCs visible on the corrected production project:

| RPC/function | Phase 21B safe probe status |
| --- | --- |
| `public_can_insert_submission_value` | Callable |
| `record_public_submission_attempt` | Function exists; synthetic validation error returned before insert |
| `count_recent_public_submission_attempts` | Callable with repo parameter name `target_window_minutes` |

These probes were metadata/RPC visibility checks only. They are not a full production public quote security verification.

## 8. Required Setup Before Retest

Before running the production public quote security smoke:

1. Complete Phase 21A backup/PITR/export/restore safety or record explicit owner risk acceptance.
2. Run Phase 21C owner SQL verification pack and review sanitized results.
3. Close Phase 21D migration-history/schema reconciliation.
4. Confirm required RPCs and RLS policies by direct SQL.
5. Confirm owner approval for one controlled synthetic production quote test sequence.
6. Create or identify a disposable synthetic cleaning business and quote link.
7. Create or identify two synthetic owners for horizontal-access verification.
8. Define cleanup policy for synthetic leads/submissions after the test.
9. Space tests safely to avoid auth or quote rate-limit spam.

## 9. Cleanup Policy

No cleanup was performed because no production test data was created.

When the production smoke is approved, the operator must record:

- synthetic business/link identifiers without customer data,
- synthetic lead/submission identifiers,
- whether data is retained as test evidence or removed through an approved cleanup path,
- who approved cleanup,
- whether cleanup itself touches production data.

## 10. Issues Found

No production public quote flow issue was found in Phase 21E because the production smoke was not run.

Current blocker is operational/safety readiness, not a newly observed application defect.

## 11. Patches Made

No code patches were made for Phase 21E.

No RLS changes were made.

No production SQL was run.

## 12. Final Status

Production public quote security verification:

```text
Not run.
```

Final Phase 21E decision:

```text
Blocked until production migration/history, backup/safety, owner approval, and synthetic test setup are complete.
```

BizPilot remains:

```text
Ready only for founder-controlled synthetic demos.
```

BizPilot is not yet:

```text
Ready for the first real pilot customer with real customer data.
```
