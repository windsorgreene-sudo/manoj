"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function CoursesError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-cv py-16">
      <ErrorState title="Couldn't load courses" onRetry={reset} />
    </div>
  );
}
