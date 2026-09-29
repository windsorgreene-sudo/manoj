import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared branded OG card (Satori, flexbox only, inline styles). */
export function ogCard({ eyebrow, title, subtitle, accent = "#7C3AED" }: { eyebrow: string; title: string; subtitle?: string; accent?: string }) {
  const t = title.length > 90 ? `${title.slice(0, 87)}…` : title;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: `radial-gradient(circle at 85% 15%, ${accent}66, transparent 45%), radial-gradient(circle at 10% 90%, #06B6D455, transparent 40%), #0A0A14`,
          color: "#F4F4FA",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #7C3AED, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 800 }}>{"</>"}</div>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -0.5 }}>CodeVerse</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 26, textTransform: "uppercase", letterSpacing: 4, color: "#67E8F9" }}>{eyebrow}</div>
          <div style={{ fontSize: t.length > 50 ? 60 : 76, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5 }}>{t}</div>
          {subtitle ? <div style={{ fontSize: 30, color: "#A1A1B5", lineHeight: 1.35 }}>{subtitle.length > 140 ? `${subtitle.slice(0, 137)}…` : subtitle}</div> : null}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#A1A1B5" }}>
          <div>Learn · Practice · Compete · Get hired</div>
          <div style={{ color: accent }}>codeverse.dev</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
