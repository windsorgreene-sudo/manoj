"use client";

import { useState } from "react";
import type { CodeBlockData } from "@/lib/mdx";
import { CodeFrame } from "@/components/content/code-block";
import { cn } from "@/lib/utils";
import { usePrefsStore } from "@/lib/stores/prefs-store";

/** Language tabs (C++ / Java / Python / JS …). The chosen language is remembered across the site. */
export function CodeTabs({ blocks, tryIt = true }: { blocks: CodeBlockData[]; tryIt?: boolean }) {
  const preferred = usePrefsStore((s) => s.codeLang);
  const setPreferred = usePrefsStore((s) => s.setCodeLang);
  const [local, setLocal] = useState<string | null>(null);
  const active = blocks.find((b) => b.lang === (local ?? preferred)) ?? blocks[0];

  const header = (
    <div role="tablist" aria-label="Code language" className="-my-1 flex gap-1 overflow-x-auto">
      {blocks.map((b) => (
        <button
          key={b.lang}
          role="tab"
          type="button"
          aria-selected={b === active}
          onClick={() => {
            setLocal(b.lang);
            setPreferred(b.lang);
          }}
          className={cn(
            "rounded-lg px-2.5 py-1 font-mono text-xs transition-colors",
            b === active ? "bg-brand/20 text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {b.label}
        </button>
      ))}
    </div>
  );

  return <CodeFrame block={active} tryIt={tryIt} header={header} />;
}
