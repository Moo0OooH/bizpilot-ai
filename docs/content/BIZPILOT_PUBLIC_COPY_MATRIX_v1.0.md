# BizPilot Public Copy Matrix v1.0

Date: 2026-06-21
Status: Active L2 applied content and localization contract.
Scope: Public marketing routes, legal routes, auth shells, safe quote shells,
and report shells when present.

## Purpose

This matrix defines the canonical English source copy, approved Canadian-French
intent, component role, visual budget, and product-boundary guardrails before
any further public layout edits. L1 must polish English against this contract.
L2 must implement professional fr-CA localization against this contract. L3/L4
must enforce the sizing and geometry budgets.

This L0 phase is documentation-only. It does not approve dashboard D1 and does
not approve database, auth, RLS, AI provider, billing/payment, production data
flow, real customer data, pricing, or unsupported product-capability changes.

## Canonical Terms

| Term | Meaning | Approved English Use |
| --- | --- | --- |
| quote request | Customer request for pricing or service availability context. | Use for customer-submitted requests. |
| quote | Price/estimate prepared by the business. | Do not use as a synonym for request. |
| lead | Organized potential customer/request in BizPilot. | Use after BizPilot has captured/organized the request. |
| prospect | French equivalent for lead. | Avoid English `lead` in fr-CA visible copy unless product context requires it. |
| draft reply | AI-assisted text awaiting owner review. | Prefer over `AI draft card`. |
| owner review | Review/edit before manual sending. | Use `reviewed by you` in owner-facing compact copy. |
| manual send | Owner sends through their own channel. | Never imply BizPilot sends automatically. |

## Matrix Columns

Each row uses this meaning:

- **ID**: Stable message identifier for tests/docs.
- **Route**: Public route or route family.
- **Role**: Component role.
- **Canonical EN**: English source target.
- **Intent**: What the message must communicate.
- **Approved fr-CA**: Approved Canadian-French target.
- **Prohibited Claims**: Claims the string must not imply.
- **Target**: Approximate character target for visible copy.
- **Line Budget**: Required line behavior at reference viewports.
- **Wrap**: Whether visible wrapping is allowed.
- **A11y/Full Label**: Required fuller meaning when visible copy is compact.

## Global Shell

| ID | Route | Role | Canonical EN | Intent | Approved fr-CA | Prohibited Claims | Target | Line Budget | Wrap | A11y/Full Label |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| shell.brand.tagline | all public marketing | brand tagline | Lead recovery for cleaning businesses | State market and value quickly. | Suivi des demandes pour entreprises de nettoyage | multi-industry, CRM | EN <= 45; FR <= 55 | 1 line desktop; hidden/collapsed before wrap | No on desktop | Full brand link: BizPilot AI, lead recovery for cleaning businesses. |
| shell.nav.features | all public marketing | navigation label | Features | Route to capabilities. | Fonctions | none | <= 12 | 1 line expanded header | No | Link to product features. |
| shell.nav.cleaning | all public marketing | navigation label | Cleaning | Route to cleaning-specific page. | Nettoyage | other verticals active | <= 14 | 1 line expanded header | No | Link to cleaning business use cases. |
| shell.nav.trust | all public marketing | navigation label | Trust | Route to trust/safety page. | Confiance | compliance guarantee | <= 12 | 1 line expanded header | No | Link to trust and owner-control page. |
| shell.nav.demo | all public marketing | navigation label | Demo | Route to workflow demo. | Démo | automated booking | <= 8 | 1 line expanded header | No | Link to manual workflow demo. |
| shell.nav.pricing | all public marketing | navigation label | Pricing | Route to pilot pricing. | Prix | billing automation | <= 10 | 1 line expanded header | No | Link to pilot pricing. |
| shell.nav.pilot | all public marketing | navigation label | Pilot | Route to founder pilot page. | Pilote | paid launch approved | <= 10 | 1 line expanded header | No | Link to founder pilot request page. |
| shell.auth.signin | all public marketing | CTA/link | Sign in | Owner access, not marketing CTA. | Connexion | self-serve availability | <= 12 | 1 line | No | Sign in to approved owner workspace. |
| shell.cta.primary | all public marketing | CTA | Join founder pilot | Primary conversion. | Rejoindre le pilote | paid pilot approved | EN <= 20; FR <= 20 | 1 line at all supported viewports | No | Join the BizPilot founder pilot. |
| shell.language | all public marketing | field label/control | Homepage language | Choose interface language. | Langue de la page | none | compact | 1 line control | No | Current language and language menu. |
| shell.theme | all public marketing | theme control | Change theme | Switch Light/Dark/device theme. | Modifier le thème | none | icon-only visible | no layout shift | No | Theme: Light/Dark/System; change theme. |

