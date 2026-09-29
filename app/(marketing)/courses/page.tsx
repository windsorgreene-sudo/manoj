import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CatalogFilters } from "@/components/marketing/catalog-filters";
import { CourseCard } from "@/components/marketing/course-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { getCatalog, getCatalogFacets, type CatalogFilters as Filters } from "@/lib/queries/courses";

export const metadata: Metadata = {
  title: "Courses",
  description: "Structured courses in DSA, Python, JavaScript, Web Development, DBMS and Operating Systems, all completely free.",
  alternates: { canonical: "/courses" },
};

export default async function CoursesPage({ searchParams }: { searchParams: Promise<Filters> }) {
  const filters = await searchParams;
  const [courses, facets] = await Promise.all([getCatalog(filters), getCatalogFacets()]);
  return (
    <div className="container-cv py-12 md:py-16">
      <header className="mb-8 max-w-2xl">
        <h1 className="mt-3 font-heading text-4xl font-bold md:text-5xl">Find your next course</h1>
        <p className="mt-3 text-muted-foreground">Every course mixes tutorials, runnable examples, practice problems and quizzes.</p>
      </header>
      <Suspense fallback={<div className="shimmer h-[72px] rounded-2xl" />}>
        <CatalogFilters topics={facets.topics} languages={facets.languages} />
      </Suspense>
      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {courses.length} {courses.length === 1 ? "course" : "courses"}
      </p>
      {courses.length ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      ) : (
        <EmptyState
          className="mt-6"
          title="No courses match those filters"
          description="Try removing a filter or searching for something broader."
          action={
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/courses">Reset filters</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
