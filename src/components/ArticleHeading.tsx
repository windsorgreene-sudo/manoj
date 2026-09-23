"use client";

import { useLanguage } from "./LanguageProvider";

// Renders the article title and description in the active language.
// Falls back to English when a Hinglish version is not provided.
export function ArticleTitle({ en, hi }: { en: string; hi?: string }) {
  const { lang } = useLanguage();
  const text = lang === "hi" && hi ? hi : en;
  return (
    <h1 className="font-display text-[28px] font-bold leading-tight text-text sm:text-[36px]">
      {text}
    </h1>
  );
}

export function ArticleDescription({ en, hi }: { en: string; hi?: string }) {
  const { lang } = useLanguage();
  const text = lang === "hi" && hi ? hi : en;
  return <p className="mt-3 text-[16px] leading-relaxed text-text-muted">{text}</p>;
}
