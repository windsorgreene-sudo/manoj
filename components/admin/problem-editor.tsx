"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FileUp, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { selectCls } from "@/components/admin/ui";
import { saveProblem, type ProblemInput } from "@/lib/actions/admin/problems";
import { LANGUAGE_META, LANGUAGES } from "@/lib/languages";
import { cn, slugify } from "@/lib/utils";

type T = { input: string; expected: string; isSample: boolean; explanation?: string | null };

export function ProblemEditor({ initial }: { initial: ProblemInput }) {
  const router = useRouter();
  const [p, setP] = useState(initial);
  const [topics, setTopics] = useState(initial.topics.join(", "));
  const [companies, setCompanies] = useState(initial.companies.join(", "));
  const [tests, setTests] = useState<T[]>(initial.testCases);
  const [bulk, setBulk] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const list = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
  const save = async () => {
    setSaving(true);
    const r = await saveProblem({ ...p, topics: list(topics), companies: list(companies), testCases: tests });
    setSaving(false);
    if (!r.ok) return toast.error(r.error);
    toast.success("Problem saved");
    if (!p.id) router.replace(`/admin/problems/${r.data.id}`);
    else router.refresh();
  };
  const importBulk = (text: string) => {
    try {
      const parsed = JSON.parse(text) as unknown;
      if (!Array.isArray(parsed)) throw new Error("Expected a JSON array");
      const rows: T[] = parsed.map((r, i) => {
        const o = r as Record<string, unknown>;
        if (typeof o.input !== "string" || typeof o.expected !== "string") throw new Error(`Row ${i + 1}: "input" and "expected" must be strings`);
        return { input: o.input, expected: o.expected, isSample: Boolean(o.isSample), explanation: typeof o.explanation === "string" ? o.explanation : null };
      });
      setTests((t) => [...t, ...rows]);
      setBulk("");
      toast.success(`Imported ${rows.length} test cases`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  const field = (k: "title" | "slug", label: string) => (
    <div className="space-y-1.5">
      <Label htmlFor={`p-${k}`}>{label}</Label>
      <Input id={`p-${k}`} value={p[k]} onChange={(e) => setP({ ...p, [k]: k === "slug" ? slugify(e.target.value) : e.target.value, ...(k === "title" && !p.id ? { slug: slugify(e.target.value) } : {}) })} className="rounded-xl" />
    </div>
  );
  const area = (k: "statement" | "constraints" | "inputFormat" | "outputFormat" | "editorial", label: string, rows = 4) => (
    <div className="space-y-1.5">
      <Label htmlFor={`p-${k}`}>{label}</Label>
      <Textarea id={`p-${k}`} rows={rows} value={p[k] ?? ""} onChange={(e) => setP({ ...p, [k]: e.target.value })} className="rounded-xl font-mono text-sm" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="rounded-xl"><Link href="/admin/problems">← Problems</Link></Button>
        {p.id ? <Link href={`/problems/${p.slug}`} className="text-xs text-cyan underline">Open workspace</Link> : null}
        <Button className="ml-auto rounded-xl" onClick={save} disabled={saving}>{saving ? <Loader2 className="animate-spin" /> : <Save />} Save problem</Button>
      </div>
      <Tabs defaultValue="statement">
        <TabsList><TabsTrigger value="statement">Statement</TabsTrigger><TabsTrigger value="code">Starter code</TabsTrigger><TabsTrigger value="tests">Test cases ({tests.length})</TabsTrigger><TabsTrigger value="hints">Hints & editorial</TabsTrigger></TabsList>
        <TabsContent value="statement" className="glass mt-3 grid gap-4 p-5 md:grid-cols-2">
          {field("title", "Title")}
          {field("slug", "Slug")}
          <div className="md:col-span-2">{area("statement", "Statement (Markdown)", 8)}</div>
          {area("inputFormat", "Input format")}
          {area("outputFormat", "Output format")}
          <div className="md:col-span-2">{area("constraints", "Constraints")}</div>
          <div className="space-y-1.5"><Label htmlFor="p-diff">Difficulty</Label><select id="p-diff" className={cn(selectCls, "w-full")} value={p.difficulty} onChange={(e) => setP({ ...p, difficulty: e.target.value as "EASY" })}><option>EASY</option><option>MEDIUM</option><option>HARD</option></select></div>
          <div className="space-y-1.5"><Label htmlFor="p-status">Status</Label><select id="p-status" className={cn(selectCls, "w-full")} value={p.status} onChange={(e) => setP({ ...p, status: e.target.value as "DRAFT" })}><option>DRAFT</option><option>PUBLISHED</option><option>ARCHIVED</option></select></div>
          <div className="space-y-1.5"><Label htmlFor="p-topics">Topic tags (comma separated)</Label><Input id="p-topics" value={topics} onChange={(e) => setTopics(e.target.value)} className="rounded-xl" /></div>
          <div className="space-y-1.5"><Label htmlFor="p-comp">Company tags</Label><Input id="p-comp" value={companies} onChange={(e) => setCompanies(e.target.value)} className="rounded-xl" /></div>
          <div className="space-y-1.5"><Label htmlFor="p-tl">Time limit (ms)</Label><Input id="p-tl" type="number" value={p.timeLimitMs} onChange={(e) => setP({ ...p, timeLimitMs: Number(e.target.value) })} className="rounded-xl" /></div>
          <div className="space-y-1.5"><Label htmlFor="p-ml">Memory limit (MB)</Label><Input id="p-ml" type="number" value={p.memoryLimitMb} onChange={(e) => setP({ ...p, memoryLimitMb: Number(e.target.value) })} className="rounded-xl" /></div>
          <label className="flex items-center gap-2 text-sm"><Switch checked={p.isPremium} onCheckedChange={(v) => setP({ ...p, isPremium: v })} aria-label="Pro problem" /> Pro-only problem</label>
        </TabsContent>
        <TabsContent value="code" className="glass mt-3 p-5">
          <Tabs defaultValue="PYTHON">
            <TabsList>{LANGUAGES.map((l) => <TabsTrigger key={l} value={l}>{LANGUAGE_META[l].label}</TabsTrigger>)}</TabsList>
            {LANGUAGES.map((l) => (
              <TabsContent key={l} value={l}>
                <label htmlFor={`sc-${l}`} className="sr-only">{LANGUAGE_META[l].label} starter code</label>
                <Textarea id={`sc-${l}`} rows={16} spellCheck={false} value={p.starterCode[l] ?? ""} onChange={(e) => setP({ ...p, starterCode: { ...p.starterCode, [l]: e.target.value } })} className="rounded-xl font-mono text-xs" />
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
        <TabsContent value="tests" className="mt-3 space-y-4">
          <div className="glass space-y-2 p-4">
            <p className="text-sm font-semibold">Bulk upload</p>
            <p className="text-xs text-muted-foreground">Paste or upload a JSON array: <code>[{"{"}&quot;input&quot;: &quot;…&quot;, &quot;expected&quot;: &quot;…&quot;, &quot;isSample&quot;: false{"}"}]</code></p>
            <Textarea aria-label="Bulk test cases JSON" rows={4} value={bulk} onChange={(e) => setBulk(e.target.value)} className="rounded-xl font-mono text-xs" />
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-xl" disabled={!bulk.trim()} onClick={() => importBulk(bulk)}>Import pasted JSON</Button>
              <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" aria-label="Upload test cases file" onChange={async (e) => { const f = e.target.files?.[0]; if (f) importBulk(await f.text()); e.target.value = ""; }} />
              <Button size="sm" variant="outline" className="rounded-xl" onClick={() => fileRef.current?.click()}><FileUp /> Upload .json</Button>
              <Button size="sm" className="ml-auto rounded-xl" onClick={() => setTests([...tests, { input: "", expected: "", isSample: false }])}><Plus /> Add test</Button>
            </div>
          </div>
          <ol className="space-y-3">
            {tests.map((t, i) => (
              <li key={i} className="glass grid gap-2 p-4 md:grid-cols-2">
                <div className="flex items-center gap-3 md:col-span-2">
                  <span className="font-mono text-xs text-muted-foreground">#{i + 1}</span>
                  <label className="flex items-center gap-2 text-xs"><Switch checked={t.isSample} onCheckedChange={(v) => setTests(tests.map((x, j) => (j === i ? { ...x, isSample: v } : x)))} aria-label={`Test ${i + 1} is a sample`} /> Sample (visible)</label>
                  <Button size="icon-xs" variant="ghost" className="ml-auto" aria-label={`Remove test ${i + 1}`} onClick={() => setTests(tests.filter((_, j) => j !== i))}><Trash2 /></Button>
                </div>
                <Textarea aria-label={`Test ${i + 1} input`} rows={3} value={t.input} onChange={(e) => setTests(tests.map((x, j) => (j === i ? { ...x, input: e.target.value } : x)))} placeholder="stdin" className="rounded-xl font-mono text-xs" />
                <Textarea aria-label={`Test ${i + 1} expected output`} rows={3} value={t.expected} onChange={(e) => setTests(tests.map((x, j) => (j === i ? { ...x, expected: e.target.value } : x)))} placeholder="expected stdout" className="rounded-xl font-mono text-xs" />
              </li>
            ))}
          </ol>
        </TabsContent>
        <TabsContent value="hints" className="glass mt-3 space-y-4 p-5">
          <div className="space-y-2">
            <Label>Hints (unlocked one by one)</Label>
            {p.hints.map((h, i) => (
              <div key={i} className="flex gap-2">
                <Input aria-label={`Hint ${i + 1}`} value={h} onChange={(e) => setP({ ...p, hints: p.hints.map((x, j) => (j === i ? e.target.value : x)) })} className="rounded-xl" />
                <Button size="icon" variant="ghost" aria-label={`Remove hint ${i + 1}`} onClick={() => setP({ ...p, hints: p.hints.filter((_, j) => j !== i) })}><Trash2 /></Button>
              </div>
            ))}
            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setP({ ...p, hints: [...p.hints, ""] })}><Plus /> Add hint</Button>
          </div>
          {area("editorial", "Editorial (Markdown)", 8)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
