/**
 * ============================================================
 * File: app/(dashboard)/dashboard/settings/page.tsx
 * Project: BizPilot AI
 * Description: Owner workspace settings — account, theme, future sections.
 * Role: Three-card layout matching the approved index.html. Account exposes sign-out; theme uses the hydration-safe DashboardThemeSelector; future sections are visible as disabled roadmap placeholders per the v1.6 Not-Now list.
 * Related:
 * - components/dashboard/dashboard-theme.tsx
 * - server/actions/auth.actions.ts
 * - docs/BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md
 * Author: MoOoH
 * Created: 2026-05-18
 * Last Updated: 2026-05-19
 * Change Log:
 * - 2026-05-18: Created Settings shell.
 * - 2026-05-19: Rebuilt as three-card row exactly matching the index — Account, Theme, Future — and added a sticky workspace-info side panel + scope guard.
 * ============================================================
 */

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardThemeSelector } from "@/components/dashboard/dashboard-theme";
import { WorkspaceDeletionRequestForm } from "@/components/dashboard/workspace-deletion-request-form";
import {
  buttonClass,
  DashboardCard,
  inputClass,
  disabledButtonClass,
  PageHeader,
  primaryButtonClass,
  SectionHeader,
  StatusBadge,
} from "@/components/dashboard/dashboard-ui";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import { canUserRequestWorkspaceDeletion } from "@/lib/business-deletion/owner-eligibility";
import {
  INTERFACE_LANGUAGE_COOKIE,
  languageLabels,
  resolveWorkspaceInterfaceLanguage,
  supportedLanguages,
} from "@/lib/i18n/language";
import { signOutAction } from "@/server/actions/auth.actions";
import { updateWorkspaceLanguageAction } from "@/server/actions/business-configuration.actions";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";
import {
  getOwnerSystemChangeLog,
  type OwnerSystemChangeLogItem,
} from "@/server/services/owner-system-log.service";

export const dynamic = "force-dynamic";

type SettingsPageProps = Readonly<{
  searchParams?: Promise<{
    error?: string;
    notice?: string;
  }>;
}>;

function formatSettingsDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatSettingsJsonValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "boolean") {
    return value ? "on" : "off";
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    return value.replaceAll("_", " ");
  }

  if (Array.isArray(value)) {
    return value.map((item) => formatSettingsJsonValue(item)).join(", ");
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => `${key.replaceAll("_", " ")}: ${formatSettingsJsonValue(item)}`)
      .join("; ");
  }

  return String(value);
}

function formatOwnerActionChange(action: OwnerSystemChangeLogItem): string {
  if (action.actionType === "internal_note_added") {
    return "Support note updated";
  }

  const previous = formatSettingsJsonValue(action.previousValues);
  const next = formatSettingsJsonValue(action.newValues);

  if (!previous && !next) {
    return "";
  }

  return previous ? `${previous} -> ${next}` : next;
}

