/**
 * ============================================================
 * File: app/auth/sign-up/page.tsx
 * Project: BizPilot AI
 * Description: Owner account creation - single centered card with two-column form on sm+.
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
import { signUpAction } from "@/server/actions/auth.actions";
import { cookies } from "next/headers";
import Link from "next/link";

type SignUpPageProps = Readonly<{
  searchParams?: Promise<{
    error?: string;
  }>;
}>;

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const language = readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
  const copy = getBizPilotCopy(language).auth;

  return (
    <AuthShell
      copy={copy}
      footer={copy.createWorkspaceFooter}
      language={language}
      maxWidthClassName="max-w-[650px]"
      redirectPath="/auth/sign-up"
    >
      <AuthCard
        subtitle={copy.createWorkspaceSubtitle}
        title={copy.createWorkspaceTitle}
      >
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

        <form action={signUpAction} className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ["displayName", copy.name, copy.yourName, "name", "text", "name"],
            [
              "businessName",
              copy.businessName,
              copy.yourBusiness,
              "business",
              "text",
              "organization",
            ],
            ["email", copy.email, "you@example.com", "email", "email", "email"],
            [
              "password",
              copy.password,
              copy.passwordHelp,
              "password",
              "password",
              "new-password",
            ],
          ].map(([name, label, placeholder, icon, type, autoComplete]) => (
            <label className={authLabelClassName} key={name}>
              <span style={{ color: "var(--biz-page-text-soft)" }}>{label}</span>
              <span className="relative block">
                <AuthFieldIcon type={icon as "business" | "email" | "name" | "password"} />
                <input
                  autoComplete={autoComplete}
                  className={authInputClassName}
                  minLength={name === "password" ? 8 : undefined}
                  name={name}
                  placeholder={placeholder}
                  required
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    borderColor: "var(--biz-border-medium)",
                    color: "var(--biz-page-text)",
                  }}
                  type={type}
                />
              </span>
            </label>
          ))}

          <p
            className="rounded-[10px] border px-2.5 py-1.5 text-[11px] leading-5 sm:col-span-2"
            style={{
              backgroundColor: "rgba(23,212,146,0.10)",
              borderColor: "rgba(23,212,146,0.22)",
              color: "#17D492",
            }}
          >
            {copy.passwordHelp}
          </p>

          <div className="sm:col-span-2">
            <AuthSubmitButton pendingLabel={copy.createAccountPending}>
              {copy.createAccount}
            </AuthSubmitButton>
          </div>
        </form>

        <p
          className="mt-4 text-center text-[13px]"
          style={{ color: "var(--biz-page-text-soft)" }}
        >
          {copy.signInQuestion}{" "}
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
