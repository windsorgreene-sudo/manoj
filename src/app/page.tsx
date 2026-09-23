import Link from "next/link";
import { courses, totalLessons } from "@/content/courses";
import { HomeSearch } from "@/components/HomeSearch";
import { buildSearchIndex } from "@/content";
import { CourseCard } from "@/components/course/CourseCard";
import { FloatingCodeCard } from "@/components/home/FloatingCodeCard";
import { Roadmap } from "@/components/home/Roadmap";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Marquee } from "@/components/Marquee";
import { ArrowRight } from "@/components/icons";

const STATS: { label: string; value: number | string; suffix?: string }[] = [
  { label: "Courses", value: courses.length, suffix: "+" },
  { label: "Lessons", value: totalLessons(), suffix: "+" },
  { label: "Learners", value: 50, suffix: "K+" },
  { label: "Avg. rating", value: "4.9/5" },
];

const HOW_IT_WORKS = [
  { step: 1, title: "Choose a course", text: "Pick a track that fits your goal, from HTML to system design." },
  { step: 2, title: "Read animated lessons", text: "Clear explanations with real, runnable code examples." },
  { step: 3, title: "Practice in the editor", text: "Try the code live in the built-in playground." },
  { step: 4, title: "Take a quiz", text: "Check your understanding with a quick quiz." },
  { step: 5, title: "Track your progress", text: "Earn XP and badges as you complete lessons." },
];

const TESTIMONIALS = [
  { name: "Priya S.", quote: "The live editor made concepts finally click for me.", stars: 5 },
  { name: "Rahul M.", quote: "Best free resource for DSA interview prep, hands down.", stars: 5 },
  { name: "Ananya K.", quote: "Clean, fast and the quizzes keep me honest.", stars: 5 },
  { name: "Dev P.", quote: "Went from zero to building React apps in weeks.", stars: 5 },
  { name: "Sara J.", quote: "Love the progress tracking and badges.", stars: 4 },
];

export default function HomePage() {
  const index = buildSearchIndex();
  const featured = courses.slice(0, 6);

  return (
    <>
      {/* ---------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-border">
        {/* animated gradient mesh */}
        <div className="aurora pointer-events-none absolute inset-0 opacity-80" aria-hidden />
        <div
          className="cv-blob pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
          aria-hidden
        />
        <div
          className="cv-blob pointer-events-none absolute -bottom-28 -left-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
          style={{ animationDelay: "-6s" }}
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-[1280px] items-center gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="animate-fade-up mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-surface/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />
              Free, hands-on coding courses
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-text sm:text-6xl">
              <span className="animate-fade-up inline-block">Learn.</span>{" "}
              <span className="animate-fade-up inline-block text-gradient-animated" style={{ animationDelay: "80ms" }}>
                Code.
              </span>{" "}
              <span className="animate-fade-up inline-block" style={{ animationDelay: "160ms" }}>
                Build.
              </span>
            </h1>
            <p
              className="animate-fade-up mt-5 max-w-xl text-base text-text-muted sm:text-lg"
              style={{ animationDelay: "220ms" }}
            >
              Animated tutorials, a live code editor, and expert-crafted courses for developers at
              every level.
            </p>
            <div
              className="animate-fade-up mt-7 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "280ms" }}
            >
              <Link
                href="/courses"
                className="sheen rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-contrast shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[var(--shadow-primary)]"
              >
                Start Free
              </Link>
              <Link
                href="/playground"
                className="rounded-xl border border-border-strong px-6 py-3 text-sm font-semibold text-text transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                Open Playground
              </Link>
            </div>
            <div
              className="animate-fade-up mt-6 max-w-md"
              style={{ animationDelay: "340ms" }}
            >
              <HomeSearch index={index} />
            </div>
          </div>

          {/* Floating code card */}
          <div className="animate-fade-in hidden justify-self-center lg:block" style={{ animationDelay: "260ms" }}>
            <FloatingCodeCard />
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-border/70 bg-surface/50 backdrop-blur">
          <div className="mx-auto grid max-w-[1280px] grid-cols-2 divide-x divide-border/70 px-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="px-3 py-5 text-center">
                <AnimatedCounter
                  value={s.value}
                  suffix={s.suffix}
                  className="font-display text-2xl font-extrabold text-primary sm:text-3xl"
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

      <div className="mx-auto max-w-[1280px] px-4 py-12">
        {/* Featured courses */}
        <section className="mb-14">
          <SectionHeading title="Start with the Basics" href="/courses" linkLabel="All courses" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60}>
                <CourseCard course={c} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Learning paths */}
        <section className="mb-14">
          <SectionHeading title="Follow a Learning Path" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Roadmap
              title="Web Development"
              nodes={[
                { label: "HTML", icon: "🌐", href: "/courses/html-fundamentals" },
                { label: "CSS", icon: "🎨", href: "/courses/css-mastery" },
                { label: "JavaScript", icon: "⚡", href: "/courses/javascript-core" },
                { label: "React", icon: "⚛️", href: "/courses/react-complete" },
                { label: "Node.js", icon: "🟢", href: "/courses/nodejs-backend" },
              ]}
            />
            <Roadmap
              title="Computer Science"
              nodes={[
                { label: "Python", icon: "🐍", href: "/courses/python-for-beginners" },
                { label: "DSA", icon: "🧩", href: "/courses/dsa" },
                { label: "SQL", icon: "🗃️", href: "/courses/sql-databases" },
                { label: "System Design", icon: "🏗️", href: "/courses/system-design" },
              ]}
            />
          </div>
        </section>

        {/* How it works */}
        <section className="mb-14">
          <SectionHeading title="How It Works" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {HOW_IT_WORKS.map((s, i) => (
              <Reveal key={s.step} delay={i * 60}>
                <div className="hover-lift h-full rounded-2xl border border-border bg-surface p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-contrast shadow-[var(--shadow-sm)]">
                    {s.step}
                  </span>
                  <h3 className="mt-3 font-display font-bold text-text">{s.title}</h3>
                  <p className="mt-1 text-sm text-text-muted">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Testimonials marquee */}
        <section className="mb-4">
          <SectionHeading title="Loved by Learners" />
          <div className="group relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent" />
            <div className="marquee gap-4" style={{ animationDuration: "36s" }}>
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <figure
                  key={i}
                  className="w-72 shrink-0 rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-xs)]"
                >
                  <div className="mb-2 text-warn" aria-label={`${t.stars} out of 5`}>
                    {"★".repeat(t.stars)}
                    <span className="text-text-faint">{"★".repeat(5 - t.stars)}</span>
                  </div>
                  <blockquote className="text-sm text-text">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-3 text-xs font-semibold text-text-muted">
                    {t.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <Reveal
          as="section"
          className="mt-10 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary to-accent p-8 text-center shadow-[var(--shadow-md)] sm:p-12"
        >
          <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
            Ready to start building?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-white/90">
            Jump into your first lesson and write real code in minutes. It is completely free.
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Browse Courses <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </>
  );
}
