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
 * Last Updated: 2026-05-23
 * Change Log:
 * - 2026-05-23: Localized auth copy from the central language dictionary.
 * ============================================================
 */

import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import {
  AuthCard,
  AuthFieldIcon,
  AuthShell,
  authInputClassName,
  authLabelClassName,
} from "@/components/auth/auth-ui";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  readSupportedLanguage,
} from "@/lib/i18n/language";
import { requestPasswordResetAction } from "@/server/actions/auth.actions";
import { cookies } from "next/headers";
import Link from "next/link";

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
  const language = readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
  const copy = getBizPilotCopy(language).auth;

  return (
    <AuthShell copy={copy} footer={copy.forgotPasswordFooter} language={language} redirectPath="/auth/forgot-password">
      <AuthCard
        subtitle={copy.forgotPasswordSubtitle}
        title={copy.forgotPasswordTitle}
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
            <span style={{ color: "var(--biz-page-text-soft)" }}>{copy.email}</span>
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

          <AuthSubmitButton pendingLabel={copy.resetRequestPending}>
            {copy.resetRequestSubmit}
          </AuthSubmitButton>
        </form>

        <p
          className="mt-4 text-center text-[13px]"
          style={{ color: "var(--biz-page-text-soft)" }}
        >
          {copy.forgotPasswordQuestion}{" "}
          <Link
            className="font-bold underline-offset-4 hover:underline"
            href="/auth/sign-in"
            style={{ color: "#17D492" }}
          >
            {copy.signIn}
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
