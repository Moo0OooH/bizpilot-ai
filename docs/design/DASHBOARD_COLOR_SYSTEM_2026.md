# BizPilot Dashboard Color System 2026

Purpose: keep owner dashboard and founder admin colors calm, readable, and easy to change without hunting through components.

## Design Direction

BizPilot is an operational SaaS dashboard, not a marketing hero. The UI should feel quiet, dense, and trustworthy.

- Light theme: warm white surfaces, soft green-teal primary, slate text, low-saturation status colors.
- Dark theme: deep blue-green background, lifted neutral surfaces, teal primary, restrained warning/danger colors.
- Founder admin: same token family as dashboard, with danger controls only where an action is destructive.

## Core Tokens

| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| `--dash-bg` | `#f6f8fb` | `#071016` | App background |
| `--dash-bg-soft` | `#edf4f2` | `#0d1820` | Secondary background |
| `--dash-surface` | `#ffffff` | `#101b24` | Cards and panels |
| `--dash-surface-muted` | `#f5f8f7` | `rgba(15, 27, 36, 0.88)` | Nested quiet panels |
| `--dash-surface-elevated` | `#ffffff` | `rgba(18, 31, 40, 0.96)` | Topbar, inputs, menus |
| `--dash-border` | `rgba(15, 23, 42, 0.10)` | `rgba(255, 255, 255, 0.08)` | Default borders |
| `--dash-border-strong` | `rgba(15, 23, 42, 0.16)` | `rgba(255, 255, 255, 0.14)` | Inputs and strong separators |
| `--dash-text` | `#0f172a` | `#f5f7fa` | Primary text |
| `--dash-text-secondary` | `#475569` | `rgba(245, 247, 250, 0.74)` | Body text |
| `--dash-text-muted` | `#64748b` | `rgba(245, 247, 250, 0.48)` | Metadata |
| `--dash-primary` | `#0f766e` | `#14b8a6` | Primary action, active nav |
| `--dash-primary-hover` | `#115e59` | `#2dd4bf` | Primary hover |
| `--dash-primary-soft` | `rgba(15, 118, 110, 0.10)` | `rgba(20, 184, 166, 0.13)` | Active backgrounds |

## Status Colors

| Status | Light | Dark | Usage |
| --- | --- | --- | --- |
| Success | `#059669` on `rgba(5,150,105,0.10)` | `#34d399` on `rgba(16,185,129,0.14)` | Ready, active, completed |
| Warning | `#b45309` on `rgba(245,158,11,0.12)` | `#fbbf24` on `rgba(255,184,77,0.12)` | Needs setup, onboarding |
| Danger | `#b91c1c` on `rgba(239,68,68,0.10)` | `#fca5a5` on `rgba(255,92,92,0.10)` | Blocked, destructive |
| Info | `#2563eb` on `rgba(37,99,235,0.09)` | `#93c5fd` on `rgba(96,165,250,0.14)` | Language, neutral information |

## Component Mapping

- App shell: `--dash-bg`, `--dash-text`
- Topbar/menu/input: `--dash-surface-elevated`, `--dash-border-strong`
- Cards: `--dash-surface`
- Nested cards/details: `--dash-surface-muted`
- Main action buttons: `--dash-primary`, `--dash-primary-hover`
- Secondary buttons: `--dash-surface-elevated`, `--dash-border-strong`
- Destructive buttons: explicit red only inside delete forms
- Admin priority filters: compact pill buttons, not full-height cards

## Change Rules

1. Change tokens first in `app/globals.css`.
2. Avoid hard-coded text colors inside components unless the action is destructive.
3. Do not use pale red text on pale red backgrounds.
4. Keep dashboard and founder admin in the same token family.
5. If a new surface needs a unique color, add it here before using it.
