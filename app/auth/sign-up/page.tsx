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
 * Last Updated: 2026-06-27
 * Change Log:
 * - 2026-05-19: Migrated to the single-centered-card AuthShell.
 * - 2026-05-23: Localized auth copy from the central language dictionary.
 * - 2026-06-27: Added explicit input ids so signup labels stay accessible in browser QA.
 * ============================================================
 */

import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { AuthPasswordField } from "@/components/auth/auth-password-field";
import {
  AuthCard,
  AuthFieldIcon,
  AuthShell,
  authErrorStyle,
  authInfoStyle,
  authInputClassName,
  authLabelClassName,
} from "@/components/auth/auth-ui";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  readSupportedLanguage,
} from "@/lib/i18n/language";
import { getPublicSiteCopy } from "@/lib/i18n/public-site-copy";
import { buildNoIndexMetadata } from "@/lib/seo";
import { signUpAction } from "@/server/actions/auth.actions";
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
  return buildNoIndexMetadata(getPublicSiteCopy(language).authMeta.signUp);
}

type SignUpPageProps = Readonly<{
  searchParams?: Promise<{
    error?: string;
  }>;
}>;

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const language = await readAuthLanguage();
  const copy = getBizPilotCopy(language).auth;
  const publicCopy = getPublicSiteCopy(language).authMeta;

  return (
    <AuthShell
      copy={copy}
      footer={copy.createWorkspaceFooter}
    >
      <AuthCard
        subtitle={copy.createWorkspaceSubtitle}
        title={copy.createWorkspaceTitle}
      >
        {params?.error ? (
          <p
            aria-live="assertive"
            className="mt-5 rounded-[12px] border px-3 py-2 text-[13px] leading-5"
            style={authErrorStyle}
          >
            {params.error}
          </p>
        ) : null}

        <form action={signUpAction} className="mt-5 grid gap-3 sm:grid-cols-2">
          <input name="authIntent" type="hidden" value="sign-up" />
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
          ].map(([name, label, placeholder, icon, type, autoComplete]) => {
            const fieldId = `sign-up-${name}`;

            return (
              <label className={authLabelClassName} htmlFor={fieldId} key={name}>
                <span style={{ color: "var(--biz-page-text-soft)" }}>{label}</span>
                <span className="relative block">
                  <AuthFieldIcon type={icon as "business" | "email" | "name"} />
                  <input
                    autoComplete={autoComplete}
                    className={authInputClassName}
                    id={fieldId}
                    name={name}
                    placeholder={placeholder}
                    required
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--biz-border-medium)",
                      color: "var(--biz-page-text)",
                    }}
                    type={type}
                  />
                </span>
              </label>
            );
          })}

          <div className="sm:col-span-2">
            <AuthPasswordField
              autoComplete="new-password"
              copy={copy}
              label={copy.password}
              minLength={8}
              name="password"
            />
          </div>

          <p
            className="rounded-[10px] border px-2.5 py-1.5 text-[11px] leading-5 sm:col-span-2"
            style={authInfoStyle}
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
          className="mt-4 rounded-[12px] border px-3 py-2 text-center text-[12px] leading-5"
          style={authInfoStyle}
        >
          {publicCopy.signUpPilotPrompt}{" "}
          <Link
            className="font-bold underline-offset-4 hover:underline"
            href="/pilot"
            style={{ color: "var(--primary)" }}
          >
            {publicCopy.signUpPilotCta}
          </Link>
        </p>

        <p
          className="mt-4 text-center text-[13px]"
          style={{ color: "var(--biz-page-text-soft)" }}
        >
          {copy.signInQuestion}{" "}
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
