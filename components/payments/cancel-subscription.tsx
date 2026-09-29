"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cancelSubscription } from "@/lib/actions/payments";
import { formatDate } from "@/lib/utils";

export function CancelSubscriptionButton({ until }: { until: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl">Cancel subscription</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Pro?</DialogTitle>
          <DialogDescription>You&apos;ll keep Pro until {formatDate(until)}. After that your account moves to the Free plan — your progress, notes and certificates stay.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" className="rounded-xl" onClick={() => setOpen(false)}>Keep Pro</Button>
          <Button
            variant="destructive"
            className="rounded-xl"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              const r = await cancelSubscription();
              setBusy(false);
              if (!r.ok) return void toast.error(r.error);
              setOpen(false);
              toast.success("Subscription cancelled");
              router.refresh();
            }}
          >
            {busy ? <Loader2 className="animate-spin" /> : null} Cancel subscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
