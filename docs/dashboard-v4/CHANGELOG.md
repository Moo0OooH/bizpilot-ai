<!--
 * ============================================================
 * File: docs/dashboard-v4/CHANGELOG.md
 * Project: BizPilot AI
 * Description: Human-readable Dashboard V4 change log.
 * Role: Summarizes user-visible and engineering changes without duplicating the source-of-truth status.
 * Related:
 * - docs/dashboard-v4/CURRENT.md
 * - docs/dashboard-v4/PHASE_PROGRESS.md
 * Author: MoOoH
 * Created: 2026-07-14
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Corrected the historical V4.7 local object identity and retained fresh external-evidence gates for the current candidate.
 * - 2026-07-21: Corrected the V4.7 source identity to the locally resolvable commit and marked external release evidence as requiring revalidation.
 * - 2026-07-17: Published and runtime-hardened the V4.7 form builder, responsive shell, optional navigation, source reporting, and OAuth-safe workspace flow.
 * - 2026-07-16: Published V4.6 setup, Guide, source-reporting, tracked-link, and branding finalization with Vercel and Production evidence.
 * - 2026-07-16: Recorded V4.5 source publication and Production public read-only evidence.
 * - 2026-07-16: Added the V4.5 complete sidebar and founder-admin access repair candidate.
 * - 2026-07-16: Closed V4.4 on main with successful Vercel and Production public read-only evidence.
 * - 2026-07-16: Added the V4.4 Quote Setup serialization repair, single desktop navigation, and accurate route recovery candidate.
 * - 2026-07-16: Closed V4.3 on main with successful CI, Vercel, and Production public read-only evidence.
 * - 2026-07-16: Added the V4.3 protected dashboard runtime and centered-navigation repair candidate.
 * - 2026-07-16: Closed the V4.2 main release with successful CI, Vercel, and Production read-only evidence.
 * - 2026-07-16: Added the V4.2 protected navigation, owner onboarding Guide, and progressive founder operations polish.
 * - 2026-07-16: Closed the V4.1 main release with successful CI, Vercel, and Production read-only evidence.
 * - 2026-07-16: Added the V4.1 guided Quote Setup and quote-page recovery release candidate.
 * - 2026-07-15: Replaced the prior release snapshot with final V2.1 CI, Vercel, and Production evidence.
 * - 2026-07-14: Added final release, CI, Vercel, and Production smoke evidence.
 * - 2026-07-14: Created for Dashboard V4.
 * ============================================================
 -->

# Dashboard V4 Changelog

## 2026-07-17 — V4.7 configurable intake and shell finalization

### Public form control

- Added a persistent form-structure editor for the public heading, supporting copy, ordered sections, section navigation labels, descriptions, visibility, and per-question assignment.
- Added three accessible presentation modes: one-page list, keyboard-operable tabs, and guided multi-step flow with Back/Continue controls and invalid-field recovery.
- Removed the fixed “What kind of cleaning?” ownership gap: the displayed title and supporting copy now come from the saved localized form layout.
- Kept existing businesses backward-compatible by normalizing legacy choice arrays and storing the versioned layout inside existing JSON metadata; no database migration is required.

### Dashboard shell and settings

- Corrected wide and compact sizing, bounded sticky task tabs, reserved space above fixed save controls, and lifted mobile actions above the safe-area navigation bar.
- Removed duplicate desktop Guide and Founder Admin utilities; wide screens use the sidebar, while compact screens retain the Actions menu.
- Added Settings controls that show or hide the optional Reports and Guide destinations for the current browser without hiding core routes or changing authorization.
- Kept founder authorization server-only so the provided founder email is configured through `BIZPILOT_FOUNDER_EMAILS`, never bundled into the application.

### Authentication and release verification

- Made auth provider detection explicit. Email recovery may create the intended first workspace; Google or unknown-provider recovery can repair an existing membership but cannot silently create a tenant.
- Restricted auth callbacks to exact safe routes, including exact `/admin`, and replaced provider-specific callback messaging with accurate neutral copy.
- Removed function-valued localization props from every affected Server-to-Client boundary in Quote Setup and the active public Quote flow; regression tests now reject non-serializable configuration copy and authenticated smoke includes Reports.
- Localized persisted default consent at render time for EN/fr-CA without overwriting custom owner-authored consent.
- ESLint, TypeScript, all `295/295` unit/source tests, and the Next.js 16.2.4 production build pass.
- Local Git contains historical commit `d9e25bbf50ccf42de2da4d70aa235ab7d289dc91` with tree `17d6b65cc9fb196c8d0d4ccaa46f5fd6f736076d`. The previously documented `a82af72bf8960b2bce1583e6446abca706c2a2bc` object is absent; these local facts do not independently revalidate external evidence.
- The earlier CI, Vercel, and Production figures are historical records, not current release proof: no matching remote ref, deployment, or Production result is claimed until independently revalidated.
- Full protected visual acceptance, any Production migration, and the later ordered Premium Operations `0025` + `0026` release remain separately gated.

