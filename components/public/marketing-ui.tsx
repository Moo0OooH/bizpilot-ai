/**
 * ============================================================
 * File: components/public/marketing-ui.tsx
 * Project: BizPilot AI
 * Description: Shared public marketing primitives for the founder-pilot site.
 * Role: Provides responsive header, footer, containers, cards, badges, buttons, icons, and theme control for public routes.
 * Related:
 * - app/page.tsx
 * - app/globals.css
 * - lib/i18n/home-copy.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-06-21
 * Change Log:
 * - 2026-06-18: Added compact responsive navigation and public container primitives.
 * - 2026-06-19: Mapped public primitives to shared semantic theme tokens and added theme preference controls.
 * - 2026-06-19: Rebuilt public header utilities around compact locale/theme controls and content-fit navigation.
 * - 2026-06-21: Removed duplicated compact header CTA markup so each shell state exposes one primary pilot action.
 * ============================================================
 */

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { MarketingCompactMenu } from "@/components/public/marketing-compact-menu";
import { MarketingLanguageMenu } from "@/components/public/marketing-language-menu";
import { ThemePreferenceControl } from "@/components/ui/theme-preference-control";
import type { HomeNavCopy } from "@/lib/i18n/home-copy";
import type { SupportedLanguage } from "@/lib/i18n/language";

export const marketingTone = {
  bg: "var(--canvas)",
  bgSoft: "var(--canvas-subtle)",
  text: "var(--text-strong)",
  soft: "var(--text-default)",
  muted: "var(--text-muted)",
  faint: "var(--border-default)",
  border: "var(--border-default)",
  borderStrong: "var(--border-strong)",
  surface: "var(--surface)",
  surfaceStrong: "var(--surface-elevated)",
  teal: "var(--accent)",
  emerald: "var(--success)",
  gold: "var(--warning)",
  red: "var(--danger)",
  blue: "var(--primary)",
};

export const marketingBackground = "var(--marketing-background)";

type ButtonVariant = "primary" | "secondary" | "ghost";
type BadgeTone = "teal" | "gold" | "blue" | "red" | "neutral";

const defaultMarketingNavCopy: HomeNavCopy = {
  brandSubtitle: "Lead recovery for cleaning businesses",
  cleaning: "Cleaning",
  comparison: "Comparison",
  copyright: "Copyright 2026 BizPilot AI. All rights reserved.",
  demo: "Demo",
  faq: "FAQ",
  features: "Features",
  flow: "How it works",
  languageLabel: "Homepage language",
  pilot: "Pilot",
  pricing: "Pricing",
  privacy: "Privacy",
  security: "Security",
  signIn: "Sign in",
  startFull: "Join founder pilot",
  startShort: "Join pilot",
  terms: "Terms",
  trust: "Trust",
  why: "Why BizPilot",
};

type MarketingNavKey =
  | "cleaning"
  | "demo"
  | "features"
  | "home"
  | "pilot"
  | "pricing"
  | "trust";

export type MarketingIconName =
  | "arrow"
  | "briefcase"
  | "calendar"
  | "check"
  | "clock"
  | "copy"
  | "inbox"
  | "link"
  | "lock"
  | "message"
  | "minus"
  | "pen"
  | "radar"
  | "shield"
  | "spark"
  | "target"
  | "user"
  | "warning"
  | "x";

