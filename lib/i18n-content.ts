/** Pick the Hinglish version of a content field when the reader chose Hinglish and it exists. */
export function pick(locale: string, en: string, hinglish?: string | null) {
  return locale === "hinglish" && hinglish ? hinglish : en;
}

export function pickList(locale: string, en: string[], hinglish?: string[] | null) {
  return locale === "hinglish" && hinglish && hinglish.length === en.length ? hinglish : en;
}
