/**
 * ============================================================
 * File: components/public/interactive-cleaning-demo.tsx
 * Project: BizPilot AI
 * Description: Interactive 7-step cleaning quote recovery demo for homepage.
 * Role: Shows the end-to-end customer/system/owner/follow-up workflow safely.
 * Related:
 * - app/page.tsx
 * - components/public/marketing-ui.tsx
 * - lib/i18n/language.ts
 * Author: MoOoH
 * Created: 2026-05-25
 * ============================================================
 */
"use client";

import { useMemo, useState } from "react";

import {
  MarketingBadge,
  MarketingButton,
  MarketingShell,
  marketingTone,
} from "@/components/public/marketing-ui";
import type { SupportedLanguage } from "@/lib/i18n/language";

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldTone = "neutral" | "good" | "warn" | "risk";

type DemoField = Readonly<{
  label: string;
  tone?: FieldTone;
  value: string;
}>;

type DemoStep = Readonly<{
  detail: string;
  draft: string;
  fields: ReadonlyArray<DemoField>;
  guardrail: string;
  note: string;
  outcome: string;
  title: string;
}>;

type DemoCopy = Readonly<{
  channelLabel: string;
  customerMessage: string;
  customerName: string;
  cta: string;
  draftLabel: string;
  eyebrow: string;
  incomingLabel: string;
  intro: string;
  next: string;
  previous: string;
  stepLabel: (current: number, total: number) => string;
  steps: ReadonlyArray<DemoStep>;
  title: string;
}>;

// ─── Field tone styles ────────────────────────────────────────────────────────

const FIELD_TONES: Record<FieldTone, { bg: string; border: string; label: string; value: string }> = {
  neutral: {
    bg: "rgba(255,255,255,0.08)",
    border: "rgba(255,255,255,0.14)",
    label: "rgba(255,255,255,0.52)",
    value: "#FFFFFF",
  },
  good: {
    bg: "rgba(45,212,191,0.14)",
    border: "rgba(45,212,191,0.30)",
    label: "#7DE8D9",
    value: "#DDFAF6",
  },
  warn: {
    bg: "rgba(246,184,75,0.13)",
    border: "rgba(246,184,75,0.28)",
    label: "#E0AA3E",
    value: "#FEF3CC",
  },
  risk: {
    bg: "rgba(255,95,102,0.14)",
    border: "rgba(255,95,102,0.28)",
    label: "#FF8C92",
    value: "#FFE5E6",
  },
};

// ─── English copy ─────────────────────────────────────────────────────────────

