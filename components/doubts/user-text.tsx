import { Fragment } from "react";

/**
 * Safe renderer for user-written text: supports ``` fenced code blocks and `inline code`.
 * No HTML is ever interpreted, everything is rendered as React text nodes.
 */
export function UserText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/```[a-zA-Z0-9+#-]*\n?([\s\S]*?)```/g);
  return (
    <div className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <pre key={i} className="my-3 overflow-x-auto rounded-xl border border-border bg-muted/40 p-4 font-mono text-[13px] leading-relaxed">
            <code>{part.replace(/\n$/, "")}</code>
          </pre>
        ) : (
          <p key={i} className="whitespace-pre-wrap break-words leading-relaxed">
            {part.split(/`([^`\n]+)`/g).map((seg, j) =>
              j % 2 === 1 ? (
                <code key={j} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">{seg}</code>
              ) : (
                <Fragment key={j}>{seg}</Fragment>
              ),
            )}
          </p>
        ),
      )}
    </div>
  );
}
