"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  BarChart3,
  BookOpen,
  ChevronsLeft,
  ClipboardCheck,
  Code2,
  FileText,
  Flag,
  Gauge,
  History,
  Image as ImageIcon,
  LayoutList,
  ListChecks,
  Map,
  Megaphone,
  Menu,
  Search,
  Settings,
  ShieldAlert,
  Trophy,
  Users,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { SessionUser } from "@/lib/session";
import { cn } from "@/lib/utils";

const GROUPS: { title: string; items: { href: string; label: string; Icon: typeof Gauge }[] }[] = [
  { title: "General", items: [{ href: "/admin", label: "Overview", Icon: Gauge }, { href: "/admin/analytics", label: "Analytics", Icon: BarChart3 }] },
  {
    title: "Content",
    items: [
      { href: "/admin/courses", label: "Courses", Icon: BookOpen },
      { href: "/admin/articles", label: "Articles", Icon: FileText },
      { href: "/admin/problems", label: "Problems", Icon: Code2 },
      { href: "/admin/quizzes", label: "Quizzes", Icon: ListChecks },
      { href: "/admin/sheets", label: "DSA Sheets", Icon: LayoutList },
      { href: "/admin/roadmaps", label: "Roadmaps", Icon: Map },
      { href: "/admin/contests", label: "Contests", Icon: Trophy },
      { href: "/admin/media", label: "Media", Icon: ImageIcon },
    ],
  },
  {
    title: "Community",
    items: [
      { href: "/admin/review", label: "Review queue", Icon: ClipboardCheck },
      { href: "/admin/users", label: "Users", Icon: Users },
      { href: "/admin/moderation", label: "Moderation", Icon: ShieldAlert },
      { href: "/admin/announcements", label: "Announcements", Icon: Megaphone },
    ],
  },
  {
    title: "Platform",
    items: [
      { href: "/admin/settings", label: "Settings", Icon: Settings },
      { href: "/admin/audit", label: "Audit log", Icon: History },
    ],
  },
];

function Nav({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="space-y-5">
      {GROUPS.map((g) => (
        <div key={g.title}>
          {!collapsed ? <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{g.title}</p> : null}
          <ul className="space-y-0.5">
            {g.items.map(({ href, label, Icon }) => {
              const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    title={collapsed ? label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                      collapsed && "justify-center px-0",
                      active ? "bg-brand/15 font-medium text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className={cn(collapsed && "sr-only")}>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ user, children }: { user: SessionUser; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  return (
    <div className={cn("min-h-dvh lg:grid", collapsed ? "lg:grid-cols-[72px_1fr]" : "lg:grid-cols-[240px_1fr]")}>
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border bg-surface/60 p-3 lg:flex">
        <div className="flex items-center justify-between px-1 py-2">
          {collapsed ? <LogoMark /> : <Logo />}
        </div>
        <div className="mt-4 flex-1 overflow-y-auto" data-lenis-prevent>
          <Nav collapsed={collapsed} />
        </div>
        <Button variant="ghost" size="sm" className="mt-2 rounded-xl" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          <ChevronsLeft className={cn("transition-transform", collapsed && "rotate-180")} /> {collapsed ? null : "Collapse"}
        </Button>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl lg:hidden" aria-label="Open admin menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 overflow-y-auto p-4">
              <SheetHeader className="px-0">
                <SheetTitle>Admin</SheetTitle>
              </SheetHeader>
              <Nav collapsed={false} />
            </SheetContent>
          </Sheet>
          <form
            role="search"
            className="relative max-w-md flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) router.push(`/admin/search?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <label htmlFor="admin-search" className="sr-only">
              Search users, articles, problems, courses
            </label>
            <Input id="admin-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users, articles, problems…" className="h-9 rounded-xl pl-9" />
          </form>
          <div className="ml-auto flex items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="hidden rounded-xl md:inline-flex">
              <Link href="/">
                <Flag /> View site
              </Link>
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
