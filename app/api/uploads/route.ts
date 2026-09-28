import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { assertSameOrigin } from "@/lib/csrf";
import { getCurrentUser } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { ALLOWED_TYPES, MAX_BYTES, storeFile } from "@/lib/uploads";

/** Authenticated upload (avatars for everyone; media library for admins/contributors). */
export async function POST(req: NextRequest) {
  if (!assertSameOrigin(req)) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!rateLimit(`upload:${user.id}`, 20, 60_000).success) return NextResponse.json({ error: "Too many uploads" }, { status: 429 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File is larger than 5 MB" }, { status: 413 });
  const purpose = form?.get("purpose") === "avatar" ? "avatar" : "media";
  if (purpose === "media" && user.role === "STUDENT") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (purpose === "avatar" && !file.type.startsWith("image/")) return NextResponse.json({ error: "Avatar must be an image" }, { status: 415 });
  try {
    const stored = await storeFile(file, purpose === "avatar" ? "codeverse/avatars" : "codeverse/media");
    const media = await db.media.create({
      data: { url: stored.url, publicId: stored.publicId, filename: file.name.slice(0, 200), mimeType: file.type, sizeBytes: file.size, width: stored.width, height: stored.height, uploaderId: user.id },
    });
    if (purpose === "avatar") await db.user.update({ where: { id: user.id }, data: { image: stored.url } });
    return NextResponse.json({ url: stored.url, id: media.id });
  } catch (e) {
    console.error("[uploads]", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
