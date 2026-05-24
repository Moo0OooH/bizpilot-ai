# BizPilot AI - Founder CRM and Outreach Playbook

**Project:** BizPilot AI  
**Document Type:** Founder CRM / Customer Validation Playbook  
**Status:** Phase 19G ready for owner prospect entry  
**Owner:** MoOoH  
**Last Updated:** 2026-05-23  
**Related:**
- `docs/sales/FOUNDER_CRM_PROSPECT_TEMPLATE.csv`
- `docs/operations/BIZPILOT_FOUNDER_CRM_AND_PILOT_TRACKING_WORKFLOW_v1.0.md`
- `docs/operations/BIZPILOT_PHASE_18_FOUNDER_LED_PILOT_WORKFLOW_v1.0.md`
- `docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v1.0.md`
- `docs/product/BIZPILOT_FOUNDER_ADMIN_CONSOLE_SPEC_v1.0.md`
- `app/admin/page.tsx`

---

## 1. Purpose

Prepare BizPilot for real customer validation with cleaning businesses without fabricating prospects, scraping questionable data, or adding fake real-customer records.

The validation job is not to build more product. It is to learn whether cleaning owners will use and pay for:

```text
Clean quote link -> organized lead -> owner-reviewed AI drafts -> manual copy/send -> visible follow-up.
```

## 2. Founder/Admin Verification

Phase 19G code inspection result:

| Area | Result | Evidence |
| --- | --- | --- |
| `/admin` route protection | Protected server-side. | `app/admin/page.tsx` redirects signed-out users to `/auth/sign-in`; `getFounderAdminOverview` calls `assertFounderUser`. |
| Founder-only guard | Present. | `server/services/founder-admin.service.ts` requires `BIZPILOT_FOUNDER_EMAILS` and matches the signed-in user's email against the allowlist. |
| Service-role boundary | Founder-gated. | `createSupabaseServiceRoleClient` is used inside founder admin service only after `assertFounderUser` passes. |
| Founder can view pilot businesses/users | Present. | `/admin` lists businesses, users, usage signals, lead counts, public quote link state, and recent admin actions. |
| Founder can update pilot controls | Present. | `/admin` actions update plan, business status, quote-link active state, and internal notes. |
| Founder can create/view/update prospects in app | Not present. | `/admin` is an account/control console, not a prospect CRM. Prospect tracking stays in the external Founder CRM template for now. |
| Normal owners cannot access founder admin data | Code-level guard present. | Normal signed-in owners fail `assertFounderUser` unless their email is in `BIZPILOT_FOUNDER_EMAILS`. Live production negative test still recommended. |

Important boundary:

`/admin` is for pilot account controls after a business exists in BizPilot. Prospect discovery, outreach, demo notes, objections, and willingness-to-pay tracking belong in the Founder CRM tracker until validation proves an in-app CRM is needed.

## 3. Tracker Template

Use:

```text
docs/sales/FOUNDER_CRM_PROSPECT_TEMPLATE.csv
```

The template is intentionally header-only. No real prospects were provided during Phase 19G, so no real prospect rows were added and no fake real-customer records were created.

Required fields:

| Field | Purpose |
| --- | --- |
| `business_name` | Cleaning business name. |
| `city_area` | City, service area, or neighborhood. |
| `website` | Website URL if available. |
| `google_profile` | Google Business Profile URL if available. |
| `instagram_facebook` | Instagram and/or Facebook URL or handle. |
| `contact_channel` | Best outreach channel: DM, email, phone, form, referral. |
| `owner_contact_name` | Owner/contact name if known. |
| `current_quote_intake_channel` | How quotes appear today: Instagram, Google, Facebook, website form, phone, text, email. |
| `apparent_pain` | Observable quote-recovery pain or hypothesis. |
| `fit_score` | `Strong fit`, `Good fit`, `Maybe`, or `Not now`. |
| `outreach_status` | `Not contacted`, `Contacted`, `Replied`, `Follow-up due`, `Closed`. |
| `demo_status` | `Not offered`, `Invited`, `Scheduled`, `Completed`, `No-show`, `Declined`. |
| `pilot_status` | `Prospect`, `Pilot candidate`, `Payment-ready`, `Setup-ready`, `Active pilot`, `Not now`, `Bad fit`. |
| `objections` | Exact owner language, not cleaned-up summaries. |
| `willingness_to_pay` | Price/setup reaction or unknown. |
| `follow_up_date` | Next follow-up date in `YYYY-MM-DD`. |
| `outcome` | Current outcome or final status. |
| `next_action` | One concrete next action. |
| `notes` | Short internal notes. |

