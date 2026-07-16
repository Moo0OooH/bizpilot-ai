"use client";

/**
 * ============================================================
 * File: components/dashboard/branding-editor.tsx
 * Project: BizPilot AI
 * Description: Interactive owner-facing public quote branding editor.
 * Role: Supports safe local logo selection, HTTPS logo URLs, theme colors, reset controls, and a live customer-form preview.
 * Related:
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * - app/(public)/quote/[slug]/page.tsx
 * - server/services/business-configuration.service.ts
 * Author: MoOoH
 * Created: 2026-07-16
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Added local PNG/JPEG/WebP logo selection, bounded browser resizing, URL fallback, color controls, and live preview.
 * ============================================================
 */

import { useState, type ChangeEvent } from "react";

type BrandingEditorCopy = Readonly<{
  accentAppears: string;
  accentColor: string;
  fileError: string;
  logoPreview: string;
  logoPreviewAlt: string;
  logoUrl: string;
  logoUrlHelp: string;
  primaryColor: string;
  publicQuoteButton: string;
  removeLogo: string;
  resetColors: string;
  submitQuoteRequest: string;
  uploadHelp: string;
  uploadLogo: string;
  whereColorsApply: string;
}>;

type BrandingEditorProps = Readonly<{
  businessName: string;
  copy: BrandingEditorCopy;
  initialAccentColor: string;
  initialLogoUrl: string;
  initialPrimaryColor: string;
}>;

const DEFAULT_PRIMARY = "#18181b";
const DEFAULT_ACCENT = "#0f766e";
const MAX_SOURCE_BYTES = 2 * 1024 * 1024;
const MAX_DATA_URL_LENGTH = 360_000;
const MAX_LOGO_EDGE = 512;
const ALLOWED_FILE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Logo image could not be read."));
    image.src = source;
  });
}

async function createBoundedLogoDataUrl(file: File): Promise<string> {
  if (!ALLOWED_FILE_TYPES.has(file.type) || file.size > MAX_SOURCE_BYTES) {
    throw new Error("Unsupported logo file.");
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const scale = Math.min(
      1,
      MAX_LOGO_EDGE / Math.max(image.naturalWidth, image.naturalHeight, 1),
    );
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Logo canvas is unavailable.");
    }

    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    const preferredType = file.type === "image/png" ? "image/png" : "image/webp";
    let result = canvas.toDataURL(preferredType, 0.88);

    if (result.length > MAX_DATA_URL_LENGTH) {
      result = canvas.toDataURL("image/webp", 0.78);
    }

    if (result.length > MAX_DATA_URL_LENGTH) {
      throw new Error("Processed logo is too large.");
    }

    return result;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function LogoImage({ alt, source }: Readonly<{ alt: string; source: string }>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Owner-selected data/HTTPS images are intentionally previewed before the configuration is saved.
    <img alt={alt} className="h-full max-h-24 w-full object-contain p-3" src={source} />
  );
}

