"use client";

import { useLanguage } from "./LanguageProvider";

// A compact EN / Hinglish switch. "Hinglish" is Roman-script Hindi so students
// can read explanations in the language they think in.
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <div
      className={`inline-flex items-center rounded-md border border-border-strong bg-surface p-0.5 text-xs font-semibold ${className}`}
      role="group"
      aria-label="Reading language"
    >
      <button
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`rounded px-2 py-1 transition-colors ${
          lang === "en" ? "bg-primary text-primary-contrast" : "text-text-muted hover:text-text"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("hi")}
        aria-pressed={lang === "hi"}
        className={`rounded px-2 py-1 transition-colors ${
          lang === "hi" ? "bg-primary text-primary-contrast" : "text-text-muted hover:text-text"
        }`}
      >
        Hinglish
      </button>
    </div>
  );
}
