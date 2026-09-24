import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "IndiskaAI - AI-Accelerated Antibody Discovery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#FAF7F0",
          position: "relative",
        }}
      >
        {/* Soft gradient blobs */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -180,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background:
              "radial-gradient(closest-side, rgba(244,196,48,0.55), rgba(244,196,48,0))",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -160,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background:
              "radial-gradient(closest-side, rgba(30,91,168,0.5), rgba(30,91,168,0))",
            filter: "blur(40px)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: "#F4C430",
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#6B6B6B",
            }}
          >
            IndiskaAI
          </div>
        </div>

        <div
          style={{
            fontSize: 100,
            lineHeight: 1.02,
            letterSpacing: -3,
            color: "#1A1A1A",
            fontFamily: "serif",
            maxWidth: 980,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>From sequence</span>
          <span>
            to{" "}
            <span style={{ fontStyle: "italic", color: "#1E5BA8" }}>
              therapeutic
            </span>
            ,
          </span>
          <span>accelerated.</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#3A3A3A",
            fontSize: 22,
          }}
        >
          <span>AI-accelerated antibody discovery and engineering</span>
          <span style={{ color: "#6B6B6B" }}>indiskaai.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
