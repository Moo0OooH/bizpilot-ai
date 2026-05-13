# BizPilot AI — Safe Error Handling Standard v1.0

**Project:** BizPilot AI  
**Document Type:** Engineering Standard  
**Version:** v1.0  
**Status:** Active MVP Standard  
**Owner:** MoOoH  
**Last Updated:** 2026-05-13

---

## 1. Purpose

BizPilot must give owners and public quote users clear error messages without exposing provider internals, database schema, RLS details, secrets, tokens, or private customer content.

The MVP rule is:

```text
Specific enough to act on.
Generic enough to stay safe.
```

---

## 2. Current Implementation

Lightweight utility:

```text
server/errors/safe-error.ts
```

Primary helper:

```text
getSafeUserErrorMessage()
```

The helper:

- Accepts an unknown error.
- Allows explicitly approved user-facing validation messages.
- Blocks messages with database/provider/security hints.
- Falls back to a workflow-specific safe message.
- Keeps mapping local to the action so UX behavior stays predictable.

---

## 3. User-Facing Message Rules

Allowed user-facing errors:

- Missing or invalid form fields.
- Invalid owner-selected status/outcome.
- Permission denial expressed without internals.
- Public quote form validation messages.
- Generic failure messages that guide retry/review.

Forbidden user-facing errors:

- Raw Supabase errors.
- Raw Postgres errors.
- RLS/policy details.
- Table, relation, schema, constraint, or migration names.
- API key or token errors.
- Raw provider response bodies.
- Stack traces.
- Service-role or secret names.

---

## 4. Internal Logging Rules

Current Phase 6 changes did not add new logging.

When logging is added later, logs may include:

- Operation name.
- Stable internal error code.
- User id when authenticated.
- Business id when available.
- Route/action name.
- Timing or provider status metadata.

Logs must not include:

- Passwords.
- Tokens.
- Service-role keys.
- API keys.
- Full private lead/customer message bodies.
- Raw public quote submission payloads.
- Raw AI prompts containing personal data.
- Full provider/database error dumps by default.

---

## 5. Public Quote Error Rules

Public quote errors must be especially conservative because the route is unauthenticated.

Allowed examples:

```text
Consent is required before submitting.
The quote form changed. Please refresh and submit again.
Bedrooms must be a valid number.
Preferred date cannot be in the past.
We couldn't submit the quote request. Please review the form and try again.
```

Unsafe examples:

```text
new row violates row-level security policy
relation public.leads does not exist
duplicate key value violates unique constraint
JWT expired
```

Current action:

```text
server/actions/public-intake.actions.ts
```

---

## 6. Auth Error Rules

Auth errors should be helpful but not reveal sensitive internals.

Allowed examples:

```text
Email or password is incorrect.
Confirm your email before signing in.
Too many sign-in attempts. Please wait a moment and try again.
An account with this email already exists. Sign in instead.
```

Unsafe examples:

```text
Raw Supabase Auth error payload
JWT verification failed
Auth provider stack trace
```

Current action:

```text
server/actions/auth.actions.ts
```

Auth already maps known provider messages to safe copy and was not rewritten in Phase 6.

---

## 7. Dashboard Action Error Rules

Dashboard actions should preserve safe validation copy but hide database/provider internals.

Current actions using safe mapping:

```text
server/actions/business-configuration.actions.ts
server/actions/lead-conversion.actions.ts
server/actions/ai-lead-assistant.actions.ts
```

Allowed examples:

```text
Business name is required.
Business slug must contain lowercase letters, numbers, and hyphens.
Invalid lead status.
Lead not found.
AI assistant could not prepare a draft. Please try again.
```

Unsafe examples:

```text
violates foreign key constraint
relation public.ai_outputs does not exist
permission denied for table leads
```

---

## 8. Safe vs Unsafe Examples

| Unsafe | Safe |
|---|---|
| `relation public.leads does not exist` | `We couldn't update this lead. Please try again.` |
| `new row violates row-level security policy` | `We couldn't submit the quote request. Please review the form and try again.` |
| `SUPABASE_SERVICE_ROLE_KEY is required` | `We couldn't create your account. Please try again.` |
| `OpenAI request failed with status 401` | `AI assistant could not prepare a draft. Please try again.` |
| `duplicate key value violates unique constraint` | `We couldn't save the business configuration. Please review the form and try again.` |

---

## 9. Deferred Improvements

- Add structured server logging with stable operation names and error codes.
- Add request ids once a request context helper exists.
- Replace repeated repository `throwIfError(error.message)` helpers with typed internal errors when a broader repository pass is scheduled.
- Add integration tests for public quote invalid submissions and dashboard action failures.
- Add rate limiting for public quote submission in the public intake security phase.
- Decide whether AI storage readiness should remain user-visible or move to a purely internal admin/demo readiness check.

---

## 10. Definition of Done

This standard is satisfied for the current MVP phase when:

- Public and dashboard actions do not pass raw database/provider errors to UI query strings.
- Validation errors remain useful and safe.
- Auth errors remain helpful and non-enumerating.
- No new unsafe logging is introduced.
- Typecheck, lint, unit tests, and build pass.
