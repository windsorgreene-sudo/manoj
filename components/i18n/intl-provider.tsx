"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { DomTranslator } from "@/components/i18n/dom-translator";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import hinglish from "@/messages/hinglish.json";

export const LOCALES = [
  { code: "en", label: "English" },
  { code: "hinglish", label: "Hinglish" },
  { code: "hi", label: "हिन्दी" },
] as const;
export type Locale = (typeof LOCALES)[number]["code"];

const MESSAGES: Record<Locale, typeof en> = { en, hi, hinglish };
/** BCP 47 tags for <html lang> and date/number formatting. Hinglish is Hindi written in Latin script. */
const LANG_TAG: Record<Locale, string> = { en: "en-IN", hi: "hi", hinglish: "hi-Latn" };
const LocaleContext = createContext<{ locale: Locale; setLocale: (l: Locale) => void }>({ locale: "en", setLocale: () => undefined });

function readCookie(): Locale {
  const m = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=(en|hi|hinglish)(?:;|$)/);
  return (m?.[1] as Locale | undefined) ?? "en";
}

/**
 * Client-side i18n (next-intl without locale routing). The locale lives in the NEXT_LOCALE cookie
 * (set by the footer switcher and Settings) so marketing/learn pages stay statically generated.
 * Hinglish additionally runs the DOM translator for page text outside the next-intl chrome.
 */
export function IntlProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = readCookie();
    if (saved === "en") return;
    const id = requestAnimationFrame(() => setLocaleState(saved));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    document.documentElement.lang = LANG_TAG[locale];
  }, [locale]);

  const setLocale = useCallback(
    (l: Locale) => {
      document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
      // Leaving Hinglish: the page text was rewritten in place, so reload to get the original English back.
      if (locale === "hinglish" && l !== "hinglish") return window.location.reload();
      setLocaleState(l);
    },
    [locale],
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={LANG_TAG[locale]} messages={MESSAGES[locale]} timeZone="Asia/Kolkata">
        {children}
        <DomTranslator active={locale === "hinglish"} />
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
