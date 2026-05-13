/**
 * ============================================================
 * File: components/dashboard/dashboard-ui.tsx
 * Project: BizPilot AI
 * Description: Shared dashboard UI primitives for the protected SaaS workspace.
 * Role: Provides reusable cards, headers, metrics, badges, rails, actions, and empty states.
 * Related:
 * - components/dashboard/dashboard-shell.tsx
 * - app/(dashboard)/dashboard/page.tsx
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-05-11
 * Change Log:
 * - 2026-05-10: Added reusable SaaS dashboard presentation primitives.
 * - 2026-05-11: Expanded primitives for a production-grade quote recovery cockpit.
 * ============================================================
 */

import Link from "next/link";

type CardVariant = "default" | "elevated" | "muted" | "priority";
type Tone = "amber" | "blue" | "emerald" | "neutral" | "red" | "violet";

type CardProps = Readonly<{
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
}>;

type PageHeaderProps = Readonly<{
  actions?: React.ReactNode;
  eyebrow?: string;
  title: string;
  description: string;
}>;

type SectionHeaderProps = Readonly<{
  action?: React.ReactNode;
  title: string;
  description?: string;
}>;

type KpiCardProps = Readonly<{
  label: string;
  value: string | number;
  detail?: string;
}>;

type MetricCardProps = Readonly<{
  cta?: React.ReactNode;
  detail?: string;
  label: string;
  tone?: Tone;
  value: string | number;
}>;

type StatusBadgeProps = Readonly<{
  children: React.ReactNode;
  tone?: Tone;
}>;

type TabLinkProps = Readonly<{
  active?: boolean;
  children: React.ReactNode;
  href: string;
}>;

type EmptyStateProps = Readonly<{
  action?: React.ReactNode;
  children: React.ReactNode;
  title: string;
}>;

export const buttonClass =
  "inline-flex h-9 items-center justify-center rounded-[9px] border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50";

export const primaryButtonClass =
  "inline-flex h-9 items-center justify-center rounded-[9px] bg-slate-950 px-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800";

export const ghostButtonClass =
  "inline-flex h-9 items-center justify-center rounded-[9px] px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950";

export const disabledButtonClass =
  "inline-flex h-9 cursor-not-allowed items-center justify-center rounded-[9px] border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-400";

export const inputClass =
  "h-9 w-full rounded-[9px] border border-slate-200 bg-white px-3 text-xs text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950";

export const textareaClass =
  "w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-xs text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950";

export const labelClass = "grid gap-1.5 text-xs font-medium text-slate-800";

const toneClasses: Record<Tone, string> = {
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  blue: "border-blue-200 bg-blue-50 text-blue-800",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
  neutral: "border-zinc-200 bg-zinc-50 text-zinc-700",
  red: "border-red-200 bg-red-50 text-red-700",
  violet: "border-violet-200 bg-violet-50 text-violet-800",
};

function humanize(value: string): string {
  return value.replaceAll("_", " ");
}

function cardClass(variant: CardVariant): string {
  const variants: Record<CardVariant, string> = {
    default: "border-slate-200 bg-white shadow-sm",
    elevated: "border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.08)]",
    muted: "border-slate-200 bg-slate-50 shadow-sm",
    priority:
      "border-violet-200 bg-[linear-gradient(180deg,#ffffff_0%,#faf7ff_100%)] shadow-[0_12px_35px_rgba(109,40,217,0.10)]",
  };

  return variants[variant];
}

export function DashboardCard({
  children,
  className = "",
  variant = "default",
}: CardProps) {
  return (
    <section className={`rounded-[12px] border ${cardClass(variant)} ${className}`}>
      {children}
    </section>
  );
}

export function PageHeader({
  actions,
  description,
  eyebrow,
  title,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-3 border-b border-slate-200 pb-3.5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 text-[26px] font-semibold leading-8 tracking-normal text-slate-950">
          {title}
        </h1>
        <p className="mt-1 max-w-3xl text-sm leading-5 text-slate-600">
          {description}
        </p>
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
      ) : null}
    </header>
  );
}

