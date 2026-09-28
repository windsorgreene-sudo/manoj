import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MdxContent } from "@/components/content/mdx-content";
import { ProblemWorkspace } from "@/components/practice/problem-workspace";
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld";
import { db } from "@/lib/db";
import { getProblemForWorkspace } from "@/lib/queries/problems";
import { appUrl } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await db.problem.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } })).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getProblemForWorkspace((await params).slug);
  if (!p) return {};
  const description = `${p.difficulty[0] + p.difficulty.slice(1).toLowerCase()} · ${p.topics.join(", ")}. ${p.statement.replace(/[*`#]/g, "").slice(0, 140)}`;
  return { title: `${p.number}. ${p.title}`, description, alternates: { canonical: `/problems/${p.slug}` } };
}

const fence = "```";

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProblemForWorkspace((await params).slug);
  if (!p) notFound();
  const md = [
    p.statement,
    p.inputFormat ? `### Input format\n\n${p.inputFormat}` : "",
    p.outputFormat ? `### Output format\n\n${p.outputFormat}` : "",
    ...p.testCases.map((t, i) => `### Example ${i + 1}\n\n**Input**\n\n${fence}text\n${t.input}\n${fence}\n\n**Output**\n\n${fence}text\n${t.expected}\n${fence}\n\n${t.explanation ? `**Explanation:** ${t.explanation}` : ""}`),
    `### Constraints\n\n${p.constraints}`,
  ]
    .filter(Boolean)
    .join("\n\n");
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", url: appUrl() }, { name: "Problems", url: `${appUrl()}/problems` }, { name: p.title, url: `${appUrl()}/problems/${p.slug}` }])} />
      <Suspense fallback={<div className="shimmer h-[calc(100dvh-4rem)]" />}>
        <ProblemWorkspace
          problem={{
            id: p.id,
            number: p.number,
            slug: p.slug,
            title: p.title,
            difficulty: p.difficulty,
            topics: p.topics,
            companies: p.companies,
            hints: p.hints,
            starterCode: p.starterCode as Record<string, string>,
            isPremium: p.isPremium,
            samples: p.testCases.map((t) => ({ id: t.id, input: t.input, expected: t.expected })),
            totalTests: p._count.testCases,
            timeLimitMs: p.timeLimitMs,
            memoryLimitMb: p.memoryLimitMb,
            plainStatement: p.statement.slice(0, 3000),
          }}
          description={<MdxContent content={md} tryIt={false} />}
        />
      </Suspense>
    </>
  );
}
