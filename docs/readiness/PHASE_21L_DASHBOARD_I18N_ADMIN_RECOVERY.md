# Phase 21L - Dashboard i18n and Admin Recovery Fix

**Date:** 2026-05-24  
**Branch:** `phase-21-production-alignment`  
**Status:** Code fixed and locally validated. Production deployment not performed in this phase.

## Why this pass was needed

Owner screenshots showed a real mismatch:

- English dashboard still displayed French sample/demo copy inside the Lead Recovery Queue.
- French dashboard/settings still had large English sections.
- The language toggle could show a state that did not match the authenticated workspace language.
- Settings could crash when older/drifted workspace rows did not provide `lifecycle_status`.
- Founder admin deletion existed, but the path to make fake/test users deletable was not obvious or complete.

## Root causes found

1. The dashboard topbar language form used `setInterfaceLanguageAction`, which only persisted the interface cookie.
2. Authenticated dashboard pages use `businesses.preferred_language` as the source of truth.
3. The empty Lead Recovery Queue demo kept sample lead content inside the component, with labels pulled from the dictionary. That made mixed-language regressions easier.
4. Settings assumed `activeBusiness.lifecycle_status` was always present at runtime.
5. Founder auth deletion correctly blocked production/owner-linked users, but admin lacked a clear workspace-kind control to move fake workspaces into the safe cleanup path.

## Code changes

- `components/dashboard/dashboard-topbar.tsx`
  - Switched EN/FR submit from cookie-only action to `updateWorkspaceLanguageAction`.
  - The topbar now updates the business workspace language and the pre-auth interface cookie together.

- `lib/i18n/bizpilot-copy.ts`
  - Added `demo.sampleLeads` as the centralized localized sample-lead source.
  - English and Canadian French sample leads now have matching structure.

- `components/dashboard/lead-workspace-queue.tsx`
  - Removed hardcoded sample lead array from the component.
  - The demo queue now reads sample leads from `copy.demo.sampleLeads`.
  - Sample cards are selectable so the demo panel updates reply/follow-up drafts instead of staying fully static.

- `app/(dashboard)/dashboard/settings/page.tsx`
  - Added safe fallback for missing `lifecycle_status` / `status` runtime values.
  - Settings no longer crashes when a drifted/older workspace row is missing lifecycle fields.

- `app/admin/page.tsx`
  - Added founder admin `Workspace kind` control.
  - Workspace kind can now be set to `Production customer`, `Founder test`, `Demo`, or `Seed`.
  - User delete controls now span the row instead of being buried in a narrow final column.
  - Added a founder admin safety rail that keeps production-customer cleanup, dry-run requirements, and separate auth deletion behavior visible before destructive controls.

- `components/admin/founder-auth-user-delete-form.tsx`
  - Blocked delete state is now explicit.
  - The form explains the safe path: mark fake workspace as non-production, then cleanup/transfer before auth deletion.
  - The form now states that auth deletion is audited before the Supabase Auth delete call, so missing production `0020` blocks before identity deletion.

- `components/admin/founder-test-cleanup-form.tsx`
  - The cleanup panel now shows the current workspace kind.
  - Production-customer workspaces show an explicit hard-purge block state.
  - Eligible fake/test workspaces still require dry-run, acknowledgement, final confirmation, and exact business name or slug.
  - The panel now reminds the founder that workspace cleanup never deletes Supabase Auth users.

- `server/actions/founder-admin.actions.ts`
  - Added `updateFounderWorkspaceKindAction`.

- `server/services/founder-admin.service.ts`
  - Added workspace-kind validation and founder-only update orchestration.

- `server/repositories/founder-admin.repository.ts`
  - Added workspace-kind update support through the existing founder business controls repository.

- `tests/unit/i18n-copy.test.mts`
  - Added regression tests that enforce:
    - topbar uses the workspace-language action,
    - demo leads stay centralized in copy,
    - English demo sample leads do not contain French queue copy,
    - French demo sample leads do not contain English queue copy.

- `tests/unit/founder-cleanup-safety-source.test.mts`
  - Added regression coverage for visible production-safe cleanup warnings in founder admin UI.

## Validation

Commands run:

```txt
pnpm verify
pnpm test:unit
pnpm typecheck
pnpm lint
pnpm build
git diff --check
```

Results:

- `pnpm verify`: pass
- `pnpm test:unit`: pass, 51/51 after the production-safe cleanup warning polish
- `pnpm typecheck`: pass
- `pnpm lint`: pass
- `pnpm build`: pass
- `git diff --check`: pass, CRLF warnings only

Browser QA on `http://localhost:3000`:

- `/dashboard` EN: active language `en`, English queue/metrics visible, French queue/demo markers absent, no horizontal overflow.
- `/dashboard` FR: active language `fr-CA`, French dashboard/queue visible after submit completes, English queue title absent, no horizontal overflow.
- `/dashboard/settings` FR: page loads, French settings/future/guardrail copy visible, English future/settings markers absent, no horizontal overflow.
- `/dashboard/settings` EN: page loads, English settings/future copy visible, French settings/future markers absent, no horizontal overflow.
- `/admin`: local browser reached founder access screen, but full admin controls could not be visually tested locally because `BIZPILOT_FOUNDER_EMAILS` was not configured in the local dev environment.
- `/admin` after cleanup warning polish: local browser reached the founder access screen, showed `Founder admin is not configured`, and had no horizontal overflow at 1280px. Full destructive-control visual QA still needs a founder-configured environment or deployed branch.

## Important behavior notes

- The authenticated dashboard language is intentionally workspace-backed.
- The EN/FR topbar is now a workspace language change, not just a temporary UI cookie.
- Fake/test auth user deletion is still guarded:
  - founder/self accounts are blocked,
  - owner-linked accounts require workspace cleanup or ownership transfer first,
  - production workspaces are blocked,
  - fake cleanup is only for `founder_test`, `demo`, or `seed`.
- Founder admin now shows these cleanup/auth-deletion constraints before the operator reaches the destructive controls.

## Owner action path for fake/test account deletion

1. Open `/admin` as founder.
2. Find the fake/test business in `Businesses`.
3. Change `Workspace kind` from `Production customer` to `Founder test`, `Demo`, or `Seed` only if the workspace is truly fake/test data.
4. Save workspace kind with a note explaining why it is safe.
5. Run `Test/demo cleanup` dry run for that business.
6. If counts look correct, complete the hard cleanup confirmation.
7. Return to the `Users` list.
8. Open `Delete fake/test login`.
9. Type the exact email or auth user ID, acknowledge, final-confirm, and submit.

## Still not done here

- No production deploy was performed.
- No main push/deploy was performed.
- No production SQL was applied.
- Full live `/admin` visual QA still needs a founder-configured environment or production deployment of this branch.