## Homepage

| ID | Route | Role | Canonical EN | Intent | Approved fr-CA | Prohibited Claims | Target | Line Budget | Wrap | A11y/Full Label |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| home.hero.eyebrow | / | eyebrow | Built for cleaning businesses first | Cleaning-first positioning. | Pour les entreprises de nettoyage, d'abord. | multi-industry active | EN <= 40; FR <= 48 | 1 line >= 768; max 2 mobile | Yes on mobile | Cleaning businesses are the first target market. |
| home.hero.h1 | / | hero heading | Stop losing cleaning quote requests to slow replies. | Slow replies cost quote opportunities. | Ne perdez plus de soumissions faute de réponse rapide. | guaranteed revenue | EN <= 55; FR <= 58 | max 3 lines at 1440/1920; max 4 at 1280/1366/mobile | Yes | Main page heading. |
| home.hero.body | / | hero paragraph | Capture quote requests, organize leads, and prepare replies for owner review — without auto-send. | Explain product loop and owner control. | Centralisez les demandes, organisez les prospects et préparez des réponses à valider — sans envoi automatique. | auto-send, autonomous AI | EN <= 100; FR <= 115 | max 3 lines >= 1280; max 4 at 1024 | Yes | Product supports capture, organization, draft prep, owner review, manual send. |
| home.hero.cta.primary | / | CTA | Join founder pilot | Start founder-pilot conversion. | Rejoindre le pilote | paid launch | <= 20 | 1 line all viewports | No | Join the BizPilot founder pilot. |
| home.hero.cta.secondary | / | CTA | Watch demo | Open workflow demo. | Voir la démo | live automation | <= 16 | 1 line all viewports | No | Watch the manual lead recovery demo. |
| home.hero.badge.no-auto | / | status badge | No auto-send | Manual-control guardrail. | Aucun envoi automatique | automatic messaging | EN <= 14; FR <= 24 | 1 line preferred; max 2 mobile | Yes mobile | BizPilot does not send customer messages automatically. |
| home.hero.badge.ai | / | status badge | AI drafts reviewed by you | AI is assistive and owner-reviewed. | Brouillons IA validés par vous | autonomous AI | EN <= 28; FR <= 32 | 1 line >= 768; max 2 mobile | Yes | AI drafts require owner validation. |
| home.hero.badge.manual | / | status badge | Manual copy and send | Owner sends externally. | Copie et envoi manuels | in-app send automation | EN <= 22; FR <= 25 | 1 line >= 768; max 2 mobile | Yes | Owner copies and sends through their own channel. |
| home.mockup.title | / | status/card title | New quote request | Show realistic incoming request. | Nouvelle demande | booked job | <= 20 | 1 line | No | New customer quote request. |
| home.mockup.status | / | status badge | Needs reply | Request waits for owner response. | À répondre | SLA guarantee | <= 14 | 1 line nowrap | No | This quote request needs an owner reply. |
| home.mockup.service.label | / | field label | Service | Field label. | Service | none | <= 10 | 1 line | No | Requested cleaning service. |
| home.mockup.property.label | / | field label | Property | Field label. | Propriété | none | <= 10 | 1 line | No | Property details. |
| home.mockup.timing.label | / | field label | Timing | Field label. | Moment | none | <= 10 | 1 line | No | Requested timing. |
| home.mockup.status.label | / | field label | Status | Field label. | Statut | none | <= 10 | 1 line | No | Lead status. |
| home.mockup.draft.title | / | card title | Suggested reply | Introduce draft without overclaim. | Brouillon suggéré | AI sends automatically | EN <= 18; FR <= 20 | 1 line | No | AI-assisted draft for owner review. |
| home.mockup.draft.tag | / | status badge | AI drafts. You send. | Owner remains sender. | L'IA prépare. Vous envoyez. | auto-send | EN <= 22; FR <= 30 | 1 line desktop; max 2 mobile | Yes mobile | AI prepares the draft; the owner sends manually. |
| home.mockup.copy | / | button | Copy reply | Manual copy action. | Copier la réponse | sent confirmation | <= 18 | 1 line | No | Copy the reply; it is not sent automatically. |
| home.problem.title | / | section title | Your next customer may already be waiting. | Urgency without guarantee. | Votre prochain client attend peut-être déjà. | guaranteed jobs | EN <= 48; FR <= 52 | max 2 desktop; max 3 mobile | Yes | Problem section heading. |
| home.problem.card.1 | / | card title/body | Messages get buried | Requests can be missed across channels. | Les messages se perdent | channel automation | title <= 28; body <= 90 | title max 2; body target 3 | Yes | Explain missed quote requests. |
| home.problem.card.2 | / | card title/body | Replies take too long | Customers contact competitors. | Les réponses prennent trop de temps | guaranteed conversion | title <= 28; body <= 90 | title max 2; body target 3 | Yes | Explain slow response risk. |
| home.problem.card.3 | / | card title/body | No ready reply | Owners rewrite first replies. | Aucune réponse prête | automatic send | title <= 28; body <= 90 | title max 2; body target 3 | Yes | Explain repeated reply work. |
| home.solution.title | / | section title | A simple lead recovery system for cleaning businesses. | Position product simply. | Un système simple pour récupérer les demandes de nettoyage. | CRM/full platform | EN <= 62; FR <= 66 | max 2 desktop; max 3 mobile | Yes | Solution section heading. |
| home.demo.title | / | section title | See the recovery flow in 60 seconds. | Introduce compact demo. | Voyez le flux en 60 secondes. | automation outcome | EN <= 42; FR <= 42 | max 2 | Yes | Demo section heading. |
| home.control.title | / | section title | AI drafts. You decide. | Owner control. | L'IA prépare. Vous décidez. | autonomous AI | EN <= 24; FR <= 32 | max 2 | Yes | Owner-control section heading. |
| home.usecases.title | / | section title | Built for the cleaning jobs you quote every week. | Cleaning-specific use cases. | Conçu pour les travaux de nettoyage que vous soumissionnez chaque semaine. | multi-industry active | EN <= 58; FR <= 78 | max 2 desktop; max 3 mobile | Yes | Use-case section heading. |
| home.roadmap.badge | / | eyebrow | Roadmap | Future-only scope. | Feuille de route | active features | <= 18 | 1 line | No | Roadmap items are not active promises. |
| home.final.cta | / | CTA | Join founder pilot | Final conversion. | Rejoindre le pilote | paid launch | <= 20 | 1 line | No | Join the founder pilot. |

