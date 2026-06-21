/**
 * ============================================================
 * File: lib/i18n/public-site-copy.ts
 * Project: BizPilot AI
 * Description: Central public marketing-page copy dictionary.
 * Role: Keeps final public-site routes, metadata, auth metadata, and quote shell labels language-linked.
 * Related:
 * - app/page.tsx
 * - app/features/page.tsx
 * - lib/i18n/language.ts
 * Author: MoOoH
 * Created: 2026-06-19
 * Last Updated: 2026-06-20
 * Change Log:
 * - 2026-06-19: Added final public EN/fr-CA route copy for Phase 03 localization.
 * - 2026-06-19: Added Phase 04 homepage demo state and cleaning-use-case card copy.
 * - 2026-06-20: Shortened fr-CA homepage hero copy for first-fold parity.
 * ============================================================
 */

import {
  DEFAULT_LANGUAGE,
  readSupportedLanguage,
  type SupportedLanguage,
} from "./language.ts";

type MetaCopy = Readonly<{
  description: string;
  title: string;
}>;

type TextPair = Readonly<{
  body: string;
  title: string;
}>;

type LabelValue = readonly [string, string];

type HomeCopy = Readonly<{
  ai: Readonly<{
    body: string;
    canHelp: readonly string[];
    canHelpTitle: string;
    title: string;
    willNot: readonly string[];
    willNotTitle: string;
    eyebrow: string;
  }>;
  faq: Readonly<{
    eyebrow: string;
    items: ReadonlyArray<Readonly<{ answer: string; question: string }>>;
    title: string;
  }>;
  finalCta: Readonly<{
    body: string;
    cta: string;
    note: string;
    title: string;
  }>;
  hero: Readonly<{
    badge: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    title: string;
    trustBadges: readonly string[];
  }>;
  meta: MetaCopy;
  mockup: Readonly<{
    copyButton: string;
    draftBody: string;
    draftTag: string;
    draftTitle: string;
    fields: ReadonlyArray<LabelValue>;
    name: string;
    status: string;
    title: string;
  }>;
  preview: Readonly<{
    badges: readonly string[];
    body: string;
    copyButton: string;
    cta: string;
    steps: ReadonlyArray<
      Readonly<{
        body?: string;
        fields?: ReadonlyArray<LabelValue>;
        quote?: string;
        title: string;
      }>
    >;
    title: string;
  }>;
  problem: Readonly<{
    body: string;
    cards: ReadonlyArray<TextPair>;
    eyebrow: string;
    title: string;
  }>;
  roadmap: Readonly<{
    badge: string;
    body: string;
    cards: readonly string[];
    title: string;
  }>;
  solution: Readonly<{
    cards: ReadonlyArray<TextPair>;
    eyebrow: string;
    title: string;
  }>;
  useCases: Readonly<{
    body: string;
    cards: ReadonlyArray<
      Readonly<{
        body: string;
        href: string;
        title: string;
      }>
    >;
    title: string;
  }>;
  workflow: Readonly<{
    eyebrow: string;
    stepLabel: string;
    steps: readonly string[];
    title: string;
  }>;
}>;

type FeaturesCopy = Readonly<{
  badges: readonly string[];
  cards: ReadonlyArray<TextPair>;
  meta: MetaCopy;
  primaryCta: string;
  proof: Readonly<{
    badge: string;
    body: string;
    items: readonly string[];
    title: string;
  }>;
  roadmap: Readonly<{
    badge: string;
    body: string;
  }>;
  secondaryCta: string;
  title: string;
  badge: string;
}>;

type CleaningCopy = Readonly<{
  body: string;
  beforeAfter: Readonly<{
    after: string;
    afterLabel: string;
    before: string;
    beforeLabel: string;
    body: string;
    title: string;
  }>;
  ctaPrimary: string;
  ctaSecondary: string;
  example: Readonly<{
    fields: ReadonlyArray<LabelValue>;
    request: string;
    requestLabel: string;
    title: string;
    workflow: string;
  }>;
  families: ReadonlyArray<
    Readonly<{
      body: string;
      details: readonly string[];
      detailsTitle: string;
      request: string;
      requestLabel: string;
      services: ReadonlyArray<
        Readonly<{
          body: string;
          id: string;
          title: string;
        }>
      >;
      title: string;
    }>
  >;
  intro: string;
  meta: MetaCopy;
  services: readonly string[];
  servicesTitle: string;
  title: string;
  badge: string;
}>;

type TrustCopy = Readonly<{
  body: string;
  items: ReadonlyArray<TextPair>;
  meta: MetaCopy;
  notes: Readonly<{
    badge: string;
    body: string;
  }>;
  pillars: ReadonlyArray<
    Readonly<{
      body: string;
      points: readonly string[];
      title: string;
    }>
  >;
  primaryCta: string;
  privacyCta: string;
  securityCta: string;
  title: string;
  badge: string;
}>;

type DemoCopy = Readonly<{
  body: string;
  chapters: ReadonlyArray<
    Readonly<{
      body: string;
      eyebrow: string;
      panelItems: readonly string[];
      panelTitle: string;
      title: string;
    }>
  >;
  cta: Readonly<{
    body: string;
    button: string;
    title: string;
  }>;
  meta: MetaCopy;
  title: string;
  badge: string;
}>;

type PricingCopy = Readonly<{
  afterApply: Readonly<{
    steps: readonly string[];
    title: string;
  }>;
  body: string;
  cards: ReadonlyArray<
    Readonly<{
      bullets: readonly string[];
      cohort: string;
      cta: string;
      highlight: string;
      priceLines: readonly string[];
      title: string;
    }>
  >;
  guardrail: Readonly<{
    body: string;
    title: string;
  }>;
  meta: MetaCopy;
  title: string;
  badge: string;
}>;

export type PilotConversionCopy = Readonly<{
  body: string;
  copiedStatus: string;
  fallbackBody: string;
  previewQuestions: readonly string[];
  previewTitle: string;
  primaryAction: string;
  secondaryAction: string;
  selectedStatus: string;
  selectAction: string;
  template: string;
  templateLabel: string;
  title: string;
}>;

type PilotCopy = Readonly<{
  body: string;
  conversion: PilotConversionCopy;
  fitItems: readonly string[];
  fitTitle: string;
  getItems: readonly string[];
  getTitle: string;
  meta: MetaCopy;
  nextSteps: readonly string[];
  nextStepsTitle: string;
  title: string;
  badge: string;
}>;

type ContentStudioCopy = Readonly<{
  body: string;
  cards: ReadonlyArray<TextPair>;
  cta: string;
  footer: string;
  meta: MetaCopy;
  title: string;
  badge: string;
}>;

type AuthMetaCopy = Readonly<{
  checkEmail: MetaCopy;
  forgotPassword: MetaCopy;
  resetPassword: MetaCopy;
  signIn: MetaCopy;
  signUp: MetaCopy;
  signUpPilotPrompt: string;
  signUpPilotCta: string;
}>;

type QuoteShellCopy = Readonly<{
  guardrail: string;
  subtitle: string;
  title: string;
}>;

export type PublicSiteCopy = Readonly<{
  authMeta: AuthMetaCopy;
  cleaning: CleaningCopy;
  contentStudio: ContentStudioCopy;
  demo: DemoCopy;
  features: FeaturesCopy;
  home: HomeCopy;
  pilot: PilotCopy;
  pricing: PricingCopy;
  quoteShell: QuoteShellCopy;
  trust: TrustCopy;
}>;

export const PUBLIC_SITE_COPY_SOURCE_LANGUAGE = DEFAULT_LANGUAGE;
export const publicSiteCopyNamespaces = [
  "home",
  "features",
  "cleaning",
  "trust",
  "demo",
  "pricing",
  "pilot",
  "contentStudio",
  "authMeta",
  "quoteShell",
] as const satisfies readonly (keyof PublicSiteCopy)[];

