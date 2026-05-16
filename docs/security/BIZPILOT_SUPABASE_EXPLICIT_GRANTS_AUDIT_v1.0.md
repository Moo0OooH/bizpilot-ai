# BizPilot AI — Supabase Explicit GRANT Audit

**Version:** v1.0
**Status:** Active — audit only, no SQL changes
**Owner:** MoOoH
**Scope:** Per-table and per-function Data API grant matrix across `anon`, `authenticated`, `service_role`. Output is the input to Phase 10C migration.
**Last Updated:** 2026-05-15
**Source standard:** `docs/architecture/BIZPILOT_VENDOR_INDEPENDENCE_AND_PORTABILITY_STANDARD_v1.0.md`, Sections 8, 9, 21, 25
**Related:**
- `docs/operations/BIZPILOT_PHASE_10A_VENDOR_INDEPENDENCE_GAP_REPORT_v1.0.md`
- `docs/engineering/BIZPILOT_BACKEND_DATABASE_RLS_STANDARD_v1.5.md`
- `supabase/migrations/README.md`

---

## 1. Purpose

Apply the `GRANT + RLS + POLICY + TEST` rule to every public-schema object that the application currently uses. Phase 10B records the audit only. Phase 10C lands the migration. Phase 10D adds the RLS test runner. Phase 11+ extends test coverage. This document is the single source of truth for what the Data API grants should be on each table and function.

The decision filter:

```text
For each table: who must reach it, through which role, for which operation,
with which RLS policy already gating the rows, and which test will verify it?
```

If any of the five questions has no answer, the grant is wrong.

---

## 2. Scope

In scope:

- All 27 application tables in `public` created by migrations `0001`, `0002`, `0005`, `0007`, `0009`.
- All RLS helper functions used by current policies or invoked from the application's server session client.
- Schema-level usage grants.
- Sequence considerations.

Out of scope:

- SQL changes (those belong to Phase 10C).
- New RLS policy rewrites (those belong to Phase 11/12).
- Storage grants (no `Supabase Storage` buckets exist).
- `auth` schema (managed by Supabase Auth).

---

## 3. Reference: roles and least-privilege rules

The three Supabase Data API roles considered throughout:

- `anon` — unauthenticated, used only by the public quote page. Must hold the smallest possible grant footprint.
- `authenticated` — a signed-in dashboard user. RLS narrows rows to their business via `is_business_member()` / `can_manage_business()` / `owns_business()`.
- `service_role` — server-only privileged role. Used today exclusively for sign-up tenant bootstrap. Grants here are always full; the protection lives in the constraint that this client is created in only one place.

Two reminders from the Vendor Independence Standard, Section 8.1:

```text
GRANT without RLS = dangerous
RLS without GRANT = may be inaccessible through Data API
GRANT + RLS + POLICY + TEST = required standard
```

The audit treats any pre-existing implicit grant as untrustworthy. Every row in the target matrix is justified explicitly even when the current state already satisfies it.

---

## 4. Current grant state (audited)

Legend for operations: `s` = select, `i` = insert, `u` = update, `d` = delete, `—` = none. The `Source migration` column identifies where the grant currently comes from. `(implicit)` means no grant statement exists yet — behavior depends on the database default.

### 4.1 Migration 0001 — Identity and tenant

| Table | anon | authenticated | service_role | Source |
| --- | --- | --- | --- | --- |
| `public.profiles` | — | (implicit) | (implicit) | none |
| `public.businesses` | — | (implicit) | (implicit) | none |
| `public.business_members` | — | (implicit) | (implicit) | none |

### 4.2 Migration 0002 — Configuration

| Table | anon | authenticated | service_role | Source |
| --- | --- | --- | --- | --- |
| `public.verticals` | — | (implicit) | (implicit) | none |
| `public.industry_templates` | — | (implicit) | (implicit) | none |
| `public.industry_template_fields` | — | (implicit) | (implicit) | none |
| `public.business_branding` | `s` | (implicit) | (implicit) | 0005 line 360 grants `select` to anon, authenticated |
| `public.business_services` | — | (implicit) | (implicit) | none |
| `public.business_faqs` | — | (implicit) | (implicit) | none |
| `public.business_service_areas` | — | (implicit) | (implicit) | none |
| `public.business_privacy_settings` | — | (implicit) | (implicit) | none |
| `public.business_consent_settings` | — | (implicit) | (implicit) | none |
| `public.business_template_settings` | — | (implicit) | (implicit) | none |
| `public.business_onboarding_tasks` | — | (implicit) | (implicit) | none |

