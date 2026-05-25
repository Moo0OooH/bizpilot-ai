/**
 * ============================================================
 * File: components/public/interactive-cleaning-demo.tsx
 * Project: BizPilot AI
 * Description: Interactive 7-step cleaning quote demo for homepage.
 *   Scenario: Maria C., move-in cleaning, 3-bed house, website form.
 *   Completely distinct from the hero desk (Sarah M., move-out, Instagram).
 * Role: Shows end-to-end customer/system/owner workflow with guardrails.
 * Related:
 * - app/page.tsx
 * - components/public/marketing-ui.tsx
 * - lib/i18n/language.ts
 * Author: MoOoH
 * Updated: 2026-05-25
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
type DraftKind = "note" | "summary" | "draft" | "followup";

type DemoField = Readonly<{
  label: string;
  tone?: FieldTone;
  value: string;
}>;

type DemoStep = Readonly<{
  detail: string;
  draft: string;
  draftKind: DraftKind;
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
  draftKinds: Record<DraftKind, string>;
  eyebrow: string;
  incomingLabel: string;
  intro: string;
  next: string;
  previous: string;
  stepLabel: (current: number, total: number) => string;
  steps: ReadonlyArray<DemoStep>;
  title: string;
}>;

// ─── Design tokens ────────────────────────────────────────────────────────────

/** Field card colour system — bg / left-border / label / value */
const FIELD_TONES: Record<
  FieldTone,
  { bg: string; accent: string; label: string; value: string }
> = {
  neutral: {
    bg: "rgba(255,255,255,0.06)",
    accent: "rgba(255,255,255,0.22)",
    label: "rgba(255,255,255,0.46)",
    value: "#FFFFFF",
  },
  good: {
    bg: "rgba(45,212,191,0.10)",
    accent: "#2DD4BF",
    label: "#7DE8D9",
    value: "#DDFAF6",
  },
  warn: {
    bg: "rgba(246,184,75,0.10)",
    accent: "#F6B84B",
    label: "#E0AA3E",
    value: "#FEF3CC",
  },
  risk: {
    bg: "rgba(255,95,102,0.10)",
    accent: "#FF5F66",
    label: "#FF8C92",
    value: "#FFE5E6",
  },
};

/** Draft-box chip colours — bg / text / dot */
const DRAFT_KIND_TOKENS: Record<
  DraftKind,
  { bg: string; text: string; dot: string }
> = {
  note: {
    bg: "rgba(255,255,255,0.09)",
    text: "rgba(255,255,255,0.62)",
    dot: "rgba(255,255,255,0.38)",
  },
  summary: {
    bg: "rgba(45,212,191,0.13)",
    text: "#7DE8D9",
    dot: "#2DD4BF",
  },
  draft: {
    bg: "rgba(246,184,75,0.13)",
    text: "#E0AA3E",
    dot: "#F6B84B",
  },
  followup: {
    bg: "rgba(139,92,246,0.13)",
    text: "#C4B5FD",
    dot: "#8B5CF6",
  },
};

// ─── English copy ─────────────────────────────────────────────────────────────

