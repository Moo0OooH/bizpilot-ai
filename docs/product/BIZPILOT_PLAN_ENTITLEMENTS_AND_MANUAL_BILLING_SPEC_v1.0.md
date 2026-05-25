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
