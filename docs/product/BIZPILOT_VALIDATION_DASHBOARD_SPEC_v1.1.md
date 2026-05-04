# BizPilot AI — Validation Dashboard Spec v1.1

**Project:** BizPilot AI  
**Document Type:** Validation Dashboard Specification  
**Version:** v1.1  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Purpose

This document defines the validation metrics required before BizPilot expands beyond the MVP.

The dashboard exists to answer:

```text
Should we keep building, fix the offer, or pivot?
```

---

## 2. Validation Gate

Before Phase 8 or expansion:

- 3 businesses onboarded
- 30 real or semi-real leads submitted
- 50% owner review rate
- 30% AI draft copy/edit rate
- 1 paying or payment-ready customer
- At least 2 active public link placements per business
- At least 20% leads with source_channel tracked
- Time-to-Value <= 20 minutes

---

## 3. 90-Day Target

Target after launch effort:

- 5 paying or payment-ready businesses
- $500-$1,500 CAD MRR
- 50+ submitted leads
- AI Draft Adoption >= 30%
- Owner Review Rate >= 50%

---

## 4. Core Metrics

### Business metrics

- businesses_onboarded
- paying_customers
- payment_ready_customers
- MRR
- setup_revenue
- churn_risk_notes

### Product metrics

- leads_submitted
- owner_review_rate
- ai_draft_copy_rate
- follow_up_action_rate
- manual_outcome_completion_rate
- time_to_value_minutes

### Channel metrics

- source_channel
- source_channel_coverage
- public_link_placements
- leads_by_source
- best_source_channel

### AI cost metrics

- ai_calls
- input_tokens
- output_tokens
- cached_tokens
- estimated_cost
- cost_per_lead
- ai_cost_percent_of_revenue

---

## 5. Revenue Recovery Proof

Show simple proof:

```text
This week:
- Quote requests captured
- AI drafts copied
- Follow-ups due
- Overdue leads recovered
- Strong leads acted on
- Outcomes marked
```

This should be visible to owners.

---

## 6. Continue Criteria

Continue if:

- Owners review leads.
- Owners copy/edit AI drafts.
- Public links are placed.
- At least one customer pays or is payment-ready.
- Leads are submitted through real or semi-real usage.
- Setup can be completed under 20 minutes.
- Support effort remains reasonable compared to revenue.

---

## 7. Fix Criteria

Fix positioning/onboarding if:

- Leads submit but owners do not review.
- AI drafts are not used.
- Public links are not placed.
- Demo does not convert.
- Setup takes too long.
- Owners see it as just another form.
- Cost per lead rises without perceived value.

---

## 8. Stop or Pivot Criteria

Stop or pivot if:

- 10 real demos produce no payment-ready interest.
- 3 businesses onboard but no real leads arrive.
- Owners only want a form and will not pay for AI/desk value.
- Support effort exceeds revenue.
- AI value is not understood or used.
- Cleaning market feedback consistently rejects the quote-recovery positioning.

---

## 9. Validation Dashboard UI

The dashboard may start as an internal admin/concierge view.

Minimum cards:

- Businesses onboarded
- Leads submitted
- Owner review rate
- AI draft adoption
- Public link placements
- Source channel coverage
- Time-to-Value
- MRR/payment readiness
- AI cost per lead
- Top validation risks

---

## 10. Definition of Done

This dashboard spec is complete when:

- Validation Gate is measurable.
- AI adoption is measurable.
- Source tracking is measurable.
- Time-to-Value is measurable.
- Revenue Recovery Proof is defined.
- Continue/fix/pivot criteria are explicit.
