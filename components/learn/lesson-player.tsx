"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setLessonComplete } from "@/lib/actions/learn";
import { useCelebrate } from "@/components/motion/celebration-layer";
import { cn } from "@/lib/utils";

type Mod = { id: string; title: string; lessons: { id: string; slug: string; title: string }[] };

export function LessonSidebar({ courseSlug, courseTitle, modules, current, completed }: { courseSlug: string; courseTitle: string; modules: Mod[]; current: string; completed: string[] }) {
  const done = new Set(completed);
  const total = modules.reduce((t, m) => t + m.lessons.length, 0);
  const pct = Math.round((completed.length / Math.max(1, total)) * 100);
  return (
    <aside aria-label="Course contents" className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto" data-lenis-prevent>
      <Link href={`/courses/${courseSlug}`} className="font-semibold hover:underline">
        {courseTitle}
      </Link>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Course progress">
        <div className="h-full bg-gradient-to-r from-brand to-cyan transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{pct}% complete</p>
      <ol className="mt-4 space-y-4">
        {modules.map((m) => (
          <li key={m.id}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{m.title}</p>
            <ul className="space-y-0.5">
              {m.lessons.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/courses/${courseSlug}/learn/${l.slug}`}
                    aria-current={l.slug === current ? "page" : undefined}
                    className={cn("flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm", l.slug === current ? "bg-brand/15 font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground")}
                  >
                    {done.has(l.id) ? <CheckCircle2 className="size-4 shrink-0 text-success" /> : <Circle className="size-4 shrink-0" />}
                    <span className="line-clamp-1">{l.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </aside>
  );
}

export function MarkComplete({ lessonId, initial }: { lessonId: string; initial: boolean }) {
  const [done, setDone] = useState(initial);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const celebrate = useCelebrate();
  const toggle = async () => {
    setBusy(true);
    const r = await setLessonComplete({ lessonId, completed: !done });
    setBusy(false);
    if (!r.ok) return toast.error(r.error);
    setDone(!done);
    if (r.data.justCompleted) {
      celebrate({ accepted: true, xp: r.data.xp?.amount, leveledUp: r.data.xp?.leveledUp, level: r.data.xp?.level, badges: r.data.xp?.newBadges });
      toast.success("Course completed! Your certificate is ready");
    } else if (!done) toast.success(`Lesson complete · ${r.data.pct}% of course`);
    router.refresh();
  };
  return (
    <Button variant={done ? "secondary" : "default"} size="sm" className="rounded-xl" onClick={toggle} disabled={busy}>
      {busy ? <Loader2 className="animate-spin" /> : done ? <CheckCircle2 className="text-success" /> : <Circle />} {done ? "Completed" : "Mark as complete"}
    </Button>
  );
}
