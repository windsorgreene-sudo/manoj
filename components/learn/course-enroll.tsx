"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle2, Loader2, Lock, PlayCircle, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { enrollInCourse, getCourseUserState, submitReview } from "@/lib/actions/learn";
import { cn } from "@/lib/utils";

type Lesson = { id: string; slug: string; title: string; type: "ARTICLE" | "VIDEO" | "PROBLEM" | "QUIZ"; durationMins: number; isPreview: boolean };
type Mod = { id: string; title: string; lessons: Lesson[] };

export function useCourseState(courseId: string) {
  return useQuery({ queryKey: ["course-state", courseId], queryFn: () => getCourseUserState(courseId) });
}

function ProgressRing({ pct, size = 56 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${pct}% complete`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--cv-surface-2)" strokeWidth="6" fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="url(#ring-grad)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (pct / 100) * c}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-[stroke-dashoffset] duration-700"
      />
      <defs>
        <linearGradient id="ring-grad">
          <stop offset="0" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <text x="50%" y="54%" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">
        {pct}%
      </text>
    </svg>
  );
}
export { ProgressRing };

export function EnrollCard({ courseId, slug, firstLesson }: { courseId: string; slug: string; firstLesson: string }) {
  const { data, isLoading } = useCourseState(courseId);
  const qc = useQueryClient();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const enroll = async () => {
    if (!data?.signedIn) return router.push(`/login?next=/courses/${slug}`);
    setBusy(true);
    const r = await enrollInCourse(courseId);
    setBusy(false);
    if (!r.ok) return toast.error(r.error);
    toast.success("You're enrolled! Let's start.");
    await qc.invalidateQueries({ queryKey: ["course-state", courseId] });
    router.push(`/courses/${slug}/learn/${firstLesson}`);
  };

  if (isLoading) return <div className="shimmer h-40 rounded-2xl" />;
  return (
    <div className="glass space-y-4 p-6">
      <p className="font-heading text-3xl font-bold">Free</p>
      {data?.enrolled ? (
        <>
          <div className="flex items-center gap-4">
            <ProgressRing pct={data.progressPct} />
            <div>
              <p className="font-semibold">{data.progressPct === 100 ? "Completed 🎓" : "Your progress"}</p>
              <p className="text-sm text-muted-foreground">{data.completed.length} lessons done</p>
            </div>
          </div>
          <Button asChild className="h-11 w-full rounded-xl">
            <Link href={`/courses/${slug}/learn/${firstLesson}`}>
              <PlayCircle /> {data.progressPct > 0 ? "Continue learning" : "Start course"}
            </Link>
          </Button>
        </>
      ) : (
        <Button onClick={enroll} disabled={busy} className="h-11 w-full rounded-xl">
          {busy ? <Loader2 className="animate-spin" /> : null} {data?.signedIn ? "Enroll now" : "Log in to enroll"}
        </Button>
      )}
    </div>
  );
}

export function Syllabus({ courseId, slug, modules }: { courseId: string; slug: string; modules: Mod[] }) {
  const { data } = useCourseState(courseId);
  const done = new Set(data?.completed ?? []);
  const canOpen = (l: Lesson) => l.isPreview || Boolean(data?.enrolled);
  return (
    <Accordion type="multiple" defaultValue={[modules[0]?.id]} className="glass px-5">
      {modules.map((m, mi) => (
        <AccordionItem key={m.id} value={m.id}>
          <AccordionTrigger className="text-base">
            <span>
              <span className="mr-2 font-mono text-xs text-muted-foreground">M{mi + 1}</span>
              {m.title}
              <span className="ml-2 text-xs font-normal text-muted-foreground">{m.lessons.length} lessons</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1">
              {m.lessons.map((l) => {
                const open = canOpen(l);
                const inner = (
                  <>
                    {done.has(l.id) ? <CheckCircle2 className="size-4 text-success" /> : open ? <PlayCircle className="size-4 text-cyan" /> : <Lock className="size-4 text-muted-foreground" />}
                    <span className="flex-1">{l.title}</span>
                    {l.isPreview ? <span className="rounded-md bg-cyan/15 px-1.5 py-0.5 text-[10px] font-semibold text-cyan">PREVIEW</span> : null}
                    <span className="text-xs text-muted-foreground">
                      {l.type === "PROBLEM" ? "Practice" : l.type === "QUIZ" ? "Quiz" : "Reading"} · {l.durationMins}m
                    </span>
                  </>
                );
                return (
                  <li key={l.id}>
                    {open ? (
                      <Link href={`/courses/${slug}/learn/${l.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-accent">
                        {inner}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground" aria-disabled>
                        {inner}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function ReviewForm({ courseId }: { courseId: string }) {
  const { data } = useCourseState(courseId);
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  if (!data?.enrolled) return null;
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const r = await submitReview({ courseId, rating, body });
    setBusy(false);
    if (r.ok) {
      toast.success("Thanks for your review!");
      setBody("");
      router.refresh();
    } else toast.error(r.error);
  };
  return (
    <form onSubmit={submit} className="glass space-y-3 p-5">
      <p className="font-semibold">{data.reviewed ? "Update your review" : "Rate this course"}</p>
      <div className="flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} stars`} onClick={() => setRating(n)}>
            <Star className={cn("size-6", n <= rating ? "fill-warning text-warning" : "text-muted-foreground")} />
          </button>
        ))}
      </div>
      <label htmlFor="review-body" className="sr-only">
        Review
      </label>
      <Textarea id="review-body" rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="What did you like? What could be better?" className="rounded-xl" />
      <Button type="submit" disabled={busy} className="rounded-xl">
        {busy ? <Loader2 className="animate-spin" /> : null} Submit review
      </Button>
    </form>
  );
}
