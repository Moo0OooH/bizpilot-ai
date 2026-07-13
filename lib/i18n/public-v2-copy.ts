/*
 * ============================================================
 * File: lib/i18n/public-v2-copy.ts
 * Project: BizPilot AI
 * Description: Bilingual public-site V2 positioning and page copy.
 * Role: Presents the universal smart-intake core without overstating the current cleaning-first pilot or roadmap integrations.
 * Related:
 * - app/page.tsx
 * - components/public/bizpilot-v2-home.tsx
 * - components/public/bizpilot-v2-page.tsx
 * Author: MoOoH
 * Created: 2026-07-13
 * Last Updated: 2026-07-13
 * ============================================================
 */

import type { HomeNavCopy } from "./home-copy.ts";
import {
  DEFAULT_LANGUAGE,
  readSupportedLanguage,
  type SupportedLanguage,
} from "./language.ts";

export type PublicV2MetaCopy = Readonly<{
  description: string;
  title: string;
}>;

export type PublicV2Signal = Readonly<{
  label: string;
  value: string;
}>;

export type PublicV2CardTone = "blue" | "gold" | "neutral" | "red" | "teal";

export type PublicV2Card = Readonly<{
  badge?: string;
  body: string;
  cta?: string;
  points?: readonly string[];
  price?: string;
  title: string;
  tone?: PublicV2CardTone;
}>;

export type PublicV2Section = Readonly<{
  body?: string;
  cards: readonly PublicV2Card[];
  eyebrow?: string;
  title: string;
}>;

export type PublicV2PageCopy = Readonly<{
  badge: string;
  body: string;
  finalCta: Readonly<{
    body: string;
    primary: string;
    secondary: string;
    title: string;
  }>;
  meta: PublicV2MetaCopy;
  notice?: Readonly<{
    badge: string;
    body: string;
    title: string;
  }>;
  primaryCta: string;
  secondaryCta: string;
  sections: readonly PublicV2Section[];
  signals: readonly PublicV2Signal[];
  title: string;
}>;

export type PublicV2FaqItem = Readonly<{
  answer: string;
  question: string;
}>;

export type PublicV2HomeCopy = Readonly<{
  control: Readonly<{
    body: string;
    eyebrow: string;
    steps: readonly PublicV2Card[];
    title: string;
  }>;
  day: Readonly<{
    body: string;
    eyebrow: string;
    moments: readonly PublicV2Card[];
    title: string;
  }>;
  features: Readonly<{
    body: string;
    cards: readonly PublicV2Card[];
    eyebrow: string;
    title: string;
  }>;
  finalCta: Readonly<{
    assurances: readonly string[];
    body: string;
    primary: string;
    secondary: string;
    title: string;
  }>;
  flow: Readonly<{
    body: string;
    eyebrow: string;
    steps: readonly PublicV2Card[];
    title: string;
  }>;
  hero: Readonly<{
    badge: string;
    body: string;
    note: string;
    placements: readonly string[];
    primaryCta: string;
    proofs: readonly PublicV2Signal[];
    secondaryCta: string;
    title: string;
    workspace: Readonly<{
      actions: readonly string[];
      customer: string;
      draft: string;
      fields: readonly PublicV2Signal[];
      intakeLabel: string;
      missingLabel: string;
      replyLabel: string;
      status: string;
      title: string;
    }>;
  }>;
  industries: Readonly<{
    body: string;
    cards: readonly PublicV2Card[];
    eyebrow: string;
    title: string;
  }>;
  meta: PublicV2MetaCopy;
  nav: HomeNavCopy;
  problem: Readonly<{
    body: string;
    cards: readonly PublicV2Card[];
    eyebrow: string;
    title: string;
  }>;
  statement: Readonly<{
    body: string;
    title: string;
  }>;
}>;

export type PublicV2Copy = Readonly<{
  cleaning: PublicV2PageCopy;
  comparison: PublicV2PageCopy;
  demo: PublicV2PageCopy;
  faq: PublicV2PageCopy & Readonly<{ items: readonly PublicV2FaqItem[] }>;
  features: PublicV2PageCopy;
  home: PublicV2HomeCopy;
  pilot: PublicV2PageCopy;
  pricing: PublicV2PageCopy;
  trust: PublicV2PageCopy;
}>;

const englishNav: HomeNavCopy = {
  brandSubtitle: "Smart customer intake and reply workspace",
  cleaning: "Cleaning pilot",
  comparison: "Compare",
  copyright: "Copyright 2026 BizPilot AI. All rights reserved.",
  demo: "Demo",
  faq: "FAQ",
  features: "Product",
  flow: "How it works",
  guide: "Intake link guide",
  languageLabel: "Website language",
  pilot: "Pilot",
  pricing: "Pricing",
  privacy: "Privacy",
  security: "Security",
  signIn: "Sign in",
  startFull: "Apply for the founder pilot",
  startShort: "Apply for pilot",
  terms: "Terms",
  trust: "Trust",
  why: "Why BizPilot",
};

const frenchNav: HomeNavCopy = {
  brandSubtitle: "Espace de demandes client et de reponses assistees",
  cleaning: "Pilote entretien",
  comparison: "Comparer",
  copyright: "Copyright 2026 BizPilot AI. Tous droits reserves.",
  demo: "Demo",
  faq: "FAQ",
  features: "Produit",
  flow: "Fonctionnement",
  guide: "Guide du lien de demande",
  languageLabel: "Langue du site",
  pilot: "Pilote",
  pricing: "Tarifs",
  privacy: "Confidentialite",
  security: "Securite",
  signIn: "Connexion",
  startFull: "Demander l'acces au pilote fondateur",
  startShort: "Demander l'acces",
  terms: "Conditions",
  trust: "Confiance",
  why: "Pourquoi BizPilot",
};

const englishFaqItems: readonly PublicV2FaqItem[] = [
  {
    question: "Does BizPilot connect directly to Gmail, WhatsApp, Instagram, or SMS today?",
    answer:
      "No. The current pilot uses one smart intake link that can be shared from your website, Google Business Profile, social profiles, saved replies, or email signature. Direct channel integrations are roadmap items and are not presented as active features.",
  },
  {
    question: "Does AI send messages automatically?",
    answer:
      "No. BizPilot prepares a summary and reply draft. The owner reviews, edits, copies, and sends the response through the real customer channel.",
  },
  {
    question: "Can BizPilot invent prices or confirm bookings?",
    answer:
      "No. BizPilot can identify missing details and help prepare a careful follow-up. It does not invent pricing, promise availability, collect payment, or confirm a booking.",
  },
  {
    question: "Is BizPilot only for cleaning businesses?",
    answer:
      "The product core is designed for local service businesses. Cleaning is the first complete template, demo, and founder-pilot market. Other service templates remain roadmap work until the cleaning workflow is validated.",
  },
  {
    question: "What happens after a customer submits the intake form?",
    answer:
      "The request is organized into a lead record, missing information is surfaced, and an AI-assisted summary and reply draft can be prepared for owner review.",
  },
  {
    question: "Is BizPilot a CRM, booking platform, or invoicing system?",
    answer:
      "No. BizPilot sits before those systems. It helps turn a vague customer request into a clear, reviewable next action without trying to replace a full CRM, calendar, booking, or invoicing platform.",
  },
];

