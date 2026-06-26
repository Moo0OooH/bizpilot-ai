/**
 * ============================================================
 * File: components/dashboard/dashboard-ui.tsx
 * Project: BizPilot AI
 * Description: Shared command-center UI primitives for the protected SaaS workspace.
 * Role: Provides reusable cards, headers, metrics, badges, forms, rails, actions, and empty states.
 * Related:
 * - components/dashboard/dashboard-shell.tsx
 * - app/(dashboard)/dashboard/page.tsx
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-05-19
 * Change Log:
 * - 2026-05-19: Rebuilt primitives to follow the approved index.html Quote Recovery Command Center visual system.
 * ============================================================
 */

import Link from "next/link";

export type CardVariant = "default" | "elevated" | "muted" | "priority";
export type Tone = "amber" | "blue" | "emerald" | "neutral" | "red";

type CardProps = Readonly<{
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
}>;

type PageHeaderProps = Readonly<{
  actions?: React.ReactNode;
  description: string;
  eyebrow?: string;
  title: string;
}>;

type SectionHeaderProps = Readonly<{
  action?: React.ReactNode;
  description?: string;
  title: string;
}>;

type KpiCardProps = Readonly<{
  detail?: string;
  label: string;
  value: string | number;
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
  "biz-button-secondary inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-bold leading-none shadow-sm transition hover:border-[var(--dash-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dash-bg)]";

export const primaryButtonClass =
  "biz-button-primary inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13px] font-bold leading-none shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dash-bg)]";

export const ghostButtonClass =
  "biz-button-ghost inline-flex min-h-9 items-center justify-center rounded-lg px-3 py-2 text-[13px] font-bold leading-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dash-bg)]";

export const disabledButtonClass =
  "inline-flex min-h-9 cursor-not-allowed items-center justify-center rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2 text-[13px] font-bold leading-none text-[var(--dash-text-muted)] opacity-60";

export const inputClass =
  "biz-field min-h-10 w-full rounded-lg border px-3 py-2 text-sm outline-none transition placeholder:text-[var(--dash-text-muted)] focus:border-[var(--dash-primary)] focus-visible:ring-4 focus-visible:ring-[var(--dash-primary-soft)]";

export const textareaClass =
  "biz-field w-full rounded-lg border px-3 py-2.5 text-sm leading-6 outline-none transition placeholder:text-[var(--dash-text-muted)] focus:border-[var(--dash-primary)] focus-visible:ring-4 focus-visible:ring-[var(--dash-primary-soft)]";

export const labelClass =
  "grid gap-1.5 text-sm font-semibold text-[var(--dash-text)]";

const toneClasses: Record<Tone, string> = {
  amber:
    "border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] text-[var(--dash-warning-strong)]",
  blue:
    "border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] text-[var(--dash-primary-strong)]",
  emerald:
    "border-[var(--dash-success-border)] bg-[var(--dash-success-soft)] text-[var(--dash-success-strong)]",
  neutral:
    "border-[var(--dash-border-strong)] bg-[var(--dash-surface-muted)] text-[var(--dash-text-secondary)]",
  red:
    "border-[var(--dash-danger-border)] bg-[var(--dash-danger-soft)] text-[var(--dash-danger-strong)]",
};

const toneDotClasses: Record<Tone, string> = {
  amber: "bg-amber-500",
  blue: "bg-blue-600",
  emerald: "bg-emerald-500",
  neutral: "bg-[var(--dash-text-muted)]",
  red: "bg-red-500",
};

function humanize(value: string): string {
  return value.replaceAll("_", " ");
}

/**
 * Compact initials helper for avatars (max 2 chars).
 * "Sarah Mansfield" -> "SM"; "Mohammad Ghoorchibeigi" -> "MG"; null -> "?".
 */
export function initials(value: string | null | undefined): string {
  if (!value) return "?";
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) {
    return (parts[0]?.slice(0, 2) ?? "?").toUpperCase();
  }
  return `${parts[0]?.charAt(0) ?? ""}${parts[1]?.charAt(0) ?? ""}`.toUpperCase();
}

/**
 * Privacy-aware short customer name for tables.
 * "Sarah Mansfield" -> "Sarah M."; "Mohammad Ghoorchibeigi" -> "Mohammad G.".
 * Single-word names pass through.
 */
export function shortCustomerName(
  value: string | null | undefined,
  fallback: string,
): string {
  if (!value) return fallback;
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0] ?? fallback;
  return `${parts[0]} ${(parts[1]?.charAt(0) ?? "").toUpperCase()}.`;
}

export type AvatarTone = "primary" | "soft";

/**
 * Index-aligned avatar — 42px primary teal gradient (lead detail headers) or
 * soft slate variant for table rows. Renders only initials so customer PII is
 * not pasted into UI surfaces by accident.
 */
