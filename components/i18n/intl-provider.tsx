"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";

export const LOCALES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
] as const;
export type Locale = (typeof LOCALES)[number]["code"];

const MESSAGES: Record<Locale, typeof en> = { en, hi };
const LocaleContext = createContext<{ locale: Locale; setLocale: (l: Locale) => void }>({ locale: "en", setLocale: () => undefined });

function readCookie(): Locale {
  const m = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=(en|hi)/);
  return (m?.[1] as Locale | undefined) ?? "en";
}

/**
 * Client-side i18n (next-intl without locale routing). The locale lives in the NEXT_LOCALE cookie
 * (set by the footer switcher and Settings) so marketing/learn pages stay statically generated.
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
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
    setLocaleState(l);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]} timeZone="Asia/Kolkata">
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
