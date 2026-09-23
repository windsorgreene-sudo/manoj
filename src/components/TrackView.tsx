"use client";

import { useEffect } from "react";

export interface ViewedItem {
  slug: string;
  title: string;
  href: string;
  category: string;
  categoryName: string;
  viewedAt: number;
}

const KEY = "cv-recently-viewed";
const MAX = 12;

// Records an article view in localStorage so the student dashboard can show
// "recently viewed" and "continue learning". Runs once per mount.
export function TrackView(item: Omit<ViewedItem, "viewedAt">) {
  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem(KEY) || "[]") as ViewedItem[];
      const next = [
        { ...item, viewedAt: Date.now() },
        ...list.filter((v) => v.slug !== item.slug),
      ].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.slug]);

  return null;
}
