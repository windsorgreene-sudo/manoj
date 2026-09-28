import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Playground } from "@/components/practice/playground";
import { db } from "@/lib/db";
import type { LanguageKey } from "@/lib/languages";

export const metadata: Metadata = { title: "Shared snippet", robots: { index: false } };

export default async function SharedSnippetPage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  if (!/^[a-z0-9]{6,16}$/.test(shareId)) notFound();
  const s = await db.snippet.findUnique({ where: { shareId }, include: { user: { select: { name: true } } } });
  if (!s) notFound();
  return <Playground initial={{ title: s.title, language: s.language as LanguageKey, code: s.code, stdin: s.stdin ?? "", author: s.user?.name ?? null }} />;
}
