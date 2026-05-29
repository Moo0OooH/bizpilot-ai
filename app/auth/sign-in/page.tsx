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
import { signInAction } from "@/server/actions/auth.actions";
import { cookies } from "next/headers";
import Link from "next/link";

type SignInPageProps = Readonly<{
  searchParams?: Promise<{
    error?: string;
    notice?: string;
    redirectTo?: string;
  }>;
}>;

function readSafeSignInRedirect(value: string | undefined): string {
  if (
    value === "/admin" ||
    value === "/dashboard" ||
    value?.startsWith("/dashboard/")
  ) {
    return value;
  }

  return "/dashboard";
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const redirectTo = readSafeSignInRedirect(params?.redirectTo);
  const language = readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
  const copy = getBizPilotCopy(language).auth;

  return (
    <AuthShell
      copy={copy}
      footer={copy.signInFooter}
      language={language}
      redirectPath={
        redirectTo === "/dashboard"
          ? "/auth/sign-in"
          : `/auth/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`
      }
    >
      <AuthCard subtitle={copy.signInSubtitle} title={copy.signInTitle}>
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
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderColor: "var(--biz-border-medium)",
                  color: "var(--biz-page-text)",
                }}
                type="email"
              />
            </span>
          </label>

          <label className={authLabelClassName}>
            <span className="flex items-center justify-between gap-3">
              <span style={{ color: "var(--biz-page-text-soft)" }}>{copy.password}</span>
              <Link
                className="text-[11px] font-bold normal-case tracking-normal underline-offset-4 hover:underline"
                href="/auth/forgot-password"
                style={{ color: "#17D492" }}
              >
                {copy.forgotPassword}
              </Link>
            </span>
            <span className="relative block">
              <AuthFieldIcon type="password" />
              <input
                autoComplete="current-password"
                className={authInputClassName}
                minLength={6}
                name="password"
                placeholder={copy.password}
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
            style={{ color: "#17D492" }}
          >
            {copy.createAccount}
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
