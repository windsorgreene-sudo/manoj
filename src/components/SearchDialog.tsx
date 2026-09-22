"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { SearchDoc } from "@/content";
import { SearchIcon, CloseIcon, ClockIcon } from "./icons";
import { formatDate } from "@/lib/site";

const RECENT_KEY = "cv-recent-searches";
const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "tutorial", label: "Tutorials" },
  { value: "assignment", label: "Assignments" },
  { value: "lab", label: "Lab" },
  { value: "notes", label: "Notes" },
  { value: "mcq", label: "MCQ" },
];

function score(doc: SearchDoc, q: string): number {
  const query = q.toLowerCase();
  const title = doc.title.toLowerCase();
  let s = 0;
  if (title === query) s += 100;
  if (title.startsWith(query)) s += 40;
  if (title.includes(query)) s += 20;
  if (doc.categoryName.toLowerCase().includes(query)) s += 8;
  if (doc.tags.some((t) => t.toLowerCase().includes(query))) s += 6;
  if (doc.description.toLowerCase().includes(query)) s += 3;
  if (doc.contentTypeLabel.toLowerCase().includes(query)) s += 2;
  return s;
}

export function SearchDialog({
  index,
  open,
  onClose,
}: {
  index: SearchDoc[];
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    index.forEach((d) => map.set(d.category, d.categoryName));
    return Array.from(map, ([value, label]) => ({ value, label })).sort((a, b) =>
      a.label.localeCompare(b.label),
    );
  }, [index]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
      try {
        // Read persisted recent searches from localStorage on open.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"));
      } catch {
        setRecent([]);
      }
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const commitRecent = useCallback((q: string) => {
    const term = q.trim();
    if (!term) return;
    setRecent((prev) => {
      const next = [term, ...prev.filter((t) => t !== term)].slice(0, 6);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const results = useMemo(() => {
    let pool = index;
    if (typeFilter !== "all") pool = pool.filter((d) => d.contentType === typeFilter);
    if (categoryFilter !== "all") pool = pool.filter((d) => d.category === categoryFilter);
    if (!query.trim()) {
      return [...pool]
        .sort((a, b) => +new Date(b.updatedDate) - +new Date(a.updatedDate))
        .slice(0, 8);
    }
    return pool
      .map((d) => ({ d, s: score(d, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((x) => x.d);
  }, [index, query, typeFilter, categoryFilter]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const set = new Set<string>();
    index.forEach((d) => {
      d.tags.forEach((t) => {
        if (t.toLowerCase().includes(q) && t.toLowerCase() !== q) set.add(t);
      });
    });
    return Array.from(set).slice(0, 5);
  }, [index, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Search">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative mx-auto mt-0 sm:mt-20 flex h-full sm:h-auto max-h-full sm:max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden border border-border bg-surface sm:rounded-lg shadow-xl">
        {/* Input row */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <SearchIcon className="h-5 w-5 shrink-0 text-text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && commitRecent(query)}
            placeholder="Search tutorials, topics, notes, assignments..."
            className="min-w-0 flex-1 bg-transparent text-[15px] text-text placeholder:text-text-faint focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="rounded p-1 text-text-muted hover:bg-surface-2"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2">
          <div className="flex flex-wrap gap-1">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={`rounded-sm px-2 py-1 text-xs font-medium ${
                  typeFilter === f.value
                    ? "bg-primary text-primary-contrast"
                    : "bg-surface-2 text-text-muted hover:text-text"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="ml-auto rounded-sm border border-border bg-surface px-2 py-1 text-xs text-text-muted"
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Recent + suggestions */}
          {(recent.length > 0 && !query.trim()) || suggestions.length > 0 ? (
            <div className="border-b border-border px-4 py-3">
              {suggestions.length > 0 && (
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-text-faint">Suggestions:</span>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="rounded-sm bg-primary-soft px-2 py-0.5 text-xs text-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {recent.length > 0 && !query.trim() && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="flex items-center gap-1 text-xs text-text-faint">
                    <ClockIcon className="h-3.5 w-3.5" /> Recent:
                  </span>
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => setQuery(r)}
                      className="rounded-sm bg-surface-2 px-2 py-0.5 text-xs text-text-muted hover:text-text"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* Results */}
          <ul className="divide-y divide-border">
            {results.map((d) => (
              <li key={d.slug}>
                <Link
                  href={d.href}
                  onClick={() => {
                    commitRecent(query);
                    onClose();
                  }}
                  className="block px-4 py-3 hover:bg-surface-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-text">{d.title}</span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-muted">
                    <span className="text-primary">{d.categoryName}</span>
                    <span className="text-text-faint">·</span>
                    <span>{d.contentTypeLabel}</span>
                    <span className="text-text-faint">·</span>
                    <span>Updated {formatDate(d.updatedDate)}</span>
                  </div>
                  <p className="clamp-2 mt-1 text-[13px] text-text-muted">{d.description}</p>
                </Link>
              </li>
            ))}
            {results.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-text-muted">
                No results for &ldquo;{query}&rdquo;. Try a different term or filter.
              </li>
            )}
          </ul>
        </div>

        <div className="hidden sm:flex items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-text-faint">
          <span>
            <kbd className="rounded border border-border px-1">Esc</kbd> to close
          </span>
          <span>
            <kbd className="rounded border border-border px-1">Enter</kbd> to open
          </span>
        </div>
      </div>
    </div>
  );
}
