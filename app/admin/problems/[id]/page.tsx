import { notFound } from "next/navigation";
import { ProblemEditor } from "@/components/admin/problem-editor";
import { db } from "@/lib/db";
import { LANGUAGES, type LanguageKey } from "@/lib/languages";
import type { ProblemInput } from "@/lib/actions/admin/problems";

export const metadata = { title: "Edit problem" };

export default async function AdminProblemEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "new") {
    const tpl = await db.problem.findFirst({ select: { starterCode: true } });
    const starter = (tpl?.starterCode as Record<LanguageKey, string> | null) ?? (Object.fromEntries(LANGUAGES.map((l) => [l, ""])) as Record<LanguageKey, string>);
    const blank: ProblemInput = { slug: "", title: "", statement: "", constraints: "", inputFormat: "", outputFormat: "", difficulty: "EASY", topics: [], companies: [], hints: [], editorial: "", starterCode: starter, timeLimitMs: 2000, memoryLimitMb: 256, status: "DRAFT", testCases: [{ input: "", expected: "", isSample: true }] };
    return <ProblemEditor initial={blank} />;
  }
  const p = await db.problem.findUnique({ where: { id }, include: { testCases: { orderBy: [{ isSample: "desc" }, { order: "asc" }] } } });
  if (!p) notFound();
  const initial: ProblemInput = {
    id: p.id, slug: p.slug, title: p.title, statement: p.statement, constraints: p.constraints, inputFormat: p.inputFormat ?? "", outputFormat: p.outputFormat ?? "", difficulty: p.difficulty,
    topics: p.topics, companies: p.companies, hints: p.hints, editorial: p.editorial ?? "", starterCode: p.starterCode as Record<LanguageKey, string>,
    timeLimitMs: p.timeLimitMs, memoryLimitMb: p.memoryLimitMb, status: p.status === "PUBLISHED" || p.status === "ARCHIVED" ? p.status : "DRAFT",
    testCases: p.testCases.map((t) => ({ input: t.input, expected: t.expected, isSample: t.isSample, explanation: t.explanation })),
  };
  return <ProblemEditor initial={initial} />;
}
