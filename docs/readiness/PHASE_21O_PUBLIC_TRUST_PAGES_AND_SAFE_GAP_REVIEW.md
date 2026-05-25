# Phase 21O - Public Trust Pages and Safe Gap Review

**Project:** BizPilot AI  
**Date:** 2026-05-25  
**Status:** Local validation passed; deploy verification pending after push  
**Scope:** Safe public-surface gap closure, no production SQL, no secrets, no real customer data

---

## 1. Purpose

This pass closes a low-risk but important pilot-readiness gap: public trust pages
were missing from the marketing surface even though privacy, security, backup,
and terms standards already existed in project docs.

The implemented pages make the current truth visible without over-claiming legal
compliance or real-pilot readiness.

## 2. Implemented

New public routes:

- `/privacy`
- `/security`
- `/terms`

New shared implementation:

- `components/public/policy-page.tsx`
- `lib/i18n/policy-copy.ts`

Navigation update:

- Footer links now include Privacy, Security, and Terms.

Copy safeguards:

- EN/fr-CA copy is centralized.
- Pages state owner-reviewed/manual-send boundaries.
- Pages state no auto-send/booking/invoicing/SMS/WhatsApp/full CRM scope.
- Pages keep real customer data blocked until production smokes, OpenAI
  validation, stable email/signup posture, and backup/export readiness.
- Pages do not claim legal compliance, completed restore drill, or paid-pilot
  readiness.

## 3. References Used

The public trust copy is informed by official privacy-regulator references:

- Canada OPC PIPEDA overview:
  `https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda_brief`
- Quebec Law 25 privacy changes:
  `https://www.cai.gouv.qc.ca/espace-evolutif-modernisation-lois/principales-modifications/`

No legal advice is asserted. Formal legal review remains a future gate before
larger real-customer rollout.

## 4. Validation

Local validation passed:

- `pnpm test:unit` - 54/54 passed
- `pnpm typecheck` - passed
- `pnpm lint` - passed
- `pnpm build` - passed; routes generated for `/privacy`, `/security`, `/terms`
- Local HTTP smoke returned 200 for `/privacy`, `/security`, `/terms`
- Browser QA at 375px width found no horizontal overflow for all three pages
- Browser QA confirmed footer trust links and no-auto-send boundary language

## 5. Still Blocked

This pass does not unblock real customer data or paid pilot execution.

Remaining blockers:

- production public quote security smoke
- fr-CA production quote smoke
- OpenAI production key/output validation
- signup email/custom SMTP posture
- production backup/export/restore posture
- live admin visual QA with a founder-authorized production session
- production `0020` only after backup/export if fake/test auth deletion is still
  needed

## 6. Next Safe Gap Pass

Recommended next safe work:

1. Build a no-secret SMTP/Auth email posture runbook and provider decision matrix.
2. Add a backup/export/restore decision checklist that distinguishes Free-plan
   synthetic demos from real customer data.
3. Re-run public route smoke after deployment.
4. Continue dashboard/admin visual QA only with synthetic/founder-authorized
   sessions.
