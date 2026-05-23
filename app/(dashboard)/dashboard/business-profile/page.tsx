/**
 * ============================================================
 * File: app/(dashboard)/dashboard/business-profile/page.tsx
 * Project: BizPilot AI
 * Description: Business Profile workspace, identity + operating context.
 * Role: Owner-facing identity card kept separate from Quote Setup.
 * Related:
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * - server/actions/business-configuration.actions.ts
 * - docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.5.md
 * Author: MoOoH
 * Created: 2026-05-18
 * Last Updated: 2026-05-23
 * ============================================================
 */

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CopyButton } from "@/components/dashboard/copy-button";
import {
  buttonClass,
  DashboardCard,
  disabledButtonClass,
  inputClass,
  labelClass,
  PageHeader,
  primaryButtonClass,
  SectionHeader,
  StatusBadge,
  textareaClass,
} from "@/components/dashboard/dashboard-ui";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  languageLabels,
  readSupportedLanguage,
  supportedLanguages,
} from "@/lib/i18n/language";
import { saveBusinessConfigurationAction } from "@/server/actions/business-configuration.actions";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessConfigurationWorkspace } from "@/server/services/business-configuration.service";
import { getBusinessWorkspace } from "@/server/services/business.service";

export const dynamic = "force-dynamic";

type BusinessProfilePageProps = Readonly<{
  searchParams?: Promise<{
    error?: string;
    notice?: string;
  }>;
}>;

function serviceAreasToText(
  areas: Awaited<
    ReturnType<typeof getBusinessConfigurationWorkspace>
  >["configuration"]["serviceAreas"],
): string {
  return areas.map((area) => area.name).join("\n");
}

function servicesToText(
  services: Awaited<
    ReturnType<typeof getBusinessConfigurationWorkspace>
  >["configuration"]["services"],
): string {
  return services
    .map((service) =>
      service.description
        ? `${service.name} | ${service.description}`
        : service.name,
    )
    .join("\n");
}

function faqsToText(
  faqs: Awaited<
    ReturnType<typeof getBusinessConfigurationWorkspace>
  >["configuration"]["faqs"],
): string {
  return faqs.map((faq) => `${faq.question} | ${faq.answer}`).join("\n");
}

function getBusinessProfileText(language: string) {
  const fr = language === "fr-CA";

  return {
    accountEmailHelp: fr
      ? "Courriel du compte - modifiez-le dans les réglages."
      : "Account email - change it from Settings.",
    aiNotes: fr
      ? "Zone de service et notes opérationnelles"
      : "Service area & operating notes",
    aiNotesDescription: fr
      ? "Contexte qui aide le propriétaire et l'IA à préparer de meilleurs brouillons. Les garde-fous IA et FAQ restent dans Configuration."
      : "Operating context that helps the owner and AI prepare better drafts. AI guardrails and FAQ details stay in Quote Setup.",
    business: fr ? "Entreprise" : "Business",
    businessIdentity: fr ? "Identité de l'entreprise" : "Business identity",
    businessIdentityDescription: fr
      ? "Identité utilisée dans le tableau de bord, la page publique et le contexte des brouillons IA."
      : "Owner-facing identity used across the dashboard, public quote page, and AI draft context.",
    businessName: fr ? "Nom de l'entreprise" : "Business name",
    businessType: fr ? "Type d'entreprise" : "Business type",
    cleaning: fr ? "Nettoyage" : "Cleaning",
    description: fr
      ? "Identité de l'entreprise et contexte opérationnel. Cette section est séparée de Configuration."
      : "Business identity and operating context. This is separate from Quote Setup.",
    futureDescription: fr
      ? "Ces champs font partie du design approuvé, mais ne sont pas encore reliés à la base de données. Ils arriveront avec leur propre migration après validation pilote."
      : "These fields are part of the approved index design but are not yet wired to a database column. They will land with their own migration after pilot validation.",
    futureFields: fr ? "Champs de feuille de route" : "Roadmap fields",
    languageHelp: fr
      ? "Utilisée pour la page publique et la langue des brouillons IA."
      : "Used for the public quote page and AI draft language.",
    logoUrl: fr ? "URL du logo" : "Logo URL",
    notInMvp: fr ? "Hors MVP" : "Not in MVP",
    oneAreaPerLine: fr
      ? "Une zone par ligne. Utilisée pour scorer les leads et expliquer la couverture."
      : "One area per line. Used to score leads and explain coverage.",
    openQuoteSetup: fr ? "Ouvrir Configuration" : "Open Quote Setup",
    ownerEmail: fr
      ? "Courriel propriétaire (lecture seule)"
      : "Owner email (read-only)",
    preferredLanguage: fr ? "Langue préférée" : "Preferred language",
    previewQuotePage: fr
      ? "Aperçu page de soumission"
      : "Preview Quote Page",
    publicQuoteLink: fr ? "Lien public" : "Public quote link",
    publicSlug: fr ? "Slug public" : "Public slug",
    roadmapFields: fr
      ? [
          ["Nom public propriétaire", "Phase 18B"],
          ["Téléphone propriétaire", "Phase 18B"],
          ["Site web public", "Phase 18B"],
          ["Ville", "Phase 18B"],
          ["Province", "Phase 18B"],
          ["Heures de réponse", "Phase 18B"],
        ]
      : [
          ["Owner display name", "Phase 18B"],
          ["Owner phone", "Phase 18B"],
          ["Public website", "Phase 18B"],
          ["City", "Phase 18B"],
          ["Province", "Phase 18B"],
          ["Response hours", "Phase 18B"],
        ],
    save: fr ? "Enregistrer le profil" : "Save Business Profile",
    saveNote: fr
      ? "L'enregistrement conserve les changements d'identité. Les questions du formulaire se gèrent dans Configuration."
      : "Save persists identity changes. Quote-form questions are managed in Quote Setup.",
    serviceAreas: fr ? "Zones desservies" : "Service areas",
    templateName: fr
      ? "Nom du modèle de soumission"
      : "Custom quote template name",
    verticalHelp: fr
      ? "La Phase 18A reste concentrée sur le nettoyage. Les autres verticales restent verrouillées jusqu'à validation."
      : "Phase 18A is cleaning-first. Other verticals are locked until the validation gate clears.",
  };
}

