/**
 * ============================================================
 * File: lib/i18n/public-v3-spec.ts
 * Project: BizPilot AI
 * Description: Defines the approved bilingual Website V3 content and route specification.
 * Role: Keeps EN/fr-CA navigation, route jobs, homepage sections, and conversion copy structurally synchronized before UI implementation.
 * Related:
 * - docs/website-v4/CURRENT.md
 * - docs/project-v2/BILINGUAL_ROUTE_AND_FLOW_AUDIT_2026-07-15.md
 * - tests/unit/public-v3-spec.test.mts
 * Author: MoOoH
 * Created: 2026-07-13
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Made pilot CTAs truthfully describe the copy-only request flow and grouped the bilingual FAQ for faster scanning.
 * - 2026-07-15: Added synchronized EN/fr-CA copy for the shared not-found state.
 * - 2026-07-13: Added localized status copy for the safe copy-only founder-pilot request.
 * - 2026-07-13: Completed the V3 shell dictionary for the homepage and retained public routes.
 * - 2026-07-13: Created the typed V3 bilingual content and route contract for Phase 2.
 * ============================================================
 */

import type { SupportedLanguage } from "./language.ts";

export const publicV3PrimaryRoutes = [
  "/",
  "/features",
  "/demo",
  "/pricing",
  "/pilot",
  "/faq",
  "/trust",
  "/privacy",
  "/security",
  "/terms",
] as const;

export type PublicV3PrimaryRoute = (typeof publicV3PrimaryRoutes)[number];

type MetaCopy = Readonly<{
  description: string;
  title: string;
}>;

type CtaCopy = Readonly<{
  href: string;
  label: string;
}>;

type RouteHeroCopy = Readonly<{
  body: string;
  eyebrow: string;
  primary: CtaCopy;
  secondary: CtaCopy;
  title: string;
}>;

type RouteCopy = Readonly<{
  hero: RouteHeroCopy;
  meta: MetaCopy;
}>;

type SectionCopy = Readonly<{
  body: string;
  eyebrow: string;
  key: string;
  title: string;
}>;

type LabelValueCopy = Readonly<{
  label: string;
  value: string;
}>;

type FeatureCopy = Readonly<{
  body: string;
  key: string;
  title: string;
}>;

type FaqCopy = Readonly<{
  answer: string;
  key: string;
  question: string;
}>;

type FaqGroupCopy = Readonly<{
  itemKeys: readonly string[];
  key: string;
  title: string;
}>;

type PricingTierCopy = Readonly<{
  badge: string;
  body: string;
  name: string;
  points: readonly string[];
  price: string;
}>;

export type PublicV3Spec = Readonly<{
  demo: Readonly<{
    incoming: string;
    questions: readonly LabelValueCopy[];
    result: readonly LabelValueCopy[];
    reviewActions: readonly string[];
    reviewBoundary: string;
  }>;
  faqGroups: readonly FaqGroupCopy[];
  faqItems: readonly FaqCopy[];
  features: readonly FeatureCopy[];
  home: Readonly<{
    finalAssurances: readonly string[];
    outcomeCards: readonly FeatureCopy[];
    problemMessages: readonly LabelValueCopy[];
    sections: readonly SectionCopy[];
    visual: Readonly<{
      linkCardBody: string;
      linkCardTitle: string;
      placementNote: string;
      replyDraft: string;
      stageLabels: readonly string[];
    }>;
    workflowSteps: readonly FeatureCopy[];
  }>;
  nav: Readonly<{
    brandSubtitle: string;
    copyright: string;
    demo: string;
    faq: string;
    features: string;
    flow: string;
    howItWorks: string;
    languageLabel: string;
    pilot: string;
    pricing: string;
    privacy: string;
    product: string;
    resources: string;
    security: string;
    signIn: string;
    startShort: string;
    terms: string;
    themeLabel: string;
    trust: string;
  }>;
  notFound: Readonly<{
    body: string;
    eyebrow: string;
    primary: string;
    secondary: string;
    title: string;
  }>;
  pilot: Readonly<{
    applicationAction: string;
    applicationCopied: string;
    applicationFields: readonly string[];
    applicationSelectFallback: string;
    applicationTemplateTitle: string;
    fit: readonly string[];
    nextSteps: readonly FeatureCopy[];
    submissionBoundary: string;
  }>;
  pricing: Readonly<{
    notice: string;
    tiers: readonly PricingTierCopy[];
  }>;
  routes: Readonly<Record<PublicV3PrimaryRoute, RouteCopy>>;
  trust: readonly FeatureCopy[];
}>;

