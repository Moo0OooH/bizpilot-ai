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
  authErrorStyle,
  authInputClassName,
  authLabelClassName,
  authSuccessStyle,
} from "@/components/auth/auth-ui";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  readSupportedLanguage,
} from "@/lib/i18n/language";
import { getPublicSiteCopy } from "@/lib/i18n/public-site-copy";
import { requestPasswordResetAction } from "@/server/actions/auth.actions";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

async function readAuthLanguage() {
  return readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const language = await readAuthLanguage();
  return getPublicSiteCopy(language).authMeta.forgotPassword;
}

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
  const language = await readAuthLanguage();
  const copy = getBizPilotCopy(language).auth;

  return (
    <AuthShell copy={copy} footer={copy.forgotPasswordFooter}>
      <AuthCard
        subtitle={copy.forgotPasswordSubtitle}
        title={copy.forgotPasswordTitle}
      >
        {params?.notice ? (
          <p
            aria-live="polite"
            className="mt-5 rounded-[12px] border px-3 py-2 text-[13px] leading-5"
            style={authSuccessStyle}
          >
            {params.notice}
          </p>
        ) : null}

        {params?.error ? (
          <p
            aria-live="assertive"
            className="mt-5 rounded-[12px] border px-3 py-2 text-[13px] leading-5"
            style={authErrorStyle}
          >
            {params.error}
          </p>
        ) : null}

        <form action={requestPasswordResetAction} className="mt-5 space-y-3.5">
          <input name="authIntent" type="hidden" value="password-reset" />
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
                  backgroundColor: "var(--surface)",
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
            style={{ color: "var(--primary)" }}
          >
            {copy.signIn}
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
