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
 * Last Updated: 2026-06-21
 * Change Log:
 * - 2026-06-21: Corrected fr-CA accents and moved the draft label into localized demo copy.
 * ============================================================
 */
"use client";

import { useMemo, useState } from "react";

import {
  MarketingBadge,
  MarketingButton,
  MarketingCard,
  MarketingIcon,
  MarketingShell,
  marketingTone,
} from "@/components/public/marketing-ui";
import type { SupportedLanguage } from "@/lib/i18n/language";

type DemoStep = Readonly<{
  detail: string;
  draft: string;
  fields: ReadonlyArray<Readonly<{ label: string; value: string }>>;
  guardrail: string;
  outcome: string;
  title: string;
}>;

type DemoCopy = Readonly<{
  cta: string;
  draftLabel: string;
  eyebrow: string;
  intro: string;
  next: string;
  previous: string;
  stepLabel: (current: number, total: number) => string;
  steps: ReadonlyArray<DemoStep>;
  title: string;
}>;

const englishDemo: DemoCopy = {
  cta: "See founder pilot terms",
  draftLabel: "Owner review draft",
  eyebrow: "Live cleaning demo",
  intro:
    "Follow one realistic move-out cleaning quote request from customer question to follow-up. The system organizes the work; the owner stays in control.",
  next: "Next",
  previous: "Previous",
  stepLabel: (current, total) => `Step ${current} of ${total}`,
  title: "See exactly how BizPilot handles a messy quote request.",
  steps: [
    {
      detail:
        "A customer asks for a move-out cleaning quote and only gives partial details.",
      draft:
        "Sarah needs a move-out clean before Friday, but pricing would be risky without square footage, access, and appliance details.",
      fields: [
        { label: "Customer", value: "Sarah J." },
        { label: "Request", value: "Move-out cleaning" },
        { label: "Timing", value: "Before Friday" },
      ],
      guardrail: "No auto-send. No invented price.",
      outcome: "The lead is captured before it disappears.",
      title: "Customer question",
    },
    {
      detail:
        "BizPilot turns the message into a structured lead record with source, status, and urgency.",
      draft:
        "The owner sees the request in one place instead of piecing it together from email, DMs, or missed calls.",
      fields: [
        { label: "Source", value: "Quote link" },
        { label: "Status", value: "New lead" },
        { label: "Urgency", value: "Fast reply needed" },
      ],
      guardrail: "Organized lead data stays scoped to the business.",
      outcome: "The request becomes operational.",
      title: "Lead organized",
    },
    {
      detail:
        "The system flags what is missing before the owner quotes or promises anything.",
      draft:
        "Ask for square footage, parking/access, and inside-appliance cleaning before giving a final estimate.",
      fields: [
        { label: "Missing", value: "Square footage" },
        { label: "Missing", value: "Access details" },
        { label: "Risk", value: "Do not price too early" },
      ],
      guardrail: "No booking promise. No price guessing.",
      outcome: "The owner knows what to confirm.",
      title: "Missing details flagged",
    },
    {
      detail:
        "BizPilot prepares a short summary so the owner can understand the lead quickly.",
      draft:
        "Move-out cleaning request for a 2-bedroom condo before Friday. Customer appears ready to book after missing details are confirmed.",
      fields: [
        { label: "Intent", value: "Cleaning quote" },
        { label: "Quality", value: "Warm lead" },
        { label: "Next action", value: "Ask missing info" },
      ],
      guardrail: "AI assists. Owner reviews.",
      outcome: "The lead is easier to prioritize.",
      title: "System summary",
    },
    {
      detail:
        "The owner gets a useful reply draft that asks for only the details needed.",
      draft:
        "Hi Sarah, thanks for reaching out. Could you confirm the approximate square footage, parking/access, and whether you need inside appliances cleaned?",
      fields: [
        { label: "Tone", value: "Professional" },
        { label: "Action", value: "Owner review" },
        { label: "Send mode", value: "Manual copy/send" },
      ],
      guardrail: "The message is not sent automatically.",
      outcome: "A safer reply is ready faster.",
      title: "Owner response drafted",
    },
    {
      detail:
        "The owner edits, copies, and sends from their normal customer channel.",
      draft:
        "BizPilot keeps the owner in the decision loop so the business never loses control of pricing, promises, or tone.",
      fields: [
        { label: "Review", value: "Owner checks draft" },
        { label: "Edit", value: "Tone/details" },
        { label: "Send", value: "Owner-controlled" },
      ],
      guardrail: "Manual copy/send only.",
      outcome: "The customer gets a faster human-reviewed reply.",
      title: "Owner review gate",
    },
    {
      detail:
        "If the customer does not reply, BizPilot keeps the follow-up visible instead of letting the lead go cold.",
      draft:
        "Hi Sarah, just checking in. Once you confirm the square footage and access details, I can send the next step for your move-out clean.",
      fields: [
        { label: "Status", value: "Waiting" },
        { label: "Follow-up", value: "Tomorrow" },
        { label: "Draft", value: "Ready to review" },
      ],
      guardrail: "The owner decides if and when to follow up.",
      outcome: "Warm leads stay visible.",
      title: "Follow-up stays visible",
    },
  ],
};

