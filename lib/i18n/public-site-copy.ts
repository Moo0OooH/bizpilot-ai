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
 * Last Updated: 2026-07-11
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
 * - 2026-07-04: Added honest comparison-route copy for Phase 25 SEO and buyer education.
 * - 2026-07-04: Added a quote-link placement guide for local-GTM onboarding.
 * - 2026-07-04: Expanded FAQ with AI-search owner-intent questions.
 * - 2026-07-05: Rewrote the homepage hero copy for the integrated product-scene redesign.
 * - 2026-07-05: Refocused homepage hero and preview copy on hot quote risk and owner-reviewed remedy.
 * - 2026-07-11: Strengthened the bilingual homepage hero around quote rescue, manual control, and missing details.
 * - 2026-07-11: Refined the homepage hero around ready replies and clearer product-scene proof.
 * - 2026-07-11: Added localized quote-language switch labels for the public quote shell.
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
    proofLabel: string;
    secondaryCta: string;
    signals: ReadonlyArray<Readonly<{
      label: string;
      value: string;
    }>>;
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
  evidence: Readonly<{
    body: string;
    items: ReadonlyArray<TextPair>;
    title: string;
  }>;
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
  workspace: Readonly<{
    actions: readonly string[];
    draft: Readonly<{
      body: string;
      title: string;
    }>;
    fields: ReadonlyArray<LabelValue>;
    guardrails: readonly string[];
    lead: Readonly<{
      meta: string;
      source: string;
      status: string;
      title: string;
    }>;
    missing: readonly string[];
    missingTitle: string;
    quoteLink: Readonly<{
      body: string;
      label: string;
      value: string;
    }>;
    sampleLabel: string;
    summary: Readonly<{
      body: string;
      title: string;
    }>;
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
  trustBoundary: Readonly<{
    items: ReadonlyArray<TextPair>;
    title: string;
  }>;
  title: string;
  badge: string;
}>;

type ComparisonCopy = Readonly<{
  badge: string;
  body: string;
  bestForLabel: string;
  cautionLabel: string;
  guardrail: Readonly<{
    body: string;
    title: string;
  }>;
  meta: MetaCopy;
  primaryCta: string;
  proof: Readonly<{
    body: string;
    items: readonly string[];
    title: string;
  }>;
  rows: ReadonlyArray<
    Readonly<{
      bestFor: string;
      caution: string;
      difference: string;
      option: string;
    }>
  >;
  secondaryCta: string;
  title: string;
}>;

type QuoteLinkGuideCopy = Readonly<{
  badge: string;
  body: string;
  channels: ReadonlyArray<
    Readonly<{
      body: string;
      caution: string;
      steps: readonly string[];
      tag: string;
      template: string;
      title: string;
    }>
  >;
  checklist: readonly string[];
  checklistTitle: string;
  guardrail: Readonly<{
    body: string;
    items: readonly string[];
    title: string;
  }>;
  meta: MetaCopy;
  primaryCta: string;
  references: ReadonlyArray<
    Readonly<{
      href: string;
      label: string;
      note: string;
    }>
  >;
  referencesTitle: string;
  replySpeedCta: string;
  secondaryCta: string;
  sourceLabel: string;
  templateBody: string;
  templateTitle: string;
  templateUrlLabel: string;
  title: string;
}>;

