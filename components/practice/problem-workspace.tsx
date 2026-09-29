"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Group, Panel, Separator } from "react-resizable-panels";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Cloud,
  KeyRound,
  Lightbulb,
  Loader2,
  Lock,
  Minus,
  Moon,
  Play,
  Plus,
  RotateCcw,
  Send,
  Sun,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DifficultyBadge } from "@/components/learn/difficulty-badge";
import { TutorLauncher } from "@/components/learn/tutor-launcher";
import { Comments } from "@/components/learn/comments";
import { CodeDiff } from "@/components/practice/code-diff";
import { VerdictText, VERDICT_LABEL } from "@/components/practice/verdict";
import { useCelebrate } from "@/components/motion/celebration-layer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { getEditorial } from "@/lib/actions/practice";
import { toggleBookmark } from "@/lib/actions/learn";
import { LANGUAGE_META, LANGUAGES, type LanguageKey } from "@/lib/languages";
import { usePrefsStore } from "@/lib/stores/prefs-store";
import { useTutorCodeStore } from "@/lib/stores/tutor-code-store";
import { cn, timeAgo } from "@/lib/utils";

const CodeEditor = dynamic(() => import("@/components/editor/code-editor").then((m) => m.CodeEditor), {
  ssr: false,
  loading: () => <div className="shimmer h-full w-full" />,
});

export type WorkspaceProblem = {
  id: string;
  number: number;
  slug: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topics: string[];
  companies: string[];
  hints: string[];
  starterCode: Record<string, string>;
  samples: { id: string; input: string; expected: string }[];
  totalTests: number;
  timeLimitMs: number;
  memoryLimitMb: number;
  plainStatement: string;
};

type TestResult = { id: string; passed: boolean; status: string; input?: string; expected?: string; output?: string; stderr?: string; timeMs: number | null; memoryKb: number | null };
type JudgeOut = {
  verdict: string;
  passed: number;
  total: number;
  runtimeMs: number | null;
  memoryKb: number | null;
  compileOutput: string;
  results: TestResult[];
  firstSolve?: boolean;
  xp?: { amount: number; awarded: boolean; leveledUp: boolean; level: number; streak: number; newBadges: { slug: string; name: string; icon: string; color: string }[] } | null;
};
type ConsoleState = { kind: "idle" } | { kind: "running"; mode: "run" | "submit" } | { kind: "error"; message: string; missingKey?: boolean } | { kind: "result"; mode: "run" | "submit"; data: JudgeOut };

type Sub = { id: string; verdict: string; language: LanguageKey; runtimeMs: number | null; memoryKb: number | null; passed: number; total: number; createdAt: string; code: string };
type SubsResponse = { signedIn: boolean; submissions: Sub[]; solved: boolean; bookmarked?: boolean };

const storageKey = (slug: string, lang: string) => `cv-code:${slug}:${lang}`;

