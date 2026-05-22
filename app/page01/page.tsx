/**
 * ============================================================
 * File: app/page.tsx
 * Project: BizPilot AI
 * Description: Public marketing homepage — Quote Recovery Command Center for Cleaning Businesses.
 * Role: Premium founder-led landing built to the Master Index v1.0 spec. Honest copy + premium visual + trust signals + comparison + pilot-labeled testimonials + signed founder note. Stays inside the Operational Calm UX doctrine — no glow spam, no over-animation. Five anchor messages repeat across the page:
 *   1) You are losing warm quote requests.
 *   2) The problem is response speed and organization, not demand.
 *   3) BizPilot gives you one calm lead recovery desk.
 *   4) AI helps, but never takes control.
 *   5) This is a founder-led pilot for cleaning businesses.
 * Related:
 * - docs/product/BIZPILOT_DASHBOARD_DESIGN_SYSTEM_v1.0.md
 * - docs/product/BIZPILOT_HOMEPAGE_AND_VISUAL_THEME_STANDARD_v1.0.md
 * - docs/BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md
 * - docs/gtm/BIZPILOT_GTM_PLAYBOOK_v1.1.md
 * Author: MoOoH
 * Last Updated: 2026-05-19
 * Change Log:
 * - 2026-05-19 v1: Token-aligned rebuild.
 * - 2026-05-19 v2: Emotional copy + animated stat strip + comparison + testimonials + founder note.
 * - 2026-05-19 v3: Applied Master Index v1.0 verbatim. Replaced hard-claim stat numbers with safe value statements + a single "Estimated" $2,800/mo count-up. Comparison footnote added. CTA hierarchy consolidated to two patterns: "Start free pilot" + "Claim a pilot seat / Talk to the founder". All wording matches the spec.
 * ============================================================
 */

import Link from "next/link";
import type { ReactNode } from "react";

import { StatCounter } from "@/components/public/stat-counter";

export const metadata = {
  title:
    "BizPilot AI — Stop losing cleaning quote requests | Quote Recovery Command Center",
  description:
    "Every unanswered cleaning quote is a job your competitor just closed. BizPilot turns DMs, texts, web forms, and email into one calm lead recovery desk with owner-reviewed AI drafts. Founder-led pilot for Montreal cleaning businesses.",
};

// ───────── Tokens ─────────
const tone = {
  text: "var(--biz-page-text)",
  soft: "var(--biz-page-text-soft)",
  muted: "var(--biz-page-text-muted)",
  surface: "var(--biz-page-surface)",
  surfaceElevated: "var(--biz-page-surface-elevated)",
  border: "var(--biz-page-border)",
  borderMedium: "var(--biz-border-medium)",
  borderStrong: "var(--biz-border-strong)",
  primary: "var(--biz-primary)",
  warning: "var(--biz-warning)",
  danger: "var(--biz-danger)",
};

const pageBackground =
  "radial-gradient(circle at 12% 0%, rgba(20,184,166,0.18), transparent 30%), radial-gradient(circle at 88% 6%, rgba(45,212,191,0.12), transparent 26%), linear-gradient(180deg, var(--biz-page-bg) 0%, #04080d 100%)";

// ───────── Atoms ─────────

type ButtonVariant = "primary" | "secondary" | "ghost";

function Button({
  children,
  href,
  variant = "primary",
  external,
}: Readonly<{
  children: ReactNode;
  external?: boolean;
  href: string;
  variant?: ButtonVariant;
}>) {
  const ring =
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(23,212,146,0.28)]";
  if (variant === "primary") {
    return (
      <Link
        className={`inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[12px] px-4 text-[13px] font-extrabold transition hover:-translate-y-0.5 ${ring}`}
        href={href}
        rel={external ? "noopener" : undefined}
        style={{
          background: "linear-gradient(135deg, #14b8a6, #2dd4bf)",
          color: "#022c22",
          boxShadow: "0 18px 38px rgba(20,184,166,0.26)",
        }}
        target={external ? "_blank" : undefined}
      >
        {children}
      </Link>
    );
  }
  if (variant === "secondary") {
    return (
      <Link
        className={`inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[12px] border px-4 text-[13px] font-extrabold transition hover:-translate-y-0.5 ${ring}`}
        href={href}
        style={{
          backgroundColor: "rgba(255,255,255,0.04)",
          borderColor: tone.borderMedium,
          color: tone.text,
        }}
      >
        {children}
      </Link>
    );
  }
  return (
    <Link
      className={`inline-flex h-9 items-center justify-center gap-1.5 text-[12px] font-bold transition hover:opacity-80 ${ring}`}
      href={href}
      style={{ color: tone.soft }}
    >
      {children}
    </Link>
  );
}

function Pill({
  children,
  variant = "primary",
}: Readonly<{
  children: ReactNode;
  variant?: "primary" | "neutral" | "warning" | "danger";
}>) {
  const map =
    variant === "warning"
      ? { bg: "rgba(255,171,0,0.12)", border: "rgba(255,171,0,0.25)", color: tone.warning }
      : variant === "danger"
        ? { bg: "rgba(255,71,87,0.10)", border: "rgba(255,71,87,0.25)", color: "#FF8A95" }
        : variant === "neutral"
          ? { bg: "rgba(255,255,255,0.06)", border: tone.borderMedium, color: tone.soft }
          : { bg: "rgba(20,184,166,0.10)", border: "rgba(20,184,166,0.26)", color: "#2dd4bf" };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em]"
      style={{ backgroundColor: map.bg, borderColor: map.border, color: map.color }}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: map.color }} />
      {children}
    </span>
  );
}

