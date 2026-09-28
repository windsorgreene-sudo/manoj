import "server-only";
import { integrations } from "@/lib/env";
import { LANGUAGE_META, type LanguageKey } from "@/lib/languages";

/**
 * Reusable Judge0 CE service.
 * - Development: RapidAPI (JUDGE0_RAPIDAPI_KEY)
 * - Production: self-hosted Judge0 (JUDGE0_URL + JUDGE0_AUTH_TOKEN) — takes precedence
 * Code always runs inside Judge0's isolate sandbox (no network, CPU/wall/memory limits).
 */

export const JUDGE0_MISSING_MESSAGE =
  "Code execution is not configured yet. Add your Judge0 key: set JUDGE0_RAPIDAPI_KEY (free at rapidapi.com/judge0-official/api/judge0-ce) or JUDGE0_URL for a self-hosted Judge0, then restart the server.";

export class Judge0NotConfiguredError extends Error {
  constructor() {
    super(JUDGE0_MISSING_MESSAGE);
  }
}

export type RunStatus =
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "COMPILATION_ERROR"
  | "RUNTIME_ERROR"
  | "MEMORY_LIMIT_EXCEEDED"
  | "INTERNAL_ERROR";

export type RunResult = {
  status: RunStatus;
  statusText: string;
  stdout: string;
  stderr: string;
  compileOutput: string;
  timeMs: number | null;
  memoryKb: number | null;
};

type Judge0Response = {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string | null;
  memory: number | null;
  status: { id: number; description: string };
};

const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64");
const unb64 = (s: string | null) => (s ? Buffer.from(s, "base64").toString("utf8") : "");

function endpoint(): { url: string; headers: Record<string, string> } {
  if (process.env.JUDGE0_URL) {
    return {
      url: process.env.JUDGE0_URL.replace(/\/$/, ""),
      headers: process.env.JUDGE0_AUTH_TOKEN ? { "Content-Type": "application/json", "X-Auth-Token": process.env.JUDGE0_AUTH_TOKEN } : { "Content-Type": "application/json" },
    };
  }
  const host = process.env.JUDGE0_RAPIDAPI_HOST ?? "judge0-ce.p.rapidapi.com";
  return {
    url: `https://${host}`,
    headers: { "Content-Type": "application/json", "X-RapidAPI-Key": process.env.JUDGE0_RAPIDAPI_KEY as string, "X-RapidAPI-Host": host },
  };
}

function mapStatus(id: number): RunStatus {
  // https://ce.judge0.com/statuses
  if (id === 3) return "ACCEPTED";
  if (id === 4) return "WRONG_ANSWER";
  if (id === 5) return "TIME_LIMIT_EXCEEDED";
  if (id === 6) return "COMPILATION_ERROR";
  if (id >= 7 && id <= 12) return "RUNTIME_ERROR";
  return "INTERNAL_ERROR";
}

export function isJudge0Configured() {
  return integrations.judge0();
}

export async function runCode(opts: {
  language: LanguageKey;
  code: string;
  stdin?: string;
  expectedOutput?: string;
  timeLimitMs?: number;
  memoryLimitMb?: number;
}): Promise<RunResult> {
  if (!isJudge0Configured()) throw new Judge0NotConfiguredError();
  const { url, headers } = endpoint();
  const body = {
    language_id: LANGUAGE_META[opts.language].judge0Id,
    source_code: b64(opts.code),
    stdin: b64(opts.stdin ?? ""),
    ...(opts.expectedOutput !== undefined ? { expected_output: b64(opts.expectedOutput) } : {}),
    cpu_time_limit: Math.min(15, (opts.timeLimitMs ?? 2000) / 1000),
    wall_time_limit: Math.min(20, ((opts.timeLimitMs ?? 2000) / 1000) * 3),
    memory_limit: Math.min(512_000, (opts.memoryLimitMb ?? 256) * 1024),
    enable_network: false,
  };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);
  try {
    const res = await fetch(`${url}/submissions?base64_encoded=true&wait=true&fields=stdout,stderr,compile_output,message,time,memory,status`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });
    if (res.status === 429) return internal("The code runner is busy (Judge0 rate limit). Please try again in a moment.");
    if (!res.ok) return internal(`Judge0 returned HTTP ${res.status}. Check your Judge0 key/URL.`);
    const data = (await res.json()) as Judge0Response;
    const status = mapStatus(data.status.id);
    const memoryKb = data.memory ?? null;
    return {
      status: status === "RUNTIME_ERROR" && memoryKb && memoryKb >= body.memory_limit ? "MEMORY_LIMIT_EXCEEDED" : status,
      statusText: data.status.description,
      stdout: unb64(data.stdout),
      stderr: unb64(data.stderr) || unb64(data.message),
      compileOutput: unb64(data.compile_output),
      timeMs: data.time ? Math.round(Number(data.time) * 1000) : null,
      memoryKb,
    };
  } catch (e) {
    return internal(e instanceof Error && e.name === "AbortError" ? "Execution timed out waiting for Judge0." : "Could not reach Judge0.");
  } finally {
    clearTimeout(timer);
  }
}

