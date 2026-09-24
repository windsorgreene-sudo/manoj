// Code execution for the learning playground.
//
// History: this used the public Piston API (emkc.org). That endpoint became
// whitelist-only on 2026-02-15 and now returns 401, so it no longer works and
// there is no key-less public replacement. We therefore run everything we can
// entirely in the browser (no server, no API key):
//   - JavaScript: executed directly by capturing console output.
//   - Python:     executed via Pyodide (WebAssembly), loaded on demand.
// Languages that need a native toolchain (C, C++, Java) cannot run in the
// browser, so we show an honest message instead of failing silently.

import { runPython } from "./pyodide";

interface PistonLang {
  language: string;
  version: string;
  monaco: string; // monaco language id
  ext: string;
}

export const LANGUAGES: Record<string, PistonLang> = {
  javascript: { language: "javascript", version: "18.15.0", monaco: "javascript", ext: "js" },
  typescript: { language: "typescript", version: "5.0.3", monaco: "typescript", ext: "ts" },
  python: { language: "python", version: "3.10.0", monaco: "python", ext: "py" },
  java: { language: "java", version: "15.0.2", monaco: "java", ext: "java" },
  cpp: { language: "c++", version: "10.2.0", monaco: "cpp", ext: "cpp" },
  c: { language: "c", version: "10.2.0", monaco: "c", ext: "c" },
  bash: { language: "bash", version: "5.2.0", monaco: "shell", ext: "sh" },
};

// Markup / query languages that are not "run" in this playground.
export const NON_RUNNABLE = new Set(["html", "css", "sql"]);

// Languages we can execute fully in the browser (no server/API key).
export const BROWSER_RUNNABLE = new Set(["javascript", "python"]);

// Languages that need a native toolchain and cannot run client-side.
export const NEEDS_NATIVE = new Set(["c", "cpp", "java"]);

/** True if the language can be executed right here in the browser. */
export function canRunInBrowser(langId: string): boolean {
  return BROWSER_RUNNABLE.has(langId);
}

export interface RunResult {
  output: string;
  error: boolean;
  timeMs?: number;
}

// Runs JavaScript directly in the browser by capturing console output. This
// needs no external service, so it always works. Kept sandboxed to a function
// scope; this is a learning playground, not a secure sandbox.
function runJavaScriptInBrowser(code: string): RunResult {
  const logs: string[] = [];
  const started = performance.now();
  const original = { log: console.log, error: console.error, warn: console.warn };
  const capture =
    (prefix = "") =>
    (...args: unknown[]) =>
      logs.push(prefix + args.map((a) => formatValue(a)).join(" "));
  try {
    console.log = capture();
    console.error = capture("Error: ");
    console.warn = capture("Warning: ");
    const fn = new Function(code);
    fn();
    return {
      output: logs.join("\n") || "(no output)",
      error: false,
      timeMs: Math.round(performance.now() - started),
    };
  } catch (e) {
    return {
      output: [...logs, String(e)].join("\n"),
      error: true,
      timeMs: Math.round(performance.now() - started),
    };
  } finally {
    console.log = original.log;
    console.error = original.error;
    console.warn = original.warn;
  }
}

function formatValue(v: unknown): string {
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

const NATIVE_LABEL: Record<string, string> = {
  c: "C",
  cpp: "C++",
  java: "Java",
};

export async function runCode(langId: string, code: string): Promise<RunResult> {
  // JavaScript runs directly in the browser, no network needed.
  if (langId === "javascript") return runJavaScriptInBrowser(code);

  // Python runs in the browser via Pyodide (WebAssembly).
  if (langId === "python") {
    const started = performance.now();
    try {
      const res = await runPython(code);
      return { ...res, timeMs: Math.round(performance.now() - started) };
    } catch (e) {
      return {
        output:
          "Could not load the Python runtime. Check your connection and try again.\n\n" +
          String(e),
        error: true,
      };
    }
  }

  // C / C++ / Java need a native compiler and cannot run in the browser.
  if (NEEDS_NATIVE.has(langId)) {
    const name = NATIVE_LABEL[langId] ?? langId;
    return {
      output:
        `${name} programs need a native compiler and can't run in the browser.\n\n` +
        "Read and edit the code here, then compile it locally (for example with " +
        (langId === "java" ? "javac + java" : "gcc/g++") +
        ") to see the output.",
      error: false,
    };
  }

  return {
    output: `Live execution for ${langId} is not available here. JavaScript and Python run directly in the browser.`,
    error: true,
  };
}

export function monacoLangId(langId: string): string {
  return LANGUAGES[langId]?.monaco ?? (langId === "html" ? "html" : langId === "css" ? "css" : "plaintext");
}
