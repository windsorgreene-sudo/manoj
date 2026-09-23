import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EduLearn, learn, code, build";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0d1117 0%, #1e1b4b 100%)",
          padding: "64px",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "linear-gradient(135deg, #2f7bec, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            🎓
          </div>
          <div style={{ fontSize: 42, fontWeight: 800 }}>EduLearn</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, maxWidth: 950 }}>
            Learn. Code. Build.
          </div>
          <div style={{ fontSize: 30, color: "#9fb0c3", maxWidth: 950 }}>
            Animated tutorials, a live code editor and expert-crafted courses for developers.
          </div>
        </div>

        <div style={{ fontSize: 26, color: "#4f9cf9", fontWeight: 700 }}>codevidya.vercel.app</div>
      </div>
    ),
    { ...size },
  );
}
