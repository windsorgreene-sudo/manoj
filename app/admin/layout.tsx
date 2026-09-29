import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireUser } from "@/lib/session";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin · Kodshala" }, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireUser("ADMIN", "/admin");
  return <AdminShell user={user}>{children}</AdminShell>;
}
