# Phase 21R - Production Horizontal Access Smoke

**Project:** BizPilot AI
**Document Type:** Production horizontal-access smoke plan/result
**Status:** Blocked by precondition; no approved two-owner synthetic sessions available
**Owner:** MoOoH
**Last Updated:** 2026-05-26

---

## 1. Purpose

This document defines the synthetic-only production smoke for tenant isolation:
Owner A must not see Owner B's workspace, leads, dashboard counts, or lead
detail URLs.

No real customer data is allowed. Do not print session cookies, tokens, full
emails, passwords, service-role keys, anon keys, database passwords, or customer
payloads. Do not weaken RLS. Do not run production SQL for this smoke.

## 2. Current Status

```text
Step 10 stopped at precondition.
```

Reason:

```text
The current Codex context does not include two approved synthetic production
owner sessions, two active synthetic workspaces, or synthetic lead IDs.
```

Local RLS coverage exists and has passed in earlier Phase 21 evidence, but
production browser/session smoke remains required before real customer data.

Step 10 did not create, update, delete, or clean up production data.
No dashboard smoke scripts were run.
No production SQL mutation was run.
Step 11 founder-admin visual QA was not run.

## 2A. 2026-05-26 Route and Access-Control Inspection

Before attempting authenticated checks, the dashboard and lead access paths were
inspected.

### Dashboard routes

- Lead list route:
  - `app/(dashboard)/dashboard/leads/page.tsx`
- Lead detail route:
  - `app/(dashboard)/dashboard/leads/[leadId]/page.tsx`
- Protected dashboard shell:
  - `app/(dashboard)/layout.tsx`

### Tenant scoping path

- Dashboard routes call `getCurrentUser()`.
- If no user session exists, the dashboard redirects to `/auth/sign-in`.
- The dashboard shell and lead pages resolve the active workspace through
  `getBusinessWorkspace({ userId: user.id })`.
- The active owner business is taken from `workspace.businesses[0]`.
- Lead list uses:
  - `getLeadConversionDesk({ actorUserId: user.id, business: activeBusiness })`
- Lead detail uses:
  - `getLeadDetail({ actorUserId: user.id, business: activeBusiness, leadId })`

### Repository filters inspected

`server/repositories/lead-conversion.repository.ts` applies tenant filters on
the owner lead paths:

- `listLeadsForBusiness()` filters `.eq("business_id", input.businessId)`.
- `getLeadById()` filters both:
  - `.eq("business_id", input.businessId)`
  - `.eq("id", input.leadId)`
- action item, event, score, submission-value, and workflow update paths also
  carry the `business_id` filter.

Expected direct URL denial behavior:

```text
If Owner A opens /dashboard/leads/<Lead B id>, the page should call
getLeadById({ businessId: Business A id, leadId: Lead B id }), receive null,
and return notFound() rather than rendering Lead B data.
```

Important caveat:

```text
getLeadDetail() is not a read-only path when a valid same-tenant lead is opened.
It may mark first_viewed_at, last_owner_action_at, response state, score, events,
or action items. Therefore production Step 10 must use owner-approved synthetic
leads only.
```

## 3. Required Synthetic Setup

Use only clearly fake data:

```text
Synthetic Owner A
Synthetic Business A
Synthetic Lead A

Synthetic Owner B
Synthetic Business B
Synthetic Lead B
```

Approved evidence may record only sanitized identifiers:

- synthetic business label or short ID,
- synthetic lead short ID,
- route/check name,
- pass/fail status,
- no screenshots containing emails, tokens, or customer-like content.

## 4. Smoke Matrix

| Check | Expected result | Status |
| --- | --- | --- |
| Owner A opens dashboard | Only Business A data appears | Blocked - no Owner A session |
| Owner B opens dashboard | Only Business B data appears | Blocked - no Owner B session |
| Owner A lead list | Lead A visible, Lead B absent | Blocked - no Owner A session/Lead B id |
| Owner B lead list | Lead B visible, Lead A absent | Blocked - no Owner B session/Lead A id |
| Owner A opens Lead B direct URL | Blocked by route/service/RLS behavior | Blocked - no approved direct URL fixture |
| Owner B opens Lead A direct URL | Blocked by route/service/RLS behavior | Blocked - no approved direct URL fixture |
| Dashboard counts | Counts do not include other owner tenant rows | Blocked - no two-owner fixture |
| Public quote submission target | Submission routes to intended synthetic business only | Not run in Step 10 |
| Service-role/founder paths | Not available to normal owners in browser UI | Not run |

## 5. Stop Conditions

Stop immediately if:

- cross-tenant lead data appears,
- a direct lead URL exposes another tenant's content,
- dashboard counts include another tenant,
- any raw database/provider error is exposed,
- any token/session/cookie appears in logs or screenshots.

## 6. Result

Production horizontal access smoke:

```text
Blocked at precondition; not executed.
```

Remaining input needed:

```text
Two approved synthetic owner sessions/businesses and at least one synthetic lead
per business.
```

## 7. Required Setup Plan for Step 10 Execution

Step 10 can proceed only after owner approval supplies or authorizes:

