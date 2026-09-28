import Link from "next/link";
import { Bot, Braces, ChartSpline, Check, Flame, Map, Medal, Sparkles, Trophy, Wand2, X } from "lucide-react";
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
              <span className="text-gradient">
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

const TECH = ["Python", "JavaScript", "C++", "Java", "Go", "C", "React", "Node.js", "SQL", "PostgreSQL", "Git", "Docker", "Linux", "TypeScript", "HTML", "CSS"];

export function TechMarquee() {
  const row = [...TECH, ...TECH];
  return (
    <section aria-label="Technologies you can learn" className="relative z-10 overflow-hidden py-10 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <ul className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <li key={i} aria-hidden={i >= TECH.length} className="glass flex items-center gap-2 rounded-2xl px-5 py-3 font-mono text-sm whitespace-nowrap">
            <Braces className="size-4 text-cyan" /> {t}
          </li>
        ))}
      </ul>
    </section>
  );
}

const FEATURES = [
  { Icon: Braces, title: "Browser IDE, 6 languages", body: "Monaco editor with autosave, custom input, and instant verdicts — C, C++, Java, Python, JS and Go." },
  { Icon: Bot, title: "AI tutor in English & Hindi", body: "Progressive hints, code reviews and quizzes generated from any article. Never spoils unless you ask." },
  { Icon: Trophy, title: "Rated weekly contests", body: "Realtime leaderboards, rating changes and a 3D podium for the champions." },
  { Icon: Wand2, title: "Algorithm visualizers", body: "Watch sorting, BFS/DFS, BST and Dijkstra step by step with pseudocode highlighting." },
  { Icon: Flame, title: "Streaks, XP & badges", body: "Stay consistent with daily streaks, streak freezes, levels and 15 achievements." },
  { Icon: ChartSpline, title: "Deep progress analytics", body: "Topic radar, difficulty donut, study time and a GitHub-style heatmap of your grind." },
];

