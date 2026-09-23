// Runs code via the public Piston API (https://github.com/engineer-man/piston).
// No API key required. Maps our language ids to Piston runtimes.

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

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

// Languages that Piston cannot "run" meaningfully (markup/styles).
export const NON_RUNNABLE = new Set(["html", "css", "sql"]);

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

export async function runCode(langId: string, code: string): Promise<RunResult> {
  // JavaScript runs directly in the browser, no network needed.
  if (langId === "javascript") return runJavaScriptInBrowser(code);

  const lang = LANGUAGES[langId];
  if (!lang) {
    return {
      output: `Live execution for ${langId} is not available in this demo. JavaScript runs directly in the browser; other languages need a hosted runner (see notes).`,
      error: true,
    };
  }
  const started = performance.now();
  try {
    const res = await fetch(PISTON_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: lang.language,
        version: lang.version,
        files: [{ name: `main.${lang.ext}`, content: code }],
      }),
    });
    if (!res.ok) {
      return {
        output:
          "Remote code execution is not available right now. JavaScript still runs instantly in the browser; connect a hosted runner to enable other languages.",
        error: true,
      };
    }
    const data = await res.json();
    const run = data.run ?? {};
    const out = [run.stdout, run.stderr].filter(Boolean).join("\n").trim();
    return {
      output: out || "(no output)",
      error: (run.code ?? 0) !== 0,
      timeMs: Math.round(performance.now() - started),
    };
  } catch {
    return {
      output:
        "Could not reach the execution service. JavaScript runs in the browser; other languages need a hosted runner.",
      error: true,
    };
  }
}

export function monacoLangId(langId: string): string {
  return LANGUAGES[langId]?.monaco ?? (langId === "html" ? "html" : langId === "css" ? "css" : "plaintext");
}
