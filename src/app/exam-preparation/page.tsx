import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/content";
import type { ContentType } from "@/content/types";
import { Breadcrumbs, BreadcrumbSchema } from "@/components/Breadcrumbs";
import { ArticleListItem } from "@/components/ArticleListItem";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Exam Preparation",
  description:
    "Exam preparation material — MCQs, test series, question papers, syllabus and revision notes for computer science examinations.",
  alternates: { canonical: "/exam-preparation" },
};

const EXAM_TYPES: ContentType[] = ["mcq", "test", "question-paper", "syllabus", "notes"];

export default function ExamPreparationPage() {
  const items = articles
    .filter((a) => EXAM_TYPES.includes(a.contentType))
    .sort((a, b) => +new Date(b.updatedDate) - +new Date(a.updatedDate));

  return (
    <div className="mx-auto max-w-[900px] px-4 py-6">
      <BreadcrumbSchema items={[{ label: "Exam Preparation" }]} />
      <Breadcrumbs items={[{ label: "Exam Preparation" }]} />
      <header className="mt-4 border-b border-border pb-5">
        <h1 className="text-[26px] font-bold text-text sm:text-[30px]">Exam Preparation</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-text-muted">
          MCQs, test series, question papers, syllabus and revision notes to prepare for internal
          and external examinations.
        </p>
      </header>

      <div className="mt-5 flex flex-wrap gap-2">
        {["/type/mcq", "/type/test", "/type/question-paper", "/type/syllabus"].map((h) => (
          <Link
            key={h}
            href={h}
            className="rounded-md border border-border-strong px-3 py-1.5 text-sm font-medium text-text hover:border-primary"
          >
            {h.replace("/type/", "").replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <SectionHeading title="All Exam Material" />
        {items.map((a) => (
          <ArticleListItem key={a.slug} article={a} />
        ))}
      </div>
    </div>
  );
}
