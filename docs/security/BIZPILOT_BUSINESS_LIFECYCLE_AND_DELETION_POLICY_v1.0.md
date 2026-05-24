# BizPilot Business Lifecycle And Deletion Policy v1.0

**Project:** BizPilot AI
**Document Type:** Security, privacy, and lifecycle policy
**Status:** Active canonical policy
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Core Model

BizPilot separates the customer tenant from login identity.

| Concept | Meaning | Deletion policy |
| --- | --- | --- |
| Business/workspace | Customer tenant/container for quote links, leads, intake submissions, AI outputs, usage, and configuration. | Business deletion is a workspace lifecycle event. |
| Auth user | Login identity in `auth.users`. | Account deletion is separate and must not happen automatically during business deletion. |
| Profile | Application metadata for a login identity. | Profile handling follows account deletion policy, not workspace deletion by default. |

Business deletion, workspace cleanup, and auth account deletion are three separate paths. A UI label must never collapse them into "delete account" or "delete everything now."

## 2. Workspace Kinds

`businesses.workspace_kind` classifies cleanup risk.

| Workspace kind | Meaning | Hard cleanup eligibility |
| --- | --- | --- |
| `production_customer` | Real customer, pilot, or customer-like workspace. Default. | Never through test cleanup. Only through production deletion/anonymization process. |
| `founder_test` | Founder/internal test workspace. | Eligible for founder-only test hard purge after dry-run and confirmation. |
| `demo` | Demo workspace with synthetic/demo data. | Eligible for founder-only test hard purge after dry-run and confirmation. |
| `seed` | Seed/dev fixture workspace. | Eligible for founder-only test hard purge after dry-run and confirmation. |

If `workspace_kind` is missing, unknown, or `production_customer`, hard cleanup must be blocked.

## 3. Lifecycle States

BizPilot currently has two related concepts:

| Field | States | Meaning |
| --- | --- | --- |
| `businesses.status` | `onboarding`, `active`, `suspended`, `cancelled` | Operational access/status. |
| `businesses.lifecycle_status` | `active`, `archived`, `deletion_requested`, `deleting`, `deleted` | Workspace lifecycle state. |

Deletion lifecycle states must not behave as active. `deletion_requested`, `deleting`, and `deleted` must block new customer-data workflows.

## 4. Test/Fake Cleanup Policy

Test/fake cleanup exists only for founder-created fake, demo, seed, or internal testing artifacts.

Required controls:

- founder-only authorization through the existing founder guard,
- server-side service-role use only after founder authorization,
- `workspace_kind in ('founder_test', 'demo', 'seed')`,
- dry-run first with counts only,
- checkbox acknowledgement,
- exact business name or slug confirmation,
- explicit cleanup mode `test_hard_purge`,
- non-PII tombstone,
- no raw customer data in logs.

Forbidden:

- hard purge of `production_customer`,
- owner/member/admin access to test cleanup,
- service-role client exposure,
- auth user deletion by default,
- partial cleanup after an eligibility failure.

## 5. Production Deletion Policy

Production deletion is for real business/workspace deletion. It is not the same as test cleanup.

Owner request requirements:

- active business owner only,
- double confirmation,
- exact business name typed,
- copy must state this requests workspace deletion and does not automatically delete login account.

Immediate lock behavior after request:

- set lifecycle/status to deletion-requested state where supported,
- disable public quote links,
- block new quote submissions,
- block new AI generation,
- show owner a locked/deletion-requested state.

Final production deletion must be founder/server-side controlled. It may purge/anonymize personal data only after backup/export/restore readiness and review are complete. It must preserve only minimal non-PII tombstone evidence.

## 6. Auth User Policy

`auth.users` must not be deleted during business deletion.

Auth user deletion is allowed only through a separate account deletion or explicit internal/test identity cleanup policy. Before any auth user deletion:

- verify the account is explicitly internal/test or a valid account deletion request exists,
- verify the user has no other active business memberships,
- block users linked to any `production_customer` workspace,
- block users who own a workspace or hold an owner membership until that workspace is deleted/transferred first,
- block founder allowlist accounts,
- verify the user is not the current founder account,
- require exact email/user-id confirmation and final founder acknowledgement,
- log only non-PII audit evidence.

If these safeguards are unavailable, do not delete `auth.users`.

## 7. Data Handling Matrix

| Table/data area | Test cleanup | Production deletion | Notes |
| --- | --- | --- | --- |
| `businesses` | Purge for `founder_test`/`demo`/`seed`. | Anonymize/mark deleted or purge only through approved production process. | Preserve tombstone separately. |
| `business_members` | Purge workspace memberships. | Remove memberships or retain non-PII membership tombstone only if needed. | Does not delete auth users. |
| `profiles` | No action by default. | No action unless separate account deletion applies. | Profile belongs to login identity. |
| `leads` | Purge. | Purge/anonymize personal lead data. | Customer names/contact/address-like data must not remain. |
| `intake_submissions` | Purge. | Purge/anonymize submission metadata as needed. | Submission-level deletion status is not workspace lifecycle. |
| `intake_submission_values` | Purge. | Purge personal field values. | Contains arbitrary customer-submitted values. |
| `lead_source_metadata` | Purge. | Purge/anonymize tracking metadata. | Avoid retaining campaign/source data tied to a person. |
| `lead_events` | Purge. | Purge/anonymize actor/customer event data. | Do not retain raw notes. |
| `lead_quality_scores` | Purge. | Purge/anonymize if tied to lead. | Derived lead data. |
| `lead_action_items` | Purge. | Purge/anonymize if tied to lead. | Derived workflow data. |
| `ai_outputs` | Purge. | Purge AI prompt/output/derived text. | Never store prompts/output in tombstones. |
| `usage_events` | Purge. | Retain only aggregate/non-PII if explicitly approved; otherwise purge business-scoped events. | No prompt, output, email, phone, address. |
| Public links | Purge. | Disable immediately; purge/anonymize later. | Quote access must be unavailable after deletion request. |
| Forms/fields | Purge. | Purge/anonymize if custom labels or content may identify customer/business. | Templates are retained separately. |
| `admin_action_log` | Purge old test workspace logs, then write safe completion event. | Retain only non-PII actions needed for compliance/audit. | No customer data, prompts, emails, phones, addresses. |
| `business_deletion_tombstones` | Retain non-PII tombstone. | Retain non-PII tombstone. | No business name, slug, owner email, lead/customer details, prompt/output text. |

## 8. Safety Rules

Never put any of the following in logs, tombstones, notices, or admin action metadata:

- raw lead/customer names,
- full emails,
- phone numbers,
- addresses,
- quote bodies,
- intake field values,
- AI prompts,
- AI output text,
- raw admin notes,
- cookies,
- tokens,
- API keys,
- service-role keys,
- OpenAI keys.

Service-role credentials are server-only. Client components may call server actions but must never import service-role clients or receive secrets.

## 9. Known Limitations

- `pnpm test:rls` requires `DATABASE_URL`.
- Production migrations must not be applied blindly; verify the exact Supabase target first.
- Backup/export/restore readiness must be complete before real customer purge/anonymization.
- Production purge/anonymization is not fully automated in the owner dashboard and must remain controlled until a dedicated, tested process exists.
