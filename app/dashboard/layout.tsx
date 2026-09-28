import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireUser } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { TutorPanel } from "@/components/learn/tutor-panel";
import { CommandPalette } from "@/components/layout/command-palette";

export const metadata: Metadata = { title: { default: "Dashboard", template: "%s · Dashboard · CodeVerse" }, robots: { index: false } };

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser("STUDENT", "/dashboard");
  return (
    <DashboardShell user={user}>
      {children}
      <TutorPanel />
      <CommandPalette />
    </DashboardShell>
  );
}
