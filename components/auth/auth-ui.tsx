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
 * - 2026-05-12: Tightened auth density, accessibility, and production visual standards.
 * - 2026-05-12: Added compact trusted auth depth and reduced 100% zoom vertical pressure.
 * - 2026-05-12: Aligned auth visuals with the slate, emerald, and indigo brand direction.
 * - 2026-05-12: Finalized production auth scale, spacing, and visual consistency.
 * - 2026-05-12: Added subtle premium auth atmosphere and quiet depth.
 * - 2026-05-12: Moved auth glows inside the shared surface for integrated warmth.
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
    body: "Turn public quote requests into clean lead details.",
    icon: "chat",
    title: "Capture requests",
  },
  {
    body: "Review draft guidance before sending anything yourself.",
    icon: "checklist",
    title: "Prepare replies",
  },
  {
    body: "See which quote requests need attention today.",
    icon: "trend",
    title: "Follow up",
  },
] as const;

function BrandMark() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--biz-primary)] text-xs font-semibold text-white shadow-[0_10px_22px_rgba(4,120,87,0.18)]">
      BP
    </span>
  );
}

function BrandLockup({
  compact = false,
  dark = false,
}: Readonly<{ compact?: boolean; dark?: boolean }>) {
  return (
    <div
      className={`flex items-center gap-3 ${compact ? "justify-center" : ""}`}
    >
      <BrandMark />
      <div>
        <p
          className={`font-semibold tracking-normal text-slate-950 ${
            compact ? "text-sm" : "text-base"
          } ${dark ? "!text-white" : ""}`}
        >
          BIZPILOT AI
        </p>
        {compact ? (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--biz-primary)]">
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
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-[var(--biz-primary)] shadow-[0_6px_14px_rgba(15,23,42,0.05)]">
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
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[var(--biz-primary)]">
      <svg
        aria-hidden="true"
        className="h-3 w-3"
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
    <aside className="relative hidden min-h-[430px] flex-col justify-center overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(18,31,45,0.96)_0%,rgba(6,17,31,0.98)_100%)] p-4 text-white shadow-[0_18px_42px_rgba(15,23,42,0.16),0_2px_8px_rgba(15,23,42,0.08)] xl:flex">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(16,185,129,0.16),transparent_16rem),radial-gradient(circle_at_82%_78%,rgba(99,102,241,0.10),transparent_18rem)]"
      />
      <div className="relative z-10 max-w-[360px]">
        <BrandLockup dark />

        <p className="mt-3 inline-flex rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--biz-primary)]">
          Owner access
        </p>

        <h1 className="mt-3 text-[23px] font-semibold leading-[1.12] tracking-normal text-white">
          Keep quote requests moving toward booked work.
        </h1>
        <p className="mt-2 max-w-[34rem] text-[13px] leading-5 text-slate-300">
          Capture quote requests, review lead details, prepare replies, and keep follow-ups visible from one focused workspace.
        </p>

        <div className="mt-3 grid gap-2">
          {benefits.map((benefit) => (
            <div className="flex gap-2.5" key={benefit.title}>
              <BenefitIcon icon={benefit.icon} />
              <div>
                <p className="text-[13px] font-semibold text-white">
                  {benefit.title}
                </p>
                <p className="mt-0.5 text-xs leading-[1.45] text-slate-300">
                  {benefit.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2.5 rounded-xl border border-emerald-300/20 bg-emerald-500/[0.08] px-3 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.10)]">
          <TrustIcon />
          <p className="text-xs leading-[1.45] text-slate-300">
            <span className="block font-semibold text-white">
              Owner-controlled workspace
            </span>
            BizPilot prepares drafts for review. You decide what to send.
          </p>
        </div>

        <div className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/[0.10] px-2.5 py-1 text-[11px] font-medium text-violet-200">
          <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
          AI assistant stays review-only
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
    <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#06111f_0%,#0b1728_34%,#eef2f7_34%,#f8fafc_100%)] px-4 py-4 text-[#0F172A] sm:px-6 lg:px-8">
      <section className="relative mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1120px] items-center gap-4 overflow-hidden xl:grid-cols-[minmax(0,370px)_minmax(0,1fr)] xl:rounded-3xl xl:border xl:border-slate-200 xl:bg-[#FBFDFC] xl:p-3 xl:shadow-[0_22px_60px_rgba(15,23,42,0.10),0_3px_12px_rgba(15,23,42,0.04)]">
        <div
          aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_30%_72%,rgba(4,120,87,0.08),transparent_34%),radial-gradient(circle_at_72%_28%,rgba(99,102,241,0.06),transparent_32%),radial-gradient(circle_at_54%_54%,rgba(15,23,42,0.035),transparent_38%)] xl:block"
        />
        <AuthBenefitPanel />

        <section className={`relative z-10 mx-auto w-full ${cardWidthClassName}`}>
          <div className="mb-3 flex xl:hidden">
            <BrandLockup compact />
          </div>

          {children}

          <p className="mt-2 text-center text-xs leading-5 text-[#64748B]">
            {footer}
          </p>
        </section>
      </section>
    </main>
  );
}

export function AuthCard({ children, subtitle, title }: AuthCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_46px_rgba(15,23,42,0.11),0_3px_12px_rgba(15,23,42,0.05)] xl:shadow-[0_18px_40px_rgba(15,23,42,0.085),0_2px_10px_rgba(15,23,42,0.04)] sm:p-6">
      <div className="text-center">
        <h2 className="text-[22px] font-semibold leading-7 tracking-normal text-[#0F172A]">
          {title}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-[#475569]">
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
  "h-[52px] w-full rounded-xl border border-slate-200 bg-white pl-11 pr-3 text-sm text-[#0F172A] shadow-[inset_0_1px_0_rgba(15,23,42,0.02)] outline-none transition placeholder:text-slate-400 focus:border-[var(--biz-primary)] focus:ring-2 focus:ring-emerald-600/20";