function internal(message: string): RunResult {
  return { status: "INTERNAL_ERROR", statusText: message, stdout: "", stderr: message, compileOutput: "", timeMs: null, memoryKb: null };
}

export const normalizeOutput = (s: string) =>
  s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .trim();

export type TestCaseInput = { id: string; input: string; expected: string; isSample: boolean };
export type TestResult = { id: string; passed: boolean; status: RunStatus; input?: string; expected?: string; output?: string; stderr?: string; timeMs: number | null; memoryKb: number | null };
export type JudgeResult = { verdict: RunStatus; passed: number; total: number; runtimeMs: number | null; memoryKb: number | null; compileOutput: string; results: TestResult[] };

/** Runs code against test cases with limited concurrency; verdict = first failing test in order. */
export async function judge(opts: {
  language: LanguageKey;
  code: string;
  tests: TestCaseInput[];
  timeLimitMs: number;
  memoryLimitMb: number;
  revealHidden?: boolean;
  concurrency?: number;
}): Promise<JudgeResult> {
  const results: TestResult[] = new Array(opts.tests.length);
  let compileOutput = "";
  let idx = 0;
  let stop = false;
  const worker = async () => {
    while (!stop && idx < opts.tests.length) {
      const i = idx++;
      const t = opts.tests[i];
      const r = await runCode({ language: opts.language, code: opts.code, stdin: t.input, timeLimitMs: opts.timeLimitMs, memoryLimitMb: opts.memoryLimitMb });
      if (r.status === "COMPILATION_ERROR") {
        compileOutput = r.compileOutput;
        stop = true;
      }
      if (r.status === "INTERNAL_ERROR") stop = true;
      const status: RunStatus = r.status === "ACCEPTED" ? (normalizeOutput(r.stdout) === normalizeOutput(t.expected) ? "ACCEPTED" : "WRONG_ANSWER") : r.status;
      const show = t.isSample || opts.revealHidden;
      results[i] = {
        id: t.id,
        passed: status === "ACCEPTED",
        status,
        input: show ? t.input : undefined,
        expected: show ? t.expected : undefined,
        output: show ? r.stdout : undefined,
        stderr: r.stderr ? r.stderr.slice(0, 2000) : undefined,
        timeMs: r.timeMs,
        memoryKb: r.memoryKb,
      };
    }
  };
  await Promise.all(Array.from({ length: Math.min(opts.concurrency ?? 3, opts.tests.length) }, worker));
  const done = results.filter(Boolean);
  const firstFail = done.find((r) => !r.passed);
  return {
    verdict: compileOutput ? "COMPILATION_ERROR" : (firstFail?.status ?? (done.length === opts.tests.length ? "ACCEPTED" : "INTERNAL_ERROR")),
    passed: done.filter((r) => r.passed).length,
    total: opts.tests.length,
    runtimeMs: done.reduce<number | null>((m, r) => (r.timeMs === null ? m : Math.max(m ?? 0, r.timeMs)), null),
    memoryKb: done.reduce<number | null>((m, r) => (r.memoryKb === null ? m : Math.max(m ?? 0, r.memoryKb)), null),
    compileOutput,
    results: done,
  };
}
