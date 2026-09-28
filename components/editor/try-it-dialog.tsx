"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, Play, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RunOutput, runViaApi, type RunOutputState } from "@/components/editor/run-output";
import { LANGUAGE_META, LANGUAGES, HELLO_WORLD, type LanguageKey } from "@/lib/languages";

const CodeEditor = dynamic(() => import("@/components/editor/code-editor").then((m) => m.CodeEditor), {
  ssr: false,
  loading: () => <div className="shimmer h-full w-full" />,
});

export function TryItDialog({
  open,
  onOpenChange,
  initialCode,
  initialLanguage,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initialCode: string;
  initialLanguage: LanguageKey;
}) {
  const [language, setLanguage] = useState<LanguageKey>(initialLanguage);
  const [code, setCode] = useState(initialCode);
  const [stdin, setStdin] = useState("");
  const [out, setOut] = useState<RunOutputState>({ kind: "idle" });

  const run = async () => {
    setOut({ kind: "running" });
    setOut(await runViaApi({ language, code, stdin }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90dvh] max-w-[min(1100px,96vw)] flex-col gap-3 rounded-2xl p-4 sm:max-w-[min(1100px,96vw)]">
        <DialogHeader>
          <DialogTitle>Try it Yourself</DialogTitle>
          <DialogDescription>Edit the code and run it in a secure sandbox.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={language}
            onValueChange={(v) => {
              const l = v as LanguageKey;
              setLanguage(l);
              if (l !== initialLanguage) setCode(HELLO_WORLD[l]);
              else setCode(initialCode);
            }}
          >
            <SelectTrigger className="w-40 rounded-xl" aria-label="Language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l} value={l}>
                  {LANGUAGE_META[l].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setCode(initialCode)}>
            <RotateCcw /> Reset
          </Button>
          <Button onClick={run} disabled={out.kind === "running"} className="ml-auto rounded-xl bg-success text-black hover:bg-success/90">
            {out.kind === "running" ? <Loader2 className="animate-spin" /> : <Play />} Run
          </Button>
        </div>
        <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-[1.6fr_1fr]">
          <div className="min-h-[280px] overflow-hidden rounded-xl border border-border">
            <CodeEditor language={language} value={code} onChange={setCode} onRun={run} />
          </div>
          <div className="flex min-h-0 flex-col gap-3">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="tryit-stdin">
              Input (stdin)
            </label>
            <Textarea id="tryit-stdin" value={stdin} onChange={(e) => setStdin(e.target.value)} className="h-24 resize-none rounded-xl font-mono text-sm" placeholder="Optional input…" />
            <div className="min-h-0 flex-1 rounded-xl border border-border bg-surface">
              <RunOutput state={out} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
