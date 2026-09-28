import { FlashcardDeck } from "@/components/dashboard/flashcard-deck";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Smart Revision" };

export default async function RevisionPage() {
  const user = await requireUser();
  const [due, total, upcoming] = await Promise.all([
    db.flashcard.findMany({ where: { userId: user.id, dueAt: { lte: new Date() } }, orderBy: { dueAt: "asc" }, take: 50 }),
    db.flashcard.count({ where: { userId: user.id } }),
    db.flashcard.findMany({ where: { userId: user.id, dueAt: { gt: new Date() } }, orderBy: { dueAt: "asc" }, take: 5, select: { id: true, front: true, dueAt: true } }),
  ]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Smart revision</h1>
        <p className="mt-1 text-sm text-muted-foreground">Flashcards generated from your bookmarked topics, scheduled with spaced repetition (SM-2). {total} cards total.</p>
      </div>
      <FlashcardDeck cards={due.map((c) => ({ id: c.id, front: c.front, back: c.back, sourceSlug: c.sourceSlug }))} upcoming={upcoming.map((u) => ({ id: u.id, front: u.front, dueAt: u.dueAt.toISOString() }))} />
    </div>
  );
}
