"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition, type ReactNode } from "react";
import { Eye, History, Loader2, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, selectCls } from "@/components/admin/ui";
import { previewMdx, restoreRevision, saveArticle, type ArticleInput } from "@/lib/actions/admin/articles";
import { cn, formatDate, slugify } from "@/lib/utils";

type Rev = { id: string; version: number; message: string | null; createdAt: string; author: string };
type Cat = { id: string; name: string };

const SNIPPETS: { label: string; text: string }[] = [
  { label: "H2", text: "\n## Section title\n" },
  { label: "Code tabs", text: "\n<CodeTabs>\n\n```cpp\n// C++\n```\n\n```python\n# Python\n```\n\n</CodeTabs>\n" },
  { label: "Tip", text: '\n<Callout type="tip">Helpful tip.</Callout>\n' },
  { label: "Table", text: "\n| Col A | Col B |\n|---|---|\n| 1 | 2 |\n" },
];

export function ArticleEditor({
  initial,
  categories,
  revisions,
  canPublish,
  backHref,
  reviewNote,
}: {
  initial: ArticleInput & { status: ArticleInput["status"] | "CHANGES_REQUESTED" | "REJECTED" };
  categories: Cat[];
  revisions: Rev[];
  canPublish: boolean;
  backHref: string;
  reviewNote?: string | null;
}) {
  const router = useRouter();
  const [a, setA] = useState({ ...initial, status: (["CHANGES_REQUESTED", "REJECTED"].includes(initial.status) ? "DRAFT" : initial.status) as ArticleInput["status"] });
  const [tagsText, setTagsText] = useState((initial.tags ?? []).join(", "));
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [preview, setPreview] = useState<ReactNode>(null);
  const [pending, start] = useTransition();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => start(async () => setPreview(await previewMdx(a.content))), 700);
    return () => window.clearTimeout(t);
  }, [a.content]);

  const set = <K extends keyof typeof a>(k: K, v: (typeof a)[K]) => setA((x) => ({ ...x, [k]: v }));
  const save = async (status: ArticleInput["status"]) => {
    setSaving(true);
    const r = await saveArticle({ ...a, status, tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean) });
    setSaving(false);
    if (!r.ok) return toast.error(r.error);
    toast.success(status === "IN_REVIEW" ? "Submitted for review" : status === "PUBLISHED" ? "Published!" : `Saved (v${r.data.version})`);
    if (!a.id) router.replace(`${backHref}/${r.data.id}`);
    else router.refresh();
    setA((x) => ({ ...x, id: r.data.id, status }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="rounded-xl"><Link href={backHref}>← Back</Link></Button>
        <StatusBadge status={initial.status} />
        {a.id && initial.status === "PUBLISHED" ? <Link href={`/${a.isBlog ? "blog" : "tutorials"}/${a.slug}`} className="text-xs text-cyan underline">View live</Link> : null}
        <div className="ml-auto flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-xl" disabled={saving} onClick={() => save("DRAFT")}><Save /> Save draft</Button>
          {canPublish ? (
            <>
              <select aria-label="Status" className={selectCls} value={a.status} onChange={(e) => set("status", e.target.value as ArticleInput["status"])}>
                {["DRAFT", "IN_REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
              {a.status === "SCHEDULED" ? (
                <input aria-label="Publish at" type="datetime-local" className={selectCls} value={a.scheduledAt ? a.scheduledAt.slice(0, 16) : ""} onChange={(e) => set("scheduledAt", e.target.value ? new Date(e.target.value).toISOString() : null)} />
              ) : null}
              <Button className="rounded-xl" disabled={saving} onClick={() => save(a.status)}>{saving ? <Loader2 className="animate-spin" /> : <Send />} Save as {a.status.replace("_", " ").toLowerCase()}</Button>
            </>
          ) : (
            <Button className="rounded-xl" disabled={saving} onClick={() => save("IN_REVIEW")}>{saving ? <Loader2 className="animate-spin" /> : <Send />} Submit for review</Button>
          )}
        </div>
      </div>
      {reviewNote && ["CHANGES_REQUESTED", "REJECTED"].includes(initial.status) ? (
        <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm" role="note"><strong>Editor feedback:</strong> {reviewNote}</div>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="glass grid gap-4 p-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="a-title">Title</Label>
              <Input id="a-title" value={a.title} onChange={(e) => { set("title", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} className="rounded-xl text-lg font-semibold" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="a-slug">Slug</Label>
              <Input id="a-slug" value={a.slug} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} className="rounded-xl font-mono text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="a-diff">Difficulty</Label>
              <select id="a-diff" className={cn(selectCls, "w-full")} value={a.difficulty} onChange={(e) => set("difficulty", e.target.value as "EASY")}>
                <option value="EASY">Easy</option><option value="MEDIUM">Medium</option><option value="HARD">Hard</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="a-excerpt">Excerpt</Label>
              <Textarea id="a-excerpt" rows={2} value={a.excerpt} onChange={(e) => set("excerpt", e.target.value)} className="rounded-xl" />
            </div>
          </div>
          <Tabs defaultValue="write" className="glass p-3">
            <div className="flex flex-wrap items-center gap-2">
              <TabsList><TabsTrigger value="write">Write</TabsTrigger><TabsTrigger value="preview"><Eye /> Preview</TabsTrigger><TabsTrigger value="split">Split</TabsTrigger></TabsList>
              <div className="ml-auto flex flex-wrap gap-1">
                {SNIPPETS.map((s) => <Button key={s.label} size="xs" variant="outline" className="rounded-lg" onClick={() => set("content", a.content + s.text)}>+ {s.label}</Button>)}
              </div>
            </div>
            <TabsContent value="write"><label htmlFor="a-content" className="sr-only">MDX content</label><Textarea id="a-content" value={a.content} onChange={(e) => set("content", e.target.value)} className="min-h-[60vh] rounded-xl font-mono text-sm" spellCheck={false} /></TabsContent>
            <TabsContent value="preview"><div className="min-h-[60vh] rounded-xl bg-background p-5" aria-busy={pending}>{preview ?? <p className="text-sm text-muted-foreground">Rendering preview…</p>}</div></TabsContent>
            <TabsContent value="split">
              <div className="grid gap-3 lg:grid-cols-2">
                <Textarea aria-label="MDX content" value={a.content} onChange={(e) => set("content", e.target.value)} className="min-h-[60vh] rounded-xl font-mono text-sm" spellCheck={false} />
                <div className="max-h-[70vh] overflow-y-auto rounded-xl bg-background p-5" data-lenis-prevent aria-live="polite">{pending ? <Loader2 className="mb-2 size-4 animate-spin text-muted-foreground" /> : null}{preview}</div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <aside className="space-y-4">
          <div className="glass space-y-3 p-4">
            <p className="text-sm font-semibold">Taxonomy</p>
            <div className="space-y-1.5"><Label htmlFor="a-cat">Category</Label>
              <select id="a-cat" className={cn(selectCls, "w-full")} value={a.categoryId ?? ""} onChange={(e) => set("categoryId", e.target.value || null)}>
                <option value="">none , </option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5"><Label htmlFor="a-tags">Tags (comma separated)</Label><Input id="a-tags" value={tagsText} onChange={(e) => setTagsText(e.target.value)} className="rounded-xl" /></div>
            <div className="flex items-center justify-between"><Label htmlFor="a-blog">Blog post</Label><Switch id="a-blog" checked={a.isBlog} onCheckedChange={(v) => set("isBlog", v)} /></div>
          </div>
          <div className="glass space-y-3 p-4">
            <p className="text-sm font-semibold">SEO</p>
            <div className="space-y-1.5"><Label htmlFor="a-seot">SEO title <span className="text-xs text-muted-foreground">({(a.seoTitle ?? "").length}/60)</span></Label><Input id="a-seot" value={a.seoTitle ?? ""} onChange={(e) => set("seoTitle", e.target.value)} className="rounded-xl" /></div>
            <div className="space-y-1.5"><Label htmlFor="a-seod">Meta description <span className="text-xs text-muted-foreground">({(a.seoDescription ?? "").length}/160)</span></Label><Textarea id="a-seod" rows={3} value={a.seoDescription ?? ""} onChange={(e) => set("seoDescription", e.target.value)} className="rounded-xl" /></div>
            <div className="space-y-1.5"><Label htmlFor="a-og">OG image URL</Label><Input id="a-og" value={a.ogImage ?? ""} onChange={(e) => set("ogImage", e.target.value)} placeholder="Leave empty for auto-generated" className="rounded-xl" /></div>
            <div className="space-y-1.5"><Label htmlFor="a-msg">Revision message</Label><Input id="a-msg" value={a.message ?? ""} onChange={(e) => set("message", e.target.value)} placeholder="What changed?" className="rounded-xl" /></div>
          </div>
          <div className="glass p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold"><History className="size-4" /> Version history</p>
            {revisions.length ? (
              <ul className="max-h-72 space-y-2 overflow-y-auto" data-lenis-prevent>
                {revisions.map((r) => (
                  <li key={r.id} className="flex items-center gap-2 text-xs">
                    <span className="rounded bg-surface-2 px-1.5 font-mono">v{r.version}</span>
                    <span className="min-w-0 flex-1 truncate" title={r.message ?? ""}>{r.message ?? "-"} · {r.author} · {formatDate(r.createdAt, { dateStyle: "short", timeStyle: "short" })}</span>
                    <Button size="xs" variant="ghost" onClick={async () => { if (!window.confirm(`Restore version ${r.version}? A new version will be created.`)) return; const res = await restoreRevision(r.id); if (res.ok) { toast.success("Restored"); router.refresh(); } else toast.error(res.error); }}>Restore</Button>
                  </li>
                ))}
              </ul>
            ) : <p className="text-xs text-muted-foreground">Save to create the first version.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
