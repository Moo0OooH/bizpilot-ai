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
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Removed unused V2 hero and next-step primitives after the final V3 route migration.
 * - 2026-07-13: Darkened blue badge text in light mode while preserving the dark-theme token for WCAG AA contrast.
 * - 2026-07-13: Allowed shared cards to expose stable section anchors for consolidated V3 routes.
 * - 2026-07-13: Added the V3 navigation-copy adapter contract and made product frames semantic figures.
 * - 2026-07-13: Established V3 shell, button, card, product-scene, skip-link, and simplified footer primitives.
 * - 2026-07-13: Applied the final compact header IA and delayed desktop expansion until the measured 1440px fit point.
 * - 2026-07-12: Routed shared public navigation and CTA hrefs through the locale-preserving helper.
 * - 2026-06-18: Added compact responsive navigation and public container primitives.
 * - 2026-06-19: Mapped public primitives to shared semantic theme tokens and added theme preference controls.
 * - 2026-06-19: Rebuilt public header utilities around compact locale/theme controls and content-fit navigation.
 * - 2026-06-21: Removed duplicated compact header CTA markup so each shell state exposes one primary pilot action.
 * - 2026-06-21: Attached localization-aware copy role classes to shared primitives.
 * - 2026-06-21: Added the dedicated FAQ route to the public footer links.
 * - 2026-06-25: Attached public shell containers to canonical bp responsive primitives.
 * - 2026-06-25: Gave the desktop brand subtitle enough inline budget for fr-CA without truncation.
 * - 2026-06-26: Allowed marketing badges to wrap inside narrow mobile viewports.
 * - 2026-07-04: Added the public comparison route to desktop and compact navigation.
 * - 2026-07-04: Added the quote-link guide to the public footer.
 * - 2026-07-05: Added a reusable next-step panel for public conversion paths.
 * - 2026-07-05: Tokenized neutral badges and next-step labels for launch-ready light/dark consistency.
 * - 2026-07-05: Allowed the desktop brand subtitle to wrap for longer localized copy.
 * - 2026-07-11: Added a research-backed public page hero primitive for bilingual first-fold pitch/proof structure.
 * - 2026-07-11: Added product-board chrome to public page hero visuals for clearer first-fold hierarchy.
 * - 2026-07-13: Grouped public navigation into Product, How it works, Use cases, Pricing, Trust, and Resources.
 * ============================================================
 */

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { MarketingCompactMenu } from "@/components/public/marketing-compact-menu";
import { MarketingLanguageMenu } from "@/components/public/marketing-language-menu";
import { ThemePreferenceControl } from "@/components/ui/theme-preference-control";
import type { SupportedLanguage } from "@/lib/i18n/language";
import { publicHref } from "@/lib/i18n/public-href";

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

export type MarketingNavCopy = Readonly<{
  brandSubtitle: string;
  copyright: string;
  demo: string;
  faq: string;
  features: string;
  flow: string;
  languageLabel: string;
  pilot: string;
  pricing: string;
  privacy: string;
  resources: string;
  security: string;
  signIn: string;
  startShort: string;
  terms: string;
  trust: string;
}>;

const defaultMarketingNavCopy: MarketingNavCopy = {
  brandSubtitle: "Smart customer intake and reply workspace",
  copyright: "Copyright 2026 BizPilot AI. All rights reserved.",
  demo: "Demo",
  faq: "FAQ",
  features: "Product",
  flow: "How it works",
  languageLabel: "Website language",
  pilot: "Pilot",
  pricing: "Pricing",
  privacy: "Privacy",
  resources: "Resources",
  security: "Security",
  signIn: "Sign in",
  startShort: "Apply for pilot",
  terms: "Terms",
  trust: "Trust",
};