## Features

| ID | Route | Role | Canonical EN | Intent | Approved fr-CA | Prohibited Claims | Target | Line Budget | Wrap | A11y/Full Label |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| features.h1 | /features | hero heading | A simple system to capture, organize, and reply to cleaning leads faster. | Explain capability set. | Un système simple pour capter, organiser et répondre plus vite aux demandes de nettoyage. | guaranteed response rate | EN <= 76; FR <= 92 | max 2 desktop; max 3 mobile | Yes | Features page heading. |
| features.card.capture | /features | card title/body | Capture quote requests | Public link intake outcome. | Capter les demandes de soumission | booking engine | title <= 34; body target 3 lines | title max 2 | Yes | Explain request capture. |
| features.card.organize | /features | card title/body | Organize leads | Lead inbox/context. | Organiser les prospects | CRM claim | title <= 30; body target 3 lines | title max 2 | Yes | Explain organized leads. |
| features.card.missing | /features | card title/body | Spot missing details | Responsible quoting. | Voir les détails manquants | invented prices | title <= 32; body target 3 lines | title max 2 | Yes | Explain missing details before quote. |
| features.card.draft | /features | card title/body | Prepare draft replies | AI support. | Préparer des brouillons | auto-send | title <= 32; body target 3 lines | title max 2 | Yes | Explain drafts for review. |
| features.card.followup | /features | card title/body | Keep follow-up visible | Manual follow-up visibility. | Garder les suivis visibles | automated sequences | title <= 32; body target 3 lines | title max 2 | Yes | Explain follow-up visibility. |
| features.card.manual | /features | card title/body | Stay in control | Owner decides. | Garder le contrôle | autonomous action | title <= 30; body target 3 lines | title max 2 | Yes | Explain owner-controlled workflow. |
| features.workflow | /features | proof workflow | Customer submits -> BizPilot organizes -> AI drafts -> Owner sends | Compact proof flow. | Demande reçue -> Prospect organisé -> Brouillon IA -> Envoi manuel | auto-send | compact | each step 1-2 lines | Yes | Four-step manual flow. |