const frenchFaqItems: readonly PublicV2FaqItem[] = [
  {
    question: "BizPilot se connecte-t-il directement a Gmail, WhatsApp, Instagram ou aux SMS aujourd'hui?",
    answer:
      "Non. Le pilote actuel utilise un seul lien intelligent que vous pouvez partager sur votre site Web, votre fiche Google, vos profils sociaux, vos reponses enregistrees ou votre signature courriel. Les integrations directes sont clairement classees dans la feuille de route.",
  },
  {
    question: "L'IA envoie-t-elle des messages automatiquement?",
    answer:
      "Non. BizPilot prepare un resume et un brouillon. Le proprietaire verifie, modifie, copie et envoie lui-meme la reponse dans le canal reel du client.",
  },
  {
    question: "BizPilot peut-il inventer un prix ou confirmer une reservation?",
    answer:
      "Non. BizPilot peut reperer les renseignements manquants et aider a preparer une relance prudente. Il n'invente pas de prix, ne promet pas de disponibilite, ne prend pas de paiement et ne confirme pas de reservation.",
  },
  {
    question: "BizPilot est-il reserve aux entreprises d'entretien?",
    answer:
      "Le coeur du produit est concu pour les entreprises de services locales. L'entretien est le premier modele complet, la premiere demo et le premier marche pilote. Les autres secteurs restent dans la feuille de route jusqu'a la validation du flux d'entretien.",
  },
  {
    question: "Que se passe-t-il apres l'envoi du formulaire par le client?",
    answer:
      "La demande devient une fiche organisee, les renseignements manquants sont signales et un resume ainsi qu'un brouillon assiste par IA peuvent etre prepares pour validation.",
  },
  {
    question: "BizPilot est-il un CRM, un outil de reservation ou de facturation?",
    answer:
      "Non. BizPilot intervient avant ces systemes. Il transforme une demande vague en prochaine action claire sans chercher a remplacer un CRM complet, un calendrier, une plateforme de reservation ou la facturation.",
  },
];

