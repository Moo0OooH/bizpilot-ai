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
