# Phase 21N - Synthetic Production Smoke Plan

**Project:** BizPilot AI
**Document Type:** Controlled production smoke execution plan
**Status:** Owner-approved for synthetic-only execution; data-bearing quote/fr-CA smoke not fully executed yet
**Owner:** MoOoH
**Last Updated:** 2026-05-25

---

## 1. Purpose

This plan defines the exact synthetic-only production smoke sequence needed after an approved deploy/merge path. It closes the planning gap recorded in Phase 21E/21F without creating production rows, applying production SQL, deploying, merging `main`, or using real customer data.

This document is the execution checklist for synthetic-only production smoke.
The owner later approved synthetic smoke execution, browser use, temporary safe
inbox use, and no-real-data production verification. It still does not approve
real customer data, production SQL, destructive cleanup, paid upgrades, or
hidden automation.

## 2. Non-Negotiable Scope

Allowed in the later approved smoke:

- synthetic cleaning business/workspace only,
- synthetic owner accounts only,
- synthetic quote submissions only,
- read-only verification except for the intentionally created synthetic rows,
- manual cleanup only through an approved path.
- `dashboard-auth-smoke` must remain local/preview only; it must not run against production or canonical production DBs.

Not allowed:

- real customer names, emails, phone numbers, addresses, or quote payloads,
- production SQL beyond a separately approved exact migration/query,
- blind replay of `0018`,
- adding `leads.source`; use `leads.source_channel`,
- weakening RLS,
- production deploy or `main` merge without separate approval,
- hidden auto-send, booking, invoices, SMS, WhatsApp, Instagram API, calendar automation, or full CRM scope.
- `dashboard-auth-smoke` against production (`bizpilo.com`) or canonical production DB (`qfqendrqimqvkoojpjao`) under any circumstance.
- creating production test artifacts without explicit owner approval and recorded cleanup/retention decision.
- `codex-dashboard-*` slugs as canonical production smoke artifacts; use owner-approved synthetic workspace route labels only.

## 3. Required Owner Approval Before Execution

Owner has broadly approved synthetic-only production smoke. Before any
data-bearing quote/fr-CA smoke run, confirm the specific disposable accounts,
payload, and cleanup route being used in that run:

| Approval item | Required owner decision |
| --- | --- |
| Deploy/merge | Approve the exact branch/PR/deploy action, or provide a deployed preview URL that points at the Phase 21 branch. |
| Synthetic workspace | Approve creating or using one disposable synthetic cleaning workspace. |
| Primary synthetic owner | Approve one owner login for the synthetic workspace. |
| Second synthetic owner | Approve one separate owner login for horizontal-access negative testing. |
| Synthetic quote data | Approve the specific fake customer payload shape in Section 5. |
| Cleanup | Choose retain-as-evidence or cleanup-through-approved-admin/service path. |
| Signup inbox | Provide a safe inbox/mail-capture only if signup smoke is included in the same run. |
| OpenAI retry | Confirm HTTP `429` is resolved before any real provider retry. |

Phase 21P note: public route smoke is now automated through `pnpm smoke:public`
and passed against `https://bizpilo.com` without creating accounts or quote data.
The remaining Phase 21E/21F smoke is the data-bearing synthetic quote/security
sequence below.

## 4. Recommended Synthetic Workspace Shape

Use one clearly labeled production test workspace:

```text
Business name: BizPilot Synthetic Cleaning QA
Workspace kind: founder_test or demo
Preferred language for Phase 21E: en
Preferred language for Phase 21F: fr-CA
Public link slug: clearly fake and disposable
Plan/status: founder pilot / active only for the smoke window
Quote link: active for positive tests, inactive for negative test
```

Do not use a real cleaning company name, real address, real phone number, real inbox, real website, or real prospect.

## 5. Approved Synthetic Quote Payload Shape

Use fake data with obvious test markers:

```text
Customer name: Test Customer Phase 21
Email: owner-approved safe inbox or no real deliverable address if email is optional
Phone: clearly fake test number only if the form requires it
Service: deep cleaning or move-out cleaning
Property type: apartment or house
Bedrooms/bathrooms: small fake counts
Location: Test Area, QC
Timing: flexible
Notes: Synthetic Phase 21 production smoke. Not a real customer.
Consent: accepted where required
Source channel: public_quote_link or approved UTM/source value
```

Never paste or store real customer payloads for this smoke.

## 6. Phase 21E Public Quote Security Sequence

Run in this order after deploy and setup approval:

| Step | Action | Pass condition |
| --- | --- | --- |
| 1 | Open active synthetic quote link. | Page loads without raw errors. |
| 2 | Submit the approved synthetic payload once. | Success page appears and no raw DB/provider error is exposed. |
| 3 | Verify owner dashboard lead list. | Synthetic lead appears only for the approved owner. |
| 4 | Open lead detail. | Intake values, `source_channel`, status, and workflow sections render. |
| 5 | Verify second synthetic owner cannot access the lead. | Cross-owner access is blocked by dashboard route/service/RLS behavior. |
| 6 | Disable or use inactive synthetic link. | Public quote submission is blocked safely. |
| 7 | Try wrong business/form mismatch. | Submission/value insert is rejected safely. |
| 8 | Try unknown field key. | Rejected safely. |
| 9 | Try hidden field value. | Rejected safely. |
| 10 | Try field from another form. | Rejected safely. |
| 11 | Try too-fast submission once. | Rejected with safe user-facing error; do not spam production. |
| 12 | Try honeypot payload once. | Rejected safely. |
| 13 | Try malformed payload once. | Rejected safely with no raw internals. |

Stop immediately if any test exposes raw database/provider internals, permits cross-owner access, or creates unexpected production rows.

## 7. Phase 21F fr-CA Quote Smoke Sequence

Run only after Phase 21E passes:

| Step | Action | Pass condition |
| --- | --- | --- |
| 1 | Set synthetic workspace preferred language to `fr-CA`. | Quote page renders Canadian French copy. |
| 2 | Open quote page around 390px width. | No horizontal overflow. |
| 3 | Submit one approved French synthetic payload. | Success flow works without raw errors. |
| 4 | Open owner dashboard lead detail. | Lead appears, detail opens, intake values are organized. |
| 5 | Check AI/fallback panel. | Section does not crash; no auto-send behavior appears. |
| 6 | Check manual reply workflow. | Owner review/copy/send remains explicit. |
| 7 | Verify second synthetic owner cannot access the lead. | Access is blocked. |

## 8. Cleanup Policy

Owner must choose one before execution:

| Option | Meaning |
| --- | --- |
| Retain evidence | Keep the synthetic workspace/leads as clearly labeled production QA evidence. Mark as `founder_test` or `demo`; do not mix with pilot data. |
| Clean up | Remove only the synthetic test data through an approved existing admin/service cleanup path. If auth-user deletion is needed, production `0020` must be explicitly approved/applied first. |

Do not run destructive cleanup against production-customer workspaces. Do not run ad-hoc purge SQL.

## 9. Evidence To Record

Record only sanitized evidence:

- date/time of smoke,
- deployed commit or preview URL,
- synthetic workspace label,
- route/test names and pass/fail result,
- safe screenshots if they contain no secrets, tokens, customer data, or full emails,
- cleanup decision and result.

Do not record:

- secrets, env values, tokens, confirmation links,
- full customer-like rows,
- real emails/phones/addresses,
- service-role keys, anon keys, database passwords, OpenAI keys,
- raw database dumps or exported data.

## 10. Current Status

```text
Plan recorded.
Owner approved synthetic execution.
Public route smoke passed through `pnpm smoke:public`.
Production SQL not approved by this document.
Production data-bearing quote/fr-CA smoke not run.
Ready only for founder-controlled synthetic demos.
```
