"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Check, Copy, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CodeBlockData } from "@/lib/mdx";
import { RUNNABLE, toLanguage } from "@/lib/languages";

// The Monaco-powered editor is only downloaded when a reader clicks "Try it Yourself".
const TryItDialog = dynamic(() => import("@/components/editor/try-it-dialog").then((m) => m.TryItDialog), { ssr: false });

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="rounded-lg"
      aria-label={copied ? "Copied" : "Copy code"}
      onClick={async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check className="text-success" /> : <Copy />}
    </Button>
  );
}

export function TryItButton({ code, lang }: { code: string; lang: string }) {
  const [open, setOpen] = useState(false);
  const language = toLanguage(lang);
  if (!language || !RUNNABLE.includes(language)) return null;
  return (
    <>
      <Button size="sm" variant="secondary" className="h-7 gap-1.5 rounded-lg text-xs" onClick={() => setOpen(true)}>
        <Play className="size-3" /> Try it Yourself
      </Button>
      {open ? <TryItDialog open={open} onOpenChange={setOpen} initialCode={code} initialLanguage={language} /> : null}
    </>
  );
}

export function CodeFrame({ block, tryIt, header }: { block: CodeBlockData; tryIt: boolean; header?: React.ReactNode }) {
  return (
    <div className="glass my-6 overflow-hidden rounded-2xl !shadow-none">
      <div className="flex items-center gap-2 border-b border-border px-3 py-1.5">
        {header ?? <span className="font-mono text-xs text-muted-foreground">{block.label}</span>}
        <div className="ml-auto flex items-center gap-1">
          {tryIt ? <TryItButton code={block.code} lang={block.lang} /> : null}
          <CopyButton code={block.code} />
        </div>
      </div>
      <div className="[&_pre]:!m-0 [&_pre]:!rounded-none [&_pre]:!bg-transparent" dangerouslySetInnerHTML={{ __html: block.html }} />
    </div>
  );
}

export function CodeBlock({ block, tryIt = true }: { block: CodeBlockData; tryIt?: boolean }) {
  return <CodeFrame block={block} tryIt={tryIt} />;
}
