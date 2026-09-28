"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Copy, FileText, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ActionButton } from "@/components/admin/action-button";
import { deleteMedia } from "@/lib/actions/admin/platform";
import { formatDate } from "@/lib/utils";

type M = { id: string; url: string; filename: string; mimeType: string; sizeBytes: number; uploader: string; createdAt: string };

export function MediaLibrary({ items }: { items: M[] }) {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const upload = async (files: FileList) => {
    setBusy(true);
    for (const f of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", f);
      fd.append("purpose", "media");
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const j = (await res.json()) as { error?: string };
      if (!res.ok) toast.error(`${f.name}: ${j.error ?? "failed"}`);
    }
    setBusy(false);
    toast.success("Upload complete");
    router.refresh();
  };
  return (
    <div className="space-y-4">
      <div
        className="glass flex flex-col items-center gap-2 border-2 border-dashed border-border p-8 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length) void upload(e.dataTransfer.files);
        }}
      >
        <Upload className="size-8 text-muted-foreground" />
        <p className="text-sm">Drag & drop images or PDFs here (max 5 MB each)</p>
        <input ref={ref} type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif,application/pdf" className="sr-only" aria-label="Upload files" onChange={(e) => e.target.files && upload(e.target.files)} />
        <Button onClick={() => ref.current?.click()} disabled={busy} className="rounded-xl">{busy ? <Loader2 className="animate-spin" /> : <Upload />} Choose files</Button>
      </div>
      {items.length === 0 ? (
        <EmptyState title="No media yet" />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((m) => (
            <li key={m.id} className="glass overflow-hidden">
              <div className="grid aspect-video place-items-center bg-surface-2">
                {m.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-uploaded sizes; thumbnails only
                  <img src={m.url} alt={m.filename} loading="lazy" className="size-full object-cover" />
                ) : (
                  <FileText className="size-8 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-1 p-2 text-xs">
                <p className="truncate font-medium" title={m.filename}>{m.filename}</p>
                <p className="text-muted-foreground">{(m.sizeBytes / 1024).toFixed(0)} KB · {m.uploader} · {formatDate(m.createdAt)}</p>
                <div className="flex gap-1">
                  <Button size="xs" variant="ghost" onClick={async () => { await navigator.clipboard.writeText(m.url); toast.success("URL copied"); }}><Copy /> URL</Button>
                  <ActionButton size="xs" variant="ghost" className="text-danger" action={deleteMedia.bind(null, m.id)} confirm={`Delete ${m.filename}?`} success="Deleted">Delete</ActionButton>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
