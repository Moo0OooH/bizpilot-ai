# V3 Final EN/fr-CA Copy Matrix

Date: 2026-07-13

Status: approved Phase 2 editorial contract

Executable source: `lib/i18n/public-v3-spec.ts`

This document is the human-review matrix. The typed source is the exact implementation source and the parity test prevents one language from gaining or losing routes, sections, capabilities, prices, FAQs, or trust topics.

## Global navigation

| Intent | English | Français (Canada) | Destination |
| --- | --- | --- | --- |
| Product | Product | Produit | `/features` |
| Workflow | How it works | Fonctionnement | `/#how-it-works` |
| Demo | Demo | Démo | `/demo` |
| Pricing | Pricing | Tarifs | `/pricing` |
| Resource group | Resources | Ressources | menu label |
| FAQ | FAQ | FAQ | `/faq` |
| Trust | Trust | Confiance | `/trust` |
| Existing user | Sign in | Connexion | existing auth route |
| Pilot | Apply for pilot | Demander l'accès | `/pilot` |
| Language control | Website language | Langue du site | control label |
| Theme control | Theme | Thème | control label |

## Route metadata

| Route | EN title | FR title | EN description | FR description |
| --- | --- | --- | --- | --- |
| `/` | Smart Intake for Busy Service Teams \| BizPilot AI | Collecte intelligente pour équipes de services \| BizPilot AI | Turn scattered customer messages into complete service requests and human-approved reply drafts with one shareable Smart Intake Link. | Transformez les messages dispersés en demandes de service complètes et en réponses prêtes à valider grâce à un seul lien de collecte. |
| `/features` | Smart Intake and Reply Features \| BizPilot AI | Fonctions de collecte et de réponse \| BizPilot AI | See how BizPilot collects service details, organizes requests, flags missing information, and prepares owner-reviewed reply drafts. | Voyez comment BizPilot recueille les détails du service, organise les demandes, signale ce qui manque et prépare des brouillons à valider. |
| `/demo` | Cleaning Request Demo \| BizPilot AI | Démo d'une demande d'entretien \| BizPilot AI | Follow one vague cleaning question through a Smart Intake Link, organized request, missing-detail check, and reply ready for owner review. | Suivez une demande vague jusqu'au lien de collecte, à la fiche organisée, aux détails manquants et au brouillon prêt à valider. |
| `/pricing` | Founder Pilot Pricing \| BizPilot AI | Tarifs du pilote fondateur \| BizPilot AI | Review staged, founder-led pilot pricing for BizPilot's cleaning intake and human-reviewed reply workflow, with no self-serve checkout. | Consultez les tarifs par étapes du pilote entretien, avec configuration guidée, réponses validées et aucun paiement libre-service. |
| `/pilot` | Cleaning Founder Pilot \| BizPilot AI | Pilote fondateur pour l'entretien \| BizPilot AI | Apply for a founder-led BizPilot cleaning pilot built around one Smart Intake Link and a controlled, human-reviewed reply workflow. | Demandez l'accès à un pilote BizPilot guidé autour d'un lien de collecte et d'un flux de réponse validé par une personne. |
| `/faq` | BizPilot FAQ \| Smart Intake, AI, Channels, and Pilot | FAQ BizPilot \| Collecte, IA, canaux et pilote | Get direct answers about Smart Intake Link placement, AI assistance, human review, integrations, data, setup, and founder-pilot pricing. | Obtenez des réponses claires sur le lien de collecte, l'IA, la validation humaine, les intégrations, les données et les tarifs du pilote. |
| `/trust` | Trust and Human Control \| BizPilot AI | Confiance et contrôle humain \| BizPilot AI | Review BizPilot's human-control boundary, AI limits, privacy approach, data minimization, and manual-send workflow. | Consultez les limites de l'IA, la validation humaine, la confidentialité, la minimisation des données et l'envoi manuel de BizPilot. |
| `/privacy` | Privacy \| BizPilot AI | Confidentialité \| BizPilot AI | Read how BizPilot approaches customer-request data, access, retention, and privacy choices during the controlled pilot. | Découvrez comment BizPilot aborde les données de demandes, l'accès, la conservation et les choix de confidentialité pendant le pilote. |
| `/security` | Security \| BizPilot AI | Sécurité \| BizPilot AI | Review BizPilot's current security boundaries, access controls, data-minimization practices, and responsible disclosure path. | Consultez les limites de sécurité actuelles, les contrôles d'accès, la minimisation des données et le signalement responsable. |
| `/terms` | Terms \| BizPilot AI | Conditions \| BizPilot AI | Read the current BizPilot website and founder-pilot terms, scope boundaries, responsibilities, and approval gates. | Lisez les conditions actuelles du site et du pilote fondateur, les limites du service, les responsabilités et les étapes d'approbation. |

