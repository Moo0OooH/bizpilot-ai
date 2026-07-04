# BizPilot AI - Founder CRM and Outreach Playbook

**Project:** BizPilot AI  
**Document Type:** Founder CRM / Customer Validation Playbook  
**Status:** Phase 25M GTM / pilot-ops packet ready for owner prospect entry
**Owner:** MoOoH  
**Last Updated:** 2026-07-04
**Related:**
- `docs/sales/FOUNDER_CRM_PROSPECT_TEMPLATE.csv`
- `docs/readiness/PHASE_25M_GTM_AND_PILOT_OPS_PACKET_2026-07-04.md`
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
| `source_type` | Clean source category: referral, inbound, public website, owner list, direct local research. |
| `source_permission` | Why outreach is allowed and how the prospect was found. |
| `current_quote_intake_channel` | How quotes appear today: Instagram, Google, Facebook, website form, phone, text, email. |
| `quote_link_placement_candidate` | Best likely placement: website CTA, contact page, Google Business Profile link, Instagram bio, Facebook CTA, email signature. |
| `apparent_pain` | Observable quote-recovery pain or hypothesis. |
| `fit_score` | `Strong fit`, `Good fit`, `Maybe`, or `Not now`. |
| `outreach_status` | `Not contacted`, `Contacted`, `Replied`, `Follow-up due`, `Closed`. |
| `last_outreach_date` | Most recent manual outreach date in `YYYY-MM-DD`. |
| `follow_up_date` | Next follow-up date in `YYYY-MM-DD`. |
| `demo_status` | `Not offered`, `Invited`, `Scheduled`, `Completed`, `No-show`, `Declined`. |
| `demo_date` | Scheduled or completed demo date in `YYYY-MM-DD`. |
| `pilot_status` | `Prospect`, `Pilot candidate`, `Payment-ready`, `Setup-ready`, `Active pilot`, `Not now`, `Bad fit`. |
| `objections` | Exact owner language, not cleaned-up summaries. |
| `objection_category` | Product, trust, price, timing, setup, scope, support, or other. |
| `willingness_to_pay` | Price/setup reaction or unknown. |
| `support_expectation` | What support the owner expects during setup and pilot. |
| `refund_payment_terms_confirmed` | `Yes`, `No`, or `Not applicable`; do not mark yes without written owner approval. |
| `proof_metric_focus` | Main pilot learning metric: response speed, missing details, follow-up visibility, source context, or owner review rate. |
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
- `source_type`
- `source_permission`
- `last_outreach_date`
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
Support/refund terms pending
Payment terms confirmed
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

### Website/contact-form version

```text
Hi [Name/Team], I am reaching out about [Business Name]'s cleaning quote workflow.

BizPilot gives cleaning businesses a cleaner quote link for website, Google Business Profile, Instagram, or Facebook traffic, then turns each request into an owner-ready lead with missing details and reply/follow-up drafts.

Nothing sends automatically. You review, edit, copy, and send from your own channel.

Would a short practical demo be useful?
```

### Referral ask

```text
Do you know any cleaning business owner who gets quote requests through Instagram, Facebook, Google, text, phone, or a basic website form and still has to chase missing details manually?

I am looking for a few owner-led pilot conversations for BizPilot. It is not a booking app or full CRM; it is a cleaner quote-link and owner-reviewed reply workflow.
```

### Post-demo recap

```text
Thanks for taking a look at BizPilot.

What we walked through:
- cleaner quote link,
- organized lead with source context,
- missing-info guidance,
- AI reply/follow-up draft,
- manual owner review and copy/send.

The next useful step is [next step]. I will keep the pilot scope narrow: no auto-send, no booking, no invoicing, no SMS/WhatsApp automation, and no full CRM migration.
```

### Payment-ready check

