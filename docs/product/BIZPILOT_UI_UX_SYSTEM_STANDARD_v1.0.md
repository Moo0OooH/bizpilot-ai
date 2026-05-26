# BizPilot AI - UI/UX System Standard v1.0

**Project:** BizPilot AI
**Document Type:** Canonical UI / UX System Standard
**Version:** v1.0
**Status:** Canonical Draft / Active Standard
**Owner:** MoOoH
**Product:** AI Quote Recovery & Lead Conversion Desk
**GTM:** Cleaning-first local service businesses
**Last Updated:** 2026-05-12

---

## 1. Design Principles

BizPilot AI must feel like a premium operational quote recovery workspace for local service business owners.

It must not feel like:

- A generic admin dashboard
- A generic CRM
- A marketing landing page inside the product
- A collection of unrelated pages
- A developer scaffold

Every product screen must help the owner do one of these jobs:

- Capture quote requests
- Understand which leads need attention
- Reply faster
- Follow up better
- Complete guided business setup
- Review owner-safe AI assistance
- Track simple, honest recovery proof

Core product rules:

- AI is assistant-only.
- No auto-send.
- No background AI generation unless explicitly designed and approved later.
- No booking confirmation.
- No invented pricing or availability.
- No fake metrics.
- No fake analytics.
- No fake revenue or growth claims.
- No internal phase, tenant, schema, or developer language in user-facing UI.

2026-05-26 expansion update:

Future product expansion is allowed through explicit feature entitlement, owner-controlled activation, Settings visibility, and guide-backed release. Older "do not add" language in this document means "do not fake, default-enable, or overpromise the capability before it is really implemented, validated, and assigned to a feature level." Canonical expansion rules live in `docs/product/BIZPILOT_FEATURE_ENTITLEMENT_AND_GUIDE_STANDARD_v1.0.md`.

Route meaning:

```text
/dashboard                     = Operational overview
/dashboard/leads               = Lead recovery queue
/dashboard/leads/[leadId]      = Owner decision/action workspace
/dashboard/configuration       = Guided business setup
/quote/[slug]                  = Simple customer-facing quote request page
```

Use this product test before accepting any UI change:

```text
Does this help the owner capture quote requests, reply faster, or follow up better?
```

---

## 2. Baseline Viewport

Primary design baseline:

```text
1440px desktop width at Chrome zoom 100%
```

Every designed page must remain usable at:

```text
1280px
1536px
1920px
```

Every polished page must be checked at Chrome zoom:

```text
100%
75%
50%
```

Important rule:

```text
A page is not production-ready if it only feels complete at 75% zoom.
```

At 100% zoom on a 1280px to 1440px desktop viewport:

- Main content must be readable without feeling oversized.
- Primary cards must not dominate the entire page unless the page is intentionally single-purpose.
- Buttons must not wrap.
- Page titles must not look like landing-page hero type inside operational UI.
- Vertical content should fit naturally without excessive scrolling for simple auth and overview entry states.

---

## 3. Breakpoints

Canonical breakpoints:

```text
mobile:           < 768px
tablet/small:     768px-1023px
laptop:           1024px-1279px
desktop baseline: 1280px-1535px
wide:             >= 1536px
```

Breakpoint behavior:

- Mobile: single-column, stacked cards, no dashboard sidebar.
- Tablet/small: compact shell behavior, reduced columns, no uncontrolled horizontal overflow.
- Laptop: dashboard shell may use narrower content density; right rail should be used carefully.
- Desktop baseline: primary design target for operational pages.
- Wide: content may breathe, but must not stretch awkwardly.

Wide viewport rule:

```text
Do not let operational content stretch edge-to-edge just because screen width is available.
```

---

## 4. Dashboard App Shell Rules

All protected dashboard pages must use the shared dashboard shell.

Canonical shell ownership:

```text
app/(dashboard)/layout.tsx
components/dashboard/dashboard-shell.tsx
components/dashboard/dashboard-sidebar.tsx
components/dashboard/dashboard-topbar.tsx
```

Shell targets:

```text
Sidebar width: 240px-260px
Topbar height: 64px-72px
Desktop horizontal content padding: 24px-32px
Desktop vertical content padding: 24px
Main content max width inside shell: about 1440px-1480px
```

The shell owns:

- Sidebar
- Topbar
- App-level navigation
- Authenticated dashboard frame
- Common content padding
- Shell-level responsive structure

