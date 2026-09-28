"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Circle } from "lucide-react";
import { DifficultyBadge } from "@/components/learn/difficulty-badge";
import { getSheetProgress } from "@/lib/actions/practice";

type P = { id: string; slug: string; title: string; number: number; difficulty: "EASY" | "MEDIUM" | "HARD"; topics: string[] };

export function SheetView({ sheetId, sections }: { sheetId: string; sections: { name: string; items: P[] }[] }) {
  const { data, isLoading } = useQuery({ queryKey: ["sheet", sheetId], queryFn: () => getSheetProgress(sheetId) });
  const solved = new Set(data?.solved ?? []);
  const total = sections.reduce((t, s) => t + s.items.length, 0);
  const pct = Math.round((solved.size / Math.max(1, total)) * 100);
  return (
    <>
      <div className="glass mt-8 flex flex-wrap items-center gap-4 p-5">
        <div className="flex-1">
          <p className="text-sm font-medium">{isLoading ? "Loading progress…" : data?.signedIn ? `${solved.size} of ${total} solved` : "Log in to track your progress"}</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Sheet progress">
            <div className="h-full bg-gradient-to-r from-brand to-success transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <p className="font-heading text-3xl font-bold">{pct}%</p>
      </div>
      <div className="mt-8 space-y-8">
        {sections.map((sec) => {
          const done = sec.items.filter((p) => solved.has(p.id)).length;
          return (
            <section key={sec.name} aria-labelledby={`sec-${sec.name}`}>
              <h2 id={`sec-${sec.name}`} className="flex items-center justify-between font-heading text-xl font-bold">
                {sec.name} <span className="text-sm font-normal text-muted-foreground">{done}/{sec.items.length}</span>
              </h2>
              <ul className="glass mt-3 divide-y divide-border">
                {sec.items.map((p) => (
                  <li key={p.id}>
                    <Link href={`/problems/${p.slug}`} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent/50">
                      {solved.has(p.id) ? <CheckCircle2 className="size-5 text-success" aria-label="Solved" /> : <Circle className="size-5 text-muted-foreground" aria-label="Not solved" />}
                      <span className="flex-1 font-medium">{p.number}. {p.title}</span>
                      <span className="hidden text-xs text-muted-foreground sm:inline">{p.topics[0]}</span>
                      <DifficultyBadge difficulty={p.difficulty} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