## Route hero matrix

### Home `/`

| Field | English | Français (Canada) |
| --- | --- | --- |
| Eyebrow | SMART INTAKE FOR BUSY SERVICE TEAMS | COLLECTE INTELLIGENTE POUR ÉQUIPES DE SERVICES |
| H1 | Turn scattered customer messages into complete requests—and replies ready to review. | Transformez les messages dispersés en demandes complètes et en réponses prêtes à valider. |
| Body | Share one smart intake link anywhere customers reach you. BizPilot asks the right service questions, organizes every request, flags what is missing, and prepares a reply your team approves before sending. | Partagez un seul lien de collecte partout où vos clients vous écrivent. BizPilot pose les bonnes questions, organise chaque demande, signale les renseignements manquants et prépare une réponse que votre équipe valide avant de l'envoyer. |
| Primary | See how it works → `/#how-it-works` | Voir le fonctionnement → `/#how-it-works` |
| Secondary | Apply for the founder pilot → `/pilot` | Demander l'accès au pilote → `/pilot` |

### Product `/features`

| Field | English | Français (Canada) |
| --- | --- | --- |
| Eyebrow | PRODUCT | PRODUIT |
| H1 | Everything between a vague message and a useful reply. | Tout ce qu'il faut entre un message vague et une réponse utile. |
| Body | Give customers one clear request path, give your team the details that matter, and keep every reply under human control. | Offrez aux clients un parcours clair, donnez à votre équipe les détails importants et gardez chaque réponse sous contrôle humain. |
| Primary | Walk through the demo → `/demo` | Parcourir la démo → `/demo` |
| Secondary | Apply for pilot → `/pilot` | Demander l'accès → `/pilot` |

### Demo `/demo`

| Field | English | Français (Canada) |
| --- | --- | --- |
| Eyebrow | INTERACTIVE CLEANING PILOT | DÉMO INTERACTIVE DU PILOTE ENTRETIEN |
| H1 | Follow one “How much?” message to a reply ready to review. | Suivez un message « Combien? » jusqu'à une réponse prête à valider. |
| Body | This safe walkthrough shows the current cleaning workflow without submitting data, inventing a quote, booking a job, or sending a message. | Cette démonstration sûre présente le flux actuel sans envoyer de données, inventer un prix, réserver un service ni transmettre un message. |
| Primary | Start the walkthrough → `/demo#demo` | Commencer la démo → `/demo#demo` |
| Secondary | Explore the product → `/features` | Explorer le produit → `/features` |

### Pricing `/pricing`

| Field | English | Français (Canada) |
| --- | --- | --- |
| Eyebrow | FOUNDER-PILOT PRICING | TARIFS DU PILOTE FONDATEUR |
| H1 | Start with fit, scope, and a price you approve before setup. | Commencez par la compatibilité, la portée et un prix approuvé avant la configuration. |
| Body | The first cohort is feedback-led. Later Starter and Pro pilots use manual billing only after the workflow, support, cancellation, and payment terms are confirmed. | La première cohorte mise sur la rétroaction. Les pilotes Démarrage et Pro sont facturés manuellement seulement après confirmation du flux, du soutien, de l'annulation et du paiement. |
| Primary | Apply for the pilot → `/pilot` | Demander l'accès au pilote → `/pilot` |
| Secondary | Read common questions → `/faq` | Lire les questions fréquentes → `/faq` |