function Card({
  children,
  className = "",
  style,
}: Readonly<{ children: ReactNode; className?: string; style?: React.CSSProperties | undefined }>) {
  return (
    <div
      className={`rounded-[18px] border ${className}`}
      style={{
        backgroundColor: tone.surface,
        borderColor: tone.border,
        boxShadow: "0 18px 60px rgba(0,0,0,0.22)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <p
      className="text-[11px] font-extrabold uppercase tracking-[0.16em]"
      style={{ color: "#2dd4bf" }}
    >
      {children}
    </p>
  );
}

function SectionTitle({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <h2
      className="mt-2 text-[30px] font-extrabold leading-[1.06] tracking-[-0.035em] sm:text-[38px]"
      style={{ color: tone.text }}
    >
      {children}
    </h2>
  );
}

function SectionLead({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <p className="mt-3 max-w-[58ch] text-[15px] leading-7" style={{ color: tone.soft }}>
      {children}
    </p>
  );
}

function Icon({ name }: Readonly<{ name: string }>) {
  const paths: Record<string, ReactNode> = {
    bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7z" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    inbox: (
      <>
        <path d="M3 12h6l2 3h2l2-3h6" />
        <path d="M3 5h18v14H3z" />
      </>
    ),
    spark: (
      <>
        <path d="M12 3v3M12 18v3M5 12H2M22 12h-3" />
        <circle cx="12" cy="12" r="4" />
      </>
    ),
    check: <path d="m5 12 4 4 10-10" />,
    shield: (
      <>
        <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    chat: <path d="M5 6.5h14v9H8.5L5 19z" />,
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" />
      </>
    ),
    x: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6L6 18" />
      </>
    ),
    minus: <path d="M5 12h14" />,
  };
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name] ?? paths.spark}
    </svg>
  );
}

function BrandMark() {
  return (
    <Link className="inline-flex items-center gap-2.5" href="/">
      <span
        aria-hidden
        className="flex h-9 w-9 items-center justify-center rounded-[12px] text-base font-black"
        style={{
          background: "linear-gradient(135deg, #2dd4bf, #10b981)",
          color: "#022c22",
          boxShadow: "0 10px 22px rgba(20,184,166,0.22)",
        }}
      >
        B
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-black tracking-[-0.02em]" style={{ color: tone.text }}>
          BizPilot AI
        </span>
        <span
          className="block text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ color: tone.soft }}
        >
          Quote Recovery Desk
        </span>
      </span>
    </Link>
  );
}

// ───────── Hero preview (matches index.html) ─────────

