"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { Loader2, Plus, Save, Snowflake, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SortableList } from "@/components/admin/sortable";
import { selectCls } from "@/components/admin/ui";
import { RoadmapGraph, type RoadmapNode } from "@/components/practice/roadmap-graph";
import { saveContest, saveQuiz, saveRoadmap, saveSheet, setContestFrozen, type ContestInput, type QuizInput, type RoadmapInput, type SheetInput } from "@/lib/actions/admin/catalog";
import { cn, slugify } from "@/lib/utils";

type Saved = { ok: true; data: { id: string } } | { ok: false; error: string };

function useSaver(base: string, isNew: boolean) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const run = async (fn: () => Promise<Saved>) => {
    setSaving(true);
    const r = await fn();
    setSaving(false);
    if (!r.ok) return toast.error(r.error);
    toast.success("Saved");
    if (isNew) router.replace(`${base}/${r.data.id}`);
    else router.refresh();
  };
  return { saving, run };
}

function Toolbar({ back, saving, onSave, extra }: { back: string; saving: boolean; onSave: () => void; extra?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <Button asChild variant="ghost" size="sm" className="rounded-xl"><Link href={back}>← Back</Link></Button>
      {extra}
      <Button className="ml-auto rounded-xl" onClick={onSave} disabled={saving}>{saving ? <Loader2 className="animate-spin" /> : <Save />} Save</Button>
    </div>
  );
}

function TextField({ id, label, value, onChange, type = "text", className }: { id: string; label: string; value: string | number; onChange: (v: string) => void; type?: string; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl" />
    </div>
  );
}