### 4.3 Migration 0005 — Public intake and leads

| Table | anon | authenticated | service_role | Source |
| --- | --- | --- | --- | --- |
| `public.public_link_variants` | `s` | `s, i, u, d` | (implicit) | 0005 lines 361, 368 |
| `public.intake_forms` | `s` | `s, i, u, d` | (implicit) | 0005 lines 362, 365 |
| `public.intake_form_fields` | `s` | `s, i, u, d` | (implicit) | 0005 lines 363, 366 |
| `public.consent_versions` | `s` | `s, i, u, d` | (implicit) | 0005 lines 364, 367 |
| `public.intake_submissions` | `i` | `s, i` | (implicit) | 0005 lines 369, 373 |
| `public.intake_submission_values` | `i` | `s, i` | (implicit) | 0005 lines 370, 374 |
| `public.leads` | `i` | `s, i, u` | (implicit) | 0005 lines 371, 375; 0007 line 112 adds `update` |
| `public.lead_source_metadata` | `i` | `s, i` | (implicit) | 0005 lines 372, 376 |

Schema usage grant (`grant usage on schema public to anon, authenticated`) is present at line 359 of 0005.

### 4.4 Migration 0007 — Lead Conversion Desk

| Table | anon | authenticated | service_role | Source |
| --- | --- | --- | --- | --- |
| `public.lead_quality_scores` | — | `s, i, u` | (implicit) | 0007 line 109 |
| `public.lead_action_items` | — | `s, i, u` | (implicit) | 0007 line 110 |
| `public.lead_events` | — | `s, i` | (implicit) | 0007 line 111 |

### 4.5 Migration 0009 — AI assistant

| Table | anon | authenticated | service_role | Source |
| --- | --- | --- | --- | --- |
| `public.ai_outputs` | — | `s, i, u` | (implicit) | 0009 line 84 |
| `public.usage_events` | — | `s, i` | (implicit) | 0009 line 85 |

### 4.6 Helper functions

| Function | Current EXECUTE grants | Source |
| --- | --- | --- |
| `public.set_updated_at()` | (trigger only, no API access needed) | 0001 |
| `public.handle_new_auth_user()` | (trigger only, security definer) | 0001 |
| `public.is_business_member(uuid)` | (implicit) | 0001 |
| `public.can_manage_business(uuid)` | (implicit) | 0001 |
| `public.owns_business(uuid)` | (implicit) | 0001 |
| `public.has_active_public_link(uuid)` | `anon, authenticated` | 0005 line 377 |
| `public.can_public_read_business_branding(uuid)` | `anon, authenticated` | 0005 line 378 |
| `public.can_public_read_intake_form(uuid, boolean)` | `anon, authenticated` | 0005 line 379 |
| `public.can_public_read_intake_field(uuid, uuid, boolean)` | `anon, authenticated` | 0005/0006 line 380 / 68 |
| `public.can_public_read_consent_version(uuid, boolean)` | `anon, authenticated` | 0005 line 381 |
| `public.can_public_submit_to_form(uuid, uuid, uuid)` | `anon, authenticated` | 0005 line 382 |
| `public.public_submission_belongs_to_business(uuid, uuid)` | `anon, authenticated` | 0005 line 383 |
| `public.public_lead_belongs_to_business(uuid, uuid)` | `anon, authenticated` | 0005 line 384 |

### 4.7 Sequences

There are no `serial` or `bigserial` columns in the schema. Every primary key is a `uuid` generated by `gen_random_uuid()`. **No sequence grants are required.**

---

## 5. Table exposure classification

Per Vendor Independence Standard, Section 21. This classification drives the target grants in Section 6.