Pages own:

- Page title and description
- Page-specific content
- Page-specific CTAs
- Page-specific right rail content
- Page-specific forms, tables, queues, and detail sections

Pages must not duplicate:

- Sidebar code
- Topbar code
- App-level navigation
- Shell spacing logic
- Global dashboard layout logic

---

## 5. Navigation System

Dashboard app-level navigation must remain focused.

Canonical app nav:

```text
Dashboard
Leads
Business Configuration
```

Route activation:

```text
/dashboard                => Dashboard
/dashboard/leads*         => Leads
/dashboard/configuration  => Business Configuration
```

Navigation rules:

- App navigation belongs in the shared dashboard shell.
- Page-level navigation is allowed only for sections inside a complex page.
- Page-level navigation must not duplicate sidebar links.
- Lead detail must keep Leads active.
- Dashboard must not activate Configuration.
- Configuration section tabs or accordions must stay page-specific.

Not allowed:

- Repeating dashboard navigation inside right rails
- Adding fake future nav items that look available
- Hiding core navigation behind unclear icons without text

---

## 6. Page Container Rules

Default dashboard page container:

```text
Max width: 1440px-1480px inside shell
Horizontal padding: 24px-32px desktop
Vertical padding: 24px desktop
Section gap: 24px
Card gap: 16px
```

Page containers must:

- Keep operational content scannable.
- Use restrained width for forms and single-purpose workflows.
- Avoid oversized hero sections inside the dashboard.
- Avoid nested cards unless the inner card is a repeated item, modal-like region, or framed input group.
- Avoid empty decorative areas that push work below the fold.

For two-column dashboard pages:

```text
Main content: minmax(0, 1fr)
Right rail: 300px-360px
Gap: 16px-24px
```

For auth pages:

```text
Form/card width: 400px-460px
Two-column total width: about 960px-1120px
```

---

## 7. Typography Scale

Use this scale unless a local component has a stronger existing standard.

```text
Eyebrow:       12px, uppercase, semibold, tracking-wide
Page title:    28px-32px, bold/semibold
Subtitle:      15px-16px, muted, readable line height
Section title: 18px-20px, semibold
Card title:    15px-16px, semibold
Body:          14px-15px
Small/meta:    12px-13px
Button:        14px, semibold
Table header:  11px-12px, uppercase where useful
Badge:         12px-13px, medium
```

Operational UI rules:

- Do not use landing-page hero type for dashboard cards, auth cards, tables, queues, or right rails.
- Do not scale font size with viewport width.
- Letter spacing should be normal except for short uppercase eyebrows or table labels.
- Text must fit its container at 100% zoom.
- Button labels must not wrap awkwardly.
- KPI text must not clip or overflow.

Recommended line heights:

```text
Page title:    1.15-1.25
Section title: 1.25-1.35
Body:          1.45-1.65
Small/meta:    1.35-1.55
```

---

## 8. Spacing Scale

Use the consistent spacing scale:

```text
4, 8, 12, 16, 20, 24, 32, 40, 48
```

Recommended use:

```text
4px:   tiny internal gaps, icon/text optical alignment
8px:   label/input gaps, compact row gaps
12px:  compact card inner groups
16px:  card gap, form field gap, list item padding
20px:  standard card padding lower bound
24px:  section gap, standard page padding, standard card padding upper bound
32px:  large section separation, auth page outer rhythm
40px:  large desktop grouping only
48px:  rare page-level separation
```

Rules:

- Use 24px section gap by default.
- Use 16px card gap by default.
- Use 20px-24px standard card padding.
- Use 16px compact card padding.
- Avoid arbitrary spacing values unless the local layout needs exact alignment.
- Avoid excessive whitespace that requires zooming out to understand the page.

---

## 9. Card System

Default card:

```text
Background: white
Border: subtle neutral border
Radius: 10px-14px
Shadow: soft, low-opacity, non-dramatic
Padding: 20px-24px
```

Compact card:

```text
Padding: 16px
Radius: 10px-12px
```

Priority card:

```text
Use only for operational urgency.
May use a light tinted background.
Must still preserve contrast and readability.
```

Card rules:

