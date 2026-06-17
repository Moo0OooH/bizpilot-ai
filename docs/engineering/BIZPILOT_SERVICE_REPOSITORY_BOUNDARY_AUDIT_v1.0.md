# BizPilot AI Service And Repository Boundary Audit v1.0

**Status:** Active MVP foundation audit
**Created:** 2026-05-13
**Scope:** App, action, service, policy, repository, Supabase client, error, and logging boundaries

---

## Purpose

This audit maps how BizPilot AI currently moves data and decisions through the MVP. It is audit-first and does not redesign the application. The goal is to confirm the existing boundaries are safe enough for the next RLS-focused phases and to identify refactors that should be deferred until they are covered by tests.

---

## Layer Responsibilities

| Layer | Responsibility | Boundary Rule |
| --- | --- | --- |
| App pages | Server-render route entry, page-level data loading, redirects, not-found states, and form rendering | May call server services/actions; must not use service-role client directly |
| Components | UI and interaction only | Client components must not import server-only modules at runtime |
| Server actions | Mutation entry points for forms | Validate input, call services, revalidate/redirect, map internal errors to safe user messages |
| Server services | Business workflow orchestration | Create server Supabase client, enforce policy checks where needed, call repositories |
| Server repositories | Database access | Query/mutate tables only; no UI copy, redirects, or client imports |
| Server policies | Reusable authorization decisions | No UI behavior, no redirects |
| Errors/logging | Safe boundary controls | Actions map user-facing errors; logging must avoid sensitive content |
| Supabase clients | Data access boundary | Browser client is public anon only; server client is session/RLS-scoped; service role is isolated |

---

## Supabase Client Usage By Layer

