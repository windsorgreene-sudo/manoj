"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import en from "@/messages/en.json";
import { toLocale, type Locale } from "@/lib/i18n-content";

export { LOCALES, type Locale } from "@/lib/i18n-content";

/** BCP 47 tags for <html lang> and date/number formatting. Hinglish is Hindi written in Latin script. */
const LANG_TAG: Record<Locale, string> = { en: "en-IN", hinglish: "hi-Latn" };
const LocaleContext = createContext<{ locale: Locale; setLocale: (l: Locale) => void }>({ locale: "en", setLocale: () => undefined });

const COOKIE = "NEXT_LOCALE";
const writeCookie = (l: Locale) => {
  document.cookie = `${COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
};

function readCookie(): Locale {
  const m = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([a-z]+)(?:;|$)/);
  const l = toLocale(m?.[1]);
  // Migrate the retired Hindi cookie so the next page load reads a supported value.
  if (m?.[1] === "hi") writeCookie(l);
  return l;
}

/**
 * Client-side i18n (next-intl without locale routing). The interface is always English;
 * the NEXT_LOCALE cookie only decides whether learning content (tutorials, problems, quizzes,
 * courses) is shown in English or Hinglish, so marketing/learn pages stay statically generated.
 */
export function IntlProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // <html lang> is set before paint by the inline script in app/layout.tsx. It is only written
  // here on an explicit change, so hydration (which starts on "en") never flips Hinglish content
  // back to English for a frame.
  useEffect(() => {
    const saved = readCookie();
    document.documentElement.lang = LANG_TAG[saved];
    if (saved === "en") return;
    const id = requestAnimationFrame(() => setLocaleState(saved));
    return () => cancelAnimationFrame(id);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    writeCookie(l);
    document.documentElement.lang = LANG_TAG[l];
    setLocaleState(l);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={LANG_TAG[locale]} messages={en} timeZone="Asia/Kolkata">
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
