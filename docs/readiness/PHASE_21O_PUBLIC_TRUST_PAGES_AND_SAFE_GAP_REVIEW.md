# Phase 21O - Public Trust Pages and Safe Gap Review

**Project:** BizPilot AI  
**Date:** 2026-05-25  
**Status:** Production deployed and smoked
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

Production validation passed after commit `0b67a81 feat: add public trust pages
and interactive demo` deployed to Vercel production deployment
`dpl_H2EtZKwH5E24YTaWxz4JcT859kCF`:

- `https://bizpilo.com/` returned HTTP 200 and contained `Step 1 of 7`.
- `https://bizpilo.com/privacy` returned HTTP 200 and contained privacy-page
  copy.
- `https://bizpilo.com/security` returned HTTP 200 and contained security-page
  copy.
- `https://bizpilo.com/terms` returned HTTP 200 and contained pilot terms copy.
- `https://bizpilo.com/pricing` returned HTTP 200 and contained staged pricing
  copy.

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

Phase 21P follow-up has started:

1. `pnpm smoke:public` now gives a repeatable no-secret public route smoke.
2. `docs/operations/BIZPILOT_AUTH_EMAIL_SMTP_INTEGRATION_PLAN_v1.0.md`
   records the custom SMTP/Auth email posture plan.
3. `docs/operations/BIZPILOT_BACKUP_EXPORT_RESTORE_DECISION_MATRIX_v1.0.md`
   records the synthetic-demo vs real-customer-data backup decision.
4. Continue dashboard/admin visual QA only with synthetic/founder-authorized
   sessions.
