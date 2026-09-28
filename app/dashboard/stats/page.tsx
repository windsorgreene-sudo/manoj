import { Heatmap } from "@/components/dashboard/heatmap";
import { DifficultyDonut, LanguagesBar, TopicRadar, WeeklyStudyBar } from "@/components/dashboard/charts";
import { EmptyState } from "@/components/ui/empty-state";
import { getActivityHeatmap, getStats } from "@/lib/queries/dashboard";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Stats" };

export default async function StatsPage() {
  const user = await requireUser();
  const [s, heat] = await Promise.all([getStats(user.id), getActivityHeatmap(user.id)]);
  const cards = [
    { label: "Problems solved", value: s.solved },
    { label: "Submissions", value: s.submissions },
    { label: "Acceptance rate", value: `${s.acceptance}%` },
    { label: "Study hours (7 wks)", value: Math.round(s.weekly.reduce((t, w) => t + w.minutes, 0) / 60) },
  ];
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">Your stats</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="glass p-5"><p className="text-sm text-muted-foreground">{c.label}</p><p className="mt-1 font-heading text-3xl font-bold">{c.value}</p></div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass p-5" aria-labelledby="d-h"><h2 id="d-h" className="mb-4 font-semibold">Solved by difficulty</h2><DifficultyDonut data={s.byDifficulty} totals={s.totals} /></section>
        <section className="glass p-5" aria-labelledby="r-h"><h2 id="r-h" className="font-semibold">Topic strength</h2>{s.solved ? <TopicRadar data={s.radar} /> : <EmptyState title="No data yet" description="Solve a few problems to see your strongest topics." />}</section>
        <section className="glass p-5" aria-labelledby="l-h"><h2 id="l-h" className="mb-2 font-semibold">Languages used</h2>{s.languages.length ? <LanguagesBar data={s.languages} /> : <EmptyState title="No submissions yet" />}</section>
        <section className="glass p-5" aria-labelledby="w-h"><h2 id="w-h" className="mb-2 font-semibold">Weekly study time</h2><WeeklyStudyBar data={s.weekly} /></section>
      </div>
      <section className="glass p-5" aria-labelledby="a-h"><h2 id="a-h" className="mb-3 font-semibold">Activity heatmap</h2><Heatmap data={heat} /></section>
    </div>
  );
}
