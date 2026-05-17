# BizPilot AI - Magic Demo Flow v1.0

**Project:** BizPilot AI  
**Document Type:** Magic Demo / Sample Business Setup  
**Version:** v1.0  
**Status:** Required Before Phase 18 Pilot Demos  
**Owner:** MoOoH  
**Last Updated:** 2026-05-17  
**Related:**
- `docs/BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md`
- `docs/product/BIZPILOT_DEMO_GENERATOR_AND_SALES_ASSETS_SPEC_v1.0.md`
- `docs/product/BIZPILOT_DASHBOARD_UX_STANDARD_v1.0.md`
- `docs/product/BIZPILOT_UI_UX_SYSTEM_STANDARD_v1.1.md`
- `docs/gtm/BIZPILOT_GTM_PLAYBOOK_v1.1.md`
- `docs/operations/BIZPILOT_MANUAL_QA_CHECKLIST_v1.0.md`

---

## 1. Purpose

This document locks the pre-Phase-18 demo story for BizPilot AI.

The demo must make one thing obvious:

```text
Cleaning quote requests stop being scattered messages and become organized leads, safe reply drafts, and follow-up actions.
```

The demo must not present BizPilot as a generic AI platform, full CRM, booking tool, marketing automation suite, or autonomous messaging agent.

## 2. Demo Promise

In under three minutes, a cleaning-business owner should understand:

- where customers submit quote requests;
- what details BizPilot captures;
- which quote requests need attention;
- what the owner should do next;
- how AI helps without sending anything automatically.

## 3. Demo Business Setup

Use a realistic but clearly demo-safe cleaning business.

| Field | Recommended demo value |
| --- | --- |
| Business name | Spark & Shine Cleaning Co. |
| Service area | Downtown, West End, North York |
| Services | Move-out cleaning, deep cleaning, recurring home cleaning |
| Quote link slug | `spark-shine-cleaning` |
| Brand tone | Calm, professional, local, trustworthy |
| Primary color | Dark neutral or deep green |
| Consent notice | Customer details are used only to review and respond to the quote request. |

The founder may adapt the business name and service areas to match a prospect, but the demo must remain cleaning-first.

## 4. Required Sample Lead

Use this story when a real lead does not exist yet.

| Field | Sample value |
| --- | --- |
| Customer | Maria Santos |
| Request | Move-out cleaning |
| Property | 2-bedroom apartment |
| Area | Downtown |
| Timing | Before Friday |
| Missing detail | Preferred arrival window |
| Risk | Warm quote request; customer may ask another cleaner if reply is delayed. |
| Next action | Ask for the preferred time window, then prepare the next step manually. |

Required labels:

- `Sample lead`
- `Reply needed`
- `Owner review required`

The sample must never be presented as real customer data.

## 5. Demo Script

### Step 1 - Pain

Say:

```text
Most cleaning quote requests start messy: a DM, a website message, or a quick "how much?" with missing details.
```

### Step 2 - Quote Link

Open `/quote/[slug]`.

Show:

- branded public quote page;
- cleaning-specific fields;
- consent notice;
- no internal dashboard or database language.

### Step 3 - Lead Desk

Open `/dashboard`.

Show:

- Needs Attention strip;
- sample lead or real submitted lead;
- public quote link;
- next best step.

### Step 4 - Lead Detail

Open the lead detail when a real lead exists. If no real lead exists, describe the sample lead card and then show the lead desk flow.

Show:

- quote details;
- missing info;
- recommended action;
- manual status/outcome controls;
- AI lead assistant.

### Step 5 - Owner-Controlled AI

Say:

```text
BizPilot prepares the draft. You still review, copy, and send it yourself.
```

Do not imply automatic SMS, WhatsApp, Instagram, or email sending.

### Step 6 - Close

Say:

```text
The goal is not more software. The goal is faster replies, fewer forgotten quote requests, and better follow-up.
```

## 6. Demo Success Checklist

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Owner understands the quote recovery pain within 30 seconds. | [ ] | [ ] |  |
| Public quote link is visible and understandable. | [ ] | [ ] |  |
| Dashboard shows value before configuration work. | [ ] | [ ] |  |
| Sample/demo lead is clearly labeled. | [ ] | [ ] |  |
| Suggested reply/follow-up action is owner-reviewed. | [ ] | [ ] |  |
| No auto-send, booking, billing, or full CRM claim is made. | [ ] | [ ] |  |
| Founder can complete the core demo in under 3 minutes. | [ ] | [ ] |  |

## 7. Demo Do-Not-Say List

Avoid:

- "AI operating system"
- "full CRM"
- "automatic follow-up"
- "AI messages your customers"
- "booking system"
- "marketing automation"
- "works for every industry"

Use instead:

- "quote recovery"
- "organized leads"
- "reply draft"
- "follow-up action"
- "owner-reviewed"
- "cleaning-business quote link"

## 8. Phase 18 Readiness Rule

Phase 18 can start only when the demo flow is practiced once end-to-end and the founder can show:

```text
public quote link -> captured/illustrated lead -> next action -> owner-reviewed reply draft
```

Any gap found during the dry run must be recorded in `docs/operations/BIZPILOT_MANUAL_QA_CHECKLIST_v1.0.md`.