- Cards are for grouped actions, repeated items, metrics, forms, and contextual panels.
- Do not put page sections inside decorative floating cards unless the content is genuinely framed.
- Do not put cards inside cards unless the inner cards are repeated data items or compact controls.
- KPI cards must avoid clipped text, awkward wrapping, and two-line action buttons.
- No unfinished-looking text like `Done...`, `...`, placeholder fragments, or debug labels.
- Repeated cards must have stable dimensions where possible to prevent layout shift.

KPI cards:

- Label: 12px-13px muted
- Value: 22px-28px, not oversized
- Detail: 12px-13px muted
- CTA: short label only

Allowed compact KPI CTA labels:

```text
Open desk
View leads
Check setup
Review
Copy link
Preview
```

---

## 10. Button System

Button variants:

```text
Primary:   strongest action, dark or approved brand primary
Secondary: bordered or neutral action
Subtle:    low-emphasis page utility
Ghost:     minimal action in dense UI
Danger:    destructive or high-risk action
Disabled:  unavailable action with clear disabled styling
```

Standard button targets:

```text
Height: 40px-44px standard dashboard
Height: 44px-48px auth/public form primary
Horizontal padding: 12px-16px
Font size: 14px
Font weight: semibold
Radius: 8px-10px
```

Rules:

- One primary CTA per page or major workflow region.
- Button text must not wrap awkwardly.
- Compact card buttons must use short labels.
- Disabled future features must not look available.
- Icon-only buttons require accessible labels and a clear reason.
- Danger actions must be visually distinct and must not be the default CTA.

---

## 11. Form/Input System

Input targets:

```text
Input height: 44px-48px standard forms
Compact input height: 40px only in dense dashboard surfaces
Label: 14px semibold
Helper text: 12px-13px muted
Error text: 12px-14px, near the field or form region
Radius: 8px-10px
```

Rules:

- Every input must have a clear visible label.
- Placeholder text must not replace labels.
- Focus states must be visible.
- Error messages must be user-facing, not raw database or provider errors.
- Required fields must be clear.
- Inputs must not stretch too wide in customer-facing or auth forms.
- Form sections must be grouped by owner/customer task, not database table shape.

Auth and public quote forms:

- Must be polished and readable at 100% zoom.
- Must not feel like raw developer scaffolds.
- Must not show internal phase, tenant, schema, RLS, or provider debug language.

---

## 12. Badge/Status System

Status meaning must use text plus color, never color alone.

Canonical badge groups:

Lead quality:

```text
Strong       = positive / green
Good         = informative / blue
Needs info   = warning / amber
Low fit      = risk / red or neutral-risk
```

SLA/risk:

```text
New           = blue
Viewed        = neutral or blue
Overdue       = red
Follow-up due = amber
Reply copied  = green
```

Outcome:

```text
Booked      = green
Lost        = red or neutral-risk
No response = amber/neutral
Not a fit   = neutral-risk
Asked info  = amber
```

Reply status:

```text
Reply needed = red/amber depending urgency
Draft ready  = blue or neutral
Copied       = green
Sent         = not shown unless actual sending exists
```

AI source:

```text
AI Lead Assistant = neutral or violet
Model draft       = green or violet, only if actually generated
Rule fallback     = amber or neutral
Fallback          = amber
```

Public link:

```text
Active   = green
Inactive = neutral or amber
Draft    = neutral
```

Rules:

- Badges must be readable at small sizes.
- Avoid badge text longer than the container.
- Use capitalization consistently.
- Do not show statuses that imply unavailable workflows.

---

## 13. Table/List System

Desktop tables are allowed for dense operational data.

Mobile must use:

- Stacked rows
- Cards
- Compact summary lists

Table targets:

```text
Row height: 48px-56px
Header height: 36px-44px
Cell text: 13px-14px
Header text: 11px-12px
```

Rules:

- No uncontrolled horizontal overflow.
- Important statuses must use text plus color.
- The most important action or next step must be visually easy to scan.
- Customer/contact cells must truncate safely.
- Tables must not contain placeholder ellipses as visible final UI.
- Mobile list cards must show the key fields first: customer, status, next action, urgency.

Lead recovery queue priority:

```text
Customer
Service / area
Quality or risk
SLA / status
Next action
Received time
```

---

## 14. Right Rail Rules

Right rail is optional and contextual only.

Target:

```text
Width: 300px-360px
Gap from main: 16px-24px
Sticky top offset: below topbar, usually 80px-96px
```

Allowed right rail content:

