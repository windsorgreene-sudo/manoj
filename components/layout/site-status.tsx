"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Construction, Megaphone, X } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type Status = { banner: { id: string; title: string; body: string; link: string | null; variant: string } | null; maintenance: boolean };

/** Site-wide announcement banner, maintenance gate and first-party page-view tracking. */
export function SiteStatus() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data } = useQuery({ queryKey: ["site-status"], queryFn: async (): Promise<Status> => (await fetch("/api/site")).json() as Promise<Status>, staleTime: 60_000 });
  const [dismissed, setDismissed] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: pathname }), keepalive: true }).catch(() => undefined);
    }, 800);
    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setDismissed(window.localStorage.getItem("cv-banner-dismissed")));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "ADMIN";
  if (data?.maintenance && !isAdmin && !pathname.startsWith("/login")) {
    return (
      <div className="fixed inset-0 z-[150] grid place-items-center bg-background p-6 text-center" role="alertdialog" aria-labelledby="mt-title">
        <div className="max-w-md space-y-3">
          <Construction className="mx-auto size-12 text-warning" />
          <h2 id="mt-title" className="font-heading text-3xl font-bold">We&apos;re upgrading Kodshala</h2>
          <p className="text-muted-foreground">Scheduled maintenance is in progress. We&apos;ll be back shortly, thanks for your patience!</p>
          <Link href="/login" className="text-sm underline">Admin login</Link>
        </div>
      </div>
    );
  }
  const b = data?.banner;
  if (!b || dismissed === b.id) return null;
  return (
    <div role="region" aria-label="Announcement" data-site-banner className={cn("relative z-[55] flex items-center justify-center gap-2 px-10 py-2 text-center text-sm", b.variant === "warning" ? "bg-warning text-black" : b.variant === "success" ? "bg-success text-black" : "bg-gradient-to-r from-brand to-cyan text-white")}>
      <Megaphone className="size-4 shrink-0" aria-hidden />
      <span><strong>{b.title}</strong> <span className="hidden sm:inline"> · {b.body}</span></span>
      {b.link ? <Link href={b.link} className="inline-block px-1 py-1 font-semibold underline underline-offset-2">Open</Link> : null}
      <button type="button" aria-label="Dismiss announcement" className="absolute right-3 rounded p-1 hover:bg-black/10" onClick={() => { window.localStorage.setItem("cv-banner-dismissed", b.id); setDismissed(b.id); }}>
        <X className="size-4" />
      </button>
    </div>
  );
}
