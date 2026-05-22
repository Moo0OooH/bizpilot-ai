/**
 * ============================================================
 * File: components/auth/auth-ui.tsx
 * Project: BizPilot AI
 * Description: Auth page primitives — single centered card.
 * Role: Owner access screens follow Design System v1.0 §10.2 (centered auth card, max 460px). The previous split layout with a benefit panel introduced horizontal scroll and an oversized scale on common laptop widths.
 * Related:
 * - app/auth/sign-in/page.tsx
 * - app/auth/sign-up/page.tsx
 * - docs/product/BIZPILOT_DASHBOARD_DESIGN_SYSTEM_v1.0.md §10.2
 * Author: MoOoH
 * Created: 2026-05-12
 * Last Updated: 2026-05-19
 * Change Log:
 * - 2026-05-19: Rebuilt as single centered card. Removed AuthBenefitPanel and the xl:grid-cols split that caused scroll/scale issues. Kept brand mark, dark navy surface, emerald accents, accessible focus rings.
 * ============================================================
 */

import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = Readonly<{
  children: ReactNode;
  footer?: string;
}>;

type AuthCardProps = Readonly<{
  children: ReactNode;
  subtitle: string;
  title: string;
}>;

type AuthFieldIconProps = Readonly<{
  type: "business" | "email" | "name" | "password";
}>;

function BrandMark() {
  return (
    <Link
      className="inline-flex items-center gap-2.5"
      href="/"
      style={{ color: "var(--biz-page-text)" }}
    >
      <span
        aria-hidden
        className="flex h-9 w-9 items-center justify-center rounded-[12px] text-base font-black"
        style={{
          background:
            "linear-gradient(135deg, #2dd4bf, #10b981)",
          color: "#022c22",
          boxShadow: "0 10px 22px rgba(20,184,166,0.22)",
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
          Owner access
        </span>
      </span>
    </Link>
  );
}

export function AuthShell({ children, footer }: AuthShellProps) {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-4 py-6 sm:px-6"
      style={{
        background:
          "radial-gradient(circle at 16% 8%, rgba(20,184,166,0.16), transparent 26%), radial-gradient(circle at 88% 14%, rgba(45,212,191,0.10), transparent 24%), linear-gradient(140deg, var(--biz-page-bg), var(--biz-bg-dark-2))",
        color: "var(--biz-page-text)",
      }}
    >
      <div className="mb-5 flex w-full max-w-[460px] items-center justify-between">
        <BrandMark />
        <Link
          className="text-[12px] font-bold"
          href="/"
          style={{ color: "var(--biz-page-text-soft)" }}
        >
          ← Back home
        </Link>
      </div>

      <section className="w-full max-w-[460px]">{children}</section>

      {footer ? (
        <p
          className="mt-4 max-w-[460px] text-center text-[11px] leading-5"
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
  "h-11 w-full rounded-[12px] border pl-9 pr-3 text-[14px] outline-none transition placeholder:opacity-50 focus:border-[#17D492] focus:ring-4 focus:ring-[rgba(23,212,146,0.15)]";

export const authLabelClassName =
  "grid gap-1.5 text-[12px] font-bold uppercase tracking-[0.08em]";
