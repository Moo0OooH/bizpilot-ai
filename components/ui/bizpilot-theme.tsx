/**
 * ============================================================
 * File: components/ui/bizpilot-theme.tsx
 * Project: BizPilot AI
 * Description: Provides shared brand primitives for BizPilot public-facing UI.
 * Role: Keeps logo, cards, and theme shell aligned across landing, auth, and quote pages.
 * Related:
 * - lib/design-tokens.ts
 * - app/page.tsx
 * - components/auth/auth-ui.tsx
 * - app/(public)/quote/[slug]/page.tsx
 * Author: MoOoH
 * Created: 2026-05-18
 * Last Updated: 2026-05-18
 * Change Log:
 * - 2026-05-18: Created shared brand mark, shell, and surface primitives.
 * ============================================================
 */

import type { ReactNode } from "react";

import { bizTheme } from "@/lib/design-tokens";

type BizPilotBrandProps = Readonly<{
  compact?: boolean;
  subtitle?: string;
}>;

type BizPilotThemeShellProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

type BizPilotSurfaceProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function BizPilotBrand({ compact = false, subtitle }: BizPilotBrandProps) {
  return (
    <div className="flex items-center gap-3">
      <span className={compact ? bizTheme.brandMark.replace("h-8 w-8", "h-7 w-7") : bizTheme.brandMark}>
        BP
      </span>
      <div>
        <p className={compact ? "text-sm font-bold text-[#F5F7FA]" : "text-base font-bold text-[#F5F7FA]"}>
          BizPilot
        </p>
        {subtitle ? (
          <p className="text-[11px] font-semibold uppercase text-[#17D492]">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function BizPilotThemeShell({
  children,
  className = "",
}: BizPilotThemeShellProps) {
  return (
    <main className={`relative min-h-screen overflow-x-hidden ${bizTheme.appBackground} ${className}`}>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 ${bizTheme.atmosphericBackground}`}
      />
      <div className="relative">{children}</div>
    </main>
  );
}

export function BizPilotSurface({
  children,
  className = "",
}: BizPilotSurfaceProps) {
  return <div className={`${bizTheme.card} ${className}`}>{children}</div>;
}