export function BrandingEditor({
  businessName,
  copy,
  initialAccentColor,
  initialLogoUrl,
  initialPrimaryColor,
}: BrandingEditorProps) {
  const [accentColor, setAccentColor] = useState(initialAccentColor);
  const [error, setError] = useState("");
  const [logoSource, setLogoSource] = useState(initialLogoUrl);
  const [logoUrlDraft, setLogoUrlDraft] = useState(
    initialLogoUrl.startsWith("data:") ? "" : initialLogoUrl,
  );
  const [primaryColor, setPrimaryColor] = useState(initialPrimaryColor);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) return;

    try {
      const dataUrl = await createBoundedLogoDataUrl(file);
      setError("");
      setLogoSource(dataUrl);
      setLogoUrlDraft("");
    } catch {
      setError(copy.fileError);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="grid min-w-0 gap-4">
        <input name="logoUrl" type="hidden" value={logoSource} />

        <div className="grid gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3.5 sm:grid-cols-2">
          <label className="grid gap-1.5 text-[13px] font-bold text-[var(--dash-text)]">
            {copy.uploadLogo}
            <input
              accept="image/png,image/jpeg,image/webp"
              className="biz-field min-h-11 w-full rounded-lg border px-3 py-2 text-[13px] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--dash-primary-soft)] file:px-3 file:py-1.5 file:font-bold file:text-[var(--dash-primary-strong)]"
              onChange={handleFileChange}
              type="file"
            />
            <span className="text-[12px] font-medium leading-5 text-[var(--dash-text-muted)]">
              {copy.uploadHelp}
            </span>
          </label>

          <label className="grid gap-1.5 text-[13px] font-bold text-[var(--dash-text)]">
            {copy.logoUrl}
            <input
              autoComplete="url"
              className="biz-field h-11 w-full rounded-lg border px-3 text-[13px] outline-none transition focus:border-[var(--dash-primary)]"
              onChange={(event) => {
                const value = event.currentTarget.value;
                setError("");
                setLogoUrlDraft(value);
                setLogoSource(value.trim());
              }}
              placeholder="https://example.com/logo.png"
              type="url"
              value={logoUrlDraft}
            />
            <span className="text-[12px] font-medium leading-5 text-[var(--dash-text-muted)]">
              {copy.logoUrlHelp}
            </span>
          </label>

          {error ? (
            <p className="rounded-lg border border-[var(--dash-danger-border)] bg-[var(--dash-danger-soft)] px-3 py-2 text-[12px] font-bold text-[var(--dash-danger-strong)] sm:col-span-2" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button
              className="biz-button-secondary inline-flex h-9 items-center justify-center rounded-lg border px-3 text-[12px] font-bold"
              onClick={() => {
                setError("");
                setLogoSource("");
                setLogoUrlDraft("");
              }}
              type="button"
            >
              {copy.removeLogo}
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
          <label className="grid gap-1.5 text-[13px] font-bold text-[var(--dash-text)]">
            {copy.primaryColor}
            <span className="flex h-11 items-center gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3">
              <input
                className="h-7 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
                name="primaryColor"
                onChange={(event) => setPrimaryColor(event.currentTarget.value)}
                type="color"
                value={primaryColor}
              />
              <span className="font-mono text-[12px] uppercase text-[var(--dash-text-secondary)]">
                {primaryColor}
              </span>
            </span>
          </label>
          <label className="grid gap-1.5 text-[13px] font-bold text-[var(--dash-text)]">
            {copy.accentColor}
            <span className="flex h-11 items-center gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3">
              <input
                className="h-7 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
                name="accentColor"
                onChange={(event) => setAccentColor(event.currentTarget.value)}
                type="color"
                value={accentColor}
              />
              <span className="font-mono text-[12px] uppercase text-[var(--dash-text-secondary)]">
                {accentColor}
              </span>
            </span>
          </label>
          <button
            className="biz-button-secondary inline-flex h-11 items-center justify-center rounded-lg border px-3 text-[12px] font-bold"
            onClick={() => {
              setPrimaryColor(DEFAULT_PRIMARY);
              setAccentColor(DEFAULT_ACCENT);
            }}
            type="button"
          >
            {copy.resetColors}
          </button>
        </div>
      </div>

      <aside className="overflow-hidden rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-muted)]">
        <div className="flex min-h-28 items-center justify-center border-b border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-4">
          {logoSource ? (
            <LogoImage alt={copy.logoPreviewAlt} source={logoSource} />
          ) : (
            <span
              className="flex h-14 w-14 items-center justify-center rounded-xl text-[16px] font-black text-white"
              style={{ backgroundColor: primaryColor }}
            >
              {businessName
                .split(/\s+/)
                .map((word) => word.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase() || "BP"}
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-[12px] font-black uppercase tracking-[0.08em] text-[var(--dash-text-muted)]">
            {copy.logoPreview}
          </p>
          <p className="mt-2 text-[16px] font-black text-[var(--dash-text)]">
            {businessName}
          </p>
          <div className="mt-4 overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-preview-bg)] p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] font-bold text-[#F5F7FA]">
                {copy.publicQuoteButton}
              </span>
              <span
                className="rounded-md px-3 py-1.5 text-[12px] font-bold text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {copy.submitQuoteRequest}
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{ backgroundColor: accentColor, width: "62%" }}
              />
            </div>
          </div>
          <p className="mt-3 flex items-start gap-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            <span
              aria-hidden
              className="mt-1 h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            {copy.accentAppears}
          </p>
          <p className="mt-2 text-[12px] leading-5 text-[var(--dash-text-muted)]">
            {copy.whereColorsApply}
          </p>
        </div>
      </aside>
    </div>
  );
}