// ───────── Quiz ─────────
export function QuizEditor({ initial }: { initial: QuizInput }) {
  const [q, setQ] = useState(initial);
  const { saving, run } = useSaver("/admin/quizzes", !initial.id);
  const setQuestion = (i: number, patch: Partial<QuizInput["questions"][number]>) => setQ({ ...q, questions: q.questions.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  return (
    <div>
      <Toolbar back="/admin/quizzes" saving={saving} onSave={() => run(() => saveQuiz(q))} />
      <section className="glass mb-4 grid gap-4 p-5 md:grid-cols-3">
        <TextField id="q-title" label="Title" value={q.title} onChange={(v) => setQ({ ...q, title: v, ...(initial.id ? {} : { slug: slugify(v) }) })} />
        <TextField id="q-slug" label="Slug" value={q.slug} onChange={(v) => setQ({ ...q, slug: slugify(v) })} />
        <TextField id="q-topic" label="Topic" value={q.topic} onChange={(v) => setQ({ ...q, topic: v })} />
        <div className="space-y-1.5 md:col-span-3"><Label htmlFor="q-desc">Description</Label><Textarea id="q-desc" rows={2} value={q.description} onChange={(e) => setQ({ ...q, description: e.target.value })} className="rounded-xl" /></div>
        <TextField id="q-dur" label="Duration (minutes)" type="number" value={q.durationMins} onChange={(v) => setQ({ ...q, durationMins: Number(v) })} />
        <TextField id="q-neg" label="Negative mark (fraction of marks)" type="number" value={q.negativeMark} onChange={(v) => setQ({ ...q, negativeMark: Number(v) })} />
        <div className="flex flex-wrap items-center gap-4 pt-6 text-sm">
          {(["negativeMarking", "isMockTest", "isPublished"] as const).map((k) => (
            <label key={k} className="flex items-center gap-2"><Switch checked={q[k]} onCheckedChange={(v) => setQ({ ...q, [k]: v })} aria-label={k} /> {k === "negativeMarking" ? "Negative marking" : k === "isMockTest" ? "Mock test" : "Published"}</label>
          ))}
        </div>
      </section>
      <h2 className="mb-2 font-semibold">Question bank ({q.questions.length})</h2>
      <ol className="space-y-3">
        {q.questions.map((qu, i) => (
          <li key={i} className="glass space-y-3 p-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">Q{i + 1}</span>
              <select aria-label="Question type" className={selectCls} value={qu.type} onChange={(e) => setQuestion(i, { type: e.target.value as "SINGLE" })}><option value="SINGLE">Single choice</option><option value="MULTIPLE">Multiple choice</option><option value="TRUE_FALSE">True / false</option></select>
              <Input aria-label="Marks" type="number" value={qu.marks} onChange={(e) => setQuestion(i, { marks: Number(e.target.value) })} className="h-9 w-20 rounded-xl" />
              <Button size="icon-sm" variant="ghost" className="ml-auto" aria-label={`Delete question ${i + 1}`} onClick={() => setQ({ ...q, questions: q.questions.filter((_, j) => j !== i) })}><Trash2 /></Button>
            </div>
            <Textarea aria-label={`Question ${i + 1} prompt`} rows={2} value={qu.prompt} onChange={(e) => setQuestion(i, { prompt: e.target.value })} className="rounded-xl" />
            <div className="grid gap-2 sm:grid-cols-2">
              {qu.options.map((o, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input
                    type={qu.type === "MULTIPLE" ? "checkbox" : "radio"}
                    name={`correct-${i}`}
                    aria-label={`Option ${oi + 1} is correct`}
                    checked={qu.correct.includes(oi)}
                    onChange={(e) => setQuestion(i, { correct: qu.type === "MULTIPLE" ? (e.target.checked ? [...qu.correct, oi] : qu.correct.filter((c) => c !== oi)) : [oi] })}
                    className="size-4 accent-[var(--cv-primary)]"
                  />
                  <Input aria-label={`Option ${oi + 1}`} value={o} onChange={(e) => setQuestion(i, { options: qu.options.map((x, j) => (j === oi ? e.target.value : x)) })} className="h-9 rounded-xl" />
                </div>
              ))}
            </div>
            <Textarea aria-label={`Question ${i + 1} explanation`} rows={2} value={qu.explanation} onChange={(e) => setQuestion(i, { explanation: e.target.value })} placeholder="Explanation shown after submission" className="rounded-xl" />
          </li>
        ))}
      </ol>
      <Button variant="outline" className="mt-3 rounded-xl" onClick={() => setQ({ ...q, questions: [...q.questions, { prompt: "", options: ["", "", "", ""], correct: [0], explanation: "", marks: 1, type: "SINGLE" }] })}><Plus /> Add question</Button>
    </div>
  );
}

// ───────── Sheet ─────────
export function SheetEditor({ initial, problemSlugs }: { initial: SheetInput; problemSlugs: string[] }) {
  const [s, setS] = useState(initial);
  const [items, setItems] = useState(initial.items.map((it, i) => ({ ...it, id: `${it.problemSlug}-${i}` })));
  const [newSlug, setNewSlug] = useState("");
  const [newSection, setNewSection] = useState(initial.items.at(-1)?.section ?? "General");
  const { saving, run } = useSaver("/admin/sheets", !initial.id);
  return (
    <div>
      <Toolbar back="/admin/sheets" saving={saving} onSave={() => run(() => saveSheet({ ...s, items: items.map(({ problemSlug, section }) => ({ problemSlug, section })) }))} />
      <section className="glass mb-4 grid gap-4 p-5 md:grid-cols-3">
        <TextField id="s-title" label="Title" value={s.title} onChange={(v) => setS({ ...s, title: v, ...(initial.id ? {} : { slug: slugify(v) }) })} />
        <TextField id="s-slug" label="Slug" value={s.slug} onChange={(v) => setS({ ...s, slug: slugify(v) })} />
        <div className="space-y-1.5"><Label htmlFor="s-kind">Kind</Label><select id="s-kind" className={cn(selectCls, "w-full")} value={s.kind} onChange={(e) => setS({ ...s, kind: e.target.value as "TOPIC" })}><option value="TOPIC">Topic-wise</option><option value="COMPANY">Company-wise</option></select></div>
        <div className="space-y-1.5 md:col-span-2"><Label htmlFor="s-desc">Description</Label><Textarea id="s-desc" rows={2} value={s.description} onChange={(e) => setS({ ...s, description: e.target.value })} className="rounded-xl" /></div>
        {s.kind === "COMPANY" ? <TextField id="s-company" label="Company" value={s.company ?? ""} onChange={(v) => setS({ ...s, company: v })} /> : null}
        <label className="flex items-center gap-2 text-sm"><Switch checked={s.isPublished} onCheckedChange={(v) => setS({ ...s, isPublished: v })} aria-label="Published" /> Published</label>
      </section>
      <form className="glass mb-3 flex flex-wrap items-end gap-2 p-4" onSubmit={(e) => { e.preventDefault(); if (!newSlug) return; setItems([...items, { problemSlug: newSlug, section: newSection, id: `${newSlug}-${Date.now()}` }]); setNewSlug(""); }}>
        <TextField id="s-sec" label="Section" value={newSection} onChange={setNewSection} />
        <div className="space-y-1.5"><Label htmlFor="s-prob">Problem slug</Label><Input id="s-prob" list="sheet-problems" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} className="rounded-xl" /><datalist id="sheet-problems">{problemSlugs.map((p) => <option key={p} value={p} />)}</datalist></div>
        <Button type="submit" className="rounded-xl"><Plus /> Add problem</Button>
      </form>
      <SortableList
        items={items}
        onReorder={setItems}
        className="space-y-1"
        render={(it, handle) => (
          <div className="glass flex items-center gap-2 px-3 py-2 text-sm">
            {handle}
            <Input aria-label="Section" value={it.section} onChange={(e) => setItems(items.map((x) => (x.id === it.id ? { ...x, section: e.target.value } : x)))} className="h-8 w-48 rounded-lg" />
            <span className="flex-1 font-mono text-xs">{it.problemSlug}</span>
            <Button size="icon-xs" variant="ghost" aria-label="Remove" onClick={() => setItems(items.filter((x) => x.id !== it.id))}><Trash2 /></Button>
          </div>
        )}
      />
    </div>
  );
}

// ───────── Roadmap ─────────
export function RoadmapEditor({ initial }: { initial: RoadmapInput }) {
  const [r, setR] = useState(initial);
  const [json, setJson] = useState(JSON.stringify({ nodes: initial.nodes, edges: initial.edges }, null, 2));
  const { saving, run } = useSaver("/admin/roadmaps", !initial.id);
  const parsed = useMemo(() => {
    try {
      const j = JSON.parse(json) as { nodes: RoadmapNode[]; edges: [string, string][] };
      if (!Array.isArray(j.nodes) || !Array.isArray(j.edges)) return { error: "JSON must have nodes[] and edges[]" };
      return { value: j };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [json]);
  return (
    <div>
      <Toolbar back="/admin/roadmaps" saving={saving} onSave={() => ("value" in parsed && parsed.value ? run(() => saveRoadmap({ ...r, nodes: parsed.value.nodes, edges: parsed.value.edges })) : toast.error(parsed.error))} />
      <section className="glass mb-4 grid gap-4 p-5 md:grid-cols-3">
        <TextField id="r-title" label="Title" value={r.title} onChange={(v) => setR({ ...r, title: v, ...(initial.id ? {} : { slug: slugify(v) }) })} />
        <TextField id="r-slug" label="Slug" value={r.slug} onChange={(v) => setR({ ...r, slug: slugify(v) })} />
        <label className="flex items-center gap-2 pt-6 text-sm"><Switch checked={r.isPublished} onCheckedChange={(v) => setR({ ...r, isPublished: v })} aria-label="Published" /> Published</label>
        <div className="space-y-1.5 md:col-span-3"><Label htmlFor="r-desc">Description</Label><Textarea id="r-desc" rows={2} value={r.description} onChange={(e) => setR({ ...r, description: e.target.value })} className="rounded-xl" /></div>
      </section>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="r-json">Graph JSON (nodes: id, label, x, y, href, kind · edges: [from, to])</Label>
          <Textarea id="r-json" spellCheck={false} value={json} onChange={(e) => setJson(e.target.value)} className="min-h-[60vh] rounded-xl font-mono text-xs" />
          {"error" in parsed ? <p className="text-xs text-danger" role="alert">{parsed.error}</p> : null}
        </div>
        <div>{"value" in parsed && parsed.value ? <RoadmapGraph slug={`preview-${r.slug}`} nodes={parsed.value.nodes} edges={parsed.value.edges} /> : null}</div>
      </div>
    </div>
  );
}

// ───────── Contest ─────────
type Standing = { rank: number; name: string; score: number; solved: number; penaltyMins: number };
export function ContestEditor({ initial, problemSlugs, standings, frozen }: { initial: ContestInput; problemSlugs: string[]; standings: Standing[]; frozen: boolean }) {
  const router = useRouter();
  const [c, setC] = useState(initial);
  const { saving, run } = useSaver("/admin/contests", !initial.id);
  const local = (iso: string) => {
    const d = new Date(iso);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
  };
  return (
    <div>
      <Toolbar
        back="/admin/contests"
        saving={saving}
        onSave={() => run(() => saveContest(c))}
        extra={
          initial.id ? (
            <Button variant="outline" size="sm" className="rounded-xl" onClick={async () => { const r = await setContestFrozen({ id: initial.id as string, frozen: !frozen }); if (r.ok) { toast.success(frozen ? "Leaderboard unfrozen" : "Leaderboard frozen"); router.refresh(); } else toast.error(r.error); }}>
              <Snowflake /> {frozen ? "Unfreeze leaderboard" : "Freeze leaderboard"}
            </Button>
          ) : null
        }
      />
      <section className="glass mb-4 grid gap-4 p-5 md:grid-cols-2">
        <TextField id="c-title" label="Title" value={c.title} onChange={(v) => setC({ ...c, title: v, ...(initial.id ? {} : { slug: slugify(v) }) })} />
        <TextField id="c-slug" label="Slug" value={c.slug} onChange={(v) => setC({ ...c, slug: slugify(v) })} />
        <TextField id="c-start" label="Starts at" type="datetime-local" value={local(c.startsAt)} onChange={(v) => v && setC({ ...c, startsAt: new Date(v).toISOString() })} />
        <TextField id="c-end" label="Ends at" type="datetime-local" value={local(c.endsAt)} onChange={(v) => v && setC({ ...c, endsAt: new Date(v).toISOString() })} />
        <div className="space-y-1.5 md:col-span-2"><Label htmlFor="c-desc">Description / rules</Label><Textarea id="c-desc" rows={3} value={c.description} onChange={(e) => setC({ ...c, description: e.target.value })} className="rounded-xl" /></div>
        <label className="flex items-center gap-2 text-sm"><Switch checked={c.isPublished} onCheckedChange={(v) => setC({ ...c, isPublished: v })} aria-label="Published" /> Published</label>
      </section>
      <h2 className="mb-2 font-semibold">Problems</h2>
      <ul className="space-y-2">
        {c.problems.map((p, i) => (
          <li key={i} className="glass flex items-center gap-2 p-3">
            <span className="w-6 font-mono text-xs">{String.fromCharCode(65 + i)}</span>
            <Input aria-label={`Problem ${i + 1} slug`} list="contest-problems" value={p.problemSlug} onChange={(e) => setC({ ...c, problems: c.problems.map((x, j) => (j === i ? { ...x, problemSlug: e.target.value } : x)) })} className="h-9 flex-1 rounded-xl font-mono text-xs" />
            <Input aria-label={`Problem ${i + 1} points`} type="number" value={p.points} onChange={(e) => setC({ ...c, problems: c.problems.map((x, j) => (j === i ? { ...x, points: Number(e.target.value) } : x)) })} className="h-9 w-24 rounded-xl" />
            <Button size="icon-sm" variant="ghost" aria-label="Remove problem" onClick={() => setC({ ...c, problems: c.problems.filter((_, j) => j !== i) })}><Trash2 /></Button>
          </li>
        ))}
      </ul>
      <datalist id="contest-problems">{problemSlugs.map((s) => <option key={s} value={s} />)}</datalist>
      <Button variant="outline" className="mt-2 rounded-xl" onClick={() => setC({ ...c, problems: [...c.problems, { problemSlug: "", points: 100 * (c.problems.length + 1) }] })}><Plus /> Add problem</Button>
      {initial.id ? (
        <section className="mt-8" aria-labelledby="standings">
          <h2 id="standings" className="mb-2 font-semibold">Live standings {frozen ? <span className="ml-2 text-xs text-cyan">(frozen for participants)</span> : null}</h2>
          {standings.length ? (
            <div className="glass relative overflow-x-auto">
              <table className="w-full text-sm"><caption className="sr-only">Standings</caption>
                <thead><tr className="border-b border-border text-left text-xs uppercase text-muted-foreground"><th scope="col" className="px-4 py-2">#</th><th scope="col" className="px-4 py-2">User</th><th scope="col" className="px-4 py-2">Score</th><th scope="col" className="px-4 py-2">Solved</th><th scope="col" className="px-4 py-2">Penalty</th></tr></thead>
                <tbody>{standings.map((s) => <tr key={s.rank + s.name} className="border-b border-border/60 last:border-0"><td className="px-4 py-2">{s.rank}</td><td className="px-4 py-2">{s.name}</td><td className="px-4 py-2 tabular-nums">{s.score}</td><td className="px-4 py-2">{s.solved}</td><td className="px-4 py-2">{s.penaltyMins}m</td></tr>)}</tbody>
              </table>
            </div>
          ) : <p className="text-sm text-muted-foreground">No participants yet.</p>}
        </section>
      ) : null}
    </div>
  );
}
