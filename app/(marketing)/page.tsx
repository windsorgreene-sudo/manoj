import { Hero } from "@/components/marketing/hero";
import { StoryExperience } from "@/components/marketing/story";
import { CourseCarousel } from "@/components/marketing/course-carousel";
import {
  FaqSection,
  FeaturesSection,
  LearningPathsSection,
  NewsletterCta,
  PricingSection,
  StatsSection,
  TechMarquee,
  TestimonialsSection,
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
          sameAs: ["https://github.com", "https://x.com", "https://linkedin.com"],
        }}
      />
      <StoryExperience hero={<Hero learners={formatNumber(stats.learners)} />} />
      <StatsSection stats={stats} />
      <TechMarquee />
      <FeaturesSection />
      <CourseCarousel courses={courses} />
      <LearningPathsSection />
      <TestimonialsSection />
      <PricingSection compact />
      <FaqSection />
      <NewsletterCta />
    </>
  );
}