### Pilot `/pilot`

| Field | English | Français (Canada) |
| --- | --- | --- |
| Eyebrow | CLEANING BUSINESSES FIRST | ENTREPRISES D'ENTRETIEN D'ABORD |
| H1 | Test one customer-request workflow with the founder beside you. | Testez un seul flux de demandes avec le fondateur à vos côtés. |
| Body | The first pilot is for cleaning teams receiving incomplete requests and willing to improve a focused, manual-first workflow through structured feedback. | Le premier pilote s'adresse aux équipes d'entretien qui reçoivent des demandes incomplètes et veulent améliorer un flux ciblé, manuel et contrôlé. |
| Primary | Prepare my pilot request → `/pilot#application` | Préparer ma demande → `/pilot#application` |
| Secondary | Review pilot pricing → `/pricing` | Voir les tarifs → `/pricing` |

### FAQ, trust, and legal

| Route | EN eyebrow / H1 | FR eyebrow / H1 | Primary / Secondary |
| --- | --- | --- | --- |
| `/faq` | STRAIGHT ANSWERS / Know what BizPilot does—and what stays in your hands. | RÉPONSES CLAIRES / Sachez ce que BizPilot fait et ce qui reste entre vos mains. | Demo / Pilot |
| `/trust` | TRUST BY DESIGN / AI prepares the work. Your team keeps the decision. | CONFIANCE INTÉGRÉE / L'IA prépare le travail. Votre équipe garde la décision. | Security / Privacy |
| `/privacy` | PRIVACY / A readable explanation of how request data is handled. | CONFIDENTIALITÉ / Une explication lisible de la gestion des données de demandes. | Trust / Security |
| `/security` | SECURITY / Practical safeguards for a controlled, manual-first workflow. | SÉCURITÉ / Des mesures pratiques pour un flux contrôlé et manuel. | Trust / Privacy |
| `/terms` | TERMS / The practical rules for using the site and joining a pilot. | CONDITIONS / Les règles pratiques du site et du pilote. | Pricing / Privacy |

The full hero bodies and localized CTA labels for these routes are defined in the typed source and covered by route-completeness tests.

## Homepage seven-section matrix

| # | Key | English title | Français (Canada) | Communication job |
| ---: | --- | --- | --- | --- |
| 1 | `hero` | Turn scattered customer messages into complete requests—and replies ready to review. | Transformez les messages dispersés en demandes complètes et en réponses prêtes à valider. | Identify audience, pain, mechanism, result, and human control above the fold. |
| 2 | `problem` | The message arrives. The details you need do not. | Le message arrive. Les détails nécessaires, non. | Show four recognizable vague questions without implying inbox integration. |
| 3 | `workflow` | Share. Ask. Organize. Review. | Partager. Demander. Organiser. Valider. | Explain the complete mechanism in four verbs. |
| 4 | `outcomes` | See the complete request, the gaps, and the next reply together. | Voyez la demande complète, les lacunes et la prochaine réponse ensemble. | Show what is ready for the team. |
| 5 | `cleaning-demo` | From “How much for Friday?” to a request you can answer responsibly. | De « Combien pour vendredi? » à une demande à laquelle répondre correctement. | Make the product concrete with the only validated pilot template. |
| 6 | `trust` | AI helps prepare. Your team decides what leaves the business. | L'IA aide à préparer. Votre équipe décide ce qui est envoyé. | State manual approval and no-send/no-price/no-booking limits once. |
| 7 | `final-cta` | Make the next customer request easier to answer. | Rendez la prochaine demande plus facile à traiter. | Offer demo first and founder pilot second. |

