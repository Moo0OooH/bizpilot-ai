# Product Decision - Owner Notification Email Deferred For First Pilot

**Project:** BizPilot AI
**Date:** 2026-05-30
**Decision owner:** MoOoH
**Status:** Approved

## Decision

Owner notification email is not required for the first BizPilot pilot.

## First Pilot Operating Model

- Manual-only.
- Owner checks dashboard manually.
- No owner notification email.
- No customer-facing email automation.
- No AI auto-send.
- No autonomous workflows.

## Rationale

The first pilot objective is lead recovery validation, workflow validation,
customer feedback, and retention learning.

Email notification infrastructure adds complexity, testing burden,
deliverability risk, and operational overhead without contributing to the
primary validation goal.

## Current Approved Workflow

```text
Customer submits quote
-> Lead stored
-> Lead visible in dashboard
-> Owner reviews lead
-> Owner reviews AI draft
-> Owner manually responds
```

## Out Of Scope For First Pilot

- Owner notification emails.
- Automated lead alerts.
- Customer-facing email automation.
- AI auto-send.
- Autonomous communication workflows.

## Revisit Trigger

Re-evaluate owner notification email only after:

- successful pilot validation,
- active pilot customers,
- demonstrated operational need.

## Implementation Guidance

Do not implement new notification infrastructure based solely on this deferred
feature.

If a future phase revisits owner notifications, it must use the normal feature
entitlement path:

- owner approval,
- Settings state,
- provider/From/Reply-To proof,
- synthetic-only smoke first,
- no customer-facing automation unless separately approved,
- no AI auto-send.