const englishCopy: PublicV2Copy = {
  home: {
    meta: {
      title: "Smart Customer Intake and Reply Workspace | BizPilot AI",
      description:
        "BizPilot helps service businesses collect customer requests through one smart link, organize missing details, and prepare owner-reviewed AI reply drafts, starting with cleaning businesses.",
    },
    nav: englishNav,
    hero: {
      badge: "Smart customer intake + owner-reviewed replies",
      title: "Turn scattered customer requests into clear, ready-to-review replies.",
      body:
        "BizPilot gives service businesses one smart intake link, organizes every request, shows what is missing, and prepares an AI-assisted reply for the owner to review and send — starting with cleaning businesses.",
      primaryCta: "See the cleaning workflow",
      secondaryCta: "Apply for the founder pilot",
      note:
        "Current product: smart intake link, organized lead workspace, AI-assisted drafts, and manual owner approval. Direct inbox integrations are roadmap only.",
      placements: [
        "Website button",
        "Google Business Profile",
        "Instagram bio or saved reply",
        "Email signature",
      ],
      proofs: [
        { label: "Capture", value: "One clear intake link" },
        { label: "Clarity", value: "Missing details surfaced" },
        { label: "Control", value: "Nothing sends without you" },
      ],
      workspace: {
        title: "Customer request workspace",
        intakeLabel: "New smart-intake request",
        customer: "Maria — Move-out cleaning",
        status: "Reply needed before Friday",
        missingLabel: "BizPilot found what is missing",
        fields: [
          { label: "Property", value: "Square footage" },
          { label: "Scope", value: "Inside appliances" },
          { label: "Access", value: "Parking or key notes" },
          { label: "Timing", value: "Preferred arrival window" },
        ],
        replyLabel: "AI-assisted reply ready for review",
        draft:
          "Hi Maria, thanks for reaching out. Could you confirm the property size, appliance scope, access notes, and preferred time so I can prepare an accurate quote?",
        actions: ["Review", "Edit", "Copy", "Send manually"],
      },
    },
    statement: {
      title: "Customers do not need another app. They need one clear way to ask — and a fast, accurate response.",
      body:
        "BizPilot creates that path without pretending every inbox is already connected. Share one intake link where customers already find you, then review every response before it leaves your business.",
    },
    problem: {
      eyebrow: "The real leak",
      title: "The request is often valuable — but incomplete, scattered, and easy to delay.",
      body:
        "Service owners are on jobs, driving, managing staff, and answering existing customers. The problem is not a lack of messages. It is the work required to turn a vague request into a safe next reply.",
      cards: [
        {
          title: "Vague requests",
          body: "Customers ask for a price without the scope, location, timing, access, or service details needed to answer responsibly.",
          badge: "Missing context",
          tone: "gold",
        },
        {
          title: "Scattered entry points",
          body: "A website, Google profile, social bio, saved reply, and email signature can all point to different or unclear contact paths.",
          badge: "Inconsistent intake",
          tone: "red",
        },
        {
          title: "Slow manual preparation",
          body: "Even when the request is seen, the owner still has to interpret it, ask the right questions, and write the first response.",
          badge: "Delayed next action",
          tone: "blue",
        },
      ],
    },
    flow: {
      eyebrow: "One honest workflow",
      title: "From customer request to owner-approved reply.",
      body:
        "Each step does one job. No invented price, no automatic booking, and no message sent without human approval.",
      steps: [
        {
          badge: "01",
          title: "Share",
          body: "Place one smart intake link on the channels and pages your customers already use.",
        },
        {
          badge: "02",
          title: "Collect",
          body: "Use a service-aware form to gather the details needed for a useful first response.",
        },
        {
          badge: "03",
          title: "Organize",
          body: "Turn the submission into a clear lead record with source, service, timing, and missing information.",
        },
        {
          badge: "04",
          title: "Prepare",
          body: "Generate an AI-assisted summary and reply draft within the approved business context.",
        },
        {
          badge: "05",
          title: "Approve",
          body: "Review, edit, copy, and send manually through the real customer channel.",
        },
      ],
    },
    control: {
      eyebrow: "AI with a clear boundary",
      title: "AI helps with the work. The owner keeps the decision.",
      body:
        "BizPilot is designed around human review, truthful limits, and a recoverable manual fallback.",
      steps: [
        {
          title: "AI reads",
          body: "It summarizes only the information available in the request and approved business context.",
          tone: "blue",
        },
        {
          title: "AI prepares",
          body: "It drafts a practical reply or follow-up question instead of inventing a price or promise.",
          tone: "teal",
        },
        {
          title: "You approve",
          body: "The owner can edit, reject, or copy the draft. Nothing is auto-sent in the current pilot.",
          tone: "gold",
        },
        {
          title: "The customer receives",
          body: "The final message is sent manually through the business's real communication channel.",
          tone: "neutral",
        },
      ],
    },
    day: {
      eyebrow: "A calmer operating rhythm",
      title: "A day with BizPilot starts with clarity, not another inbox.",
      body:
        "The product does not promise automatic bookings. It makes the next responsible action easier to see and complete.",
      moments: [
        {
          badge: "8:00",
          title: "New requests are visible",
          body: "Submissions from the shared intake link are organized in one owner workspace.",
        },
        {
          badge: "9:00",
          title: "Missing information is clear",
          body: "The owner sees which requests need scope, timing, access, or service details before quoting.",
        },
        {
          badge: "10:00",
          title: "Drafts are ready to review",
          body: "AI-assisted replies provide a useful starting point without sending anything automatically.",
        },
        {
          badge: "Later",
          title: "Follow-up stays visible",
          body: "The owner can keep the next manual touch visible instead of relying on memory.",
        },
      ],
    },
    industries: {
      eyebrow: "Universal core, focused launch",
      title: "Built to expand across service businesses — validated first with cleaning.",
      body:
        "Only the cleaning template and demo are presented as pilot-ready. Other verticals are explicit roadmap templates, not active product claims.",
      cards: [
        {
          badge: "Founder pilot",
          title: "Cleaning",
          body: "Residential, deep cleaning, move-in or move-out, office, Airbnb turnover, and post-construction requests.",
          tone: "teal",
        },
        {
          badge: "Roadmap template",
          title: "HVAC + plumbing",
          body: "Service type, urgency, property context, access, issue details, and preferred timing.",
          tone: "neutral",
        },
        {
          badge: "Roadmap template",
          title: "Landscaping + painting",
          body: "Property scope, photos, measurements, material preferences, timing, and site access.",
          tone: "neutral",
        },
        {
          badge: "Roadmap template",
          title: "Other local services",
          body: "A configurable intake foundation for future validated service categories.",
          tone: "neutral",
        },
      ],
    },
    features: {
      eyebrow: "What the product does today",
      title: "A focused workspace between a messy request and your next system.",
      body:
        "BizPilot is not a full CRM or booking engine. It handles the high-friction intake and response moment before those tools become useful.",
      cards: [
        {
          title: "Smart intake link",
          body: "One mobile-friendly request path that can be shared wherever customers already discover the business.",
        },
        {
          title: "Service-aware forms",
          body: "Editable fields and templates that collect the details needed for the selected service.",
        },
        {
          title: "Organized lead record",
          body: "Customer, service, source, timing, request details, and next action in one clear view.",
        },
        {
          title: "Missing-detail detection",
          body: "A visible checklist of information still needed before a responsible quote or next reply.",
        },
        {
          title: "AI summary and draft",
          body: "On-demand assistance that prepares a useful starting point within approved guardrails.",
        },
        {
          title: "Manual follow-up visibility",
          body: "Keep the next owner action visible without pretending the product sends or books automatically.",
        },
      ],
    },
    finalCta: {
      title: "See how much clearer your next customer request could be.",
      body:
        "The founder pilot starts with one cleaning intake workflow, one owner workspace, and one controlled reply process.",
      primary: "Watch the cleaning demo",
      secondary: "Apply for the founder pilot",
      assurances: [
        "No credit card on application",
        "No auto-send",
        "No invented pricing",
        "Founder-led setup",
      ],
    },
  },
  features: {
    meta: {
      title: "Product | BizPilot AI",
      description:
        "Explore BizPilot's smart intake link, service-aware forms, organized lead workspace, missing-detail detection, AI-assisted reply drafts, and manual owner approval.",
    },
    badge: "Current product",
    title: "Everything needed to turn a vague request into a clear next reply.",
    body:
      "BizPilot focuses on the intake and response gap before CRM, booking, invoicing, or automation. The current product is intentionally narrow, owner-controlled, and pilot-ready for cleaning businesses.",
    primaryCta: "See the workflow demo",
    secondaryCta: "Review trust boundaries",
    signals: [
      { label: "Capture", value: "One smart intake link" },
      { label: "Understand", value: "Structured request + missing details" },
      { label: "Respond", value: "Owner-reviewed AI draft" },
    ],
    sections: [
      {
        eyebrow: "Capture",
        title: "Give every customer one clear request path.",
        body: "Share the intake link from the website, Google Business Profile, social profiles, saved replies, or email signatures.",
        cards: [
          { title: "Smart intake link", body: "A direct, branded, mobile-friendly path for customer requests." },
          { title: "Source attribution", body: "Keep simple placement context without putting personal data into tracking tags." },
          { title: "Service-aware fields", body: "Ask the right questions for the selected service instead of using one generic contact form." },
        ],
      },
      {
        eyebrow: "Organize",
        title: "Make the request useful before the owner replies.",
        cards: [
          { title: "Lead workspace", body: "See customer, service, source, timing, details, and next action together." },
          { title: "Missing-detail detection", body: "Surface what is still needed before quoting or making a promise." },
          { title: "Manual follow-up visibility", body: "Keep the next human touch visible instead of relying on memory." },
        ],
      },
      {
        eyebrow: "Assist",
        title: "Use AI as a prepared starting point — not an autonomous operator.",
        cards: [
          { title: "Request summary", body: "Condense the customer request into the context the owner needs." },
          { title: "Reply draft", body: "Prepare a careful response or follow-up question for owner review." },
          { title: "Approval boundary", body: "Review, edit, copy, and send manually. No current auto-send." },
        ],
      },
    ],
    notice: {
      badge: "Roadmap, not active",
      title: "Direct inbox integrations are not part of the current product claim.",
      body:
        "Gmail, WhatsApp, Instagram, Messenger, and SMS connections can be explored after validation. Today, the honest workflow begins with the smart intake link.",
    },
    finalCta: {
      title: "See the focused workflow before comparing feature lists.",
      body: "The cleaning demo shows the complete current path from request to owner-reviewed reply.",
      primary: "Watch the demo",
      secondary: "Compare BizPilot",
    },
  },
  demo: {
    meta: {
      title: "Cleaning Workflow Demo | BizPilot AI",
      description:
        "See the current BizPilot cleaning workflow: smart intake link, organized request, missing details, AI-assisted reply draft, and manual owner approval.",
    },
    badge: "Current cleaning demo",
    title: "See one customer request become a safe, reviewable next reply.",
    body:
      "The demo stays deliberately concrete: a cleaning customer submits a request, BizPilot organizes it, surfaces missing information, and prepares a draft for the owner to review and send manually.",
    primaryCta: "Apply for the founder pilot",
    secondaryCta: "Explore the product",
    signals: [
      { label: "Input", value: "Cleaning request link" },
      { label: "Processing", value: "Structured details + missing fields" },
      { label: "Output", value: "Draft for owner review" },
    ],
    sections: [
      {
        eyebrow: "Step 1",
        title: "The customer uses one clear cleaning request link.",
        cards: [
          { title: "Service", body: "Move-out cleaning" },
          { title: "Timing", body: "Needed before Friday" },
          { title: "Initial note", body: "Customer asks for a quote but leaves scope and access incomplete." },
        ],
      },
      {
        eyebrow: "Step 2",
        title: "BizPilot turns the submission into an organized lead.",
        cards: [
          { title: "Known", body: "Customer, service, deadline, contact path, and original request." },
          { title: "Missing", body: "Square footage, appliance scope, parking or key notes, and preferred time." },
          { title: "Next action", body: "Ask once for the missing details before preparing a quote." },
        ],
      },
      {
        eyebrow: "Step 3",
        title: "AI prepares a careful reply for the owner.",
        cards: [
          { title: "Summary", body: "A short, factual reading of the request and its urgency." },
          { title: "Draft", body: "A polite follow-up that asks for the exact missing information." },
          { title: "Owner action", body: "Review, edit, copy, and send manually through the real customer channel." },
        ],
      },
    ],
    notice: {
      badge: "Demo boundary",
      title: "This is not a booking or automated messaging demo.",
      body:
        "The demo does not invent a price, confirm availability, collect payment, book a job, or send a customer message automatically.",
    },
    finalCta: {
      title: "Use the same workflow with one real cleaning service first.",
      body: "Founder-led setup keeps the first pilot narrow enough to measure and improve.",
      primary: "Apply for the pilot",
      secondary: "See pilot pricing",
    },
  },
  pricing: {
    meta: {
      title: "Founder Pilot Pricing | BizPilot AI",
      description:
        "Review staged founder-pilot pricing for the current cleaning intake and owner-reviewed reply workflow. Setup and billing remain manual and approval-gated.",
    },
    badge: "Founder-pilot terms",
    title: "Simple pilot pricing for one controlled customer-intake workflow.",
    body:
      "Pricing is staged because the product is still being validated with cleaning businesses. There is no self-serve checkout and no automatic billing claim.",
    primaryCta: "Apply for the founder pilot",
    secondaryCta: "Review product boundaries",
    signals: [
      { label: "Setup", value: "Founder-led" },
      { label: "Billing", value: "Manual after approval" },
      { label: "Scope", value: "Intake + owner-reviewed replies" },
    ],
    sections: [
      {
        eyebrow: "Businesses 1–5",
        title: "Founder Feedback Pilot",
        cards: [
          {
            badge: "Feedback required",
            title: "$0 setup",
            price: "Founder-led validation",
            body: "For the first approved cleaning businesses willing to test one workflow and provide structured feedback.",
            points: [
              "Cleaning request link",
              "Lead workspace",
              "AI summary and reply-draft assistance",
              "Manual copy and send",
              "30- and 60-day feedback commitment",
            ],
            cta: "Apply for founder pilot",
            tone: "teal",
          },
        ],
      },
      {
        eyebrow: "After the feedback cohort",
        title: "Starter and Pro Pilot",
        cards: [
          {
            badge: "Starter pilot",
            title: "$149 setup + $49/month",
            price: "Manual billing after approval",
            body: "A focused branded intake and lead-recovery workflow with founder setup guidance.",
            points: [
              "Public smart intake page",
              "Lead recovery workspace",
              "AI-assisted drafts you review",
              "Manual follow-up visibility",
              "Founder onboarding guidance",
            ],
            cta: "Apply for Starter pilot",
            tone: "blue",
          },
          {
            badge: "Pro pilot",
            title: "$199 setup + $79/month",
            price: "Manual billing after approval",
            body: "The same controlled workflow with stronger branding, reply-style tuning, and priority onboarding.",
            points: [
              "Everything in Starter",
              "Stronger branded intake page",
              "Reply style and FAQ tuning",
              "Follow-up draft tuning",
              "Priority onboarding",
            ],
            cta: "Apply for Pro pilot",
            tone: "gold",
          },
        ],
      },
    ],
    notice: {
      badge: "Before any paid pilot",
      title: "Scope, support, cancellation, refund handling, and payment method are confirmed first.",
      body:
        "Payment, if approved, uses a manual invoice or Stripe Payment Link. BizPilot does not currently offer in-app billing automation.",
    },
    finalCta: {
      title: "Start with fit, not checkout.",
      body: "The founder reviews the business, current intake path, and pilot scope before any setup or payment.",
      primary: "Apply for the pilot",
      secondary: "Read the FAQ",
    },
  },
  pilot: {
    meta: {
      title: "Cleaning Founder Pilot | BizPilot AI",
      description:
        "Apply for the BizPilot founder pilot for cleaning businesses and test one smart intake, lead organization, and owner-reviewed reply workflow.",
    },
    badge: "Cleaning businesses first",
    title: "Validate one customer-intake workflow before expanding the product.",
    body:
      "The founder pilot is for cleaning businesses that currently receive incomplete quote requests and are willing to test a controlled, manual-first workflow.",
    primaryCta: "Start the pilot application",
    secondaryCta: "See pricing",
    signals: [
      { label: "Market", value: "Cleaning businesses" },
      { label: "Workflow", value: "One intake + reply path" },
      { label: "Control", value: "Owner reviews every draft" },
    ],
    sections: [
      {
        eyebrow: "Good fit",
        title: "Who the first pilot is for.",
        cards: [
          { title: "Requests arrive incomplete", body: "Customers ask for prices without enough service, scope, access, or timing information." },
          { title: "The owner replies manually", body: "The business wants a better starting point, not an autonomous customer-messaging bot." },
          { title: "Feedback is available", body: "The owner can review setup, use the workflow, and share specific feedback at agreed checkpoints." },
        ],
      },
      {
        eyebrow: "Process",
        title: "What happens after the application.",
        cards: [
          { badge: "01", title: "Fit review", body: "The founder reviews the current quote path, service mix, and pilot boundaries." },
          { badge: "02", title: "Manual setup", body: "One cleaning template, intake link, and owner workspace are configured." },
          { badge: "03", title: "Controlled use", body: "The business reviews every AI-assisted draft and sends customer messages manually." },
          { badge: "04", title: "Feedback", body: "Results, friction, and product changes are reviewed before broader rollout." },
        ],
      },
    ],
    notice: {
      badge: "Approval gate",
      title: "Submitting an application does not create a paid account or authorize production changes.",
      body:
        "Real customer data, payment, and onboarding begin only after explicit fit, scope, privacy, support, and operating approval.",
    },
    finalCta: {
      title: "Apply with your current workflow, not a perfect future process.",
      body: "The pilot is designed to learn where customer requests become slow, incomplete, or difficult to answer.",
      primary: "Start application",
      secondary: "Watch the demo",
    },
  },
  trust: {
    meta: {
      title: "Trust and Human Control | BizPilot AI",
      description:
        "See BizPilot's human-approval, data-minimization, AI transparency, product-boundary, and roadmap-labeling principles for the founder pilot.",
    },
    badge: "Trust by product boundary",
    title: "The safest claim is the one the product can prove today.",
    body:
      "BizPilot is designed to reduce response friction without hiding uncertainty, inventing business decisions, or presenting roadmap integrations as active features.",
    primaryCta: "Review the workflow",
    secondaryCta: "Read privacy details",
    signals: [
      { label: "Human control", value: "Every draft requires review" },
      { label: "Truthful scope", value: "Roadmap is labeled roadmap" },
      { label: "Fallback", value: "Manual workflow remains available" },
    ],
    sections: [
      {
        eyebrow: "Human oversight",
        title: "AI prepares; the owner decides.",
        cards: [
          { title: "No automatic sending", body: "The current pilot does not send customer messages on the owner's behalf." },
          { title: "No invented pricing", body: "The assistant asks for missing details instead of creating a price, discount, or availability promise." },
          { title: "Editable output", body: "The owner can change, reject, or ignore every AI-assisted draft." },
        ],
      },
      {
        eyebrow: "Data and product discipline",
        title: "Collect what the workflow needs — and say what the product does not do.",
        cards: [
          { title: "Purpose-limited intake", body: "Forms should request only the customer and service details needed for the quote workflow." },
          { title: "Clear roadmap labels", body: "Direct inbox integrations, additional verticals, booking, and automation stay labeled as future work." },
          { title: "No full-CRM claim", body: "BizPilot solves the intake and response gap rather than claiming to replace every business system." },
        ],
      },
    ],
    notice: {
      badge: "Production gate",
      title: "Local validation does not authorize managed-production database changes.",
      body:
        "Backup, migration drift, production security posture, and restore confidence must be verified through the existing owner-controlled release gates before production mutation.",
    },
    finalCta: {
      title: "Trust starts before the customer submits anything.",
      body: "Review the exact workflow, data path, and manual controls before joining the pilot.",
      primary: "See the demo",
      secondary: "Read the FAQ",
    },
  },
  comparison: {
    meta: {
      title: "BizPilot vs Forms, CRM, and Booking Tools",
      description:
        "Compare BizPilot's smart-intake and owner-reviewed reply workflow with generic forms, manual inboxes, full CRMs, and booking platforms.",
    },
    badge: "Before CRM. After messy requests.",
    title: "Use BizPilot for the intake-and-response gap — not as a replacement for every tool.",
    body:
      "A form captures fields. A CRM manages a broader pipeline. Booking software handles confirmed work. BizPilot focuses on the moment when a customer request is still vague and the owner needs a clear next reply.",
    primaryCta: "See the workflow",
    secondaryCta: "Explore the product",
    signals: [
      { label: "Form builder", value: "Captures fields" },
      { label: "BizPilot", value: "Organizes + prepares next reply" },
      { label: "CRM or booking", value: "Handles later business stages" },
    ],
    sections: [
      {
        eyebrow: "Choose by job",
        title: "Each category solves a different problem.",
        cards: [
          { title: "Generic form builder", body: "Best when basic field capture is enough. The owner still interprets, prioritizes, and writes the response." },
          { title: "Manual inboxes and spreadsheets", body: "Works at very low volume, but incomplete requests and next actions are easy to lose during busy days." },
          { title: "BizPilot", body: "Best when the immediate problem is turning an incomplete service request into an organized, owner-reviewed next reply." },
          { title: "Full CRM", body: "Best for teams with a defined pipeline, sales stages, permissions, and broader customer lifecycle management." },
          { title: "Booking or invoicing platform", body: "Best after scope, price, availability, and customer intent are clear enough to confirm work." },
        ],
      },
    ],
    notice: {
      badge: "Product boundary",
      title: "BizPilot does not auto-book, invoice, collect payment, or replace a full CRM.",
      body: "Its value is the narrower moment before those systems: capture, clarity, reply preparation, and visible manual follow-up.",
    },
    finalCta: {
      title: "Compare the workflow, not the size of the feature list.",
      body: "See whether the current cleaning demo solves the exact intake gap in your business.",
      primary: "Watch the demo",
      secondary: "Apply for the pilot",
    },
  },
  cleaning: {
    meta: {
      title: "Cleaning Customer Intake and Quote Reply Workflow | BizPilot AI",
      description:
        "BizPilot's first complete workflow helps cleaning businesses collect better requests, surface missing details, and prepare owner-reviewed replies.",
    },
    badge: "First complete vertical",
    title: "A smart customer-intake workflow built around real cleaning quote questions.",
    body:
      "Cleaning is the first market because the requests are frequent, time-sensitive, and often incomplete. The template collects service-specific details without pretending a form can calculate every quote automatically.",
    primaryCta: "Watch the cleaning demo",
    secondaryCta: "Apply for the founder pilot",
    signals: [
      { label: "Services", value: "Six pilot-ready request types" },
      { label: "Output", value: "Missing details + draft" },
      { label: "Control", value: "Owner quotes and sends" },
    ],
    sections: [
      {
        eyebrow: "Pilot-ready services",
        title: "One template family, six common cleaning requests.",
        cards: [
          { title: "Residential cleaning", body: "Home size, rooms, bathrooms, frequency, priorities, pets, parking, and access." },
          { title: "Deep cleaning", body: "Property condition, priority areas, appliances, buildup, photos, and timing." },
          { title: "Move-in / move-out", body: "Deadline, property size, appliance and cabinet scope, access, and inspection timing." },
          { title: "Office cleaning", body: "Floor area, frequency, schedule, washrooms, kitchens, supplies, keys, and building rules." },
          { title: "Airbnb turnover", body: "Checkout and check-in window, bedrooms, bathrooms, linen, restock, laundry, and entry instructions." },
          { title: "Post-construction", body: "Site size, dust and debris scope, floor or glass detail, deadline, access, and safety constraints." },
        ],
      },
      {
        eyebrow: "What stays human",
        title: "The form improves the request. The owner still makes the business decision.",
        cards: [
          { title: "Scope review", body: "The owner decides whether the submitted details are enough for a quote, visit, or follow-up." },
          { title: "Price decision", body: "BizPilot does not invent cleaning prices, discounts, crew time, or availability." },
          { title: "Final response", body: "The owner reviews and sends the message manually through the real customer channel." },
        ],
      },
    ],
    notice: {
      badge: "Expansion rule",
      title: "Cleaning is not a decorative example; it is the validation gate.",
      body: "Additional service-business templates should not be presented as active until this workflow proves useful, safe, and operationally sustainable.",
    },
    finalCta: {
      title: "Start with one cleaning service and one real request path.",
      body: "The founder pilot is designed to improve the workflow before expanding the category.",
      primary: "Apply for the pilot",
      secondary: "See pricing",
    },
  },
  faq: {
    meta: {
      title: "BizPilot FAQ | Product, AI, Pilot, and Roadmap",
      description:
        "Get clear answers about BizPilot's smart intake link, owner-reviewed AI drafts, cleaning-first pilot, roadmap integrations, pricing, and product boundaries.",
    },
    badge: "Straight answers",
    title: "Know exactly what BizPilot does today — and what remains roadmap.",
    body:
      "The product is easier to trust when the current workflow, human controls, and future plans are separated clearly.",
    primaryCta: "Watch the demo",
    secondaryCta: "Apply for the pilot",
    signals: [
      { label: "Current", value: "Smart intake + lead workspace" },
      { label: "AI", value: "Draft assistance only" },
      { label: "Roadmap", value: "Integrations + more verticals" },
    ],
    sections: [
      {
        eyebrow: "Product and AI",
        title: "The most important questions before joining.",
        cards: englishFaqItems.map((item) => ({
          title: item.question,
          body: item.answer,
        })),
      },
    ],
    finalCta: {
      title: "See the current product boundary in action.",
      body: "The cleaning demo is the clearest way to understand what is real today.",
      primary: "Watch the demo",
      secondary: "Review trust",
    },
    items: englishFaqItems,
  },
};

