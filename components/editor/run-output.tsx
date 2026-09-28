"use client";

import { KeyRound, Loader2, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export type RunOutputState =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "error"; message: string; missingKey?: boolean }
  | { kind: "result"; status: string; statusText: string; stdout: string; stderr: string; compileOutput: string; timeMs: number | null; memoryKb: number | null };

const OK = new Set(["ACCEPTED"]);

export function RunOutput({ state, className }: { state: RunOutputState; className?: string }) {
  return (
    <div className={cn("h-full overflow-auto p-4 font-mono text-sm", className)} aria-live="polite" data-lenis-prevent>
      {state.kind === "idle" ? (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Terminal className="size-4" /> Run your code to see the output here. (Ctrl/⌘ + Enter)
        </p>
      ) : state.kind === "running" ? (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Running in the sandbox…
        </p>
      ) : state.kind === "error" ? (
        state.missingKey ? (
          <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 font-sans">
            <p className="mb-1 flex items-center gap-2 font-semibold text-warning">
              <KeyRound className="size-4" /> Add your Judge0 key
            </p>
            <p className="text-sm text-muted-foreground">{state.message}</p>
          </div>
        ) : (
          <p className="text-danger">{state.message}</p>
        )
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 font-sans text-xs">
            <span className={cn("rounded-md px-2 py-0.5 font-semibold", OK.has(state.status) ? "bg-success/15 text-success" : "bg-danger/15 text-danger")}>
              {state.status === "ACCEPTED" ? "Finished" : state.statusText}
            </span>
            {state.timeMs !== null ? <span className="text-muted-foreground">{state.timeMs} ms</span> : null}
            {state.memoryKb !== null ? <span className="text-muted-foreground">{(state.memoryKb / 1024).toFixed(1)} MB</span> : null}
          </div>
          {state.compileOutput ? <pre className="whitespace-pre-wrap text-danger">{state.compileOutput}</pre> : null}
          {state.stdout ? <pre className="whitespace-pre-wrap">{state.stdout}</pre> : null}
          {state.stderr ? <pre className="whitespace-pre-wrap text-warning">{state.stderr}</pre> : null}
          {!state.stdout && !state.stderr && !state.compileOutput ? <p className="text-muted-foreground">(no output)</p> : null}
        </div>
      )}
    </div>
  );
}

type ApiRunResponse = { result?: Omit<Extract<RunOutputState, { kind: "result" }>, "kind">; error?: string; code?: string };

/** Calls /api/run and maps the response to a RunOutputState. */
export async function runViaApi(body: { language: string; code: string; stdin?: string }): Promise<RunOutputState> {
  try {
    const res = await fetch("/api/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = (await res.json()) as ApiRunResponse;
    if (!res.ok || !json.result) return { kind: "error", message: json.error ?? "Something went wrong", missingKey: json.code === "JUDGE0_MISSING" };
    return { kind: "result", ...json.result };
  } catch {
    return { kind: "error", message: "Network error — check your connection." };
  }
}
