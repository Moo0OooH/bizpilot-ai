/**
 * ============================================================
 * File: next.config.ts
 * Project: BizPilot AI
 * Description: Next.js runtime, security-header, image, development-origin, and public redirect configuration.
 * Role: Applies application-wide framework behavior and the permanent Website V3 route-consolidation map.
 * Related:
 * - proxy.ts
 * - docs/website-v4/CURRENT.md
 * - tests/unit/seo-source.test.mts
 * Author: MoOoH
 * Created: 2026-05-02
 * Last Updated: 2026-07-15
 * Change Log:
 * - 2026-07-15: Repointed route-consolidation authority to the current Website V4 contract.
 * - 2026-07-13: Added five permanent direct redirects for the approved Website V3 route consolidation.
 * ============================================================
 */

import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
const developmentConnectSources = isDevelopment
  ? " http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*"
  : "";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co${developmentConnectSources}`,
  "worker-src 'self' blob:",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  ...(isDevelopment ? { allowedDevOrigins: ["127.0.0.1"] } : {}),
  async redirects() {
    return [
      {
        destination: "/features#focused-by-design",
        permanent: true,
        source: "/comparison",
      },
      {
        destination: "/features#share-anywhere",
        permanent: true,
        source: "/quote-link-guide",
      },
      {
        destination: "/#how-it-works",
        permanent: true,
        source: "/faster-quote-replies",
      },
      {
        destination: "/features#reply-drafts",
        permanent: true,
        source: "/content-studio",
      },
      {
        destination: "/demo",
        permanent: true,
        source: "/industries/cleaning",
      },
    ];
  },
  async headers() {
    return [
      {
        headers: securityHeaders,
        source: "/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