function formatSessionPolicyLabel(input: {
  alwaysOn: string;
  afterDuration: (minutes: number) => string;
  minutes: number | null;
  mode: string | null | undefined;
}): string {
  if (input.mode === "after_duration") {
    return input.afterDuration(input.minutes ?? 480);
  }

  return input.alwaysOn;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const [query, user] = await Promise.all([searchParams, getCurrentUser()]);
  if (!user) redirect("/auth/sign-in");

  const workspace = await getBusinessWorkspace({ userId: user.id });
  const activeBusiness = workspace.businesses[0];
  if (!activeBusiness) redirect("/dashboard");
  const lifecycleStatus = activeBusiness.lifecycle_status ?? "active";
  const businessStatus = activeBusiness.status ?? "active";
  const canRequestWorkspaceDeletion = canUserRequestWorkspaceDeletion({
    business: {
      lifecycleStatus,
      status: businessStatus,
    },
    businessId: activeBusiness.id,
    memberships: workspace.memberships.map((membership) => ({
      businessId: membership.business_id,
      role: membership.role,
      status: membership.status,
      userId: membership.user_id,
    })),
    userId: user.id,
  });
  const activeLanguage = resolveWorkspaceInterfaceLanguage({
    businessLanguage: activeBusiness.preferred_language,
    cookieLanguage: (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  });
  const copy = getBizPilotCopy(activeLanguage).dashboard;
  const settingsCopy = copy.settings;
  const systemChangeLog = await getOwnerSystemChangeLog({
    businessId: activeBusiness.id,
    userId: user.id,
  });
  const sessionPolicy = formatSessionPolicyLabel({
    afterDuration: settingsCopy.sessionPolicy.afterDuration,
    alwaysOn: settingsCopy.sessionPolicy.alwaysOn,
    minutes: activeBusiness.session_timeout_minutes ?? null,
    mode: activeBusiness.session_timeout_mode ?? "always_on",
  });

  return (
    <main className="space-y-4">
      <PageHeader
        description={settingsCopy.workspaceDescription}
        eyebrow={settingsCopy.workspace}
        title={copy.pages.settings.title}
      />

      {query?.notice ? (
        <p className="rounded-[12px] border border-[#17D492]/25 bg-[#17D492]/10 p-3 text-sm font-semibold text-[#0F8F63] dark:text-[#8DF4C7]">
          {query.notice}
        </p>
      ) : null}
      {query?.error ? (
        <p className="rounded-[12px] border border-red-400/25 bg-red-500/10 p-3 text-sm font-semibold text-red-700 dark:text-red-200">
          {query.error}
        </p>
      ) : null}

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4">
          <section className="grid min-w-0 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            <DashboardCard className="p-[22px]" variant="elevated">
              <SectionHeader title={settingsCopy.account} />
              <div className="my-3 h-px bg-[var(--dash-border)]" />
              <div className="space-y-3">
                <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
                    {settingsCopy.signedInAs}
                  </p>
                  <p className="mt-1 break-all text-sm font-extrabold text-[var(--dash-text)]">
                    {user.email ?? user.id}
                  </p>
                </div>
                <form action={signOutAction}>
                  <button className={`${buttonClass} w-full`} type="submit">
                    {copy.actions.signOut}
                  </button>
                </form>
              </div>
            </DashboardCard>

            <DashboardCard className="p-[22px]">
              <SectionHeader
                description={settingsCopy.languageDescription}
                title={settingsCopy.language}
              />
              <div className="my-3 h-px bg-[var(--dash-border)]" />
              <form action={updateWorkspaceLanguageAction} className="grid gap-3">
                <input name="businessId" type="hidden" value={activeBusiness.id} />
                <input name="redirectTo" type="hidden" value="/dashboard/settings" />
                <label className="grid gap-1.5 text-sm font-semibold text-[var(--dash-text)]">
                  {settingsCopy.language}
                  <select
                    className={inputClass}
                    defaultValue={activeLanguage}
                    name="language"
                  >
                    {supportedLanguages.map((language) => (
                      <option key={language} value={language}>
                        {languageLabels[language]}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {settingsCopy.languageHelp}
                </p>
                <button className={`${buttonClass} w-full`} type="submit">
                  {copy.actions.saveConfiguration}
                </button>
              </form>
            </DashboardCard>

            <DashboardCard className="p-[22px]">
              <SectionHeader
                description={settingsCopy.themeDescription}
                title={settingsCopy.theme}
              />
              <div className="my-3 h-px bg-[var(--dash-border)]" />
              <div className="flex flex-col gap-3">
                <DashboardThemeSelector />
                <p className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {settingsCopy.themeHelp}
                </p>
              </div>
            </DashboardCard>

            <DashboardCard className="p-[22px]">
              <SectionHeader
                description={settingsCopy.sessionPolicy.description}
                title={settingsCopy.sessionPolicy.title}
              />
              <div className="my-3 h-px bg-[var(--dash-border)]" />
              <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
                  {settingsCopy.sessionPolicy.title}
                </p>
                <p className="mt-1 text-sm font-extrabold text-[var(--dash-text)]">
                  {sessionPolicy}
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {settingsCopy.sessionPolicy.managedByFounder}
                </p>
              </div>
            </DashboardCard>

            <DashboardCard className="p-[22px]">
              <SectionHeader
                description={settingsCopy.futureSectionsDescription}
                title={settingsCopy.futureSections}
              />
              <div className="my-3 h-px bg-[var(--dash-border)]" />
              <div className="space-y-2">
                {[
                  [settingsCopy.billing, settingsCopy.futureSectionHints.billing],
                  [settingsCopy.teamMembers, settingsCopy.futureSectionHints.teamMembers],
                  [settingsCopy.integrations, settingsCopy.futureSectionHints.integrations],
                ].map(([title, hint]) => (
                  <div
                    className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
                    key={title}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-extrabold text-[var(--dash-text)]">
                        {title}
                      </p>
                      <StatusBadge>{settingsCopy.future}</StatusBadge>
                    </div>
                    <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                      {hint}
                    </p>
                    <button
                      className={`${disabledButtonClass} mt-3 w-full`}
                      type="button"
                    >
                      {settingsCopy.notInMvp}
                    </button>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </section>

          <DashboardCard className="p-[22px]">
            <SectionHeader
              description={settingsCopy.guardrailsDescription}
              title={settingsCopy.guardrails}
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {settingsCopy.guardrailItems.map((item) => (
                <p
                  className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 text-[13px] leading-6 text-[var(--dash-text-secondary)]"
                  key={item}
                >
                  {item}
                </p>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard className="p-[22px]">
            <SectionHeader
              description={settingsCopy.systemHistory.description}
              title={settingsCopy.systemHistory.title}
            />
            <div className="mt-4 divide-y divide-[var(--dash-border)] overflow-hidden rounded-[16px] border border-[var(--dash-border)]">
              {systemChangeLog.length > 0 ? (
                systemChangeLog.map((action) => (
                  <div
                    className="grid gap-2 bg-[var(--dash-surface-muted)] px-4 py-3 text-[12px] sm:grid-cols-[160px_minmax(0,1fr)_100px]"
                    key={action.id}
                  >
                    <div>
                      <p className="font-extrabold text-[var(--dash-text)]">
                        {settingsCopy.systemHistory.actions[action.actionType] ??
                          settingsCopy.systemHistory.changeFallback}
                      </p>
                      <p className="mt-1 font-semibold text-[var(--dash-text-muted)]">
                        {formatSettingsDate(action.createdAt)}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="break-words leading-5 text-[var(--dash-text-secondary)]">
                        {formatOwnerActionChange(action) ||
                          settingsCopy.systemHistory.changeFallback}
                      </p>
                      {action.note ? (
                        <p className="mt-1 break-words leading-5 text-[var(--dash-text-muted)]">
                          {settingsCopy.systemHistory.noteLabel}: {action.note}
                        </p>
                      ) : null}
                    </div>
                    <span className="rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3 py-1.5 text-center font-extrabold text-[var(--dash-text-secondary)]">
                      {settingsCopy.systemHistory.traceLabel} {action.id.slice(0, 8)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="bg-[var(--dash-surface-muted)] px-4 py-5 text-center">
                  <p className="text-sm font-extrabold text-[var(--dash-text)]">
                    {settingsCopy.systemHistory.emptyTitle}
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                    {settingsCopy.systemHistory.emptyBody}
                  </p>
                </div>
              )}
            </div>
          </DashboardCard>

          <DashboardCard className="p-[22px]">
            <SectionHeader
              description={settingsCopy.lifecycle.description}
              title={settingsCopy.lifecycle.title}
            />
            <div className="my-3 h-px bg-[var(--dash-border)]" />
            <div className="mb-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
                  {settingsCopy.lifecycle.lifecycleStatus}
                </p>
                <p className="mt-1 text-sm font-extrabold text-[var(--dash-text)]">
                  {lifecycleStatus.replaceAll("_", " ")}
                </p>
              </div>
              <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
                  {settingsCopy.lifecycle.lockBehavior}
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {settingsCopy.lifecycle.lockBehaviorDescription}
                </p>
              </div>
            </div>
            {canRequestWorkspaceDeletion ? (
              <WorkspaceDeletionRequestForm
                businessId={activeBusiness.id}
                businessName={activeBusiness.name}
                copy={settingsCopy.deletionForm}
              />
            ) : (
              <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                <p className="text-sm font-extrabold text-[var(--dash-text)]">
                  {settingsCopy.lifecycle.deletionIneligibleTitle}
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {settingsCopy.lifecycle.deletionIneligibleBody}
                </p>
              </div>
            )}
          </DashboardCard>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[92px]">
          <DashboardCard className="p-[22px]" variant="priority">
            <SectionHeader title={settingsCopy.workspace} />
            <div className="my-3 h-px bg-[var(--dash-border)]" />
            <div className="space-y-3">
              <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
                  {settingsCopy.business}
                </p>
                <p className="mt-1 truncate text-sm font-extrabold text-[var(--dash-text)]">
                  {activeBusiness.name}
                </p>
                <p className="mt-0.5 break-all text-[12px] text-[var(--dash-text-muted)]">
                  /{activeBusiness.slug}
                </p>
              </div>
              <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
                  {settingsCopy.plan}
                </p>
                <p className="mt-1 text-sm font-extrabold text-[var(--dash-text)]">
                  {copy.status.pilot}
                </p>
                <p className="mt-0.5 text-[12px] text-[var(--dash-text-muted)]">
                  {settingsCopy.manualBilling}
                </p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard className="p-[22px]">
            <SectionHeader title={settingsCopy.quickLinks} />
            <div className="mt-3 grid gap-2">
              <Link className={buttonClass} href="/dashboard/configuration">
                {copy.nav.quoteSetup}
              </Link>
              <Link className={buttonClass} href="/dashboard/business-profile">
                {copy.nav.businessProfile}
              </Link>
              <Link className={primaryButtonClass} href="/dashboard/leads">
                {copy.actions.openLeadQueue}
              </Link>
            </div>
          </DashboardCard>
        </aside>
      </section>
    </main>
  );
}