const englishDemo: DemoCopy = {
  channelLabel: "via Website Form",
  customerMessage:
    "Hi, just bought a house and need a thorough cleaning before we move furniture in. 3-bedroom house, needs to be done before Wednesday.",
  customerName: "Maria C.",
  cta: "See founder pilot terms",
  draftKinds: {
    note: "System note",
    summary: "AI summary",
    draft: "Reply draft",
    followup: "Follow-up draft",
  },
  eyebrow: "Live walkthrough",
  incomingLabel: "Incoming customer request",
  intro:
    "Follow one real move-in cleaning request from the first message to follow-up. BizPilot organizes the work — the owner stays in control of every decision.",
  next: "Next step",
  previous: "Back",
  stepLabel: (current, total) => `Step ${current} of ${total}`,
  title: "See how BizPilot turns a raw quote request into a clean, safe reply.",
  steps: [
    {
      title: "Customer question",
      note: "Lead captured before it disappears into an inbox.",
      detail:
        "Maria just purchased a 3-bedroom house and needs a deep clean before the movers arrive. She reaches out through the website form with a tight deadline but no details on square footage or property condition.",
      draftKind: "note",
      draft:
        "New move-in cleaning request from Maria C. Property: 3-bed house, recently purchased. Timing: before Wednesday. Details still needed before any estimate can be given.",
      fields: [
        { label: "Customer", value: "Maria C.", tone: "neutral" },
        { label: "Service", value: "Move-in cleaning", tone: "neutral" },
        { label: "Deadline", value: "Before Wednesday", tone: "warn" },
      ],
      guardrail: "No auto-send. No invented price.",
      outcome: "The lead is captured and structured before anything is promised.",
    },
    {
      title: "Lead organized",
      note: "All channels feed one clean queue — no scattered forms.",
      detail:
        "BizPilot converts the website form submission into a structured lead record with source, status, and urgency tagged automatically. The owner sees the full context in one place instead of searching through email threads.",
      draftKind: "note",
      draft:
        "Lead record created. Source: website form. Status: new. Urgency: high — 3-day window. Move-in job, likely deep-clean scope. Owner review required before any pricing.",
      fields: [
        { label: "Source", value: "Website form", tone: "good" },
        { label: "Status", value: "New lead", tone: "good" },
        { label: "Urgency", value: "High — 3-day window", tone: "warn" },
      ],
      guardrail: "Organized data stays scoped to the business.",
      outcome: "The request becomes operational, not messy.",
    },
    {
      title: "Missing details flagged",
      note: "System spots the gaps before the owner makes any commitment.",
      detail:
        "Before the owner quotes anything, BizPilot flags exactly what is missing. For a move-in clean, square footage and property condition determine the job scope entirely — guessing costs the business time and trust.",
      draftKind: "note",
      draft:
        "Do not price yet. Missing: approximate square footage, current property condition (post-construction / vacant / dusty), and whether cleaning products should be supplied.",
      fields: [
        { label: "Missing", value: "Square footage", tone: "warn" },
        { label: "Missing", value: "Property condition", tone: "warn" },
        { label: "Risk", value: "No estimate yet", tone: "risk" },
      ],
      guardrail: "No booking promise. No price guessing.",
      outcome: "The owner knows exactly what to confirm before replying.",
    },
    {
      title: "System summary",
      note: "AI summarizes — the owner makes the call.",
      detail:
        "BizPilot prepares a short, structured brief so the owner can understand the lead quality and next steps at a glance — without re-reading the original message.",
      draftKind: "summary",
      draft:
        "Move-in cleaning for a 3-bedroom house purchased recently. Deadline is Wednesday — tight but workable. Warm lead, clear intent, ready to book once square footage and condition are confirmed. Priority: reply within the hour.",
      fields: [
        { label: "Intent", value: "Move-in clean", tone: "good" },
        { label: "Lead quality", value: "Warm", tone: "good" },
        { label: "Next action", value: "Confirm missing info", tone: "warn" },
      ],
      guardrail: "AI assists. Owner reviews.",
      outcome: "The lead is easy to prioritize at a glance.",
    },
    {
      title: "Reply drafted",
      note: "A useful draft — not an auto-send.",
      detail:
        "The owner gets a professionally worded reply that asks for only what is needed. It is friendly, specific, and does not guess at price or availability. Nothing leaves without the owner's decision.",
      draftKind: "draft",
      draft:
        "Hi Maria, congratulations on your new home! We would love to help you get it ready before moving day. Could you share the approximate square footage and let us know the current condition of the property — we want to make sure we give you an accurate quote.",
      fields: [
        { label: "Tone", value: "Warm and professional", tone: "good" },
        { label: "Action", value: "Owner review required", tone: "good" },
        { label: "Send mode", value: "Manual copy / send", tone: "neutral" },
      ],
      guardrail: "The message is never sent automatically.",
      outcome: "A safer, better reply is ready in seconds.",
    },
    {
      title: "Owner review gate",
      note: "BizPilot never sends without the owner's explicit decision.",
      detail:
        "The owner reads the draft, adjusts the tone or adds a detail if needed, copies the message, and sends it from their normal customer channel. BizPilot keeps the owner in the loop — no autonomous decisions.",
      draftKind: "draft",
      draft:
        "Hi Maria, congrats on your new home! We would love to help get it move-in ready. Could you share the approximate square footage and the property's current condition? That lets us give you an accurate quote right away.",
      fields: [
        { label: "Review", value: "Owner reads draft", tone: "neutral" },
        { label: "Edit", value: "Tone or details", tone: "neutral" },
        { label: "Send", value: "Owner-controlled only", tone: "good" },
      ],
      guardrail: "Manual copy / send only. Always.",
      outcome: "Maria receives a fast, human-reviewed reply.",
    },
    {
      title: "Follow-up stays visible",
      note: "Warm leads stay visible — no silent loss.",
      detail:
        "If Maria does not reply by Tuesday morning, BizPilot keeps the follow-up visible on the owner's dashboard. A follow-up draft is ready — the owner decides if, when, and how to reach out.",
      draftKind: "followup",
      draft:
        "Hi Maria, just checking in — we want to make sure we can fit your cleaning in before Wednesday. If you can share the square footage, we can confirm availability and get you a quote today.",
      fields: [
        { label: "Status", value: "Awaiting reply", tone: "warn" },
        { label: "Follow-up by", value: "Tuesday morning", tone: "good" },
        { label: "Draft", value: "Ready to review", tone: "good" },
      ],
      guardrail: "The owner decides if and when to follow up.",
      outcome: "The lead stays active instead of going cold.",
    },
  ],
};

