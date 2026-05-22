# BizPilot AI - Phase 18A Next Tab Handoff v1.0

## Current Position

BizPilot is in Phase 18A: pilot readiness polish and bug-fix cleanup for the cleaning-first Quote Recovery Command Center.

The product direction is locked:

- Cleaning quote recovery first.
- Owner-reviewed AI drafts only.
- Manual owner sending/copying only.
- Founder-led pilot validation before expansion.

Do not add booking, invoices, calendar sync, SMS/WhatsApp automation, AI auto-send, autonomous AI, full CRM, marketplace, mobile app, or a second vertical unless the owner explicitly approves.

Do not commit unless the owner approves.

## Source Of Truth

Read these first in the next tab:

- `docs/CURRENT_CANONICAL_DOCS_v1.7.md`
- `docs/operations/BIZPILOT_PHASE_18_PILOT_OPERATING_GUIDE_v1.0.md`
- `docs/operations/BIZPILOT_PHASE_18_WORK_LOG_v1.0.md`
- `docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v1.0.md`
- `docs/operations/BIZPILOT_MAGIC_DEMO_FLOW_v1.0.md`
- `docs/gtm/BIZPILOT_GTM_PLAYBOOK_v1.1.md`

Founder CRM workbook:

- `artifacts/phase18/BizPilot_Phase18_Founder_CRM_Template.xlsx`

## What Was Recently Done

### Homepage / Landing Page

The homepage was refined to be more customer-facing and less internal/prototype-like.

Main changes:

- Removed or reduced internal/fake framing such as phase language from visible marketing copy.
- Reworked hero scale, spacing, and copy so it speaks to cleaning business owners.
- Current hero direction:
  - Main idea: stop losing cleaning jobs to slow replies.
  - CTA direction: start recovery / see workflow.
  - Messaging: quote requests, missing details, AI drafts, follow-ups, owner approval.
- Reworked repeated boxed sections into more varied editorial/gradient/process layouts.
- Signal metrics became an open row instead of four heavy cards.
- Future-scope section was redesigned into a gradient roadmap/focus panel.
- Mobile checks were performed for homepage recovery/status areas.

Latest verification after design work:

- `pnpm lint` passed.
- `pnpm typecheck` passed.
- `pnpm test:unit` passed.
- `pnpm build` passed.

RLS tests require `DATABASE_URL`. Previously they passed with local Supabase configured; no backend/RLS logic was changed in the latest homepage work.

### Dashboard / Prototype Polish From Previous Work

Already completed before this handoff:

- Lead queue received prototype-like search, city/service filter, status filter, sort controls, and reset.
- Desktop leads table columns were polished:
  - Customer
  - Service
  - Location
  - Status
  - Requested
  - AI
  - Next action
- Quote Setup navigation was converted into client-side tabs while keeping form panels mounted.
- Configuration page received an MVP-safe Notifications tab:
  - Email active.
  - SMS future disabled.
  - WhatsApp future disabled.
- Business Profile save path preserves hidden configuration payload so unrelated fields are not blanked.
- Added migration:
  - `supabase/migrations/0014_cleaning_template_contact_address_fields.sql`
  - Adds quote template fields for customer phone, customer email, and home address.

## Current Dirty Worktree Notes

There are modified app files and untracked generated artifacts/screenshots/zips.

Do not include generated zip/artifact/temp files in a future commit unless the owner explicitly approves.

Known untracked/generated items include examples such as:

- `artifacts/dashboard-ui-qa/`
- `artifacts/app/`
- `artifacts/components/`
- `app/page.rar`
- zip files under `components/`, `docs/`, and `lib/`

Before any future commit, inspect `git status --short` and stage only intentional source/docs files.

## Where To Start In The Next Tab

Start here:

1. Read this handoff.
2. Read the source-of-truth docs listed above.
3. Run `git status --short`.
4. Do not commit.
5. Continue Phase 18A by finishing pilot readiness, not by expanding features.

Recommended next execution order:

1. Browser QA the current customer-facing flow:
   - `/`
   - `/dashboard`
   - `/dashboard/leads`
   - `/dashboard/leads/[existingLeadId]`
   - `/dashboard/configuration`
   - `/dashboard/business-profile`
   - `/dashboard/settings`
   - `/quote/[activeSlug]`
2. Confirm quote submission still creates a tenant-scoped lead.
3. Confirm owner-reviewed AI flow remains manual/copy-only.
4. Apply or verify migration `0014_cleaning_template_contact_address_fields.sql` on the intended Supabase environment.
5. Update readiness checklist with evidence and remaining gaps.
6. Prepare the Phase 18 outreach/demo workflow.

## What The Owner Needs To Provide

The owner should provide or decide:

1. Ten real cleaning business prospects for the Founder CRM workbook.
2. Pilot offer/pricing:
   - monthly pilot price,
   - setup fee or no setup fee,
   - trial period if any,
   - cancellation/refund handling.
3. The target Supabase environment where migration `0014_cleaning_template_contact_address_fields.sql` should be applied.
4. Real demo business details if available:
   - business name,
   - city/service area,
   - cleaning services,
   - logo URL,
   - colors,
   - public quote slug.
5. Final approval that the homepage direction is good enough to stop visual churn and move to validation.

## Phase 18 Success Gate

Do not expand the product until this gate is met:

- 3 cleaning businesses are paying or payment-ready.
- Each has at least 2 public quote link placements.
- Real quote submissions are coming in.
- Owners review leads weekly.
- AI drafts are copied or edited by owners.
- At least one owner gives a strong value statement.
- Retention looks healthy after onboarding.

## Short Instruction For Next Codex

Continue the main project as Phase 18A pilot readiness. Keep the product cleaning-first, owner-reviewed, and manual-send only. Do QA, evidence gathering, migration verification, and pilot GTM prep. Do not add new product scope and do not commit without owner approval.
