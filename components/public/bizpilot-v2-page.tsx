/*
 * ============================================================
 * File: components/public/bizpilot-v2-page.tsx
 * Project: BizPilot AI
 * Description: Shared renderer for the universal public-site V2 pages.
 * Role: Keeps product positioning, responsive structure, localization, roadmap boundaries, and route-aware conversion paths consistent.
 * Related:
 * - lib/i18n/public-v2-copy.ts
 * - components/public/marketing-ui.tsx
 * - app/features/page.tsx
 * Author: MoOoH
 * Created: 2026-07-13
 * Last Updated: 2026-07-13
 * ============================================================
 */

import type { CSSProperties, ReactNode } from "react";

import { JsonLdScript } from "@/components/public/json-ld";
import {
  MarketingBadge,
  MarketingButton,
  MarketingCard,
  MarketingFooter,
  MarketingHeader,
  MarketingIcon,
  MarketingPageHero,
  MarketingShell,
  marketingBackground,
  marketingTone,
  type MarketingIconName,
} from "@/components/public/marketing-ui";
import type { SupportedLanguage } from "@/lib/i18n/language";
import type {
  PublicV2Card,
  PublicV2FaqItem,
  PublicV2PageCopy,
} from "@/lib/i18n/public-v2-copy";
import { getPublicV2NavCopy } from "@/lib/i18n/public-v2-copy";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
} from "@/lib/public-structured-data";
import type { PublicCanonicalRoute } from "@/lib/seo";

const sectionIcons: readonly MarketingIconName[] = [
  "link",
  "search",
  "briefcase",
  "spark",
  "shield",
  "target",
];

const cardIcons: readonly MarketingIconName[] = [
  "link",
  "inbox",
  "search",
  "spark",
  "check",
  "target",
];

type RouteLinks = Readonly<{
  finalPrimary: string;
  finalSecondary: string;
  heroPrimary: string;
  heroSecondary: string;
}>;

function linksForRoute(path: PublicCanonicalRoute): RouteLinks {
  switch (path) {
    case "/features":
      return {
        finalPrimary: "/demo",
        finalSecondary: "/comparison",
        heroPrimary: "/demo",
        heroSecondary: "/trust",
      };
    case "/demo":
      return {
        finalPrimary: "/pilot",
        finalSecondary: "/pricing",
        heroPrimary: "/pilot",
        heroSecondary: "/features",
      };
    case "/pricing":
      return {
        finalPrimary: "/pilot",
        finalSecondary: "/faq",
        heroPrimary: "/pilot",
        heroSecondary: "/trust",
      };
    case "/trust":
      return {
        finalPrimary: "/demo",
        finalSecondary: "/faq",
        heroPrimary: "/demo",
        heroSecondary: "/privacy",
      };
    case "/comparison":
      return {
        finalPrimary: "/demo",
        finalSecondary: "/pilot",
        heroPrimary: "/demo",
        heroSecondary: "/features",
      };
    case "/industries/cleaning":
      return {
        finalPrimary: "/pilot",
        finalSecondary: "/pricing",
        heroPrimary: "/demo",
        heroSecondary: "/pilot",
      };
    case "/faq":
      return {
        finalPrimary: "/demo",
        finalSecondary: "/trust",
        heroPrimary: "/demo",
        heroSecondary: "/pilot",
      };
    default:
      return {
        finalPrimary: "/demo",
        finalSecondary: "/pilot",
        heroPrimary: "/demo",
        heroSecondary: "/trust",
      };
  }
}

function cardToneStyle(tone: PublicV2Card["tone"]): CSSProperties | undefined {
  if (tone === "gold") {
    return {
      background:
        "linear-gradient(145deg, color-mix(in srgb, var(--warning) 10%, var(--surface)) 0%, var(--surface) 64%)",
      borderColor:
        "color-mix(in srgb, var(--warning) 30%, var(--border-default))",
    };
  }

  if (tone === "red") {
    return {
      background:
        "linear-gradient(145deg, color-mix(in srgb, var(--danger) 8%, var(--surface)) 0%, var(--surface) 64%)",
      borderColor:
        "color-mix(in srgb, var(--danger) 26%, var(--border-default))",
    };
  }

  if (tone === "blue") {
    return {
      background:
        "linear-gradient(145deg, color-mix(in srgb, var(--primary) 9%, var(--surface)) 0%, var(--surface) 64%)",
      borderColor:
        "color-mix(in srgb, var(--primary) 26%, var(--border-default))",
    };
  }

  if (tone === "teal") {
    return {
      background:
        "linear-gradient(145deg, color-mix(in srgb, var(--accent) 10%, var(--surface)) 0%, var(--surface) 64%)",
      borderColor:
        "color-mix(in srgb, var(--accent) 28%, var(--border-default))",
    };
  }

  return undefined;
}

