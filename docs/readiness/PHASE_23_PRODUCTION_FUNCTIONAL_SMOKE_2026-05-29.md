# Phase 23 - Production Functional Smoke

**Project:** BizPilot AI  
**Date:** 2026-05-29  
**Status:** Phase 23B, 23C, 23D, and 23E passed; Phase 23E fallback/error handling and final OpenAI provider proof both passed on the approved synthetic `MrTester` lead.  
**Scope:** Design-frozen functional readiness: auth redirects, production deployment, founder admin read-only smoke, controlled synthetic tenant mutation smoke, synthetic owner dashboard runtime proof, and targeted synthetic AI provider proof.

## Guardrails

- Design work is frozen.
- No homepage redesign, dashboard redesign, admin visual polish, preview docs, or theme work was continued.
- No raw production SQL was run.
- No migrations were run.
- No real customer, business, or user data was mutated.
- No auth users were deleted.
- No workspace repair or hard purge was run.
- Secrets, cookies, passwords, service-role keys, and tokens are not recorded here.

## Phase 23B - Functional Production Smoke

Phase 23B passed after the safe functional/auth commits were pushed to `main`.

### Confirmed

- `main` was synced with `origin/main`.
- Working tree was clean before production smoke.
- Vercel production deployment for commit `cfed5f4` completed successfully.
- Public production smoke passed 9/9.
- Protected redirect behavior passed:
  - Logged-out `/dashboard/leads` redirects to `/auth/sign-in?next=%2Fdashboard%2Fleads`.
  - Sign-in preserves the intended internal redirect.
- Authenticated read-only `/dashboard` passed.
- Authenticated read-only `/dashboard/leads` passed.
- Authenticated read-only `/admin?adminPanel=users` passed.
- No destructive or mutating admin action was tested in Phase 23B.

### Relevant Commits

- `93941df` - `style(admin): relax founder admin frame height locking`
- `6e4511f` - `style(admin): align founder admin light theme tokens`
- `cfed5f4` - `fix(auth): honor protected-route next redirect on sign in`

## Phase 23C - Controlled Synthetic Tenant Mutation Smoke

Phase 23C passed against the owner-approved synthetic tenant `MrTester` only.

### Approved Target

| Field | Value |
| --- | --- |
| Business name | `MrTester` |
| Business id | `131561a7-9b5b-4ff9-a7fe-403d5c46462b` |
| Public quote slug | `mrtester` |
| Public quote path | `/quote/mrtester` |

`BizPilot Synthetic Cleaning QA MailTM` and all real customer/business/user data
were explicitly out of scope and were not mutated.

### Pre-Test Snapshot

| Field | Value |
| --- | --- |
| `workspace_kind` | `production_customer` |
| `status` | `active` |
| `lifecycle_status` | `active` |
| `plan_slug` | `founder_pilot` |
| Quote link | `/quote/mrtester`, active |
| Lead count | `0` |
| Latest visible admin activity | `business_reactivated` |

### Actions Performed

- Reclassified only `MrTester` from `production_customer` to `founder_test`.
- Submitted exactly one synthetic quote request through `/quote/mrtester`.
- Verified the public quote success flow:
  - Submit returned `303`.
  - `/quote/mrtester/success` returned `200`.
- Verified the lead count for `MrTester` increased from `0` to `1`.
- Verified the fake lead was scoped to `MrTester`.
- Disabled the quote link only for `MrTester`.
- Verified `/quote/mrtester` no longer behaved as an active quote intake page while disabled.
- Re-enabled the quote link only for `MrTester`.
- Verified `/quote/mrtester` returned to active intake behavior.

### Synthetic Lead

| Field | Value |
| --- | --- |
| Lead id | `3f46045b-47d1-4d92-b99d-0bdfe6eab10e` |
| Customer name | `BizPilot QA Test Lead` |
| Status | `new` |
| Source channel | `phase23c_qa` |
| Service type | `deep` |
| City / area | `Montreal QA` |
| Created at | `2026-05-29T13:10:09.369924+00:00` |

