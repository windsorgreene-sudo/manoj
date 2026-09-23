"use client";

import { useMemo, useState } from "react";
import type { Course } from "@/content/courses";
import { CourseCard } from "@/components/course/CourseCard";
import { Reveal } from "@/components/Reveal";

const DIFFICULTIES = ["all", "beginner", "intermediate", "advanced"] as const;

export function CourseCatalog({ courses, categories }: { courses: Course[]; categories: string[] }) {
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>("all");
  const [query, setQuery] = useState("");

  const cats = ["All", ...categories];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      if (category !== "All" && c.category !== category) return false;
      if (difficulty !== "all" && c.difficulty !== difficulty) return false;
      if (q && !(`${c.title} ${c.description} ${c.tags.join(" ")}`.toLowerCase().includes(q)))
        return false;
      return true;
    });
  }, [courses, category, difficulty, query]);

  const chip =
    "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors border";

  return (
    <div>
      {/* Search */}
      <div className="mb-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses..."
          className="w-full max-w-md rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
        />
      </div>

      {/* Category chips */}
      <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`${chip} shrink-0 ${
              category === c
                ? "border-primary bg-primary text-primary-contrast"
                : "border-border bg-surface text-text-muted hover:border-primary hover:text-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Difficulty chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`${chip} capitalize ${
              difficulty === d
                ? "border-accent bg-accent-soft text-accent"
                : "border-border bg-surface text-text-faint hover:border-accent hover:text-accent"
            }`}
          >
            {d === "all" ? "All levels" : d}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-strong bg-surface p-10 text-center text-sm text-text-muted">
          No courses match your filters. Try clearing them.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <Reveal key={c.slug} delay={i * 40}>
              <CourseCard course={c} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
