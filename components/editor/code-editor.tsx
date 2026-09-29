"use client";

import Editor, { type OnMount } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import { LANGUAGE_META, type LanguageKey } from "@/lib/languages";
import { usePrefsStore } from "@/lib/stores/prefs-store";

type Props = {
  language: LanguageKey;
  value: string;
  onChange: (v: string) => void;
  height?: string | number;
  onRun?: () => void;
  readOnly?: boolean;
  ariaLabel?: string;
};

/** Monaco wrapper, always loaded via next/dynamic from interactive surfaces only. */
export function CodeEditor({ language, value, onChange, height = "100%", onRun, readOnly, ariaLabel = "Code editor" }: Props) {
  const theme = usePrefsStore((s) => s.editorTheme);
  const fontSize = usePrefsStore((s) => s.fontSize);

  const onMount: OnMount = (editor, monaco) => {
    if (onRun) editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, onRun);
    monaco.editor.defineTheme("kodshala-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: { "editor.background": "#0E0E1A", "editor.lineHighlightBackground": "#1A1A2B", "editorLineNumber.foreground": "#4B4B66" },
    });
    monaco.editor.setTheme(theme === "vs-dark" ? "kodshala-dark" : "light");
  };

  return (
    <div className="h-full w-full" data-lenis-prevent>
      <Editor
        height={height}
        language={LANGUAGE_META[language].monaco}
        value={value}
        onChange={(v) => onChange(v ?? "")}
        theme={theme === "vs-dark" ? "kodshala-dark" : "light"}
        onMount={onMount}
        loading={
          <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading editor…
          </div>
        }
        options={{
          fontSize,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          tabSize: 4,
          automaticLayout: true,
          readOnly,
          padding: { top: 12 },
          ariaLabel,
          renderLineHighlight: "all",
        }}
      />
    </div>
  );
}
