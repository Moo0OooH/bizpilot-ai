# BizPilot Deletion And Cleanup Runbook v1.0

**Project:** BizPilot AI
**Document Type:** Operations runbook
**Status:** Active operational runbook
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Scope

This runbook covers:

- founder-only cleanup of fake/test/demo/seed workspaces,
- owner-requested production business/workspace deletion,
- production purge/anonymization review,
- auth user safeguards,
- tombstone and audit verification.

This runbook does not authorize casual hard deletion of real customer data. It does not authorize normal owners to purge data or delete auth identities.

## 2. Required Model

- Business/workspace is the tenant.
- Auth user is login identity only.
- Business deletion and account deletion are separate.
- Test cleanup is only for `founder_test`, `demo`, or `seed`.
- `production_customer` must not use the test hard-purge path.

## 3. Test/Fake Cleanup: Dry Run

Use this path only for founder-created fake accounts, internal tests, demos, or seed data.

Checklist:

1. Sign in as a founder allowlisted by `BIZPILOT_FOUNDER_EMAILS`.
2. Open the existing founder admin console.
3. Locate the business card.
4. Confirm `workspace_kind` is one of:
   - `founder_test`
   - `demo`
   - `seed`
5. Confirm it is not a real customer or pilot workspace.
6. Run dry-run cleanup.
7. Review counts only.

Dry-run output may include table counts such as:

```json
{
  "leads": 12,
  "intake_submissions": 12,
  "intake_submission_values": 48,
  "ai_outputs": 20,
  "lead_events": 30,
  "public_link_variants": 1
}
```

Dry-run output must not include emails, phones, names, addresses, message bodies, intake values, prompts, or AI output text.

## 4. Test/Fake Cleanup: Final Confirmation

Proceed only after dry-run.

Founder must confirm:

- checkbox acknowledgement,
- exact business name or slug typed,
- cleanup mode `test_hard_purge`,
- final confirmation.

Expected hard-purge order:

1. `intake_submission_values`
2. `ai_outputs`
3. `lead_action_items`
4. `lead_quality_scores`
5. `lead_events`
6. `lead_source_metadata`
7. `public_submission_abuse_log`
8. `usage_events`
9. `leads`
10. `intake_submissions`
11. `public_link_variants`
12. `intake_form_fields`
13. `intake_forms`
14. `consent_versions`
15. business configuration tables
16. `business_members`
17. `business_deletion_requests`
18. old `admin_action_log` rows for the test workspace
19. `businesses`

Write a `business_deletion_tombstones` row with:

- `business_id`,
- `workspace_kind`,
- `deletion_mode = test_hard_purge`,
- `completed_by_actor_type = founder`,
- `reason_code = cleanup` or `fake_test_data`,
- purged table list,
- no PII.

Auth users are not deleted by workspace cleanup.

## 4A. Test/Fake Auth User Deletion

Use this path only for fake/test auth identities after workspace ownership is resolved.

Allowed:

- unlinked fake/test auth users,
- non-founder users linked only to `founder_test`, `demo`, or `seed` workspaces,
- non-owner memberships where deleting the auth identity will not orphan a workspace.

Blocked:

- the signed-in founder account,
- any founder allowlist account,
- any user linked to a `production_customer` workspace,
- any user who owns a workspace or has an owner membership,
- any attempt without exact email/user-id confirmation.

Founder must confirm:

- checkbox acknowledgement,
- cleanup mode `test_auth_user_delete`,
- exact auth user email or user ID typed,
- final confirmation.

The action uses `auth.admin.deleteUser` from server-only service-role code after founder authorization. It first writes an `admin_action_log` entry with `action_type = test_auth_user_deleted`, then marks that entry complete after the Supabase Auth deletion succeeds. This ordering makes a missing production `0020` constraint update fail before any auth identity is deleted. Log safe metadata only. Do not log passwords, tokens, confirmation links, full payloads, customer content, or service-role keys.

## 5. Production Deletion Request Review

When an owner requests workspace deletion:

1. Confirm the request was created by an active owner.
2. Confirm the owner used double confirmation.
3. Confirm workspace lifecycle is `deletion_requested`.
4. Confirm public quote links are disabled.
5. Confirm public quote page is unavailable.
6. Confirm new quote submissions are blocked.
7. Confirm new AI generation is blocked.
8. Confirm login account remains intact.
9. Confirm no customer data was written into `admin_action_log`.

Owner-facing copy must say this requests workspace deletion and does not automatically delete the login account.

## 6. Production Purge/Anonymization Procedure

Do not run production purge/anonymization until all preconditions are complete:

- exact production Supabase target verified,
- migration alignment verified,
- backup/export completed,
- restore drill completed or explicitly owner-approved as deferred risk,
- owner deletion request reviewed,
- grace/review period decision applied,
- no legal/accounting hold exists.

Production handling should remove or anonymize personal data while retaining only minimal non-PII tombstone evidence.

Recommended production handling:

| Area | Action |
| --- | --- |
| Public links | Disable immediately; purge/anonymize later. |
| Leads/submissions/values | Purge or anonymize personal data. |
| Lead events/source metadata | Purge or anonymize personal data. |
| AI outputs | Purge prompt/output/derived text. |
| Usage events | Purge or retain only approved aggregate non-PII. |
| Business/member data | Remove/anonymize workspace and memberships. |
| Profiles/auth users | No action unless separate account deletion applies. |
| Tombstone | Retain non-PII evidence only. |

## 7. Verification Steps

### Verify No Public Quote Access

- Check every public link for the business is inactive.
- Load the public quote URL and confirm it shows a safe unavailable message.
- Attempt a public submission and confirm it is blocked without raw errors.

### Verify AI Is Blocked

- Attempt AI generation for a lead in a `deletion_requested`, `deleting`, or `deleted` workspace.
- Confirm the response is safe and no new `ai_outputs`/`usage_events` are created.

### Verify Workspace Cleanup Does Not Delete Auth Users

- Confirm `auth.users` rows for business members still exist after business deletion request/test cleanup.
- Confirm no `auth.admin.deleteUser` operation was run by workspace cleanup.
- If separate fake/test auth user deletion is requested, verify the target is not a founder, not an owner, and not linked to any production workspace.

### Verify Tombstone Has No PII

Inspect tombstone fields and ensure they do not contain:

- business name,
- slug,
- owner email/name,
- lead/customer name,
- email,
- phone,
- address,
- quote text,
- intake values,
- AI prompts/output,
- raw notes.

### Verify Logs Have No PII

Inspect `admin_action_log` metadata for safe booleans/statuses/counts only. Do not retain free-text customer details.

## 8. Rollback Limitations

Deletion and anonymization are intentionally difficult or impossible to reverse.

- Test hard purge cannot be restored unless a backup exists.
- Production purge/anonymization cannot be reconstructed from tombstones.
- A tombstone is proof of deletion, not a recovery source.
- Rollback requires a pre-deletion backup/export and a reviewed restore target.

## 9. Known Limitations

- `pnpm test:rls` requires `DATABASE_URL`.
- Production migrations must not be applied blindly.
- Backup/PITR/export/restore readiness is still required before real customer purge.
- Production deletion automation should remain controlled until tested end to end against a disposable/staging target.
