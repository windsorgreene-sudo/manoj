import { NotesBoard } from "@/components/dashboard/notes-board";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Notes & Highlights" };

export default async function NotesPage() {
  const user = await requireUser();
  const notes = await db.note.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, include: { article: { select: { slug: true, title: true } } } });
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">Notes & highlights</h1>
      <NotesBoard notes={notes.map((n) => ({ id: n.id, body: n.body, highlight: n.highlight, color: n.color, createdAt: n.createdAt.toISOString(), article: n.article }))} />
    </div>
  );
}