export function ProblemWorkspace({ problem, description }: { problem: WorkspaceProblem; description: ReactNode }) {
  const params = useSearchParams();
  const contestId = params.get("contest") ?? undefined;
  const contestSlug = params.get("from")?.replace(/[^a-z0-9-]/g, "") || null;
  const qc = useQueryClient();
  const celebrate = useCelebrate();
  const isDesktop = useMediaQuery("(min-width: 1024px)", true);
  const { editorTheme, setEditorTheme, fontSize, setFontSize, codeLang, setCodeLang } = usePrefsStore();
  const setTutorCode = useTutorCodeStore((s) => s.setCode);

  const initialLang = (LANGUAGES.find((l) => LANGUAGE_META[l].shiki === codeLang) ?? "PYTHON") as LanguageKey;
  const [language, setLanguage] = useState<LanguageKey>(initialLang);
  const [code, setCode] = useState<string>(problem.starterCode[initialLang] ?? "");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [customOn, setCustomOn] = useState(false);
  const [customInput, setCustomInput] = useState(problem.samples[0]?.input ?? "");
  const [out, setOut] = useState<ConsoleState>({ kind: "idle" });
  const [consoleTab, setConsoleTab] = useState("testcase");
  const [leftTab, setLeftTab] = useState("description");
  const [hintsShown, setHintsShown] = useState(0);
  const loaded = useRef(false);

  // Restore auto-saved code + unlocked hints (client-only storage).
  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey(problem.slug, language));
    const h = Number(window.localStorage.getItem(`cv-hints:${problem.slug}`) ?? 0);
    loaded.current = true;
    const id = window.requestAnimationFrame(() => {
      if (saved) setCode(saved);
      if (h) setHintsShown(h);
    });
    return () => window.cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restore once per problem
  }, [problem.slug]);

  // Debounced auto-save.
  useEffect(() => {
    if (!loaded.current) return;
    setTutorCode(code);
    const t = window.setTimeout(() => {
      window.localStorage.setItem(storageKey(problem.slug, language), code);
      setSavedAt(Date.now());
    }, 600);
    return () => window.clearTimeout(t);
  }, [code, language, problem.slug, setTutorCode]);

  const subs = useQuery({
    queryKey: ["subs", problem.slug],
    queryFn: async (): Promise<SubsResponse> => (await fetch(`/api/problems/${problem.slug}/submissions`)).json() as Promise<SubsResponse>,
  });

  const switchLang = (l: LanguageKey) => {
    window.localStorage.setItem(storageKey(problem.slug, language), code);
    setLanguage(l);
    setCodeLang(LANGUAGE_META[l].shiki);
    setCode(window.localStorage.getItem(storageKey(problem.slug, l)) ?? problem.starterCode[l] ?? "");
  };

  const exec = useCallback(
    async (mode: "run" | "submit") => {
      setOut({ kind: "running", mode });
      setConsoleTab("result");
      try {
        const res = await fetch(`/api/problems/${problem.slug}/${mode}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language, code, customInput: mode === "run" && customOn ? customInput : undefined, contestId }),
        });
        const json = (await res.json()) as { result?: JudgeOut; error?: string; code?: string };
        if (!res.ok || !json.result) {
          setOut({ kind: "error", message: json.error ?? "Something went wrong", missingKey: json.code === "JUDGE0_MISSING" });
          return;
        }
        setOut({ kind: "result", mode, data: json.result });
        if (mode === "submit") {
          void qc.invalidateQueries({ queryKey: ["subs", problem.slug] });
          if (json.result.verdict === "ACCEPTED") {
            const x = json.result.xp;
            celebrate({ accepted: true, xp: x?.awarded ? x.amount : undefined, streak: x?.streak, leveledUp: x?.leveledUp, level: x?.level, badges: x?.newBadges });
            if (!x?.awarded) toast.success("Accepted!");
          }
        }
      } catch {
        setOut({ kind: "error", message: "Network error, check your connection." });
      }
    },
    [code, contestId, customInput, customOn, language, problem.slug, qc, celebrate],
  );

  // Ctrl+' to run, Ctrl+Enter handled by the editor.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "'") {
        e.preventDefault();
        void exec("run");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exec]);

  const bookmark = async () => {
    const r = await toggleBookmark({ problemId: problem.id });
    if (r.ok) {
      toast.success(r.data.bookmarked ? "Bookmarked" : "Bookmark removed");
      void qc.invalidateQueries({ queryKey: ["subs", problem.slug] });
    } else toast.error(r.unauth ? "Log in to bookmark" : r.error);
  };

  const running = out.kind === "running";
  const solved = subs.data?.solved;

  const left = (
    <Tabs value={leftTab} onValueChange={setLeftTab} className="flex h-full flex-col gap-0">
      <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-border bg-transparent p-1">
        {["description", "hints", "editorial", "submissions", "discussion"].map((t) => (
          <TabsTrigger key={t} value={t} className="flex-none rounded-lg px-3 capitalize">
            {t}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="min-h-0 flex-1 overflow-y-auto" data-lenis-prevent>
        <TabsContent value="description" className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-2xl font-bold">
              {problem.number}. {problem.title}
            </h1>
            {solved ? (
              <span className="flex items-center gap-1 text-xs font-medium text-success">
                <CheckCircle2 className="size-4" /> Solved
              </span>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <DifficultyBadge difficulty={problem.difficulty} />
            {problem.topics.map((t) => (
              <Link key={t} href={`/problems?topic=${encodeURIComponent(t)}`} className="rounded-md bg-surface-2 px-2 py-1 text-muted-foreground hover:text-foreground">
                {t}
              </Link>
            ))}
          </div>
          <div className="mt-5">{description}</div>
          <details className="mt-6 rounded-xl border border-border p-3 text-sm">
            <summary className="cursor-pointer font-medium">Companies</summary>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {problem.companies.map((c) => (
                <Link key={c} href={`/problems?company=${encodeURIComponent(c)}`} className="rounded-md bg-surface-2 px-2 py-1 text-xs">
                  {c}
                </Link>
              ))}
            </div>
          </details>
          <p className="mt-4 text-xs text-muted-foreground">
            Time limit {problem.timeLimitMs / 1000}s · Memory {problem.memoryLimitMb} MB · {problem.totalTests} test cases
          </p>
        </TabsContent>

        <TabsContent value="hints" className="space-y-3 p-5">
          <p className="text-sm text-muted-foreground">Unlock hints one at a time, try to solve it after each one.</p>
          {problem.hints.map((h, i) => (
            <div key={i} className={cn("rounded-xl border p-4 text-sm", i < hintsShown ? "border-warning/40 bg-warning/5" : "border-border")}>
              <p className="mb-1 flex items-center gap-2 font-semibold">
                <Lightbulb className="size-4 text-warning" /> Hint {i + 1}
              </p>
              {i < hintsShown ? (
                <p>{h}</p>
              ) : i === hintsShown ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-lg"
                  onClick={() => {
                    setHintsShown(i + 1);
                    window.localStorage.setItem(`cv-hints:${problem.slug}`, String(i + 1));
                  }}
                >
                  Reveal hint {i + 1}
                </Button>
              ) : (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="size-3.5" /> Unlock hint {i} first
                </p>
              )}
            </div>
          ))}
          <TutorLauncher title={problem.title} kind="problem" content={problem.plainStatement} className="rounded-xl" />
        </TabsContent>

        <TabsContent value="editorial" className="p-5">
          <Editorial problemId={problem.id} solved={Boolean(solved)} />
        </TabsContent>

        <TabsContent value="submissions" className="p-5">
          <SubmissionsList data={subs.data} loading={subs.isLoading} error={subs.isError} retry={() => void subs.refetch()} />
        </TabsContent>

        <TabsContent value="discussion" className="px-5 pb-5">
          <Comments target={{ problemId: problem.id }} />
        </TabsContent>
      </div>
    </Tabs>
  );

  const editor = (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-1 border-b border-border px-2 py-1.5">
        <Select value={language} onValueChange={(v) => switchLang(v as LanguageKey)}>
          <SelectTrigger size="sm" className="h-8 w-32 rounded-lg" aria-label="Language">
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
        <Button variant="ghost" size="icon-sm" aria-label="Toggle editor theme" onClick={() => setEditorTheme(editorTheme === "vs-dark" ? "light" : "vs-dark")}>
          {editorTheme === "vs-dark" ? <Sun /> : <Moon />}
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Decrease font size" onClick={() => setFontSize(fontSize - 1)}>
          <Minus />
        </Button>
        <span className="w-6 text-center text-xs tabular-nums text-muted-foreground" aria-label={`Font size ${fontSize}`}>
          {fontSize}
        </span>
        <Button variant="ghost" size="icon-sm" aria-label="Increase font size" onClick={() => setFontSize(fontSize + 1)}>
          <Plus />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-lg"
          onClick={() => {
            if (window.confirm("Reset to the starter code? Your current code for this language will be lost.")) setCode(problem.starterCode[language] ?? "");
          }}
        >
          <RotateCcw /> Reset
        </Button>
        <span className="ml-auto flex items-center gap-1 pr-2 text-xs text-muted-foreground" aria-live="polite">
          <Cloud className="size-3.5" /> {savedAt ? "Saved locally" : "Auto-save on"}
        </span>
      </div>
      <div className="min-h-0 flex-1">
        <CodeEditor language={language} value={code} onChange={setCode} onRun={() => void exec("run")} ariaLabel={`${LANGUAGE_META[language].label} code editor`} />
      </div>
    </div>
  );

  const consolePane = (
    <Tabs value={consoleTab} onValueChange={setConsoleTab} className="flex h-full flex-col gap-0">
      <div className="flex items-center gap-2 border-b border-border px-2 py-1">
        <TabsList className="h-8 bg-transparent p-0">
          <TabsTrigger value="testcase" className="rounded-lg px-3 text-xs">
            Testcase
          </TabsTrigger>
          <TabsTrigger value="result" className="rounded-lg px-3 text-xs">
            Result
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="secondary" className="h-8 rounded-lg" disabled={running} onClick={() => void exec("run")}>
            {running && out.mode === "run" ? <Loader2 className="animate-spin" /> : <Play />} Run
          </Button>
          <Button size="sm" className="h-8 rounded-lg bg-success text-black hover:bg-success/90" disabled={running} onClick={() => void exec("submit")}>
            {running && out.mode === "submit" ? <Loader2 className="animate-spin" /> : <Send />} Submit
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3" data-lenis-prevent>
        <TabsContent value="testcase" className="space-y-3">
          <div className="flex items-center gap-2">
            <Switch id="custom-input" aria-label="Use custom input" checked={customOn} onCheckedChange={setCustomOn} />
            <Label htmlFor="custom-input" className="text-xs">
              Use custom input
            </Label>
          </div>
          {customOn ? (
            <Textarea value={customInput} onChange={(e) => setCustomInput(e.target.value)} rows={5} className="rounded-xl font-mono text-xs" aria-label="Custom input" />
          ) : (
            <div className="space-y-3">
              {problem.samples.map((s, i) => (
                <div key={s.id} className="rounded-xl bg-surface-2 p-3 font-mono text-xs">
                  <p className="mb-1 font-sans font-semibold text-muted-foreground">Case {i + 1}</p>
                  <pre className="whitespace-pre-wrap">{s.input}</pre>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="result">
          <ConsoleResult state={out} />
        </TabsContent>
      </div>
    </Tabs>
  );

  const header = (
    <div className="flex items-center gap-2 border-b border-border px-3 py-2">
      <Button asChild variant="ghost" size="sm" className="rounded-lg">
        <Link href={contestId ? (contestSlug ? `/contests/${contestSlug}` : "/contests") : "/problems"}>
          <ArrowLeft /> {contestId ? "Contest" : "Problems"}
        </Link>
      </Button>
      <p className="hidden truncate text-sm font-medium md:block">
        {problem.number}. {problem.title}
      </p>
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="Bookmark problem" onClick={bookmark}>
          <Bookmark className={cn(subs.data?.bookmarked && "fill-cyan text-cyan")} />
        </Button>
        <TutorLauncher title={problem.title} kind="problem" content={problem.plainStatement} />
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      {header}
      <Group orientation={isDesktop ? "horizontal" : "vertical"} className="min-h-0 flex-1">
        <Panel defaultSize="45" minSize="25" className="glass !rounded-none !border-0 !shadow-none">
          {left}
        </Panel>
        <Separator className="w-1.5 bg-border/60 transition-colors hover:bg-brand data-[separator=active]:bg-brand aria-[orientation=horizontal]:h-1.5 aria-[orientation=horizontal]:w-auto" />
        <Panel defaultSize="55" minSize="30">
          <Group orientation="vertical">
            <Panel defaultSize="65" minSize="20">
              {editor}
            </Panel>
            <Separator className="h-1.5 bg-border/60 transition-colors hover:bg-brand data-[separator=active]:bg-brand" />
            <Panel defaultSize="35" minSize="12" className="bg-surface">
              {consolePane}
            </Panel>
          </Group>
        </Panel>
      </Group>
    </div>
  );
}

function ConsoleResult({ state }: { state: ConsoleState }) {
  const [active, setActive] = useState(0);
  if (state.kind === "idle") return <p className="text-sm text-muted-foreground">Run your code (Ctrl + &apos;) or submit to see results.</p>;
  if (state.kind === "running")
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> {state.mode === "submit" ? "Judging against all test cases…" : "Running sample tests…"}
      </p>
    );
  if (state.kind === "error")
    return state.missingKey ? (
      <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm" role="alert">
        <p className="mb-1 flex items-center gap-2 font-semibold text-warning">
          <KeyRound className="size-4" /> Add your Judge0 key
        </p>
        <p className="text-muted-foreground">{state.message}</p>
      </div>
    ) : (
      <p className="text-sm text-danger" role="alert">
        {state.message}{" "}
      </p>
    );
  const d = state.data;
  const r = d.results[active];
  return (
    <div className="space-y-3" aria-live="polite">
      <div className="flex flex-wrap items-baseline gap-3">
        <VerdictText verdict={d.verdict} className="text-xl" />
        <span className="text-xs text-muted-foreground">
          {d.passed}/{d.total} test cases passed
          {d.runtimeMs !== null ? ` · ${d.runtimeMs} ms` : ""}
          {d.memoryKb !== null ? ` · ${(d.memoryKb / 1024).toFixed(1)} MB` : ""}
        </span>
      </div>
      {d.compileOutput ? <pre className="whitespace-pre-wrap rounded-xl bg-danger/10 p-3 font-mono text-xs text-danger">{d.compileOutput}</pre> : null}
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Test cases">
        {d.results.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn("flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs", i === active ? "bg-surface-2" : "hover:bg-surface-2/60")}
          >
            {t.passed ? <CheckCircle2 className="size-3.5 text-success" /> : <XCircle className="size-3.5 text-danger" />}
            {t.id === "custom" ? "Custom" : t.input !== undefined ? `Case ${i + 1}` : `Hidden ${i + 1}`}
          </button>
        ))}
      </div>
      {r ? (
        <div className="space-y-2 font-mono text-xs">
          <p className="font-sans text-xs text-muted-foreground">
            {VERDICT_LABEL[r.status]} {r.timeMs !== null ? `· ${r.timeMs} ms` : ""}
          </p>
          {r.input !== undefined ? (
            <>
              <Block label="Input" text={r.input} />
              <Block label="Output" text={r.output ?? ""} />
              {r.expected !== undefined ? <Block label="Expected" text={r.expected} /> : null}
            </>
          ) : (
            <p className="font-sans text-muted-foreground">Hidden test case, input not shown.</p>
          )}
          {r.stderr ? <Block label="Stderr" text={r.stderr} danger /> : null}
        </div>
      ) : null}
    </div>
  );
}

function Block({ label, text, danger }: { label: string; text: string; danger?: boolean }) {
  return (
    <div>
      <p className="mb-1 font-sans text-muted-foreground">{label}</p>
      <pre className={cn("max-h-40 overflow-auto rounded-lg bg-surface-2 p-2 whitespace-pre-wrap", danger && "text-danger")}>{text || "(empty)"}</pre>
    </div>
  );
}

function Editorial({ problemId, solved }: { problemId: string; solved: boolean }) {
  const q = useQuery({ queryKey: ["editorial", problemId, solved], queryFn: () => getEditorial(problemId) });
  if (q.isLoading) return <div className="shimmer h-40 rounded-xl" />;
  if (q.isError || !q.data) return <p className="text-sm text-danger">Couldn&apos;t load the editorial.</p>;
  if (!q.data.unlocked)
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border p-8 text-center">
        <Lock className="size-8 text-muted-foreground" />
        <p className="font-semibold">Editorial locked</p>
        <p className="text-sm text-muted-foreground">{q.data.reason}</p>
      </div>
    );
  return (
    <div className="space-y-4 text-sm leading-relaxed">
      <h2 className="font-heading text-lg font-bold">Approach</h2>
      <p className="whitespace-pre-wrap">{q.data.editorial.replace(/\*\*|`/g, "")}</p>
      {q.data.solution ? (
        <>
          <h3 className="font-semibold">Reference solution (Python)</h3>
          <pre className="overflow-x-auto rounded-xl bg-black/40 p-3 font-mono text-xs">{q.data.solution}</pre>
        </>
      ) : null}
    </div>
  );
}

