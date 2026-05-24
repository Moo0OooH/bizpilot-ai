# Phase 19 Business Lifecycle Deletion Readiness

**Project:** BizPilot AI
**Document Type:** Readiness addendum
**Status:** Active readiness record
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Readiness Decision

BizPilot now has a documented lifecycle policy for business deletion, fake/test cleanup, production deletion, and auth user handling.

This does not mean BizPilot is ready for real customer purge. Production deletion still requires verified production schema, backup/export/restore readiness, and owner-approved operational execution.

## 2. Core Model

| Model item | Status | Readiness note |
| --- | --- | --- |
| Business/workspace is tenant | Pass | Workspace owns quote links, leads, submissions, AI outputs, usage, and configuration. |
| Auth user is login identity | Pass | Auth user deletion remains separate from business deletion. |
| Business deletion vs account deletion | Pass | Docs and UI policy distinguish workspace deletion from login/account deletion. |
| Owner-requested production deletion | Partial | Request/lock path exists; final purge/anonymization remains controlled and not owner self-serve. |
| Founder test cleanup | Partial | Founder-only test/demo/seed cleanup path exists; must be used only for explicit non-production workspaces. |

## 3. Workspace Kinds

| Workspace kind | Meaning | Readiness |
| --- | --- | --- |
| `production_customer` | Real customer/pilot workspace. | Protected from test hard purge. |
| `founder_test` | Internal founder test workspace. | Eligible for founder-only cleanup. |
| `demo` | Demo workspace. | Eligible for founder-only cleanup. |
| `seed` | Seed/dev workspace. | Eligible for founder-only cleanup. |

Default must remain `production_customer`.

## 4. Lifecycle States

| State | Field | Meaning |
| --- | --- | --- |
| `onboarding` | `businesses.status` | Operational setup. |
| `active` | `businesses.status` and `businesses.lifecycle_status` | Operationally active / lifecycle active. |
| `suspended` | `businesses.status` | Operationally paused. |
| `cancelled` | `businesses.status` | Operationally cancelled. |
| `archived` | `businesses.lifecycle_status` | Lifecycle archived. |
| `deletion_requested` | `businesses.lifecycle_status` | Owner requested deletion; workspace locked. |
| `deleting` | `businesses.lifecycle_status` | Controlled deletion/anonymization in progress. |
| `deleted` | `businesses.lifecycle_status` | Deleted/anonymized state. |

Deletion lifecycle states must block new public submissions and AI generation.

## 5. Current Lifecycle Controls

| Control | Status | Evidence |
| --- | --- | --- |
| Owner double confirmation | Implemented | Owner must acknowledge and type exact business name. |
| Workspace lock after request | Implemented | Quote links disabled; new public quote/AI paths blocked. |
| Founder cleanup dry-run | Implemented for non-production workspaces | Counts only; no PII returned. |
| Founder test hard purge | Implemented for `founder_test`/`demo`/`seed` | Requires dry-run, exact confirmation, and final confirmation. |
| Production hard purge | Not implemented for owner dashboard | Must remain controlled server-side process. |
| Auth user deletion | Not implemented by default | Requires separate account/test identity policy. |

## 6. Data Handling Matrix

| Table/data area | Test cleanup | Production deletion readiness |
| --- | --- | --- |
| `businesses` | Purge non-production workspace. | Anonymize/mark deleted or controlled purge after review. |
| `business_members` | Purge workspace memberships. | Remove/anonymize memberships; do not delete auth users. |
| `profiles` | No action. | Separate account deletion only. |
| `leads` | Purge. | Purge/anonymize personal data. |
| `intake_submissions` | Purge. | Purge/anonymize submission data. |
| `intake_submission_values` | Purge. | Purge all submitted values. |
| `lead_source_metadata` | Purge. | Purge/anonymize. |
| `lead_events` | Purge. | Purge/anonymize. |
| `lead_quality_scores` | Purge. | Purge/anonymize derived lead data. |
| `lead_action_items` | Purge. | Purge/anonymize derived workflow data. |
| `ai_outputs` | Purge. | Purge prompt/output/derived AI text. |
| `usage_events` | Purge. | Purge or retain approved aggregate non-PII only. |
| Public links | Purge. | Disable immediately; purge/anonymize later. |
| Forms/fields | Purge. | Purge/anonymize custom business content. |
| `admin_action_log` | Purge old test logs; write safe completion log. | Retain only non-PII audit metadata. |
| Tombstones | Retain non-PII tombstone. | Retain non-PII tombstone. |

## 7. Readiness Gaps

| Gap | Status | Required before real customer purge |
| --- | --- | --- |
| Production target certainty | Blocked | Verify exact Supabase project used by production. |
| Migration alignment | Blocked/Open | Confirm lifecycle schema exists on intended target before use. |
| Backup/export | Blocked | Complete approved export/backup path. |
| Restore drill | Blocked | Complete restore drill or owner-approved risk exception. |
| Production anonymization job | Not complete | Implement and test against disposable/staging data before real use. |
| RLS local validation | Blocked if `DATABASE_URL` missing | Run `pnpm test:rls` with valid local DB. |
| Auth user deletion policy | Deferred | Needs separate account deletion/test identity safeguards. |

## 8. Safety Requirements

- No raw customer data in `admin_action_log`.
- No prompts or AI output in tombstones.
- No full emails, phone numbers, addresses, quote bodies, or intake values in logs.
- No tokens, cookies, API keys, service-role keys, or OpenAI keys in logs/docs output.
- No service role in client code.
- No production customer hard purge through test cleanup.

## 9. Owner Decisions Needed

Before real customer deletion/anonymization:

1. Confirm production Supabase target.
2. Approve backup/PITR/export/restore posture.
3. Approve retention/tombstone requirements.
4. Approve whether production deletion has a grace period.
5. Approve support/legal wording for deletion confirmation.
6. Decide if account deletion is in scope and what verification is required.

## 10. Validation Note

This document is policy/readiness evidence. It does not replace command validation. Continue to run:

```text
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build
pnpm test:rls
```

`pnpm test:rls` requires `DATABASE_URL`.
