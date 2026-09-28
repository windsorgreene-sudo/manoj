"use client";

import { AlertOctagon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({ title = "Something went wrong", description = "Please try again. If the problem persists, contact support.", onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  return (
    <div className="glass flex flex-col items-center gap-3 px-6 py-12 text-center" role="alert">
      <AlertOctagon className="size-10 text-danger" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry ? (
        <Button variant="outline" className="mt-2 rounded-xl" onClick={onRetry}>
          <RotateCcw /> Try again
        </Button>
      ) : null}
    </div>
  );
}
