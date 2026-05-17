/**
 * ============================================================
 * File: app/page.tsx
 * Project: BizPilot AI
 * Description: Renders the public BizPilot AI landing page.
 * Role: Communicates the quote recovery offer for cleaning businesses.
 * Related:
 * - app/layout.tsx
 * - app/globals.css
 * - docs/BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md (Section 15)
 * - docs/product/BIZPILOT_HOMEPAGE_AND_VISUAL_THEME_STANDARD_v1.0.md
 * Author: MoOoH
 * Last Updated: 2026-05-17
 * Change Log:
 * - 2026-05-17: Implemented final corrected homepage direction.
 * ============================================================
 */

import Link from "next/link";
import type { ReactNode } from "react";

type IconName =
  | "arrow"
  | "building"
  | "calendar"
  | "chat"
  | "check"
  | "clipboard"
  | "inbox"
  | "mail"
  | "reply"
  | "route"
  | "spark";

const trustItems = ["Free 14-day trial", "No credit card", "Setup in 5 minutes"] as const;

const proofStrip = [
  ["Reply in minutes", "Fresh quote requests stay visible before they cool off."],
  ["Follow up on time", "Waiting leads keep a clear next action and due window."],
  ["Review AI drafts", "BizPilot prepares replies, the owner approves them."],
  ["Keep leads in view", "No quote request disappears inside scattered messages."],
] as const;

const lostReasons = [
  {
    detail:
      "Most customers contact 2-3 cleaners at once and book whoever replies first. A 4-hour delay can mean the job is gone.",
    icon: "reply",
    title: "Too slow to reply",
  },
  {
    detail:
      "You quote someone, hear nothing, and move on. Three days later they hired the competitor who sent one simple reminder.",
    icon: "calendar",
    title: "Missed follow-ups",
  },
  {
    detail:
      "Texts, DMs, Facebook, referrals, and email scatter quote requests across too many places. One missed message is one missed job.",
    icon: "inbox",
    title: "Messages everywhere",
  },
] satisfies ReadonlyArray<{
  detail: string;
  icon: IconName;
  title: string;
}>;

const serviceCards = [
  ["Regular & recurring cleans", "Keep repeat requests and follow-ups in one calm lead queue."],
  ["Move-in & move-out cleans", "Surface urgent timing, missing details, and reply drafts fast."],
  ["Deep cleans & one-offs", "Capture service type, property context, and the next owner action."],
  ["Instagram, Facebook & email leads", "Share one quote link wherever customers already ask for prices."],
] as const;

const transformation = [
  ["Scattered DM", "Structured lead card"],
  ["Missing address or room count", "Property details captured"],
  ["No preferred date visible", "Preferred date surfaced"],
  ["Easy to forget", "Follow-up scheduled"],
  ["Owner guesses what to say", "AI reply ready to review"],
] as const;

const workflowSteps = [
  {
    body:
      "Share your BizPilot link anywhere - Instagram bio, Google Business, or your website. Every request arrives with service type, location, and timing already extracted.",
    eyebrow: "Customer submits",
    icon: "chat",
    title: "Quote request lands structured in your inbox",
  },
  {
    body:
      "BizPilot reads the request, scores urgency, flags missing info, and writes a reply in your tone. High-risk leads surface automatically at the top.",
    eyebrow: "AI prepares",
    icon: "spark",
    title: "A personalized reply is drafted before you open the app",
  },
  {
    body:
      "Every reply goes through your eyes first. Nothing sends without your approval. BizPilot then reminds you when to follow up so no lead goes cold.",
    eyebrow: "You close",
    icon: "route",
    title: "Review, tap send, and keep follow-up tracked",
  },
] satisfies ReadonlyArray<{
  body: string;
  eyebrow: string;
  icon: IconName;
  title: string;
}>;

