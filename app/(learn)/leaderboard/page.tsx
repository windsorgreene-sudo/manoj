import type { Metadata } from "next";
import { LeaderboardTable } from "@/components/dashboard/leaderboard-table";
import { getLeaderboard } from "@/lib/queries/dashboard";

export const metadata: Metadata = { title: "Global Leaderboard", description: "Top CodeVerse learners by XP and contest rating.", alternates: { canonical: "/leaderboard" } };
export const revalidate = 300;

export default async function PublicLeaderboardPage() {
  const rows = await getLeaderboard("global", null, 100);
  return (
    <div className="container-cv max-w-4xl py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">Leaderboard</p>
      <h1 className="mt-2 mb-8 font-heading text-4xl font-bold">Top learners</h1>
      <LeaderboardTable rows={rows} meId={null} />
    </div>
  );
}
