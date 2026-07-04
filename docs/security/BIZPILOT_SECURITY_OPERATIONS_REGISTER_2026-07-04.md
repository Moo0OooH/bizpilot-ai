# BizPilot Security Operations Register

Date: 2026-07-04
Status: Phase 25O operating template
Owner: MoOoH

## Purpose

Keep security/privacy operations ready before paid pilot or real customer data.
This register is intentionally header-only. Do not add real customer personal data, secrets, tokens, passwords, reset links, private keys, or payment data.

## Abuse Log Retention

| Item | Current posture |
| --- | --- |
| Data stored | Hashed IP, business id, optional intake form id, reason, created time |
| Raw IP storage | Not stored by the abuse-log table |
| Hash salt | `BIZPILOT_IP_HASH_SALT`; production fails closed when missing |
| Local fallback | Deterministic fallback exists for non-production only |
| Cleanup helper | `public.delete_old_public_submission_abuse_logs(integer)` |
| Execution grant | `service_role` only |
| Default retention target | 90 days for abuse/rate-limit metadata |
| Minimum/maximum cleanup input | 7 to 365 days |
| Migration | `supabase/migrations/0023_public_submission_abuse_log_retention.sql` |

## Privacy Request Register

Use one row per request. Keep only the minimum operational details.

| request_id | date_received | requester_type | business_slug_or_id | request_type | identity_verified | due_date | status | owner_action | closed_date | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Allowed `request_type` values:

- access
- correction
- deletion
- export
- consent question
- retention question
- other

Do not paste customer messages or sensitive documents into this register.

## Privacy Incident Register

Use one row per suspected privacy/security incident.

| incident_id | date_detected | source | affected_scope | data_category | severity | containment_action | owner_notified | regulator_or_legal_review | status | closed_date | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Allowed `severity` values:

- low
- medium
- high
- critical

Do not mark an incident closed until containment, owner review, and follow-up
actions are recorded.

## Credential Rotation Register

Use this when any credential may have been exposed, shared in chat, copied into
logs, or stored in the wrong place.

| credential_scope | provider | reason | old_credential_disabled | new_credential_tested | deployment_updated | owner_confirmed | date_closed | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Minimum rotation flow:

1. Create the replacement secret.
2. Set it in the deployment environment.
3. Test the dependent workflow.
4. Disable or revoke the old secret.
5. Confirm no secret value was committed or printed.
6. Record the owner confirmation.

## CSP And Security Header Register

Current app posture:

- `Content-Security-Policy` is enforced in `next.config.ts`.
- `frame-ancestors 'none'` and `X-Frame-Options: DENY` are set.
- `X-Content-Type-Options: nosniff` is set.
- `Referrer-Policy: strict-origin-when-cross-origin` is set.
- `Permissions-Policy` disables camera, microphone, geolocation, and payment.

Future report-only hardening path:

1. Define the stricter candidate policy.
2. Add a reporting endpoint or external report collector.
3. Use `Content-Security-Policy-Report-Only` for the candidate policy.
4. Review reports for false positives.
5. Promote only the proven policy to enforced CSP.
6. Keep a rollback note for any third-party script or asset change.

Do not add third-party analytics, pixels, chat widgets, payment scripts, or
marketing embeds without a separate owner-approved CSP review.

## Runtime And Dependency Posture

| Item | Current value |
| --- | --- |
| Node engine | `>=24 <25` |
| Package manager | `pnpm@10.18.3` |
| Next.js | `16.2.4` |
| React | `19.2.4` |
| Verification | `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, `pnpm build` |

Runtime changes require a separate phase, changelog, rollback note, and full
verification.

## Owner Gates Preserved

- Real customer data remains blocked until explicit approval.
- Paid pilot remains blocked until support/payment/refund/rollback/restored
  app/RLS gates close.
- Owner notification email remains deferred.
- Customer email automation, SMS/WhatsApp, booking, invoice/payment automation,
  team access, and autonomous AI remain future scope.
