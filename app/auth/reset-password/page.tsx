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
import { updatePasswordAction } from "@/server/actions/auth.actions";
import { cookies } from "next/headers";
import Link from "next/link";

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
  const language = readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
  const copy = getBizPilotCopy(language).auth;
  const code = params?.code?.trim() ?? "";
  const callbackError = params?.error ?? params?.error_code ?? params?.error_description;
  const errorMessage = callbackError ? copy.resetInvalid : undefined;

  return (
    <AuthShell copy={copy} footer={copy.resetPasswordFooter} language={language} redirectPath="/auth/reset-password">
      <AuthCard
        subtitle={copy.resetPasswordSubtitle}
        title={copy.resetPasswordTitle}
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

          {[
            ["password", copy.newPassword, copy.passwordHelp],
            ["confirmPassword", copy.confirmPassword, copy.repeatNewPassword],
          ].map(([name, label, placeholder]) => (
            <label className={authLabelClassName} key={name}>
              <span style={{ color: "var(--biz-page-text-soft)" }}>{label}</span>
              <span className="relative block">
                <AuthFieldIcon type="password" />
                <input
                  autoComplete="new-password"
                  className={authInputClassName}
                  minLength={8}
                  name={name}
                  placeholder={placeholder}
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
          ))}

          <AuthSubmitButton pendingLabel={copy.updatePasswordPending}>
            {copy.updatePassword}
          </AuthSubmitButton>
        </form>

        <p
          className="mt-4 text-center text-[13px]"
          style={{ color: "var(--biz-page-text-soft)" }}
        >
          {copy.needAccount}{" "}
          <Link
            className="font-bold underline-offset-4 hover:underline"
            href="/auth/forgot-password"
            style={{ color: "#17D492" }}
          >
            {copy.requestAgain}
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
