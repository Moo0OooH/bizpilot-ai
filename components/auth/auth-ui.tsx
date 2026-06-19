/**
 * ============================================================
 * File: components/auth/auth-ui.tsx
 * Project: BizPilot AI
 * Description: Auth page primitives - single centered card.
 * Role: Owner access screens follow Design System v1.0 section 10.2 and share localized copy primitives.
 * Related:
 * - app/auth/sign-in/page.tsx
 * - app/auth/sign-up/page.tsx
 * - lib/i18n/bizpilot-copy.ts
 * Author: MoOoH
 * Created: 2026-05-12
 * Last Updated: 2026-06-18
 * Change Log:
 * - 2026-05-19: Rebuilt as single centered card. Removed the split layout that caused scroll/scale issues.
 * - 2026-05-23: Added shared language switcher and localized auth chrome.
 * - 2026-06-18: Switched auth shell to short-height-safe svh layout.
 * ============================================================
 */

import type { BizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import { languageNativeLabels, supportedLanguages } from "@/lib/i18n/language";
import { setInterfaceLanguageAction } from "@/server/actions/business-configuration.actions";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = Readonly<{
  children: ReactNode;
  copy: BizPilotCopy["auth"];
  footer?: string;
  language: string;
  maxWidthClassName?: string;
  redirectPath: string;
}>;

type AuthCardProps = Readonly<{
  children: ReactNode;
  subtitle: string;
  title: string;
}>;

type AuthFieldIconProps = Readonly<{
  type: "business" | "email" | "name" | "password";
}>;

function BrandMark({ copy }: Readonly<{ copy: BizPilotCopy["auth"] }>) {
  return (
    <Link
      className="inline-flex min-h-11 items-center gap-2.5"
      href="/"
      style={{ color: "var(--biz-page-text)" }}
    >
      <span
        aria-hidden
        className="flex h-9 w-9 items-center justify-center rounded-[12px] text-base font-black"
        style={{
          background: "linear-gradient(135deg, #2dd4bf, #10b981)",
          boxShadow: "0 10px 22px rgba(20,184,166,0.22)",
          color: "#022c22",
        }}
      >
        B
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-black tracking-[-0.02em]">
          BizPilot AI
        </span>
        <span
          className="block text-[11px] uppercase tracking-[0.14em]"
          style={{ color: "var(--biz-page-text-soft)" }}
        >
          {copy.ownerAccess}
        </span>
      </span>
    </Link>
  );
}

export function AuthShell({
  children,
  copy,
  footer,
  language,
  maxWidthClassName = "max-w-[460px]",
  redirectPath,
}: AuthShellProps) {
  return (
    <main
      className="flex min-h-svh flex-col items-center justify-start overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 md:justify-center"
      style={{
        background:
          "radial-gradient(circle at 16% 8%, rgba(20,184,166,0.16), transparent 26%), radial-gradient(circle at 88% 14%, rgba(45,212,191,0.10), transparent 24%), linear-gradient(140deg, var(--biz-page-bg), var(--biz-bg-dark-2))",
        color: "var(--biz-page-text)",
      }}
    >
      <div className={`mb-5 flex w-full ${maxWidthClassName} items-center justify-between gap-3`}>
        <BrandMark copy={copy} />
        <div className="flex shrink-0 items-center gap-2">
          <form
            action={setInterfaceLanguageAction}
            className="flex rounded-[10px] border border-[var(--biz-border-medium)] p-1"
          >
            <input name="redirectTo" type="hidden" value={redirectPath} />
            {supportedLanguages.map((option) => (
              <button
                aria-pressed={language === option}
                className={
                  language === option
                    ? "min-h-11 rounded-[7px] px-2 text-[11px] font-black text-[#03130c]"
                    : "min-h-11 rounded-[7px] px-2 text-[11px] font-bold"
                }
                style={
                  language === option
                    ? { backgroundColor: "#17D492" }
                    : undefined
                }
                key={option}
                name="language"
                title={languageNativeLabels[option]}
                type="submit"
                value={option}
              >
                {option === "fr-CA" ? "FR" : "EN"}
              </button>
            ))}
          </form>
          <Link
            className="hidden text-[12px] font-bold sm:inline"
            href="/"
            style={{ color: "var(--biz-page-text-soft)" }}
          >
            &larr; {copy.backHome}
          </Link>
        </div>
      </div>

      <section className={`w-full ${maxWidthClassName}`}>{children}</section>

      {footer ? (
        <p
          className={`mt-4 ${maxWidthClassName} text-center text-[11px] leading-5`}
          style={{ color: "var(--biz-page-text-muted)" }}
        >
          {footer}
        </p>
      ) : null}
    </main>
  );
}

export function AuthCard({ children, subtitle, title }: AuthCardProps) {
  return (
    <div
      className="w-full rounded-[20px] border p-6 sm:p-7"
      style={{
        backgroundColor: "var(--biz-page-surface)",
        borderColor: "var(--biz-page-border)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.30)",
      }}
    >
      <div className="text-center">
        <h1
          className="text-[24px] font-extrabold leading-tight tracking-[-0.02em]"
          style={{ color: "var(--biz-page-text)" }}
        >
          {title}
        </h1>
        <p
          className="mx-auto mt-2 max-w-[36ch] text-[13px] leading-5"
          style={{ color: "var(--biz-page-text-soft)" }}
        >
          {subtitle}
        </p>
      </div>
      {children}
    </div>
  );
}

export function AuthFieldIcon({ type }: AuthFieldIconProps) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center"
      style={{ color: "rgba(245,247,250,0.42)" }}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        {type === "name" ? (
          <>
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            <path d="M4 21a8 8 0 0 1 16 0" />
          </>
        ) : null}
        {type === "business" ? (
          <>
            <path d="M4 20V8l8-4 8 4v12" />
            <path d="M9 20v-6h6v6" />
          </>
        ) : null}
        {type === "email" ? (
          <>
            <path d="M4 6h16v12H4z" />
            <path d="m4 8 8 6 8-6" />
          </>
        ) : null}
        {type === "password" ? (
          <>
            <path d="M7 11h10v9H7z" />
            <path d="M9 11V8a3 3 0 0 1 6 0v3" />
          </>
        ) : null}
      </svg>
    </span>
  );
}

export const authInputClassName =
  "h-11 w-full rounded-[12px] border pl-9 pr-12 text-[14px] outline-none transition placeholder:opacity-50 focus:border-[#17D492] focus:ring-4 focus:ring-[rgba(23,212,146,0.15)]";

export const authLabelClassName =
  "grid gap-1.5 text-[12px] font-bold uppercase tracking-[0.08em]";
