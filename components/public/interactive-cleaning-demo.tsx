/**
 * ============================================================
 * File: components/public/interactive-cleaning-demo.tsx
 * Project: BizPilot AI
 * Description: 7-step interactive cleaning demo section for the homepage.
 *   Replaces (or supplements) WorkflowDemoSection with a fully client-side
 *   step-through demo that works without the tabbed radio-button CSS hack.
 *
 * Usage in app/page.tsx:
 *   1. Import this component at the top of app/page.tsx:
 *        import { InteractiveCleaningDemoSection } from "@/components/public/interactive-cleaning-demo";
 *   2. In the HomePage JSX, replace <WorkflowDemoSection copy={copy.workflowDemo} />
 *      (or add after it) with:
 *        <InteractiveCleaningDemoSection language={language} />
 *
 * Hero above-fold fix (also in this file's companion guide):
 *   In HeroSection, change the outer <section> className from
 *     "px-0 pb-8 pt-8 sm:pb-10 sm:pt-10"
 *   to
 *     "px-0 pb-4 pt-5 sm:pb-6 sm:pt-6"
 *   to reduce vertical padding and keep the hero visible without scrolling.
 *
 * Author: BizPilot AI (reference output — apply manually)
 * Last Updated: 2026-05-25
 * ============================================================
 */
"use client";

import { useState, useCallback } from "react";
import { MarketingShell, marketingTone } from "@/components/public/marketing-ui";
import type { SupportedLanguage } from "@/lib/i18n/language";

// ─── Types ────────────────────────────────────────────────────────────────────

type DemoStep = Readonly<{
  title: string;
  note: string;
  heading: string;
  description: string;
  rows: ReadonlyArray<readonly [string, string]>;
  draftTitle: string;
  draft: string;
  outcome: string;
  safety: string;
}>;

type DemoCopy = Readonly<{
  eyebrow: string;
  sectionTitle: string;
  lead: string;
  stepLabel: (n: number, total: number) => string;
  prevLabel: string;
  nextLabel: string;
  steps: ReadonlyArray<DemoStep>;
}>;

// ─── English copy ─────────────────────────────────────────────────────────────