## 2026-07-16 — V4.6 setup-to-reporting finalization

### Owner setup and guidance

- Added six ordered readiness-backed stages from business identity through services, questions, branding, knowledge/privacy, preview, and tracked sharing.
- Kept safe starter content available while leaving new-workspace readiness unconfirmed until the owner reviews and saves it.
- Scoped Business Profile and Quote Setup confirmation separately so one save cannot complete untouched steps, and returned save errors/success to the owning route.
- Made setup deep links open the correct mounted panel and added standard arrow/Home/End keyboard behavior to the task tabs.
- Split Guide into explicit Setup and optimization and Workflow and reporting sections, with live workspace readiness and the first incomplete task.

### Source reporting

- Added privacy-safe tracked quote-link variants for website, Google Business Profile, social, messaging, email, saved replies, and custom placements.
- Rebuilds source metadata from the allowlisted placement fields on the server and preserves those safe tags when a failed submission returns the customer to the quote form.
- Added protected Owner Reports with period filters, tracked coverage, source mix, campaign tags, manual workflow outcomes, and contact-free recent activity.
- Batched owner source-metadata reads at 200 lead IDs beneath the explicit 1,000-request report bound.
- Added the same bounded source/campaign/outcome overview to Founder Admin while preserving the existing detailed inbox.
- Kept reporting claims honest: requests are counted at submission; Direct and Unknown remain visible; clicks, profile views, revenue, and automatic conversions are not inferred.

### Public quote and branding

- Replaced preview-only color behavior with one shared public brand palette used by setup preview, quote intake, and success state.
- Derived readable foreground, hover, text, and focus colors using WCAG contrast calculations without overwriting semantic success colors.
- Clarified exactly where primary/accent colors apply and that dashboard theme colors remain independent.
- Added a visible three-section quote rail, correct bilingual field grouping, and the exact persisted consent notice.

### Release verification

- ESLint and TypeScript pass; all `272/272` unit/source tests pass on the final tree merged with the latest public-site `main` baseline; Next.js 16.2.4 production build passes.
- Local production public routes pass `46/46`, bilingual responsive routes pass `20/20`, and the final UI matrix reports zero failures.
- Exact tree `43ced7bc8e1914a72366bb1b8581ae4afcc02846` was published directly to `main` as `b2ca255ec45b4ebf015603017728b0a5e5ce8c15`; Vercel target `BhNUwzTNx2RmLnwXKrjbVZioAxU9` succeeded.
- Production public routes pass `46/46`, bilingual responsive routes pass `20/20`, the final UI matrix passes `621/621`, and inactive Quote GET passes `2/2` in EN/fr-CA.
- No migration, Production data mutation, customer submission, direct social integration, automatic send, booking, or payment behavior was added.
- Protected visual acceptance remains gated until an approved authenticated QA target is available.

## 2026-07-16 — V4.5 complete workspace navigation

### Owner shell

- Restored a fixed, grouped desktop sidebar with Overview, Leads, Quote Setup, Business Profile, Settings, and Guide; retained the five-task mobile bar.
- Moved desktop route ownership out of the topbar so language, theme, account, sign-out, and compact-screen actions remain clear and non-duplicative.
- Added workspace and signed-in user context to the sidebar without exposing customer content.

### Founder access and resilience

- Made the authorized Founder Admin destination explicit on desktop instead of placing it only inside a compact-screen disclosure.
- Localized known Admin access failures and removed remaining hardcoded visible status text.
- Contained and logged optional linked-user fallback failures so one Auth read cannot replace the whole Admin console with a generic blocked state.

### Candidate verification

- ESLint, TypeScript, all `257/257` unit/source tests, and the Next.js 16.2.4 production build pass.
- No database migration, tenant mutation, synthetic customer write, or Production authenticated automation was performed.
- Exact source was published directly to `main` as `5fdcf929d5b1393178a2fcf7e9e06192b00cbb5b`.
- Production passed public routes `46/46`, bilingual responsive routes `20/20`, the UI matrix with zero failures, and inactive Quote GET `2/2` in EN/fr-CA.
- GitHub exposed no deployment status for the release commit, so no Vercel target or protected deployment success is claimed.

## 2026-07-16 — V4.4 Quote Setup render and shell repair

### Authenticated rendering

