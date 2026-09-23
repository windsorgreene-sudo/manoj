"use client";

import { SearchIcon } from "./icons";

// A search-styled button in the hero that opens the single, shared search
// dialog owned by the Header (via a custom event). This avoids having two
// separate search components on the page.
export function HeroSearchButton() {
  const open = () => window.dispatchEvent(new CustomEvent("cv-open-search"));
  return (
    <button
      onClick={open}
      className="flex w-full items-center gap-3 rounded-full border border-border-strong bg-surface px-5 py-3 text-left text-text-faint shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-primary)]"
    >
      <SearchIcon className="h-5 w-5" />
      <span className="flex-1 text-[15px]">Search subjects and lessons...</span>
      <kbd className="hidden rounded-md border border-border px-1.5 py-0.5 text-[11px] text-text-muted sm:inline">
        Ctrl K
      </kbd>
    </button>
  );
}
