"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { monacoLangId } from "@/lib/piston";

// Monaco is heavy, so we load it only on the client via dynamic import with a
// skeleton fallback.
const Monaco = dynamic(() => import("@monaco-editor/react").then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#0d1117]">
      <div className="h-6 w-40 animate-pulse rounded bg-white/10" />
    </div>
  ),
});

export function CodeEditor({
  value,
  onChange,
  language,
  height = "100%",
  onRunShortcut,
}: {
  value: string;
  onChange: (v: string) => void;
  language: string;
  height?: string | number;
  onRunShortcut?: () => void;
}) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return (
    <Monaco
      height={height}
      language={monacoLangId(language)}
      theme={isDark ? "vs-dark" : "light"}
      value={value}
      onChange={(v) => onChange(v ?? "")}
      onMount={(editor, monaco) => {
        if (onRunShortcut) {
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, onRunShortcut);
        }
      }}
      options={{
        fontSize: 14,
        fontFamily: "var(--font-mono), monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 14, bottom: 14 },
        smoothScrolling: true,
        tabSize: 2,
        automaticLayout: true,
        lineNumbersMinChars: 3,
        renderLineHighlight: "line",
      }}
    />
  );
}