## Cleaning Industry

| ID | Route | Role | Canonical EN | Intent | Approved fr-CA | Prohibited Claims | Target | Line Budget | Wrap | A11y/Full Label |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cleaning.h1 | /industries/cleaning | hero heading | Lead recovery software for cleaning businesses. | Cleaning-specific positioning. | Récupération des demandes pour entreprises de nettoyage. | multi-industry active | EN <= 52; FR <= 62 | max 2 desktop; max 3 mobile | Yes | Cleaning page heading. |
| cleaning.body | /industries/cleaning | hero paragraph | BizPilot helps cleaning owners collect quote requests, organize leads, and prepare replies for owner review. | Concise value proposition. | BizPilot aide les entreprises de nettoyage à centraliser les demandes, organiser les prospects et préparer des réponses à valider. | auto-send | EN <= 115; FR <= 130 | max 3 desktop; natural mobile | Yes | Cleaning page summary. |
| cleaning.service.residential | /industries/cleaning | service card title | Residential cleaning | Service category. | Nettoyage résidentiel | broad home services | <= 28 | max 2 | Yes | Residential cleaning service card. |
| cleaning.service.deep | /industries/cleaning | service card title | Deep cleaning | Service category. | Nettoyage en profondeur | none | <= 28 | max 2 | Yes | Deep cleaning service card. |
| cleaning.service.move | /industries/cleaning | service card title | Move-in / move-out | Service category. | Avant/après déménagement | nettoyage de départ | <= 28 | max 2 | Yes | Move-in and move-out cleaning service card. |
| cleaning.service.office | /industries/cleaning | service card title | Office cleaning | Service category. | Nettoyage de bureaux | full facility management | <= 28 | max 2 | Yes | Office cleaning service card. |
| cleaning.service.airbnb | /industries/cleaning | service card title | Airbnb turnover | Service category. | Entre séjours Airbnb | booking/calendar automation | <= 28 | max 2 | Yes | Airbnb turnover cleaning card. |
| cleaning.service.post | /industries/cleaning | service card title | Post-construction cleaning | Service category. | Nettoyage après travaux | construction project management | <= 32 | max 2 | Yes | Post-construction cleaning card. |
| cleaning.detail.panel | /industries/cleaning | shared detail panel | What BizPilot keeps clear | Explain job context after service cards. | Ce que BizPilot garde clair | quote guarantee | title <= 36; body target 3 lines | title max 2 | Yes | Details panel controlled by tabs/accordion. |
| cleaning.example.request | /industries/cleaning | example request | "How much for a move-out clean before Friday?" | Show realistic vague request. | « Combien pour un nettoyage après déménagement d'ici vendredi? » | invented price | <= 70 | natural quote wrap | Yes | Example customer request. |
| cleaning.example.reply | /industries/cleaning | draft reply | Could you confirm the square footage, appliance details, and access notes so I can prepare a responsible quote? | Ask for missing details. | Pouvez-vous confirmer la superficie, les électroménagers et les notes d'accès afin que je prépare une soumission responsable? | price invention | EN <= 115; FR <= 135 | natural body wrap | Yes | Draft reply for owner review. |

## Trust