| Table | Class | Reason |
| --- | --- | --- |
| `profiles` | Private tenant | Owner identity; only the row's user reads/updates it. |
| `businesses` | Private tenant | Tenant root; not exposed publicly. |
| `business_members` | Private tenant | Membership map; never public. |
| `verticals` | Internal reference | Read by authenticated dashboard for template selection. Not customer-facing. |
| `industry_templates` | Internal reference | Same as above. |
| `industry_template_fields` | Internal reference | Same as above. |
| `business_branding` | Public-readable active metadata + Private tenant | Public read via active link helper; tenant-only write. |
| `business_services` | Private tenant | Owner configuration; not part of the current public surface. |
| `business_faqs` | Private tenant | Owner configuration; future public exposure deferred. |
| `business_service_areas` | Private tenant | Same; future public exposure deferred. |
| `business_privacy_settings` | Private tenant | Per-business privacy mode. |
| `business_consent_settings` | Private tenant | Internal consent configuration; the customer-facing copy lives in `consent_versions`. |
| `business_template_settings` | Private tenant | Customizations. |
| `business_onboarding_tasks` | Private tenant | Setup progress. |
| `public_link_variants` | Public-readable active metadata + Private tenant | Public read of `is_active = true`; tenant-only write. |
| `intake_forms` | Public-readable active metadata + Private tenant | Same pattern via helper. |
| `intake_form_fields` | Public-readable active metadata + Private tenant | Same; visible fields only via helper. |
| `consent_versions` | Public-readable active metadata + Private tenant | Active consent text; tenant-only write. |
| `intake_submissions` | Public-insert-only + Private tenant | Anon insert scoped by helper; private read. |
| `intake_submission_values` | Public-insert-only + Private tenant | Same. |
| `leads` | Public-insert-only + Private tenant + Internal write | Public insert during submission; authenticated read/update for the desk. |
| `lead_source_metadata` | Public-insert-only + Private tenant | Same insert pattern; private read. |
| `lead_quality_scores` | Internal derived | Calculated by dashboard reads; tenant-only. |
| `lead_action_items` | Internal derived | Owner workflow. |
| `lead_events` | Internal audit/event | Append-only history. |
| `ai_outputs` | Internal derived | Cached AI artifacts. |
| `usage_events` | Internal audit/event | Cost/usage telemetry. |

---

## 6. Target grant matrix

Target grants per table per role. Where a grant differs from current state, the row is marked `Δ`. Where the row matches current state, it is marked `=`. Where no grant exists today, the row is marked `+` (add). Where a current grant should be revoked, the row is marked `−`.

### 6.1 Identity and tenant

| Table | anon | authenticated | service_role | Delta |
| --- | --- | --- | --- | --- |
| `profiles` | — | `s, u` | `s, i, u, d` | `+` |
| `businesses` | — | `s, i, u` | `s, i, u, d` | `+` |
| `business_members` | — | `s, i, u` | `s, i, u, d` | `+` |

Notes:

- `profiles`: insert is performed by the `handle_new_auth_user` trigger (security definer), not by the user, so no insert grant for authenticated. Delete is intentionally not granted to the user.
- `businesses`: insert grant is needed because the sign-up flow is moving away from service-role for general writes; the existing `businesses_insert_owner` policy gates the row. Delete is not granted to authenticated.
- `business_members`: insert grant is needed for the founding-membership path (currently service-role); the existing `business_members_insert_owner_membership` policy makes this safe. Update is granted; delete is not.

### 6.2 Configuration

Updated to reflect Recorded Decisions D1 (anon: select on reference tables) and D2 (anon: select on `business_faqs` and `business_service_areas`). See Sections 9.1 and 9.2.

| Table | anon | authenticated | service_role | Delta |
| --- | --- | --- | --- | --- |
| `verticals` | `s` | `s` | `s, i, u, d` | `+` (D1) |
| `industry_templates` | `s` | `s` | `s, i, u, d` | `+` (D1) |
| `industry_template_fields` | `s` | `s` | `s, i, u, d` | `+` (D1) |
| `business_branding` | `s` (already) | `s, i, u, d` | `s, i, u, d` | `+` for authenticated I/U/D and service_role |
| `business_services` | — | `s, i, u, d` | `s, i, u, d` | `+` |
| `business_faqs` | `s` | `s, i, u, d` | `s, i, u, d` | `+` (D2) |
| `business_service_areas` | `s` | `s, i, u, d` | `s, i, u, d` | `+` (D2) |
| `business_privacy_settings` | — | `s, i, u, d` | `s, i, u, d` | `+` |
| `business_consent_settings` | — | `s, i, u, d` | `s, i, u, d` | `+` |
| `business_template_settings` | — | `s, i, u, d` | `s, i, u, d` | `+` |
| `business_onboarding_tasks` | — | `s, i, u, d` | `s, i, u, d` | `+` |

Notes:

- Reference tables (`verticals`, `industry_templates`, `industry_template_fields`) are write-locked to `service_role` because they are seed/reference data; the existing RLS already restricts SELECT to `is_active = true` rows.
- `business_branding` is the lone "public-readable + tenant-write" table from 0002. The `anon: select` grant from 0005 is preserved and a Note row is added to Section 9 about whether to keep this on `business_branding` only or extend to FAQs/service areas (Open Decision D2).
- All other Section 6.2 tables grant full CRUD to `authenticated`; the `*_manage_manager` RLS policies gate writes to owner/admin.

### 6.3 Public intake and leads

| Table | anon | authenticated | service_role | Delta |
| --- | --- | --- | --- | --- |
| `public_link_variants` | `s` | `s, i, u, d` | `s, i, u, d` | `+` service_role only |
| `intake_forms` | `s` | `s, i, u, d` | `s, i, u, d` | `+` service_role only |
| `intake_form_fields` | `s` | `s, i, u, d` | `s, i, u, d` | `+` service_role only |
| `consent_versions` | `s` | `s, i, u, d` | `s, i, u, d` | `+` service_role only |
| `intake_submissions` | `i` | `s, i, u, d` | `s, i, u, d` | `+` authenticated U/D and service_role |
| `intake_submission_values` | `i` | `s, i, u, d` | `s, i, u, d` | `+` authenticated U/D and service_role |
| `leads` | `i` | `s, i, u, d` | `s, i, u, d` | `+` authenticated I/D and service_role |
| `lead_source_metadata` | `i` | `s, i, u, d` | `s, i, u, d` | `+` authenticated U/D and service_role |

Notes:

- `intake_submissions` and `intake_submission_values` U/D are added because the privacy mode roadmap (Phase 14) requires owner-triggered deletion of customer-submitted data. Today the service does not exercise these grants; the RLS policies that currently exist allow only SELECT and INSERT, so adding the GRANT without adding a corresponding RLS policy leaves U/D blocked at the row layer. This is intentional: open the GRANT door so a future Phase 14 RLS policy is the only change required, but RLS keeps the room locked until then.
- `leads`: `authenticated: insert` is added because some test/demo paths may need to create leads server-side. RLS already requires the lead to match a submission for the same business, so the additional grant is harmless. Authenticated `delete` is for privacy mode deletion (same logic as submissions).
- The anon grant set is unchanged from current state.

### 6.4 Lead Conversion Desk

| Table | anon | authenticated | service_role | Delta |
| --- | --- | --- | --- | --- |
| `lead_quality_scores` | — | `s, i, u, d` | `s, i, u, d` | `+` authenticated D and service_role |
| `lead_action_items` | — | `s, i, u, d` | `s, i, u, d` | `+` authenticated D and service_role |
| `lead_events` | — | `s, i` | `s, i, u, d` | `+` service_role only |

Notes:

- `lead_events` is append-only. `authenticated` deliberately gets no U/D — the audit history must not be editable by the dashboard. `service_role` gets full grants for export/migration tooling.
- `lead_quality_scores` and `lead_action_items` gain a `delete` grant so an owner can remove stale items via the dashboard. Current RLS does not include a DELETE policy, so the grant is inert until Phase 11+ adds one — same intentional pattern as 6.3.

### 6.5 AI artifacts

| Table | anon | authenticated | service_role | Delta |
| --- | --- | --- | --- | --- |
| `ai_outputs` | — | `s, i, u, d` | `s, i, u, d` | `+` authenticated D and service_role |
| `usage_events` | — | `s, i` | `s, i, u, d` | `+` service_role only |

Notes:

- Same append-only model as `lead_events` for `usage_events`.
- `ai_outputs` adds delete because privacy mode (Forward-Only) requires the option to purge AI artifacts; RLS will add the matching policy in Phase 14.

---

## 7. Function grant matrix

