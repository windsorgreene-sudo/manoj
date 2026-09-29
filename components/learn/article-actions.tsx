"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bookmark, Heart, Loader2, PencilLine, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getArticleState, markArticleRead, suggestImprovement, toggleBookmark, toggleLike } from "@/lib/actions/learn";
import { useCelebrate } from "@/components/motion/celebration-layer";
import { cn } from "@/lib/utils";

type State = Awaited<ReturnType<typeof getArticleState>>;

export function ArticleActions({ articleId, title, slug }: { articleId: string; title: string; slug: string }) {
  const [state, setState] = useState<State | null>(null);
  const [improveOpen, setImproveOpen] = useState(false);
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const celebrate = useCelebrate();
  const router = useRouter();
  const readSent = useRef(false);

  useEffect(() => {
    let alive = true;
    getArticleState(articleId).then((s) => alive && setState(s));
    return () => {
      alive = false;
    };
  }, [articleId]);

  // Award +5 XP once the reader reaches ~85% of the article after 20s.
  useEffect(() => {
    const start = Date.now();
    const onScroll = () => {
      if (readSent.current) return;
      const doc = document.documentElement;
      const pct = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (pct > 0.85 && Date.now() - start > 20_000) {
        readSent.current = true;
        markArticleRead(articleId).then((r) => {
          if (r.ok && r.data?.awarded) celebrate({ xp: r.data.amount, streak: r.data.streak, leveledUp: r.data.leveledUp, level: r.data.level, badges: r.data.newBadges });
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [articleId, celebrate]);

  const needLogin = () =>
    toast("Log in to save your progress", {
      action: { label: "Log in", onClick: () => router.push(`/login?next=/tutorials/${slug}`) },
    });

  const bookmark = async () => {
    if (!state?.signedIn) return needLogin();
    setState({ ...state, bookmarked: !state.bookmarked });
    const r = await toggleBookmark({ articleId });
    if (r.ok) toast.success(r.data.bookmarked ? "Bookmarked" : "Removed from bookmarks");
    else toast.error(r.error);
  };
  const like = async () => {
    if (!state?.signedIn) return needLogin();
    setState({ ...state, liked: !state.liked, likes: state.likes + (state.liked ? -1 : 1) });
    const r = await toggleLike(articleId);
    if (r.ok) setState((s) => (s ? { ...s, liked: r.data.liked, likes: r.data.likes } : s));
    else toast.error(r.error);
  };
  const share = async () => {
    const url = window.location.href.split("#")[0];
    if (navigator.share) await navigator.share({ title, url }).catch(() => undefined);
    else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };
  const submitImprove = async () => {
    setBusy(true);
    const r = await suggestImprovement({ articleId, details });
    setBusy(false);
    if (r.ok) {
      toast.success("Thanks! Our editors will review your suggestion.");
      setImproveOpen(false);
      setDetails("");
    } else toast.error(r.error);
  };

  return (
    <div className="flex flex-wrap items-center gap-1" aria-label="Article actions">
      <Button variant="ghost" size="sm" className="rounded-xl" onClick={like} aria-pressed={Boolean(state?.liked)} aria-label="Like">
        <Heart className={cn(state?.liked && "fill-danger text-danger")} /> {state?.likes ?? "-"}
      </Button>
      <Button variant="ghost" size="sm" className="rounded-xl" onClick={bookmark} aria-pressed={Boolean(state?.bookmarked)}>
        <Bookmark className={cn(state?.bookmarked && "fill-cyan text-cyan")} /> {state?.bookmarked ? "Saved" : "Save"}
      </Button>
      <Button variant="ghost" size="sm" className="rounded-xl" onClick={share}>
        <Share2 /> Share
      </Button>
      <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => (state?.signedIn ? setImproveOpen(true) : needLogin())}>
        <PencilLine /> Improve this article
      </Button>
      <Dialog open={improveOpen} onOpenChange={setImproveOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Improve “{title}”</DialogTitle>
            <DialogDescription>Found a mistake or have a better explanation? Tell our editors.</DialogDescription>
          </DialogHeader>
          <label htmlFor="improve-details" className="sr-only">
            Suggestion
          </label>
          <Textarea id="improve-details" rows={6} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="e.g. The complexity in section 2 should be O(n log n) because…" className="rounded-xl" />
          <DialogFooter>
            <Button variant="ghost" asChild className="rounded-xl">
              <Link href="/write-for-us">Become a contributor</Link>
            </Button>
            <Button onClick={submitImprove} disabled={busy} className="rounded-xl">
              {busy ? <Loader2 className="animate-spin" /> : null} Send suggestion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
