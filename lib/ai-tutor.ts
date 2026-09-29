import "server-only";
import { z } from "zod";

export const tutorSchema = z.object({
  mode: z.enum(["explain", "hint", "review", "quiz", "chat"]),
  language: z.enum(["en", "hi"]).default("en"),
  context: z
    .object({ title: z.string().max(200), kind: z.enum(["article", "problem", "lesson", "general"]), content: z.string().max(8000).optional() })
    .nullable()
    .optional(),
  code: z.string().max(20_000).optional(),
  hintLevel: z.number().int().min(1).max(4).optional(),
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) })).min(1).max(20),
});
export type TutorInput = z.infer<typeof tutorSchema>;

export function buildInstructions(input: TutorInput) {
  const lang =
    input.language === "hi"
      ? "Respond in simple Hindi (Devanagari script), keeping technical terms like 'array', 'recursion', 'O(n)' in English."
      : "Respond in clear, friendly English.";
  const ctx = input.context
    ? `The student is currently on the ${input.context.kind} "${input.context.title}".${input.context.content ? `\n\nReference material:\n"""\n${input.context.content}\n"""` : ""}`
    : "";
  const modes: Record<TutorInput["mode"], string> = {
    explain: "Explain the concept the student asks about step by step, with a tiny example and an analogy. Keep it under 250 words.",
    hint: `Give progressive hints. This is hint level ${input.hintLevel ?? 1} of 4: level 1 = a gentle nudge about what to observe; level 2 = the key insight / pattern name; level 3 = the approach in plain words with complexity; level 4 = pseudocode. NEVER give full working code or the final answer unless the student explicitly says "show me the full solution".`,
    review: "Review the student's code. Cover: correctness (with a failing edge case if any), time and space complexity, edge cases (empty input, overflow, duplicates), and style/readability. Use short bullet points. Do not rewrite the whole solution, suggest targeted fixes.",
    quiz: "Create a 5-question multiple-choice quiz from the reference material. For each question give 4 options labelled A-D, then list the answers with one-line explanations at the end under 'Answers'.",
    chat: "Answer the student's question as a patient tutor. Prefer guiding questions and hints over giving away complete solutions to practice problems.",
  };
  return `You are Kodshala Tutor, an expert, encouraging programming tutor for Indian college students. ${lang}\n${modes[input.mode]}\nUse Markdown with short paragraphs and fenced code blocks when needed.\n${ctx}`;
}

/** Deterministic mock tutor used when no AI key is configured (streams like the real one). */
export function mockTutorReply(input: TutorInput) {
  const topic = input.context?.title ?? "this topic";
  const q = input.messages[input.messages.length - 1]?.content ?? "";
  const hi = input.language === "hi";
  const note = hi
    ? "\n\n(डेमो मोड: असली AI जवाबों के लिए `OPENAI_API_KEY` जोड़ें।)"
    : "\n\n(Demo mode: add `OPENAI_API_KEY` for real AI answers.)";
  switch (input.mode) {
    case "hint": {
      const lvl = input.hintLevel ?? 1;
      const en = [
        `**Hint 1, observe.** Look at what information you need at each step of "${topic}". Is there something you keep recomputing?`,
        `**Hint 2, the pattern.** This smells like a classic pattern: think *hash map for lookups*, *two pointers on sorted data*, or *DP for overlapping subproblems*. Which one removes the repeated work?`,
        `**Hint 3, the approach.** Process the input once, maintaining a small piece of state that answers "have I seen what I need?". That brings you from O(n²) to about O(n).`,
        "**Hint 4, pseudocode.**\n```\nstate = empty\nfor each item x:\n    if state can answer the query for x:\n        record answer\n    update state with x\nreturn answer\n```",
      ];
      const hiT = [
        `**संकेत 1, ध्यान दें।** "${topic}" में हर step पर आपको कौन सी जानकारी चाहिए? क्या आप कुछ बार-बार compute कर रहे हैं?`,
        "**संकेत 2, pattern.** यह एक classic pattern जैसा है: *hash map*, *two pointers* या *DP*। कौन सा repeated work हटाता है?",
        "**संकेत 3, approach.** Input को एक बार process करें और एक छोटा state रखें। इससे O(n²) से O(n) हो जाएगा।",
        "**संकेत 4, pseudocode.**\n```\nstate = खाली\nहर x के लिए:\n    अगर state जवाब दे सकता है: answer record करें\n    state में x जोड़ें\n```",
      ];
      return (hi ? hiT : en)[lvl - 1] + note;
    }
    case "review": {
      const code = input.code ?? "";
      const loops = (code.match(/\bfor\b|\bwhile\b/g) ?? []).length;
      const nested = /for[\s\S]{0,200}for/.test(code);
      return (
        (hi ? "### Code review\n" : "### Code review\n") +
        `- **Complexity:** ${nested ? "nested loops detected → likely **O(n²)**. Consider a hash map or sorting + two pointers." : loops ? "a single pass → about **O(n)** time." : "no loops found, constant work per call."}\n` +
        "- **Edge cases:** empty input, a single element, duplicates, negative numbers and the maximum constraint size.\n" +
        `- **Style:** ${code.length > 1500 ? "consider extracting helper functions;" : "the code is compact;"} use descriptive names and avoid magic numbers.\n` +
        "- **Correctness tip:** add a quick test with the smallest possible input before submitting." +
        note
      );
    }
    case "quiz":
      return (
        `### Quiz: ${topic}\n1. What is the main idea behind ${topic}?\n   A) Brute force  B) Reuse previous work  C) Randomisation  D) None\n2. What is the typical time complexity discussed?\n   A) O(1)  B) O(log n)  C) O(n)  D) Depends on the input pattern\n3. Which data structure appears most often in this topic?\n   A) Array  B) Hash map  C) Queue  D) Tree\n4. Which is an edge case you should test?\n   A) Empty input  B) Sorted input  C) Duplicates  D) All of these\n5. When should you avoid this technique?\n   A) When constraints are tiny  B) When the input has no structure to exploit  C) Never  D) Always\n\n**Answers:** 1-B, 2-D, 3-B, 4-D, 5-B, review the article sections for each.` +
        note
      );
    default:
      return (
        (hi
          ? `अच्छा सवाल! "${q.slice(0, 80)}" को समझने के लिए पहले छोटे example से शुरू करें। ${topic} का मूल विचार है: काम को छोटे हिस्सों में बाँटें और पहले से किए गए काम को दोबारा न करें।\n\n**उदाहरण:** array [2, 7, 11, 15] और target 9 में, हर संख्या के लिए देखें कि (target − x) पहले मिल चुका है या नहीं।`
          : `Great question! Let's break down "${q.slice(0, 80)}".\n\n**Core idea of ${topic}:** split the problem into small steps and never redo work you've already done.\n\n**Tiny example:** for [2, 7, 11, 15] with target 9, at each number ask "have I already seen target − x?", a hash map answers that in O(1).\n\n**Analogy:** it's like keeping a guest list at the door instead of searching the whole party every time someone arrives.`) + note
      );
  }
}

/** Streams a string word-by-word as a text/plain response (mock mode). */
export function streamText(text: string) {
  const encoder = new TextEncoder();
  const parts = text.split(/(\s+)/);
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const p of parts) {
        controller.enqueue(encoder.encode(p));
        await new Promise((r) => setTimeout(r, 18));
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "X-Tutor-Mode": "mock" } });
}