const englishSpec: PublicV3Spec = {
  nav: {
    brandSubtitle: "Smart intake and reply workspace",
    copyright: "Copyright 2026 BizPilot AI. All rights reserved.",
    product: "Product",
    howItWorks: "How it works",
    demo: "Demo",
    pricing: "Pricing",
    privacy: "Privacy",
    resources: "Resources",
    security: "Security",
    faq: "FAQ",
    features: "Product",
    flow: "How it works",
    trust: "Trust",
    signIn: "Sign in",
    startShort: "Prepare request",
    terms: "Terms",
    pilot: "Prepare pilot request",
    languageLabel: "Website language",
    themeLabel: "Theme",
  },
  notFound: {
    body:
      "The page may have moved or the link may be incomplete. Return to the product overview or see the current workflow.",
    eyebrow: "404 · PAGE NOT FOUND",
    primary: "Return home",
    secondary: "See how it works",
    title: "This page is not part of the current BizPilot experience.",
  },
  routes: {
    "/": {
      meta: {
        title: "Smart Intake for Busy Service Teams | BizPilot AI",
        description:
          "Turn scattered customer messages into complete service requests and human-approved reply drafts with one shareable Smart Intake Link.",
      },
      hero: {
        eyebrow: "SMART INTAKE FOR BUSY SERVICE TEAMS",
        title:
          "Turn scattered customer messages into complete requests—and replies ready to review.",
        body:
          "Share one smart intake link anywhere customers reach you. BizPilot asks the right service questions, organizes every request, flags what is missing, and prepares a reply your team approves before sending.",
        primary: { href: "/#how-it-works", label: "See how it works" },
        secondary: { href: "/pilot#application", label: "Prepare a pilot request" },
      },
    },
    "/features": {
      meta: {
        title: "Smart Intake and Reply Features | BizPilot AI",
        description:
          "See how BizPilot collects service details, organizes requests, flags missing information, and prepares owner-reviewed reply drafts.",
      },
      hero: {
        eyebrow: "PRODUCT",
        title: "Everything between a vague message and a useful reply.",
        body:
          "Give customers one clear request path, give your team the details that matter, and keep every reply under human control.",
        primary: { href: "/demo", label: "Walk through the demo" },
        secondary: { href: "/pilot#application", label: "Prepare a pilot request" },
      },
    },
    "/demo": {
      meta: {
        title: "Cleaning Request Demo | BizPilot AI",
        description:
          "Follow one vague cleaning question through a Smart Intake Link, organized request, missing-detail check, and reply ready for owner review.",
      },
      hero: {
        eyebrow: "INTERACTIVE CLEANING PILOT",
        title: "Follow one “How much?” message to a reply ready to review.",
        body:
          "This safe walkthrough shows the current cleaning workflow without submitting data, inventing a quote, booking a job, or sending a message.",
        primary: { href: "/demo#demo", label: "Start the walkthrough" },
        secondary: { href: "/features", label: "Explore the product" },
      },
    },
    "/pricing": {
      meta: {
        title: "Founder Pilot Pricing | BizPilot AI",
        description:
          "Review staged, founder-led pilot pricing for BizPilot's cleaning intake and human-reviewed reply workflow, with no self-serve checkout.",
      },
      hero: {
        eyebrow: "FOUNDER-PILOT PRICING",
        title: "Start with fit, scope, and a price you approve before setup.",
        body:
          "The first cohort is feedback-led. Later Starter and Pro pilots use manual billing only after the workflow, support, cancellation, and payment terms are confirmed.",
        primary: { href: "/pilot#application", label: "Prepare a pilot request" },
        secondary: { href: "/faq", label: "Read common questions" },
      },
    },
    "/pilot": {
      meta: {
        title: "Cleaning Founder Pilot | BizPilot AI",
        description:
          "Apply for a founder-led BizPilot cleaning pilot built around one Smart Intake Link and a controlled, human-reviewed reply workflow.",
      },
      hero: {
        eyebrow: "CLEANING BUSINESSES FIRST",
        title: "Test one customer-request workflow with the founder beside you.",
        body:
          "The first pilot is for cleaning teams receiving incomplete requests and willing to improve a focused, manual-first workflow through structured feedback.",
        primary: { href: "/pilot#application", label: "Prepare my pilot request" },
        secondary: { href: "/pricing", label: "Review pilot pricing" },
      },
    },
    "/faq": {
      meta: {
        title: "BizPilot FAQ | Smart Intake, AI, Channels, and Pilot",
        description:
          "Get direct answers about Smart Intake Link placement, AI assistance, human review, integrations, data, setup, and founder-pilot pricing.",
      },
      hero: {
        eyebrow: "STRAIGHT ANSWERS",
        title: "Know what BizPilot does—and what stays in your hands.",
        body:
          "Start with the practical questions about channels, the intake link, AI, setup, data, pricing, and manual sending.",
        primary: { href: "/demo", label: "See the workflow" },
        secondary: { href: "/pilot#application", label: "Prepare a pilot request" },
      },
    },
    "/trust": {
      meta: {
        title: "Trust and Human Control | BizPilot AI",
        description:
          "Review BizPilot's human-control boundary, AI limits, privacy approach, data minimization, and manual-send workflow.",
      },
      hero: {
        eyebrow: "TRUST BY DESIGN",
        title: "AI prepares the work. Your team keeps the decision.",
        body:
          "BizPilot is designed around explicit inputs, visible gaps, bounded drafts, and a human review step before any customer receives a reply.",
        primary: { href: "/security", label: "Review security" },
        secondary: { href: "/privacy", label: "Read privacy details" },
      },
    },
    "/privacy": {
      meta: {
        title: "Privacy | BizPilot AI",
        description:
          "Read how BizPilot approaches customer-request data, access, retention, and privacy choices during the controlled pilot.",
      },
      hero: {
        eyebrow: "PRIVACY",
        title: "A readable explanation of how request data is handled.",
        body:
          "This policy explains collection, use, access, retention, and choices without hiding the practical summary behind legal language.",
        primary: { href: "/trust", label: "View trust overview" },
        secondary: { href: "/security", label: "Review security" },
      },
    },
    "/security": {
      meta: {
        title: "Security | BizPilot AI",
        description:
          "Review BizPilot's current security boundaries, access controls, data-minimization practices, and responsible disclosure path.",
      },
      hero: {
        eyebrow: "SECURITY",
        title: "Practical safeguards for a controlled, manual-first workflow.",
        body:
          "See the current access, isolation, logging, and operational boundaries without unsupported compliance claims.",
        primary: { href: "/trust", label: "View trust overview" },
        secondary: { href: "/privacy", label: "Read privacy details" },
      },
    },
    "/terms": {
      meta: {
        title: "Terms | BizPilot AI",
        description:
          "Read the current BizPilot website and founder-pilot terms, scope boundaries, responsibilities, and approval gates.",
      },
      hero: {
        eyebrow: "TERMS",
        title: "The practical rules for using the site and joining a pilot.",
        body:
          "These terms describe the current service boundary, responsibilities, and approval steps before any paid pilot or production use.",
        primary: { href: "/pricing", label: "Review pilot pricing" },
        secondary: { href: "/privacy", label: "Read privacy details" },
      },
    },
  },
  home: {
    sections: [
      {
        key: "hero",
        eyebrow: "SMART INTAKE FOR BUSY SERVICE TEAMS",
        title:
          "Turn scattered customer messages into complete requests—and replies ready to review.",
        body:
          "Show the audience, pain, one-link mechanism, organized result, and human approval in the first viewport.",
      },
      {
        key: "problem",
        eyebrow: "THE GAP BEFORE EVERY GOOD REPLY",
        title: "The message arrives. The details you need do not.",
        body:
          "Owners, sales managers, and support teams lose time decoding different questions, asking the same follow-ups, and rebuilding context while customers wait.",
      },
      {
        key: "workflow",
        eyebrow: "ONE CLEAR PATH",
        title: "Share. Ask. Organize. Review.",
        body:
          "Place one link where customers already reach you. BizPilot gathers the service details, organizes the request, and prepares the next response for your approval.",
      },
      {
        key: "outcomes",
        eyebrow: "READY FOR THE TEAM",
        title: "See the complete request, the gaps, and the next reply together.",
        body:
          "Your team starts from a clear record instead of reconstructing a conversation from memory or asking every question again.",
      },
      {
        key: "cleaning-demo",
        eyebrow: "CLEANING PILOT EXAMPLE",
        title: "From “How much for Friday?” to a request you can answer responsibly.",
        body:
          "Use one real, readable cleaning example to show the vague question, adaptive intake, organized details, and owner-reviewed draft.",
      },
      {
        key: "trust",
        eyebrow: "HUMAN CONTROL BUILT IN",
        title: "AI helps prepare. Your team decides what leaves the business.",
        body:
          "No automatic send, invented price, confirmed booking, or hidden customer promise. Review, edit, copy, and send through the real channel.",
      },
      {
        key: "final-cta",
        eyebrow: "START WITH ONE WORKFLOW",
        title: "Make the next customer request easier to answer.",
        body:
          "Walk through the cleaning demo, then apply for a founder-led pilot if the workflow fits your team.",
      },
    ],
    problemMessages: [
      { label: "Instagram", value: "How much?" },
      { label: "WhatsApp", value: "Are you free Friday?" },
      { label: "Website", value: "Do you cover my area?" },
      { label: "Email", value: "Can you quote this?" },
    ],
    workflowSteps: [
      {
        key: "share",
        title: "Share",
        body: "Place one Smart Intake Link in your bio, website, saved reply, email signature, Google profile, QR code, or direct message.",
      },
      {
        key: "ask",
        title: "Ask",
        body: "Collect the service, scope, location, timing, access, and other details needed for a useful answer.",
      },
      {
        key: "organize",
        title: "Organize",
        body: "Turn the answers into one clear request and make any remaining gaps visible.",
      },
      {
        key: "review",
        title: "Review",
        body: "Read, edit, and copy the AI-assisted draft, then send it manually through the real customer channel.",
      },
    ],
    outcomeCards: [
      {
        key: "complete-request",
        title: "Complete request",
        body: "Keep service details, timing, contact context, and customer answers in one readable record.",
      },
      {
        key: "visible-gaps",
        title: "Visible gaps",
        body: "Know what still needs an answer before your team quotes, schedules, or promises anything.",
      },
      {
        key: "review-draft",
        title: "Reply ready to review",
        body: "Start with a careful draft or follow-up question instead of a blank message box.",
      },
      {
        key: "next-action",
        title: "Clear next action",
        body: "Keep the next manual follow-up visible without turning BizPilot into a full CRM.",
      },
    ],
    visual: {
      stageLabels: [
        "Scattered questions",
        "One Smart Intake Link",
        "Ready for the team",
      ],
      placementNote:
        "These are places to share the link—not direct inbox integrations.",
      linkCardTitle: "Get an accurate response",
      linkCardBody: "Answer a few quick questions about the service you need.",
      replyDraft:
        "Thanks for reaching out. Could you confirm the property size and access notes so I can prepare the right next response?",
    },
    finalAssurances: [
      "No auto-send",
      "No invented price",
      "No automatic booking",
      "Founder-led setup",
    ],
  },
  features: [
    {
      key: "share-anywhere",
      title: "One link, shared anywhere",
      body: "Use the same mobile-friendly request path on the website, social bio, saved replies, Google profile, email signature, QR code, or direct message.",
    },
    {
      key: "service-questions",
      title: "Questions that fit the service",
      body: "Collect the details your team actually needs instead of relying on one generic contact form.",
    },
    {
      key: "organized-request",
      title: "An organized request",
      body: "Bring customer, service, timing, source, answers, and next action into one readable view.",
    },
    {
      key: "missing-details",
      title: "Missing details made visible",
      body: "Spot the information that still blocks a responsible quote or reply.",
    },
    {
      key: "reply-drafts",
      title: "AI-assisted reply drafts",
      body: "Prepare a useful answer or follow-up question using the request and approved business context.",
    },
    {
      key: "human-control",
      title: "Review, edit, and copy",
      body: "Keep the final decision with the team. Nothing sends automatically in the current pilot.",
    },
  ],
  demo: {
    incoming: "How much for a move-out cleaning this Friday?",
    questions: [
      { label: "Property size", value: "How large is the home?" },
      { label: "Cleaning scope", value: "Should appliances be cleaned inside?" },
      { label: "Access", value: "Any parking, key, or entry instructions?" },
      { label: "Timing", value: "What arrival window works on Friday?" },
    ],
    result: [
      { label: "Service", value: "Move-out cleaning" },
      { label: "Property", value: "2-bedroom condo" },
      { label: "Scope", value: "Inside oven and fridge" },
      { label: "Timing", value: "Friday, 9 a.m.–noon" },
      { label: "Still needed", value: "Parking and key instructions" },
    ],
    reviewActions: ["Review", "Edit", "Copy"],
    reviewBoundary:
      "Demo only. No price is invented, no booking is confirmed, no data is submitted, and no message is sent.",
  },
  pricing: {
    tiers: [
      {
        badge: "First approved cohort",
        name: "Founder Feedback Pilot",
        price: "$0 setup",
        body:
          "For a small number of cleaning businesses willing to test one workflow and provide structured 30- and 60-day feedback.",
        points: [
          "Cleaning request link",
          "Organized owner workspace",
          "AI-assisted summary and draft",
          "Manual review, copy, and send",
          "Founder-led setup and feedback sessions",
        ],
      },
      {
        badge: "After the feedback cohort",
        name: "Starter Pilot",
        price: "$149 setup + $49/month",
        body:
          "A focused branded intake and reply-preparation workflow with manual billing after approval.",
        points: [
          "Branded Smart Intake Link",
          "Organized request workspace",
          "AI-assisted drafts you review",
          "Manual follow-up visibility",
          "Founder onboarding guidance",
        ],
      },
      {
        badge: "After the feedback cohort",
        name: "Pro Pilot",
        price: "$199 setup + $79/month",
        body:
          "The controlled Starter workflow with stronger branding, reply-style tuning, and priority onboarding.",
        points: [
          "Everything in Starter",
          "Stronger intake-page branding",
          "Reply style and FAQ tuning",
          "Follow-up draft tuning",
          "Priority onboarding",
        ],
      },
    ],
    notice:
      "No checkout happens on this page. Scope, support, cancellation, refund handling, payment method, and the exact start date are confirmed before any paid pilot.",
  },
  pilot: {
    fit: [
      "A cleaning business already receiving online or message-based requests",
      "An owner or small team that still replies manually",
      "Requests often arrive without scope, timing, area, or access details",
      "The team can review the workflow and provide structured feedback",
    ],
    nextSteps: [
      {
        key: "fit-review",
        title: "Fit review",
        body: "The founder reviews your current request path, service mix, and pilot boundaries.",
      },
      {
        key: "manual-setup",
        title: "Manual setup",
        body: "One cleaning template, Smart Intake Link, and owner workspace are configured.",
      },
      {
        key: "controlled-use",
        title: "Controlled use",
        body: "Your team reviews every assisted draft and sends customer replies manually.",
      },
      {
        key: "feedback",
        title: "Feedback checkpoints",
        body: "You review friction, request quality, response preparation, and the changes worth making next.",
      },
    ],
    applicationFields: [
      "Business name",
      "Work email",
      "City or service area",
      "Cleaning services",
      "Approximate requests per week",
      "Biggest request-management problem",
      "Preferred language",
    ],
    applicationAction: "Copy the 60-second pilot request",
    applicationCopied: "Pilot request copied.",
    applicationSelectFallback: "The request is selected. Copy it manually.",
    applicationTemplateTitle: "BizPilot founder pilot request",
    submissionBoundary:
      "BizPilot does not submit or store this public request. Copy it and send it through the founder contact method you already use. No account, charge, or production-data access is created.",
  },
  faqItems: [
    {
      key: "direct-integrations",
      question: "Does BizPilot connect directly to Instagram, WhatsApp, Messenger, email, or Google Business today?",
      answer:
        "No. The current product uses one Smart Intake Link that you share in those places. Direct inbox integrations are not active product functionality.",
    },
    {
      key: "link-placement",
      question: "Where can I share the Smart Intake Link?",
      answer:
        "Use it on your website, social bio, Google Business Profile, email signature, QR code, saved reply, or in a direct message you send yourself.",
    },
    {
      key: "after-submit",
      question: "What happens after a customer answers the questions?",
      answer:
        "BizPilot organizes the answers into a request, shows what is still missing, and can prepare a summary and reply draft for your team to review.",
    },
    {
      key: "ai-role",
      question: "What does AI do?",
      answer:
        "AI helps summarize the request and draft a careful reply or follow-up question using the information provided and approved business context.",
    },
    {
      key: "auto-send",
      question: "Does BizPilot send messages automatically?",
      answer:
        "No. Your team reviews, edits, copies, and sends the final response through the real customer channel.",
    },
    {
      key: "pricing-booking",
      question: "Can BizPilot invent a price or confirm a booking?",
      answer:
        "No. It can make missing details visible and prepare the next question. It does not invent pricing, promise availability, take payment, or confirm a booking.",
    },
    {
      key: "setup",
      question: "How is the first workflow set up?",
      answer:
        "The founder reviews one cleaning request path, configures the intake questions and workspace, and confirms operating boundaries before controlled use.",
    },
    {
      key: "data",
      question: "What customer data is used?",
      answer:
        "The workflow uses the information a customer submits through the intake form and the approved business context needed to organize the request and prepare a draft. See Privacy and Trust for the current boundaries.",
    },
    {
      key: "pricing",
      question: "Is there self-serve checkout?",
      answer:
        "No. Pilot fit, scope, support, cancellation, refund handling, and payment method are confirmed before any paid setup or billing.",
    },
    {
      key: "verticals",
      question: "Is BizPilot only for cleaning businesses?",
      answer:
        "The product foundation is intended for service businesses, but cleaning is the only complete pilot template and public demo today. Other service categories remain future work until validated.",
    },
  ],
  faqGroups: [
    {
      key: "channels",
      title: "Channels and intake",
      itemKeys: ["direct-integrations", "link-placement", "after-submit"],
    },
    {
      key: "control",
      title: "AI and human control",
      itemKeys: ["ai-role", "auto-send", "pricing-booking"],
    },
    {
      key: "pilot",
      title: "Setup, data, and pilot",
      itemKeys: ["setup", "data", "pricing", "verticals"],
    },
  ],
  trust: [
    {
      key: "explicit-inputs",
      title: "Explicit customer inputs",
      body: "The request is built from answers the customer intentionally provides through the Smart Intake Link.",
    },
    {
      key: "visible-gaps",
      title: "Visible missing information",
      body: "The interface shows what is unknown instead of encouraging AI to fill the gap with an invented fact.",
    },
    {
      key: "bounded-ai",
      title: "Bounded AI assistance",
      body: "Summaries and drafts use the request and approved business context; they are starting points, not autonomous decisions.",
    },
    {
      key: "human-review",
      title: "Human review before sending",
      body: "A person can edit, reject, or copy the draft. The current pilot does not auto-send customer messages.",
    },
    {
      key: "data-minimization",
      title: "Data minimization",
      body: "Collect the information needed for the service request and avoid expanding into unrelated customer profiling.",
    },
    {
      key: "operational-boundaries",
      title: "Honest operational boundaries",
      body: "No invented quote, automatic booking, payment, or unsupported channel-integration claim.",
    },
  ],
};

