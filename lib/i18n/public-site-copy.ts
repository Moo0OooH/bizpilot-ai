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
 * Last Updated: 2026-06-26
 * Change Log:
 * - 2026-06-19: Added final public EN/fr-CA route copy for Phase 03 localization.
 * - 2026-06-19: Added Phase 04 homepage demo state and cleaning-use-case card copy.
 * - 2026-06-20: Shortened fr-CA homepage hero copy for first-fold parity.
 * - 2026-06-21: Added localized quote shell noindex metadata.
 * - 2026-06-21: Split the full public FAQ into a dedicated localized route and shortened the homepage FAQ.
 * - 2026-06-21: Simplified Cleaning page service detail copy and removed the extra commercial service from the public surface.
 * - 2026-06-21: Polished final English and Canadian French public copy.
 * - 2026-06-25: Aligned homepage hero subcopy with the owner-review wording.
 * - 2026-06-25: Replaced Cleaning family groups with six compact service detail entries.
 * - 2026-06-25: Shortened the founder pricing highlight labels for 320px visual acceptance.
 * - 2026-06-25: Finalized bilingual public wording around owner review, quote requests, and natural fr-CA phrasing.
 * - 2026-06-26: Reworked homepage workflow preview copy into one compact owner-review panel.
 * - 2026-06-26: Shortened homepage hero badge/body copy for premium mobile fit.
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

