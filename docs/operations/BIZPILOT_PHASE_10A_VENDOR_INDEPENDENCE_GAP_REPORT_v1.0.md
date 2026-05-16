# BizPilot AI — Phase 10A Vendor Independence Gap Report

**Version:** v1.0
**Status:** Active audit
**Owner:** MoOoH
**Scope:** Architecture, provider boundaries, service/repository discipline, SQL-first migrations, backup readiness
**Last Updated:** 2026-05-15
**Source standard:** `docs/architecture/BIZPILOT_VENDOR_INDEPENDENCE_AND_PORTABILITY_STANDARD_v1.0.md`
**Related audits:**
- `docs/engineering/BIZPILOT_SUPABASE_CLIENT_ARCHITECTURE_v1.0.md`
- `docs/engineering/BIZPILOT_SERVICE_REPOSITORY_BOUNDARY_AUDIT_v1.0.md`
- `docs/security/BIZPILOT_AUTH_ROUTE_PROTECTION_AUDIT_v1.0.md`
- `docs/security/BIZPILOT_RLS_AUDIT_REPORT_v1.0.md`

---

## 1. Purpose

Audit BizPilot AI against the Vendor Independence and Portability Standard (v1.0). This report does not change code. It records what is compliant, what is partial, what is missing, and the smallest concrete fix per gap so Phase 10B (Explicit GRANT Audit) can begin from a known baseline.

The decision filter used throughout this report:

```text
Does the current code increase or decrease BizPilot's ability to move off
Supabase / OpenAI / Resend / Stripe / Vercel with controlled engineering effort?
```

---

## 2. Portability Maturity Assessment

Target before pilot: **Level 2 — SQL-First and Layer-Isolated**.
Target before paid launch: **Level 3 — Backup, Export, and Replacement Plan**.

| Maturity criterion | Status | Evidence |
| --- | --- | --- |
| Database changes are migration-controlled | Compliant | `supabase/migrations/0001_*` … `0009_*` |
| Application code uses service/repository boundaries | Compliant | `server/{actions,services,repositories,policies}/` |
| UI does not talk directly to vendor-specific DB logic | Compliant | No `@supabase` or `@/lib/supabase` imports under `app/` or `components/` |
| Provider clients are isolated | Mostly compliant | Supabase isolated; OpenAI call is embedded in a service, not behind an `AIProvider` interface |
| RLS/security rules are explicit | Partial | RLS is enabled on every audited table (93 RLS/policy statements across 6 migrations), but explicit `GRANT`s are missing on tables created in 0001 and 0002 |
| Supabase service role is server-only and exceptional | Compliant | Used only in `server/services/business.service.ts` for founding-business bootstrap |
| Business logic mainly lives in services, not vendor tools | Compliant | Repositories are type-only and `server-only`; services orchestrate workflows |
| Backup/export process documented | **Missing** | No backup, export, or restore document exists in `docs/` |
| Critical tables can be exported | Not documented | No table list, no export script, no restore placeholder |
| Provider replacement plan exists for AI/email/payment/storage | Partial | AI replaceability documented in the standard but not enforced by a code-level interface; email/payment/storage providers are not yet implemented |

**Overall current level:** Level 2 substantially achieved, with two blockers that prevent a clean Level 2 sign-off and two items required to begin moving toward Level 3.

---

## 3. Compliant items

### 3.1 Supabase client architecture

The three-client separation in `docs/engineering/BIZPILOT_SUPABASE_CLIENT_ARCHITECTURE_v1.0.md` is honored in code.