| Function | anon EXECUTE | authenticated EXECUTE | service_role EXECUTE | Delta |
| --- | --- | --- | --- | --- |
| `public.set_updated_at()` | — | — | — | trigger only |
| `public.handle_new_auth_user()` | — | — | — | trigger only, security definer |
| `public.is_business_member(uuid)` | — | yes | yes | `+` explicit (currently implicit via PUBLIC default) |
| `public.can_manage_business(uuid)` | — | yes | yes | `+` explicit |
| `public.owns_business(uuid)` | — | yes | yes | `+` explicit |
| `public.has_active_public_link(uuid)` | yes | yes | yes | `+` add service_role for completeness |
| `public.can_public_read_business_branding(uuid)` | yes | yes | yes | `+` service_role |
| `public.can_public_read_intake_form(uuid, boolean)` | yes | yes | yes | `+` service_role |
| `public.can_public_read_intake_field(uuid, uuid, boolean)` | yes | yes | yes | `+` service_role |
| `public.can_public_read_consent_version(uuid, boolean)` | yes | yes | yes | `+` service_role |
| `public.can_public_submit_to_form(uuid, uuid, uuid)` | yes | yes | yes | `+` service_role |
| `public.public_submission_belongs_to_business(uuid, uuid)` | yes | yes | yes | `+` service_role |
| `public.public_lead_belongs_to_business(uuid, uuid)` | yes | yes | yes | `+` service_role |

Notes:

- The three internal helpers (`is_business_member`, `can_manage_business`, `owns_business`) are evaluated inside RLS policies and may also be invoked from server code in the future. Granting EXECUTE explicitly to `authenticated` makes the contract visible and audit-friendly.
- The migration should consider `revoke execute on function ... from public` for every function in the same statement set, then re-grant only the required roles. This prevents a future Supabase platform change that flips PUBLIC defaults from breaking the audit.

---

## 8. Schema usage grants

Current state (from 0005 line 359): `grant usage on schema public to anon, authenticated`. This is correct and stays.

Add to Phase 10C migration: `grant usage on schema public to service_role` for explicit completeness (Supabase defaults already provide this, but documenting it removes a hidden assumption).

---

## 9. Open decisions for the owner

These must be answered before Phase 10C writes the migration. Defaults below are conservative.

| ID | Question | Default if no decision | Cost of reversing |
| --- | --- | --- | --- |
| D1 | Should `verticals` / `industry_templates` / `industry_template_fields` be readable by `anon` to support a future "browse cleaning template" marketing path? | **No** — authenticated only. | Low. Adding `grant select to anon` later is one migration line and one RLS update. |
| D2 | Should `business_faqs` and `business_service_areas` be readable by `anon` on the public quote page? | **No** — current code path renders only the flattened `intake_form_fields`. | Medium. Requires both a grant and a new RLS helper, plus a UI change. Belongs to Phase 13 or later. |
| D3 | Should `authenticated` keep the `delete` grants added in Sections 6.3–6.5 even though no RLS policy currently allows DELETE? | **Yes** — grant the row open so a future privacy-mode RLS policy is the only change needed. | Trivial. Grants without policies are inert. |
| D4 | Should `authenticated` get an `insert` grant on `public.businesses` and `public.business_members`, allowing the founding-business path to move off `service_role`? | **Yes** — the existing RLS policies already gate this. The service-role bootstrap can become a fallback rather than the default. | Medium. Reverting requires reverting both the grant and the auth-flow change. |
| D5 | Should `public.profiles` allow `authenticated: delete` for account self-deletion? | **No** — leave to a future "delete my account" feature paired with a deletion workflow. | Low. |

Each decision is a single column in the target matrix. The defaults above are the safest path and are what the Phase 10C draft uses unless overridden.

### 9.1 Recorded decisions (2026-05-15)

The owner reviewed the five decisions and recorded the following outcomes:

| ID | Decision | Effect |
| --- | --- | --- |
| D1 | **Yes** — anon select on `verticals`, `industry_templates`, `industry_template_fields`. | Section 6.2 grant matrix updates `anon` from `—` to `s` for these three tables. RLS policies for anon SELECT do **not** land in Phase 10C; they are deferred to **Phase 10E**. Until 10E lands, anon SELECT returns zero rows because RLS is enabled but no anon policy exists. |
| D2 | **Yes** — anon select on `business_faqs`, `business_service_areas`. | Section 6.2 grant matrix updates `anon` from `—` to `s` for these two tables. Same RLS deferral to Phase 10E. |
| D3 | **Accept default (Yes)** — keep `authenticated: delete` grants inert until the matching RLS policy exists. | No further change in 10C. |
| D4 | **Yes (default)** — `authenticated: insert` on `businesses` and `business_members`. | Migration grants are landed in 10C. The auth-flow change that moves the founding-business path off `service_role` is a separate task scheduled after 10D's RLS test runner is in place. |
| D5 | **Accept default (No)** — no `authenticated: delete` on `profiles`. | No further change in 10C. |

