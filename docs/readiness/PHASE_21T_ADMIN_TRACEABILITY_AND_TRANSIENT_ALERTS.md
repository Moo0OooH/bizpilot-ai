# Phase 21T - Admin Traceability And Transient Alerts

**Date:** 2026-05-25  
**Status:** Implementation verified locally; deploy verification required after push  
**Owner:** MoOoH  
**Related code paths:**
- `app/admin/page.tsx`
- `app/(dashboard)/dashboard/leads/[leadId]/page.tsx`
- `app/(dashboard)/dashboard/settings/page.tsx`
- `components/dashboard/flash-message.tsx`
- `server/actions/ai-lead-assistant.actions.ts`
- `server/services/ai/lead-conversion-assistant.service.ts`
- `server/services/owner-system-log.service.ts`
- `supabase/migrations/0021_session_policy_and_owner_audit.sql`

---

## Objective

Keep founder/admin operations traceable while preventing temporary UI messages from becoming stale dashboard state.

The immediate user-reported issue was a persistent banner:

`Fallback draft prepared. Model generation did not complete.`

That message was stored in the URL as `?notice=...`, so refreshing the lead detail page replayed the same warning even though it was only meant as short-lived UI feedback.

The product requirement is:

1. UI notices/errors should have a defined display time and should not remain after refresh.
2. Operational events must remain in customer/lead logs so admin can diagnose root causes later.
3. Every implementation pass should leave a clear document describing what changed, why, and which tests passed.

---

## Changes Completed

### 1. Transient dashboard/admin flash banners

Added `components/dashboard/flash-message.tsx`.

Behavior:
- Shows `notice`, `warning`, or `error` banners for a fixed duration.
- Default display time is 6.5 seconds.
- Error banners display for 10 seconds.
- AI fallback warnings display for 9 seconds.
- After the display time, the component removes `notice` and `error` from the current URL via `window.history.replaceState`.
- Existing non-flash query params are preserved.

Applied to:
- Lead detail notices/errors.
- Quote setup notices/errors.
- Business profile notices/errors.
- Settings notices/errors.
- Founder admin action notices/errors.

Result:
- Refreshing after the timeout no longer replays stale UI alerts.
- The UI remains clear while support-relevant events stay in persistent logs.

### 2. AI fallback events now remain in the lead timeline

Updated `server/services/ai/lead-conversion-assistant.service.ts`.

When AI generation succeeds:
- Inserts `usage_events.event_type = ai_bundle_generated`.
- Inserts a lead timeline event:
  - `event_label = AI assistant draft generated`
  - `event_type = action_completed`
  - metadata includes safe operational fields only:
    - `ai_output_id`
    - `event_category`
    - `provider`
    - `prompt_version`

When AI generation falls back to rules:
- Inserts `usage_events.event_type = ai_bundle_fallback`.
- Inserts a lead timeline event:
  - `event_label = AI fallback draft prepared`
  - `event_type = action_completed`
  - metadata includes safe operational fields only:
    - `ai_output_id`
    - `event_category`
    - `provider = rule_fallback`
    - sanitized fallback `reason`

No raw provider error, prompt, token, secret, customer payload, password, cookie, or stack trace is persisted.

### 3. Founder/admin traceability controls from the previous same-day pass

The same-day founder admin pass added:
- Per-business session policy fields:
  - `always_on`
  - `after_duration`
  - duration options from 15 minutes to 7 days
- Founder admin `Session policy` control inside Modify.
- Owner-visible `Session security` card in Settings.
- Owner-visible `System change history` in Settings.
- Founder admin customer/system change log inside Modify.
- Audit support for:
  - plan changes
  - access/status changes
  - quote link enable/disable
  - internal notes
  - session policy changes
  - test workspace cleanup
  - test auth user deletion
  - password reset requested
  - temporary password set

Important safety behavior:
- Temporary passwords are never written to logs.
- Password reset and temporary password actions write traceable events only.
- Admin-visible and owner-visible logs use safe metadata.

---

## Database Notes

`supabase/migrations/0021_session_policy_and_owner_audit.sql` adds:

- `businesses.session_timeout_mode`
- `businesses.session_timeout_minutes`
- constraints for valid timeout modes/durations
- new `admin_action_log.action_type` values:
  - `session_policy_changed`
  - `password_reset_requested`
  - `temporary_password_set`

The transient flash-message change does not require a database migration.

The AI fallback timeline logging reuses existing `lead_events.event_type = action_completed`, so no new lead event migration is required.

Production note:
- Session policy persistence and the new admin action types require migration `0021` to be applied to the production Supabase target.
- The app deployment can build before the migration, but saving those new admin controls depends on the migration.

---

## Verification

Local verification completed:

| Check | Result |
| --- | --- |
| `pnpm lint` | Pass |
| `pnpm typecheck` | Pass |
| `pnpm test:unit` | Pass, 59 tests |
| `pnpm build` | Pass |

Coverage notes:
- i18n structure and mojibake tests passed after the English/French dashboard copy additions.
- Build passed with the new client `FlashMessage` component imported into server-rendered dashboard pages.
- Unit tests do not currently simulate browser URL cleanup timing; this is covered by code inspection and build validation.

---

## Remaining Production Checks

After push/deploy:

1. Verify GitHub Actions passes for the deployed commit.
2. Verify Vercel production deployment completes.
3. Run public route smoke:
   - `pnpm smoke:public -- --base-url=https://bizpilo.com`
4. Run quote route smoke:
   - `pnpm smoke:quote -- --base-url=https://bizpilo.com --inactive-slug=/`
5. Confirm `/quote` still defaults to English even when the interface cookie is French.
6. Confirm `/quote?language=fr-CA` renders French.

Manual authenticated check still recommended:
- Generate an AI draft on a lead that falls back.
- Confirm the warning disappears after 9 seconds.
- Confirm the URL no longer contains `notice`.
- Confirm the lead timeline contains `AI fallback draft prepared`.
