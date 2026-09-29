"use client";

/** Last-resort 500 page (replaces the root layout, so it must render <html>/<body> itself). */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100dvh", display: "grid", placeItems: "center", background: "#0A0A14", color: "#EDEDF5", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ textAlign: "center", padding: 24 }}>
          <p style={{ color: "#EF4444", fontFamily: "monospace" }}>Error 500</p>
          <h1 style={{ fontSize: 36, margin: "12px 0" }}>Kodshala is having a moment</h1>
          <p style={{ color: "#A1A1B8" }}>Please refresh the page. If this keeps happening, email support@kodshala.com.</p>
          <button onClick={reset} style={{ marginTop: 24, background: "#7C3AED", color: "#fff", border: 0, borderRadius: 12, padding: "12px 20px", fontWeight: 600, cursor: "pointer" }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
