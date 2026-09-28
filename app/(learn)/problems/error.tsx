"use client";
import { ErrorState } from "@/components/ui/error-state";
export default function ProblemsError({ reset }: { error: Error; reset: () => void }) {
  return <div className="container-cv py-16"><ErrorState title="Couldn't load problems" onRetry={reset} /></div>;
}
