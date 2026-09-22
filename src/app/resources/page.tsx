import type { Metadata } from "next";
import Link from "next/link";
import { getArticlesByType } from "@/content";
import type { ContentType } from "@/content/types";
import { Breadcrumbs, BreadcrumbSchema } from "@/components/Breadcrumbs";
import { formatDate } from "@/lib/site";

export const metadata: Metadata = {
  title: "Study Resources",
  description:
    "Assignments, lab files, syllabus, question banks, MCQs, exam preparation and reference material for computer science students.",
  alternates: { canonical: "/resources" },
};

const GROUPS: { title: string; type: ContentType; href: string; blurb: string }[] = [
  { title: "Assignments", type: "assignment", href: "/type/assignment", blurb: "Programming and course assignments with problem statements." },
  { title: "Lab Programs", type: "lab", href: "/type/lab", blurb: "Practical lab exercises and solved programs." },
  { title: "Notes", type: "notes", href: "/type/notes", blurb: "Concise revision notes for key topics." },
  { title: "MCQs & Tests", type: "mcq", href: "/type/mcq", blurb: "Practice questions and self-assessment test series." },
  { title: "Syllabus", type: "syllabus", href: "/type/syllabus", blurb: "Unit-wise course syllabus and references." },
  { title: "Question Papers", type: "question-paper", href: "/type/question-paper", blurb: "Previous examination question papers." },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6">
      <BreadcrumbSchema items={[{ label: "Study Resources" }]} />
      <Breadcrumbs items={[{ label: "Study Resources" }]} />
      <header className="mt-4 border-b border-border pb-5">
        <h1 className="text-[26px] font-bold text-text sm:text-[30px]">Study Resources</h1>
        <p className="mt-2 max-w-3xl text-[15px] text-text-muted">
          Assignments, lab files, syllabus, question banks, MCQs and reference material — organised
          so students can find what they need quickly.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map((g) => {
          const items = getArticlesByType(g.type)
            .sort((a, b) => +new Date(b.updatedDate) - +new Date(a.updatedDate))
            .slice(0, 4);
          return (
            <section key={g.type} className="rounded-md border border-border bg-surface p-4">
              <div className="mb-1 flex items-baseline justify-between">
                <h2 className="text-base font-bold text-text">{g.title}</h2>
                <Link href={g.href} className="text-[13px] font-medium text-primary hover:underline">
                  View all
                </Link>
              </div>
              <p className="mb-3 text-[13px] text-text-muted">{g.blurb}</p>
              {items.length > 0 ? (
                <ul className="space-y-2 border-t border-border pt-3">
                  {items.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/${a.category}/${a.slug}`}
                        className="text-[14px] font-medium leading-snug text-text hover:text-primary"
                      >
                        {a.title}
                      </Link>
                      <div className="text-xs text-text-faint">Updated {formatDate(a.updatedDate)}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="border-t border-border pt-3 text-[13px] text-text-faint">
                  Coming soon.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
