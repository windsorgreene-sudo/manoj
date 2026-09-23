import type { Metadata } from "next";
import { courses, CATEGORIES } from "@/content/courses";
import { Breadcrumbs, BreadcrumbSchema } from "@/components/Breadcrumbs";
import { CourseCatalog } from "./CourseCatalog";

export const metadata: Metadata = {
  title: "All Courses",
  description:
    "Browse EduLearn courses: HTML, CSS, JavaScript, Python, React, Data Structures, SQL, Git, Node.js and System Design.",
  alternates: { canonical: "/courses" },
};

export default function CoursesPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8">
      <BreadcrumbSchema items={[{ label: "Courses" }]} />
      <Breadcrumbs items={[{ label: "Courses" }]} />
      <header className="animate-fade-up mt-4 mb-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
          Explore Courses
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-text-muted">
          Structured, hands-on courses with live code and quizzes. Pick a topic and start learning
          for free.
        </p>
      </header>
      <CourseCatalog courses={courses} categories={CATEGORIES} />
    </div>
  );
}
