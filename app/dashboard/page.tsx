import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ContestsCard, ContinueCard, PotdCard, StreakCard, XpBar } from "@/components/dashboard/widgets";
import { Heatmap } from "@/components/dashboard/heatmap";
import { DifficultyDonut } from "@/components/dashboard/charts";
import { getActivityHeatmap, getOverview, getStats } from "@/lib/queries/dashboard";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Overview" };

function greeting() {
  const h = (new Date().getUTCHours() + 5.5) % 24;
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default async function DashboardPage() {
  const user = await requireUser();
  const [o, heat, stats] = await Promise.all([getOverview(user.id), getActivityHeatmap(user.id), getStats(user.id)]);
  return (
    <div className="space-y-6">
      <section className="glass relative overflow-hidden p-6">
        <div aria-hidden className="absolute -right-20 -top-20 size-72 rounded-full bg-brand/20 blur-3xl" />
        <div className="relative flex flex-wrap items-center gap-5">
          <Avatar className="size-16 ring-2 ring-brand">
            {user.image ? <AvatarImage src={user.image} alt="" /> : null}
            <AvatarFallback className="bg-brand/20 text-lg font-bold">{user.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-2xl font-bold md:text-3xl">{greeting()}, {user.name.split(" ")[0]} 👋</h1>
            <p className="text-sm text-muted-foreground">Contest rating {o.rating} · {stats.solved} problems solved · {o.unread} unread notifications</p>
            <div className="mt-4 max-w-xl"><XpBar level={o.progress.level} current={o.progress.current} needed={o.progress.needed} pct={o.progress.pct} xp={o.xp} /></div>
          </div>
          <Button asChild className="rounded-xl"><Link href="/problems"><Sparkles /> Practice now</Link></Button>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StreakCard {...o.streak} />
        <PotdCard potd={o.potd} />
        <div className="md:col-span-2"><ContinueCard items={o.continue} /></div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <section className="glass p-5" aria-labelledby="solved-h">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="solved-h" className="font-semibold">Solved problems</h2>
            <Link href="/dashboard/stats" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">All stats <ArrowRight className="size-3" /></Link>
          </div>
          <DifficultyDonut data={stats.byDifficulty} totals={stats.totals} />
        </section>
        <ContestsCard contests={o.contests} />
      </div>
      <section className="glass p-5" aria-labelledby="activity-h">
        <h2 id="activity-h" className="mb-3 font-semibold">Activity</h2>
        <Heatmap data={heat} />
      </section>
    </div>
  );
}
