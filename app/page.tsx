/**
 * ============================================================
 * File: app/page.tsx
 * Project: BizPilot AI
 * Description: Renders the public BizPilot AI landing page.
 * Role: Communicates the quote recovery offer for cleaning businesses.
 * Related:
 * - app/layout.tsx
 * - app/globals.css
 * - docs/CURRENT_CANONICAL_DOCS_v1.7.md
 * - docs/BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md
 * Author: MoOoH
 * Last Updated: 2026-05-18
 * Change Log:
 * - 2026-05-17: Rebuilt the homepage as a compact premium quote-recovery landing page.
 * - 2026-05-18: Connected the landing shell to shared BizPilot design tokens without changing scale.
 * ============================================================
 */

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { bizTheme } from "@/lib/design-tokens";

type IconName =
  | "arrow"
  | "bolt"
  | "calendar"
  | "chart"
  | "chat"
  | "check"
  | "clock"
  | "dollar"
  | "facebook"
  | "inbox"
  | "mail"
  | "play"
  | "shield"
  | "spark"
  | "warning";

const navItems = [
  ["Features", "#features"],
  ["How It Works", "#how-it-works"],
  ["Pricing", "#pricing"],
  ["Resources", "#proof"],
] as const;

const trustItems = ["Setup in 5 minutes", "No credit card", "Cancel anytime"] as const;

const heroMetrics = [
  { icon: "bolt", label: "Avg. first reply time", sub: "10x faster than manual", value: "43s" },
  { icon: "chart", label: "More jobs booked", sub: "With faster responses", value: "2.8x" },
  { icon: "dollar", label: "Recovered per month", sub: "From missed leads", value: "$2.8k" },
  { icon: "shield", label: "Replies within 5 minutes", sub: "Owner reviewed", value: "98%" },
] satisfies ReadonlyArray<{
  icon: IconName;
  label: string;
  sub: string;
  value: string;
}>;

const workflowCards = [
  {
    detail: "Sarah from Facebook",
    icon: "facebook",
    meta: "Just now",
    status: "New lead received",
    tone: "blue",
  },
  {
    detail: "3 bed / move-out / Friday morning",
    icon: "spark",
    meta: "Just now",
    status: "Details extracted",
    tone: "neutral",
  },
  {
    detail: "Asks for access notes and timing",
    icon: "mail",
    meta: "00:23",
    status: "Reply ready to review",
    tone: "green",
  },
  {
    detail: "Nudge if Sarah does not answer",
    icon: "chat",
    meta: "2:00:00",
    status: "Follow-up scheduled",
    tone: "green",
  },
  {
    detail: "$320 - Move-out cleaning",
    icon: "check",
    meta: "Today",
    status: "Job booked",
    tone: "green",
  },
] as const;

const problemCards = [
  {
    detail:
      "Most leads go cold in minutes. If you do not reply fast, they book with someone else.",
    icon: "clock",
    metric: "Avg. response time: 2+ hours",
    title: "Too slow to reply",
    tone: "red",
  },
  {
    detail:
      "Busy days equal forgotten follow-ups. No reply means lost jobs and lost revenue.",
    icon: "mail",
    metric: "40% of leads need a follow-up",
    title: "Missed follow-ups",
    tone: "amber",
  },
  {
    detail:
      "Texts, DMs, emails, and calls are scattered across platforms. Nothing in one place.",
    icon: "inbox",
    metric: "Leads slip through the cracks",
    title: "Messages everywhere",
    tone: "green",
  },
] satisfies ReadonlyArray<{
  detail: string;
  icon: IconName;
  metric: string;
  title: string;
  tone: "amber" | "green" | "red";
}>;

const beforeItems = [
  "Leads buried in DMs and texts",
  "Slow or no replies",
  "Follow-ups forgotten",
  "Leads go cold",
  "Jobs lost to competitors",
] as const;

const afterItems = [
  "All leads in one inbox",
  "AI drafts replies instantly",
  "Smart follow-ups",
  "More replies, more bookings",
  "More revenue every month",
] as const;

