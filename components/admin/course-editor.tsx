"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SortableList } from "@/components/admin/sortable";
import { selectCls } from "@/components/admin/ui";
import { addModule, deleteLesson, deleteModule, renameModule, reorderLessons, reorderModules, saveCourse, saveLesson, type CourseInput, type LessonInput } from "@/lib/actions/admin/courses";
import { cn, slugify } from "@/lib/utils";

type Lesson = { id: string; title: string; slug: string; type: "ARTICLE" | "PROBLEM" | "QUIZ" | "VIDEO"; isPreview: boolean; durationMins: number; refSlug: string; videoUrl: string };
type Mod = { id: string; title: string; lessons: Lesson[] };

export function CourseEditor({ course, modules: initialModules, refs }: { course: CourseInput; modules: Mod[]; refs: { articles: string[]; problems: string[]; quizzes: string[] } }) {
  const router = useRouter();
  const [c, setC] = useState(course);
  const [outcomes, setOutcomes] = useState(course.outcomes.join("\n"));
  const [modules, setModules] = useState(initialModules);
  const [prevInit, setPrevInit] = useState(initialModules);
  if (prevInit !== initialModules) {
    setPrevInit(initialModules);
    setModules(initialModules);
  }
  const [saving, setSaving] = useState(false);
  const [newModule, setNewModule] = useState("");
  const [lesson, setLesson] = useState<(LessonInput & { moduleId: string }) | null>(null);

  const result = (r: { ok: boolean; error?: string }, msg: string) => {
    if (r.ok) {
      toast.success(msg);
      router.refresh();
    } else toast.error(r.error ?? "Failed");
    return r.ok;
  };

  const save = async () => {
    setSaving(true);
    const r = await saveCourse({ ...c, outcomes: outcomes.split("\n").map((o) => o.trim()).filter(Boolean) });
    setSaving(false);
    if (!r.ok) return toast.error(r.error);
    toast.success("Course saved");
    if (!c.id) router.replace(`/admin/courses/${r.data.id}`);
    else router.refresh();
  };

  const f = (k: keyof CourseInput, label: string, type = "text") => (
    <div className="space-y-1.5">
      <Label htmlFor={`c-${k}`}>{label}</Label>
      <Input
        id={`c-${k}`}
        type={type}
        value={String(c[k] ?? "")}
        onChange={(e) => setC({ ...c, [k]: type === "number" ? Number(e.target.value) : k === "slug" ? slugify(e.target.value) : e.target.value })}
        className="rounded-xl"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="rounded-xl"><Link href="/admin/courses">← Courses</Link></Button>
        {c.id ? <Link href={`/courses/${c.slug}`} className="text-xs text-cyan underline">View course</Link> : null}
        <Button className="ml-auto rounded-xl" onClick={save} disabled={saving}>{saving ? <Loader2 className="animate-spin" /> : <Save />} Save course</Button>
      </div>
      <section className="glass grid gap-4 p-5 md:grid-cols-3" aria-label="Course details">
        {f("title", "Title")}
        {f("slug", "Slug")}
        {f("topic", "Topic")}
        <div className="space-y-1.5 md:col-span-3"><Label htmlFor="c-subtitle">Subtitle</Label><Input id="c-subtitle" value={c.subtitle} onChange={(e) => setC({ ...c, subtitle: e.target.value })} className="rounded-xl" /></div>
        <div className="space-y-1.5 md:col-span-3"><Label htmlFor="c-desc">Description</Label><Textarea id="c-desc" rows={4} value={c.description} onChange={(e) => setC({ ...c, description: e.target.value })} className="rounded-xl" /></div>
        <div className="space-y-1.5"><Label htmlFor="c-level">Level</Label><select id="c-level" className={cn(selectCls, "w-full")} value={c.level} onChange={(e) => setC({ ...c, level: e.target.value as CourseInput["level"] })}><option>BEGINNER</option><option>INTERMEDIATE</option><option>ADVANCED</option></select></div>
        {f("language", "Language")}
        <div className="space-y-1.5"><Label htmlFor="c-status">Status</Label><select id="c-status" className={cn(selectCls, "w-full")} value={c.status} onChange={(e) => setC({ ...c, status: e.target.value as CourseInput["status"] })}><option>DRAFT</option><option>PUBLISHED</option><option>ARCHIVED</option></select></div>
        <div className="space-y-1.5"><Label htmlFor="c-color">Accent colour</Label><Input id="c-color" type="color" value={c.color} onChange={(e) => setC({ ...c, color: e.target.value })} className="h-9 rounded-xl p-1" /></div>
        <div className="flex items-center gap-6 pt-6">
          <label className="flex items-center gap-2 text-sm"><Switch checked={c.featured} onCheckedChange={(v) => setC({ ...c, featured: v })} aria-label="Featured" /> Featured</label>
        </div>
        <div className="space-y-1.5 md:col-span-3"><Label htmlFor="c-out">Outcomes (one per line)</Label><Textarea id="c-out" rows={4} value={outcomes} onChange={(e) => setOutcomes(e.target.value)} className="rounded-xl" /></div>
      </section>

      {c.id ? (
        <section className="space-y-3" aria-labelledby="curr">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="curr" className="font-heading text-xl font-bold">Curriculum</h2>
            <p className="text-xs text-muted-foreground">Drag the handles to reorder modules and lessons.</p>
            <form
              className="ml-auto flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                if (result(await addModule({ courseId: c.id as string, title: newModule }), "Module added")) setNewModule("");
              }}
            >
              <label htmlFor="new-mod" className="sr-only">New module title</label>
              <Input id="new-mod" value={newModule} onChange={(e) => setNewModule(e.target.value)} placeholder="New module title" className="h-9 rounded-xl" />
              <Button type="submit" size="sm" className="rounded-xl" disabled={newModule.trim().length < 2}><Plus /> Module</Button>
            </form>
          </div>
          <SortableList
            items={modules}
            className="space-y-3"
            onReorder={async (next) => {
              setModules(next);
              result(await reorderModules({ courseId: c.id as string, ids: next.map((m) => m.id) }), "Modules reordered");
            }}
            render={(m, handle) => (
              <div className="glass p-4">
                <div className="flex items-center gap-2">
                  {handle}
                  <p className="flex-1 font-semibold">{m.title}</p>
                  <Button size="icon-sm" variant="ghost" aria-label="Rename module" onClick={async () => { const t = window.prompt("Module title", m.title); if (t) result(await renameModule({ id: m.id, title: t }), "Renamed"); }}><Pencil /></Button>
                  <Button size="icon-sm" variant="ghost" aria-label="Delete module" onClick={async () => { if (window.confirm(`Delete module “${m.title}” and its lessons?`)) result(await deleteModule(m.id), "Module deleted"); }}><Trash2 /></Button>
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => setLesson({ moduleId: m.id, title: "", slug: "", type: "ARTICLE", refSlug: "", videoUrl: "", isPreview: false, durationMins: 12 })}><Plus /> Lesson</Button>
                </div>
                <SortableList
                  items={m.lessons}
                  className="mt-3 space-y-1 pl-6"
                  onReorder={async (next) => {
                    setModules((ms) => ms.map((x) => (x.id === m.id ? { ...x, lessons: next } : x)));
                    result(await reorderLessons({ moduleId: m.id, ids: next.map((l) => l.id) }), "Lessons reordered");
                  }}
                  render={(l, h) => (
                    <div className="flex items-center gap-2 rounded-xl border border-border px-2 py-1.5 text-sm">
                      {h}
                      <span className="rounded bg-surface-2 px-1.5 text-[10px]">{l.type}</span>
                      <span className="flex-1">{l.title}</span>
                      {l.isPreview ? <span className="text-[10px] text-cyan">PREVIEW</span> : null}
                      <span className="text-xs text-muted-foreground">{l.refSlug}</span>
                      <Button size="icon-xs" variant="ghost" aria-label="Edit lesson" onClick={() => setLesson({ ...l, moduleId: m.id })}><Pencil /></Button>
                      <Button size="icon-xs" variant="ghost" aria-label="Delete lesson" onClick={async () => { if (window.confirm(`Delete lesson “${l.title}”?`)) result(await deleteLesson(l.id), "Lesson deleted"); }}><Trash2 /></Button>
                    </div>
                  )}
                />
              </div>
            )}
          />
        </section>
      ) : (
        <p className="text-sm text-muted-foreground">Save the course to start adding modules and lessons.</p>
      )}

      <Dialog open={Boolean(lesson)} onOpenChange={(o) => !o && setLesson(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>{lesson?.id ? "Edit lesson" : "New lesson"}</DialogTitle></DialogHeader>
          {lesson ? (
            <div className="grid gap-3">
              <div className="space-y-1.5"><Label htmlFor="l-title">Title</Label><Input id="l-title" value={lesson.title} onChange={(e) => setLesson({ ...lesson, title: e.target.value, slug: lesson.id ? lesson.slug : slugify(e.target.value) })} className="rounded-xl" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label htmlFor="l-slug">Slug</Label><Input id="l-slug" value={lesson.slug} onChange={(e) => setLesson({ ...lesson, slug: slugify(e.target.value) })} className="rounded-xl font-mono text-xs" /></div>
                <div className="space-y-1.5"><Label htmlFor="l-type">Type</Label><select id="l-type" className={cn(selectCls, "w-full")} value={lesson.type} onChange={(e) => setLesson({ ...lesson, type: e.target.value as Lesson["type"], refSlug: "" })}><option>ARTICLE</option><option>PROBLEM</option><option>QUIZ</option><option>VIDEO</option></select></div>
              </div>
              {lesson.type === "VIDEO" ? (
                <div className="space-y-1.5"><Label htmlFor="l-video">Video URL</Label><Input id="l-video" value={lesson.videoUrl} onChange={(e) => setLesson({ ...lesson, videoUrl: e.target.value })} className="rounded-xl" /></div>
              ) : (
                <div className="space-y-1.5">
                  <Label htmlFor="l-ref">{lesson.type.toLowerCase()} slug</Label>
                  <Input id="l-ref" list="ref-options" value={lesson.refSlug} onChange={(e) => setLesson({ ...lesson, refSlug: e.target.value })} className="rounded-xl font-mono text-xs" />
                  <datalist id="ref-options">{(lesson.type === "ARTICLE" ? refs.articles : lesson.type === "PROBLEM" ? refs.problems : refs.quizzes).map((s) => <option key={s} value={s} />)}</datalist>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label htmlFor="l-dur">Duration (min)</Label><Input id="l-dur" type="number" value={lesson.durationMins} onChange={(e) => setLesson({ ...lesson, durationMins: Number(e.target.value) })} className="rounded-xl" /></div>
                <label className="flex items-center gap-2 pt-6 text-sm"><Switch checked={lesson.isPreview} onCheckedChange={(v) => setLesson({ ...lesson, isPreview: v })} aria-label="Free preview" /> Free preview</label>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button className="rounded-xl" onClick={async () => { if (lesson && result(await saveLesson(lesson), "Lesson saved")) setLesson(null); }}>Save lesson</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
