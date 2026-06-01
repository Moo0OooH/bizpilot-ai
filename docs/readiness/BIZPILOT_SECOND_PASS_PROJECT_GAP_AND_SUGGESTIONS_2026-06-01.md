# BizPilot AI — Second-Pass Project Gap, Improvement, and Suggestion File

**Date:** 2026-06-01  
**Prepared for:** MoOoH  
**Scope reviewed in this pass:** uploaded docs archive, current README, and the existing 2026-06-01 project gap audit.  
**Production mutation:** None  
**Real customer data reviewed:** No  
**Important limitation:** This pass reviewed the uploaded documentation package plus the provided repo/code audit evidence. The full live code repository was not separately available in this chat except through the existing audit and repo-inspection documents, so code-specific items below are marked as implementation/verification suggestions unless already proven in the supplied evidence.

---

## 1. Executive Decision

BizPilot does **not** need a conceptual reset.

The project direction is coherent:

```text
BizPilot = Quote Recovery / Lead Response desk for cleaning businesses.
Core flow = public quote link -> organized lead -> AI summary/reply/follow-up draft -> owner review -> manual copy/send.
Current safe posture = synthetic-ready, not yet real-data-approved, not paid-pilot-ready.
```

The strongest current conclusion is:

```text
Synthetic production proof: mostly passed.
Real customer data: still blocked.
Paid pilot: still blocked after real-data approval until support/payment/restore ops are ready.
```

The next correct move is still:

1. Run and record **Phase 24F final no-secret production smoke**.
2. Record **Phase 24G explicit owner approval for real customer data** only if Phase 24F passes.
3. Then begin a very narrow, manual, cleaning-only first pilot.

No booking, invoicing, SMS/WhatsApp automation, owner-notification automation, AI auto-send, second vertical, or full CRM expansion should be added before validation.

---

## 2. What Is Already Strong And Should Be Preserved

- The product positioning is strong: lead recovery and quote response, not generic AI/CRM/form builder.
- The manual owner-review boundary is correct and should not be weakened.
- The cleaning-first GTM is focused enough for a real MVP.
- The documentation system is broad and generally usable.
- The security/RLS/privacy standards are mature for an MVP.
- Phase 23 synthetic production evidence is meaningful: public smoke, auth redirect, synthetic quote intake, owner dashboard proof, OpenAI provider proof, and Auth email/custom SMTP proof are recorded.
- Backup/export/restore has moved from theory to DB-level proof, even though strict restored app/RLS proof is still deferred.
- The feature-entitlement standard is a good way to allow future expansion without accidentally default-enabling unfinished capabilities.

Preserve these rules:

```text
AI drafts only. Owner sends manually.
Cleaning-first only.
Dashboard must help owner reply faster and follow up better.
Every visible feature must be honest about whether it is enabled, planned, deferred, or setup-required.
Database/RLS remains the final security boundary.
```

---

## 3. Main Risk I See After Reading Everything

The biggest risk is **state confusion**, not product weakness.

The docs contain all three of these states at once:

1. old blockers that are now passed,
2. current blockers that still matter,
3. future/premium items that are not required for the first pilot.

If future coding agents or humans follow the wrong section, they may either:

- waste time re-solving solved gates,
- accidentally claim real-data readiness too early,
- implement deferred features such as notification email or automation,
- or run unsafe production actions while trying to “finish” old checklists.

The project needs a short final readiness pass that separates:

```text
Synthetic-ready
Real-data-ready
Paid-pilot-ready
Post-validation expansion
```

---

## 4. Priority Definitions Used In This File

| Priority | Meaning |
| --- | --- |
| **P0** | Must finish before any real customer data. |
| **P1** | Must finish before paid pilot, broader real pilot, production migrations, destructive/bulk operations, or serious outreach scale. |
| **P2** | Strong improvement after first real-data gate or during early pilot. |
| **P3** | Future/post-validation; do not build now unless owner explicitly changes scope. |

---

## 5. P0 — Must Do Before Real Customer Data

### P0-1. Complete Phase 24F final no-secret production smoke

**Current state:** Prepared but not run.  
**Why it matters:** This is the last runtime sanity check before real customer data.  
**Action:** Run exactly the approved synthetic/no-secret smoke scope. Record only sanitized evidence: date/time, route, pass/fail, actor type, non-sensitive notes.  
**Do not record:** secrets, tokens, cookies, reset links, provider output, raw prompts, customer data, screenshots with private data.

