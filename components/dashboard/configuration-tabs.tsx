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
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Aligned the sticky tab rail with the dashboard scrollport and contained touch scrolling on narrow viewports.
 * - 2026-07-16: Made setup deep links hash-aware and added complete tab/tabpanel keyboard semantics.
 * - 2026-07-16: Replaced the nested desktop sidebar with one compact horizontal task bar to reduce dashboard navigation density.
 * - 2026-07-05: Added pressed state and panel controls to Quote Setup section tabs.
 * - 2026-07-11: Localized the Quote Setup tab-list aria label through dashboard copy.
 * - 2026-05-16: Created mounted tab panels so the parent form receives every required input on submit.
 * - 2026-05-18: Finalized sticky anchor tabs with theme-safe styling and mobile overflow.
 * - 2026-05-19: Switched to single-visible-panel tabs matching the approved index.html. Hidden panels remain mounted via Tailwind `hidden` (display:none) so their inputs continue to participate in FormData on submit — required by the consentNotice P0 fix.
 * ============================================================
 */

import type { KeyboardEvent, ReactElement, ReactNode } from "react";
import { Children, isValidElement } from "react";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    function syncHash() {
      const requested = window.location.hash.replace(/^#/, "");
      if (sections.some((section) => section.id === requested)) {
        setActiveSection(requested);
      }
    }

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [sections]);

  function selectSection(sectionId: string) {
    setActiveSection(sectionId);
    window.history.replaceState(null, "", `#${sectionId}`);
  }

  function moveTab(
    event: KeyboardEvent<HTMLButtonElement>,
    sectionId: string,
  ) {
    const currentIndex = sections.findIndex(
      (section) => section.id === sectionId,
    );
    if (currentIndex < 0) return;

    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % sections.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + sections.length) % sections.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = sections.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextSection = sections[nextIndex];
    if (!nextSection) return;
    selectSection(nextSection.id);
    document.getElementById(`setup-tab-${nextSection.id}`)?.focus();
  }

  return (
    <div className="grid min-w-0 gap-3">
      <nav
        className="sticky top-2 z-10 min-w-0 max-w-full overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)]/95 p-1.5 shadow-sm backdrop-blur"
      >
        <div
          aria-label={ariaLabel}
          aria-orientation="horizontal"
          className="flex min-w-0 gap-1 overflow-x-auto overscroll-x-contain max-w-full scroll-px-2 touch-pan-x pb-0.5 [scrollbar-width:thin]"
          role="tablist"
        >
          {sections.map((section) => (
            <button
              aria-controls={`setup-panel-${section.id}`}
              aria-selected={activeSection === section.id}
              className={
                activeSection === section.id
                  ? "inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] px-3.5 text-center text-[13px] font-bold text-[var(--dash-text)]"
                  : "inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-transparent px-3.5 text-center text-[13px] font-bold text-[var(--dash-text-secondary)] transition hover:border-[var(--dash-border)] hover:bg-[var(--dash-surface-muted)] hover:text-[var(--dash-text)]"
              }
              key={section.id}
              id={`setup-tab-${section.id}`}
              onClick={() => selectSection(section.id)}
              onKeyDown={(event) => moveTab(event, section.id)}
              role="tab"
              tabIndex={activeSection === section.id ? 0 : -1}
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
            aria-labelledby={`setup-tab-${panelId(panel) ?? "panel"}`}
            className={panelId(panel) === activeSection ? "block" : "hidden"}
            id={`setup-panel-${panelId(panel) ?? index}`}
            key={panelId(panel) ?? index}
            role="tabpanel"
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}