const frenchDemo: DemoCopy = {
  cta: "Voir les conditions pilote",
  draftLabel: "Brouillon pour révision",
  eyebrow: "Démo nettoyage",
  intro:
    "Suivez une demande réaliste de nettoyage après déménagement, de la question client jusqu'au suivi. Le système organise; le propriétaire garde le contrôle.",
  next: "Suivant",
  previous: "Précédent",
  stepLabel: (current, total) => `Étape ${current} de ${total}`,
  title: "Voyez comment BizPilot traite une demande de soumission confuse.",
  steps: [
    {
      detail:
        "Une cliente demande une soumission de nettoyage après déménagement avec seulement une partie des détails.",
      draft:
        "Sarah veut un nettoyage après déménagement avant vendredi, mais le prix serait risqué sans superficie, accès et détails des électros.",
      fields: [
        { label: "Cliente", value: "Sarah J." },
        { label: "Demande", value: "Nettoyage après déménagement" },
        { label: "Moment", value: "Avant vendredi" },
      ],
      guardrail: "Aucun envoi automatique. Aucun prix inventé.",
      outcome: "Le prospect est capté avant de disparaître.",
      title: "Question client",
    },
    {
      detail:
        "BizPilot transforme le message en prospect structuré avec source, statut et urgence.",
      draft:
        "Le propriétaire voit la demande au même endroit au lieu de reconstruire le contexte depuis courriel, DM ou appels manqués.",
      fields: [
        { label: "Source", value: "Lien de soumission" },
        { label: "Statut", value: "Nouveau prospect" },
        { label: "Urgence", value: "Réponse rapide requise" },
      ],
      guardrail: "Les données restent limitées à l'entreprise.",
      outcome: "La demande devient opérationnelle.",
      title: "Lead organisé",
    },
    {
      detail:
        "Le système signale ce qui manque avant que le propriétaire donne un prix ou une promesse.",
      draft:
        "Demander superficie, stationnement/accès et nettoyage intérieur des électros avant l'estimation finale.",
      fields: [
        { label: "Manquant", value: "Superficie" },
        { label: "Manquant", value: "Détails d'accès" },
        { label: "Risque", value: "Ne pas chiffrer trop tôt" },
      ],
      guardrail: "Aucune promesse de réservation. Aucun prix deviné.",
      outcome: "Le propriétaire sait quoi confirmer.",
      title: "Infos manquantes",
    },
    {
      detail:
        "BizPilot prépare un court résumé pour que le propriétaire comprenne vite le prospect.",
      draft:
        "Demande de nettoyage après déménagement pour un condo 2 chambres avant vendredi. La cliente semble prête après confirmation des détails manquants.",
      fields: [
        { label: "Intention", value: "Soumission nettoyage" },
        { label: "Qualité", value: "Prospect chaud" },
        { label: "Action", value: "Demander les infos" },
      ],
      guardrail: "L'IA aide. Le propriétaire révise.",
      outcome: "Le prospect est plus facile à prioriser.",
      title: "Résumé système",
    },
    {
      detail:
        "Le propriétaire reçoit un brouillon utile qui demande seulement les détails nécessaires.",
      draft:
        "Bonjour Sarah, merci de nous avoir écrit. Pouvez-vous confirmer la superficie approximative, l'accès/stationnement et si les électros doivent être nettoyés?",
      fields: [
        { label: "Ton", value: "Professionnel" },
        { label: "Action", value: "Validation propriétaire" },
        { label: "Envoi", value: "Copie et envoi manuels" },
      ],
      guardrail: "Le message n'est pas envoyé automatiquement.",
      outcome: "Une réponse plus sûre est prête plus vite.",
      title: "Réponse préparée",
    },
    {
      detail:
        "Le propriétaire modifie, copie et envoie depuis son canal client habituel.",
      draft:
        "BizPilot garde le propriétaire dans la décision pour ne jamais perdre le contrôle des prix, promesses ou du ton.",
      fields: [
        { label: "Révision", value: "Le propriétaire vérifie" },
        { label: "Modifier", value: "Ton/détails" },
        { label: "Envoyer", value: "Contrôle propriétaire" },
      ],
      guardrail: "Copier/envoyer manuellement seulement.",
      outcome: "Le client reçoit une réponse plus rapide et révisée.",
      title: "Validation propriétaire",
    },
    {
      detail:
        "Si la cliente ne répond pas, BizPilot garde le suivi visible au lieu de laisser refroidir le lead.",
      draft:
        "Bonjour Sarah, je fais un suivi. Dès que vous confirmez la superficie et les détails d'accès, je peux vous envoyer la prochaine étape.",
      fields: [
        { label: "Statut", value: "En attente" },
        { label: "Suivi", value: "Demain" },
        { label: "Brouillon", value: "Prêt à réviser" },
      ],
      guardrail: "Le propriétaire décide si et quand faire le suivi.",
      outcome: "Les leads chauds restent visibles.",
      title: "Suivi visible",
    },
  ],
};

