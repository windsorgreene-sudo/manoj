"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

export interface TocItem {
  id: string;
  text: string;
  textHi?: string;
  level: 2 | 3;
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  const { lang } = useLanguage();
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="On this page">
      <ul className="space-y-1.5 border-l border-border">
        {items.map((it) => (
          <li key={it.id} className={it.level === 3 ? "pl-3" : ""}>
            <a
              href={`#${it.id}`}
              className={`-ml-px block border-l-2 py-0.5 pl-3 text-[13px] leading-snug transition-colors ${
                active === it.id
                  ? "border-primary font-medium text-primary"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              {lang === "hi" && it.textHi ? it.textHi : it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
