"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CheckCircle2, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setContestRegistration } from "@/lib/actions/contests";

export function RegisterButton({ contestId, slug, registered, phase, signedIn }: { contestId: string; slug: string; registered: boolean; phase: "UPCOMING" | "LIVE" | "ENDED"; signedIn: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  if (phase === "ENDED") return null;
  if (!signedIn)
    return (
      <Button className="rounded-xl" onClick={() => router.push(`/login?next=${encodeURIComponent(`/contests/${slug}`)}`)}>
        <UserPlus /> Sign in to register
      </Button>
    );
  const toggle = (register: boolean) =>
    start(async () => {
      const res = await setContestRegistration({ contestId, register });
      if (!res.ok) return void toast.error(res.error);
      toast.success(register ? "You're registered, good luck!" : "Registration cancelled");
      router.refresh();
    });
  if (registered)
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-success/15 px-3 py-2 text-sm font-medium text-success">
          <CheckCircle2 className="size-4" /> Registered
        </span>
        {phase === "UPCOMING" ? (
          <Button variant="ghost" size="sm" className="rounded-xl" disabled={pending} onClick={() => toggle(false)}>
            Unregister
          </Button>
        ) : null}
      </div>
    );
  return (
    <Button className="rounded-xl" disabled={pending} onClick={() => toggle(true)}>
      {pending ? <Loader2 className="animate-spin" /> : <UserPlus />} {phase === "LIVE" ? "Join now" : "Register"}
    </Button>
  );
}