export function MarketingIcon({ name }: Readonly<{ name: MarketingIconName }>) {
  const paths: Record<MarketingIconName, ReactNode> = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    briefcase: (
      <>
        <path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
        <path d="M4 7h16v13H4z" />
        <path d="M4 12h16" />
      </>
    ),
    calendar: (
      <>
        <path d="M7 3v4M17 3v4M4 8h16" />
        <path d="M5 5h14v16H5z" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    copy: (
      <>
        <path d="M8 8h11v11H8z" />
        <path d="M5 16H4V5h11v1" />
      </>
    ),
    inbox: (
      <>
        <path d="M3 12h6l2 3h2l2-3h6" />
        <path d="M3 5h18v14H3z" />
      </>
    ),
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
        <path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1" />
      </>
    ),
    lock: (
      <>
        <path d="M7 10V8a5 5 0 0 1 10 0v2" />
        <path d="M6 10h12v10H6z" />
      </>
    ),
    message: <path d="M5 6.5h14v9H9l-4 3.5z" />,
    minus: <path d="M5 12h14" />,
    pen: (
      <>
        <path d="M4 20h4l11-11-4-4L4 16z" />
        <path d="m13 7 4 4" />
      </>
    ),
    radar: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 12 18 6" />
        <path d="M7.5 16.5a6.4 6.4 0 0 1 0-9" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    spark: (
      <>
        <path d="M12 3v4M12 17v4M4 12H2M22 12h-2" />
        <path d="m6.5 6.5 2.8 2.8M14.7 14.7l2.8 2.8M17.5 6.5l-2.8 2.8M9.3 14.7l-2.8 2.8" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    warning: (
      <>
        <path d="M12 3 2.8 20h18.4z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    x: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden
      className="h-[1.1em] w-[1.1em]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}

export function MarketingShell({
  children,
  className = "",
}: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <div className={`public-container ${className}`}>
      {children}
    </div>
  );
}

export function MarketingCard({
  children,
  className = "",
  style,
}: Readonly<{
  children: ReactNode;
  className?: string;
  style?: CSSProperties | undefined;
}>) {
  return (
    <div
      className={`min-w-0 rounded-[20px] border ${className}`}
      style={{
        background: "var(--surface)",
        borderColor: marketingTone.border,
        boxShadow: "var(--shadow-md)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function MarketingBadge({
  children,
  toneName = "teal",
}: Readonly<{ children: ReactNode; toneName?: BadgeTone }>) {
  const palette: Record<BadgeTone, { bg: string; border: string; color: string }> = {
    blue: {
      bg: "color-mix(in srgb, var(--primary) 12%, transparent)",
      border: "color-mix(in srgb, var(--primary) 28%, transparent)",
      color: marketingTone.blue,
    },
    gold: {
      bg: "color-mix(in srgb, var(--warning) 12%, transparent)",
      border: "color-mix(in srgb, var(--warning) 30%, transparent)",
      color: marketingTone.gold,
    },
    neutral: {
      bg: "#F8FAFC",
      border: marketingTone.borderStrong,
      color: marketingTone.soft,
    },
    red: {
      bg: "color-mix(in srgb, var(--danger) 12%, transparent)",
      border: "color-mix(in srgb, var(--danger) 30%, transparent)",
      color: marketingTone.red,
    },
    teal: {
      bg: "color-mix(in srgb, var(--accent) 12%, transparent)",
      border: "color-mix(in srgb, var(--accent) 30%, transparent)",
      color: marketingTone.teal,
    },
  };
  const selected = palette[toneName];

  return (
    <span
      className="inline-flex max-w-full shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black uppercase leading-tight"
      style={{
        backgroundColor: selected.bg,
        borderColor: selected.border,
        color: selected.color,
      }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: selected.color }}
      />
      {children}
    </span>
  );
}

export function MarketingButton({
  children,
  className = "",
  href,
  variant = "primary",
}: Readonly<{
  children: ReactNode;
  className?: string;
  href: string;
  variant?: ButtonVariant;
}>) {
  const base =
    "inline-flex min-h-12 max-w-full min-w-0 items-center justify-center gap-3 rounded-[14px] px-5 text-center text-[14px] font-black leading-tight transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]";

  if (variant === "primary") {
    return (
      <Link
        className={`${base} hover:-translate-y-0.5 ${className}`}
        href={href}
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)",
          boxShadow: "0 16px 34px color-mix(in srgb, var(--primary) 22%, transparent)",
          color: "var(--primary-contrast)",
        }}
      >
        {children}
      </Link>
    );
  }

  if (variant === "secondary") {
    return (
      <Link
        className={`${base} border hover:-translate-y-0.5 ${className}`}
        href={href}
        style={{
          backgroundColor: "var(--surface)",
          borderColor: marketingTone.borderStrong,
          color: marketingTone.text,
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      className={`inline-flex min-h-11 min-w-0 items-center justify-center rounded-[12px] px-3 py-2 text-center text-[13px] font-bold leading-tight transition hover:bg-[var(--surface-interactive)] ${className}`}
      href={href}
      style={{ color: marketingTone.soft }}
    >
      {children}
    </Link>
  );
}

export function MarketingBrand({
  subtitle = defaultMarketingNavCopy.brandSubtitle,
}: Readonly<{ subtitle?: string }>) {
  return (
    <Link className="inline-flex min-h-11 min-w-0 items-center gap-3" href="/">
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-[16px] font-black"
        style={{
          background: "linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)",
          boxShadow: "0 12px 26px color-mix(in srgb, var(--primary) 20%, transparent)",
          color: "var(--primary-contrast)",
        }}
      >
        B
      </span>
      <span className="hidden min-w-0 leading-tight min-[340px]:block">
        <span className="block text-[15px] font-black" style={{ color: marketingTone.text }}>
          BizPilot AI
        </span>
        <span
          className="hidden whitespace-nowrap text-[9px] font-black uppercase min-[1240px]:block"
          style={{ color: marketingTone.muted }}
        >
          {subtitle}
        </span>
      </span>
    </Link>
  );
}

export function MarketingHeader({
  active = "home",
  copy = defaultMarketingNavCopy,
  language,
  redirectPath = "/",
}: Readonly<{
  active?: MarketingNavKey;
  copy?: HomeNavCopy;
  language?: SupportedLanguage;
  redirectPath?: string;
}>) {
  const navItems: ReadonlyArray<
    Readonly<{ href: string; key: Exclude<MarketingNavKey, "home">; label: string }>
  > = [
    { href: "/features", key: "features", label: copy.features },
    { href: "/industries/cleaning", key: "cleaning", label: copy.cleaning },
    { href: "/trust", key: "trust", label: copy.trust },
    { href: "/demo", key: "demo", label: copy.demo },
    { href: "/pricing", key: "pricing", label: copy.pricing },
    { href: "/pilot", key: "pilot", label: copy.pilot },
  ];

  const currentPath = redirectPath.split(/[?#]/)[0] || "/";
  const isActiveItem = (
    item: Readonly<{ href: string; key: Exclude<MarketingNavKey, "home"> }>,
  ) => active === item.key || currentPath === item.href;
  const renderLanguageMenu = (compact = false) =>
    language ? (
      <MarketingLanguageMenu
        buttonClassName={compact ? "w-full justify-center" : ""}
        className={compact ? "w-full" : ""}
        label={copy.languageLabel}
        language={language}
        redirectPath={redirectPath}
      />
    ) : null;

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{ backgroundColor: "color-mix(in srgb, var(--canvas) 88%, transparent)", borderColor: marketingTone.border }}
    >
      <nav className="public-container flex min-h-[64px] items-center justify-between gap-3 py-2 min-[1240px]:min-h-[76px]">
        <MarketingBrand subtitle={copy.brandSubtitle} />
        <div className="hidden items-center gap-1 min-[1240px]:flex">
          {navItems.map((item) => {
            const selected = isActiveItem(item);

            return (
              <Link
                aria-current={selected ? "page" : undefined}
                className="inline-flex min-h-11 items-center whitespace-nowrap rounded-[12px] px-3 py-2 text-[12px] font-bold transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
                href={item.href}
                key={item.href}
                style={{
                  backgroundColor: selected
                    ? "var(--surface-interactive)"
                    : "transparent",
                  color: selected ? marketingTone.text : marketingTone.soft,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="hidden shrink-0 items-center gap-2 min-[1240px]:flex">
          {renderLanguageMenu()}
          <ThemePreferenceControl language={language ?? "en"} />
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-[12px] px-3 text-[13px] font-bold transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
            href="/auth/sign-in"
            style={{ color: marketingTone.soft }}
          >
            {copy.signIn}
          </Link>
          <MarketingButton className="min-h-11 px-4 text-[13px]" href="/pilot">
            {copy.startFull}
          </MarketingButton>
        </div>
        <div className="flex shrink-0 items-center gap-2 min-[1240px]:hidden">
          <MarketingCompactMenu>
            <div className="grid gap-1">
              {navItems.map((item) => {
                const selected = isActiveItem(item);

                return (
                  <Link
                    aria-current={selected ? "page" : undefined}
                    className="min-h-11 rounded-[12px] px-3 py-3 text-[14px] font-black transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
                    href={item.href}
                    key={item.href}
                    style={{
                      backgroundColor: selected
                        ? "var(--surface-interactive)"
                        : "transparent",
                      color: marketingTone.text,
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="grid gap-3 border-t pt-3" style={{ borderColor: marketingTone.border }}>
              {renderLanguageMenu(true)}
              <ThemePreferenceControl className="w-full justify-center" language={language ?? "en"} />
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-[12px] border px-4 text-[13px] font-bold transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
                href="/auth/sign-in"
                style={{ borderColor: marketingTone.borderStrong, color: marketingTone.soft }}
              >
                {copy.signIn}
              </Link>
              <MarketingButton className="w-full" href="/pilot">
                {copy.startShort}
              </MarketingButton>
            </div>
          </MarketingCompactMenu>
        </div>
      </nav>
    </header>
  );
}

export function MarketingFooter({
  copy = defaultMarketingNavCopy,
}: Readonly<{ copy?: HomeNavCopy }>) {
  const links: ReadonlyArray<Readonly<{ href: string; label: string }>> = [
    { href: "/features", label: copy.features },
    { href: "/industries/cleaning", label: copy.cleaning },
    { href: "/trust", label: copy.trust },
    { href: "/demo", label: copy.demo },
    { href: "/pricing", label: copy.pricing },
    { href: "/pilot", label: copy.pilot },
    { href: "/privacy", label: copy.privacy },
    { href: "/security", label: copy.security },
    { href: "/terms", label: copy.terms },
  ];

  return (
    <footer className="border-t px-5 py-10 sm:px-8 lg:px-10" style={{ borderColor: marketingTone.border }}>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 text-[12px] md:flex-row md:items-center md:justify-between">
        <MarketingBrand subtitle={copy.brandSubtitle} />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2" style={{ color: marketingTone.soft }}>
          {links.map((link) => (
            <Link className="inline-flex min-h-11 items-center rounded-[8px] py-1 hover:opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <span style={{ color: marketingTone.muted }}>
          {copy.copyright}
        </span>
      </div>
    </footer>
  );
}

export function MarketingSectionTitle({
  align = "left",
  eyebrow,
  lead,
  title,
}: Readonly<{
  align?: "center" | "left";
  eyebrow?: string;
  lead?: string;
  title: ReactNode;
}>) {
  return (
    <div className={align === "center" ? "mx-auto max-w-[980px] text-center" : "max-w-[760px]"}>
      {eyebrow ? (
        <p className="text-[12px] font-black uppercase" style={{ color: marketingTone.teal }}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-[28px] font-black leading-[1.12] sm:text-[32px]" style={{ color: marketingTone.text }}>
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 text-[16px] leading-7" style={{ color: marketingTone.soft }}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}
