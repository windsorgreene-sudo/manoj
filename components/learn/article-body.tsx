"use client";

import { useRef, type ReactNode } from "react";
import { HighlightToNote } from "@/components/learn/highlight-to-note";

export function ArticleBody({ articleId, children }: { articleId: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref}>
      {children}
      <HighlightToNote containerRef={ref} articleId={articleId} />
    </div>
  );
}
