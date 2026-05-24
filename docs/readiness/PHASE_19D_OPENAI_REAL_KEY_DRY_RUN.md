# Phase 19D OpenAI Real-Key Dry Run

**Project:** BizPilot AI  
**Document Type:** Production pilot readiness AI dry-run report  
**Status:** Blocked for real-key model output; fallback usable  
**Owner:** MoOoH  
**Last Updated:** 2026-05-23  
**Environment Checked:** Local repo/runtime env for the intended pilot app configuration

---

## 1. Goal

Verify model-backed AI summary, reply draft, and follow-up draft with a real OpenAI key while preserving the product rule:

> Assistant-only. Owner-reviewed. Manual copy/send only.

## 2. Final Decision

**AI usable only with fallback.**

The real OpenAI model-backed dry run was not executed because `OPENAI_API_KEY` is not configured with a non-empty value in the checked environment. The key name exists in `.env.local`, but the value is empty; process env also did not provide a key.

This is not a model-quality pass. It is a readiness blocker for model-backed pilot demos.

## 3. Environment Confirmation

| Item | Result |
| --- | --- |
| `.env.local` present | Pass |
| `OPENAI_API_KEY` key name present | Pass |
| `OPENAI_API_KEY` has non-empty value | Fail |
| Process env `OPENAI_API_KEY` present | Fail |
| Key printed or committed | No |
| Env file committed | No |

Configured app AI provider/model from code:

| Item | Value |
| --- | --- |
| Provider | OpenAI |
| Endpoint | OpenAI Responses API |
| Prompt registry entry | `lead_conversion_bundle` |
| Prompt version | `2026-05-11.v1` |
| Approved model in code | `gpt-5.1` |
| Output contract | Strict JSON schema for lead summary, reply draft, follow-up draft, next action, missing-info reasoning, and tone variants |

## 4. Safe Test Lead Planned

The planned dry run used only safe synthetic data:

| Field | Test Value |
| --- | --- |
| Vertical | Cleaning |
| Service | Deep cleaning / grand menage |
| Location | Montreal |
| Property | Apartment |
| Present info | property type, two bedrooms, city/service area, pet/elevator note |
| Missing info | bathrooms, preferred date, access details |
| Customer contact | Masked as `[email masked] / [phone masked]` |
| Review requirement | Owner must review and decide before sending |

Because no real key was available, no model output was generated and no OpenAI request was made.

## 5. Output Quality Assessment

| Check | Result | Notes |
| --- | --- | --- |
| Summary is useful | Not run | Requires real model output. |
| Missing info identified | Not run | Requires real model output. |
| Reply draft is clear | Not run | Requires real model output. |
| Follow-up draft is practical | Not run | Requires real model output. |
| Professional tone | Not run | Requires real model output. |
| French behavior | Not run | Planned `fr-CA` model dry run was blocked by missing key. |
| No invented pricing | Not run | Requires real model output. |
| No invented availability | Not run | Requires real model output. |
| No booking promise | Not run | Requires real model output. |
| No auto-send | Pass by design | Prompt, dashboard, and action flow are manual-send only. |
| Tells owner what to review | Not run | Requires real model output. |

## 6. Fallback Behavior Assessment

| Scenario | Result | Notes |
| --- | --- | --- |
| Missing key | Usable with rule fallback | `getDefaultAiProvider()` returns `null`; `generateLeadAiBundle()` catches the missing provider and returns/stores a `rule_fallback` bundle when lead storage is ready. |
| API/network error | Usable with rule fallback by design | OpenAI provider throws a provider error; assistant service catches it and persists a fallback bundle. |
| Malformed/empty provider response | Usable with rule fallback by design | Empty output, invalid JSON, or schema mismatch become provider errors and then fallback output. |
| Timeout | Patched | Added an explicit 20-second OpenAI request timeout so dashboard generation does not wait indefinitely on a hung provider call. |
| Dashboard remains usable | Partial pass | The UI already labels fallback output honestly and does not auto-send. Full production dashboard proof is still blocked by Phase 19C production schema drift and missing real key. |

## 7. Safety And Logging Assessment

| Check | Result | Evidence |
| --- | --- | --- |
| Raw OpenAI errors exposed to users | Pass | AI action maps failures to safe dashboard messages. |
| Raw OpenAI errors persisted | Pass | `sanitizeAiFailureReason()` writes stable labels only. |
| Missing-key fallback reason sanitized | Pass after patch | Missing provider now maps to `ai_provider_not_configured` instead of generic unknown. |
| Raw prompt logged | Pass | Source search found no prompt logging; storage uses `input_hash`, prompt name/version, token estimates, and generated/fallback output only. |
| Full customer contact in prompt | Pass by design | `maskAiPromptValue()` masks emails and phone numbers before prompt context assembly. |
| Full customer payload in usage metadata | Pass | Usage metadata stores only prompt version for success and sanitized reason for fallback. |
| Provider raw response stored unsafely | Pass | The service stores validated structured output, not the raw provider response envelope. |
| Auto-send risk | Pass | No send action exists in MVP; dashboard copy remains owner-reviewed/manual copy-send. |

## 8. Patches Made

Code patches:

- `server/providers/ai/openai-provider.ts`
  - Added explicit 20-second timeout to the OpenAI Responses API call.
- `server/services/ai/error-sanitizer.ts`
  - Mapped missing-provider fallback to `ai_provider_not_configured`.

Documentation patches:

- Added this report: `docs/readiness/PHASE_19D_OPENAI_REAL_KEY_DRY_RUN.md`.
- Updated the pilot readiness checklist to keep model-backed AI marked blocked until a non-empty key is configured.

No key, env file, prompt payload, customer data, or OpenAI response body was committed.

## 9. Validation

| Command / Check | Result |
| --- | --- |
| `pnpm lint` | Pass |
| `pnpm test:unit` | Pass, 19/19 |
| `pnpm typecheck` | Pass |
| `git diff --check` | Pass, with Windows CRLF warnings only |

## 10. Blockers

1. Configure a real, non-empty `OPENAI_API_KEY` in the intended pilot environment.
2. Re-run this dry run against the actual model-backed path.
3. Re-run `fr-CA` model output checks after the key is present.
4. Complete Phase 19C production schema alignment so dashboard-backed AI generation can be smoked end-to-end on the production app.

## 11. Rerun Criteria

Phase 19D can be upgraded from fallback-only to AI-ready when:

- the real key is present and not printed,
- OpenAI returns schema-valid output for both English and Canadian French test leads,
- output asks for missing details without inventing price, availability, or booking,
- fallback still works for simulated request failure and malformed response,
- dashboard stores only validated output plus safe metadata,
- owner can copy drafts manually and no send automation exists.