- Removed the function-valued FAQ count formatter from the props passed into the client-side FAQ editor. The editor now receives serializable singular/plural labels, so authenticated Quote Setup requests no longer fail the Next.js Server/Client Component boundary.
- Added a focused regression source guard for the exact boundary that caused the protected route error.
- Kept the existing server-side localized summary formatter where it is safe; no owner data shape or saved configuration changed.

### Navigation and recovery

- Removed the fixed desktop sidebar after the five primary destinations were already promoted into the centered topbar, eliminating duplicated navigation and restoring the full content width.
- Kept the five-destination mobile bottom bar and the compact tablet Actions menu. Guide remains a secondary help destination.
- Replaced the whole-dashboard reload action with Next.js route-segment retry, clearer EN/fr-CA copy, saved-data reassurance, and native recovery destinations.

### Candidate verification

- ESLint, TypeScript, all `257/257` unit/source tests, and the Next.js 16.2.4 production build pass.
- No route, migration, schema, submission, tenant record, or Production database state was added or changed.
- Authenticated browser confirmation remains gated until an approved local/synthetic session or an owner-run deployed check is available.
- Exact source was published directly to `main` as `0d9ec227244feae27d912e8ff3f2c3c84087f961`; Vercel target `Etoe7P45rEUvT3VEdTAuwayFyvMs` succeeded.
- Production passed public routes `46/46`, bilingual responsive routes `20/20`, the final UI matrix with zero failures, and inactive Quote GET `2/2` in EN/fr-CA.
- The available connector does not expose push-triggered GitHub Actions runs, so no CI run number is claimed for this release.

## 2026-07-16 — V4.3 protected runtime recovery

### Dashboard loading and navigation

- Removed the client-managed desktop Actions disclosure introduced in V4.2 and replaced it with a centered, always-visible owner route bar on wide screens.
- Kept a compact mobile/tablet Actions disclosure while moving every protected route destination to a native full-page transition, so a stale App Router state cannot trap the owner.
- Applied the same native transition behavior to the desktop sidebar and mobile task bar.
- Memoized the authenticated user and tenant workspace reads per server render, eliminating duplicate session and tenant queries between the protected layout and route page.

### Bilingual and release verification

- The centered and compact navigation both consume the shared EN/fr-CA owner dictionary and preserve the current workspace language action.
- ESLint, TypeScript, all `256/256` unit/source tests, and the Next.js 16.2.4 production build pass on the candidate tree.
- No route, migration, tenant data, submission, or Production database state was added or changed.
- Exact source was published directly to `main` as `bcf037090717935a2cd97bcdccb08a525795c246`; GitHub CI run `29538671150` and Vercel target `FTVpVmQT8j8ST74YvpzF6Q47vdDq` succeeded.
- Production passed public routes `46/46`, bilingual responsive routes `20/20`, the final UI matrix with zero failures, and inactive Quote GET `2/2` in EN/fr-CA.

## 2026-07-16 — V4.2 protected navigation and first-run polish

### Dashboard navigation and recovery

- Right-aligned the desktop utility toolbar instead of letting the single remaining flex child fall to the left.
- Restored all owner destinations inside Actions, closed the menu after navigation, and disabled protected-route prefetch to avoid background requests for database-heavy routes.
- Added full-reload recovery plus native Overview, Quote Setup, and Guide links to the protected route error state.

### First-time owner guidance

- Added a four-step first-session path covering setup, preview, the unique link, and the first lead review.
- Added a concise daily routine and the Guide itself to the route map.
- Replaced roadmap-style “gaps” with practical bilingual troubleshooting so the Guide teaches the existing complete workflow instead of implying missing features.

### Founder Business Operations

- Removed duplicated cross-panel header actions and duplicated recent activity from Businesses.
- Reduced the visible summary to four operational metrics while keeping other system signals in their existing Overview/sidebar locations.
- Moved access/plan/quote controls, workspace tools, and sensitive tools into clearly labeled progressive disclosures. All guarded forms and safety rails remain available.

### Release verification

- Package version: `0.2.2`.
- TypeScript, ESLint, and Next.js 16.2.4 production build pass.
- Unit/source suite passes `256/256`.
- Local production-mode public routes pass `46/46`, bilingual responsive routes pass `20/20`, the final UI matrix has zero failures, and inactive Quote GET passes `2/2` in EN/fr-CA.
- Exact tested tree was published directly to `main` as release SHA `5d9ce9bfc01cc57630282a08cdc1ec265c72fdc4`, without an extra branch or PR.
- GitHub CI run `29537073204` and Vercel target `4YFtU4y2aAMAUxKLNyHevhKGDccJ` succeeded.
- Production passed public routes `46/46`, bilingual responsive routes `20/20`, the final UI matrix with zero failures, and inactive `bizpilot0wner` Quote GET `2/2` in EN/fr-CA.
- No Production submission, database mutation, migration, synthetic customer, or authenticated browser automation was used.

