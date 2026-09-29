"use client";

import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { LOCALES, useLocale } from "@/components/i18n/intl-provider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const t = useTranslations("footer");
  return (
    <div className="flex items-center gap-2" role="group" aria-label={t("language")}>
      <Languages className="size-4 text-muted-foreground" aria-hidden />
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.code}
          aria-pressed={locale === l.code}
          onClick={() => setLocale(l.code)}
          className={cn("rounded-lg px-2 py-1 text-xs transition-colors", locale === l.code ? "bg-brand text-white" : "text-muted-foreground hover:text-foreground")}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
