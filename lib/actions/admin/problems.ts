"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { adminAction, audit, slugSchema } from "@/lib/admin";
import { LANGUAGES } from "@/lib/languages";

const testSchema = z.object({ input: z.string().max(200_000), expected: z.string().max(200_000), isSample: z.boolean(), explanation: z.string().max(1000).optional().nullable() });

const problemSchema = z.object({
  id: z.string().max(40).optional(),
  slug: slugSchema,
  title: z.string().trim().min(3).max(160),
  statement: z.string().min(10).max(50_000),
  constraints: z.string().max(5000),
  inputFormat: z.string().max(5000).optional().default(""),
  outputFormat: z.string().max(5000).optional().default(""),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  topics: z.array(z.string().trim().min(1).max(40)).max(12),
  companies: z.array(z.string().trim().min(1).max(40)).max(20),
  hints: z.array(z.string().trim().min(1).max(1000)).max(8),
  editorial: z.string().max(50_000).optional().default(""),
  starterCode: z.record(z.enum(LANGUAGES), z.string().max(20_000)),
  timeLimitMs: z.number().int().min(250).max(15_000),
  memoryLimitMb: z.number().int().min(16).max(512),
  isPremium: z.boolean(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  testCases: z.array(testSchema).min(1, "Add at least one test case").max(200),
});
export type ProblemInput = z.input<typeof problemSchema>;

export async function saveProblem(input: ProblemInput) {
  return adminAction(async (actor) => {
    const d = problemSchema.parse(input);
    if (!d.testCases.some((t) => t.isSample)) throw new Error("USER:Mark at least one test case as a sample.");
    const { id, testCases, ...data } = d;
    const tests = testCases.map((t, i) => ({ input: t.input, expected: t.expected, isSample: t.isSample, explanation: t.explanation ?? null, order: i }));
    let problemId = id;
    if (id) {
      await db.$transaction([db.problem.update({ where: { id }, data }), db.testCase.deleteMany({ where: { problemId: id } }), db.testCase.createMany({ data: tests.map((t) => ({ ...t, problemId: id })) })]);
    } else {
      const max = await db.problem.aggregate({ _max: { number: true } });
      const p = await db.problem.create({ data: { ...data, number: (max._max.number ?? 0) + 1, testCases: { create: tests } } });
      problemId = p.id;
    }
    await audit(actor, id ? "problem.update" : "problem.create", "Problem", d.slug, { tests: tests.length });
    revalidatePath(`/problems/${d.slug}`);
    revalidatePath("/problems");
    return { id: problemId as string };
  });
}

export async function deleteProblem(id: string) {
  return adminAction(async (actor) => {
    const p = await db.problem.delete({ where: { id: z.string().max(40).parse(id) } });
    await audit(actor, "problem.delete", "Problem", p.slug);
    revalidatePath("/problems");
    return null;
  });
}
