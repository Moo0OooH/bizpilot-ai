/**
 * ============================================================
 * File: components/auth/password-reset-origin-input.tsx
 * Project: BizPilot AI
 * Description: Captures the browser origin for password reset redirects.
 * Role: Lets Supabase reset emails point back to the actual host the user used.
 * Related:
 * - app/auth/forgot-password/page.tsx
 * - server/actions/auth.actions.ts
 * Author: MoOoH
 * Created: 2026-05-22
 * ============================================================
 */

"use client";

import { useEffect, useRef } from "react";

export function PasswordResetOriginInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = window.location.origin;
    }
  }, []);

  return <input ref={inputRef} name="redirectOrigin" type="hidden" />;
}