const pricingPlans = [
  {
    cta: "Get Started Free",
    description: "Free forever",
    features: [
      "Up to 15 leads/month",
      "1 public quote link",
      "Basic lead dashboard",
      "Email support",
    ],
    href: "/auth/sign-up",
    name: "Starter",
    price: "$0",
    spotlight: false,
  },
  {
    cta: "Start 14-Day Free Trial",
    description: "14-day free trial",
    features: [
      "Unlimited leads",
      "AI-drafted replies",
      "Follow-up reminders",
      "Multi-channel quote link workflow",
      "Priority support",
    ],
    href: "/auth/sign-up",
    name: "Pro",
    price: "$39",
    spotlight: true,
  },
] as const;

const statCards = [
  ["Lead received", "Now", "Sarah from Facebook", "text-[#00d084]"],
  ["AI extracted", "23s", "Move-out clean - Friday", "text-[#4fa8ff]"],
  ["Draft ready", "Review", "Owner approval needed", "text-[#eef2f6]"],
  ["Follow-up set", "2h", "If no reply", "text-[#ffab00]"],
] as const;

const workflowCards = [
  {
    detail: "Sarah from Facebook",
    icon: "chat",
    meta: "Just now",
    status: "Lead received",
    tone: "blue",
  },
  {
    detail: "Move-out cleaning - 3 bed - Friday",
    icon: "spark",
    meta: "00:12",
    status: "AI extracts details",
    tone: "neutral",
  },
  {
    detail: "Personalized reply ready",
    icon: "reply",
    meta: "00:23",
    status: "Draft reply ready",
    tone: "green",
  },
  {
    detail: "If no reply by 2 PM",
    icon: "calendar",
    meta: "2:00:00",
    status: "Follow-up scheduled",
    tone: "amber",
  },
  {
    detail: "Move-out clean - owner reviewed",
    icon: "check",
    meta: "Today",
    status: "Job booked",
    tone: "green",
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
      {name === "building" ? (
        <>
          <path d="M4 21V5a2 2 0 0 1 2-2h10v18" />
          <path d="M16 8h2a2 2 0 0 1 2 2v11" />
          <path d="M8 7h4" />
          <path d="M8 11h4" />
          <path d="M8 15h4" />
        </>
      ) : null}
      {name === "calendar" ? (
        <>
          <path d="M7 3v4" />
          <path d="M17 3v4" />
          <path d="M4 8h16" />
          <path d="M5 5h14v15H5z" />
          <path d="M8 13h3" />
          <path d="M8 16h6" />
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
        </>
      ) : null}
      {name === "clipboard" ? (
        <>
          <path d="M8 5h8" />
          <path d="M9 3h6v4H9z" />
          <path d="M6 6h12v15H6z" />
          <path d="M9 12h6" />
          <path d="M9 16h4" />
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
      {name === "reply" ? (
        <>
          <path d="M9 10 5 14l4 4" />
          <path d="M5 14h9a5 5 0 0 0 5-5V7" />
        </>
      ) : null}
      {name === "route" ? (
        <>
          <path d="M6 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          <path d="M18 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          <path d="M8 16h4a4 4 0 0 0 0-8h4" />
        </>
      ) : null}
      {name === "spark" ? (
        <>
          <path d="M12 3 9.8 9.8 3 12l6.8 2.2L12 21l2.2-6.8L21 12l-6.8-2.2z" />
          <path d="M18 3v4" />
          <path d="M16 5h4" />
        </>
      ) : null}
    </svg>
  );
}

function PrimaryCta({
  children,
  href = "/auth/sign-up",
}: Readonly<{ children: ReactNode; href?: string }>) {
  return (
    <Link
      className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#00d084] px-6 text-sm font-bold text-[#04110c] shadow-[0_14px_32px_rgba(0,208,132,0.16)] transition hover:bg-[#00a868] sm:min-w-[210px]"
      href={href}
    >
      {children}
      <span className="ml-2">-&gt;</span>
    </Link>
  );
}

function SecondaryCta({
  children,
  href = "#how-it-works",
}: Readonly<{ children: ReactNode; href?: string }>) {
  return (
    <Link
      className="inline-flex h-12 items-center justify-center rounded-[10px] border border-white/[0.13] bg-white/[0.035] px-6 text-sm font-semibold text-[#eef2f6] transition hover:border-white/[0.18] hover:bg-white/[0.06] sm:min-w-[190px]"
      href={href}
    >
      {children}
    </Link>
  );
}

function WorkflowPreview() {
  return (
    <aside className="relative overflow-hidden rounded-[22px] border border-white/[0.10] bg-[linear-gradient(145deg,rgba(19,32,46,0.92),rgba(13,23,33,0.80))] p-5 shadow-[0_32px_90px_rgba(0,0,0,0.34)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_8%,rgba(0,208,132,0.09),transparent_16rem),radial-gradient(circle_at_10%_100%,rgba(79,168,255,0.06),transparent_14rem)]" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-bold uppercase text-[#435566]">
            Live recovery workflow
          </p>
          <p className="font-mono text-xs text-[#00d084]">owner-reviewed</p>
        </div>

        <div className="mt-5 grid gap-3">
          {workflowCards.map((card, index) => (
            <div className="relative" key={card.status}>
              {index < workflowCards.length - 1 ? (
                <span className="absolute left-5 top-12 h-5 border-l border-dashed border-white/[0.18]" />
              ) : null}
              <div
                className={
                  card.tone === "green"
                    ? "grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-[14px] border border-[#00d084]/30 bg-[#00d084]/10 p-3 shadow-[0_0_34px_rgba(0,208,132,0.07)] transition duration-200 hover:-translate-y-0.5"
                    : "grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-[14px] border border-white/[0.08] bg-[#0f1a24]/90 p-3 transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.14]"
                }
              >
                <span
                  className={
                    card.tone === "green"
                      ? "flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#00d084] text-[#04110c]"
                      : card.tone === "amber"
                        ? "flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#ffab00]/14 text-[#ffab00]"
                        : card.tone === "blue"
                          ? "flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#4fa8ff]/14 text-[#4fa8ff]"
                          : "flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/[0.07] text-[#7a90a4]"
                  }
                >
                  <IconGlyph name={card.icon} />
                </span>
                <span>
                  <span className="block text-sm font-bold text-[#eef2f6]">
                    {card.status}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-[#7a90a4]">
                    {card.detail}
                  </span>
                </span>
                <span className="text-xs text-[#7a90a4]">{card.meta}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {statCards.map(([label, value, detail, tone]) => (
            <div
              className="rounded-[12px] border border-white/[0.07] bg-white/[0.035] p-3"
              key={label}
            >
              <p className={`text-lg font-black leading-none ${tone}`}>{value}</p>
              <p className="mt-2 text-[11px] font-bold leading-4 text-[#eef2f6]">
                {label}
              </p>
              <p className="mt-1 text-[11px] leading-4 text-[#7a90a4]">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: Readonly<{ eyebrow?: string; subtitle?: string; title: string }>) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow ? (
        <p className="text-xs font-bold uppercase text-[#00d084]">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-2xl font-bold leading-tight text-[#eef2f6] sm:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-sm leading-6 text-[#7a90a4]">{subtitle}</p>
      ) : null}
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.07] py-8">
      <div className="flex flex-col gap-3 text-sm text-[#7a90a4] sm:flex-row sm:items-center sm:justify-between">
        <Link className="flex items-center gap-2 font-bold text-[#eef2f6]" href="/">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00d084] text-xs text-[#04110c]">
            BP
          </span>
          BizPilot
        </Link>
        <p>Lead recovery for cleaning businesses.</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080d12] text-[#eef2f6]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,208,132,0.09),transparent_24rem),radial-gradient(circle_at_70%_12%,rgba(79,168,255,0.07),transparent_24rem),radial-gradient(circle_at_48%_42%,rgba(232,213,176,0.035),transparent_28rem)]" />
      <div className="relative">
        <nav className="border-b border-white/[0.07] bg-[#080d12]/88 backdrop-blur">
          <div className="mx-auto flex min-h-[76px] w-full max-w-[1180px] items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
            <Link className="flex items-center gap-3 text-lg font-bold" href="/">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#00d084] text-sm text-[#04110c]">
                BP
              </span>
              BizPilot
            </Link>
            <div className="hidden items-center gap-7 text-sm font-medium text-[#7a90a4] lg:flex">
              <a className="hover:text-[#eef2f6]" href="#features">Features</a>
              <a className="hover:text-[#eef2f6]" href="#how-it-works">
                How It Works
              </a>
              <a className="hover:text-[#eef2f6]" href="#pricing">Pricing</a>
              <a className="hover:text-[#eef2f6]" href="#workflow">Demo</a>
            </div>
            <div className="flex items-center gap-3">
              <SecondaryCta href="#workflow">See live workflow</SecondaryCta>
              <Link
                className="hidden h-12 items-center justify-center rounded-[10px] bg-[#00d084] px-5 text-sm font-bold text-[#04110c] transition hover:bg-[#00a868] sm:inline-flex"
                href="/auth/sign-up"
              >
                Get Early Access -&gt;
              </Link>
            </div>
          </div>
        </nav>

        <section className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(500px,0.88fr)] lg:items-center lg:px-8 lg:py-8">
          <div>
            <p className="inline-flex rounded-full border border-[#00d084]/24 bg-[#00d084]/8 px-3 py-1 text-xs font-bold text-[#00d084]">
              AI lead recovery for cleaning businesses
            </p>
            <h1 className="mt-6 max-w-[10.5ch] text-[clamp(44px,12vw,64px)] font-black leading-[0.94] sm:text-[clamp(52px,8vw,70px)] lg:text-[clamp(56px,5.4vw,76px)]">
              <span className="block">Every minute you wait, </span>
              <span className="block text-[#00d084]">another company gets the job.</span>
            </h1>
            <p className="mt-6 max-w-[34ch] text-base leading-7 text-[#7a90a4] sm:text-lg">
              BizPilot captures quote requests from texts, DMs, Facebook, and
              email - then drafts AI replies for owner review so you can book
              jobs before competitors respond.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PrimaryCta>Start booking faster</PrimaryCta>
              <SecondaryCta href="#workflow">Watch 2-minute demo</SecondaryCta>
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm text-[#435566]">
              <span className="h-2 w-2 rounded-full bg-[#ffab00]" />
              Only 23 early access spots remaining this month
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#7a90a4]">
              {trustItems.map((item) => (
                <span className="flex items-center gap-2" key={item}>
                  <span className="flex h-5 w-5 items-center justify-center rounded border border-[#00d084]/24 bg-[#00d084]/8 text-[#00d084]">
                    <IconGlyph name="check" />
                  </span>
                  {item}
                </span>
                ))}
            </div>
            <div className="mt-7 hidden max-w-[560px] rounded-[14px] border border-white/[0.07] bg-[#111d2a]/72 p-4 text-sm leading-6 text-[#7a90a4]">
              <p className="text-xs font-bold uppercase text-[#435566]">
                Sample pilot scenario
              </p>
              <p className="mt-2 italic">
                &quot;Set it up on a Tuesday. Wednesday I had 3 AI drafts waiting
                before I had coffee - closed one that afternoon, a move-out I
                would have definitely lost before.&quot;
              </p>
              <p className="mt-3 text-xs text-[#435566]">
                Example only - Maria R. - Sparkle Clean - Toronto
              </p>
            </div>
          </div>

          <div
            className="relative w-full max-w-[560px] justify-self-center lg:justify-self-end"
            id="workflow"
          >
            <div className="absolute -inset-4 rounded-[24px] border border-white/[0.07] bg-[radial-gradient(circle_at_72%_18%,rgba(0,208,132,0.045),transparent_18rem),linear-gradient(135deg,rgba(19,32,46,0.36),rgba(8,13,18,0.14))] shadow-[0_28px_80px_rgba(0,0,0,0.30)]" />
            <div className="relative">
              <WorkflowPreview />
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-[#0d1520]/55">
          <div className="mx-auto grid w-full max-w-[1180px] gap-0 px-5 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {proofStrip.map(([title, detail]) => (
              <div className="border-white/[0.07] py-4 sm:px-5 lg:border-l first:border-l-0" key={title}>
                <p className="text-base font-bold text-[#eef2f6]">{title}</p>
                <p className="mt-1 text-sm leading-6 text-[#7a90a4]">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-6 lg:px-8 lg:py-[88px]" id="features">
          <SectionHeader title="Why cleaning businesses lose thousands in missed leads" />
          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {lostReasons.map((reason) => (
              <article
                className="rounded-[16px] border border-white/[0.07] bg-[#0f1a24] p-5"
                key={reason.title}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#00d084]/24 bg-[#00d084]/8 text-[#00d084]">
                  <IconGlyph name={reason.icon} />
                </span>
                <h3 className="mt-4 text-base font-bold text-[#eef2f6]">{reason.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#7a90a4]">{reason.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1180px] px-5 pb-16 sm:px-6 lg:px-8 lg:pb-[88px]">
          <SectionHeader
            subtitle="BizPilot keeps the MVP focused: quote requests, reply drafts, follow-up, and owner review."
            title="Every service type. Every channel. One inbox."
          />
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCards.map(([title, detail]) => (
              <article
                className="rounded-[16px] border border-white/[0.07] bg-[#0d1520] p-5"
                key={title}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/[0.13] bg-white/[0.035] text-[#4fa8ff]">
                  <IconGlyph name="building" />
                </span>
                <h3 className="mt-4 text-base font-bold text-[#eef2f6]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#7a90a4]">{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-[#0d1520]/55">
          <div className="mx-auto grid w-full max-w-[1180px] gap-6 px-5 py-16 sm:px-6 lg:grid-cols-[0.84fr_1.16fr] lg:items-center lg:px-8 lg:py-[88px]">
            <div>
              <p className="text-xs font-bold uppercase text-[#00d084]">
                The first 3 minutes
              </p>
              <h2 className="mt-2 text-3xl font-bold leading-tight text-[#eef2f6]">
                Turn quote chaos into a clear next action.
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#7a90a4]">
                The owner sees the difference immediately: less guessing, clearer
                details, and a reply ready for review.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[16px] border border-white/[0.07] bg-[#0f1a24] p-5">
                <p className="text-xs font-bold uppercase text-[#ff4757]">
                  Before BizPilot
                </p>
                <div className="mt-4 rounded-[12px] border border-white/[0.07] bg-[#080d12] p-4 text-sm leading-6 text-[#eef2f6]">
                  &quot;Hi, how much for a move-out clean this week?&quot;
                </div>
                <ul className="mt-4 grid gap-3 text-sm text-[#7a90a4]">
                  {transformation.map(([before]) => (
                    <li className="flex gap-2" key={before}>
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff4757]" />
                      <span>{before}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-[16px] border border-[#00d084]/24 bg-[#00d084]/8 p-5">
                <p className="text-xs font-bold uppercase text-[#00d084]">
                  After BizPilot
                </p>
                <div className="mt-4 rounded-[12px] border border-white/[0.07] bg-[#080d12] p-4 text-sm leading-6 text-[#eef2f6]">
                  Sarah J. - Move-out cleaning - Friday - AI reply ready
                </div>
                <ul className="mt-4 grid gap-3 text-sm text-[#eef2f6]">
                  {transformation.map(([, after]) => (
                    <li className="flex gap-2" key={after}>
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00d084]" />
                      <span>{after}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-6 lg:px-8 lg:py-[88px]" id="how-it-works">
          <SectionHeader
            subtitle="One quiet workflow from quote request to reviewed follow-up."
            title="How BizPilot works"
          />
          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {workflowSteps.map((step, index) => (
              <article
                className="rounded-[16px] border border-white/[0.07] bg-[#0f1a24] p-5"
                key={step.title}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#00d084]/24 bg-[#00d084]/8 text-[#00d084]">
                    <IconGlyph name={step.icon} />
                  </span>
                  <span className="rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1 text-xs font-bold text-[#7a90a4]">
                    Step {index + 1}
                  </span>
                </div>
                <p className="mt-5 text-xs font-bold uppercase text-[#00d084]">
                  {step.eyebrow}
                </p>
                <h3 className="mt-2 text-lg font-bold leading-6 text-[#eef2f6]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#7a90a4]">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1180px] px-5 pb-16 sm:px-6 lg:px-8 lg:pb-[88px]">
          <div className="rounded-[18px] border border-white/[0.07] bg-[#111d2a] p-6 sm:p-7">
            <p className="text-xs font-bold uppercase text-[#435566]">
              Sample customer story
            </p>
            <blockquote className="mt-3 max-w-4xl text-lg font-semibold leading-8 text-[#eef2f6]">
              &quot;Set it up on a Tuesday. Wednesday I had 3 AI drafts waiting
              before I had coffee - closed one that afternoon, a move-out I would
              have definitely lost before.&quot;
            </blockquote>
            <p className="mt-4 text-sm text-[#7a90a4]">
              Example only, not a verified customer testimonial.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1180px] px-5 pb-16 sm:px-6 lg:px-8 lg:pb-[88px]" id="pricing">
          <SectionHeader
            subtitle="Simple MVP pricing for owner-led validation."
            title="Start small. Upgrade when quote recovery becomes daily."
          />
          <div className="mx-auto mt-7 grid max-w-4xl gap-4 md:grid-cols-2">
            {pricingPlans.map((plan) => (
              <article
                className={
                  plan.spotlight
                    ? "rounded-[18px] border border-[#00d084]/24 bg-[#00d084]/8 p-6"
                    : "rounded-[18px] border border-white/[0.07] bg-[#0f1a24] p-6"
                }
                key={plan.name}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-[#eef2f6]">{plan.name}</h3>
                    <p className="mt-1 text-sm text-[#7a90a4]">{plan.description}</p>
                  </div>
                  {plan.spotlight ? (
                    <span className="rounded-full bg-[#00d084] px-3 py-1 text-xs font-bold text-[#04110c]">
                      Pilot ready
                    </span>
                  ) : null}
                </div>
                <p className="mt-6 text-4xl font-black text-[#eef2f6]">
                  {plan.price}
                  <span className="text-sm font-semibold text-[#7a90a4]">/month</span>
                </p>
                <ul className="mt-6 grid gap-3 text-sm text-[#7a90a4]">
                  {plan.features.map((feature) => (
                    <li className="flex gap-2" key={feature}>
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#00d084]/24 bg-[#00d084]/8 text-[#00d084]">
                        <IconGlyph name="check" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  className={
                    plan.spotlight
                      ? "mt-7 inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-[#00d084] text-sm font-bold text-[#04110c] hover:bg-[#00a868]"
                      : "mt-7 inline-flex h-11 w-full items-center justify-center rounded-[10px] border border-white/[0.13] bg-white/[0.035] text-sm font-bold text-[#eef2f6] hover:bg-white/[0.06]"
                  }
                  href={plan.href}
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1180px] px-5 pb-16 sm:px-6 lg:px-8 lg:pb-[88px]">
          <div className="overflow-hidden rounded-[20px] border border-white/[0.07] bg-[radial-gradient(circle_at_20%_20%,rgba(0,208,132,0.12),transparent_18rem),linear-gradient(135deg,#111d2a,#0d1520)] p-7 sm:p-9">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-black leading-tight text-[#eef2f6]">
                  Start recovering leads today.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7a90a4]">
                  Stop losing quote requests. Start winning more cleaning jobs.
                  Set up in 5 minutes.
                </p>
              </div>
              <PrimaryCta href="/auth/sign-up">Get Early Access - Free</PrimaryCta>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8">
          <Footer />
        </div>
      </div>
    </main>
  );
}
