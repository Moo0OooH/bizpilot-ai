# Phase 20A Production Supabase Target

**Project:** BizPilot AI
**Document Type:** Production target verification gate
**Status:** Blocked - production target not fully confirmed
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Purpose

Phase 20A confirms the exact production Supabase project/database before any migration, SQL, dump, restore, or production quote-flow smoke uses real production infrastructure.

No secrets were printed or recorded in this document. This document intentionally does not include database passwords, service role keys, anon keys, tokens, or full connection strings.

## 2. Production App URL

| Item | Value |
| --- | --- |
| Production app URL | `https://bizpilo.com` |
| Hosting provider observed | Vercel |
| Public route availability | Pass for `/`, `/pricing`, `/auth/sign-up`, `/auth/check-email`, `/auth/forgot-password`, `/auth/reset-password` |

## 3. Hosting Environment Checked

| Source | Result |
| --- | --- |
| Local Vercel metadata | `.vercel/repo.json` links this checkout to Vercel project name `bizpilot-ai`. |
| Vercel project id | Present locally, not reproduced here as an operational secret-like identifier. |
| Vercel production env values | Not accessible from this local run. Must be confirmed in Vercel dashboard before SQL changes. |
| Public production bundle scan | Did not expose a concrete Supabase project host. This means the production browser bundle could not independently confirm the Supabase target. |
| Production response headers | Confirmed Vercel-served Next.js app; no exact Supabase project ref exposed. |

## 4. Supabase Target Evidence

| Evidence Source | Supabase Project Ref / Name | Confidence |
| --- | --- | --- |
| Local `.env.local` `NEXT_PUBLIC_SUPABASE_URL` host | `cwiuajpbpyybxxtodpaq.supabase.co` | Confirmed for local configured env only |
| Derived project ref from local host | `cwiuajpbpyybxxtodpaq` | Confirmed for local configured env only |
| Existing docs / owner-reported project name | `bizpilot-production` | Owner-reported, not independently confirmed in dashboard during this run |
| Vercel production env | Unknown | Blocked until owner checks Vercel dashboard or provides safe env proof |

## 5. Does Production App Currently Point To This Project?

**Not fully confirmed.**

The local production-like env points to Supabase ref `cwiuajpbpyybxxtodpaq`. Prior Phase 19 and Phase 20A probes against that host found schema drift. However, the production app at `https://bizpilo.com` did not expose the exact Supabase host in its public JS bundle, and Vercel production environment values were not accessible from this local run.

Therefore, before applying production SQL, the owner must confirm in Vercel dashboard that production `NEXT_PUBLIC_SUPABASE_URL` points to the intended Supabase project and that it matches the project selected in Supabase dashboard.

## 6. Data Classification On Checked Supabase Host

The checked Supabase host was inspected using count-only and classification-only queries. No row values, emails, phone numbers, customer contacts, prompts, tokens, keys, or connection strings were printed.

| Area | Count / Classification |
| --- | --- |
| Auth users | 6 total; 4 synthetic-domain, 2 non-synthetic-domain |
| Businesses | 5 total; 4 synthetic-hint, 1 without synthetic hint |
| Leads | 16 total; 5 synthetic-hint, 11 without synthetic hint |
| Intake submissions | 16 |
| Intake submission values | 192 |
| AI outputs | 4 |
| Usage events | 4 |

**Data classification:** `unknown_or_possible_real_data_present`.

This database must not be treated as disposable. It may contain real or owner/business data. Any SQL change must follow production-change approval, backup/export posture, and rollback planning.

## 7. Schema State On Checked Supabase Host

Focused safe probes against `cwiuajpbpyybxxtodpaq.supabase.co` still show production-target drift:

| Check | Status |
| --- | --- |
| `businesses.status` | Missing |
| `business_members.status` | Missing |
| `public_link_variants.preferred_language` | Missing |
| `leads.source_channel` and current lead workflow columns | Present |
| `public.public_can_insert_submission_value(...)` | Missing from PostgREST schema cache |
| `public.record_public_submission_attempt(...)` | Missing from PostgREST schema cache |
| `public.count_recent_public_submission_attempts(...)` | Missing from PostgREST schema cache |

Note: Earlier Phase 19 notes referenced `leads.source`; the actual current schema/code uses `leads.source_channel`.

## 8. Required Approval Before Production SQL

Production SQL changes require explicit approval from:

- **Owner:** MoOoH
- **Ops/engineering operator applying SQL:** the person executing migrations or SQL in Supabase

Approval must explicitly confirm:

- exact Vercel production `NEXT_PUBLIC_SUPABASE_URL`,
- exact Supabase dashboard project name/ref,
- whether the target contains real or possible-real data,
- backup/export posture or accepted risk before mutation,
- migration list to apply,
- rollback or stop criteria.

## 9. May Production Migration Proceed?

**No. Production migration must not proceed yet.**

Reason:

- The production app's exact Supabase target is not independently confirmed from Vercel production env.
- The checked Supabase host contains `unknown_or_possible_real_data_present`.
- Required current schema pieces are missing on the checked host.
- Backup/restore posture is still not verified.
- There is no owner approval recorded in this Phase 20A gate.

## 10. Blockers

1. Owner must open Vercel production environment settings and confirm the production value of `NEXT_PUBLIC_SUPABASE_URL` without exposing keys.
2. Owner must open Supabase dashboard and confirm the project name/ref for the same host.
3. Owner must decide whether the checked data is safe synthetic data or possible real production data. Current classification is conservative: `unknown_or_possible_real_data_present`.
4. Owner must approve production SQL changes before any migration is applied.
5. Backup/export or accepted-risk posture must be recorded before mutating a database that may contain real data.
6. After migrations, Supabase/PostgREST schema cache must be refreshed or verified.
7. Re-run Phase 20A schema/RPC probes before Phase 20B fr-CA quote smoke.

## 11. Phase 20A Decision

BizPilot remains in:

```text
Code stable, production target not yet trusted.
```

It has not yet moved to:

```text
Production verified and safe for first founder-controlled pilot.
```
