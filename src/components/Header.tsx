"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SearchDoc } from "@/content";
import { NAV_GROUPS, categories } from "@/content";
import { SITE } from "@/lib/site";
import { SearchDialog } from "./SearchDialog";
import {
  SearchIcon,
  MenuIcon,
  CloseIcon,
  SunIcon,
  MoonIcon,
  BookmarkIcon,
  ChevronDown,
} from "./icons";

// Which nav groups get dropdowns, and the categories shown in each.
function dropdownFor(group: string) {
  return categories.filter((c) => c.group === group);
}

export function Header({ searchIndex }: { searchIndex: SearchDoc[] }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    // Sync toggle state from the DOM class set by the pre-hydration ThemeScript.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = () => {
    const el = document.documentElement;
    const next = !el.classList.contains("dark");
    el.classList.toggle("dark", next);
    try {
      localStorage.setItem("cv-theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      {/* Primary row */}
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-3 px-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-baseline gap-1.5" aria-label={SITE.name}>
          <span className="font-mono text-xl font-bold tracking-tight text-primary">
            &lt;/&gt;
          </span>
          <span className="text-xl font-bold tracking-tight text-text">
            Code<span className="text-primary">Vidya</span>
          </span>
        </Link>

        {/* Center search (desktop) */}
        <div className="mx-auto hidden w-full max-w-xl md:block">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex w-full items-center gap-2 rounded-md border border-border-strong bg-surface-2 px-3 py-2 text-left text-sm text-text-faint transition-colors hover:border-primary"
          >
            <SearchIcon className="h-4 w-4" />
            <span className="flex-1">Search tutorials, topics, notes, assignments...</span>
            <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[11px] text-text-muted lg:inline">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="rounded-md p-2 text-text-muted hover:bg-surface-2 md:hidden"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <Link
            href="/bookmarks"
            aria-label="Bookmarks"
            className="hidden rounded-md p-2 text-text-muted hover:bg-surface-2 sm:inline-flex"
          >
            <BookmarkIcon className="h-5 w-5" />
          </Link>
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="rounded-md p-2 text-text-muted hover:bg-surface-2"
          >
            {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
          <Link
            href="/login"
            className="hidden rounded-md border border-border-strong px-3 py-1.5 text-sm font-medium text-text hover:border-primary sm:inline-flex"
          >
            Login
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="rounded-md p-2 text-text-muted hover:bg-surface-2 lg:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Category nav (desktop) */}
      <nav className="hidden border-t border-border lg:block" aria-label="Categories">
        <div className="mx-auto flex max-w-[1240px] items-stretch px-4">
          {NAV_GROUPS.map((g) => {
            const items = dropdownFor(g.group);
            const hasDropdown = items.length > 0;
            return (
              <div
                key={g.group}
                className="relative"
                onMouseEnter={() => hasDropdown && setOpenDropdown(g.group)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={g.href}
                  className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-text-muted hover:text-primary"
                >
                  {g.label}
                  {hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
                </Link>
                {hasDropdown && openDropdown === g.group && (
                  <div className="absolute left-0 top-full z-50 min-w-56 border border-border bg-surface py-1 shadow-lg">
                    {items.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/${c.slug}`}
                        className="block px-4 py-2 text-sm text-text-muted hover:bg-surface-2 hover:text-primary"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <Link
            href="/resources"
            className="ml-auto flex items-center px-3 py-2.5 text-sm font-medium text-text-muted hover:text-primary"
          >
            Study Resources
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto border-l border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-bold text-text">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="rounded p-1 text-text-muted hover:bg-surface-2"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <nav className="px-2 py-2">
              {NAV_GROUPS.map((g) => (
                <Link
                  key={g.group}
                  href={g.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded px-3 py-2.5 text-sm font-medium text-text hover:bg-surface-2"
                >
                  {g.label}
                </Link>
              ))}
              <Link
                href="/resources"
                onClick={() => setMenuOpen(false)}
                className="block rounded px-3 py-2.5 text-sm font-medium text-text hover:bg-surface-2"
              >
                Study Resources
              </Link>
              <div className="my-2 border-t border-border" />
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block rounded px-3 py-2.5 text-sm font-medium text-text hover:bg-surface-2"
              >
                Login
              </Link>
              <Link
                href="/bookmarks"
                onClick={() => setMenuOpen(false)}
                className="block rounded px-3 py-2.5 text-sm font-medium text-text hover:bg-surface-2"
              >
                Bookmarks
              </Link>
            </nav>
          </div>
        </div>
      )}

      <SearchDialog index={searchIndex} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
