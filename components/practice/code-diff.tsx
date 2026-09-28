"use client";

import { diffLines } from "diff";
import { cn } from "@/lib/utils";

/** Line diff between two attempts (green = added, red = removed). */
export function CodeDiff({ before, after }: { before: string; after: string }) {
  const parts = diffLines(before, after);
  let added = 0,
    removed = 0;
  parts.forEach((p) => {
    const n = p.count ?? p.value.split("\n").length - 1;
    if (p.added) added += n;
    if (p.removed) removed += n;
  });
  return (
    <div>
      <p className="mb-2 text-xs text-muted-foreground">
        <span className="text-success">+{added}</span> / <span className="text-danger">−{removed}</span> lines
      </p>
      <pre className="max-h-[60vh] overflow-auto rounded-xl bg-black/40 p-3 font-mono text-xs leading-5" data-lenis-prevent>
        {parts.map((p, i) =>
          p.value
            .replace(/\n$/, "")
            .split("\n")
            .map((line, j) => (
              <div key={`${i}-${j}`} className={cn("px-2", p.added && "bg-success/15 text-success", p.removed && "bg-danger/15 text-danger line-through decoration-danger/40")}>
                <span className="mr-2 select-none opacity-60">{p.added ? "+" : p.removed ? "−" : " "}</span>
                {line || " "}
              </div>
            )),
        )}
      </pre>
    </div>
  );
}
