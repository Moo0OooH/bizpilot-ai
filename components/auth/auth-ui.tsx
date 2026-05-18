/**
 * ============================================================
 * File: components/auth/auth-ui.tsx
 * Project: BizPilot AI
 * Description: Provides shared auth page UI primitives for BizPilot owner access screens.
 * Role: Keeps sign-in and sign-up layouts consistent with the shared BizPilot dark theme.
 * Related:
 * - app/auth/sign-in/page.tsx
 * - app/auth/sign-up/page.tsx
 * - docs/product/BIZPILOT_UI_UX_SYSTEM_STANDARD_v1.0.md
 * Author: MoOoH
 * Created: 2026-05-12
 * Last Updated: 2026-05-18
 * Change Log:
 * - 2026-05-12: Created shared auth shell, card, and field icon components.
 * - 2026-05-12: Tightened auth density, accessibility, and production visual standards.
 * - 2026-05-12: Added compact trusted auth depth and reduced 100% zoom vertical pressure.
 * - 2026-05-12: Aligned auth visuals with the slate, emerald, and indigo brand direction.
 * - 2026-05-12: Finalized production auth scale, spacing, and visual consistency.
 * - 2026-05-12: Added subtle premium auth atmosphere and quiet depth.
 * - 2026-05-12: Moved auth glows inside the shared surface for integrated warmth.
 * - 2026-05-18: Connected auth screens to shared BizPilot dark theme tokens.
 * ============================================================
 */

import type { ReactNode } from "react";

import {
  BizPilotBrand,
  BizPilotSurface,
  BizPilotThemeShell,
} from "@/components/ui/bizpilot-theme";
import { bizTheme } from "@/lib/design-tokens";

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
    body: "Quote requests arrive with source, service, timing, and urgency visible.",
    icon: "chat",
    title: "Capture every request",
  },
  {
    body: "AI prepares reply drafts for review while owners stay in control.",
    icon: "checklist",
    title: "Reply before competitors",
  },
  {
    body: "Missed replies and cold leads surface before the job disappears.",
    icon: "trend",
    title: "Recover missed jobs",
  },
] as const;

function BenefitIcon({
  icon,
}: Readonly<{ icon: (typeof benefits)[number]["icon"] }>) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-[#17D492]/20 bg-[#17D492]/10 text-[#17D492]">
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

function AuthBenefitPanel() {
  return (
    <aside className="relative hidden min-h-[440px] overflow-hidden rounded-[18px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(13,23,33,0.94),rgba(7,16,24,0.98))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.20)] xl:block">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(23,212,146,0.14),transparent_15rem),radial-gradient(circle_at_86%_82%,rgba(64,124,255,0.09),transparent_17rem)]"
      />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <BizPilotBrand subtitle="Owner access" />

          <p className="mt-5 inline-flex rounded-full border border-[#17D492]/20 bg-[#17D492]/8 px-3 py-1 text-[11px] font-bold uppercase text-[#17D492]">
            Quote recovery workspace
          </p>

          <h1 className="mt-4 max-w-[11ch] text-[28px] font-bold leading-[1.05] tracking-[-0.03em] text-[#F5F7FA]">
            Stop letting warm leads go cold.
          </h1>
          <p className={`mt-3 max-w-[34ch] text-sm leading-6 ${bizTheme.secondaryText}`}>
            Capture the request, review the AI draft, and move faster while the customer is still ready to book.
          </p>
        </div>

        <div className="mt-7 grid gap-3">
          {benefits.map((benefit) => (
            <div
              className="flex gap-3 rounded-[14px] border border-white/[0.07] bg-white/[0.035] p-3"
              key={benefit.title}
            >
              <BenefitIcon icon={benefit.icon} />
              <div>
                <p className="text-sm font-bold text-[#F5F7FA]">
                  {benefit.title}
                </p>
                <p className={`mt-1 text-xs leading-5 ${bizTheme.secondaryText}`}>
                  {benefit.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[14px] border border-[#17D492]/18 bg-[#17D492]/8 p-3 text-xs leading-5 text-[rgba(245,247,250,0.72)]">
          <span className="block font-bold text-[#F5F7FA]">
            Review-only AI by design
          </span>
          BizPilot prepares operational drafts. The business decides what gets sent.
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
    <BizPilotThemeShell className="px-4 py-5 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-2.5rem)] w-full min-w-0 max-w-[1120px] items-center gap-5 xl:grid-cols-[minmax(0,390px)_minmax(0,1fr)]">
        <AuthBenefitPanel />

        <section className={`relative z-10 mx-auto w-full min-w-0 ${cardWidthClassName}`}>
          <div className="mb-4 flex xl:hidden">
            <BizPilotBrand compact subtitle="Owner access" />
          </div>

          {children}

          <p className={`mt-3 text-center text-xs leading-5 ${bizTheme.mutedText}`}>
            {footer}
          </p>
        </section>
      </section>
    </BizPilotThemeShell>
  );
}

export function AuthCard({ children, subtitle, title }: AuthCardProps) {
  return (
    <BizPilotSurface className="w-full min-w-0 p-5 sm:p-6">
      <div className="text-center">
        <h2 className="text-[24px] font-bold leading-7 tracking-[-0.02em] text-[#F5F7FA]">
          {title}
        </h2>
        <p className={`mx-auto mt-2 max-w-sm break-words text-sm leading-6 ${bizTheme.secondaryText}`}>
          {subtitle}
        </p>
      </div>

      {children}
    </BizPilotSurface>
  );
}

export function AuthFieldIcon({ type }: AuthFieldIconProps) {
  return (
    <span className="pointer-events-none absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-[rgba(245,247,250,0.42)]">
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

export const authInputClassName = `${bizTheme.field} h-[52px] pl-11 pr-3`;

export const authLabelClassName = `grid gap-1.5 ${bizTheme.label}`;
