<!--
 * ============================================================
 * File: docs/dashboard-v4/PHASE_PROGRESS.md
 * Project: BizPilot AI
 * Description: Dashboard V4 implementation and validation progress ledger.
 * Role: Separates completed source work from verification and owner/external gates.
 * Related:
 * - docs/dashboard-v4/CURRENT.md
 * - docs/readiness/current-status.json
 * - prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.1.md
 * Author: MoOoH
 * Created: 2026-07-14
 * Last Updated: 2026-07-15
 * Change Log:
 * - 2026-07-15: Recorded the V2.1 candidate verification at 249/249 unit, 46/46 public, 20/20 responsive, zero UI-matrix failures, and 2/2 inactive Quote GET.
 * - 2026-07-15: Linked Dashboard progress to the consolidated V2.1 external gate sequence.
 * - 2026-07-14: Closed the push, CI, Vercel, and Production public read-only release phases with exact evidence.
 * - 2026-07-14: Created the V4 phase ledger with completion evidence and explicit external gates.
 * ============================================================
 -->

# Dashboard V4 Phase Progress

Status vocabulary: `DONE` means implemented and source-verified; `GATED` means blocked by an environment, owner decision, or production-safety requirement; `NOT STARTED` means approved work has not begun.

| Priority | Phase | Status | Acceptance evidence |
| --- | --- | --- | --- |
| P0 | Baseline, instructions, route/data audit | DONE | Main/worktree checked; routes, docs, logs, tests, data boundaries, and current blockers reviewed. |
| P0 | Shell and primary navigation simplification | DONE | Five primary destinations; Settings visible on mobile; guide secondary; repeated route guide/display preferences removed. |
| P0 | Overview decision hierarchy | DONE | One recommended action, compact readiness, three daily priorities, four metrics, five-row queue; redundant charts/rails removed. |
| P0 | Lead queue and detail workflow | DONE | Focus guidance only when requested; no repeated rules rail; real editable draft; non-persisted scratchpad and duplicate identity card removed. |
| P0 | Quote Setup and Settings scope | DONE | Quote Setup reduced to six coherent sections; duplicate identity/notification/public-page/readiness tabs removed; Settings reduced to preferences plus three advanced disclosures. |
| P1 | Founder/Admin clarity | DONE | Authorized `/founder` redirect; compact localized overview; decorative charts and hardcoded summary labels removed; guarded controls retained. |
| P1 | Canadian French polish | DONE | Owner/admin dictionary and built-in custom-field examples corrected without changing localization shape or product claims. |
| P1 | Regression contract modernization | DONE | Obsolete V3/P12 source guards replaced with V4 navigation, simplicity, manual-safety, localization, and no-fake-analytics contracts. |
| P1 | Documentation V2 consolidation | DONE | Current authority map, source of truth, dashboard contract, phase ledger, changelog, status JSON, and external prompt pack created/updated. |
| P0 | Lint, typecheck, unit, build | DONE | ESLint: zero warnings; TypeScript: PASS; unit: 249/249; Next.js 16.2.4 production build: PASS. |
| P0 | Local production public route/responsive/UI/Quote smoke | DONE | Public: 46/46; bilingual responsive: 20/20; final UI matrix: zero failures; inactive Quote GET: 2/2. |
| P0 | Documentation V2.1 cleanup and link audit | DONE | 55 active docs artifacts; 54 Markdown files including root README audited with zero broken local Markdown links; obsolete snapshots removed from the tree and retained in Git history. |
| P0 | V2.1 main push, CI, Vercel, Production rerun | IN PROGRESS | Candidate local gate passed; exact commit/deployment and Production results must be recorded after push. |
| P0 | Main push, CI, and Vercel rollout | DONE | Functional release SHA `b81f71d`; GitHub App validation success; Vercel status success; local and `origin/main` synchronized. |
| P0 | Production public read-only acceptance | DONE | `bizpilo.com`: public 34/34; bilingual responsive 20/20; final UI matrix zero failures; inactive quote GET 1/1. |
| P1 | Real Chrome public interaction smoke | GATED | The runner is available, but this execution environment has no Chrome/Chromium binary. |
| P0 | Authenticated local/synthetic browser smoke | GATED | Local dashboard/auth target variables are unavailable; Production synthetic writes are prohibited. |
| P0 | Production authenticated read-only visual QA | GATED | Requires owner-approved credentials/session and no-secret QA procedure. |
| P0 | Managed Supabase migration/restore reconciliation | GATED | Requires a separately approved, backup-aware, read-only-first procedure. |
| P0 | Google OAuth live enablement | GATED | Application path exists; external provider/configuration and owner QA are unverified. |
| P0 | Real customer data / paid pilot | GATED | Requires explicit owner approval after restored-target, support, payment/refund, and rollback gates. |

## Final verification record

This section is updated only with commands actually run on the final working tree.

- TypeScript: PASS.
- V4 targeted source contracts: PASS.
- Full unit suite: PASS, 249/249.
- ESLint: PASS, zero warnings.
- Next.js 16.2.4 production build: PASS.
- Local production public route smoke: PASS, 46/46, including every Auth GET, unavailable Quote states, invalid success recovery, bilingual 404, and compatibility redirects.
- Local bilingual responsive smoke: PASS, 20/20.
- Local final UI matrix: PASS, zero failures across the recorded route/locale/theme/metadata matrix.
- Local inactive Quote GET: PASS, 2/2 EN/fr-CA with no configured Supabase target; provider/configuration read failure safely returns the unavailable state.
- GitHub CI: PASS for functional release SHA `b81f71d870528219a13eae8575e387397c4883e7`.
- Vercel commit deployment status: SUCCESS for functional release SHA `b81f71d870528219a13eae8575e387397c4883e7`.
- Production public route smoke: PASS, 34/34.
- Production bilingual responsive smoke: PASS, 20/20.
- Production final UI matrix: PASS, zero failures.
- Production inactive quote GET: PASS, 1/1; no submission or data mutation was performed.
- Real Chrome interaction smoke: GATED because Chrome/Chromium is not installed in the execution environment; no application failure was observed.
- Safe target classifier: executed; Dashboard/Auth and RLS-required smoke remained gated because `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `DATABASE_URL` were missing.
- Database/RLS mutation: NOT RUN; Production data unchanged.

## Ideal completion definition

The dashboard code release is complete when the final local code suite passes and the commit is pushed. The product is not “paid-pilot ready” until every gated item above has separate evidence. These two states must never be conflated.