## 2026-07-16 — V4.1 Quote Setup finalization

### Dashboard shell and simplicity

- Corrected the desktop Actions dropdown so it opens inside the content column instead of beneath the fixed left sidebar.
- Replaced Quote Setup's nested desktop sidebar and repeated right rail with one compact horizontal task bar and one visible task at a time.
- Added a dedicated Public Link task with the full unique URL, copy action, placement examples, and clear save-before-share guidance.

### Forms, branding, and AI knowledge

- Rebuilt Add Field as an empty-first progressive flow with five cleaning-specific starters, live previews, and advanced-only priority/key controls.
- Added local PNG/JPG/WebP logo selection with bounded browser resizing, a secure HTTPS alternative, remove/reset controls, and a live brand preview.
- Applied saved logos and primary/accent colors to the public Quote page instead of limiting branding to the dashboard preview.
- Added five English and Canadian French FAQ starters plus visible manual-first AI boundaries.
- Added saved FAQs, services, and service areas to the versioned AI draft context; absent facts remain explicitly unknown.

### Quote-link reliability

- `Save & preview` now persists owner choices, synchronizes the existing public-link/consent/intake dependencies, and then opens an owner-marked preview.
- Unready owner previews explain the missing setup and return directly to Quote Setup; anonymous unavailable pages preserve the public-safe return to BizPilot.
- Removed the duplicate logo editor from Business Profile and kept Quote Setup as the single branding authority.

### Release verification

- TypeScript, ESLint, and Next.js 16.2.4 production build pass.
- Unit source/regression suite passes `254/254`.
- Local production public route smoke passes `46/46`; bilingual responsive smoke passes `20/20`.
- Exact tested tree was published directly to `main` as release SHA `510043f8f5d6985e26aa5db52989f6b6806b009c`, without an extra branch or PR.
- GitHub CI run `29524786852` and Vercel target `9dK6XxKYcGM6TiMHBng2DwDY4pRZ` succeeded.
- Production passed public routes `46/46`, bilingual responsive routes `20/20`, the final UI matrix with zero failures, and inactive `bizpilot0wner` Quote GET `2/2` in EN/fr-CA.
- Real Chrome and authenticated local dashboard browser runs remain environment-gated; no Production data, migration, synthetic customer, or authenticated browser mutation was used.

## 2026-07-14

### Owner shell

- Reduced primary navigation to five task destinations and exposed Settings in mobile navigation.
- Removed the repeated page-guide rail, local density/display preference framework, and duplicated topbar route heading.
- Narrowed protected content from 108rem to 90rem for more consistent laptop and large-screen composition.

### Owner workflow

- Rebuilt Overview around one next action, compact readiness, daily priorities, useful metrics, and a short lead queue.
- Simplified Leads to one contextual focus cue plus the full searchable/sortable/paginated queue.
- Simplified Lead Detail, kept advanced context in disclosures, removed a non-persisted notes box, and replaced a no-op Edit control with real draft editing.
- Reduced Quote Setup to Overview, Services, Fields, Branding, FAQ/AI, and Privacy while preserving all required form values.
- Reduced Settings to account/language/theme/session essentials plus guardrail, history, and lifecycle disclosures.

### Founder operations

- Removed the extra founder handoff screen after authorization.
- Replaced the decorative overview chart matrix with compact localized metrics and operational priorities.
- Retained search, health, lead, activity, cleanup, lifecycle, and audit controls behind existing guards.

### Localization and quality

- Polished Canadian French owner/admin accents and built-in custom-field examples.
- Replaced obsolete Dashboard V3/P12 regression tests with Dashboard V4 contracts.
- Consolidated current docs and removed reports superseded by the V4 source of truth.

### Boundaries

- No application route, feature entitlement, database migration, Production data mutation, automatic sending, booking, payment, or direct social integration was added.

### Release evidence

- V2.1 release commit `e922485fff985dfe03a508b1d2c8a5794db9d3cb` was published directly to `main` without an extra branch or PR.
- GitHub CI run `29390428140` and Vercel target `FMTLX7SnzUMBsPLsf1iKgeNbPyvi` completed successfully.
- Production public route smoke passed `46/46`; bilingual responsive smoke passed `20/20`; final UI matrix reported zero failures; inactive Quote GET passed `2/2` in EN/fr-CA.
- Authenticated dashboard, real Chrome, managed database, real-data, and paid-pilot gates remain explicitly separate.