The contact details used were clearly synthetic QA contact details, not real
customer data.

### Admin Activity Evidence

Recent admin action log entries for `MrTester` recorded:

- `status_changed`: `workspace_kind` changed from `production_customer` to `founder_test`.
- `quote_link_disabled`: public quote link changed from active to inactive.
- `quote_link_enabled`: public quote link changed from inactive to active.

### Final State

| Field | Value |
| --- | --- |
| Business name | `MrTester` |
| `workspace_kind` | `founder_test` |
| `status` | `active` |
| `lifecycle_status` | `active` |
| `plan_slug` | `founder_pilot` |
| Quote link | `/quote/mrtester`, active |
| Lead count | `1` |
| Latest lead | `BizPilot QA Test Lead` |

`MrTester` is now a reusable synthetic `founder_test` smoke tenant.

## Phase 23D - Synthetic Owner Dashboard Runtime Proof

Phase 23D passed against the existing synthetic `MrTester` owner only.

### Owner-Approved Access Method

The owner approved changing/resetting the password only for the existing
synthetic owner account of `MrTester` if needed.

Execution used:

- Supabase Auth Admin temporary password update for the existing `MrTester`
  synthetic owner account.
- Normal app password authentication for that same owner account.
- SSR auth cookies generated from the normal Supabase auth session for
  read-only production route requests.

The temporary password, auth cookies, access tokens, refresh tokens, service-role
keys, and API keys were not printed or recorded.

No new auth user, owner, member, business, lead, workspace repair, migration,
raw SQL, delete, purge, or real-customer mutation was performed.

### Pre-Access Safety Check

Confirmed before changing auth access:

| Field | Value |
| --- | --- |
| Target business | `MrTester` |
| Business id | `131561a7-9b5b-4ff9-a7fe-403d5c46462b` |
| Owner auth account | Existing confirmed email-provider account |
| Owner membership | Exactly one active owner membership, scoped to `MrTester` |
| Other tenant modification | None |
| Quote link | `/quote/mrtester`, active |
| Lead count | `1` |
| Latest lead | `BizPilot QA Test Lead` |

Production deployment health was rechecked with:

```text
pnpm smoke:public -- --base-url=https://bizpilo.com --timeout-ms=20000
```

Result: public production smoke passed 9/9.

### Runtime Results

Authenticated as the `MrTester` owner through normal app auth:

| Check | Result |
| --- | --- |
| `/dashboard` | `200` |
| `/dashboard/leads` | `200` |
| Dashboard tenant resolution | `MrTester` rendered |
| Leads page tenant resolution | `MrTester` rendered |
| Fake QA lead visibility | `BizPilot QA Test Lead` rendered |
| Fake QA lead status/source | `new`, `phase23c_qa` visible through authenticated read |
| False empty dashboard state | Not observed |
| Cross-tenant data | Not observed |
| Raw internal errors / sensitive markers | Not observed |

Authenticated RLS reads with the `MrTester` owner session showed exactly one
visible business and exactly one visible lead, both scoped to
`131561a7-9b5b-4ff9-a7fe-403d5c46462b`.

Post-check state remained:

| Field | Value |
| --- | --- |
| Business name | `MrTester` |
| `workspace_kind` | `founder_test` |
| `status` | `active` |
| `lifecycle_status` | `active` |
| `plan_slug` | `founder_pilot` |
| Quote link | `/quote/mrtester`, active |

### Phase 23E AI Proof Precheck

AI provider proof was inspected but not run in Phase 23D.

Safe Phase 23E path:

- Sign in as the same synthetic `MrTester` owner.
- Open the `BizPilot QA Test Lead` lead detail page from `/dashboard/leads`.
- Use the existing **Generate AI draft** action on that one lead only, or invoke
  the equivalent `generateLeadAiBundleAction` path with that lead id.

Expected impact:

- One OpenAI Responses API request using the approved `lead_conversion_bundle`
  prompt, primary model `gpt-5.1`, `max_output_tokens` default `900`.