### Problem-message examples

| Source label | English | Français (Canada) |
| --- | --- | --- |
| Instagram | How much? | Combien? |
| WhatsApp | Are you free Friday? | Êtes-vous libre vendredi? |
| Website / Site Web | Do you cover my area? | Desservez-vous mon secteur? |
| Email / Courriel | Can you quote this? | Pouvez-vous faire une soumission? |

Required note:

- EN: `These are places to share the link—not direct inbox integrations.`
- FR: `Ce sont des endroits où partager le lien, pas des intégrations de boîtes de réception.`

### Workflow verbs

| Key | English | Français (Canada) | Boundary |
| --- | --- | --- | --- |
| Share | Place one Smart Intake Link in the channels the business already uses. | Placez un seul lien de collecte dans les canaux déjà utilisés. | Link placement, not inbox ingestion. |
| Ask | Collect service, scope, location, timing, access, and needed details. | Recueillez le service, la portée, le lieu, l'horaire, l'accès et les détails requis. | Service-specific questions, not a universal quote. |
| Organize | Create one readable request and expose remaining gaps. | Créez une demande lisible et montrez ce qui manque. | No invented facts. |
| Review | Read, edit, copy, and manually send the assisted draft. | Lisez, modifiez, copiez et envoyez vous-même le brouillon assisté. | No automatic send. |

### Outcome cards

| English | Français (Canada) |
| --- | --- |
| Complete request | Demande complète |
| Visible gaps | Renseignements manquants visibles |
| Reply ready to review | Réponse prête à valider |
| Clear next action | Prochaine action claire |

## Product capability matrix

| Anchor | English | Français (Canada) |
| --- | --- | --- |
| `share-anywhere` | One link, shared anywhere | Un seul lien, partagé partout |
| `service-questions` | Questions that fit the service | Des questions adaptées au service |
| `organized-request` | An organized request | Une demande organisée |
| `missing-details` | Missing details made visible | Les renseignements manquants en évidence |
| `reply-drafts` | AI-assisted reply drafts | Des brouillons assistés par l'IA |
| `human-control` | Review, edit, and copy | Valider, modifier et copier |
| `focused-by-design` | Focused by design: works beside current channels; not a direct inbox or full CRM | Ciblé par conception : fonctionne avec les canaux actuels; ce n'est ni une boîte de réception directe ni un CRM complet |

## Demo copy contract

| Stage | English | Français (Canada) |
| --- | --- | --- |
| Incoming | How much for a move-out cleaning this Friday? | Combien pour un nettoyage après déménagement ce vendredi? |
| Questions | Property size; cleaning scope; access; timing | Superficie; portée; accès; horaire |
| Organized result | Move-out cleaning; 2-bedroom condo; inside oven and fridge; Friday 9 a.m.–noon | Nettoyage après déménagement; condo de deux chambres; intérieur du four et du réfrigérateur; vendredi de 9 h à midi |
| Visible gap | Parking and key instructions | Stationnement et consignes pour la clé |
| Controls | Review; Edit; Copy | Valider; Modifier; Copier |

Demo boundary:

- EN: `Demo only. No price is invented, no booking is confirmed, no data is submitted, and no message is sent.`
- FR: `Démonstration seulement. Aucun prix n'est inventé, aucune réservation n'est confirmée, aucune donnée n'est envoyée et aucun message n'est transmis.`

## Pricing matrix

| Tier | English | Français (Canada) | Included in both languages |
| --- | --- | --- | --- |
| Feedback | Founder Feedback Pilot — `$0 setup` | Pilote de rétroaction fondateur — `Configuration à 0 $` | Cleaning request link; organized owner workspace; assisted summary/draft; manual review/copy/send; founder setup and feedback |
| Starter | Starter Pilot — `$149 setup + $49/month` | Pilote Démarrage — `149 $ de configuration + 49 $/mois` | Branded link; organized workspace; reviewed assisted drafts; manual follow-up visibility; founder onboarding |
| Pro | Pro Pilot — `$199 setup + $79/month` | Pilote Pro — `199 $ de configuration + 79 $/mois` | Starter scope; stronger branding; reply/FAQ tuning; follow-up draft tuning; priority onboarding |

