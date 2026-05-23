/**
 * ============================================================
 * File: app/auth/forgot-password/page.tsx
 * Project: BizPilot AI
 * Description: Password reset request page for owner accounts.
 * Role: Starts Supabase password recovery without revealing whether an email exists.
 * Related:
 * - server/actions/auth.actions.ts
 * - app/auth/reset-password/page.tsx
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
import { requestPasswordResetAction } from "@/server/actions/auth.actions";

type ForgotPasswordPageProps = Readonly<{
  searchParams?: Promise<{
    error?: string;
    notice?: string;
  }>;
}>;

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const params = await searchParams;

  return (
    <AuthShell footer="Password reset is handled through Supabase Auth email recovery.">
      <AuthCard
        subtitle="Enter your owner email and we'll send reset instructions if an account exists."
        title="Reset password"
      >
        {params?.notice ? (
          <p
            aria-live="polite"
            className="mt-5 rounded-[12px] border px-3 py-2 text-[13px] leading-5"
            style={{
              backgroundColor: "rgba(23,212,146,0.10)",
              borderColor: "rgba(23,212,146,0.22)",
              color: "#17D492",
            }}
          >
            {params.notice}
          </p>
        ) : null}

        {params?.error ? (
          <p
            aria-live="assertive"
            className="mt-5 rounded-[12px] border px-3 py-2 text-[13px] leading-5"
            style={{
              backgroundColor: "rgba(255,92,92,0.10)",
              borderColor: "rgba(255,92,92,0.22)",
              color: "#FFB4B4",
            }}
          >
            {params.error}
          </p>
        ) : null}

        <form action={requestPasswordResetAction} className="mt-5 space-y-3.5">
          <label className={authLabelClassName}>
            <span style={{ color: "var(--biz-page-text-soft)" }}>Email</span>
            <span className="relative block">
              <AuthFieldIcon type="email" />
              <input
                autoComplete="email"
                className={authInputClassName}
                name="email"
                placeholder="you@example.com"
                required
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderColor: "var(--biz-border-medium)",
                  color: "var(--biz-page-text)",
                }}
                type="email"
              />
            </span>
          </label>

          <AuthSubmitButton pendingLabel="Sending instructions...">
            Send reset instructions
          </AuthSubmitButton>
        </form>

        <p
          className="mt-4 text-center text-[13px]"
          style={{ color: "var(--biz-page-text-soft)" }}
        >
          Remembered your password?{" "}
          <Link
            className="font-bold underline-offset-4 hover:underline"
            href="/auth/sign-in"
            style={{ color: "#17D492" }}
          >
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