**Suggested file update:**

- `docs/readiness/PHASE_24_REAL_DATA_APPROVAL_GATE_2026-05-30.md`
- `docs/readiness/WHERE_WE_ARE_WITH_NEXT_STEP_2026-05-29.md`

---

### P0-2. Fix wording around “read-only” smoke if dashboard views cause passive mutations

**Gap I noticed:** Some earlier evidence says simply viewing lead detail can mark a lead as viewed/reviewed or update SLA/read events. Phase 24F calls the dashboard checks “read-only,” but the app may have read-time side effects.

**Risk:** The final smoke evidence could claim “read-only” while the app changes synthetic status metadata during page load.

**Suggestion:** Before or during Phase 24F, explicitly record one of these:

```text
A) These routes are truly read-only and create no DB changes.
B) These routes are UI-read-only but may create expected passive metadata such as viewed/SLA/timeline state.
```

**Recommended wording:**

```text
No destructive or user-initiated mutation was performed. Passive owner-view metadata may update if that is the current app behavior and is recorded as expected.
```

**Suggested file update:**

- `docs/readiness/PHASE_24_REAL_DATA_APPROVAL_GATE_2026-05-30.md`

---

### P0-3. Record Phase 24G explicit owner real-data approval

**Current state:** Not recorded.  
**Why it matters:** No technical pass should silently authorize real customer data.

**Approval record should include:**

| Field | Required content |
| --- | --- |
| Date | Exact date. |
| Approver | MoOoH / owner. |
| Scope | First limited cleaning pilot only. |
| Data allowed | Real cleaning-business owner account and real quote submissions only after setup. |
| Data not allowed | Bulk imports, scraping, automated customer email, AI auto-send. |
| Pilot mode | Manual dashboard check, owner-reviewed AI drafts, manual copy/send. |
| Stop condition | Any P0 security/auth/cross-tenant issue pauses pilot. |

**Suggested file update:**

- `docs/readiness/PHASE_24_REAL_DATA_APPROVAL_GATE_2026-05-30.md`

---

### P0-4. Make local RLS verification repeatable before relying on any new changes

**Current state:** `pnpm test:rls` exists historically but the latest local run was blocked because `DATABASE_URL` was not present in the command environment.

**Risk:** RLS regressions could slip in after future changes, especially around public quote inserts, lead visibility, AI outputs, usage events, and restored database checks.

**Action:** Add a local-only runbook and env example.

**Suggested implementation:**

```text
.env.test.example
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres

package.json
verify:local-db = unit tests + RLS tests + local smoke checks
```

Keep the host guard. The RLS runner must refuse production/managed DB hosts.

**Suggested file updates:**

- `.env.example` or `.env.test.example`
- `tests/rls/README.md`
- `package.json`
- optional `docs/ops/LOCAL_RLS_VERIFICATION_RUNBOOK.md`

---

### P0-5. Confirm public quote DB-level RLS hardening is still covered by tests

**Current evidence:** Earlier repo-inspection docs say migration `0012` added `public_can_insert_submission_value(...)` to block unknown field keys, hidden fields, and cross-form/cross-business value injection. That is good.

**Remaining gap:** Because the latest `pnpm test:rls` run was blocked, the current state should be re-verified locally.

**Action:** Re-run RLS tests after local `DATABASE_URL` is set and keep negative tests for:

- unknown `field_key`,
- hidden field submission,
- field from another form,
- field from another business,
- submission from another business,
- anon read denial for private submissions/leads.

**Suggested file updates:**

- `tests/rls/public-intake-and-leads.test.sql`
- `tests/rls/README.md`

---

### P0-6. Make final no-secret evidence template impossible to misuse

**Gap:** Phase 24F checklist exists, but the evidence format should be extremely constrained so future operators do not paste sensitive material.

**Suggestion:** Add a tiny template block:

```text
Route:
Actor:
Time:
Expected:
Result: pass / partial / fail / not run
Sensitive data visible: no / yes
Cross-tenant data visible: no / yes
Notes: sanitized, one sentence only
```

**Suggested file update:**

- `docs/readiness/PHASE_24_REAL_DATA_APPROVAL_GATE_2026-05-30.md`

