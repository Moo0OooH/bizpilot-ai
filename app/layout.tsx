/**
 * ============================================================
 * File: app/layout.tsx
 * Project: BizPilot AI
 * Description: Defines the root application layout and metadata.
 * Role: Provides global HTML structure, fonts, and layout shell for all routes.
 * Related:
 * - app/page.tsx
 * - app/globals.css
 * Author: MoOoH
 * Created: 2026-05-02
 * Last Updated: 2026-05-17
 * Change Log:
 * - 2026-05-04: Added standard project file header.
 * - 2026-05-04: Updated metadata description for Phase 2 tenant foundation.
 * - 2026-05-05: Updated metadata description for Phase 3 configuration core.
 * - 2026-05-17: Updated metadata for the quote recovery landing page.
 * ============================================================
 */

import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import {
  INTERFACE_LANGUAGE_COOKIE,
  readSupportedLanguage,
} from "@/lib/i18n/language";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BizPilot | Reply Before Competitors Do",
  description:
    "AI lead recovery for cleaning businesses. Capture quote requests, draft faster replies, and book more jobs before competitors respond.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );

  return (
    <html
      lang={language}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
