"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SearchDoc } from "@/content/courses/search";
import { SearchIcon, CloseIcon, ClockIcon } from "./icons";

const RECENT_KEY = "cv-recent-searches";
const KIND_FILTERS = [
  { value: "all", label: "All" },
  { value: "Course", label: "Subjects" },
  { value: "Lesson", label: "Lessons" },
];

function score(doc: SearchDoc, q: string): number {
  const query = q.toLowerCase();
  const title = doc.title.toLowerCase();
  let s = 0;
  if (title === query) s += 100;
  if (title.startsWith(query)) s += 40;
  if (title.includes(query)) s += 20;
  if (doc.courseTitle.toLowerCase().includes(query)) s += 8;
  if (doc.tags.some((t) => t.toLowerCase().includes(query))) s += 6;
  if (doc.description.toLowerCase().includes(query)) s += 3;
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
  const [kindFilter, setKindFilter] = useState("all");
  const [recent, setRecent] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"));
      } catch {
        setRecent([]);
      }
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(0);
  }, [query, kindFilter]);

  useEffect(() => {
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

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

  const clearRecent = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {}
  }, []);

  const results = useMemo(() => {
    let pool = index;
    if (kindFilter !== "all") pool = pool.filter((d) => d.kind === kindFilter);
    if (!query.trim()) {
      // Show subjects first when there is no query.
      return [...pool].sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "Course" ? -1 : 1)).slice(0, 9);
    }
    return pool
      .map((d) => ({ d, s: score(d, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((x) => x.d);
  }, [index, query, kindFilter]);

  const openResult = useCallback(
    (doc: SearchDoc) => {
      commitRecent(query);
      onClose();
      router.push(doc.href);
    },
    [commitRecent, query, onClose, router],
  );

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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto mt-0 flex h-full w-full max-w-2xl flex-col overflow-hidden border border-border bg-surface shadow-xl sm:mt-20 sm:h-auto sm:max-h-[80vh] sm:rounded-lg">
        {/* Input row */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <SearchIcon className="h-5 w-5 shrink-0 text-text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                onClose();
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                const doc = results[active];
                if (doc) openResult(doc);
              }
            }}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="cv-search-results"
            placeholder="Search subjects and lessons..."
            className="min-w-0 flex-1 bg-transparent text-[15px] text-text placeholder:text-text-faint focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="rounded-full p-1 text-text-muted hover:bg-surface-2"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1 border-b border-border px-4 py-2">
          {KIND_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setKindFilter(f.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                kindFilter === f.value
                  ? "bg-primary text-primary-contrast"
                  : "bg-surface-2 text-text-muted hover:text-text"
              }`}
            >
              {f.label}
            </button>
          ))}
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
                      className="rounded-full bg-primary-soft px-2 py-0.5 text-xs text-primary"
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
                      className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-text-muted hover:text-text"
                    >
                      {r}
                    </button>
                  ))}
                  <button
                    onClick={clearRecent}
                    className="ml-1 text-xs text-text-faint underline hover:text-text-muted"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* Results */}
          <ul id="cv-search-results" ref={listRef} role="listbox" className="divide-y divide-border">
            {results.map((d, i) => (
              <li key={d.href} role="option" aria-selected={i === active}>
                <Link
                  href={d.href}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => {
                    commitRecent(query);
                    onClose();
                  }}
                  className={`block px-4 py-3 ${i === active ? "bg-surface-2" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-text">{d.title}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        d.kind === "Course"
                          ? "bg-primary-soft text-primary"
                          : "bg-accent-soft text-accent"
                      }`}
                    >
                      {d.kind === "Course" ? "Subject" : "Lesson"}
                    </span>
                  </div>
                  {d.kind === "Lesson" && (
                    <div className="mt-0.5 text-xs text-text-muted">{d.courseTitle}</div>
                  )}
                  <p className="clamp-2 mt-1 text-[13px] text-text-muted">{d.description}</p>
                </Link>
              </li>
            ))}
            {results.length === 0 && (
              <li className="px-4 py-12 text-center">
                <p className="text-sm font-medium text-text">
                  No results for &ldquo;{query.trim()}&rdquo;
                </p>
                <p className="mt-1 text-[13px] text-text-muted">
                  Try a different keyword, like &ldquo;pointers&rdquo; or &ldquo;SQL&rdquo;.
                </p>
              </li>
            )}
          </ul>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2 text-[11px] text-text-faint">
          <span>
            {query.trim()
              ? `${results.length} result${results.length === 1 ? "" : "s"}`
              : "Type to search"}
          </span>
          <span className="hidden items-center gap-3 sm:flex">
            <span>
              <kbd className="rounded border border-border px-1">↑</kbd>
              <kbd className="ml-0.5 rounded border border-border px-1">↓</kbd> navigate
            </span>
            <span>
              <kbd className="rounded border border-border px-1">Enter</kbd> open
            </span>
            <span>
              <kbd className="rounded border border-border px-1">Esc</kbd> close
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
