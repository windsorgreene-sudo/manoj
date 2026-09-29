"use client";

import { Languages } from "lucide-react";
import { useLocale } from "@/components/i18n/intl-provider";
import { cn } from "@/lib/utils";

/**
 * English / Hinglish content toggle. The interface stays in English; the toggle switches
 * tutorials, problems, quizzes and courses to their Hinglish versions where they exist.
 */
export function LanguageSwitcher({ compact = false, className }: { compact?: boolean; className?: string }) {
  const { locale, setLocale } = useLocale();
  const hinglish = locale === "hinglish";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={hinglish}
      aria-label="Content in Hinglish"
      title={hinglish ? "Switch content to English" : "Switch content to Hinglish"}
      onClick={() => setLocale(hinglish ? "en" : "hinglish")}
      className={cn(
        "group inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 p-1 text-xs font-medium transition-colors hover:border-brand/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
    >
      {compact ? null : <Languages className="ml-1 size-4 text-muted-foreground" aria-hidden />}
      <span className="relative grid grid-cols-2" aria-hidden>
        <span
          className={cn(
            "absolute inset-y-0 left-0 w-1/2 rounded-lg bg-brand transition-transform duration-200 motion-reduce:transition-none",
            hinglish && "translate-x-full",
          )}
        />
        <span lang="en" className={cn("relative z-10 px-2 py-1 text-center transition-colors", hinglish ? "text-muted-foreground" : "text-white")}>
          English
        </span>
        <span lang="hi-Latn" className={cn("relative z-10 px-2 py-1 text-center transition-colors", hinglish ? "text-white" : "text-muted-foreground")}>
          Hinglish
        </span>
      </span>
    </button>
  );
}
