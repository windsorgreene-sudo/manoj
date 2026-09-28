"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Download, Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteNote, updateNote } from "@/lib/actions/dashboard";
import { cn, formatDate } from "@/lib/utils";

type Note = { id: string; body: string; highlight: string | null; color: string; createdAt: string; article: { slug: string; title: string } | null };
const BORDER: Record<string, string> = { purple: "border-l-brand", cyan: "border-l-cyan", amber: "border-l-warning", green: "border-l-success" };

/** Minimal, safe Markdown (bold, italics, inline code, lists) rendered as React nodes. */
function Md({ text }: { text: string }) {
  return (
    <div className="space-y-1 text-sm">
      {text.split("\n").map((line, i) => {
        const isList = /^\s*[-*]\s+/.test(line);
        const content = line.replace(/^\s*[-*]\s+/, "");
        const parts = content.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).map((p, j) =>
          p.startsWith("**") ? <strong key={j}>{p.slice(2, -2)}</strong> : p.startsWith("`") ? <code key={j} className="rounded bg-surface-2 px-1 font-mono text-xs">{p.slice(1, -1)}</code> : p.startsWith("*") && p.length > 2 ? <em key={j}>{p.slice(1, -1)}</em> : p,
        );
        return isList ? <p key={i} className="pl-4 before:mr-2 before:content-['•']">{parts}</p> : <p key={i}>{parts.length ? parts : " "}</p>;
      })}
    </div>
  );
}

export function NotesBoard({ notes }: { notes: Note[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return notes.filter((n) => !s || n.body.toLowerCase().includes(s) || n.highlight?.toLowerCase().includes(s) || n.article?.title.toLowerCase().includes(s));
  }, [notes, q]);

  if (!notes.length) return <EmptyState title="No notes yet" description="Select any text in a tutorial and click “Save as note”." action={<Button asChild className="rounded-xl"><Link href="/tutorials">Open a tutorial</Link></Button>} />;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <label htmlFor="note-search" className="sr-only">Search notes</label>
          <Input id="note-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notes and highlights…" className="h-10 rounded-xl pl-9" />
        </div>
        <Button asChild variant="outline" className="rounded-xl"><a href="/api/notes/export" download><Download /> Export PDF</a></Button>
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="No matching notes" />
      ) : (
        <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
          {filtered.map((n) => (
            <article key={n.id} className={cn("glass mb-4 break-inside-avoid border-l-4 p-4", BORDER[n.color] ?? "border-l-brand")}>
              {n.highlight ? <blockquote className="mb-2 border-l-2 border-border pl-3 text-sm italic text-muted-foreground">“{n.highlight}”</blockquote> : null}
              {editing === n.id ? (
                <div className="space-y-2">
                  <label htmlFor={`edit-${n.id}`} className="sr-only">Edit note</label>
                  <Textarea id={`edit-${n.id}`} rows={4} value={draft} onChange={(e) => setDraft(e.target.value)} className="rounded-xl" />
                  <div className="flex gap-2">
                    <Button size="sm" className="rounded-lg" onClick={async () => { const r = await updateNote({ id: n.id, body: draft }); if (r.ok) { setEditing(null); router.refresh(); } else toast.error(r.error); }}>Save</Button>
                    <Button size="sm" variant="ghost" className="rounded-lg" onClick={() => setEditing(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Md text={n.body} />
              )}
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                {n.article ? <Link href={`/tutorials/${n.article.slug}`} className="truncate hover:text-foreground">{n.article.title}</Link> : null}
                <span className="ml-auto">{formatDate(n.createdAt)}</span>
                <Button variant="ghost" size="icon-xs" aria-label="Edit note" onClick={() => { setEditing(n.id); setDraft(n.body); }}><Pencil /></Button>
                <Button variant="ghost" size="icon-xs" aria-label="Delete note" onClick={async () => { const r = await deleteNote(n.id); if (r.ok) { toast.success("Note deleted"); router.refresh(); } else toast.error(r.error); }}><Trash2 /></Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
