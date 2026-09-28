"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, UserCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleFollow } from "@/lib/actions/dashboard";
import { getFollowState } from "@/lib/actions/social";

export function FollowButton({ userId, username, initialFollowers }: { userId: string; username: string; initialFollowers: number }) {
  const router = useRouter();
  const { data, refetch } = useQuery({ queryKey: ["follow", userId], queryFn: () => getFollowState(userId) });
  const [busy, setBusy] = useState(false);
  if (data?.self) return null;
  const click = async () => {
    if (!data?.signedIn) return router.push(`/login?next=/u/${username}`);
    setBusy(true);
    const r = await toggleFollow(userId);
    setBusy(false);
    if (!r.ok) return toast.error(r.error);
    toast.success(r.data.following ? "Following" : "Unfollowed");
    void refetch();
    router.refresh();
  };
  return (
    <Button onClick={click} disabled={busy} variant={data?.following ? "outline" : "default"} className="w-full rounded-xl" aria-label={`${data?.following ? "Unfollow" : "Follow"} (${initialFollowers} followers)`}>
      {busy ? <Loader2 className="animate-spin" /> : data?.following ? <UserCheck /> : <UserPlus />} {data?.following ? "Following" : "Follow"}
    </Button>
  );
}