function PageCard({ card, index }: Readonly<{ card: PublicV2Card; index: number }>) {
  return (
    <MarketingCard
      className="bp-card-structured flex min-w-0 flex-col p-5 sm:p-6"
      style={cardToneStyle(card.tone)}
    >
      <div className="flex min-w-0 items-start justify-between gap-4">
        <span
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--accent) 12%, var(--surface))",
            color: marketingTone.teal,
          }}
        >
          <MarketingIcon name={cardIcons[index % cardIcons.length] ?? "check"} />
        </span>
        {card.badge ? (
          <MarketingBadge toneName={card.tone ?? "neutral"}>
            {card.badge}
          </MarketingBadge>
        ) : null}
      </div>
      <h3
        className="bp-card-title bp-copy-card-title mt-5 font-black leading-tight"
        style={{ color: marketingTone.text }}
      >
        {card.title}
      </h3>
      {card.price ? (
        <p
          className="mt-3 text-[13px] font-black uppercase tracking-[0.08em]"
          style={{ color: marketingTone.teal }}
        >
          {card.price}
        </p>
      ) : null}
      <p
        className="bp-copy-card-body mt-3 text-[15px] leading-7"
        style={{ color: marketingTone.soft }}
      >
        {card.body}
      </p>
      {card.points?.length ? (
        <ul className="mt-5 grid gap-3" aria-label={card.title}>
          {card.points.map((point) => (
            <li className="flex min-w-0 items-start gap-3" key={point}>
              <span
                className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--success) 12%, var(--surface))",
                  color: marketingTone.emerald,
                }}
              >
                <MarketingIcon name="check" />
              </span>
              <span
                className="min-w-0 text-[14px] font-bold leading-6"
                style={{ color: marketingTone.soft }}
              >
                {point}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {card.cta ? (
        <div className="mt-auto pt-6">
          <span
            className="inline-flex min-h-11 items-center gap-2 rounded-[12px] border px-4 text-[13px] font-black"
            style={{
              backgroundColor: "var(--surface-interactive)",
              borderColor: marketingTone.borderStrong,
              color: marketingTone.text,
            }}
          >
            {card.cta}
            <MarketingIcon name="arrow" />
          </span>
        </div>
      ) : null}
    </MarketingCard>
  );
}