| ID | Route | Role | Canonical EN | Intent | Approved fr-CA | Prohibited Claims | Target | Line Budget | Wrap | A11y/Full Label |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| trust.h1 | /trust | hero heading | Built for owner control and trust. | Trust page promise. | Conçu pour le contrôle et la confiance. | compliance guarantee | <= 44 | max 2 | Yes | Trust page heading. |
| trust.pillar.control | /trust | card title | You stay in control | Owner sends manually. | Vous gardez le contrôle | auto-send | <= 28 | max 2 | Yes | Owner-control trust pillar. |
| trust.pillar.honest | /trust | card title | Quotes stay honest | No invented prices. | Les soumissions restent honnêtes | guaranteed quote accuracy | <= 32 | max 2 | Yes | Honest quote pillar. |
| trust.pillar.safe | /trust | card title | The workflow fails safely | Safe fallback. | Le flux échoue sans risque | uptime guarantee | <= 34 | max 2 | Yes | Safe fallback pillar. |
| trust.notes | /trust | disclosure title | Technical readiness notes | Technical details below. | Notes techniques de préparation | production approval | <= 38 | max 2 | Yes | Disclosure containing readiness notes. |
| trust.cta.privacy | /trust | CTA | Read privacy | Legal route link. | Lire la confidentialité | legal compliance guarantee | <= 22 | 1 line | No | Link to privacy notice. |
| trust.cta.security | /trust | CTA | Read security | Legal route link. | Lire la sécurité | security certification | <= 22 | 1 line | No | Link to security posture. |

## Demo

| ID | Route | Role | Canonical EN | Intent | Approved fr-CA | Prohibited Claims | Target | Line Budget | Wrap | A11y/Full Label |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| demo.h1 | /demo | hero heading | See how BizPilot handles a cleaning quote request. | Demo page title. | Voyez comment BizPilot traite une demande de soumission. | auto-send | EN <= 58; FR <= 64 | max 2 desktop; max 3 mobile | Yes | Demo page heading. |
| demo.chapter.1 | /demo | chapter title | Request arrives | Vague request arrives. | La demande arrive | none | <= 24 | 1 line preferred | Yes | Demo chapter one. |
| demo.chapter.2 | /demo | chapter title | BizPilot organizes the lead | Organize context. | BizPilot organise le prospect | CRM claim | <= 36 | max 2 | Yes | Demo chapter two. |
| demo.chapter.3 | /demo | chapter title | AI prepares a draft for owner review | AI assistive draft. | L'IA prépare un brouillon à valider | auto-send | <= 44 | max 2 | Yes | Demo chapter three. |
| demo.chapter.4 | /demo | chapter title | Owner reviews, copies, and sends manually | Manual owner action. | Vous validez, copiez et envoyez manuellement | sent by BizPilot | <= 52 | max 2 | Yes | Demo chapter four. |
| demo.guardrail.no-price | /demo | badge/list item | No invented price | Guardrail. | Aucun prix inventé | price automation | <= 22 | 1 line | No | BizPilot should not invent prices. |
| demo.guardrail.no-send | /demo | badge/list item | No auto-send | Guardrail. | Aucun envoi automatique | automatic messaging | <= 24 | 1 line | No | BizPilot does not send automatically. |

## Pricing

| ID | Route | Role | Canonical EN | Intent | Approved fr-CA | Prohibited Claims | Target | Line Budget | Wrap | A11y/Full Label |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pricing.h1 | /pricing | hero heading | Simple pilot pricing for cleaning businesses. | Pricing page title. | Tarifs pilotes simples pour le nettoyage. | billing automation | EN <= 50; FR <= 50 | max 2 desktop; max 3 mobile | Yes | Pricing page heading. |
| pricing.guardrail | /pricing | guardrail | Manual billing after approval | Manual billing readiness. | Facturation après approbation | automatic subscription billing | <= 38 | 1 line preferred; max 2 | Yes | Billing is manual and gated. |
| pricing.plan.founder | /pricing | plan title | Founder Feedback Pilot | First cohort. | Pilote fondateur | recommended paid tier | <= 28 | max 2 | Yes | First founder feedback cohort. |
| pricing.plan.starter | /pricing | plan title | Starter Pilot | Second cohort. | Pilote de départ | recommended tier | <= 24 | max 2 | Yes | Starter pilot plan. |
| pricing.plan.pro | /pricing | plan title | Pro Pilot | Later cohort. | Pilote Pro | recommended tier | <= 18 | max 2 | Yes | Pro pilot plan. |
| pricing.cta.apply | /pricing | CTA | Apply for pilot | Apply action. | Postuler au pilote | payment collection | <= 20 | 1 line | No | Apply for pilot; does not collect payment. |
| pricing.price.149 | /pricing | price | $149 setup | Approved price value. | $149 setup | changed price | fixed | 1 line | No | Price value must remain unchanged. |
| pricing.price.49 | /pricing | price | $49/month | Approved price value. | $49/month | changed price | fixed | 1 line | No | Price value must remain unchanged. |
| pricing.price.199 | /pricing | price | $199 setup | Approved price value. | $199 setup | changed price | fixed | 1 line | No | Price value must remain unchanged. |
| pricing.price.79 | /pricing | price | $79/month | Approved price value. | $79/month | changed price | fixed | 1 line | No | Price value must remain unchanged. |