## 4. How To Add A Prospect

1. Add one row per cleaning business.
2. Fill only known information. Leave unknown fields blank instead of guessing.
3. Record the source of the business only if it is clean and allowed: personal network, inbound interest, owner-provided list, public website visited directly, or a business the owner already approved for outreach.
4. Do not scrape questionable data, buy lists, or import personal data that has no clear business purpose.
5. Mark `fit_score` before outreach.
6. Reject obvious bad fits before contacting them:
   - large franchise,
   - no incoming quote requests,
   - demands booking/dispatch,
   - demands auto-messaging,
   - will not place or test a quote link,
   - outside cleaning vertical.

## 5. How To Track Outreach

Every outreach attempt should update:

- `outreach_status`
- `contact_channel`
- `follow_up_date`
- `next_action`
- `notes`

Log exact owner replies. A reply like "I just need more calls" or "I hate forms" is product evidence. Do not rewrite it into polished internal language.

Recommended outreach status values:

```text
Not contacted
Contacted
Replied
Follow-up due
Demo invited
Demo scheduled
Demo completed
Pilot candidate
Payment-ready
Setup-ready
Not now
Bad fit
Closed lost
```

## 6. How To Track A Demo

Before the demo:

- Confirm cleaning-business fit.
- Note the current quote intake channel.
- Prepare one demo story around a messy quote request.
- Do not create a fake real customer lead.

During the demo:

1. Show the problem: incomplete requests from Instagram, Google, Facebook, website messages, phone, or text.
2. Show the clean quote link.
3. Show how a submitted request becomes an organized lead.
4. Show missing info and owner-reviewed AI drafts.
5. Say clearly: "Nothing sends automatically. You review, edit, copy, and send."
6. Ask what feels useful, risky, missing, or too expensive.

After the demo:

- Set `demo_status` to `Completed`, `No-show`, or `Declined`.
- Record objections as exact wording.
- Update `pilot_status`.
- Add the next follow-up date.

## 7. How To Record Objections

Record:

- exact words,
- category,
- whether the objection is about product, trust, price, timing, setup, or scope,
- response used,
- outcome.

Do not turn every objection into a feature request. If someone asks for booking, invoices, WhatsApp/SMS automation, calendar sync, direct Instagram automation, or full CRM behavior, record it as a feature pull and keep the current product scope locked.

## 8. Pilot Candidate And Payment-Ready Rules

Mark `Pilot candidate` only when:

- the business is cleaning-first,
- the owner has incoming quote requests,
- the owner understands manual copy/send,
- the owner is willing to try a public quote link,
- the owner has a clear place to put the link,
- the owner does not require forbidden scope.

Mark `Payment-ready` only when:

- the owner accepts the offer in principle,
- price/setup reaction is positive or workable,
- setup timing is realistic,
- quote link placement is agreed,
- owner understands no auto-send/no booking/no invoice/no SMS/WhatsApp automation,
- owner knows this is a founder-led pilot.

Mark `Setup-ready` only when payment terms or approval are done enough to begin configuring the business account.

## 9. How To Schedule Follow-Up

Use a concrete date, not "later."

Suggested rhythm:

| Situation | Follow-up |
| --- | --- |
| Cold outreach sent | 2-3 business days |
| Positive reply | Same day or next business day |
| Demo completed | Within 24 hours |
| Pilot candidate but undecided | 3-5 business days |
| Setup-ready | Same day |
| Not now | 30-60 days only if they invited follow-up |

