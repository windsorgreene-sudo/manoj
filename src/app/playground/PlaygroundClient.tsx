"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/playground/CodeEditor";
import { runCode, LANGUAGES } from "@/lib/piston";

const TEMPLATES: Record<string, string> = {
  javascript: "// JavaScript\nfunction fib(n) {\n  return n < 2 ? n : fib(n - 1) + fib(n - 2);\n}\nfor (let i = 0; i < 10; i++) console.log(fib(i));",
  typescript: "// TypeScript\nconst greet = (name: string): string => `Hello, ${name}!`;\nconsole.log(greet('EduLearn'));",
  python: "# Python\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        print(a)\n        a, b = b, a + b\n\nfib(10)",
  java: "// Java\npublic class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++) System.out.println(\"Line \" + i);\n    }\n}",
  cpp: "// C++\n#include <iostream>\nusing namespace std;\nint main() {\n    for (int i = 1; i <= 5; i++) cout << \"Line \" << i << endl;\n    return 0;\n}",
  c: "// C\n#include <stdio.h>\nint main() {\n    for (int i = 1; i <= 5; i++) printf(\"Line %d\\n\", i);\n    return 0;\n}",
  bash: "# Bash\nfor i in 1 2 3; do\n  echo \"Line $i\"\ndone",
};

const LANG_LIST = Object.keys(LANGUAGES);

export function PlaygroundClient() {
  const [lang, setLang] = useState("javascript");
  const [code, setCode] = useState(TEMPLATES.javascript);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [isError, setIsError] = useState(false);

  const switchLang = (l: string) => {
    setLang(l);
    setCode(TEMPLATES[l] ?? "");
    setOutput("");
  };

  const run = async () => {
    setRunning(true);
    setOutput("Running...");
    setIsError(false);
    const res = await runCode(lang, code);
    setOutput(res.output + (res.timeMs ? `\n\n— finished in ${res.timeMs} ms` : ""));
    setIsError(res.error);
    setRunning(false);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-md)]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface-2 px-4 py-2.5">
        <select
          value={lang}
          onChange={(e) => switchLang(e.target.value)}
          className="rounded-lg border border-border-strong bg-surface px-3 py-1.5 text-sm font-medium text-text focus:border-primary focus:outline-none"
          aria-label="Language"
        >
          {LANG_LIST.map((l) => (
            <option key={l} value={l} className="capitalize">
              {l}
            </option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setCode(TEMPLATES[lang] ?? "")}
            className="rounded-lg border border-border-strong px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
          >
            Reset
          </button>
          <button
            onClick={run}
            disabled={running}
            className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-contrast transition-all hover:bg-primary-hover disabled:opacity-60"
          >
            {running ? "Running..." : "Run ▸ (Ctrl+Enter)"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="h-[420px] border-b border-border lg:border-b-0 lg:border-r">
          <CodeEditor value={code} onChange={setCode} language={lang} onRunShortcut={run} />
        </div>
        <div className="flex h-[420px] flex-col bg-[#0d1117]">
          <div className="border-b border-white/5 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-[#8b98a8]">
            Console output
          </div>
          <pre
            className={`flex-1 overflow-auto px-4 py-3 font-mono text-[13px] leading-6 ${
              isError ? "text-rose-400" : "text-[#e6edf3]"
            }`}
          >
            {output || "Write some code and press Run."}
          </pre>
        </div>
      </div>
    </div>
  );
}
