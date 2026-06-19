/**
 * ============================================================
 * File: components/ui/bizpilot-theme.tsx
 * Project: BizPilot AI
 * Description: Provides shared brand primitives for BizPilot public-facing UI.
 * Role: Keeps logo, cards, and semantic theme shell aligned across landing, auth, and quote pages.
 * Related:
 * - lib/design-tokens.ts
 * - app/page.tsx
 * - components/auth/auth-ui.tsx
 * - app/(public)/quote/[slug]/page.tsx
 * Author: MoOoH
 * Created: 2026-05-18
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-05-18: Created shared brand mark, shell, and surface primitives.
 * - 2026-06-19: Mapped shared shell primitives to semantic theme tokens.
 * ============================================================
 */

import type { ReactNode } from "react";

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
      <span
        className={`${compact ? "h-7 w-7" : "h-8 w-8"} flex shrink-0 items-center justify-center rounded-[10px] text-xs font-black shadow-[var(--shadow-sm)]`}
        style={{
          background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
          color: "var(--primary-contrast)",
        }}
      >
        BP
      </span>
      <div>
        <p
          className={compact ? "text-sm font-bold" : "text-base font-bold"}
          style={{ color: "var(--text-strong)" }}
        >
          BizPilot
        </p>
        {subtitle ? (
          <p
            className="text-[11px] font-semibold uppercase"
            style={{ color: "var(--accent)" }}
          >
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
    <main
      className={`relative min-h-svh ${className}`}
      style={{
        background: "var(--marketing-background)",
        color: "var(--text-default)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
      />
      <div className="relative">{children}</div>
    </main>
  );
}

export function BizPilotSurface({
  children,
  className = "",
}: BizPilotSurfaceProps) {
  return (
    <div
      className={`rounded-[18px] border shadow-[var(--shadow-md)] ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border-default)",
      }}
    >
      {children}
    </div>
  );
}