- `lib/supabase/client.ts` uses only `getPublicEnv()` and exposes a browser client through `createSupabaseBrowserClient()`. No service-role import.
- `lib/supabase/server.ts` is guarded with `import "server-only"` and exposes both `createSupabaseServerClient()` (cookie-aware SSR) and `createSupabaseServiceRoleClient()` (rare, server-only).
- `lib/supabase/middleware.ts` uses only the anon key and request cookies; it is consumed only by `proxy.ts` for `/dashboard/:path*`.
- `lib/env/public-env.ts` validates client-safe env. `lib/env/server-env.ts` is guarded with `import "server-only"` and is the only path that can read `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.

### 3.2 Service-role isolation

`createSupabaseServiceRoleClient()` is imported in exactly one production file: `server/services/business.service.ts`. It is used only when `serviceRole: true` is explicitly passed by `createFoundingBusiness()` during sign-up tenant bootstrap. No dashboard read, no public quote flow, no client component touches it.

### 3.3 No direct Supabase usage in UI

A targeted grep for `@supabase`, `supabase/ssr`, `supabase/supabase-js`, and `@/lib/supabase` against `app/` and `components/` returned zero matches. UI and pages talk to services and actions only.

### 3.4 Repository, service, policy, and error layering

Every file under `server/` begins with `import "server-only"`. Repositories import only `type { SupabaseClient }` and `type { Database, Json }`; they do not import services or policies. Actions import services and `getSafeUserErrorMessage`, and wire `redirect`/`revalidatePath`. The `business-membership.policy.ts` module provides `isBusinessMember` and `canManageBusiness`, and is currently consumed by `business-configuration.service.ts` via `assertManageAccess()`.

### 3.5 SQL-first migrations

All schema changes are in version-controlled SQL files under `supabase/migrations/`. Each migration carries the standard file header, creates tables with constraints and indexes, enables RLS, and defines named policies. Public-facing reads use RLS helper functions (`has_active_public_link`, `can_public_read_intake_form`, `can_public_read_intake_field`, `can_public_read_consent_version`, `can_public_submit_to_form`, `public_submission_belongs_to_business`, `public_lead_belongs_to_business`).

### 3.6 AI prompt and privacy boundaries

`server/services/ai/prompt-registry.ts` versions prompts and instructions. `server/services/ai/privacy-filter.ts` masks customer fields before they reach the model. `server/services/ai/ai-cost.ts` tracks token and cost estimation. Output is validated against a JSON schema before being persisted. A rule-based fallback is recorded under `provider: "rule_fallback"` whenever the model call fails.

### 3.7 RLS test SQL exists

`tests/rls/` contains `auth-tenant-foundation.test.sql`, `business-template-configuration.test.sql`, `public-intake-and-leads.test.sql`, and `lead-conversion-desk.test.sql`.

---

## 4. Partial items (compliance with documented exceptions)

### 4.1 P1 — Explicit `GRANT`s are missing on early migrations

**Severity:** High. This is the primary input to Phase 10B.

`supabase/migrations/0001_auth_tenant_foundation.sql` and `supabase/migrations/0002_business_template_configuration.sql` contain no `grant` statements. The tables they create rely on implicit Supabase Data API defaults:

- 0001: `public.profiles`, `public.businesses`, `public.business_members`.
- 0002: `public.verticals`, `public.industry_templates`, `public.industry_template_fields`, `public.business_branding`, `public.business_services`, `public.business_faqs`, `public.business_service_areas`, `public.business_privacy_settings`, `public.business_consent_settings`, `public.business_template_settings`, `public.business_onboarding_tasks`.

By contrast, `0005`, `0007`, and `0009` declare grants explicitly per role (`anon`, `authenticated`). The Vendor Independence Standard, Section 9, requires every public-schema table to carry an explicit Data API grant decision.

**Smallest fix:** Phase 10B output (`docs/security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md`) lists each of the 14 tables above with its intended grant matrix; Phase 10C lands a single migration `supabase/migrations/0010_explicit_data_api_grants.sql` that adds the missing grants without rewriting any policy.

### 4.2 P2 — AI provider is not behind an interface

**Severity (original):** Medium. Documented as deferred risk in the Standard, Section 31 ("AI structured output hardening").

**Status (Phase 15, 2026-05-15):** **resolved.** The raw OpenAI `fetch` is now isolated behind a provider boundary:

- `server/providers/ai/ai-provider.ts` defines the `AIProvider` interface, the `AiProviderName` union, the `AiProviderError` class, and stable `AI_PROVIDER_ERROR_CODES` for downstream consumers.
- `server/providers/ai/openai-provider.ts` owns the `https://api.openai.com/v1/responses` call and the JSON schema contract.
- `server/providers/ai/index.ts` exports `getDefaultAiProvider()` and `requireDefaultAiProvider()` factories backed by `lib/env/server-env.ts`.
- `server/services/ai/lead-conversion-assistant.service.ts` no longer imports `getServerEnv` directly; it accepts an optional `aiProvider` parameter (default = env-backed) and calls `provider.generateStructuredBundle(...)`. Replacing OpenAI with Anthropic, Google, or a local model is now a single-file change.
- `server/services/ai/error-sanitizer.ts` converts raw provider errors into low-cardinality `SanitizedAiFailureReason` labels (`ai_provider_not_configured`, `ai_provider_request_failed`, `ai_provider_empty_output`, `ai_provider_invalid_schema`, `ai_lead_not_ready`, `ai_unknown_failure`). The service persists only these labels into `ai_outputs.error_message` and `usage_events.metadata.reason`, never raw error messages.

Phase 15 also closes the AI metadata cleanup item from the v1.6 strategic alignment implementation checklist Section C.

