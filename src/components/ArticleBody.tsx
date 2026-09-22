"use client";

import type { ContentNode } from "@/content/types";
import { t } from "@/content/types";
import { CodeBlock } from "./CodeBlock";
import { useLanguage } from "./LanguageProvider";

const NOTE_STYLE = {
  info: "border-primary bg-primary-soft",
  tip: "border-ok bg-ok-soft",
  warning: "border-warn bg-warn-soft",
} as const;

const NOTE_LABEL_STYLE = {
  info: "text-primary",
  tip: "text-ok",
  warning: "text-warn",
} as const;

const NOTE_LABEL = { info: "Note", tip: "Tip", warning: "Watch out" } as const;

export function ArticleBody({ nodes }: { nodes: ContentNode[] }) {
  const { lang } = useLanguage();
  return (
    <div className="prose">
      {nodes.map((node, i) => {
        switch (node.type) {
          case "heading":
            return node.level === 2 ? (
              <h2 key={i} id={node.id}>
                {t(node.text, lang)}
              </h2>
            ) : (
              <h3 key={i} id={node.id}>
                {t(node.text, lang)}
              </h3>
            );
          case "paragraph":
            return <p key={i}>{t(node.text, lang)}</p>;
          case "list":
            return node.ordered ? (
              <ol key={i}>
                {node.items.map((it, j) => (
                  <li key={j}>{t(it, lang)}</li>
                ))}
              </ol>
            ) : (
              <ul key={i}>
                {node.items.map((it, j) => (
                  <li key={j}>{t(it, lang)}</li>
                ))}
              </ul>
            );
          case "code":
            return <CodeBlock key={i} block={node.block} />;
          case "note":
            return (
              <div
                key={i}
                className={`my-5 rounded-lg border-l-4 px-4 py-3 text-[15px] ${NOTE_STYLE[node.variant]}`}
              >
                <span
                  className={`mb-1 block text-xs font-bold uppercase tracking-wide ${NOTE_LABEL_STYLE[node.variant]}`}
                >
                  {NOTE_LABEL[node.variant]}
                </span>
                {t(node.text, lang)}
              </div>
            );
          case "keypoints":
            return (
              <aside
                key={i}
                className="my-6 rounded-lg border border-primary/30 bg-primary-soft p-4"
              >
                <p className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">
                  {node.title ? t(node.title, lang) : "Key points"}
                </p>
                <ul className="ml-4 list-disc space-y-1.5 text-[15px]">
                  {node.items.map((it, j) => (
                    <li key={j}>{t(it, lang)}</li>
                  ))}
                </ul>
              </aside>
            );
          case "table":
            return (
              <div key={i} className="my-5 overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      {node.headers.map((h, j) => (
                        <th key={j}>{t(h, lang)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {node.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td key={c}>{t(cell, lang)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
