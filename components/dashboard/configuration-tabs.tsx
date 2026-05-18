/**
 * ============================================================
 * File: components/dashboard/configuration-tabs.tsx
 * Project: BizPilot AI
 * Description: Provides section navigation for the business configuration workspace.
 * Role: Keeps every configuration section visible and reachable for Phase 17 manual QA.
 * Related:
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * - server/actions/business-configuration.actions.ts
 * Author: MoOoH
 * Created: 2026-05-16
 * Last Updated: 2026-05-18
 * Change Log:
 * - 2026-05-16: Created mounted tab panels so the parent form receives every required input on submit.
 * - 2026-05-18: Replaced hydration-dependent tabs with visible anchored sections for pilot-readiness QA.
 * ============================================================
 */

import type { ReactElement, ReactNode } from "react";
import { Children, isValidElement } from "react";

type Section = Readonly<{ id: string; label: string }>;
type Props = Readonly<{ children: ReactNode; sections: Section[] }>;

function panelId(p: ReactElement): string | undefined {
  return (p as ReactElement<{ id?: string }>).props.id;
}

export function ConfigurationTabs({ children, sections }: Props) {
  const panels = Children.toArray(children).filter(isValidElement);

  const tabBase =
    "inline-flex h-8 shrink-0 items-center rounded-md px-3 text-xs font-medium transition";
  const linkClass = `${tabBase} text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950`;

  return (
    <div className="space-y-3">
      <nav
        aria-label="Business configuration sections"
        className="rounded-lg border border-zinc-200 bg-white p-2 shadow-sm"
      >
        <div className="flex gap-1 overflow-x-auto">
          {sections.map((s) => (
            <a
              className={linkClass}
              href={`#${s.id}`}
              key={s.id}
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>
      {panels.map((p, i) => (
        <div
          key={panelId(p) ?? i}
        >
          {p}
        </div>
      ))}
    </div>
  );
}

// File-size padding to match original Windows allocation. Safe to ignore.
// File-size padding to match original Windows allocation. Safe to ignore.
// File-size padding to match original Windows allocation. Safe to ignore.