## 10. What Not To Promise

Do not promise:

- AI auto-send,
- booking,
- invoicing,
- calendar sync,
- WhatsApp/SMS automation,
- Instagram API automation,
- guaranteed jobs,
- guaranteed revenue,
- instant response without owner review,
- invented pricing or availability,
- full CRM,
- custom verticals outside cleaning,
- unlimited support,
- 24/7 SLA,
- self-serve billing portal.

Use this boundary:

```text
BizPilot helps you recover quote requests by giving customers a cleaner quote link and giving you an owner-reviewed draft workflow. You stay in control of every customer message.
```

## 11. Outreach Scripts

### Short cold DM/email

```text
Hi [Name], I saw [Business Name] and noticed you handle cleaning requests around [Area].

I am testing BizPilot, a done-for-you quote recovery workflow for cleaning businesses. It gives you a clean quote link for Instagram, Google, Facebook, or your website, then organizes each request and prepares an AI reply/follow-up draft for you to review and send manually.

Nothing sends automatically. You stay in control.

Would you be open to seeing a quick demo using your cleaning business as the example?
```

### Follow-up 1

```text
Hi [Name], quick follow-up on BizPilot.

The idea is simple: stop losing incomplete quote requests like "How much for cleaning?" by giving customers a better quote link and giving you a ready-to-review reply draft.

I can show it in a few minutes if it looks relevant.
```

### Follow-up 2

```text
Hi [Name], I will close the loop here.

If quote requests from Instagram, Google, Facebook, or website messages ever feel messy or easy to miss, BizPilot is built for that one workflow: cleaner intake, organized lead, owner-reviewed draft, manual send.

Happy to show a short demo if timing becomes better.
```

### Demo invitation

```text
I can make the demo practical:

1. show a cleaning quote link,
2. submit a sample request,
3. show the lead dashboard,
4. show the AI summary/reply/follow-up draft,
5. show that you copy/send manually.

Would [day/time] work?
```

## 12. Objection Responses

| Objection | Response |
| --- | --- |
| "I already get messages on Instagram/Facebook." | "That is exactly where BizPilot fits. It does not replace your messages; it gives people a cleaner quote link first so you get enough details to reply faster." |
| "I do not want AI talking to customers." | "It does not. BizPilot prepares drafts only. You review, edit, copy, and send from your own channel." |
| "I need booking." | "Booking is not part of this pilot. BizPilot helps before booking: quote request, missing details, reply draft, and follow-up visibility." |
| "I already have a website form." | "Most forms collect data and stop there. BizPilot turns the request into an owner-ready lead with missing info, summary, reply draft, and follow-up action." |
| "I am too busy to set it up." | "The pilot is founder-led. I help set up the quote page, services, and first workflow with you." |
| "Is it going to send wrong prices?" | "No prices are invented. The draft should ask for missing details or use only what you approve. You send manually." |
| "How much does it cost?" | "The current recommended pilot draft is documented separately and must be confirmed before payment. The goal is to prove the quote recovery workflow first." |

## 13. Validation Targets

Phase 19G target before expansion:

| Target | Status |
| --- | --- |
| 10 real cleaning prospects entered | Owner action required. No real prospects supplied in Phase 19G. |
| 20 outreach attempts | Owner action required. |
| 5 demo/conversation attempts | Owner action required. |
| 3 strong pilot candidates | Owner action required. |
| 1 payment-ready or setup-ready business | Owner action required. |

Do not mark these complete with sample data.

## 14. Weekly Validation Review

Every week, review:

- number of real prospects entered,
- outreach attempts,
- replies,
- demo attempts,
- demo completions,
- exact objections,
- willingness-to-pay signal,
- strong pilot candidates,
- payment-ready/setup-ready businesses,
- requested features that should not be built yet.

The right next product work comes from repeated real evidence, not one-off requests.