const processSteps = [
  ["Capture", "Leads from texts, DMs, Facebook, web, and email in one inbox.", "chat"],
  ["Extract", "AI extracts key details like service, location, and timing.", "spark"],
  ["Draft", "AI writes a personalized reply or quote in seconds.", "mail"],
  ["Follow-up", "Smart follow-ups if no reply. You stay top of mind.", "clock"],
  ["Booked", "More replies turn into booked jobs and happy customers.", "check"],
] satisfies ReadonlyArray<[string, string, IconName]>;

const proofCards = [
  ["$3,200+", "Recovered in missed leads last month", "Sparkle Clean Co."],
  ["14", "Extra jobs booked in 2 weeks", "CleanHaus"],
  ["★★★★★", "\"BizPilot is like having a full-time assistant that never sleeps.\"", "Jasmine P."],
  ["43s", "Average first reply time with BizPilot", "Bright & Tidy"],
  ["98%", "Leads responded within 5 minutes", "PureClean Pro"],
] as const;

const pricingPlans = [
  {
    cta: "Start free trial",
    features: ["1 user", "4 channels", "AI reply drafts", "Smart follow-ups", "Basic reporting"],
    name: "Starter",
    note: "Perfect for solo cleaners",
    price: "$29",
    spotlight: false,
  },
  {
    cta: "Start free trial",
    features: ["Up to 5 users", "AI Starter features", "Advanced reporting", "Team inbox", "Priority support"],
    name: "Pro",
    note: "For growing teams",
    price: "$79",
    spotlight: true,
  },
] as const;

function IconGlyph({ name }: Readonly<{ name: IconName }>) {
  return (
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
      {name === "arrow" ? (
        <>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </>
      ) : null}
      {name === "bolt" ? <path d="m13 2-9 12h7l-1 8 10-13h-7z" /> : null}
      {name === "calendar" ? (
        <>
          <path d="M7 3v4" />
          <path d="M17 3v4" />
          <path d="M4 8h16" />
          <path d="M5 5h14v15H5z" />
        </>
      ) : null}
      {name === "chart" ? (
        <>
          <path d="M4 18 10 12l4 4 6-8" />
          <path d="M15 8h5v5" />
        </>
      ) : null}
      {name === "chat" ? (
        <>
          <path d="M5 6.5h14v9H9l-4 3.5z" />
          <path d="M8.5 10h7" />
          <path d="M8.5 13h4.5" />
        </>
      ) : null}
      {name === "check" ? (
        <>
          <path d="m5 12 4 4L19 6" />
          <circle cx="12" cy="12" r="9" />
        </>
      ) : null}
      {name === "clock" ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      ) : null}
      {name === "dollar" ? (
        <>
          <path d="M12 3v18" />
          <path d="M17 7.5c-1-1.2-2.6-1.8-4.7-1.4-2 .4-3 1.5-3 3 0 1.8 1.5 2.5 4.1 3.1 2.4.6 3.7 1.3 3.7 3.1 0 1.7-1.4 3-4 3-2 0-3.7-.6-5-1.8" />
        </>
      ) : null}
      {name === "facebook" ? (
        <>
          <path d="M14 8h2V4h-3c-2.2 0-4 1.8-4 4v3H7v4h2v5h4v-5h3l1-4h-4V8c0-.6.4-1 1-1z" />
        </>
      ) : null}
      {name === "inbox" ? (
        <>
          <path d="M4 5h16v14H4z" />
          <path d="m4 13 4 4h8l4-4" />
          <path d="M8 9h8" />
        </>
      ) : null}
      {name === "mail" ? (
        <>
          <path d="M4 6h16v12H4z" />
          <path d="m4 8 8 6 8-6" />
        </>
      ) : null}
      {name === "play" ? <path d="m9 7 8 5-8 5z" /> : null}
      {name === "shield" ? (
        <>
          <path d="M12 3 20 6v5c0 5-3.3 8.4-8 10-4.7-1.6-8-5-8-10V6z" />
          <path d="m8.5 12 2.3 2.3L15.8 9" />
        </>
      ) : null}
      {name === "spark" ? (
        <>
          <path d="M12 3 9.8 9.8 3 12l6.8 2.2L12 21l2.2-6.8L21 12l-6.8-2.2z" />
          <path d="M18 3v4" />
          <path d="M16 5h4" />
        </>
      ) : null}
      {name === "warning" ? (
        <>
          <path d="M12 3 22 20H2z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </>
      ) : null}
    </svg>
  );
}