---

## 6. P1 — Must Do Before Paid Pilot Or Broader Real Pilot

### P1-1. Reconcile stale documentation with current Phase 23/24 truth

**Gap:** Several docs still show older Phase 19/21/22 blockers or older pricing states. Broken links are not the main problem; stale truth is.

**Specific examples:**

| File | Issue |
| --- | --- |
| `docs/README.md` | Latest readiness evidence still starts around Phase 22 / 2026-05-28 and should promote Phase 23/24 files. |
| `operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v1.0.md` | It has a current Phase 24 section, but lower sections still contain old fail rows for pricing/support/OpenAI/SMTP/backup. |
| `business/PILOT_OFFER_AND_PRICING_DECISIONS.md` | Older pricing draft says owner approval still required and has older `$199/$299` framing. |
| `business/PILOT_TERMS_DECISION_GATE.md` | Terms are approved but old “remaining gates” language still names passed blockers. |
| `operations/BIZPILOT_PRODUCTION_QA_CHECKLIST_v1.0.md` | Historical rows still show OpenAI/SMTP/backup blockers that are partly superseded. |
| `operations/BIZPILOT_BACKUP_AND_EXPORT_STRATEGY_v1.0.md` | Needs addendum for Phase 24C.0 DB-level restore proof and Phase 24C.1 strict restore/RLS deferral. |

**Suggestion:** Add a `CURRENT STATUS OVERRIDE` banner to old docs instead of rewriting every historical line.

**Standard banner:**

```text
CURRENT STATUS OVERRIDE — 2026-06-01:
Use docs/readiness/PHASE_24_REAL_DATA_APPROVAL_GATE_2026-05-30.md and docs/readiness/WHERE_WE_ARE_WITH_NEXT_STEP_2026-05-29.md for current readiness truth. Older blocker rows below are historical where they conflict.
```

---

### P1-2. Create one small current status file for humans and agents

**Gap:** Current truth is spread across many files.

**Suggestion:** Add one short file:

```text
CURRENT_PROJECT_STATUS_2026-06-01.md
```

It should contain only:

```text
Synthetic-ready: yes
Real-data-ready: no, pending Phase 24F + Phase 24G
Paid-pilot-ready: no, pending payment/support/strict restore/RLS ops
First pilot mode: cleaning-only, manual dashboard check, owner-reviewed AI drafts, manual copy/send
Owner notification email: deferred
AI auto-send: not approved
```

This file should not duplicate long evidence; it should link to the current evidence docs.

---

### P1-3. Reconcile feature registry and Settings states with current truth

**Gap already identified:** Some feature states/copy appear stale.

**Fix these states:**

| Feature | Correct state |
| --- | --- |
| AI draft assistant | Synthetic provider proof passed; real-data use gated by final smoke and owner approval. |
| Auth email/custom SMTP | Auth email proof passed; app-level owner notification email remains deferred. |
| Backup/restore posture | DB-level export/restore passed; strict restored app/dashboard/RLS proof deferred to P1 before paid pilot/migrations/destructive work. |
| Owner notification email | Deferred / not active / not required for first pilot. |
| Forward-only privacy mode | Planned/setup-required unless public intake truly supports it end to end. |

**Suggested file updates:**

- `lib/features/feature-registry.ts`
- `app/(dashboard)/dashboard/settings/page.tsx`
- `app/(dashboard)/dashboard/configuration/page.tsx`

---

### P1-4. Fix notification copy in dashboard configuration

**Gap:** Notifications copy may imply email is active, while owner notification email is intentionally deferred.

**Recommended copy:**

```text
Manual dashboard check only for the first pilot.
Owner notification email is deferred.
SMS/WhatsApp automation is not enabled.
```

**Why it matters:** A pilot operator must not believe lead alerts exist if they do not.

**Suggested file update:**

- `app/(dashboard)/dashboard/configuration/page.tsx`

---

### P1-5. Update public trust/policy copy

**Gap:** Some public trust copy may still imply real customer data is waiting on old blockers like OpenAI validation, stable email, or backup/export readiness.

**Correct current blockers:**

```text
Phase 24F final no-secret production smoke
Phase 24G explicit owner approval
Strict restored app/RLS proof deferred to P1 before paid pilot / migrations / destructive work
```

**Suggested file update:**

