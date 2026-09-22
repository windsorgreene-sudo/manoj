import type { ContentNode } from "@/content/types";
import { CodeBlock } from "./CodeBlock";

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
  return (
    <div className="prose">
      {nodes.map((node, i) => {
        switch (node.type) {
          case "heading":
            return node.level === 2 ? (
              <h2 key={i} id={node.id}>
                {node.text}
              </h2>
            ) : (
              <h3 key={i} id={node.id}>
                {node.text}
              </h3>
            );
          case "paragraph":
            return <p key={i}>{node.text}</p>;
          case "list":
            return node.ordered ? (
              <ol key={i}>
                {node.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ol>
            ) : (
              <ul key={i}>
                {node.items.map((it, j) => (
                  <li key={j}>{it}</li>
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
                {node.text}
              </div>
            );
          case "table":
            return (
              <div key={i} className="my-5 overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      {node.headers.map((h, j) => (
                        <th key={j}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {node.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td key={c}>{cell}</td>
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
