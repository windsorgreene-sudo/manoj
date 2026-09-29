import { Hero } from "@/components/marketing/hero";
import { StoryExperience } from "@/components/marketing/story";
import { CourseCarousel } from "@/components/marketing/course-carousel";
import {
  FaqSection,
  FeaturesSection,
  LearningPathsSection,
  NewsletterCta,
  FreeSection,
  StatsSection,
} from "@/components/marketing/sections";
import { getFeaturedCourses, getPlatformStats } from "@/lib/queries/courses";
import { JsonLd } from "@/components/seo/json-ld";
import { appUrl, formatNumber } from "@/lib/utils";

export const revalidate = 600;

export default async function HomePage() {
  const [courses, stats] = await Promise.all([getFeaturedCourses(), getPlatformStats()]);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "CodeVerse",
          url: appUrl(),
          logo: `${appUrl()}/icon.svg`,
        }}
      />
      <StoryExperience hero={<Hero learners={formatNumber(stats.learners)} />} />
      <StatsSection stats={stats} />
      <FeaturesSection />
      <CourseCarousel courses={courses} />
      <LearningPathsSection />
      <FreeSection />
      <FaqSection />
      <NewsletterCta />
    </>
  );
}
