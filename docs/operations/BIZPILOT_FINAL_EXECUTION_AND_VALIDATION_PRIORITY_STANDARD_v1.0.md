# BizPilot Final Execution And Validation Priority Standard v1.0

Date: 2026-06-01
Status: Active Priority Override Standard
Source artifact: `docs/operations/BIZPILOT_FINAL_EXECUTION_AND_VALIDATION_PRIORITY_STANDARD_v1.0.pdf`

## Purpose

This standard defines the final execution order for BizPilot before first real pilot validation. It overrides older priority interpretations when there is a conflict between infrastructure completion, product polish, demo readiness, and customer validation.

## Executive Decision

BizPilot does not require a strategic reset.

The product direction remains:

> BizPilot = Lead Recovery & Response System for cleaning businesses.

Core workflow:

> Public Quote Intake -> Lead Organization -> AI Summary -> AI Draft -> Owner Review -> Manual Response

The primary risk is no longer infrastructure readiness. The primary risk is:

- Product readiness
- Demo readiness
- Customer validation

## Current State

### Infrastructure

Status: Production-ready foundation.

Completed:

- Auth
- Custom SMTP
- Email confirmation
- Password reset
- Production deployment
- Domain/DNS
- Backup proof
- Restore proof
- DB-level recovery proof
- Security baseline
- Manual-only pilot decision

### Product

Status: Needs final polish.

Main concerns:

- Homepage quality
- Dashboard quality
- Lead workspace polish
- Email template quality
- Demo readiness
- Founder confidence

## Readiness Layers

BizPilot readiness must be evaluated in four separate layers.

### Layer 1 - Infrastructure Readiness

Includes:

- Auth
- SMTP
- Deployments
- Database
- Backup
- Restore
- Security
- DNS

Current status: Mostly complete.

### Layer 2 - Product Readiness

Includes:

- Homepage
- Dashboard
- Lead workspace
- Lead detail
- Email templates
- Empty states
- Loading states
- Error states

Current status: Incomplete.

This layer must be completed before outreach.

### Layer 3 - Demo Readiness

Includes:

- End-to-end smoke
- Demo scenario
- Demo script
- Demo video

Current status: Not complete.

### Layer 4 - Market Validation

Includes:

- Outreach
- Demo calls
- Pilot conversations
- First pilot customers

Current status: Not started.

## Phase 24F - Final No-Secret Production Smoke

Priority: P0.

Requirements:

- Public routes
- Auth routes
- Dashboard routes
- Lead workflow
- AI workflow
- Password reset
- Email confirmation

Evidence must be sanitized.

Never record:

- Secrets
- Tokens
- Passwords
- Customer data
- Provider output

## Phase 24G - Explicit Owner Approval

Priority: P0.

Must record:

- Date
- Approver
- Scope
- Pilot constraints

This approval is required before real customer data.

## Product Readiness Sprint

Priority: Highest product priority.

Complete before outreach.

### Homepage

Review:

- Positioning
- Trust
- Clarity
- CTA
- Cleaning focus

Goal: 30-second understanding.

### Dashboard

Review:

- Layout
- Density
- Clarity
- Owner workflow
- Queue usability

Goal: 60-second first value.

### Lead Workspace

Review:

- Lead detail
- AI summary
- AI draft
- Follow-up flow

Goal: Owner can act immediately.

### Email Templates

Create:

- Initial reply
- Follow-up
- Re-engagement

Requirements:

- Manual send only
- No auto-send
- No automation

### Empty States

Review:

- Dashboard
- Leads
- AI panels

Goal: No dead screens.

### Error States

Review:

- Auth
- AI
- Lead intake
- Dashboard actions

Goal: Professional failure experience.

## Demo Readiness Sprint

Priority: Before outreach.

### End-To-End Smoke

Run:

1. Signup
2. Verify email
3. Login
4. Create business
5. Submit lead
6. Dashboard
7. AI summary
8. AI draft
9. Copy reply
10. Logout
11. Password reset
12. Login again

Record sanitized results.

### Demo Scenario

Duration: 3 to 5 minutes.

Flow:

> Lead arrives -> Dashboard -> AI Summary -> AI Draft -> Manual Review -> Manual Response

### Demo Video

Duration: 60 to 120 seconds.

Structure:

> Problem -> Lost Lead -> BizPilot -> Faster Response -> Call To Action

## Customer Validation Sprint

Priority: Before feature expansion.

### Outreach Target

Initial target: 20 to 30 cleaning businesses.

Sources:

- Google Maps
- Websites
- Facebook
- Instagram
- LinkedIn

### Founder-Led Outreach

Preferred:

- Email
- DM
- Demo call

Not preferred:

- Paid ads
- SEO
- Large content campaigns

### Pilot Rules

Pilot remains manual only.

Allowed:

- Manual dashboard review
- AI draft generation
- Manual copy/send

Not allowed:

- Auto-send
- SMS automation
- WhatsApp automation
- Booking
- Invoicing
- CRM expansion

## P1 After Validation

Only after real validation evidence.

Includes:

- Owner notes
- Source attribution
- Validation dashboard
- Payment process
- Support process
- French pilot expansion
- Strict restored app/RLS proof

## P2 Hardening

Includes:

- IP hash salt
- Abuse retention cleanup
- Privacy registers
- Security registers
- CSP hardening
- Node runtime enforcement
- Workflow cleanup
- Header cleanup

## P3 Future Scope

Do not build before validation.

Includes:

- Owner notification email
- Customer email automation
- SMS
- WhatsApp
- Booking engine
- Invoices
- Billing automation
- Calendar sync
- Multi-vertical expansion
- Full CRM
- Autonomous AI

## Validation Override Rule

Highest priority rule:

If a task does not directly improve one of the following, it may not take priority over the listed execution priorities.

Direct improvement categories:

- Real-data readiness
- Product readiness
- Demo readiness
- Customer validation

Execution priorities:

1. Homepage polish
2. Dashboard polish
3. Email templates
4. End-to-end smoke test
5. Demo creation
6. Demo video
7. Customer outreach

Feature expansion is forbidden until validation evidence exists.

## Final Strategic Statement

Current BizPilot objective is no longer:

> Can we build it?

Current BizPilot objective is:

> Will real cleaning businesses use it?

Every priority decision must be evaluated through that lens.
