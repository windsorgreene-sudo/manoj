"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/playground/CodeEditor";
import { runCode, NON_RUNNABLE } from "@/lib/piston";

// Python's runtime (Pyodide) downloads on first use, so warn the user.
let pythonLoadedOnce = false;
function runningMessage(language: string): string {
  if (language === "python" && !pythonLoadedOnce) {
    return "Loading Python runtime (first run downloads ~10 MB, then it's cached)...";
  }
  return "Running...";
}

// The "Try it yourself" panel embedded at the bottom of a lesson.
export function LessonPlayground({ code, language }: { code: string; language: string }) {
  const [value, setValue] = useState(code);
  const [output, setOutput] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [isError, setIsError] = useState(false);

  const runnable = !NON_RUNNABLE.has(language);

  const run = async () => {
    if (!runnable) {
      setOutput("Preview this markup in the full playground.");
      return;
    }
    setRunning(true);
    setOutput(runningMessage(language));
    setIsError(false);
    const res = await runCode(language, value);
    if (language === "python") pythonLoadedOnce = true;
    setOutput(res.output + (res.timeMs ? `\n\nFinished in ${res.timeMs} ms` : ""));
    setIsError(res.error);
    setRunning(false);
  };

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-2.5">
        <span className="font-display text-sm font-bold text-text">▶ Try it yourself</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setValue(code)}
            className="rounded-lg border border-border-strong px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
          >
            Reset
          </button>
          <button
            onClick={run}
            disabled={running}
            className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-contrast transition-all hover:bg-primary-hover disabled:opacity-60"
          >
            {running ? "Running..." : "Run ▸"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="h-64 border-b border-border md:border-b-0 md:border-r">
          <CodeEditor value={value} onChange={setValue} language={language} onRunShortcut={run} />
        </div>
        <div className="flex h-64 flex-col bg-[#0d1117]">
          <div className="border-b border-white/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-[#8b98a8]">
            Output
          </div>
          <pre
            className={`flex-1 overflow-auto px-4 py-3 font-mono text-[13px] leading-6 ${
              isError ? "text-rose-400" : "text-[#e6edf3]"
            }`}
          >
            {output || "Press Run to see the output."}
          </pre>
        </div>
      </div>
    </div>
  );
}