const EN_DEMO_COPY: DemoCopy = {
  eyebrow: "Cleaning demo",
  sectionTitle:
    "Watch a cleaning quote request become a ready-to-review reply.",
  lead:
    "A customer needs a move-out cleaning quote for a 2-bedroom condo before Friday. Follow every step — no auto-send, no invented price, owner stays in control.",
  stepLabel: (n, total) => `Step ${n} of ${total}`,
  prevLabel: "Previous",
  nextLabel: "Next step",
  steps: [
    {
      title: "Incoming quote request",
      note: "A realistic cleaning lead arrives from a simple quote link.",
      heading: "Sarah needs a move-out cleaning quote.",
      description:
        "She has a 2-bedroom condo, needs help before Friday morning, and expects a fast response.",
      rows: [
        ["Customer", "Sarah J."],
        ["Job", "Move-out cleaning"],
        ["Property", "2-bedroom condo"],
        ["Timing", "Friday morning"],
      ],
      draftTitle: "Why this matters",
      draft:
        "The owner sees the job at a glance instead of piecing together details from scattered messages.",
      outcome: "Lead captured before it gets lost.",
      safety: "No auto-send. No real AI is required for this guided demo.",
    },
    {
      title: "Organized lead details",
      note: "BizPilot turns the request into a clean workspace.",
      heading: "The owner sees the important details first.",
      description:
        "Job type, timing, location, urgency, and contact context are organized in one place.",
      rows: [
        ["Service", "Move-out clean"],
        ["Location", "Downtown Toronto"],
        ["Urgency", "Fast reply needed"],
        ["Source", "Quote link"],
      ],
      draftTitle: "Owner view",
      draft:
        "Instead of scrolling through DMs, the owner sees a clear lead card and can decide what to ask next.",
      outcome: "The request becomes operational, not messy.",
      safety: "The owner still decides the next step.",
    },
    {
      title: "Missing information",
      note: "The system highlights what is needed before pricing.",
      heading: "Missing details are easy to spot.",
      description:
        "BizPilot helps avoid guessing by showing what the owner should confirm before quoting.",
      rows: [
        ["Missing", "Square footage"],
        ["Missing", "Parking / access"],
        ["Missing", "Inside appliances?"],
        ["Risk", "Do not quote too early"],
      ],
      draftTitle: "Before pricing",
      draft:
        "Confirming missing info protects the owner from underquoting or promising the wrong scope.",
      outcome: "The next reply becomes clearer.",
      safety: "No invented prices. No booking promises.",
    },
    {
      title: "AI summary",
      note: "The owner gets a short summary before replying.",
      heading: "BizPilot summarizes the request.",
      description:
        "The summary explains what the customer wants and what needs review before the owner touches anything.",
      rows: [
        ["Intent", "Move-out clean"],
        ["Deadline", "Before Friday"],
        ["Need", "Fast quote"],
        ["Review", "Confirm missing info"],
      ],
      draftTitle: "Summary",
      draft:
        "Sarah needs a move-out clean for a 2-bedroom condo before Friday. Confirm square footage, appliance cleaning, and access before pricing.",
      outcome: "The owner can respond with context.",
      safety: "AI assists, but the owner reviews.",
    },
    {
      title: "Suggested reply draft",
      note: "A practical draft ready for owner review.",
      heading: "A reply is drafted — not sent automatically.",
      description:
        "BizPilot suggests a professional response that asks for the specific missing details, nothing more.",
      rows: [
        ["Tone", "Professional"],
        ["Goal", "Get missing info"],
        ["Action", "Owner reviews"],
        ["Send", "Manual copy / send"],
      ],
      draftTitle: "Reply draft",
      draft:
        "Hi Sarah, thanks for reaching out. We can help with move-out cleaning. Could you confirm the approximate square footage, whether you need inside appliances cleaned, and whether parking is available?",
      outcome: "Owner-reviewed reply ready in 2 minutes.",
      safety: "No customer message is sent without owner review.",
    },
    {
      title: "Owner review and send",
      note: "Control stays with the business owner.",
      heading: "The owner reviews, edits, copies, and sends.",
      description:
        "The workflow is intentionally manual for trust, safety, and accurate customer communication.",
      rows: [
        ["Review", "Owner checks draft"],
        ["Edit", "Adjust tone / details"],
        ["Copy", "Manual"],
        ["Send", "Owner-controlled"],
      ],
      draftTitle: "Control point",
      draft:
        "BizPilot helps the owner move faster without taking over the conversation or making promises on their behalf.",
      outcome: "Faster response, still human-reviewed.",
      safety: "Manual copy / send only. Always.",
    },
    {
      title: "Follow-up reminder",
      note: "Warm leads do not disappear quietly.",
      heading: "BizPilot keeps the next step visible.",
      description:
        "If Sarah does not respond, the owner has a clear follow-up draft and reminder — the lead does not go cold silently.",
      rows: [
        ["Status", "Waiting for customer"],
        ["Follow-up", "Tomorrow"],
        ["Draft", "Ready to review"],
        ["Goal", "Keep lead warm"],
      ],
      draftTitle: "Follow-up draft",
      draft:
        "Hi Sarah, just checking in to see if you had a chance to confirm the square footage and access details. Happy to send over a quote once we have those.",
      outcome: "The lead stays active instead of going cold.",
      safety: "The owner chooses if and when to follow up.",
    },
  ],
};

// ─── French copy ──────────────────────────────────────────────────────────────