## Pilot And Content Studio

| ID | Route | Role | Canonical EN | Intent | Approved fr-CA | Prohibited Claims | Target | Line Budget | Wrap | A11y/Full Label |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pilot.h1 | /pilot | hero heading | Help shape BizPilot around real cleaning work. | Founder pilot ask. | Aidez à façonner BizPilot autour du vrai travail de nettoyage. | real data approved | EN <= 56; FR <= 70 | max 2 desktop; max 3 mobile | Yes | Pilot page heading. |
| pilot.template.cta | /pilot | button | Copy pilot request template | Copy text template. | Copier le modèle de demande pilote | form submission | <= 36 | 1 line preferred; max 2 mobile | Yes | Copies the template; does not submit it. |
| pilot.questions | /pilot | disclosure title | Preview the six application questions | Keeps form short. | Voir les six questions de candidature | long disabled form | <= 44 | max 2 | Yes | Disclosure for questions. |
| content.h1 | /content-studio | hero heading | Future Content Studio for local business growth. | Roadmap-only page. | Futur Content Studio pour la croissance locale. | active autoposting | EN <= 54; FR <= 58 | max 2 | Yes | Roadmap page heading. |
| content.badge | /content-studio | eyebrow | Roadmap | Future only. | Feuille de route | current feature | <= 18 | 1 line | No | Roadmap feature, not active product. |
| content.guardrail | /content-studio | footer note | Owner-reviewed content only | No autoposting. | Contenu validé par vous seulement | autoposting | <= 36 | max 2 | Yes | Content drafts require owner approval. |

## Legal Routes

| ID | Route | Role | Canonical EN | Intent | Approved fr-CA | Prohibited Claims | Target | Line Budget | Wrap | A11y/Full Label |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| legal.privacy.h1 | /privacy | legal heading | Privacy rules for careful quote recovery. | Privacy route title. | Règles de confidentialité pour la récupération des soumissions. | legal compliance guarantee | EN <= 50; FR <= 70 | max 2 desktop; max 4 mobile | Yes | Privacy notice heading. |
| legal.security.h1 | /security | legal heading | Security boundaries before real pilot data. | Security route title. | Frontières de sécurité avant les données réelles. | certification | EN <= 52; FR <= 62 | max 2 desktop; max 3 mobile | Yes | Security posture heading. |
| legal.terms.h1 | /terms | legal heading | Clear founder-pilot terms, no hidden automation. | Terms route title. | Conditions claires, sans automatisation cachée. | billing automation | EN <= 58; FR <= 56 | max 2 desktop; max 3 mobile | Yes | Terms heading. |
| legal.summary | /privacy /security /terms | legal heading | Plain-language summary | Summary comes first. | Résumé simple | legal advice | <= 24 | 1 line | No | Summary of the notice. |
| legal.references | /privacy /security | legal heading | Public privacy and security references | Official references. | Références publiques de confidentialité et sécurité | compliance claim | <= 60 | max 2 | Yes | Reference section title. |
| legal.cai | /privacy /security | reference title | Commission d'accès à l'information du Québec | Official Quebec privacy regulator. | Commission d'accès à l'information du Québec | no-accent name | official | natural wrap | Yes | Official regulator name. |

