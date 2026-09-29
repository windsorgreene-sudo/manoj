import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { prepareMdx, type CodeBlockData, type PreparedMdx } from "@/lib/mdx";
import { Callout } from "@/components/content/callout";
import { CodeBlock } from "@/components/content/code-block";
import { CodeTabs } from "@/components/content/code-tabs";

/** Server-rendered MDX with Shiki code blocks, language tabs and callouts. */
function StaticBlock({ block }: { block: CodeBlockData }) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-border">
      <div className="border-b border-border px-3 py-1.5 font-mono text-xs text-muted-foreground">{block.label}</div>
      <div className="[&_pre]:!m-0 [&_pre]:!rounded-none [&_pre]:!bg-transparent" dangerouslySetInnerHTML={{ __html: block.html }} />
    </div>
  );
}

/**
 * Server-rendered MDX with Shiki code blocks, language tabs and callouts.
 * `staticCode` renders code without client islands (used by the editor's server-action preview).
 */
/** Heading-id prefix for the Hinglish copy, so it never shares ids with the English one rendered next to it. */
export const HINGLISH_ID_PREFIX = "hi-";

export async function MdxContent({ content, prepared, tryIt = true, staticCode = false, idPrefix = "" }: { content: string; prepared?: PreparedMdx; tryIt?: boolean; staticCode?: boolean; idPrefix?: string }) {
  const { source, blocks, tabs } = prepared ?? (await prepareMdx(content));
  const staticComponents = {
    CodeBlock: ({ id }: { id: string }) => (blocks[Number(id)] ? <StaticBlock block={blocks[Number(id)]} /> : null),
    CodeTabs: ({ id }: { id: string }) => <>{tabs[Number(id)]?.map((i) => (blocks[i] ? <StaticBlock key={i} block={blocks[i]} /> : null))}</>,
    Callout,
  };
  const components = staticCode ? staticComponents : {
    CodeBlock: ({ id }: { id: string }) => {
      const b = blocks[Number(id)];
      return b ? <CodeBlock block={b} tryIt={tryIt} /> : null;
    },
    CodeTabs: ({ id }: { id: string }) => {
      const group = tabs[Number(id)]?.map((i) => blocks[i]).filter(Boolean) ?? [];
      return group.length ? <CodeTabs blocks={group} tryIt={tryIt} /> : null;
    },
    Callout,
  };
  return (
    <div className="prose-cv">
      <MDXRemote
        source={source}
        components={components}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [[rehypeSlug, { prefix: idPrefix }]] }, blockJS: true }}
      />
    </div>
  );
}