function DashboardPreview() {
  const rows = [
    { initials: "SM", name: "Sarah M.", svc: "Move-out", area: "Plateau", age: "22m", pillTone: "danger" as const, status: "At risk" },
    { initials: "DR", name: "David R.", svc: "Deep clean", area: "Laval", age: "1h", pillTone: "warning" as const, status: "Missing info" },
    { initials: "NK", name: "Nadia K.", svc: "Recurring", area: "Downtown", age: "3h", pillTone: "primary" as const, status: "Draft ready" },
  ];

  return (
    <Card
      className="overflow-hidden p-4"
      style={{
        background:
          "radial-gradient(circle at 6% 0%, rgba(45,212,191,0.12), transparent 38%), linear-gradient(160deg, rgba(13,27,45,0.96), rgba(8,20,33,0.96))",
        borderColor: "rgba(45,212,191,0.22)",
        boxShadow: "0 36px 90px rgba(0,0,0,0.38)",
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <Pill>Live preview</Pill>
        <span
          className="text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ color: tone.muted }}
        >
          Owner workspace
        </span>
      </div>

      <p
        className="mt-3 text-[20px] font-extrabold leading-tight tracking-[-0.02em]"
        style={{ color: tone.text }}
      >
        3 quote requests need attention today.
      </p>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {[
          ["New", "8", "primary"],
          ["Reply", "3", "warning"],
          ["At risk", "2", "danger"],
          ["AI ready", "5", "primary"],
        ].map(([label, value, kind]) => (
          <div
            className="rounded-[12px] border p-2"
            key={label}
            style={{ backgroundColor: "rgba(255,255,255,0.035)", borderColor: tone.border }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-[0.1em]"
              style={{ color: tone.muted }}
            >
              {label}
            </p>
            <p
              className="mt-1 text-[18px] font-black tracking-[-0.04em]"
              style={{
                color:
                  kind === "warning"
                    ? tone.warning
                    : kind === "danger"
                      ? "#FF8A95"
                      : "#2dd4bf",
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-3 overflow-hidden rounded-[14px] border"
        style={{ borderColor: tone.border, backgroundColor: "rgba(255,255,255,0.025)" }}
      >
        {rows.map((row) => (
          <div
            className="grid grid-cols-[28px_minmax(0,1fr)_auto_42px] items-center gap-2 border-b px-3 py-2 last:border-b-0"
            key={row.initials}
            style={{ borderColor: tone.border }}
          >
            <span
              aria-hidden
              className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[10px] font-black"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", color: tone.text }}
            >
              {row.initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[12px] font-extrabold" style={{ color: tone.text }}>
                {row.name}
              </span>
              <span className="block truncate text-[10px]" style={{ color: tone.muted }}>
                {row.svc} • {row.area}
              </span>
            </span>
            <Pill variant={row.pillTone}>{row.status}</Pill>
            <span className="text-right text-[10px]" style={{ color: tone.muted }}>
              {row.age}
            </span>
          </div>
        ))}
      </div>

      <div
        className="mt-3 rounded-[12px] border p-3"
        style={{ backgroundColor: "rgba(20,184,166,0.08)", borderColor: "rgba(20,184,166,0.22)" }}
      >
        <p
          className="text-[11px] font-extrabold uppercase tracking-[0.08em]"
          style={{ color: "#2dd4bf" }}
        >
          AI suggested reply · Sarah M.
        </p>
        <p className="mt-1.5 text-[12px] leading-5" style={{ color: tone.text }}>
          Hi Sarah, thanks for reaching out. To give you an accurate move-out
          estimate, could you share the apartment size, preferred date, and any
          access details?
        </p>
        <p
          className="mt-2 text-[10px] font-bold uppercase tracking-[0.08em]"
          style={{ color: tone.muted }}
        >
          Owner-reviewed · No auto-send
        </p>
      </div>
    </Card>
  );
}

// ───────── PAGE ─────────

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: pageBackground, color: tone.text }}>
      {/* ──────── NAV ──────── */}
      <header
        className="sticky top-0 z-30 border-b backdrop-blur"
        style={{ backgroundColor: "rgba(7,17,31,0.74)", borderColor: tone.border }}
      >
        <nav className="mx-auto flex h-[60px] w-full max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6">
          <BrandMark />
          <div className="hidden items-center gap-1 md:flex">
            {([
              ["Why BizPilot", "#why"],
              ["How it works", "#how"],
              ["Comparison", "#vs"],
              ["Pricing", "#pricing"],
              ["FAQ", "#faq"],
            ] as const).map(([label, href]) => (
              <Link
                className="rounded-[10px] px-3 py-2 text-[12px] font-bold transition hover:opacity-100"
                href={href}
                key={href}
                style={{ color: tone.soft }}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button href="/auth/sign-in" variant="ghost">
              Sign in
            </Button>
            <Button href="/auth/sign-up" variant="primary">
              Start free pilot
            </Button>
          </div>
        </nav>
      </header>

      {/* ──────── HERO ──────── */}
      <section className="mx-auto w-full max-w-[1200px] px-4 pb-14 pt-10 sm:px-6 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Pill>Phase 18A pilot · Montreal-first</Pill>
              <Pill variant="warning">3 pilot seats open this month</Pill>
            </div>
            <h1
              className="mt-5 text-[40px] font-extrabold leading-[1.02] tracking-[-0.045em] sm:text-[52px] lg:text-[60px]"
              style={{ color: tone.text }}
            >
              Every unanswered{" "}
              <span style={{ color: "#2dd4bf" }}>cleaning quote</span> is a job
              your competitor just closed.
            </h1>
            <p className="mt-5 max-w-[58ch] text-[17px] leading-7" style={{ color: tone.soft }}>
              BizPilot turns DMs, texts, web forms, and email into one calm lead
              recovery desk with owner-reviewed AI drafts. Reply in minutes —
              not hours — and stop losing jobs you should have won.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Button href="/auth/sign-up" variant="primary">
                Start free pilot
              </Button>
              <Button href="#how" variant="secondary">
                See how it works
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px]">
              {[
                "Done-for-you setup",
                "Owner-reviewed AI",
                "No auto-send — ever",
                "Cancel anytime",
              ].map((item) => (
                <span
                  className="inline-flex items-center gap-1.5"
                  key={item}
                  style={{ color: tone.soft }}
                >
                  <span style={{ color: "#2dd4bf" }}>
                    <Icon name="check" />
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:pl-6">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* ──────── PROOF / PAIN STRIP (safe-numbered) ──────── */}
      <section
        className="border-y px-4 py-10 sm:px-6"
        style={{ borderColor: tone.border, backgroundColor: "rgba(255,255,255,0.025)" }}
      >
        <div className="mx-auto grid w-full max-w-[1200px] gap-4 sm:grid-cols-3">
          {/* Card 1 — uses single defensible counter with explicit "Estimated" framing */}
          <div
            className="rounded-[16px] border p-5"
            style={{
              backgroundColor: tone.surface,
              borderColor: tone.border,
              boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            }}
          >
            <p
              className="text-[34px] font-black leading-none tracking-[-0.04em] sm:text-[40px]"
              style={{ color: "#2dd4bf" }}
            >
              <StatCounter prefix="$" suffix="/mo" to={2800} />
            </p>
            <p
              className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: tone.muted }}
            >
              Pilot estimate
            </p>
            <p className="mt-2 text-[13px] leading-5" style={{ color: tone.soft }}>
              Estimated monthly revenue a busy cleaning owner can lose to missed
              or delayed quote requests.
            </p>
          </div>

          {/* Card 2 — value statement */}
          <div
            className="rounded-[16px] border p-5"
            style={{
              backgroundColor: tone.surface,
              borderColor: tone.border,
              boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            }}
          >
            <p
              className="text-[34px] font-black leading-none tracking-[-0.04em] sm:text-[40px]"
              style={{ color: "#2dd4bf" }}
            >
              &lt; 10 min matters
            </p>
            <p
              className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: tone.muted }}
            >
              Reply window
            </p>
            <p className="mt-2 text-[13px] leading-5" style={{ color: tone.soft }}>
              Warm inbound leads are easiest to recover when the owner replies
              quickly.
            </p>
          </div>

          {/* Card 3 — value statement */}
          <div
            className="rounded-[16px] border p-5"
            style={{
              backgroundColor: tone.surface,
              borderColor: tone.border,
              boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            }}
          >
            <p
              className="text-[34px] font-black leading-none tracking-[-0.04em] sm:text-[40px]"
              style={{ color: "#2dd4bf" }}
            >
              1 queue
            </p>
            <p
              className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: tone.muted }}
            >
              One owner workspace
            </p>
            <p className="mt-2 text-[13px] leading-5" style={{ color: tone.soft }}>
              DMs, forms, texts, and email organized in one owner workspace.
            </p>
          </div>
        </div>
      </section>

      {/* ──────── WHY ──────── */}
      <section className="px-4 py-16 sm:px-6" id="why">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="max-w-[60ch]">
            <Eyebrow>Why cleaning owners lose leads</Eyebrow>
            <SectionTitle>
              The quote request isn’t broken.{" "}
              <span style={{ color: "#2dd4bf" }}>The follow-up is.</span>
            </SectionTitle>
            <SectionLead>
              Customers usually don’t disappear. They hear back from someone
              else first. BizPilot helps you catch warm leads before they go
              cold.
            </SectionLead>
          </div>

          <div className="mt-9 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "clock",
                title: "Slow replies",
                body:
                  "A quote request comes in while you’re on a job. Ninety minutes later, the lead already heard back from another cleaner.",
                tone: "danger" as const,
              },
              {
                icon: "inbox",
                title: "Messy inboxes",
                body:
                  "Instagram DMs, website forms, text messages, and email all live in different places — so requests get buried.",
                tone: "warning" as const,
              },
              {
                icon: "spark",
                title: "Missing details",
                body:
                  "No apartment size, no preferred date, no access notes. You can’t quote clearly, so the conversation stalls.",
                tone: "warning" as const,
              },
              {
                icon: "target",
                title: "Forgotten follow-ups",
                body:
                  "You meant to reply after lunch. Then after the next job. Then tomorrow. Warm leads rarely wait.",
                tone: "danger" as const,
              },
            ].map((card) => (
              <Card className="p-5" key={card.title}>
                <Pill variant={card.tone}>
                  <Icon name={card.icon} />
                </Pill>
                <h3
                  className="mt-3 text-[17px] font-extrabold tracking-[-0.02em]"
                  style={{ color: tone.text }}
                >
                  {card.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-5" style={{ color: tone.soft }}>
                  {card.body}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── BEFORE / AFTER ──────── */}
      <section className="border-t px-4 py-16 sm:px-6" style={{ borderColor: tone.border }}>
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="max-w-[60ch]">
            <SectionTitle>From a vague DM to a ready-to-send reply.</SectionTitle>
            <SectionLead>
              Same quote request. Two very different owner experiences.
            </SectionLead>
          </div>

          <div className="mt-9 grid gap-4 lg:grid-cols-2">
            <Card className="p-6">
              <Pill variant="danger">Before BizPilot</Pill>
              <div
                className="mt-4 rounded-[14px] border p-4 text-[14px] leading-6"
                style={{
                  backgroundColor: "rgba(255,71,87,0.05)",
                  borderColor: "rgba(255,71,87,0.18)",
                  color: tone.soft,
                }}
              >
                <p className="font-bold" style={{ color: tone.text }}>
                  Sarah on Instagram, 8:03 a.m.
                </p>
                <p className="mt-1.5">“Hi, how much for cleaning?”</p>
                <p className="mt-3" style={{ color: tone.muted }}>
                  No size. No date. No access details. You spot the DM at 10:14
                  a.m. between two jobs. By 12:30, Sarah has already booked the
                  cleaner who replied first.
                </p>
              </div>
              <ul className="mt-5 grid gap-2">
                {[
                  "Buried in Instagram DMs",
                  "No structured quote details",
                  "Reply happens too late",
                  "Follow-up never happens",
                ].map((item) => (
                  <li
                    className="flex items-start gap-2 text-[13px]"
                    key={item}
                    style={{ color: tone.soft }}
                  >
                    <span style={{ color: "#FF8A95" }}>
                      <Icon name="x" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <Card
              className="p-6"
              style={{
                background:
                  "radial-gradient(circle at 8% 0%, rgba(20,184,166,0.12), transparent 38%), var(--biz-page-surface)",
                borderColor: "rgba(20,184,166,0.26)",
              }}
            >
              <Pill>After BizPilot</Pill>
              <div
                className="mt-4 grid gap-3 rounded-[14px] border p-4 text-[14px] leading-6"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderColor: tone.border,
                  color: tone.soft,
                }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Pill>Structured lead</Pill>
                  <Pill variant="warning">Ask: apartment size</Pill>
                </div>
                <p style={{ color: tone.text }}>
                  Move-out cleaning · 2-bedroom · Plateau · before Friday ·
                  contact ready
                </p>
                <div
                  className="rounded-[10px] border p-3"
                  style={{
                    backgroundColor: "rgba(20,184,166,0.06)",
                    borderColor: "rgba(20,184,166,0.18)",
                  }}
                >
                  <p
                    className="text-[11px] font-extrabold uppercase tracking-[0.08em]"
                    style={{ color: "#2dd4bf" }}
                  >
                    AI suggested reply
                  </p>
                  <p className="mt-1.5" style={{ color: tone.text }}>
                    Hi Sarah, thanks for reaching out. To give you an accurate
                    move-out estimate, could you share the apartment size,
                    preferred date, and any access details?
                  </p>
                </div>
                <p className="text-[11px]" style={{ color: tone.muted }}>
                  The owner reviews, edits if needed, and sends through their own
                  channel — usually in minutes, not hours.
                </p>
              </div>
              <ul className="mt-5 grid gap-2">
                {[
                  "One inbox for every channel",
                  "Missing info highlighted fast",
                  "Reply draft ready to review",
                  "Follow-up stays visible",
                ].map((item) => (
                  <li
                    className="flex items-start gap-2 text-[13px]"
                    key={item}
                    style={{ color: tone.soft }}
                  >
                    <span style={{ color: "#2dd4bf" }}>
                      <Icon name="check" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* ──────── HOW IT WORKS ──────── */}
      <section className="border-t px-4 py-16 sm:px-6" id="how" style={{ borderColor: tone.border }}>
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="max-w-[60ch]">
            <Eyebrow>How it works</Eyebrow>
            <SectionTitle>Four steps. You stay in control of all of them.</SectionTitle>
            <SectionLead>
              No magic. No AI deciding for you. BizPilot prepares the
              groundwork; you review and send.
            </SectionLead>
          </div>

          <div className="mt-9 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "01",
                title: "Capture",
                body:
                  "Share your branded quote link in Instagram bio, Google Business Profile, website, or DM autoresponses.",
                icon: "inbox",
              },
              {
                n: "02",
                title: "Organize",
                body:
                  "Every request lands in the Lead Recovery Queue with service type, area, urgency, and missing details.",
                icon: "spark",
              },
              {
                n: "03",
                title: "Draft",
                body:
                  "AI prepares a concise reply and follow-up draft. You review, edit, and copy. Nothing sends automatically.",
                icon: "chat",
              },
              {
                n: "04",
                title: "Follow up",
                body:
                  "BizPilot reminds you when a warm lead goes quiet. You decide what to send and mark the outcome manually.",
                icon: "bolt",
              },
            ].map((step) => (
              <Card className="relative p-5" key={step.n}>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-black" style={{ color: tone.muted }}>
                    STEP {step.n}
                  </span>
                  <span
                    aria-hidden
                    className="flex h-9 w-9 items-center justify-center rounded-[11px]"
                    style={{ backgroundColor: "rgba(20,184,166,0.14)", color: "#2dd4bf" }}
                  >
                    <Icon name={step.icon} />
                  </span>
                </div>
                <h3
                  className="mt-3 text-[17px] font-extrabold tracking-[-0.02em]"
                  style={{ color: tone.text }}
                >
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-5" style={{ color: tone.soft }}>
                  {step.body}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── COMPARISON ──────── */}
      <section className="border-t px-4 py-16 sm:px-6" id="vs" style={{ borderColor: tone.border }}>
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="max-w-[60ch]">
            <Eyebrow>Why not your other options</Eyebrow>
            <SectionTitle>BizPilot vs. the stack you’re using today.</SectionTitle>
            <SectionLead>
              Most cleaning owners bounce between a CRM, a form, their inbox,
              and DMs. BizPilot focuses on the gap before the job is booked:
              fast, organized quote recovery.
            </SectionLead>
          </div>

          <Card className="mt-9 overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table
                className="w-full min-w-[680px] border-collapse text-left text-[13px]"
                style={{ color: tone.soft }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      borderBottom: `1px solid ${tone.border}`,
                    }}
                  >
                    <th
                      className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.1em]"
                      style={{ color: tone.muted }}
                    >
                      What you want
                    </th>
                    <th
                      className="px-4 py-3 text-center text-[12px] font-extrabold"
                      style={{ color: "#2dd4bf" }}
                    >
                      BizPilot
                    </th>
                    <th
                      className="px-4 py-3 text-center text-[12px] font-extrabold"
                      style={{ color: tone.soft }}
                    >
                      Jobber / Housecall
                    </th>
                    <th
                      className="px-4 py-3 text-center text-[12px] font-extrabold"
                      style={{ color: tone.soft }}
                    >
                      Google Form + Inbox
                    </th>
                    <th
                      className="px-4 py-3 text-center text-[12px] font-extrabold"
                      style={{ color: tone.soft }}
                    >
                      Doing nothing
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    ["One inbox for every channel", "yes", "partial", "no", "no"],
                    ["Structured quote details", "yes", "yes", "partial", "no"],
                    ["AI reply + follow-up drafts", "yes", "no", "no", "no"],
                    ["Owner-reviewed (no auto-send)", "yes", "partial", "yes", "yes"],
                    ["Done-for-you setup", "yes", "no", "no", "no"],
                    ["Cancel anytime, export your data", "yes", "partial", "yes", "—"],
                    ["Monthly price floor", "$49", "$169+", "$0", "$0"],
                  ] as const).map(([feature, biz, jobber, gform, nothing]) => (
                    <tr key={feature} style={{ borderBottom: `1px solid ${tone.border}` }}>
                      <td
                        className="px-4 py-3 text-[13px] font-semibold"
                        style={{ color: tone.text }}
                      >
                        {feature}
                      </td>
                      {([biz, jobber, gform, nothing] as const).map((cell, index) => (
                        <td className="px-4 py-3 text-center" key={`${feature}-${index}`}>
                          <CompareCell value={cell} highlighted={index === 0} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p
              className="border-t px-4 py-3 text-[11px]"
              style={{ borderColor: tone.border, color: tone.muted }}
            >
              Comparison reflects the current pilot positioning: BizPilot is built to help{" "}
              <span style={{ color: tone.soft }}>before</span> the job is booked — not replace full
              field-service software. BizPilot is not pretending to be a full CRM or field-service
              platform.
            </p>
          </Card>
        </div>
      </section>

      {/* ──────── AI YOU CAN TRUST ──────── */}
      <section className="border-t px-4 py-16 sm:px-6" style={{ borderColor: tone.border }}>
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <Eyebrow>AI you can trust</Eyebrow>
            <SectionTitle>
              Assistant — <span style={{ color: "#2dd4bf" }}>not operator.</span>
            </SectionTitle>
            <SectionLead>
              BizPilot’s AI helps you respond faster. It never sends a message,
              quotes a price, promises availability, or decides if a job is a
              fit. Those decisions stay with you.
            </SectionLead>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "No auto-send",
                "No invented pricing",
                "No invented availability",
                "Owner-reviewed drafts",
                "Privacy-aware logs",
              ].map((item) => (
                <Pill key={item}>{item}</Pill>
              ))}
            </div>
          </div>

          <Card
            className="p-5"
            style={{
              background:
                "radial-gradient(circle at 8% 0%, rgba(20,184,166,0.14), transparent 38%), var(--biz-page-surface)",
              borderColor: "rgba(20,184,166,0.22)",
            }}
          >
            <p
              className="text-[11px] font-extrabold uppercase tracking-[0.08em]"
              style={{ color: "#2dd4bf" }}
            >
              AI lead summary
            </p>
            <p className="mt-2 text-[14px] leading-6" style={{ color: tone.text }}>
              Sarah is asking about a move-out cleaning in the Plateau before
              Friday. She hasn’t shared the apartment size or access details.
              Recommended action: ask for size, preferred date, and access notes
              before quoting a range.
            </p>
            <div className="mt-4 grid gap-2 text-[12px]">
              {[
                ["Source", "Instagram DM"],
                ["Service", "Move-out cleaning"],
                ["Area", "Plateau"],
                ["Missing", "Apartment size, access, exact date"],
                ["Risk", "Warm lead — reply within 1 hour"],
              ].map(([label, value]) => (
                <div
                  className="grid grid-cols-[110px_minmax(0,1fr)] gap-2 rounded-[10px] border p-2"
                  key={label}
                  style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: tone.border }}
                >
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.08em]"
                    style={{ color: tone.muted }}
                  >
                    {label}
                  </span>
                  <span style={{ color: tone.text }}>{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ──────── TESTIMONIALS (pilot-labeled) ──────── */}
      <section className="border-t px-4 py-16 sm:px-6" style={{ borderColor: tone.border }}>
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="max-w-[60ch]">
            <Eyebrow>What cleaning owners tell us in pilot calls</Eyebrow>
            <SectionTitle>What owners say when they see the workflow.</SectionTitle>
            <SectionLead>
              These quotes come from onboarding, discovery, and early pilot
              conversations. We label each one honestly.
            </SectionLead>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {[
              {
                initials: "AO",
                name: "Alex O.",
                business: "CleanPro Montreal",
                quote:
                  "I was missing quote DMs every weekend. After the pilot setup, I could see each one in the same place with the next step already written.",
                label: "PILOT 1 · ONBOARDING CALL",
              },
              {
                initials: "MV",
                name: "Maya V.",
                business: "Laval Fresh Cleaning",
                quote:
                  "What sold me was the part about not sending anything automatically. I tried tools that messaged my clients without me knowing — never again.",
                label: "PILOT 2 · DISCOVERY CALL",
              },
              {
                initials: "SP",
                name: "Sam P.",
                business: "Plateau Shine",
                quote:
                  "The reply drafts saved me time, but the bigger win was not losing track of who needed a follow-up.",
                label: "PILOT 3 · WEEK 1 CHECK-IN",
              },
            ].map((t) => (
              <Card className="p-5" key={t.name}>
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex h-10 w-10 items-center justify-center rounded-[12px] text-[12px] font-black"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(20,184,166,0.95), rgba(15,118,110,0.95))",
                      color: "white",
                    }}
                  >
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-[14px] font-extrabold" style={{ color: tone.text }}>
                      {t.name}
                    </p>
                    <p className="text-[12px]" style={{ color: tone.soft }}>
                      {t.business}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-[14px] leading-6" style={{ color: tone.text }}>
                  “{t.quote}”
                </p>
                <p
                  className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.1em]"
                  style={{ color: tone.muted }}
                >
                  {t.label}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── PRICING ──────── */}
      <section
        className="border-t px-4 py-16 sm:px-6"
        id="pricing"
        style={{ borderColor: tone.border }}
      >
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="max-w-[60ch]">
            <Eyebrow>Honest founder pricing</Eyebrow>
            <SectionTitle>Two pilot plans. No tricks.</SectionTitle>
            <SectionLead>
              Manual billing during Phase 18. We set you up first, tune the
              workflow to your business, and you stay in control. Cancel
              anytime; we’ll export your lead data on request.
            </SectionLead>
          </div>

          <div className="mt-9 grid gap-4 lg:grid-cols-2">
            {[
              {
                name: "Founder Setup",
                price: "$49",
                setup: "$199 one-time setup",
                ctaLabel: "Start free pilot",
                ctaHref: "/auth/sign-up",
                spotlight: false,
                features: [
                  "Branded quote link and quote page",
                  "Lead Recovery Queue + AI drafts",
                  "Owner-reviewed reply and follow-up flow",
                  "14-day pilot adjustment window",
                  "Email support",
                ],
              },
              {
                name: "Founder Plus",
                price: "$79",
                setup: "$299 one-time setup",
                ctaLabel: "Talk to the founder",
                ctaHref: "/auth/sign-up",
                spotlight: true,
                features: [
                  "Everything in Founder Setup",
                  "FAQ and AI guardrail tuning for your business",
                  "Public link placement help (IG bio, GBP, website)",
                  "Monthly optimization review",
                  "Priority pilot feedback channel",
                ],
              },
            ].map((plan) => (
              <Card
                className="relative p-6"
                key={plan.name}
                style={
                  plan.spotlight
                    ? {
                        background:
                          "radial-gradient(circle at 8% 0%, rgba(20,184,166,0.16), transparent 38%), var(--biz-page-surface)",
                        borderColor: "rgba(20,184,166,0.34)",
                        boxShadow: "0 30px 70px rgba(0,0,0,0.34)",
                      }
                    : undefined
                }
              >
                {plan.spotlight ? (
                  <span
                    className="absolute -top-2.5 right-4 rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em]"
                    style={{
                      backgroundColor: "rgba(20,184,166,0.20)",
                      borderColor: "rgba(20,184,166,0.36)",
                      color: "#2dd4bf",
                    }}
                  >
                    Recommended
                  </span>
                ) : null}
                <p
                  className="text-[13px] font-extrabold uppercase tracking-[0.08em]"
                  style={{ color: tone.soft }}
                >
                  {plan.name}
                </p>
                <p
                  className="mt-3 text-[40px] font-black tracking-[-0.045em]"
                  style={{ color: tone.text }}
                >
                  {plan.price}
                  <span
                    className="ml-1 text-[14px] font-bold"
                    style={{ color: tone.muted }}
                  >
                    / month
                  </span>
                </p>
                <p className="mt-1 text-[12px]" style={{ color: tone.muted }}>
                  {plan.setup}
                </p>
                <ul className="mt-5 grid gap-2">
                  {plan.features.map((feature) => (
                    <li
                      className="flex items-start gap-2 text-[13px] leading-5"
                      key={feature}
                      style={{ color: tone.soft }}
                    >
                      <span style={{ color: "#2dd4bf" }}>
                        <Icon name="check" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button
                    href={plan.ctaHref}
                    variant={plan.spotlight ? "primary" : "secondary"}
                  >
                    {plan.ctaLabel}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── FOUNDER NOTE ──────── */}
      <section className="border-t px-4 py-16 sm:px-6" style={{ borderColor: tone.border }}>
        <Card
          className="mx-auto w-full max-w-[920px] p-6 sm:p-8"
          style={{
            background:
              "radial-gradient(circle at 6% 0%, rgba(20,184,166,0.12), transparent 38%), var(--biz-page-surface)",
            borderColor: "rgba(20,184,166,0.22)",
          }}
        >
          <Eyebrow>A note from the founder</Eyebrow>
          <h2
            className="mt-2 text-[24px] font-extrabold leading-[1.2] tracking-[-0.02em] sm:text-[28px]"
            style={{ color: tone.text }}
          >
            We’re not building this to sound like AI. We’re building it because{" "}
            <span style={{ color: "#2dd4bf" }}>cleaning owners lose real jobs</span> when quote
            requests sit unanswered.
          </h2>
          <p className="mt-4 text-[14px] leading-7" style={{ color: tone.soft }}>
            BizPilot is in Phase 18A: a founder-led pilot with a small number of
            cleaning businesses in Montreal. Every onboarding is done by hand.
            If you join now, you get direct setup support, a workflow tuned to
            your tone, and a short adjustment window before you pay. In return,
            we get the honest feedback we need to earn the next 100 customers.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              aria-hidden
              className="flex h-10 w-10 items-center justify-center rounded-full text-[12px] font-black"
              style={{
                background: "linear-gradient(135deg, #2dd4bf, #10b981)",
                color: "#022c22",
              }}
            >
              M
            </span>
            <span>
              <span className="block text-[13px] font-extrabold" style={{ color: tone.text }}>
                MoOoH
              </span>
              <span
                className="block text-[11px] uppercase tracking-[0.08em]"
                style={{ color: tone.muted }}
              >
                Founder · BizPilot AI · Montreal
              </span>
            </span>
            <div className="ml-auto">
              <Button href="/auth/sign-up" variant="primary">
                Claim a pilot seat
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* ──────── FAQ ──────── */}
      <section className="border-t px-4 py-16 sm:px-6" id="faq" style={{ borderColor: tone.border }}>
        <div className="mx-auto w-full max-w-[920px]">
          <div className="max-w-[60ch]">
            <Eyebrow>Honest answers</Eyebrow>
            <SectionTitle>Frequently asked questions.</SectionTitle>
          </div>

          <div className="mt-8 grid gap-3">
            {[
              {
                q: "Does AI message my customers automatically?",
                a: "No. BizPilot prepares drafts. You review, edit, and send through your own channel. The product is built this way on purpose so you stay in control of every customer touchpoint.",
              },
              {
                q: "Is this a CRM?",
                a: "Not really. BizPilot focuses on what happens before a full CRM usually helps: capturing quote requests, organizing them fast, and helping you reply and follow up without losing the lead.",
              },
              {
                q: "How long does setup take?",
                a: "Done-for-you. Most pilot owners can be live quickly once we configure their profile, quote page, and reply guidance.",
              },
              {
                q: "What happens to my data?",
                a: "Lead data is stored with security controls and privacy-aware handling. AI calls are server-side, owner-reviewed, and not used to auto-message your customers. Export is available on request.",
              },
              {
                q: "Will this work for non-cleaning businesses?",
                a: "Cleaning is our first vertical because it is where we are validating fastest. The same intake-and-response engine can later support other local service businesses, but today the pilot is optimized for cleaning.",
              },
              {
                q: "Can I cancel?",
                a: "Yes. Cancel anytime. We can export your lead data on request.",
              },
            ].map((row) => (
              <Card className="p-4" key={row.q}>
                <details className="group">
                  <summary
                    className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-extrabold"
                    style={{ color: tone.text }}
                  >
                    {row.q}
                    <span
                      aria-hidden
                      className="transition group-open:rotate-180"
                      style={{ color: tone.muted }}
                    >
                      ▾
                    </span>
                  </summary>
                  <p className="mt-2.5 text-[13px] leading-6" style={{ color: tone.soft }}>
                    {row.a}
                  </p>
                </details>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── FINAL CTA ──────── */}
      <section className="px-4 py-16 sm:px-6">
        <Card
          className="mx-auto w-full max-w-[1200px] p-8 sm:p-10"
          style={{
            background:
              "radial-gradient(circle at 10% 0%, rgba(20,184,166,0.20), transparent 36%), radial-gradient(circle at 90% 10%, rgba(45,212,191,0.14), transparent 28%), var(--biz-page-surface)",
            borderColor: "rgba(20,184,166,0.32)",
            boxShadow: "0 40px 90px rgba(0,0,0,0.40)",
          }}
        >
          <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="max-w-[58ch]">
              <Eyebrow>Pilot now open</Eyebrow>
              <h2
                className="mt-2 text-[32px] font-extrabold leading-[1.06] tracking-[-0.035em] sm:text-[40px]"
                style={{ color: tone.text }}
              >
                Stop letting warm cleaning leads go cold.
              </h2>
              <p className="mt-3 max-w-[60ch] text-[15px] leading-7" style={{ color: tone.soft }}>
                Three pilot seats are open this month. Start free, get set up by
                hand, and see your quote requests in one calm workspace before
                you pay.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Button href="/auth/sign-up" variant="primary">
                Start free pilot
              </Button>
              <Button href="#pricing" variant="secondary">
                See pricing
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* ──────── FOOTER ──────── */}
      <footer className="border-t px-4 py-8 sm:px-6" style={{ borderColor: tone.border }}>
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 text-[12px]">
          <BrandMark />
          <div className="flex flex-wrap items-center gap-4" style={{ color: tone.soft }}>
            <Link className="hover:opacity-80" href="/auth/sign-in">
              Sign in
            </Link>
            <Link className="hover:opacity-80" href="/auth/sign-up">
              Start pilot
            </Link>
            <Link className="hover:opacity-80" href="#pricing">
              Pricing
            </Link>
            <Link className="hover:opacity-80" href="#faq">
              FAQ
            </Link>
          </div>
          <span style={{ color: tone.muted }}>
            © {new Date().getFullYear()} BizPilot AI — Quote Recovery Command Center
          </span>
        </div>
      </footer>
    </main>
  );
}

// ───────── Helpers ─────────

function CompareCell({
  value,
  highlighted,
}: Readonly<{ value: string; highlighted: boolean }>) {
  if (value === "yes") {
    return (
      <span
        aria-label="Yes"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full"
        style={{
          backgroundColor: highlighted ? "rgba(20,184,166,0.18)" : "rgba(255,255,255,0.06)",
          color: highlighted ? "#2dd4bf" : tone.soft,
        }}
      >
        <Icon name="check" />
      </span>
    );
  }
  if (value === "no") {
    return (
      <span
        aria-label="No"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(255,71,87,0.10)", color: "#FF8A95" }}
      >
        <Icon name="x" />
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span
        aria-label="Partial"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(255,171,0,0.14)", color: tone.warning }}
      >
        <Icon name="minus" />
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center justify-center text-[13px] font-extrabold"
      style={{ color: highlighted ? "#2dd4bf" : tone.text }}
    >
      {value}
    </span>
  );
}