- The provider may retry `gpt-4.1-mini` only for rate-limit classification.
- Cost should be limited to one small lead-conversion bundle request.
- The action mutates only synthetic AI evidence tables for that lead:
  `ai_outputs`, `usage_events`, and `lead_events`.
- It does not send messages, book jobs, change lead status, alter membership, or
  mutate real customer data.

Safe fallback verification:

- If OpenAI is unavailable, quota-limited, auth-failed, returns invalid output,
  or times out, the service writes a `rule_fallback` AI output with sanitized
  error reason and a zero estimated cost.
- Verify the lead detail page shows either `Model draft` for `openai` or
  `Rule fallback` with the owner-review badge.
- Verify no API key, raw provider payload, request body, stack trace, or
  sensitive marker appears in page output or persisted owner-visible text.

## Phase 23E - Targeted AI Provider Proof

Phase 23E was run against the existing synthetic `MrTester` lead only.

Provider proof did not pass because the OpenAI/provider path returned output
that failed schema validation. The application handled the provider failure
safely by persisting a rule-based fallback bundle with sanitized reason
`ai_provider_invalid_schema`.

### Preflight Completed

Confirmed:

- Git remained `main...origin/main` with docs-only untracked evidence files.
- Production public smoke passed 9/9:

```text
pnpm smoke:public -- --base-url=https://bizpilo.com --timeout-ms=20000
```

- Vercel production env listing showed `OPENAI_API_KEY` configured for
  Production without exposing the encrypted value.
- Target business and lead were confirmed before AI:

| Field | Value |
| --- | --- |
| Business | `MrTester` |
| Business id | `131561a7-9b5b-4ff9-a7fe-403d5c46462b` |
| Lead | `BizPilot QA Test Lead` |
| Lead id | `3f46045b-47d1-4d92-b99d-0bdfe6eab10e` |
| Lead source | `phase23c_qa` |
| Current lead status | `reviewed` |
| Current `response_status` | `viewed` |
| Current `response_sla_state` | `viewed` |
| Pre-AI `ai_outputs` for lead | `0` |
| Pre-AI `usage_events` for lead | `0` |
| Latest pre-AI lead event | `lead_viewed` |
| Current commit | `cfed5f4` |

The lead detail view-state mutation from the earlier Phase 23E setup was
accepted by owner decision as expected owner-dashboard behavior:

- `status`: `new` -> `reviewed`
- `response_status`: `viewed`
- `response_sla_state`: `viewed`
- `first_viewed_at` set
- `last_owner_action_at` set
- `lead_events`: `lead_viewed`

### Safe AI Path Identified

Existing production UI path:

1. Sign in as the existing synthetic `MrTester` owner.
2. Open `/dashboard/leads/3f46045b-47d1-4d92-b99d-0bdfe6eab10e`.
3. Click the lead detail action labeled `Générer un brouillon IA`
   (`Generate AI draft`) which invokes `generateLeadAiBundleAction`.

Expected mutation surface for a successful AI generation remains limited to the
approved synthetic lead:

- `ai_outputs`
- `usage_events`
- `lead_events`

Expected provider/model path:

- Provider factory: `getDefaultAiProvider()`
- Provider: OpenAI when `OPENAI_API_KEY` is present in server runtime
- Primary model: `gpt-5.1`
- Rate-limit retry model: `gpt-4.1-mini`
- Prompt: `lead_conversion_bundle`
- Fallback: rule-based bundle persisted as `rule_fallback` with sanitized reason
  and zero estimated cost.

### AI Attempt

Owner approved continuing on the same viewed/reviewed synthetic lead.

Exactly one AI draft generation attempt was triggered through the normal
production UI path:

```text
/auth/sign-in?redirectTo=/dashboard/leads/3f46045b-47d1-4d92-b99d-0bdfe6eab10e
-> /dashboard/leads/3f46045b-47d1-4d92-b99d-0bdfe6eab10e
-> click Generate AI draft / Generer un brouillon IA
```

