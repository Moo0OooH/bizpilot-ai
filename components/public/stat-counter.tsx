"use client";

/**
 * ============================================================
 * File: components/public/stat-counter.tsx
 * Project: BizPilot AI
 * Description: Lightweight count-up animation for marketing stat blocks.
 * Role: Animates a number from 0 to a target value when the element scrolls
 * into view. Respects prefers-reduced-motion by rendering the final value
 * without calling setState synchronously inside effects.
 * Author: MoOoH
 * Created: 2026-05-19
 * Last Updated: 2026-05-21
 * Change Log:
 * - 2026-05-21: Reworked reduced-motion handling with useSyncExternalStore
 *   to satisfy React hooks lint while preserving the existing animation.
 * ============================================================
 */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Props = Readonly<{
  /** Final value to animate to. */
  to: number;
  /** Optional prefix (e.g. "$ "). */
  prefix?: string;
  /** Optional suffix (e.g. "%", "min"). */
  suffix?: string;
  /** Animation duration in ms. Default 1100. */
  durationMs?: number;
  /** Format with thousands separators. Default true. */
  format?: boolean;
}>;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function subscribeToReducedMotion(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", callback);

  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerReducedMotionSnapshot(): boolean {
  return false;
}

export function StatCounter({
  to,
  prefix = "",
  suffix = "",
  durationMs = 1100,
  format = true,
}: Props) {
  const [value, setValue] = useState(0);
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const animatedRef = useRef(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (prefersReducedMotion) {
      animatedRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || animatedRef.current) return;

          animatedRef.current = true;
          const start = performance.now();

          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(1, elapsed / durationMs);
            setValue(Math.round(easeOutCubic(progress) * to));

            if (progress < 1) {
              animationFrameRef.current = requestAnimationFrame(step);
            }
          };

          animationFrameRef.current = requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [durationMs, prefersReducedMotion, to]);

  const displayValue = prefersReducedMotion ? to : value;
  const display = format
    ? displayValue.toLocaleString("en-US")
    : String(displayValue);

  return (
    <span ref={elementRef}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