- `lib/i18n/policy-copy.ts`

Also update both English and fr-CA copy together.

---

### P1-6. Resolve pricing source-of-truth confusion

**Gap:** The app pricing copy seems aligned with staged terms, but older docs still contain draft pricing and “not approved” language.

**Suggested action:**

- Mark `docs/business/PILOT_OFFER_AND_PRICING_DECISIONS.md` as superseded by `PILOT_TERMS_DECISION_GATE.md`.
- Update `PILOT_TERMS_DECISION_GATE.md` to remove passed technical blockers from “remaining gates.”
- Add a clear source-of-truth sentence:

```text
Current public pricing source: lib/i18n/pricing-copy.ts plus docs/business/PILOT_TERMS_DECISION_GATE.md.
Older pricing docs are historical only.
```

---

### P1-7. Create the payment collection asset/process before charging

**Gap:** Terms are approved, but payment collection is not operationally ready.

**Before collecting money, create:**

- manual invoice template or Stripe Payment Link,
- written offer template,
- refund/cancellation wording,
- billing start trigger wording,
- support channel statement,
- internal record of who paid, when setup starts, and plan assignment.

**Do not build in-app billing yet.** Manual billing is enough.

**Suggested file updates:**

- `docs/business/PILOT_TERMS_DECISION_GATE.md`
- `docs/operations/BIZPILOT_PILOT_ONBOARDING_AND_FOUNDER_CRM_WORKFLOW_v1.0.md`
- optional `docs/business/PILOT_PAYMENT_PROCESS_RUNBOOK.md`

---

### P1-8. Complete support, escalation, and refund operating packet

**Gap:** Support promise exists conceptually, but the exact support channel/escalation/incident loop should be concrete before paid pilot.

**Minimum packet:**

| Area | Minimum decision |
| --- | --- |
| Support channel | Email, WhatsApp, or other owner-selected channel. |
| Response promise | Best-effort 1-2 business days. |
| P0 issue handling | Security/auth/cross-tenant/quote-submit outage pauses onboarding. |
| Refund | Setup refundable before onboarding work starts; no automatic refund after setup starts, unless owner decides otherwise. |
| Incident register | Manual private register outside git. |
| Rollback owner | Who decides rollback/disable. |

**Suggested file updates:**

- `docs/operations/BIZPILOT_SUPPORT_AND_INTERNAL_NOTES_WORKFLOW_v1.0.md`
- `docs/operations/BIZPILOT_BUG_TRIAGE_AND_RELEASE_QA_STANDARD_v1.0.md`
- `docs/business/PILOT_TERMS_DECISION_GATE.md`

---

### P1-9. Finish strict restored app/dashboard/RLS proof before paid pilot or risky production work

**Current state:** DB-level restore proof passed, but restored app/dashboard/RLS smoke did not pass.

**Keep current owner decision:** This does not block first limited manual pilot if owner accepts the risk.

**But before paid pilot, migrations, destructive cleanup, bulk work, or serious real-data scale, complete:**

- restore to disposable target,
- run app against restored target,
- run dashboard smoke,
- run RLS suite successfully,
- record sanitized evidence.

**Suggested file updates:**

- `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`
- `docs/readiness/PHASE_24_REAL_DATA_APPROVAL_GATE_2026-05-30.md`

---

### P1-10. Reduce or gate temporary AI diagnostics before real customer data

**Current state:** Safe non-secret diagnostics helped prove OpenAI provider behavior.

**Gap:** The docs say diagnostics are temporary and should be reduced/gated if noisy after pilot starts.

**Suggestion before real customer data:** Decide exactly which diagnostic fields stay enabled.

Allowed:

```text
provider status, model name, sanitized error category, token/shape metadata, fallback status
```

Forbidden:

```text
raw prompt, raw model output, customer PII, provider secret, request body, reset link/token
```

**Suggested file update:**

- `server/providers/ai/*` or logging config if present
- `docs/readiness/PHASE_24_REAL_DATA_APPROVAL_GATE_2026-05-30.md`

---

### P1-11. Decide owner notes boundary: persist in app or keep in Founder CRM

**Gap:** Owner notes appear as a UI concept but may not be persisted.

**Option A — build persisted notes:**

- migration,
- RLS,
- repository/service/action,
- audit/timeline event,
- unit/RLS test,
- safe DTO.

