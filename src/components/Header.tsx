"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SearchDoc } from "@/content";
import { NAV_GROUPS, categories } from "@/content";
import { SearchDialog } from "./SearchDialog";
import { LanguageToggle } from "./LanguageToggle";
import { Logo } from "./Logo";
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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href !== "/" && (pathname === href || pathname.startsWith(href + "/"));

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

  // Add a subtle shadow once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
    <header
      className={`sticky top-0 z-50 border-b bg-surface/90 backdrop-blur transition-shadow duration-300 supports-[backdrop-filter]:bg-surface/75 ${
        scrolled ? "border-border shadow-[var(--shadow-sm)]" : "border-transparent"
      }`}
    >
      {/* Primary row */}
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-3 px-4">
        {/* Logo */}
        <Logo />

        {/* Center search (desktop) */}
        <div className="mx-auto hidden w-full max-w-xl md:block">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex w-full items-center gap-2 rounded-lg border border-border-strong bg-surface-2 px-3 py-2 text-left text-sm text-text-faint transition-all hover:border-primary hover:shadow-[var(--shadow-sm)]"
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
          <LanguageToggle className="hidden sm:inline-flex" />
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
            className="hidden rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-contrast shadow-[var(--shadow-sm)] transition-all hover:bg-primary-hover hover:shadow-[var(--shadow-primary)] sm:inline-flex"
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
        <div className="no-scrollbar mx-auto flex max-w-[1240px] items-stretch overflow-x-auto px-4">
          {NAV_GROUPS.map((g) => {
            const items = dropdownFor(g.group);
            const hasDropdown = items.length > 0;
            return (
              <div
                key={g.group}
                className="relative shrink-0"
                onMouseEnter={() => hasDropdown && setOpenDropdown(g.group)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={g.href}
                  className={`relative flex items-center gap-1 px-3 py-2.5 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-primary hover:after:scale-x-100 ${
                    isActive(g.href)
                      ? "text-primary after:scale-x-100"
                      : "text-text-muted"
                  }`}
                >
                  {g.label}
                  {hasDropdown && (
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        openDropdown === g.group ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>
                {hasDropdown && openDropdown === g.group && (
                  <div className="animate-slide-down absolute left-0 top-full z-50 min-w-56 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-[var(--shadow-lg)]">
                    {items.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/${c.slug}`}
                        className="block px-4 py-2 text-sm text-text-muted transition-colors hover:bg-surface-2 hover:pl-5 hover:text-primary"
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
            className="ml-auto flex shrink-0 items-center gap-1 whitespace-nowrap px-3 py-2.5 text-sm font-semibold text-primary hover:text-primary-hover"
          >
            Study Resources
          </Link>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[70] lg:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto border-l border-border bg-surface shadow-[var(--shadow-lg)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-bold text-text">Menu</span>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-1.5 text-text-muted hover:bg-surface-2"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <nav className="px-2 py-2">
            {NAV_GROUPS.map((g) => (
              <Link
                key={g.group}
                href={g.href}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors hover:bg-surface-2 ${
                  isActive(g.href) ? "bg-primary-soft text-primary" : "text-text"
                }`}
              >
                {g.label}
              </Link>
            ))}
            <Link
              href="/resources"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-text transition-colors hover:bg-surface-2"
            >
              Study Resources
            </Link>
            <div className="my-2 border-t border-border" />
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-text transition-colors hover:bg-surface-2"
            >
              Login
            </Link>
            <Link
              href="/bookmarks"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-text transition-colors hover:bg-surface-2"
            >
              Bookmarks
            </Link>
          </nav>
        </div>
      </div>

      <SearchDialog index={searchIndex} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