- Today's recovery queue
- Public quote link status
- Next best step
- Recovery guidance
- Lead-specific action summary
- Save/readiness summary for configuration
- Contextual quality or SLA explanation

Not allowed:

- Duplicating Dashboard / Leads / Business Configuration nav links
- Generic marketing blocks
- Fake analytics
- Billing or plan upsells in MVP workflow
- Unrelated educational content

Rules:

- Right rail must support the current page task.
- Right rail must not become a second dashboard.
- On smaller screens, right rail content should stack below main content or be removed if redundant.

---

## 15. CTA Hierarchy Rules

CTA levels:

```text
Primary:   the one action the owner should take next
Secondary: useful but not dominant
Tertiary:  navigation, utility, or low-risk supporting action
Danger:    destructive/high-risk action
Disabled:  unavailable action, clearly disabled
```

Page examples:

Dashboard Overview:

```text
Primary:   Open Lead Desk
Secondary: Preview Quote Link
```

Lead Workspace:

```text
Primary: Open highest-risk/waiting lead
or
Primary: Review waiting leads
```

Lead Detail:

```text
Primary: state-dependent owner action
Examples: Mark reply copied, Save status, Mark outcome
```

Lead Detail rule:

```text
AI/copy actions must not compete visually with owner status and outcome actions.
```

Business Configuration:

```text
Primary:   Save changes
Secondary: Preview public page / Copy quote link
```

Auth Sign In:

```text
Primary: Sign in
```

Public Quote Page:

```text
Primary: Submit quote request
```

Rules:

- Do not show multiple equally dominant CTAs.
- Do not use a primary style for navigation-only links.
- Do not make disabled future features look clickable.

---

## 16. Empty/Loading/Error/Success States

Every meaningful data region must have a state plan.

Empty states:

- Explain what is empty.
- Tell the owner what to do next.
- Avoid blame.
- Avoid fake success.

Loading states:

- Use stable dimensions to prevent layout shift.
- Do not show fake data.
- Use skeletons or simple loading copy where appropriate.

Error states:

- Use clear user-facing language.
- Do not expose raw database/provider errors.
- Keep recovery action visible when useful.

Success states:

- Confirm what changed.
- Avoid over-celebration.
- Avoid fake revenue or growth claims.

Examples:

```text
No quote requests yet.
Share your public quote link to start capturing leads.
```

```text
Email or password is incorrect.
```

```text
Configuration saved.
```

---

## 17. Auth Page Layout Rules

Auth pages must feel like owner access to a quote recovery workspace.

Allowed layouts:

- Centered auth card
- Two-column product/context + auth card

Auth layout targets:

```text
Form card width: 400px-460px
Two-column content max width: 960px-1120px
Input height: 44px-48px preferred
Compact desktop input height: 40px minimum when visually justified
Primary button: full width
```

Auth rules:

- No internal phase language.
- Product-facing copy only.
- No fake marketing claims.
- No fake OAuth buttons unless implemented.
- No forgot-password link unless implemented.
- No remember-me control unless implemented.
- Must be complete at 100% zoom, not only 75%.
- Must work on mobile width.

Preferred sign-in copy:

```text
BIZPILOT AI
Sign in to your workspace
Manage quote requests, replies, and follow-ups from one place.
Email
Password
Sign in
Need an account? Create one
```

---

## 18. Public Quote Page Layout Rules

The public quote page is customer-facing.

It must be separate from the dashboard shell.

Rules:

- No dashboard sidebar.
- No dashboard topbar.
- Simple, trustworthy, mobile-friendly.
- Form sections should not be overly wide.
- Submit CTA must be clear.
- Customer copy must not mention internal dashboard workflows.
- No booking or pricing confirmation language.
- No invented availability.
- Consent copy must be clear and readable.

Targets:

```text
Form max width: 640px-760px
Input height: 44px-48px
Section/card padding: 20px-24px
Mobile: single-column only
```

Public quote CTA:

```text
Submit quote request
```

---

## 19. Dashboard Overview Page Rules

Dashboard Overview is the operational overview.

It answers:

```text
What needs attention today?
Is the quote link ready?
Are there new quote requests?
Which leads need reply or follow-up?
What should the owner do next?
```

Allowed content:

- Needs Attention strip
- Recent leads
- Today's recovery queue
- Business readiness
- Public quote link status
- Next best step
- Simple recovery proof
- Quick actions tied to quote recovery

Not allowed:

- Raw configuration forms
- Generic CRM modules
- Fake analytics
- Fake revenue growth
- Upgrade-oriented marketing blocks

Primary CTA:

```text
Open Lead Desk
```

Secondary CTA:

```text
Preview Quote Link
```

---

## 20. Lead Workspace Page Rules

Lead Workspace is a recovery queue.

It must prioritize:

- Reply needed
- Follow-up due
- Missing info
- Overdue leads
- New quote requests
- Owner next action

Allowed content:

- Lead recovery queue
- Filters that narrow operational state
- SLA/risk summary
- Today's recovery actions
- Simple recovery proof

Not allowed:

- Full CRM pipeline complexity
- Sales forecasting
- Fake analytics
- Automation promises

Primary CTA:

```text
Review waiting leads
```

or, when a specific lead is highlighted:

```text
Open highest-risk lead
```

---

## 21. Lead Detail Page Rules

Lead Detail is the owner decision/action workspace.

It must help the owner decide:

- What did the customer ask for?
- What information is missing?
- Is this lead a fit?
- What is the next action?
- Has the owner replied?
- What outcome should be marked?

Allowed content:

- Customer request
- Submitted quote details
- Missing info
- Lead quality explanation
- SLA state
- Owner status controls
- Manual outcome controls
- Manual AI Lead Assistant
- Copyable drafts only when generated
- Timeline/events

AI rules:

- AI is assistant-only.
- Owner review is required.
- No auto-send.
- No booking confirmation.
- No invented pricing or availability.
- AI/copy actions must not visually overpower owner status and outcome actions.

---

## 22. Business Configuration Page Rules

Business Configuration is guided setup.

It must not feel like a raw database form.

Allowed content:

- Business basics
- Branding
- Services
- Service areas
- FAQ
- Public quote link
- Cleaning template fields
- Privacy and consent
- Readiness checklist
- Branding/public page preview

Recommended UX:

```text
Guided sections, tabs, or accordions
Right rail with readiness and preview context
Sticky save bar when useful
```

Primary CTA:

```text
Save changes
```

Secondary CTAs:

```text
Preview public page
Copy quote link
```

Rules:

- Keep field groups task-based.
- Avoid database-shaped labels.
- Use concise helper text.
- Save feedback must be clear.

---

## 23. Product Language / Microcopy Rules

Preferred language:

- quote requests
- lead recovery
- needs attention
- next action
- follow-up
- reply needed
- missing info
- public quote link
- owner review
- manual draft
- AI Lead Assistant
- recovery queue
- quote recovery workspace

Avoid:

- generic admin language
- internal phase labels
- tenant foundation
- RLS
- schema
- database records
- fake automation promises
- CRM-heavy copy unless needed
- guaranteed revenue language

Tone:

- Clear
- Operational
- Calm
- Owner-safe
- Specific to quote recovery

Good:

```text
Review leads waiting for reply.
Ask for missing quote details.
Copy the public quote link.
Manual draft ready for owner review.
```

Avoid:

```text
Phase 5 action queue.
Tenant workspace initialized.
AI will automatically recover revenue.
Guaranteed more jobs.
```

---

## 24. Data Honesty Rules

Explicitly forbidden:

- Fake growth percentages
- Fake comparisons
- Fake revenue claims
- Fake analytics
- Disabled future features that look available
- AI claims before implementation
- Booking confirmation language
- Pricing confirmation language
- Availability confirmation language
- Auto-send implications
- Fake "sent" states before sending exists

Rules:

- If a metric is not backed by real data, do not show it.
- If a feature is not implemented, do not make it look clickable.
- If AI output is a fallback, label it honestly.
- If a lead is only copied, do not imply it was sent.
- Recovery proof must be lightweight and explainable.

Allowed simple proof:

- Quote requests captured
- Leads reviewed
- Replies copied
- Follow-ups due
- Follow-ups completed
- Outcomes marked

---

## 25. Accessibility Rules

Accessibility requirements:

- Visible focus states for links, buttons, inputs, and controls.
- Keyboard navigation must work through forms, buttons, and page actions.
- Inputs must have clear visible labels.
- Error messages must be near fields or the relevant form region.
- Status meaning must not rely on color alone.
- Buttons must have clear text labels.
- Icon-only buttons need accessible names.
- Text contrast must meet WCAG expectations.
- Disabled controls must be visibly disabled and not confusing.
- Interactive targets should be at least 24px by 24px, with larger targets preferred for forms and primary actions.

