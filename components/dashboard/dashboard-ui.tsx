/**
 * ============================================================
 * File: components/dashboard/dashboard-ui.tsx
 * Project: BizPilot AI
 * Description: Shared dashboard UI primitives for the protected SaaS workspace.
 * Role: Provides reusable cards, page headers, KPI blocks, tabs, badges, and empty states.
 * Related:
 * - components/dashboard/dashboard-shell.tsx
 * - app/(dashboard)/dashboard/page.tsx
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-05-10
 * Change Log:
 * - 2026-05-10: Added reusable SaaS dashboard presentation primitives.
 * ============================================================
 */

import Link from "next/link";

type CardProps = Readonly<{
  children: React.ReactNode;
  className?: string;
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

type StatusBadgeProps = Readonly<{
  children: React.ReactNode;
  tone?: "amber" | "blue" | "emerald" | "neutral" | "red";
}>;

type TabLinkProps = Readonly<{
  active?: boolean;
  children: React.ReactNode;
  href: string;
}>;

export const buttonClass =
  "inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50";

export const primaryButtonClass =
  "inline-flex h-8 items-center justify-center rounded-md bg-zinc-950 px-3 text-xs font-medium text-white shadow-sm transition hover:bg-zinc-800";

export const inputClass =
  "h-8 w-full rounded-md border border-zinc-300 bg-white px-2.5 text-xs text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950";

export const textareaClass =
  "w-full rounded-md border border-zinc-300 bg-white px-2.5 py-2 text-xs text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950";

export const labelClass = "grid gap-1 text-xs font-medium text-zinc-800";

export function DashboardCard({ children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-lg border border-zinc-200 bg-white shadow-sm ${className}`}
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
    <header className="flex flex-col gap-3 border-b border-zinc-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 text-xl font-semibold tracking-normal text-zinc-950">
          {title}
        </h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-zinc-600">
          {description}
        </p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export function SectionHeader({ action, description, title }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold text-zinc-950">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs leading-5 text-zinc-600">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function KpiCard({ detail, label, value }: KpiCardProps) {
  return (
    <DashboardCard className="p-3">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-zinc-950">{value}</p>
      {detail ? <p className="mt-1 text-xs text-zinc-500">{detail}</p> : null}
    </DashboardCard>
  );
}

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  const toneClass = {
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    neutral: "border-zinc-200 bg-zinc-50 text-zinc-700",
    red: "border-red-200 bg-red-50 text-red-700",
  }[tone];

  return (
    <span
      className={`inline-flex h-6 items-center rounded-full border px-2 text-xs font-medium capitalize ${toneClass}`}
    >
      {children}
    </span>
  );
}

export function TabLink({ active = false, children, href }: TabLinkProps) {
  return (
    <Link
      className={
        active
          ? "inline-flex h-8 items-center rounded-md bg-zinc-950 px-3 text-xs font-medium text-white"
          : "inline-flex h-8 items-center rounded-md px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
      }
      href={href}
    >
      {children}
    </Link>
  );
}

export function EmptyState({
  children,
  title,
}: Readonly<{ children: React.ReactNode; title: string }>) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
      <p className="text-sm font-medium text-zinc-950">{title}</p>
      <p className="mt-1 text-sm text-zinc-600">{children}</p>
    </div>
  );
}
