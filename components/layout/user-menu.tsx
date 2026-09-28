"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Settings, Shield, User as UserIcon, PenLine } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import type { SessionUser } from "@/lib/session";

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UserMenu({ user }: { user: SessionUser }) {
  const router = useRouter();
  const logout = async () => {
    await authClient.signOut();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus-visible:ring-2 focus-visible:ring-cyan" aria-label="Open account menu">
        <Avatar className="size-9 ring-2 ring-brand/40">
          {user.image ? <AvatarImage src={user.image} alt="" /> : null}
          <AvatarFallback className="bg-brand/20 text-sm font-semibold">{initials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl">
        <DropdownMenuLabel>
          <div className="truncate font-semibold">{user.name}</div>
          <div className="truncate text-xs font-normal text-muted-foreground">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard /> Dashboard
          </Link>
        </DropdownMenuItem>
        {user.username ? (
          <DropdownMenuItem asChild>
            <Link href={`/u/${user.username}`}>
              <UserIcon /> Public profile
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <Settings /> Settings
          </Link>
        </DropdownMenuItem>
        {user.role !== "STUDENT" ? (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/articles">
              <PenLine /> My articles
            </Link>
          </DropdownMenuItem>
        ) : null}
        {user.role === "ADMIN" ? (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Shield /> Admin panel
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={logout}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