Recommended target sizes:

```text
Minimum interactive target: 24px x 24px
Preferred dashboard controls: 36px-44px height
Preferred form controls: 44px-48px height
```

---

## 26. Responsive Behavior Rules

Mobile:

- Single-column layout.
- Hide desktop sidebar.
- Stack right rail below main content or omit redundant rail content.
- Convert tables to stacked rows/cards.
- Keep auth and public quote forms narrow and readable.
- Buttons should be full width when that improves clarity.

Tablet/small:

- Use one or two columns only when content remains readable.
- Avoid dense data tables unless horizontal space is sufficient.
- Keep forms grouped and readable.

Laptop:

- Avoid oversized cards and hero-scale text.
- Right rail must be tested carefully.
- Keep dashboard content scannable at 100% zoom.

Desktop baseline:

- Use full shell layout.
- Use right rail when it adds contextual value.
- Keep main content max width controlled.

Wide:

- Do not stretch text blocks.
- Keep readable line lengths.
- Consider wider grids only when cards remain coherent.

---

## 27. Zoom QA Checklist

Every created or polished page must be checked at:

```text
Chrome zoom 100%
Chrome zoom 75%
Chrome zoom 50%
```

At each zoom level, verify:

- Page feels intentionally designed.
- No clipped text.
- No awkward button wrapping.
- No overlapping UI.
- No uncontrolled horizontal overflow.
- Primary CTA remains visible and clear.
- Forms remain readable.
- Cards and tables do not look oversized or tiny.
- Dashboard shell remains usable.
- Right rail does not crowd main content.

100% zoom is the primary acceptance check.

```text
If the page only looks good at 75% or 50%, it is not done.
```

Screenshot QA:

- Capture or inspect at 100% zoom for every polished page.
- For responsive-sensitive changes, also inspect mobile width.

---

## 28. Implementation Enforcement Rules

Whenever a page is created or polished, the implementation report must explicitly mention:

- Which route was changed
- Which files changed
- Which sections of this UI/UX standard were applied
- Primary CTA for the page
- Whether any right rail is contextual
- Whether any fake/future/dev language was removed
- Whether 100%, 75%, and 50% zoom QA was checked
- Whether responsive/mobile QA was checked when relevant
- Whether `pnpm typecheck` passed
- Whether `pnpm lint` passed
- Whether `pnpm build` passed

Implementation must not:

- Change routes unless the task explicitly requires it.
- Add fake controls.
- Add unavailable OAuth, billing, booking, automation, or integrations.
- Introduce new libraries without explicit approval.
- Bypass shared shell ownership.
- Leave debug copy, placeholder fragments, or internal phase language in user-facing UI.

When a design conflicts with implementation reality:

```text
Implementation reality wins.
Do not fake a feature to match a mockup.
```

---

## 29. Page-Level Definition of Done

### Auth Pages DoD

Auth pages are done when:

- Correct auth layout is used: centered card or restrained two-column layout.
- No dashboard shell is used.
- Typography and spacing match this standard.
- Primary CTA is clear.
- No clipped text.
- No awkward button wrapping.
- Empty/error/success states are covered where relevant.
- Toast, loading, error, and validation states follow this UI/UX System Standard where relevant.
- Error copy is user-facing.
- No fake OAuth, forgot-password, or remember-me controls are shown unless implemented.
- No fake promises.
- No internal dev, tenant, or phase language.
- Responsive and zoom QA are complete.
- Screenshot QA at 100% is complete.
- `pnpm typecheck` passes.
- `pnpm lint` passes.
- `pnpm build` passes.

### Dashboard Overview DoD

Dashboard Overview is done when:

- Shared dashboard shell is used.
- Layout matches the operational overview role.
- Typography and spacing match this standard.
- Primary CTA is `Open Lead Desk`.
- Secondary CTA is `Preview Quote Link`.
- Right rail, if used, is contextual.
- Needs attention, recent leads, public quote link, and next action content are clear.
- No clipped text.
- No awkward button wrapping.
- Empty/loading/error states are covered where relevant.
- Toast, loading, error, and validation states follow this UI/UX System Standard where relevant.
- No fake metrics or fake analytics.
- No fake promises.
- No internal dev or phase language.
- Responsive and zoom QA are complete.
- Screenshot QA at 100% is complete.
- `pnpm typecheck` passes.
- `pnpm lint` passes.
- `pnpm build` passes.

