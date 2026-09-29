"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Award,
  BarChart3,
  Bell,
  Bookmark,
  BookOpen,
  Code2,
  FileBadge,
  GraduationCap,
  Home,
  Layers,
  ListChecks,
  Menu,
  NotebookPen,
  PenLine,
  Settings,
  Trophy,
  CreditCard,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { SessionUser } from "@/lib/session";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", key: "overview", label: "Overview", Icon: Home },
  { href: "/dashboard/stats", key: "stats", label: "Stats", Icon: BarChart3 },
  { href: "/dashboard/courses", key: "courses", label: "My Courses", Icon: GraduationCap },
  { href: "/dashboard/sheets", key: "sheets", label: "My Sheets", Icon: ListChecks },
  { href: "/dashboard/submissions", key: "submissions", label: "Submissions", Icon: Code2 },
  { href: "/dashboard/bookmarks", key: "bookmarks", label: "Bookmarks", Icon: Bookmark },
  { href: "/dashboard/notes", key: "notes", label: "Notes & Highlights", Icon: NotebookPen },
  { href: "/dashboard/revision", key: "revision", label: "Smart Revision", Icon: Layers },
  { href: "/dashboard/achievements", key: "achievements", label: "Achievements", Icon: Award },
  { href: "/dashboard/leaderboard", key: "leaderboards", label: "Leaderboards", Icon: Trophy },
  { href: "/dashboard/certificates", key: "certificates", label: "Certificates", Icon: FileBadge },
  { href: "/dashboard/billing", key: "billing", label: "Billing", Icon: CreditCard },
  { href: "/dashboard/notifications", key: "notifications", label: "Notifications", Icon: Bell },
  { href: "/dashboard/settings", key: "settings", label: "Settings", Icon: Settings },
];

function NavList({ role }: { role: SessionUser["role"] }) {
  const pathname = usePathname();
  const t = useTranslations("dashboard");
  const items = role === "STUDENT" ? NAV : [...NAV.slice(0, 7), { href: "/dashboard/articles", key: "articles", label: "My Articles", Icon: PenLine }, ...NAV.slice(7)];
  return (
    <ul className="space-y-0.5">
      {items.map(({ href, key, Icon }) => {
        const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn("flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors", active ? "bg-brand/15 font-medium text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground")}
            >
              <Icon className="size-4" /> {t(key)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function DashboardShell({ user, children }: { user: SessionUser; children: ReactNode }) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border bg-surface/50 p-4 lg:flex">
        <Logo className="px-2" />
        <nav aria-label="Dashboard" className="mt-6 flex-1 overflow-y-auto">
          <NavList role={user.role} />
        </nav>
        <Link href="/problems" className="glass mt-4 flex items-center gap-2 p-3 text-sm hover:bg-accent">
          <BookOpen className="size-4 text-cyan" /> Back to learning
        </Link>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-xl">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl lg:hidden" aria-label="Open dashboard menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-4">
              <SheetHeader className="px-0">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Dashboard">
                <NavList role={user.role} />
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground lg:hidden">
            CodeVerse
          </Link>
          <div className="ml-auto flex items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="hidden rounded-xl sm:inline-flex">
              <Link href="/problems">Problems</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden rounded-xl sm:inline-flex">
              <Link href="/tutorials">Tutorials</Link>
            </Button>
            <NotificationBell />
            <ThemeToggle />
            <UserMenu user={user} />
          </div>
        </header>
        <main id="main" className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
