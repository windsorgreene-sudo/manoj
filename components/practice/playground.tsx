"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Check, Link2, Loader2, Play, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RunOutput, runViaApi, type RunOutputState } from "@/components/editor/run-output";
import { saveSnippet } from "@/lib/actions/practice";
import { HELLO_WORLD, LANGUAGE_META, LANGUAGES, type LanguageKey } from "@/lib/languages";

const CodeEditor = dynamic(() => import("@/components/editor/code-editor").then((m) => m.CodeEditor), { ssr: false, loading: () => <div className="shimmer h-full w-full" /> });

type Initial = { title: string; language: LanguageKey; code: string; stdin: string; author: string | null };

export function Playground({ initial }: { initial?: Initial }) {
  const [language, setLanguage] = useState<LanguageKey>(initial?.language ?? "PYTHON");
  const [code, setCode] = useState(initial?.code ?? HELLO_WORLD.PYTHON);
  const [stdin, setStdin] = useState(initial?.stdin ?? "CodeVerse");
  const [title, setTitle] = useState(initial?.title ?? "Untitled snippet");
  const [out, setOut] = useState<RunOutputState>({ kind: "idle" });
  const [saving, setSaving] = useState(false);
  const [link, setLink] = useState<string | null>(null);

  const run = async () => {
    setOut({ kind: "running" });
    setOut(await runViaApi({ language, code, stdin }));
  };
  const save = async () => {
    setSaving(true);
    const r = await saveSnippet({ title, language, code, stdin });
    setSaving(false);
    if (!r.ok) return toast.error(r.error);
    const url = `${window.location.origin}/playground/${r.shareId}`;
    setLink(url);
    await navigator.clipboard.writeText(url).catch(() => undefined);
    toast.success("Snippet saved, share link copied!");
    window.history.replaceState(null, "", `/playground/${r.shareId}`);
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
        <h1 className="sr-only">Online compiler playground</h1>
        <label htmlFor="snippet-title" className="sr-only">Snippet title</label>
        <Input id="snippet-title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-9 w-48 rounded-xl" maxLength={80} />
        <Select value={language} onValueChange={(v) => { const l = v as LanguageKey; setLanguage(l); setCode(HELLO_WORLD[l]); }}>
          <SelectTrigger className="h-9 w-36 rounded-xl" aria-label="Language"><SelectValue /></SelectTrigger>
          <SelectContent>{LANGUAGES.map((l) => <SelectItem key={l} value={l}>{LANGUAGE_META[l].label}</SelectItem>)}</SelectContent>
        </Select>
        <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setCode(HELLO_WORLD[language])}><RotateCcw /> Reset</Button>
        {initial?.author ? <span className="text-xs text-muted-foreground">by {initial.author}</span> : null}
        <div className="ml-auto flex items-center gap-2">
          {link ? (
            <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => { void navigator.clipboard.writeText(link); toast.success("Link copied"); }}>
              <Check className="text-success" /> <Link2 /> Copy link
            </Button>
          ) : null}
          <Button variant="outline" size="sm" className="rounded-xl" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : <Save />} Save & share
          </Button>
          <Button size="sm" className="rounded-xl bg-success text-black hover:bg-success/90" onClick={run} disabled={out.kind === "running"}>
            {out.kind === "running" ? <Loader2 className="animate-spin" /> : <Play />} Run
          </Button>
        </div>
      </div>
      <div className="grid min-h-0 flex-1 lg:grid-cols-[1.5fr_1fr]">
        <div className="min-h-[50vh] border-b border-border lg:border-r lg:border-b-0">
          <CodeEditor language={language} value={code} onChange={setCode} onRun={run} />
        </div>
        <div className="flex min-h-0 flex-col">
          <div className="border-b border-border p-3">
            <label htmlFor="pg-stdin" className="mb-1 block text-xs font-medium text-muted-foreground">Input (stdin)</label>
            <Textarea id="pg-stdin" rows={5} value={stdin} onChange={(e) => setStdin(e.target.value)} className="rounded-xl font-mono text-sm" />
          </div>
          <p className="px-3 pt-2 text-xs font-medium text-muted-foreground">Output</p>
          <div className="min-h-0 flex-1"><RunOutput state={out} /></div>
        </div>
      </div>
    </div>
  );
}
