# BizPilot AI — Founder Admin Mini Console Spec v1.0

## Purpose
Define a lightweight internal console for MoOoH to manage pilot businesses, users, plans, and onboarding without building an enterprise admin product.

## Timing
Build before serious paid pilots or payment-ready trials so the founder can
manually activate, pause, suspend, and annotate early businesses without
touching the database directly.

Recommended timing: Phase 18C founder control layer.

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
- status: onboarding / active / suspended / cancelled
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

## Phase 18C Update

Outreach and sales tracking can stay in the Founder CRM workbook first. Account
control fields belong in `/admin` before real paid pilots.
