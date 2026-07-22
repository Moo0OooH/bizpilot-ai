# BizPilot AI - Plan Entitlements and Manual Billing Spec v1.0

## Purpose

Define pilot-stage plans and access rules without adding a billing engine. BizPilot can sell and run early pilots through manual plan assignment while Stripe Billing remains deferred.

## Plan Values

### Founder Pilot

For first validation customers.

```text
first 1-5 pilot customers
$0 founder-led setup
30- and 60-day feedback commitment
public quote page
lead recovery dashboard
AI summary
AI reply draft
AI follow-up draft
manual copy/send only
limited support
```

### Starter

For a simple cleaning-business workflow.

```text
customers 6-20
$149 setup
$49/month
1 quote page
lead workspace
basic AI drafts
manual follow-up visibility
basic branding
```

### Pro

For a stronger paid pilot/customer.

```text
after first 20 customers or after credible proof
$199 setup
$79/month
stronger branded quote page
more customization
follow-up drafts
better lead organization
priority setup
simple usage insights
```

### Paused

For access interruption without deleting data.

```text
dashboard blocked or limited
public quote link disabled
data retained
owner message shown
```

## Premium operational add-ons

Premium Operations add-ons are sold separately from every base plan. They are not implicitly included in Founder Pilot, Starter, or Pro, and they do not create a billing engine or self-serve checkout.

| Add-on | Entitlement key | Access rule |
| --- | --- | --- |
| Priority Workbench | `priority_workbench` | Explicitly activate for owner-defined priority rules and ranked lead search. |
| Bulk Reply Review | `bulk_reply_review` | Explicitly activate for manager-reviewed group reply drafts and manual copy records. |
| Availability Coordination | `availability_coordination` | Explicitly activate for internal time blocks, conflict alerts, and review-only availability drafts. |

- An internal operator controls the entitlement record with `enabled`, `trial`, `disabled`, or `expired` status; an expired trial is not active.
- Every add-on remains manual-first: no automatic delivery, public scheduling, booking confirmation, invoice, or payment is introduced.
- Pricing, invoicing, and any Stripe Payment Link remain separate operational processes until a later billing project is explicitly approved.
- The full product and QA contract lives in `docs/product/BIZPILOT_PREMIUM_OPERATIONS_ADDONS_v1.0.md`.

## Manual Billing Standard

- No automated billing dependency before validation.
- Payment may be collected through invoice or a separate Stripe Payment Link.
- Plan assignment is changed manually from `/admin`.
- Staged pilot terms are approved in `docs/business/PILOT_TERMS_DECISION_GATE.md`.
- Before collecting payment, create or verify the manual invoice or Stripe Payment Link process.
- Real paid pilots remain blocked until production/data readiness gates are closed.

## Entitlement Rules

| Plan | Dashboard | Public Quote Link | AI Drafts | Notes |
| --- | --- | --- | --- | --- |
| Founder Pilot | Enabled while business active/onboarding | Enabled while active | Manual owner-reviewed only | First validation customers |
| Starter | Enabled while business active/onboarding | Enabled while active | Manual owner-reviewed only | Single quote workflow |
| Pro | Enabled while business active/onboarding | Enabled while active | Manual owner-reviewed only | More founder support |
| Paused | Blocked or limited | Disabled | Disabled by access gate | Data retained |

## Non-Goals

- No Stripe subscription sync.
- No customer self-serve billing portal.
- No invoice generation inside BizPilot.
- No usage-based billing automation.
- No autonomous AI operator behavior.
- No automatic Premium Operations add-on activation, customer self-serve purchase, or public booking/calendar workflow.
