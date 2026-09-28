"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProblemFilters({ topics, companies, signedIn }: { topics: string[]; companies: string[]; signedIn: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    next.delete("page");
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    start(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
  };

  useEffect(() => {
    const t = window.setTimeout(() => {
      if ((params.get("q") ?? "") !== q) update("q", q.trim() || null);
    }, 300);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to typing
  }, [q]);

  const selects = [
    { key: "difficulty", label: "Difficulty", options: [["EASY", "Easy"], ["MEDIUM", "Medium"], ["HARD", "Hard"]] },
    { key: "topic", label: "Topic", options: topics.map((t) => [t, t]) },
    { key: "company", label: "Company", options: companies.map((c) => [c, c]) },
    ...(signedIn ? [{ key: "status", label: "Status", options: [["todo", "Todo"], ["attempted", "Attempted"], ["solved", "Solved"]] }] : []),
  ];
  const active = ["q", "difficulty", "topic", "company", "status"].some((k) => params.get(k));

  return (
    <div className="glass flex flex-col gap-3 p-3 lg:flex-row lg:items-center" role="search" aria-label="Filter problems">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <label htmlFor="problem-search" className="sr-only">Search problems</label>
        <Input id="problem-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title or number…" className="h-10 rounded-xl pl-9" />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {selects.map((s) => (
          <Select key={s.key} value={params.get(s.key) ?? "all"} onValueChange={(v) => update(s.key, v)}>
            <SelectTrigger className="h-10 w-full rounded-xl lg:w-40" aria-label={s.label}>
              <SelectValue placeholder={s.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any {s.label.toLowerCase()}</SelectItem>
              {s.options.map(([v, l]) => (
                <SelectItem key={v} value={v}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {pending ? <Loader2 className="size-4 animate-spin text-muted-foreground" aria-label="Updating" /> : null}
        {active ? (
          <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => { setQ(""); start(() => router.replace(pathname, { scroll: false })); }}>
            <X /> Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}