const frenchCopy: PublicV2Copy = {
  home: {
    meta: {
      title: "Espace intelligent de demandes client et de reponses | BizPilot AI",
      description:
        "BizPilot aide les entreprises de services a recueillir les demandes avec un lien intelligent, organiser les renseignements manquants et preparer des brouillons IA a valider, en commencant par l'entretien.",
    },
    nav: frenchNav,
    hero: {
      badge: "Demandes client intelligentes + reponses validees",
      title: "Transformez les demandes dispersees en reponses claires, pretes a verifier.",
      body:
        "BizPilot donne aux entreprises de services un lien intelligent, organise chaque demande, montre ce qui manque et prepare un brouillon assiste par IA que le proprietaire verifie et envoie — en commencant par les entreprises d'entretien.",
      primaryCta: "Voir le flux d'entretien",
      secondaryCta: "Demander l'acces au pilote",
      note:
        "Produit actuel : lien intelligent, espace de demandes organise, brouillons assistes par IA et validation manuelle. Les integrations directes restent dans la feuille de route.",
      placements: [
        "Bouton du site Web",
        "Fiche d'etablissement Google",
        "Bio Instagram ou reponse enregistree",
        "Signature courriel",
      ],
      proofs: [
        { label: "Collecte", value: "Un seul lien clair" },
        { label: "Clarte", value: "Renseignements manquants visibles" },
        { label: "Controle", value: "Rien ne part sans vous" },
      ],
      workspace: {
        title: "Espace de demande client",
        intakeLabel: "Nouvelle demande par lien intelligent",
        customer: "Maria — Entretien de demenagement",
        status: "Reponse requise avant vendredi",
        missingLabel: "BizPilot a trouve ce qui manque",
        fields: [
          { label: "Propriete", value: "Superficie" },
          { label: "Portee", value: "Interieur des electromenagers" },
          { label: "Acces", value: "Stationnement ou cle" },
          { label: "Horaire", value: "Plage d'arrivee preferee" },
        ],
        replyLabel: "Brouillon assiste par IA pret a verifier",
        draft:
          "Bonjour Maria, merci de nous avoir ecrit. Pouvez-vous confirmer la superficie, les electromenagers a nettoyer, les consignes d'acces et l'heure preferee afin que je prepare une soumission exacte?",
        actions: ["Verifier", "Modifier", "Copier", "Envoyer manuellement"],
      },
    },
    statement: {
      title: "Vos clients n'ont pas besoin d'une autre application. Ils ont besoin d'une facon claire de demander — et d'une reponse rapide et exacte.",
      body:
        "BizPilot cree ce parcours sans pretendre que toutes les boites de reception sont deja connectees. Partagez un seul lien la ou les clients vous trouvent, puis validez chaque reponse avant l'envoi.",
    },
    problem: {
      eyebrow: "La vraie fuite",
      title: "La demande a de la valeur — mais elle est souvent incomplete, dispersee et facile a retarder.",
      body:
        "Les proprietaires sont sur les chantiers, sur la route, avec leur equipe ou avec leurs clients actuels. Le vrai travail consiste a transformer une demande vague en prochaine reponse responsable.",
      cards: [
        { title: "Demandes vagues", body: "Le client demande un prix sans fournir la portee, le lieu, l'horaire, l'acces ou les details du service.", badge: "Contexte manquant", tone: "gold" },
        { title: "Points d'entree disperses", body: "Le site Web, la fiche Google, les profils sociaux et le courriel peuvent mener vers des parcours differents ou peu clairs.", badge: "Collecte incoherente", tone: "red" },
        { title: "Preparation manuelle lente", body: "Meme apres avoir vu la demande, le proprietaire doit l'interpreter, poser les bonnes questions et rediger la premiere reponse.", badge: "Prochaine action retardee", tone: "blue" },
      ],
    },
    flow: {
      eyebrow: "Un flux honnete",
      title: "De la demande client a la reponse approuvee par le proprietaire.",
      body: "Chaque etape a un seul role. Aucun prix invente, aucune reservation automatique et aucun message envoye sans validation humaine.",
      steps: [
        { badge: "01", title: "Partager", body: "Placez un seul lien intelligent sur les pages et canaux que vos clients utilisent deja." },
        { badge: "02", title: "Recueillir", body: "Utilisez un formulaire adapte au service pour obtenir les renseignements necessaires." },
        { badge: "03", title: "Organiser", body: "Transformez la demande en fiche claire avec source, service, horaire et renseignements manquants." },
        { badge: "04", title: "Preparer", body: "Generez un resume et un brouillon assistes par IA dans le contexte approuve de l'entreprise." },
        { badge: "05", title: "Approuver", body: "Verifiez, modifiez, copiez et envoyez manuellement dans le vrai canal du client." },
      ],
    },
    control: {
      eyebrow: "Une limite claire pour l'IA",
      title: "L'IA aide au travail. Le proprietaire garde la decision.",
      body: "BizPilot repose sur la validation humaine, des limites explicites et un retour manuel toujours disponible.",
      steps: [
        { title: "L'IA lit", body: "Elle resume uniquement les renseignements disponibles et le contexte d'entreprise approuve.", tone: "blue" },
        { title: "L'IA prepare", body: "Elle propose une reponse ou une question de suivi sans inventer un prix ni une promesse.", tone: "teal" },
        { title: "Vous approuvez", body: "Le proprietaire peut modifier, refuser ou copier le brouillon. Aucun envoi automatique dans le pilote actuel.", tone: "gold" },
        { title: "Le client recoit", body: "Le message final est envoye manuellement dans le vrai canal de communication.", tone: "neutral" },
      ],
    },
    day: {
      eyebrow: "Un rythme plus calme",
      title: "Une journee avec BizPilot commence par la clarte, pas par une autre boite de reception.",
      body: "Le produit ne promet pas des reservations automatiques. Il rend la prochaine action responsable plus facile a voir et a terminer.",
      moments: [
        { badge: "8 h", title: "Les nouvelles demandes sont visibles", body: "Les demandes du lien intelligent sont organisees dans un seul espace proprietaire." },
        { badge: "9 h", title: "Les renseignements manquants sont clairs", body: "Le proprietaire voit quelles demandes exigent plus de details avant une soumission." },
        { badge: "10 h", title: "Les brouillons sont prets a verifier", body: "Les reponses assistees par IA donnent un point de depart sans rien envoyer automatiquement." },
        { badge: "Ensuite", title: "Le suivi reste visible", body: "La prochaine action manuelle reste visible au lieu de dependre de la memoire." },
      ],
    },
    industries: {
      eyebrow: "Coeur universel, lancement cible",
      title: "Concu pour plusieurs entreprises de services — valide d'abord avec l'entretien.",
      body: "Seuls le modele et la demo d'entretien sont presentes comme prets pour le pilote. Les autres secteurs sont des modeles de feuille de route.",
      cards: [
        { badge: "Pilote fondateur", title: "Entretien", body: "Residentiel, grand menage, demenagement, bureaux, location courte duree et apres-construction.", tone: "teal" },
        { badge: "Modele futur", title: "CVAC + plomberie", body: "Type de service, urgence, contexte du batiment, acces, probleme et horaire prefere.", tone: "neutral" },
        { badge: "Modele futur", title: "Amenagement + peinture", body: "Portee, photos, mesures, preferences, horaire et acces au site.", tone: "neutral" },
        { badge: "Modele futur", title: "Autres services locaux", body: "Une base configurable pour de futures categories validees.", tone: "neutral" },
      ],
    },
    features: {
      eyebrow: "Ce que le produit fait aujourd'hui",
      title: "Un espace cible entre une demande confuse et votre prochain systeme.",
      body: "BizPilot n'est pas un CRM complet ni un moteur de reservation. Il traite le moment de collecte et de reponse avant que ces outils deviennent utiles.",
      cards: [
        { title: "Lien intelligent", body: "Un parcours mobile partageable la ou les clients decouvrent deja l'entreprise." },
        { title: "Formulaires adaptes", body: "Des champs et modeles modifiables qui recueillent les details necessaires au service choisi." },
        { title: "Fiche organisee", body: "Client, service, source, horaire, details et prochaine action dans une seule vue." },
        { title: "Detection des details manquants", body: "Une liste claire de ce qu'il faut encore obtenir avant une soumission responsable." },
        { title: "Resume et brouillon IA", body: "Une aide sur demande qui prepare un point de depart dans des limites approuvees." },
        { title: "Suivi manuel visible", body: "La prochaine action reste visible sans pretendre que le produit envoie ou reserve automatiquement." },
      ],
    },
    finalCta: {
      title: "Voyez a quel point votre prochaine demande client pourrait etre plus claire.",
      body: "Le pilote fondateur commence avec un flux d'entretien, un espace proprietaire et un processus de reponse controle.",
      primary: "Voir la demo d'entretien",
      secondary: "Demander l'acces au pilote",
      assurances: ["Aucune carte a la demande", "Aucun envoi automatique", "Aucun prix invente", "Configuration par le fondateur"],
    },
  },
  features: {
    ...englishCopy.features,
    meta: { title: "Produit | BizPilot AI", description: "Decouvrez le lien intelligent, les formulaires adaptes, l'espace organise, les details manquants, les brouillons IA et la validation manuelle de BizPilot." },
    badge: "Produit actuel",
    title: "Tout ce qu'il faut pour transformer une demande vague en prochaine reponse claire.",
    body: "BizPilot vise l'ecart entre la demande et la reponse avant le CRM, la reservation, la facturation ou l'automatisation. Le produit actuel reste cible et controle par le proprietaire.",
    primaryCta: "Voir la demo",
    secondaryCta: "Voir les limites de confiance",
    signals: [
      { label: "Collecter", value: "Un lien intelligent" },
      { label: "Comprendre", value: "Demande structuree + details manquants" },
      { label: "Repondre", value: "Brouillon IA valide" },
    ],
    notice: {
      badge: "Feuille de route",
      title: "Les integrations directes aux boites de reception ne sont pas une fonction active.",
      body: "Gmail, WhatsApp, Instagram, Messenger et les SMS pourront etre explores apres validation. Aujourd'hui, le flux commence honnetement par le lien intelligent.",
    },
    finalCta: { title: "Voyez le flux cible avant de comparer les listes de fonctions.", body: "La demo d'entretien montre le parcours actuel complet.", primary: "Voir la demo", secondary: "Comparer BizPilot" },
  },
  demo: {
    ...englishCopy.demo,
    meta: { title: "Demo du flux d'entretien | BizPilot AI", description: "Voyez le flux actuel : lien intelligent, demande organisee, details manquants, brouillon IA et validation manuelle." },
    badge: "Demo d'entretien actuelle",
    title: "Voyez une demande client devenir une prochaine reponse prudente et verifiable.",
    body: "La demo reste concrete : une demande d'entretien est recueillie, organisee, analysee pour les details manquants, puis un brouillon est prepare pour le proprietaire.",
    primaryCta: "Demander l'acces au pilote",
    secondaryCta: "Explorer le produit",
    notice: { badge: "Limite de la demo", title: "Ce n'est pas une demo de reservation ou de messagerie automatique.", body: "La demo n'invente pas de prix, ne confirme pas de disponibilite, ne prend pas de paiement, ne reserve pas et n'envoie pas automatiquement." },
    finalCta: { title: "Utilisez d'abord ce flux avec un vrai service d'entretien.", body: "La configuration par le fondateur garde le premier pilote assez cible pour etre mesure et ameliore.", primary: "Demander l'acces", secondary: "Voir les tarifs" },
  },
  pricing: {
    ...englishCopy.pricing,
    meta: { title: "Tarifs du pilote fondateur | BizPilot AI", description: "Consultez les tarifs par etapes du pilote d'entretien avec configuration et facturation manuelles apres approbation." },
    badge: "Conditions du pilote fondateur",
    title: "Des tarifs simples pour un seul flux controle de demandes client.",
    body: "Les tarifs sont progressifs parce que le produit est encore valide avec des entreprises d'entretien. Aucun paiement autonome ni facturation automatique n'est pretendu.",
    primaryCta: "Demander l'acces au pilote",
    secondaryCta: "Voir les limites du produit",
    signals: [
      { label: "Configuration", value: "Par le fondateur" },
      { label: "Facturation", value: "Manuelle apres approbation" },
      { label: "Portee", value: "Demandes + reponses validees" },
    ],
    notice: { badge: "Avant tout pilote payant", title: "La portee, le soutien, l'annulation, les remboursements et le mode de paiement sont confirmes d'abord.", body: "Le paiement approuve utilise une facture manuelle ou un lien de paiement Stripe. Aucune facturation automatisee dans l'application aujourd'hui." },
    finalCta: { title: "Commencez par la compatibilite, pas par le paiement.", body: "Le fondateur verifie l'entreprise, son parcours actuel et la portee avant toute configuration ou paiement.", primary: "Demander l'acces", secondary: "Lire la FAQ" },
  },
  pilot: {
    ...englishCopy.pilot,
    meta: { title: "Pilote fondateur pour entreprises d'entretien | BizPilot AI", description: "Demandez l'acces au pilote BizPilot pour tester un flux intelligent de demande, d'organisation et de reponse validee." },
    badge: "Entreprises d'entretien d'abord",
    title: "Validez un flux de demandes client avant d'elargir le produit.",
    body: "Le pilote fondateur s'adresse aux entreprises d'entretien qui recoivent des demandes incompletes et veulent tester un flux controle et manuel.",
    primaryCta: "Commencer la demande",
    secondaryCta: "Voir les tarifs",
    signals: [
      { label: "Marche", value: "Entreprises d'entretien" },
      { label: "Flux", value: "Une demande + une reponse" },
      { label: "Controle", value: "Chaque brouillon est valide" },
    ],
    notice: { badge: "Porte d'approbation", title: "Envoyer une demande ne cree pas de compte payant et n'autorise aucun changement de production.", body: "Les vraies donnees client, le paiement et l'integration commencent seulement apres approbation explicite de la compatibilite, de la portee, de la confidentialite et du fonctionnement." },
    finalCta: { title: "Presentez votre flux actuel, pas un processus futur parfait.", body: "Le pilote sert a trouver ou les demandes deviennent lentes, incompletes ou difficiles a traiter.", primary: "Commencer la demande", secondary: "Voir la demo" },
  },
  trust: {
    ...englishCopy.trust,
    meta: { title: "Confiance et controle humain | BizPilot AI", description: "Decouvrez les principes de validation humaine, minimisation des donnees, transparence IA et etiquetage de la feuille de route de BizPilot." },
    badge: "Confiance par les limites du produit",
    title: "La meilleure promesse est celle que le produit peut prouver aujourd'hui.",
    body: "BizPilot reduit la friction de reponse sans cacher l'incertitude, inventer des decisions ou presenter la feuille de route comme une fonction active.",
    primaryCta: "Voir le flux",
    secondaryCta: "Lire la confidentialite",
    signals: [
      { label: "Controle humain", value: "Chaque brouillon est valide" },
      { label: "Portee honnete", value: "La feuille de route est clairement nommee" },
      { label: "Solution de repli", value: "Le flux manuel reste disponible" },
    ],
    notice: { badge: "Porte de production", title: "La validation locale n'autorise pas des changements dans la base de production geree.", body: "La sauvegarde, la derive des migrations, la securite de production et la restauration doivent passer les portes existantes controlees par le proprietaire." },
    finalCta: { title: "La confiance commence avant l'envoi du formulaire.", body: "Examinez le flux, le parcours des donnees et les controles manuels avant de rejoindre le pilote.", primary: "Voir la demo", secondary: "Lire la FAQ" },
  },
  comparison: {
    ...englishCopy.comparison,
    meta: { title: "BizPilot ou formulaires, CRM et reservation", description: "Comparez le flux de demande intelligente et de reponse validee de BizPilot avec les formulaires, boites manuelles, CRM et plateformes de reservation." },
    badge: "Avant le CRM. Apres les demandes confuses.",
    title: "Utilisez BizPilot pour l'ecart demande-reponse — pas pour remplacer tous les outils.",
    body: "Un formulaire recueille des champs. Un CRM gere un pipeline plus large. La reservation traite le travail confirme. BizPilot cible le moment ou la demande est encore vague.",
    primaryCta: "Voir le flux",
    secondaryCta: "Explorer le produit",
    signals: [
      { label: "Formulaire", value: "Recueille des champs" },
      { label: "BizPilot", value: "Organise + prepare la reponse" },
      { label: "CRM ou reservation", value: "Gere les etapes suivantes" },
    ],
    notice: { badge: "Limite du produit", title: "BizPilot ne reserve pas, ne facture pas, ne prend pas de paiement et ne remplace pas un CRM complet.", body: "Sa valeur se situe avant : collecte, clarte, preparation de la reponse et suivi manuel visible." },
    finalCta: { title: "Comparez le flux, pas la longueur de la liste de fonctions.", body: "Verifiez si la demo d'entretien resout le vrai probleme de collecte de votre entreprise.", primary: "Voir la demo", secondary: "Demander l'acces" },
  },
  cleaning: {
    ...englishCopy.cleaning,
    meta: { title: "Demandes client et reponses de soumission pour entretien | BizPilot AI", description: "Le premier flux complet de BizPilot aide les entreprises d'entretien a recueillir de meilleures demandes et preparer des reponses validees." },
    badge: "Premier secteur complet",
    title: "Un flux intelligent base sur les vraies questions de soumission en entretien.",
    body: "L'entretien est le premier marche parce que les demandes sont frequentes, urgentes et souvent incompletes. Le modele recueille les details sans pretendre calculer chaque prix automatiquement.",
    primaryCta: "Voir la demo d'entretien",
    secondaryCta: "Demander l'acces au pilote",
    signals: [
      { label: "Services", value: "Six types prets pour le pilote" },
      { label: "Resultat", value: "Details manquants + brouillon" },
      { label: "Controle", value: "Le proprietaire fixe le prix et envoie" },
    ],
    notice: { badge: "Regle d'expansion", title: "L'entretien n'est pas un exemple decoratif; c'est la porte de validation.", body: "Les autres modeles de services ne doivent pas etre presentes comme actifs avant que ce flux soit utile, sur et soutenable." },
    finalCta: { title: "Commencez avec un service d'entretien et un vrai parcours de demande.", body: "Le pilote fondateur ameliore d'abord ce flux avant l'expansion.", primary: "Demander l'acces", secondary: "Voir les tarifs" },
  },
  faq: {
    ...englishCopy.faq,
    meta: { title: "FAQ BizPilot | Produit, IA, pilote et feuille de route", description: "Obtenez des reponses claires sur le lien intelligent, les brouillons IA, le pilote d'entretien, les integrations futures et les limites du produit." },
    badge: "Reponses directes",
    title: "Sachez exactement ce que BizPilot fait aujourd'hui — et ce qui reste dans la feuille de route.",
    body: "Le produit est plus facile a comprendre lorsque le flux actuel, les controles humains et les plans futurs sont clairement separes.",
    primaryCta: "Voir la demo",
    secondaryCta: "Demander l'acces",
    signals: [
      { label: "Actuel", value: "Lien intelligent + espace organise" },
      { label: "IA", value: "Aide au brouillon seulement" },
      { label: "Futur", value: "Integrations + autres secteurs" },
    ],
    sections: [{ eyebrow: "Produit et IA", title: "Les questions essentielles avant de rejoindre le pilote.", cards: frenchFaqItems.map((item) => ({ title: item.question, body: item.answer })) }],
    finalCta: { title: "Voyez les limites actuelles du produit en action.", body: "La demo d'entretien est la meilleure facon de comprendre ce qui est reel aujourd'hui.", primary: "Voir la demo", secondary: "Voir la confiance" },
    items: frenchFaqItems,
  },
};

export const PUBLIC_V2_SOURCE_LANGUAGE = DEFAULT_LANGUAGE;

export function getPublicV2Copy(language: unknown): PublicV2Copy {
  return readSupportedLanguage(language) === "fr-CA" ? frenchCopy : englishCopy;
}

export function getPublicV2NavCopy(language: SupportedLanguage): HomeNavCopy {
  return getPublicV2Copy(language).home.nav;
}