function Container({
  children,
  className = "",
}: Readonly<{ children: ReactNode; className?: string }>) {
  return <div className={`mx-auto w-full max-w-[765px] px-5 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

function PrimaryCta({
  children,
  href = "/auth/sign-up",
}: Readonly<{ children: ReactNode; href?: string }>) {
  return (
    <Link
      className="group inline-flex h-9 items-center justify-center whitespace-nowrap rounded-[10px] bg-[#17D492] px-4 text-[11px] font-bold text-[#03130c] shadow-[0_14px_32px_rgba(23,212,146,0.16)] transition duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-[#21E6A0] hover:shadow-[0_18px_42px_rgba(23,212,146,0.24)] sm:h-10 sm:px-5"
      href={href}
    >
      {children}
      <span className="ml-2 transition group-hover:translate-x-0.5">-&gt;</span>
    </Link>
  );
}

function SecondaryCta({
  children,
  href = "#demo",
}: Readonly<{ children: ReactNode; href?: string }>) {
  return (
    <Link
      className="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border border-white/[0.12] bg-white/[0.035] px-3.5 text-[11px] font-semibold text-[#F5F7FA] transition duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-white/[0.06] sm:h-10 sm:px-4"
      href={href}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/[0.16] text-[#17D492]">
        <IconGlyph name="play" />
      </span>
      {children}
    </Link>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: Readonly<{ eyebrow?: string; subtitle?: string; title: string }>) {
  return (
    <div className="mx-auto max-w-[560px] text-center">
      {eyebrow ? (
        <p className="text-[11px] font-black uppercase text-[#17D492]">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-[28px] font-bold leading-[1.05] text-[#F5F7FA] sm:text-[34px] lg:text-[36px]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-[46ch] text-base leading-7 text-[rgba(245,247,250,0.62)]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function MetricCard({ icon, label, sub, value }: (typeof heroMetrics)[number]) {
  return (
    <article className="group border-white/[0.06] px-4 py-3 transition duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-white/[0.025] sm:border-l first:border-l-0">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#17D492]/18 bg-[#17D492]/10 text-[#17D492] shadow-[0_0_26px_rgba(23,212,146,0.08)]">
          <IconGlyph name={icon} />
        </span>
        <span>
          <span className="block text-[24px] font-black leading-none text-[#F5F7FA]">
            {value}
          </span>
          <span className="mt-1 block text-xs font-medium text-[rgba(245,247,250,0.72)]">
            {label}
          </span>
          <span className="mt-0.5 block text-[11px] text-[rgba(245,247,250,0.46)]">
            {sub}
          </span>
        </span>
      </div>
    </article>
  );
}

function WorkflowPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[390px]" id="demo">
      <div className="absolute -inset-4 rounded-[28px] bg-[radial-gradient(circle_at_70%_18%,rgba(23,212,146,0.12),transparent_17rem)] blur-sm" />
      <div className="relative rounded-[18px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(13,23,33,0.92),rgba(7,16,24,0.74))] p-3.5 shadow-[0_32px_90px_rgba(0,0,0,0.34)]">
        <p className="absolute right-8 top-[-34px] hidden rotate-[-5deg] font-mono text-xs leading-4 text-[#17D492] lg:block">
          From lead to booked
          <br />
          job in minutes
        </p>
        <div className="grid gap-3">
          {workflowCards.map((card, index) => (
            <div className="relative" key={card.status}>
              {index < workflowCards.length - 1 ? (
                <span className="absolute left-4 top-[40px] h-4 border-l border-dashed border-white/[0.18]" />
              ) : null}
              <div
                className={
                  card.status === "Reply ready to review"
                    ? "grid grid-cols-[2.25rem_1fr_auto] items-center gap-2.5 rounded-[12px] border border-[#17D492]/42 bg-[#17D492]/8 p-2.5 shadow-[0_0_34px_rgba(23,212,146,0.12)] transition duration-200 hover:-translate-y-0.5"
                    : "grid grid-cols-[2.25rem_1fr_auto] items-center gap-2.5 rounded-[12px] border border-white/[0.08] bg-[#0D1721]/95 p-2.5 transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.14]"
                }
              >
                <span
                  className={
                    card.tone === "green"
                      ? "flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#17D492] text-[#03130c]"
                      : card.tone === "blue"
                        ? "flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#4169e1] text-white"
                        : "flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/[0.07] text-[rgba(245,247,250,0.72)]"
                  }
                >
                  <IconGlyph name={card.icon} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-bold text-[#F5F7FA]">
                    {card.status}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] leading-4 text-[rgba(245,247,250,0.58)]">
                    {card.detail}
                  </span>
                </span>
                <span className={card.status === "Reply ready to review" ? "text-xs text-[#17D492]" : "text-xs text-[rgba(245,247,250,0.58)]"}>
                  {card.meta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Avatars() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex -space-x-2">
        {["#f3b181", "#c98d67", "#a56c52", "#e5c29f"].map((color, index) => (
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#071018] bg-[linear-gradient(135deg,rgba(255,255,255,0.3),transparent)] text-[8px] font-bold text-[#071018]"
            key={color}
            style={{ backgroundColor: color }}
          >
            {["M", "J", "A", "S"][index]}
          </span>
        ))}
      </div>
      <div>
        <p className="text-xs text-[#FFB84D]">★★★★★</p>
        <p className="text-[11px] leading-4 text-[rgba(245,247,250,0.46)]">
          Trusted by 200+ cleaning businesses
        </p>
      </div>
    </div>
  );
}

function BeforeAfter() {
  return (
    <section className="border-t border-white/[0.04]">
      <Container className="py-14">
        <div className="mb-7 grid gap-3 lg:grid-cols-[0.42fr_1fr] lg:items-end">
          <p className="text-[11px] font-black uppercase text-[#17D492]">The difference</p>
          <h2 className="max-w-[520px] text-[28px] font-bold leading-[1.05] text-[#F5F7FA] sm:text-[34px]">
            From chaos and missed leads to booked jobs on autopilot
          </h2>
        </div>
        <div className="relative grid gap-4 lg:grid-cols-2">
          <article className="overflow-hidden rounded-[16px] border border-white/[0.08] bg-[#0D1721]">
            <div className="grid min-h-[180px] sm:grid-cols-[0.95fr_1fr]">
              <div className="p-5">
                <p className="text-[11px] font-black uppercase text-[#FF5C5C]">
                  Before BizPilot
                </p>
                <ul className="mt-4 grid gap-2 text-xs text-[rgba(245,247,250,0.72)]">
                  {beforeItems.map((item) => (
                    <li className="flex gap-2" key={item}>
                      <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FF5C5C]/12 text-[#FF5C5C]">
                        <IconGlyph name="warning" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative hidden overflow-hidden sm:block">
                <Image
                  alt="Cleaning business owner stressed by scattered quote messages"
                  className="h-full w-full object-cover opacity-45 grayscale"
                  fill
                  loading="lazy"
                  src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=760&q=72"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,#0D1721_0%,rgba(13,23,33,0.28)_55%,rgba(13,23,33,0.78)_100%)]" />
                <span className="absolute right-6 top-10 rounded-lg border border-white/[0.1] bg-black/35 px-3 py-2 text-xs text-[rgba(245,247,250,0.58)]">
                  DM?
                </span>
                <span className="absolute left-8 top-28 rounded-lg border border-white/[0.1] bg-black/35 px-3 py-2 text-xs text-[rgba(245,247,250,0.58)]">
                  Text
                </span>
                <span className="absolute bottom-10 right-10 rounded-lg border border-white/[0.1] bg-black/35 px-3 py-2 text-xs text-[rgba(245,247,250,0.58)]">
                  Email
                </span>
              </div>
            </div>
          </article>
          <div className="absolute left-1/2 top-1/2 z-10 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.1] bg-[#101a24] text-sm font-bold text-[#F5F7FA] shadow-[0_12px_34px_rgba(0,0,0,0.28)] lg:flex">
            VS
          </div>
          <article className="overflow-hidden rounded-[16px] border border-[#17D492]/20 bg-[linear-gradient(135deg,rgba(23,212,146,0.08),rgba(13,23,33,0.92))]">
            <div className="grid min-h-[180px] sm:grid-cols-[0.95fr_1fr]">
              <div className="p-5">
                <p className="text-[11px] font-black uppercase text-[#17D492]">
                  With BizPilot
                </p>
                <ul className="mt-4 grid gap-2 text-xs text-[rgba(245,247,250,0.78)]">
                  {afterItems.map((item) => (
                    <li className="flex gap-2" key={item}>
                      <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#17D492]/14 text-[#17D492]">
                        <IconGlyph name="check" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative hidden overflow-hidden sm:block">
                <Image
                  alt="Cleaning business owner confident after organizing quote requests"
                  className="h-full w-full object-cover opacity-70"
                  fill
                  loading="lazy"
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=760&q=72"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,#0D1721_0%,rgba(13,23,33,0.22)_52%,rgba(23,212,146,0.16)_100%)]" />
                <div className="absolute bottom-7 right-7 rounded-[14px] border border-[#17D492]/26 bg-[#0D1721]/76 p-4 text-center shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
                  <p className="text-2xl font-black text-[#17D492]">+2.8x</p>
                  <p className="text-xs leading-4 text-[rgba(245,247,250,0.72)]">
                    More jobs
                    <br />
                    booked
                  </p>
                </div>
                <svg
                  aria-hidden="true"
                  className="absolute right-28 top-9 h-24 w-24 text-[#17D492]"
                  fill="none"
                  viewBox="0 0 100 100"
                >
                  <path d="M10 78 C30 60 38 62 52 40 S74 18 88 14" stroke="currentColor" strokeWidth="6" />
                  <path d="M70 12h20v20" stroke="currentColor" strokeWidth="6" />
                </svg>
              </div>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}

function RightProofRail() {
  return (
    <aside className="hidden border-l border-white/[0.05] bg-[radial-gradient(circle_at_20%_12%,rgba(23,212,146,0.055),transparent_18rem)] px-7 pb-12 pt-0 lg:block">
      <div className="sticky top-[72px] grid gap-4">
        <div className="rounded-[18px] border border-white/[0.07] bg-[rgba(13,23,33,0.58)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
          <p className="text-[11px] font-black uppercase text-[#17D492]">
            Live recovery feed
          </p>
          <div className="mt-4 grid gap-3">
            {[
              ["+ New quote request", "2m ago", "Deep clean / 2 bed / downtown"],
              ["+ AI reply reviewed", "5m ago", "Owner copied draft to DM"],
              ["+ Follow-up due", "8m ago", "Move-out lead still warm"],
              ["+ Job booked", "12m ago", "$320 move-out cleaning"],
            ].map(([title, time, detail]) => (
              <div
                className="rounded-[12px] border border-white/[0.07] bg-white/[0.025] p-3"
                key={title}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-[#F5F7FA]">{title}</p>
                  <p className="text-[11px] text-[rgba(245,247,250,0.46)]">{time}</p>
                </div>
                <p className="mt-1 text-[11px] leading-4 text-[rgba(245,247,250,0.58)]">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[18px] border border-[#17D492]/16 bg-[#17D492]/7 p-4">
          <p className="text-[11px] font-black uppercase text-[#17D492]">
            Today
          </p>
          <p className="mt-2 text-3xl font-black text-[#F5F7FA]">6</p>
          <p className="mt-1 text-xs leading-5 text-[rgba(245,247,250,0.68)]">
            quote requests waiting for fast owner review.
          </p>
        </div>

        <div className="rounded-[18px] border border-white/[0.08] bg-[rgba(13,23,33,0.58)] p-4">
          <p className="text-[11px] font-black uppercase text-[rgba(245,247,250,0.46)]">
            Outcome
          </p>
          <p className="mt-2 text-lg font-black text-[#17D492]">
            Reply before competitors do.
          </p>
          <p className="mt-2 text-xs leading-5 text-[rgba(245,247,250,0.62)]">
            BizPilot keeps the next response visible, drafted, and owner-controlled.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default function Home() {
  return (
    <main className={`min-h-screen overflow-x-hidden font-sans ${bizTheme.appBackground}`}>
      <div className={`pointer-events-none fixed inset-0 ${bizTheme.atmosphericBackground}`} />
      <div className="relative">
        <nav className="sticky top-0 z-30 border-b border-white/[0.05] bg-[#071018]/72 backdrop-blur-[16px]">
          <div className="mx-auto flex h-[56px] w-full max-w-[1125px] items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
            <Link className="flex items-center gap-3 text-base font-bold" href="/">
              <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#17D492] text-[10px] font-black text-[#03130c]">
                BP
              </span>
              BizPilot
            </Link>
            <div className="hidden items-center gap-8 text-xs font-semibold text-[rgba(245,247,250,0.54)] lg:flex">
              {navItems.map(([label, href]) => (
                <a className="transition hover:text-[#F5F7FA]" href={href} key={label}>
                  {label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link
                className="hidden text-xs font-semibold text-[rgba(245,247,250,0.72)] transition hover:text-[#F5F7FA] sm:block"
                href="/auth/sign-in"
              >
                Log in
              </Link>
              <PrimaryCta>Get Early Access</PrimaryCta>
            </div>
          </div>
        </nav>

        <div className="mx-auto grid w-full max-w-[1125px] lg:grid-cols-[minmax(0,840px)_285px]">
          <div className="min-w-0">
        <section className="border-b border-white/[0.04]">
          <Container className="grid gap-8 py-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(330px,0.88fr)] lg:items-center lg:py-9">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#17D492]/20 bg-[#17D492]/8 px-3 py-1 text-[10px] font-black uppercase text-[#F5F7FA]">
                <span className="text-[#17D492]">+</span>
                AI lead recovery for cleaning businesses
              </p>
              <h1 className="mt-5 max-w-[390px] text-[40px] font-black leading-[0.94] text-[#F5F7FA] sm:text-[44px] lg:text-[34px]">
                <span className="block">Every minute</span>
                <span className="block">you wait,</span>
                <span className="block">another company</span>
                <span className="block text-[#17D492]">gets the job.</span>
              </h1>
              <p className="mt-4 max-w-[34ch] text-sm leading-6 text-[rgba(245,247,250,0.72)]">
                BizPilot captures quote requests from texts, DMs, Facebook, and
                email - then drafts instant AI replies so you book more jobs
                before competitors even respond.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <PrimaryCta>Start booking faster</PrimaryCta>
                <SecondaryCta>Watch 2-min demo</SecondaryCta>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-[rgba(245,247,250,0.58)]">
                {trustItems.map((item) => (
                  <span className="flex items-center gap-2" key={item}>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#17D492]/28 text-[#17D492]">
                      <IconGlyph name="check" />
                    </span>
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <Avatars />
              </div>
            </div>
            <WorkflowPreview />
          </Container>
          <Container className="pb-4">
            <div className="grid overflow-hidden rounded-[14px] border border-white/[0.08] bg-[rgba(13,23,33,0.72)] shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:grid-cols-2 lg:grid-cols-4">
              {heroMetrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </div>
          </Container>
        </section>

        <section className="border-b border-white/[0.04]" id="features">
          <Container className="py-14">
            <SectionHeader
              eyebrow="The problem"
              title="Why cleaning businesses lose thousands in missed leads"
            />
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {problemCards.map((card) => (
                <article
                  className="group rounded-[16px] border border-white/[0.08] bg-[rgba(13,23,33,0.92)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.14]"
                  key={card.title}
                >
                  <span
                    className={
                      card.tone === "red"
                        ? "flex h-10 w-10 items-center justify-center rounded-full bg-[#FF5C5C]/14 text-[#FF5C5C]"
                        : card.tone === "amber"
                          ? "flex h-10 w-10 items-center justify-center rounded-full bg-[#FFB84D]/14 text-[#FFB84D]"
                          : "flex h-10 w-10 items-center justify-center rounded-full bg-[#17D492]/14 text-[#17D492]"
                    }
                  >
                    <IconGlyph name={card.icon} />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-[#F5F7FA]">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[rgba(245,247,250,0.68)]">
                    {card.detail}
                  </p>
                  <p className={card.tone === "red" ? "mt-5 text-xs font-bold text-[#FF5C5C]" : card.tone === "amber" ? "mt-5 text-xs font-bold text-[#FFB84D]" : "mt-5 text-xs font-bold text-[#17D492]"}>
                    {card.metric}
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <BeforeAfter />

        <section className="border-t border-white/[0.04]" id="how-it-works">
          <Container className="py-14">
            <SectionHeader eyebrow="How it works" title="Your AI lead recovery engine" />
            <div className="relative mt-10 grid gap-5 md:grid-cols-5">
              <span className="absolute left-[10%] right-[10%] top-10 hidden border-t border-dashed border-white/[0.16] md:block" />
              {processSteps.map(([title, body, icon], index) => (
                <article className="relative text-center" key={title}>
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#17D492]/20 bg-[#0D1721] text-[#17D492] shadow-[0_0_30px_rgba(23,212,146,0.08)]">
                    <IconGlyph name={icon} />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-[#F5F7FA]">
                    {index + 1}. {title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-[18ch] text-xs leading-5 text-[rgba(245,247,250,0.58)]">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-y border-white/[0.04] bg-[#0D1721]/48" id="proof">
          <Container className="py-14">
            <SectionHeader
              eyebrow="Loved by cleaning businesses"
              title="Real results from real businesses"
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {proofCards.map(([value, label, source]) => (
                <article
                  className="rounded-[14px] border border-white/[0.08] bg-[rgba(13,23,33,0.92)] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#17D492]/20"
                  key={value}
                >
                  <p className={value.includes("★") ? "text-lg font-black text-[#FFB84D]" : "text-2xl font-black text-[#17D492]"}>
                    {value}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[rgba(245,247,250,0.72)]">{label}</p>
                  <p className="mt-4 text-xs text-[rgba(245,247,250,0.42)]">{source}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section id="pricing">
          <Container className="grid gap-8 py-14 lg:grid-cols-[0.46fr_1fr] lg:items-center">
            <div>
              <p className="text-[11px] font-black uppercase text-[#17D492]">Simple pricing</p>
              <h2 className="mt-2 max-w-[11ch] text-[32px] font-bold leading-[1.05] text-[#F5F7FA] sm:text-[42px]">
                Start small. Win more jobs.
              </h2>
              <p className="mt-4 max-w-[30ch] text-base leading-7 text-[rgba(245,247,250,0.62)]">
                7-day free trial. No credit card. Cancel anytime.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_1.08fr_0.8fr]">
              {pricingPlans.map((plan) => (
                <article
                  className={
                    plan.spotlight
                      ? "relative rounded-[16px] border border-[#17D492]/42 bg-[linear-gradient(180deg,rgba(23,212,146,0.12),rgba(13,23,33,0.92))] p-5 shadow-[0_0_42px_rgba(23,212,146,0.10)]"
                      : "rounded-[16px] border border-white/[0.08] bg-[rgba(13,23,33,0.92)] p-5"
                  }
                  key={plan.name}
                >
                  {plan.spotlight ? (
                    <span className="absolute right-5 top-4 rounded-full bg-[#17D492] px-3 py-1 text-[10px] font-black text-[#03130c]">
                      Most Popular
                    </span>
                  ) : null}
                  <p className="text-sm font-bold text-[#F5F7FA]">{plan.name}</p>
                  <p className="mt-4 text-3xl font-black text-[#F5F7FA]">
                    {plan.price}
                    <span className="text-xs font-semibold text-[rgba(245,247,250,0.58)]">/month</span>
                  </p>
                  <p className="mt-1 text-xs text-[rgba(245,247,250,0.58)]">{plan.note}</p>
                  <ul className="mt-5 grid gap-2.5 text-xs text-[rgba(245,247,250,0.72)]">
                    {plan.features.map((feature) => (
                      <li className="flex gap-2" key={feature}>
                        <span className="text-[#17D492]">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    className={plan.spotlight ? "mt-5 inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-[#17D492] text-xs font-bold text-[#03130c] transition hover:bg-[#21E6A0]" : "mt-5 inline-flex h-11 w-full items-center justify-center rounded-[10px] border border-white/[0.16] bg-white/[0.025] text-xs font-bold text-[#F5F7FA] transition hover:bg-white/[0.06]"}
                    href="/auth/sign-up"
                  >
                    {plan.cta}
                  </Link>
                </article>
              ))}
              <article className="rounded-[16px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(13,23,33,0.92),rgba(13,23,33,0.58))] p-5">
                <h3 className="text-lg font-bold text-[#F5F7FA]">7-day free trial</h3>
                <ul className="mt-5 grid gap-2.5 text-xs text-[rgba(245,247,250,0.72)]">
                  {["Full access", "No credit card", "Cancel anytime"].map((item) => (
                    <li className="flex gap-2" key={item}>
                      <span className="text-[#17D492]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] text-center">
                  <p className="text-2xl font-black text-[#F5F7FA]">
                    7
                    <span className="block text-[10px] font-semibold text-[rgba(245,247,250,0.58)]">
                      Days
                    </span>
                  </p>
                </div>
              </article>
            </div>
          </Container>
        </section>

        <section>
          <Container className="pb-14">
            <div className="relative overflow-hidden rounded-[20px] border border-[#17D492]/18 bg-[radial-gradient(circle_at_20%_0%,rgba(23,212,146,0.16),transparent_18rem),linear-gradient(135deg,#0D1721,#071018)] p-7 shadow-[0_32px_100px_rgba(0,0,0,0.26)] sm:p-9">
              <div className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_bottom,rgba(23,212,146,0.16),transparent_68%)]" />
              <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <h2 className="text-[28px] font-black leading-tight text-[#F5F7FA] sm:text-[38px]">
                  Stop losing leads.
                  <br className="hidden sm:block" />
                  Start booking more jobs today.
                </h2>
                <div className="grid gap-2">
                  <PrimaryCta>Get Early Access</PrimaryCta>
                  <p className="text-center text-xs text-[rgba(245,247,250,0.58)]">
                    Free 7-day trial - No credit card
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <footer className="border-t border-white/[0.06]">
          <Container className="grid gap-8 py-8 sm:grid-cols-[1fr_auto] sm:items-start">
            <Link className="flex items-center gap-3 text-base font-bold" href="/">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#17D492] text-xs font-black text-[#03130c]">
                BP
              </span>
              BizPilot
            </Link>
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-xs text-[rgba(245,247,250,0.58)] sm:grid-cols-4">
              {["Product", "Company", "Legal", "Socials"].map((item) => (
                <Link className="transition hover:text-[#F5F7FA]" href="/" key={item}>
                  {item}
                </Link>
              ))}
            </div>
          </Container>
        </footer>
          </div>
          <RightProofRail />
        </div>
      </div>
    </main>
  );
}
