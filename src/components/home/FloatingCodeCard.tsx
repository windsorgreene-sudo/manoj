"use client";

import { useEffect, useState } from "react";

// A hero decoration: a small "editor" card that types out short code snippets,
// rotating between languages. Pure client typewriter effect, reduced-motion safe.
const SNIPPETS = [
  { lang: "python", label: "hello.py", lines: ["def greet(name):", "    return f'Hi, {name}!'", "", "print(greet('coder'))"] },
  { lang: "javascript", label: "app.js", lines: ["const sum = (a, b) => a + b;", "", "console.log(sum(2, 3));", "// 5"] },
  { lang: "html", label: "index.html", lines: ["<h1>Learn. Code.</h1>", "<p>Build anything.</p>"] },
];

export function FloatingCodeCard() {
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const snippet = SNIPPETS[snippetIdx];
    const full = snippet.lines.join("\n");

    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setText(full);
      const t = setTimeout(() => setSnippetIdx((i) => (i + 1) % SNIPPETS.length), 4000);
      return () => clearTimeout(t);
    }

    let i = 0;
    setText("");
    const typer = setInterval(() => {
      i++;
      setText(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(typer);
        setTimeout(() => setSnippetIdx((s) => (s + 1) % SNIPPETS.length), 2200);
      }
    }, 32);
    return () => clearInterval(typer);
  }, [snippetIdx]);

  const snippet = SNIPPETS[snippetIdx];

  return (
    <div className="relative w-full max-w-sm">
      {/* Soft glow halo behind the card */}
      <div
        className="cv-float-slow pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/30 to-accent/30 blur-2xl"
        aria-hidden
      />
      <div className="cv-float cv-tilt w-full overflow-hidden rounded-2xl border border-[#2a313c] bg-[#0d1117] shadow-[var(--shadow-lg)]">
        <div className="flex items-center gap-2 border-b border-white/5 bg-[#161b22] px-3 py-2">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="ml-1 text-[11px] font-medium text-[#8b98a8]">{snippet.label}</span>
          <span className="ml-auto flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-[#5c6b7d]">
            <span className="cv-breathe h-1.5 w-1.5 rounded-full bg-[#28c840]" aria-hidden />
            {snippet.lang}
          </span>
        </div>
        <pre className="min-h-[132px] px-4 py-3 font-mono text-[13px] leading-6 text-[#e6edf3]">
          <code>
            {text}
            <span className="cv-caret ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-primary/80 align-middle" />
          </code>
        </pre>
      </div>
    </div>
  );
}
