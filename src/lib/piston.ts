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

export async function runCode(langId: string, code: string): Promise<RunResult> {
  const lang = LANGUAGES[langId];
  if (!lang) {
    return { output: `This language (${langId}) cannot be executed here.`, error: true };
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
      return { output: `Execution service returned ${res.status}. Please try again.`, error: true };
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
    return { output: "Could not reach the execution service. Check your connection.", error: true };
  }
}

export function monacoLangId(langId: string): string {
  return LANGUAGES[langId]?.monaco ?? (langId === "html" ? "html" : langId === "css" ? "css" : "plaintext");
}
