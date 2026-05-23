import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import type { HomeNavCopy } from "@/lib/i18n/home-copy";
import {
  languageNativeLabels,
  languageShortLabels,
  supportedLanguages,
  type SupportedLanguage,
} from "@/lib/i18n/language";
import { setInterfaceLanguageAction } from "@/server/actions/business-configuration.actions";

export const marketingTone = {
  bg: "#050B12",
  bgSoft: "#07111C",
  text: "#F7FAFC",
  soft: "rgba(247,250,252,0.76)",
  muted: "rgba(247,250,252,0.52)",
  faint: "rgba(247,250,252,0.18)",
  border: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(255,255,255,0.16)",
  surface: "rgba(9,20,31,0.82)",
  surfaceStrong: "rgba(12,25,38,0.96)",
  teal: "#2DD4BF",
  emerald: "#17D492",
  gold: "#F6B84B",
  red: "#FF5F66",
  blue: "#54A7FF",
};

export const marketingBackground =
  "radial-gradient(circle at 7% 7%, rgba(45,212,191,0.13), transparent 24rem), radial-gradient(circle at 91% 2%, rgba(23,212,146,0.14), transparent 26rem), radial-gradient(circle at 47% 38%, rgba(84,167,255,0.06), transparent 34rem), linear-gradient(180deg, #07111C 0%, #050B12 52%, #04080E 100%)";

type ButtonVariant = "primary" | "secondary" | "ghost";
type BadgeTone = "teal" | "gold" | "blue" | "red" | "neutral";