**Option B — do not build now:**

- soften UI copy,
- say pilot notes live in Founder CRM/manual tracker for now.

**Recommendation:** For first pilot, either externalize notes clearly or persist them properly. Do not leave a fake notes affordance.

**Suggested file update:**

- `app/(dashboard)/dashboard/leads/[leadId]/page.tsx`

---

### P1-12. Add source attribution capture or explicitly defer it

**Gap:** Docs want lead source attribution, and schema foundations appear to exist, but client-side capture may not provide useful source URL/referrer/UTM data.

**First safe version:**

- capture `source_channel`,
- capture safe current URL/referrer/UTM where privacy posture allows,
- avoid exposing raw referrer data widely,
- show `unknown` honestly when uncaptured.

**Suggested file updates:**

- `components/public/quote-form-wizard.tsx`
- `server/services/public-intake.service.ts`
- `server/repositories/public-intake.repository.ts`

---

### P1-13. Productize minimum validation reporting

**Gap:** Validation dashboard is well specified but not fully productized.

**First version does not need a full dashboard.** A founder weekly report is enough:

| Metric | Why |
| --- | --- |
| active quote links | proves setup usefulness |
| leads created | proves intake works |
| AI drafts generated | proves AI workflow use |
| drafts copied | stronger usage signal |
| follow-up used | proves recovery workflow |
| time to first value | onboarding friction |
| owner weekly active | retention signal |
| booked/lost/no response outcomes | business value proof |

**Suggested file updates:**

- `docs/product/BIZPILOT_VALIDATION_DASHBOARD_SPEC_v1.1.md`
- optional `docs/readiness/PILOT_VALIDATION_WEEKLY_REPORT_TEMPLATE.md`

---

### P1-14. Run one fr-CA synthetic smoke before onboarding a French-language pilot

**Current state:** MVP-safe English/fr-CA support is documented, but older docs had fr-CA smoke blockers.

**Suggestion:** Not necessarily P0 for all real data, but P1 before any fr-CA pilot customer.

Smoke:

- public quote page,
- validation error,
- success page,
- dashboard lead view,
- AI draft language guidance,
- no raw English-only fallback where user-facing.

---

### P1-15. Create first-pilot onboarding and first-week success checklist

**Gap:** Onboarding docs exist, but the operational first-week loop should be very concrete.

**Minimum first-pilot workflow:**

1. Configure cleaning business manually.
2. Create/verify quote link.
3. Place quote link in at least two real channels.
4. Submit one owner-approved test quote.
5. Owner opens dashboard and copies one draft.
6. Owner records whether draft was useful.
7. Day 3 check-in.
8. Day 7 usage review.
9. 30-day feedback.
10. 60-day feedback.

**Suggested file update:**

- `docs/operations/BIZPILOT_CUSTOMER_ONBOARDING_CHECKLIST_v1.0.md`
- `docs/sales/FOUNDER_CRM_AND_OUTREACH_PLAYBOOK.md`

---

## 7. P2 — Strong Improvements During Early Pilot

### P2-1. Add server-only IP hash salt

**Gap:** Audit evidence suggests IP hashing may derive salt from public app URL fallback.

**Suggestion:** Add:

```text
BIZPILOT_IP_HASH_SALT=
```

Server-only, documented without real value, deterministic local fallback only for development/test.

**Suggested file update:**

- `server/services/abuse-protection.service.ts`
- `.env.example`

---

### P2-2. Add retention cleanup for abuse/rate-limit metadata

**Gap:** Abuse events are logged, but a repeatable cleanup/retention routine was not verified.

**Suggestion:** Add script or SQL procedure for 30-90 day retention unless needed for security investigation.

**Suggested file updates:**

- `server/services/abuse-protection.service.ts`
- `scripts/cleanup-abuse-events.*`
- `docs/operations/BIZPILOT_DELETION_AND_CLEANUP_RUNBOOK_v1.0.md`

---

### P2-3. Add security/privacy manual registers or admin-only tables

**Gap:** Docs recommend privacy request, incident, vendor/processor, security event, and retention registers. Current posture seems mostly manual/docs-based.

**Suggestion:** For first paid pilot, manual private registers are enough if clearly assigned. Productized admin-only tables can wait.

Minimum registers:

