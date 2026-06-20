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
 * Last Updated: 2026-06-20
 * Change Log:
 * - 2026-06-20: Aligned check-email actions with the shared auth shell button and focus treatment.
 * ============================================================
 */

import {
  AuthCard,
  AuthShell,
  authSuccessStyle,
} from "@/components/auth/auth-ui";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  readSupportedLanguage,
} from "@/lib/i18n/language";
import { getPublicSiteCopy } from "@/lib/i18n/public-site-copy";
import { buildNoIndexMetadata } from "@/lib/seo";
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
  return buildNoIndexMetadata(getPublicSiteCopy(language).authMeta.checkEmail);
}

export default async function CheckEmailPage() {
  const language = await readAuthLanguage();
  const copy = getBizPilotCopy(language).auth;
  const notice = copy.checkEmailNotice;

  return (
    <AuthShell
      copy={copy}
      footer={copy.checkEmailFooter}
    >
      <AuthCard subtitle={copy.checkEmailSubtitle} title={copy.checkEmailTitle}>
        <p
          aria-live="polite"
          className="mt-5 rounded-[12px] border px-3 py-2 text-[13px] leading-5"
          style={authSuccessStyle}
        >
          {notice}
        </p>

        <div className="mt-5 grid gap-2">
          <Link
            className="inline-flex h-11 w-full items-center justify-center rounded-[12px] text-sm font-black shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
            href="/auth/sign-in"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
              color: "var(--primary-contrast)",
            }}
          >
            {copy.signIn}
          </Link>
          <Link
            className="inline-flex h-11 w-full items-center justify-center rounded-[12px] border text-sm font-black transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
            href="/auth/forgot-password"
            style={{
              borderColor: "var(--border-default)",
              color: "var(--text-strong)",
            }}
          >
            {copy.checkEmailResetPassword}
          </Link>
          <Link
            className="inline-flex h-11 w-full items-center justify-center rounded-[12px] border text-sm font-black transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
            href="/auth/sign-up"
            style={{
              borderColor: "var(--border-default)",
              color: "var(--text-strong)",
            }}
          >
            {copy.checkEmailUseAnother}
          </Link>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