const frenchSpec: PublicV3Spec = {
  nav: {
    brandSubtitle: "Collecte et réponses intelligentes",
    copyright: "Copyright 2026 BizPilot AI. Tous droits réservés.",
    product: "Produit",
    howItWorks: "Fonctionnement",
    demo: "Démo",
    pricing: "Tarifs",
    privacy: "Confidentialité",
    resources: "Ressources",
    security: "Sécurité",
    faq: "FAQ",
    features: "Produit",
    flow: "Fonctionnement",
    trust: "Confiance",
    signIn: "Connexion",
    startShort: "Préparer",
    terms: "Conditions",
    pilot: "Préparer une demande",
    languageLabel: "Langue du site",
    themeLabel: "Thème",
  },
  notFound: {
    body:
      "La page a peut-être été déplacée ou le lien est incomplet. Revenez à la présentation du produit ou consultez le flux actuel.",
    eyebrow: "404 · PAGE INTROUVABLE",
    primary: "Retour à l'accueil",
    secondary: "Voir le fonctionnement",
    title: "Cette page ne fait pas partie de l'expérience BizPilot actuelle.",
  },
  routes: {
    "/": {
      meta: {
        title: "Collecte intelligente pour équipes de services | BizPilot AI",
        description:
          "Transformez les messages dispersés en demandes de service complètes et en réponses prêtes à valider grâce à un seul lien de collecte.",
      },
      hero: {
        eyebrow: "COLLECTE INTELLIGENTE POUR ÉQUIPES DE SERVICES",
        title:
          "Transformez les messages dispersés en demandes complètes et en réponses prêtes à valider.",
        body:
          "Partagez un seul lien de collecte partout où vos clients vous écrivent. BizPilot pose les bonnes questions, organise chaque demande, signale les renseignements manquants et prépare une réponse que votre équipe valide avant de l'envoyer.",
        primary: { href: "/#how-it-works", label: "Voir le fonctionnement" },
        secondary: { href: "/pilot#application", label: "Préparer une demande pilote" },
      },
    },
    "/features": {
      meta: {
        title: "Fonctions de collecte et de réponse | BizPilot AI",
        description:
          "Voyez comment BizPilot recueille les détails du service, organise les demandes, signale ce qui manque et prépare des brouillons à valider.",
      },
      hero: {
        eyebrow: "PRODUIT",
        title: "Tout ce qu'il faut entre un message vague et une réponse utile.",
        body:
          "Offrez aux clients un parcours clair, donnez à votre équipe les détails importants et gardez chaque réponse sous contrôle humain.",
        primary: { href: "/demo", label: "Parcourir la démo" },
        secondary: { href: "/pilot#application", label: "Préparer une demande" },
      },
    },
    "/demo": {
      meta: {
        title: "Démo d'une demande d'entretien | BizPilot AI",
        description:
          "Suivez une demande vague jusqu'au lien de collecte, à la fiche organisée, aux détails manquants et au brouillon prêt à valider.",
      },
      hero: {
        eyebrow: "DÉMO INTERACTIVE DU PILOTE ENTRETIEN",
        title: "Suivez un message « Combien? » jusqu'à une réponse prête à valider.",
        body:
          "Cette démonstration sûre présente le flux actuel sans envoyer de données, inventer un prix, réserver un service ni transmettre un message.",
        primary: { href: "/demo#demo", label: "Commencer la démo" },
        secondary: { href: "/features", label: "Explorer le produit" },
      },
    },
    "/pricing": {
      meta: {
        title: "Tarifs du pilote fondateur | BizPilot AI",
        description:
          "Consultez les tarifs par étapes du pilote entretien, avec configuration guidée, réponses validées et aucun paiement libre-service.",
      },
      hero: {
        eyebrow: "TARIFS DU PILOTE FONDATEUR",
        title: "Commencez par la compatibilité, la portée et un prix approuvé avant la configuration.",
        body:
          "La première cohorte mise sur la rétroaction. Les pilotes Démarrage et Pro sont facturés manuellement seulement après confirmation du flux, du soutien, de l'annulation et du paiement.",
        primary: { href: "/pilot#application", label: "Préparer une demande pilote" },
        secondary: { href: "/faq", label: "Lire les questions fréquentes" },
      },
    },
    "/pilot": {
      meta: {
        title: "Pilote fondateur pour l'entretien | BizPilot AI",
        description:
          "Demandez l'accès à un pilote BizPilot guidé autour d'un lien de collecte et d'un flux de réponse validé par une personne.",
      },
      hero: {
        eyebrow: "ENTREPRISES D'ENTRETIEN D'ABORD",
        title: "Testez un seul flux de demandes avec le fondateur à vos côtés.",
        body:
          "Le premier pilote s'adresse aux équipes d'entretien qui reçoivent des demandes incomplètes et veulent améliorer un flux ciblé, manuel et contrôlé.",
        primary: { href: "/pilot#application", label: "Préparer ma demande" },
        secondary: { href: "/pricing", label: "Voir les tarifs" },
      },
    },
    "/faq": {
      meta: {
        title: "FAQ BizPilot | Collecte, IA, canaux et pilote",
        description:
          "Obtenez des réponses claires sur le lien de collecte, l'IA, la validation humaine, les intégrations, les données et les tarifs du pilote.",
      },
      hero: {
        eyebrow: "RÉPONSES CLAIRES",
        title: "Sachez ce que BizPilot fait et ce qui reste entre vos mains.",
        body:
          "Commencez par les questions pratiques sur les canaux, le lien, l'IA, la configuration, les données, les tarifs et l'envoi manuel.",
        primary: { href: "/demo", label: "Voir le flux" },
        secondary: { href: "/pilot#application", label: "Préparer une demande" },
      },
    },
    "/trust": {
      meta: {
        title: "Confiance et contrôle humain | BizPilot AI",
        description:
          "Consultez les limites de l'IA, la validation humaine, la confidentialité, la minimisation des données et l'envoi manuel de BizPilot.",
      },
      hero: {
        eyebrow: "CONFIANCE INTÉGRÉE",
        title: "L'IA prépare le travail. Votre équipe garde la décision.",
        body:
          "BizPilot repose sur des réponses explicites, des renseignements manquants visibles, des brouillons encadrés et une validation humaine avant tout envoi.",
        primary: { href: "/security", label: "Voir la sécurité" },
        secondary: { href: "/privacy", label: "Lire la confidentialité" },
      },
    },
    "/privacy": {
      meta: {
        title: "Confidentialité | BizPilot AI",
        description:
          "Découvrez comment BizPilot aborde les données de demandes, l'accès, la conservation et les choix de confidentialité pendant le pilote.",
      },
      hero: {
        eyebrow: "CONFIDENTIALITÉ",
        title: "Une explication lisible de la gestion des données de demandes.",
        body:
          "Cette politique explique la collecte, l'utilisation, l'accès, la conservation et vos choix sans cacher le résumé pratique derrière le jargon juridique.",
        primary: { href: "/trust", label: "Voir l'aperçu de confiance" },
        secondary: { href: "/security", label: "Voir la sécurité" },
      },
    },
    "/security": {
      meta: {
        title: "Sécurité | BizPilot AI",
        description:
          "Consultez les limites de sécurité actuelles, les contrôles d'accès, la minimisation des données et le signalement responsable.",
      },
      hero: {
        eyebrow: "SÉCURITÉ",
        title: "Des mesures pratiques pour un flux contrôlé et manuel.",
        body:
          "Voyez les limites actuelles d'accès, d'isolation, de journalisation et d'exploitation, sans allégation de conformité non vérifiée.",
        primary: { href: "/trust", label: "Voir l'aperçu de confiance" },
        secondary: { href: "/privacy", label: "Lire la confidentialité" },
      },
    },
    "/terms": {
      meta: {
        title: "Conditions | BizPilot AI",
        description:
          "Lisez les conditions actuelles du site et du pilote fondateur, les limites du service, les responsabilités et les étapes d'approbation.",
      },
      hero: {
        eyebrow: "CONDITIONS",
        title: "Les règles pratiques du site et du pilote.",
        body:
          "Ces conditions décrivent le service actuel, les responsabilités et les approbations requises avant tout pilote payant ou usage en production.",
        primary: { href: "/pricing", label: "Voir les tarifs" },
        secondary: { href: "/privacy", label: "Lire la confidentialité" },
      },
    },
  },
  home: {
    sections: [
      {
        key: "hero",
        eyebrow: "COLLECTE INTELLIGENTE POUR ÉQUIPES DE SERVICES",
        title:
          "Transformez les messages dispersés en demandes complètes et en réponses prêtes à valider.",
        body:
          "Présenter le public, le problème, le lien unique, la demande organisée et la validation humaine dès le premier écran.",
      },
      {
        key: "problem",
        eyebrow: "CE QUI MANQUE AVANT UNE BONNE RÉPONSE",
        title: "Le message arrive. Les détails nécessaires, non.",
        body:
          "Les propriétaires, responsables des ventes et équipes de soutien perdent du temps à décoder des questions différentes, répéter les mêmes suivis et reconstruire le contexte.",
      },
      {
        key: "workflow",
        eyebrow: "UN PARCOURS CLAIR",
        title: "Partager. Demander. Organiser. Valider.",
        body:
          "Placez un seul lien là où vos clients vous écrivent déjà. BizPilot recueille les détails, organise la demande et prépare la prochaine réponse pour votre validation.",
      },
      {
        key: "outcomes",
        eyebrow: "PRÊT POUR L'ÉQUIPE",
        title: "Voyez la demande complète, les lacunes et la prochaine réponse ensemble.",
        body:
          "Votre équipe part d'une fiche claire au lieu de reconstruire la conversation de mémoire ou de répéter chaque question.",
      },
      {
        key: "cleaning-demo",
        eyebrow: "EXEMPLE DU PILOTE ENTRETIEN",
        title: "De « Combien pour vendredi? » à une demande à laquelle répondre correctement.",
        body:
          "Un exemple d'entretien lisible montre la question vague, la collecte adaptée, les détails organisés et le brouillon validé par le propriétaire.",
      },
      {
        key: "trust",
        eyebrow: "CONTRÔLE HUMAIN INTÉGRÉ",
        title: "L'IA aide à préparer. Votre équipe décide ce qui est envoyé.",
        body:
          "Aucun envoi automatique, prix inventé, rendez-vous confirmé ni promesse cachée. Validez, modifiez, copiez et envoyez dans le vrai canal.",
      },
      {
        key: "final-cta",
        eyebrow: "COMMENCEZ PAR UN SEUL FLUX",
        title: "Rendez la prochaine demande plus facile à traiter.",
        body:
          "Parcourez la démo d'entretien, puis demandez l'accès à un pilote guidé si le flux convient à votre équipe.",
      },
    ],
    problemMessages: [
      { label: "Instagram", value: "Combien?" },
      { label: "WhatsApp", value: "Êtes-vous libre vendredi?" },
      { label: "Site Web", value: "Desservez-vous mon secteur?" },
      { label: "Courriel", value: "Pouvez-vous faire une soumission?" },
    ],
    workflowSteps: [
      {
        key: "share",
        title: "Partager",
        body: "Placez le lien dans votre bio, votre site, vos réponses enregistrées, votre fiche Google, votre signature, un code QR ou un message direct.",
      },
      {
        key: "ask",
        title: "Demander",
        body: "Recueillez le service, la portée, le lieu, l'horaire, l'accès et les autres renseignements nécessaires.",
      },
      {
        key: "organize",
        title: "Organiser",
        body: "Transformez les réponses en une fiche claire et rendez visibles les renseignements qui manquent encore.",
      },
      {
        key: "review",
        title: "Valider",
        body: "Lisez, modifiez et copiez le brouillon assisté, puis envoyez-le vous-même dans le vrai canal du client.",
      },
    ],
    outcomeCards: [
      {
        key: "complete-request",
        title: "Demande complète",
        body: "Regroupez les détails du service, l'horaire, le contexte de contact et les réponses dans une fiche lisible.",
      },
      {
        key: "visible-gaps",
        title: "Renseignements manquants visibles",
        body: "Sachez ce qu'il faut encore obtenir avant de soumissionner, planifier ou promettre quoi que ce soit.",
      },
      {
        key: "review-draft",
        title: "Réponse prête à valider",
        body: "Commencez par un brouillon prudent ou une question de suivi au lieu d'un champ vide.",
      },
      {
        key: "next-action",
        title: "Prochaine action claire",
        body: "Gardez le prochain suivi manuel visible sans transformer BizPilot en CRM complet.",
      },
    ],
    visual: {
      stageLabels: [
        "Questions dispersées",
        "Un seul lien de collecte",
        "Prêt pour l'équipe",
      ],
      placementNote:
        "Ce sont des endroits où partager le lien, pas des intégrations de boîtes de réception.",
      linkCardTitle: "Obtenez une réponse exacte",
      linkCardBody: "Répondez à quelques questions rapides sur le service désiré.",
      replyDraft:
        "Merci de nous avoir écrit. Pouvez-vous confirmer la superficie et les consignes d'accès afin que je prépare la bonne prochaine réponse?",
    },
    finalAssurances: [
      "Aucun envoi automatique",
      "Aucun prix inventé",
      "Aucune réservation automatique",
      "Configuration guidée",
    ],
  },
  features: [
    {
      key: "share-anywhere",
      title: "Un seul lien, partagé partout",
      body: "Utilisez le même parcours mobile sur votre site, votre bio, vos réponses enregistrées, votre fiche Google, votre signature, un code QR ou un message direct.",
    },
    {
      key: "service-questions",
      title: "Des questions adaptées au service",
      body: "Recueillez les détails dont votre équipe a besoin au lieu de dépendre d'un formulaire de contact générique.",
    },
    {
      key: "organized-request",
      title: "Une demande organisée",
      body: "Regroupez le client, le service, l'horaire, la source, les réponses et la prochaine action dans une vue lisible.",
    },
    {
      key: "missing-details",
      title: "Les renseignements manquants en évidence",
      body: "Repérez ce qui bloque encore une soumission ou une réponse responsable.",
    },
    {
      key: "reply-drafts",
      title: "Des brouillons assistés par l'IA",
      body: "Préparez une réponse utile ou une question de suivi à partir de la demande et du contexte d'entreprise approuvé.",
    },
    {
      key: "human-control",
      title: "Valider, modifier et copier",
      body: "Gardez la décision finale. Aucun message n'est envoyé automatiquement dans le pilote actuel.",
    },
  ],
  demo: {
    incoming: "Combien pour un nettoyage après déménagement ce vendredi?",
    questions: [
      { label: "Superficie", value: "Quelle est la taille du logement?" },
      { label: "Portée", value: "Faut-il nettoyer l'intérieur des électroménagers?" },
      { label: "Accès", value: "Y a-t-il des consignes de stationnement, de clé ou d'entrée?" },
      { label: "Horaire", value: "Quelle plage d'arrivée convient vendredi?" },
    ],
    result: [
      { label: "Service", value: "Nettoyage après déménagement" },
      { label: "Propriété", value: "Condo de deux chambres" },
      { label: "Portée", value: "Intérieur du four et du réfrigérateur" },
      { label: "Horaire", value: "Vendredi, de 9 h à midi" },
      { label: "À confirmer", value: "Stationnement et consignes pour la clé" },
    ],
    reviewActions: ["Valider", "Modifier", "Copier"],
    reviewBoundary:
      "Démonstration seulement. Aucun prix n'est inventé, aucune réservation n'est confirmée, aucune donnée n'est envoyée et aucun message n'est transmis.",
  },
  pricing: {
    tiers: [
      {
        badge: "Première cohorte approuvée",
        name: "Pilote de rétroaction fondateur",
        price: "Configuration à 0 $",
        body:
          "Pour un petit nombre d'entreprises d'entretien prêtes à tester un flux et à fournir une rétroaction structurée après 30 et 60 jours.",
        points: [
          "Lien de demande d'entretien",
          "Espace organisé pour le propriétaire",
          "Résumé et brouillon assistés par l'IA",
          "Validation, copie et envoi manuels",
          "Configuration guidée et séances de rétroaction",
        ],
      },
      {
        badge: "Après la cohorte de rétroaction",
        name: "Pilote Démarrage",
        price: "149 $ de configuration + 49 $/mois",
        body:
          "Un flux ciblé et personnalisé de collecte et de préparation des réponses, avec facturation manuelle après approbation.",
        points: [
          "Lien de collecte personnalisé",
          "Espace de demandes organisé",
          "Brouillons assistés que vous validez",
          "Suivi manuel visible",
          "Accompagnement du fondateur",
        ],
      },
      {
        badge: "Après la cohorte de rétroaction",
        name: "Pilote Pro",
        price: "199 $ de configuration + 79 $/mois",
        body:
          "Le flux contrôlé Démarrage avec une image de marque renforcée, l'ajustement du ton et un accompagnement prioritaire.",
        points: [
          "Tout le contenu de Démarrage",
          "Image de marque renforcée",
          "Ajustement du ton et de la FAQ",
          "Ajustement des brouillons de suivi",
          "Accompagnement prioritaire",
        ],
      },
    ],
    notice:
      "Aucun paiement n'est effectué sur cette page. La portée, le soutien, l'annulation, les remboursements, le mode de paiement et la date de début sont confirmés avant tout pilote payant.",
  },
  pilot: {
    fit: [
      "Une entreprise d'entretien qui reçoit déjà des demandes en ligne ou par message",
      "Un propriétaire ou une petite équipe qui répond encore manuellement",
      "Des demandes souvent incomplètes sur la portée, l'horaire, le secteur ou l'accès",
      "Une équipe prête à tester le flux et à fournir une rétroaction structurée",
    ],
    nextSteps: [
      {
        key: "fit-review",
        title: "Vérification de la compatibilité",
        body: "Le fondateur examine votre parcours actuel, vos services et les limites du pilote.",
      },
      {
        key: "manual-setup",
        title: "Configuration manuelle",
        body: "Un modèle d'entretien, un lien de collecte et un espace pour le propriétaire sont configurés.",
      },
      {
        key: "controlled-use",
        title: "Utilisation contrôlée",
        body: "Votre équipe valide chaque brouillon assisté et envoie elle-même les réponses.",
      },
      {
        key: "feedback",
        title: "Points de rétroaction",
        body: "Vous examinez les irritants, la qualité des demandes, la préparation des réponses et les prochaines améliorations.",
      },
    ],
    applicationFields: [
      "Nom de l'entreprise",
      "Courriel professionnel",
      "Ville ou secteur desservi",
      "Services d'entretien",
      "Nombre approximatif de demandes par semaine",
      "Principal problème de gestion des demandes",
      "Langue préférée",
    ],
    applicationAction: "Copier la demande de pilote de 60 secondes",
    applicationCopied: "Demande de pilote copiée.",
    applicationSelectFallback:
      "La demande est sélectionnée. Copiez-la manuellement.",
    applicationTemplateTitle: "Demande pour le pilote fondateur BizPilot",
    submissionBoundary:
      "BizPilot n'envoie ni ne conserve cette demande publique. Copiez-la et transmettez-la par le moyen de contact que vous utilisez déjà avec le fondateur. Aucun compte, paiement ni accès aux données de production n'est créé.",
  },
  faqItems: [
    {
      key: "direct-integrations",
      question: "BizPilot se connecte-t-il directement à Instagram, WhatsApp, Messenger, au courriel ou à Google aujourd'hui?",
      answer:
        "Non. Le produit actuel utilise un seul lien de collecte que vous partagez à ces endroits. Les intégrations directes aux boîtes de réception ne sont pas actives.",
    },
    {
      key: "link-placement",
      question: "Où puis-je partager le lien de collecte?",
      answer:
        "Placez-le sur votre site, votre bio, votre fiche Google, votre signature courriel, un code QR, une réponse enregistrée ou un message direct que vous envoyez vous-même.",
    },
    {
      key: "after-submit",
      question: "Que se passe-t-il après les réponses du client?",
      answer:
        "BizPilot organise les réponses dans une demande, montre ce qui manque encore et peut préparer un résumé et un brouillon pour votre équipe.",
    },
    {
      key: "ai-role",
      question: "Quel est le rôle de l'IA?",
      answer:
        "L'IA aide à résumer la demande et à préparer une réponse prudente ou une question de suivi à partir des renseignements fournis et du contexte approuvé.",
    },
    {
      key: "auto-send",
      question: "BizPilot envoie-t-il des messages automatiquement?",
      answer:
        "Non. Votre équipe valide, modifie, copie et envoie la réponse finale dans le vrai canal du client.",
    },
    {
      key: "pricing-booking",
      question: "BizPilot peut-il inventer un prix ou confirmer une réservation?",
      answer:
        "Non. Il peut montrer les renseignements manquants et préparer la prochaine question. Il n'invente pas de prix, ne promet pas de disponibilité, ne prend pas de paiement et ne confirme pas de réservation.",
    },
    {
      key: "setup",
      question: "Comment le premier flux est-il configuré?",
      answer:
        "Le fondateur examine un parcours de demandes d'entretien, configure les questions et l'espace de travail, puis confirme les limites avant l'utilisation contrôlée.",
    },
    {
      key: "data",
      question: "Quelles données client sont utilisées?",
      answer:
        "Le flux utilise les renseignements soumis par le client et le contexte d'entreprise approuvé nécessaire pour organiser la demande et préparer un brouillon. Consultez Confidentialité et Confiance pour les limites actuelles.",
    },
    {
      key: "pricing",
      question: "Y a-t-il un paiement libre-service?",
      answer:
        "Non. La compatibilité, la portée, le soutien, l'annulation, les remboursements et le mode de paiement sont confirmés avant toute configuration ou facturation payante.",
    },
    {
      key: "verticals",
      question: "BizPilot est-il réservé aux entreprises d'entretien?",
      answer:
        "La base du produit vise les entreprises de services, mais l'entretien est le seul modèle pilote complet et la seule démo publique aujourd'hui. Les autres secteurs restent à valider.",
    },
  ],
  faqGroups: [
    {
      key: "channels",
      title: "Canaux et collecte",
      itemKeys: ["direct-integrations", "link-placement", "after-submit"],
    },
    {
      key: "control",
      title: "IA et contrôle humain",
      itemKeys: ["ai-role", "auto-send", "pricing-booking"],
    },
    {
      key: "pilot",
      title: "Configuration, données et pilote",
      itemKeys: ["setup", "data", "pricing", "verticals"],
    },
  ],
  trust: [
    {
      key: "explicit-inputs",
      title: "Renseignements fournis explicitement",
      body: "La demande repose sur les réponses que le client choisit de fournir dans le lien de collecte.",
    },
    {
      key: "visible-gaps",
      title: "Renseignements manquants visibles",
      body: "L'interface montre ce qui est inconnu au lieu d'encourager l'IA à inventer un fait.",
    },
    {
      key: "bounded-ai",
      title: "Aide de l'IA encadrée",
      body: "Les résumés et brouillons utilisent la demande et le contexte approuvé. Ce sont des points de départ, pas des décisions autonomes.",
    },
    {
      key: "human-review",
      title: "Validation humaine avant l'envoi",
      body: "Une personne peut modifier, refuser ou copier le brouillon. Le pilote actuel n'envoie aucun message automatiquement.",
    },
    {
      key: "data-minimization",
      title: "Minimisation des données",
      body: "Recueillez les renseignements nécessaires à la demande sans élargir le profilage du client.",
    },
    {
      key: "operational-boundaries",
      title: "Limites opérationnelles claires",
      body: "Aucune soumission inventée, réservation automatique, prise de paiement ou fausse intégration de canal.",
    },
  ],
};

const publicV3SpecByLanguage: Readonly<
  Record<SupportedLanguage, PublicV3Spec>
> = {
  en: englishSpec,
  "fr-CA": frenchSpec,
};

export function getPublicV3Spec(language: SupportedLanguage): PublicV3Spec {
  return publicV3SpecByLanguage[language];
}
