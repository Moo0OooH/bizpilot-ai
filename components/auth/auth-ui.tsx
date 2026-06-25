/**
 * ============================================================
 * File: components/auth/auth-ui.tsx
 * Project: BizPilot AI
 * Description: Auth page primitives - single natural-flow card.
 * Role: Owner access screens inherit the saved theme and keep auth chrome simple.
 * Related:
 * - app/auth/sign-in/page.tsx
 * - app/auth/sign-up/page.tsx
 * - lib/i18n/bizpilot-copy.ts
 * Author: MoOoH
 * Created: 2026-05-12
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-05-19: Rebuilt as single centered card. Removed the split layout that caused scroll/scale issues.
 * - 2026-05-23: Added shared language switcher and localized auth chrome.
 * - 2026-06-18: Switched auth shell to short-height-safe svh layout.
 * - 2026-06-19: Added the shared System/Light/Dark preference control to auth chrome.
 * - 2026-06-19: Removed auth utility controls and aligned auth actions to the public blue primary.
 * - 2026-06-25: Tightened auth card spacing for final public rhythm polish.
 * ============================================================
 */

import type { BizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

type AuthShellProps = Readonly<{
  children: ReactNode;
  copy: BizPilotCopy["auth"];
  footer?: string;
  maxWidthClassName?: string;
}>;

type AuthCardProps = Readonly<{
  children: ReactNode;
  subtitle: string;
  title: string;
}>;

type AuthFieldIconProps = Readonly<{
  type: "business" | "email" | "name";
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
        className="flex h-9 w-9 items-center justify-center rounded-[10px] text-base font-black"
        style={{
          background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
          boxShadow: "0 10px 22px color-mix(in srgb, var(--primary) 18%, transparent)",
          color: "var(--primary-contrast)",
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
  maxWidthClassName = "max-w-[520px]",
}: AuthShellProps) {
  return (
    <main
      className="flex min-h-svh flex-col items-center justify-start px-4 py-5 sm:px-6 sm:py-6"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--canvas-subtle) 72%, var(--canvas)) 0%, var(--canvas) 100%)",
        color: "var(--biz-page-text)",
      }}
    >
      <div className={`mb-4 flex w-full ${maxWidthClassName} items-center justify-between gap-3`}>
        <BrandMark copy={copy} />
        <Link
          className="inline-flex min-h-11 items-center rounded-[12px] border px-3 text-[12px] font-black transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
          href="/"
          style={{
            borderColor: "var(--biz-page-border)",
            color: "var(--biz-page-text-soft)",
          }}
        >
          &larr; {copy.backHome}
        </Link>
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
      className="w-full rounded-[20px] border p-5 sm:p-6"
      style={{
        backgroundColor: "var(--biz-page-surface)",
        borderColor: "var(--biz-page-border)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div className="text-center">
        <h1
          className="text-[22px] font-extrabold leading-tight tracking-[-0.02em]"
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
      style={{ color: "var(--biz-page-text-muted)" }}
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
      </svg>
    </span>
  );
}

export const authInfoStyle: CSSProperties = {
  backgroundColor: "color-mix(in srgb, var(--primary) 10%, transparent)",
  borderColor: "color-mix(in srgb, var(--primary) 24%, transparent)",
  color: "var(--biz-page-text-soft)",
};

export const authSuccessStyle: CSSProperties = {
  backgroundColor: "color-mix(in srgb, var(--success) 10%, transparent)",
  borderColor: "color-mix(in srgb, var(--success) 24%, transparent)",
  color: "var(--success)",
};

export const authErrorStyle: CSSProperties = {
  backgroundColor: "color-mix(in srgb, var(--danger) 10%, transparent)",
  borderColor: "color-mix(in srgb, var(--danger) 24%, transparent)",
  color: "var(--danger)",
};

export const authInputClassName =
  "h-11 w-full rounded-[12px] border pl-9 pr-3 text-[14px] outline-none transition placeholder:opacity-50 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--focus-ring)]";

export const authLabelClassName =
  "grid gap-1.5 text-[12px] font-bold uppercase tracking-[0.08em]";
