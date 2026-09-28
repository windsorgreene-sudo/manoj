import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, CalendarDays, Flame, Globe, MapPin, School, Trophy } from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/ui/brand-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heatmap } from "@/components/dashboard/heatmap";
import { DifficultyDonut } from "@/components/dashboard/charts";
import { FollowButton } from "@/components/dashboard/follow-button";
import { db } from "@/lib/db";
import { getActivityHeatmap, getStats } from "@/lib/queries/dashboard";
import { levelProgress } from "@/lib/gamification";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

async function getUser(username: string) {
  return db.user.findFirst({
    where: { username: username.toLowerCase(), banned: false },
    select: {
      id: true, name: true, username: true, image: true, createdAt: true, role: true,
      profile: true, streak: true,
      badges: { include: { badge: true }, orderBy: { awardedAt: "desc" } },
      contestEntries: { where: { rank: { not: null } }, orderBy: { registeredAt: "desc" }, take: 5, include: { contest: { select: { title: true, slug: true } } } },
      _count: { select: { followers: true, following: true } },
    },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const u = await getUser((await params).username);
  if (!u) return { title: "User not found" };
  return { title: `${u.name} (@${u.username})`, description: u.profile?.bio ?? `${u.name}'s CodeVerse profile`, alternates: { canonical: `/u/${u.username}` } };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const u = await getUser((await params).username);
  if (!u) notFound();
  const [stats, heat] = await Promise.all([getStats(u.id), getActivityHeatmap(u.id)]);
  const lp = levelProgress(u.profile?.xp ?? 0);
  const p = u.profile;
  return (
    <div className="container-cv py-10">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="glass h-fit space-y-4 p-6">
          <Avatar className="size-24 ring-4 ring-brand/40">
            {u.image ? <AvatarImage src={u.image} alt="" /> : null}
            <AvatarFallback className="bg-brand/20 text-2xl font-bold">{u.name.split(" ").map((x) => x[0]).join("").slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-heading text-2xl font-bold">{u.name}</h1>
            <p className="text-sm text-muted-foreground">@{u.username}{u.role !== "STUDENT" ? ` · ${u.role.toLowerCase()}` : ""}</p>
          </div>
          {p?.bio ? <p className="text-sm">{p.bio}</p> : null}
          <FollowButton userId={u.id} username={u.username ?? ""} initialFollowers={u._count.followers} />
          <p className="text-sm text-muted-foreground"><strong className="text-foreground">{u._count.followers}</strong> followers · <strong className="text-foreground">{u._count.following}</strong> following</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {p?.college ? <li className="flex items-center gap-2"><School className="size-4" /> {p.college}</li> : null}
            {p?.location ? <li className="flex items-center gap-2"><MapPin className="size-4" /> {p.location}</li> : null}
            <li className="flex items-center gap-2"><CalendarDays className="size-4" /> Joined {formatDate(u.createdAt, { month: "long", year: "numeric" })}</li>
            {p?.github ? <li><a href={p.github} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center gap-2 hover:text-foreground"><Github className="size-4" /> GitHub</a></li> : null}
            {p?.linkedin ? <li><a href={p.linkedin} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center gap-2 hover:text-foreground"><Linkedin className="size-4" /> LinkedIn</a></li> : null}
            {p?.website ? <li><a href={p.website} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center gap-2 hover:text-foreground"><Globe className="size-4" /> Website</a></li> : null}
          </ul>
        </aside>
        <div className="min-w-0 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Level", value: lp.level, sub: `${(p?.xp ?? 0).toLocaleString("en-IN")} XP`, Icon: Award },
              { label: "Contest rating", value: p?.contestRating ?? 1500, sub: `max ${p?.maxRating ?? 1500}`, Icon: Trophy },
              { label: "Solved", value: stats.solved, sub: `${stats.acceptance}% acceptance`, Icon: Award },
              { label: "Streak", value: u.streak?.current ?? 0, sub: `best ${u.streak?.longest ?? 0} days`, Icon: Flame },
            ].map((c) => (
              <div key={c.label} className="glass p-5">
                <p className="flex items-center gap-2 text-sm text-muted-foreground"><c.Icon className="size-4" /> {c.label}</p>
                <p className="mt-1 font-heading text-3xl font-bold">{c.value}</p>
                <p className="text-xs text-muted-foreground">{c.sub}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <section className="glass p-5" aria-labelledby="pd"><h2 id="pd" className="mb-4 font-semibold">Solved problems</h2><DifficultyDonut data={stats.byDifficulty} totals={stats.totals} /></section>
            <section className="glass p-5" aria-labelledby="pb">
              <h2 id="pb" className="mb-4 font-semibold">Badges ({u.badges.length})</h2>
              {u.badges.length ? (
                <ul className="flex flex-wrap gap-2">
                  {u.badges.map((b) => (
                    <li key={b.badgeId} className="flex items-center gap-2 rounded-xl border border-border px-3 py-1.5 text-sm" title={b.badge.description}>
                      <Award className="size-4" style={{ color: b.badge.color }} /> {b.badge.name}
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-muted-foreground">No badges yet.</p>}
              {u.contestEntries.length ? (
                <>
                  <h3 className="mt-6 mb-2 text-sm font-semibold">Recent contests</h3>
                  <ul className="space-y-1 text-sm">
                    {u.contestEntries.map((c) => (
                      <li key={c.id} className="flex justify-between"><Link href={`/contests/${c.contest.slug}`} className="hover:text-cyan">{c.contest.title}</Link><span className="text-muted-foreground">#{c.rank} · {c.ratingAfter && c.ratingBefore ? `${c.ratingAfter - c.ratingBefore >= 0 ? "+" : ""}${c.ratingAfter - c.ratingBefore}` : ""}</span></li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>
          </div>
          <section className="glass p-5" aria-labelledby="ph"><h2 id="ph" className="mb-3 font-semibold">Activity</h2><Heatmap data={heat} /></section>
        </div>
      </div>
    </div>
  );
}
