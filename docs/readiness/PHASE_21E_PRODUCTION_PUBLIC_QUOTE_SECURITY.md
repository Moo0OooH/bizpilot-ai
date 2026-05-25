# Phase 21E Production Public Quote Security

**Project:** BizPilot AI
**Document Type:** Production public quote security verification
**Status:** Partial route smoke passed; data-bearing production smoke not run
**Owner:** MoOoH
**Last Updated:** 2026-05-25

---

## 1. Purpose

This document records whether BizPilot's public quote submission flow was safely verified in production with synthetic data after production schema/RPC alignment.

No production quote submission was created. No production lead was created. No production customer data was read. No real customer data was used. No security policy was weakened. No production SQL was run. No secrets, tokens, database passwords, service role keys, anon keys, OpenAI keys, full connection strings, full emails, or customer payloads were printed or recorded.

2026-05-25 continuation note: `pnpm smoke:quote` now provides a safe
synthetic quote-route smoke runner. It was run against production with an
unavailable synthetic slug only. This is route-level evidence, not full
data-bearing public quote security verification.

## 2. Environment

| Item | Status |
| --- | --- |
| Production app URL | `https://bizpilo.com` |
| Supabase project ref | `qfqendrqimqvkoojpjao` |
| Supabase project name | `bizpilot-production` |
| Test environment | Production |
| Test data policy | Synthetic only |
| Production public quote security test run? | Partial route-only check |

## 3. Preconditions

| Required precondition | Status | Evidence / blocker |
| --- | --- | --- |
| Production migrations aligned | Object-verified; history unavailable | Required public quote columns/functions, expected `0018` objects, RLS enablement, policies, function definitions, `0019` grants, and targeted constraints/seeds have been verified. `supabase_migrations.schema_migrations` is missing, so history remains unavailable/manual drift. |
| Required RPCs visible to PostgREST | Yes by safe probe and direct SQL | Phase 21B safe probes showed the three public quote RPCs callable/visible with repo parameter names. Owner-run direct SQL verified required functions and grants. |
| Backup/safety documented | Blocked for real customer data | Supabase Free plan has no scheduled backup/PITR available; no manual export or restore drill has been done. Owner risk-accepted this only for no-real-user database/security alignment. |
| Test business/link available or safely created | No active link available to Codex | Phase 21N records the proposed synthetic workspace/link shape. Owner broadly approved readiness work, but an active synthetic slug/session is still needed to perform data-bearing checks. |
| Owner approval for production data-bearing smoke | Broad readiness approval granted; execution inputs still required | Owner approved practical non-destructive readiness work. Phase 21N records the exact synthetic smoke plan, but execution still requires synthetic accounts/sessions, active link, payload, and cleanup/retain-evidence decision. |

## 4. Decision

**Do not run data-bearing production public quote security tests yet.**

Reason:

```text
The database/RLS preconditions are mostly satisfied by object verification, and Phase 21N now records a controlled test business/link/session plan plus cleanup options. The production route-only unavailable-link check passed. The production data-bearing synthetic smoke still needs an active synthetic quote slug, synthetic owner sessions, fake payload, and cleanup/retain-evidence decision.
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
| Inactive/unavailable public quote link blocked | Pass - route-only | `pnpm smoke:quote -- --base-url=https://bizpilo.com --inactive-slug=phase-21-synthetic-unavailable-check` returned HTTP 200, rendered the safe unavailable state, and did not expose raw/internal markers. |
| Wrong business/form mismatch blocked | Not run | Requires controlled synthetic production forms/businesses. |
| Unknown field key blocked | Not run | Supported by `public_can_insert_submission_value` verification and local RLS tests; production browser/API smoke still required. |
| Hidden field value insert blocked | Not run | Supported by public submission-value RLS hardening verification and local RLS tests; production browser/API smoke still required. |
| Field from another form blocked | Not run | Supported by public submission-value RLS hardening verification and local RLS tests; production browser/API smoke still required. |
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

1. Keep Phase 21A backup/PITR/export/restore blocked for real customer data, or record a fresh explicit owner risk acceptance for synthetic-only smoke.
2. Use the Phase 21C/21D SQL evidence as the database/RLS preflight; do not re-apply `0018` blindly.
3. Review and approve `docs/readiness/PHASE_21N_SYNTHETIC_PRODUCTION_SMOKE_PLAN.md`.
4. Create or identify a disposable synthetic cleaning business and quote link.
5. Create or identify two synthetic owners for horizontal-access verification.
6. Define cleanup policy for synthetic leads/submissions after the test.
7. Space tests safely to avoid auth or quote rate-limit spam.

## 9. Cleanup Policy

No cleanup was performed because no production test data was created.

When the production smoke is approved, the operator must record:

- synthetic business/link identifiers without customer data,
- synthetic lead/submission identifiers,
- whether data is retained as test evidence or removed through an approved cleanup path,
- who approved cleanup,
- whether cleanup itself touches production data.

## 10. Continuation Evidence

2026-05-25 safe route-only smoke:

```text
pnpm smoke:quote -- --base-url=https://bizpilo.com --inactive-slug=phase-21-synthetic-unavailable-check
Result: pass, 1/1
Production route: /quote/phase-21-synthetic-unavailable-check
Expected state: safe unavailable quote page
Raw/internal marker exposure: none detected by runner
Production SQL: none
Production data creation: none
```

This closes only the inactive/unavailable public quote route check. It does
not verify active submission, lead creation, dashboard visibility,
`source_channel`, consent persistence, abuse controls, or horizontal access.

## 11. Issues Found

No production public quote flow issue was found in the route-only check.

Current blocker is active synthetic test setup/session availability, not a newly observed application defect.

## 12. Patches Made

`pnpm smoke:quote` was added in `f1c5346` for approved synthetic public
quote-link checks.

No RLS changes were made.

No production SQL was run.

## 13. Final Status

Production public quote security verification:

```text
Partial route-only pass; full data-bearing smoke not run.
```

Final Phase 21E decision:

```text
Blocked until an active synthetic quote link, synthetic owner sessions, synthetic payload, and cleanup/retain-evidence decision are available.
```

BizPilot remains:

```text
Ready only for founder-controlled synthetic demos.
```

BizPilot is not yet:

```text
Ready for the first real pilot customer with real customer data.
```
