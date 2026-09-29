"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { listNotifications, markNotificationsRead } from "@/lib/actions/dashboard";
import { cn, timeAgo } from "@/lib/utils";

/** Notification bell: realtime via Pusher when configured, otherwise polls every 30s. */
export function NotificationBell() {
  const qc = useQueryClient();
  const hasPusher = Boolean(process.env.NEXT_PUBLIC_PUSHER_KEY);
  const { data } = useQuery({ queryKey: ["notifications"], queryFn: () => listNotifications(8), refetchInterval: hasPusher ? false : 30_000 });

  useEffect(() => {
    if (!hasPusher) return;
    let cleanup = () => {};
    void import("pusher-js").then(({ default: Pusher }) => {
      const p = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string });
      const ch = p.subscribe("notifications");
      ch.bind("new", () => void qc.invalidateQueries({ queryKey: ["notifications"] }));
      cleanup = () => p.disconnect();
    });
    return () => cleanup();
  }, [hasPusher, qc]);

  const markAll = async () => {
    await markNotificationsRead();
    void qc.invalidateQueries({ queryKey: ["notifications"] });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl" aria-label={`Notifications${data?.unread ? `, ${data.unread} unread` : ""}`}>
          <Bell />
          {data?.unread ? <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">{data.unread > 9 ? "9+" : data.unread}</span> : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 rounded-2xl p-0">
        <div className="flex items-center justify-between border-b border-border p-3">
          <p className="text-sm font-semibold">Notifications</p>
          <Button variant="ghost" size="xs" onClick={markAll} disabled={!data?.unread}>
            <CheckCheck /> Mark all read
          </Button>
        </div>
        <ul className="max-h-96 overflow-y-auto" data-lenis-prevent>
          {!data ? (
            <li className="p-4">
              <div className="shimmer h-10 rounded-lg" />
            </li>
          ) : data.items.length === 0 ? (
            <li className="p-6 text-center text-sm text-muted-foreground">You&apos;re all caught up</li>
          ) : (
            data.items.map((n) => (
              <li key={n.id} className={cn("border-b border-border/60 last:border-0", !n.read && "bg-brand/5")}>
                <Link href={n.link ?? "/dashboard/notifications"} className="block p-3 hover:bg-accent">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    {!n.read ? <span className="size-1.5 rounded-full bg-cyan" aria-label="Unread" /> : null}
                    {n.title}
                  </p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</p>
                </Link>
              </li>
            ))
          )}
        </ul>
        <Link href="/dashboard/notifications" className="block border-t border-border p-2 text-center text-xs text-muted-foreground hover:text-foreground">
          View all
        </Link>
      </PopoverContent>
    </Popover>
  );
}