### Lead Workspace DoD

Lead Workspace is done when:

- Shared dashboard shell is used.
- The page clearly behaves as a recovery queue.
- Typography and spacing match this standard.
- Primary CTA is `Review waiting leads` or a state-specific highest-risk lead action.
- Right rail, if used, is contextual.
- Queue rows/cards show customer, service/area, status, urgency, and next action.
- Desktop table/list is readable.
- Mobile layout avoids uncontrolled horizontal overflow.
- Important statuses use text plus color.
- No clipped text.
- No awkward button wrapping.
- Empty/loading/error states are covered where relevant.
- Toast, loading, error, and validation states follow this UI/UX System Standard where relevant.
- No fake metrics or fake analytics.
- No fake promises.
- No internal dev or phase language.
- Responsive and zoom QA are complete.
- Screenshot QA at 100% is complete.
- `pnpm typecheck` passes.
- `pnpm lint` passes.
- `pnpm build` passes.

### Lead Detail DoD

Lead Detail is done when:

- Shared dashboard shell is used.
- The page clearly behaves as an owner decision/action workspace.
- Typography and spacing match this standard.
- CTA hierarchy is state-aware and clear.
- AI/copy actions do not compete with owner status and outcome actions.
- Right rail, if used, is lead-specific and contextual.
- Customer request, missing info, quality, SLA, actions, outcome, and timeline are clear.
- AI Lead Assistant is labeled as manual and owner-reviewed.
- No auto-send implication.
- No booking confirmation.
- No invented pricing or availability.
- No clipped text.
- No awkward button wrapping.
- Empty/loading/error states are covered where relevant.
- Toast, loading, error, and validation states follow this UI/UX System Standard where relevant.
- No fake promises.
- No internal dev or phase language.
- Responsive and zoom QA are complete.
- Screenshot QA at 100% is complete.
- `pnpm typecheck` passes.
- `pnpm lint` passes.
- `pnpm build` passes.

### Business Configuration DoD

Business Configuration is done when:

- Shared dashboard shell is used.
- The page clearly behaves as guided setup.
- Typography and spacing match this standard.
- Primary CTA is `Save changes`.
- Secondary CTAs are `Preview public page` and/or `Copy quote link`.
- Right rail, if used, supports readiness, preview, or save context.
- Field groups are task-based, not database-shaped.
- Sticky save bar is used only when helpful and not visually heavy.
- Inputs, labels, helper text, and errors are consistent.
- No clipped text.
- No awkward button wrapping.
- Empty/loading/error/success states are covered where relevant.
- Toast, loading, error, and validation states follow this UI/UX System Standard where relevant.
- No fake promises.
- No internal dev or phase language.
- Responsive and zoom QA are complete.
- Screenshot QA at 100% is complete.
- `pnpm typecheck` passes.
- `pnpm lint` passes.
- `pnpm build` passes.

### Public Quote Page DoD

Public Quote Page is done when:

- Dashboard shell is not used.
- Page is customer-facing, simple, and trustworthy.
- Typography and spacing match this standard.
- Primary CTA is `Submit quote request`.
- Form width is controlled and readable.
- Mobile layout is single-column and clear.
- Consent copy is readable.
- No dashboard navigation appears.
- No clipped text.
- No awkward button wrapping.
- Empty/loading/error/success states are covered where relevant.
- Toast, loading, error, and validation states follow this UI/UX System Standard where relevant.
- No fake promises.
- No internal dev or phase language.
- No booking confirmation.
- No pricing confirmation.
- No invented availability.
- Responsive and zoom QA are complete.
- Screenshot QA at 100% is complete.
- `pnpm typecheck` passes.
- `pnpm lint` passes.
- `pnpm build` passes.

---

## 30. Toast / Notification Rules

Toasts and notifications are for short, action-specific feedback.

Allowed examples:

```text
Configuration saved.
Quote link copied.
Lead status updated.
AI draft prepared.
AI assistant could not prepare a draft. Please try again.
Email or password is incorrect.
```

Rules:

