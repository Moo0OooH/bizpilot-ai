# Phase 20G OpenAI Real Key Dry Run

**Project:** BizPilot AI
**Document Type:** OpenAI real-key dry run report
**Status:** Blocked - `OPENAI_API_KEY` not configured
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Purpose

Phase 20G verifies that BizPilot can generate useful AI summary, reply, and follow-up drafts with a real OpenAI key using only a synthetic cleaning lead.

The real-provider dry run was **not run** because no OpenAI key is configured in this environment. No key was printed. No `.env` file was changed or committed. No OpenAI network request was made.

## 2. Key Configuration

| Source checked | Result |
| --- | --- |
| `.env.local` | `OPENAI_API_KEY` exists but is empty |
| process environment | `OPENAI_API_KEY` not set |

Final key status: **not configured**.

Owner action required: add a real OpenAI key through the approved local/staging/hosting secret path, then re-run Phase 20G. Do not paste the key into docs, chat, git, shell output, or committed files.

## 3. Environment

| Item | Result |
| --- | --- |
| Repo path | `E:\bizpilot-ai` |
| Git branch | `main` |
| OpenAI provider dry run | Not run |
| Production database | Not used |
| Production app | Not used |
| Real customer data | Not used |
| `.env` files changed | No |
| Secrets printed | No |

## 4. Planned Synthetic Test Scenario

This scenario should be used when a key is available:

| Field | Synthetic value |
| --- | --- |
| Business | Synthetic fr-CA or en-CA cleaning business |
| Lead source | Public quote link |
| Service type | Move-out cleaning |
| Property | Two-bedroom apartment |
| Area | Montreal / Laval service area |
| Timing | Requested for next week, exact preferred time missing |
| Missing details | Square footage, parking/access details, preferred time window |
| Contact data | Synthetic only; no real customer data |

Expected assistant outputs:

- useful lead summary,
- useful reply draft,
- useful follow-up draft,
- suggested next action focused on missing details,
- no invented pricing,
- no invented availability,
- no booking promise,
- no auto-send implication,
- clear owner-review / manual-copy workflow.

## 5. Output Quality

| Check | Status | Notes |
| --- | --- | --- |
| AI summary useful | Not run | Blocked by missing key. |
| Reply draft useful | Not run | Blocked by missing key. |
| Follow-up draft useful | Not run | Blocked by missing key. |
| No invented pricing | Not run | Prompt guardrail exists, but real output was not verified. |
| No invented availability | Not run | Prompt guardrail exists, but real output was not verified. |
| No promise of booking | Not run | Prompt guardrail exists, but real output was not verified. |
| No auto-send implication | Not run | Prompt guardrail exists, but real output was not verified. |
| Owner review remains clear | Not run | Dashboard copy and prompt guardrails support this, but real output was not verified. |

Do not mark this gate as passed until a real OpenAI response is reviewed.

## 6. Safety And Logging Check

Code inspection found these relevant controls:

| Control | Evidence | Status |
| --- | --- | --- |
| Real key required for OpenAI provider | `getDefaultAiProvider()` only creates OpenAI provider when `OPENAI_API_KEY` is non-empty. | Implemented |
| Missing key falls back instead of crashing user flow | `generateLeadAiBundle()` catches missing provider and persists a rule fallback with sanitized reason. | Implemented, not re-run with synthetic DB fixture in this phase |
| Timeout behavior | OpenAI fetch uses `AbortSignal.timeout(20_000)`. | Implemented, not real-provider verified |
| Raw provider errors sanitized | `sanitizeAiFailureReason()` maps provider failures to safe labels such as `ai_provider_request_failed`. | Implemented |
| Prompt guardrails | Prompt instructions say assistant-only, never auto-send/book/negotiate/guarantee revenue, and do not invent price, availability, discounts, or exact service scope. | Implemented |
| Prompt privacy filtering | Prompt context masks emails and phone numbers and does not include direct customer contact fields. | Implemented |
| Prompt/customer payload logging | AI provider/service path does not call `console` or `safeLogger`; persisted metadata stores hashes, token counts, prompt version, and sanitized failure reason rather than raw prompt text. | Implemented by inspection |
| Safe logging baseline | `safeLogger` redacts sensitive keys including prompt, payload, message, email, phone, token, secret, and service role. | Implemented |

Important limitation: implementation checks are not a substitute for a real OpenAI dry run. Output quality and model behavior remain unverified until the key is configured.

## 7. Patches Made

Documentation only:

- created `docs/readiness/PHASE_20G_OPENAI_REAL_KEY_DRY_RUN.md`.

No application code, migration, RLS policy, UI, `.env` file, production setting, or secret was changed.

## 8. Final Status

| Gate | Status |
| --- | --- |
| `OPENAI_API_KEY` configured | No |
| Real OpenAI dry run | Blocked / not run |
| Synthetic lead used | No |
| AI output quality verified | No |
| Timeout behavior real-provider verified | No |
| Fallback behavior real-provider verified | No |
| Raw provider error sanitization real-provider verified | No |
| Prompt/customer payload logging reviewed | Pass by code inspection |
| Production changed | No |

Final decision: **Phase 20G is blocked until the owner configures a real OpenAI key through the approved secret-management path. Do not claim AI real-provider readiness until a synthetic cleaning lead dry run produces reviewed summary, reply, and follow-up outputs.**