```text
Before we treat this as payment-ready, I want to confirm the boundaries in writing:

1. BizPilot helps with quote recovery, not job booking or invoicing.
2. You review and send every customer message manually.
3. Payment, support, refund terms, setup timing, and rollback expectations are confirmed before any paid pilot starts.
4. We will measure the pilot on practical learning metrics, not guaranteed revenue.

If that matches your expectation, I can prepare the setup checklist.
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

## 15. Five-Minute Demo Run-Of-Show

Use this for live demos and the first product video plan. Keep it practical and
product-real.

| Time | Segment | Show | Say |
| --- | --- | --- | --- |
| 0:00-0:30 | Quote chaos | Messy sample request from Instagram, Google, Facebook, website, phone, or text. | "Most owners do not need a bigger CRM first. They need better quote details and a faster manual reply path." |
| 0:30-1:15 | Clean quote link | Public quote page and service-specific questions. | "This link can sit where customers already look: website, Google Business Profile, Instagram bio, Facebook page, or email signature." |
| 1:15-2:15 | Organized lead | Lead queue with service, urgency, source context, missing details, and next action. | "The goal is to make the next reply obvious, not to automate the relationship." |
| 2:15-3:30 | Owner-reviewed AI | Summary, reply draft, and follow-up draft. | "Nothing sends automatically. You review, edit, copy, and send." |
| 3:30-4:15 | Follow-up visibility | Follow-up state and proof metrics. | "We measure response speed, missing details, follow-up visibility, source context, and owner review rate." |
| 4:15-5:00 | Fit check | Ask direct validation questions. | "Would you place the link? Where would it go? What feels risky? What would make this worth paying for?" |

Video plan:

- Record the same run-of-show with synthetic/sample cleaning data only.
- Show the current product, not abstract slides.
- Avoid fake customer testimonials, fake revenue, fake before/after results, or
  any claim that the AI sends messages.
- End with one narrow CTA: request a founder-led pilot conversation.

## 16. Pilot Payment, Support, And Refund Packet

Pilot payment remains blocked until the owner explicitly approves the support,
payment/refund, rollback, restored-app, RLS, and real-data gates. This packet is
the operating template, not permission to charge.

Before any paid pilot:

1. Confirm the pilot scope in writing:
   - cleaning quote recovery,
   - quote link setup,
   - owner-reviewed AI drafts,
   - manual copy/send,
   - follow-up visibility,
   - no booking, no invoicing, no SMS/WhatsApp automation, no full CRM.
2. Confirm payment method:
   - manual invoice or owner-approved payment request only,
   - no self-serve checkout,
   - no automatic renewal,
   - no stored card automation unless separately approved.
3. Confirm refund terms before collection:
   - exact refund window,
   - what setup work is refundable or non-refundable,
   - cancellation path,
   - data export/deletion path.
4. Confirm support expectations:
   - founder-led setup help,
   - expected support channel,
   - response-time target,
   - what is outside support scope,
   - rollback path if the quote link should be removed.
5. Confirm proof metrics:
   - response speed,
   - missing-detail clarity,
   - follow-up completion,
   - quote-source visibility,
   - owner review/copy rate.

Do not mark `refund_payment_terms_confirmed` as `Yes` until these details are
written down for that exact business.

## 17. Quote-Link Placement Campaign

Recommended placement order:

1. Website primary CTA or contact page.
2. Google Business Profile local business link or booking/appointment link if
   available for that profile and category.
3. Instagram bio link.
4. Facebook page button or pinned post.
5. Email signature.
6. Manual reply snippet for DMs/texts: "Please use this quote link so I can see
   the details and reply faster."

Keep every placement honest:

- Do not call the quote link a booking link unless the owner actually treats it
  as a request-only appointment/quote link and the surrounding copy says it is
  not a confirmed booking.
- Do not place the link inside Google Business Profile description text when
  Google disallows links in the business description.
- Use UTM/source parameters only from the approved quote attribution allowlist.
- Review placements after setup and again after the first real week of usage.

## 18. Review And Local Trust Guidance

Owners may ask real customers for honest reviews after completed work, but the
campaign must stay neutral and policy-safe.

Do:

- ask customers with genuine experience,
- ask consistently rather than only asking happy customers,
- let customers choose what to write,
- respond professionally to reviews,
- use Google Business Profile posts for real updates,
- record review requests as owner-side local trust work, not BizPilot proof.

Do not:

- Do not offer incentives for reviews.
- Do not pressure customers to leave reviews on premises.
- Do not request only positive reviews.
- Do not ask customers to remove/change negative reviews in exchange for
  anything.
- Do not generate fake, AI-written, staff, family, or conflict-of-interest reviews.
- Do not use owner/family/staff reviews as customer proof.

Policy references reviewed for this packet:

- Google Business Profile guidelines:
  `https://support.google.com/business/answer/3038177`
- Google local business links:
  `https://support.google.com/business/answer/6218037`
- Google review request guidance:
  `https://support.google.com/business/answer/3474122`
- Google Maps prohibited/restricted contribution policy:
  `https://support.google.com/contributionpolicy/answer/7400114`
- FTC Consumer Reviews and Testimonials Rule Q&A:
  `https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers`

## 19. Phase 25M Close Criteria

This packet is complete when:

- the CRM template captures source, placement, objection, support, refund, and
  proof-metric fields;
- outreach scripts are manual, concise, and cleaning-specific;
- the demo script shows quote chaos to owner-reviewed reply in a few minutes;
- paid pilot collection remains blocked until exact payment/support/refund
  terms are approved;
- local GBP/review guidance avoids fake reviews, incentives, selective review
  solicitation, and link-placement overclaims.