- Toasts must be short, action-specific, and user-facing.
- Do not expose raw Supabase, database, provider, stack trace, or internal errors.
- Do not over-celebrate normal actions.
- Do not make fake promises.
- Success toasts should confirm exactly what changed.
- Error toasts should explain what failed and, when useful, what the user can do next.
- Toasts must not replace field-level validation when the issue belongs to a specific input.
- Toasts must not imply unavailable actions, such as email sent, booking confirmed, or AI auto-send.

Recommended tone:

```text
Clear, calm, specific, and brief.
```

---

## 31. Modal / Dialog Rules

Use modals only when interrupting the page is justified.

Allowed modal uses:

- Confirmation
- Focused editing
- Preview
- High-risk actions

Not allowed:

- Normal page navigation
- Replacing standard page layout
- Fake future features
- Generic marketing blocks inside the product

Danger or destructive actions must have:

- Clear title
- Clear consequence
- Cancel option
- Explicit confirmation action

Rules:

- Modals must not hide important page context unnecessarily.
- Modals must be keyboard-accessible.
- Modals must be closable.
- Focus should move into the modal when opened and return to the triggering control when closed.
- Modal CTAs must follow the button hierarchy in this standard.
- Do not use modals for fake future features.

Examples:

- Confirm marking a lead as lost, if the action becomes destructive.
- Preview public quote page, if implemented as a modal.
- Confirm leaving unsaved configuration changes, if needed later.

---

## 32. Skeleton / Loading Pattern Rules

Loading states must preserve layout stability and trust.

Rules:

- Loading states must preserve layout stability.
- Do not show fake data while loading.
- Dashboard cards should use card skeletons.
- Lead tables should use row skeletons.
- Lead detail should use section skeletons.
- Auth forms may use button loading state instead of full skeleton.
- Public quote page should use simple form loading and submit state.
- Loading text must be user-facing and calm.
- Skeletons must roughly match the final content size.
- Avoid layout shift after loading completes.

Examples:

```text
Loading quote requests...
Preparing draft...
Saving configuration...
```

Route-specific guidance:

- Dashboard Overview: card skeletons for metrics, recent leads, and right rail if needed.
- Lead Workspace: row skeletons for lead queue and compact rail skeletons for summary panels.
- Lead Detail: section skeletons for customer context, actions, quote details, and timeline.
- Business Configuration: section skeletons or save button loading state.
- Auth: submit button loading state is usually enough.
- Public Quote Page: submit button loading state and simple form-level message.

---

## 33. Standard Message Library

Use this message library as the default source for common UI copy.

Auth:

```text
Enter your email address.
Enter a valid email address.
Enter your password.
Email or password is incorrect.
We couldn't sign you in. Please try again.
```

Configuration:

```text
Configuration saved.
We couldn't save your changes. Please try again.
Quote link copied.
Public page preview opened.
```

Lead / Lead Detail:

```text
Lead status updated.
Outcome marked.
Reply copied.
Follow-up copied.
Review this draft before sending it to the customer.
```

AI Lead Assistant:

```text
AI draft prepared.
Rule fallback draft prepared.
Add OPENAI_API_KEY for model generation.
AI assistant could not prepare a draft. Please try again.
Cached draft shown. No new generation was needed.
Estimated cost: $0 for fallback drafts.
```

Public Quote Page:

```text
Submit quote request.
Your request was sent.
Please complete the required fields.
We couldn't submit your request. Please try again.
```

Rules:

- Prefer these messages before inventing new variants.
- Keep messages action-specific.
- Do not mention internal services, schemas, providers, stack traces, RLS, or tenant setup.
- Do not say an action happened unless the action truly completed.

---

## 34. Validation Message Rules

Validation messages must be specific, human-readable, and placed near the related field or relevant form region.

Rules:

- Never show raw Supabase, database, provider, schema, RLS, or stack trace errors to users.
- Required fields must say what is missing.
- Invalid fields must say how to fix the value.
- Validation must not blame the user.
- Public quote form validation must be customer-friendly.
- Dashboard/configuration validation must be owner-friendly and operational.
- Auth validation must be concise and secure.
- Validation copy must not reveal whether an account exists unless the auth flow explicitly requires it.

Examples:

```text
Enter your email address.
Enter a valid email address.
Enter your password.
Add at least one service area.
Enter a service name.
Select a cleaning type.
Add the missing quote details before marking this lead ready.
```

Placement rules:

- Field-specific validation belongs near the field.
- Form-level validation belongs near the form header or submit region.
- Toasts may reinforce form-level errors, but must not replace field-level guidance.