No batch generation, retry, raw SQL, migration, delete, purge, workspace repair,
real customer data access, other-tenant access, or design/stash work was done.

### AI Result

| Check | Result |
| --- | --- |
| Attempt count | `1` |
| Result type | Safe rule-based fallback |
| Provider proof | Did not pass |
| Persisted provider | `rule_fallback` |
| Persisted status | `fallback` |
| Persisted model | `rule-fallback-v1` |
| Sanitized reason | `ai_provider_invalid_schema` |
| Estimated cost | `0` |
| Input tokens | `307` |
| Output tokens | `258` |
| `ai_outputs` count after attempt | `1` |
| `usage_events` count after attempt | `1` |
| AI `lead_events` entry | `AI fallback draft prepared` |

Persisted evidence:

| Table | Evidence |
| --- | --- |
| `ai_outputs` | `61192c9d-22da-4eed-af55-70524dcba28e` |
| `usage_events` | `9301bef4-bbe6-4b17-a6c0-368c72ac2e12` |
| `lead_events` | `a5feee83-f362-422e-84cb-fa26a2f92242` |

The fallback record was scoped to:

- business id `131561a7-9b5b-4ff9-a7fe-403d5c46462b`
- lead id `3f46045b-47d1-4d92-b99d-0bdfe6eab10e`

### Output Safety Review

The fallback output included the expected bundle fields:

- `leadSummary`
- `replyDraft`
- `followUpDraft`
- `suggestedNextAction`
- `missingInfoReasoning`
- `leadQualityExplanation`
- `toneVariants`

Safety review passed for the persisted fallback output:

- No invented pricing observed.
- No invented availability observed.
- No booking confirmation observed.
- No guarantees observed.
- Manual-send / owner-review orientation was present.
- Missing-info reasoning was present.
- No API key, provider secret, service-role marker, stack trace, raw provider
  payload, or sensitive internal marker appeared in page output or persisted
  owner-visible output.

### Phase 23E Status

Phase 23E fallback/error-handling safety passed, but targeted AI provider proof
remains not passed because the provider result fell back with sanitized
`ai_provider_invalid_schema`.

Do not retry provider generation on this lead without a new owner decision.

## Phase 23E-1 - AI Provider Schema Diagnosis And Local Fix

Phase 23E-1 diagnosed the provider failure without rerunning production AI.

### Diagnosis

Source inspection covered:

- `server/providers/ai/openai-provider.ts`
- `server/providers/ai/openai-response-parser.ts`
- `server/providers/ai/ai-provider.ts`
- `server/services/ai/lead-conversion-assistant.service.ts`
- `server/services/ai/error-sanitizer.ts`
- `server/services/ai/prompt-registry.ts`
- `server/actions/ai-lead-assistant.actions.ts`
- `server/repositories/ai.repository.ts`
- relevant unit tests under `tests/unit`

Official OpenAI documentation was checked for the selected Responses API
structured-output path. The current request shape is the expected Responses API
style:

```text
text: {
  format: {
    type: "json_schema",
    name,
    schema,
    strict: true
  }
}
```

The existing lead-conversion schema already had all object fields marked
required and used `additionalProperties: false` on both the root object and the
nested `toneVariants` object.

Vercel production logs for the Phase 23E request showed the exact failure
sequence:

1. `ai.openai.request_started`
2. `ai.openai.response_received`
3. `ai.openai.invalid_json`

Therefore:

- OpenAI did not reject the request schema before generation.
- Local code did not reject the schema before sending.
- The provider returned a response with output text present.
- The first failing point was local JSON parsing of the provider output text.
- The persisted `ai_provider_invalid_schema` reason came from the provider layer
  mapping invalid JSON / schema mismatch into the same sanitized safe code.

No API key, raw provider payload, prompt text, or provider secret was printed or
recorded.

### Smallest Safe Fix

Code was changed only in the AI provider/schema layer.

Added:

- `server/providers/ai/openai-structured-output.ts`

Updated:

- `server/providers/ai/openai-provider.ts`

The fix:

