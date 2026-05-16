"use client";

// Fix 2026-05-16: every panel stays mounted; only the active one is visible
// via `hidden`. The parent form now receives every required input on submit.

import type { ReactElement, ReactNode } from "react";
import { Children, isValidElement, useId, useState } from "react";

type Section = Readonly<{ id: string; label: string }>;
type Props = Readonly<{ children: ReactNode; sections: Section[] }>;

function panelId(p: ReactElement): string | undefined {
  return (p as ReactElement<{ id?: string }>).props.id;
}

export function ConfigurationTabs({ children, sections }: Props) {
  const baseId = useId();
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const panels = Children.toArray(children).filter(isValidElement);
  const matched = panels.findIndex((p) => panelId(p) === active);
  const activeIndex = matched >= 0 ? matched : 0;

  const tabBase =
    "inline-flex h-8 shrink-0 items-center rounded-md px-3 text-xs font-medium transition";
  const on = `${tabBase} bg-zinc-950 text-white`;
  const off = `${tabBase} text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950`;

  return (
    <div className="space-y-3">
      <nav
        aria-label="Business configuration sections"
        className="rounded-lg border border-zinc-200 bg-white p-2 shadow-sm"
      >
        <div className="flex gap-1 overflow-x-auto" role="tablist">
          {sections.map((s) => (
            <button
              aria-controls={s.id}
              aria-selected={s.id === active}
              className={s.id === active ? on : off}
              id={`${baseId}-${s.id}`}
              key={s.id}
              onClick={() => setActive(s.id)}
              role="tab"
              type="button"
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>
      {panels.map((p, i) => (
        <div
          aria-labelledby={panelId(p) ? `${baseId}-${panelId(p)}` : undefined}
          hidden={i !== activeIndex}
          key={panelId(p) ?? i}
          role="tabpanel"
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
