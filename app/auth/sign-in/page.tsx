/**
 * ============================================================
 * File: app/auth/sign-in/page.tsx
 * Project: BizPilot AI
 * Description: Owner sign-in screen - single centered card.
 * Role: Production owner access with cookie-driven interface language.
 * Related:
 * - server/actions/auth.actions.ts
 * - components/auth/auth-ui.tsx
 * Author: MoOoH
 * Last Updated: 2026-05-23
 * Change Log:
 * - 2026-05-19: Migrated to the single-centered-card AuthShell.
 * - 2026-05-23: Localized auth copy from the central language dictionary.
 * ============================================================
 */

import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { AuthPasswordField } from "@/components/auth/auth-password-field";
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
import { signInAction } from "@/server/actions/auth.actions";
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
  return getPublicSiteCopy(language).authMeta.signIn;
}

type SignInPageProps = Readonly<{
  searchParams?: Promise<{
    error?: string;
    next?: string;
    notice?: string;
    redirectTo?: string;
  }>;
}>;

function readSafeSignInRedirect(value: string | undefined): string {
  if (
    value === "/admin" ||
    value?.startsWith("/admin/") ||
    value === "/dashboard" ||
    value?.startsWith("/dashboard/")
  ) {
    return value;
  }

  return "/dashboard";
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const requestedRedirect = params?.redirectTo ?? params?.next;
  const redirectTo = readSafeSignInRedirect(requestedRedirect);
  const language = await readAuthLanguage();
  const copy = getBizPilotCopy(language).auth;

  return (
    <AuthShell
      copy={copy}
      footer={copy.signInFooter}
    >
      <AuthCard subtitle={copy.signInSubtitle} title={copy.signInTitle}>
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

        <form action={signInAction} className="mt-5 space-y-3.5">
          <input name="redirectTo" type="hidden" value={redirectTo} />
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

          <AuthPasswordField
            action={
              <Link
                className="text-[11px] font-bold normal-case tracking-normal underline-offset-4 hover:underline"
                href="/auth/forgot-password"
                style={{ color: "var(--primary)" }}
              >
                {copy.forgotPassword}
              </Link>
            }
            autoComplete="current-password"
            copy={copy}
            label={copy.password}
            minLength={6}
            name="password"
          />

          <AuthSubmitButton pendingLabel={copy.signInPending}>
            {copy.signIn}
          </AuthSubmitButton>
        </form>

        <p
          className="mt-4 text-center text-[13px]"
          style={{ color: "var(--biz-page-text-soft)" }}
        >
          {copy.needAccount}{" "}
          <Link
            className="font-bold underline-offset-4 hover:underline"
            href="/auth/sign-up"
            style={{ color: "var(--primary)" }}
          >
            {copy.createAccount}
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
