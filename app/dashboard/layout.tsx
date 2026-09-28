import type { ReactNode } from "react";
import { requireUser } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireUser("STUDENT", "/dashboard");
  return <main id="main" className="min-h-dvh">{children}</main>;
}
