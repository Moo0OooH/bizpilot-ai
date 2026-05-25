# Phase 21S - Admin Visual QA Checklist

**Project:** BizPilot AI
**Document Type:** Founder admin visual QA checklist
**Status:** Prepared for owner-run browser session; not executed by Codex
**Owner:** MoOoH
**Last Updated:** 2026-05-25

---

## 1. Scope

This checklist is for a founder-authorized production `/admin` session. The
recommended path is owner-run QA in the owner's browser. Codex should not ask
for passwords, session cookies, tokens, or secrets.

No destructive actions are approved by this checklist. Cleanup execution,
fake/test auth deletion, production SQL, and production `0020` apply remain
separate decisions.

## 2. Access Checks

| Check | Expected result | Status |
| --- | --- | --- |
| Logged-out `/admin` | Redirects to sign-in or founder access gate | Previously route-smoked; recheck in browser |
| Founder logged-in `/admin` | Admin console opens without raw errors | Not run |
| Non-founder owner `/admin` | Blocked from founder-only console | Not run |
| Mobile width around 390px | No uncontrolled horizontal overflow | Not run |
| Desktop width 1280px | No uncontrolled horizontal overflow | Not run |

## 3. Admin Console Visual Checks

| Area | Expected result | Status |
| --- | --- | --- |
| Users list | Loads synthetic/founder-safe user rows without exposing secrets | Not run |
| Businesses list | Loads business rows with plan/status/workspace kind visible | Not run |
| Workspace kind | `production_customer`, `founder_test`, `demo`, and `seed` states are understandable | Not run |
| Quote link controls | Active/inactive controls are visible and scoped | Not run |
| Internal notes | Notes UI is clear and does not expose customer payload content unnecessarily | Not run |
| Safety rail copy | Production customer purge/delete warnings are obvious | Not run |

## 4. Cleanup Safety Checks

| Check | Expected result | Status |
| --- | --- | --- |
| Cleanup dry-run | Dry-run is understandable and required before execution | Not run |
| Cleanup execute | Clearly guarded; not run without separate explicit approval | Not run |
| Production-customer cleanup | Hard purge blocked by copy and service guardrails | Not run |
| Fake/test auth deletion UI | Clearly warns that production `0020` is required for auth identity deletion | Not run |
| Missing `0020` state | User sees a safe blocker instead of a broken destructive path | Not run |

## 5. Evidence Rules

Record only:

- date/time,
- browser viewport,
- route/check name,
- pass/fail status,
- sanitized screenshots with no tokens, cookies, passwords, full emails, or
  real customer content.

Do not record:

- passwords,
- confirmation links,
- session cookies,
- auth tokens,
- service-role keys,
- database URLs,
- provider credentials,
- real customer rows or payloads.

## 6. Current Result

Admin visual QA:

```text
Prepared / not run.
```

Remaining input needed:

```text
Owner-run founder browser session or other founder-authorized non-secret QA
path.
```