// ─── French copy ──────────────────────────────────────────────────────────────

const frenchDemo: DemoCopy = {
  channelLabel: "via formulaire web",
  customerMessage:
    "Bonjour, je viens d'acheter une maison et j'ai besoin d'un grand menage avant qu'on deplace les meubles. Maison de 3 chambres, ca doit etre fait avant mercredi.",
  customerName: "Maria C.",
  cta: "Voir les conditions pilote",
  draftKinds: {
    note: "Note systeme",
    summary: "Resume IA",
    draft: "Brouillon reponse",
    followup: "Brouillon suivi",
  },
  eyebrow: "Demonstration en direct",
  incomingLabel: "Demande entrante",
  intro:
    "Suivez une vraie demande de nettoyage emmenagement, du premier message jusqu'au suivi. BizPilot organise le travail — le proprietaire garde le controle de chaque decision.",
  next: "Etape suivante",
  previous: "Retour",
  stepLabel: (current, total) => `Etape ${current} de ${total}`,
  title: "Voyez comment BizPilot transforme une demande brute en reponse claire et sure.",
  steps: [
    {
      title: "Question client",
      note: "Lead capture avant de disparaitre dans une boite de reception.",
      detail:
        "Maria vient d'acheter une maison de 3 chambres et a besoin d'un grand menage avant l'arrivee des demenageurs. Elle contacte via le formulaire web avec un delai serre mais sans details sur la superficie ni l'etat du logement.",
      draftKind: "note",
      draft:
        "Nouvelle demande de nettoyage emmenagement de Maria C. Propriete : maison 3 chambres, recemment achetee. Delai : avant mercredi. Details encore necessaires avant toute estimation.",
      fields: [
        { label: "Cliente", value: "Maria C.", tone: "neutral" },
        { label: "Service", value: "Nettoyage emmenagement", tone: "neutral" },
        { label: "Delai", value: "Avant mercredi", tone: "warn" },
      ],
      guardrail: "Aucun envoi automatique. Aucun prix invente.",
      outcome: "Le lead est structure avant que quoi que ce soit soit promis.",
    },
    {
      title: "Lead organise",
      note: "Tous les canaux alimentent une file propre.",
      detail:
        "BizPilot convertit la soumission du formulaire web en un lead structure avec source, statut et urgence tags automatiquement. Le proprietaire voit le contexte complet en un endroit au lieu de fouiller dans les fils de courriel.",
      draftKind: "note",
      draft:
        "Lead cree. Source : formulaire web. Statut : nouveau. Urgence : elevee — fenetre de 3 jours. Travail d'emmenagement, portee probablement grand menage. Revision du proprietaire requise avant tout prix.",
      fields: [
        { label: "Source", value: "Formulaire web", tone: "good" },
        { label: "Statut", value: "Nouveau lead", tone: "good" },
        { label: "Urgence", value: "Elevee — 3 jours", tone: "warn" },
      ],
      guardrail: "Les donnees restent limitees a l'entreprise.",
      outcome: "La demande devient operationnelle, pas desordonnee.",
    },
    {
      title: "Infos manquantes",
      note: "Le systeme repere les lacunes avant tout engagement.",
      detail:
        "Avant que le proprietaire donne un prix, BizPilot signale exactement ce qui manque. Pour un nettoyage d'emmenagement, la superficie et l'etat du logement determinent entierement la portee du travail.",
      draftKind: "note",
      draft:
        "Ne pas chiffrer pour l'instant. Manquant : superficie approximative, etat actuel du logement (post-construction / vacant / poussieres), et si les produits de nettoyage doivent etre fournis.",
      fields: [
        { label: "Manquant", value: "Superficie", tone: "warn" },
        { label: "Manquant", value: "Etat du logement", tone: "warn" },
        { label: "Risque", value: "Aucune estimation", tone: "risk" },
      ],
      guardrail: "Aucune promesse. Aucun prix devine.",
      outcome: "Le proprietaire sait quoi confirmer avant de repondre.",
    },
    {
      title: "Resume systeme",
      note: "L'IA resume — le proprietaire prend la decision.",
      detail:
        "BizPilot prepare un bref structure pour que le proprietaire comprenne la qualite du lead et les prochaines etapes d'un coup d'oeil — sans relire le message original.",
      draftKind: "summary",
      draft:
        "Nettoyage d'emmenagement pour une maison de 3 chambres recemment achetee. Delai : mercredi — serre mais faisable. Lead chaud, intention claire, pret a reserver apres confirmation de la superficie et de l'etat. Priorite : repondre dans l'heure.",
      fields: [
        { label: "Intention", value: "Nettoyage emmenagement", tone: "good" },
        { label: "Qualite", value: "Lead chaud", tone: "good" },
        { label: "Action", value: "Confirmer les infos", tone: "warn" },
      ],
      guardrail: "L'IA aide. Le proprietaire revise.",
      outcome: "Le lead est facile a prioriser d'un coup d'oeil.",
    },
    {
      title: "Reponse redigee",
      note: "Un brouillon utile — pas un envoi automatique.",
      detail:
        "Le proprietaire recoit une reponse professionnelle qui demande seulement ce qui est necessaire. Elle est chaleureuse, precise et ne devine pas le prix ni la disponibilite. Rien ne part sans la decision du proprietaire.",
      draftKind: "draft",
      draft:
        "Bonjour Maria, felicitations pour votre nouvelle maison ! On adorait vous aider a la preparer avant le jour du demenagement. Pourriez-vous partager la superficie approximative et l'etat actuel du logement — on veut s'assurer de vous donner une soumission precise.",
      fields: [
        { label: "Ton", value: "Chaleureux et professionnel", tone: "good" },
        { label: "Action", value: "Revision proprietaire", tone: "good" },
        { label: "Envoi", value: "Copier / envoyer manuel", tone: "neutral" },
      ],
      guardrail: "Le message n'est jamais envoye automatiquement.",
      outcome: "Une reponse plus sure est prete en quelques secondes.",
    },
    {
      title: "Gate proprietaire",
      note: "BizPilot n'envoie jamais sans la decision du proprietaire.",
      detail:
        "Le proprietaire lit le brouillon, ajuste le ton ou ajoute un detail si necessaire, copie le message et l'envoie depuis son canal client habituel. BizPilot garde le proprietaire dans la boucle — aucune decision autonome.",
      draftKind: "draft",
      draft:
        "Bonjour Maria, felicitations pour votre maison ! On adorait vous aider a la rendre prete pour l'emmenagement. Pourriez-vous partager la superficie approximative et l'etat actuel ? On pourra vous confirmer les disponibilites et la soumission rapidement.",
      fields: [
        { label: "Revision", value: "Le proprietaire lit", tone: "neutral" },
        { label: "Modifier", value: "Ton ou details", tone: "neutral" },
        { label: "Envoyer", value: "Controle proprietaire", tone: "good" },
      ],
      guardrail: "Copier / envoyer manuellement seulement. Toujours.",
      outcome: "Maria recoit une reponse rapide, revisee par un humain.",
    },
    {
      title: "Suivi visible",
      note: "Les leads chauds restent visibles — aucune perte silencieuse.",
      detail:
        "Si Maria ne repond pas avant mardi matin, BizPilot garde le suivi visible dans le tableau de bord du proprietaire. Un brouillon de suivi est pret — le proprietaire decide si, quand et comment relancer.",
      draftKind: "followup",
      draft:
        "Bonjour Maria, je fais un suivi rapide — on veut s'assurer de pouvoir planifier votre nettoyage avant mercredi. Si vous pouvez partager la superficie, on peut confirmer les disponibilites et vous envoyer une soumission aujourd'hui.",
      fields: [
        { label: "Statut", value: "En attente de reponse", tone: "warn" },
        { label: "Suivi avant", value: "Mardi matin", tone: "good" },
        { label: "Brouillon", value: "Pret a reviser", tone: "good" },
      ],
      guardrail: "Le proprietaire decide si et quand faire le suivi.",
      outcome: "Le lead reste actif au lieu de refroidir.",
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
  const kindTokens = DRAFT_KIND_TOKENS[activeStep.draftKind];
  const kindLabel = copy.draftKinds[activeStep.draftKind];

  return (
    <section className="px-5 py-8 sm:px-6 sm:py-10" id="cleaning-demo">
      <MarketingShell>
        {/* ── Section header ────────────────────────────────────────────── */}
        <div className="mb-7">
          <MarketingBadge>{copy.eyebrow}</MarketingBadge>
          <h2
            className="mt-4 max-w-[720px] text-[24px] font-black leading-[1.1] sm:text-[32px]"
            style={{ color: marketingTone.text }}
          >
            {copy.title}
          </h2>
          <p
            className="mt-3 max-w-[580px] text-[13px] leading-[1.75]"
            style={{ color: marketingTone.soft }}
          >
            {copy.intro}
          </p>
        </div>

        {/* ── Demo shell ────────────────────────────────────────────────── */}
        <div
          className="overflow-hidden rounded-[28px] border"
          style={{
            background:
              "linear-gradient(150deg, rgba(10,36,50,0.98) 0%, rgba(6,18,30,0.99) 50%, rgba(3,10,20,1) 100%)",
            borderColor: "rgba(45,212,191,0.20)",
            boxShadow:
              "0 48px 120px rgba(0,0,0,0.42), 0 0 0 1px rgba(45,212,191,0.05), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div className="grid min-w-0 lg:grid-cols-[minmax(272px,0.38fr)_minmax(0,0.62fr)]">

            {/* ════════════════════════════════════════════════════════════
                LEFT SIDEBAR
            ════════════════════════════════════════════════════════════ */}
            <div
              className="border-b lg:border-b-0 lg:border-r"
              style={{ borderColor: "rgba(255,255,255,0.07)" }}
            >

              {/* Customer message bubble */}
              <div className="p-4 pb-0">
                <div
                  className="rounded-[20px] border p-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(45,212,191,0.09), rgba(23,212,146,0.04))",
                    borderColor: "rgba(45,212,191,0.22)",
                  }}
                >
                  {/* Incoming label */}
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(45,212,191,0.28), rgba(23,212,146,0.16))",
                      }}
                    >
                      <svg aria-hidden="true" fill="none" height="9" viewBox="0 0 10 10" width="9">
                        <path d="M1 9 5 1l4 8H6.5L5 5 3.5 9H1Z" fill={marketingTone.teal} />
                      </svg>
                    </span>
                    <span
                      className="text-[10px] font-black uppercase tracking-[0.14em]"
                      style={{ color: marketingTone.teal }}
                    >
                      {copy.incomingLabel}
                    </span>
                  </div>

                  {/* Message bubble */}
                  <blockquote
                    className="rounded-[14px] p-3.5"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      borderLeft: `3px solid ${marketingTone.teal}`,
                    }}
                  >
                    <p
                      className="text-[13px] italic leading-[1.7]"
                      style={{ color: "rgba(255,255,255,0.86)" }}
                    >
                      &ldquo;{copy.customerMessage}&rdquo;
                    </p>
                  </blockquote>

                  {/* Sender meta */}
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: marketingTone.emerald }}
                    />
                    <span
                      className="text-[11px] font-black"
                      style={{ color: marketingTone.muted }}
                    >
                      {copy.customerName}&ensp;&middot;&ensp;{copy.channelLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-4 py-2">
                <div
                  className="h-[3px] overflow-hidden rounded-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-in-out"
                    style={{
                      width: `${progressPct}%`,
                      background:
                        "linear-gradient(90deg, rgba(45,212,191,0.72) 0%, rgba(23,212,146,0.88) 100%)",
                    }}
                  />
                </div>
              </div>

              {/* Step navigation */}
              <nav aria-label={copy.eyebrow} className="grid gap-1 px-3 pb-4">
                {copy.steps.map((step, index) => {
                  const isActive = index === activeIndex;
                  const isPast = index < activeIndex;

                  return (
                    <button
                      aria-current={isActive ? "step" : undefined}
                      className="grid grid-cols-[28px_minmax(0,1fr)] items-start gap-3 rounded-[16px] border px-3 py-2.5 text-left transition-all duration-200"
                      key={step.title}
                      onClick={() => setActiveIndex(index)}
                      style={{
                        backgroundColor: isActive
                          ? "rgba(45,212,191,0.10)"
                          : "transparent",
                        borderColor: isActive
                          ? "rgba(45,212,191,0.28)"
                          : "transparent",
                        cursor: "poin