const englishPublicSiteCopy: PublicSiteCopy = {
  authMeta: {
    checkEmail: {
      description:
        "Check your email to continue BizPilot AI owner account setup.",
      title: "Check email | BizPilot AI",
    },
    forgotPassword: {
      description:
        "Request a secure password reset link for your BizPilot AI owner account.",
      title: "Reset password | BizPilot AI",
    },
    resetPassword: {
      description:
        "Choose a new password for your BizPilot AI owner account.",
      title: "Reset Password | BizPilot AI",
    },
    signIn: {
      description:
        "Sign in to an approved BizPilot AI owner workspace to review cleaning quote requests and owner-reviewed drafts.",
      title: "Sign in | BizPilot AI",
    },
    signUp: {
      description:
        "Create a BizPilot AI owner workspace after founder-pilot approval.",
      title: "Create Owner Access | BizPilot AI",
    },
    signUpPilotCta: "Apply through the founder pilot page first.",
    signUpPilotPrompt: "Looking to join the pilot?",
  },
  cleaning: {
    badge: "Cleaning businesses first",
    beforeAfter: {
      after:
        "Thanks for reaching out. Could you confirm the approximate square footage, whether appliances need interior cleaning, and access notes so I can prepare a responsible quote?",
      afterLabel: "Owner-reviewed reply draft",
      before: '"How much for a move-out clean before Friday?"',
      beforeLabel: "Before",
      body:
        "BizPilot turns a vague cleaning message into the missing details an owner needs before replying.",
      title: "From vague request to clear next reply.",
    },
    body:
      "BizPilot helps cleaning business owners collect quote requests, organize leads, and draft fast owner-reviewed replies.",
    ctaPrimary: "Join the cleaning founder pilot",
    ctaSecondary: "See demo",
    example: {
      fields: [
        ["Service", "Move-out cleaning"],
        ["Property", "2-bedroom apartment"],
        ["Timing", "Before Friday"],
        ["Missing", "square footage, appliances, access notes"],
        ["Status", "Needs reply"],
      ],
      request:
        '"Hi, can you do a move-out cleaning before Friday? It is a 2-bedroom apartment."',
      requestLabel: "Example request",
      title: "Cleaning quote workflow",
      workflow:
        "Customer requests quote -> Owner sees service details -> AI summarizes -> AI drafts reply -> Owner copies and sends manually",
    },
    families: [
      {
        body:
          "Common home requests still need the right scope before an owner can quote responsibly.",
        details: [
          "Service type",
          "Bedrooms, bathrooms, or square footage",
          "Priority rooms and condition",
          "Pets, supplies, and access notes",
        ],
        detailsTitle: "Details BizPilot keeps clear",
        request:
          '"Can you do a deep clean for a 3-bedroom house next week?"',
        requestLabel: "Example request",
        services: [
          {
            body: "Recurring or one-time home-cleaning requests.",
            id: "residential",
            title: "Residential cleaning",
          },
          {
            body: "Scope, property condition, and priority areas.",
            id: "deep-cleaning",
            title: "Deep cleaning",
          },
        ],
        title: "Homes",
      },
      {
        body:
          "Deadline-driven work needs timing, access, and turnover details in one place.",
        details: [
          "Move date or checkout time",
          "Appliance and cabinet interior needs",
          "Entry instructions",
          "Missing supplies or linen notes",
        ],
        detailsTitle: "Details BizPilot keeps clear",
        request:
          '"The tenant leaves Friday morning. Can someone clean before the new guest arrives?"',
        requestLabel: "Example request",
        services: [
          {
            body: "Deadlines, appliance details, and access notes.",
            id: "move-in-out",
            title: "Move-in / move-out",
          },
          {
            body: "Checkout time, linens, supplies, and entry details.",
            id: "airbnb",
            title: "Airbnb turnover",
          },
        ],
        title: "Moves and turnovers",
      },
      {
        body:
          "Commercial and specialist requests become easier to triage when scope and site access are visible.",
        details: [
          "Floor area and frequency",
          "Preferred schedule",
          "Site access and contact",
          "Dust, debris, or specialist scope",
        ],
        detailsTitle: "Details BizPilot keeps clear",
        request:
          '"We need office cleaning twice a week and a post-renovation cleanup next month."',
        requestLabel: "Example request",
        services: [
          {
            body: "Floor area, frequency, schedule, and site access.",
            id: "office",
            title: "Office cleaning",
          },
          {
            body: "Small commercial requests with clear manual follow-up.",
            id: "small-commercial",
            title: "Small commercial cleaning",
          },
          {
            body: "Site size, dust/debris scope, and deadline.",
            id: "post-construction",
            title: "Post-construction cleaning",
          },
        ],
        title: "Commercial and specialist",
      },
    ],
    intro:
      "Cleaning owners are often away from a desk. They are on jobs, driving, managing staff, or answering existing customers. Quote requests arrive at the worst time, and slow replies can cost jobs.",
    meta: {
      description:
        "BizPilot AI helps cleaning business owners collect quote requests, organize leads, and draft fast owner-reviewed replies.",
      title: "Cleaning Business Lead Recovery Software | BizPilot AI",
    },
    services: [
      "Residential cleaning",
      "Deep cleaning",
      "Move-in / move-out",
      "Office cleaning",
      "Airbnb turnover",
      "Post-construction cleaning",
      "Small commercial cleaning",
    ],
    servicesTitle: "Services supported in the pilot",
    title: "Lead recovery software for cleaning businesses.",
  },
  contentStudio: {
    badge: "Roadmap",
    body:
      "This page is roadmap only. BizPilot may later help local businesses create owner-reviewed marketing content after the cleaning lead recovery workflow is validated.",
    cards: [
      {
        body: "Future drafts for explaining cleaning services clearly.",
        title: "Service post drafts",
      },
      {
        body: "Owner-reviewed ideas for local profile updates.",
        title: "Google Business Profile ideas",
      },
      {
        body: "Promotion outlines that still need owner approval.",
        title: "Seasonal promotion outlines",
      },
      {
        body: "Draft responses for the owner to review before posting.",
        title: "Review-response drafts",
      },
      {
        body: "Short concepts for service education or local updates.",
        title: "Video script ideas",
      },
      {
        body: "Plain-language briefs for future image or design work.",
        title: "Visual creative briefs",
      },
    ],
    cta: "Apply for founder pilot",
    footer:
      "Like AI reply drafts, future content drafts should be reviewed by the owner before publishing. No automatic posting is promised.",
    meta: {
      description:
        "Future BizPilot AI Content Studio roadmap for owner-reviewed local business marketing content after lead recovery is validated.",
      title: "Content Studio Roadmap | BizPilot AI",
    },
    title: "Future Content Studio for local business growth.",
  },
  demo: {
    badge: "60-second workflow demo",
    body:
      "Follow one realistic move-out cleaning request from customer message to owner-reviewed reply.",
    chapters: [
      {
        body:
          "A vague request arrives while the owner is busy. Details are missing, pricing is risky, and the message is easy to forget.",
        eyebrow: "1",
        panelItems: ['"Hi, how much for move-out cleaning before Friday?"'],
        panelTitle: "Customer message",
        title: "Request arrives.",
      },
      {
        body:
          "BizPilot turns the message into cleaning-specific context and highlights what is missing before a responsible quote.",
        eyebrow: "2",
        panelItems: [
          "Service: Move-out cleaning",
          "Timing: Before Friday",
          "Status: Needs reply",
          "Missing: square footage, appliances, access notes",
          "Consent: owner-reviewed reply expected",
        ],
        panelTitle: "Organized lead",
        title: "BizPilot organizes it and highlights missing details.",
      },
      {
        body:
          "AI prepares a short owner summary and a practical first reply. The draft asks for missing details instead of inventing a price.",
        eyebrow: "3",
        panelItems: [
          "Sarah needs a move-out cleaning before Friday, but pricing would be risky without square footage, appliance details, and access notes.",
          "Hi Sarah, thanks for reaching out. Could you confirm the approximate square footage, whether appliances need interior cleaning, and any access notes so I can prepare an accurate quote?",
        ],
        panelTitle: "AI summary and draft",
        title: "AI prepares an owner-reviewed draft.",
      },
      {
        body:
          "The owner reviews, edits if needed, copies the reply, and sends it manually from their own channel. Guardrails stay visible.",
        eyebrow: "4",
        panelItems: [
          "Review",
          "Edit if needed",
          "Copy reply",
          "Send manually",
          "No auto-send",
          "No invented price",
          "No booking confirmation",
          "No SMS/WhatsApp automation",
          "No full CRM claim",
        ],
        panelTitle: "Manual send and guardrails",
        title: "Manual send + guardrails.",
      },
    ],
    cta: {
      body:
        "BizPilot is starting with cleaning businesses first so the product can be shaped around real quote requests and owner feedback.",
      button: "Apply for founder pilot",
      title: "Try the founder pilot workflow with real cleaning leads.",
    },
    meta: {
      description:
        "See how BizPilot AI captures a cleaning quote request, organizes the lead, highlights missing details, and prepares an owner-reviewed reply.",
      title: "Cleaning Quote Workflow Demo | BizPilot AI",
    },
    title: "See how BizPilot handles a cleaning quote request.",
  },
  features: {
    badge: "Features",
    badges: [
      "No auto-send",
      "No invented price",
      "Owner decides",
      "Manual copy/send",
      "Cleaning-first pilot",
    ],
    cards: [
      {
        body: "Give customers one simple place to request a quote.",
        title: "Capture every quote request in one clean flow.",
      },
      {
        body:
          "See new cleaning requests in one owner workspace instead of scattered messages.",
        title: "Know who needs a reply now.",
      },
      {
        body:
          "Review the service, timing, property details, notes, and contact path before replying.",
        title: "See the job context before you answer.",
      },
      {
        body:
          "Use a practical first response that asks for missing details instead of guessing.",
        title: "Start with an owner-reviewed draft.",
      },
      {
        body:
          "Keep final communication in the owner's hands while still moving faster.",
        title: "Copy and send from the channel you already use.",
      },
      {
        body:
          "Track whether the next step is reply, ask for details, follow up, or mark reviewed.",
        title: "Keep the next manual action clear.",
      },
    ],
    meta: {
      description:
        "BizPilot AI features for cleaning businesses: quote link, lead inbox, lead detail, owner-reviewed AI drafts, and manual copy/send workflow.",
      title: "Cleaning Lead Recovery Features | BizPilot AI",
    },
    primaryCta: "Join founder pilot",
    proof: {
      badge: "Product proof",
      body:
        "A realistic cleaning request moves through one simple manual-first path.",
      items: [
        "Customer submits a quote request",
        "BizPilot organizes service, timing, and missing details",
        "AI prepares an owner-reviewed draft",
        "Owner copies, edits if needed, and sends manually",
      ],
      title: "From quote link to owner-reviewed reply.",
    },
    roadmap: {
      badge: "Roadmap",
      body:
        "Follow-up drafts, reporting, Content Studio, integrations, and multi-industry templates are planned after validation.",
    },
    secondaryCta: "Read trust approach",
    title:
      "A simple system to capture, organize, and reply to cleaning leads faster.",
  },
  home: {
    ai: {
      body:
        "BizPilot does not automatically send customer messages in the first pilot. AI helps prepare replies, but every message is reviewed, edited, and sent manually by the owner.",
      canHelp: [
        "Summarizing quote requests",
        "Drafting friendly replies",
        "Suggesting follow-up questions",
        "Improving tone",
        "Creating English or French response drafts",
      ],
      canHelpTitle: "AI can help with",
      eyebrow: "Manual-first AI",
      title: "AI drafts. You decide.",
      willNot: [
        "Send messages automatically",
        "Invent prices",
        "Promise availability",
        "Confirm bookings",
        "Replace owner judgment",
      ],
      willNotTitle: "AI will not",
    },
    faq: {
      eyebrow: "FAQ",
      items: [
        {
          answer:
            "No. BizPilot starts as a focused lead recovery workflow for cleaning quote requests, not a full CRM.",
          question: "Is BizPilot a full CRM?",
        },
        {
          answer:
            "No. In the first pilot, BizPilot drafts replies and the owner reviews, edits, copies, and sends manually.",
          question: "Does BizPilot send messages automatically?",
        },
        {
          answer:
            "No. BizPilot should not invent prices. It can help ask for the missing details needed before you quote.",
          question: "Can AI create prices for me?",
        },
        {
          answer:
            "BizPilot is built for cleaning businesses first: residential, deep cleaning, move-out, office, Airbnb turnover, and related quote requests.",
          question: "Who is BizPilot for first?",
        },
        {
          answer:
            "The request appears as an organized lead with the service, timing, property details, status, and an owner-reviewed reply draft when enough context is available.",
          question: "What happens when a customer submits a quote request?",
        },
        {
          answer:
            "Later, possibly. The founder pilot is cleaning-only so the workflow can be proven before expanding.",
          question: "Will BizPilot support other industries?",
        },
        {
          answer:
            "Content Studio is a roadmap direction for owner-reviewed posts, updates, campaigns, service descriptions, and visual content briefs. It is not the first pilot promise.",
          question: "What is the future Content Studio?",
        },
      ],
      title: "Straight answers for the founder pilot.",
    },
    finalCta: {
      body:
        "We are starting with a small group of cleaning businesses to test the workflow, improve the product, and build around real owner feedback.",
      cta: "Apply for founder pilot",
      note: "Limited pilot. Manual onboarding. No auto-send.",
      title: "Join the founder pilot for cleaning businesses.",
    },
    hero: {
      badge: "Built for cleaning businesses first",
      body:
        "BizPilot helps cleaning businesses collect quote requests, organize leads, and draft fast owner-reviewed replies - so owners can respond faster without giving up control.",
      primaryCta: "Join founder pilot",
      secondaryCta: "Watch demo",
      title: "Stop losing cleaning quotes to slow replies.",
      trustBadges: [
        "No auto-send",
        "Owner-reviewed AI drafts",
        "Manual copy/send workflow",
      ],
    },
    meta: {
      description:
        "BizPilot AI helps cleaning businesses collect quote requests, organize leads, and draft fast owner-reviewed replies without auto-sending customer messages.",
      title: "BizPilot AI | Lead Recovery for Cleaning Businesses",
    },
    mockup: {
      copyButton: "Copy reply",
      draftBody:
        "Hi Maria, thanks for reaching out. I can help with your move-out cleaning. Could you confirm the address area and whether appliances need cleaning so I can prepare an accurate quote?",
      draftTag: "AI drafts. You send.",
      draftTitle: "AI draft card",
      fields: [
        ["Service", "Move-out cleaning"],
        ["Property", "2 bed / 1 bath"],
        ["Timing", "Saturday morning"],
        ["Status", "Needs reply"],
      ],
      name: "Maria L.",
      status: "Needs reply",
      title: "New quote request",
    },
    preview: {
      badges: ["No auto-send", "No invented price", "Manual send"],
      body:
        "Follow one realistic move-out cleaning request from messy message to owner-reviewed reply. BizPilot organizes the work; the owner stays in control.",
      copyButton: "Copy reply",
      cta: "Watch full demo",
      steps: [
        {
          quote: '"Hi, how much for move-out cleaning before Friday?"',
          title: "Messy request",
        },
        {
          fields: [
            ["Service", "Move-out cleaning"],
            ["Timing", "Before Friday"],
            ["Missing", "square footage, appliances, access notes"],
            ["Status", "Needs reply"],
          ],
          title: "BizPilot organizes it",
        },
        {
          body:
            "Hi Sarah, thanks for reaching out. Could you confirm the approximate square footage, whether appliances need interior cleaning, and any access notes so I can prepare an accurate quote?",
          title: "Owner-reviewed draft",
        },
        {
          body:
            "The owner reviews the draft, adjusts it if needed, copies it, and sends it manually from the channel they already use.",
          title: "Owner copies and sends manually",
        },
      ],
      title: "See the quote recovery workflow in 60 seconds.",
    },
    problem: {
      body:
        "Cleaning owners receive quote requests while working, driving, managing a team, or answering customers. When messages get buried or replies are delayed, customers move on.",
      cards: [
        {
          body:
            "Quote requests arrive through different channels and are easy to miss.",
          title: "Messages get buried",
        },
        {
          body: "Customers often contact more than one cleaning business.",
          title: "Replies take too long",
        },
        {
          body:
            "Owners waste time writing the same first reply again and again.",
          title: "No ready response",
        },
      ],
      eyebrow: "Problem",
      title: "Your next customer may already be waiting.",
    },
    roadmap: {
      badge: "Roadmap",
      body:
        "BizPilot is being designed to help local service businesses create owner-reviewed social posts, Google Business updates, follow-up campaigns, service descriptions, seasonal promotions, and visual content briefs.",
      cards: [
        "Social captions",
        "Google Business posts",
        "Seasonal campaign ideas",
        "Review responses",
        "Image prompts",
        "Content calendar",
      ],
      title:
        "More than lead replies - future growth content for your business.",
    },
    solution: {
      cards: [
        {
          body: "Share a simple quote link with customers.",
          title: "Capture quote requests",
        },
        {
          body: "See who needs a reply and what service they requested.",
          title: "Review organized leads",
        },
        {
          body: "Use a professional draft, edit it, and send it manually.",
          title: "Copy AI-drafted replies",
        },
      ],
      eyebrow: "Solution",
      title: "A simple lead recovery system for cleaning businesses.",
    },
    useCases: {
      body:
        "BizPilot keeps the service, timing, missing details, and next reply clear across common residential and commercial cleaning requests.",
      cards: [
        {
          body: "Recurring or one-time home-cleaning requests.",
          href: "/industries/cleaning#residential",
          title: "Residential cleaning",
        },
        {
          body: "Scope, property condition, and priority areas.",
          href: "/industries/cleaning#deep-cleaning",
          title: "Deep cleaning",
        },
        {
          body: "Deadlines, appliance details, and access notes.",
          href: "/industries/cleaning#move-in-out",
          title: "Move-in / move-out",
        },
        {
          body: "Floor area, frequency, schedule, and site access.",
          href: "/industries/cleaning#office",
          title: "Office cleaning",
        },
        {
          body: "Checkout time, linens, supplies, and entry details.",
          href: "/industries/cleaning#airbnb",
          title: "Airbnb turnover",
        },
        {
          body: "Site size, dust/debris scope, and deadline.",
          href: "/industries/cleaning#post-construction",
          title: "Post-construction cleaning",
        },
      ],
      title: "Built for the cleaning jobs you quote every week.",
    },
    workflow: {
      eyebrow: "How it works",
      stepLabel: "Step",
      steps: [
        "Share your BizPilot quote link",
        "Customer submits a request",
        "Lead appears in your dashboard",
        "BizPilot drafts a response",
        "You review and send manually",
      ],
      title: "Five steps, no hidden automation.",
    },
  },
  pilot: {
    badge: "Founder pilot",
    body:
      "Join a small founder-led pilot built to help cleaning businesses capture quote requests, reply faster, and stay in control.",
    conversion: {
      body:
        "Copy a 60-second request template now. Nothing is submitted or stored on this page.",
      copiedStatus: "Pilot request template copied.",
      fallbackBody:
        "Clipboard permission was blocked. Use the fallback template below.",
      previewQuestions: [
        "Business name",
        "Work email",
        "City / service area",
        "Weekly quote-volume range",
        "Biggest lead-management problem",
        "Preferred language",
      ],
      previewTitle: "Preview the six application questions",
      primaryAction: "Copy pilot request template",
      secondaryAction: "See pilot pricing",
      selectedStatus: "Pilot request template selected.",
      selectAction: "Select template",
      template:
        "Subject: BizPilot founder pilot request\nBusiness name:\nWork email:\nCity / service area:\nCleaning services:\nApproximate quote requests per week:\nBiggest lead-management problem:\nPreferred language: English / French / Both",
      templateLabel: "Pilot request template",
      title: "Pilot requests are being prepared.",
    },
    fitItems: [
      "Owner-operated cleaning businesses",
      "Small cleaning teams",
      "Businesses already receiving online quote requests",
      "Owners who want speed without full-CRM complexity",
    ],
    fitTitle: "Good fit for",
    getItems: [
      "Cleaning quote request link",
      "Organized lead inbox",
      "AI-assisted summary and reply draft",
      "Manual copy/send workflow",
      "Founder-led setup",
      "Feedback-based improvements",
    ],
    getTitle: "What you get",
    meta: {
      description:
        "Apply for the BizPilot AI founder pilot for cleaning businesses that want faster owner-reviewed quote replies without full CRM complexity.",
      title: "Cleaning Business Founder Pilot | BizPilot AI",
    },
    nextSteps: [
      "Send a short pilot request",
      "Founder reviews the workflow",
      "Selected businesses receive setup and a sample workflow",
    ],
    nextStepsTitle: "What happens next",
    title: "Help shape BizPilot around real cleaning work.",
  },
  pricing: {
    afterApply: {
      steps: [
        "Founder reviews fit and current quote workflow",
        "Pilot setup stays manual and approval-gated",
        "Payment, if any, uses invoice or Stripe Payment Link only",
      ],
      title: "What happens after you apply",
    },
    badge: "Approved staged pilot terms",
    body:
      "BizPilot is starting with controlled cleaning-business pilot cohorts. Setup and billing stay founder-led, manual, and approval-gated.",
    cards: [
      {
        bullets: [
          "Founder-led setup",
          "Cleaning quote request link",
          "Lead inbox",
          "AI summary and reply draft assistance",
          "Manual copy/send workflow",
          "30- and 60-day feedback commitment",
          "No auto-send",
        ],
        cohort: "Businesses 1-5",
        cta: "Apply for founder pilot",
        highlight: "Feedback commitment required",
        priceLines: ["$0 setup"],
        title: "Founder Feedback Pilot",
      },
      {
        bullets: [
          "Public quote page",
          "Lead recovery dashboard",
          "AI reply drafts owner reviews",
          "Manual follow-up visibility",
          "Founder setup guidance",
          "Manual invoice or Stripe Payment Link only",
        ],
        cohort: "Customers 6-20",
        cta: "Apply for pilot",
        highlight: "Manual billing after approval",
        priceLines: ["$149 setup", "$49/month"],
        title: "Starter Pilot",
      },
      {
        bullets: [
          "Everything in Starter",
          "Stronger branded quote page",
          "Reply style and FAQ tuning",
          "Follow-up draft tuning",
          "Better lead organization",
          "Priority onboarding",
          "Simple usage insights",
        ],
        cohort: "After 20 customers",
        cta: "Apply for pilot",
        highlight: "Manual billing after approval",
        priceLines: ["$199 setup", "$79/month"],
        title: "Pro Pilot",
      },
    ],
    guardrail: {
      body:
        "Payment collection starts only after final readiness approval and a manual invoice or Stripe Payment Link process is prepared. BizPilot does not include in-app billing automation, booking, invoicing, SMS/WhatsApp automation, or auto-send.",
      title: "Payment and product guardrails",
    },
    meta: {
      description:
        "Approved staged pilot pricing for cleaning businesses exploring BizPilot AI lead recovery, with manual setup and payment guardrails.",
      title: "Founder Pilot Pricing | BizPilot AI",
    },
    title: "Simple pilot pricing for cleaning businesses.",
  },
  quoteShell: {
    guardrail:
      "This form does not confirm booking or pricing. The business owner will review your request and reply.",
    subtitle: "Tell us what you need and we will review your request.",
    title: "Request a cleaning quote",
  },
  trust: {
    badge: "Trust-first workflow",
    body:
      "BizPilot is manual-first. AI assists with drafts, but the owner reviews and sends every customer message.",
    items: [
      {
        body:
          "BizPilot does not automatically send customer messages in the first pilot.",
        title: "No auto-send",
      },
      {
        body:
          "AI drafts are reviewed, edited, and sent manually by the business owner.",
        title: "Owner-reviewed AI",
      },
      {
        body:
          "The assistant should ask for missing details instead of inventing prices.",
        title: "No fake pricing",
      },
      {
        body:
          "A quote request never becomes a confirmed booking by itself.",
        title: "No booking confirmation",
      },
      {
        body:
          "Real customer data stays blocked until final readiness approval is complete.",
        title: "Real customer data readiness gate",
      },
      {
        body:
          "If AI is unavailable, the owner still has a clear manual workflow.",
        title: "Safe fallback if AI is unavailable",
      },
      {
        body:
          "The first pilot is built around copy/send owner control.",
        title: "Manual communication only in first pilot",
      },
    ],
    meta: {
      description:
        "BizPilot AI is manual-first: AI drafts, owners review, and no customer messages are sent automatically in the first pilot.",
      title: "Owner-Controlled AI and Trust | BizPilot AI",
    },
    notes: {
      badge: "Technical readiness notes",
      body:
        "BizPilot's commercial pilot terms are staged, but real customer data and paid pilot execution still depend on readiness gates, including final no-secret production smoke, explicit owner approval before real customer data, and a prepared manual invoice or Stripe Payment Link process before collecting payment.",
    },
    pillars: [
      {
        body:
          "BizPilot helps prepare the work, but the owner decides what the customer receives.",
        points: [
          "No auto-send",
          "Owner reviews, edits, and sends",
          "Manual communication during the pilot",
        ],
        title: "You stay in control",
      },
      {
        body:
          "Quote requests stay honest until the owner has the facts needed to price the work.",
        points: [
          "No invented pricing",
          "No automatic booking confirmation",
          "Missing details are requested before quoting",
        ],
        title: "Quotes stay honest",
      },
      {
        body:
          "If an automated aid is unavailable, the owner still has a clear manual workflow.",
        points: [
          "Real-customer-data readiness gate",
          "Safe fallback when AI is unavailable",
          "Manual workflow remains available",
        ],
        title: "The workflow fails safely",
      },
    ],
    primaryCta: "Apply for founder pilot",
    privacyCta: "Read privacy",
    securityCta: "Read security",
    title: "Built for owner control and trust.",
  },
};

