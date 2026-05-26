"use client";

/**
 * ============================================================
 * File: components/dashboard/configuration-tabs.tsx
 * Project: BizPilot AI
 * Description: Provides section navigation for the business configuration workspace.
 * Role: Keeps every configuration section visible and reachable for Phase 18A manual QA.
 * Related:
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * - server/actions/business-configuration.actions.ts
 * Author: MoOoH
 * Created: 2026-05-16
 * Last Updated: 2026-05-18
 * Change Log:
 * - 2026-05-16: Created mounted tab panels so the parent form receives every required input on submit.
 * - 2026-05-18: Finalized sticky anchor tabs with theme-safe styling and mobile overflow.
 * - 2026-05-19: Switched to single-visible-panel tabs matching the approved index.html. Hidden panels remain mounted via Tailwind `hidden` (display:none) so their inputs continue to participate in FormData on submit — required by the consentNotice P0 fix.
 * ============================================================
 */

import type { ReactElement, ReactNode } from "react";
import { Children, isValidElement } from "react";
import { useState } from "react";

type Section = Readonly<{ id: string; label: string }>;
type Props = Readonly<{ children: ReactNode; sections: Section[] }>;

function panelId(panel: ReactElement): string | undefined {
  return (panel as ReactElement<{ id?: string }>).props.id;
}

export function ConfigurationTabs({ children, sections }: Props) {
  const panels = Children.toArray(children).filter(isValidElement);
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");

  return (
    <div className="grid gap-3 xl:grid-cols-[13rem_minmax(0,1fr)] xl:items-start">
      <nav
        aria-label="Quote setup sections"
        className="sticky top-[70px] z-10 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)]/95 p-1.5 shadow-sm backdrop-blur xl:p-2"
      >
        <div className="flex gap-1 overflow-x-auto pb-0.5 xl:grid xl:overflow-visible xl:pb-0">
          {sections.map((section) => (
            <button
              className={
                activeSection === section.id
                  ? "inline-flex h-9 shrink-0 items-center justify-start rounded-md border border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] px-3 text-left text-xs font-semibold text-[var(--dash-text)]"
                  : "inline-flex h-9 shrink-0 items-center justify-start rounded-md border border-transparent px-3 text-left text-xs font-semibold text-[var(--dash-text-secondary)] transition hover:border-[var(--dash-border)] hover:bg-[var(--dash-surface-muted)] hover:text-[var(--dash-text)]"
              }
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              type="button"
            >
              {section.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="min-w-0">
        {panels.map((panel, index) => (
          <div
            className={panelId(panel) === activeSection ? "block" : "hidden"}
            key={panelId(panel) ?? index}
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}
