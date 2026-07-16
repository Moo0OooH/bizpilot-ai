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
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Replaced the nested desktop sidebar with one compact horizontal task bar to reduce dashboard navigation density.
 * - 2026-07-05: Added pressed state and panel controls to Quote Setup section tabs.
 * - 2026-07-11: Localized the Quote Setup tab-list aria label through dashboard copy.
 * - 2026-05-16: Created mounted tab panels so the parent form receives every required input on submit.
 * - 2026-05-18: Finalized sticky anchor tabs with theme-safe styling and mobile overflow.
 * - 2026-05-19: Switched to single-visible-panel tabs matching the approved index.html. Hidden panels remain mounted via Tailwind `hidden` (display:none) so their inputs continue to participate in FormData on submit — required by the consentNotice P0 fix.
 * ============================================================
 */

import type { ReactElement, ReactNode } from "react";
import { Children, isValidElement } from "react";
import { useState } from "react";

type Section = Readonly<{ id: string; label: string }>;
type Props = Readonly<{
  ariaLabel: string;
  children: ReactNode;
  sections: Section[];
}>;

function panelId(panel: ReactElement): string | undefined {
  return (panel as ReactElement<{ id?: string }>).props.id;
}

export function ConfigurationTabs({ ariaLabel, children, sections }: Props) {
  const panels = Children.toArray(children).filter(isValidElement);
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");

  return (
    <div className="grid min-w-0 gap-3">
      <nav
        aria-label={ariaLabel}
        className="sticky top-[66px] z-10 min-w-0 max-w-full overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)]/95 p-1.5 shadow-sm backdrop-blur"
      >
        <div className="flex min-w-0 gap-1 overflow-x-auto pb-0.5">
          {sections.map((section) => (
            <button
              aria-controls={section.id}
              aria-pressed={activeSection === section.id}
              className={
                activeSection === section.id
                  ? "inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] px-3.5 text-center text-[13px] font-bold text-[var(--dash-text)]"
                  : "inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-transparent px-3.5 text-center text-[13px] font-bold text-[var(--dash-text-secondary)] transition hover:border-[var(--dash-border)] hover:bg-[var(--dash-surface-muted)] hover:text-[var(--dash-text)]"
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
