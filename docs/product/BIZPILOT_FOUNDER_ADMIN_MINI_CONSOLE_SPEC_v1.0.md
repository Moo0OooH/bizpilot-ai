# BizPilot AI — Founder Admin Mini Console Spec v1.0

## Purpose
Define a lightweight internal console for MoOoH to manage pilot businesses, users, plans, and onboarding without building an enterprise admin product.

## Timing
Build after:
1. homepage/pricing/auth polish,
2. dashboard Magic Moment stable,
3. at least one real pilot business onboarded.

Recommended timing: late Phase 18 or start of Phase 19.

## Route
`/admin` or `/internal`

## Access
- Founder-only.
- Protected by strict authorization.
- Not visible in public nav.
- No customer access.

## MVP Modules
### Businesses
- business name
- owner email
- plan
- status: lead / onboarding / active pilot / paying / paused
- quote link status
- created_at
- last activity

### Users
- user email
- linked business
- role
- onboarding state

### Plan Assignment
Manual plan assignment:
- Founder Pilot
- Starter
- Pro
- Paused

### Pilot Tracking
- lead count
- AI draft count
- copied/edit usage count where available
- quote link placements
- notes
- next follow-up date

### Support Notes
- customer objections
- setup notes
- testimonial notes
- churn risk

## Non-Goals
- No enterprise RBAC.
- No complex analytics warehouse.
- No automated billing engine.
- No support ticketing system.
- No bulk email automation.