Required billing note:

- EN: no checkout on the page; scope, support, cancellation, refunds, payment method, and exact start date are confirmed before a paid pilot.
- FR: aucun paiement sur la page; portée, soutien, annulation, remboursements, mode de paiement et date de début sont confirmés avant un pilote payant.

## Pilot matrix

| Area | English | Français (Canada) |
| --- | --- | --- |
| Fit | Cleaning business; online/message requests; manual replies; incomplete scope/timing/area/access; structured feedback | Entreprise d'entretien; demandes en ligne/par message; réponses manuelles; portée/horaire/secteur/accès incomplets; rétroaction structurée |
| Steps | Fit review; manual setup; controlled use; feedback checkpoints | Vérification de la compatibilité; configuration manuelle; utilisation contrôlée; points de rétroaction |
| Fields | Business name; work email; city/area; cleaning services; requests/week; biggest problem; language | Nom; courriel; ville/secteur; services; demandes/semaine; principal problème; langue |
| Action | Copy the 60-second pilot request | Copier la demande de pilote de 60 secondes |

The public page does not submit or store the request, create an account, charge a card, or access production data. It only prepares text the visitor can copy into an already-used founder contact method.

## FAQ coverage

| Key | English question | Question française |
| --- | --- | --- |
| Direct integrations | Does BizPilot connect directly to Instagram, WhatsApp, Messenger, email, or Google Business today? | BizPilot se connecte-t-il directement à Instagram, WhatsApp, Messenger, au courriel ou à Google aujourd'hui? |
| Link placement | Where can I share the Smart Intake Link? | Où puis-je partager le lien de collecte? |
| After submit | What happens after the customer answers? | Que se passe-t-il après les réponses du client? |
| AI role | What does AI do? | Quel est le rôle de l'IA? |
| Auto-send | Does BizPilot send messages automatically? | BizPilot envoie-t-il des messages automatiquement? |
| Price/booking | Can BizPilot invent a price or confirm a booking? | BizPilot peut-il inventer un prix ou confirmer une réservation? |
| Setup | How is the first workflow set up? | Comment le premier flux est-il configuré? |
| Data | What customer data is used? | Quelles données client sont utilisées? |
| Pricing | Is there self-serve checkout? | Y a-t-il un paiement libre-service? |
| Verticals | Is BizPilot only for cleaning businesses? | BizPilot est-il réservé aux entreprises d'entretien? |

Every answer is direct, begins with `No/Non` where a limitation is being resolved, and points to the present product—not roadmap speculation.

## Trust coverage

| Key | English | Français (Canada) |
| --- | --- | --- |
| Explicit inputs | Explicit customer inputs | Renseignements fournis explicitement |
| Visible gaps | Visible missing information | Renseignements manquants visibles |
| Bounded AI | Bounded AI assistance | Aide de l'IA encadrée |
| Human review | Human review before sending | Validation humaine avant l'envoi |
| Data minimization | Data minimization | Minimisation des données |
| Honest boundaries | Honest operational boundaries | Limites opérationnelles claires |

## Editorial rules

- Use “Smart Intake Link” as the English product mechanism and “lien de collecte” in natural Canadian French.
- Prefer “request”/“demande” over “lead” unless describing source context.
- Prefer “reply ready to review”/“réponse prête à valider” over “AI response.”
- Name the human action: review, edit, copy, send manually.
- Do not say omnichannel, unified inbox, automatic quote, booked job, conversion lift, revenue, time saved, 24/7 response, or production-ready vertical unless separately proven.
- Do not translate word-for-word when natural Quebec/Canadian French is clearer.
- Use Canadian French currency order and spacing while preserving the same numeric price.
