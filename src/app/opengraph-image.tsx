import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CodeVidya, exam-ready notes and tutorials for GGSIPU students";
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
          <div style={{ fontSize: 42, fontWeight: 800 }}>CodeVidya</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.1, maxWidth: 980 }}>
            Notes, tutorials &amp; solved code for IPU exams
          </div>
          <div style={{ fontSize: 30, color: "#9fb0c3", maxWidth: 980 }}>
            BCA · B.Tech · MCA — C, Python, DSA, DBMS, Java, OS, Networks and more
          </div>
        </div>

        <div style={{ fontSize: 26, color: "#4f9cf9", fontWeight: 700 }}>codevidya.vercel.app</div>
      </div>
    ),
    { ...size },
  );
}
