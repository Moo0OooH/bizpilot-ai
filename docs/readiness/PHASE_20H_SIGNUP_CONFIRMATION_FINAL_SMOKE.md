# Phase 20H Signup Confirmation Final Smoke

**Project:** BizPilot AI
**Document Type:** Production signup confirmation smoke report
**Status:** Blocked - no accessible safe test inbox
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Purpose

Phase 20H is intended to run exactly one final production signup confirmation smoke after Supabase Auth throttling clears.

The production signup attempt was **not run** in this pass. The blocker is not another confirmed Supabase rate-limit response; the blocker is that this environment has no configured safe test inbox or mail-capture path to verify the confirmation email and callback link end-to-end. Running signup with an address we cannot open would burn the single allowed attempt without proving the email or callback behavior.

No Supabase Auth signup request was sent. No confirmation email was triggered by this pass. No production user/workspace was created by this pass.

## 2. Test Result

| Check | Result | Notes |
| --- | --- | --- |
| Use one safe test email | Blocked | No `SIGNUP_SMOKE_EMAIL`, `BIZPILOT_TEST_EMAIL`, mail-capture service, or owner-provided inbox was configured. |
| Signup action does not crash | Not run | Would require the one production signup attempt. |
| Confirmation email is sent | Not run | Requires access to the receiving inbox or an approved mail-capture tool. |
| Confirmation link lands on correct callback | Not run in production | Requires opening the real confirmation email link. |
| Confirmation is not confused with recovery/reset | Pass by local unit test and code inspection; not production-email verified | `auth-callback-routing` tests passed and signup uses `/auth/callback`; recovery callbacks route to `/auth/reset-password`. |
| Expected success/session behavior occurs | Not run | Requires the real confirmation link. |
| Logs are sanitized | Pass by code inspection | Signup logs email domain, redirect URL, identity/session booleans, and low-cardinality error metadata; it does not log full email, password, auth code, token, cookie, or raw provider object. |

## 3. Rate Limit Status

| Item | Result |
| --- | --- |
| Previous known blocker | Supabase Auth email throttle was hit during earlier production smoke. |
| New production signup attempt in Phase 20H | Not run |
| New rate-limit response observed | No |
| Retry behavior | No retries were attempted. |

If a safe inbox is provided and the next single attempt returns a rate-limit message again, stop immediately and record the external Supabase throttle. Do not repeat the signup request.

## 4. Callback Behavior

Local callback-routing verification was run without touching production Auth:

```text
node --test tests/unit/auth-callback-routing.test.mts

tests 7
pass 7
fail 0
```

Verified locally:

- untyped root auth codes route to signup/email callback,
- explicit signup callbacks are not treated as recovery,
- explicit recovery callbacks route to reset-password,
- only expected Supabase callback params are copied,
- post-confirm redirects stay constrained to dashboard paths,
- signup confirmation exchange failures use neutral sign-in copy,
- missing confirmation codes and recovery failures remain invalid/expired style errors.

Production confirmation callback behavior remains **not verified** until a real confirmation email link is opened from a controlled synthetic inbox.

## 5. Issues

### P1: Safe Test Inbox Missing

To complete this smoke, the owner/operator must provide one controlled test email inbox that can receive and open the Supabase confirmation email. Acceptable paths:

- owner-provided disposable inbox for the smoke,
- configured test mailbox env such as `SIGNUP_SMOKE_EMAIL`,
- approved mail-capture service,
- approved Gmail/Outlook connector access to a test inbox.

Do not use a non-receivable address such as `example.com` for this smoke, because it cannot verify that the email was sent or that the callback link works.

### P1: Production Auth Attempt Still Outstanding

The final production signup confirmation smoke remains open. It should be run exactly once after:

1. a safe test inbox is available,
2. Supabase Auth throttle window is expected to have cleared,
3. the operator is ready to open the email immediately,
4. the test email has not already been used for BizPilot signup.

## 6. Patches Made

Documentation only:

- created `docs/readiness/PHASE_20H_SIGNUP_CONFIRMATION_FINAL_SMOKE.md`.

No application code, migration, RLS policy, UI, `.env` file, production setting, Auth user, or workspace row was changed.

## 7. Final Status

| Gate | Status |
| --- | --- |
| Production signup confirmation smoke | Blocked / not run |
| Supabase Auth call made | No |
| One-attempt budget consumed | No |
| Confirmation email sent | Not verified |
| Confirmation callback opened | Not verified |
| Signup vs recovery/reset separation | Pass by local unit test and code inspection |
| Logs sanitized | Pass by code inspection |
| Production data changed | No |

Final decision: **Phase 20H remains blocked until a controlled test inbox is available. Do not run the production signup attempt with an address that cannot be opened, and do not retry repeatedly if Supabase Auth throttles again.**