export function FeaturesSection() {
  return (
    <section className="container-cv relative z-10 py-24" id="features">
      <SectionHeading kicker="Why CodeVerse" title="Everything you need, nothing you don't" subtitle="One platform replaces the five tabs you used to juggle." />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.06}>
            <div className="glass gradient-border hover-glow h-full p-6">
              <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-brand/15 text-brand-soft">
                <f.Icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const PATHS = [
  { slug: "dsa", title: "DSA Interview Prep", body: "Big-O → Graphs → DP with the Top Interview 30 sheet.", weeks: 12, Icon: Map },
  { slug: "web-development", title: "Full-Stack Web Developer", body: "HTML, CSS, JavaScript, HTTP and REST — ship real apps.", weeks: 10, Icon: Sparkles },
  { slug: "ai-ml", title: "AI / ML Foundations", body: "Python, data handling and algorithmic thinking for ML.", weeks: 8, Icon: Medal },
];

export function LearningPathsSection() {
  return (
    <section className="container-cv relative z-10 py-24">
      <SectionHeading kicker="Learning paths" title="Follow a roadmap, not a random playlist" subtitle="Interactive node-graph roadmaps where every step links to a lesson or problem." />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {PATHS.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08}>
            <Link href={`/roadmaps/${p.slug}`} className="glass gradient-border hover-glow group flex h-full flex-col p-6">
              <p.Icon className="size-8 text-cyan transition-transform group-hover:scale-110" />
              <h3 className="mt-4 text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.body}</p>
              <p className="mt-6 text-xs font-medium text-muted-foreground">~{p.weeks} weeks · View roadmap →</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { name: "Ananya Iyer", role: "SDE-1, Amazon", quote: "The DSA course + Top Interview 30 sheet was my entire prep. Hints from the AI tutor kept me from peeking at solutions." },
  { name: "Vihaan Gupta", role: "Codeforces Expert", quote: "Weekly contests with a real rating system and live standings — it feels like a proper competitive arena." },
  { name: "Meera Joshi", role: "Frontend Engineer, Razorpay", quote: "The web dev path explains *why*, not just *how*. Semantic HTML and the event loop articles are the best I've read." },
  { name: "Arjun Reddy", role: "M.Tech, IIT Bombay", quote: "OS and DBMS notes with runnable simulations helped me top my GATE mock tests. The highlights-to-notes feature is genius." },
  { name: "Saanvi Nair", role: "2nd-year B.Tech", quote: "I'm in Hindi-medium comfort zone and the tutor explains concepts in Hindi. Game changer for me." },
  { name: "Kabir Singh", role: "Backend Intern, Swiggy", quote: "Streaks got me coding every single day for 60 days. The heatmap on my profile impressed my interviewer." },
];

export function TestimonialsSection() {
  return (
    <section className="container-cv relative z-10 py-24">
      <SectionHeading kicker="Loved by learners" title="Stories from the CodeVerse" />
      <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.05} className="mb-4 break-inside-avoid">
            <figure className="glass p-6">
              <blockquote className="text-sm leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span aria-hidden className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-brand to-cyan text-xs font-bold text-white">
                  {t.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const COMPARE: { feature: string; free: boolean | string; pro: boolean | string }[] = [
  { feature: "Free courses & all tutorials", free: true, pro: true },
  { feature: "Practice problems & playground", free: true, pro: true },
  { feature: "Weekly rated contests", free: true, pro: true },
  { feature: "Premium courses (Web Dev, DBMS)", free: false, pro: true },
  { feature: "AI tutor messages", free: "5 / day", pro: "Unlimited" },
  { feature: "Mock tests with analysis", free: false, pro: true },
  { feature: "Premium problems & editorials", free: false, pro: true },
  { feature: "Verified certificates", free: false, pro: true },
];

export function PricingSection({ compact = false }: { compact?: boolean }) {
  return (
    <section className="container-cv relative z-10 py-24" id="pricing">
      <SectionHeading kicker="Pricing" title="Start free. Go Pro when you're ready." subtitle="Student-friendly pricing in INR. Cancel anytime." />
      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        <div className="glass flex flex-col p-8">
          <h3 className="text-xl font-semibold">Free</h3>
          <p className="mt-1 text-sm text-muted-foreground">For getting started</p>
          <p className="mt-6 font-heading text-5xl font-bold">₹0</p>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {COMPARE.map((c) => (
              <li key={c.feature} className="flex items-center gap-2">
                {c.free ? <Check className="size-4 text-success" /> : <X className="size-4 text-muted-foreground/50" />}
                <span className={c.free ? "" : "text-muted-foreground/70"}>
                  {c.feature}
                  {typeof c.free === "string" ? ` · ${c.free}` : ""}
                </span>
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="mt-8 h-11 rounded-xl">
            <Link href="/signup">Create free account</Link>
          </Button>
        </div>
        <div className="glass gradient-border relative flex flex-col p-8 shadow-[0_0_60px_-20px_rgba(124,58,237,0.8)]">
          <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-brand to-cyan px-3 py-1 text-xs font-semibold text-white">Most popular</span>
          <h3 className="text-xl font-semibold">Pro</h3>
          <p className="mt-1 text-sm text-muted-foreground">For serious interview prep</p>
          <p className="mt-6 font-heading text-5xl font-bold">
            ₹499<span className="text-base font-normal text-muted-foreground">/month</span>
          </p>
          <p className="text-xs text-muted-foreground">or ₹4,999/year — 2 months free</p>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {COMPARE.map((c) => (
              <li key={c.feature} className="flex items-center gap-2">
                <Check className="size-4 text-success" />
                {c.feature}
                {typeof c.pro === "string" ? ` · ${c.pro}` : ""}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-8 h-11 rounded-xl bg-brand hover:bg-brand/90">
            <Link href="/pricing#plans">{compact ? "See plans" : "Upgrade to Pro"}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  { q: "Is CodeVerse really free?", a: "Yes. All tutorials, free courses, practice problems, the playground and weekly contests are free forever. Pro unlocks premium courses, unlimited AI tutor, mock tests and certificates." },
  { q: "Which programming languages can I use?", a: "C, C++, Java, Python, JavaScript and Go — in the problem workspace, the playground and every 'Try it Yourself' editor." },
  { q: "How does the AI tutor avoid giving away answers?", a: "It is instructed to give progressive hints: first a nudge, then the approach, then pseudocode. It only shows a full solution if you explicitly ask for one." },
  { q: "Are the certificates verifiable?", a: "Every certificate has a unique code and a QR code linking to a public verification page anyone can check." },
  { q: "Can I use CodeVerse in Hindi?", a: "Yes. Switch the interface language to हिन्दी from the footer or settings, and ask the AI tutor to explain in Hindi." },
  { q: "Do you offer refunds?", a: "Pro subscriptions can be cancelled anytime. If you're unhappy within 7 days of your first payment, contact us for a full refund." },
];

export function FaqSection() {
  return (
    <section className="container-cv relative z-10 py-24" id="faq">
      <SectionHeading kicker="FAQ" title="Questions, answered" />
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
