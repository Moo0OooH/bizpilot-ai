# BizPilot fr-CA Terminology Standard v1.0

Date: 2026-06-21
Status: Active for the final public localization, copy, sizing, and visual
acceptance program.

## Purpose

This document is the Canadian-French terminology source of truth for the
BizPilot public site, auth shells, quote shells, policy pages, and future
dashboard D1 visual copy work. It exists so the French site preserves the same
intent, trust boundary, and conversion value as the canonical English source
without becoming literal, awkward, or visually unstable.

## Product Truth

BizPilot is a manual-first lead-recovery system for cleaning businesses.

```text
AI drafts. The owner decides.
```

French copy must preserve these boundaries:

- no auto-send,
- no invented prices,
- no automatic booking confirmation,
- no SMS/WhatsApp automation,
- no full CRM claim,
- no guaranteed revenue,
- no real customer data or paid pilot claim before separate gates close.

## Approved Core Terms

| Concept | Approved English | Approved fr-CA | Notes |
| --- | --- | --- | --- |
| Cleaning business | cleaning business | entreprise de nettoyage | Use singular/plural naturally. |
| Quote request | quote request | demande de soumission | A customer's request for pricing or availability context. |
| Quote | quote | soumission | A price/estimate prepared by the business after review. |
| Lead | lead | prospect | Organized potential customer/request. |
| Lead inbox | lead inbox | demandes reçues | Use for compact UI. Use `boîte de réception des prospects` only when there is room. |
| Owner workspace | workspace | espace de travail | Avoid `espace propriétaire`. |
| Owner review | owner review | à valider par vous | Prefer owner-facing second person in compact UI. |
| Owner-reviewed | reviewed by you | validé par vous | Avoid repeating `révisé par le propriétaire` in every component. |
| Draft reply | draft reply | brouillon suggéré | Use for mockups and action panels. |
| AI draft | AI draft | brouillon IA | Use where the AI nature matters. |
| Manual copy/send | manual copy and send | copie et envoi manuels | CTA/body variant: `copier et envoyer manuellement`. |
| No auto-send | no auto-send | aucun envoi automatique | Do not shorten to unclear jargon in primary surfaces. |
| Needs reply | needs reply | à répondre | Compact status. |
| Founder pilot | founder pilot | projet pilote | CTA may use `Rejoindre le pilote`. |
| Roadmap | roadmap | feuille de route | Do not imply active availability. |
| Safe fallback | fails safely | échec sans risque | Use plain language around unavailable AI/provider states. |

## Cleaning Service Terms

| English | Approved fr-CA | Avoid |
| --- | --- | --- |
| Residential cleaning | nettoyage résidentiel | nettoyage des maisons when used as service title |
| Deep cleaning | nettoyage en profondeur | grand ménage for formal service card title |
| Move-in / move-out cleaning | nettoyage avant/après déménagement | nettoyage de départ |
| Move-out cleaning | nettoyage après déménagement | nettoyage de départ unless rental context clearly supports it |
| End-of-lease cleaning | nettoyage de fin de bail | Use only when lease/rental context is explicit. |
| Office cleaning | nettoyage de bureaux | nettoyage commercial de bureau if too long |
| Airbnb turnover | nettoyage entre séjours Airbnb | turnover Airbnb |
| Post-construction cleaning | nettoyage après travaux | nettoyage post-construction unless the audience expects it |
| Small commercial cleaning | petit nettoyage commercial | small commercial cleaning |

## Official Names

Use official French names with accents:

- `Commission d'accès à l'information du Québec`
- `Commissariat à la protection de la vie privée du Canada`

Do not use no-accent fallbacks such as:

- `Commission d'acces a l'information`
- `vie privee`
- `securite`
- `donnees`

## Forbidden Or Discouraged Terms

These terms must not appear in final visible fr-CA public copy unless quoted as
a rejected example in documentation or tests:

| Forbidden | Use Instead | Reason |
| --- | --- | --- |
| Leads pour le nettoyage | Suivi des demandes pour entreprises de nettoyage | Hybrid English/French and unclear. |
| Nettoyage de départ | nettoyage après déménagement / nettoyage de fin de bail | Ambiguous and awkward outside a specific rental context. |
| manuel d'abord | manuel, contrôlé par le propriétaire | Literal translation of internal product phrase. |
| espace propriétaire | espace de travail | Awkward; not natural owner-facing UI. |
| révisé par le propriétaire everywhere | à valider par vous / validé par vous | Too long and repetitive in compact UI. |
| automation cachee | automatisation cachée | No-accent and partial English. |
| Regles / securite / donnees / reponse | Règles / sécurité / données / réponse | No-accent public copy lowers trust. |
| command center / cockpit | système / espace de travail / demandes reçues | Not approved for public source copy. |
| CRM complet | CRM complet only in a negated boundary | Do not imply active full CRM. |

## Homepage Approved fr-CA Source

| Role | Approved fr-CA |
| --- | --- |
| Brand tagline | Suivi des demandes pour entreprises de nettoyage |
| Eyebrow | Pour les entreprises de nettoyage, d'abord. |
| H1 | Ne perdez plus de soumissions faute de réponse rapide. |
| Subheading | Centralisez les demandes, organisez les prospects et préparez des réponses à valider — sans envoi automatique. |
| Primary CTA | Rejoindre le pilote |
| Secondary CTA | Voir la démo |
| Badge 1 | Aucun envoi automatique |
| Badge 2 | Brouillons IA validés par vous |
| Badge 3 | Copie et envoi manuels |
| Mockup title | Nouvelle demande |
| Mockup status | À répondre |
| Mockup draft title | Brouillon suggéré |
| Mockup tag | L'IA prépare. Vous envoyez. |
| Mockup button | Copier la réponse |

## Style Rules

- Translate intent, not English word order.
- Prefer direct verbs and one idea per sentence.
- Use Canadian-French business vocabulary.
- Keep compact UI copy concise, but do not remove product boundaries merely to
  fit a button or badge.
- Use accents, curly apostrophes only where the surrounding file already uses
  them, and UTF-8 source text.
- Use French spacing around colons in prose when natural, but keep compact UI
  labels short.
- Metadata titles and descriptions must be localized too.
- Product names such as `BizPilot AI`, `Airbnb`, `Stripe`, and `OpenAI` remain
  as product names.

## Accessibility Labels For Compact Visible Copy

When visible French copy is intentionally compact, provide an accessible label
or surrounding context that keeps the full meaning:

| Visible fr-CA | Full meaning |
| --- | --- |
| À répondre | Cette demande attend une réponse du propriétaire. |
| Brouillon suggéré | Brouillon préparé par l'IA et à valider avant envoi manuel. |
| Rejoindre le pilote | Rejoindre le projet pilote BizPilot. |
| Demandes reçues | Boîte de réception des prospects et demandes de soumission. |
| Copie et envoi manuels | Le propriétaire copie la réponse et l'envoie depuis son propre canal. |

## Visual Budget Rules

French strings must be written to fit the component budget from
`docs/content/BIZPILOT_PUBLIC_COPY_MATRIX_v1.0.md` and
`docs/product/BIZPILOT_MULTILINGUAL_RESPONSIVE_UI_STANDARD_v1.0.md`.

Do not solve overlong French with:

- random French-only font shrink,
- essential ellipsis,
- hidden overflow,
- fixed-height clipping,
- global overflow masking,
- language-specific layout hacks.
