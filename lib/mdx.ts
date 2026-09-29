import "server-only";
import GithubSlugger from "github-slugger";
import { createHighlighter, type Highlighter } from "shiki";

export type CodeBlockData = { lang: string; label: string; code: string; html: string };
export type TocItem = { id: string; text: string; level: 2 | 3 };
export type PreparedMdx = { source: string; blocks: CodeBlockData[]; tabs: number[][]; toc: TocItem[] };

const LANGS = ["cpp", "c", "java", "python", "javascript", "typescript", "go", "sql", "html", "css", "http", "bash", "json", "text"] as const;
const LABELS: Record<string, string> = {
  cpp: "C++",
  c: "C",
  java: "Java",
  python: "Python",
  javascript: "JavaScript",
  typescript: "TypeScript",
  go: "Go",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  http: "HTTP",
  bash: "Bash",
  json: "JSON",
  text: "Text",
};

let highlighterPromise: Promise<Highlighter> | null = null;
function getHighlighter() {
  highlighterPromise ??= createHighlighter({ themes: ["github-light", "github-dark-dimmed"], langs: [...LANGS] });
  return highlighterPromise;
}

export async function highlight(code: string, lang: string) {
  const hl = await getHighlighter();
  const safeLang = (LANGS as readonly string[]).includes(lang) ? lang : "text";
  return hl.codeToHtml(code, { lang: safeLang, themes: { light: "github-light", dark: "github-dark-dimmed" }, defaultColor: "light" });
}

const FENCE = /```([a-z0-9+#-]*)\n([\s\S]*?)```/g;

/**
 * Pre-processes article MDX:
 * - every fenced code block → <CodeBlock id="n" /> with Shiki HTML rendered on the server
 * - <CodeTabs> … </CodeTabs> groups → <CodeTabs id="k" /> (a language-tab group)
 * - extracts the ## / ### headings for the table of contents (ids match rehype-slug, including `idPrefix`)
 * Code never goes through the MDX parser, so braces/angle brackets inside code are safe.
 */
export async function prepareMdx(content: string, { idPrefix = "" }: { idPrefix?: string } = {}): Promise<PreparedMdx> {
  const blocks: CodeBlockData[] = [];
  const tabs: number[][] = [];
  const raw: { lang: string; code: string }[] = [];

  let source = content.replace(FENCE, (_m, lang: string, code: string) => {
    const l = (lang || "text").toLowerCase();
    raw.push({ lang: l === "js" ? "javascript" : l === "py" ? "python" : l, code: code.replace(/\n$/, "") });
    return `<CodeBlock id="${raw.length - 1}" />`;
  });

  source = source.replace(/<CodeTabs>([\s\S]*?)<\/CodeTabs>/g, (_m, inner: string) => {
    const ids = [...inner.matchAll(/<CodeBlock id="(\d+)" \/>/g)].map((m) => Number(m[1]));
    tabs.push(ids);
    return `<CodeTabs id="${tabs.length - 1}" />`;
  });

  for (const b of raw) {
    blocks.push({ ...b, label: LABELS[b.lang] ?? b.lang.toUpperCase(), html: await highlight(b.code, b.lang) });
  }

  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];
  const withoutCode = content.replace(FENCE, "");
  for (const line of withoutCode.split("\n")) {
    const m = /^(##|###)\s+(.+)$/.exec(line.trim());
    if (m) {
      const text = m[2].replace(/[`*_]/g, "").trim();
      toc.push({ id: idPrefix + slugger.slug(text), text, level: m[1] === "##" ? 2 : 3 });
    }
  }

  return { source, blocks, tabs, toc };
}

export function readingTimeMins(content: string) {
  return Math.max(1, Math.round(content.split(/\s+/).length / 200));
}
