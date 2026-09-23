import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CodeVidya — study portal for GGSIPU students";
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
          background: "linear-gradient(135deg, #0b1120 0%, #10322b 100%)",
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
              background: "linear-gradient(135deg, #2dd4b0, #f0a53a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
              color: "#04140f",
            }}
          >
            &lt;/&gt;
          </div>
          <div style={{ fontSize: 42, fontWeight: 800 }}>CodeVidya</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.1, maxWidth: 900 }}>
            Notes, tutorials &amp; solved programs for IPU exams
          </div>
          <div style={{ fontSize: 30, color: "#a2adc4", maxWidth: 900 }}>
            BCA · B.Tech · MCA — Python, Java, C++, DSA, DBMS and more
          </div>
        </div>

        <div style={{ fontSize: 26, color: "#2dd4b0", fontWeight: 700 }}>
          codevidya.vercel.app
        </div>
      </div>
    ),
    { ...size },
  );
}