## Auth Routes

| ID | Route | Role | Canonical EN | Intent | Approved fr-CA | Prohibited Claims | Target | Line Budget | Wrap | A11y/Full Label |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| auth.signin.h1 | /auth/sign-in | auth heading | Sign in to BizPilot AI | Concise owner access. | Connexion à BizPilot AI | public signup guarantee | <= 30 | max 2 | Yes | Sign in to an approved owner workspace. |
| auth.signin.body | /auth/sign-in | auth body | Access your approved owner workspace. | No hype. | Accédez à votre espace de travail approuvé. | self-serve availability | <= 70 | max 3 | Yes | Owner access copy. |
| auth.signup.h1 | /auth/sign-up | auth heading | Create owner access | Account setup after approval. | Créer un accès propriétaire | instant approval | <= 32 | max 2 | Yes | Create owner access after founder approval. |
| auth.signup.prompt | /auth/sign-up | auth link prompt | Looking to join the pilot? | Redirect to pilot first. | Vous voulez rejoindre le pilote? | open self-serve | <= 40 | max 2 | Yes | Join pilot first. |
| auth.forgot.h1 | /auth/forgot-password | auth heading | Reset password | Password reset. | Réinitialiser le mot de passe | none | <= 34 | max 2 | Yes | Request a password reset link. |
| auth.reset.h1 | /auth/reset-password | auth heading | Choose a new password | Password update. | Choisir un nouveau mot de passe | none | <= 40 | max 2 | Yes | Choose a new password. |
| auth.check.h1 | /auth/check-email | auth heading | Check your email | Confirmation step. | Vérifiez votre courriel | none | <= 32 | max 2 | Yes | Check email for account instructions. |

## Quote, Success, Unavailable, And Report Shells

| ID | Route | Role | Canonical EN | Intent | Approved fr-CA | Prohibited Claims | Target | Line Budget | Wrap | A11y/Full Label |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| quote.shell.title | /quote/[slug] | quote heading | Request a cleaning quote | Public intake title. | Demander une soumission de nettoyage | booking confirmation | <= 45 | max 2 | Yes | Public quote request form heading. |
| quote.shell.subtitle | /quote/[slug] | quote body | A short quote request form. The business reviews every request and replies directly. | Explain manual response. | Un court formulaire de soumission. L'entreprise révise chaque demande et répond directement. | auto-send | EN <= 100; FR <= 115 | natural | Yes | Quote form explanation. |
| quote.consent | /quote/[slug] | consent notice | By submitting this request, you agree that your information will be shared with this business to respond to your quote request. | Consent boundary. | En envoyant cette demande, vous acceptez que vos renseignements soient partagés avec cette entreprise afin qu'elle réponde à votre demande de soumission. | marketing opt-in | long | natural | Yes | Consent notice. |
| quote.submit | /quote/[slug] | CTA | Send quote request | Submit request. | Envoyer la demande | booking confirmation | <= 24 | 1 line | No | Submit quote request to the business. |
| quote.unavailable.title | inactive quote route | quote heading | Quote page unavailable | Safe inactive route. | Page de soumission indisponible | active intake | <= 45 | max 2 | Yes | This quote page is unavailable. |
| quote.success.title | /quote/[slug]/success | quote heading | Thanks — your quote request was sent. | Submission confirmation only. | Merci — votre demande de soumission a été envoyée. | booking confirmation | <= 58 | max 3 | Yes | Request sent, not booking confirmed. |
| report.shell.title | report shell pages if present | report heading | Setup report | Internal/owner setup report shell. | Rapport de configuration | production approval | <= 32 | max 2 | Yes | Report shell heading. |

## Metadata Targets

