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

import {
  AuthCard,
  AuthShell,
} from "@/components/auth/auth-ui";
import { ResetPasswordForm } from "@/app/auth/reset-password/reset-password-form";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  readSupportedLanguage,
} from "@/lib/i18n/language";
import { getPublicSiteCopy } from "@/lib/i18n/public-site-copy";
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
  return getPublicSiteCopy(language).authMeta.resetPassword;
}

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
  const language = await readAuthLanguage();
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
        <ResetPasswordForm
          code={code}
          copy={copy}
          {...(errorMessage ? { initialError: errorMessage } : {})}
        />

        <p
          className="mt-4 text-center text-[13px]"
          style={{ color: "var(--biz-page-text-soft)" }}
        >
          {copy.needNewResetLink}{" "}
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
