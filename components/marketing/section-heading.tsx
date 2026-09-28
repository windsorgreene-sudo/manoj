import { Reveal } from "@/components/motion/reveal";

export function SectionHeading({ kicker, title, subtitle, align = "center" }: { kicker?: string; title: string; subtitle?: string; align?: "center" | "left" }) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {kicker ? <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">{kicker}</p> : null}
      <h2 className="mt-3 font-heading text-3xl font-bold md:text-5xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-muted-foreground">{subtitle}</p> : null}
    </Reveal>
  );
}
