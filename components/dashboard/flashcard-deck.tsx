"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, Plus, RotateCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { createFlashcard, generateFlashcards, reviewFlashcard } from "@/lib/actions/dashboard";
import { formatDate } from "@/lib/utils";

type Card = { id: string; front: string; back: string; sourceSlug: string | null };

const GRADES = [
  { g: 1, label: "Again", cls: "bg-danger text-white hover:bg-danger/90" },
  { g: 3, label: "Hard", cls: "bg-warning text-black hover:bg-warning/90" },
  { g: 4, label: "Good", cls: "bg-cyan text-black hover:bg-cyan/90" },
  { g: 5, label: "Easy", cls: "bg-success text-black hover:bg-success/90" },
];

export function FlashcardDeck({ cards, upcoming }: { cards: Card[]; upcoming: { id: string; front: string; dueAt: string }[] }) {
  const router = useRouter();
  const [queue, setQueue] = useState(cards);
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const card = queue[0];

  const generate = async () => {
    setBusy(true);
    const r = await generateFlashcards();
    setBusy(false);
    if (!r.ok) return toast.error(r.error);
    toast.success(r.data.created ? `Created ${r.data.created} new cards from your bookmarks` : "No new cards — bookmark more tutorials first");
    router.refresh();
  };
  const grade = async (g: number) => {
    if (!card) return;
    const r = await reviewFlashcard({ id: card.id, grade: g });
    if (!r.ok) return toast.error(r.error);
    toast(`Next review in ${r.data.intervalDays} day${r.data.intervalDays === 1 ? "" : "s"}`);
    setFlipped(false);
    setQueue((q) => (g < 3 ? [...q.slice(1), card] : q.slice(1)));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted-foreground">{queue.length} due now</p>
          <Button variant="outline" size="sm" className="ml-auto rounded-xl" onClick={generate} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <Sparkles />} Generate from bookmarks
          </Button>
        </div>
        {card ? (
          <>
            <button type="button" onClick={() => setFlipped(!flipped)} className="block w-full [perspective:1200px]" aria-label={flipped ? "Show question" : "Reveal answer"}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${card.id}-${flipped}`}
                  initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="glass gradient-border flex min-h-64 flex-col items-center justify-center p-8 text-center"
                >
                  <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">{flipped ? "Answer" : "Question"}</p>
                  <p className="text-xl font-medium">{flipped ? card.back : card.front}</p>
                  {!flipped ? <p className="mt-6 flex items-center gap-1 text-xs text-muted-foreground"><RotateCw className="size-3" /> Click to flip</p> : null}
                </motion.div>
              </AnimatePresence>
            </button>
            {flipped ? (
              <div className="grid grid-cols-4 gap-2" role="group" aria-label="How well did you remember?">
                {GRADES.map((g) => <Button key={g.g} className={`rounded-xl ${g.cls}`} onClick={() => grade(g.g)}>{g.label}</Button>)}
              </div>
            ) : null}
            {card.sourceSlug ? <p className="text-xs text-muted-foreground">From <Link href={`/tutorials/${card.sourceSlug}`} className="underline">this tutorial</Link></p> : null}
          </>
        ) : (
          <EmptyState title="All caught up! 🎉" description="No cards are due. Generate new cards from your bookmarks or add your own." />
        )}
      </div>
      <aside className="space-y-4">
        <form
          className="glass space-y-2 p-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const r = await createFlashcard({ front, back });
            if (!r.ok) return toast.error(r.error);
            setFront("");
            setBack("");
            toast.success("Card added");
            router.refresh();
          }}
        >
          <p className="text-sm font-semibold">Add your own card</p>
          <label htmlFor="fc-front" className="sr-only">Question</label>
          <Input id="fc-front" value={front} onChange={(e) => setFront(e.target.value)} placeholder="Question" className="rounded-xl" />
          <label htmlFor="fc-back" className="sr-only">Answer</label>
          <Textarea id="fc-back" rows={3} value={back} onChange={(e) => setBack(e.target.value)} placeholder="Answer" className="rounded-xl" />
          <Button type="submit" size="sm" className="rounded-xl" disabled={front.length < 3 || !back}><Plus /> Add card</Button>
        </form>
        <div className="glass p-4">
          <p className="mb-2 text-sm font-semibold">Coming up</p>
          {upcoming.length ? (
            <ul className="space-y-2 text-sm">{upcoming.map((u) => <li key={u.id} className="flex gap-2"><span className="line-clamp-1 flex-1 text-muted-foreground">{u.front}</span><span className="text-xs">{formatDate(u.dueAt)}</span></li>)}</ul>
          ) : <p className="text-sm text-muted-foreground">Nothing scheduled.</p>}
        </div>
      </aside>
    </div>
  );
}