function SubmissionsList({ data, loading, error, retry }: { data?: SubsResponse; loading: boolean; error: boolean; retry: () => void }) {
  const [view, setView] = useState<Sub | null>(null);
  const [diffWith, setDiffWith] = useState<Sub | null>(null);
  const list = useMemo(() => data?.submissions ?? [], [data]);
  if (loading) return <div className="space-y-2">{[0, 1, 2].map((i) => <div key={i} className="shimmer h-12 rounded-xl" />)}</div>;
  if (error)
    return (
      <p className="text-sm text-danger">
        Couldn&apos;t load submissions.{" "}
        <button type="button" className="underline" onClick={retry}>
          Retry
        </button>
      </p>
    );
  if (!data?.signedIn)
    return (
      <p className="text-sm text-muted-foreground">
        <Link href="/login" className="underline">
          Log in
        </Link>{" "}
        to see your submissions.
      </p>
    );
  if (!list.length) return <p className="text-sm text-muted-foreground">No submissions yet. Submit your solution to see it here.</p>;
  return (
    <>
      <ul className="space-y-2">
        {list.map((s, i) => (
          <li key={s.id}>
            <button type="button" onClick={() => { setView(s); setDiffWith(list[i + 1] ?? null); }} className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left text-sm hover:bg-accent">
              <VerdictText verdict={s.verdict} />
              <span className="text-xs text-muted-foreground">{LANGUAGE_META[s.language]?.label}</span>
              <span className="text-xs text-muted-foreground">{s.runtimeMs ?? "-"} ms</span>
              <span className="ml-auto text-xs text-muted-foreground">{timeAgo(s.createdAt)}</span>
              <ChevronDown className="size-4 -rotate-90 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ul>
      <Dialog open={Boolean(view)} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-3xl rounded-2xl sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {view ? <VerdictText verdict={view.verdict} /> : null}
              <span className="text-sm font-normal text-muted-foreground">
                {view ? `${LANGUAGE_META[view.language]?.label} · ${view.passed}/${view.total} tests · ${timeAgo(view.createdAt)}` : ""}
              </span>
            </DialogTitle>
          </DialogHeader>
          {view ? (
            <Tabs defaultValue="code">
              <TabsList>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="diff" disabled={!diffWith}>
                  Diff vs previous attempt
                </TabsTrigger>
              </TabsList>
              <TabsContent value="code">
                <pre className="max-h-[60vh] overflow-auto rounded-xl bg-black/40 p-3 font-mono text-xs" data-lenis-prevent>
                  {view.code}
                </pre>
              </TabsContent>
              <TabsContent value="diff">{diffWith ? <CodeDiff before={diffWith.code} after={view.code} /> : null}</TabsContent>
            </Tabs>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