type ReplySpeedGuideCopy = Readonly<{
  badge: string;
  board: Readonly<{
    eyebrow: string;
    items: ReadonlyArray<LabelValue>;
    title: string;
  }>;
  body: string;
  calendar: ReadonlyArray<
    Readonly<{
      actions: readonly string[];
      body: string;
      period: string;
      title: string;
    }>
  >;
  calendarBody: string;
  calendarTitle: string;
  checklist: readonly string[];
  checklistTitle: string;
  guardrail: Readonly<{
    body: string;
    items: readonly string[];
    title: string;
  }>;
  meta: MetaCopy;
  primaryCta: string;
  secondaryCta: string;
  title: string;
  workflow: ReadonlyArray<
    Readonly<{
      body: string;
      signal: string;
      title: string;
    }>
  >;
  workflowTitle: string;
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

type PilotProofMetricCopy = Readonly<{
  label: string;
  note: string;
  value: string;
}>;

type PilotProofCopy = Readonly<{
  body: string;
  guardrail: string;
  metrics: ReadonlyArray<PilotProofMetricCopy>;
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
  proof: PilotProofCopy;
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
  languageMenuLabel: string;
  meta: MetaCopy;
  subtitle: string;
  title: string;
}>;

export type PublicSiteCopy = Readonly<{
  authMeta: AuthMetaCopy;
  cleaning: CleaningCopy;
  comparison: ComparisonCopy;
  contentStudio: ContentStudioCopy;
  demo: DemoCopy;
  faq: FaqCopy;
  features: FeaturesCopy;
  home: HomeCopy;
  pilot: PilotCopy;
  pricing: PricingCopy;
  quoteLinkGuide: QuoteLinkGuideCopy;
  replySpeedGuide: ReplySpeedGuideCopy;
  quoteShell: QuoteShellCopy;
  trust: TrustCopy;
}>;

export const PUBLIC_SITE_COPY_SOURCE_LANGUAGE = DEFAULT_LANGUAGE;
export const publicSiteCopyNamespaces = [
  "home",
  "features",
  "faq",
  "comparison",
  "quoteLinkGuide",
  "replySpeedGuide",
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
      "BizPilot helps cleaning business owners handle residential, office, move-out, deep-clean, and recurring quote requests in one manual-first lead recovery workflow.",
    ctaPrimary: "Join the cleaning founder pilot",
    ctaSecondary: "See demo",
    detailHelp: {
      body:
        "When a request is vague, BizPilot helps prepare the right follow-up question instead of guessing price, timing, or booking details.",
      title: "Missing details BizPilot can help ask for",
    },
    detailSection: {
      body:
        "One shared detail panel keeps service, area, timing, contact path, source context, and missing follow-up questions clear before an owner replies.",
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
        "Customer opens your quote link -> BizPilot organizes the request -> Missing details stay visible -> AI prepares a draft -> You review, copy, and send manually",
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
  comparison: {
    badge: "Comparison",
    body:
      "BizPilot is not trying to replace every tool in a cleaning business. It is built for one painful moment: a quote request arrives, details are missing, and the owner needs a clear next reply without losing control.",
    bestForLabel: "Best fit",
    cautionLabel: "Watch out",
    guardrail: {
      body:
        "BizPilot stays manual-first in the founder pilot. It does not auto-send messages, invent prices, confirm bookings, replace a CRM, run invoices, or promise revenue.",
      title: "The boundary matters.",
    },
    meta: {
      description:
        "Compare BizPilot AI with CRMs, form builders, booking software, and manual inbox workflows for cleaning business quote recovery.",
      title: "BizPilot vs CRM, Forms, and Booking Tools | BizPilot AI",
    },
    primaryCta: "Join founder pilot",
    proof: {
      body:
        "The pilot should prove whether a focused quote recovery workflow helps owners reply faster and follow up more consistently.",
      items: [
        "Capture quote requests from the places owners already share",
        "Organize service, timing, contact path, and missing details",
        "Prepare a practical reply you can review",
        "Keep sending manual until automation is explicitly approved",
      ],
      title: "The job is lead recovery, not software sprawl.",
    },
    rows: [
      {
        bestFor:
          "A business that already has a trained team, pipeline rules, and broad sales process.",
        caution:
          "Can feel heavy when the urgent problem is simply replying to cleaning quote requests faster.",
        difference:
          "BizPilot starts with quote intake, missing details, drafts for owner review, and the next manual action.",
        option: "Full CRM",
      },
      {
        bestFor:
          "Collecting basic fields when the owner already knows how every request should be handled.",
        caution:
          "Forms often stop at capture; the owner still has to read, interpret, prioritize, and reply.",
        difference:
          "BizPilot turns a request into a lead with service context, missing details, and a reply draft.",
        option: "Form builder",
      },
      {
        bestFor:
          "Confirmed jobs, calendars, staff schedules, deposits, and operational booking workflows.",
        caution:
          "A quote request is not always ready to become a booking, especially when price or scope is unclear.",
        difference:
          "BizPilot avoids booking claims and helps ask the right follow-up before an owner commits.",
        option: "Booking or invoice software",
      },
      {
        bestFor:
          "Very small volume where every request is easy to remember and reply to quickly.",
        caution:
          "Requests from Google, Instagram, website, email, and text become easy to miss during busy days.",
        difference:
          "BizPilot gives the owner one recovery workspace while keeping final communication manual.",
        option: "Manual inboxes and spreadsheets",
      },
    ],
    secondaryCta: "See workflow demo",
    title: "BizPilot vs CRMs, forms, and booking tools.",
  },
  quoteLinkGuide: {
    badge: "Quote-link placement",
    body:
      "Use one clean quote request link anywhere a warm cleaning lead already asks for price, scope, or availability. Keep the link honest, direct, and tagged by source so the owner can see where the request came from.",
    channels: [
      {
        body:
          "Put the quote request link where visitors already decide whether to contact the cleaning business.",
        caution:
          "Do not hide the only quote path in a footer or a long contact paragraph.",
        steps: [
          "Add a primary Request a cleaning quote button on the home page.",
          "Repeat it on contact, residential, move-out, office, and deep-cleaning pages.",
          "Send the button to the dedicated quote request page, not to a generic link hub.",
        ],
        tag: "website",
        template:
          "https://bizpilo.com/quote/clean-team?source=website&utm_source=website&utm_medium=cta&utm_campaign=quote_link",
        title: "Website buttons",
      },
      {
        body:
          "Use the profile website or contact path for a clear quote request. Only use business action links when the selected action truthfully matches what the page completes.",
        caution:
          "Do not label a quote request as a confirmed booking. Google business links may be rejected when the landing page does not complete the selected action.",
        steps: [
          "Use a verified Business Profile and keep the business name, service area, website, and phone consistent.",
          "Use a dedicated landing page for this business or location.",
          "Keep the page crawlable, HTTPS, and free from link shorteners or login walls.",
        ],
        tag: "google_business_profile",
        template:
          "https://bizpilo.com/quote/clean-team?source=google_business_profile&utm_source=google-business-profile&utm_medium=profile&utm_campaign=quote_link",
        title: "Google Business Profile",
      },
      {
        body:
          "Make the profile link send visitors straight to the quote request when Instagram is a real lead source.",
        caution:
          "If the bio already uses multiple links, keep the quote link near the top and label it clearly.",
        steps: [
          "Add the quote request URL in profile links.",
          "Use a plain label such as Request a cleaning quote.",
          "Test the link on mobile after saving.",
        ],
        tag: "instagram_bio",
        template:
          "https://bizpilo.com/quote/clean-team?source=instagram&utm_source=instagram&utm_medium=bio&utm_campaign=quote_link",
        title: "Instagram bio",
      },
      {
        body:
          "Saved replies turn repeat DMs into a cleaner intake path while the owner still replies manually.",
        caution:
          "Do not paste customer names, phone numbers, or message details into tracking tags.",
        steps: [
          "Create a saved reply for quote requests.",
          "Include one sentence that says the business reviews every request.",
          "Paste the tracked quote link after the sentence.",
        ],
        tag: "saved_reply",
        template:
          "https://bizpilo.com/quote/clean-team?source=saved_reply&utm_source=instagram&utm_medium=saved_reply&utm_campaign=quote_link",
        title: "Saved replies and DMs",
      },
      {
        body:
          "Email signatures catch warm referrals, follow-ups, and returning customers without adding another tool.",
        caution:
          "Keep the signature short so the quote link is visible on mobile.",
        steps: [
          "Add one line under the phone number or website.",
          "Use text like Request a cleaning quote.",
          "Use the same link for every team member until separate owner-approved source tags are needed.",
        ],
        tag: "email_signature",
        template:
          "https://bizpilo.com/quote/clean-team?source=email_signature&utm_source=email&utm_medium=signature&utm_campaign=quote_link",
        title: "Email signature",
      },
    ],
    checklist: [
      "Use the direct HTTPS quote page, not a link shortener.",
      "Keep the page dedicated to the right business or location.",
      "Say request a quote, not confirmed booking.",
      "Test the page on mobile before sharing it.",
      "Use source tags only for placement, never for customer personal data.",
    ],
    checklistTitle: "Before you publish the link",
    guardrail: {
      body:
        "BizPilot quote pages collect requests for owner review. They do not confirm price, availability, scheduling, payment, or a booked cleaning job.",
      items: [
        "Use website/contact placement first when a platform action label does not match a quote request.",
        "Keep Google Business Profile links crawlable and specific to the business.",
        "Do not add customer names, emails, phone numbers, or message text to UTM tags.",
      ],
      title: "Do not turn a quote request into a fake booking.",
    },
    meta: {
      description:
        "Where cleaning business owners should place a BizPilot quote request link across website, Google Business Profile, Instagram, saved replies, and email signatures.",
      title: "Cleaning Quote Link Placement Guide | BizPilot AI",
    },
    primaryCta: "Join founder pilot",
    references: [
      {
        href: "https://support.google.com/business/answer/13769188?hl=en",
        label: "Google Business Profile business links policies",
        note:
          "Dedicated landing pages, action completion, crawlability, and link-shortener boundaries.",
      },
      {
        href: "https://support.google.com/business/answer/3038177?hl=en",
        label: "Google Business Profile representation guidelines",
        note:
          "Accurate business information, service-area guidance, and website/phone consistency.",
      },
      {
        href: "https://help.instagram.com/362497417173378",
        label: "Instagram profile link help",
        note: "Official profile-link placement path.",
      },
      {
        href: "https://help.instagram.com/1264898753662278",
        label: "Instagram professional inbox saved replies",
        note: "Saved replies for recurring customer messages.",
      },
    ],
    referencesTitle: "Source-backed placement rules",
    replySpeedCta: "Build faster reply habits",
    secondaryCta: "Compare BizPilot",
    sourceLabel: "Source tag",
    templateBody:
      "Replace clean-team with the actual quote slug after setup. Keep tags simple and use one placement source per link.",
    templateTitle: "Tracked link patterns",
    templateUrlLabel: "Example link",
    title: "Where to put your cleaning quote link.",
  },
  replySpeedGuide: {
    badge: "Reply-speed guide",
    board: {
      eyebrow: "Owner review board",
      items: [
        ["Warm request", "Move-out cleaning, next week"],
        ["Missing details", "Rooms, access, photos, timing"],
        ["Draft status", "Ready for owner review"],
        ["Follow-up", "Visible if customer has not replied"],
      ],
      title: "Turn a vague request into a safer manual reply.",
    },
    body:
      "Cleaning quote speed is not about sending anything automatically. It is about capturing the request cleanly, seeing what is missing, preparing a careful draft, and making the owner's next manual action obvious.",
    calendar: [
      {
        actions: [
          "Audit every place customers ask for a quote.",
          "Move the direct quote link above generic contact text.",
          "Use one source tag per placement.",
        ],
        body:
          "Make the quote path easier to find before adding more campaigns.",
        period: "Week 1",
        title: "Fix the quote path first",
      },
      {
        actions: [
          "Write saved replies for price, move-out, deep clean, and recurring requests.",
          "Keep each reply clear that a person will review the request.",
          "Remove any wording that sounds like a confirmed booking.",
        ],
        body:
          "Give the owner a consistent starting point without promising auto-send.",
        period: "Week 2",
        title: "Prepare replies for owner review",
      },
      {
        actions: [
          "Add service-specific context for move-out, office, and deep cleaning.",
          "Ask for photos only when they help quote safely.",
          "Keep forms short enough for mobile customers.",
        ],
        body:
          "Better intake reduces risky guessing and repeated back-and-forth.",
        period: "Week 3",
        title: "Reduce missing details",
      },
      {
        actions: [
          "Review which sources created useful requests.",
          "Track which drafts saved owner time.",
          "Use real pilot notes before publishing proof claims.",
        ],
        body:
          "Measure process quality before claiming customer or revenue results.",
        period: "Week 4",
        title: "Learn from the first replies",
      },
    ],
    calendarBody:
      "This is a lean content and operations calendar for a cleaning owner, not a promise that BizPilot sends messages or guarantees more bookings.",
    calendarTitle: "A four-week reply-speed content plan.",
    checklist: [
      "Know the service type before quoting.",
      "Confirm city or service area before promising availability.",
      "Ask for rooms, approximate size, timing, access, and photos when useful.",
      "Separate urgent jobs from requests that can wait.",
      "Send the final message manually after owner review.",
      "Follow up without pretending the customer already booked.",
    ],
    checklistTitle: "What a safer fast reply should check",
    guardrail: {
      body:
        "Fast reply work is a process improvement. It is not a booking engine, a price guarantee, a revenue promise, or an automatic messaging system.",
      items: [
        "No automatic customer email, SMS, WhatsApp, or Instagram sending is promised.",
        "No price, availability, or appointment is confirmed by the quote form.",
        "No public proof claim should be published until real pilot evidence exists.",
      ],
      title: "Speed still needs business control.",
    },
    meta: {
      description:
        "A practical guide for cleaning businesses to reply to quote requests faster with safer intake, drafts for owner review, and no automatic sending.",
      title: "Faster Cleaning Quote Replies Guide | BizPilot AI",
    },
    primaryCta: "See quote link guide",
    secondaryCta: "Join founder pilot",
    title: "Faster cleaning quote replies without auto-send.",
    workflow: [
      {
        body:
          "Use one direct quote link where customers already ask for price, scope, or availability.",
        signal: "Capture",
        title: "Start with a clean request path.",
      },
      {
        body:
          "Highlight service type, source, timing, service area, and the details still needed before a responsible quote.",
        signal: "Triage",
        title: "Find the missing details quickly.",
      },
      {
        body:
          "Prepare a practical reply draft that asks the right follow-up without inventing price or availability.",
        signal: "Draft",
        title: "Give the owner a safe starting point.",
      },
      {
        body:
          "The owner reviews, edits, copies, and sends the final message through their normal channel.",
        signal: "Review",
        title: "Keep final communication manual.",
      },
    ],
    workflowTitle: "Owner-reviewed reply workflow.",
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
      "Follow one realistic move-out cleaning quote request through the owner view: quote link, organized lead, missing details, AI summary, and a reply draft you approve before sending.",
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
    workspace: {
      actions: ["Review draft", "Copy reply", "Mark contacted"],
      draft: {
        body:
          "Hi Sarah, thanks for reaching out. Could you confirm the approximate square footage, whether appliances need interior cleaning, and any access notes so I can prepare an accurate quote?",
        title: "Reply draft for owner review",
      },
      fields: [
        ["Service", "Move-out cleaning"],
        ["Timing", "Before Friday"],
        ["Area", "Downtown"],
        ["Source", "Website quote link"],
      ],
      guardrails: [
        "Sample demo state",
        "No auto-send",
        "No price invented",
        "No booking confirmed",
      ],
      lead: {
        meta: "Sarah M. - 2-bedroom apartment",
        source: "Website quote link",
        status: "Hot - missing details",
        title: "Move-out cleaning before Friday",
      },
      missing: [
        "Approximate square footage",
        "Appliance interior cleaning",
        "Access notes and preferred arrival window",
      ],
      missingTitle: "Missing before a responsible quote",
      quoteLink: {
        body:
          "The customer starts from a public quote link instead of a scattered inbox thread.",
        label: "Public quote link",
        value: "/quote/spark-shine-cleaning",
      },
      sampleLabel: "Static owner-view demo",
      summary: {
        body:
          "Warm move-out request. Good fit for the service area, but the owner should ask for missing details before quoting.",
        title: "AI summary",
      },
      title: "What the owner sees in BizPilot",
    },
    meta: {
      description:
        "See how BizPilot AI captures a cleaning quote request, organizes the lead, highlights missing details, and prepares a reply for owner review.",
      title: "Cleaning Quote Workflow Demo | BizPilot AI",
    },
    title: "Cleaning quote recovery demo.",
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
        body:
          "Share one quote link from your website, Google Business Profile, Instagram bio, saved replies, or email signature.",
        title: "Capture requests where customers already find you.",
      },
      {
        body:
          "Turn scattered quote messages into one lead record with service, area, timing, contact, source, and missing details.",
        title: "Organize each request before it becomes inbox work.",
      },
      {
        body:
          "See whether a request came from the website, Google, Instagram, Facebook, email, or another quote-link placement.",
        title: "Keep source context visible on the lead.",
      },
      {
        body:
          "Use a practical first response that asks for missing details instead of guessing price, timing, or availability.",
        title: "Prepare the first reply without inventing details.",
      },
      {
        body:
          "Review the draft, adjust the wording, copy it, and send it from the channel you already use.",
        title: "Review, copy, and send manually.",
      },
      {
        body:
          "Keep the next step visible: reply, ask for details, follow up, mark reviewed, or record the manual outcome.",
        title: "Keep follow-up from disappearing.",
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
        "Customer opens the quote link and submits the request",
        "BizPilot organizes service, source, timing, and missing details",
        "AI prepares a practical draft for owner review",
        "You copy, send manually, and keep follow-up visible",
      ],
      title: "From quote link to reply ready to send.",
    },
    roadmap: {
      badge: "Roadmap",
      body:
        "Advanced reporting, Content Studio, integrations, and multi-industry templates are planned after validation.",
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
          {
            answer:
              "Start with the places customers already check: your website, Google Business Profile, Instagram bio, saved replies, and email signature. BizPilot does not require a new integration to make the link useful.",
            question: "Where should a cleaning business place the quote link?",
          },
          {
            answer:
              "Form builders collect answers and stop. BizPilot keeps the quote request connected to source context, missing details, reply drafts for owner review, and follow-up state so the owner can respond without moving into a full CRM.",
            question: "What makes BizPilot different from a form builder?",
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
          {
            answer:
              "No. BizPilot can help collect quote details before a responsible reply, but it does not confirm bookings, schedules, prices, deposits, or invoices.",
            question: "Is BizPilot a booking system?",
          },
          {
            answer:
              "No. SMS, WhatsApp, Instagram, Facebook, and email replies stay manual in the pilot. BizPilot can prepare copy for you to review and paste into your own channel; it does not connect accounts or send messages.",
            question: "Can BizPilot send SMS, WhatsApp, Instagram, or email replies for me?",
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
          {
            answer:
              "Support expectations, refund terms, payment method, setup timing, rollback expectations, restored app/RLS proof, and real-data approval must be confirmed before any paid pilot starts.",
            question: "What has to be confirmed before a paid pilot starts?",
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
          {
            answer:
              "BizPilot can keep safe source context such as website, Google Business Profile, Instagram, Facebook, referrer, or approved UTM fields so owners learn which placements bring quote requests. Customer details should not be sent to analytics.",
            question: "Does BizPilot track where quote requests came from?",
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
          {
            answer:
              "No. FAQPage JSON-LD and clear answers help search systems understand the page, but they do not guarantee indexing, rankings, rich results, AI Overviews, or AI Mode visibility.",
            question: "Will FAQ schema or AI-search content guarantee rankings?",
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
      badge: "Cleaning quote recovery",
      body:
        "BizPilot gathers Google, phone, website, and social context, flags missing quote details, and prepares a draft you review, copy, and send manually.",
      bullets: [
        "One lead view for scattered requests",
        "Missing details before any quote",
        "Review-ready reply, no auto-send",
      ],
      note: "Founder-led pilot. You copy and send. No auto-send or invented pricing.",
      primaryCta: "Join the pilot",
      proofLabel: "Quote rescue path",
      secondaryCta: "See how it works",
      signals: [
        {
          label: "Sources",
          value: "Google, call, social",
        },
        {
          label: "Details",
          value: "Size, access, time",
        },
        {
          label: "Reply",
          value: "Review and copy",
        },
      ],
      title: "Turn missed quote requests into ready replies.",
    },
    meta: {
      description:
        "BizPilot AI helps local service businesses, starting with cleaning, turn messy quote requests into organized leads and reply drafts for owner review.",
      title: "BizPilot AI | Lead Recovery for Cleaning Businesses",
    },
    mockup: {
      boardLabel: "BizPilot hot quote rescue board",
      boardSafety: "Owner review first",
      bizPilotActions: ["Home size", "Appliance interiors", "Access notes", "Preferred time"],
      bizPilotBody: "Ask once for the quote facts that matter.",
      bizPilotTitle: "Details BizPilot surfaces",
      chaosBadge: "Customer may choose the first clear reply",
      chaosHint: "Google search, missed call, and Instagram message connected.",
      chaosSubtitle: "47-minute response gap",
      chaosTitle: "Move-out quote is getting cold",
      clarityBadge: "Owner-ready draft",
      claritySubtitle: "Owner review",
      clarityTitle: "Reply ready to review",
      copyButton: "Review & copy",
      draftBody:
        "Hi Maria, thanks for reaching out. Could you confirm the home size, appliance interiors, access notes, and preferred time so I can prepare an accurate quote?",
      draftTitle: "Ask the right questions once",
      leads: [
        {
          body: "Needs it before Friday",
          title: "Maria - Move-out cleaning",
        },
        {
          body: "Office cleaning - follow-up due",
          title: "Review next",
        },
      ],
      messages: [
        "New",
        "Google + missed call + Instagram",
        "Needs it before Friday",
        "Move-out cleaning",
      ],
      sources: ["Google", "Missed call", "Instagram", "Website", "Text"],
    },
    preview: {
      badges: ["No auto-send", "No made-up prices", "Owner copies and sends"],
      body:
        "One clear snapshot shows the quote risk, the missing details, and the reply the owner can review next.",
      copyButton: "Review & copy",
      cta: "Watch full demo",
      draft: {
        body:
          "Hi Sarah, thanks for reaching out. Could you confirm the approximate square footage, whether appliances need interior cleaning, and any access notes so I can prepare an accurate quote?",
        title: "Reply ready to review",
      },
      organizedLead: {
        fields: [
          ["Service", "Move-out cleaning"],
          ["Deadline", "Before Friday"],
          ["Missing", "square footage, appliances, access notes"],
          ["Next action", "Ask once, then quote responsibly"],
        ],
        title: "Missing details BizPilot surfaces",
      },
      request: {
        quote: '"Maria needs move-out cleaning before Friday."',
        title: "At-risk quote",
      },
      steps: ["Spot the hot request", "Find missing details", "Review the reply"],
      title: "See the risk, missing details, and reply in one view.",
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
      "Support, refund, and payment expectations are confirmed before any paid pilot",
    ],
    nextStepsTitle: "What happens next",
    proof: {
      body:
        "The pilot is designed to create usable proof before any bigger promise: response speed, missing-detail clarity, follow-up visibility, and safe source attribution.",
      guardrail:
        "These are pilot learning metrics, not testimonials, conversion-rate claims, or a performance guarantee.",
      metrics: [
        {
          label: "Response speed",
          note: "Measured as a manual workflow, not auto-send.",
          value: "Time from quote request to owner-reviewed reply",
        },
        {
          label: "Missing-detail clarity",
          note: "The AI must ask for missing details instead of inventing them.",
          value:
            "How often the draft flags service, timing, area, or contact gaps",
        },
        {
          label: "Follow-up visibility",
          note:
            "The dashboard should make the next manual step easy to find.",
          value:
            "Whether unanswered leads stay visible after the first reply",
        },
        {
          label: "Source context",
          note:
            "Website, Google Business Profile, Instagram, or email context stays attached when safely captured.",
          value: "Which quote link placement created the lead",
        },
      ],
      title: "What the pilot will measure",
    },
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
    trustBoundary: {
      items: [
        {
          body:
            "No self-serve checkout is enabled. Payment happens only after approval through a prepared invoice or Stripe Payment Link.",
          title: "Manual payment only",
        },
        {
          body:
            "Response expectations, cancellation, and refund handling are confirmed during onboarding before payment is requested.",
          title: "Support and refund terms first",
        },
        {
          body:
            "The pilot covers quote capture, a lead inbox, AI-assisted drafts, and manual follow-up visibility. It is not booking, invoicing, SMS/WhatsApp, or full CRM software.",
          title: "Narrow product scope",
        },
      ],
      title: "Before any paid pilot starts",
    },
    title: "Simple pilot pricing for cleaning businesses.",
  },
  quoteShell: {
    guardrail:
      "This form does not confirm booking or pricing. The business will review your request and reply.",
    languageMenuLabel: "Quote language",
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
    evidence: {
      body:
        "BizPilot trust claims stay limited to recorded readiness proof and explicit blockers.",
      items: [
        {
          body:
            "Synthetic production smoke, OpenAI provider proof, Auth email/custom SMTP proof, and DB backup/export/restore proof are recorded.",
          title: "Recorded readiness proof",
        },
        {
          body:
            "Authenticated dashboard smoke may create synthetic users, leads, and source metadata only against local Supabase, never managed/non-local production projects.",
          title: "Dashboard QA remains local-only",
        },
        {
          body:
            "Real customer data still requires explicit owner approval before any pilot workspace uses live customer requests.",
          title: "Real data remains blocked",
        },
        {
          body:
            "Paid use still requires support/payment/refund/rollback readiness and strict restored app/dashboard/RLS proof.",
          title: "Paid pilot remains gated",
        },
      ],
      title: "Current evidence and open gates",
    },
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
      "BizPilot aide les entreprises de nettoyage à traiter les demandes résidentielles, commerciales, après déménagement, grand ménage et récurrentes dans un flux manuel de récupération.",
    ctaPrimary: "Rejoindre le pilote",
    ctaSecondary: "Voir la démo",
    detailHelp: {
      body:
        "Quand une demande est vague, BizPilot aide à préparer la bonne question de suivi au lieu de deviner le prix, le moment ou une réservation.",
      title: "Détails manquants que BizPilot peut aider à demander",
    },
    detailSection: {
      body:
        "Un seul panneau de détails garde le service, le secteur, le moment, le canal de contact, la source et les questions de suivi au clair avant la réponse.",
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
        "Le client ouvre votre lien de soumission -> BizPilot organise la demande -> Les détails manquants restent visibles -> L'IA prépare un brouillon -> Vous validez, copiez et envoyez manuellement",
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
  comparison: {
    badge: "Comparaison",
    body:
      "BizPilot ne cherche pas à remplacer tous les outils d'une entreprise de nettoyage. Il cible un moment précis: une demande de soumission arrive, des détails manquent et le propriétaire a besoin d'une prochaine réponse claire sans perdre le contrôle.",
    bestForLabel: "Idéal pour",
    cautionLabel: "À surveiller",
    guardrail: {
      body:
        "BizPilot reste manuel pendant le projet pilote fondateur. Il n'envoie pas automatiquement les messages, n'invente pas les prix, ne confirme pas les réservations, ne remplace pas un CRM, ne gère pas les factures et ne promet pas de revenus.",
      title: "La limite est importante.",
    },
    meta: {
      description:
        "Comparez BizPilot AI avec les CRM, formulaires, outils de réservation et boîtes de réception manuelles pour la récupération des demandes de nettoyage.",
      title: "BizPilot vs CRM, formulaires et outils de réservation | BizPilot AI",
    },
    primaryCta: "Rejoindre le pilote",
    proof: {
      body:
        "Le projet pilote doit vérifier si un flux ciblé de récupération des demandes aide les propriétaires à répondre plus vite et à faire des suivis plus régulièrement.",
      items: [
        "Capter les demandes depuis les endroits déjà partagés",
        "Organiser le service, le moment, le canal de contact et les détails manquants",
        "Préparer un brouillon pratique à valider",
        "Garder l'envoi manuel jusqu'à une approbation explicite de l'automatisation",
      ],
      title: "Le travail est la récupération des demandes, pas la complexité logicielle.",
    },
    rows: [
      {
        bestFor:
          "Une entreprise qui a déjà une équipe formée, des règles de pipeline et un processus de vente large.",
        caution:
          "Peut devenir lourd quand le problème urgent est seulement de répondre plus vite aux demandes de nettoyage.",
        difference:
          "BizPilot commence par la demande de soumission, les détails manquants, les brouillons à valider et la prochaine action manuelle.",
        option: "CRM complet",
      },
      {
        bestFor:
          "Collecter des champs de base quand le propriétaire sait déjà comment traiter chaque demande.",
        caution:
          "Les formulaires s'arrêtent souvent à la capture; il faut encore lire, interpréter, prioriser et répondre.",
        difference:
          "BizPilot transforme la demande en prospect avec contexte de service, détails manquants et brouillon de réponse.",
        option: "Générateur de formulaire",
      },
      {
        bestFor:
          "Travaux confirmés, calendriers, horaires, dépôts et opérations de réservation.",
        caution:
          "Une demande de soumission n'est pas toujours prête à devenir une réservation, surtout si le prix ou la portée est incertain.",
        difference:
          "BizPilot évite les promesses de réservation et aide à poser la bonne question de suivi avant de s'engager.",
        option: "Réservation ou facturation",
      },
      {
        bestFor:
          "Très petit volume où chaque demande est facile à retenir et à traiter rapidement.",
        caution:
          "Les demandes venant de Google, Instagram, du site, des courriels et des textos deviennent faciles à manquer pendant les journées chargées.",
        difference:
          "BizPilot donne au propriétaire un espace de récupération tout en gardant la communication finale manuelle.",
        option: "Boîtes de réception et tableurs",
      },
    ],
    secondaryCta: "Voir la démo",
    title: "BizPilot vs CRM, formulaires et réservations.",
  },
  quoteLinkGuide: {
    badge: "Placement du lien",
    body:
      "Utilisez un seul lien clair de demande de soumission partout où un prospect chaud demande déjà un prix, une portée ou une disponibilité. Le lien doit rester honnête, direct et étiqueté par source afin que le propriétaire voie d'où vient la demande.",
    channels: [
      {
        body:
          "Placez le lien la ou les visiteurs decident deja s'ils vont contacter l'entreprise de nettoyage.",
        caution:
          "Ne cachez pas le seul chemin de soumission dans un pied de page ou un long paragraphe de contact.",
        steps: [
          "Ajoutez un bouton principal Demander une soumission de nettoyage sur la page d'accueil.",
          "Repetez-le sur les pages contact, residentiel, demenagement, bureaux et grand menage.",
          "Envoyez le bouton vers la page dediee de demande de soumission, pas vers un hub generique.",
        ],
        tag: "website",
        template:
          "https://bizpilo.com/quote/clean-team?source=website&utm_source=website&utm_medium=cta&utm_campaign=quote_link",
        title: "Boutons du site web",
      },
      {
        body:
          "Utilisez le site web ou le chemin de contact du profil pour une demande de soumission claire. Utilisez les liens d'action seulement quand l'action choisie correspond vraiment a ce que la page permet de faire.",
        caution:
          "Ne presentez pas une demande de soumission comme une reservation confirmee. Les liens d'entreprise Google peuvent etre refuses si la page ne complete pas l'action choisie.",
        steps: [
          "Utilisez un profil d'entreprise verifie et gardez le nom, la zone de service, le site web et le telephone coherents.",
          "Utilisez une page dediee pour cette entreprise ou cet emplacement.",
          "Gardez la page accessible aux robots, en HTTPS, sans raccourcisseur ni connexion obligatoire.",
        ],
        tag: "google_business_profile",
        template:
          "https://bizpilo.com/quote/clean-team?source=google_business_profile&utm_source=google-business-profile&utm_medium=profile&utm_campaign=quote_link",
        title: "Google Business Profile",
      },
      {
        body:
          "Faites pointer le lien du profil directement vers la demande de soumission lorsque Instagram est une vraie source de prospects.",
        caution:
          "Si la bio contient deja plusieurs liens, gardez le lien de soumission pres du haut avec une etiquette claire.",
        steps: [
          "Ajoutez l'URL de demande de soumission dans les liens du profil.",
          "Utilisez une etiquette simple comme Demander une soumission de nettoyage.",
          "Testez le lien sur mobile apres l'enregistrement.",
        ],
        tag: "instagram_bio",
        template:
          "https://bizpilo.com/quote/clean-team?source=instagram&utm_source=instagram&utm_medium=bio&utm_campaign=quote_link",
        title: "Bio Instagram",
      },
      {
        body:
          "Les reponses enregistrees transforment les DM repetitifs en chemin d'intake plus clair, tout en gardant la reponse manuelle.",
        caution:
          "Ne mettez pas le nom, le telephone ou le message du client dans les balises de suivi.",
        steps: [
          "Creez une reponse enregistree pour les demandes de soumission.",
          "Ajoutez une phrase indiquant que l'entreprise revise chaque demande.",
          "Collez le lien de soumission suivi apres cette phrase.",
        ],
        tag: "saved_reply",
        template:
          "https://bizpilo.com/quote/clean-team?source=saved_reply&utm_source=instagram&utm_medium=saved_reply&utm_campaign=quote_link",
        title: "Reponses enregistrees et DM",
      },
      {
        body:
          "La signature courriel capte les referrals, suivis et anciens clients sans ajouter un autre outil.",
        caution:
          "Gardez la signature courte afin que le lien soit visible sur mobile.",
        steps: [
          "Ajoutez une ligne sous le numero de telephone ou le site web.",
          "Utilisez un texte comme Demander une soumission de nettoyage.",
          "Utilisez le meme lien pour chaque membre de l'equipe jusqu'a l'approbation de sources separees.",
        ],
        tag: "email_signature",
        template:
          "https://bizpilo.com/quote/clean-team?source=email_signature&utm_source=email&utm_medium=signature&utm_campaign=quote_link",
        title: "Signature courriel",
      },
    ],
    checklist: [
      "Utilisez la page directe HTTPS, pas un raccourcisseur.",
      "Gardez la page dediee a la bonne entreprise ou au bon emplacement.",
      "Dites demande de soumission, pas reservation confirmee.",
      "Testez la page sur mobile avant de la partager.",
      "Utilisez les balises seulement pour le placement, jamais pour les donnees personnelles du client.",
    ],
    checklistTitle: "Avant de publier le lien",
    guardrail: {
      body:
        "Les pages de soumission BizPilot collectent des demandes pour revision par le proprietaire. Elles ne confirment pas le prix, la disponibilite, l'horaire, le paiement ou un travail de nettoyage reserve.",
      items: [
        "Utilisez d'abord le site web ou le contact quand l'etiquette d'action d'une plateforme ne correspond pas a une demande de soumission.",
        "Gardez les liens Google Business Profile accessibles et propres a l'entreprise.",
        "N'ajoutez pas de noms, courriels, numeros de telephone ou messages clients dans les balises UTM.",
      ],
      title: "Ne transformez pas une soumission en fausse réservation.",
    },
    meta: {
      description:
        "Où placer un lien de demande de soumission BizPilot pour une entreprise de nettoyage: site web, Google Business Profile, Instagram, réponses enregistrées et signatures courriel.",
      title: "Guide du lien de soumission de nettoyage | BizPilot AI",
    },
    primaryCta: "Rejoindre le pilote",
    references: [
      {
        href: "https://support.google.com/business/answer/13769188?hl=en",
        label: "Regles Google Business Profile pour les liens d'entreprise",
        note:
          "Pages dediees, action completee, acces aux robots et limites des raccourcisseurs.",
      },
      {
        href: "https://support.google.com/business/answer/3038177?hl=en",
        label: "Regles de representation Google Business Profile",
        note:
          "Informations exactes, zones de service et coherence du site web et du telephone.",
      },
      {
        href: "https://help.instagram.com/362497417173378",
        label: "Aide Instagram pour le lien de profil",
        note: "Chemin officiel pour ajouter un lien de profil.",
      },
      {
        href: "https://help.instagram.com/1264898753662278",
        label: "Reponses enregistrees dans l'inbox professionnelle Instagram",
        note: "Reponses enregistrees pour les messages recurrents.",
      },
    ],
    referencesTitle: "Règles de placement vérifiées",
    replySpeedCta: "Améliorer la vitesse de réponse",
    secondaryCta: "Comparer BizPilot",
    sourceLabel: "Balise source",
    templateBody:
      "Remplacez clean-team par le vrai slug de soumission apres la configuration. Gardez les balises simples et utilisez une source de placement par lien.",
    templateTitle: "Modèles de liens suivis",
    templateUrlLabel: "Lien exemple",
    title: "Où placer votre lien de soumission de nettoyage.",
  },
  replySpeedGuide: {
    badge: "Guide de réponse rapide",
    board: {
      eyebrow: "Tableau de révision",
      items: [
        ["Demande chaude", "Nettoyage avant déménagement, semaine prochaine"],
        ["Détails manquants", "Pièces, accès, photos, moment souhaité"],
        ["Brouillon", "Prêt pour validation"],
        ["Suivi", "Visible si le client ne répond pas"],
      ],
      title: "Transformer une demande vague en réponse manuelle plus sûre.",
    },
    body:
      "Répondre plus vite à une soumission de nettoyage ne veut pas dire envoyer automatiquement. Il faut capter la demande clairement, voir ce qui manque, préparer un brouillon prudent et rendre la prochaine action manuelle évidente.",
    calendar: [
      {
        actions: [
          "Auditer chaque endroit où les clients demandent une soumission.",
          "Mettre le lien de soumission direct avant le texte de contact générique.",
          "Utiliser une seule balise source par emplacement.",
        ],
        body:
          "Rendre le chemin de soumission plus facile avant d'ajouter d'autres campagnes.",
        period: "Semaine 1",
        title: "Corriger le chemin de soumission",
      },
      {
        actions: [
          "Préparer des réponses enregistrées pour prix, déménagement, grand ménage et récurrent.",
          "Dire clairement qu'une personne révise chaque demande.",
          "Retirer tout texte qui ressemble à une réservation confirmée.",
        ],
        body:
          "Donner un point de départ constant au propriétaire sans promettre l'envoi automatique.",
        period: "Semaine 2",
        title: "Préparer les réponses à valider",
      },
      {
        actions: [
          "Ajouter du contexte pour déménagement, bureaux et grand ménage.",
          "Demander des photos seulement quand elles aident à soumissionner prudemment.",
          "Garder les formulaires assez courts pour les clients sur mobile.",
        ],
        body:
          "Une meilleure collecte réduit les devinettes risquées et les allers-retours.",
        period: "Semaine 3",
        title: "Réduire les détails manquants",
      },
      {
        actions: [
          "Réviser quelles sources ont créé des demandes utiles.",
          "Noter quels brouillons ont sauvé du temps au propriétaire.",
          "Attendre de vraies notes de pilote avant de publier des preuves.",
        ],
        body:
          "Mesurer la qualité du processus avant de promettre des résultats clients ou revenus.",
        period: "Semaine 4",
        title: "Apprendre des premières réponses",
      },
    ],
    calendarBody:
      "C'est un calendrier léger de contenu et d'opérations pour une entreprise de nettoyage, pas une promesse que BizPilot envoie des messages ou garantit plus de réservations.",
    calendarTitle: "Un plan de contenu sur quatre semaines.",
    checklist: [
      "Connaître le type de service avant de soumissionner.",
      "Confirmer la ville ou la zone avant de promettre une disponibilité.",
      "Demander pièces, taille approximative, moment, accès et photos au besoin.",
      "Séparer les travaux urgents des demandes qui peuvent attendre.",
      "Envoyer le message final manuellement après validation.",
      "Faire un suivi sans prétendre que le client a déjà réservé.",
    ],
    checklistTitle: "Ce qu'une réponse rapide plus sûre doit vérifier",
    guardrail: {
      body:
        "La vitesse de réponse est une amélioration de processus. Ce n'est pas un moteur de réservation, une garantie de prix, une promesse de revenus ou un système d'envoi automatique.",
      items: [
        "Aucun envoi automatique par courriel, SMS, WhatsApp ou Instagram n'est promis.",
        "Aucun prix, disponibilité ou rendez-vous n'est confirmé par le formulaire.",
        "Aucune preuve publique ne doit être publiée avant des données réelles de pilote.",
      ],
      title: "La vitesse doit rester sous contrôle.",
    },
    meta: {
      description:
        "Guide pratique pour aider les entreprises de nettoyage à répondre plus vite aux demandes de soumission avec une collecte plus sûre, des brouillons à valider et aucun envoi automatique.",
      title: "Guide de réponse rapide aux soumissions | BizPilot AI",
    },
    primaryCta: "Voir le guide du lien",
    secondaryCta: "Rejoindre le pilote",
    title: "Réponses plus rapides, sans envoi automatique.",
    workflow: [
      {
        body:
          "Utiliser un lien direct là où les clients demandent déjà un prix, une portée ou une disponibilité.",
        signal: "Capter",
        title: "Commencer par un chemin clair.",
      },
      {
        body:
          "Mettre en évidence le service, la source, le moment, la zone et les détails encore nécessaires.",
        signal: "Trier",
        title: "Trouver vite les détails manquants.",
      },
      {
        body:
          "Préparer un brouillon pratique qui pose la bonne question sans inventer prix ou disponibilité.",
        signal: "Rédiger",
        title: "Donner un départ sûr au propriétaire.",
      },
      {
        body:
          "Le propriétaire révise, modifie, copie et envoie le message final dans son canal habituel.",
        signal: "Valider",
        title: "Garder la communication finale manuelle.",
      },
    ],
    workflowTitle: "Le flux de réponse validé par le propriétaire.",
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
      "Suivez une demande réaliste de nettoyage après déménagement dans la vue propriétaire : lien de soumission, prospect organisé, détails manquants, résumé IA et brouillon à valider avant l'envoi.",
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
    workspace: {
      actions: ["Réviser le brouillon", "Copier la réponse", "Marquer contacté"],
      draft: {
        body:
          "Bonjour Sarah, merci pour votre message. Pouvez-vous confirmer la superficie approximative, les électroménagers à nettoyer et les notes d'accès afin que je prépare une soumission exacte?",
        title: "Brouillon à valider",
      },
      fields: [
        ["Service", "Nettoyage après déménagement"],
        ["Moment", "Avant vendredi"],
        ["Secteur", "Centre-ville"],
        ["Source", "Lien de soumission du site"],
      ],
      guardrails: [
        "État démo statique",
        "Aucun envoi automatique",
        "Aucun prix inventé",
        "Aucune réservation confirmée",
      ],
      lead: {
        meta: "Sarah M. - appartement 2 chambres",
        source: "Lien de soumission du site",
        status: "Chaud - détails manquants",
        title: "Nettoyage après déménagement avant vendredi",
      },
      missing: [
        "Superficie approximative",
        "Nettoyage intérieur des électroménagers",
        "Notes d'accès et fenêtre d'arrivée préférée",
      ],
      missingTitle: "Manquant avant une soumission responsable",
      quoteLink: {
        body:
          "Le client commence par un lien de soumission public au lieu d'un fil dispersé.",
        label: "Lien de soumission public",
        value: "/quote/spark-shine-cleaning",
      },
      sampleLabel: "Démo statique de la vue propriétaire",
      summary: {
        body:
          "Demande chaude de nettoyage après déménagement. Bonne zone de service, mais le propriétaire doit demander les détails manquants avant de chiffrer.",
        title: "Résumé IA",
      },
      title: "Ce que le propriétaire voit dans BizPilot",
    },
    meta: {
      description:
        "Voyez comment BizPilot AI capte une demande de soumission de nettoyage, organise le prospect, signale les détails manquants et prépare une réponse à valider.",
      title: "Démo du flux de soumission de nettoyage | BizPilot AI",
    },
    title: "Démo de récupération de soumission.",
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
          "Partagez un seul lien depuis votre site, Google Business Profile, Instagram, vos réponses enregistrées ou votre signature courriel.",
        title: "Capter les demandes là où les clients vous trouvent déjà.",
      },
      {
        body:
          "Transformez les messages dispersés en fiche avec service, secteur, moment, contact, source et détails manquants.",
        title: "Organiser chaque demande avant qu'elle devienne du travail d'inbox.",
      },
      {
        body:
          "Voyez si la demande vient du site web, de Google, d'Instagram, de Facebook, d'un courriel ou d'un autre placement du lien.",
        title: "Garder la source visible sur le prospect.",
      },
      {
        body:
          "Utilisez une première réponse pratique qui demande les détails manquants au lieu de deviner le prix, le moment ou la disponibilité.",
        title: "Préparer la première réponse sans inventer de détails.",
      },
      {
        body:
          "Validez le brouillon, ajustez le texte, copiez-le et envoyez-le depuis le canal que vous utilisez déjà.",
        title: "Valider, copier et envoyer manuellement.",
      },
      {
        body:
          "Gardez la prochaine action visible : répondre, demander des détails, faire un suivi, marquer traité ou noter le résultat manuel.",
        title: "Empêcher les suivis de disparaître.",
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
        "Le client ouvre le lien et envoie sa demande",
        "BizPilot organise le service, la source, le moment et les détails manquants",
        "L'IA prépare un brouillon pratique à valider",
        "Vous copiez, envoyez manuellement et gardez le suivi visible",
      ],
      title: "Du lien de soumission à la réponse à valider.",
    },
    roadmap: {
      badge: "Feuille de route",
      body:
        "Rapports avancés, Content Studio, intégrations et modèles pour d'autres secteurs sont prévus après validation.",
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
          {
            answer:
              "Commencez par les endroits que les clients consultent déjà: votre site web, votre profil Google Business, votre bio Instagram, vos réponses enregistrées et votre signature courriel. BizPilot n'exige pas une nouvelle intégration pour rendre le lien utile.",
            question: "Où placer le lien de soumission?",
          },
          {
            answer:
              "Un formulaire recueille des réponses, puis s'arrête. BizPilot garde la demande liée à la source, aux détails manquants, aux brouillons à valider et à l'état du suivi afin que le propriétaire puisse répondre sans passer à un CRM complet.",
            question: "Qu'est-ce qui différencie BizPilot d'un formulaire?",
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
          {
            answer:
              "Non. BizPilot peut aider à recueillir les détails avant une réponse responsable, mais il ne confirme pas les réservations, les horaires, les prix, les dépôts ou les factures.",
            question: "BizPilot est-il un système de réservation?",
          },
          {
            answer:
              "Non. Les réponses par SMS, WhatsApp, Instagram, Facebook et courriel restent manuelles pendant le projet pilote. BizPilot peut préparer un texte à valider et à coller dans votre propre canal; il ne connecte pas de comptes et n'envoie pas de messages.",
            question: "BizPilot peut-il envoyer des réponses par SMS, WhatsApp, Instagram ou courriel?",
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
          {
            answer:
              "Les attentes de soutien, les conditions de remboursement, le mode de paiement, le calendrier de configuration, le plan de retour arrière, la preuve app/RLS restaurée et l'approbation des données réelles doivent être confirmés avant tout projet pilote payant.",
            question: "Qu'est-ce qui doit être confirmé avant un pilote payant?",
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
          {
            answer:
              "BizPilot peut garder un contexte de source sécuritaire comme le site web, Google Business Profile, Instagram, Facebook, le référent ou des champs UTM approuvés afin d'aider le propriétaire à voir quels placements génèrent des demandes. Les détails client ne doivent pas être envoyés à l'analytique.",
            question: "BizPilot suit-il d'où viennent les demandes?",
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
          {
            answer:
              "Non. Le JSON-LD FAQPage et les réponses claires aident les systèmes de recherche à comprendre la page, mais ne garantissent pas l'indexation, le classement, les résultats enrichis, les AI Overviews ni la visibilité dans AI Mode.",
            question: "Le schéma FAQ ou le contenu pour recherche IA garantit-il le classement?",
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
      badge: "Récupération de soumissions",
      body:
        "BizPilot regroupe Google, téléphone, site web et réseaux sociaux, repère les détails manquants et prépare un brouillon à valider, copier et envoyer manuellement.",
      bullets: [
        "Vue unique des demandes dispersées",
        "Détails manquants avant la soumission",
        "Réponse à valider, aucun envoi auto",
      ],
      note:
        "Projet pilote guidé. Vous copiez et envoyez. Aucun envoi automatique ni prix inventé.",
      primaryCta: "Rejoindre le pilote",
      proofLabel: "Parcours de sauvetage",
      secondaryCta: "Voir le flux",
      signals: [
        {
          label: "Sources",
          value: "Google, appel, social",
        },
        {
          label: "Détails",
          value: "Taille, accès, moment",
        },
        {
          label: "Réponse",
          value: "Valider et copier",
        },
      ],
      title:
        "Transformez les demandes manquées en réponses prêtes.",
    },
    meta: {
      description:
        "BizPilot AI aide les entreprises de services locales, d'abord le nettoyage, à transformer les demandes de soumission en prospects organisés et brouillons à valider.",
      title: "BizPilot AI | Récupération des demandes",
    },
    mockup: {
      boardLabel: "Tableau BizPilot de sauvetage de soumission urgente",
      boardSafety: "Validation propriétaire",
      bizPilotActions: ["Taille du logement", "Intérieur des électros", "Notes d'accès", "Moment souhaité"],
      bizPilotBody: "Demandez une fois les faits utiles pour la soumission.",
      bizPilotTitle: "Détails repérés par BizPilot",
      chaosBadge: "Le client peut choisir la première réponse claire",
      chaosHint: "Recherche Google, appel manqué et message Instagram reliés.",
      chaosSubtitle: "47 minutes sans réponse",
      chaosTitle: "La demande de déménagement refroidit",
      clarityBadge: "Brouillon à valider",
      claritySubtitle: "Validation",
      clarityTitle: "Réponse prête à valider",
      copyButton: "Réviser et copier",
      draftBody:
        "Bonjour Maria, merci pour votre message. Pouvez-vous confirmer la taille du logement, l'intérieur des électros, les notes d'accès et le moment souhaité afin que je prépare une soumission exacte?",
      draftTitle: "Poser les bonnes questions une fois",
      leads: [
        {
          body: "Besoin avant vendredi",
          title: "Maria - Nettoyage après déménagement",
        },
        {
          body: "Bureaux - suivi dû",
          title: "À réviser ensuite",
        },
      ],
      messages: [
        "Nouveau",
        "Google + appel manqué + Instagram",
        "Besoin avant vendredi",
        "Nettoyage après déménagement",
      ],
      sources: ["Google", "Appel manqué", "Instagram", "Site web", "Texto"],
    },
    preview: {
      badges: [
        "Aucun envoi automatique",
        "Aucun prix inventé",
        "Vous copiez et envoyez",
      ],
      body:
        "Une vue claire montre le risque, les détails manquants et la réponse que vous pouvez valider ensuite.",
      copyButton: "Réviser et copier",
      cta: "Voir la démo complète",
      draft: {
        body:
          "Bonjour Sarah, merci pour votre message. Pouvez-vous confirmer la superficie, les électroménagers à nettoyer et les notes d'accès afin que je prépare une soumission exacte?",
        title: "Réponse prête à valider",
      },
      organizedLead: {
        fields: [
          ["Service", "nettoyage après déménagement"],
          ["Échéance", "avant vendredi"],
          ["Manquant", "superficie, électroménagers, notes d'accès"],
          ["Prochaine action", "demander une fois, puis soumissionner prudemment"],
        ],
        title: "Détails manquants repérés par BizPilot",
      },
      request: {
        quote:
          "\"Maria a besoin d'un nettoyage après déménagement avant vendredi.\"",
        title: "Soumission à risque",
      },
      steps: ["Repérer le risque", "Trouver les détails manquants", "Valider la réponse"],
      title: "Voyez le risque, les détails manquants et la réponse.",
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
      "Les attentes de soutien, de remboursement et de paiement sont confirmées avant tout projet pilote payant",
    ],
    nextStepsTitle: "Ce qui se passe ensuite",
    proof: {
      body:
        "Le projet pilote est conçu pour créer une preuve utile avant toute promesse plus large : vitesse de réponse, clarté des détails manquants, visibilité des suivis et attribution sécuritaire de la source.",
      guardrail:
        "Ce sont des métriques d'apprentissage du projet pilote, pas des témoignages, des promesses de taux de conversion ni une garantie de performance.",
      metrics: [
        {
          label: "Vitesse de réponse",
          note: "Mesuré comme flux manuel, sans envoi automatique.",
          value:
            "Temps entre la demande de soumission et la réponse validée par le propriétaire",
        },
        {
          label: "Clarté des détails manquants",
          note:
            "L'IA doit demander les détails manquants au lieu de les inventer.",
          value:
            "Fréquence à laquelle le brouillon signale les lacunes de service, délai, zone ou contact",
        },
        {
          label: "Visibilité des suivis",
          note:
            "Le tableau de bord doit rendre la prochaine étape manuelle facile à trouver.",
          value:
            "Capacité à garder les prospects sans réponse visibles après la première réponse",
        },
        {
          label: "Contexte de source",
          note:
            "Site web, Profil d'entreprise Google, Instagram ou courriel restent attachés quand ils sont captés de façon sécuritaire.",
          value: "Emplacement du lien de soumission qui a créé le prospect",
        },
      ],
      title: "Ce que le projet pilote mesurera",
    },
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
    trustBoundary: {
      items: [
        {
          body:
            "Aucun paiement libre-service n'est activé. Le paiement arrive seulement après approbation, avec une facture préparée ou un Stripe Payment Link.",
          title: "Paiement manuel seulement",
        },
        {
          body:
            "Les attentes de réponse, l'annulation et le traitement des remboursements sont confirmés pendant l'accueil avant toute demande de paiement.",
          title: "Soutien et remboursement d'abord",
        },
        {
          body:
            "Le pilote couvre la capture des demandes, une boîte de prospects, des brouillons assistés par IA et une visibilité de suivi manuel. Ce n'est pas un outil de réservation, de facturation, de SMS/WhatsApp ni un CRM complet.",
          title: "Portée produit limitée",
        },
      ],
      title: "Avant tout projet pilote payant",
    },
    title: "Tarifs pilotes simples pour le nettoyage.",
  },
  quoteShell: {
    guardrail:
      "Ce formulaire ne confirme ni réservation ni prix. L'entreprise révisera votre demande et vous répondra.",
    languageMenuLabel: "Langue de la soumission",
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
    evidence: {
      body:
        "Les affirmations de confiance de BizPilot restent limitées aux preuves de préparation enregistrées et aux blocages explicites.",
      items: [
        {
          body:
            "Les preuves synthétiques de production, du fournisseur OpenAI, du courriel d'authentification/custom SMTP et de la sauvegarde/restauration DB sont enregistrées.",
          title: "Preuves de préparation enregistrées",
        },
        {
          body:
            "Le smoke authentifié du tableau de bord peut créer des utilisateurs, prospects et métadonnées de source synthétiques seulement avec Supabase local, jamais avec des projets gérés/non locaux ou de production.",
          title: "QA tableau de bord locale seulement",
        },
        {
          body:
            "Les données réelles de clients exigent encore une approbation explicite du propriétaire avant qu'un espace pilote utilise des demandes réelles.",
          title: "Données réelles encore bloquées",
        },
        {
          body:
            "L'utilisation payante exige encore la préparation soutien/paiement/remboursement/retour arrière et une preuve stricte d'application restaurée, de tableau de bord et de RLS.",
          title: "Pilote payant encore soumis aux gates",
        },
      ],
      title: "Preuves actuelles et gates ouverts",
    },
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
