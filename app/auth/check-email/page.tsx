/**
 * ============================================================
 * File: app/auth/check-email/page.tsx
 * Project: BizPilot AI
 * Description: Post-signup email confirmation holding page.
 * Role: Gives owners a clear next-step state after account creation without
 * revealing whether an email already existed.
 * Related:
 * - server/actions/auth.actions.ts
 * - app/auth/callback/route.ts
 * Author: MoOoH
 * Created: 2026-05-23
 * ============================================================
 */

import {
  AuthCard,
  AuthShell,
} from "@/components/auth/auth-ui";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  readSupportedLanguage,
} from "@/lib/i18n/language";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function CheckEmailPage() {
  const language = readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
  const copy = getBizPilotCopy(language).auth;
  const notice = copy.checkEmailNotice;

  return (
    <AuthShell
      copy={copy}
      footer={copy.checkEmailFooter}
      language={language}
      redirectPath="/auth/check-email"
    >
      <AuthCard subtitle={copy.checkEmailSubtitle} title={copy.checkEmailTitle}>
        <p
          aria-live="polite"
          className="mt-5 rounded-[12px] border px-3 py-2 text-[13px] leading-5"
          style={{
            backgroundColor: "rgba(23,212,146,0.10)",
            borderColor: "rgba(23,212,146,0.22)",
            color: "#17D492",
          }}
        >
          {notice}
        </p>

        <div className="mt-5 grid gap-2">
          <Link
            className="inline-flex h-11 w-full items-center justify-center rounded-[12px] text-sm font-black"
            href="/auth/sign-in"
            style={{
              background: "linear-gradient(135deg, #2DD4BF, #17D492)",
              color: "#03130c",
            }}
          >
            {copy.signIn}
          </Link>
          <Link
            className="inline-flex h-11 w-full items-center justify-center rounded-[12px] border text-sm font-black"
            href="/auth/forgot-password"
            style={{
              borderColor: "var(--biz-border-medium)",
              color: "var(--biz-page-text)",
            }}
          >
            {copy.checkEmailResetPassword}
          </Link>
          <Link
            className="inline-flex h-11 w-full items-center justify-center rounded-[12px] border text-sm font-black"
            href="/auth/sign-up"
            style={{
              borderColor: "var(--biz-border-medium)",
              color: "var(--biz-page-text)",
            }}
          >
            {copy.checkEmailUseAnother}
          </Link>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
