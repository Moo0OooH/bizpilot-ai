<!--
 * ============================================================
 * File: docs/security/BIZPILOT_SECURITY_OPERATIONS_REGISTER_2026-07-04.md
 * Project: BizPilot AI
 * Description: Security, privacy, credential, runtime, and release-gate operating register.
 * Role: Keeps non-secret operational evidence templates and current security boundaries in one controlled document.
 * Related:
 * - next.config.ts
 * - package.json
 * - supabase/migrations/0023_public_submission_abuse_log_retention.sql
 * - supabase/migrations/0025_premium_operations_addons.sql
 * - supabase/migrations/0026_premium_operations_schedule_integrity.sql
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Updated the runtime baseline and added Premium Operations migration, entitlement, exact-time, and release-safety controls.
 * ============================================================
 -->

# BizPilot Security Operations Register

Created: 2026-07-04
Last updated: 2026-07-22
Status: Current operating template
Owner: MoOoH

## Purpose

Keep security/privacy operations ready before paid pilot or real customer data.
This register is intentionally header-only. Do not add real customer personal data, secrets, tokens, passwords, reset links, private keys, or payment data.

## Reference baseline

- OWASP Logging Cheat Sheet: `https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html`
- OWASP HTTP Security Response Headers Cheat Sheet: `https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html`
- OWASP Content Security Policy Cheat Sheet: `https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html`
- MDN Content-Security-Policy: `https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy`
- MDN Content-Security-Policy-Report-Only: `https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy-Report-Only`
- OWASP Secrets Management Cheat Sheet: `https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html`

This register does not authorize anyone to run migrations against Production, print or rotate secrets, or enter real customer data. The RLS suite remains `GATED` when a classifier-approved local/disposable `DATABASE_URL` is unavailable.

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
| Package manager | `pnpm@10.34.5` |
| Next.js | `16.2.11` |
| React / React DOM | `19.2.7` |
| Candidate verification | Exact-tree local PASS: full/Production audits report zero vulnerabilities; lint/typecheck; `359/359` unit/source; static RLS/grant audit; build; public `46/46`; responsive `20/20`; UI zero failures; inactive Quote `2/2`; image optimizer HTTP 200. Chrome, database-backed RLS/concurrency, authenticated QA, and external release remain gated. |

Runtime changes require a separate phase, changelog, rollback note, and full
verification.

## Premium Operations Security Posture

- Migration `0025_premium_operations_addons.sql` establishes tenant-scoped add-on entitlements, priority rules, internal time blocks, review drafts, recipients, RLS, grants, and immutable review/copy transitions.
- Additive migration `0026_premium_operations_schedule_integrity.sql` must follow `0025`. It adds canonical exact-time intake, the fixed `America/Toronto` operating-time contract, overlap serialization, atomic draft creation, availability provenance/currentness checks, and founder entitlement auditing.
- The canonical `preferred_time` question uses the database field type `time` and is exposed only for an active Availability Coordination entitlement. A canonical preferred date remains required for an exact-time request.
- Founder activation is explicit and server-gated. The internal Admin console may enable or disable a supported add-on through the service-role path and records an audit event; it is not a customer self-serve billing control.
- Premium reply and availability drafts remain manager-reviewed and manual-copy-only. No database function or UI control sends a customer message, creates a booking, takes payment, or acts as a full CRM.
- The `0025` + `0026` sequence and RLS suite remain gated until a classifier-approved local/disposable database is available. No managed Supabase or Production execution is represented by this source candidate.
- GitHub CI, Vercel preview/Production deployment, and Production database state are separate external evidence gates. A local build or smoke result cannot satisfy them.

## Owner Gates Preserved

- Real customer data remains blocked until explicit approval.
- Paid pilot remains blocked until support/payment/refund/rollback/restored
  app/RLS gates close.
- Owner notification email remains deferred.
- Customer email automation, SMS/WhatsApp, booking, invoice/payment automation,
  team access, and autonomous AI remain future scope.
