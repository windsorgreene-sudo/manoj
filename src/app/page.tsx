import Link from "next/link";
import { courses, lessonCount } from "@/content/courses";
import { HeroSearchButton } from "@/components/HeroSearchButton";
import { SITE } from "@/lib/site";

// Popular topics linked to specific lessons, so the homepage points straight
// at real content (like an established reference portal does).
const POPULAR_TOPICS = [
  { label: "Pointers in C", href: "/courses/c-programming/pointers-c" },
  { label: "Time Complexity (Big-O)", href: "/courses/data-structures/big-o" },
  { label: "Stack (LIFO)", href: "/courses/data-structures/stack" },
  { label: "SQL Joins", href: "/courses/dbms-sql/sql-joins" },
  { label: "Normalization", href: "/courses/dbms-sql/normalization" },
  { label: "Four Pillars of OOP", href: "/courses/oop-java/oop-concepts" },
  { label: "CPU Scheduling", href: "/courses/operating-systems/cpu-scheduling" },
  { label: "OSI Model", href: "/courses/computer-networks/osi-model" },
  { label: "SDLC", href: "/courses/software-engineering/sdlc" },
  { label: "Python Lists", href: "/courses/python-programming/lists-py" },
];

const PROGRAMMES = [
  { code: "BCA", subjects: ["C Programming", "Python", "Data Structures", "DBMS", "OOP Java", "Web Technology"] },
  { code: "B.Tech CSE/IT", subjects: ["C Programming", "Data Structures", "Operating Systems", "Computer Networks", "DBMS"] },
  { code: "MCA", subjects: ["OOP Java", "DBMS", "Operating Systems", "Software Engineering", "Data Structures"] },
];

export default function HomePage() {
  return (
    <>
      {/* Intro: calm, content-first, no decorative effects */}
      <section className="border-b border-border bg-surface-2">
        <div className="mx-auto max-w-[1100px] px-4 py-10 sm:py-12">
          <p className="text-sm font-medium text-primary">
            Study material for {SITE.universityShort} (IP University)
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl">
            Notes, tutorials and solved code for your IPU exams
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-muted">
            Free, exam-ready notes, code examples and MCQs for the computer science subjects in the
            BCA, B.Tech and MCA syllabus. Read a concept, run the code, and test yourself, all in
            one place.
          </p>
          <div className="mt-5 max-w-xl">
            <HeroSearchButton />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1100px] gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* Main column */}
        <div className="min-w-0">
          {/* Subject directory */}
          <section>
            <div className="mb-4 flex items-baseline justify-between border-b border-border pb-2">
              <h2 className="font-display text-xl font-bold text-text">Browse Subjects</h2>
              <Link href="/courses" className="text-sm font-medium text-primary hover:underline">
                All subjects
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
              {courses.map((c) => (
                <Link
                  key={c.slug}
                  href={`/courses/${c.slug}`}
                  className="group flex items-center gap-3 bg-surface p-4 transition-colors hover:bg-surface-2"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl"
                    style={{ backgroundColor: `${c.color}1a` }}
                  >
                    {c.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-text group-hover:text-primary">
                      {c.title}
                    </span>
                    <span className="text-xs text-text-faint">
                      {lessonCount(c)} lessons · {c.category}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* By programme */}
          <section className="mt-10">
            <div className="mb-4 border-b border-border pb-2">
              <h2 className="font-display text-xl font-bold text-text">By Programme</h2>
            </div>
            <div className="space-y-4">
              {PROGRAMMES.map((p) => (
                <div key={p.code} className="rounded-lg border border-border bg-surface p-4">
                  <h3 className="mb-2 font-semibold text-text">{p.code}</h3>
                  <div className="flex flex-wrap gap-2">
                    {p.subjects.map((s) => (
                      <span
                        key={s}
                        className="rounded border border-border bg-surface-2 px-2.5 py-1 text-[13px] text-text-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <section className="rounded-lg border border-border bg-surface p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
              Popular Topics
            </h2>
            <ul className="space-y-2">
              {POPULAR_TOPICS.map((t) => (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className="text-[14px] leading-snug text-text-muted hover:text-primary"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-border bg-surface p-4">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">
              Practice
            </h2>
            <p className="text-[13px] leading-relaxed text-text-muted">
              Run C, Python, Java and more in the browser with the code playground.
            </p>
            <Link
              href="/playground"
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              Open the playground
            </Link>
          </section>

          <section className="rounded-lg border border-border bg-surface p-4">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">
              Track your progress
            </h2>
            <p className="text-[13px] leading-relaxed text-text-muted">
              Mark lessons complete and see what you have finished on your dashboard.
            </p>
            <Link
              href="/student"
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              Go to dashboard
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}
