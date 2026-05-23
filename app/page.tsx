/**
 * ============================================================
 * File: app/page.tsx
 * Project: BizPilot AI
 * Description: Public homepage with visible interface language switching.
 * Role: Presents the cleaning-first quote recovery surface before auth.
 * Related:
 * - lib/i18n/language.ts
 * - server/actions/business-configuration.actions.ts
 * - components/public/marketing-ui.tsx
 * Author: MoOoH
 * Last Updated: 2026-05-23
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import {
  MarketingBadge,
  MarketingBrand,
  MarketingButton,
  MarketingCard,
  MarketingIcon,
  MarketingShell,
  marketingBackground,
  marketingTone,
  type MarketingIconName,
} from "@/components/public/marketing-ui";
import {
  INTERFACE_LANGUAGE_COOKIE,
  languageShortLabels,
  readSupportedLanguage,
  supportedLanguages,
  type SupportedLanguage,
} from "@/lib/i18n/language";
import { setInterfaceLanguageAction } from "@/server/actions/business-configuration.actions";

export const metadata: Metadata = {
  title: "BizPilot AI - Quote Recovery for Cleaning Businesses",
  description:
    "BizPilot captures cleaning quote requests, organizes every lead, drafts owner-reviewed replies, and keeps follow-ups visible without auto-sending anything.",
};

type HomeCopy = Readonly<{
  badge: string;
  beforeAfter: Readonly<{
    after: ReadonlyArray<string>;
    afterTitle: string;
    before: ReadonlyArray<string>;
    beforeTitle: string;
    eyebrow: string;
    title: string;
  }>;
  cta: Readonly<{
    primary: string;
    secondary: string;
    title: string;
  }>;
  final: Readonly<{
    body: string;
    primary: string;
    secondary: string;
    title: string;
  }>;
  hero: Readonly<{
    bullets: ReadonlyArray<string>;
    primary: string;
    secondary: string;
    text: string;
    title: string;
  }>;
  languageLabel: string;
  nav: Readonly<{
    flow: string;
    problem: string;
    pricing: string;
    signIn: string;
    start: string;
  }>;
  preview: Readonly<{
    actions: ReadonlyArray<string>;
    draft: string;
    draftTitle: string;
    leads: ReadonlyArray<{
      customer: string;
      detail: string;
      source: string;
      status: string;
    }>;
    title: string;
  }>;
  problem: Readonly<{
    body: string;
    items: ReadonlyArray<{
      body: string;
      icon: MarketingIconName;
      title: string;
    }>;
    title: string;
  }>;
  snapshot: ReadonlyArray<{
    icon: MarketingIconName;
    label: string;
    value: string;
  }>;
}>;

const HOME_COPY: Record<SupportedLanguage, HomeCopy> = {
  en: {
    badge: "For cleaning teams",
    beforeAfter: {
      after: [
        "Request organized",
        "Missing details visible",
        "Reply drafted for owner review",
        "Next follow-up clear",
      ],
      afterTitle: "After BizPilot",
      before: [
        "Message arrives from anywhere",
        "Home size is missing",
        "Owner replies late",
        "Follow-up gets forgotten",
      ],
      beforeTitle: "Before",
      eyebrow: "One shared language system",
      title: "The same choice controls the public site, auth, and dashboard.",
    },
    cta: {
      primary: "Start free recovery",
      secondary: "Preview pricing",
      title: "Ready to stop losing warm cleaning leads?",
    },
    final: {
      body: "Capture requests, ask for missing details, respond faster, and keep every lead visible without auto-sending messages.",
      primary: "Start free recovery",
      secondary: "Sign in",
      title: "Turn more quote requests into real conversations.",
    },
    hero: {
      bullets: [
        "Visible EN/FR interface choice",
        "AI drafts stay owner-reviewed",
        "No auto-send and no invented pricing",
      ],
      primary: "Start free recovery",
      secondary: "See the recovery loop",
      text: "BizPilot captures quote requests, organizes every lead, and drafts owner-reviewed replies so cleaning businesses can respond faster in the language they choose.",
      title: "Quote Recovery Desk for cleaning businesses.",
    },
    languageLabel: "Interface language",
    nav: {
      flow: "How it works",
      pricing: "Pricing",
      problem: "Why BizPilot",
      signIn: "Sign in",
      start: "Start free",
    },
    preview: {
      actions: ["Review reply", "Copy response", "Mark contacted"],
      draft:
        "Hi Sarah, thanks for reaching out. Could you share your home size, preferred frequency, and priority areas so I can prepare an accurate cleaning quote?",
      draftTitle: "Suggested reply",
      leads: [
        {
          customer: "Sarah M.",
          detail: "House cleaning - 2 bed / 1 bath",
          source: "Instagram",
          status: "New",
        },
        {
          customer: "David L.",
          detail: "Deep clean - missing details",
          source: "Web form",
          status: "Info needed",
        },
        {
          customer: "Emily R.",
          detail: "Move-out clean",
          source: "Google Business",
          status: "Draft ready",
        },
      ],
      title: "Live Recovery Desk",
    },
    problem: {
      body: "Cleaning leads leak through small gaps: delay, scattered channels, missing details, and forgotten follow-up.",
      items: [
        {
          body: "A quote request comes in and a competitor replies first.",
          icon: "clock",
          title: "Slow reply",
        },
        {
          body: "Instagram, Google, email, and saved notes stay scattered.",
          icon: "inbox",
          title: "Inbox chaos",
        },
        {
          body: "No size, date, access, or priority details.",
          icon: "warning",
          title: "Missing info",
        },
      ],
      title: "The problem is not demand. It is response chaos.",
    },
    snapshot: [
      { icon: "inbox", label: "Quote requests organized", value: "12" },
      { icon: "pen", label: "Replies drafted", value: "8" },
      { icon: "target", label: "Leads at risk", value: "3" },
      { icon: "shield", label: "Auto-send messages", value: "0" },
    ],
  },
  "fr-CA": {
    badge: "Pour equipes de nettoyage",
    beforeAfter: {
      after: [
        "Demande organisee",
        "Details manquants visibles",
        "Reponse brouillon pour revision",
        "Prochain suivi clair",
      ],
      afterTitle: "Apres BizPilot",
      before: [
        "Message arrive de partout",
        "Taille du logement manquante",
        "Reponse trop tardive",
        "Suivi oublie",
      ],
      beforeTitle: "Avant",
      eyebrow: "Un seul systeme de langue",
      title:
        "Le meme choix controle le site public, l'authentification et le tableau de bord.",
    },
    cta: {
      primary: "Demarrer gratuitement",
      secondary: "Voir les prix",
      title: "Pret a ne plus perdre de leads chauds?",
    },
    final: {
      body: "Capturez les demandes, demandez les details manquants, repondez plus vite et gardez chaque lead visible sans envoi automatique.",
      primary: "Demarrer gratuitement",
      secondary: "Connexion",
      title: "Transformez plus de demandes en vraies conversations.",
    },
    hero: {
      bullets: [
        "Choix d'interface EN/FR visible",
        "Brouillons IA revises par le proprietaire",
        "Aucun envoi automatique, aucun prix invente",
      ],
      primary: "Demarrer gratuitement",
      secondary: "Voir le flux de recuperation",
      text: "BizPilot capture les demandes de soumission, organise chaque lead et prepare des brouillons revises par le proprietaire pour repondre plus vite dans la langue choisie.",
      title: "Bureau de recuperation de soumissions pour le nettoyage.",
    },
    languageLabel: "Langue de l'interface",
    nav: {
      flow: "Fonctionnement",
      pricing: "Prix",
      problem: "Pourquoi BizPilot",
      signIn: "Connexion",
      start: "Demarrer",
    },
    preview: {
      actions: ["Reviser", "Copier", "Marquer contacte"],
      draft:
        "Bonjour Sarah, merci pour votre message. Pouvez-vous partager la taille du logement, la frequence souhaitee et les zones prioritaires afin de preparer une soumission exacte?",
      draftTitle: "Reponse suggeree",
      leads: [
        {
          customer: "Sarah M.",
          detail: "Nettoyage maison - 2 chambres / 1 bain",
          source: "Instagram",
          status: "Nouveau",
        },
        {
          customer: "David L.",
          detail: "Grand menage - details manquants",
          source: "Formulaire web",
          status: "Infos requises",
        },
        {
          customer: "Emily R.",
          detail: "Nettoyage demenagement",
          source: "Google Business",
          status: "Brouillon pret",
        },
      ],
      title: "Bureau de recuperation",
    },
    problem: {
      body: "Les leads de nettoyage se perdent dans de petits ecarts: delai, canaux disperses, details manquants et suivis oublies.",
      items: [
        {
          body: "Une demande arrive et un concurrent repond en premier.",
          icon: "clock",
          title: "Reponse lente",
        },
        {
          body: "Instagram, Google, courriel et notes restent disperses.",
          icon: "inbox",
          title: "Boites dispersees",
        },
        {
          body: "Pas de taille, date, acces ou priorites.",
          icon: "warning",
          title: "Infos manquantes",
        },
      ],
      title: "Le probleme n'est pas la demande. C'est le chaos de reponse.",
    },
    snapshot: [
      { icon: "inbox", label: "Demandes organisees", value: "12" },
      { icon: "pen", label: "Reponses preparees", value: "8" },
      { icon: "target", label: "Leads a risque", value: "3" },
      { icon: "shield", label: "Envois automatiques", value: "0" },
    ],
  },
};

function LanguageSwitcher({
  activeLanguage,
  label,
}: Readonly<{ activeLanguage: SupportedLanguage; label: string }>) {
  return (
    <form
      action={setInterfaceLanguageAction}
      aria-label={label}
      className="flex items-center gap-1 rounded-[10px] border p-1"
      style={{ borderColor: marketingTone.borderStrong }}
    >
      <input name="redirectTo" type="hidden" value="/" />
      {supportedLanguages.map((language) => {
        const active = language === activeLanguage;

        return (
          <button
            aria-pressed={active}
            className="h-8 min-w-9 rounded-[8px] px-2 text-[11px] font-black transition"
            key={language}
            name="language"
            style={{
              backgroundColor: active ? marketingTone.emerald : "transparent",
              color: active ? "#03130C" : marketingTone.soft,
            }}
            type="submit"
            value={language}
          >
            {languageShortLabels[language]}
          </button>
        );
      })}
    </form>
  );
}

function Header({
  copy,
  language,
}: Readonly<{ copy: HomeCopy; language: SupportedLanguage }>) {
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{
        backgroundColor: "rgba(5,11,18,0.84)",
        borderColor: marketingTone.border,
      }}
    >
      <nav className="mx-auto flex min-h-[64px] w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-5 py-2 sm:px-6">
        <MarketingBrand />
        <div className="hidden items-center gap-2 md:flex">
          <Link className="rounded-[10px] px-3 py-2 text-[12px] font-bold" href="#why" style={{ color: marketingTone.soft }}>
            {copy.nav.problem}
          </Link>
          <Link className="rounded-[10px] px-3 py-2 text-[12px] font-bold" href="#flow" style={{ color: marketingTone.soft }}>
            {copy.nav.flow}
          </Link>
          <Link className="rounded-[10px] px-3 py-2 text-[12px] font-bold" href="/pricing" style={{ color: marketingTone.soft }}>
            {copy.nav.pricing}
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher activeLanguage={language} label={copy.languageLabel} />
          <Link
            className="hidden h-10 items-center justify-center rounded-[10px] px-3 text-[13px] font-bold transition hover:bg-white/[0.05] sm:inline-flex"
            href="/auth/sign-in"
            style={{ color: marketingTone.soft }}
          >
            {copy.nav.signIn}
          </Link>
          <MarketingButton
            className="h-10 px-3 text-[12px] sm:px-4"
            href="/auth/sign-up"
          >
            {copy.nav.start}
          </MarketingButton>
        </div>
      </nav>
    </header>
  );
}

function LeadPreview({ copy }: Readonly<{ copy: HomeCopy["preview"] }>) {
  return (
    <MarketingCard
      className="p-4"
      style={{
        background:
          "linear-gradient(145deg, rgba(10,23,35,0.96), rgba(5,12,20,0.96))",
        borderColor: "rgba(45,212,191,0.22)",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: marketingTone.emerald }}
        />
        <p className="text-[14px] font-black" style={{ color: marketingTone.text }}>
          {copy.title}
        </p>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="grid gap-2">
          {copy.leads.map((lead) => (
            <div
              className="rounded-[12px] border p-3"
              key={lead.customer}
              style={{
                backgroundColor: "rgba(255,255,255,0.035)",
                borderColor: marketingTone.border,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-black" style={{ color: marketingTone.text }}>
                    {lead.customer}
                  </p>
                  <p className="mt-1 truncate text-[11px]" style={{ color: marketingTone.soft }}>
                    {lead.detail}
                  </p>
                  <p className="mt-1 truncate text-[10px]" style={{ color: marketingTone.muted }}>
                    {lead.source}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-full border px-2 py-1 text-[9.5px] font-black uppercase"
                  style={{
                    backgroundColor: "rgba(23,212,146,0.12)",
                    borderColor: "rgba(23,212,146,0.30)",
                    color: marketingTone.emerald,
                  }}
                >
                  {lead.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div
          className="rounded-[13px] border p-4"
          style={{
            background:
              "linear-gradient(135deg, #2A3033 0%, #1D252B 45%, #0E151D 100%)",
            borderColor: "rgba(148,203,226,0.30)",
          }}
        >
          <h3 className="text-[15px] font-black" style={{ color: marketingTone.text }}>
            {copy.draftTitle}
          </h3>
          <p className="mt-3 text-[12.5px] leading-6" style={{ color: marketingTone.soft }}>
            {copy.draft}
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {copy.actions.map((action, index) => (
              <button
                className="h-10 rounded-[9px] border px-2 text-[11px] font-black"
                key={action}
                style={{
                  backgroundColor:
                    index === 0 ? marketingTone.emerald : "transparent",
                  borderColor:
                    index === 0 ? "transparent" : marketingTone.borderStrong,
                  color: index === 0 ? "#03130C" : marketingTone.text,
                }}
                type="button"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </MarketingCard>
  );
}

function Hero({ copy }: Readonly<{ copy: HomeCopy }>) {
  return (
    <section className="pb-7 pt-7">
      <MarketingShell>
        <div className="grid min-w-0 items-center gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          <div>
            <MarketingBadge>{copy.badge}</MarketingBadge>
            <h1 className="mt-5 max-w-[620px] text-[34px] font-black leading-[1.08] sm:text-[42px]" style={{ color: marketingTone.text }}>
              {copy.hero.title}
            </h1>
            <p className="mt-4 max-w-[560px] text-[15px] leading-7" style={{ color: marketingTone.soft }}>
              {copy.hero.text}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <MarketingButton href="/auth/sign-up">
                {copy.hero.primary} <MarketingIcon name="arrow" />
              </MarketingButton>
              <MarketingButton href="#flow" variant="secondary">
                {copy.hero.secondary}
              </MarketingButton>
            </div>
            <div className="mt-5 grid gap-2.5 text-[12px]" style={{ color: marketingTone.soft }}>
              {copy.hero.bullets.map((item) => (
                <span className="flex items-center gap-3" key={item}>
                  <span style={{ color: marketingTone.teal }}>
                    <MarketingIcon name="check" />
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <LeadPreview copy={copy.preview} />
        </div>
      </MarketingShell>
    </section>
  );
}

function Snapshot({ copy }: Readonly<{ copy: HomeCopy }>) {
  return (
    <section className="px-5 pb-7 sm:px-6">
      <div
        className="mx-auto grid w-full max-w-[1200px] overflow-hidden rounded-[18px] border sm:grid-cols-2 lg:grid-cols-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(37,43,46,0.58), rgba(13,19,26,0.95) 48%, rgba(7,16,25,0.96))",
          borderColor: marketingTone.border,
        }}
      >
        {copy.snapshot.map((metric) => (
          <div className="border-b p-5 sm:border-r lg:border-b-0" key={metric.label} style={{ borderColor: marketingTone.border }}>
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] text-[18px]" style={{ backgroundColor: "rgba(45,212,191,0.12)", color: marketingTone.teal }}>
              <MarketingIcon name={metric.icon} />
            </span>
            <p className="mt-4 text-[30px] font-black leading-none" style={{ color: marketingTone.text }}>
              {metric.value}
            </p>
            <p className="mt-2 text-[13px] font-black" style={{ color: marketingTone.text }}>
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Problem({ copy }: Readonly<{ copy: HomeCopy }>) {
  return (
    <section className="py-7" id="why">
      <MarketingShell>
        <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <h2 className="max-w-[560px] text-[30px] font-black leading-[1.1] sm:text-[34px]" style={{ color: marketingTone.text }}>
              {copy.problem.title}
            </h2>
            <p className="mt-4 max-w-[50ch] text-[14.5px] leading-7" style={{ color: marketingTone.soft }}>
              {copy.problem.body}
            </p>
          </div>
          <div className="grid gap-3">
            {copy.problem.items.map((item) => (
              <div className="grid gap-3 rounded-[14px] border p-4 sm:grid-cols-[48px_minmax(0,1fr)]" key={item.title} style={{ backgroundColor: "rgba(255,255,255,0.035)", borderColor: marketingTone.border }}>
                <span className="flex h-11 w-11 items-center justify-center rounded-[12px]" style={{ backgroundColor: "rgba(84,167,255,0.12)", color: marketingTone.blue }}>
                  <MarketingIcon name={item.icon} />
                </span>
                <div>
                  <h3 className="text-[17px] font-black" style={{ color: marketingTone.text }}>
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-6" style={{ color: marketingTone.soft }}>
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MarketingShell>
    </section>
  );
}

function BeforeAfter({ copy }: Readonly<{ copy: HomeCopy }>) {
  return (
    <section className="py-7" id="flow">
      <MarketingShell>
        <MarketingCard className="p-6">
          <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: marketingTone.teal }}>
            {copy.beforeAfter.eyebrow}
          </p>
          <h2 className="mt-3 max-w-[820px] text-[28px] font-black leading-[1.12] sm:text-[34px]" style={{ color: marketingTone.text }}>
            {copy.beforeAfter.title}
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[14px] border p-4" style={{ borderColor: "rgba(255,95,102,0.24)" }}>
              <h3 className="text-[15px] font-black" style={{ color: marketingTone.red }}>
                {copy.beforeAfter.beforeTitle}
              </h3>
              <div className="mt-3 grid gap-2">
                {copy.beforeAfter.before.map((item) => (
                  <p className="rounded-[10px] border px-3 py-2 text-[13px]" key={item} style={{ borderColor: "rgba(255,95,102,0.18)", color: marketingTone.soft }}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-[14px] border p-4" style={{ borderColor: "rgba(45,212,191,0.24)" }}>
              <h3 className="text-[15px] font-black" style={{ color: marketingTone.teal }}>
                {copy.beforeAfter.afterTitle}
              </h3>
              <div className="mt-3 grid gap-2">
                {copy.beforeAfter.after.map((item) => (
                  <p className="rounded-[10px] border px-3 py-2 text-[13px]" key={item} style={{ borderColor: "rgba(45,212,191,0.20)", color: marketingTone.soft }}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </MarketingCard>
      </MarketingShell>
    </section>
  );
}

function FinalCta({ copy }: Readonly<{ copy: HomeCopy }>) {
  return (
    <section className="py-7">
      <MarketingShell>
        <MarketingCard className="p-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <h2 className="text-[30px] font-black leading-[1.12] sm:text-[36px]" style={{ color: marketingTone.text }}>
                {copy.final.title}
              </h2>
              <p className="mt-4 max-w-[640px] text-[15px] leading-7" style={{ color: marketingTone.soft }}>
                {copy.final.body}
              </p>
            </div>
            <div className="grid gap-3">
              <MarketingButton className="w-full" href="/auth/sign-up">
                {copy.final.primary}
              </MarketingButton>
              <MarketingButton className="w-full" href="/auth/sign-in" variant="secondary">
                {copy.final.secondary}
              </MarketingButton>
            </div>
          </div>
        </MarketingCard>
      </MarketingShell>
    </section>
  );
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const language = readSupportedLanguage(
    cookieStore.get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
  const copy = HOME_COPY[language];

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: marketingBackground, color: marketingTone.text }}
    >
      <Header copy={copy} language={language} />
      <Hero copy={copy} />
      <Snapshot copy={copy} />
      <Problem copy={copy} />
      <BeforeAfter copy={copy} />
      <FinalCta copy={copy} />
    </main>
  );
}