const englishDemo: DemoCopy = {
  channelLabel: "via Instagram DM",
  customerMessage:
    "Hi, how much for a move-out cleaning? I need it done before Friday — 2-bedroom condo in Downtown Toronto.",
  customerName: "Sarah J.",
  cta: "See founder pilot terms",
  draftLabel: "Owner review draft",
  eyebrow: "Live cleaning demo",
  incomingLabel: "Incoming customer message",
  intro:
    "Follow one realistic move-out cleaning quote request from customer question to follow-up. The system organizes the work; the owner stays in control.",
  next: "Next",
  previous: "Previous",
  stepLabel: (current, total) => `Step ${current} of ${total}`,
  title: "See exactly how BizPilot handles a messy quote request.",
  steps: [
    {
      detail:
        "A customer asks for a move-out cleaning quote and only gives partial details. BizPilot captures the request and creates a structured lead record.",
      draft:
        "Sarah needs a move-out clean before Friday, but pricing would be risky without square footage, access details, and appliance information.",
      fields: [
        { label: "Customer", value: "Sarah J.", tone: "neutral" },
        { label: "Request", value: "Move-out cleaning", tone: "neutral" },
        { label: "Timing", value: "Before Friday", tone: "warn" },
      ],
      guardrail: "No auto-send. No invented price.",
      note: "Lead captured before it disappears into an inbox.",
      outcome: "The lead is organized before anything is promised.",
      title: "Customer question",
    },
    {
      detail:
        "BizPilot turns the scattered message into a clean lead record with source, status, and urgency — all in one place.",
      draft:
        "The owner sees the full request in one view instead of piecing it together from email, DMs, or missed calls.",
      fields: [
        { label: "Source", value: "Quote link", tone: "good" },
        { label: "Status", value: "New lead", tone: "good" },
        { label: "Urgency", value: "Fast reply needed", tone: "warn" },
      ],
      guardrail: "Organized lead data stays scoped to the business.",
      note: "All channels feed one clean queue — no scattered DMs.",
      outcome: "The request becomes operational, not messy.",
      title: "Lead organized",
    },
    {
      detail:
        "The system flags what is missing before the owner quotes or promises anything. Pricing too early is a common and costly mistake.",
      draft:
        "Ask for square footage, parking and access details, and inside-appliance cleaning before giving any estimate.",
      fields: [
        { label: "Missing", value: "Square footage", tone: "warn" },
        { label: "Missing", value: "Parking / access", tone: "warn" },
        { label: "Risk", value: "Do not price too early", tone: "risk" },
      ],
      guardrail: "No booking promise. No price guessing.",
      note: "System spots gaps before the owner makes any commitment.",
      outcome: "The owner knows what to confirm before replying.",
      title: "Missing details flagged",
    },
    {
      detail:
        "BizPilot prepares a short summary so the owner can understand the lead instantly without re-reading the original message.",
      draft:
        "Move-out cleaning for a 2-bedroom condo before Friday. Warm lead — ready to book once missing details are confirmed.",
      fields: [
        { label: "Intent", value: "Cleaning quote", tone: "good" },
        { label: "Quality", value: "Warm lead", tone: "good" },
        { label: "Next action", value: "Ask missing info", tone: "warn" },
      ],
      guardrail: "AI assists. Owner reviews.",
      note: "AI summarizes — the owner makes the call.",
      outcome: "The lead is easy to prioritize at a glance.",
      title: "System summary",
    },
    {
      detail:
        "The owner gets a useful reply draft that asks for only the details needed. Nothing is sent automatically.",
      draft:
        "Hi Sarah, thanks for reaching out. Could you confirm the approximate square footage, parking and access, and whether you need inside appliances cleaned?",
      fields: [
        { label: "Tone", value: "Professional", tone: "good" },
        { label: "Action", value: "Owner review", tone: "good" },
        { label: "Send mode", value: "Manual copy / send", tone: "neutral" },
      ],
      guardrail: "The message is not sent automatically.",
      note: "A useful draft — not an auto-send.",
      outcome: "A safer reply is ready faster.",
      title: "Owner response drafted",
    },
    {
      detail:
        "The owner reviews, edits if needed, copies the reply, and sends from their normal customer channel.",
      draft:
        "BizPilot keeps the owner in the decision loop so the business never loses control of pricing, promises, or tone.",
      fields: [
        { label: "Review", value: "Owner checks draft", tone: "neutral" },
        { label: "Edit", value: "Tone / details", tone: "neutral" },
        { label: "Send", value: "Owner-controlled", tone: "good" },
      ],
      guardrail: "Manual copy / send only. Always.",
      note: "BizPilot never sends without the owner's explicit decision.",
      outcome: "The customer gets a faster, human-reviewed reply.",
      title: "Owner review gate",
    },
    {
      detail:
        "If the customer does not reply, BizPilot keeps the follow-up visible so the lead does not quietly disappear.",
      draft:
        "Hi Sarah, just checking in. Once you confirm the square footage and access details, I can send the next step for your move-out clean.",
      fields: [
        { label: "Status", value: "Waiting for reply", tone: "warn" },
        { label: "Follow-up", value: "Tomorrow", tone: "good" },
        { label: "Draft", value: "Ready to review", tone: "good" },
      ],
      guardrail: "The owner decides if and when to follow up.",
      note: "Warm leads stay visible — no silent loss.",
      outcome: "The lead stays active instead of going cold.",
      title: "Follow-up stays visible",
    },
  ],
};

// ─── French copy ──────────────────────────────────────────────────────────────

