import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByType, CONTENT_TYPE_LABELS } from "@/content";
import type { ContentType } from "@/content/types";
import { Breadcrumbs, BreadcrumbSchema } from "@/components/Breadcrumbs";
import { ArticleListItem } from "@/components/ArticleListItem";

const TYPES: ContentType[] = [
  "tutorial",
  "article",
  "assignment",
  "lab",
  "notes",
  "mcq",
  "test",
  "question-paper",
  "syllabus",
  "resource",
];

const PLURAL: Partial<Record<ContentType, string>> = {
  tutorial: "Tutorials",
  article: "Articles",
  assignment: "Assignments",
  lab: "Lab Programs",
  notes: "Notes",
  mcq: "MCQs & Tests",
  test: "Tests",
  "question-paper": "Question Papers",
  syllabus: "Syllabus",
  resource: "Resources",
};

const DESCRIPTIONS: Partial<Record<ContentType, string>> = {
  assignment: "Programming and course assignments with problem statements across subjects.",
  lab: "Practical lab programs and exercises for computer science coursework.",
  notes: "Concise study notes covering key topics for revision and exams.",
  mcq: "Multiple-choice questions and test series for practice and self-assessment.",
  tutorial: "Step-by-step tutorials explaining concepts with examples.",
};

export function generateStaticParams() {
  return TYPES.map((t) => ({ type: t }));
}

type Params = Promise<{ type: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { type } = await params;
  const label = PLURAL[type as ContentType];
  if (!label) return {};
  return {
    title: label,
    description: DESCRIPTIONS[type as ContentType] ?? `${label} across all subjects.`,
    alternates: { canonical: `/type/${type}` },
  };
}

export default async function TypePage({ params }: { params: Params }) {
  const { type } = await params;
  if (!TYPES.includes(type as ContentType)) notFound();
  const label = PLURAL[type as ContentType] ?? CONTENT_TYPE_LABELS[type as ContentType];
  const items = getArticlesByType(type).sort(
    (a, b) => +new Date(b.updatedDate) - +new Date(a.updatedDate),
  );

  return (
    <div className="mx-auto max-w-[900px] px-4 py-6">
      <BreadcrumbSchema items={[{ label }]} />
      <Breadcrumbs items={[{ label }]} />
      <header className="mt-4 border-b border-border pb-5">
        <h1 className="text-[26px] font-bold text-text sm:text-[30px]">{label}</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-text-muted">
          {DESCRIPTIONS[type as ContentType] ?? `Browse all ${label.toLowerCase()} on CodeVidya.`}
        </p>
      </header>
      <div className="mt-4">
        {items.length === 0 ? (
          <p className="text-sm text-text-muted">No items yet.</p>
        ) : (
          items.map((a) => <ArticleListItem key={a.slug} article={a} />)
        )}
      </div>
    </div>
  );
}
