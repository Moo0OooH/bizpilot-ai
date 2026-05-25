# Phase 21G OpenAI Real Key Validation

**Project:** BizPilot AI
**Document Type:** OpenAI real-key dry run result
**Status:** Blocked - production OpenAI requests reach provider but return HTTP 429
**Owner:** MoOoH
**Last Updated:** 2026-05-25

---

## 1. Purpose

This document records whether BizPilot's AI lead assistant was validated with a real OpenAI key using synthetic cleaning lead data only.

No real customer data was used. No prompt text, customer payload, API key, token, provider response body, full email, database password, service role key, anon key, or full connection string was printed or recorded. No `.env` file was committed. No production database writes were performed.

## 2. Key Configuration

### 2026-05-25 Production Env Recheck

Owner reported OpenAI credit/quota was updated. Codex checked the Vercel
Production environment through a temporary env pull stored outside the repo.
The temporary file was deleted after inspection, and no secret value was printed.

Result:

```text
OPENAI_API_KEY exists in Production env names but has empty value.
No model-backed request was made from this environment.
```

Interpretation:

- Billing/credit may now be fixed at the OpenAI account level.
- BizPilot production still cannot use OpenAI until a real non-empty
  `OPENAI_API_KEY` is configured in Vercel Production.
- Do not commit or paste the key. Set it through the Vercel environment variable
  UI/CLI secret path, then redeploy or trigger a fresh production build.

### 2026-05-25 Production App Retry After Owner Key Update

Owner configured a production OpenAI key in Vercel and retried the dashboard AI
generation flow with synthetic lead data only.

Result:

```text
OpenAI request reached provider.
Provider returned HTTP 429.
No model output was generated.
OpenAI usage dashboard still showed 0 requests/tokens because the request was rejected.
```

Patch follow-up:

- Added safe structured OpenAI provider logs for request start, request failure,
  response receipt, empty output, invalid JSON, and schema mismatch.
- Provider logs include only safe operational metadata: model name, attempt
  number, status, retry-after, OpenAI request id, safe provider error type/code,
  schema name, and input/instruction character counts.
- Provider logs do not include API keys, authorization headers, prompt text,
  customer payload, output text, provider response body, emails, phones, or
  service-role values.
- Added separate safe fallback labels for `ai_provider_auth_failed`,
  `ai_provider_quota_exceeded`, and `ai_provider_rate_limited`.
- Added a secondary model attempt with `gpt-4.1-mini` only when the first
  model returns a rate-limit style 429. Quota-exceeded 429s do not retry because
  they are account/project-level blockers.

### 2026-05-24 Real-Key Attempt

| Source | OPENAI_API_KEY status |
| --- | --- |
| Local `.env.local` | Not configured / empty |
| Current shell process | Not configured before the dry run |
| Secure env template outside repo | Configured |

The key was loaded into the one-off process from the secure env template outside the repo. The value was not printed.

## 3. Test Method

| Item | Result |
| --- | --- |
| Method | One-off local OpenAI Responses API request |
| Persistence | None |
| Production DB touched | No |
| Real customer data used | No |
| Synthetic scenario | Cleaning quote recovery for a move-out cleaning lead |
| Model requested | `gpt-5.1` |
| Timeout used | 20 seconds |
| Output format | Structured JSON matching BizPilot lead conversion bundle shape |

The one-off request used the same guardrail intent as the app prompt:

- assistant-only,
- no auto-send,
- no booking,
- no negotiation,
- no guaranteed revenue,
- no invented price, availability, discounts, or exact scope,
- owner-editable drafts only.

The full prompt and synthetic payload were not logged.

## 4. Real Provider Result

| Check | Result |
| --- | --- |
| Real OpenAI request attempted | Yes |
| Provider response | HTTP `429` |
| Model-backed summary generated | No |
| Model-backed reply draft generated | No |
| Model-backed follow-up draft generated | No |
| Retried? | Yes after follow-up patch: model-specific rate-limit 429 can retry once with `gpt-4.1-mini`; quota-exceeded 429 does not retry. |