### 9.2 Phase 10E scope (created by D1 + D2)

**Phase 10E status as of 2026-05-15: landed.**
Migration: `supabase/migrations/0011_anon_select_policies_for_reference_and_faqs.sql`.
Tests: `tests/rls/anon-select-policies-d1-d2.test.sql`.

The grants in 10C opened the door for `anon` to query five tables; the 10E policies now control which rows pass through:

```text
verticals                    -> anon can select when is_active = true
industry_templates           -> anon can select when is_active = true
industry_template_fields     -> anon can select when is_active = true
business_faqs                -> anon can select when is_active = true and has_active_public_link(business_id)
business_service_areas       -> anon can select when is_active = true and has_active_public_link(business_id)
```

The first three are global reference data: the anon policy matches the existing authenticated `*_select_authenticated` shape (`is_active = true` only). The FAQs and service areas pair the `is_active` filter with `has_active_public_link()`, the same helper already used by `business_branding_select_public_link_active`. No new helper functions were required.

The Phase 10E test file covers: anon visibility for active rows, anon invisibility for inactive rows, and anon invisibility for FAQs/service areas owned by a business without an active public link.

---

## 10. Least-privilege risks identified

The audit surfaced four risks that are not blockers for Phase 10C but should be tracked:

- **R1.** Anon `insert` on four tables (`intake_submissions`, `intake_submission_values`, `leads`, `lead_source_metadata`) is unusual in shape — most public form patterns insert into a staging table and let a server-side process promote the row to `leads`. Today the only defense is the `can_public_submit_to_form` helper plus `public_submission_belongs_to_business`. This is documented as a known design choice in `BIZPILOT_VENDOR_INDEPENDENCE_AND_PORTABILITY_STANDARD_v1.0.md`, Section 16, and is reinforced by the planned Phase 13 public-quote abuse protection. No change in 10C. **Update (Phase 12, 2026-05-15):** the `intake_submission_values` portion of this risk is hardened by migration `0012` and the new `public_can_insert_submission_value` helper. Unknown field_keys, hidden fields, and cross-form mixing are now rejected at the row level. **Update (Phase 13, 2026-05-15):** the bulk-insert / rate-limit portion of this risk is now mitigated by migration `0013` (`public_submission_abuse_log` plus `record_public_submission_attempt` and `count_recent_public_submission_attempts` helpers) and the new `server/services/abuse-protection.service.ts`. Anon never gets direct read/write access on the log; the service layer enforces a default 10-attempts-per-60-minutes-per-(business, ip_hash) limit. Min-completion-time HMAC remains deferred to Phase 13.1.
- **R2.** The `business_branding` anon `select` grant from 0005 line 360 is broader than its RLS policy implies. The RLS policy `business_branding_select_public_link_active` for the `anon` role only allows rows where `can_public_read_business_branding(business_id) = true`, but the GRANT itself does not constrain rows. RLS is the row gate; the GRANT is the table-access gate. This is correct, but it relies on the RLS policy never being weakened. Phase 11 should include a test that asserts an `anon` SELECT on a business with no active public link returns zero rows.
- **R3.** The internal RLS helpers (`is_business_member`, `can_manage_business`, `owns_business`) are `security definer`. A bug in any of them bypasses RLS for every table that uses them. Phase 10D's test runner must include direct unit tests of these helpers.
- **R4.** No `revoke` statements exist anywhere in the migration history. Future Supabase platform changes could flip default grants. Phase 10C should open with a `revoke all on all tables in schema public from public` plus a `revoke all on all functions in schema public from public` to establish a clean baseline before re-granting. This is the single most important hardening move in 10C.

---

## 11. Migration plan outline for Phase 10C

Phase 10C must produce a single migration file at:

```text
supabase/migrations/0010_explicit_data_api_grants.sql
```

Recommended structure:

1. **Block A — Revoke broad PUBLIC defaults.** `revoke all on all tables in schema public from public`. `revoke all on all functions in schema public from public`. `revoke all on all sequences in schema public from public` (no-op today but future-proofs against later additions).
2. **Block B — Re-grant schema usage.** `grant usage on schema public to anon, authenticated, service_role`.
3. **Block C — Per-table grants for migrations 0001 and 0002.** One `grant` line per role per table for the 14 tables that currently have no explicit grants. Each table grouped together.
4. **Block D — Per-table grants for service_role across the remaining tables created in 0005, 0007, 0009.** No change to anon or authenticated grants; just make the service_role row explicit.
5. **Block E — Function EXECUTE grants.** Explicit `grant execute` for the three internal helpers, and a service_role addition to the eight public helpers.
6. **Block F — Anchor comment.** A leading comment block in the file that references this audit by path and version, and lists which Open Decisions in Section 9 were accepted (defaults vs overrides).

