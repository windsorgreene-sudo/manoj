import Link from "next/link";
import { LeaderboardTable } from "@/components/dashboard/leaderboard-table";
import { getLeaderboard, type LeaderboardScope } from "@/lib/queries/dashboard";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata = { title: "Leaderboards" };

export default async function LeaderboardPage({ searchParams }: { searchParams: Promise<{ scope?: string }> }) {
  const user = await requireUser();
  const s = (await searchParams).scope;
  const scope: LeaderboardScope = s === "college" || s === "friends" ? s : "global";
  const rows = await getLeaderboard(scope, user.id);
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">Leaderboards</h1>
      <nav aria-label="Leaderboard scope" className="glass inline-flex gap-1 p-1">
        {(["global", "college", "friends"] as const).map((k) => (
          <Link key={k} href={`/dashboard/leaderboard?scope=${k}`} aria-current={scope === k ? "page" : undefined} className={cn("rounded-xl px-4 py-2 text-sm font-medium capitalize", scope === k ? "bg-brand text-white" : "text-muted-foreground hover:text-foreground")}>{k}</Link>
        ))}
      </nav>
      <LeaderboardTable rows={rows} meId={user.id} />
    </div>
  );
}
