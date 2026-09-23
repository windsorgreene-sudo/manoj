"use client";

import { useMemo, useState } from "react";
import type { Article } from "@/content/types";
import { ArticleListItem } from "./ArticleListItem";

type SortKey = "updated" | "oldest" | "az" | "time";

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: "updated", label: "Recently updated" },
  { value: "oldest", label: "Oldest first" },
  { value: "az", label: "Title A to Z" },
  { value: "time", label: "Shortest read" },
];

// A client-side sortable list of articles with a small dropdown control.
export function SortableArticles({
  articles,
  showCategory = false,
}: {
  articles: Article[];
  showCategory?: boolean;
}) {
  const [sort, setSort] = useState<SortKey>("updated");

  const sorted = useMemo(() => {
    const arr = [...articles];
    switch (sort) {
      case "updated":
        return arr.sort((a, b) => +new Date(b.updatedDate) - +new Date(a.updatedDate));
      case "oldest":
        return arr.sort((a, b) => +new Date(a.publishedDate) - +new Date(b.publishedDate));
      case "az":
        return arr.sort((a, b) => a.title.localeCompare(b.title));
      case "time":
        return arr.sort((a, b) => a.readingMinutes - b.readingMinutes);
      default:
        return arr;
    }
  }, [articles, sort]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs text-text-faint">
          {articles.length} {articles.length === 1 ? "item" : "items"}
        </span>
        <label className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="hidden sm:inline">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-text focus:border-primary focus:outline-none"
            aria-label="Sort articles"
          >
            {OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        {sorted.map((a) => (
          <ArticleListItem key={a.slug} article={a} showCategory={showCategory} />
        ))}
      </div>
    </div>
  );
}
