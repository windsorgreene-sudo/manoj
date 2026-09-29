"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { CodeDiff } from "@/components/practice/code-diff";
import { VerdictText, VERDICT_LABEL } from "@/components/practice/verdict";
import { LANGUAGE_META, type LanguageKey } from "@/lib/languages";
import { formatDate } from "@/lib/utils";

type Sub = {
  id: string;
  verdict: string;
  language: string;
  runtimeMs: number | null;
  memoryKb: number | null;
  passed: number;
  total: number;
  createdAt: string;
  code: string;
  problemId: string | null;
  problem: { slug: string; title: string; number: number } | null;
};

export function SubmissionHistory({ subs }: { subs: Sub[] }) {
  const [verdict, setVerdict] = useState("all");
  const [open, setOpen] = useState<Sub | null>(null);
  const [compare, setCompare] = useState<string>("");
  const list = useMemo(() => subs.filter((s) => verdict === "all" || s.verdict === verdict), [subs, verdict]);
  const attempts = open ? subs.filter((s) => s.problemId === open.problemId && s.id !== open.id) : [];
  const other = attempts.find((a) => a.id === compare) ?? attempts.find((a) => a.createdAt < (open?.createdAt ?? "")) ?? attempts[0];

  if (!subs.length) return <EmptyState title="No submissions yet" description="Submit a solution in the problem workspace to see it here." />;
  return (
    <>
      <div className="flex items-center gap-2">
        <Select value={verdict} onValueChange={setVerdict}>
          <SelectTrigger className="w-52 rounded-xl" aria-label="Filter by verdict"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All verdicts</SelectItem>
            {["ACCEPTED", "WRONG_ANSWER", "TIME_LIMIT_EXCEEDED", "RUNTIME_ERROR", "COMPILATION_ERROR"].map((v) => <SelectItem key={v} value={v}>{VERDICT_LABEL[v]}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{list.length} submissions</span>
      </div>
      <div className="glass relative overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <caption className="sr-only">Submissions</caption>
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="px-4 py-3">Problem</th>
              <th scope="col" className="px-4 py-3">Verdict</th>
              <th scope="col" className="px-4 py-3">Language</th>
              <th scope="col" className="px-4 py-3">Runtime</th>
              <th scope="col" className="px-4 py-3">Submitted</th>
              <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id} className="border-b border-border/60 last:border-0 hover:bg-accent/40">
                <td className="px-4 py-3">{s.problem ? <Link href={`/problems/${s.problem.slug}`} className="hover:text-cyan">{s.problem.number}. {s.problem.title}</Link> : "-"}</td>
                <td className="px-4 py-3"><VerdictText verdict={s.verdict} /></td>
                <td className="px-4 py-3 text-muted-foreground">{LANGUAGE_META[s.language as LanguageKey]?.label}</td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">{s.runtimeMs ?? "-"} ms</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(s.createdAt, { dateStyle: "medium", timeStyle: "short" })}</td>
                <td className="px-4 py-3 text-right"><button type="button" onClick={() => { setOpen(s); setCompare(""); }} className="text-xs font-medium text-cyan hover:underline">View code</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={Boolean(open)} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-3xl rounded-2xl sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex flex-wrap items-center gap-3">{open ? <><VerdictText verdict={open.verdict} /><span className="text-sm font-normal text-muted-foreground">{open.problem?.title} · {open.passed}/{open.total} tests</span></> : null}</DialogTitle>
          </DialogHeader>
          {open ? (
            <Tabs defaultValue="code">
              <TabsList>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="diff" disabled={!attempts.length}>Diff between attempts</TabsTrigger>
              </TabsList>
              <TabsContent value="code"><pre className="max-h-[60vh] overflow-auto rounded-xl bg-black/40 p-3 font-mono text-xs" data-lenis-prevent>{open.code}</pre></TabsContent>
              <TabsContent value="diff" className="space-y-3">
                <Select value={other?.id ?? ""} onValueChange={setCompare}>
                  <SelectTrigger className="w-full rounded-xl" aria-label="Compare with"><SelectValue placeholder="Compare with…" /></SelectTrigger>
                  <SelectContent>{attempts.map((a) => <SelectItem key={a.id} value={a.id}>{VERDICT_LABEL[a.verdict]} · {LANGUAGE_META[a.language as LanguageKey]?.label} · {formatDate(a.createdAt, { dateStyle: "medium", timeStyle: "short" })}</SelectItem>)}</SelectContent>
                </Select>
                {other ? <CodeDiff before={other.code} after={open.code} /> : null}
              </TabsContent>
            </Tabs>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
