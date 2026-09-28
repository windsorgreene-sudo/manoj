import { z } from "zod";
import { LANGUAGES } from "@/lib/languages";

export const languageSchema = z.enum(LANGUAGES);

export const runSchema = z.object({
  language: languageSchema,
  code: z.string().min(1, "Write some code first").max(64_000, "Code is too long (64 KB max)"),
  stdin: z.string().max(64_000).optional().default(""),
});
export type RunInput = z.infer<typeof runSchema>;

export const problemRunSchema = z.object({
  language: languageSchema,
  code: z.string().min(1).max(64_000),
  customInput: z.string().max(64_000).optional(),
  contestId: z.string().max(40).optional(),
});
export type ProblemRunInput = z.infer<typeof problemRunSchema>;

export const snippetSchema = z.object({
  title: z.string().trim().min(1).max(80).default("Untitled snippet"),
  language: languageSchema,
  code: z.string().min(1).max(64_000),
  stdin: z.string().max(10_000).optional(),
});