- extracts the Responses API structured-output payload builder into a small
  testable helper;
- keeps the official `text.format.type = "json_schema"` request shape;
- keeps `strict: true`;
- preserves the existing schema object;
- adds tolerant JSON extraction for provider text that contains a valid balanced
  JSON object inside a code fence or prefixed text;
- still requires the parsed object to pass the existing bundle validator before
  it can be persisted as an OpenAI-generated output;
- keeps fallback behavior and sanitized error handling intact.

This does not loosen prompts, does not permit auto-send behavior, and does not
allow invented pricing, availability, booking confirmations, or guarantees.

### Tests Added

Added:

- `tests/unit/openai-structured-output.test.mts`
- `tests/unit/ai-fallback-source.test.mts`

Coverage added:

- Responses API structured-output payload shape.
- Strict schema requirements for required fields and
  `additionalProperties: false`.
- Parser accepts direct structured JSON.
- Parser extracts valid balanced JSON from fenced/prefixed provider text.
- Parser still rejects text with no JSON object.
- Fallback path still persists sanitized `rule_fallback` evidence on
  provider/schema errors.

### Verification

All local verification passed:

```text
pnpm test:unit
pnpm typecheck
pnpm lint
pnpm build
```

Phase 23E-1 local/schema proof passed.

No production AI retry was run in Phase 23E-1. A new owner decision is still
required before one targeted production retry on the existing `MrTester`
synthetic lead.

## Phase 23E-2 - Parser Fix Deploy And One Production Retry

The AI provider parser fix was committed and pushed code/test-only.

### Code Commit

Commit:

```text
84f35e9 fix(ai): tolerate fenced structured output responses
```

Included only:

- `server/providers/ai/openai-provider.ts`
- `server/providers/ai/openai-structured-output.ts`
- `tests/unit/openai-structured-output.test.mts`
- `tests/unit/ai-fallback-source.test.mts`

Readiness docs were not included in the code-fix commit.

### Final Local Verification Before Commit

Passed before commit:

```text
git diff --check
pnpm test:unit
pnpm typecheck
pnpm lint
pnpm build
```

### Deployment

`main` was pushed to GitHub:

```text
cfed5f4..84f35e9 main -> main
```

Vercel production deployment was observed as `Ready` with `bizpilo.com` aliased
to the new production deployment created after the push.

Production public smoke passed after deploy:

```text
pnpm smoke:public -- --base-url=https://bizpilo.com --timeout-ms=20000
```

Result: 9/9 passed.

### One Production Retry

Owner approved one targeted retry on the existing synthetic `MrTester` lead:

| Field | Value |
| --- | --- |
| Business | `MrTester` |
| Business id | `131561a7-9b5b-4ff9-a7fe-403d5c46462b` |
| Lead | `BizPilot QA Test Lead` |
| Lead id | `3f46045b-47d1-4d92-b99d-0bdfe6eab10e` |

Exactly one production AI retry was triggered through the normal owner UI action
on the lead detail page.

Pre-retry state:

| Evidence | Value |
| --- | --- |
| `ai_outputs` count | `1` |
| Latest `ai_outputs` provider/status | `rule_fallback` / `fallback` |
| Latest `ai_outputs` reason | `ai_provider_invalid_schema` |
| `usage_events` count | `1` |
| `lead_events` count | `4` |

Post-retry result:

| Check | Result |
| --- | --- |
| Attempt count | `1` |
| Provider success | No |
| Result type | Safe rule-based fallback |
| Persisted provider/status | `rule_fallback` / `fallback` |
| Sanitized reason | `ai_provider_invalid_schema` |
| `ai_outputs` count | `1` |
| `usage_events` count | `2` |
| `lead_events` count | `5` |
| New usage event | `c1438717-d8c1-4879-abb2-6ce881b769f6` |
| New lead event | `a1987148-6ae7-4259-b49f-29fd88eb6edc` |

The existing `ai_outputs` row remained:

```text
61192c9d-22da-4eed-af55-70524dcba28e
```

