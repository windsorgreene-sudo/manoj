import type { PrismaClient } from "../../lib/generated/prisma/client";
import { buildHinglishContent, hinglishArticles } from "./data/hinglish";
import { hinglishCourses, hinglishProblems, hinglishQuizDescriptions } from "./data/hinglish/catalog";

/** Fills the *Hinglish columns from prisma/seed/data/hinglish (matched by slug). Never touches English content. */
export async function syncHinglish(db: PrismaClient) {
  let a = 0, q = 0, p = 0, c = 0;
  for (const [slug, h] of Object.entries(hinglishArticles)) {
    const art = await db.article.findUnique({ where: { slug }, select: { id: true, content: true } });
    if (!art) continue;
    await db.article.update({ where: { id: art.id }, data: { excerptHinglish: h.excerpt, contentHinglish: buildHinglishContent(art.content, h) } });
    a++;
    if (h.quiz) {
      const quiz = await db.quiz.findFirst({ where: { articleId: art.id }, include: { questions: { orderBy: { order: "asc" } } } });
      for (const [i, question] of (quiz?.questions ?? []).entries()) {
        const hq = h.quiz[i];
        if (!hq) continue;
        // Mock tests and topic quizzes reuse these questions, so update every copy with the same English prompt.
        const r = await db.question.updateMany({ where: { prompt: question.prompt, options: { equals: question.options } }, data: { promptHinglish: hq.q, optionsHinglish: hq.options.length === question.options.length ? hq.options : [], explanationHinglish: hq.explanation } });
        q += r.count;
      }
    }
  }
  for (const [slug, h] of Object.entries(hinglishProblems)) {
    const prob = await db.problem.findUnique({ where: { slug }, select: { id: true } });
    if (!prob) continue;
    await db.problem.update({ where: { id: prob.id }, data: { statementHinglish: h.statement, inputFormatHinglish: h.inputFormat ?? null, outputFormatHinglish: h.outputFormat ?? null, constraintsHinglish: h.constraints ?? null, editorialHinglish: h.editorial ?? null, hintsHinglish: h.hints ?? [] } });
    const samples = await db.testCase.findMany({ where: { problemId: prob.id, isSample: true }, orderBy: { order: "asc" }, select: { id: true } });
    for (const [i, t] of samples.entries()) if (h.sampleExplanations?.[i]) await db.testCase.update({ where: { id: t.id }, data: { explanationHinglish: h.sampleExplanations[i] } });
    p++;
  }
  for (const [slug, h] of Object.entries(hinglishCourses)) {
    const r = await db.course.updateMany({ where: { slug }, data: { subtitleHinglish: h.subtitle, descriptionHinglish: h.description, outcomesHinglish: h.outcomes } });
    c += r.count;
  }
  for (const [slug, description] of Object.entries(hinglishQuizDescriptions)) await db.quiz.updateMany({ where: { slug }, data: { descriptionHinglish: description } });
  return `${a} articles, ${q} quiz questions, ${p} problems, ${c} courses`;
}