export function Avatar({
  name,
  size = 36,
  tone = "soft",
}: Readonly<{ name: string | null | undefined; size?: number; tone?: AvatarTone }>) {
  const base =
    tone === "primary"
      ? "bg-gradient-to-br from-[rgba(20,184,166,0.95)] to-[rgba(15,118,110,0.95)] text-white"
      : "bg-[var(--dash-surface-muted)] text-[var(--dash-text)] border border-[var(--dash-border)]";
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-lg font-black ${base}`}
      style={{
        height: `${size}px`,
        width: `${size}px`,
        fontSize: `${Math.max(11, Math.round(size * 0.34))}px`,
      }}
    >
      {initials(name)}
    </span>
  );
}

function cardClass(variant: CardVariant): string {
  const variants: Record<CardVariant, string> = {
    default: "biz-card",
    elevated: "biz-card biz-card-elevated",
    muted: "biz-card-muted",
    priority: "biz-card-priority",
  };

  return variants[variant];
}

export function DashboardCard({
  children,
  className = "",
  variant = "default",
}: CardProps) {
  return (
    <section
      className={`min-w-0 overflow-hidden rounded-lg border ${cardClass(variant)} ${className}`}
    >
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
    <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 text-[22px] font-extrabold leading-[1.15] text-[var(--dash-text)] sm:text-[24px]">
          {title}
        </h1>
        <p className="mt-1 max-w-3xl text-[13px] leading-5 text-[var(--dash-text-secondary)]">
          {description}
        </p>
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">{actions}</div>
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
        <h2 className="text-[15px] font-extrabold leading-5 text-[var(--dash-text)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            {description}
          </p>
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
  const accentClass: Record<Tone, string> = {
    amber: "text-amber-600 dark:text-amber-300",
    blue: "text-sky-600 dark:text-sky-300",
    emerald: "text-emerald-600 dark:text-emerald-300",
    neutral: "text-[var(--dash-text)]",
    red: "text-red-600 dark:text-red-300",
  };

  return (
    <DashboardCard className="flex min-h-[104px] flex-col p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12px] font-bold text-[var(--dash-text-muted)]">
          {label}
        </p>
        <span className={`mt-1 h-1.5 w-1.5 rounded-full ${toneDotClasses[tone]}`} />
      </div>
      <p className={`mt-2 text-[24px] font-black leading-none sm:text-[26px] ${accentClass[tone]}`}>
        {value}
      </p>
      {detail ? (
        <p className="mt-1.5 text-[11px] leading-4 text-[var(--dash-text-secondary)]">
          {detail}
        </p>
      ) : null}
      {cta ? <div className="mt-auto pt-2.5">{cta}</div> : null}
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
      className={`inline-flex min-h-6 max-w-full items-center justify-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-extrabold leading-none ${toneClasses[tone]}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${toneDotClasses[tone]}`} />
      <span className="whitespace-nowrap capitalize">{children}</span>
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
          ? "inline-flex min-h-9 items-center rounded-lg border border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] px-3 text-xs font-extrabold text-[var(--dash-text)]"
          : "inline-flex min-h-9 items-center rounded-lg border border-[var(--dash-border)] px-3 text-xs font-extrabold text-[var(--dash-text-secondary)] transition hover:bg-[var(--dash-primary-soft)] hover:text-[var(--dash-text)]"
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
      className={`grid gap-1 rounded-lg border px-3 py-2.5 transition hover:border-[var(--dash-primary)] ${toneClasses[tone]}`}
      href={href}
    >
      <span className="text-[11px] font-extrabold uppercase tracking-[0.14em]">
        {label}
      </span>
      <span className="flex items-center justify-between gap-3">
        <span className="text-sm font-extrabold">{children}</span>
        <span className="text-lg font-black">{value}</span>
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
    "flex min-h-14 items-center gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-3 text-left transition";

  const content = title ? (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--dash-primary-soft)] text-sm font-extrabold text-[var(--dash-primary)]">
        {icon ?? "A"}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-extrabold text-[var(--dash-text)]">
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block text-[12px] leading-4 text-[var(--dash-text-secondary)]">
            {description}
          </span>
        ) : null}
      </span>
      {children ? <span className="ml-auto shrink-0">{children}</span> : null}
    </>
  ) : (
    children
  );

  if (disabled || !href) {
    return (
      <div className={`${className} opacity-65`} aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link className={`${className} hover:border-[rgba(20,184,166,0.34)] hover:bg-[var(--dash-primary-soft)]`} href={href}>
      {content}
    </Link>
  );
}

export function EmptyState({ action, children, title }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--dash-border-strong)] bg-[var(--dash-surface-muted)] p-5 text-center">
      <p className="text-sm font-extrabold text-[var(--dash-text)]">{title}</p>
      <p className="mx-auto mt-1 max-w-xl text-[13px] leading-5 text-[var(--dash-text-secondary)]">
        {children}
      </p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
