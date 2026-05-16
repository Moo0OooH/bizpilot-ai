# BizPilot AI — Dashboard UX Standard v1.0

**Project:** BizPilot AI
**Document Type:** Dashboard UX / Information Architecture Standard
**Version:** v1.0
**Status:** Final Canonical Draft — Phase 5 Alignment Synced
**Owner:** MoOoH
**Phase:** Phase 5 Stabilization / Completion Candidate; Phase 6 Foundation Started
**Last Updated:** 2026-05-11

---

## Current Phase Status — 2026-05-11

The dashboard IA is implemented as part of Phase 5 stabilization. Phase 6 foundation has started with a manual, on-demand AI Lead Assistant. Full Phase 6 remains open.

Dashboard copy and layout should stay focused on quote requests, reply urgency, follow-up discipline, public quote link visibility, business readiness, and recovery proof.

Do not introduce AI auto-send, email sending, billing, booking, integrations, generic CRM scope, or upgrade-oriented marketing blocks in the Phase 5 dashboard.

---

## 1. Purpose

This document defines the canonical dashboard user experience and information architecture for BizPilot AI.

The goal is to prevent dashboard pages from becoming scattered, duplicated, or configuration-heavy.

BizPilot’s dashboard must feel like a focused **Lead Conversion Desk**, not a generic admin panel.

---

## 2. Final Dashboard Route Decisions

The canonical dashboard routes are:

```text
/dashboard                     = Dashboard Overview
/dashboard/configuration       = Business Configuration
/dashboard/leads               = Leads
/dashboard/leads/[leadId]      = Lead Detail
/dashboard/actions             = Today’s Actions / operational action view later
/dashboard/concierge           = Concierge Setup, later/internal
/dashboard/demo                = Demo Generator, later/internal
```

Important decision:

```text
/dashboard is not Business Configuration.
```

`/dashboard` is the operational overview for the business owner.

Business setup and configuration belong to:

```text
/dashboard/configuration
```

---

## 3. Dashboard Overview

`/dashboard` must provide a quick operational overview.

It should include:

- Business Readiness
- Recent Leads
- Today’s Actions
- Public Quote Link
- Quick Actions
- Revenue Recovery Proof later
- Optional response urgency summary later

Dashboard Overview answers:

```text
What should the owner do today?
Is the quote link ready?
Are there new leads?
Are there leads needing reply or follow-up?
Is the business setup ready enough to receive leads?
```

Dashboard Overview must not be a raw configuration form.

---

## 4. Business Configuration

`/dashboard/configuration` is the canonical business setup workspace.

It should include:

- Business profile
- Branding
- Public quote link settings
- Services
- Service areas
- FAQ
- Privacy mode
- Consent settings
- Editable Cleaning Template
- Template preview
- Branding preview
- Business readiness indicators

Business Configuration must contain only page-specific content.

The shared sidebar, header, and protected dashboard shell must not be duplicated inside the page.

---

## 5. Navigation Model

BizPilot uses two levels of navigation.

### 5.1 App-Level Navigation

App-level navigation is global inside the protected dashboard shell.

Primary items:

```text
Dashboard Overview
Leads
Business Configuration
```

Later/internal items:

```text
Concierge
Demo
Actions
```

### 5.2 Page-Level Navigation

Page-level navigation is allowed only inside a page when the page has multiple sections.

Examples:

- Configuration accordion sections
- Lead detail internal sections
- Template customization sections

Page-level navigation must not duplicate the sidebar.

---

## 6. Active Navigation Rules

Canonical active nav rules:

```text
/dashboard                => Dashboard Overview
/dashboard/leads*         => Leads
/dashboard/configuration  => Business Configuration
```

Rules:

- `/dashboard` must not activate Configuration.
- `/dashboard/leads/[leadId]` must activate Leads.
- Page-level state must not override app-level route selection.

---

## 7. Protected Dashboard Shell

All protected dashboard pages must use the shared dashboard shell.

Canonical files:

```text
app/(dashboard)/layout.tsx
components/dashboard/dashboard-shell.tsx
components/dashboard/dashboard-sidebar.tsx
```

The shell owns:

- Protected dashboard layout
- Sidebar
- Header area when shared
- App-level navigation
- Common spacing and page frame
- Responsive dashboard structure

Pages own only:

- Page title / page-specific header if needed
- Page-specific content
- Page-specific actions
- Page-specific right rail content when applicable

---

## 8. Page Responsibilities

Dashboard pages must not duplicate shell responsibilities.

Pages must not contain:

- Repeated sidebar code
- Repeated global dashboard header
- Repeated app-level navigation
- Shell-level responsive layout logic

Pages may contain:

- Page-specific cards
- Page-specific forms
- Page-specific tables
- Page-specific right rail content
- Page-specific save bars

---

## 9. Right Rail Rules

The right rail must be operational, not duplicate navigation.

Allowed right rail content:

- Readiness hints
- Lead context
- Quote link placement guidance
- Save status
- Preview
- Operational checklist
- Recovery guidance tied to the current workflow