| ID | Route | Role | Canonical EN | Intent | Approved fr-CA | Prohibited Claims | Target | Line Budget | Wrap | A11y/Full Label |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| meta.home.title | / | metadata title | BizPilot AI | Brand title. | BizPilot AI | none | <= 60 | N/A | N/A | Browser/SEO title. |
| meta.home.description | / | metadata description | BizPilot helps cleaning businesses collect quote requests, organize leads, and prepare replies for owner review without auto-send. | Search summary. | BizPilot aide les entreprises de nettoyage à centraliser les demandes, organiser les prospects et préparer des réponses à valider sans envoi automatique. | auto-send, guaranteed revenue | <= 155 | N/A | N/A | SEO description. |
| meta.features.title | /features | metadata title | Features | Feature route. | Fonctions | none | <= 60 | N/A | N/A | Browser/SEO title. |
| meta.cleaning.title | /industries/cleaning | metadata title | Cleaning Business Lead Recovery Software | Cleaning SEO. | Récupération des demandes pour entreprises de nettoyage | multi-industry | <= 65 | N/A | N/A | Browser/SEO title. |
| meta.privacy.title | /privacy | metadata title | Privacy Notice | Privacy route. | Avis de confidentialité | compliance guarantee | <= 60 | N/A | N/A | Browser/SEO title. |
| meta.security.title | /security | metadata title | Security Summary | Security route. | Résumé de sécurité | certification | <= 60 | N/A | N/A | Browser/SEO title. |
| meta.terms.title | /terms | metadata title | Pilot Terms | Terms route. | Conditions pilote | paid launch | <= 60 | N/A | N/A | Browser/SEO title. |

## L2 Applied fr-CA Strings

These strings are the applied professional Canadian-French public-site baseline
after Phase L2. They supersede earlier literal or compact placeholder wording.

| ID | Applied fr-CA |
| --- | --- |
| shell.brand.tagline | Suivi des demandes pour entreprises de nettoyage |
| home.hero.eyebrow | Pour les entreprises de nettoyage, d’abord. |
| home.hero.h1 | Ne perdez plus de soumissions faute de réponse rapide. |
| home.hero.body | Centralisez les demandes, organisez les prospects et préparez des réponses à valider — sans envoi automatique. |
| home.hero.badge.no-auto | Aucun envoi automatique |
| home.hero.badge.ai | Brouillons IA validés par vous |
| home.hero.badge.manual | Copie et envoi manuels |
| home.mockup.title | Nouvelle demande |
| home.mockup.status | À répondre |
| home.mockup.service.value | Nettoyage après déménagement |
| home.mockup.draft.title | Brouillon suggéré |
| cleaning.service.move | Nettoyage avant/après déménagement |
| cleaning.service.airbnb | Nettoyage entre séjours Airbnb |
| demo.chapter.3 | L’IA prépare un brouillon à valider. |
| demo.chapter.4 | Vous validez, copiez et envoyez manuellement. |
| trust.item.ai | Brouillons IA validés par vous |
| quote.shell.subtitle | Un court formulaire de soumission. L'entreprise révise chaque demande et répond directement. |

## Route Responsibility Summary

| Route | Responsibility | Must Avoid |
| --- | --- | --- |
| `/` | Conversion-focused overview: hero, problem, solution, compact demo, owner control, use cases, roadmap, FAQ, final CTA. | Two full workflow essays back-to-back. |
| `/features` | Outcome-first capabilities and one compact proof workflow. | Repeating homepage essay. |
| `/industries/cleaning` | Cleaning use cases and job context with six compact service cards and one shared detail area. | Three oversized mega-cards containing all details at once. |
| `/trust` | Owner control, honest quotes, safe failure, readiness notes disclosure. | Certification/compliance guarantees. |
| `/demo` | Four-chapter manual workflow demo. | Autoplay, auto-send implication. |
| `/pricing` | Approved prices and manual billing/readiness guardrail. | Recommended label unless approved; price changes. |
| `/pilot` | Short template workflow and application questions disclosure. | Long disabled form. |
| `/content-studio` | Roadmap-only owner-reviewed content direction. | Active autoposting claim. |
| `/privacy` `/security` `/terms` | Plain-language summary first, technical details below. | Legal guarantees or no-accent official names. |
| Auth routes | Concise owner access. | Marketing hype or full public navigation. |
| Quote routes | Safe quote request intake/unavailable/success copy. | Booking confirmation or auto-send. |

## Verification Requirements For Later Phases

L0 verification is documentation-only:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:unit`
- `pnpm build`
- `git diff --check`

L1-L5 must add implementation and test evidence against this matrix without
weakening the product boundaries above.
