# BizPilot AI — UI/UX System Standard v1.1

**Project:** BizPilot AI  
**Document Type:** UI / UX System Standard  
**Version:** v1.1  
**Status:** Active Canonical Standard  
**Owner:** MoOoH  
**Product:** AI Quote Recovery & Lead Conversion Desk  
**Last Updated:** 2026-05-12  

---

## 1. Purpose

This document upgrades the existing UI/UX System Standard v1.0. The original standard is strong and should remain the foundation. v1.1 adds stricter acceptance rules for accessibility, density, responsiveness, and production readiness.

BizPilot must feel like:

```text
Quote Recovery Command Center
```

Not like:

- A generic admin panel.
- A raw developer scaffold.
- A bloated CRM.
- A marketing landing page inside the product.
- A set of disconnected screens.

---

## 2. Core UX Test

Before accepting any screen, answer:

```text
Does this help the business owner capture quote requests, reply faster, follow up better, or complete setup faster?
```

If not, remove or simplify it.

---

## 3. Baseline Viewport and Zoom Standard

Primary design baseline:

```text
1440px desktop width
Chrome zoom 100%
```

Must remain usable at:

```text
1280px
1536px
1920px
```

Zoom QA:

```text
100% = required acceptance baseline
75%  = optional comfort check
50%  = not an acceptance standard
```

A page is not production-ready if it only looks correct at 75% or 50% zoom.

---

## 4. Layout Density Standard

Operational UI should be compact, calm, and readable.

Dashboard shell:

```text
Sidebar: 240px-260px
Topbar: 64px-72px
Desktop content padding: 24px-32px
Section gap: 24px
Card gap: 16px
Main max width: 1440px-1480px inside shell
```

Cards:

```text
Default padding: 20px-24px
Compact padding: 16px
Radius: 10px-14px
Shadow: subtle only
```

Typography:

```text
Page title: 28px-32px
Section title: 18px-20px
Card title: 15px-16px
Body: 14px-15px
Small/meta: 12px-13px
Button: 14px semibold
```

Forbidden:

- Landing-page hero text inside dashboard cards.
- Oversized KPI numbers that dominate the page.
- Buttons wrapping at 100% zoom.
- Cards so large that the user must zoom out to understand the workflow.
- Empty decorative whitespace that pushes real work below the fold.

---

## 5. Accessibility Target

MVP target:

```text
WCAG 2.2 AA for core user flows
```

Core flows:

- Sign in.
- Sign up.
- Dashboard overview.
- Business configuration.
- Public quote form.
- Quote success/error page.
- Leads list.
- Lead detail.
- AI draft review/copy.

Required:

- Keyboard navigation works.
- Focus is visible.
- Color is not the only meaning signal.
- Text contrast is sufficient.
- Interactive controls have accessible names.
- Inputs have visible labels.
- Errors are connected to fields or form regions.
- Loading states are understandable.
- Empty states explain the next step.

---

## 6. Form UX Standard

Forms must be task-shaped, not database-shaped.

Required:

- Visible label for every input.
- Placeholder only as an example, never as the only label.
- Clear required/optional indication.
- Field-level error where possible.
- Form-level error summary for major failures.
- Submit button communicates action.
- Disabled/pending state prevents double submit confusion.
- Success state confirms what happened and what to do next.

Auth form width:

```text
400px-460px
```

Public quote form width:

```text
600px-760px max for readable single-column form
```

Business configuration forms:

```text
Main form width: 720px-900px depending section
Right rail: 300px-360px when useful
```

---

## 7. Button and CTA Standard

One primary CTA per workflow region.

Button heights:

```text
Dashboard standard: 40px-44px
Auth/public primary: 44px-48px
Compact controls: 36px-40px only when dense UI requires it
```

Rules:

- Primary buttons are for the next meaningful action.
- Secondary buttons are for supporting actions.
- Ghost buttons are for low-risk utilities.
- Danger buttons are visually distinct and never default.
- Icon-only buttons require accessible labels.
- Future unavailable features must not look clickable.

---

## 8. Status and Badge Standard

Every status must use:

```text
text + visual style
```