### 4.3 P3 — Lead conversion service does not use the policy helper

**Severity:** Low. Documented as deferred risk in `BIZPILOT_SERVICE_REPOSITORY_BOUNDARY_AUDIT_v1.0.md`.

`server/services/business-configuration.service.ts` calls `assertManageAccess({ businessId, memberships, userId })` before configuration writes. `server/services/lead-conversion.service.ts` does not import `business-membership.policy`. Today, lead workflow protection relies on the authenticated workspace plus `business_id` scoping at the repository layer plus RLS — three layers deep, but not centralized.

**Smallest fix:** after Phase 10D's RLS test runner is in place, wrap each lead-mutation entry point in `lead-conversion.service.ts` with an `assertBusinessAccess()` helper backed by `isBusinessMember()`. Do not touch repositories. Phase 11 RLS tests will catch any regression.

### 4.4 P4 — Migration 0003 is absent from the sequence

**Severity:** Trivial, but worth recording.

`supabase/migrations/` jumps from `0002` to `0004_remove_noncanonical_template_field_table.sql`. No `0003_*` exists. This is likely a deliberate cleanup (filename 0004 implies it removes a non-canonical table introduced and then discarded), but no migration index or `CHANGELOG.md` explains the gap.

**Smallest fix:** add a short `supabase/migrations/README.md` documenting the sequence and explaining why 0003 was dropped. No SQL change required.

---

## 5. Missing items

### 5.1 M1 — No backup, export, or restore documentation

**Severity:** High for "before pilot".

The Vendor Independence Standard, Section 14.1, requires the following to exist before pilot: documented critical tables, confirmed database backup/export path, business data export procedure, leads/submissions export procedure, consent/privacy export procedure, auth/user migration risk note, restore procedure placeholder.

A repo-wide search returns no file in `docs/` matching `*backup*` or `*export*`.

**Smallest fix:** create `docs/operations/BIZPILOT_BACKUP_AND_EXPORT_STRATEGY_v1.0.md` listing the 14.3 "Critical Data Classes" tables, the Supabase point-in-time recovery path, a `pg_dump` export script outline, an auth migration risk paragraph, and a "restore not yet tested" placeholder. The Standard explicitly allows documentation-only at this stage; operational restore testing is deferred to Section 14.2.

### 5.2 M2 — No RLS test runner script in `package.json`

**Severity:** Medium. This is Phase 10D, not 10A — recording it here so 10B does not start without it on the radar.

`package.json` declares `test:unit` (`node --test tests/unit/*.test.mts`) but no `test:rls`. The four SQL test files in `tests/rls/` cannot be run with a single command.

**Smallest fix:** Phase 10D adds a runner (`pgTAP` + `psql` against a disposable local Supabase database, or a Node-driven harness that pipes each `.test.sql` through `psql`) and registers `pnpm test:rls` in `package.json`.

### 5.3 M3 — Vendor Independence Standard is not indexed

**Severity:** Trivial. Blocks Phase 10A Definition-of-Done (Section 35 of the Standard).

Section 35 requires:

```text
- The document exists in docs/architecture.                           OK
- docs/README.md references it as an active architecture standard.    MISSING
- MANIFEST.json references it.                                        MISSING
```

A grep for `VENDOR_INDEPENDENCE` against `docs/README.md` returns nothing. The same string is absent from `MANIFEST.json`.

**Smallest fix:** add one line to `docs/README.md` under a new "Active Architecture Standards" heading (or under "Active v1.5 Hardening Standards"), and add one entry to the `files` array in `MANIFEST.json`. Trivial diff, no risk.

### 5.4 M4 — Email, payment, and storage provider abstractions are not yet built

**Severity:** Low. These features are not implemented; the gap is preventive.

The Standard Sections 12.2–12.4 require server-only, replaceable providers for email (Resend planned), payment (Stripe planned), and storage (Supabase Storage or alternative). None of these abstractions currently exist in `server/providers/`. Because none of these features are in the current MVP scope, this is acceptable — but Phase 7's first email or payment work must land an `EmailProvider` / `PaymentProvider` interface alongside the concrete adapter, not embed the SDK directly in a service.

**Smallest fix:** none today. Block Phase 7 from merging concrete SDK calls outside `server/providers/`.

---

## 6. Phase 10A Definition-of-Done status

From the Standard, Section 35:

