import Link from "next/link";
import { Crown, Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

type Row = { rank: number; xp: number; level: number; contestRating: number; college: string | null; user: { id: string; name: string; username: string | null; image: string | null } };

export function LeaderboardTable({ rows, meId }: { rows: Row[]; meId: string | null }) {
  if (!rows.length) return <EmptyState title="Nobody here yet" description="Follow friends or set your college in Settings to see this leaderboard." />;
  return (
    <div className="glass relative overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <caption className="sr-only">Leaderboard</caption>
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="w-16 px-4 py-3">Rank</th>
            <th scope="col" className="px-4 py-3">Learner</th>
            <th scope="col" className="px-4 py-3">College</th>
            <th scope="col" className="px-4 py-3 text-right">Level</th>
            <th scope="col" className="px-4 py-3 text-right">XP</th>
            <th scope="col" className="px-4 py-3 text-right">Rating</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.user.id} className={cn("border-b border-border/60 last:border-0", r.user.id === meId && "bg-brand/10")}>
              <td className="px-4 py-3 font-semibold tabular-nums">
                {r.rank === 1 ? <Crown className="size-5 text-warning" aria-label="1st" /> : r.rank <= 3 ? <Medal className={cn("size-5", r.rank === 2 ? "text-slate-300" : "text-amber-700")} aria-label={`${r.rank}`} /> : r.rank}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    {r.user.image ? <AvatarImage src={r.user.image} alt="" /> : null}
                    <AvatarFallback className="bg-brand/20 text-xs">{r.user.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  {r.user.username ? <Link href={`/u/${r.user.username}`} className="font-medium hover:text-cyan">{r.user.name}</Link> : <span className="font-medium">{r.user.name}</span>}
                  {r.user.id === meId ? <span className="rounded bg-brand px-1.5 text-[10px] text-white">You</span> : null}
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{r.college ?? "-"}</td>
              <td className="px-4 py-3 text-right tabular-nums">{r.level}</td>
              <td className="px-4 py-3 text-right tabular-nums">{r.xp.toLocaleString("en-IN")}</td>
              <td className="px-4 py-3 text-right tabular-nums">{r.contestRating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
