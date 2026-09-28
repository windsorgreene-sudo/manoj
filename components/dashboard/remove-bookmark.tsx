"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { removeBookmark } from "@/lib/actions/dashboard";

export function RemoveBookmarkButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Remove bookmark"
      onClick={async () => {
        const r = await removeBookmark(id);
        if (r.ok) {
          toast.success("Removed");
          router.refresh();
        } else toast.error(r.error);
      }}
    >
      <Trash2 />
    </Button>
  );
}
