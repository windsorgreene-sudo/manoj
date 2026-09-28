"use client";

import { useEffect, useState, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { Highlighter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { saveNote } from "@/lib/actions/learn";
import { cn } from "@/lib/utils";

const COLORS = [
  { v: "purple", cls: "bg-brand" },
  { v: "cyan", cls: "bg-cyan" },
  { v: "amber", cls: "bg-warning" },
  { v: "green", cls: "bg-success" },
] as const;

/** Select text in the article → floating "Save as note" button → note dialog. */
export function HighlightToNote({ containerRef, articleId }: { containerRef: RefObject<HTMLElement | null>; articleId: string }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [color, setColor] = useState<(typeof COLORS)[number]["v"]>("purple");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onUp = () => {
      window.setTimeout(() => {
        const sel = window.getSelection();
        const t = sel?.toString().trim() ?? "";
        if (!sel || !t || t.length < 3 || !el.contains(sel.anchorNode)) {
          setPos(null);
          return;
        }
        const r = sel.getRangeAt(0).getBoundingClientRect();
        setText(t.slice(0, 2000));
        setPos({ x: r.left + r.width / 2, y: r.top - 8 });
      }, 10);
    };
    const onScroll = () => setPos(null);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("touchend", onUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("mouseup", onUp);
      el.removeEventListener("touchend", onUp);
      window.removeEventListener("scroll", onScroll);
    };
  }, [containerRef]);

  const save = async () => {
    setBusy(true);
    const r = await saveNote({ articleId, highlight: text, body: body || text, color });
    setBusy(false);
    if (r.ok) {
      toast.success("Saved to Notes & Highlights", { action: { label: "View", onClick: () => router.push("/dashboard/notes") } });
      setOpen(false);
      setBody("");
    } else if (!r.ok && r.unauth) toast.error("Log in to save notes");
    else toast.error(r.error);
  };

  return (
    <>
      {pos ? (
        <div className="fixed z-50 -translate-x-1/2 -translate-y-full" style={{ left: pos.x, top: pos.y }}>
          <Button
            size="sm"
            className="rounded-xl shadow-lg"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setOpen(true);
              setPos(null);
            }}
          >
            <Highlighter /> Save as note
          </Button>
        </div>
      ) : null}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Save highlight</DialogTitle>
            <DialogDescription>Add your own note (Markdown supported). You can find it later in your dashboard.</DialogDescription>
          </DialogHeader>
          <blockquote className="rounded-xl border-l-4 border-brand bg-surface-2 p-3 text-sm">{text}</blockquote>
          <label htmlFor="note-body" className="sr-only">
            Note
          </label>
          <Textarea id="note-body" rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Why is this important?" className="rounded-xl" />
          <div className="flex items-center gap-2" role="radiogroup" aria-label="Highlight color">
            {COLORS.map((c) => (
              <button
                key={c.v}
                type="button"
                role="radio"
                aria-checked={color === c.v}
                aria-label={c.v}
                onClick={() => setColor(c.v)}
                className={cn("size-6 rounded-full ring-offset-2 ring-offset-background", c.cls, color === c.v && "ring-2 ring-foreground")}
              />
            ))}
          </div>
          <DialogFooter>
            <Button onClick={save} disabled={busy} className="rounded-xl">
              {busy ? <Loader2 className="animate-spin" /> : null} Save note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
