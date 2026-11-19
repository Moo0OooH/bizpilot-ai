<!--
 * ============================================================
 * File: docs/readiness/GITHUB_BASELINE_2026-11-19.md
 * Project: BizPilot AI
 * Description: Current source and GitHub verification baseline for the security dependency update.
 * Role: Records what was verified on the current candidate and which external gates remain open.
 * Related:
 * - docs/readiness/FINAL_SYNC_2026-11-19.md
 * - README.md
 * - package.json
 * - pnpm-workspace.yaml
 * - .github/workflows/ci.yml
 * - docs/readiness/current-status.json
 * Author: MoOoH
 * Created: 2026-11-19
 * Last Updated: 2026-11-19
 * Change Log:
 * - 2026-11-19: Marked this candidate baseline superseded by the completed final synchronization and release evidence.
 * - 2026-11-19: Recorded the latest merged GitHub base, security update, local verification, and remaining functional gates.
 * ============================================================
 -->

# GitHub baseline — 2026-11-19

> This file records the pre-release candidate baseline. The candidate was subsequently merged, deployed, database-verified, and acceptance-tested. Use [FINAL_SYNC_2026-11-19.md](FINAL_SYNC_2026-11-19.md) for current status.

## Scope and source position

The candidate starts from GitHub `main` commit `0b8d977b5243cc5f13f4137c259d77151407dad9`. That commit includes merged PR #12 (dashboard hierarchy and public clarity) and PR #13 (owner authentication recovery). GitHub Actions [main run 31714240258](https://github.com/Moo0OooH/bizpilot-ai/actions/runs/31714240258) passed for that base commit. The local working tree was fast-forwarded to the exact base before this security update.

This candidate updates Next.js and `eslint-config-next` from `16.2.11` to `16.4.6`, replaces vulnerable transitive dependency pins in `pnpm-workspace.yaml`, and adds `pnpm audit` to the `verify` command used by CI. React and React DOM remain `19.2.7`; the product routes and database migrations are unchanged. The lockfile is committed with these changes.

## Verification on the updated candidate

| Check | Result | Limit |
| --- | --- | --- |
| `pnpm install --frozen-lockfile` | Pass | Reproducible local install. |
| `pnpm audit` | Pass: zero known vulnerabilities; the prior tree reported 36 (5 critical, 21 high, 9 moderate, 1 low). | Registry advisory snapshot on 2026-11-19; future advisories can change this. |
| `pnpm verify` | Pass: lint, TypeScript, 367/367 unit/source tests, static Supabase RLS/grant audit, and Next.js 16.4.6 production build. | Source and local build proof; no authenticated live workflow or database-backed RLS execution. |
| `git diff --check` | Pass. | Formatting only. |

The public runtime smoke, authenticated owner/Founder smoke, and database-backed RLS suite were not executed for this dependency update. The available `.env.local` points to a managed Supabase host; a local-only server launch was rejected by the execution policy. No real customer data, access state, production database, migration, or entitlement was read or changed during this work.

## Release boundary

The July `docs/readiness/current-status.json` and release documents record the earlier Premium Operations deployment and restored-target proofs. Their CI, Vercel, Production, and RLS results do not prove this November dependency candidate. The source contract remains manual-first: owners review and copy drafts; founder controls stay guarded; there is no automatic send, confirmed booking, payment capture, or full CRM claim.

The next release evidence is GitHub CI on the candidate branch and, before any Production deployment or pilot claim, a separately approved deployment and read-only runtime acceptance. Live Google OAuth, authenticated recovery, a safe disposable database RLS run, real customer data, and paid-pilot readiness remain separate gates.
