/**
 * ============================================================
 * File: lib/design-tokens.ts
 * Project: BizPilot AI
 * Description: Defines shared visual tokens for BizPilot public, auth, and quote surfaces.
 * Role: Centralizes premium dark theme classes so brand changes can propagate consistently.
 * Related:
 * - components/ui/bizpilot-theme.tsx
 * - app/page.tsx
 * - components/auth/auth-ui.tsx
 * - app/(public)/quote/[slug]/page.tsx
 * Author: MoOoH
 * Created: 2026-05-18
 * Last Updated: 2026-05-18
 * Change Log:
 * - 2026-05-18: Created shared dark emerald design tokens for public-facing surfaces.
 * ============================================================
 */

export const bizColors = {
  accent: "#17D492",
  accentHover: "#21E6A0",
  background: "#071018",
  border: "rgba(255,255,255,0.08)",
  card: "rgba(13,23,33,0.92)",
  danger: "#FF5C5C",
  glow: "rgba(23,212,146,0.18)",
  muted: "rgba(245,247,250,0.46)",
  secondary: "rgba(245,247,250,0.72)",
  surface: "#0D1721",
  text: "#F5F7FA",
  warning: "#FFB84D",
} as const;

export const bizTheme = {
  appBackground:
    "bg-[#071018] text-[#F5F7FA] [color-scheme:dark]",
  atmosphericBackground:
    "bg-[radial-gradient(circle_at_20%_10%,rgba(23,212,146,0.08),transparent_24rem),radial-gradient(circle_at_74%_12%,rgba(64,124,255,0.07),transparent_24rem),linear-gradient(180deg,rgba(255,255,255,0.018),transparent_28rem)]",
  brandMark:
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#17D492] text-xs font-black text-[#03130c] shadow-[0_14px_32px_rgba(23,212,146,0.16)]",
  buttonPrimary:
    "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[10px] bg-[#17D492] px-5 text-xs font-bold text-[#03130c] shadow-[0_14px_32px_rgba(23,212,146,0.16)] transition duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-[#21E6A0] hover:shadow-[0_18px_42px_rgba(23,212,146,0.24)] focus:outline-none focus:ring-2 focus:ring-[#17D492]/30 focus:ring-offset-2 focus:ring-offset-[#071018]",
  buttonSecondary:
    "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[10px] border border-white/[0.12] bg-white/[0.035] px-4 text-xs font-semibold text-[#F5F7FA] transition duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[#17D492]/25 focus:ring-offset-2 focus:ring-offset-[#071018]",
  card:
    "rounded-[18px] border border-white/[0.08] bg-[rgba(13,23,33,0.92)] shadow-[0_24px_70px_rgba(0,0,0,0.18)]",
  field:
    "w-full rounded-[10px] border border-white/[0.10] bg-white/[0.04] text-sm text-[#F5F7FA] outline-none transition placeholder:text-[rgba(245,247,250,0.38)] focus:border-[#17D492]/70 focus:ring-2 focus:ring-[#17D492]/15",
  label:
    "text-sm font-semibold text-[rgba(245,247,250,0.82)]",
  mutedText: "text-[rgba(245,247,250,0.46)]",
  secondaryText: "text-[rgba(245,247,250,0.72)]",
  surface:
    "border border-white/[0.08] bg-[rgba(13,23,33,0.92)]",
} as const;
