# Phase 25O - Security And Runtime Operations

Date: 2026-07-04
Repo: `E:\bizpilot-ai`
Branch: `main`

## Decision

Close the next security/ops backlog slice without mutating production data.
This phase adds a service-role-only abuse-log retention helper, creates the
security operations register, and records runtime/CSP/credential posture.

## Sources Reviewed

Reviewed on 2026-07-04:

- OWASP Logging Cheat Sheet:
  `https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html`
- OWASP HTTP Security Response Headers Cheat Sheet:
  `https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html`
- OWASP Content Security Policy Cheat Sheet:
  `https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html`
- MDN Content-Security-Policy:
  `https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy`
- MDN Content-Security-Policy-Report-Only:
  `https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy-Report-Only`
- OWASP Secrets Management Cheat Sheet:
  `https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html`

## What Changed

- Added `supabase/migrations/0023_public_submission_abuse_log_retention.sql`.
- Added `public.delete_old_public_submission_abuse_logs(integer)` as a
  service-role-only cleanup helper.
- Updated the abuse-log RLS test to cover anon denial and service-role cleanup.
- Updated `supabase/migrations/README.md` with the new migration and next
  migration number.
- Added `docs/security/BIZPILOT_SECURITY_OPERATIONS_REGISTER_2026-07-04.md`.
- Added source guards for:
  - production-only IP hash salt posture,
  - abuse retention cleanup,
  - privacy request and incident registers,
  - credential rotation hygiene,
  - CSP/report-only hardening path,
  - Node/pnpm/runtime posture.

## Current Security Posture

| Area | Status |
| --- | --- |
| IP hash salt | Implemented. `BIZPILOT_IP_HASH_SALT` is required in production; deterministic fallback is non-production only. |
| Raw IP storage | Avoided in `public_submission_abuse_log`; the table stores `ip_hash`. |
| Abuse retention | Implemented as migration-ready service-role cleanup helper with 7-365 day bounds and 90-day target. |
| Privacy registers | Documented as header-only request and incident registers; no real data entered. |
| CSP | Enforced in `next.config.ts`; future stricter candidate policies should use report-only with reporting endpoint first. |
| Security headers | CSP, referrer policy, content-type nosniff, frame denial, and permissions policy are configured. |
| Runtime | Node `>=24 <25`, pnpm `10.18.3`, Next.js `16.2.4`, React `19.2.4`. |
| Credential rotation | Register and owner-confirmation flow documented; no secrets printed or rotated by this phase. |

## Product And Data Boundary

This phase does not:

- run migrations against production,
- touch real customer data,
- approve real-data use,
- approve paid pilot,
- add analytics scripts,
- add payment scripts,
- add messaging automation,
- weaken RLS,
- print or rotate secrets.

## Backlog Items Advanced

```text
72 rechecked at source level for abuse/rate-limit posture
85 done
86 done with migration-ready cleanup helper
87 done as header-only privacy request and incident registers
88 done as CSP/report-only hardening plan on top of current enforced headers
89 preserved as paid-pilot blocker
90 preserved; RLS test not run without local DB target
91 done
92 done as credential rotation register and owner-action flow
93 preserved
94 preserved
95 preserved
96 preserved
97 preserved
100 preserved
```

## Verification

```text
git diff --check PASS
pnpm test:unit PASS
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
pnpm test:rls NOT RUN - requires local DATABASE_URL target; production/non-local targets remain blocked
```
