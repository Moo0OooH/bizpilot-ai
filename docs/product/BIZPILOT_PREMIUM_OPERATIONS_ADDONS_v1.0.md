<!--
 * ============================================================
 * File: docs/product/BIZPILOT_PREMIUM_OPERATIONS_ADDONS_v1.0.md
 * Project: BizPilot AI
 * Description: Product, access, safety, and QA contract for separately sold Premium Operations add-ons.
 * Role: Defines the bounded owner-facing workflow for priority work, review-only group drafts, and internal availability coordination.
 * Related:
 * - supabase/migrations/0025_premium_operations_addons.sql
 * - supabase/migrations/0026_premium_operations_schedule_integrity.sql
 * - server/services/premium-operations.service.ts
 * - server/services/premium-operations-rules.service.ts
 * - server/services/founder-admin.service.ts
 * - docs/product/BIZPILOT_PLAN_ENTITLEMENTS_AND_MANUAL_BILLING_SPEC_v1.0.md
 * - docs/product/BIZPILOT_CAPABILITY_SURFACE_AUDIT_2026-07-23.md
 * Author: MoOoH
 * Created: 2026-07-21
 * Last Updated: 2026-07-23
 * Change Log:
 * - 2026-07-23: Required direct founder-only discovery paths to exact workspace entitlement controls while preserving guarded mutation.
 * - 2026-07-22: Clarified cascade-safe exact-time cleanup and durable stale-draft replacement semantics.
 * - 2026-07-22: Added the exact-time/Toronto schedule contract, founder-controlled activation, atomic review lifecycle, public-catalog boundary, and ordered `0025` + `0026` release gates.
 * - 2026-07-21: Established the separately sold Premium Operations add-on contract and manual-first boundaries.
 * ============================================================
 -->

# BizPilot Premium Operations Add-ons v1.0

## Purpose

Premium Operations is an owner-facing, separately sold add-on family. It helps a business prioritize suitable quote requests, prepare a manager-reviewed reply for a selected group, and coordinate internal service time blocks. It does not change the base plan, public quote flow, or the manual-first product promise.

No base plan includes these capabilities automatically. Founder Pilot, Starter, and Pro continue to use their existing plan access. An authorized founder must activate or disable each add-on deliberately from the guarded internal Admin console after the commercial arrangement is agreed outside the product. That action is validated server-side, performed through the service-role path, and written to the founder audit trail. The owner dashboard cannot self-activate an add-on.

Admin Overview and an authorized founder viewing a locked Premium Operations module must
provide a direct path to the selected workspace's exact entitlement controls. The path
improves discoverability only: the control remains inside guarded Business Operations,
and a non-founder owner sees the locked explanation without receiving an Admin link.

The public Product and Pricing pages may describe this optional catalog in English and Canadian French. They must not invent an add-on amount or imply that base-plan pricing includes it: scope, price, and activation remain a separate founder-managed agreement.

## Add-on catalog

| Add-on | Entitlement key | Included behavior | Explicitly excluded |
| --- | --- | --- | --- |
| Priority Workbench | `priority_workbench` | Owner-defined service/area rules, ranks `1`–`5`, and a searchable lead list ordered by the best matching rule, urgency, then recency. | Automated routing, public ranking, or a replacement CRM. |
| Bulk Reply Review | `bulk_reply_review` | A manager selects eligible leads, prepares up to `50` personalized draft recipients, reviews the batch, and records each manual copy. | Automatic delivery, contact-provider access, campaign sending, or status inference. |
| Availability Coordination | `availability_coordination` | Internal service time blocks, exact-time conflict alerts, and a proposed response for manager review. | Public calendar, book-now page, automatic scheduling, availability promise, or booking confirmation. |

The database entitlement row is the only runtime access decision. Allowed active states are `enabled` and unexpired `trial`; `disabled` and `expired` are locked. Product pricing, invoice collection, and payment-link handling remain outside BizPilot until a separately approved billing project exists.

## Owner workflow

### Priority Workbench

1. The manager creates a named priority rule with optional service and area terms and a rank from `1` (highest) to `5`.
2. The protected dashboard finds leads matching active rules. The manager can narrow the visible audience by search, service, area, workflow status, and requested date. A lead without a matching rule remains visible but follows ranked leads.
3. Ties are deterministic: unresolved urgency, then newest request. A disabled rule cannot affect ordering.
4. The manager still opens the lead, reviews its details, and chooses a manual next action.

The feature is a work queue, not automated lead assignment. It must never hide lead data merely because it does not match a premium rule.

### Bulk Reply Review

1. The manager selects no more than `50` non-terminal leads from the protected queue.
2. The system renders a saved draft per recipient from the manager's template. Supported placeholders are `{{firstName}}`, `{{customerName}}`, and `{{service}}`.
3. A manager reviews the batch before any recipient becomes eligible to copy.
4. The manager copies one reviewed draft at a time into the chosen external channel. BizPilot records the copy event only; it does not connect to or deliver through that channel.

