# Dashboard V3 Final Route Map and Account Safety - 2026-07-05

## Why the screenshot user cannot be deleted

The selected user is protected because it is linked to a production-customer workspace. The UI and server guards must block auth login removal for founder accounts, the signed-in founder, production-linked users, and workspaces that have not been confirmed as non-production.

The correct path for a disposable test account is:

1. Confirm the workspace is synthetic/internal test data.
2. Reclassify the workspace to `Founder test`, `Demo`, or `Seed` with an audit note.
3. Run workspace cleanup first.
4. Return to synthetic/test login cleanup and complete the double confirmation.

## Route Map Checked

| Area | Route | Purpose | Final state |
| --- | --- | --- | --- |
| Auth | `/auth/sign-in` | Owner/founder sign-in entry | Kept as the single protected-app entry point. |
| Auth | `/auth/sign-up` | Business owner account and workspace creation | Kept as onboarding entry; no admin shortcut. |
| Auth | `/auth/forgot-password` | Password reset request | Kept as preferred support path. |
| Auth | `/auth/reset-password` | New password completion | Kept behind Supabase recovery flow. |
| Auth | `/auth/check-email` | Confirmation and reset-email guidance | Kept for low-support onboarding. |
| Quote | `/quote` | Incomplete quote-link fallback | Renders a safe unavailable state without owner/admin leakage. |
| Quote | `/quote/[slug]` | Public customer quote request | Branded bilingual intake form; no booking, pricing, or availability confirmation. |
| Quote | `/quote/[slug]/success` | Quote request confirmation | Sets manual owner-reply expectation after intake capture. |
| Owner | `/dashboard` | Manual-first owner cockpit | Quote recovery snapshot, next action, queue shortcuts, and setup readiness. |
| Owner | `/dashboard/leads` | Lead review queue | Manual filters, privacy-safe customer display, copy/reply workflow. |
| Owner | `/dashboard/leads/[leadId]` | Single lead workspace | Request details, draft generation, manual copy/send, follow-up state. |
| Owner | `/dashboard/configuration` | Quote setup | Services, areas, questions, privacy, branding, and public quote readiness. |
| Owner | `/dashboard/quote-setup` | Legacy setup route | Redirect/compatibility route into configuration. |
| Owner | `/dashboard/business-profile` | Business identity | Public-facing profile, service area, and setup edits. |
| Owner | `/dashboard/settings` | Workspace settings | Plan/status readout, display preferences, and guarded deletion request. |
| Owner | `/dashboard/guide` | Owner operating guide | Route map, workflow, gaps, and manual operating rules. |
| Founder | `/founder` | Founder handoff | Explains internal admin surface and links to the admin console. |
| Admin | `/admin?adminPanel=overview` | Founder command overview | Honest operational health and current snapshot only. |
| Admin | `/admin?adminPanel=users` | User search and account support | Search, reset email, protected cleanup, and blocked access actions. |
| Admin | `/admin?adminPanel=businesses` | Workspace controls | Plan/status/link/session/admin notes with cleanup secondary. |
| Admin | `/admin?adminPanel=leads` | Internal lead review | Review/archive/delete for spam or test leads only. |
| Admin | `/admin?adminPanel=health` | Runtime checks | Supabase/runtime diagnostics without customer-data inspection. |
| Admin | `/admin?adminPanel=activity` | Audit trail | Recent founder/admin actions and trace review. |
| Exit | `signOutAction` from dashboard/admin topbar | End session | Kept as the only sign-out path exposed in the protected shell. |

## Account Safety Decisions

- Legacy destructive-account wording is now framed as `Account safety and cleanup`.
- Legacy test-login wording is removed from the visible app surface and replaced with `synthetic/test login cleanup`.
- Blocked customer-linked accounts now show a protected policy state instead of a failed destructive action.
- Real customer deletion, role changes, member invites, suspension, and workspace removal remain blocked until the owner-approved security/RLS gate is finished.
- Workspace cleanup still never deletes Supabase Auth users; login cleanup is separate and double-confirmed.

## Dashboard Completion Read

The current dashboard route set is intentionally compact: auth entry, owner recovery workspace, owner setup/profile/settings/guide, founder handoff, founder admin panels, and sign out. Extra pages should only be added when they reduce daily owner work or close a documented internal support gap.