type MarketingNavKey =
  | "cleaning"
  | "comparison"
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
  | "camera"
  | "globe"
  | "inbox"
  | "link"
  | "lock"
  | "message"
  | "minus"
  | "pen"
  | "phone"
  | "radar"
  | "search"
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
    camera: (
      <>
        <path d="M5 7h3l1.5-2h5L16 7h3v12H5z" />
        <circle cx="12" cy="13" r="3.25" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
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
    phone: (
      <>
        <path d="M7 4h10v16H7z" />
        <path d="M11 17h2" />
      </>
    ),
    radar: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 12 18 6" />
        <path d="M7.5 16.5a6.4 6.4 0 0 1 0-9" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 4 4" />
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
    <div className={`v3-container ${className}`}>
      {children}
    </div>
  );
}

export function MarketingCard({
  children,
  className = "",
  id,
  style,
}: Readonly<{
  children: ReactNode;
  className?: string | undefined;
  id?: string;
  style?: CSSProperties | undefined;
}>) {
  return (
    <div
      className={`v3-card ${className}`}
      id={id}
      style={style}
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
      color: "var(--primary-hover)",
    },
    gold: {
      bg: "color-mix(in srgb, var(--warning) 12%, transparent)",
      border: "color-mix(in srgb, var(--warning) 30%, transparent)",
      color: marketingTone.gold,
    },
    neutral: {
      bg: "var(--surface-interactive)",
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
      className="bp-copy-eyebrow inline-flex min-w-0 max-w-full flex-wrap items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-black uppercase leading-tight"
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
      <span className="min-w-0 max-w-full whitespace-normal">
        {children}
      </span>
    </span>
  );
}