Never use color alone.

Canonical statuses:

```text
Lead quality: Strong / Good / Needs info / Low fit
SLA: New / Viewed / Follow-up due / Overdue / Reply copied
Outcome: Booked / Lost / No response / Not a fit / Asked info
AI: Draft ready / Rule fallback / Needs review / Failed
Public link: Active / Inactive / Draft
```

Rules:

- Do not show “Sent” unless the product actually sent a message.
- Do not show fake analytics.
- Do not use confusing synonyms for the same state.
- Keep badge text short.

---

## 9. Dashboard Overview Standard

The dashboard overview must answer within 5 seconds:

1. Is my quote link active?
2. Do I have new leads?
3. Which leads need action today?
4. Is setup complete enough?
5. What value has BizPilot helped recover?

Required sections:

- Business readiness.
- Public quote link status.
- Today’s actions.
- Recent leads.
- Simple recovery proof.
- Quick actions.

Forbidden:

- Generic analytics wall.
- Empty charts with fake data.
- Internal phase names.
- Developer/debug content.

---

## 10. Leads Workspace Standard

The leads page is a recovery queue, not a generic CRM table.

Required:

- Prioritize new, overdue, follow-up due, and strong leads.
- Show lead quality, status, service type, city/service area, received time, and next action.
- Empty state explains how to get first leads.
- Filters must be useful but not overbuilt.
- Mobile/tablet layout can become cards instead of dense table.

---

## 11. Lead Detail Standard

Lead detail is an owner decision workspace.

Required regions:

- Lead summary.
- Customer/contact/service details.
- Missing info.
- AI draft / follow-up draft if generated.
- Owner actions: copy reply, mark outcome, follow-up state.
- Timeline/events.
- Privacy/consent context where useful.

Rules:

- AI drafts must be clearly labeled as drafts.
- Owner stays in control.
- No auto-send UI unless real sending exists in a later phase.
- Do not imply booking confirmation.

---

## 12. Business Configuration Standard

Configuration should feel guided, not like a settings database.

Recommended structure:

- Business profile.
- Branding.
- Services.
- Service areas.
- FAQ / business context.
- Public quote link.
- Privacy and consent.
- Cleaning quote template.

Required:

- Save state is obvious.
- Sticky bottom save bar only when helpful.
- Preview public quote page.
- Setup completeness visible.
- Sections are grouped by owner task.

---

## 13. Public Quote Page Standard

Public page must feel simple and trustworthy.

Required:

- Business name/branding.
- Clear page title.
- Short explanation.
- Form with visible labels.
- Consent notice near submit.
- Mobile-first readable layout.
- Success page after submit.
- No dashboard/internal language.
- No “AI magic” exaggeration.

Forbidden:

- Long marketing copy.
- Fake guarantees.
- Internal schema/tenant/debug messages.
- Overly complex multi-step flow in MVP.

---

## 14. Empty, Loading, Error, Success States

Every core surface must define:

- Empty state.
- Loading state.
- Error state.
- Success state.

Error messages must be:

- Human.
- Specific enough to act on.
- Safe.
- Non-technical.

Examples:

```text
Bad: relation public.leads does not exist
Good: We couldn't load your leads. Please refresh or try again.

Bad: RLS violation
Good: You don't have access to this business workspace.
```

---

## 15. UI QA Checklist

Before accepting a page:

- Works at 1440px / 100% zoom.
- Works at 1280px / 100% zoom.
- No horizontal overflow.
- Buttons do not wrap awkwardly.
- Form labels are visible.
- Focus states are visible.
- Keyboard-only navigation reaches all controls.
- Empty/loading/error/success states exist.
- No fake data unless clearly demo-mode.
- No internal developer language.
- No page duplicates dashboard shell/nav.
- Mobile layout is usable for public quote/auth pages.

---

## 16. Definition of Done

A BizPilot UI page is done when:

- It supports the product job.
- It passes 100% zoom QA.
- It is accessible enough for WCAG 2.2 AA target on core flows.
- It uses shared shell/components.
- It avoids fake claims and fake analytics.
- It has complete states.
- It feels like a polished quote recovery workspace.
