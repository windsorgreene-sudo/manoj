import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { integrations } from "@/lib/env";

export const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"] as const;
export const MAX_BYTES = 5 * 1024 * 1024;

/** File extension per allowed MIME type. Never trust the client-supplied filename. */
const EXT: Record<(typeof ALLOWED_TYPES)[number], string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "application/pdf": "pdf" };

/** Checks the file's magic bytes against its declared MIME type (the header is client-controlled). */
export function matchesSignature(buf: Buffer, type: string) {
  const starts = (sig: number[], offset = 0) => sig.every((b, i) => buf[offset + i] === b);
  switch (type) {
    case "image/png":
      return starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "image/jpeg":
      return starts([0xff, 0xd8, 0xff]);
    case "image/gif":
      return starts([0x47, 0x49, 0x46, 0x38]);
    case "image/webp":
      return starts([0x52, 0x49, 0x46, 0x46]) && starts([0x57, 0x45, 0x42, 0x50], 8);
    case "application/pdf":
      return starts([0x25, 0x50, 0x44, 0x46]);
    default:
      return false;
  }
}

export type Stored = { url: string; publicId: string | null; width?: number; height?: number };

export class UnsupportedFileError extends Error {
  constructor() {
    super("File content does not match an allowed type");
  }
}

/** Stores a file on Cloudinary when configured, otherwise under public/uploads (local fallback). */
export async function storeFile(file: File, folder = "kodshala"): Promise<Stored> {
  const buf = Buffer.from(await file.arrayBuffer());
  if (!matchesSignature(buf, file.type)) throw new UnsupportedFileError();
  if (integrations.cloudinary()) {
    if (!process.env.CLOUDINARY_URL) {
      cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
    }
    const res = await new Promise<{ secure_url: string; public_id: string; width?: number; height?: number }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder, resource_type: "auto" }, (err, r) => (err || !r ? reject(err ?? new Error("upload failed")) : resolve(r)))
        .end(buf);
    });
    return { url: res.secure_url, publicId: res.public_id, width: res.width, height: res.height };
  }
  const ext = EXT[file.type as keyof typeof EXT];
  if (!ext) throw new UnsupportedFileError();
  const name = `${randomUUID()}.${ext}`;
  const dir = join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, name), buf);
  return { url: `/uploads/${name}`, publicId: null };
}

export async function deleteStored(publicId: string | null, url: string) {
  if (publicId && integrations.cloudinary()) {
    await cloudinary.uploader.destroy(publicId).catch(() => undefined);
    return;
  }
  if (url.startsWith("/uploads/")) {
    const { unlink } = await import("node:fs/promises");
    await unlink(join(process.cwd(), "public", url)).catch(() => undefined);
  }
}
