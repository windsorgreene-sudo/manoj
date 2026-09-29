export const LOCALES = [
  { code: "en", label: "English" },
  { code: "hinglish", label: "Hinglish" },
] as const;
export type Locale = (typeof LOCALES)[number]["code"];

/** Normalises any stored value (including the retired "hi" locale) to a supported one. */
export function toLocale(value: string | null | undefined): Locale {
  return value === "hinglish" || value === "hi" ? "hinglish" : "en";
}

/** Pick the Hinglish version of a content field when the reader chose Hinglish and it exists. */
export function pick(locale: string, en: string, hinglish?: string | null) {
  return locale === "hinglish" && hinglish ? hinglish : en;
}

export function pickList(locale: string, en: string[], hinglish?: string[] | null) {
  return locale === "hinglish" && hinglish && hinglish.length === en.length ? hinglish : en;
}
