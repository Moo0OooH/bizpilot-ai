# BizPilot AI — Auth and Route Protection Audit v1.0

**Project:** BizPilot AI  
**Document Type:** Security Audit  
**Version:** v1.0  
**Status:** Phase 5 Pre-Hardening Audit  
**Owner:** MoOoH  
**Last Updated:** 2026-05-13

---

## 1. Purpose

This audit records the current auth boundary, protected route behavior, public quote route behavior, and service-role exposure notes before deeper RLS/security hardening.

This phase did not rewrite auth, routes, RLS, database migrations, UI, or form behavior.

---

## 2. Protection Summary

Dashboard protection uses two server-side layers:

```text
proxy.ts
  -> lib/supabase/middleware.ts
    -> Supabase SSR getUser()
      -> redirect logged-out users to /auth/sign-in?next=<path>

app/(dashboard)/layout.tsx and dashboard pages
  -> getCurrentUser()
    -> redirect logged-out users to /auth/sign-in
```

Public quote routes stay public:

```text
app/(public)/quote/[slug]/page.tsx
app/(public)/quote/[slug]/success/page.tsx
```

They load data through the public intake service and RLS-scoped Supabase queries. They do not import the service-role client.

---

## 3. Route Protection Map

| Route | Classification | Protection Mechanism | Logged-Out Behavior | Data Exposure Risk |
|---|---|---|---|---|
| `/` | Public | No auth required | 200 | Low; public landing/home route |
| `/auth/sign-in` | Public | Auth form + server action | 200 | Low; shows only form and safe query messages |
| `/auth/sign-up` | Public | Auth form + server action | 200 | Medium operationally; creates auth user and tenant bootstrap server-side |
| `/dashboard` | Protected owner route | `proxy.ts` matcher + dashboard server checks | Redirect to `/auth/sign-in?next=/dashboard` at proxy layer | Low after proxy/server guard |
| `/dashboard/configuration` | Protected owner route | `proxy.ts` matcher + page `getCurrentUser()` | Redirect to `/auth/sign-in?next=/dashboard/configuration` | Low after proxy/server guard |
| `/dashboard/leads` | Protected owner route | `proxy.ts` matcher + page `getCurrentUser()` | Redirect to `/auth/sign-in?next=/dashboard/leads` | Low after proxy/server guard |
| `/dashboard/leads/[leadId]` | Protected owner route | `proxy.ts` matcher + page `getCurrentUser()` + service scoping/RLS | Redirect to `/auth/sign-in?next=/dashboard/leads/[leadId]` | Low after proxy/server guard; tenant isolation still depends on service scoping and RLS |
| `/quote/[slug]` | Public | Public intake page lookup + public-safe RLS policies | 200 for active public slug, 404 for missing/inactive slug | Medium; public route, but hidden fields are filtered and private lead data is not read |
| `/quote/[slug]/success` | Public safe success route | Public intake page lookup only | 200 for active public slug, 404 for missing/inactive slug | Low; does not expose lead/submission details |

---

## 4. Proxy / Middleware Behavior

Files:

```text
proxy.ts
lib/supabase/middleware.ts
```

Current matcher:

```text
/dashboard/:path*
```

Behavior:

- Uses Supabase SSR `createServerClient` with request cookies.
- Calls `supabase.auth.getUser()`.
- Redirects unauthenticated dashboard requests to `/auth/sign-in`.
- Preserves the requested path in a `next` query parameter.
- Does not use service-role access.

Audit result:

```text
Expected behavior confirmed by inspection and smoke test.
```

---

## 5. Dashboard Server Checks

Files:

```text
app/(dashboard)/layout.tsx
app/(dashboard)/dashboard/page.tsx
app/(dashboard)/dashboard/configuration/page.tsx
app/(dashboard)/dashboard/leads/page.tsx
app/(dashboard)/dashboard/leads/[leadId]/page.tsx
```

