import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";

/** Redirects to a random published problem (optionally filtered by difficulty). */
export async function GET(req: NextRequest) {
  const d = req.nextUrl.searchParams.get("difficulty");
  const where = { status: "PUBLISHED" as const, ...(d && ["EASY", "MEDIUM", "HARD"].includes(d) ? { difficulty: d as "EASY" } : {}) };
  const count = await db.problem.count({ where });
  if (!count) return NextResponse.redirect(new URL("/problems", req.url));
  const [p] = await db.problem.findMany({ where, skip: Math.floor(Math.random() * count), take: 1, orderBy: { id: "asc" }, select: { slug: true } });
  // The problem set can change between count and fetch.
  if (!p) return NextResponse.redirect(new URL("/problems", req.url));
  return NextResponse.redirect(new URL(`/problems/${p.slug}`, req.url));
}