function SectionHeading({
  body,
  eyebrow,
  index,
  title,
}: Readonly<{
  body?: string | undefined;
  eyebrow?: string | undefined;
  index: number;
  title: ReactNode;
}>) {
  return (
    <div className="max-w-[800px]">
      <div className="flex items-center gap-3">
        <span
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--primary) 11%, var(--surface))",
            color: marketingTone.blue,
          }}
        >
          <MarketingIcon
            name={sectionIcons[index % sectionIcons.length] ?? "check"}
          />
        </span>
        {eyebrow ? (
          <p
            className="bp-copy-eyebrow text-[12px] font-black uppercase tracking-[0.14em]"
            style={{ color: marketingTone.teal }}
          >
            {eyebrow}
          </p>
        ) : null}
      </div>
      <h2
        className="bp-section-title bp-copy-section-title mt-4 font-black leading-tight"
        style={{ color: marketingTone.text }}
      >
        {title}
      </h2>
      {body ? (
        <p
          className="bp-body bp-copy-card-body mt-4 max-w-[760px] leading-8"
          style={{ color: marketingTone.soft }}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

export function BizPilotV2Page({
  copy,
  faqItems,
  language,
  path,
}: Readonly<{
  copy: PublicV2PageCopy;
  faqItems?: readonly PublicV2FaqItem[];
  language: SupportedLanguage;
  path: PublicCanonicalRoute;
}>) {
  const navCopy = getPublicV2NavCopy(language);
  const links = linksForRoute(path);
  const breadcrumb = buildBreadcrumbJsonLd(
    [
      { name: "BizPilot AI", path: "/" },
      { name: copy.title, path },
    ],
    language,
  );

  return (
    <main
      className="bp-page public-site min-h-svh"
      style={{ background: marketingBackground, color: marketingTone.text }}
    >
      <JsonLdScript
        data={breadcrumb}
        id={`bizpilot-v2-${path.replaceAll("/", "-") || "home"}-breadcrumb`}
      />
      {faqItems?.length ? (
        <JsonLdScript
          data={buildFaqPageJsonLd(faqItems, language)}
          id="bizpilot-v2-faq-jsonld"
        />
      ) : null}
      <MarketingHeader copy={navCopy} language={language} redirectPath={path} />

      <section className="bp-section-tight">
        <MarketingShell>
          <MarketingPageHero
            actions={[
              {
                href: links.heroPrimary,
                label: (
                  <>
                    {copy.primaryCta}
                    <MarketingIcon name="arrow" />
                  </>
                ),
              },
              {
                href: links.heroSecondary,
                label: copy.secondaryCta,
                variant: "secondary",
              },
            ]}
            badge={copy.badge}
            body={copy.body}
            language={language}
            signals={copy.signals.map((signal, index) => ({
              icon: sectionIcons[index % sectionIcons.length] ?? "check",
              label: signal.label,
              toneName:
                index === 1 ? "blue" : index === 2 ? "gold" : "teal",
              value: signal.value,
            }))}
            title={copy.title}
            visual={{
              body: copy.signals.map((signal) => signal.value).join(" · "),
              eyebrow: copy.badge,
              items: copy.signals.map((signal, index) => ({
                icon: cardIcons[index % cardIcons.length] ?? "check",
                label: signal.label,
                value: signal.value,
              })),
              title: copy.signals[0]?.value ?? copy.title,
            }}
          />
        </MarketingShell>
      </section>

      {copy.sections.map((section, sectionIndex) => (
        <section
          className={sectionIndex % 2 === 0 ? "bp-section" : "bp-section-tight"}
          key={`${section.eyebrow ?? section.title}-${sectionIndex}`}
          style={
            sectionIndex % 2 === 0
              ? {
                  background:
                    "linear-gradient(180deg, color-mix(in srgb, var(--canvas-subtle) 82%, transparent), transparent)",
                  borderBlock:
                    "1px solid color-mix(in srgb, var(--border-default) 76%, transparent)",
                }
              : undefined
          }
        >
          <MarketingShell>
            <SectionHeading
              body={section.body}
              eyebrow={section.eyebrow}
              index={sectionIndex}
              title={section.title}
            />
            <div
              className={`mt-8 grid min-w-0 gap-4 sm:gap-5 ${
                section.cards.length === 1
                  ? "max-w-[760px]"
                  : section.cards.length === 2
                    ? "bp-grid-two"
                    : "bp-grid-three"
              }`}
            >
              {section.cards.map((card, cardIndex) => (
                <PageCard
                  card={card}
                  index={cardIndex}
                  key={`${card.title}-${cardIndex}`}
                />
              ))}
            </div>
          </MarketingShell>
        </section>
      ))}

      {copy.notice ? (
        <section className="bp-section-tight">
          <MarketingShell>
            <MarketingCard
              className="p-6 sm:p-8"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--warning) 10%, var(--surface)) 0%, var(--surface) 72%)",
                borderColor:
                  "color-mix(in srgb, var(--warning) 32%, var(--border-default))",
              }}
            >
              <div className="grid gap-5 md:grid-cols-[auto_minmax(0,1fr)] md:items-start">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-[14px]"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--warning) 15%, var(--surface))",
                    color: marketingTone.gold,
                  }}
                >
                  <MarketingIcon name="warning" />
                </span>
                <div className="min-w-0">
                  <MarketingBadge toneName="gold">
                    {copy.notice.badge}
                  </MarketingBadge>
                  <h2
                    className="bp-card-title bp-copy-section-title mt-4 font-black leading-tight"
                    style={{ color: marketingTone.text }}
                  >
                    {copy.notice.title}
                  </h2>
                  <p
                    className="bp-copy-card-body mt-3 max-w-[900px] text-[15px] leading-8"
                    style={{ color: marketingTone.soft }}
                  >
                    {copy.notice.body}
                  </p>
                </div>
              </div>
            </MarketingCard>
          </MarketingShell>
        </section>
      ) : null}

      <section className="bp-section">
        <MarketingShell>
          <MarketingCard
            className="relative p-6 sm:p-9"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--primary) 13%, var(--surface)) 0%, color-mix(in srgb, var(--accent) 8%, var(--surface)) 58%, var(--surface) 100%)",
              borderColor:
                "color-mix(in srgb, var(--primary) 28%, var(--border-default))",
            }}
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="min-w-0">
                <p
                  className="bp-copy-eyebrow text-[12px] font-black uppercase tracking-[0.14em]"
                  style={{ color: marketingTone.teal }}
                >
                  BizPilot AI
                </p>
                <h2
                  className="bp-section-title bp-copy-section-title mt-3 max-w-[800px] font-black leading-tight"
                  style={{ color: marketingTone.text }}
                >
                  {copy.finalCta.title}
                </h2>
                <p
                  className="bp-copy-card-body mt-4 max-w-[760px] text-[16px] leading-8"
                  style={{ color: marketingTone.soft }}
                >
                  {copy.finalCta.body}
                </p>
              </div>
              <div className="bp-button-row flex flex-col gap-3 sm:flex-row lg:flex-col">
                <MarketingButton href={links.finalPrimary} language={language}>
                  {copy.finalCta.primary}
                  <MarketingIcon name="arrow" />
                </MarketingButton>
                <MarketingButton
                  href={links.finalSecondary}
                  language={language}
                  variant="secondary"
                >
                  {copy.finalCta.secondary}
                </MarketingButton>
              </div>
            </div>
          </MarketingCard>
        </MarketingShell>
      </section>

      <MarketingFooter copy={navCopy} language={language} />
    </main>
  );
}