Not allowed:

- Repeating sidebar navigation
- App-level route links already in the sidebar
- Generic marketing content
- Unrelated analytics

---

## 10. Sticky Bottom Save Bar

A sticky bottom save bar is allowed only in Business Configuration.

Allowed route:

```text
/dashboard/configuration
```

Purpose:

- Save configuration changes
- Show unsaved state
- Show active save progress
- Show brand-colored save action

Not allowed:

- Global dashboard overview
- Lead list
- Lead detail unless a future edit mode requires it
- Marketing pages

---

## 11. Business Configuration UX Pattern

Business Configuration should use a guided accordion or guided setup model.

It must not feel like a raw database form.

Recommended sections:

1. Business Basics
2. Branding
3. Services
4. Service Areas
5. FAQ
6. Quote Link and Public Page
7. Cleaning Template
8. Privacy and Consent
9. Preview and Publish Readiness

Each section should clearly show:

- Completion state
- Required missing items
- Save state when relevant
- Simple explanation of why the section matters

---

## 12. Cleaning Template UX

The Cleaning Template editor should be compact and practical.

Canonical UX:

```text
compact row + inline customize
```

Each field row may show:

- Field label
- Field type
- Required/optional state
- Active/inactive state
- Order
- Inline customize action
- Preview impact when useful

The MVP must not include:

- Drag-and-drop builder
- Complex conditional logic
- Multi-step funnel builder
- Template marketplace
- Advanced visual form designer

---

## 13. Branding Preview Rules

Business Configuration must include a branding preview.

The preview should show:

- Business name
- Brand color
- Public quote page style preview
- Primary CTA preview
- Optional logo placeholder
- Form preview where practical

Brand colors should influence:

- Preview
- Save action
- Active states
- Progress/readiness accents
- Public quote page styling

Do not overuse brand colors in a way that harms accessibility.

---

## 14. Dashboard Overview Content Rules

Dashboard Overview should include:

### 14.1 Business Readiness

Show whether the business is ready to receive leads.

Examples:

- Add services
- Add service areas
- Add FAQ
- Configure quote template
- Place public quote link

### 14.2 Recent Leads

Show the latest submitted leads with status and urgency.

### 14.3 Today’s Actions

Show only focused operational actions.

Canonical CTAs:

```text
Reply
Ask Info
Follow-up
```

### 14.4 Public Quote Link

Show the public quote link and copy action.

Also show placement guidance later:

- Website
- Instagram
- Facebook
- Google Business Profile
- DM/SMS saved reply

### 14.5 Quick Actions

Examples:

- Copy quote link
- Add service
- Customize template
- View leads
- Open public quote page

---

## 15. Leads UX

`/dashboard/leads` and `/dashboard/leads/[leadId]` must live inside the same protected dashboard shell.

Lead list should show:

- Lead name/contact summary
- Service type
- Lead Quality
- Response SLA State
- Status
- Source channel when available
- Created time

Lead detail should show:

- Customer request
- Submitted values
- Missing info
- Lead quality explanation
- Response SLA
- Manual Phase 6 AI Lead Assistant only when scoped to lead detail; no AI auto-send, booking confirmation, or invented pricing/availability
- Follow-up guidance
- Manual outcome
- Lead events timeline

---

## 16. Save Redirect Rule

Any save or redirect related to business configuration must target:

```text
/dashboard/configuration
```

Do not redirect configuration saves to:

```text
/dashboard
```

Because `/dashboard` is the operational overview.

---

## 17. Server / Client Boundary UX Rule

Dashboard shell components should stay as server components where possible.

Client components should be used only for:

- Interactive forms
- Accordions
- Inline customization
- Copy buttons
- Save bars
- Optimistic UI where useful

Do not turn the entire dashboard shell into a client component unless required.

---

## 18. Definition of Done

This document is complete when:

- `/dashboard` is locked as Dashboard Overview.
- `/dashboard/configuration` is locked as Business Configuration.
- Two-level navigation is defined.
- Shared protected dashboard shell is required.
- Right rail rules are defined.
- Sticky save bar rule is defined.
- Configuration accordion UX is defined.
- Cleaning Template compact row UX is defined.
- Branding preview rules are defined.
- Active nav rules are defined.

## UX Addendum — First Three-Minute Magic Moment v1.6

The dashboard must not feel empty, confusing, or configuration-first during the first session.

### Required First-Use State

If the owner has no real leads yet, show a realistic sample cleaning lead with:

- clear “sample” label,
- lead type such as move-out cleaning or deep cleaning,
- urgency/status badge,
- AI summary,
- suggested reply draft,
- follow-up risk or next action,
- CTA to review reply,
- CTA to share/publish quote link.

### First-Use Goal

Within three minutes, the owner should understand:

- what problem BizPilot solves,
- what a useful lead looks like,
- how AI helps without taking control,
- what action to take next.

### Empty State Rule

Empty states must teach and guide. They must not leave the owner staring at blank tables or generic setup instructions.