Observed behavior:

- Dashboard layout checks `getCurrentUser()` server-side.
- Dashboard pages also check `getCurrentUser()` before loading private workspace data.
- Business context is resolved server-side through `getBusinessWorkspace()`.
- Lead detail uses tenant-scoped service calls and returns `notFound()` for unavailable lead detail.

Audit result:

```text
Dashboard protection is server/proxy enforced, not client-only.
```

---

## 6. Public Quote Route Rules

Files:

```text
app/(public)/quote/[slug]/page.tsx
app/(public)/quote/[slug]/success/page.tsx
server/services/public-intake.service.ts
server/repositories/public-intake.repository.ts
server/actions/public-intake.actions.ts
```

Rules observed:

- Public quote page does not require login.
- Missing slug returns `notFound()`.
- Page fetches active public link, active form, active consent version, public branding, and visible fields only.
- Hidden fields are filtered with `is_hidden = false`.
- Public quote submission validates form identity and consent server-side.
- Honeypot is present.
- Success page opens directly but only displays public business display name and generic confirmation copy.
- Success page does not show lead id, submission id, customer contact, customer name, AI output, owner email, or private dashboard data.

Audit result:

```text
Public quote routes are public-safe by current code inspection.
```

---

## 7. Service-Role Access Notes

Files:

```text
lib/supabase/server.ts
server/services/business.service.ts
server/actions/auth.actions.ts
```

Current service-role path:

```text
signUpAction()
  -> createFoundingBusiness({ serviceRole: true })
    -> createSupabaseServiceRoleClient()
```

Reason:

```text
Tenant bootstrap immediately after sign-up, where cookie/session timing can be unreliable.
```

Boundaries:

- Service-role client is in `lib/supabase/server.ts`, which is protected by `import "server-only"`.
- Service-role key is read through `lib/env/server-env.ts`, which is also server-only.
- No Client Component imports service-role code at runtime.
- No public quote route uses service-role access.
- Normal dashboard reads/writes use `createSupabaseServerClient()` and RLS.

Audit result:

```text
Service-role access is isolated to server-only sign-up tenant bootstrap.
```

---

## 8. Risks Fixed

No code changes were required in this phase.

---

## 9. Risks Deferred

- Authenticated users can still visit auth pages if they manually navigate there. This is not a data exposure issue; redirecting authenticated users away from auth pages can be considered later as a UX polish task.
- The `next` query parameter is preserved by the proxy, but the current sign-in action redirects to `/dashboard` after sign-in. Honoring `next` would be a behavior change and should be handled in a dedicated auth UX task if needed.
- Public quote submission does not yet have full rate limiting. Honeypot and validation exist; abuse protection is planned for the public quote security phase.
- RLS SQL tests exist but no local runner is configured yet. Add RLS runner tooling before policy changes.

---

## 10. Manual QA Checklist

Run these checks before deeper security hardening:

- `/` returns 200.
- `/auth/sign-in` returns 200.
- `/auth/sign-up` returns 200.
- Logged-out `/dashboard` redirects to `/auth/sign-in`.
- Logged-out `/dashboard/configuration` redirects to `/auth/sign-in`.
- Logged-out `/dashboard/leads` redirects to `/auth/sign-in`.
- Logged-out `/dashboard/leads/not-a-real-id` redirects to `/auth/sign-in`.
- `/quote/nonexistent-slug` returns safe 404 / not-found.
- `/quote/nonexistent-slug/success` returns safe 404 / not-found.
- Active public quote slug loads without login.
- Active public quote success page can be opened directly without exposing lead/submission details.
- Sign out redirects to `/auth/sign-in`.
- Public quote page source does not contain private lead/submission details.

---

## 11. Final Audit Decision

Current auth and route protection is acceptable for continuing foundation hardening.

Proceed next with error handling, logging, RLS audit, and public quote abuse protection without broad auth rewrites.
