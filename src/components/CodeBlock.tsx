"use client";

import { useState } from "react";
import type { CodeBlock as CodeBlockData } from "@/content/types";
import { CopyIcon, CheckIcon } from "./icons";
import { highlight } from "@/lib/highlight";

const LANG_LABEL: Record<string, string> = {
  python: "Python",
  java: "Java",
  cpp: "C++",
  c: "C",
  csharp: "C#",
  sql: "SQL",
  javascript: "JavaScript",
  bash: "Bash",
  text: "Text",
};

export function CodeBlock({ block, showLineNumbers = true }: { block: CodeBlockData; showLineNumbers?: boolean }) {
  const [copied, setCopied] = useState(false);
  const lines = block.code.replace(/\n$/, "").split("\n");
  const label = LANG_LABEL[block.language] ?? block.language;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(block.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-[#263630] shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between border-b border-white/5 bg-[#1c2822] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="ml-1 text-[11px] font-semibold uppercase tracking-wide text-[#9aa4b2]">
            {label}
          </span>
        </div>
        <button
          onClick={copy}
          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] transition-colors ${
            copied ? "bg-emerald-500/15 text-emerald-300" : "text-[#c2cad4] hover:bg-white/10"
          }`}
          aria-label="Copy code"
        >
          {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="overflow-x-auto bg-[var(--code-bg)]">
        <pre className="min-w-full py-3 text-[13.5px] leading-6">
          <code className="font-mono">
            {lines.map((line, i) => (
              <span key={i} className="grid grid-cols-[auto_1fr] px-0">
                {showLineNumbers && (
                  <span className="select-none px-3 text-right text-[#5b6675]">{i + 1}</span>
                )}
                <span
                  className="whitespace-pre pr-4 text-[var(--code-text)]"
                  dangerouslySetInnerHTML={{ __html: highlight(line, block.language) || "\u200b" }}
                />
              </span>
            ))}
          </code>
        </pre>
      </div>
      {block.caption && (
        <figcaption className="border-t border-[#263630] bg-[#1c2822] px-3 py-1.5 text-[12px] text-[#9aa4b2]">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
