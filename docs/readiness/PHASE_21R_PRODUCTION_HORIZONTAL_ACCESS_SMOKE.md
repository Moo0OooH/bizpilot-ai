# Phase 21R - Production Horizontal Access Smoke

**Project:** BizPilot AI
**Document Type:** Production horizontal-access smoke plan/result
**Status:** Prepared; not run because synthetic owner sessions/leads are not available
**Owner:** MoOoH
**Last Updated:** 2026-05-25

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
Prepared / not run.
```

Reason:

```text
The current Codex context does not include two approved synthetic production
owner sessions, two active synthetic workspaces, or synthetic lead IDs.
```

Local RLS coverage exists and has passed in earlier Phase 21 evidence, but
production browser/session smoke remains required before real customer data.

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
| Owner A opens dashboard | Only Business A data appears | Not run |
| Owner B opens dashboard | Only Business B data appears | Not run |
| Owner A lead list | Lead A visible, Lead B absent | Not run |
| Owner B lead list | Lead B visible, Lead A absent | Not run |
| Owner A opens Lead B direct URL | Blocked by route/service/RLS behavior | Not run |
| Owner B opens Lead A direct URL | Blocked by route/service/RLS behavior | Not run |
| Dashboard counts | Counts do not include other owner tenant rows | Not run |
| Public quote submission target | Submission routes to the intended synthetic business only | Not run |
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
Not run.
```

Remaining input needed:

```text
Two approved synthetic owner sessions/businesses and at least one synthetic lead
per business.
```