const frenchDemo: DemoCopy = {
  channelLabel: "via Instagram DM",
  customerMessage:
    "Bonjour, combien pour un nettoyage de depart? J'ai besoin du service avant vendredi — condo 2 chambres au centre-ville de Toronto.",
  customerName: "Sarah J.",
  cta: "Voir les conditions pilote",
  draftLabel: "Brouillon pour revision",
  eyebrow: "Demo nettoyage",
  incomingLabel: "Message entrant du client",
  intro:
    "Suivez une demande realiste de nettoyage de depart, de la question client jusqu'au suivi. Le systeme organise; le proprietaire garde le controle.",
  next: "Suivant",
  previous: "Precedent",
  stepLabel: (current, total) => `Etape ${current} de ${total}`,
  title: "Voyez comment BizPilot traite une demande de soumission confuse.",
  steps: [
    {
      detail:
        "Une cliente demande une soumission de nettoyage de depart avec seulement une partie des details. BizPilot capture la demande et cree un lead structure.",
      draft:
        "Sarah veut un nettoyage avant vendredi, mais le prix serait risque sans superficie, details d'acces et information sur les electros.",
      fields: [
        { label: "Cliente", value: "Sarah J.", tone: "neutral" },
        { label: "Demande", value: "Nettoyage de depart", tone: "neutral" },
        { label: "Moment", value: "Avant vendredi", tone: "warn" },
      ],
      guardrail: "Aucun envoi automatique. Aucun prix invente.",
      note: "Lead capture avant de disparaitre dans une boite de reception.",
      outcome: "Le lead est organise avant que quoi que ce soit soit promis.",
      title: "Question client",
    },
    {
      detail:
        "BizPilot transforme le message en lead structure avec source, statut et urgence — tout au meme endroit.",
      draft:
        "Le proprietaire voit la demande complete dans une vue au lieu de reconstituer le contexte depuis courriel, DM ou appels manques.",
      fields: [
        { label: "Source", value: "Lien de soumission", tone: "good" },
        { label: "Statut", value: "Nouveau lead", tone: "good" },
        { label: "Urgence", value: "Reponse rapide requise", tone: "warn" },
      ],
      guardrail: "Les donnees du lead restent limitees a l'entreprise.",
      note: "Tous les canaux alimentent une file propre — sans DM eparpilles.",
      outcome: "La demande devient operationnelle, pas desordonnee.",
      title: "Lead organise",
    },
    {
      detail:
        "Le systeme signale ce qui manque avant que le proprietaire donne un prix ou une promesse. Chiffrer trop tot est une erreur courante et couteuse.",
      draft:
        "Demander superficie, stationnement/acces et nettoyage interieur des electros avant toute estimation.",
      fields: [
        { label: "Manquant", value: "Superficie", tone: "warn" },
        { label: "Manquant", value: "Stationnement / acces", tone: "warn" },
        { label: "Risque", value: "Ne pas chiffrer trop tot", tone: "risk" },
      ],
      guardrail: "Aucune promesse. Aucun prix devine.",
      note: "Le systeme repere les lacunes avant tout engagement.",
      outcome: "Le proprietaire sait quoi confirmer avant de repondre.",
      title: "Infos manquantes",
    },
    {
      detail:
        "BizPilot prepare un court resume pour que le proprietaire comprenne le lead instantanement sans relire le message original.",
      draft:
        "Nettoyage de depart pour un condo 2 chambres avant vendredi. Lead chaud — pret a reserver apres confirmation des details manquants.",
      fields: [
        { label: "Intention", value: "Soumission nettoyage", tone: "good" },
        { label: "Qualite", value: "Lead chaud", tone: "good" },
        { label: "Action", value: "Demander les infos", tone: "warn" },
      ],
      guardrail: "L'IA aide. Le proprietaire revise.",
      note: "L'IA resume — le proprietaire prend la decision.",
      outcome: "Le lead est facile a prioriser d'un coup d'oeil.",
      title: "Resume systeme",
    },
    {
      detail:
        "Le proprietaire recoit un brouillon utile qui demande seulement les details necessaires. Rien n'est envoye automatiquement.",
      draft:
        "Bonjour Sarah, merci de nous avoir ecrit. Pouvez-vous confirmer la superficie approximative, l'acces/stationnement et si les electros doivent etre nettoyes?",
      fields: [
        { label: "Ton", value: "Professionnel", tone: "good" },
        { label: "Action", value: "Revision proprietaire", tone: "good" },
        { label: "Envoi", value: "Copier / envoyer manuel", tone: "neutral" },
      ],
      guardrail: "Le message n'est pas envoye automatiquement.",
      note: "Un brouillon utile — pas un envoi automatique.",
      outcome: "Une reponse plus sure est prete plus vite.",
      title: "Reponse preparee",
    },
    {
      detail:
        "Le proprietaire revise, modifie si necessaire, copie la reponse et envoie depuis son canal client habituel.",
      draft:
        "BizPilot garde le proprietaire dans la boucle de decision pour ne jamais perdre le controle des prix, promesses ou du ton.",
      fields: [
        { label: "Revision", value: "Le proprietaire verifie", tone: "neutral" },
        { label: "Modifier", value: "Ton / details", tone: "neutral" },
        { label: "Envoyer", value: "Controle proprietaire", tone: "good" },
      ],
      guardrail: "Copier / envoyer manuellement seulement. Toujours.",
      note: "BizPilot n'envoie jamais sans la decision explicite du proprietaire.",
      outcome: "Le client recoit une reponse plus rapide, revisee par un humain.",
      title: "Gate proprietaire",
    },
    {
      detail:
        "Si la cliente ne repond pas, BizPilot garde le suivi visible pour que le lead ne disparaisse pas silencieusement.",
      draft:
        "Bonjour Sarah, je fais un suivi. Des que vous confirmez la superficie et les details d'acces, je peux vous envoyer la prochaine etape.",
      fields: [
        { label: "Statut", value: "En attente de reponse", tone: "warn" },
        { label: "Suivi", value: "Demain", tone: "good" },
        { label: "Brouillon", value: "Pret a reviser", tone: "good" },
      ],
      guardrail: "Le proprietaire decide si et quand faire le suivi.",
      note: "Les leads chauds restent visibles — aucune perte silencieuse.",
      outcome: "Le lead reste actif au lieu de refroidir.",
      title: "Suivi visible",
    },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────

export function InteractiveCleaningDemoSection({
  language,
}: Readonly<{ language: SupportedLanguage }>) {
  const copy = useMemo(
    () => (language === "fr-CA" ? frenchDemo : englishDemo),
    [language],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const fallbackStep = copy.steps[0];
  if (!fallbackStep) return null;

  const activeStep = copy.steps[activeIndex] ?? fallbackStep;
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === copy.steps.length - 1;
  const progressPct = Math.round(((activeIndex + 1) / copy.steps.length) * 100);

  return (
    <section className="px-5 py-10 sm:px-6" id="cleaning-demo">
      <MarketingShell>
        {/* ── Section header ── */}
        <div className="mb-7">
          <MarketingBadge>{copy.eyebrow}</MarketingBadge>
          <h2
            className="mt-5 max-w-[820px] text-[28px] font-black leading-[1.1] sm:text-[38px]"
            style={{ color: marketingTone.text }}
          >
            {copy.title}
          </h2>
          <p
            className="mt-4 max-w-[700px] text-[15px] leading-7"
            style={{ color: marketingTone.soft }}
          >
            {copy.intro}
          </p>
        </div>

        {/* ── Demo shell ── */}
        <div
          className="overflow-hidden rounded-[24px] border"
          style={{
            background:
              "linear-gradient(135deg, rgba(14,42,55,0.97) 0%, rgba(7,20,32,0.99) 48%, rgba(5,12,20,0.99) 100%)",
            borderColor: "rgba(45,212,191,0.24)",
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.36), 0 0 0 1px rgba(45,212,191,0.06)",
          }}
        >
          <div className="grid min-w-0 lg:grid-cols-[minmax(280px,0.40fr)_minmax(0,0.60fr)]">
            {/* ── LEFT SIDEBAR ── */}
            <div
              className="border-b lg:border-b-0 lg:border-r"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              {/* Customer message bubble */}
              <div
                className="m-3 rounded-[18px] border p-4"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(45,212,191,0.12), rgba(23,212,146,0.06))",
                  borderColor: "rgba(45,212,191,0.28)",
                }}
              >
                <div className="mb-2.5 flex items-center gap-2">
                  {/* Chat icon */}
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px]"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(45,212,191,0.30), rgba(23,212,146,0.18))",
                      color: marketingTone.teal,
                    }}
                  >
                    ✦
                  </span>
                  <span
                    className="text-[10.5px] font-black uppercase tracking-[0.12em]"
                    style={{ color: marketingTone.teal }}
                  >
                    {copy.incomingLabel}
                  </span>
                </div>
                {/* Message bubble */}
                <div
                  className="rounded-[12px] p-3"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    borderLeft: `3px solid ${marketingTone.teal}`,
                  }}
                >
                  <p
                    className="text-[13px] italic leading-[1.65]"
                    style={{ color: "rgba(255,255,255,0.88)" }}
                  >
                    &ldquo;{copy.customerMessage}&rdquo;
                  </p>
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: marketingTone.emerald }}
                  />
                  <span
                    className="text-[11px] font-black"
                    style={{ color: marketingTone.muted }}
                  >
                    {copy.customerName} &middot; {copy.channelLabel}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mx-3 mb-3">
                <div
                  className="h-[3px] overflow-hidden rounded-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPct}%`,
                      background:
                        "linear-gradient(90deg, rgba(45,212,191,0.8), rgba(23,212,146,0.9))",
                    }}
                  />
                </div>
              </div>

              {/* Step navigation */}
              <nav aria-label={copy.eyebrow} className="grid gap-1.5 p-3 pt-0">
                {copy.steps.map((step, index) => {
                  const isActive = index === activeIndex;
                  const isPast = index < activeIndex;

                  return (
                    <button
                      aria-current={isActive ? "step" : undefined}
                      className="grid grid-cols-[26px_minmax(0,1fr)] items-start gap-3 rounded-[14px] border px-3 py-2.5 text-left transition-colors"
                      key={step.title}
                      onClick={() => setActiveIndex(index)}
                      style={{
                        backgroundColor: isActive
                          ? "rgba(45,212,191,0.13)"
                          : "transparent",
                        borderColor: isActive
                          ? "rgba(45,212,191,0.35)"
                          : "transparent",
                        cursor: "pointer",
                      }}
                      type="button"
                    >
                      {/* Number bubble */}
                      <span
                        className="mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[11px] font-black"
                        style={{
                          backgroundColor: isActive
                            ? marketingTone.teal
                            : isPast
                              ? "rgba(45,212,191,0.22)"
                              : "rgba(255,255,255,0.07)",
                          color: isActive
                            ? "#052920"
                            : isPast
                              ? marketingTone.teal
                              : marketingTone.muted,
                        }}
                      >
                        {isPast ? "✓" : index + 1}
                      </span>
                      {/* Title + note */}
                      <span>
                        <span
                          className="block text-[13px] font-black leading-snug"
                          style={{
                            color: isActive
                              ? marketingTone.text
                              : isPast
                                ? "rgba(255,255,255,0.52)"
                                : marketingTone.soft,
                          }}
                        >
                          {step.title}
                        </span>
                        {isActive && (
                          <span
                            className="mt-1 block text-[11.5px] leading-snug"
                            style={{ color: marketingTone.muted }}
                          >
                            {step.note}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* ── RIGHT STAGE ── */}
            <div
              aria-live="polite"
              className="flex min-h-[680px] flex-col justify-between p-6 sm:p-7"
              style={{
                background:
                  "linear-gradient(155deg, rgba(13,60,74,0.98) 0%, rgba(8,32,46,0.99) 52%, rgba(4,12,22,1) 100%)",
              }}
            >
              {/* Stage content */}
              <div className="grid gap-6">
                {/* Top bar: step label + guardrail */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em]"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      borderColor: "rgba(255,255,255,0.16)",
                      color: "rgba(255,255,255,0.72)",
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: marketingTone.emerald }}
                    />
                    {copy.stepLabel(activeIndex + 1, copy.steps.length)}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-black"
                    style={{
                      backgroundColor: "rgba(23,212,146,0.10)",
                      borderColor: "rgba(23,212,146,0.24)",
                      color: "#9AF4CF",
                    }}
                  >
                    <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 14 14" width="12">
                      <path d="M7 1L2 3.5v4c0 2.5 2 4.5 5 5.5 3-1 5-3 5-5.5v-4L7 1Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                    {activeStep.guardrail}
                  </span>
                </div>

                {/* Heading + detail */}
                <div>
                  <h3
                    className="text-[26px] font-black leading-[1.08] sm:text-[32px]"
                    style={{ color: "#FFFFFF" }}
                  >
                    {activeStep.title}
                  </h3>
                  <p
                    className="mt-3 max-w-[62ch] text-[14px] leading-7"
                    style={{ color: "rgba(255,255,255,0.68)" }}
                  >
                    {activeStep.detail}
                  </p>
                </div>

                {/* Color-coded field cards */}
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {activeStep.fields.map((field) => {
                    const tone = FIELD_TONES[field.tone ?? "neutral"];

                    return (
                      <div
                        className="min-h-[80px] rounded-[14px] border p-3.5"
                        key={`${field.label}-${field.value}`}
                        style={{