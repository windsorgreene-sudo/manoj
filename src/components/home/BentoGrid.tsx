import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ArrowRight } from "@/components/icons";

// Restrained "bento" feature grid. Uses the existing design tokens, Reveal
// (IntersectionObserver) and hover-lift so it stays consistent with the rest
// of the site and adds no new dependencies. Wider tiles use sm:col-span-2.
interface Tile {
  emoji: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  span?: string;
}

const TILES: Tile[] = [
  {
    emoji: "▶",
    title: "Live code editor",
    body: "Run Python and JavaScript right inside the lesson, no setup needed. Read, edit and see the output instantly.",
    href: "/playground",
    cta: "Open playground",
    span: "sm:col-span-2",
  },
  {
    emoji: "🌐",
    title: "English + Hinglish",
    body: "Read every lesson in the language you think in. Switch anytime from the header.",
    href: "/courses",
    cta: "Browse courses",
  },
  {
    emoji: "🎯",
    title: "Built for the IPU syllabus",
    body: "Notes, solved programs and MCQs mapped to what GGSIPU actually asks.",
    href: "/courses",
    cta: "See subjects",
  },
  {
    emoji: "📈",
    title: "Track your progress",
    body: "Earn XP as you finish lessons and pick up right where you left off.",
    href: "/student",
    cta: "Your dashboard",
  },
  {
    emoji: "📋",
    title: "Solved programs",
    body: "The exact programs that come up in exams, worked through step by step with runnable code.",
    href: "/courses/c-programming",
    cta: "Start with C",
    span: "sm:col-span-2",
  },
];

export function BentoGrid() {
  return (
    <section className="mb-10">
      <SectionHeading title="Why CodeVidya" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TILES.map((t, i) => (
          <Reveal key={t.title} delay={i * 60} className={t.span ?? ""}>
            <Link
              href={t.href}
              className="hover-lift group flex h-full flex-col rounded-lg border border-border bg-surface p-5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-base text-primary">
                {t.emoji}
              </span>
              <h3 className="mt-3 font-display text-sm font-semibold text-text group-hover:text-primary">
                {t.title}
              </h3>
              <p className="mt-1 flex-1 text-[13px] leading-relaxed text-text-muted">{t.body}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                {t.cta}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
