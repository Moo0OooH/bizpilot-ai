# Dashboard V3 Single Standard Route Cleanup

Date: 2026-06-27
Repo: `E:\bizpilot-ai`
Canonical branch: `main`
Canonical commit after cleanup docs: `a6b5ccef10f36478c6f9a633bb81fd72c9ca0c44`
Production app URL: `https://bizpilo.com`
Production Vercel project: `moo0ooohs-projects/bizpilot-ai`
Production deployment rule: use the `bizpilo.com` alias as the stable target;
individual Vercel deployment URLs roll on every `main` push.
Production Supabase project: `bizpilot-production` / `qfqendrqimqvkoojpjao`

## Decision

Dashboard V3 has one standard path:

```text
GitHub main -> Vercel production project -> bizpilo.com -> Supabase qfqendrqimqvkoojpjao
```

The temporary Dashboard V3 preview branch was useful for implementation and QA,
but it is no longer allowed to appear as a competing source of truth.

## Git Cleanup

- Fast-forwarded `main` to include the complete Dashboard V3 implementation.
- Pushed `main` to origin.
- Deleted remote branch `codex/full-system-dashboard-qa-polish`.
- Deleted local branch `codex/full-system-dashboard-qa-polish`.
- Verified `origin/main` points at the latest Dashboard V3 commit.

## Vercel Cleanup

- Vercel CLI authenticated as `moo0oooh`.
- Confirmed the stale preview alias pointed at the deleted Dashboard V3 preview branch.
- Removed alias `bizpilot-ai-git-codex-full-system-das-6f5dea-moo0ooohs-projects.vercel.app`.
- Removed stale preview deployments tied to the deleted branch:
  - `bizpilot-i188fjl3j-moo0ooohs-projects.vercel.app`
  - `bizpilot-lognjt8fl-moo0ooohs-projects.vercel.app`
- Verified the stale preview alias can no longer be inspected in Vercel CLI.
- Removed 19 additional visible Preview deployments from earlier non-canonical
  preview history.
- Re-checked Vercel deployment pages; the current visible pages show Production
  deployments only. Historical Production deployments remain for rollback
  history, but the active public aliases point to the current Production
  deployment.

Production aliases remain:

- `https://bizpilo.com`
- `https://bizpilot-ai-gamma.vercel.app`
- `https://bizpilot-ai-moo0ooohs-projects.vercel.app`
- `https://bizpilot-ai-git-main-moo0ooohs-projects.vercel.app`

## Supabase Check

- Supabase CLI is installed and authenticated enough to list projects.
- The canonical production project is visible as `bizpilot-production` with ref
  `qfqendrqimqvkoojpjao`.
- Local `.env.local` public Supabase host matches `qfqendrqimqvkoojpjao.supabase.co`.
- No secrets, service keys, anon keys, database passwords, or connection strings
  were printed or committed.

The repo still has no committed `supabase/config.toml`. Do not infer migration
history from the dashboard alone; follow the existing Phase 21 production
migration and SQL verification documents before touching production database
state.

## Ongoing Rule

All future dashboard design, QA, Figma handoff, and implementation work starts
from `main` and records evidence against the master dashboard standard:

`docs/readiness/BIZPILOT_DASHBOARD_MASTER_STANDARD_AND_CODEX_GUIDE_2026-06-27.md`
