import Link from "next/link";
import { Bot, Braces, ChartSpline, Check, Flame, Map, Medal, Sparkles, Trophy, Wand2 } from "lucide-react";
import { CountUp } from "@/components/motion/count-up";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Reveal } from "@/components/motion/reveal";

export function StatsSection({ stats }: { stats: { learners: number; problems: number; articles: number; submissions: number } }) {
  const items = [
    { label: "Learners", value: stats.learners, suffix: "" },
    { label: "Tutorials", value: stats.articles, suffix: "" },
    { label: "Practice problems", value: stats.problems, suffix: "" },
    { label: "Code runs judged", value: stats.submissions, suffix: "" },
  ];
  return (
    <section className="container-cv relative z-10 py-16" aria-label="Platform statistics">
      <div className="glass grid grid-cols-2 gap-6 p-8 md:grid-cols-4">
        {items.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-heading text-3xl font-bold md:text-5xl">
              <span>
                <CountUp value={s.value} suffix={s.suffix} />
              </span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const FEATURES = [
  { Icon: Braces, title: "Code in the browser", href: "/playground", body: "Write and run C, C++, Java, Python, JavaScript or Go. Your code is saved as you type, and submissions are checked against hidden tests." },
  { Icon: Bot, title: "A tutor that gives hints", href: "/tutorials", body: "Stuck? Ask for a nudge first. It only shows a full answer if you ask for one. Works in English and Hinglish." },
  { Icon: Trophy, title: "Weekly contests", href: "/contests", body: "Timed rounds with a live leaderboard and a rating that goes up or down with every contest." },
  { Icon: Wand2, title: "See algorithms move", href: "/visualizers", body: "Step through sorting, binary search, BFS, DFS and Dijkstra one line at a time." },
  { Icon: Flame, title: "Build a habit", href: "/dashboard", body: "Daily streaks, XP and badges. Miss a day and a streak freeze has your back." },
  { Icon: ChartSpline, title: "Know where you stand", href: "/dashboard/stats", body: "Topics you are strong in, topics to revisit, and a heatmap of everything you solved." },
];

export function FeaturesSection() {
  return (
    <section className="container-cv relative z-10 py-24" id="features">
      <SectionHeading title="What you can do here" subtitle="Read a topic, try it in the editor, then solve problems on it. All in one place." />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.06}>
            <Link href={f.href} className="glass gradient-border hover-glow group flex h-full flex-col p-6">
              <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-brand/15 text-brand-soft">
                <f.Icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              <span className="mt-4 text-sm font-medium text-brand-soft group-hover:underline">Try it</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const PATHS = [
  { slug: "dsa", title: "DSA Interview Prep", body: "From Big-O to graphs and DP, with the Top Interview 30 sheet.", weeks: 12, Icon: Map },
  { slug: "web-development", title: "Full-Stack Web Developer", body: "HTML, CSS, JavaScript, HTTP and REST, ship real apps.", weeks: 10, Icon: Sparkles },
  { slug: "ai-ml", title: "AI / ML Foundations", body: "Python, data handling and algorithmic thinking for ML.", weeks: 8, Icon: Medal },
];

export function LearningPathsSection() {
  return (
    <section className="container-cv relative z-10 py-24">
      <SectionHeading title="Not sure where to start?" subtitle="Pick a roadmap. Every step links to a tutorial or a problem." />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {PATHS.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08}>
            <Link href={`/roadmaps/${p.slug}`} className="glass gradient-border hover-glow group flex h-full flex-col p-6">
              <p.Icon className="size-8 text-cyan transition-transform group-hover:scale-110" />
              <h3 className="mt-4 text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.body}</p>
              <p className="mt-6 text-xs font-medium text-muted-foreground">~{p.weeks} weeks · Open roadmap</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const FREE_FEATURES = [
  "Every course, tutorial and roadmap",
  "All practice problems with editorials",
  "Browser IDE for 6 languages",
  "Weekly rated contests",
  "Quizzes & mock tests with analysis",
  "Unlimited AI tutor",
  "Verifiable certificates",
  "Doubts forum & leaderboards",
];

/** Landing section: everything on Kodshala is free, no plans, no paywalls. */
export function FreeSection() {
  return (
    <section className="container-cv relative z-10 py-24" id="free">
      <SectionHeading title="Everything is free" subtitle="No plans, no paywall and no card details. Make an account and start." />
      <div className="glass gradient-border mx-auto mt-12 max-w-3xl p-8 md:p-10">
        <ul className="grid gap-4 sm:grid-cols-2">
          {FREE_FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-success/15"><Check className="size-4 text-success" /></span>
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="h-12 rounded-xl bg-brand px-8 hover:bg-brand/90">
            <Link href="/signup">Create your free account</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  { q: "Is Kodshala really free?", a: "Yes, 100%. Every course, tutorial, problem, contest, mock test, the AI tutor and certificates are free. There are no paid plans." },
  { q: "Which programming languages can I use?", a: "C, C++, Java, Python, JavaScript and Go, in the problem workspace, the playground and every 'Try it Yourself' editor." },
  { q: "How does the AI tutor avoid giving away answers?", a: "It is instructed to give progressive hints: first a nudge, then the approach, then pseudocode. It only shows a full solution if you explicitly ask for one." },
  { q: "Are the certificates verifiable?", a: "Every certificate has a unique code and a QR code linking to a public verification page anyone can check." },
  { q: "Can I learn in Hinglish?", a: "Yes. Use the English / Hinglish toggle in the navbar, footer or settings to read tutorials, problems, quizzes and courses in Hinglish. The AI tutor can answer in Hinglish too." },
  { q: "Do I need a credit card?", a: "No. Sign up with email, Google or GitHub, nothing to pay, ever." },
];

export function FaqSection() {
  return (
    <section className="container-cv relative z-10 py-24" id="faq">
      <SectionHeading title="Common questions" />
      <Accordion type="single" collapsible className="glass mx-auto mt-12 max-w-3xl px-6">
        {FAQS.map((f, i) => (
          <AccordionItem key={f.q} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export function NewsletterCta() {
  return (
    <section className="container-cv relative z-10 py-16">
      <div className="glass relative overflow-hidden p-10 text-center md:p-16">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.35),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.25),transparent_50%)]" />
        <div className="relative">
          <h2 className="font-heading text-3xl font-bold md:text-5xl">
            Your next offer starts with <span className="text-gradient">one problem a day.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Get the weekly digest: the best new tutorials, the week&apos;s hardest problem and upcoming contests.</p>
          <div className="mt-8 flex justify-center">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
