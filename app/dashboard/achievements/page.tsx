import { AchievementsView } from "@/components/dashboard/achievements-view";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Achievements" };

export default async function AchievementsPage() {
  const user = await requireUser();
  const [badges, mine] = await Promise.all([db.badge.findMany({ orderBy: { xpReward: "asc" } }), db.userBadge.findMany({ where: { userId: user.id } })]);
  const map = new Map(mine.map((m) => [m.badgeId, m.awardedAt]));
  const list = badges
    .map((b) => ({ slug: b.slug, name: b.name, color: b.color, tier: b.tier, earned: map.has(b.id), description: b.description, xpReward: b.xpReward, awardedAt: map.get(b.id)?.toISOString() ?? null }))
    .sort((a, b) => Number(b.earned) - Number(a.earned));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Achievements</h1>
        <p className="mt-1 text-sm text-muted-foreground">{mine.length} of {badges.length} badges unlocked</p>
      </div>
      <AchievementsView badges={list} />
    </div>
  );
}
