import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { prepareMdx, type PreparedMdx } from "@/lib/mdx";
import { Callout } from "@/components/content/callout";
import { CodeBlock } from "@/components/content/code-block";
import { CodeTabs } from "@/components/content/code-tabs";

/** Server-rendered MDX with Shiki code blocks, language tabs and callouts. */
export async function MdxContent({ content, prepared, tryIt = true }: { content: string; prepared?: PreparedMdx; tryIt?: boolean }) {
  const { source, blocks, tabs } = prepared ?? (await prepareMdx(content));
  const components = {
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
        options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] }, blockJS: true }}
      />
    </div>
  );
}
