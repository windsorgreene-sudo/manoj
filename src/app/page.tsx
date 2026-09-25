import Link from "next/link";
import { courses, totalLessons } from "@/content/courses";
import { HeroSearchButton } from "@/components/HeroSearchButton";
import { CourseCard } from "@/components/course/CourseCard";
import { FloatingCodeCard } from "@/components/home/FloatingCodeCard";
import { Roadmap } from "@/components/home/Roadmap";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Marquee } from "@/components/Marquee";
import { BentoGrid } from "@/components/home/BentoGrid";
import { Testimonials } from "@/components/home/Testimonials";
import { Faq } from "@/components/home/Faq";
import { ArrowRight } from "@/components/icons";

const STATS: { label: string; value: number | string; suffix?: string }[] = [
  { label: "Subjects", value: courses.length, suffix: "" },
  { label: "Lessons", value: totalLessons(), suffix: "+" },
  { label: "Programmes", value: 4, suffix: "" },
  { label: "Always free", value: 100, suffix: "%" },
];

const HOW_IT_WORKS = [
  { step: 1, title: "Choose a course", text: "Pick a track that fits your goal, from HTML to system design." },
  { step: 2, title: "Read animated lessons", text: "Clear explanations with real, runnable code examples." },
  { step: 3, title: "Practice in the editor", text: "Try the code live in the built-in playground." },
  { step: 4, title: "Take a quiz", text: "Check your understanding with a quick quiz." },
  { step: 5, title: "Track your progress", text: "Earn XP and badges as you complete lessons." },
];

export default function HomePage() {
  const featured = courses.slice(0, 6);

  return (
    <>
      {/* ---------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-border">
        {/* subtle gradient wash */}
        <div className="aurora pointer-events-none absolute inset-0 opacity-40" aria-hidden />

        <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-12 sm:py-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="animate-fade-up mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-surface/70 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />
              Free study material for GGSIPU students
            </p>
            <h1 className="animate-fade-up font-display text-3xl font-bold leading-[1.12] tracking-tight text-text sm:text-4xl">
              Ace your IPU exams with clear notes and solved code
            </h1>
            <p
              className="animate-fade-up mt-4 max-w-xl text-base text-text-muted"
              style={{ animationDelay: "120ms" }}
            >
              Exam-ready notes, tutorials, solved programs and MCQs for BCA, B.Tech and MCA computer
              science subjects, plus a live code editor to practise as you learn.
            </p>
            <div
              className="animate-fade-up mt-6 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "180ms" }}
            >
              <Link
                href="/courses"
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-contrast transition-all hover:bg-primary-hover"
              >
                Start Free
              </Link>
              <Link
                href="/playground"
                className="rounded-lg border border-border-strong px-5 py-2.5 text-sm font-semibold text-text transition-all hover:border-primary hover:text-primary"
              >
                Open Playground
              </Link>
            </div>
            <div
              className="animate-fade-up mt-5 max-w-md"
              style={{ animationDelay: "240ms" }}
            >
              <HeroSearchButton />
            </div>
          </div>

          {/* Floating code card */}
          <div className="animate-fade-in hidden justify-self-center lg:block" style={{ animationDelay: "220ms" }}>
            <FloatingCodeCard />
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-border/70 bg-surface/50 backdrop-blur">
          <div className="mx-auto grid max-w-[1200px] grid-cols-2 divide-x divide-border/70 px-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="px-3 py-4 text-center">
                <AnimatedCounter
                  value={s.value}
                  suffix={s.suffix}
                  className="font-display text-xl font-bold text-primary sm:text-2xl"
                />
                <div className="mt-0.5 text-xs text-text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course topic marquee */}
      <section className="border-b border-border bg-bg py-3">
        <Marquee
          items={courses.map((c) => ({ label: `${c.icon} ${c.title}`, href: `/courses/${c.slug}`, slug: c.slug }))}
        />
      </section>

      <div className="mx-auto max-w-[1200px] px-4 py-10">
        {/* Featured courses */}
        <section className="mb-10">
          <SectionHeading title="Start with the Basics" href="/courses" linkLabel="All courses" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60}>
                <CourseCard course={c} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Why CodeVidya — feature bento */}
        <BentoGrid />

        {/* Learning paths */}
        <section className="mb-10">
          <SectionHeading title="Follow a Learning Path" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Roadmap
              title="Programming Path"
              nodes={[
                { label: "C", icon: "💻", href: "/courses/c-programming" },
                { label: "Python", icon: "🐍", href: "/courses/python-programming" },
                { label: "OOP Java", icon: "☕", href: "/courses/oop-java" },
                { label: "Web Tech", icon: "🕸️", href: "/courses/web-technology" },
              ]}
            />
            <Roadmap
              title="Core CS Path"
              nodes={[
                { label: "Data Structures", icon: "🧩", href: "/courses/data-structures" },
                { label: "DBMS", icon: "🗃️", href: "/courses/dbms-sql" },
                { label: "OS", icon: "🖥️", href: "/courses/operating-systems" },
                { label: "Networks", icon: "🌐", href: "/courses/computer-networks" },
              ]}
            />
          </div>
        </section>

        {/* How it works */}
        <section className="mb-10">
          <SectionHeading title="How It Works" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {HOW_IT_WORKS.map((s, i) => (
              <Reveal key={s.step} delay={i * 60}>
                <div className="hover-lift group h-full rounded-lg border border-border bg-surface p-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                    {s.step}
                  </span>
                  <h3 className="mt-2.5 font-display text-sm font-semibold text-text">{s.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-text-muted">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* FAQ */}
        <Faq />

        {/* Final CTA */}
        <Reveal
          as="section"
          className="mt-10 flex flex-col items-start justify-between gap-4 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center"
        >
          <div>
            <h2 className="font-display text-lg font-semibold text-text">
              Ready to start studying?
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Pick a subject, read the notes and practise the code. Free forever.
            </p>
          </div>
          <Link
            href="/courses"
            className="group inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-contrast transition-all hover:bg-primary-hover"
          >
            Browse subjects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </>
  );
}