| Criterion | Status |
| --- | --- |
| The document exists in `docs/architecture/` | Complete |
| `docs/README.md` references it as an active architecture standard | **Open — see M3** |
| `MANIFEST.json` references it | **Open — see M3** |
| Future phases use it as a decision filter | In progress — this report is the first phase to apply it |
| Supabase explicit `GRANT` audit is performed against this standard | Pending — Phase 10B |
| RLS hardening follows `GRANT + RLS + POLICY + TEST` | Pending — Phase 10B–12 |
| Provider-specific features are evaluated for lock-in risk | Partial — AI evaluated and recorded (P2) |
| Backup/export planning becomes part of pilot readiness | **Open — see M1** |

**Conclusion:** Phase 10A is functionally complete in code and architecture, but its own Definition-of-Done is blocked on three documentation tasks (M3, M1) and one cross-reference task (this report).

---

## 7. Inputs for Phase 10B (Explicit GRANT Audit)

Phase 10B should produce `docs/security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md` containing a table-by-table matrix for the 14 tables that currently lack explicit grants, using the access matrix in Section 9 of the Master Strategy as the starting decision template:

```text
profiles                      -> anon: none | authenticated: scoped select/update on own | service_role: full
businesses                    -> anon: none | authenticated: scoped | service_role: full
business_members              -> anon: none | authenticated: scoped | service_role: full
verticals                     -> anon: none or select reference data | authenticated: select | service_role: full
industry_templates            -> anon: none or select reference | authenticated: select | service_role: full
industry_template_fields      -> anon: none or select reference | authenticated: select | service_role: full
business_branding             -> anon: select active public-safe rows | authenticated: scoped | service_role: full
business_services             -> anon: none | authenticated: scoped | service_role: full
business_faqs                 -> anon: select active public-safe rows | authenticated: scoped | service_role: full
business_service_areas        -> anon: select active public-safe rows | authenticated: scoped | service_role: full
business_privacy_settings     -> anon: none | authenticated: scoped | service_role: full
business_consent_settings     -> anon: select active version metadata | authenticated: scoped | service_role: full
business_template_settings    -> anon: none | authenticated: scoped | service_role: full
business_onboarding_tasks     -> anon: none | authenticated: scoped | service_role: full
```

Each row must end with the same five-question grid required by the Standard, Section 8.1: who can access, through which role, through which operation, under which RLS policy, with which tests.

Phase 10B is documentation only. No SQL changes belong there.

---

## 8. Suggested minimal follow-up sequence

A small, ordered list that turns this report into action, in roughly increasing risk:

1. M3 fix — index the Vendor Independence Standard in `docs/README.md` and `MANIFEST.json`. Trivial.
2. P4 fix — add `supabase/migrations/README.md` explaining the missing `0003`. Trivial.
3. M1 first pass — create the backup/export documentation skeleton. Documentation only.
4. Phase 10B — produce the explicit GRANT audit document. No SQL.
5. Phase 10C — land migration `0010_explicit_data_api_grants.sql`. SQL only, no policy rewrite.
6. Phase 10D — register `pnpm test:rls` and run the existing four SQL test files locally.
7. P2 fix — extract the OpenAI `fetch` into `server/providers/ai/openai.provider.ts` behind an `AIProvider` interface. Schedule with Phase 15.
8. P3 fix — wrap lead workflow mutations with `assertBusinessAccess()`. Schedule with Phase 11.

Steps 1–3 can land before Phase 10B begins. Steps 4–6 form the originally planned 10B → 10C → 10D path. Steps 7–8 are deferred and explicitly marked as such in the Standard, Sections 12.1 and 31.

---

## 9. Outstanding questions for the owner

These do not block Phase 10B but should be answered before Phase 10C:

- Should `public.verticals`, `public.industry_templates`, and `public.industry_template_fields` be readable by `anon` as part of the cleaning template render path, or are they accessed only by authenticated dashboard reads? Today they have no grants either way, so behavior is implicit.
- Should `public.business_faqs` and `public.business_service_areas` be exposed to `anon` as part of the public quote page, or only via the existing RLS helper functions and `business_branding` read? Answer determines whether 10C grants `anon: select` for these tables or only `authenticated: select`.
- Should the founder pilot pricing in the Master Strategy (Section 16, `$29–$49/mo`) override the `$49–$99/mo` figure in `BIZPILOT_PROJECT_CONTEXT_FOR_CLOUD_CODE.md` Section 9? This is unrelated to 10A but was surfaced during the context read.

---

## 10. Final principle

The Vendor Independence Standard's closing rule applies to every fix listed above:

```text
Use strong providers.
Keep core architecture independent.
Make security explicit.
Keep data portable.
Protect future migration options.
```

Phase 10A confirms BizPilot's architecture already moves in this direction. The remaining work is making the implicit explicit — grants, backup, indexing — so the standard can be enforced by tests and migrations rather than by habit.