Archived, lost, and booked leads cannot join a new batch. The stored batch is an internal review record, not a messaging campaign.

### Availability Coordination

1. The manager creates an internal time block for a client or company, service label, start, end, and internal status (`tentative` or `reserved`).
2. When Availability Coordination is active, the public intake exposes the canonical template-linked `preferred_time` field with the real database type `time`. The exact time is valid only with the canonical `preferred_date`; legacy named windows may still be read conservatively for review but are never treated as exact appointments.
3. Every local schedule value is interpreted in the single release timezone `America/Toronto`, stored as a UTC instant, and rendered back in that operating timezone. Nonexistent or ambiguous daylight-saving clock times fail closed. This release deliberately has no per-workspace timezone setting.
4. If a new request overlaps a non-cancelled internal block, the dashboard flags it. Only a future canonical exact time can receive a same-operating-day opening suggestion; broad legacy windows remain review-only.
5. The manager can edit the proposed response before saving it, place it in the same review queue, approve it, and copy it manually if appropriate. Creation is atomic, and the request, submission, conflicting blocks, proposed opening, entitlement, workspace lifecycle, and lead state are revalidated before review and before copy. A stale draft fails closed and remains durable review history when a replacement is prepared; it is never silently deleted by the creation transaction. A saved review decision and recorded manual copy are immutable.
6. A manager can cancel an internal block so it no longer causes a conflict alert; no public cancellation or booking communication is sent. Active internal blocks cannot overlap, and past active ranges are rejected.

An internal opening is a coordination suggestion only. It is never shown to anonymous visitors and does not create a reservation, confirmed appointment, or customer commitment.

Deleting an exact-time value directly cannot leave `preferred_time` without its paired `preferred_date`. Deleting the containing submission or workspace remains cascade-safe so privacy and lifecycle cleanup can remove the pair together.

## Language, RTL, and numeric-input contract

The protected dashboard shell and Premium Operations interface support English, Canadian French, Persian, Arabic, and Spanish. This preference is stored in the dedicated `bizpilot-dashboard-interface-language` cookie and deliberately does not alter the business language used for public intake, customer content, or AI context.

- Persian (`fa`) and Arabic (`ar`) use RTL layout and text alignment for protected interface copy.
- English, French, and Spanish remain LTR.
- Date, time, numeric, phone, and structured technical input controls retain English/Latin LTR values in every interface language. A 24-hour input therefore stays `09:30`, never a visually reversed hour/minute order.
- Customer-provided content is not translated by the dashboard language control.

## Data and access boundaries

- All add-on records are tenant-scoped by `business_id` and protected by RLS.
- Members can read their workspace's entitlement and operation records; business managers can create, change, or remove operational records where the schema permits it.
- Entitlement mutation remains founder-only service-role work through the guarded Admin console. The founder can explicitly enable or disable a supported add-on; existing trial/expiry state remains visible but is not manufactured by the owner dashboard.
- Parent review records and their recipient rows are created through one transactional database operation so a partially created batch cannot be exposed.
- Availability review/copy is protected by canonical request provenance and current-conflict checks at both the application and database layers.
- The service rejects inactive, paused, deleting, or otherwise locked workspaces before creating new paid-operation records.
- No provider credentials, webhooks, message addresses beyond the existing lead record, payment data, or public availability endpoints are stored by this feature.

## Non-goals

- No automated sending, bulk email/SMS/WhatsApp integration, or external recipient delivery.
- No public booking page, calendar sync, booking confirmation, or calendar invitation.
- No invoice, checkout, subscription sync, or customer self-serve add-on purchase.
- No full CRM, pipeline automation, or automatic lead disposition.
- No claim that a suggestion, copied draft, or internal block guarantees service availability.

## Release and QA gates

Before activating an add-on for a real workspace:

1. Apply `0025_premium_operations_addons.sql` and then the additive `0026_premium_operations_schedule_integrity.sql`, in that order, only to an approved local/disposable target first. Never test these write-heavy RLS fixtures against managed Supabase or Production.
2. Verify locked entitlement behavior, founder enable/disable auditing, active entitlement behavior, lifecycle locks, priority ordering/filtering, atomic draft creation, exact-time provenance, `America/Toronto` daylight-saving boundaries, overlap serialization, stale-draft rejection, and the `50`-recipient cap.
3. Test English, French, Persian, Arabic, and Spanish at desktop and mobile widths. Confirm RTL placement for Persian/Arabic and Latin LTR rendering for time and numeric controls.
4. Confirm every proposed response remains editable, manager-reviewed, and manual-copy-only.
5. Run the exact final candidate through lint, typecheck, the full unit/source suite, dependency audit, production build, and local public smoke. Record the final counts only after those commands finish.
6. Publish and verify an exact commit in CI and a Vercel preview before any Production claim. Obtain a separate explicit Production migration approval and paid-pilot readiness approval before any Production schema operation or real-customer activation.
