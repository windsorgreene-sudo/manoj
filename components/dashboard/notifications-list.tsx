"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, Bell, CheckCheck, MessageSquare, Megaphone, Trophy, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { listNotifications, markNotificationsRead } from "@/lib/actions/dashboard";
import { cn, timeAgo } from "@/lib/utils";

const ICON = { ACHIEVEMENT: Award, CONTEST: Trophy, COMMENT: MessageSquare, FOLLOW: UserPlus, ANNOUNCEMENT: Megaphone, SYSTEM: Bell, REVIEW: Bell } as const;

export function NotificationsList() {
  const qc = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["notifications-all"], queryFn: () => listNotifications(100) });
  const mark = async (ids?: string[]) => {
    await markNotificationsRead(ids);
    void qc.invalidateQueries({ queryKey: ["notifications-all"] });
    void qc.invalidateQueries({ queryKey: ["notifications"] });
  };
  if (isLoading) return <div className="space-y-2">{[0, 1, 2, 3].map((i) => <div key={i} className="shimmer h-16 rounded-2xl" />)}</div>;
  if (isError || !data) return <ErrorState onRetry={() => void refetch()} />;
  if (!data.items.length) return <EmptyState title="No notifications" description="We'll let you know about contests, replies and achievements." />;
  return (
    <div className="space-y-3">
      <Button variant="outline" size="sm" className="rounded-xl" disabled={!data.unread} onClick={() => mark()}><CheckCheck /> Mark all as read</Button>
      <ul className="glass divide-y divide-border">
        {data.items.map((n) => {
          const Icon = ICON[n.type as keyof typeof ICON] ?? Bell;
          return (
            <li key={n.id} className={cn("flex items-start gap-3 p-4", !n.read && "bg-brand/5")}>
              <Icon className="mt-0.5 size-5 shrink-0 text-cyan" aria-hidden />
              <div className="min-w-0 flex-1">
                {n.link ? <Link href={n.link} onClick={() => !n.read && mark([n.id])} className="font-medium hover:text-cyan">{n.title}</Link> : <p className="font-medium">{n.title}</p>}
                <p className="text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">{timeAgo(n.createdAt)}</p>
              </div>
              {!n.read ? <Button variant="ghost" size="xs" onClick={() => mark([n.id])}>Mark read</Button> : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
