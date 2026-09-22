"use client";

import { useEffect, useState } from "react";
import { BookmarkIcon, CheckIcon } from "./icons";

const KEY = "cv-bookmarks";

export function BookmarkButton({ slug, title, href }: { slug: string; title: string; href: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem(KEY) || "[]") as { slug: string }[];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaved(list.some((b) => b.slug === slug));
    } catch {}
  }, [slug]);

  const toggle = () => {
    try {
      const list = JSON.parse(localStorage.getItem(KEY) || "[]") as {
        slug: string;
        title: string;
        href: string;
      }[];
      const exists = list.some((b) => b.slug === slug);
      const next = exists ? list.filter((b) => b.slug !== slug) : [{ slug, title, href }, ...list];
      localStorage.setItem(KEY, JSON.stringify(next));
      setSaved(!exists);
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
        saved
          ? "border-primary bg-primary-soft text-primary"
          : "border-border-strong text-text-muted hover:border-primary hover:text-primary"
      }`}
      aria-pressed={saved}
    >
      {saved ? <CheckIcon className="h-4 w-4" /> : <BookmarkIcon className="h-4 w-4" />}
      {saved ? "Bookmarked" : "Bookmark"}
    </button>
  );
}
