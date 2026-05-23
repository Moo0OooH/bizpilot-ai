# BizPilot AI Safe Logging Baseline v1.0

**Status:** Active MVP foundation standard
**Created:** 2026-05-13
**Scope:** Server-side logging, operational diagnostics, and future audit event boundaries

---

## Purpose

BizPilot AI needs useful operational logs without exposing private business, customer, authentication, provider, or AI data. This baseline keeps logging lightweight for the MVP while preserving a clear path to future audit events.

This phase does not add an external logging provider, database audit table, analytics system, or new product behavior.

---

## Current Audit Summary

Runtime application code should use `safeLogger` for server-side operational diagnostics. Direct `console.log`, `console.info`, `console.warn`, or `console.error` calls should not appear in app, component, library, action, service, or repository paths outside the logger implementation.

CLI scripts and test runners may use console output for command-line progress and test results, provided they still avoid secrets and raw private payloads.

Existing event-like persistence is limited to current product behavior:

- `lead_events` for lead workflow history.
- `usage_events` for AI usage/cost tracking.

No unsafe raw payload logging was found in the audited paths.

---

## Safe Logging Principles

- Log important server-side operations only when the log helps debug a failure or security-sensitive workflow.
- Prefer stable operation names, internal error codes, identifiers, counts, statuses, and boolean flags.
- Keep logs structured and single-line to reduce log injection risk.
- Avoid logging raw objects by default.
- Avoid deeply nested metadata.
- Do not log data simply because it is available.
- Never route logs to user-facing output.

---

## Forbidden Log Content

Do not log:

- Passwords.
- Auth tokens, JWTs, cookies, session values, or authorization headers.
- API keys, service-role keys, webhook secrets, or provider secrets.
- Raw public quote form payloads.
- Raw customer message bodies or quote descriptions.
- Full private lead or customer notes.
- Raw AI prompts.
- Raw AI model outputs.
- Full request bodies.
- Full provider or database error objects when they may include sensitive internals.

Avoid logging customer email or phone unless a future policy explicitly allows it. Prefer IDs and statuses.

---

## Allowed Safe Metadata Examples

Safe logs may include:

- `operation`
- `code`
- `businessId`
- `leadId`
- `submissionId`
- `userId`
- `domain` for email-domain-only auth diagnostics, never a full email address
- `status`
- `count`
- `isPublic`
- `promptVersion`
- `modelName` when already safe and relevant

Use only metadata needed for debugging the operation.

---

## Logging Utility

Server-only code may use:

```ts
import { safeLogger } from "@/server/logging/safe-logger";
```

The logger:

- Is server-only.
- Accepts an operation name.
- Supports `info`, `warn`, and `error`.
- Accepts shallow metadata.
- Redacts sensitive metadata keys.
- Replaces unsupported nested values.
- Emits single-line structured logs.

It should be used sparingly and only in server-side actions, services, repositories, policies, or provider integrations.

---

## Action, Service, And Repository Rules

Actions may log important failure boundaries with safe metadata only. User-facing messages must still come from the safe error handling standard.

Services may log important workflow failures when the log helps diagnose operational issues.

Repositories should avoid logging raw database errors directly. Repository typed-error architecture is deferred to the repository boundary pass.

Safe example:

```ts
safeLogger.error("public_intake.submit.failed", {
  businessId,
  code: "PUBLIC_INTAKE_ERROR",
});
```

Unsafe example:

```ts
console.error("Submission failed", formData, error);
```

---

## Public Quote Logging Rules

For `/quote/[slug]` and public intake submission:

- Do not log full form payloads.
- Do not log customer message bodies.
- Do not log quote descriptions.
- Avoid logging email or phone.
- Prefer `businessId`, `submissionId`, `status`, and safe error codes.
- Missing or inactive quote links should be logged only if needed for abuse investigation, and without raw request payloads.

---

## Auth Logging Rules

For sign-up, sign-in, sign-out, and tenant bootstrap:

- Do not log passwords.
- Do not log auth tokens.
- Do not log cookies.
- Do not log raw provider errors to user-facing surfaces.
- If tenant bootstrap fails, log only operation name, safe error code, and safe identifiers already available server-side.

---

## AI Logging Rules

For AI assistant flows:

- Do not log prompt text.
- Do not log raw model output.
- Do not log customer private message content.
- Do not log raw provider errors if they may include prompt or request data.
- Safe metadata may include operation name, prompt version, model name, success/failure status, safe error code, and token/cost metadata if already safe.

---

## Relationship With Future Audit Events

This logging baseline is not a replacement for durable audit events. Future audit event work may add a persisted audit model for security-sensitive business operations, but that should be designed separately with RLS, retention, tenant isolation, and privacy rules.

Current MVP logging should remain minimal and operational.

---

## Deferred Improvements

- Add repository typed errors so database failures can be logged with stable codes instead of raw provider details.
- Review AI usage event metadata for stricter privacy guarantees.
- Define durable audit event persistence only after RLS audit and tests are complete.
- Add production log retention and access rules before paid launch.
- Add rate-limit and abuse investigation logging after public intake hardening.
