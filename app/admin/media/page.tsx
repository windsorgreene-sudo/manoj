import { PageHeader, SearchForm } from "@/components/admin/ui";
import { MediaLibrary } from "@/components/admin/media-library";
import { db } from "@/lib/db";

export const metadata = { title: "Media library" };

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const sp = await searchParams;
  const items = await db.media.findMany({ where: sp.q ? { filename: { contains: sp.q, mode: "insensitive" } } : {}, orderBy: { createdAt: "desc" }, take: 200, include: { uploader: { select: { name: true } } } });
  return (
    <>
      <PageHeader title="Media library" description="Uploads go to Cloudinary when configured, otherwise public/uploads." />
      <SearchForm base="/admin/media" params={sp} placeholder="Search by filename…" />
      <MediaLibrary items={items.map((m) => ({ id: m.id, url: m.url, filename: m.filename, mimeType: m.mimeType, sizeBytes: m.sizeBytes, uploader: m.uploader?.name ?? "—", createdAt: m.createdAt.toISOString() }))} />
    </>
  );
}