const defaultMarketingNavCopy: HomeNavCopy = {
  brandSubtitle: "Quote Recovery Command Center",
  comparison: "Comparison",
  copyright: "Copyright 2026 BizPilot AI. All rights reserved.",
  faq: "FAQ",
  flow: "How it works",
  languageLabel: "Homepage language",
  pricing: "Pricing",
  signIn: "Sign in",
  startFull: "Start free recovery",
  startShort: "Start",
  why: "Why BizPilot",
};

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
    <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-6 ${className}`}>
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
      className={`min-w-0 rounded-[14px] border ${className}`}
      style={{
        background:
          "linear-gradient(180deg, rgba(13,28,42,0.90), rgba(7,16,25,0.88))",
        borderColor: marketingTone.border,
        boxShadow: "0 24px 70px rgba(0,0,0,0.30)",
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
      bg: "rgba(84,167,255,0.11)",
      border: "rgba(84,167,255,0.28)",
      color: marketingTone.blue,
    },
    gold: {
      bg: "rgba(246,184,75,0.12)",
      border: "rgba(246,184,75,0.30)",
      color: marketingTone.gold,
    },
    neutral: {
      bg: "rgba(255,255,255,0.06)",
      border: marketingTone.borderStrong,
      color: marketingTone.soft,
    },
    red: {
      bg: "rgba(255,95,102,0.12)",
      border: "rgba(255,95,102,0.30)",
      color: marketingTone.red,
    },
    teal: {
      bg: "rgba(45,212,191,0.11)",
      border: "rgba(45,212,191,0.30)",
      color: marketingTone.teal,
    },
  };
  const selected = palette[toneName];

  return (
    <span
      className="inline-flex max-w-full shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-black uppercase leading-none"
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
    "inline-flex h-11 max-w-full items-center justify-center gap-3 whitespace-nowrap rounded-[10px] px-5 text-[13px] font-black transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(23,212,146,0.28)]";

  if (variant === "primary") {
    return (
      <Link
        className={`${base} hover:-translate-y-0.5 ${className}`}
        href={href}
        style={{
          background: "linear-gradient(135deg, #2DD4BF 0%, #17D492 100%)",
          boxShadow: "0 18px 46px rgba(23,212,146,0.25)",
          color: "#03130C",
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
          backgroundColor: "rgba(255,255,255,0.035)",
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
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-[10px] px-3 py-2 text-[13px] font-bold transition hover:bg-white/[0.05] ${className}`}
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
    <Link className="inline-flex min-w-0 items-center gap-3" href="/">
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-[16px] font-black"
        style={{
          background: "linear-gradient(135deg, #2DD4BF 0%, #17D492 100%)",
          boxShadow: "0 12px 30px rgba(23,212,146,0.24)",
          color: "#03130C",
        }}
      >
        B
      </span>
      <span className="hidden min-w-0 leading-tight min-[340px]:block">
        <span className="block text-[15px] font-black" style={{ color: marketingTone.text }}>
          BizPilot AI
        </span>
        <span className="hidden text-[9px] font-black uppercase sm:block" style={{ color: marketingTone.muted }}>
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
  active?: "home" | "pricing";
  copy?: HomeNavCopy;
  language?: SupportedLanguage;
  redirectPath?: string;
}>) {
  const navItems: ReadonlyArray<Readonly<{ href: string; label: string }>> = [
    { href: "/#why", label: copy.why },
    { href: "/#recovery-flow", label: copy.flow },
    { href: "/#comparison", label: copy.comparison },
    { href: "/pricing", label: copy.pricing },
    { href: "/pricing#faq", label: copy.faq },
  ];

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{ backgroundColor: "rgba(5,11,18,0.82)", borderColor: marketingTone.border }}
    >
      <nav className="mx-auto flex h-[58px] w-full max-w-[1200px] items-center justify-between gap-4 px-5 sm:px-6">
        <MarketingBrand subtitle={copy.brandSubtitle} />
        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const selected = active === "pricing" && item.href === "/pricing";

            return (
              <Link
                className="whitespace-nowrap rounded-[10px] px-3 py-2 text-[12px] font-bold transition hover:bg-white/[0.05]"
                href={item.href}
                key={item.href}
                style={{ color: selected ? marketingTone.text : marketingTone.soft }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {language ? (
            <form
              action={setInterfaceLanguageAction}
              aria-label={copy.languageLabel}
              className="hidden h-10 items-center rounded-[10px] border p-1 min-[420px]:flex"
              style={{
                backgroundColor: "rgba(255,255,255,0.035)",
                borderColor: marketingTone.borderStrong,
              }}
            >
              <input name="redirectTo" type="hidden" value={redirectPath} />
              {supportedLanguages.map((option) => {
                const selected = option === language;

                return (
                  <button
                    aria-pressed={selected}
                    className="h-8 rounded-[8px] px-2.5 text-[11px] font-black transition"
                    key={option}
                    name="language"
                    style={{
                      backgroundColor: selected ? marketingTone.emerald : "transparent",
                      color: selected ? "#03130C" : marketingTone.text,
                    }}
                    title={languageNativeLabels[option]}
                    type="submit"
                    value={option}
                  >
                    {languageShortLabels[option]}
                  </button>
                );
              })}
            </form>
          ) : null}
          <Link
            className="hidden h-10 items-center justify-center rounded-[10px] px-3 text-[13px] font-bold transition hover:bg-white/[0.05] lg:inline-flex"
            href="/auth/sign-in"
            style={{ color: marketingTone.soft }}
          >
            {copy.signIn}
          </Link>
          <MarketingButton className="h-10 px-3 text-[12px] sm:px-4 sm:text-[13px]" href="/auth/sign-up">
            <span className="sm:hidden">{copy.startShort}</span>
            <span className="hidden sm:inline">{copy.startFull}</span>
          </MarketingButton>
        </div>
      </nav>
    </header>
  );
}

export function MarketingFooter({
  copy = defaultMarketingNavCopy,
}: Readonly<{ copy?: HomeNavCopy }>) {
  const links: ReadonlyArray<Readonly<{ href: string; label: string }>> = [
    { href: "/#why", label: copy.why },
    { href: "/#recovery-flow", label: copy.flow },
    { href: "/#comparison", label: copy.comparison },
    { href: "/pricing", label: copy.pricing },
    { href: "/pricing#faq", label: copy.faq },
  ];

  return (
    <footer className="border-t px-5 py-7 sm:px-6" style={{ borderColor: marketingTone.border }}>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 text-[12px] md:flex-row md:items-center md:justify-between">
        <MarketingBrand subtitle={copy.brandSubtitle} />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2" style={{ color: marketingTone.soft }}>
          {links.map((link) => (
            <Link className="hover:opacity-80" href={link.href} key={link.href}>
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
