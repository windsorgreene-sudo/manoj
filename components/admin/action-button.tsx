"use client";

import { useRouter } from "next/navigation";
import { useState, type ComponentProps, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Result = { ok: true; data?: unknown } | { ok: false; error: string };

/** Button that runs a server action, confirms if needed, toasts and refreshes. */
export function ActionButton({
  action,
  confirm,
  success = "Done",
  children,
  onDone,
  ...props
}: Omit<ComponentProps<typeof Button>, "onClick" | "action"> & { action: () => Promise<Result>; confirm?: string; success?: string; children: ReactNode; onDone?: () => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <Button
      {...props}
      disabled={busy || props.disabled}
      onClick={async () => {
        if (confirm && !window.confirm(confirm)) return;
        setBusy(true);
        const r = await action();
        setBusy(false);
        if (r.ok) {
          toast.success(success);
          onDone?.();
          router.refresh();
        } else toast.error(r.error);
      }}
    >
      {busy ? <Loader2 className="animate-spin" /> : null}
      {children}
    </Button>
  );
}
