import { NextResponse, type NextRequest } from "next/server";
import { streamText as aiStream } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { buildInstructions, mockTutorReply, streamText, tutorSchema } from "@/lib/ai-tutor";
import { integrations } from "@/lib/env";
import { assertSameOrigin } from "@/lib/csrf";
import { getCurrentUser } from "@/lib/session";
import { limits, rateLimit } from "@/lib/rate-limit";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!assertSameOrigin(req)) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Log in to chat with the AI tutor." }, { status: 401 });

  if (!rateLimit(`ai:${user.id}`, limits.ai.limit, limits.ai.windowMs).success) {
    return NextResponse.json({ error: "You're sending messages too quickly. Wait a minute." }, { status: 429 });
  }
  const unlimited = user.isPro || user.role !== "STUDENT";
  if (!unlimited && !rateLimit(`ai-day:${user.id}`, 5, 86_400_000).success) {
    return NextResponse.json({ error: "You've used your 5 free tutor messages today. Upgrade to Pro for unlimited help.", code: "UPGRADE" }, { status: 429 });
  }

  const parsed = tutorSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  const input = parsed.data;

  if (!integrations.ai()) return streamText(mockTutorReply(input));

  try {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const lastUser = input.messages[input.messages.length - 1];
    const messages = input.mode === "review" && input.code ? [...input.messages.slice(0, -1), { role: "user" as const, content: `${lastUser.content}\n\n\`\`\`\n${input.code}\n\`\`\`` }] : input.messages;
    const result = aiStream({
      model: openai(process.env.AI_MODEL ?? "gpt-4o-mini"),
      instructions: buildInstructions(input),
      messages,
      maxOutputTokens: 900,
      temperature: 0.4,
      abortSignal: req.signal,
    });
    return result.toTextStreamResponse();
  } catch (e) {
    console.error("[ai/tutor]", e);
    return streamText(mockTutorReply(input));
  }
}
