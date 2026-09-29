"use server";

import { customAlphabet } from "nanoid";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { snippetSchema } from "@/lib/validators/code";
import { rateLimit } from "@/lib/rate-limit";

const shareId = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 10);

export async function getEditorial(problemId: string) {
  z.string().min(1).max(40).parse(problemId);
  const user = await getCurrentUser();
  if (!user) return { unlocked: false as const, reason: "Log in and solve the problem to unlock the editorial." };
  const solved = await db.submission.findFirst({ where: { userId: user.id, problemId, verdict: "ACCEPTED" }, select: { id: true } });
  if (!solved && user.role === "STUDENT") return { unlocked: false as const, reason: "Solve the problem to unlock the editorial." };
  const p = await db.problem.findUnique({ where: { id: problemId }, select: { editorial: true, solutionCode: true } });
  const solution = (p?.solutionCode as Record<string, string> | null)?.PYTHON ?? null;
  return { unlocked: true as const, editorial: p?.editorial ?? "", solution };
}

export async function saveSnippet(input: z.input<typeof snippetSchema>) {
  const data = snippetSchema.safeParse(input);
  if (!data.success) return { ok: false as const, error: data.error.issues[0]?.message ?? "Invalid snippet" };
  const user = await getCurrentUser();
  if (!rateLimit(`snip:${user?.id ?? "anon"}`, 10, 60_000).success) return { ok: false as const, error: "Too many snippets, slow down." };
  const s = await db.snippet.create({ data: { ...data.data, shareId: shareId(), userId: user?.id } });
  return { ok: true as const, shareId: s.shareId };
}

export async function getSheetProgress(sheetId: string) {
  const user = await getCurrentUser();
  if (!user) return { signedIn: false, solved: [] as string[] };
  const items = await db.sheetItem.findMany({ where: { sheetId }, select: { problemId: true } });
  const solved = await db.submission.findMany({
    where: { userId: user.id, verdict: "ACCEPTED", problemId: { in: items.map((i) => i.problemId) } },
    select: { problemId: true },
    distinct: ["problemId"],
  });
  return { signedIn: true, solved: solved.map((s) => s.problemId as string) };
}
