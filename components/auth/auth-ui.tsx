/**
 * ============================================================
 * File: components/auth/auth-ui.tsx
 * Project: BizPilot AI
 * Description: Provides shared auth page UI primitives for BizPilot owner access screens.
 * Role: Keeps sign-in and sign-up layouts consistent with the UI/UX System Standard.
 * Related:
 * - app/auth/sign-in/page.tsx
 * - app/auth/sign-up/page.tsx
 * - docs/product/BIZPILOT_UI_UX_SYSTEM_STANDARD_v1.0.md
 * Author: MoOoH
 * Created: 2026-05-12
 * Last Updated: 2026-05-12
 * Change Log:
 * - 2026-05-12: Created shared auth shell, card, and field icon components.
 * ============================================================
 */

import type { ReactNode } from "react";

type AuthShellProps = Readonly<{
  cardWidthClassName: string;
  children: ReactNode;
  footer: string;
}>;

type AuthCardProps = Readonly<{
  children: ReactNode;
  subtitle: string;
  title: string;
}>;

type AuthFieldIconProps = Readonly<{
  type: "business" | "email" | "name" | "password";
}>;

const benefits = [
  {
    body: "Turn your public quote link into clean, organized lead details.",
    icon: "chat",
    title: "Capture every request",
  },
  {
    body: "Review owner-safe reply guidance before sending anything yourself.",
    icon: "checklist",
    title: "Reply with confidence",
  },
  {
    body: "See which quote requests need attention next.",
    icon: "trend",
    title: "Follow up before leads go cold",
  },
] as const;

function BrandMark() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-violet-600 text-xs font-bold text-white shadow-[0_10px_22px_rgba(109,40,217,0.18)]">
      BP
    </span>
  );
}

function BrandLockup({ compact = false }: Readonly<{ compact?: boolean }>) {
  return (
    <div
      className={`flex items-center gap-3 ${compact ? "justify-center" : ""}`}
    >
      <BrandMark />
      <div>
        <p
          className={`font-semibold tracking-normal text-slate-950 ${
            compact ? "text-sm" : "text-base"
          }`}
        >
          BIZPILOT AI
        </p>
        {compact ? (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-700">
            Quote recovery workspace
          </p>
        ) : null}
      </div>
    </div>
  );
}

function BenefitIcon({
  icon,
}: Readonly<{ icon: (typeof benefits)[number]["icon"] }>) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-violet-50 text-violet-700">
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        {icon === "chat" ? (
          <>
            <path d="M5 6.5h14v9H8.5L5 19z" />
            <path d="M8.5 10h7" />
            <path d="M8.5 13h4.5" />
          </>
        ) : null}
        {icon === "checklist" ? (
          <>
            <path d="M8 6h10v14H6V6h2z" />
            <path d="M9 4h6v4H9z" />
            <path d="M9 13l1.5 1.5L14 11" />
            <path d="M9 17h6" />
          </>
        ) : null}
        {icon === "trend" ? (
          <>
            <path d="M4 17h16" />
            <path d="M6 15l4-4 3 3 5-7" />
            <path d="M15 7h3v3" />
          </>
        ) : null}
      </svg>
    </span>
  );
}

function TrustIcon() {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-violet-50 text-violet-700">
      <svg
        aria-hidden="true"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6z" />
        <path d="m9.5 12 1.7 1.7 3.8-4" />
      </svg>
    </span>
  );
}

function AuthBenefitPanel() {
  return (
    <aside className="relative hidden flex-col justify-center xl:flex">
      <div className="max-w-[410px]">
        <BrandLockup />

        <p className="mt-4 inline-flex rounded-md bg-violet-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-violet-700">
          Quote recovery workspace
        </p>

        <h1 className="mt-5 text-[28px] font-semibold leading-[1.12] tracking-normal text-slate-950">
          Keep quote requests moving toward booked work.
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Capture quote requests, review lead details, prepare replies, and
          follow up from one focused workspace.
        </p>

        <div className="mt-6 grid gap-3">
          {benefits.map((benefit) => (
            <div className="flex gap-3" key={benefit.title}>
              <BenefitIcon icon={benefit.icon} />
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  {benefit.title}
                </p>
                <p className="mt-0.5 text-xs leading-[1.55] text-slate-600">
                  {benefit.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-2.5 rounded-[10px] border border-violet-100 bg-white/65 px-3 py-2.5 shadow-sm">
          <TrustIcon />
          <p className="text-xs leading-[1.5] text-slate-600">
            <span className="block font-semibold text-slate-950">
              Owner-controlled workspace
            </span>
            Customer data stays inside your protected quote recovery flow.
            BizPilot prepares drafts; you decide what to send.
          </p>
        </div>
      </div>
    </aside>
  );
}

export function AuthShell({
  cardWidthClassName,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#f6f3ff_52%,#ffffff_100%)] px-4 py-4 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1080px] items-center gap-8 xl:grid-cols-[minmax(0,410px)_minmax(0,1fr)]">
        <AuthBenefitPanel />

        <section className={`mx-auto w-full ${cardWidthClassName}`}>
          <div className="mb-3 flex xl:hidden">
            <BrandLockup compact />
          </div>

          {children}

          <p className="mt-3 text-center text-xs leading-5 text-slate-500">
            {footer}
          </p>
        </section>
      </section>
    </main>
  );
}

export function AuthCard({ children, subtitle, title }: AuthCardProps) {
  return (
    <div className="rounded-[16px] border border-slate-200 bg-white/95 p-5 shadow-[0_14px_36px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="text-center">
        <h2 className="text-[21px] font-semibold leading-7 tracking-normal text-slate-950">
          {title}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-slate-600">
          {subtitle}
        </p>
      </div>

      {children}
    </div>
  );
}

export function AuthFieldIcon({ type }: AuthFieldIconProps) {
  return (
    <span className="pointer-events-none absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-slate-400">
      <svg
        aria-hidden="true"
        className="h-5 w-5"
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
            <path d="M8 10h.01" />
            <path d="M16 10h.01" />
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
  "h-11 w-full rounded-[10px] border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10";