const FR_DEMO_COPY: DemoCopy = {
  eyebrow: "Démo nettoyage",
  sectionTitle:
    "Regardez une demande de soumission devenir une réponse prête à réviser.",
  lead:
    "Une cliente a besoin d'une soumission de nettoyage de départ pour un condo 2 chambres avant vendredi. Suivez chaque étape — aucun envoi automatique, aucun prix inventé, le propriétaire garde le contrôle.",
  stepLabel: (n, total) => `Étape ${n} de ${total}`,
  prevLabel: "Précédent",
  nextLabel: "Étape suivante",
  steps: [
    {
      title: "Nouvelle demande de soumission",
      note: "Un prospect nettoyage arrive depuis un lien de soumission simple.",
      heading: "Sarah a besoin d'une soumission de nettoyage de départ.",
      description:
        "Elle a un condo 2 chambres, veut le service avant vendredi matin et s'attend à une réponse rapide.",
      rows: [
        ["Cliente", "Sarah J."],
        ["Travail", "Nettoyage de départ"],
        ["Propriété", "Condo 2 chambres"],
        ["Moment", "Vendredi matin"],
      ],
      draftTitle: "Pourquoi c'est important",
      draft:
        "Le propriétaire comprend le travail rapidement au lieu de reconstituer les détails à partir de messages éparpillés.",
      outcome: "Prospect capturé avant d'être perdu.",
      safety:
        "Aucun envoi automatique. Aucune vraie IA requise pour cette démo guidée.",
    },
    {
      title: "Détails organisés",
      note: "BizPilot transforme la demande en espace de travail clair.",
      heading: "Le propriétaire voit d'abord les détails importants.",
      description:
        "Type de travail, moment, lieu, urgence et contexte sont organisés au même endroit.",
      rows: [
        ["Service", "Nettoyage de départ"],
        ["Lieu", "Centre-ville de Toronto"],
        ["Urgence", "Réponse rapide requise"],
        ["Source", "Lien de soumission"],
      ],
      draftTitle: "Vue propriétaire",
      draft:
        "Au lieu de parcourir des DM, le propriétaire voit une fiche claire et peut décider quoi demander ensuite.",
      outcome: "La demande devient opérationnelle, pas désordonnée.",
      safety: "Le propriétaire décide toujours de la prochaine étape.",
    },
    {
      title: "Infos manquantes",
      note: "Le système montre ce qu'il faut confirmer avant de donner un prix.",
      heading: "Les détails manquants sont faciles à voir.",
      description:
        "BizPilot aide à éviter les devinettes en montrant quoi confirmer avant la soumission.",
      rows: [
        ["Manquant", "Superficie"],
        ["Manquant", "Stationnement / accès"],
        ["Manquant", "Intérieur des électros?"],
        ["Risque", "Ne pas chiffrer trop tôt"],
      ],
      draftTitle: "Avant le prix",
      draft:
        "Confirmer les infos manquantes protège le propriétaire contre une sous-estimation ou une mauvaise portée.",
      outcome: "La prochaine réponse devient plus claire.",
      safety: "Aucun prix inventé. Aucune promesse de réservation.",
    },
    {
      title: "Résumé IA",
      note: "Le propriétaire reçoit un résumé court avant de répondre.",
      heading: "BizPilot résume la demande.",
      description:
        "Le résumé explique ce que la cliente veut et ce qui doit être révisé avant que le propriétaire agisse.",
      rows: [
        ["Intention", "Nettoyage de départ"],
        ["Échéance", "Avant vendredi"],
        ["Besoin", "Soumission rapide"],
        ["Révision", "Confirmer les infos"],
      ],
      draftTitle: "Résumé",
      draft:
        "Sarah a besoin d'un nettoyage de départ pour un condo 2 chambres avant vendredi. Confirmer la superficie, les électros et l'accès avant le prix.",
      outcome: "Le propriétaire peut répondre avec contexte.",
      safety: "L'IA aide, mais le propriétaire révise.",
    },
    {
      title: "Brouillon de réponse",
      note: "Le brouillon est pratique et prêt à être révisé.",
      heading: "Une réponse est préparée — sans envoi automatique.",
      description:
        "BizPilot suggère une réponse professionnelle qui demande les informations manquantes, rien de plus.",
      rows: [
        ["Ton", "Professionnel"],
        ["Objectif", "Obtenir les infos"],
        ["Action", "Révision propriétaire"],
        ["Envoi", "Copier / envoyer manuel"],
      ],
      draftTitle: "Brouillon",
      draft:
        "Bonjour Sarah, merci de nous avoir écrit. Nous pouvons vous aider avec le nettoyage de départ. Pouvez-vous confirmer la superficie approximative, si l'intérieur des électroménagers doit être nettoyé et si le stationnement est disponible?",
      outcome: "Réponse révisée prête en 2 minutes.",
      safety: "Aucun message client envoyé sans révision du propriétaire.",
    },
    {
      title: "Révision et envoi",
      note: "Le contrôle reste avec le propriétaire.",
      heading: "Le propriétaire révise, modifie, copie et envoie.",
      description:
        "Le flux reste volontairement manuel pour la confiance, la sécurité et la précision.",
      rows: [
        ["Révision", "Le propriétaire vérifie"],
        ["Modifier", "Ton / détails"],
        ["Copier", "Manuel"],
        ["Envoyer", "Contrôlé par le propriétaire"],
      ],
      draftTitle: "Point de contrôle",
      draft:
        "BizPilot aide le propriétaire à aller plus vite sans prendre le contrôle de la conversation ni faire des promesses à sa place.",
      outcome: "Réponse plus rapide, toujours révisée par un humain.",
      safety: "Copier / envoyer manuellement seulement. Toujours.",
    },
    {
      title: "Rappel de suivi",
      note: "Les prospects chauds ne disparaissent pas en silence.",
      heading: "BizPilot garde la prochaine étape visible.",
      description:
        "Si Sarah ne répond pas, le propriétaire a un brouillon de suivi et un rappel clair — le prospect ne refroidit pas silencieusement.",
      rows: [
        ["Statut", "En attente du client"],
        ["Suivi", "Demain"],
        ["Brouillon", "Prêt à réviser"],
        ["Objectif", "Garder le prospect actif"],
      ],
      draftTitle: "Brouillon de suivi",
      draft:
        "Bonjour Sarah, je voulais simplement voir si vous aviez pu confirmer la superficie et les détails d'accès. Nous pourrons vous envoyer une soumission dès que nous aurons ces informations.",
      outcome: "Le prospect reste actif au lieu de refroidir.",
      safety: "Le propriétaire choisit si et quand faire le suivi.",
    },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────

export function InteractiveCleaningDemoSection({
  language = "en",
}: Readonly<{ language?: SupportedLanguage }>) {
  const [activeIndex, setActiveIndex] = useState(0);

  const copy = language === "fr-CA" ? FR_DEMO_COPY : EN_DEMO_COPY;
  const totalSteps = copy.steps.length;
  const current = copy.steps[activeIndex]!;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % totalSteps) + totalSteps) % totalSteps);
    },
    [totalSteps],
  );

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === totalSteps - 1;

  return (
    <section className="px-5 py-8 sm:px-6" id="cleaning-demo">
      <MarketingShell>
        <div
          className="overflow-hidden rounded-[22px] border"
          style={{
            background:
              "linear-gradient(135deg, rgba(45,212,191,0.09), rgba(7,16,25,0.98) 40%, rgba(10,22,34,0.97) 100%)",
            borderColor: "rgba(45,212,191,0.20)",
          }}
        >
          {/* ── Section header ── */}
          <div
            className="border-b p-5 sm:p-6"
            style={{ borderColor: marketingTone.border }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: marketingTone.emerald }}
              />
              <p
                className="text-[11px] font-black uppercase tracking-[0.16em]"
                style={{ color: marketingTone.teal }}
              >
                {copy.eyebrow}
              </p>
            </div>
            <h2
              className="max-w-[640px] text-[26px] font-black leading-[1.1] sm:text-[34px]"
              style={{ color: marketingTone.text }}
            >
              {copy.sectionTitle}
            </h2>
            <p
              className="mt-3 max-w-[70ch] text-[14px] leading-7"
              style={{ color: marketingTone.soft }}
            >
              {copy.lead}
            </p>
          </div>

          {/* ── Demo shell: sidebar + stage ── */}
          <div className="grid lg:grid-cols-[0.42fr_0.58fr]">
            {/* Sidebar — step navigation */}
            <div
              className="border-b p-3 lg:border-b-0 lg:border-r"
              style={{ borderColor: marketingTone.border }}
            >
              <nav aria-label="Demo steps">
                <div className="grid gap-1.5">
                  {copy.steps.map((step, i) => {
                    const isActive = i === activeIndex;

                    return (
                      <button
                        aria-current={isActive ? "true" : undefined}
                        className="grid grid-cols-[26px_minmax(0,1fr)] items-start gap-3 rounded-[14px] border px-3 py-2.5 text-left transition-colors"
                        key={step.title}
                        onClick={() => goTo(i)}
                        style={{
                          backgroundColor: isActive
                            ? "rgba(45,212,191,0.11)"
                            : "rgba(255,255,255,0.025)",
                          borderColor: isActive
                            ? "rgba(45,212,191,0.32)"
                            : marketingTone.border,
                          cursor: "pointer",
                        }}
                        type="button"
                      >
                        {/* Step number bubble */}
                        <span
                          className="mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[11px] font-black"
                          style={{
                            backgroundColor: isActive
                              ? marketingTone.teal
                              : "rgba(255,255,255,0.07)",
                            color: isActive
                              ? "#0f2129"
                              : marketingTone.muted,
                          }}
                        >
                          {i + 1}
                        </span>
                        {/* Step text */}
                        <span>
                          <span
                            className="block text-[12.5px] font-black leading-snug"
                            style={{
                              color: isActive
                                ? marketingTone.text
                                : marketingTone.soft,
                            }}
                          >
                            {step.title}
                          </span>
                          <span
                            className="mt-0.5 block text-[11px] leading-snug"
                            style={{ color: marketingTone.muted }}
                          >
                            {step.note}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>

            {/* Stage — dark teal gradient panel */}
            <div
              className="flex min-h-[600px] flex-col justify-between p-5 sm:p-6"
              style={{
                background:
                  "linear-gradient(160deg, rgba(18,63,74,0.98) 0%, rgba(11,40,50,0.99) 52%, rgba(7,20,28,1) 100%)",
              }}
            >
              {/* Content: step header + screen */}
              <div aria-live="polite" className="grid gap-5">
                {/* Step kicker pill */}
                <div
                  className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5"
                  style={{
                    borderColor: "rgba(255,255,255,0.18)",
                    backgroundColor: "rgba(255,255,255,0.09)",
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: marketingTone.emerald }}
                  />
                  <span
                    className="text-[11px] font-black tracking-[0.1em]"
                    style={{ color: "rgba(255,255,255,0.84)" }}
                  >
                    {copy.stepLabel(activeIndex + 1, totalSteps)}
                  </span>
                </div>

                {/* Heading + description */}
                <div>
                  <h3
                    className="text-[22px] font-black leading-[1.08] sm:text-[27px]"
                    style={{ color: "#fff" }}
                  >
                    {current.heading}
                  </h3>
                  <p
                    className="mt-2 max-w-[58ch] text-[13.5px] leading-6"
                    style={{ color: "rgba(255,255,255,0.70)" }}
                  >
                    {current.description}
                  </p>
                </div>

                {/* Screen: data rows + draft box */}
                <div
                  className="grid gap-2 rounded-[18px] border p-4"
                  style={{
                    borderColor: "rgba(255,255,255,0.13)",
                    backgroundColor: "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {current.rows.map(([label, value]) => (
                    <div
                      className="flex items-center justify-between gap-3 rounded-[11px] px-3 py-2"
                      key={`${label}-${value}`}
                      style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                    >
                      <span
                        className="text-[12px] font-black"
                        style={{ color: "rgba(255,255,255,0.56)" }}
                      >
                        {label}
                      </span>
                      <span
                        className="text-right text-[12.5px] font-black"
                        style={{ color: "rgba(255,255,255,0.92)" }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}

                  {/* Draft / insight box — white card */}
                  <div
                    className="rounded-[14px] p-3.5"
                    style={{
                      backgroundColor: "#fff",
                      boxShadow: "0 18px 44px rgba(0,0,0,0.20)",
                    }}
                  >
                    <p
                      className="mb-1.5 text-[10.5px] font-black uppercase tracking-[0.13em]"
                      style={{ color: "#0f766e" }}
                    >
                      {current.draftTitle}
                    </p>
                    <p
                      className="text-[12.5px] leading-5"
                      style={{ color: "#4b5563" }}
                    >
                      {current.draft}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer: outcome + prev/next */}
              <div
                className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
                style={{ borderColor: "rgba(255,255,255,0.13)" }}
              >
                {/* Outcome text */}
                <div>
                  <p
                    className="text-[13px] font-black"
                    style={{ color: "#fff" }}
                  >
                    {current.outcome}
                  </p>
                  <p
                    className="mt-0.5 text-[11px]"
                    style={{ color: "rgba(255,255,255,0.54)" }}
                  >
                    {current.safety}
                  </p>
                </div>

                {/* Navigation buttons */}
                <div className="flex shrink-0 gap-2">
                  <button
                    className="rounded-full border px-4 py-2 text-[12px] font-black transition-opacity"
                    disabled={isFirst}
                    onClick={() => goTo(activeIndex - 1)}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.09)",
                      borderColor: "rgba(255,255,255,0.20)",
                      color: "#fff",
                      cursor: isFirst ? "not-allowed" : "pointer",
                      opacity: isFirst ? 0.38 : 1,
                    }}
                    type="button"
                  >
                    {copy.prevLabel}
                  </button>
                  <button
                    className="rounded-full px-4 py-2 text-[12px] font-black transition-opacity"
                    disabled={isLast}
                    onClick={() => goTo(activeIndex + 1)}
                    style={{
                      backgroundColor: isLast
                        ? "rgba(255,255,255,0.42)"
                        : "#fff",
                      color: "#0f3d4a",
                      cursor: isLast ? "not-allowed" : "pointer",
                      opacity: isLast ? 0.55 : 1,
                    }}
                    type="button"
                  >
                    {copy.nextLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MarketingShell>
    </section>
  );
}
