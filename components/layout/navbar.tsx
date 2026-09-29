"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { primaryNav, practiceNav } from "@/components/layout/nav-links";
import { Magnetic } from "@/components/motion/magnetic";
import { useUiStore } from "@/lib/stores/ui-store";
import type { SessionUser } from "@/lib/session";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { NavItem } from "@/components/layout/nav-links";

export function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const label = (i: NavItem) => (i.key ? t(i.key) : i.label);
  const desc = (i: NavItem) => (i.key ? t(`${i.key}Desc`) : i.description);
  const { data: session, isPending } = useSession();
  const user: SessionUser | null = session
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
        role: (session.user.role as SessionUser["role"]) ?? "STUDENT",
        username: session.user.username ?? null,
      }
    : null;
  const [scrolled, setScrolled] = useState(false);
  const openSearch = useUiStore((s) => s.setSearchOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "border-b border-border bg-background/70 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <nav className="container-cv flex h-16 items-center gap-4" aria-label="Main">
        <Logo />
        <ul className="ml-4 hidden items-center gap-0.5 lg:flex xl:ml-6 xl:gap-1">
          {primaryNav.slice(0, 3).map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "rounded-xl px-2 py-2 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground xl:px-3",
                  isActive(item.href) && "text-foreground",
                )}
              >
                {label(item)}
              </Link>
            </li>
          ))}
          <li>
            <Popover>
              <PopoverTrigger className="flex items-center gap-1 rounded-xl px-2 py-2 text-sm font-medium whitespace-nowrap text-muted-foreground hover:text-foreground xl:px-3">
                {t("practice")} <ChevronDown className="size-4" />
              </PopoverTrigger>
              <PopoverContent className="glass w-[480px] p-2" align="start">
                <ul className="grid grid-cols-2 gap-1">
                  {practiceNav.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="block rounded-xl p-3 transition-colors hover:bg-accent">
                        <div className="text-sm font-semibold">{label(item)}</div>
                        <div className="text-xs text-muted-foreground">{desc(item)}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          </li>
          {primaryNav.slice(3).map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "rounded-xl px-2 py-2 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground xl:px-3",
                  isActive(item.href) && "text-foreground",
                )}
              >
                {label(item)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => openSearch(true)}
            className="hidden h-9 items-center gap-2 rounded-xl border border-border bg-surface/60 px-3 text-sm text-muted-foreground transition-colors hover:text-foreground md:flex"
            aria-label={t("searchLabel")}
          >
            <Search className="size-4" />
            <span>{t("search")}</span>
            <kbd className="ml-4 hidden rounded-md border border-border px-1.5 text-[10px] xl:inline">Ctrl K</kbd>
          </button>
          <Button variant="ghost" size="icon" className="rounded-xl md:hidden" aria-label="Search" onClick={() => openSearch(true)}>
            <Search className="size-5" />
          </Button>
          <ThemeToggle />
          {isPending ? (
            <div className="shimmer size-9 rounded-full" aria-hidden />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" className="rounded-xl">
                <Link href="/login">{t("login")}</Link>
              </Button>
              <Magnetic>
                <Button asChild className="rounded-xl bg-brand shadow-[0_0_24px_-4px_rgba(124,58,237,0.7)] hover:bg-brand/90">
                  <Link href="/signup">{t("startFree")}</Link>
                </Button>
              </Magnetic>
            </div>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl lg:hidden" aria-label={t("openMenu")}>
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto" data-lenis-prevent>
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <ul className="flex flex-col gap-1 px-4">
                {[...primaryNav, ...practiceNav].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-accent">
                      {label(item)}
                    </Link>
                  </li>
                ))}
              </ul>
              {!user ? (
                <div className="mt-4 flex flex-col gap-2 px-4 pb-6">
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link href="/login">{t("login")}</Link>
                  </Button>
                  <Button asChild className="rounded-xl">
                    <Link href="/signup">{t("startFree")}</Link>
                  </Button>
                </div>
              ) : null}
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
