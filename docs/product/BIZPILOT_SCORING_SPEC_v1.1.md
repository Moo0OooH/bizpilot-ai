# BizPilot AI — Scoring Spec v1.1

**Project:** BizPilot AI  
**Document Type:** Product Scoring Specification  
**Version:** v1.1  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Purpose

This document defines rule-based scoring and action logic for BizPilot MVP.

The MVP must be rule-first and AI-assisted later.

The scoring system exists to help owners know:

- Which leads are strong
- Which leads need more information
- Which leads are overdue
- Which leads need follow-up
- What action to take today
- Whether BizPilot is helping convert leads into outcomes

---

## 2. Lead Quality Score

Canonical levels:

- Strong
- Good
- Needs Info
- Low Fit

---

## 3. Strong Lead

A lead is Strong when:

- Customer contact exists
- Service type exists
- Service area matches business
- Preferred date or timing exists
- Required fields are complete
- Request is clear enough to reply

Example:

```text
Strong = contact + service + area + timing + required fields complete
```

---

## 4. Good Lead

A lead is Good when:

- Contact exists
- Service exists
- Area exists
- Required fields mostly complete
- Some optional details missing

Example:

```text
Good = contact + service + area complete, optional details missing
```

---

## 5. Needs Info Lead

A lead is Needs Info when important quote details are missing.

Examples:

- Missing preferred date
- Missing time window
- Missing bathrooms
- Missing bedrooms
- Missing property type
- Missing phone/email
- Service type unclear

---

## 6. Low Fit Lead

A lead is Low Fit when:

- Outside service area
- Unsupported service
- Unclear request
- Spam-like submission
- Missing core contact data
- Business cannot reasonably respond

---

## 7. Intake Completeness Score

Suggested calculation:

```text
Required fields completed: 60%
Important optional fields completed: 20%
Contact quality: 10%
Service-area match: 10%
```

Outputs:

- Complete
- Mostly Complete
- Needs Info
- Poor

---

## 8. Missing Info Detection

MVP is rule-based.

Cleaning rules:

- Missing cleaning type
- Missing property type
- Missing bedrooms
- Missing bathrooms
- Missing preferred date
- Missing preferred time window
- Missing service area
- Missing contact
- Outside service area

---

## 9. Response SLA State

States:

- New — not reviewed yet
- Viewed — no reply copied yet
- Reply copied — waiting for booked/lost
- Follow-up due today
- Overdue

Suggested fields:

- first_viewed_at
- first_reply_copied_at
- last_owner_action_at
- response_status
- response_sla_state
- first_response_latency

---

## 10. Follow-Up Needed Rule

A lead should be marked or suggested as Follow-Up Needed when:

- New for more than 24 hours
- Replied but not booked after 48 hours
- Missing info requested but unresolved
- Owner manually marks follow-up

No automatic customer messaging is allowed.

---

## 11. Next Best Action

Allowed actions:

- Reply now
- Ask missing info
- Follow up today
- Mark as booked
- Archive low-fit lead

The action panel must remain simple.

MVP Today’s Action Panel should show only:

- Reply
- Ask Info
- Follow-up

---

## 12. Manual Outcome Tracking

Allowed manual outcomes:

- Booked
- Lost
- No response
- Not a fit
- Asked info

Manual outcomes help validate whether BizPilot contributes to bookings without building a booking engine.

---

## 13. Revenue Recovery Proof Inputs

Revenue Recovery Proof may aggregate:

- quote_requests_captured
- leads_reviewed
- ai_drafts_copied
- follow_ups_due
- follow_ups_completed
- overdue_leads_recovered
- strong_leads_acted_on
- outcomes_marked

This is lightweight proof, not an analytics warehouse.

---

## 14. AI Enhancement

In Phase 6, AI may enhance:

- Lead quality explanation
- Missing info reasoning
- Suggested reply wording
- Follow-up draft
- Suggested next action

AI must not replace rule-based core scoring.

---

## 15. Definition of Done

This spec is complete when:

- Lead quality levels are defined.
- Missing info rules are defined.
- Response SLA states are defined.
- Follow-up rule is defined.
- Manual outcomes are defined.
- Revenue recovery inputs are defined.
- AI remains assistant-only.