1. Synthetic Owner A session and Synthetic Owner B session.
2. Business A and Business B identifiers/slugs, both clearly marked synthetic.
3. One approved synthetic lead ID per business.
4. Confirmation that opening same-tenant lead details may mutate only synthetic
   workflow metadata (`first_viewed_at`, events, action items, score/state sync).
5. A cleanup/retention decision for the synthetic records.

Owner-side read-only setup query shape, if needed:

```sql
select
  b.id as business_id,
  b.slug,
  b.workspace_kind,
  b.status,
  b.lifecycle_status,
  b.plan_slug,
  count(l.id) as synthetic_lead_count
from public.businesses b
left join public.leads l on l.business_id = b.id
where b.workspace_kind in ('demo', 'founder_test', 'seed')
group by b.id, b.slug, b.workspace_kind, b.status, b.lifecycle_status, b.plan_slug
order by b.created_at desc
limit 20;
```

Do not print real customer data. Record only synthetic labels, business IDs,
slugs, lead IDs, counts, and pass/fail status.

## 8. Step 10 Closeout for 2026-05-26

| Required output | Result |
| --- | --- |
| Two synthetic owners/businesses available | No |
| Synthetic identifiers used | None |
| PASS/PARTIAL/FAIL per check | All authenticated checks blocked by missing approved two-owner sessions |
| Direct URL denial behavior observed | Not observed in browser; expected behavior inspected in code path |
| Production data created/mutated | No |
| Cleanup needed later | No new Step 10 cleanup |
| Step 11 run | No |

Step 10 remains:

```text
PARTIAL/BLOCKED - code path inspected; production authenticated two-owner
horizontal access smoke still requires owner-approved synthetic sessions.
```

## 9. Step 10A - Synthetic Tenant Setup (Business B + Lead B)

**Status:** BLOCKED (requires owner-controlled auth + inbox/session)

### 9a. Why this is blocked in the current Codex environment

Step 10A requires creating a second production auth user + tenant workspace
through the normal UI (`/auth/sign-up`). That may require email confirmation
and always requires credentials/session handling.

This Codex workspace does not have a safe owner-controlled inbox/session to
complete production sign-up autonomously without exposing secrets.

Therefore, Business B + Lead B cannot be created from this workspace without
owner involvement (inbox/session/password).

### 9b. Smallest owner action required (exact, minimal)

Create one synthetic tenant using the normal production UI only:

1. Open: `https://bizpilo.com/auth/sign-up`
2. Fill with synthetic values:
   - Owner name: `Synthetic Owner B`
   - Business name: `Synthetic ACME B`
   - Email: owner-controlled test inbox alias (do not use `example.test` for auth)
   - Password: choose any strong password (do not share)
3. Complete any required email confirmation in that test inbox.
4. After landing in the dashboard, locate the public quote link for Business B
   via Quote Setup / Configuration / Copy Quote Link (product UI).
5. Confirm the slug is human-readable and NOT:
   - `codex-dashboard-*`
   - a UUID / business_id
6. Open Business B public quote URL and submit one synthetic Lead B:
   - customer_name: `Synthetic Customer B`
   - customer_contact/email: `synthetic+10-b@example.test`
   - customer_phone: `+15550123458`
   - city_or_service_area: `Montréal`
   - notes: `Synthetic lead B for horizontal access smoke only.`
   - sourceChannel: `public_quote_link`
   - consentAccepted: `on`

Do not run dashboard smoke scripts. Do not run production SQL mutations.
Do not use real customer data.

### 9c. Read-only verification (owner-side, canonical production DB)

Run SELECT-only queries in Supabase SQL Editor for canonical production project
`qfqendrqimqvkoojpjao`. Output only IDs/slugs/timestamps/counts.

Verify Lead B exists:

```sql
select
  id as lead_id,
  business_id,
  intake_submission_id,
  created_at,
  customer_contact,
  city_or_service_area,
  source_channel
from public.leads
where customer_contact = 'synthetic+10-b@example.test'
order by created_at desc
limit 1;
```

Verify Business B public link row for the discovered slug:

```sql
select
  slug,
  business_id,
  is_active
from public.public_link_variants
where slug = '<BUSINESS_B_SLUG>'
limit 1;
```

### 9d. Required fixtures before Step 10 can execute

Step 10 (horizontal access smoke) can proceed only after we have:

- Business A:
  - slug: `akora`
  - business_id: `157bc1b5-7f13-46d9-ae87-c8ec0279a011`
  - lead_id: `4a50d95a-0b25-474e-8090-a0fa87a7bd1e`
- Business B:
  - slug: `<BUSINESS_B_SLUG>`
  - business_id: `<BUSINESS_B_ID>`
  - public quote URL: `https://bizpilo.com/quote/<BUSINESS_B_SLUG>`
- Lead B:
  - lead_id: `<LEAD_B_ID>`
  - intake_submission_id: `<LEAD_B_SUBMISSION_ID>`
  - source_channel: `public_quote_link`

### 9e. Evidence and cleanup posture

- Production data created in Step 10A: **Yes, synthetic only** (once owner completes 9b).
- Cleanup: **optional / owner-approved only**. Do not delete anything during Step 10A/10.
- Step 11 founder-admin visual QA remains blocked until Step 10 passes.
