"use client";

/**
 * ============================================================
 * File: app/auth/reset-password/reset-password-form.tsx
 * Project: BizPilot AI
 * Description: Client-side reset form that accepts both PKCE code callbacks
 * and legacy/hash recovery callbacks from Supabase.
 * Role: Prevents valid production reset links from failing before the server
 * action can update the password.
 * Related:
 * - app/auth/reset-password/page.tsx
 * - server/actions/auth.actions.ts
 * - lib/supabase/client.ts
 * Author: MoOoH
 * Created: 2026-05-23
 * ============================================================
 */

import { useEffect, useState } from "react";

import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { AuthPasswordField } from "@/components/auth/auth-password-field";
import { authErrorStyle, authInfoStyle } from "@/components/auth/auth-ui";
import type { BizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { updatePasswordAction } from "@/server/actions/auth.actions";

type ResetPasswordFormProps = Readonly<{
  code: string;
  copy: BizPilotCopy["auth"];
  initialError?: string;
}>;

type RecoveryState = "invalid" | "ready" | "resolving";

function readHashParams(): URLSearchParams {
  return new URLSearchParams(window.location.hash.replace(/^#/, ""));
}

function isLikelyJwt(value: string): boolean {
  return value.split(".").length === 3;
}

export function ResetPasswordForm({
  code,
  copy,
  initialError,
}: ResetPasswordFormProps) {
  const [state, setState] = useState<RecoveryState>(
    initialError ? "invalid" : code ? "ready" : "resolving",
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    initialError,
  );

  useEffect(() => {
    if (initialError || code) {
      return;
    }

    const hashParams = readHashParams();
    const hashError =
      hashParams.get("error_description") ??
      hashParams.get("error") ??
      hashParams.get("error_code");
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    if (hashError) {
      queueMicrotask(() => {
        setErrorMessage(copy.resetInvalid);
        setState("invalid");
      });
      return;
    }

    if (!accessToken || !refreshToken || !isLikelyJwt(accessToken)) {
      queueMicrotask(() => {
        setErrorMessage(copy.resetInvalid);
        setState("invalid");
      });
      return;
    }

    let mounted = true;
    createSupabaseBrowserClient()
      .auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
      .then(({ error }) => {
        if (!mounted) return;
        if (error) {
          setErrorMessage(copy.resetInvalid);
          setState("invalid");
          return;
        }
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}`,
        );
        setErrorMessage(undefined);
        setState("ready");
      })
      .catch(() => {
        if (!mounted) return;
        setErrorMessage(copy.resetInvalid);
        setState("invalid");
      });

    return () => {
      mounted = false;
    };
  }, [code, copy.resetInvalid, initialError]);

  if (state === "resolving") {
    return (
      <p
        aria-live="polite"
        className="mt-5 rounded-[12px] border px-3 py-2 text-[13px] leading-5"
        style={authInfoStyle}
      >
        {copy.resetPreparing}
      </p>
    );
  }

  return (
    <>
      {errorMessage ? (
        <p
          aria-live="assertive"
          className="mt-5 rounded-[12px] border px-3 py-2 text-[13px] leading-5"
          style={authErrorStyle}
        >
          {errorMessage}
        </p>
      ) : null}

      {state === "ready" ? (
        <form action={updatePasswordAction} className="mt-5 space-y-3.5">
          <input name="authIntent" type="hidden" value="password-reset" />
          <input name="code" type="hidden" value={code} />

          {[
            { label: copy.newPassword, name: "password" },
            { label: copy.confirmPassword, name: "confirmPassword" },
          ].map((field) => (
            <AuthPasswordField
              autoComplete="new-password"
              copy={copy}
              key={field.name}
              label={field.label}
              minLength={8}
              name={field.name}
            />
          ))}

          <p
            className="rounded-[10px] border px-2.5 py-1.5 text-[11px] leading-5"
            style={{
              backgroundColor: "var(--surface-interactive)",
              borderColor: "var(--border-default)",
              color: "var(--text-muted)",
            }}
          >
            {copy.resetPasswordReuseHelp}
          </p>

          <AuthSubmitButton pendingLabel={copy.updatePasswordPending}>
            {copy.updatePassword}
          </AuthSubmitButton>
        </form>
      ) : null}
    </>
  );
}
