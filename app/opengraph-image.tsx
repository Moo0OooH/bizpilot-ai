/**
 * ============================================================
 * File: app/opengraph-image.tsx
 * Project: BizPilot AI
 * Description: Generated social preview image for public marketing metadata.
 * Role: Provides a stable Open Graph/Twitter image without tracking scripts or external assets.
 * Related:
 * - lib/seo.ts
 * - app/page.tsx
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-05
 * Change Log:
 * - 2026-07-05: Added complete BizPilot source header metadata for the social preview image route.
 * - 2026-07-04: Created generated Open Graph image for public marketing routes.
 * ============================================================
 */

import { ImageResponse } from "next/og";

export const alt = "BizPilot AI lead recovery for cleaning businesses";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200,
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#F8FAFC",
          color: "#0F172A",
          display: "flex",
          fontFamily: "Arial, Helvetica, sans-serif",
          height: "100%",
          padding: 64,
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #CBD5E1",
            borderRadius: 28,
            boxShadow: "0 30px 80px rgba(15, 23, 42, 0.14)",
            display: "flex",
            flexDirection: "column",
            gap: 32,
            justifyContent: "space-between",
            padding: 54,
            width: "100%",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 18 }}>
              <div
                style={{
                  alignItems: "center",
                  background: "#2563EB",
                  borderRadius: 16,
                  color: "#FFFFFF",
                  display: "flex",
                  fontSize: 34,
                  fontWeight: 900,
                  height: 68,
                  justifyContent: "center",
                  width: 68,
                }}
              >
                B
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 34, fontWeight: 900 }}>BizPilot AI</div>
                <div style={{ color: "#475569", fontSize: 22, fontWeight: 800 }}>
                  Lead recovery for cleaning businesses
                </div>
              </div>
            </div>
            <div
              style={{
                alignItems: "center",
                background: "#ECFDF5",
                border: "1px solid #A7F3D0",
                borderRadius: 999,
                color: "#047857",
                display: "flex",
                fontSize: 20,
                fontWeight: 900,
                height: 50,
                padding: "0 22px",
              }}
            >
              Owner-reviewed AI
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                fontSize: 66,
                fontWeight: 900,
                letterSpacing: 0,
                lineHeight: 1.04,
                maxWidth: 850,
              }}
            >
              Stop losing cleaning quote requests in scattered inboxes.
            </div>
            <div
              style={{
                color: "#334155",
                fontSize: 28,
                fontWeight: 800,
                lineHeight: 1.35,
                maxWidth: 900,
              }}
            >
              Capture quote requests, organize leads, prepare reply drafts, and
              send manually from the channels you already use.
            </div>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            {["No auto-send", "No invented price", "No booking claim"].map((item) => (
              <div
                key={item}
                style={{
                  background: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                  borderRadius: 999,
                  color: "#1D4ED8",
                  fontSize: 22,
                  fontWeight: 900,
                  padding: "14px 20px",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
