import type { ReactNode } from "react";

/**
 * Renders the English content and, when available, its Hinglish version side by side.
 * CSS (html[lang="hi-Latn"]) shows exactly one, so pages stay static and switching is instant.
 * Without a Hinglish version the English one is always shown.
 */
export function LangVariant({ en, hinglish, as: Tag = "div", className }: { en: ReactNode; hinglish?: ReactNode | null; as?: "div" | "span" | "p" | "h1" | "li"; className?: string }) {
  if (hinglish === null || hinglish === undefined || hinglish === "") return <Tag className={className}>{en}</Tag>;
  return (
    <>
      <Tag data-variant="en" className={className}>
        {en}
      </Tag>
      <Tag data-variant="hinglish" lang="hi-Latn" className={className}>
        {hinglish}
      </Tag>
    </>
  );
}
