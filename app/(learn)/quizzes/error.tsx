"use client";
import { ErrorState } from "@/components/ui/error-state";
export default function SectionError({ reset }: { error: Error; reset: () => void }) {
  return <div className="container-cv py-16"><ErrorState title="Couldn't load quizzes" onRetry={reset} /></div>;
}