The migration must not:

- rewrite any RLS policy;
- drop and recreate any function;
- alter any table structure;
- include any seed data;
- depend on any environment variable.

It is grants-only. The migration's success is verified by Phase 10D's RLS test runner.

---

## 12. Test requirements for Phase 10D / Phase 11

**Phase 10D status as of 2026-05-15:** the runner is implemented at `tests/rls/run-rls-tests.mts` and registered as `pnpm test:rls`. The four pre-existing SQL test files (`auth-tenant-foundation`, `business-template-configuration`, `public-intake-and-leads`, `lead-conversion-desk`) are picked up automatically. See `tests/rls/README.md` for usage.

**Phase 11 coverage status as of 2026-05-15:** four additional test files landed:

- `tests/rls/anon-select-policies-d1-d2.test.sql` (covers Phase 10E grants/policies; T2 partial — anon visibility on configuration tables).
- `tests/rls/public-intake-submission-values-hardening.test.sql` (covers T6 — unknown keys, hidden fields, ID-mixing on the public insert path).
- `tests/rls/ai-output-tenant-isolation.test.sql` (covers AI output tenant isolation portion of T7).
- `tests/rls/usage-events-tenant-isolation.test.sql` (covers `usage_events` portion of T7 plus T8 append-only verification).
- `tests/rls/inactive-public-link-blocks-anon.test.sql` (covers T4 + T5 end-to-end: anon visibility flips when the public link toggles).
- `tests/rls/rls-helper-functions.test.sql` (covers T10 — direct calls to `is_business_member`, `can_manage_business`, `owns_business`).

Items below remain the open-coverage backlog for Phase 11 v1.1 or a successor phase.

- **T1.** `anon` cannot SELECT from `profiles`, `businesses`, `business_members`.
- **T2.** `anon` cannot SELECT from `business_services`, `business_faqs`, `business_service_areas`, `business_privacy_settings`, `business_consent_settings`, `business_template_settings`, `business_onboarding_tasks`.
- **T3.** `anon` cannot SELECT from `verticals`, `industry_templates`, `industry_template_fields` while D1 default holds.
- **T4.** `anon` can SELECT `business_branding` only when the business has an active public link.
- **T5.** `anon` can SELECT `intake_forms`, `intake_form_fields`, `consent_versions`, `public_link_variants` only via the helper-protected RLS policies.
- **T6.** `anon` can INSERT into `intake_submissions`, `intake_submission_values`, `leads`, `lead_source_metadata` only via the helper-protected RLS policies.
- **T7.** `authenticated` users cannot SELECT another business's leads/submissions/scores/events/AI outputs.
- **T8.** `authenticated` cannot DELETE rows from any table where the corresponding RLS policy does not include a DELETE rule (verifies the inert-grant model from D3).
- **T9.** `service_role` can perform full CRUD across all tables (smoke test only, run from a server-only test harness; never from the dashboard).
- **T10.** The three internal helpers behave correctly under direct invocation: `is_business_member(unknown_uuid)` is false, `can_manage_business` requires owner or admin role, `owns_business` matches `businesses.owner_user_id`.

---

## 13. Definition of Done

This audit is complete when:

- All 27 tables and all 13 functions appear in Sections 4, 6, and 7 with current state and target state.
- All five Open Decisions in Section 9 have either a recorded owner decision or are accepted at the default.
- The document is referenced from `docs/README.md` and `MANIFEST.json`.
- Phase 10C migration draft is ready to be written using Section 11 as the structural template.

The document is **replaced by v1.1** when an actual `0010_explicit_data_api_grants.sql` lands and a row in Section 12 has been verified by a runnable RLS test.

---

## 14. Final principle

Every line of `grant` in `0010` must answer a single sentence:

```text
"Role X needs operation Y on table Z because workflow W requires it,
and RLS policy P will gate which rows are visible."
```

If a future migration ever adds a table to `public` without answering that sentence, the audit has failed.
