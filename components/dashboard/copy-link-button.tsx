"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyLinkButton({ url, label = "Copy link" }: { url: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      size="sm"
      variant="ghost"
      className="rounded-lg"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setDone(true);
          toast.success("Link copied");
          window.setTimeout(() => setDone(false), 2000);
        } catch {
          toast.error("Couldn't copy — select the link manually.");
        }
      }}
    >
      {done ? <Check /> : <Link2 />} {label}
    </Button>
  );
}
