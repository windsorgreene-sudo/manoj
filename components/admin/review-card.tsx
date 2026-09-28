"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2, MessageSquareWarning, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reviewArticle } from "@/lib/actions/admin/articles";

export function ReviewCard({ id, title, meta, excerpt, editHref }: { id: string; title: string; meta: string; excerpt: string; editHref: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const decide = async (decision: "approve" | "changes" | "reject") => {
    setBusy(decision);
    const r = await reviewArticle({ id, decision, note: note || undefined });
    setBusy(null);
    if (r.ok) {
      toast.success(decision === "approve" ? "Published" : decision === "changes" ? "Changes requested" : "Rejected");
      router.refresh();
    } else toast.error(r.error);
  };
  return (
    <article className="glass space-y-3 p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{meta}</p>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-xl"><Link href={editHref}>Open in editor</Link></Button>
      </div>
      <p className="text-sm text-muted-foreground">{excerpt}</p>
      <label htmlFor={`note-${id}`} className="sr-only">Comment for the author</label>
      <Textarea id={`note-${id}`} rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Comment for the author (required for changes / reject)" className="rounded-xl" />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" className="rounded-xl bg-success text-black hover:bg-success/90" disabled={Boolean(busy)} onClick={() => decide("approve")}>{busy === "approve" ? <Loader2 className="animate-spin" /> : <Check />} Approve & publish</Button>
        <Button size="sm" variant="outline" className="rounded-xl" disabled={Boolean(busy)} onClick={() => decide("changes")}>{busy === "changes" ? <Loader2 className="animate-spin" /> : <MessageSquareWarning />} Request changes</Button>
        <Button size="sm" variant="ghost" className="rounded-xl text-danger" disabled={Boolean(busy)} onClick={() => decide("reject")}>{busy === "reject" ? <Loader2 className="animate-spin" /> : <X />} Reject</Button>
      </div>
    </article>
  );
}