- privacy/deletion requests,
- security incidents,
- vendor/processor list,
- backup/export events,
- support escalations.

---

### P2-4. Improve CSP gradually

**Gap:** Security headers exist, but CSP allows inline script/style.

**Suggestion:** Accept for MVP if needed, then move to:

1. CSP report-only,
2. collect violations,
3. add hashes/nonces where stable,
4. enforce later.

**Suggested file update:**

- `next.config.ts`

---

### P2-5. Add Node runtime declaration

**Gap:** Docs mention Node 24 LTS / CI uses Node 24, but package metadata may not enforce it.

**Suggestion:**

```json
"engines": {
  "node": ">=24 <25"
}
```

Optional:

```text
.nvmrc -> 24
```

**Suggested file update:**

- `package.json`
- `.nvmrc`

---

### P2-6. Clean diagnostic GitHub workflows

**Gap:** Checkout debug/diagnostic workflows may be leftover noise.

**Suggestion:** Keep only if still actively needed; otherwise archive/remove.

**Suggested file updates:**

- `.github/workflows/checkout-debug.yml`
- `.github/workflows/checkout-diagnostic.yml`

---

### P2-7. Finish BizPilot file-header cleanup

**Gap:** Some files may have missing/partial project headers.

**Suggestion:** Do this after readiness gates so it does not pollute product-readiness diffs.

**Suggested files from prior audit:**

- `components/public/marketing-ui.tsx`
- `lib/features/feature-registry.ts`
- `app/error.tsx`
- `next.config.ts`
- `app/(dashboard)/dashboard/error.tsx`

---

### P2-8. Add feature guides for visible/Settings-listed capabilities

**Gap:** The feature-entitlement standard says visible features should have visual/text/owner guides. Some features may be visible before guide coverage is complete.

**Minimum guide set:**

- Public quote link guide.
- Manual AI draft guide.
- Follow-up/copy-send guide.
- Privacy mode guide.
- Founder setup guide.
- What BizPilot does not do guide.

**Do not build a large help center yet.** Simple docs or in-app guide panels are enough.

---

### P2-9. Clarify `forward_only` privacy mode

**Gap:** Forward-only mode is described as future/advanced in older docs, but it may appear in configuration while the actual public intake supports only standard/minimal behavior.

**Suggestion:** Hide, disable, or label it:

```text
Planned — not available in first pilot.
```

Do not imply forward-only storage behavior unless the full intake/server/database flow actually implements it.

---

### P2-10. Make cross-tenant negative smoke repeatable

**Current evidence:** Synthetic owner dashboard proof showed scoped data only. Phase 24F includes cross-tenant visual smoke.

**Improvement:** Add a simple repeatable negative smoke using a non-founder/non-member account or a second synthetic tenant. Record only pass/fail, no private data.

---

### P2-11. Add a “do not overbuild from pilot requests” rule to the pilot tracker

**Risk:** First pilot customers will ask for booking, SMS, WhatsApp, invoices, calendar, direct sending, and CRM behavior.

**Suggestion:** Add rule:

```text
A feature request is logged, not built, until at least 3 qualified cleaning customers independently ask for it and it passes feature-entitlement, provider/payment/API, security, and smoke gates.
```

---

### P2-12. Separate founder admin console from prospect CRM forever unless validated

**Current boundary is good:** `/admin` controls existing BizPilot accounts; prospect CRM stays external.

**Suggestion:** Preserve this. Do not build in-app prospect CRM until real usage proves it is worth it.

---

## 8. P3 — Future / Post-Validation Only

Do not build these now unless owner explicitly changes strategy after validation:

- owner notification email,
- customer-facing email automation,
- SMS/WhatsApp automation,
- direct Instagram/DM automation,
- booking engine,
- invoices/payments inside app,
- full Stripe Billing portal,
- calendar sync,
- multi-vertical packs,
- full CRM replacement,
- advanced analytics dashboard,
- autonomous AI agent.

Each future feature must go through:

```text
feature registry -> owner enablement -> Settings state -> visual/text/admin guides -> provider/payment/API proof -> synthetic smoke -> explicit owner approval
```

---

## 9. Suggested Implementation Order

### Batch 1 — Real-data gate closure