The retry inserted a new `usage_events` fallback record and a new
`lead_events` timeline entry, both scoped to the same synthetic business and
lead.

Production logs for the retry again showed:

1. `ai.openai.request_started`
2. `ai.openai.response_received`
3. `ai.openai.invalid_json`

This means the provider still returned output text that the parser could not
turn into valid JSON after the deployed fenced/prefixed-object parser fix.

### Retry Safety Review

Fallback output safety passed:

- No invented pricing observed.
- No invented availability observed.
- No booking confirmation observed.
- No guarantees observed.
- Manual-send / owner-review orientation was present.
- No API key, provider secret, service-role marker, stack trace, raw provider
  payload, or sensitive internal marker appeared in page output or persisted
  owner-visible output.

No real customer, business, lead, or other tenant was touched. `BizPilot
Synthetic Cleaning QA MailTM` was not touched.

### Phase 23E-2 Status

Phase 23E remains not passed. Fallback safety continues to pass, but OpenAI
provider proof still fails with sanitized `ai_provider_invalid_schema` and
production log operation `ai.openai.invalid_json`.

Recommended next technical step before any further production AI attempt:

- improve provider diagnostics in a non-secret way, for example log a safe
  output-shape classification such as first/last character class, output length,
  and whether a balanced JSON object was found, without logging the text itself;
  or run a local non-production provider probe with an owner-provided local API
  key and synthetic-only prompt.

## Remaining Pilot-Readiness Blockers At Phase 23E-2

- Phase 23E targeted AI provider proof remains pending: the post-fix production
  retry on the `MrTester` fake lead still produced safe `rule_fallback` with
  sanitized reason `ai_provider_invalid_schema`; fallback/error handling passed
  but OpenAI provider proof did not.
- Backup/export/restore readiness remains required before real customer purge or high-risk production data operations.
- SMTP/custom-domain email posture and password-reset smoke remain readiness gates if owner-facing email flows are used.
- OpenAI quota/provider fallback posture should remain monitored for model-backed draft behavior.

## Phase 23E-4 - Diagnostic Production Retry

Owner approved exactly one diagnostic production retry after deployment of:

```text
e3a94e2 chore(ai): add safe OpenAI response diagnostics
```

Target:

| Field | Value |
| --- | --- |
| Business | `MrTester` |
| Business id | `131561a7-9b5b-4ff9-a7fe-403d5c46462b` |
| Lead | `BizPilot QA Test Lead` |
| Lead id | `3f46045b-47d1-4d92-b99d-0bdfe6eab10e` |

Pre-retry snapshot:

| Field | Value |
| --- | --- |
| Deployed commit | `e3a94e2` |
| Production deployment | Ready; `bizpilo.com` aliased |
| Lead status | `reviewed` |
| `response_status` | `viewed` |
| `response_sla_state` | `viewed` |
| `ai_outputs` count | `1` |
| `usage_events` count | `2` |
| `lead_events` count | `5` |
| Latest AI output | `rule_fallback`, `fallback`, `ai_provider_invalid_schema` |

Exactly one retry was run through the normal production owner UI action on the
approved lead only.

Post-retry result:

| Check | Result |
| --- | --- |
| Attempt count | `1` |
| Provider success | No |
| Result type | Safe fallback |
| Sanitized reason | `ai_provider_invalid_schema` |
| `ai_outputs` count | `1` |
| `usage_events` count | `3` |
| `lead_events` count | `6` |
| New usage event | `312f46d0-40fa-4596-9744-72522a48d5d5` |
| New lead event | `f1400058-ae51-439a-b12b-e1e5836fa155` |

Diagnostic request fields:

| Field | Value |
| --- | --- |
| Model | `gpt-5.1` |
| Responses API flag | `true` |
| Format type | `json_schema` |
| Schema name | `lead_conversion_bundle_v1` |
| Strict | `true` |

Diagnostic response fields:

| Field | Value |
| --- | --- |
| Response status | `incomplete` |
| Error type/code | `null` / `null` |
| Incomplete reason | `max_output_tokens` |
| Output item count | `1` |
| Output item types | `message` |
| Content part count | `1` |
| Content part types | `output_text` |
| Direct `output_text` helper present | `false` |
| Direct `output_text` length | `0` |
| Parsed-helper present | `false` |
| Extracted candidate length | `3564` |
| First character class | `object_start` |
| Balanced JSON object found | `false` |
| Parse failure class | `no_balanced_json_object` |

Interpretation:

- The production request is using the intended Responses API structured-output
  path.
- OpenAI is returning one `message` item with one `output_text` content part.
- The response is incomplete because the request hit `max_output_tokens`.
- The extracted text begins like JSON but is truncated before a balanced JSON
  object completes.
- The remaining provider failure is not a wrong response property issue; it is a
  max-output-token truncation issue.

Safety review:

- No raw OpenAI output text was logged or recorded.
- No prompts were logged.
- No API keys, provider secrets, service-role markers, stack traces, or raw
  internal markers appeared in UI/page output or diagnostics.
- Fallback output still had no invented pricing, availability, booking
  confirmation, or guarantees.
- Manual-send / owner-review orientation remained present.

Phase 23E remains not passed because provider success did not occur. Fallback
safety passed again.

Recommended next technical step before another production retry:

- increase `max_output_tokens` for this structured bundle or shorten the schema
  output/prompt so the JSON can complete, then redeploy and rerun one targeted
  synthetic retry only with owner approval.

## Phase 23E-5 - Max Output Token Fix and Targeted Provider Proof

Owner approved the smallest safe fix for the Phase 23E provider blocker:
increase only the lead conversion bundle structured-output token budget.

### Token Budget Root Cause

The Phase 23E-4 diagnostic retry proved the production request was using the
intended OpenAI Responses API structured-output path:

| Field | Value |
| --- | --- |
| Model | `gpt-5.1` |
| Responses API flag | `true` |
| Format type | `json_schema` |
| Schema name | `lead_conversion_bundle_v1` |
| Strict | `true` |

The response failed because it was truncated:

| Field | Value |
| --- | --- |
| Response status | `incomplete` |
| Incomplete reason | `max_output_tokens` |
| Output item types | `message` |
| Content part types | `output_text` |
| Extracted candidate length | `3564` |
| First character class | `object_start` |
| Balanced JSON object found | `false` |
| Parse failure class | `no_balanced_json_object` |

The old effective token budget was the provider default:

```text
server/providers/ai/openai-provider.ts
DEFAULT_MAX_OUTPUT_TOKENS = 900
```

The lead conversion bundle service did not pass a bundle-specific override, so
the structured JSON object could be cut off before completion.

### Code Fix

Commit:

```text
1bab2f6 fix(ai): increase structured bundle output budget
```

Changed files:

- `server/services/ai/lead-conversion-assistant.service.ts`
- `tests/unit/ai-bundle-token-budget-source.test.mts`

Fix:

```text
LEAD_CONVERSION_BUNDLE_MAX_OUTPUT_TOKENS = 3000
```

The override is passed only by the lead conversion bundle provider call. The
global OpenAI default remains `900`. No schema, model, prompt, parser, fallback,
or safety behavior was changed.

Verification before commit:

| Command | Result |
| --- | --- |
| `pnpm test:unit` | Passed, 78 tests / 18 suites |
| `pnpm typecheck` | Passed |
| `pnpm lint` | Passed |
| `pnpm build` | Passed |
| `git diff --check` | Passed |

### Deployment

| Check | Result |
| --- | --- |
| Push | `origin/main` updated to `1bab2f6` |
| Vercel production deployment | Ready |
| Production alias | `bizpilo.com` aliased to the new deployment |
| Public smoke | Passed 9/9 on `https://bizpilo.com` |

Public smoke result:

```text
Results: 9 passed, 0 failed (9 total)
```

### Targeted Production Retry

Approved target only:

