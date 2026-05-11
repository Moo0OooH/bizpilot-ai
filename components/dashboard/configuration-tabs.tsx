"use client";

/**
 * ============================================================
 * File: components/dashboard/configuration-tabs.tsx
 * Project: BizPilot AI
 * Description: Renders page-level Business Configuration navigation.
 * Role: Keeps setup sections focused by showing one guided panel at a time.
 * Related:
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-05-10
 * Change Log:
 * - 2026-05-10: Added focused tabbed navigation for Business Configuration.
 * ============================================================
 */

import { Children, isValidElement, useState } from "react";

type ConfigurationSection = Readonly<{
  id: string;
  label: string;
}>;

type ConfigurationTabsProps = Readonly<{
  children: React.ReactNode;
  sections: ConfigurationSection[];
}>;

export function ConfigurationTabs({
  children,
  sections,
}: ConfigurationTabsProps) {
  const [activeSectionId, setActiveSectionId] = useState(
    sections[0]?.id ?? "",
  );
  const sectionPanels = Children.toArray(children).filter(isValidElement);
  const activePanel = sectionPanels.find(
    (child) =>
      (child as React.ReactElement<{ id?: string }>).props.id ===
      activeSectionId,
  );

  return (
    <div className="space-y-3">
      <nav
        aria-label="Business configuration sections"
        className="rounded-lg border border-zinc-200 bg-white p-2 shadow-sm"
      >
        <div className="flex gap-1 overflow-x-auto">
          {sections.map((section) => (
            <button
              aria-current={section.id === activeSectionId ? "page" : undefined}
              className={
                section.id === activeSectionId
                  ? "inline-flex h-8 shrink-0 items-center rounded-md bg-zinc-950 px-3 text-xs font-medium text-white"
                  : "inline-flex h-8 shrink-0 items-center rounded-md px-3 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
              }
              key={section.id}
              onClick={() => {
                setActiveSectionId(section.id);
              }}
              type="button"
            >
              {section.label}
            </button>
          ))}
        </div>
      </nav>

      {activePanel ?? sectionPanels[0]}
    </div>
  );
}
