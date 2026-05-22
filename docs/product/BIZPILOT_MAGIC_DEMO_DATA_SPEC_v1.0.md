# BizPilot AI - Magic Demo Data Spec v1.0

## Purpose

Define the demo data required to show the BizPilot Magic Moment in under three minutes without mixing fake demo leads with real customer leads.

## Magic Moment

The owner should immediately see:

```text
most urgent lead
AI summary
missing info
suggested reply
follow-up risk
suggested next action
manual copy/review controls
```

## Recommended Demo Leads

```text
1. Move-out cleaning - urgent - missing apartment size
2. Deep cleaning - ready for reply
3. Weekly cleaning - needs follow-up
4. Office cleaning - owner copied reply
```

## Data Separation Rule

Demo data must not be mixed with real pilot data.

Allowed approaches:

```text
static demo state in UI
or demo lead rows marked with is_demo = true
or a dedicated demo tenant that is never used for real customers
```

Do not seed demo leads into a real customer's tenant unless the owner explicitly asks for a demo/reset workflow.

## AI Safety

Demo AI output must remain:

```text
summary only
reply draft only
follow-up draft only
manual copy/send only
```

Demo AI output must not:

```text
send automatically
invent prices
confirm availability
confirm bookings
claim SMS/WhatsApp automation
```

## Current Pilot Evidence

Phase 18A live QA created a real tenant-scoped lead and verified the manual AI/copy workflow. A reusable separated demo-data mechanism remains a planned gap before repeated sales demos.

