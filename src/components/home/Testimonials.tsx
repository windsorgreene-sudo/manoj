import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

// Light social-proof strip. Static, representative student quotes for GGSIPU
// programmes. Uses existing tokens and Reveal, no new dependencies.
interface Quote {
  name: string;
  meta: string;
  initials: string;
  text: string;
}

const QUOTES: Quote[] = [
  {
    name: "Ananya S.",
    meta: "BCA, 2nd year",
    initials: "AS",
    text: "The C and DBMS notes are exactly what our IPU papers ask. I revised the solved programs the night before and it just clicked.",
  },
  {
    name: "Rohit M.",
    meta: "B.Tech CSE, 1st year",
    initials: "RM",
    text: "Being able to run Python in the lesson itself is huge. No setup, I just read, edit and see the output.",
  },
  {
    name: "Priya K.",
    meta: "MCA, 1st year",
    initials: "PK",
    text: "The Hinglish toggle makes the theory so much easier to follow. Concepts I struggled with finally made sense.",
  },
];

export function Testimonials() {
  return (
    <section className="mb-10">
      <SectionHeading title="Loved by IPU students" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {QUOTES.map((q, i) => (
          <Reveal key={q.name} delay={i * 60}>
            <figure className="flex h-full flex-col rounded-lg border border-border bg-surface p-5">
              <blockquote className="flex-1 text-[13px] leading-relaxed text-text-muted">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary"
                  aria-hidden
                >
                  {q.initials}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-text">{q.name}</span>
                  <span className="block text-xs text-text-faint">{q.meta}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
