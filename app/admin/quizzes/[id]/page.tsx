import { notFound } from "next/navigation";
import { QuizEditor } from "@/components/admin/catalog-editors";
import { db } from "@/lib/db";

export const metadata = { title: "Edit quiz" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "new") return <QuizEditor initial={{ slug: "", title: "", description: "", topic: "DSA", durationMins: 15, negativeMarking: false, negativeMark: 0.25, isMockTest: false, isPublished: true, questions: [{ prompt: "", options: ["", "", "", ""], correct: [0], explanation: "", marks: 1, type: "SINGLE" }] }} />;
  const q = await db.quiz.findUnique({ where: { id }, include: { questions: { orderBy: { order: "asc" } } } });
  if (!q) notFound();
  return <QuizEditor initial={{ id: q.id, slug: q.slug, title: q.title, description: q.description, topic: q.topic, durationMins: q.durationMins, negativeMarking: q.negativeMarking, negativeMark: q.negativeMark, isMockTest: q.isMockTest, isPublished: q.isPublished, questions: q.questions.map((x) => ({ prompt: x.prompt, options: x.options, correct: x.correct, explanation: x.explanation, marks: x.marks, type: x.type })) }} />;
}
