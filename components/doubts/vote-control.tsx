"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { toast } from "sonner";
import { voteOnPost } from "@/lib/actions/doubts";
import { cn } from "@/lib/utils";

export function VoteControl({ target, id, score: initialScore, myVote, signedIn }: { target: "DOUBT" | "ANSWER"; id: string; score: number; myVote: number; signedIn: boolean }) {
  const router = useRouter();
  const [score, setScore] = useState(initialScore);
  const [vote, setVote] = useState(myVote);
  const [busy, setBusy] = useState(false);
  const cast = async (v: 1 | -1) => {
    if (!signedIn) return void router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
    if (busy) return;
    const next = (vote === v ? 0 : v) as 1 | -1 | 0;
    const prev = { score, vote };
    setScore(score + next - vote);
    setVote(next);
    setBusy(true);
    const r = await voteOnPost({ target, id, value: next });
    setBusy(false);
    if (!r.ok) {
      setScore(prev.score);
      setVote(prev.vote);
      return void toast.error(r.error);
    }
    setScore(r.data.score);
  };
  return (
    <div className="flex flex-col items-center gap-0.5">
      <button type="button" aria-label="Upvote" aria-pressed={vote === 1} onClick={() => void cast(1)} className={cn("rounded-lg p-1 hover:bg-accent", vote === 1 && "text-success")}>
        <ArrowBigUp className="size-6" />
      </button>
      <span className="font-semibold tabular-nums" aria-live="polite" aria-label={`Score ${score}`}>{score}</span>
      <button type="button" aria-label="Downvote" aria-pressed={vote === -1} onClick={() => void cast(-1)} className={cn("rounded-lg p-1 hover:bg-accent", vote === -1 && "text-danger")}>
        <ArrowBigDown className="size-6" />
      </button>
    </div>
  );
}
