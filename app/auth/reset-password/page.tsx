/**
 * ============================================================
 * File: app/auth/reset-password/page.tsx
 * Project: BizPilot AI
 * Description: Password update page for Supabase recovery callbacks.
 * Role: Completes owner password recovery through the existing Supabase SSR auth client.
 * Related:
 * - server/actions/auth.actions.ts
 * - app/auth/forgot-password/page.tsx
 * Author: MoOoH
 * Created: 2026-05-22
 * ============================================================
 */

import Link from "next/link";

import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import {
  AuthCard,
  AuthFieldIcon,
  AuthShell,
  authInputClassName,
  authLabelClassName,
} from "@/components/auth/auth-ui";
import { updatePasswordAction } from "@/server/actions/auth.actions";

type ResetPasswordPageProps = Readonly<{
  searchParams?: Promise<{
    code?: string;
    error?: string;
    error_code?: string;
    error_description?: string;
  }>;
}>;

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const code = params?.code?.trim() ?? "";
  const callbackError = params?.error ?? params?.error_code ?? params?.error_description;
  const errorMessage = callbackError
    ? "This reset link is invalid or expired. Request a new password reset."
    : undefined;

  return (
    <AuthShell footer="Use a new password that is unique to BizPilot.">
      <AuthCard
        subtitle="Choose a new password for your owner workspace."
        title="Set new password"
      >
        {errorMessage ? (
          <p
            aria-live="assertive"
            className="mt-5 rounded-[12px] border px-3 py-2 text-[13px] leading-5"
            style={{
              backgroundColor: "rgba(255,92,92,0.10)",
              borderColor: "rgba(255,92,92,0.22)",
              color: "#FFB4B4",
            }}
          >
            {errorMessage}
          </p>
        ) : null}

        <form action={updatePasswordAction} className="mt-5 space-y-3.5">
          <input name="code" type="hidden" value={code} />

          <label className={authLabelClassName}>
            <span style={{ color: "var(--biz-page-text-soft)" }}>
              New password
            </span>
            <span className="relative block">
              <AuthFieldIcon type="password" />
              <input
                autoComplete="new-password"
                className={authInputClassName}
                minLength={8}
                name="password"
                placeholder="At least 8 characters"
                required
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderColor: "var(--biz-border-medium)",
                  color: "var(--biz-page-text)",
                }}
                type="password"
              />
            </span>
          </label>

          <label className={authLabelClassName}>
            <span style={{ color: "var(--biz-page-text-soft)" }}>
              Confirm password
            </span>
            <span className="relative block">
              <AuthFieldIcon type="password" />
              <input
                autoComplete="new-password"
                className={authInputClassName}
                minLength={8}
                name="confirmPassword"
                placeholder="Repeat your new password"
                required
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderColor: "var(--biz-border-medium)",
                  color: "var(--biz-page-text)",
                }}
                type="password"
              />
            </span>
          </label>

          <AuthSubmitButton pendingLabel="Updating password...">
            Update password
          </AuthSubmitButton>
        </form>

        <p
          className="mt-4 text-center text-[13px]"
          style={{ color: "var(--biz-page-text-soft)" }}
        >
          Need a new reset link?{" "}
          <Link
            className="font-bold underline-offset-4 hover:underline"
            href="/auth/forgot-password"
            style={{ color: "#17D492" }}
          >
            Request again
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