export function MarketingButton({
  children,
  className = "",
  href,
  language,
  variant = "primary",
}: Readonly<{
  children: ReactNode;
  className?: string;
  href: string;
  language?: SupportedLanguage | undefined;
  variant?: ButtonVariant;
}>) {
  const localizedHref = publicHref(href, language);
  const base = "bp-copy-button v3-button";

  if (variant === "primary") {
    return (
      <Link
        className={`${base} v3-button-primary ${className}`}
        href={localizedHref}
      >
        {children}
      </Link>
    );
  }

  if (variant === "secondary") {
    return (
      <Link
        className={`${base} v3-button-secondary ${className}`}
        href={localizedHref}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      className={`${base} v3-button-ghost ${className}`}
      href={localizedHref}
    >
      {children}
    </Link>
  );
}

export function MarketingBrand({
  language,
  subtitle = defaultMarketingNavCopy.brandSubtitle,
}: Readonly<{ language?: SupportedLanguage | undefined; subtitle?: string }>) {
  return (
    <Link className="inline-flex min-h-11 min-w-0 items-center gap-3" href={publicHref("/", language)}>
      <span
        aria-hidden
        className="v3-brand-mark text-[17px] font-black"
      >
        B
      </span>
      <span className="hidden min-w-0 leading-tight min-[340px]:block">
        <span className="block text-[17px] font-black tracking-[-0.02em]" style={{ color: marketingTone.text }}>
          BizPilot AI
        </span>
        <span
          className="bp-copy-nav hidden max-w-[15rem] whitespace-normal break-words text-[13px] font-bold uppercase leading-[1.3] min-[1440px]:block"
          style={{ color: marketingTone.muted, maxWidth: "14rem", whiteSpace: "normal" }}
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
  copy?: MarketingNavCopy;
  language?: SupportedLanguage | undefined;
  redirectPath?: string;
}>) {
  type HeaderLink = Readonly<{
    href: string;
    key?: MarketingNavKey;
    label: string;
  }>;
  type HeaderGroup = Readonly<{ items: readonly HeaderLink[]; label: string }>;

  const directItems: readonly HeaderLink[] = [
    { href: "/features", key: "features", label: copy.features },
    { href: "/#how-it-works", label: copy.flow },
    { href: "/demo", key: "demo", label: copy.demo },
    { href: "/pricing", key: "pricing", label: copy.pricing },
  ];
  const navGroups: readonly HeaderGroup[] = [
    {
      items: [
        { href: "/faq", label: copy.faq },
        { href: "/trust", key: "trust", label: copy.trust },
      ],
      label: copy.resources,
    },
  ];

  const currentPath = redirectPath.split(/[?#]/)[0] || "/";
  const isActiveItem = (item: HeaderLink) =>
    (item.key ? active === item.key : false) || currentPath === item.href.split("#")[0];
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
    <header className="v3-site-header sticky top-0 z-40 border-b">
      <a className="v3-skip-link" href="#main-content">
        {language === "fr-CA" ? "Aller au contenu" : "Skip to content"}
      </a>
      <nav
        aria-label={language === "fr-CA" ? "Navigation principale" : "Primary navigation"}
        className="v3-container v3-site-header-inner flex items-center justify-between gap-3 py-2"
      >
        <MarketingBrand language={language} subtitle={copy.brandSubtitle} />
        <div className="hidden items-center gap-1 min-[1180px]:flex">
          {directItems.map((item) => {
            const selected = isActiveItem(item);

            return (
              <Link
                aria-current={selected ? "page" : undefined}
                className="bp-copy-nav inline-flex min-h-12 items-center rounded-[12px] px-3 py-2 text-[14px] font-bold transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
                href={publicHref(item.href, language)}
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
          {navGroups.map((group) => {
            const selected = group.items.some(isActiveItem);

            return (
              <details className="group relative" key={group.label}>
                <summary
                  className="bp-copy-nav inline-flex min-h-12 cursor-pointer list-none items-center gap-1 rounded-[12px] px-3 py-2 text-[14px] font-bold transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
                  style={{
                    backgroundColor: selected ? "var(--surface-interactive)" : "transparent",
                    color: selected ? marketingTone.text : marketingTone.soft,
                  }}
                >
                  {group.label}
                  <span aria-hidden className="text-[12px]">▾</span>
                </summary>
                <div
                  className="absolute left-0 top-full z-50 mt-2 grid min-w-[16rem] gap-1 rounded-[16px] border p-2 shadow-xl"
                  style={{ backgroundColor: "var(--surface)", borderColor: marketingTone.borderStrong }}
                >
                  {group.items.map((item) => (
                    <Link
                      aria-current={isActiveItem(item) ? "page" : undefined}
                      className="bp-copy-nav min-h-12 rounded-[10px] px-3 py-3 text-[14px] font-bold hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
                      href={publicHref(item.href, language)}
                      key={`${group.label}-${item.label}`}
                      style={{ color: marketingTone.text }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
        <div className="hidden shrink-0 items-center gap-2 min-[1180px]:flex">
          {renderLanguageMenu()}
          <ThemePreferenceControl language={language ?? "en"} />
          <Link
            className="bp-copy-nav inline-flex min-h-12 items-center justify-center rounded-[12px] px-3 text-[14px] font-bold transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
            href={publicHref("/auth/sign-in", language)}
            style={{ color: marketingTone.soft }}
          >
            {copy.signIn}
          </Link>
          <MarketingButton className="min-h-12 px-4 text-[14px]" href="/pilot" language={language}>
            {copy.startShort}
          </MarketingButton>
        </div>
        <div className="flex shrink-0 items-center gap-2 min-[1180px]:hidden">
          <MarketingCompactMenu language={language}>
            <div className="grid gap-1">
              {directItems.map((item) => {
                const selected = isActiveItem(item);

                return (
                  <Link
                    aria-current={selected ? "page" : undefined}
                    className="bp-copy-nav min-h-11 rounded-[12px] px-3 py-3 text-[14px] font-black transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
                    href={publicHref(item.href, language)}
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
              {navGroups.map((group) => (
                <div className="mt-2 grid gap-1 border-t pt-3" key={group.label} style={{ borderColor: marketingTone.border }}>
                  <p className="px-3 text-[13px] font-black uppercase tracking-[0.1em]" style={{ color: marketingTone.muted }}>
                    {group.label}
                  </p>
                  {group.items.map((item) => (
                    <Link
                      aria-current={isActiveItem(item) ? "page" : undefined}
                      className="bp-copy-nav min-h-11 rounded-[12px] px-3 py-3 text-[14px] font-black transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
                      href={publicHref(item.href, language)}
                      key={`${group.label}-${item.label}`}
                      style={{ color: marketingTone.text }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            <div className="grid gap-3 border-t pt-3" style={{ borderColor: marketingTone.border }}>
              {renderLanguageMenu(true)}
              <ThemePreferenceControl className="w-full justify-center" language={language ?? "en"} />
              <Link
                className="bp-copy-nav inline-flex min-h-12 items-center justify-center rounded-[12px] border px-4 text-[14px] font-bold transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
                href={publicHref("/auth/sign-in", language)}
                style={{ borderColor: marketingTone.borderStrong, color: marketingTone.soft }}
              >
                {copy.signIn}
              </Link>
              <MarketingButton className="w-full" href="/pilot" language={language}>
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
  language,
}: Readonly<{ copy?: MarketingNavCopy; language?: SupportedLanguage | undefined }>) {
  const footerLabels = language === "fr-CA"
    ? {
        account: "Compte",
        legal: "Confiance et aspects légaux",
        product: "Produit",
        resources: "Ressources",
      }
    : {
        account: "Account",
        legal: "Trust and legal",
        product: "Product",
        resources: "Resources",
      };
  const groups: ReadonlyArray<Readonly<{ label: string; links: ReadonlyArray<Readonly<{ href: string; label: string }>> }>> = [
    { label: footerLabels.product, links: [
      { href: "/features", label: copy.features },
      { href: "/#how-it-works", label: copy.flow },
      { href: "/demo", label: copy.demo },
      { href: "/pricing", label: copy.pricing },
    ] },
    { label: footerLabels.resources, links: [
      { href: "/pilot", label: copy.pilot },
      { href: "/faq", label: copy.faq },
      { href: "/trust", label: copy.trust },
    ] },
    { label: footerLabels.legal, links: [
      { href: "/privacy", label: copy.privacy },
      { href: "/security", label: copy.security },
      { href: "/terms", label: copy.terms },
    ] },
    { label: footerLabels.account, links: [
      { href: "/auth/sign-in", label: copy.signIn },
    ] },
  ];

  return (
    <footer className="v3-site-footer border-t py-12">
      <div className="v3-container grid gap-10 text-[14px] leading-relaxed lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
        <MarketingBrand language={language} subtitle={copy.brandSubtitle} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" style={{ color: marketingTone.soft }}>
          {groups.map((group) => (
            <div className="grid content-start gap-1" key={group.label}>
              <p className="mb-1 font-black uppercase tracking-[0.12em]" style={{ color: marketingTone.text }}>{group.label}</p>
              {group.links.map((link) => (
                <Link className="inline-flex min-h-11 items-center rounded-[8px] py-1 hover:opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]" href={publicHref(link.href, language)} key={`${group.label}-${link.label}`}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <span className="font-medium lg:col-span-2" style={{ color: marketingTone.soft }}>
          {copy.copyright}
        </span>
      </div>
    </footer>
  );
}

export function MarketingProductFrame({
  children,
  className = "",
  label,
}: Readonly<{ children: ReactNode; className?: string | undefined; label: string }>) {
  return (
    <figure aria-label={label} className={`v3-product-frame ${className}`}>
      {children}
    </figure>
  );
}

export function MarketingProductStage({
  children,
  className = "",
}: Readonly<{ children: ReactNode; className?: string | undefined }>) {
  return <div className={`v3-product-stage ${className}`}>{children}</div>;
}

export function MarketingStateChip({
  children,
  className = "",
}: Readonly<{ children: ReactNode; className?: string }>) {
  return <span className={`v3-state-chip ${className}`}>{children}</span>;
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
        <p className="text-[13px] font-black uppercase" style={{ color: marketingTone.teal }}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-[32px] font-black leading-[1.12] sm:text-[40px]" style={{ color: marketingTone.text }}>
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 max-w-[66ch] text-[17px] leading-7" style={{ color: marketingTone.soft }}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}
