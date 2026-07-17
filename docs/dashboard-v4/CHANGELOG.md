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
 * Last Updated: 2026-07-16
 * Change Log:
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