export function SectionHeader({
  action,
  description,
  title,
}: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-5 text-slate-950">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 text-xs leading-5 text-slate-600">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function MetricCard({
  cta,
  detail,
  label,
  tone = "neutral",
  value,
}: MetricCardProps) {
  const accentClass = {
    amber: "text-amber-700",
    blue: "text-blue-700",
    emerald: "text-emerald-700",
    neutral: "text-zinc-950",
    red: "text-red-700",
    violet: "text-violet-700",
  }[tone];

  return (
    <DashboardCard className="flex min-h-[120px] flex-col p-3.5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1.5 text-[22px] font-semibold leading-7 ${accentClass}`}>
        {value}
      </p>
      {detail ? (
        <p className="mt-1.5 text-xs leading-4 text-slate-500">{detail}</p>
      ) : null}
      {cta ? <div className="mt-auto pt-3">{cta}</div> : null}
    </DashboardCard>
  );
}

export function KpiCard({ detail, label, value }: KpiCardProps) {
  return (
    <MetricCard
      label={label}
      value={value}
      {...(detail ? { detail } : {})}
    />
  );
}

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex h-[22px] max-w-full items-center justify-center rounded-full border px-2 text-[11px] font-medium capitalize leading-none ${toneClasses[tone]}`}
    >
      <span className="truncate">{children}</span>
    </span>
  );
}

export function LeadQualityBadge({ value }: Readonly<{ value: string }>) {
  const tone: Tone =
    value === "strong"
      ? "emerald"
      : value === "good"
        ? "blue"
        : value === "needs_info"
          ? "amber"
          : "red";

  return <StatusBadge tone={tone}>{humanize(value)}</StatusBadge>;
}

export function ResponseSlaBadge({ value }: Readonly<{ value: string }>) {
  const tone: Tone =
    value === "overdue"
      ? "red"
      : value.includes("follow")
        ? "amber"
        : value.includes("copied") || value.includes("replied")
          ? "emerald"
          : value.includes("new") || value.includes("viewed")
            ? "blue"
            : "neutral";

  return <StatusBadge tone={tone}>{humanize(value)}</StatusBadge>;
}

export function LeadStatusBadge({ value }: Readonly<{ value: string }>) {
  const tone: Tone =
    value === "lost" || value === "archived"
      ? "red"
      : value === "booked" || value === "replied"
        ? "emerald"
        : value === "follow_up_needed"
          ? "amber"
          : value === "new" || value === "reviewed"
            ? "blue"
            : "neutral";

  return <StatusBadge tone={tone}>{humanize(value)}</StatusBadge>;
}

export function TabLink({ active = false, children, href }: TabLinkProps) {
  return (
    <Link
      className={
        active
          ? "inline-flex h-8 items-center rounded-md bg-zinc-950 px-3 text-xs font-medium text-white"
          : "inline-flex h-8 items-center rounded-md px-3 text-xs font-medium text-zinc-600 hover:bg-white hover:text-zinc-950"
      }
      href={href}
    >
      {children}
    </Link>
  );
}

export function RightRailPanel({
  children,
  className = "",
  variant = "default",
}: CardProps) {
  return (
    <DashboardCard className={`p-3.5 ${className}`} variant={variant}>
      {children}
    </DashboardCard>
  );
}

export function PriorityAction({
  children,
  href,
  label,
  tone = "neutral",
  value,
}: Readonly<{
  children: React.ReactNode;
  href: string;
  label: string;
  tone?: Tone;
  value: string | number;
}>) {
  return (
    <Link
      className={`grid gap-1 rounded-[10px] border px-3 py-2 transition hover:shadow-sm ${toneClasses[tone]}`}
      href={href}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wide">
        {label}
      </span>
      <span className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-medium">{children}</span>
        <span className="text-base font-semibold">{value}</span>
      </span>
    </Link>
  );
}

export function QuickActionTile({
  children,
  description,
  disabled = false,
  href,
  icon,
  title,
}: Readonly<{
  children?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  href?: string;
  icon?: string;
  title?: string;
}>) {
  const className =
    "flex min-h-12 items-center gap-2.5 rounded-[10px] border px-3 text-left transition";
  const content = title ? (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
        {icon ?? "A"}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold text-slate-950">
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block truncate text-[11px] text-slate-500">
            {description}
          </span>
        ) : null}
      </span>
    </>
  ) : (
    children
  );

  if (disabled || !href) {
    return (
      <button
        className={`${className} cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400`}
        disabled
        type="button"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      className={`${className} border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50`}
      href={href}
    >
      {content}
    </Link>
  );
}

export function EmptyState({ action, children, title }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-center">
      <p className="text-sm font-semibold text-zinc-950">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-[13px] leading-5 text-zinc-600">
        {children}
      </p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
