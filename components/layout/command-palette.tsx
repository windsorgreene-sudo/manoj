"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Code2, FileText, GraduationCap, Hash, Home, Loader2, Trophy } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useUiStore } from "@/lib/stores/ui-store";
import { primaryNav, practiceNav } from "@/components/layout/nav-links";

export type SearchHit = { type: "article" | "course" | "problem" | "doubt"; title: string; href: string; subtitle?: string };

const ICONS = { article: FileText, course: GraduationCap, problem: Code2, doubt: Hash } as const;

export function CommandPalette() {
  const router = useRouter();
  const open = useUiStore((s) => s.searchOpen);
  const setOpen = useUiStore((s) => s.setSearchOpen);
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!useUiStore.getState().searchOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(q.trim()), 200);
    return () => window.clearTimeout(t);
  }, [q]);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["search", debounced],
    queryFn: async (): Promise<SearchHit[]> => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(debounced)}`);
      if (!res.ok) throw new Error("Search failed");
      const json = (await res.json()) as { hits: SearchHit[] };
      return json.hits;
    },
    enabled: debounced.length >= 2,
  });

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Search Kodshala" description="Search courses, tutorials, problems and doubts" shouldFilter={false}>
      <CommandInput placeholder="Search tutorials, problems, courses…" value={q} onValueChange={setQ} />
      <CommandList data-lenis-prevent>
        {debounced.length >= 2 ? (
          <>
            {isFetching ? (
              <div className="flex items-center gap-2 px-4 py-6 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Searching…
              </div>
            ) : isError ? (
              <div className="px-4 py-6 text-sm text-danger">Search is unavailable right now.</div>
            ) : (
              <CommandEmpty>No results for “{debounced}”. Try another keyword.</CommandEmpty>
            )}
            {data && data.length > 0 ? (
              <CommandGroup heading="Results">
                {data.map((hit) => {
                  const Icon = ICONS[hit.type];
                  return (
                    <CommandItem key={hit.href} value={hit.href} onSelect={() => go(hit.href)}>
                      <Icon />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate">{hit.title}</span>
                        {hit.subtitle ? <span className="truncate text-xs text-muted-foreground">{hit.subtitle}</span> : null}
                      </div>
                      <span className="ml-auto text-[10px] uppercase tracking-wide text-muted-foreground">{hit.type}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null}
          </>
        ) : (
          <>
            <CommandGroup heading="Go to">
              <CommandItem onSelect={() => go("/")}>
                <Home /> Home
              </CommandItem>
              <CommandItem onSelect={() => go("/dashboard")}>
                <BookOpen /> Dashboard
              </CommandItem>
              {primaryNav.map((n) => (
                <CommandItem key={n.href} onSelect={() => go(n.href)}>
                  <Trophy /> {n.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Practice">
              {practiceNav.map((n) => (
                <CommandItem key={n.href} onSelect={() => go(n.href)}>
                  <Code2 /> {n.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
