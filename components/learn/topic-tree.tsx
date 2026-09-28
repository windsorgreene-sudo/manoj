"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { TreeCategory } from "@/lib/queries/articles";
import { cn } from "@/lib/utils";

const DOT = { EASY: "bg-success", MEDIUM: "bg-warning", HARD: "bg-danger" } as const;

/** Collapsible topic tree (left column). The current category starts expanded. */
export function TopicTree({ tree, current }: { tree: TreeCategory[]; current: string }) {
  const currentCat = tree.find((c) => c.articles.some((a) => a.slug === current))?.slug;
  const [open, setOpen] = useState<Record<string, boolean>>(currentCat ? { [currentCat]: true } : {});

  return (
    <nav aria-label="Tutorial topics" className="text-sm">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Topics</p>
      <ul className="space-y-1">
        {tree.map((cat) => {
          const isOpen = Boolean(open[cat.slug]);
          return (
            <li key={cat.slug}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen((o) => ({ ...o, [cat.slug]: !o[cat.slug] }))}
                className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-left font-medium hover:bg-accent"
              >
                <ChevronRight className={cn("size-4 shrink-0 transition-transform", isOpen && "rotate-90")} aria-hidden />
                {cat.name}
                <span className="ml-auto text-xs text-muted-foreground">{cat.articles.length}</span>
              </button>
              {isOpen ? (
                <ul className="mt-1 ml-4 space-y-0.5 border-l border-border pl-2">
                  {cat.articles.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/tutorials/${a.slug}`}
                        aria-current={a.slug === current ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors",
                          a.slug === current ? "bg-brand/15 font-medium text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                      >
                        <span className={cn("size-1.5 shrink-0 rounded-full", DOT[a.difficulty])} aria-hidden />
                        <span className="line-clamp-2">{a.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
