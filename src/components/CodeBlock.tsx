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
    <figure className="my-5 overflow-hidden rounded-md border border-[#2b323c]">
      <div className="flex items-center justify-between bg-[#232833] px-3 py-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-[#9aa4b2]">
          {label}
        </span>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-[12px] text-[#c2cad4] hover:bg-white/10"
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
        <figcaption className="border-t border-[#2b323c] bg-[#232833] px-3 py-1.5 text-[12px] text-[#9aa4b2]">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
