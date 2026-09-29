"use client";

import { useRouter } from "next/navigation";
import { useState, type KeyboardEvent } from "react";
import { CheckCircle2, Flag, Loader2, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { acceptAnswer, answerDoubt, askDoubt, reportPost } from "@/lib/actions/doubts";
import { cn } from "@/lib/utils";

export function AskDoubtForm({ suggestedTags }: { suggestedTags: string[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTag = (t: string) => {
    const v = t.trim().toLowerCase().replace(/[^a-z0-9+#-]/g, "").slice(0, 30);
    if (v && !tags.includes(v) && tags.length < 5) setTags([...tags, v]);
    setTagInput("");
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && tags.length) setTags(tags.slice(0, -1));
  };

  const submit = async () => {
    setBusy(true);
    setError(null);
    const r = await askDoubt({ title, body, tags: tagInput ? [...tags, tagInput] : tags });
    setBusy(false);
    if (!r.ok) {
      if (r.unauth) return void router.push("/login?next=/doubts/ask");
      return setError(r.error);
    }
    toast.success("Your doubt is live, you'll be notified of answers.");
    router.push(`/doubts/${r.data.id}`);
  };

  return (
    <form
      className="glass space-y-5 p-6 md:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="d-title">Title</Label>
        <Input id="d-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={160} placeholder="e.g. Why does my BFS visit nodes twice?" required />
        <p className="text-xs text-muted-foreground">Be specific, imagine asking a friend.</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="d-body">Details</Label>
        <Textarea id="d-body" value={body} onChange={(e) => setBody(e.target.value)} rows={10} maxLength={10_000} placeholder={"What are you trying to do? What did you try? Paste code inside ``` fences."} required className="font-mono text-sm" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="d-tags">Tags <span className="font-normal text-muted-foreground">(up to 5, press Enter)</span></Label>
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-input px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-lg bg-brand/15 px-2 py-0.5 text-sm text-brand">
              {t}
              <button type="button" aria-label={`Remove tag ${t}`} onClick={() => setTags(tags.filter((x) => x !== t))}><X className="size-3" /></button>
            </span>
          ))}
          <input id="d-tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={onKey} onBlur={() => tagInput && addTag(tagInput)} className="min-w-24 flex-1 bg-transparent py-1 text-sm outline-none" placeholder={tags.length ? "" : "dp, graphs, python…"} />
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {suggestedTags.filter((t) => !tags.includes(t)).slice(0, 10).map((t) => (
            <button key={t} type="button" onClick={() => addTag(t)} className="rounded-lg border border-border px-2 py-0.5 text-xs text-muted-foreground hover:border-brand hover:text-foreground">+ {t}</button>
          ))}
        </div>
      </div>
      {error ? <p role="alert" className="text-sm text-danger">{error}</p> : null}
      <Button type="submit" size="lg" className="rounded-xl" disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : <Send />} Post your doubt</Button>
    </form>
  );
}

export function AnswerForm({ doubtId, signedIn }: { doubtId: string; signedIn: boolean }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  if (!signedIn)
    return (
      <div className="glass p-6 text-center text-sm">
        <Button className="rounded-xl" onClick={() => router.push(`/login?next=/doubts/${doubtId}`)}>Sign in to answer</Button>
      </div>
    );
  return (
    <form
      className="glass space-y-3 p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const r = await answerDoubt({ doubtId, body });
        setBusy(false);
        if (!r.ok) return void toast.error(r.error);
        setBody("");
        toast.success("Answer posted, thanks for helping!");
        router.refresh();
      }}
    >
      <Label htmlFor="ans-body" className="text-base font-semibold">Your answer</Label>
      <Textarea id="ans-body" value={body} onChange={(e) => setBody(e.target.value)} rows={6} maxLength={10_000} placeholder="Explain the idea first, then show code in ``` fences." required className="font-mono text-sm" />
      <Button type="submit" className="rounded-xl" disabled={busy || body.trim().length < 10}>{busy ? <Loader2 className="animate-spin" /> : <Send />} Post answer</Button>
    </form>
  );
}

export function AcceptButton({ doubtId, answerId, accepted }: { doubtId: string; answerId: string; accepted: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <Button
      size="sm"
      variant={accepted ? "default" : "outline"}
      className={cn("rounded-lg", accepted && "bg-success text-white hover:bg-success/90")}
      disabled={busy}
      aria-pressed={accepted}
      onClick={async () => {
        setBusy(true);
        const r = await acceptAnswer({ doubtId, answerId: accepted ? null : answerId });
        setBusy(false);
        if (!r.ok) return void toast.error(r.error);
        toast.success(accepted ? "Answer un-accepted" : "Answer accepted");
        router.refresh();
      }}
    >
      <CheckCircle2 /> {accepted ? "Accepted" : "Accept answer"}
    </Button>
  );
}

export function ReportButton({ target, id, signedIn }: { target: "DOUBT" | "ANSWER"; id: string; signedIn: boolean }) {
  const [done, setDone] = useState(false);
  if (!signedIn) return null;
  return (
    <button
      type="button"
      disabled={done}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-danger disabled:opacity-50"
      onClick={async () => {
        const reason = window.prompt("Why are you reporting this? (spam, abusive, off-topic…)");
        if (!reason) return;
        const r = await reportPost({ target, id, reason });
        if (!r.ok) return void toast.error(r.error);
        setDone(true);
        toast.success("Thanks, our moderators will take a look.");
      }}
    >
      <Flag className="size-3" /> {done ? "Reported" : "Report"}
    </button>
  );
}