The dry-run command emitted a safe status object showing only:

```text
provider_error / httpStatus 429
```

No provider response body was printed. The request completed quickly, so the timeout path was not triggered in this real-provider attempt.

## 5. Output Quality And Guardrails

Because OpenAI returned HTTP `429`, no model output was available to review.

| Requirement | Status | Notes |
| --- | --- | --- |
| AI summary useful | Not verified | No model output returned. |
| Reply draft useful | Not verified | No model output returned. |
| Follow-up draft useful | Not verified | No model output returned. |
| No invented pricing | Not verified by output | Guardrail was included in request instructions; no output to inspect. |
| No invented availability | Not verified by output | Guardrail was included in request instructions; no output to inspect. |
| No booking promise | Not verified by output | Guardrail was included in request instructions; no output to inspect. |
| No auto-send implication | Not verified by output | Guardrail was included in request instructions; no output to inspect. |
| Owner review remains clear | Not verified by output | Guardrail was included in request instructions; no output to inspect. |

## 6. Timeout, Fallback, And Sanitization

| Safety behavior | Status | Evidence |
| --- | --- | --- |
| Timeout behavior | Implemented, not triggered | `server/providers/ai/openai-provider.ts` uses `AbortSignal.timeout(20_000)`. The real request returned HTTP `429` before timeout. |
| Fallback behavior | Implemented by code inspection; not end-to-end verified with real provider in this run | `server/services/ai/lead-conversion-assistant.service.ts` catches provider failures and records `rule_fallback` output. The one-off dry run did not persist or invoke repository writes. |
| Raw provider errors sanitized | Implemented by code inspection; safe in this dry-run output | `server/services/ai/error-sanitizer.ts` maps provider failures to low-cardinality labels. The dry run printed only HTTP status `429`, not provider body/details. |
| Prompts/customer payloads not logged | Pass for this run | The command did not print prompt text or synthetic payload. The app provider/service path does not call logger/console with prompt text. |

## 7. Issues Found

| Issue | Severity | Owner/action required |
| --- | --- | --- |
| OpenAI returned HTTP `429` | P1 pilot-readiness blocker | Provider now logs a safe subtype: `ai_provider_quota_exceeded` or `ai_provider_rate_limited`. If quota-exceeded persists, owner/operator must resolve OpenAI project billing/quota/model access. If rate-limited, the provider tries `gpt-4.1-mini` once before falling back. |
| Real model output quality remains unverified | P1 pilot-readiness blocker | Re-run after 429 is resolved and review generated summary/reply/follow-up against guardrails. |
| Local `.env.local` still lacks `OPENAI_API_KEY` | P2 local validation blocker | Configure local secret through approved secret-management path if local model-backed QA is required. Do not commit `.env` files. |

## 8. Patches Made

2026-05-25 production follow-up patches:

- `server/providers/ai/openai-provider.ts`
  - reads safe OpenAI error type/code/param and request id for failed responses,
  - logs request start/failure/success parser checkpoints through `safeLogger`,
  - retries once with `gpt-4.1-mini` for model-specific rate-limit failures,
  - preserves fail-closed fallback behavior for quota/auth/payload failures.
- `server/providers/ai/ai-provider.ts`
  - added safe provider failure codes for auth, quota, and rate limit.
- `server/services/ai/error-sanitizer.ts`
  - maps new provider codes to low-cardinality persisted fallback reasons.
- `server/services/ai/lead-conversion-assistant.service.ts`
  - stores the actual model that succeeded if the provider uses the fallback
    model.

No prompts were changed.

No env files were changed.

## 9. Final Status

OpenAI real-key validation result:

```text
Blocked / not passed.
```

Reason:

```text
A real key was available from the secure local template, but the single synthetic OpenAI request returned HTTP 429 and produced no model output.
```

BizPilot remains:

```text
Ready only for founder-controlled synthetic demos.
```

BizPilot is not yet:

```text
Ready for the first real pilot customer with real customer data.
```