1. Add passive-read-side-effect note to Phase 24F if needed.
2. Run Phase 24F final no-secret production smoke.
3. Record Phase 24F evidence safely.
4. Record Phase 24G owner approval if Phase 24F passes.
5. Do not start real data until this is done.

### Batch 2 — Local verification and RLS repeatability

6. Add local-only `DATABASE_URL` example.
7. Add/update RLS runbook.
8. Run `pnpm test:rls` locally.
9. Add `verify:local-db` script.
10. Confirm public quote negative RLS tests still pass.

### Batch 3 — Truth alignment and copy cleanup

11. Update `docs/README.md` latest readiness list.
12. Add current-status override banners to stale docs.
13. Mark older pricing docs as superseded.
14. Update commercial gate remaining blockers.
15. Update feature registry/settings/configuration copy.
16. Update public trust/policy copy in EN and fr-CA.

### Batch 4 — First pilot operating packet

17. Create payment collection asset/process before charging.
18. Finalize support/escalation/refund runbook.
19. Create first-pilot onboarding/first-week checklist.
20. Decide lead notes boundary.
21. Create weekly validation report template.
22. Enter real prospects only after owner-approved outreach posture.

### Batch 5 — Hardening and cleanup

23. Add IP hash salt.
24. Add abuse metadata cleanup.
25. Complete strict restored app/dashboard/RLS proof before paid pilot or risky production work.
26. Add Node engine and optional `.nvmrc`.
27. Clean diagnostic workflows.
28. Start CSP report-only later.
29. Do file header cleanup separately.

---

## 10. Suggested File Change Map

| Area | File(s) | Suggested change |
| --- | --- | --- |
| Current status | `docs/readiness/CURRENT_PROJECT_STATUS_2026-06-01.md` | New small single truth file. |
| Phase 24F/24G | `docs/readiness/PHASE_24_REAL_DATA_APPROVAL_GATE_2026-05-30.md` | Add final smoke evidence, passive side-effect note, owner approval block. |
| Main handoff | `docs/readiness/WHERE_WE_ARE_WITH_NEXT_STEP_2026-05-29.md` | Update after Phase 24F/24G only. |
| Docs entry | `docs/README.md` | Promote Phase 23/24 current evidence. |
| Pilot checklist | `docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v1.0.md` | Add override banner or update stale lower rows. |
| Pricing | `docs/business/PILOT_OFFER_AND_PRICING_DECISIONS.md` | Mark as superseded. |
| Terms | `docs/business/PILOT_TERMS_DECISION_GATE.md` | Replace old technical blockers with current blockers. |
| Backup | `docs/operations/BIZPILOT_BACKUP_AND_EXPORT_STRATEGY_v1.0.md`, `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md` | Add Phase 24C.0 pass / Phase 24C.1 deferred status. |
| RLS | `.env.test.example`, `tests/rls/README.md`, `package.json` | Make local RLS verification repeatable. |
| Feature states | `lib/features/feature-registry.ts`, Settings/configuration pages | Align AI/email/backup/notification/forward-only states. |
| Public copy | `lib/i18n/policy-copy.ts` | Update readiness/trust copy in EN/fr-CA. |
| Owner notes | `app/(dashboard)/dashboard/leads/[leadId]/page.tsx` plus server/migration if persisted | Persist or remove/soften. |
| Attribution | public quote component/service/repository | Capture safe source/referrer/UTM or explicitly defer. |
| Abuse privacy | `server/services/abuse-protection.service.ts`, `.env.example` | Add server-only IP hash salt and retention cleanup. |
| Runtime | `package.json`, `.nvmrc` | Enforce Node 24. |
| Security headers | `next.config.ts` | Later CSP report-only path. |

---

## 11. Final Recommendation

The best next action is not another feature. It is a **disciplined readiness closure**.

The product is close to a narrow first real-data pilot, but the approval line must stay strict:

```text
No real customer data until Phase 24F passes and Phase 24G is explicitly recorded.
```

After that, start with one or a few cleaning businesses only, manually onboarded, manually monitored, with no automation promises.

The first real pilot should prove:

- owners place the quote link,
- real quote submissions come in,
- AI drafts are useful enough to copy/edit,
- follow-up guidance gets used,
- owners return weekly,
- at least one job/reply/recovery story can be attributed to the workflow.

Only after that should BizPilot consider notification email, billing automation, booking, integrations, second verticals, or advanced analytics.
