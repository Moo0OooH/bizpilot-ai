/**
 * ============================================================
 * File: app/opengraph-image.tsx
 * Project: BizPilot AI
 * Description: Generated social preview image for public marketing metadata.
 * Role: Presents the final V3 message-to-request workflow without external assets or unsupported claims.
 * Related:
 * - lib/seo.ts
 * - app/page.tsx
 * - lib/i18n/public-v3-spec.ts
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Aligned the social preview with the final V3 hero and current-product boundaries.
 * ============================================================
 */

import { ImageResponse } from "next/og";

export const alt =
  "BizPilot AI turns scattered customer messages into complete requests and replies ready to review";
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
            gap: 30,
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
                  Smart customer intake and reply workspace
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
                fontSize: 62,
                fontWeight: 900,
                letterSpacing: -1.5,
                lineHeight: 1.03,
                maxWidth: 980,
              }}
            >
              Turn scattered customer messages into complete requests—and replies ready to review.
            </div>
            <div
              style={{
                color: "#334155",
                fontSize: 27,
                fontWeight: 800,
                lineHeight: 1.35,
                maxWidth: 980,
              }}
            >
              One Smart Intake Link collects the details. Your team reviews, edits,
              copies, and sends every reply.
            </div>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            {["One Smart Intake Link", "Human-reviewed drafts", "Manual sending"].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    background: "#EFF6FF",
                    border: "1px solid #BFDBFE",
                    borderRadius: 999,
                    color: "#1D4ED8",
                    fontSize: 21,
                    fontWeight: 900,
                    padding: "14px 20px",
                  }}
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
