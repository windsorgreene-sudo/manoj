"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowBigDown, ArrowBigUp, Loader2, MessageSquare, Reply } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { listComments, postComment, voteComment, type CommentView } from "@/lib/actions/learn";
import { useSession } from "@/lib/auth-client";
import { cn, timeAgo } from "@/lib/utils";

type Target = { articleId?: string; problemId?: string };

function Composer({ target, parentId, onDone, autoFocus }: { target: Target; parentId?: string; onDone: () => void; autoFocus?: boolean }) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const r = await postComment({ ...target, parentId, body });
    setBusy(false);
    if (r.ok) {
      setBody("");
      onDone();
    } else toast.error(r.error);
  };
  return (
    <form onSubmit={submit} className="space-y-2">
      <label htmlFor={`c-${parentId ?? "root"}`} className="sr-only">
        {parentId ? "Reply" : "Comment"}
      </label>
      <Textarea
        id={`c-${parentId ?? "root"}`}
        autoFocus={autoFocus}
        rows={parentId ? 2 : 3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={parentId ? "Write a reply…" : "Share a question, tip or alternative approach…"}
        className="rounded-xl"
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm" className="rounded-xl" disabled={busy || body.trim().length < 2}>
          {busy ? <Loader2 className="animate-spin" /> : null} {parentId ? "Reply" : "Post comment"}
        </Button>
      </div>
    </form>
  );
}

function CommentItem({ c, replies, target, refresh, signedIn }: { c: CommentView; replies: CommentView[]; target: Target; refresh: () => void; signedIn: boolean }) {
  const [score, setScore] = useState(c.score);
  const [vote, setVote] = useState(c.myVote);
  const [replying, setReplying] = useState(false);

  const cast = async (v: 1 | -1) => {
    if (!signedIn) return toast.error("Log in to vote");
    const next = (vote === v ? 0 : v) as 1 | -1 | 0;
    setScore(score + next - vote);
    setVote(next);
    const r = await voteComment({ commentId: c.id, value: next });
    if (r.ok) setScore(r.data.score);
    else toast.error(r.error);
  };

  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center gap-0.5 pt-1">
        <button type="button" aria-label="Upvote" aria-pressed={vote === 1} onClick={() => cast(1)} className={cn("rounded-md p-0.5 hover:bg-accent", vote === 1 && "text-success")}>
          <ArrowBigUp className="size-5" />
        </button>
        <span className="text-xs font-semibold tabular-nums" aria-label={`${score} points`}>
          {score}
        </span>
        <button type="button" aria-label="Downvote" aria-pressed={vote === -1} onClick={() => cast(-1)} className={cn("rounded-md p-0.5 hover:bg-accent", vote === -1 && "text-danger")}>
          <ArrowBigDown className="size-5" />
        </button>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm">
          {c.user.username ? (
            <Link href={`/u/${c.user.username}`} className="font-semibold hover:underline">
              {c.user.name}
            </Link>
          ) : (
            <span className="font-semibold">{c.user.name}</span>
          )}{" "}
          <span className="text-xs text-muted-foreground">· {timeAgo(c.createdAt)}</span>
        </p>
        <p className="mt-1 text-sm whitespace-pre-wrap" data-no-translate>{c.body}</p>
        {!c.parentId ? (
          <Button variant="ghost" size="xs" className="mt-1 -ml-2 rounded-lg text-muted-foreground" onClick={() => (signedIn ? setReplying(!replying) : toast.error("Log in to reply"))}>
            <Reply /> Reply
          </Button>
        ) : null}
        {replying ? (
          <div className="mt-2">
            <Composer
              target={target}
              parentId={c.id}
              autoFocus
              onDone={() => {
                setReplying(false);
                refresh();
              }}
            />
          </div>
        ) : null}
        {replies.length ? (
          <ul className="mt-4 space-y-4 border-l border-border pl-4">
            {replies.map((r) => (
              <CommentItem key={r.id} c={r} replies={[]} target={target} refresh={refresh} signedIn={signedIn} />
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

/** Threaded comments with replies and up/down votes. Used on articles and problem Discussion tab. */
export function Comments({ target, title = "Discussion" }: { target: Target; title?: string }) {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const key = ["comments", target.articleId ?? target.problemId];
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: key, queryFn: () => listComments(target) });
  const refresh = () => void qc.invalidateQueries({ queryKey: key });
  const roots = (data ?? []).filter((c) => !c.parentId);
  const repliesOf = (id: string) => (data ?? []).filter((c) => c.parentId === id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return (
    <section aria-labelledby="comments-title" className="mt-12">
      <h2 id="comments-title" className="flex items-center gap-2 font-heading text-xl font-bold">
        <MessageSquare className="size-5" /> {title} {data ? <span className="text-sm font-normal text-muted-foreground">({data.length})</span> : null}
      </h2>
      <div className="mt-4">
        {session ? (
          <Composer target={target} onDone={refresh} />
        ) : (
          <p className="glass p-4 text-sm text-muted-foreground">
            <Link href="/login" className="font-medium text-foreground underline">
              Log in
            </Link>{" "}
            to join the discussion.
          </p>
        )}
      </div>
      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-4" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="shimmer h-20 rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState title="Couldn't load comments" onRetry={() => void refetch()} />
        ) : roots.length === 0 ? (
          <EmptyState title="No comments yet" description="Be the first to start the discussion." />
        ) : (
          <ul className="space-y-6">
            {roots.map((c) => (
              <CommentItem key={c.id} c={c} replies={repliesOf(c.id)} target={target} refresh={refresh} signedIn={Boolean(session)} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
