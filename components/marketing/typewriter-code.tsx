"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const SNIPPET = `def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i

print(two_sum([2, 7, 11, 15], 9))
# ✓ Accepted · 32 ms · +10 XP`;

const KEYWORDS = /\b(def|for|in|if|return|print|enumerate)\b/g;

function colorize(line: string) {
  if (line.trimStart().startsWith("#")) return `<span class="text-success">${escape(line)}</span>`;
  return escape(line)
    .replace(KEYWORDS, '<span class="text-brand-soft">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="text-warning">$1</span>')
    .replace(/(two_sum)/g, '<span class="text-cyan">$1</span>');
}
function escape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Typewriter code snippet that types itself beside the hero headline. */
export function TypewriterCode() {
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= SNIPPET.length) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [reduced]);

  const shown = reduced ? SNIPPET : SNIPPET.slice(0, n);
  const lines = shown.split("\n");

  return (
    <div className="glass gradient-border w-full max-w-md overflow-hidden text-left" aria-label="Example: a Two Sum solution in Python">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-danger/80" />
        <span className="size-2.5 rounded-full bg-warning/80" />
        <span className="size-2.5 rounded-full bg-success/80" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">two_sum.py</span>
      </div>
      <pre className="min-h-[228px] p-4 font-mono text-[13px] leading-6" aria-hidden>
        {lines.map((l, i) => (
          <div key={i} className="flex">
            <span className="mr-4 w-4 select-none text-right text-muted-foreground/50">{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: colorize(l) || "&nbsp;" }} />
            {i === lines.length - 1 && !reduced && n < SNIPPET.length ? <span className="ml-0.5 inline-block w-2 animate-pulse bg-cyan">&nbsp;</span> : null}
          </div>
        ))}
      </pre>
      <span className="sr-only">{SNIPPET}</span>
    </div>
  );
}
