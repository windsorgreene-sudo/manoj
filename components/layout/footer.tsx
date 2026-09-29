"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { GithubIcon as Github, LinkedinIcon as Linkedin, XIcon as Twitter, YoutubeIcon as Youtube } from "@/components/ui/brand-icons";
import { Logo } from "@/components/layout/logo";
import { footerNav } from "@/components/layout/nav-links";
import { NewsletterForm } from "@/components/layout/newsletter-form";

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  return (
    <footer className="relative mt-24 border-t border-border">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand to-transparent" />
      <div className="container-cv grid gap-12 py-16 lg:grid-cols-[1.4fr_2fr]">
        <div className="space-y-6">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {t("tagline")}
          </p>
          <NewsletterForm />
          <div className="flex gap-2">
            {[
              { href: "https://github.com", label: "GitHub", Icon: Github },
              { href: "https://x.com", label: "X (Twitter)", Icon: Twitter },
              { href: "https://linkedin.com", label: "LinkedIn", Icon: Linkedin },
              { href: "https://youtube.com", label: "YouTube", Icon: Youtube },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-10 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {footerNav.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-sm font-semibold">{t(group.key)}</h3>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.href + item.label}>
                    <Link href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {item.key ? tn(item.key) : item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-cv flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>{t("rights", { year: new Date().getFullYear() })}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <LanguageSwitcher />
            <Link href="/privacy" className="hover:text-foreground">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              {t("terms")}
            </Link>
            <Link href="/verify" className="hover:text-foreground">
              {t("verify")}
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              {tn("contact")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
