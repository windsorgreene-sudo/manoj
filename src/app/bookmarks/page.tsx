"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BookmarkIcon } from "@/components/icons";

interface Bookmark {
  slug: string;
  title: string;
  href: string;
}

export default function BookmarksPage() {
  const [items, setItems] = useState<Bookmark[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(JSON.parse(localStorage.getItem("cv-bookmarks") || "[]"));
    } catch {}
    setLoaded(true);
  }, []);

  const remove = (slug: string) => {
    const next = items.filter((b) => b.slug !== slug);
    setItems(next);
    try {
      localStorage.setItem("cv-bookmarks", JSON.stringify(next));
    } catch {}
  };

  return (
    <div className="mx-auto max-w-[800px] px-4 py-6">
      <Breadcrumbs items={[{ label: "Bookmarks" }]} />
      <header className="mt-4 border-b border-border pb-5">
        <h1 className="text-[26px] font-bold text-text sm:text-[30px]">Your Bookmarks</h1>
        <p className="mt-2 text-[15px] text-text-muted">
          Saved articles are stored in your browser on this device.
        </p>
      </header>

      {loaded && items.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <BookmarkIcon className="h-8 w-8 text-text-faint" />
          <p className="text-sm text-text-muted">
            You have no bookmarks yet. Use the Bookmark button on any article to save it here.
          </p>
          <Link href="/tutorials" className="text-sm font-medium text-primary hover:underline">
            Browse tutorials
          </Link>
        </div>
      )}

      <ul className="mt-4">
        {items.map((b) => (
          <li key={b.slug} className="flex items-center justify-between border-b border-border py-3">
            <Link href={b.href} className="text-[15px] font-medium text-text hover:text-primary">
              {b.title}
            </Link>
            <button
              onClick={() => remove(b.slug)}
              className="text-xs text-text-muted hover:text-rose-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