const frenchPublicSiteCopy: PublicSiteCopy = {
  authMeta: {
    checkEmail: {
      description:
        "Consultez votre courriel pour continuer la configuration de votre compte propriétaire BizPilot AI.",
      title: "Vérifiez votre courriel | BizPilot AI",
    },
    forgotPassword: {
      description:
        "Demandez un lien sécurisé pour réinitialiser le mot de passe de votre compte propriétaire BizPilot AI.",
      title: "Réinitialiser le mot de passe | BizPilot AI",
    },
    resetPassword: {
      description:
        "Choisissez un nouveau mot de passe pour votre compte propriétaire BizPilot AI.",
      title: "Réinitialiser le mot de passe | BizPilot AI",
    },
    signIn: {
      description:
        "Connectez-vous à un espace propriétaire BizPilot AI approuvé pour réviser les demandes de soumission et les brouillons.",
      title: "Connexion | BizPilot AI",
    },
    signUp: {
      description:
        "Créez un espace propriétaire BizPilot AI après l'approbation du projet pilote.",
      title: "Créer l'accès propriétaire | BizPilot AI",
    },
    signUpPilotCta: "Postulez d'abord sur la page du projet pilote.",
    signUpPilotPrompt: "Vous voulez rejoindre le projet pilote?",
  },
  cleaning: {
    badge: "Entreprises de nettoyage d'abord",
    beforeAfter: {
      after:
        "Merci pour votre message. Pourriez-vous confirmer la superficie approximative, si les électroménagers doivent être nettoyés à l'intérieur et les notes d'accès afin que je prépare une soumission responsable?",
      afterLabel: "Brouillon de réponse révisé par le propriétaire",
      before:
        "\"Combien pour un nettoyage avant déménagement d'ici vendredi?\"",
      beforeLabel: "Avant",
      body:
        "BizPilot transforme un message vague de nettoyage en détails utiles avant la réponse du propriétaire.",
      title: "D'une demande vague à une prochaine réponse claire.",
    },
    body:
      "BizPilot aide les propriétaires d'entreprises de nettoyage à recueillir les demandes de soumission, à organiser les prospects et à préparer rapidement des réponses révisées par le propriétaire.",
    ctaPrimary: "Participer au projet pilote nettoyage",
    ctaSecondary: "Voir la démo",
    example: {
      fields: [
        ["Service", "Nettoyage avant ou après déménagement"],
        ["Propriété", "Appartement de 2 chambres"],
        ["Moment", "Avant vendredi"],
        ["Manquant", "superficie, électroménagers, notes d'accès"],
        ["Statut", "Réponse requise"],
      ],
      request:
        '"Bonjour, pouvez-vous faire un nettoyage avant vendredi? C’est un appartement de 2 chambres."',
      requestLabel: "Exemple de demande",
      title: "Flux de demande de soumission",
      workflow:
        "Le client demande une soumission -> Le propriétaire voit les détails du service -> L'IA résume -> L'IA prépare un brouillon -> Le propriétaire copie et envoie manuellement",
    },
    families: [
      {
        body:
          "Les demandes résidentielles courantes exigent tout de même le bon contexte avant une soumission responsable.",
        details: [
          "Type de service",
          "Chambres, salles de bain ou superficie",
          "Pièces prioritaires et état du logement",
          "Animaux, fournitures et notes d'accès",
        ],
        detailsTitle: "Détails que BizPilot garde clairs",
        request:
          "\"Pouvez-vous faire un grand ménage pour une maison de 3 chambres la semaine prochaine?\"",
        requestLabel: "Exemple de demande",
        services: [
          {
            body: "Demandes de nettoyage résidentiel récurrent ou ponctuel.",
            id: "residential",
            title: "Nettoyage résidentiel",
          },
          {
            body: "Portée, état de la propriété et zones prioritaires.",
            id: "deep-cleaning",
            title: "Nettoyage en profondeur",
          },
        ],
        title: "Maisons",
      },
      {
        body:
          "Les travaux liés aux dates limites demandent le moment, l'accès et les détails de remise en état au même endroit.",
        details: [
          "Date de déménagement ou heure de départ",
          "Électroménagers et armoires à l'intérieur",
          "Instructions d'entrée",
          "Fournitures ou notes de literie manquantes",
        ],
        detailsTitle: "Détails que BizPilot garde clairs",
        request:
          "\"Le locataire quitte vendredi matin. Pouvez-vous nettoyer avant l'arrivée du prochain invité?\"",
        requestLabel: "Exemple de demande",
        services: [
          {
            body: "Délais, détails des électroménagers et notes d'accès.",
            id: "move-in-out",
            title: "Nettoyage avant ou après déménagement",
          },
          {
            body: "Heure de départ, literie, fournitures et détails d'entrée.",
            id: "airbnb",
            title: "Remise en état entre séjours Airbnb",
          },
        ],
        title: "Déménagements et turnovers",
      },
      {
        body:
          "Les demandes commerciales et spécialisées sont plus simples à trier quand la portée et l'accès au site sont visibles.",
        details: [
          "Superficie et fréquence",
          "Horaire préféré",
          "Accès au site et contact",
          "Poussière, débris ou portée spécialisée",
        ],
        detailsTitle: "Détails que BizPilot garde clairs",
        request:
          "\"Nous avons besoin d'un nettoyage de bureaux deux fois par semaine et d'un nettoyage après rénovation le mois prochain.\"",
        requestLabel: "Exemple de demande",
        services: [
          {
            body: "Superficie, fréquence, horaire et accès au site.",
            id: "office",
            title: "Nettoyage de bureaux",
          },
          {
            body: "Demandes de petit commercial avec suivi manuel clair.",
            id: "small-commercial",
            title: "Petit nettoyage commercial",
          },
          {
            body: "Taille du site, poussière/débris et échéance.",
            id: "post-construction",
            title: "Nettoyage après travaux",
          },
        ],
        title: "Commercial et spécialisé",
      },
    ],
    intro:
      "Les propriétaires d'entreprises de nettoyage sont souvent loin d'un bureau. Ils sont sur les chantiers, sur la route, avec leur équipe ou avec des clients. Les demandes de soumission arrivent au mauvais moment, et une réponse lente peut coûter des mandats.",
    meta: {
      description:
        "BizPilot AI aide les propriétaires d'entreprises de nettoyage à recueillir les demandes de soumission, organiser les prospects et préparer des réponses révisées par le propriétaire.",
      title: "Logiciel de récupération de prospects pour le nettoyage | BizPilot AI",
    },
    services: [
      "Nettoyage résidentiel",
      "Nettoyage en profondeur",
      "Nettoyage avant ou après déménagement",
      "Nettoyage de bureaux",
      "Remise en état entre séjours Airbnb",
      "Nettoyage après travaux",
      "Petit nettoyage commercial",
    ],
    servicesTitle: "Services soutenus pendant le projet pilote",
    title: "Récupération de prospects pour les entreprises de nettoyage.",
  },
  contentStudio: {
    badge: "Feuille de route",
    body:
      "Cette page présente seulement une direction future. BizPilot pourrait plus tard aider les entreprises locales à créer du contenu marketing révisé par le propriétaire, après la validation du flux de récupération des demandes de nettoyage.",
    cards: [
      {
        body: "Futurs brouillons pour expliquer les services clairement.",
        title: "Publications de services",
      },
      {
        body: "Idées locales à réviser avant toute publication.",
        title: "Mises à jour Google Business",
      },
      {
        body: "Plans promotionnels qui restent soumis à l'approbation.",
        title: "Promotions saisonnières",
      },
      {
        body: "Réponses brouillons que le propriétaire révise d'abord.",
        title: "Réponses aux avis",
      },
      {
        body: "Concepts courts pour expliquer un service ou une offre.",
        title: "Scripts vidéo courts",
      },
      {
        body: "Briefs simples pour de futurs visuels révisés par l'équipe.",
        title: "Briefs créatifs visuels",
      },
    ],
    cta: "Participer au projet pilote",
    footer:
      "Comme les brouillons de réponse, les futurs brouillons de contenu devraient être révisés par le propriétaire avant publication. Aucune publication automatique n'est promise.",
    meta: {
      description:
        "Feuille de route du futur Content Studio BizPilot AI pour du contenu marketing local révisé par le propriétaire, après validation de la récupération de prospects.",
      title: "Feuille de route Content Studio | BizPilot AI",
    },
    title: "Futur Content Studio pour la croissance locale.",
  },
  demo: {
    badge: "Démo de 60 secondes",
    body:
      "Suivez une demande réaliste de nettoyage avant ou après déménagement, du message client à la réponse révisée par le propriétaire.",
    chapters: [
      {
        body:
          "Une demande vague arrive pendant que le propriétaire est occupé. Des détails manquent, le prix serait risqué et le message est facile à oublier.",
        eyebrow: "1",
        panelItems: [
          "\"Bonjour, combien pour un nettoyage avant déménagement d'ici vendredi?\"",
        ],
        panelTitle: "Message client",
        title: "La demande arrive.",
      },
      {
        body:
          "BizPilot transforme le message en contexte propre au nettoyage et indique ce qui manque avant une soumission responsable.",
        eyebrow: "2",
        panelItems: [
          "Service : nettoyage avant ou après déménagement",
          "Moment : avant vendredi",
          "Statut : réponse requise",
          "Manquant : superficie, électroménagers, notes d'accès",
          "Consentement : réponse révisée par le propriétaire attendue",
        ],
        panelTitle: "Prospect organisé",
        title: "BizPilot organise la demande et souligne les détails manquants.",
      },
      {
        body:
          "L'IA prépare un court résumé pour le propriétaire et un premier brouillon utile. Le brouillon demande les détails manquants au lieu d'inventer un prix.",
        eyebrow: "3",
        panelItems: [
          "Sarah a besoin d'un nettoyage avant vendredi, mais le prix serait risqué sans la superficie, les détails sur les électroménagers et les notes d'accès.",
          "Bonjour Sarah, merci pour votre message. Pourriez-vous confirmer la superficie approximative, si les électroménagers doivent être nettoyés à l'intérieur, et les notes d'accès afin que je prépare une soumission exacte?",
        ],
        panelTitle: "Résumé IA et brouillon",
        title: "L'IA prépare un brouillon révisé par le propriétaire.",
      },
      {
        body:
          "Le propriétaire révise, ajuste au besoin, copie la réponse et l'envoie manuellement depuis son propre canal. Les garde-fous restent visibles.",
        eyebrow: "4",
        panelItems: [
          "Réviser",
          "Modifier au besoin",
          "Copier la réponse",
          "Envoyer manuellement",
          "Aucun envoi automatique",
          "Aucun prix inventé",
          "Aucune confirmation de réservation",
          "Aucune automatisation SMS ou WhatsApp",
          "Aucune promesse de CRM complet",
        ],
        panelTitle: "Envoi manuel et garde-fous",
        title: "Envoi manuel + garde-fous.",
      },
    ],
    cta: {
      body:
        "BizPilot commence avec les entreprises de nettoyage afin que le produit soit façonné autour de vraies demandes de soumission et de commentaires de propriétaires.",
      button: "Participer au projet pilote",
      title:
        "Essayez le flux du projet pilote avec de vraies demandes de nettoyage.",
    },
    meta: {
      description:
        "Voyez comment BizPilot AI capte une demande de soumission de nettoyage, organise le prospect, signale les détails manquants et prépare une réponse révisée par le propriétaire.",
      title: "Démo du flux de soumission de nettoyage | BizPilot AI",
    },
    title: "Voyez comment BizPilot traite une demande de soumission de nettoyage.",
  },
  features: {
    badge: "Fonctions",
    badges: [
      "Aucun envoi automatique",
      "Aucun prix inventé",
      "Le propriétaire décide",
      "Copier/envoyer manuellement",
      "Projet pilote axé sur le nettoyage",
    ],
    cards: [
      {
        body:
          "Offrez aux clients un endroit simple pour demander une soumission.",
        title: "Capter chaque demande de soumission dans un flux clair.",
      },
      {
        body:
          "Voyez les nouvelles demandes de nettoyage dans un espace propriétaire plutôt que dans des messages dispersés.",
        title: "Savoir qui attend une réponse maintenant.",
      },
      {
        body:
          "Révisez le service, le moment, les détails de propriété, les notes et le canal de contact avant de répondre.",
        title: "Voir le contexte du travail avant de répondre.",
      },
      {
        body:
          "Utilisez une première réponse pratique qui demande les détails manquants au lieu de deviner.",
        title: "Commencer avec un brouillon révisé par le propriétaire.",
      },
      {
        body:
          "Gardez la communication finale entre les mains du propriétaire tout en avançant plus vite.",
        title: "Copier et envoyer depuis le canal que vous utilisez déjà.",
      },
      {
        body:
          "Suivez si la prochaine étape est répondre, demander des détails, faire un suivi ou marquer comme révisé.",
        title: "Garder la prochaine action manuelle claire.",
      },
    ],
    meta: {
      description:
        "Fonctions BizPilot AI pour les entreprises de nettoyage : lien de soumission, boîte de prospects, détails, brouillons révisés par le propriétaire et envoi manuel.",
      title: "Fonctions de récupération de prospects | BizPilot AI",
    },
    primaryCta: "Participer au projet pilote",
    proof: {
      badge: "Preuve produit",
      body:
        "Une demande réaliste de nettoyage passe par un chemin simple, manuel d'abord.",
      items: [
        "Le client envoie une demande de soumission",
        "BizPilot organise le service, le moment et les détails manquants",
        "L'IA prépare un brouillon révisé par le propriétaire",
        "Le propriétaire copie, ajuste au besoin et envoie manuellement",
      ],
      title: "Du lien de soumission à la réponse révisée par le propriétaire.",
    },
    roadmap: {
      badge: "Feuille de route",
      body:
        "Brouillons de suivi, rapports, Content Studio, intégrations et modèles pour d'autres secteurs sont prévus après validation.",
    },
    secondaryCta: "Lire l'approche de confiance",
    title:
      "Un système simple pour capter, organiser et répondre plus vite aux prospects de nettoyage.",
  },
  home: {
    ai: {
      body:
        "BizPilot n'envoie pas automatiquement de messages aux clients pendant le premier projet pilote. L'IA aide à préparer les réponses, mais chaque message est révisé, ajusté et envoyé manuellement par le propriétaire.",
      canHelp: [
        "Résumer les demandes de soumission",
        "Préparer des réponses amicales",
        "Suggérer des questions de suivi",
        "Améliorer le ton",
        "Créer des brouillons de réponse en français ou en anglais",
      ],
      canHelpTitle: "L'IA peut aider à",
      eyebrow: "IA d'abord manuelle",
      title: "L'IA prépare. Vous décidez.",
      willNot: [
        "Envoyer des messages automatiquement",
        "Inventer des prix",
        "Promettre des disponibilités",
        "Confirmer des réservations",
        "Remplacer le jugement du propriétaire",
      ],
      willNotTitle: "L'IA ne va pas",
    },
    faq: {
      eyebrow: "FAQ",
      items: [
        {
          answer:
            "Non. BizPilot commence comme un flux ciblé de récupération des demandes de soumission de nettoyage, pas comme un CRM complet.",
          question: "BizPilot est-il un CRM complet?",
        },
        {
          answer:
            "Non. Pendant le premier projet pilote, BizPilot prépare des brouillons et le propriétaire révise, modifie, copie et envoie manuellement.",
          question: "BizPilot envoie-t-il des messages automatiquement?",
        },
        {
          answer:
            "Non. BizPilot ne doit pas inventer de prix. Il peut aider à demander les détails manquants avant de préparer une soumission.",
          question: "L'IA peut-elle créer des prix pour moi?",
        },
        {
          answer:
            "BizPilot est d'abord conçu pour les entreprises de nettoyage : résidentiel, nettoyage en profondeur, déménagement, bureaux, Airbnb et demandes connexes.",
          question: "Pour qui BizPilot est-il conçu en premier?",
        },
        {
          answer:
            "La demande devient un prospect organisé avec le service, le moment, les détails de propriété, le statut et, quand il y a assez de contexte, un brouillon de réponse révisé par le propriétaire.",
          question: "Que se passe-t-il quand un client envoie une demande?",
        },
        {
          answer:
            "Peut-être plus tard. Le projet pilote reste axé sur le nettoyage afin de valider le flux avant d'élargir.",
          question: "BizPilot soutiendra-t-il d'autres secteurs?",
        },
        {
          answer:
            "Content Studio est une direction future pour des publications, mises à jour, campagnes, descriptions de service et briefs visuels révisés par le propriétaire. Ce n'est pas une promesse du premier projet pilote.",
          question: "Qu'est-ce que le futur Content Studio?",
        },
      ],
      title: "Réponses claires pour le projet pilote.",
    },
    finalCta: {
      body:
        "Nous commençons avec un petit groupe d'entreprises de nettoyage afin de tester le flux, d'améliorer le produit et de bâtir autour de vrais commentaires de propriétaires.",
      cta: "Postuler au projet pilote",
      note: "Projet pilote limité. Onboarding manuel. Aucun envoi automatique.",
      title: "Participez au projet pilote pour entreprises de nettoyage.",
    },
    hero: {
      badge: "Conçu d'abord pour les entreprises de nettoyage",
      body:
        "BizPilot aide les entreprises de nettoyage à capter les demandes, organiser les prospects et préparer des réponses révisées par le propriétaire, sans envoi automatique.",
      primaryCta: "Rejoindre le pilote",
      secondaryCta: "Voir la démo",
      title:
        "Répondez plus vite aux demandes de nettoyage.",
      trustBadges: [
        "Aucun envoi auto",
        "Brouillons IA révisés",
        "Copie/envoi manuel",
      ],
    },
    meta: {
      description:
        "BizPilot AI aide les entreprises de nettoyage à recueillir les demandes de soumission, organiser les demandes clients et préparer des réponses révisées par le propriétaire, sans envoi automatique.",
      title: "BizPilot AI | Récupération de prospects pour le nettoyage",
    },
    mockup: {
      copyButton: "Copier la réponse",
      draftBody:
        "Bonjour Maria, merci pour votre message. Pourriez-vous confirmer le secteur et si les électroménagers doivent être nettoyés afin que je prépare une soumission exacte?",
      draftTag: "L'IA prépare. Vous envoyez.",
      draftTitle: "Brouillon IA",
      fields: [
        ["Service", "Nettoyage de départ"],
        ["Propriété", "2 chambres / 1 salle de bain"],
        ["Moment", "Samedi matin"],
        ["Statut", "À répondre"],
      ],
      name: "Maria L.",
      status: "À répondre",
      title: "Nouvelle demande de soumission",
    },
    preview: {
      badges: [
        "Aucun envoi automatique",
        "Aucun prix inventé",
        "Envoi manuel",
      ],
      body:
        "Suivez une demande réaliste de nettoyage avant déménagement, du message désordonné à la réponse révisée par le propriétaire. BizPilot organise le travail; le propriétaire garde le contrôle.",
      copyButton: "Copier la réponse",
      cta: "Voir la démo complète",
      steps: [
        {
          quote:
            "\"Bonjour, combien pour un nettoyage avant déménagement d'ici vendredi?\"",
          title: "Demande vague",
        },
        {
          fields: [
            ["Service", "Nettoyage de départ"],
            ["Moment", "Avant vendredi"],
            ["Manquant", "superficie, électroménagers, notes d'accès"],
            ["Statut", "À répondre"],
          ],
          title: "BizPilot l'organise",
        },
        {
          body:
            "Bonjour Sarah, merci pour votre message. Pourriez-vous confirmer la superficie approximative, si les électroménagers doivent être nettoyés à l'intérieur, et les notes d'accès afin que je prépare une soumission exacte?",
          title: "Brouillon révisé par le propriétaire",
        },
        {
          body:
            "Le propriétaire révise le brouillon, l'ajuste au besoin, le copie et l'envoie manuellement depuis le canal qu'il utilise déjà.",
          title: "Le propriétaire copie et envoie manuellement",
        },
      ],
      title: "Voyez le flux de récupération en 60 secondes.",
    },
    problem: {
      body:
        "Les propriétaires reçoivent des demandes pendant qu'ils travaillent, conduisent, gèrent leur équipe ou répondent à des clients. Quand les messages se perdent ou que les réponses tardent, les clients passent à autre chose.",
      cards: [
        {
          body:
            "Les demandes arrivent de différents canaux et sont faciles à manquer.",
          title: "Les messages se perdent",
        },
        {
          body:
            "Les clients contactent souvent plus d'une entreprise de nettoyage.",
          title: "Les réponses prennent trop de temps",
        },
        {
          body:
            "Les propriétaires perdent du temps à écrire la même première réponse.",
          title: "Aucune réponse prête",
        },
      ],
      eyebrow: "Problème",
      title: "Votre prochain client attend peut-être déjà.",
    },
    roadmap: {
      badge: "Feuille de route",
      body:
        "BizPilot est conçu pour aider plus tard les entreprises locales à créer des publications révisées par le propriétaire, des mises à jour Google Business, des campagnes de suivi, des descriptions de service, des promotions saisonnières et des briefs visuels.",
      cards: [
        "Légendes sociales",
        "Publications Google Business",
        "Idées de campagnes saisonnières",
        "Réponses aux avis",
        "Prompts d'images",
        "Calendrier de contenu",
      ],
      title:
        "Plus que des réponses aux prospects - du contenu de croissance futur.",
    },
    solution: {
      cards: [
        {
          body: "Partagez un lien simple de soumission avec vos clients.",
          title: "Capter les demandes",
        },
        {
          body:
            "Voyez qui attend une réponse et quel service est demandé.",
          title: "Réviser les prospects organisés",
        },
        {
          body:
            "Utilisez un brouillon professionnel, modifiez-le et envoyez-le manuellement.",
          title: "Copier les brouillons IA",
        },
      ],
      eyebrow: "Solution",
      title:
        "Un système simple de récupération de prospects pour entreprises de nettoyage.",
    },
    useCases: {
      body:
        "BizPilot garde le service, le moment, les détails manquants et la prochaine réponse clairs pour les demandes courantes de nettoyage résidentiel et commercial.",
      cards: [
        {
          body: "Demandes de nettoyage résidentiel récurrent ou ponctuel.",
          href: "/industries/cleaning#residential",
          title: "Nettoyage résidentiel",
        },
        {
          body: "Portée, état de la propriété et zones prioritaires.",
          href: "/industries/cleaning#deep-cleaning",
          title: "Nettoyage en profondeur",
        },
        {
          body: "Délais, détails des électroménagers et notes d'accès.",
          href: "/industries/cleaning#move-in-out",
          title: "Nettoyage avant ou après déménagement",
        },
        {
          body: "Superficie, fréquence, horaire et accès au site.",
          href: "/industries/cleaning#office",
          title: "Nettoyage de bureaux",
        },
        {
          body: "Heure de départ, literie, fournitures et détails d'entrée.",
          href: "/industries/cleaning#airbnb",
          title: "Remise en état entre séjours Airbnb",
        },
        {
          body: "Taille du site, poussière/débris et échéance.",
          href: "/industries/cleaning#post-construction",
          title: "Nettoyage après travaux",
        },
      ],
      title: "Conçu pour les travaux de nettoyage que vous soumissionnez chaque semaine.",
    },
    workflow: {
      eyebrow: "Fonctionnement",
      stepLabel: "Étape",
      steps: [
        "Partagez votre lien de soumission BizPilot",
        "Le client envoie une demande",
        "Le prospect apparaît dans votre tableau de bord",
        "BizPilot prépare une réponse",
        "Vous révisez et envoyez manuellement",
      ],
      title: "Cinq étapes, aucune automatisation cachée.",
    },
  },
  pilot: {
    badge: "Projet pilote fondateur",
    body:
      "Joignez-vous à un petit projet pilote guidé par le fondateur, conçu pour aider les entreprises de nettoyage à capter les demandes de soumission, répondre plus vite et garder le contrôle.",
    conversion: {
      body:
        "Copiez maintenant un modèle de demande de 60 secondes. Rien n'est soumis ni stocké sur cette page.",
      copiedStatus: "Modèle de demande pilote copié.",
      fallbackBody:
        "La permission du presse-papiers a été bloquée. Utilisez le modèle de secours ci-dessous.",
      previewQuestions: [
        "Nom de l'entreprise",
        "Courriel professionnel",
        "Ville / zone de service",
        "Volume hebdomadaire de demandes",
        "Plus grand problème de gestion des prospects",
        "Langue préférée",
      ],
      previewTitle: "Aperçu des six questions de candidature",
      primaryAction: "Copier le modèle de demande pilote",
      secondaryAction: "Voir la tarification pilote",
      selectedStatus: "Modèle de demande pilote sélectionné.",
      selectAction: "Sélectionner le modèle",
      template:
        "Objet : demande pour le projet pilote BizPilot\nNom de l'entreprise :\nCourriel professionnel :\nVille / zone de service :\nServices de nettoyage :\nDemandes de soumission approximatives par semaine :\nPlus grand problème de gestion des prospects :\nLangue préférée : anglais / français / les deux",
      templateLabel: "Modèle de demande pilote",
      title: "Les demandes pour le projet pilote sont en préparation.",
    },
    fitItems: [
      "Entreprises de nettoyage exploitées par le propriétaire",
      "Petites équipes de nettoyage",
      "Entreprises qui reçoivent déjà des demandes de soumission en ligne",
      "Propriétaires qui veulent de la vitesse sans complexité de CRM complet",
    ],
    fitTitle: "Bon profil",
    getItems: [
      "Lien de demande de soumission",
      "Boîte de prospects organisée",
      "Résumé assisté par IA et brouillon de réponse",
      "Flux copier/envoyer manuellement",
      "Configuration guidée par le fondateur",
      "Améliorations basées sur les commentaires",
    ],
    getTitle: "Ce que vous obtenez",
    meta: {
      description:
        "Postulez au projet pilote BizPilot AI pour les entreprises de nettoyage qui veulent répondre plus vite aux soumissions sans complexité CRM.",
      title: "Projet pilote fondateur pour le nettoyage | BizPilot AI",
    },
    nextSteps: [
      "Envoyez une courte demande pilote",
      "Le fondateur révise le flux",
      "Les entreprises sélectionnées reçoivent une configuration et un flux exemple",
    ],
    nextStepsTitle: "Ce qui se passe ensuite",
    title: "Aidez à façonner BizPilot autour du vrai travail de nettoyage.",
  },
  pricing: {
    afterApply: {
      steps: [
        "Le fondateur révise le fit et le flux actuel de soumission",
        "La configuration pilote reste manuelle et soumise à approbation",
        "Tout paiement utilise seulement une facture ou un Stripe Payment Link",
      ],
      title: "Ce qui se passe après la demande",
    },
    badge: "Conditions pilotes approuvées",
    body:
      "BizPilot commence avec des cohortes contrôlées d'entreprises de nettoyage. La configuration et la facturation restent guidées par le fondateur, manuelles et soumises à approbation.",
    cards: [
      {
        bullets: [
          "Configuration guidée par le fondateur",
          "Lien de demande de soumission",
          "Boîte de prospects",
          "Résumé IA et aide au brouillon de réponse",
          "Flux copier/envoyer manuellement",
          "Engagement de commentaires à 30 et 60 jours",
          "Aucun envoi automatique",
        ],
        cohort: "Entreprises 1 à 5",
        cta: "Postuler au projet pilote",
        highlight: "Engagement de commentaires requis",
        priceLines: ["$0 setup"],
        title: "Pilote fondateur",
      },
      {
        bullets: [
          "Page publique de soumission",
          "Tableau de bord de récupération",
          "Brouillons IA révisés par le propriétaire",
          "Suivi manuel visible",
          "Guidage de configuration par le fondateur",
          "Facture manuelle ou Stripe Payment Link seulement",
        ],
        cohort: "Entreprises 6 à 20",
        cta: "Postuler au pilote",
        highlight: "Facturation après approbation",
        priceLines: ["$149 setup", "$49/month"],
        title: "Pilote Starter",
      },
      {
        bullets: [
          "Tout dans Starter",
          "Page de soumission mieux personnalisée",
          "Ajustement du style de réponse et des FAQ",
          "Ajustement des brouillons de suivi",
          "Meilleure organisation des prospects",
          "Onboarding prioritaire",
          "Aperçus d'utilisation simples",
        ],
        cohort: "Après 20 clients",
        cta: "Postuler au pilote",
        highlight: "Facturation après approbation",
        priceLines: ["$199 setup", "$79/month"],
        title: "Pilote Pro",
      },
    ],
    guardrail: {
      body:
        "La collecte de paiement commence seulement après l'approbation finale et la préparation d'une facture manuelle ou d'un processus Stripe Payment Link. BizPilot n'inclut pas la facturation automatisée dans l'app, la réservation, la facturation comptable, l'automatisation SMS/WhatsApp ni l'envoi automatique.",
      title: "Garde-fous de paiement et de produit",
    },
    meta: {
      description:
        "Tarification pilote approuvée pour les entreprises de nettoyage qui explorent BizPilot AI, avec configuration manuelle et garde-fous de paiement.",
      title: "Tarification du projet pilote fondateur | BizPilot AI",
    },
    title: "Tarifs pilotes simples pour le nettoyage.",
  },
  quoteShell: {
    guardrail:
      "Ce formulaire ne confirme ni réservation ni prix. Le propriétaire de l'entreprise révisera votre demande et vous répondra.",
    subtitle: "Dites-nous ce dont vous avez besoin et nous réviserons votre demande.",
    title: "Demander une soumission de nettoyage",
  },
  trust: {
    badge: "Flux axé sur la confiance",
    body:
      "BizPilot est d'abord manuel. L'IA aide avec les brouillons, mais le propriétaire révise et envoie chaque message client.",
    items: [
      {
        body:
          "BizPilot n'envoie pas automatiquement de messages aux clients pendant le premier projet pilote.",
        title: "Aucun envoi automatique",
      },
      {
        body:
          "Les brouillons IA sont révisés, modifiés et envoyés manuellement par le propriétaire.",
        title: "IA révisée par le propriétaire",
      },
      {
        body:
          "L'assistant doit demander les détails manquants au lieu d'inventer des prix.",
        title: "Aucun faux prix",
      },
      {
        body:
          "Une demande de soumission ne devient jamais une réservation confirmée par elle-même.",
        title: "Aucune confirmation de réservation",
      },
      {
        body:
          "Les vraies données client restent bloquées jusqu'à l'approbation finale de préparation.",
        title: "Porte d'approbation des vraies données client",
      },
      {
        body:
          "Si l'IA est indisponible, le propriétaire garde un flux manuel clair.",
        title: "Solution manuelle si l'IA est indisponible",
      },
      {
        body:
          "Le premier projet pilote est bâti autour du contrôle copier/envoyer par le propriétaire.",
        title: "Communication manuelle seulement au premier pilote",
      },
    ],
    meta: {
      description:
        "BizPilot AI est d'abord manuel : l'IA prépare, les propriétaires révisent et aucun message client n'est envoyé automatiquement pendant le premier projet pilote.",
      title: "IA contrôlée par le propriétaire et confiance | BizPilot AI",
    },
    notes: {
      badge: "Notes de préparation technique",
      body:
        "Les conditions commerciales du projet pilote BizPilot sont par étapes, mais les vraies données client et l'exécution payante dépendent encore de portes de préparation : smoke de production sans secret, approbation explicite du propriétaire avant toute vraie donnée client, et facture manuelle ou Stripe Payment Link préparé avant tout paiement.",
    },
    pillars: [
      {
        body:
          "BizPilot aide à préparer le travail, mais le propriétaire décide ce que le client reçoit.",
        points: [
          "Aucun envoi automatique",
          "Le propriétaire révise, modifie et envoie",
          "Communication manuelle pendant le projet pilote",
        ],
        title: "Vous gardez le contrôle",
      },
      {
        body:
          "Les demandes de soumission restent honnêtes jusqu'à ce que le propriétaire ait les faits nécessaires pour chiffrer le travail.",
        points: [
          "Aucun prix inventé",
          "Aucune confirmation automatique de réservation",
          "Les détails manquants sont demandés avant la soumission",
        ],
        title: "Les soumissions restent honnêtes",
      },
      {
        body:
          "Si une aide automatisée est indisponible, le propriétaire garde un flux manuel clair.",
        points: [
          "Porte d'approbation des vraies données client",
          "Solution de repli si l'IA est indisponible",
          "Le flux manuel reste disponible",
        ],
        title: "Le flux échoue prudemment",
      },
    ],
    primaryCta: "Postuler au projet pilote",
    privacyCta: "Lire la confidentialité",
    securityCta: "Lire la sécurité",
    title: "Bâti pour le contrôle du propriétaire et la confiance.",
  },
};

const copyByLanguage: Record<SupportedLanguage, PublicSiteCopy> = {
  en: englishPublicSiteCopy,
  "fr-CA": frenchPublicSiteCopy,
};

export function getPublicSiteCopy(language: unknown): PublicSiteCopy {
  return copyByLanguage[readSupportedLanguage(language)];
}
