# BizPilot AI — Risk Register and Decision Rules v1.0

**Project:** BizPilot AI  
**Document Type:** Risk Register / Decision Rules  
**Version:** v1.0  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Purpose

This document defines the main startup, product, market, technical, cost, and execution risks for BizPilot.

It also defines rules for continuing, fixing, stopping, or pivoting.

---

## 2. Main Risks

### Risk 1 — Product becomes “just another form”

Mitigation:

- Sell quote recovery, not forms.
- Show Lead Conversion Desk and Revenue Recovery Proof in demo.
- Track AI draft usage and owner review rate.

### Risk 2 — Scope creep into CRM/booking

Mitigation:

- Keep booking, CRM, calendar sync, and automation blocked until validation.
- Use Manual Outcome Tracking instead of booking engine.

### Risk 3 — Server/AI cost grows before revenue

Mitigation:

- Rule-first logic.
- AI-on-demand.
- Cached outputs.
- No background workers.
- Track cost per lead.

### Risk 4 — Cleaning businesses do not pay

Mitigation:

- Demo 10 real businesses.
- Offer done-for-you setup.
- Use Founder Plus as default.
- Pivot messaging if owners only see it as a form.

### Risk 5 — Owners do not use dashboard

Mitigation:

- Keep Today’s Action Panel simple.
- Show only Reply, Ask Info, Follow-up.
- Send owner email notifications in Sales-Ready phase.

### Risk 6 — AI drafts are not useful

Mitigation:

- Use FAQ and service context.
- Keep owner in control.
- Add useful / needs edit / not useful feedback later.
- Improve prompts from real examples.

### Risk 7 — Public links are not placed

Mitigation:

- Public Link Placement Guide.
- Require at least 2 placements per business for validation.
- Concierge setup includes placement support.

---

## 3. Continue Rules

Continue if:

- Owners review leads.
- Owners copy/edit AI drafts.
- Businesses place public links.
- At least one customer pays or is payment-ready.
- Leads are submitted through real or semi-real usage.
- Setup stays under 20 minutes.

---

## 4. Fix Rules

Fix positioning/onboarding if:

- Leads submit but owners do not review.
- AI drafts are not used.
- Public links are not placed.
- Demo does not convert.
- Setup takes too long.
- Owners describe BizPilot as “just a form.”

---

## 5. Stop or Pivot Rules

Stop or pivot if:

- 10 real demos produce no payment-ready interest.
- 3 businesses onboard but no real leads arrive.
- Owners only want a form and will not pay for AI/desk value.
- Support effort exceeds revenue.
- AI value is not understood or used.

---

## 6. Decision Cadence

Review every 2 weeks during validation:

- Sales conversations
- Demo conversion
- Business onboarding friction
- Lead volume
- Owner review behavior
- AI adoption
- Cost per lead
- Support effort

Do not expand features until validation gate is passed.

---

## 7. Definition of Done

This risk register is complete when:

- Core risks are explicit.
- Mitigations are defined.
- Continue/fix/stop rules are defined.
- Decision cadence is defined.

## Risk Addendum — v1.6 Business Survival Risks

### Risk 8 — Product stays software-complete but sales-incomplete

If the project keeps adding features without founder-led sales and customer discovery, it may become technically strong but commercially unvalidated.

**Mitigation:** weekly outreach, demos, objection tracking, and pilot follow-up.

### Risk 9 — First dashboard session fails to explain value

If owners see an empty or configuration-heavy dashboard, they may not understand the value quickly.

**Mitigation:** Magic Moment sample lead state and clear first-use CTA.

### Risk 10 — Public quote abuse or RLS gap before trust is established

A security issue in the public quote flow would damage trust before the product has traction.

**Mitigation:** public quote hardening, explicit GRANT verification, RLS tests, abuse protection.

### Risk 11 — AI becomes the product instead of the helper

If AI becomes verbose, autonomous, or gimmicky, the product may lose trust.

**Mitigation:** constrained, structured, owner-reviewed AI only.
