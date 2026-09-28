import Link from "next/link";
import { BookOpen, Clock, Crown, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CourseCardData } from "@/lib/queries/courses";
import { cn, formatInr } from "@/lib/utils";

const LEVEL_LABEL = { BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced" } as const;

export function CourseCard({ course, className }: { course: CourseCardData; className?: string }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn("glass gradient-border hover-glow group flex h-full flex-col overflow-hidden rounded-2xl focus-visible:ring-2 focus-visible:ring-cyan", className)}
    >
      <div className="relative h-36 overflow-hidden" style={{ background: `linear-gradient(135deg, ${course.color}55, ${course.color}10 60%, transparent)` }}>
        <div aria-hidden className="grid-bg absolute inset-0 opacity-40" />
        <div aria-hidden className="absolute -right-6 -bottom-10 size-40 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125" style={{ background: `${course.color}66` }} />
        <div className="absolute left-5 top-5 flex gap-2">
          <Badge variant="secondary" className="rounded-lg bg-black/30 text-white backdrop-blur">
            {course.topic}
          </Badge>
          {course.isPro ? (
            <Badge className="rounded-lg bg-warning text-black">
              <Crown className="size-3" /> Pro
            </Badge>
          ) : (
            <Badge className="rounded-lg bg-success text-black">Free</Badge>
          )}
        </div>
        <p className="absolute bottom-4 left-5 font-heading text-2xl font-bold text-white drop-shadow">{course.title}</p>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="line-clamp-2 text-sm text-muted-foreground">{course.subtitle}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="size-3.5 fill-warning text-warning" /> {course.rating ? course.rating.toFixed(1) : "New"} ({course.reviews})
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="size-3.5" /> {course.lessons} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> {Math.round(course.durationMins / 60)}h
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" /> {course.students}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
          <span className="text-muted-foreground">{LEVEL_LABEL[course.level]}</span>
          <span className="font-semibold">{course.isPro ? formatInr(course.priceInr) : "Free"}</span>
        </div>
      </div>
    </Link>
  );
}