| Client | File | Current Usage | Boundary Status |
| --- | --- | --- | --- |
| Browser public client | `lib/supabase/client.ts` | Available for client-safe auth/browser use | Uses only `NEXT_PUBLIC_SUPABASE_URL` plus `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Server session client | `lib/supabase/server.ts` / `createSupabaseServerClient()` | Auth, dashboard reads/writes, public quote reads/inserts, AI persistence | Server-only, cookie/session-aware, respects RLS |
| Service-role client | `lib/supabase/server.ts` / `createSupabaseServiceRoleClient()` | Sign-up tenant bootstrap only | Server-only, isolated, not used for normal dashboard reads/writes |
| Middleware/proxy client | `lib/supabase/middleware.ts` | Dashboard request guard | Uses publishable/legacy anon key and session cookies; no service-role access |

---

## Workflow Call-Chain Map

### Sign-Up / Tenant Bootstrap

| Step | Current Boundary |
| --- | --- |
| Page/component entry | `app/auth/sign-up/page.tsx` renders form and binds `signUpAction` |
| Action | `server/actions/auth.actions.ts` validates display name, business name, email, password |
| Service | `signUpWithPassword()` in `server/services/auth.service.ts`; `createFoundingBusiness()` in `server/services/business.service.ts` |
| Repository | `businesses.repository.ts`, `business-members.repository.ts` |
| Policy check | None before bootstrap; new user owns initial business |
| Supabase client | Server session client for auth; service-role client for founding business when requested |
| Error boundary | Auth action maps provider errors to safe sign-up messages |
| Service-role usage | Yes, only for post-sign-up tenant bootstrap to avoid cookie/session timing gaps |
| Risks | Keep service-role isolated; add auth QA before changing bootstrap behavior |

### Sign-In / Sign-Out

| Step | Current Boundary |
| --- | --- |
| Page/component entry | `app/auth/sign-in/page.tsx`; sign-out is `signOutAction` |
| Action | `signInAction()` and `signOutAction()` in `server/actions/auth.actions.ts` |
| Service | `signInWithPassword()`, `signOut()` in `server/services/auth.service.ts` |
| Repository | None |
| Policy check | Supabase Auth session result |
| Supabase client | Server session client |
| Error boundary | Auth action maps credential/rate-limit/provider errors to safe messages |
| Service-role usage | None |
| Risks | No boundary risk found |

### Dashboard Overview

| Step | Current Boundary |
| --- | --- |
| Page/component entry | `app/(dashboard)/layout.tsx`, `app/(dashboard)/dashboard/page.tsx` |
| Action | None |
| Service | `getCurrentUser()`, `getBusinessWorkspace()`, `getBusinessConfigurationWorkspace()`, `getLeadConversionDesk()` |
| Repository | Business, membership, configuration, lead conversion repositories |
| Policy check | Route/session protection; dashboard data scoped by active business and RLS |
| Supabase client | Server session client |
| Error boundary | Page redirects logged-out users; service/repository errors remain internal |
| Service-role usage | None |
| Risks | `getLeadConversionDesk()` has read-time side effects by syncing scores/actions/events; intentional current behavior but should be considered during RLS tests |

### Business Configuration Load

| Step | Current Boundary |
| --- | --- |
| Page/component entry | `app/(dashboard)/dashboard/configuration/page.tsx` |
| Action | None for load |
| Service | `getCurrentUser()`, `getBusinessWorkspace()`, `getBusinessConfigurationWorkspace()` |
| Repository | `business-configuration.repository.ts`, `businesses.repository.ts`, `business-members.repository.ts` |
| Policy check | Route/session protection; reads are active-business scoped |
| Supabase client | Server session client |
| Error boundary | Page redirects logged-out users |
| Service-role usage | None |
| Risks | No direct UI database access found |

### Business Configuration Save

| Step | Current Boundary |
| --- | --- |
| Page/component entry | Configuration form binds `saveBusinessConfigurationAction` |
| Action | Parses and validates form data in `server/actions/business-configuration.actions.ts` |
| Service | `saveBusinessConfiguration()` |
| Repository | Business profile/configuration/public-intake repository functions |
| Policy check | `canManageBusiness()` through `assertManageAccess()` |
| Supabase client | Server session client |
| Error boundary | Action maps allowed validation/permission messages and hides raw provider/database errors |
| Service-role usage | None |
| Risks | Repository typed errors are deferred; configuration service performs many writes and needs integration/RLS coverage |

### Leads List

| Step | Current Boundary |
| --- | --- |
| Page/component entry | `app/(dashboard)/dashboard/leads/page.tsx` |
| Action | None for load |
| Service | `getCurrentUser()`, `getBusinessWorkspace()`, `getLeadConversionDesk()` |
| Repository | Lead, score, action item, event, and service area repository functions |
| Policy check | Route/session protection; active business ID scopes repository calls |
| Supabase client | Server session client |
| Error boundary | Page redirects logged-out users |
| Service-role usage | None |
| Risks | Read-time lead synchronization writes scores/action items/events; test this before RLS changes |

### Lead Detail

| Step | Current Boundary |
| --- | --- |
| Page/component entry | `app/(dashboard)/dashboard/leads/[leadId]/page.tsx` |
| Action | Detail forms bind lead conversion and AI actions |
| Service | `getLeadDetail()`, `getLatestLeadAiOutput()` |
| Repository | Lead conversion and AI repositories |
| Policy check | Route/session protection; active business ID scopes lead reads |
| Supabase client | Server session client |
| Error boundary | Missing lead returns `notFound()`; mutation actions map errors safely |
| Service-role usage | None |
| Risks | Lead detail marks first view and inserts events during page load; intentional current behavior but important for RLS tests |

### Lead Conversion Workflow

| Step | Current Boundary |
| --- | --- |
| Page/component entry | Lead detail forms |
| Action | `updateLeadStatusAction()`, `markReplyCopiedAction()`, `markLeadOutcomeAction()`, `completeActionItemAction()` |
| Service | Lead conversion service mutation functions |
| Repository | Lead workflow, event, and action item repository functions |
| Policy check | Active business comes from authenticated workspace; repository calls include business ID |
| Supabase client | Server session client |
| Error boundary | Action maps safe validation/not-found messages |
| Service-role usage | None |
| Risks | Explicit policy helper is not used in lead services; current protection depends on authenticated workspace plus RLS/business ID scoping |

### Public Quote Load

| Step | Current Boundary |
| --- | --- |
| Page/component entry | `app/(public)/quote/[slug]/page.tsx` |
| Action | None for load |
| Service | `getPublicIntakePage()` |
| Repository | `getPublicIntakePageBySlug()` |
| Policy check | Public-safe query filters active link/form/consent and visible fields |
| Supabase client | Server session client without service role |
| Error boundary | Missing page returns `notFound()` |
| Service-role usage | None |
| Risks | Public-safe field exposure should be verified in Phase 9 RLS audit and Phase 10 tests |

### Public Quote Submission

| Step | Current Boundary |
| --- | --- |
| Page/component entry | Public quote form binds `submitPublicIntakeAction` |
| Action | Parses form fields, source metadata, consent, and honeypot |
| Service | `submitPublicIntake()` |
| Repository | Public submission, submission values, lead, and source metadata repository functions |
| Policy check | Re-loads public page and checks form/consent IDs before insert |
| Supabase client | Server session client without service role |
| Error boundary | Action maps safe validation and availability messages |
| Service-role usage | None |
| Risks | Public insert path depends heavily on RLS correctness; prioritize in Phase 9/10 |

### AI Lead Assistant

| Step | Current Boundary |
| --- | --- |
| Page/component entry | Lead detail page AI form and latest-output display |
| Action | `generateLeadAiBundleAction()` |
| Service | `getLatestLeadAiOutput()`, `generateLeadAiBundle()` |
| Repository | AI output, usage event, lead, score, and submission value repositories |
| Policy check | Active business from authenticated workspace; lead reads are business-scoped |
| Supabase client | Server session client; OpenAI key from server env |
| Error boundary | Action maps AI errors to safe messages |
| Service-role usage | None |
| Risks | AI fallback stores raw internal error reason/message in AI persistence metadata; defer to AI/privacy boundary hardening |

---

## Boundary Problems Found

| Finding | Status | Notes |
| --- | --- | --- |
| DB queries directly inside UI components | Not found | App pages call services/actions; repositories are not imported by app pages except type-only imports in actions |
| Service-role used for normal dashboard reads/writes | Not found | Service role is currently limited to founding business bootstrap |
| Client component importing server-only code at runtime | Not found in audited paths | Client components were not observed importing server-only modules |
| Actions containing complex DB query logic | Not found | Actions parse forms and call services |
| Services containing UI copy/redirect logic | No major issue found | User-facing messages mainly live in actions/pages |
| Repositories returning user-facing messages | Deferred risk | Some repositories throw raw `error.message`; Phase 6 keeps these internal at action boundary |
| Raw repository errors escaping action boundary | Partially mitigated | Mutation actions now map errors; page-load service errors may still surface as server failures |
| Missing policy checks | Deferred risk | Configuration save uses `canManageBusiness`; lead workflows rely on active business + RLS rather than explicit reusable policy helper |
| Duplicated authorization logic | Low risk | Auth/workspace checks repeat across dashboard pages/actions; acceptable for MVP, possible later consolidation |

---

## Risks Fixed In This Phase

No code risks were fixed in this phase. The current implementation did not show an obvious small unsafe import or service-role boundary bug that should be changed without broader tests.

The Phase 8 change is documentation/indexing only.

---

## Risks Deferred

- Convert repository raw `error.message` throwing into typed internal errors with stable codes.
- Add repository/service tests before changing lead conversion read-time side effects.
- Review AI persistence metadata so provider/internal failure reasons do not store sensitive prompt/provider details.
- Consider an explicit lead/business membership policy helper for lead workflow mutations after RLS tests exist.
- Consider extracting repeated authenticated workspace lookup only if it reduces complexity without changing behavior.
- Add integration coverage for public quote inserts, hidden field exposure, and owner tenant isolation before RLS policy changes.

---

## Recommended Phase 9 Inputs For RLS Audit

Phase 9 should prioritize these tables and paths:

- `businesses`, `business_members`, and membership helper assumptions.
- `business_branding`, `business_services`, `business_service_areas`, `business_faqs`, `business_privacy_settings`, `business_consent_settings`, `business_template_settings`, and `business_onboarding_tasks`.
- `public_link_variants`, `intake_forms`, `intake_form_fields`, and `consent_versions` for public-safe quote reads.
- `intake_submissions`, `intake_submission_values`, `leads`, and `lead_source_metadata` for public insert and owner read isolation.
- `lead_quality_scores`, `lead_action_items`, and `lead_events` because dashboard reads can synchronize derived records.
- `ai_outputs` and `usage_events` because AI is owner-triggered but stores generated artifacts and usage metadata.

Phase 9 should verify that public quote reads expose only active public-safe records, public inserts cannot read private lead data, and authenticated owners cannot access another business's dashboard data.
