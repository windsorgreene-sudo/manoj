/** Hinglish article: excerpt + replacements for prose chunks (even indices of `splitMarkdown`). */
export type HinglishArticle = { excerpt: string; parts: Record<number, string>; quiz?: { q: string; options: string[]; explanation: string }[] };

export type HinglishProblem = { statement: string; inputFormat?: string; outputFormat?: string; constraints?: string; editorial?: string; hints?: string[]; sampleExplanations?: string[] };

export type HinglishCourse = { subtitle: string; description: string; outcomes: string[] };