| Field | Value |
| --- | --- |
| Business | `MrTester` |
| Business id | `131561a7-9b5b-4ff9-a7fe-403d5c46462b` |
| Lead | `BizPilot QA Test Lead` |
| Lead id | `3f46045b-47d1-4d92-b99d-0bdfe6eab10e` |

Pre-retry snapshot:

| Field | Value |
| --- | --- |
| Lead status | `reviewed` |
| `response_status` | `viewed` |
| `response_sla_state` | `viewed` |
| Lead source | `phase23c_qa` |
| `ai_outputs` count | `1` |
| `usage_events` count | `3` |
| `lead_events` count | `6` |
| Latest AI output | `rule_fallback`, `fallback`, `ai_provider_invalid_schema` |

Exactly one retry was run through the normal production owner UI action:

```text
/dashboard/leads/3f46045b-47d1-4d92-b99d-0bdfe6eab10e
-> Regenerer / Generate AI draft
-> generateLeadAiBundleAction
```

Post-retry result:

| Check | Result |
| --- | --- |
| Attempt count | `1` |
| Provider success | Yes |
| Result type | `provider success` |
| Persisted provider/status | `openai` / `generated` |
| Model | `gpt-5.1` |
| `ai_outputs` count | `1` |
| `usage_events` count | `4` |
| `lead_events` count | `7` |
| New usage event | `0e60fcaa-f0b7-476d-9ce5-f1ce03a665cc` |
| New lead event | `59810cc7-5390-4cd2-a223-9d829f6cb08a` |
| New lead event label | `AI assistant draft generated` |

The existing synthetic AI output row was updated in place:

```text
61192c9d-22da-4eed-af55-70524dcba28e
```

Persisted output metadata:

| Field | Value |
| --- | --- |
| Provider | `openai` |
| Status | `generated` |
| Model | `gpt-5.1` |
| Error message | `null` |
| Estimated cost | `$0.000956` |
| Input tokens | `307` |
| Output tokens | `1517` |
| Output keys | `followUpDraft`, `leadQualityExplanation`, `leadSummary`, `missingInfoReasoning`, `replyDraft`, `suggestedNextAction`, `toneVariants` |

### Diagnostic Result

Safe production diagnostics for the successful retry:

| Field | Value |
| --- | --- |
| Request model | `gpt-5.1` |
| Responses API flag | `true` |
| Format type | `json_schema` |
| Schema name | `lead_conversion_bundle_v1` |
| Strict | `true` |
| Response status | `completed` |
| Error type/code | `null` / `null` |
| Incomplete reason | `null` |
| Output item count | `1` |
| Output item types | `message` |
| Content part count | `1` |
| Content part types | `output_text` |
| Text part present | `true` |
| Extracted candidate length | `6068` |
| First character class | `object_start` |
| Balanced JSON object found | `true` |
| Parsed-helper present | `false` |

No raw model text, prompts, API keys, provider secrets, customer data, or real
tenant data were logged.

### Safety Review

The generated provider draft passed the owner-review safety checks:

- No invented pricing observed.
- No invented availability observed.
- No booking confirmation observed.
- No guarantees observed.
- Manual-send / owner-review orientation remained present.
- No real lead, customer, business, or other tenant data was used.
- No cross-tenant data appeared.
- No API key, provider secret, service-role marker, stack trace, raw internal
  marker, prompt, or raw OpenAI output appeared in the UI/page output or report.

`BizPilot Synthetic Cleaning QA MailTM` was not touched.

### Phase 23E-5 Status

Phase 23E passed.

The targeted OpenAI/provider proof succeeded on the approved synthetic
`MrTester` lead only. Fallback safety remains intact, and the lead AI output,
usage event, and lead timeline event were persisted as expected.

## Remaining Pilot-Readiness Blockers After Phase 23E

- Backup/export/restore readiness remains required before real customer purge or high-risk production data operations.
- SMTP/custom-domain email posture and password-reset smoke remain readiness gates if owner-facing email flows are used.
- OpenAI usage, cost, quota, and fallback posture should remain monitored during real pilot operation.
- Docs remain uncommitted pending owner review.
