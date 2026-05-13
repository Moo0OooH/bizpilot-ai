# BizPilot AI — Supabase Client Architecture v1.0

**Project:** BizPilot AI  
**Document Type:** Engineering Boundary Standard  
**Version:** v1.0  
**Status:** Active MVP Standard  
**Owner:** MoOoH  
**Last Updated:** 2026-05-13

---

## 1. Purpose

BizPilot uses three Supabase access patterns. They must stay separate:

```text
Browser client
Server session client
Service-role client
```

The goal is:

```text
No secrets in the browser.
No accidental RLS bypass.
No service-role access for normal dashboard reads/writes.
```

---

## 2. Client Map

### Browser client

File:

```text
lib/supabase/client.ts
```

Allowed use:

- Client Components that need browser-safe Supabase behavior.
- Public anon-key operations that are safe under RLS.

Allowed env:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Rules:

- Must not import `lib/env/server-env.ts`.
- Must not import `lib/supabase/server.ts`.
- Must not use `SUPABASE_SERVICE_ROLE_KEY`.
- Must rely on RLS for any data access.

Current status:

```text
Browser-safe. Uses only public env through lib/env/public-env.ts.
```

---

### Server session client

File:

```text
lib/supabase/server.ts
```

Function:

```text
createSupabaseServerClient()
```

Allowed use:

- Server Components.
- Server Actions.
- Server services.
- Normal authenticated owner workflows.
- Public server-side quote reads/submissions where RLS policies define allowed access.

Rules:

- Runs server-side only.
- Uses Supabase SSR cookies/session handling.
- Uses anon key plus current request/session context.
- Must respect RLS.
- Should be the default client for dashboard reads/writes.

Current status:

```text
Server-only. Protected by import "server-only".
```

---

### Service-role client

File:

```text
lib/supabase/server.ts
```

Function:

```text
createSupabaseServiceRoleClient()
```

Allowed use:

- Narrow server-only privileged workflows.
- Tenant bootstrap during sign-up when the normal session path is not yet reliable.
- Future operational jobs only when explicitly reviewed.

Allowed env:

```text
SUPABASE_SERVICE_ROLE_KEY
```

Rules:

- Must never be imported by Client Components.
- Must never be exposed through `NEXT_PUBLIC_*`.
- Must not be used for normal user-scoped dashboard reads/writes.
- Must not be used to hide missing RLS policies.
- Every use must have a clear reason in the calling service.

Current usage:

```text
server/services/business.service.ts
  createFoundingBusiness(... serviceRole: true)

server/actions/auth.actions.ts
  sign-up tenant bootstrap passes serviceRole: true
```

Current status:

```text
Isolated to server-only code.
```

---

## 3. Request Boundary Client

File:

```text
lib/supabase/middleware.ts
```

Allowed use:

- `proxy.ts` dashboard route protection.
- Session refresh / authenticated route guard.

Rules:

- Uses request cookies.
- Uses public Supabase URL and anon key.
- Must not use service-role access.
- Must not replace service-layer authorization or database RLS.

Current status:

```text
Used only by proxy.ts for /dashboard route protection.
```

---

## 4. Prohibited Usage

Do not:

- Import `lib/supabase/server.ts` from Client Components.
- Import repositories or server services from Client Components except type-only imports.
- Use service-role client for dashboard reads/writes.
- Disable or bypass RLS to make a feature work.
- Put `SUPABASE_SERVICE_ROLE_KEY` in browser code, docs examples, screenshots, logs, or public env.
- Use service-role access for public quote submissions.

---

## 5. Relationship With RLS

BizPilot is multi-tenant. RLS remains mandatory even when server-side policies exist.

Expected behavior:

- Browser client relies on public-safe RLS.
- Server session client relies on authenticated user/session RLS.
- Service-role client is a rare exception for explicitly reviewed privileged workflows.

Tenant isolation must be enforced by:

```text
server policy checks
+ repository/service scoping
+ Supabase RLS
```

No single layer is enough by itself.

---

## 6. Current Import Audit

Browser-safe files:

```text
lib/supabase/client.ts
lib/supabase/config.ts
```

Server-only files:

```text
lib/supabase/server.ts
server/services/*
server/services/ai/*
server/repositories/*
server/policies/*
```

Client Components:

```text
components/dashboard/configuration-tabs.tsx
components/dashboard/copy-button.tsx
components/dashboard/dashboard-sidebar.tsx
components/dashboard/lead-workspace-queue.tsx
components/auth/auth-submit-button.tsx
```

Allowed client-side exception:

```text
components/dashboard/lead-workspace-queue.tsx
  import type { LeadDeskItem } from "@/server/services/lead-conversion.service";
```

This is type-only and is removed from runtime bundles.

---

## 7. Deferred Notes

- Do not split `lib/supabase/server.ts` into separate `server.ts` and `admin.ts` until there is a clear reason. The current file is protected by `server-only` and has stable imports.
- Do not rewrite the sign-up tenant bootstrap path without a dedicated auth QA pass.
- Add RLS runner tooling before making policy-level changes.