export default async function BusinessProfilePage({
  searchParams,
}: BusinessProfilePageProps) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);

  if (!user) {
    redirect("/auth/sign-in");
  }

  const workspace = await getBusinessWorkspace({ userId: user.id });
  const activeBusiness = workspace.businesses[0];

  if (!activeBusiness) {
    redirect("/dashboard");
  }

  const activeLanguage = readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value ??
      activeBusiness.preferred_language,
  );
  const configurationWorkspace = await getBusinessConfigurationWorkspace({
    business: { ...activeBusiness, preferred_language: activeLanguage },
  });
  const { cleaningTemplate, configuration } = configurationWorkspace;
  const quotePath = `/quote/${activeBusiness.slug}`;
  const primaryColor = configuration.branding?.primary_color ?? "#18181b";
  const accentColor = configuration.branding?.accent_color ?? "#0f766e";
  const copy = getBizPilotCopy(activeLanguage);
  const dashboardCopy = copy.dashboard;
  const text = getBusinessProfileText(activeLanguage);
  const consentNotice =
    configuration.consentSettings?.consent_notice ??
    copy.quoteForm.consentNoticeDefault;
  const privacyMode = configuration.privacySettings?.privacy_mode ?? "standard";
  const retainLeadsDays =
    configuration.privacySettings?.retain_leads_days ?? 365;

  return (
    <main className="space-y-4">
      <PageHeader
        actions={
          <>
            <CopyButton
              label={dashboardCopy.actions.copyQuoteLink}
              value={quotePath}
            />
            <Link className={buttonClass} href="/dashboard/configuration">
              {text.openQuoteSetup}
            </Link>
            <Link className={primaryButtonClass} href={quotePath}>
              {text.previewQuotePage}
            </Link>
          </>
        }
        description={text.description}
        eyebrow={text.business}
        title={dashboardCopy.nav.businessProfile}
      />

      {params?.notice ? (
        <p className="rounded-[14px] border border-emerald-300/35 bg-emerald-500/12 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
          {params.notice}
        </p>
      ) : null}

      {params?.error ? (
        <p className="rounded-[14px] border border-red-300/35 bg-red-500/12 p-3 text-xs font-semibold text-red-700 dark:text-red-200">
          {params.error}
        </p>
      ) : null}

      <form
        action={saveBusinessConfigurationAction}
        className="space-y-4"
        id="business-profile-form"
      >
        {/* Hidden fields preserve every required input across saves. */}
        <input name="businessId" type="hidden" value={activeBusiness.id} />
        <input
          name="templateId"
          type="hidden"
          value={cleaningTemplate.template.id}
        />
        <input name="primaryColor" type="hidden" value={primaryColor} />
        <input name="accentColor" type="hidden" value={accentColor} />
        <input name="consentNotice" type="hidden" value={consentNotice} />
        <input name="privacyMode" type="hidden" value={privacyMode} />
        <input
          name="retainLeadsDays"
          type="hidden"
          value={retainLeadsDays}
        />
        <input
          name="services"
          type="hidden"
          value={servicesToText(configuration.services)}
        />
        <input
          name="faqs"
          type="hidden"
          value={faqsToText(configuration.faqs)}
        />
        {configuration.consentSettings?.privacy_contact_email ? (
          <input
            name="privacyContactEmail"
            type="hidden"
            value={configuration.consentSettings.privacy_contact_email}
          />
        ) : null}
        {configuration.consentSettings?.ai_disclosure_enabled ?? true ? (
          <input name="aiDisclosureEnabled" type="hidden" value="on" />
        ) : null}
        {cleaningTemplate.fields.map((field) => (
          <span hidden key={field.field_key}>
            <input
              name="templateFieldKeys"
              type="hidden"
              value={field.field_key}
            />
            <input
              name={`fieldLabel:${field.field_key}`}
              type="hidden"
              value={field.label}
            />
            <input
              name={`fieldHelp:${field.field_key}`}
              type="hidden"
              value={field.help_text ?? ""}
            />
            <input
              name={`fieldSort:${field.field_key}`}
              type="hidden"
              value={field.sort_order}
            />
            {field.is_required ? (
              <input
                name={`fieldRequired:${field.field_key}`}
                type="hidden"
                value="on"
              />
            ) : null}
            {field.is_hidden ? (
              <input
                name={`fieldHidden:${field.field_key}`}
                type="hidden"
                value="on"
              />
            ) : null}
          </span>
        ))}

        <section className="grid min-w-0 gap-4 xl:grid-cols-2">
          <DashboardCard className="p-[22px]" variant="elevated">
            <SectionHeader
              description={text.businessIdentityDescription}
              title={text.businessIdentity}
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className={labelClass}>
                {text.businessName}
                <input
                  className={inputClass}
                  defaultValue={activeBusiness.name}
                  name="businessName"
                  required
                  type="text"
                />
              </label>
              <label className={labelClass}>
                {text.publicSlug}
                <input
                  className={inputClass}
                  defaultValue={activeBusiness.slug}
                  name="businessSlug"
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  required
                  type="text"
                />
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                {text.templateName}
                <input
                  className={inputClass}
                  defaultValue={
                    configuration.templateSettings?.custom_name ??
                    cleaningTemplate.template.name
                  }
                  name="customTemplateName"
                  type="text"
                />
              </label>
              <label className={labelClass}>
                {text.preferredLanguage}
                <select
                  className={inputClass}
                  defaultValue={activeLanguage}
                  name="preferredLanguage"
                  required
                >
                  {supportedLanguages.map((language) => (
                    <option key={language} value={language}>
                      {languageLabels[language]}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] leading-4 text-[var(--dash-text-muted)]">
                  {text.languageHelp}
                </span>
              </label>
              <label className={labelClass}>
                {text.ownerEmail}
                <input
                  className={inputClass}
                  defaultValue={user.email ?? user.id}
                  disabled
                  type="email"
                />
                <span className="text-[11px] leading-4 text-[var(--dash-text-muted)]">
                  {text.accountEmailHelp}
                </span>
              </label>
              <label className={labelClass}>
                {text.businessType}
                <input
                  className={inputClass}
                  defaultValue={text.cleaning}
                  disabled
                  type="text"
                />
                <span className="text-[11px] leading-4 text-[var(--dash-text-muted)]">
                  {text.verticalHelp}
                </span>
              </label>
            </div>
          </DashboardCard>

          <DashboardCard className="p-[22px]">
            <SectionHeader
              description={text.aiNotesDescription}
              title={text.aiNotes}
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className={labelClass}>
                {text.logoUrl}
                <input
                  className={inputClass}
                  defaultValue={configuration.branding?.logo_url ?? ""}
                  name="logoUrl"
                  type="url"
                />
              </label>
              <label className={labelClass}>
                {text.publicQuoteLink}
                <input
                  className={inputClass}
                  defaultValue={quotePath}
                  disabled
                  type="text"
                />
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                {text.serviceAreas}
                <textarea
                  className={`${textareaClass} min-h-28`}
                  defaultValue={serviceAreasToText(configuration.serviceAreas)}
                  name="serviceAreas"
                  placeholder={"Montreal\nLaval\nLongueuil"}
                />
                <span className="text-[11px] leading-4 text-[var(--dash-text-muted)]">
                  {text.oneAreaPerLine}
                </span>
              </label>
            </div>
          </DashboardCard>
        </section>

        <DashboardCard className="p-[22px]" variant="priority">
          <SectionHeader
            description={text.futureDescription}
            title={text.futureFields}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {text.roadmapFields.map(([title, badge]) => (
              <div
                className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
                key={title}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-extrabold text-[var(--dash-text)]">
                    {title}
                  </p>
                  <StatusBadge>{badge}</StatusBadge>
                </div>
                <button
                  className={`${disabledButtonClass} mt-3 w-full`}
                  type="button"
                >
                  {text.notInMvp}
                </button>
              </div>
            ))}
          </div>
        </DashboardCard>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-3">
          <p className="text-[12px] text-[var(--dash-text-secondary)]">
            {text.saveNote}
          </p>
          <button className={primaryButtonClass} type="submit">
            {text.save}
          </button>
        </div>
      </form>
    </main>
  );
}
