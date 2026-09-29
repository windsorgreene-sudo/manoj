import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { integrations } from "@/lib/env";

export const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"] as const;
export const MAX_BYTES = 5 * 1024 * 1024;

export type Stored = { url: string; publicId: string | null; width?: number; height?: number };

/** Stores a file on Cloudinary when configured, otherwise under public/uploads (local fallback). */
export async function storeFile(file: File, folder = "kodshala"): Promise<Stored> {
  const buf = Buffer.from(await file.arrayBuffer());
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
  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "bin";
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
