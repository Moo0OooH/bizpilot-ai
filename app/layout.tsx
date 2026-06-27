/**
 * ============================================================
 * File: app/layout.tsx
 * Project: BizPilot AI
 * Description: Defines the root application layout and metadata.
 * Role: Provides global HTML structure, fonts, theme bootstrapping, and layout shell for all routes.
 * Related:
 * - app/page.tsx
 * - app/globals.css
 * Author: MoOoH
 * Created: 2026-05-02
 * Last Updated: 2026-06-27
 * Change Log:
 * - 2026-05-04: Added standard project file header.
 * - 2026-05-04: Updated metadata description for Phase 2 tenant foundation.
 * - 2026-05-05: Updated metadata description for Phase 3 configuration core.
 * - 2026-05-17: Updated metadata for the quote recovery landing page.
 * - 2026-06-19: Added shared System/Light/Dark theme preference bootstrapping.
 * - 2026-06-19: Defaulted fresh sessions to Light and synced theme-color before paint.
 * - 2026-06-21: Aligned global metadata with canonical manual-first public copy.
 * - 2026-06-27: Moved theme bootstrap into the document head to avoid hydration warnings.
 * ============================================================
 */

import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import {
  INTERFACE_LANGUAGE_COOKIE,
  readSupportedLanguage,
} from "@/lib/i18n/language";
import { getPublicSiteOrigin, PUBLIC_SITE_NAME } from "@/lib/seo";
import {
  DEFAULT_THEME_PREFERENCE,
  THEME_COLOR_BY_RESOLVED,
  THEME_PREFERENCE_COOKIE,
  THEME_PREFERENCE_STORAGE_KEY,
  readThemePreference,
  resolveThemeForServer,
} from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const themeBootstrapScript = `(function(){try{var r=document.documentElement;var k="${THEME_PREFERENCE_STORAGE_KEY}";var c="${THEME_PREFERENCE_COOKIE}";var lightColor="${THEME_COLOR_BY_RESOLVED.light}";var darkColor="${THEME_COLOR_BY_RESOLVED.dark}";var valid=function(value){return value==="system"||value==="light"||value==="dark"?value:""};var m=document.cookie.match(new RegExp("(?:^|; )"+c+"=([^;]*)"));var cookie=m?decodeURIComponent(m[1]):"";var stored="";try{stored=window.localStorage.getItem(k)||""}catch(error){}var pref=valid(stored)||valid(cookie)||valid(r.dataset.themePreference)||"${DEFAULT_THEME_PREFERENCE}";var systemDark=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;var theme=pref==="system"?(systemDark?"dark":"light"):pref;r.dataset.themePreference=pref;r.dataset.theme=theme;r.style.colorScheme=theme;var meta=document.querySelector('meta[name="theme-color"]');if(!meta){meta=document.createElement("meta");meta.setAttribute("name","theme-color");document.head.appendChild(meta)}meta.setAttribute("content",theme==="dark"?darkColor:lightColor);}catch(error){}})();`;

export const metadata: Metadata = {
  description:
    "BizPilot AI helps cleaning businesses collect quote requests, organize leads, and prepare replies for owner review without auto-send.",
  metadataBase: new URL(getPublicSiteOrigin()),
  openGraph: {
    description:
      "BizPilot AI helps cleaning businesses collect quote requests, organize leads, and prepare replies for owner review without auto-send.",
    siteName: PUBLIC_SITE_NAME,
    title: "BizPilot AI | Lead Recovery for Cleaning Businesses",
    type: "website",
    url: getPublicSiteOrigin(),
  },
  title: "BizPilot AI | Lead Recovery for Cleaning Businesses",
  twitter: {
    card: "summary",
    description:
      "BizPilot AI helps cleaning businesses collect quote requests, organize leads, and prepare replies for owner review without auto-send.",
    title: "BizPilot AI | Lead Recovery for Cleaning Businesses",
  },
};

export const viewport: Viewport = {
  themeColor: THEME_COLOR_BY_RESOLVED.light,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const language = readSupportedLanguage(
    cookieStore.get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
  const themePreference = readThemePreference(
    cookieStore.get(THEME_PREFERENCE_COOKIE)?.value,
  );
  const serverTheme = resolveThemeForServer(themePreference);

  return (
    <html
      lang={language}
      data-theme={serverTheme}
      data-theme-preference={themePreference}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          id="bizpilot-theme-bootstrap"
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
