"use client";
import { ErrorState } from "@/components/ui/error-state";
export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return <ErrorState title="This admin page failed to load" onRetry={reset} />;
}
