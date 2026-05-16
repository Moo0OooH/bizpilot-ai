# BizPilot AI — MVP Hardening Checklist v1.0

**Project:** BizPilot AI  
**Document Type:** MVP Hardening Checklist  
**Version:** v1.0  
**Status:** Required Before Sales-Ready MVP  
**Owner:** MoOoH  
**Last Updated:** 2026-05-12  

---

## 1. Purpose

This checklist defines what must be true before BizPilot is treated as sales-ready for real cleaning businesses.

The goal is not perfection. The goal is:

```text
Safe enough, polished enough, and focused enough to charge early customers.
```

---

## 2. Scope Freeze

Before hardening starts:

- [ ] No new feature scope is added.
- [ ] No booking engine.
- [ ] No CRM expansion.
- [ ] No SMS/WhatsApp/Instagram APIs.
- [ ] No full Stripe Billing.
- [ ] No second vertical.
- [ ] No background AI agents.
- [ ] No auto-send.

---

## 3. Build Health

- [ ] `pnpm typecheck` passes.
- [ ] `pnpm lint` passes.
- [ ] `pnpm build` passes.
- [ ] No known console errors in core flows.
- [ ] No broken route in route map.
- [ ] `.env.example` matches required env variables.
- [ ] Package manager is pinned.
- [ ] README setup instructions match real project commands.

---

## 4. Auth and Tenant Safety

- [ ] Sign up works.
- [ ] Sign in works.
- [ ] Sign out works.
- [ ] Dashboard redirects unauthenticated users.
- [ ] Authenticated user sees only own business.
- [ ] Cross-tenant manual test passes.
- [ ] Business membership policy is server-side.
- [ ] RLS tests pass for profiles/businesses/business_members.
- [ ] Auth errors are user-facing.

---

## 5. Database and RLS

- [ ] RLS enabled on every exposed table.
- [ ] Every tenant table has `business_id` unless documented.
- [ ] Public policies are narrow.
- [ ] Anonymous cannot read private data.
- [ ] Public quote policies are tested.
- [ ] RLS predicates have practical indexes.
- [ ] Supabase Security Advisor reviewed.
- [ ] Supabase Performance Advisor reviewed.
- [ ] No sensitive columns exposed through public views/functions.
- [ ] No service role key in browser/client bundle.

---

## 6. Public Quote Flow

- [ ] Active slug resolves correctly.
- [ ] Inactive/draft slug does not expose private data.
- [ ] Public page loads only public-safe branding/form fields.
- [ ] Hidden fields are not shown.
- [ ] Submission validates server-side.
- [ ] Honeypot works.
- [ ] Rate limit or abuse control exists.
- [ ] Consent version/timestamp captured.
- [ ] Lead created under correct business.
- [ ] Success page is clear.
- [ ] Failure page/error is clear and safe.

---

## 7. Lead Workspace

- [ ] Lead list loads tenant-scoped data.
- [ ] Lead detail loads tenant-scoped data.
- [ ] New lead status is clear.
- [ ] Follow-up/overdue states work.
- [ ] Manual outcome update works.
- [ ] Revenue recovery proof uses honest real data.
- [ ] Empty state helps owner understand next step.
- [ ] No fake “sent” or “booked” status appears unless owner marked it.

---

## 8. AI Assistant

- [ ] AI is manual/on-demand only.
- [ ] AI calls are server-side only.
- [ ] Input is privacy-filtered.
- [ ] Structured output schema exists.
- [ ] Output validation exists.
- [ ] AI failure fallback exists.
- [ ] Cost metadata is tracked.
- [ ] Prompt version is stored.
- [ ] Model name/version is stored.
- [ ] `store: false` decision implemented for privacy-sensitive processing.
- [ ] AI never invents price/availability/booking confirmation.

---

## 9. Security and Privacy

- [ ] Security headers added.
- [ ] CSP report-only or enforced decision made.
- [ ] No real secrets in repo.
- [ ] Secret scan performed.
- [ ] Security event logging exists for sensitive failures/actions.
- [ ] Privacy modes are represented in behavior.
- [ ] Consent notice is visible on public quote form.
- [ ] Delete/minimize request handling process exists.
- [ ] Privacy incident register process exists.
- [ ] Owner/admin accounts use MFA on Supabase/GitHub.

---

## 10. UI/UX Acceptance

- [ ] Auth pages look correct at 1440px / 100% zoom.
- [ ] Dashboard looks correct at 1440px / 100% zoom.
- [ ] Configuration page looks correct at 1440px / 100% zoom.
- [ ] Leads page looks correct at 1440px / 100% zoom.
- [ ] Lead detail looks correct at 1440px / 100% zoom.
- [ ] Public quote page is mobile-friendly.
- [ ] No page requires 75% or 50% zoom to feel correct.
- [ ] Buttons do not wrap awkwardly.
- [ ] Empty/loading/error/success states exist.
- [ ] No internal developer language appears.

---

## 11. Accessibility QA

- [ ] Keyboard can reach all controls.
- [ ] Focus states are visible.
- [ ] Inputs have visible labels.
- [ ] Errors are associated with fields or form region.
- [ ] Color is not the only status signal.
- [ ] Icon-only buttons have accessible names.
- [ ] Public quote form works on mobile viewport.
- [ ] Auth form works on mobile viewport.

---

## 12. Demo and Sales Readiness

- [ ] Demo business exists.
- [ ] Demo quote link works.
- [ ] Demo lead can be created.
- [ ] Demo lead can be reviewed.
- [ ] AI draft can be generated/copied.
- [ ] Outcome can be marked.
- [ ] Dashboard shows honest proof metrics.
- [ ] GTM offer is clear.
- [ ] Founder setup price and monthly price are ready.
- [ ] Sales demo script matches current product.

---

## 13. Final Launch Decision

Sales-ready MVP can start only when:

```text
Build health passes
+ RLS tests pass
+ public quote flow passes
+ UI 100% zoom passes
+ privacy/security checklist is acceptable
+ demo flow works end-to-end
```

---

## 14. Definition of Done

This checklist is complete when every item is checked or explicitly marked as:

```text
Accepted Risk — with reason and owner/date
```

No silent exceptions.

## Hardening Addendum — Sales-Ready Priority Gate v1.6

Before first serious sales outreach, complete or explicitly defer with risk approval:

### Must Complete

- public quote RLS hardening,
- explicit GRANT verification,
- public submit abuse protection,
- honeypot/spam friction,
- RLS test command wired into package scripts,
- AI structured output validation,
- AI metadata/error cleanup,
- server-only/DTO boundary audit,
- safe error messages for public quote/auth/dashboard actions,
- Magic Moment sample lead state,
- 100% zoom dashboard UX QA,
- founder onboarding checklist.

### Should Complete Early

- CSP report-only,
- security headers baseline,
- Founder CRM spreadsheet/template,
- landing copy rewrite,
- validation metrics tracking.

### Must Not Add Before Gate

- booking,
- invoices,
- autonomous sending,
- vertical expansion,
- marketplace,
- advanced analytics.