type FaqItem = Readonly<{
  answer: string;
  question: string;
}>;

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
    cta: string;
    eyebrow: string;
    items: ReadonlyArray<FaqItem>;
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
    bullets: readonly string[];
    note: string;
    primaryCta: string;
    secondaryCta: string;
    title: string;
  }>;
  meta: MetaCopy;
  mockup: Readonly<{
    boardLabel: string;
    boardSafety: string;
    bizPilotActions: readonly string[];
    bizPilotBody: string;
    bizPilotTitle: string;
    chaosBadge: string;
    chaosHint: string;
    chaosSubtitle: string;
    chaosTitle: string;
    clarityBadge: string;
    claritySubtitle: string;
    clarityTitle: string;
    copyButton: string;
    draftBody: string;
    draftTitle: string;
    leads: ReadonlyArray<TextPair>;
    messages: readonly string[];
    sources: readonly string[];
  }>;
  preview: Readonly<{
    badges: readonly string[];
    body: string;
    copyButton: string;
    cta: string;
    draft: Readonly<{
      body: string;
      title: string;
    }>;
    organizedLead: Readonly<{
      fields: ReadonlyArray<LabelValue>;
      title: string;
    }>;
    request: Readonly<{
      quote: string;
      title: string;
    }>;
    steps: readonly string[];
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

type FaqCopy = Readonly<{
  badge: string;
  body: string;
  meta: MetaCopy;
  sections: ReadonlyArray<
    Readonly<{
      items: ReadonlyArray<FaqItem>;
      title: string;
    }>
  >;
  title: string;
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
  detailHelp: Readonly<{
    body: string;
    title: string;
  }>;
  detailSection: Readonly<{
    body: string;
    clearTitle: string;
    title: string;
  }>;
  example: Readonly<{
    fields: ReadonlyArray<LabelValue>;
    request: string;
    requestLabel: string;
    title: string;
    workflow: string;
  }>;
  finalCta: Readonly<{
    body: string;
    title: string;
  }>;
  serviceActionLabel: string;
  serviceCards: ReadonlyArray<
    Readonly<{
      body: string;
      clearDetails: readonly string[];
      id: string;
      missingDetails: readonly string[];
      request: string;
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
  meta: MetaCopy;
  subtitle: string;
  title: string;
}>;

export type PublicSiteCopy = Readonly<{
  authMeta: AuthMetaCopy;
  cleaning: CleaningCopy;
  contentStudio: ContentStudioCopy;
  demo: DemoCopy;
  faq: FaqCopy;
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
  "faq",
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
        "Sign in to an approved BizPilot AI workspace to manage cleaning quote requests and reply drafts.",
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
      afterLabel: "Reply draft",
      before: '"How much for a move-out clean before Friday?"',
      beforeLabel: "Before",
      body:
        "BizPilot turns a vague cleaning message into the missing details an owner needs before replying.",
      title: "From vague request to clear next reply.",
    },
    body:
      "BizPilot helps cleaning business owners collect quote requests, organize leads, and prepare replies for owner review before sending.",
    ctaPrimary: "Join the cleaning founder pilot",
    ctaSecondary: "See demo",
    detailHelp: {
      body:
        "When a request is vague, BizPilot helps prepare the right follow-up question instead of guessing price, timing, or booking details.",
      title: "Missing details BizPilot can help ask for",
    },
    detailSection: {
      body:
        "One shared detail panel keeps the example request, quote details, and missing follow-up questions clear without repeating service groups.",
      clearTitle: "Details BizPilot keeps clear",
      title: "Choose the cleaning request type.",
    },
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
      title: "Cleaning quote request workflow",
      workflow:
        "Customer requests a quote -> You see service details -> AI summarizes -> BizPilot prepares a reply draft -> You copy and send manually",
    },
    finalCta: {
      body:
        "Bring the cleaning quote flow you already use. BizPilot stays manual-first while the pilot checks what should be captured, organized, and drafted.",
      title: "Help shape the cleaning pilot around real quote requests.",
    },
    serviceActionLabel: "View details",
    serviceCards: [
      {
        body: "Recurring or one-time home-cleaning requests.",
        clearDetails: [
          "Service frequency",
          "Bedrooms, bathrooms, or square footage",
          "Priority rooms",
          "Pets, supplies, and access notes",
        ],
        id: "residential",
        missingDetails: [
          "Preferred first date",
          "Current condition",
          "Special surfaces or allergies",
        ],
        request:
          '"Can you quote weekly cleaning for a 3-bedroom house in Boucherville?"',
        title: "Residential cleaning",
      },
      {
        body: "Scope, condition, and priority areas for heavier jobs.",
        clearDetails: [
          "Service type",
          "Property size",
          "Priority rooms and surfaces",
          "Current condition",
        ],
        id: "deep-cleaning",
        missingDetails: [
          "Preferred date window",
          "Appliance or cabinet interior needs",
          "Access notes",
        ],
        request:
          '"Can you do a deep clean for a 3-bedroom house next week?"',
        title: "Deep cleaning",
      },
      {
        body: "Deadline, appliance, cabinet, and entry details.",
        clearDetails: [
          "Move date",
          "Property type",
          "Appliance and cabinet scope",
          "Entry and access notes",
        ],
        id: "move-in-out",
        missingDetails: [
          "Square footage",
          "Parking or key instructions",
          "Any photos or priority areas",
        ],
        request:
          '"How much for a move-out clean before Friday?"',
        title: "Move-in / move-out",
      },
      {
        body: "Floor area, frequency, schedule, and site access.",
        clearDetails: [
          "Floor area",
          "Cleaning frequency",
          "Preferred schedule",
          "Site access and contact",
        ],
        id: "office",
        missingDetails: [
          "Washroom or kitchen count",
          "Supply expectations",
          "Alarm, key, or building rules",
        ],
        request:
          '"We need office cleaning twice a week after 6 pm. Can you quote it?"',
        title: "Office cleaning",
      },
      {
        body: "Checkout timing, linen, restock, and entry details.",
        clearDetails: [
          "Checkout and check-in window",
          "Bedrooms and bathrooms",
          "Linen and restock needs",
          "Entry instructions",
        ],
        id: "airbnb",
        missingDetails: [
          "Laundry location",
          "Supply inventory",
          "Damage or photo notes",
        ],
        request:
          '"Can you turn over our Airbnb between checkout at 11 and check-in at 4?"',
        title: "Airbnb turnover",
      },
      {
        body: "Dust, debris, site size, deadline, and specialist scope.",
        clearDetails: [
          "Site size",
          "Dust and debris scope",
          "Deadline",
          "Access and site contact",
        ],
        id: "post-construction",
        missingDetails: [
          "Debris removal responsibility",
          "Floor, glass, or fixture details",
          "Safety or PPE constraints",
        ],
        request:
          '"Can you clean after a small renovation before inspection next week?"',
        title: "Post-construction cleaning",
      },
    ],
    intro:
      "Cleaning owners are often away from a desk. They are on jobs, driving, managing staff, or answering existing customers. Quote requests arrive at the worst time, and slow replies can cost jobs.",
    meta: {
      description:
        "BizPilot AI helps cleaning business owners collect quote requests, organize leads, and prepare replies for owner review before sending.",
      title: "Cleaning Business Lead Recovery Software | BizPilot AI",
    },
    services: [
      "Residential cleaning",
      "Deep cleaning",
      "Move-in / move-out",
      "Office cleaning",
      "Airbnb turnover",
      "Post-construction cleaning",
    ],
    servicesTitle: "Services supported in the pilot",
    title: "Lead recovery software for cleaning businesses.",
  },
  contentStudio: {
    badge: "Roadmap",
    body:
      "This page is roadmap only. BizPilot may later help local businesses prepare marketing content for approval after the cleaning lead recovery workflow is validated.",
    cards: [
      {
        body: "Future drafts for explaining cleaning services clearly.",
        title: "Service post drafts",
      },
      {
        body: "Ideas for local profile updates that still need your approval.",
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
      "Like reply drafts, future content should be approved by the business before publishing. No automatic posting is promised.",
    meta: {
      description:
        "Future BizPilot AI Content Studio roadmap for local business marketing content drafts after lead recovery is validated.",
      title: "Content Studio Roadmap | BizPilot AI",
    },
    title: "Future Content Studio for local business growth.",
  },
  demo: {
    badge: "60-second workflow demo",
    body:
      "Follow one realistic move-out cleaning quote request from customer message to reply ready for approval.",
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
          "Consent: business approval expected",
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
        title: "AI prepares a reply for owner review.",
      },
      {
        body:
          "You review, edit if needed, copy the reply, and send it manually from your own channel. Guardrails stay visible.",
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
        title: "You review, copy, and send manually.",
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
        "See how BizPilot AI captures a cleaning quote request, organizes the lead, highlights missing details, and prepares a reply for owner review.",
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
        title: "Prepare a reply for owner review.",
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
        "BizPilot AI features for cleaning businesses: quote link, lead inbox, lead detail, AI-assisted reply drafts, and manual copy and send workflow.",
      title: "Cleaning Lead Recovery Features | BizPilot AI",
    },
    primaryCta: "Join founder pilot",
    proof: {
      badge: "Product proof",
      body:
        "A realistic cleaning request moves through one simple manual workflow.",
      items: [
        "Customer submits a quote request",
        "BizPilot organizes service, timing, and missing details",
        "AI prepares a reply for owner review",
        "You copy, edit if needed, and send manually",
      ],
      title: "From quote link to reply ready to send.",
    },
    roadmap: {
      badge: "Roadmap",
      body:
        "Follow-up drafts, reporting, Content Studio, integrations, and multi-industry templates are planned after validation.",
    },
    secondaryCta: "Read trust approach",
    title: "A simple system to manage cleaning quote requests faster.",
  },
  faq: {
    badge: "FAQ",
    body:
      "Clear answers about the first BizPilot pilot: what it does, what stays manual, how pricing works, and what is still roadmap.",
    meta: {
      description:
        "Read BizPilot AI FAQ answers about the cleaning business founder pilot, AI reply drafts, manual sending, pricing, privacy, and roadmap scope.",
      title: "FAQ for Cleaning Business Owners | BizPilot AI",
    },
    sections: [
      {
        items: [
          {
            answer:
              "No. BizPilot starts as a focused lead recovery workflow for cleaning quote requests, not a full CRM.",
            question: "Is BizPilot a full CRM?",
          },
          {
            answer:
              "BizPilot is built for cleaning businesses first: residential, deep cleaning, move-out, office, Airbnb turnover, post-construction, and related quote requests.",
            question: "Who is the pilot for first?",
          },
          {
            answer:
              "The request becomes an organized lead with service, timing, property details, status, and a reply draft you can approve when there is enough context.",
            question: "What happens when a customer submits a quote request?",
          },
          {
            answer:
              "Later, possibly. The founder pilot stays cleaning-first so the workflow can be proven before expanding.",
            question: "Will BizPilot support other industries?",
          },
        ],
        title: "Pilot basics",
      },
      {
        items: [
          {
            answer:
              "No. In the first pilot, BizPilot prepares reply drafts and you review, edit, copy, and send manually.",
            question: "Does BizPilot send messages automatically?",
          },
          {
            answer:
              "No. BizPilot should not invent prices. It can help ask for the missing details needed before you quote responsibly.",
            question: "Can AI create prices for me?",
          },
          {
            answer:
              "The business stays in control. BizPilot can organize the request and prepare a draft, but you decide what to send.",
            question: "Who sends the reply?",
          },
        ],
        title: "AI and business control",
      },
      {
        items: [
          {
            answer:
              "The published pilot pricing is shown on the pricing page. Billing only follows approval and manual onboarding; there is no self-serve checkout on the public site.",
            question: "How does pilot pricing work?",
          },
          {
            answer:
              "No open self-serve trial is available. Cleaning businesses apply for the founder pilot first.",
            question: "Is there a free trial?",
          },
          {
            answer:
              "Setup is founder-guided during the controlled pilot so services, quote questions, and the reply flow can be checked before real use.",
            question: "What happens during setup?",
          },
        ],
        title: "Pricing and billing",
      },
      {
        items: [
          {
            answer:
              "Use real customer data only after explicit pilot approval. The public site is not approval to send production data.",
            question: "Is real customer data approved yet?",
          },
          {
            answer:
              "Only the details a cleaning owner needs for a quote request: contact path, service type, location, timing, property context, and the customer's message.",
            question: "What data should a quote form collect?",
          },
          {
            answer:
              "No. BizPilot provides product guardrails and plain-language references, but it does not replace legal, privacy, or security advice.",
            question: "Does BizPilot provide legal advice?",
          },
        ],
        title: "Data, privacy, and readiness",
      },
      {
        items: [
          {
            answer:
              "Content Studio is a future direction for approved posts, service descriptions, updates, campaigns, and visual content briefs. It is not part of the first pilot promise.",
            question: "What is the future Content Studio?",
          },
          {
            answer:
              "Follow-up drafts, reporting, integrations, and multi-industry templates are roadmap items after validation. They are not automatic promises for the first pilot.",
            question: "What features are still roadmap?",
          },
          {
            answer:
              "Yes. The founder pilot is intentionally small so real cleaning-business feedback can shape the workflow before broader rollout.",
            question: "Can pilot businesses influence the product?",
          },
        ],
        title: "Roadmap",
      },
    ],
    title: "Questions cleaning business owners ask before joining.",
  },
  home: {
    ai: {
      body:
        "BizPilot does not automatically send customer messages in the first pilot. AI helps prepare replies, but you review, edit, and send every message.",
      canHelp: [
        "Summarizing quote requests",
        "Drafting friendly replies",
        "Suggesting follow-up questions",
        "Improving tone",
        "Creating English or French response drafts",
      ],
      canHelpTitle: "AI can help with",
      eyebrow: "AI with business control",
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
      cta: "Read the full FAQ",
      eyebrow: "FAQ",
      items: [
        {
          answer:
            "No. In the first pilot, BizPilot prepares reply drafts and you review, edit, copy, and send manually.",
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
          question: "Who is the pilot for first?",
        },
      ],
      title: "Straight answers before the full FAQ.",
    },
    finalCta: {
      body:
        "Founder-led setup stays approval-gated while we test one clean quote recovery workflow with cleaning businesses.",
      cta: "Apply for founder pilot",
      note: "Limited pilot. Manual setup. Real data and paid pilot still require approval.",
      title: "Join the founder pilot for cleaning businesses.",
    },
    hero: {
      badge: "Local services - cleaning first",
      body:
        "Quotes scatter across website, Google, Facebook, Instagram, texts, and missed calls. BizPilot turns them into one owner-reviewed queue with a draft ready to copy.",
      bullets: [
        "One queue for every channel",
        "Reply to hot requests first",
        "Review the draft before sending",
      ],
      note: "Founder-led pilot. Approval required. No auto-send.",
      primaryCta: "Join the pilot",
      secondaryCta: "See how it works",
      title: "Never lose a quote request in the chaos.",
    },
    meta: {
      description:
        "BizPilot AI helps local service businesses, starting with cleaning, turn messy quote requests into organized leads and reply drafts for owner review.",
      title: "BizPilot AI | Lead Recovery for Cleaning Businesses",
    },
    mockup: {
      boardLabel: "Lead signal board",
      boardSafety: "Owner reviews first",
      bizPilotActions: ["Capture", "Organize", "Prioritize", "Draft"],
      bizPilotBody: "Signal becomes workflow",
      bizPilotTitle: "BizPilot",
      chaosBadge: "10 customer PMs",
      chaosHint: "Different people. Different channels. No clear next reply.",
      chaosSubtitle: "Messages from everywhere",
      chaosTitle: "THE CHAOS",
      clarityBadge: "Priority sorted",
      claritySubtitle: "Smart lead queue",
      clarityTitle: "THE CLARITY",
      copyButton: "Review draft",
      draftBody:
        "Hi Maria, thanks for reaching out. Could you confirm the square footage and access notes so I can prepare an accurate quote?",
      draftTitle: "Draft ready for owner review",
      leads: [
        {
          body: "Move-out cleaning - missing square footage",
          title: "Needs reply first",
        },
        {
          body: "Office cleaning - follow-up due",
          title: "Review next",
        },
      ],
      messages: [
        "Can you clean before Friday?",
        "How much for a move-out?",
        "Do you service condos?",
        "I called yesterday...",
      ],
      sources: ["Google", "Facebook", "Instagram", "Text"],
    },
    preview: {
      badges: ["No auto-send", "No invented price", "No booking confirmation"],
      body:
        "A simple three-step flow keeps the next owner action obvious.",
      copyButton: "Copy reply",
      cta: "Watch full demo",
      draft: {
        body:
          "Hi Sarah, thanks for reaching out. Could you confirm the approximate square footage, whether appliances need interior cleaning, and any access notes so I can prepare an accurate quote?",
        title: "Draft for owner review",
      },
      organizedLead: {
        fields: [
          ["Service", "Move-out cleaning"],
          ["Timing", "Before Friday"],
          ["Missing", "square footage, appliances, access notes"],
          ["Status", "Needs reply"],
        ],
        title: "Organized lead",
      },
      request: {
        quote: '"Hi, how much for move-out cleaning before Friday?"',
        title: "Messy request",
      },
      steps: ["Capture quote request", "Organize and draft", "Owner reviews and sends"],
      title: "From request to reviewed reply in three steps.",
    },
    problem: {
      body:
        "Cleaning owners are busy on jobs. When quote requests scatter across channels, the next customer can quietly move on.",
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
      title: "The leak is small until the job is gone.",
    },
    roadmap: {
      badge: "Roadmap",
    body:
      "BizPilot is being designed to help local service businesses create social posts, Google Business updates, follow-up campaigns, service descriptions, seasonal promotions, and visual content briefs for approval.",
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
        "Keep the service, timing, missing details, and next reply clear across common cleaning requests.",
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
        "BizPilot prepares a draft reply",
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
      "Manual copy and send workflow",
      "Founder-led setup",
      "Feedback-based improvements",
    ],
    getTitle: "What you get",
    meta: {
      description:
        "Apply for the BizPilot AI founder pilot for cleaning businesses that want faster quote replies without full CRM complexity.",
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
          "AI summary and draft reply assistance",
          "Manual copy and send workflow",
          "30- and 60-day feedback commitment",
          "No auto-send",
        ],
        cohort: "Businesses 1-5",
        cta: "Apply for founder pilot",
        highlight: "Feedback required",
        priceLines: ["$0 setup"],
        title: "Founder Feedback Pilot",
      },
      {
        bullets: [
          "Public quote page",
          "Lead recovery dashboard",
          "AI draft replies you review",
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
        "Payment collection starts only after pilot approval and a manual invoice or Stripe Payment Link process is prepared. BizPilot does not include in-app billing automation, booking, invoicing, SMS/WhatsApp automation, or auto-send.",
      title: "Payment and product limits",
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
      "This form does not confirm booking or pricing. The business will review your request and reply.",
    meta: {
      description:
        "Submit a cleaning quote request. No booking or price is confirmed by the form.",
      title: "Request a cleaning quote | BizPilot AI",
    },
    subtitle: "Tell us what you need and we will review your request.",
    title: "Request a cleaning quote",
  },
  trust: {
    badge: "Trust-first workflow",
    body:
      "BizPilot keeps customer communication in your hands. AI can help prepare text, but you decide what the customer receives.",
    items: [
      {
        body:
          "BizPilot does not automatically send customer messages in the first pilot.",
        title: "No auto-send",
      },
      {
        body:
          "AI drafts are reviewed, edited, and sent manually by you.",
        title: "AI-assisted drafts reviewed by you",
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
          "Real customer data stays blocked until explicit pilot approval is complete.",
        title: "Real customer data requires approval",
      },
      {
        body:
          "If AI is unavailable, you still have a clear manual workflow.",
        title: "Safe fallback if AI is unavailable",
      },
      {
        body:
          "The first pilot is built around business control and manual sending.",
        title: "Manual communication only in first pilot",
      },
    ],
    meta: {
      description:
        "BizPilot AI keeps message control with the business: AI helps draft, you approve, and no customer messages are sent automatically in the first pilot.",
      title: "Business-Controlled AI and Trust | BizPilot AI",
    },
    notes: {
      badge: "Pilot readiness notes",
      body:
        "BizPilot's commercial pilot terms are staged. Real customer data and paid pilot use still require final approval, production checks, and a prepared manual invoice or Stripe Payment Link before payment collection.",
    },
    pillars: [
      {
        body:
          "BizPilot helps prepare the work, but you decide what the customer receives.",
        points: [
          "No auto-send",
          "You review, edit, and send",
          "Manual communication during the pilot",
        ],
        title: "You stay in control",
      },
      {
        body:
          "Quote requests stay honest until you have the facts needed to price the work.",
        points: [
          "No invented pricing",
          "No automatic booking confirmation",
          "Missing details are requested before quoting",
        ],
        title: "Quotes stay honest",
      },
      {
        body:
          "If an automated aid is unavailable, you still have a clear manual workflow.",
        points: [
          "Real customer data requires approval",
          "Safe fallback when AI is unavailable",
          "Manual workflow remains available",
        ],
        title: "The workflow fails safely",
      },
    ],
    primaryCta: "Apply for founder pilot",
    privacyCta: "Read privacy",
    securityCta: "Read security",
    title: "Built for business control and trust.",
  },
};

const frenchPublicSiteCopy: PublicSiteCopy = {
  authMeta: {
    checkEmail: {
      description:
        "Consultez votre courriel pour continuer la configuration de votre accès BizPilot AI.",
      title: "Vérifiez votre courriel | BizPilot AI",
    },
    forgotPassword: {
      description:
        "Demandez un lien sécurisé pour réinitialiser le mot de passe de votre accès BizPilot AI.",
      title: "Réinitialiser le mot de passe | BizPilot AI",
    },
    resetPassword: {
      description:
        "Choisissez un nouveau mot de passe pour votre accès BizPilot AI.",
      title: "Réinitialiser le mot de passe | BizPilot AI",
    },
    signIn: {
      description:
        "Connectez-vous à un espace de travail BizPilot AI approuvé pour gérer les demandes de soumission et les brouillons de réponse.",
      title: "Connexion | BizPilot AI",
    },
    signUp: {
      description:
        "Créez un accès BizPilot AI après l'approbation du projet pilote.",
      title: "Créer un accès | BizPilot AI",
    },
    signUpPilotCta: "Postulez d'abord sur la page du projet pilote.",
    signUpPilotPrompt: "Vous voulez rejoindre le projet pilote?",
  },
  cleaning: {
    badge: "Entreprises de nettoyage d’abord",
    beforeAfter: {
      after:
        "Merci pour votre message. Pouvez-vous confirmer la superficie, les électroménagers à nettoyer et les notes d’accès afin que je prépare une soumission responsable?",
      afterLabel: "Brouillon de réponse",
      before:
        "\"Combien pour un nettoyage après déménagement d’ici vendredi?\"",
      beforeLabel: "Avant",
      body:
        "BizPilot transforme un message vague en détails utiles avant votre réponse.",
      title: "D'une demande vague à une prochaine réponse claire.",
    },
    body:
      "BizPilot aide les entreprises de nettoyage à centraliser les demandes de soumission, organiser les prospects et préparer des réponses à valider avant l'envoi.",
    ctaPrimary: "Rejoindre le pilote",
    ctaSecondary: "Voir la démo",
    detailHelp: {
      body:
        "Quand une demande est vague, BizPilot aide à préparer la bonne question de suivi au lieu de deviner le prix, le moment ou une réservation.",
      title: "Détails manquants que BizPilot peut aider à demander",
    },
    detailSection: {
      body:
        "Un seul panneau de détails garde l'exemple, les informations de soumission et les questions de suivi au clair sans répéter les groupes de services.",
      clearTitle: "Détails que BizPilot garde clairs",
      title: "Choisissez le type de demande de nettoyage.",
    },
    example: {
      fields: [
        ["Service", "Nettoyage après déménagement"],
        ["Propriété", "Appartement de 2 chambres"],
        ["Moment", "Avant vendredi"],
        ["Manquant", "superficie, électroménagers, notes d'accès"],
        ["Statut", "À répondre"],
      ],
      request:
        '"Bonjour, pouvez-vous faire un nettoyage après déménagement avant vendredi? C’est un appartement de 2 chambres."',
      requestLabel: "Exemple de demande",
      title: "Flux de demande de soumission",
      workflow:
        "Le client demande une soumission -> Vous voyez les détails du service -> BizPilot résume -> BizPilot prépare un brouillon de réponse -> Vous copiez et envoyez manuellement",
    },
    finalCta: {
      body:
        "Apportez le flux de soumission que vous utilisez déjà. BizPilot garde une approche manuelle pendant que le pilote valide quoi capter, organiser et préparer.",
      title: "Aidez à façonner le pilote autour de vraies demandes.",
    },
    serviceActionLabel: "Voir les détails",
    serviceCards: [
      {
        body: "Demandes de nettoyage résidentiel récurrent ou ponctuel.",
        clearDetails: [
          "Fréquence du service",
          "Chambres, salles de bain ou superficie",
          "Pièces prioritaires",
          "Animaux, fournitures et notes d'accès",
        ],
        id: "residential",
        missingDetails: [
          "Date souhaitée pour commencer",
          "État actuel du logement",
          "Surfaces spéciales ou allergies",
        ],
        request:
          "\"Pouvez-vous soumissionner un nettoyage hebdomadaire pour une maison de 3 chambres à Boucherville?\"",
        title: "Nettoyage résidentiel",
      },
      {
        body: "Portée, état de la propriété et zones prioritaires.",
        clearDetails: [
          "Type de service",
          "Taille de la propriété",
          "Pièces et surfaces prioritaires",
          "État actuel",
        ],
        id: "deep-cleaning",
        missingDetails: [
          "Fenêtre de date souhaitée",
          "Électroménagers ou armoires à l'intérieur",
          "Notes d'accès",
        ],
        request:
          "\"Pouvez-vous faire un grand ménage pour une maison de 3 chambres la semaine prochaine?\"",
        title: "Nettoyage en profondeur",
      },
      {
        body: "Échéance, électroménagers, armoires et accès.",
        clearDetails: [
          "Date de déménagement",
          "Type de propriété",
          "Électroménagers et armoires",
          "Entrée et accès",
        ],
        id: "move-in-out",
        missingDetails: [
          "Superficie",
          "Stationnement ou clés",
          "Photos ou zones prioritaires",
        ],
        request:
          "\"Combien pour un nettoyage après déménagement d'ici vendredi?\"",
        title: "Nettoyage avant/après déménagement",
      },
      {
        body: "Superficie, fréquence, horaire et accès au site.",
        clearDetails: [
          "Superficie",
          "Fréquence de nettoyage",
          "Horaire préféré",
          "Accès au site et contact",
        ],
        id: "office",
        missingDetails: [
          "Nombre de salles d'eau ou cuisines",
          "Fournitures attendues",
          "Alarme, clés ou règles d'immeuble",
        ],
        request:
          "\"Nous avons besoin d'un nettoyage de bureaux deux fois par semaine après 18 h. Pouvez-vous soumissionner?\"",
        title: "Nettoyage de bureaux",
      },
      {
        body: "Heure de sortie, literie, fournitures et accès.",
        clearDetails: [
          "Heure de départ et d'arrivée",
          "Chambres et salles de bain",
          "Literie et réapprovisionnement",
          "Instructions d'entrée",
        ],
        id: "airbnb",
        missingDetails: [
          "Lieu de lavage",
          "Inventaire des fournitures",
          "Notes de dommages ou photos",
        ],
        request:
          "\"Pouvez-vous préparer notre Airbnb entre le départ à 11 h et l'arrivée à 16 h?\"",
        title: "Nettoyage entre séjours Airbnb",
      },
      {
        body: "Poussière, débris, taille du site, échéance et portée.",
        clearDetails: [
          "Taille du site",
          "Portée de poussière et débris",
          "Échéance",
          "Accès et contact sur place",
        ],
        id: "post-construction",
        missingDetails: [
          "Responsabilité pour les débris",
          "Détails des planchers, vitres ou installations",
          "Contraintes de sécurité ou EPI",
        ],
        request:
          "\"Pouvez-vous nettoyer après une petite rénovation avant l'inspection la semaine prochaine?\"",
        title: "Nettoyage après travaux",
      },
    ],
    intro:
      "Les responsables d'entreprises de nettoyage sont souvent loin d'un bureau. Ils sont sur les chantiers, sur la route, avec leur équipe ou avec des clients. Les demandes de soumission arrivent au mauvais moment, et une réponse lente peut coûter des mandats.",
    meta: {
      description:
        "BizPilot AI aide les entreprises de nettoyage à centraliser les demandes de soumission, organiser les prospects et préparer des réponses à valider avant l'envoi.",
      title: "Récupération des demandes pour entreprises de nettoyage | BizPilot AI",
    },
    services: [
      "Nettoyage résidentiel",
      "Nettoyage en profondeur",
      "Nettoyage avant/après déménagement",
      "Nettoyage de bureaux",
      "Nettoyage entre séjours Airbnb",
      "Nettoyage après travaux",
    ],
    servicesTitle: "Services soutenus pendant le projet pilote",
    title: "Récupération des demandes pour entreprises de nettoyage.",
  },
  contentStudio: {
    badge: "Feuille de route",
    body:
      "Cette page présente seulement une direction future. BizPilot pourrait plus tard aider les entreprises locales à préparer du contenu marketing à valider, après la validation du flux de récupération des demandes de nettoyage.",
    cards: [
      {
        body: "Futurs brouillons pour expliquer les services clairement.",
        title: "Publications de services",
      },
      {
        body: "Idées locales à valider avant toute publication.",
        title: "Mises à jour Google Business",
      },
      {
        body: "Plans promotionnels qui restent à valider avant publication.",
        title: "Promotions saisonnières",
      },
      {
        body: "Brouillons de réponse à valider avant publication.",
        title: "Réponses aux avis",
      },
      {
        body: "Concepts courts pour expliquer un service ou une offre.",
        title: "Scripts vidéo courts",
      },
      {
        body: "Briefs simples pour de futurs visuels à valider.",
        title: "Briefs créatifs visuels",
      },
    ],
    cta: "Rejoindre le pilote",
    footer:
      "Comme les brouillons de réponse, les futurs contenus devront être validés avant publication. Aucune publication automatique n'est promise.",
    meta: {
      description:
        "Feuille de route du futur Content Studio BizPilot AI pour du contenu marketing local à valider, après validation de la récupération des demandes.",
      title: "Feuille de route Content Studio | BizPilot AI",
    },
    title: "Futur Content Studio pour la croissance locale.",
  },
  demo: {
    badge: "Démo de 60 secondes",
    body:
      "Suivez une demande réaliste de nettoyage après déménagement, du message client à la réponse à valider.",
    chapters: [
      {
        body:
          "Une demande vague arrive pendant que vous êtes occupé. Des détails manquent, le prix serait risqué et le message est facile à oublier.",
        eyebrow: "1",
        panelItems: [
          "\"Bonjour, combien pour un nettoyage après déménagement d’ici vendredi?\"",
        ],
        panelTitle: "Message client",
        title: "La demande arrive.",
      },
      {
        body:
          "BizPilot transforme le message en contexte propre au nettoyage et indique ce qui manque avant une soumission responsable.",
        eyebrow: "2",
        panelItems: [
          "Service : nettoyage après déménagement",
          "Moment : avant vendredi",
          "Statut : à répondre",
          "Manquant : superficie, électroménagers, notes d'accès",
          "Consentement : validation requise avant envoi",
        ],
        panelTitle: "Prospect organisé",
        title: "BizPilot organise le prospect.",
      },
      {
        body:
          "L'IA prépare un court résumé et un premier brouillon utile. Le brouillon demande les détails manquants au lieu d'inventer un prix.",
        eyebrow: "3",
        panelItems: [
          "Sarah a besoin d'un nettoyage avant vendredi, mais le prix serait risqué sans la superficie, les détails sur les électroménagers et les notes d'accès.",
          "Bonjour Sarah, merci pour votre message. Pouvez-vous confirmer la superficie, les électroménagers à nettoyer et les notes d’accès afin que je prépare une soumission exacte?",
        ],
        panelTitle: "Résumé IA et brouillon",
        title: "L'IA prépare un brouillon à valider.",
      },
      {
        body:
          "Vous validez, ajustez au besoin, copiez la réponse et l'envoyez manuellement depuis votre propre canal. Les garde-fous restent visibles.",
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
        title: "Vous validez, copiez et envoyez manuellement.",
      },
    ],
    cta: {
      body:
        "BizPilot commence avec les entreprises de nettoyage afin que le produit soit façonné autour de vraies demandes de soumission et de commentaires terrain.",
      button: "Rejoindre le pilote",
      title:
        "Essayez le flux du projet pilote avec de vraies demandes de nettoyage.",
    },
    meta: {
      description:
        "Voyez comment BizPilot AI capte une demande de soumission de nettoyage, organise le prospect, signale les détails manquants et prépare une réponse à valider.",
      title: "Démo du flux de soumission de nettoyage | BizPilot AI",
    },
    title: "Voyez comment BizPilot traite une demande de soumission de nettoyage.",
  },
  features: {
    badge: "Fonctions",
    badges: [
      "Aucun envoi automatique",
      "Aucun prix inventé",
      "Vous décidez",
      "Copie et envoi manuels",
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
          "Voyez les nouvelles demandes de nettoyage dans un espace de travail plutôt que dans des messages dispersés.",
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
        title: "Préparer un brouillon à valider.",
      },
      {
        body:
          "Gardez la communication finale entre vos mains tout en avançant plus vite.",
        title: "Copier et envoyer depuis le canal que vous utilisez déjà.",
      },
      {
        body:
          "Voyez clairement la prochaine action : répondre, demander des détails, faire un suivi ou marquer la demande comme traitée.",
        title: "Garder la prochaine action manuelle claire.",
      },
    ],
    meta: {
      description:
        "Fonctions BizPilot AI pour les entreprises de nettoyage : lien de soumission, demandes reçues, détails, brouillons IA à valider et envoi manuel.",
      title: "Fonctions de récupération de prospects | BizPilot AI",
    },
    primaryCta: "Rejoindre le pilote",
    proof: {
      badge: "Preuve produit",
      body:
        "Une demande réaliste de nettoyage passe par un chemin simple et contrôlé.",
      items: [
        "Le client envoie une demande de soumission",
        "BizPilot organise le service, le moment et les détails manquants",
        "L'IA prépare un brouillon à valider",
        "Vous copiez, ajustez au besoin et envoyez manuellement",
      ],
      title: "Du lien de soumission à la réponse à valider.",
    },
    roadmap: {
      badge: "Feuille de route",
      body:
        "Brouillons de suivi, rapports, Content Studio, intégrations et modèles pour d'autres secteurs sont prévus après validation.",
    },
    secondaryCta: "Lire l'approche de confiance",
    title: "Un système simple pour mieux gérer les demandes de nettoyage.",
  },
  faq: {
    badge: "FAQ",
    body:
      "Des réponses claires sur le premier projet pilote BizPilot : ce qu'il fait, ce qui reste manuel, la tarification et ce qui demeure sur la feuille de route.",
    meta: {
      description:
        "Consultez les réponses FAQ de BizPilot AI sur le projet pilote pour entreprises de nettoyage, les brouillons IA à valider, l'envoi manuel, les tarifs, la confidentialité et la feuille de route.",
      title: "FAQ pour entreprises de nettoyage | BizPilot AI",
    },
    sections: [
      {
        items: [
          {
            answer:
              "Non. BizPilot commence comme un flux ciblé de récupération des demandes de soumission de nettoyage, pas comme un CRM complet.",
            question: "BizPilot est-il un CRM complet?",
          },
          {
            answer:
              "BizPilot est d'abord conçu pour les entreprises de nettoyage : résidentiel, nettoyage en profondeur, déménagement, bureaux, Airbnb, après-construction et demandes connexes.",
            question: "À qui le projet pilote s'adresse-t-il d'abord?",
          },
          {
            answer:
              "La demande devient un prospect organisé avec le service, le moment, les détails de propriété, le statut et, quand il y a assez de contexte, un brouillon de réponse à valider.",
            question: "Que se passe-t-il quand un client envoie une demande?",
          },
          {
            answer:
              "Peut-être plus tard. Le projet pilote reste axé sur le nettoyage afin de valider le flux avant d'élargir.",
            question: "BizPilot soutiendra-t-il d'autres secteurs?",
          },
        ],
        title: "Bases du projet pilote",
      },
      {
        items: [
          {
            answer:
              "Non. Pendant le premier projet pilote, BizPilot prépare des brouillons. Vous validez, modifiez, copiez et envoyez manuellement.",
            question: "BizPilot envoie-t-il des messages automatiquement?",
          },
          {
            answer:
              "Non. BizPilot ne doit pas inventer de prix. Il peut aider à demander les détails manquants avant de préparer une soumission responsable.",
            question: "L'IA peut-elle créer des prix pour moi?",
          },
          {
            answer:
              "Vous gardez le contrôle. BizPilot peut organiser la demande et préparer un brouillon, mais vous décidez quoi envoyer.",
            question: "Qui envoie la réponse?",
          },
        ],
        title: "IA et contrôle par l'entreprise",
      },
      {
        items: [
          {
            answer:
              "Les tarifs pilotes publiés sont affichés sur la page Tarifs. La facturation suit seulement l'approbation et l'intégration manuelle; il n'y a pas de paiement libre-service sur le site public.",
            question: "Comment les tarifs pilotes fonctionnent-ils?",
          },
          {
            answer:
              "Il n'y a pas d'essai libre-service ouvert. Les entreprises de nettoyage doivent d'abord demander l'accès au projet pilote.",
            question: "Y a-t-il un essai gratuit?",
          },
          {
            answer:
              "La configuration est guidée par le fondateur pendant le projet pilote contrôlé afin de vérifier les services, les questions de soumission et le flux de validation avant l'utilisation réelle.",
            question: "Que se passe-t-il pendant la configuration?",
          },
        ],
        title: "Tarifs et facturation",
      },
      {
        items: [
          {
            answer:
              "Utilisez des données réelles de clients seulement après l'approbation explicite du projet pilote. Le site public ne constitue pas une autorisation d'envoyer des données de production.",
            question: "Les données réelles des clients sont-elles approuvées?",
          },
          {
            answer:
              "Seulement les détails nécessaires à une soumission de nettoyage : canal de contact, type de service, secteur, moment, contexte de propriété et message du client.",
            question: "Quelles données un formulaire de soumission devrait-il recueillir?",
          },
          {
            answer:
              "Non. BizPilot fournit des garde-fous produit et des références en langage clair, mais ne remplace pas les conseils juridiques, de confidentialité ou de sécurité.",
            question: "BizPilot donne-t-il des conseils juridiques?",
          },
        ],
        title: "Données, confidentialité et approbation",
      },
      {
        items: [
          {
            answer:
              "Content Studio est une direction future pour des publications, descriptions de service, mises à jour, campagnes et briefs visuels à valider. Ce n'est pas une promesse du premier projet pilote.",
            question: "Qu'est-ce que le futur Content Studio?",
          },
          {
            answer:
              "Les brouillons de suivi, rapports, intégrations et modèles pour d'autres secteurs sont des éléments de feuille de route après validation. Ce ne sont pas des promesses automatiques du premier pilote.",
            question: "Quelles fonctions restent sur la feuille de route?",
          },
          {
            answer:
              "Oui. Le projet pilote reste volontairement petit afin que les commentaires réels des entreprises de nettoyage façonnent le flux avant un lancement plus large.",
            question: "Les entreprises pilotes peuvent-elles influencer le produit?",
          },
        ],
        title: "Feuille de route",
      },
    ],
    title: "Questions que les entreprises de nettoyage posent avant de participer.",
  },
  home: {
    ai: {
      body:
        "BizPilot n'envoie pas automatiquement de messages aux clients pendant le premier projet pilote. L'IA aide à préparer les réponses, mais chaque message est validé, ajusté et envoyé manuellement par vous.",
      canHelp: [
        "Résumer les demandes de soumission",
        "Préparer des réponses amicales",
        "Suggérer des questions de suivi",
        "Améliorer le ton",
        "Créer des brouillons de réponse en français ou en anglais",
      ],
      canHelpTitle: "L'IA peut aider à",
      eyebrow: "IA sous votre contrôle",
      title: "L'IA prépare. Vous décidez.",
      willNot: [
        "Envoyer des messages automatiquement",
        "Inventer des prix",
        "Promettre des disponibilités",
        "Confirmer des réservations",
        "Remplacer votre jugement",
      ],
      willNotTitle: "L'IA ne va pas",
    },
    faq: {
      cta: "Lire la FAQ complète",
      eyebrow: "FAQ",
      items: [
        {
          answer:
            "Non. Pendant le premier projet pilote, BizPilot prépare des brouillons. Vous validez, modifiez, copiez et envoyez manuellement.",
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
          question: "À qui le projet pilote s'adresse-t-il d'abord?",
        },
      ],
      title: "Réponses rapides avant la FAQ complète.",
    },
    finalCta: {
      body:
        "La configuration reste guidée et soumise à approbation pendant que nous testons un flux clair de récupération des soumissions.",
      cta: "Rejoindre le pilote",
      note: "Projet pilote limité. Configuration manuelle. Données réelles et pilote payé encore soumis à approbation.",
      title: "Rejoignez le projet pilote pour entreprises de nettoyage.",
    },
    hero: {
      badge: "Services locaux - nettoyage d'abord",
      body:
        "Les demandes arrivent du site web, Google, Facebook, Instagram, textos et appels manqués. BizPilot les transforme en file claire avec un brouillon à valider.",
      bullets: [
        "Une file pour chaque canal",
        "Répondre d'abord aux demandes chaudes",
        "Valider le brouillon avant l'envoi",
      ],
      note: "Projet pilote guidé. Approbation requise. Aucun envoi automatique.",
      primaryCta: "Rejoindre le pilote",
      secondaryCta: "Voir le flux",
      title:
        "Ne perdez jamais une demande dans le chaos.",
    },
    meta: {
      description:
        "BizPilot AI aide les entreprises de services locales, d'abord le nettoyage, à transformer les demandes de soumission en prospects organisés et brouillons à valider.",
      title: "BizPilot AI | Récupération des demandes",
    },
    mockup: {
      boardLabel: "Tableau des signaux",
      boardSafety: "Validation par le propriétaire",
      bizPilotActions: ["Capter", "Organiser", "Prioriser", "Rédiger"],
      bizPilotBody: "Le signal devient un flux",
      bizPilotTitle: "BizPilot",
      chaosBadge: "10 messages client",
      chaosHint: "Plusieurs personnes. Plusieurs canaux. Aucun prochain suivi clair.",
      chaosSubtitle: "Messages de partout",
      chaosTitle: "LE CHAOS",
      clarityBadge: "Priorités triées",
      claritySubtitle: "File de prospects intelligente",
      clarityTitle: "LA CLARTÉ",
      copyButton: "Réviser le brouillon",
      draftBody:
        "Bonjour Maria, merci pour votre message. Pouvez-vous confirmer la superficie et les notes d'accès afin que je prépare une soumission exacte?",
      draftTitle: "Brouillon prêt pour validation",
      leads: [
        {
          body: "Nettoyage après déménagement - superficie manquante",
          title: "À répondre d'abord",
        },
        {
          body: "Bureaux - suivi dû",
          title: "À réviser ensuite",
        },
      ],
      messages: [
        "Pouvez-vous nettoyer avant vendredi?",
        "Combien pour un départ?",
        "Servez-vous les condos?",
        "J'ai appelé hier...",
      ],
      sources: ["Google", "Facebook", "Instagram", "Texto"],
    },
    preview: {
      badges: [
        "Aucun envoi automatique",
        "Aucun prix inventé",
        "Aucune réservation confirmée",
      ],
      body:
        "Un flux simple en trois étapes garde la prochaine action du propriétaire visible.",
      copyButton: "Copier la réponse",
      cta: "Voir la démo complète",
      draft: {
        body:
          "Bonjour Sarah, merci pour votre message. Pouvez-vous confirmer la superficie, les électroménagers à nettoyer et les notes d'accès afin que je prépare une soumission exacte?",
        title: "Brouillon à valider",
      },
      organizedLead: {
        fields: [
          ["Service", "nettoyage après déménagement"],
          ["Moment", "avant vendredi"],
          ["Manquant", "superficie, électroménagers, notes d'accès"],
          ["Statut", "à répondre"],
        ],
        title: "Prospect organisé",
      },
      request: {
        quote:
          "\"Bonjour, combien pour un nettoyage après déménagement d'ici vendredi?\"",
        title: "Demande vague",
      },
      steps: ["Capter la demande", "Organiser et rédiger", "Valider puis envoyer"],
      title: "De la demande à la réponse validée en trois étapes.",
    },
    problem: {
      body:
        "Les responsables sont souvent sur le terrain. Quand les demandes se dispersent, le prochain client peut passer à autre chose.",
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
            "Les équipes perdent du temps à écrire la même première réponse.",
          title: "Aucune réponse prête",
        },
      ],
      eyebrow: "Problème",
      title: "La fuite est petite jusqu'au mandat perdu.",
    },
    roadmap: {
      badge: "Feuille de route",
      body:
        "BizPilot est conçu pour aider plus tard les entreprises locales à créer des publications à valider, des mises à jour Google Business, des campagnes de suivi, des descriptions de service, des promotions saisonnières et des briefs visuels.",
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
        "Un système simple pour récupérer les demandes de nettoyage.",
    },
    useCases: {
      body:
        "Gardez le service, le moment, les détails manquants et la prochaine réponse clairs.",
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
          body: "Échéance, électroménagers et notes d’accès.",
          href: "/industries/cleaning#move-in-out",
          title: "Nettoyage avant/après déménagement",
        },
        {
          body: "Superficie, fréquence, horaire et accès au site.",
          href: "/industries/cleaning#office",
          title: "Nettoyage de bureaux",
        },
        {
          body: "Heure de sortie, literie, fournitures et accès.",
          href: "/industries/cleaning#airbnb",
          title: "Nettoyage entre séjours Airbnb",
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
        "Le prospect apparaît dans votre espace de travail",
        "BizPilot prépare un brouillon",
        "Vous validez et envoyez manuellement",
      ],
      title: "Cinq étapes, aucune automatisation cachée.",
    },
  },
  pilot: {
    badge: "Projet pilote",
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
      "Entreprises de nettoyage dirigées par vous",
      "Petites équipes de nettoyage",
      "Entreprises qui reçoivent déjà des demandes de soumission en ligne",
      "Équipes qui veulent aller plus vite sans complexité de CRM complet",
    ],
    fitTitle: "Bon profil",
    getItems: [
      "Lien de demande de soumission",
      "Demandes reçues organisées",
      "Résumé assisté par IA et brouillon de réponse",
      "Flux de copie et d’envoi manuels",
      "Configuration guidée par le fondateur",
      "Améliorations basées sur les commentaires",
    ],
    getTitle: "Ce que vous obtenez",
    meta: {
      description:
        "Postulez au projet pilote BizPilot AI pour les entreprises de nettoyage qui veulent répondre plus vite aux demandes de soumission sans complexité CRM.",
      title: "Projet pilote pour le nettoyage | BizPilot AI",
    },
    nextSteps: [
      "Envoyez une courte demande pilote",
      "Le fondateur valide le flux",
      "Les entreprises sélectionnées reçoivent une configuration et un flux exemple",
    ],
    nextStepsTitle: "Ce qui se passe ensuite",
    title: "Aidez à façonner BizPilot autour du vrai travail de nettoyage.",
  },
  pricing: {
    afterApply: {
      steps: [
        "Le fondateur vérifie le profil et le flux actuel de soumission",
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
          "Demandes reçues",
          "Résumé IA et aide au brouillon de réponse",
          "Copie et envoi manuels",
          "Engagement de commentaires à 30 et 60 jours",
          "Aucun envoi automatique",
        ],
        cohort: "Entreprises 1 à 5",
        cta: "Rejoindre le pilote",
        highlight: "Commentaires requis",
        priceLines: ["$0 setup"],
        title: "Projet pilote",
      },
      {
        bullets: [
          "Page publique de soumission",
          "Tableau de bord de récupération",
          "Brouillons IA à valider par vous",
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
          "Page de soumission plus personnalisée",
          "Ajustement du style de réponse et des FAQ",
          "Ajustement des brouillons de suivi",
          "Meilleure organisation des prospects",
          "Accueil prioritaire",
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
        "La collecte de paiement commence seulement après l'approbation du projet pilote et la préparation d'une facture manuelle ou d'un processus Stripe Payment Link. BizPilot n'inclut pas la facturation automatisée dans l'app, la réservation, la facturation comptable, l'automatisation SMS/WhatsApp ni l'envoi automatique.",
      title: "Limites de paiement et de produit",
    },
    meta: {
      description:
        "Tarification pilote approuvée pour les entreprises de nettoyage qui explorent BizPilot AI, avec configuration manuelle et garde-fous de paiement.",
      title: "Tarification du projet pilote | BizPilot AI",
    },
    title: "Tarifs pilotes simples pour le nettoyage.",
  },
  quoteShell: {
    guardrail:
      "Ce formulaire ne confirme ni réservation ni prix. L'entreprise révisera votre demande et vous répondra.",
    meta: {
      description:
        "Envoyez une demande de soumission de nettoyage pour validation par l'entreprise. Ce formulaire ne confirme ni réservation ni prix.",
      title: "Demander une soumission de nettoyage | BizPilot AI",
    },
    subtitle: "Un court formulaire de soumission. L'entreprise révise chaque demande et répond directement.",
    title: "Demander une soumission de nettoyage",
  },
  trust: {
    badge: "Confiance et contrôle",
    body:
      "BizPilot garde la communication entre vos mains. L'IA peut aider à préparer le texte, mais vous décidez ce que le client reçoit.",
    items: [
      {
        body:
          "BizPilot n'envoie pas automatiquement de messages aux clients pendant le premier projet pilote.",
        title: "Aucun envoi automatique",
      },
      {
        body:
          "Les brouillons IA sont validés, modifiés et envoyés manuellement par vous.",
        title: "Brouillons IA à valider par vous",
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
          "Les données réelles de clients restent bloquées jusqu'à l'approbation explicite du projet pilote.",
        title: "Données client réelles sur approbation",
      },
      {
        body:
          "Si l'IA est indisponible, vous gardez un flux manuel clair.",
        title: "Solution manuelle si l'IA est indisponible",
      },
      {
        body:
          "Le premier projet pilote est bâti autour de la copie et de l'envoi manuels.",
        title: "Communication manuelle seulement au premier pilote",
      },
    ],
    meta: {
      description:
        "BizPilot AI garde l'envoi entre vos mains : l'IA prépare, vous validez et aucun message client n'est envoyé automatiquement pendant le premier projet pilote.",
      title: "IA sous contrôle et confiance | BizPilot AI",
    },
    notes: {
      badge: "Notes de préparation du pilote",
      body:
        "Les conditions commerciales du projet pilote BizPilot sont par étapes. Les données réelles de clients et l'utilisation payante exigent encore une approbation finale, des vérifications de production et une facture manuelle ou un Stripe Payment Link préparé avant tout paiement.",
    },
    pillars: [
      {
        body:
          "BizPilot aide à préparer le travail, mais vous décidez ce que le client reçoit.",
        points: [
          "Aucun envoi automatique",
          "Vous validez, modifiez et envoyez",
          "Communication manuelle pendant le projet pilote",
        ],
        title: "Vous gardez le contrôle",
      },
      {
        body:
          "Les demandes de soumission restent honnêtes jusqu'à ce que vous ayez les faits nécessaires pour chiffrer le travail.",
        points: [
          "Aucun prix inventé",
          "Aucune confirmation automatique de réservation",
          "Les détails manquants sont demandés avant la soumission",
        ],
        title: "Les soumissions restent honnêtes",
      },
      {
        body:
          "Si une aide automatisée est indisponible, vous gardez un flux manuel clair.",
        points: [
          "Données client réelles sur approbation",
          "Solution de repli si l'IA est indisponible",
          "Le flux manuel reste disponible",
        ],
        title: "Le flux échoue prudemment",
      },
    ],
    primaryCta: "Rejoindre le pilote",
    privacyCta: "Lire la confidentialité",
    securityCta: "Lire la sécurité",
    title: "Conçu pour le contrôle et la confiance.",
  },
};

const copyByLanguage: Record<SupportedLanguage, PublicSiteCopy> = {
  en: englishPublicSiteCopy,
  "fr-CA": frenchPublicSiteCopy,
};

export function getPublicSiteCopy(language: unknown): PublicSiteCopy {
  return copyByLanguage[readSupportedLanguage(language)];
}