export function InteractiveCleaningDemoSection({
  language,
}: Readonly<{ language: SupportedLanguage }>) {
  const copy = useMemo(
    () => (language === "fr-CA" ? frenchDemo : englishDemo),
    [language],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const fallbackStep = copy.steps[0];
  if (!fallbackStep) {
    return null;
  }
  const activeStep = copy.steps[activeIndex] ?? fallbackStep;
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === copy.steps.length - 1;

  return (
    <section className="px-5 py-8 sm:px-6" id="cleaning-demo">
      <MarketingShell>
        <MarketingCard
          className="overflow-hidden"
          style={{ borderColor: "rgba(45,212,191,0.22)" }}
        >
          <div className="border-b p-5 sm:p-6" style={{ borderColor: marketingTone.border }}>
            <MarketingBadge>{copy.eyebrow}</MarketingBadge>
            <h2
              className="mt-5 max-w-[840px] text-[28px] font-black leading-[1.1] sm:text-[36px]"
              style={{ color: marketingTone.text }}
            >
              {copy.title}
            </h2>
            <p
              className="mt-4 max-w-[760px] text-[15px] leading-7"
              style={{ color: marketingTone.soft }}
            >
              {copy.intro}
            </p>
          </div>

          <div className="grid min-w-0 lg:grid-cols-[minmax(260px,0.42fr)_minmax(0,0.58fr)]">
            <nav
              aria-label={copy.eyebrow}
              className="border-b p-3 lg:border-b-0 lg:border-r"
              style={{ borderColor: marketingTone.border }}
            >
              <div className="grid gap-2">
                {copy.steps.map((step, index) => {
                  const selected = index === activeIndex;

                  return (
                    <button
                      aria-current={selected ? "step" : undefined}
                      className="grid grid-cols-[28px_minmax(0,1fr)] items-start gap-3 rounded-[12px] border p-3 text-left transition hover:bg-white/[0.04]"
                      key={step.title}
                      onClick={() => setActiveIndex(index)}
                      style={{
                        backgroundColor: selected
                          ? "rgba(45,212,191,0.12)"
                          : "rgba(255,255,255,0.025)",
                        borderColor: selected
                          ? "rgba(45,212,191,0.34)"
                          : marketingTone.border,
                      }}
                      type="button"
                    >
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black"
                        style={{
                          backgroundColor: selected
                            ? marketingTone.teal
                            : "rgba(255,255,255,0.08)",
                          color: selected ? "#03130C" : marketingTone.soft,
                        }}
                      >
                        {index + 1}
                      </span>
                      <span
                        className="text-[13px] font-black leading-snug"
                        style={{ color: selected ? marketingTone.text : marketingTone.soft }}
                      >
                        {step.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

            <div
              aria-live="polite"
              className="min-w-0 p-5 sm:p-6"
              style={{
                background:
                  "linear-gradient(155deg, rgba(13,73,76,0.96), rgba(8,35,48,0.98) 54%, rgba(5,12,20,0.98))",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span
                  className="inline-flex rounded-full border px-3 py-1 text-[11px] font-black uppercase"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.18)",
                    color: "rgba(255,255,255,0.76)",
                  }}
                >
                  {copy.stepLabel(activeIndex + 1, copy.steps.length)}
                </span>
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black"
                  style={{
                    backgroundColor: "rgba(23,212,146,0.13)",
                    borderColor: "rgba(23,212,146,0.28)",
                    color: "#9AF4CF",
                  }}
                >
                  <MarketingIcon name="shield" />
                  {activeStep.guardrail}
                </span>
              </div>

              <h3
                className="mt-5 text-[25px] font-black leading-[1.1] sm:text-[32px]"
                style={{ color: "#FFFFFF" }}
              >
                {activeStep.title}
              </h3>
              <p
                className="mt-3 max-w-[680px] text-[14px] leading-7"
                style={{ color: "rgba(255,255,255,0.72)" }}
              >
                {activeStep.detail}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {activeStep.fields.map((field) => (
                  <div
                    className="min-h-[74px] rounded-[12px] border p-3"
                    key={`${field.label}-${field.value}`}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.08)",
                      borderColor: "rgba(255,255,255,0.14)",
                    }}
                  >
                    <p
                      className="text-[11px] font-black uppercase"
                      style={{ color: "rgba(255,255,255,0.54)" }}
                    >
                      {field.label}
                    </p>
                    <p
                      className="mt-2 text-[13px] font-black leading-snug"
                      style={{ color: "#FFFFFF" }}
                    >
                      {field.value}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="mt-5 rounded-[14px] p-4"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 22px 60px rgba(0,0,0,0.22)",
                }}
              >
                <p
                  className="text-[11px] font-black uppercase"
                  style={{ color: "#0F766E" }}
                >
                  {copy.draftLabel}
                </p>
                <p
                  className="mt-3 text-[14px] leading-7"
                  style={{ color: "#374151" }}
                >
                  {activeStep.draft}
                </p>
              </div>

              <div
                className="mt-5 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between"
                style={{ borderColor: "rgba(255,255,255,0.14)" }}
              >
                <p
                  className="text-[14px] font-black"
                  style={{ color: "#FFFFFF" }}
                >
                  {activeStep.outcome}
                </p>
                <div className="flex gap-2">
                  <button
                    className="inline-flex min-h-10 items-center justify-center rounded-[10px] border px-4 text-[12px] font-black"
                    disabled={isFirst}
                    onClick={() => setActiveIndex((value) => Math.max(0, value - 1))}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.08)",
                      borderColor: "rgba(255,255,255,0.18)",
                      color: "#FFFFFF",
                      cursor: isFirst ? "not-allowed" : "pointer",
                      opacity: isFirst ? 0.45 : 1,
                    }}
                    type="button"
                  >
                    {copy.previous}
                  </button>
                  <button
                    className="inline-flex min-h-10 items-center justify-center rounded-[10px] px-4 text-[12px] font-black"
                    disabled={isLast}
                    onClick={() =>
                      setActiveIndex((value) =>
                        Math.min(copy.steps.length - 1, value + 1),
                      )
                    }
                    style={{
                      backgroundColor: "#FFFFFF",
                      color: "#0F3D4A",
                      cursor: isLast ? "not-allowed" : "pointer",
                      opacity: isLast ? 0.55 : 1,
                    }}
                    type="button"
                  >
                    {copy.next}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </MarketingCard>

        <div className="mt-5 flex justify-center">
          <MarketingButton href="/pricing" variant="secondary">
            {copy.cta}
          </MarketingButton>
        </div>
      </MarketingShell>
    </section>
  );
}
