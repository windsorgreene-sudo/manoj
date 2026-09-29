import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { audit } from "@/lib/admin";

const esc = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  // Neutralise spreadsheet formula injection and quote.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const role = req.nextUrl.searchParams.get("role") ?? "";
  const rows = await db.user.findMany({
    where: { ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } : {}), ...(role ? { role: role as "STUDENT" } : {}) },
    orderBy: { createdAt: "desc" },
    take: 50_000,
    select: { id: true, name: true, email: true, username: true, role: true, banned: true, emailVerified: true, createdAt: true, lastActiveAt: true, profile: { select: { xp: true, level: true, contestRating: true, college: true } } },
  });
  const header = ["id", "name", "email", "username", "role", "banned", "verified", "xp", "level", "rating", "college", "created_at", "last_active_at"];
  const lines = rows.map((r) => [r.id, r.name, r.email, r.username, r.role, r.banned, r.emailVerified, r.profile?.xp, r.profile?.level, r.profile?.contestRating, r.profile?.college, r.createdAt.toISOString(), r.lastActiveAt?.toISOString()].map(esc).join(","));
  await audit(user, "users.export", "User", null, { count: rows.length });
  return new NextResponse([header.join(","), ...lines].join("\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="kodshala-users-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" },
  });
}
