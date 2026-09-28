"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Option = { value: string; label: string };

export function CatalogFilters({ topics, languages }: { topics: string[]; languages: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
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

  const selects: { key: string; label: string; options: Option[] }[] = [
    { key: "topic", label: "Topic", options: topics.map((t) => ({ value: t, label: t })) },
    {
      key: "level",
      label: "Level",
      options: [
        { value: "BEGINNER", label: "Beginner" },
        { value: "INTERMEDIATE", label: "Intermediate" },
        { value: "ADVANCED", label: "Advanced" },
      ],
    },
    { key: "language", label: "Language", options: languages.map((l) => ({ value: l, label: l })) },
    {
      key: "price",
      label: "Price",
      options: [
        { value: "free", label: "Free" },
        { value: "pro", label: "Pro" },
      ],
    },
  ];
  const active = ["q", "topic", "level", "language", "price", "sort"].some((k) => params.get(k));

  return (
    <div className="glass flex flex-col gap-3 p-4 lg:flex-row lg:items-center" role="search" aria-label="Filter courses">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <label htmlFor="course-search" className="sr-only">
          Search courses
        </label>
        <Input id="course-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses…" className="h-10 rounded-xl pl-9" />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {selects.map((s) => (
          <Select key={s.key} value={params.get(s.key) ?? "all"} onValueChange={(v) => update(s.key, v)}>
            <SelectTrigger className="h-10 w-full rounded-xl" aria-label={s.label}>
              <SelectValue placeholder={s.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {s.label.toLowerCase()}s</SelectItem>
              {s.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        <Select value={params.get("sort") ?? "featured"} onValueChange={(v) => update("sort", v === "featured" ? null : v)}>
          <SelectTrigger className="h-10 w-full rounded-xl" aria-label="Sort by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="popular">Most popular</SelectItem>
            <SelectItem value="rating">Highest rated</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="title">A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        {pending ? <Loader2 className="size-4 animate-spin text-muted-foreground" aria-label="Updating" /> : null}
        {active ? (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl"
            onClick={() => {
              setQ("");
              start(() => router.replace(pathname, { scroll: false }));
            }}
          >
            <X /> Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}
