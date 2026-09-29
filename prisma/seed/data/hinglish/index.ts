import type { HinglishArticle } from "./types";
import { dsaHinglish1 } from "./articles-dsa-1";
import { dsaHinglish2, dsaQuizHinglish1 } from "./articles-dsa-2";
import { langHinglish } from "./articles-lang";
import { webDbHinglish } from "./articles-web-db";
import { osBlogHinglish } from "./articles-os-blog";

const withQuiz = (a: Record<string, HinglishArticle>, q: Record<string, NonNullable<HinglishArticle["quiz"]>>) =>
  Object.fromEntries(Object.entries(a).map(([slug, h]) => [slug, q[slug] ? { ...h, quiz: q[slug] } : h]));

export const hinglishArticles: Record<string, HinglishArticle> = {
  ...withQuiz(dsaHinglish1, dsaQuizHinglish1),
  ...dsaHinglish2,
  ...langHinglish,
  ...webDbHinglish,
  ...osBlogHinglish,
};

/** Split Markdown into [prose, code, prose, code, …]; code fences stay byte-for-byte identical. */
export const splitMarkdown = (md: string) => md.split(/(```[\s\S]*?```)/g);

/** Builds the Hinglish article body by swapping translated prose chunks into the English skeleton. */
export function buildHinglishContent(english: string, h: HinglishArticle) {
  return splitMarkdown(english)
    .map((part, i) => (i % 2 === 0 && h.parts[i] !== undefined ? h.parts[i] : part))
    .join("");
}
