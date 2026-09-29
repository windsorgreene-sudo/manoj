import "server-only";
import { db } from "@/lib/db";

type Target = "COMMENT" | "DOUBT" | "ANSWER";

/**
 * Casts (or clears, with value 0) a user's vote and applies the score delta atomically.
 * The target row is locked for the transaction, so concurrent votes (double clicks, parallel
 * requests) are serialised and can never be counted twice.
 */
export async function castVote(userId: string, targetType: Target, targetId: string, value: 1 | -1 | 0) {
  return db.$transaction(async (tx) => {
    if (targetType === "COMMENT") await tx.$queryRaw`SELECT id FROM "Comment" WHERE id = ${targetId} FOR UPDATE`;
    else if (targetType === "DOUBT") await tx.$queryRaw`SELECT id FROM "Doubt" WHERE id = ${targetId} FOR UPDATE`;
    else await tx.$queryRaw`SELECT id FROM "Answer" WHERE id = ${targetId} FOR UPDATE`;

    const key = { userId_targetType_targetId: { userId, targetType, targetId } };
    const existing = await tx.vote.findUnique({ where: key });
    const delta = value - (existing?.value ?? 0);
    if (value === 0) {
      if (existing) await tx.vote.delete({ where: key });
    } else if (existing) {
      if (existing.value !== value) await tx.vote.update({ where: key, data: { value } });
    } else {
      await tx.vote.create({ data: { userId, targetType, targetId, value } });
    }

    const data = { score: { increment: delta } };
    const select = { score: true } as const;
    if (targetType === "COMMENT") return (await tx.comment.update({ where: { id: targetId }, data, select })).score;
    if (targetType === "DOUBT") return (await tx.doubt.update({ where: { id: targetId }, data, select })).score;
    return (await tx.answer.update({ where: { id: targetId }, data, select })).score;
  });
}
