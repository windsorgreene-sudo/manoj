import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { AuthBackground } from "@/components/three/auth-background";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const perks = [
  "600+ in-depth tutorials with runnable code",
  "Browser IDE for C, C++, Java, Python, JS & Go",
  "Weekly rated contests with live leaderboards",
  "AI tutor that hints, never spoils",
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden border-r border-border bg-surface lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.35),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.25),transparent_55%)]" />
        <AuthBackground />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Logo />
          <div className="max-w-md space-y-6">
            <h2 className="font-heading text-4xl font-bold leading-tight">
              Pick up where you left off.
            </h2>
            <ul className="space-y-3">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 className="size-5 text-success" /> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
      <main id="main" className="relative flex flex-col">
        <div className="flex items-center justify-between p-4 lg:justify-end">
          <Logo className="lg:hidden" />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-16">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}
